import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { generateTavernHero } from '~/utils/heroGenerator'
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

  // Get player with gold
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, account_level, gold')
    .eq('auth_user_id', user.id)
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
  const nextRefreshTime = new Date(tavernState.next_refresh_at)
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

  // Update tavern state in database
  const { error: updateError } = await client
    .from('tavern_state')
    .update({
      slots: newSlots,
      last_refresh_at: now.toISOString(),
      next_refresh_at: nextRefresh.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('player_id', player.id)

  if (updateError) {
    console.error('Error updating tavern state:', updateError)
    throw createError({ statusCode: 500, message: 'Failed to refresh tavern' })
  }

  // Deduct gold if this was a paid refresh (atomic conditional update)
  let remainingGold = player.gold
  if (!isFreeRefresh) {
    const { data: updatedPlayer, error: goldError } = await client
      .from('players')
      .update({ gold: player.gold - refreshCost })
      .eq('id', player.id)
      .gte('gold', refreshCost)  // Conditional: only update if gold >= cost
      .select('gold')
      .single()

    // Check if update succeeded
    if (goldError || !updatedPlayer) {
      console.error('Error deducting refresh cost (insufficient funds or race condition):', goldError)
      // Note: Tavern already refreshed, but payment failed
      // This is acceptable UX - they got the refresh but should retry payment
      throw createError({
        statusCode: 400,
        message: 'Insufficient gold for early refresh (concurrent purchase may have occurred)',
      })
    }

    remainingGold = updatedPlayer.gold
  }

  return {
    slots: newSlots,
    nextRefresh: nextRefresh.toISOString(),
    wasPaidRefresh: !isFreeRefresh,
    costPaid: isFreeRefresh ? 0 : refreshCost,
    remainingGold,
  }
})
