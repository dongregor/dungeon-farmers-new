import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { generateTavernHero } from '~~/shared/utils/heroGenerator'
import {
  TAVERN_PROGRESSION,
  TAVERN_REFRESH_HOURS,
  TAVERN_MANUAL_REFRESH_BASE_COST
} from '~~/types/recruitment'
import type { TavernSlot, SlotRarity } from '~~/types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  // Get player with gold
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, account_level, gold')
    .eq('auth_user_id', userId)
    .single()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get current tavern state
  const { data: tavernState } = await client
    .from('tavern_state')
    .select('*')
    .eq('player_id', player.id)
    .single()

  if (!tavernState) {
    throw createError({ statusCode: 404, message: 'Tavern state not found' })
  }

  // Check if refresh is free (timer expired) or requires payment
  const now = new Date()
  const nextRefreshTime = new Date(tavernState.nextRefreshAt)
  const isFreeRefresh = now >= nextRefreshTime

  // TODO: Implement daily refresh counter for scaling cost (75g + 25g per refresh today)
  const refreshCost = TAVERN_MANUAL_REFRESH_BASE_COST

  // If not a free refresh, require payment
  if (!isFreeRefresh) {
    // Early check for better UX
    if (player.gold < refreshCost) {
      throw createError({
        statusCode: 400,
        message: `Not enough gold for early refresh. Need ${refreshCost}, have ${player.gold}`,
      })
    }
  }

  // Get tavern configuration based on account level
  const accountLevel = player.account_level
  let tavernConfig = TAVERN_PROGRESSION[1] // Default to level 1

  // Find the highest unlocked tier
  const levels = Object.keys(TAVERN_PROGRESSION)
    .map(Number)
    .sort((a, b) => b - a)

  for (const level of levels) {
    if (accountLevel >= level) {
      tavernConfig = TAVERN_PROGRESSION[level as keyof typeof TAVERN_PROGRESSION]
      break
    }
  }

  // Generate new slots, preserving locked ones
  const currentSlots = (tavernState.slots || []) as TavernSlot[]
  const newSlots: TavernSlot[] = tavernConfig.slots.map((slotConfig, index) => {
    const currentSlot = currentSlots[index]

    // If slot is locked, preserve it
    if (currentSlot?.isLocked) {
      return currentSlot
    }

    // Generate new hero for this slot
    const hero = generateTavernHero(slotConfig.rarity as SlotRarity)

    return {
      index,
      hero,
      rarity: slotConfig.rarity as SlotRarity,
      isLocked: false,
    }
  })

  // Calculate next refresh time
  const nextRefresh = new Date(now.getTime() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000)

  // STEP 1: Deduct gold FIRST if this is a paid refresh (prevents free refresh exploit)
  let remainingGold = player.gold
  if (!isFreeRefresh) {
    const { data: updatedPlayer, error: goldError } = await client
      .from('players')
      .update({ gold: player.gold - refreshCost })
      .eq('id', player.id)
      .gte('gold', refreshCost)  // Conditional: only update if gold >= cost
      .select('gold')
      .single()

    // Check if gold deduction succeeded
    if (goldError || !updatedPlayer) {
      console.error('Error deducting refresh cost (insufficient funds or race condition):', goldError)
      throw createError({
        statusCode: 400,
        message: 'Insufficient gold for early refresh (concurrent purchase may have occurred)',
      })
    }

    remainingGold = updatedPlayer.gold
  }

  // STEP 2: Update tavern state AFTER payment (with optimistic concurrency control)
  const { data: updateResult, error: updateError } = await client
    .from('tavern_state')
    .update({
      slots: newSlots,
      last_refresh_at: now.toISOString(),
      next_refresh_at: nextRefresh.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('player_id', player.id)
    .eq('updated_at', tavernState.updated_at)  // Version check
    .select('updated_at')

  if (updateError) {
    console.error('Error updating tavern state:', updateError)
    // Rollback gold deduction if we charged
    if (!isFreeRefresh) {
      await client
        .from('players')
        .update({ gold: player.gold })
        .eq('id', player.id)
    }
    throw createError({ statusCode: 500, message: 'Failed to refresh tavern' })
  }

  // Check if update affected any rows (optimistic lock succeeded)
  if (!updateResult || updateResult.length === 0) {
    // Rollback gold deduction if we charged
    if (!isFreeRefresh) {
      await client
        .from('players')
        .update({ gold: player.gold })
        .eq('id', player.id)
    }
    throw createError({
      statusCode: 409,
      message: 'Tavern state was modified by another request. Please try again.',
    })
  }

  return {
    slots: newSlots,
    nextRefresh: nextRefresh.toISOString(),
    wasPaidRefresh: !isFreeRefresh,
    costPaid: isFreeRefresh ? 0 : refreshCost,
    remainingGold,
  }
})
