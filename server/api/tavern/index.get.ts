import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { generateTavernHero } from '~~/shared/utils/heroGenerator'
import {
  TAVERN_PROGRESSION,
  TAVERN_REFRESH_HOURS,
  calculateRefreshCost,
} from '~~/types/recruitment'
import type { TavernSlot, TavernState, SlotRarity } from '~~/types'

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

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, account_level, is_supporter')
    .eq('auth_user_id', userId)
    .single()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get tavern state
  let { data: tavernState, error: tavernError } = await client
    .from('tavern_state')
    .select('*')
    .eq('player_id', player.id)
    .single()

  // If no tavern state exists, create one for new players
  if (tavernError || !tavernState) {
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

    // Generate initial slots with heroes
    const now = new Date()
    const nextRefresh = new Date(now.getTime() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000)

    const initialSlots: TavernSlot[] = tavernConfig.slots.map((slotConfig, index) => {
      const hero = generateTavernHero(slotConfig.rarity as SlotRarity)
      return {
        index,
        hero,
        rarity: slotConfig.rarity as SlotRarity,
        isLocked: false,
      }
    })

    // Insert new tavern state
    const { data: newTavernState, error: insertError } = await client
      .from('tavern_state')
      .insert({
        player_id: player.id,
        slots: initialSlots,
        last_refresh_at: now.toISOString(),
        next_refresh_at: nextRefresh.toISOString(),
      })
      .select('*')
      .single()

    if (insertError || !newTavernState) {
      console.error('Failed to create tavern state:', insertError)
      throw createError({ statusCode: 500, message: 'Failed to initialize tavern' })
    }

    tavernState = newTavernState
  }

  // Check if auto-refresh is needed (8+ hours since next_refresh_at)
  const now = new Date()
  const nextRefreshTime = new Date(tavernState.next_refresh_at)

  if (now >= nextRefreshTime) {
    // Auto-refresh: generate new heroes for unlocked slots
    const accountLevel = player.account_level
    let tavernConfig = TAVERN_PROGRESSION[1]

    const levels = Object.keys(TAVERN_PROGRESSION)
      .map(Number)
      .sort((a, b) => b - a)

    for (const level of levels) {
      if (accountLevel >= level) {
        tavernConfig = TAVERN_PROGRESSION[level as keyof typeof TAVERN_PROGRESSION]
        break
      }
    }

    const currentSlots = (tavernState.slots || []) as TavernSlot[]
    const newSlots: TavernSlot[] = tavernConfig.slots.map((slotConfig, index) => {
      const currentSlot = currentSlots[index]

      // Preserve locked slots
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

    const newNextRefresh = new Date(now.getTime() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000)

    // Update tavern state with auto-refresh (reset paid counter)
    const { data: updatedState, error: updateError } = await client
      .from('tavern_state')
      .update({
        slots: newSlots,
        last_refresh_at: now.toISOString(),
        next_refresh_at: newNextRefresh.toISOString(),
        paid_refreshes_since_free: 0,  // Reset on free refresh
        updated_at: now.toISOString(),
      })
      .eq('player_id', player.id)
      .select('*')
      .single()

    if (!updateError && updatedState) {
      tavernState = updatedState
    }
  }

  // Calculate lock slots based on account level and supporter status
  const baseLockSlots = 1
  const accountLevelBonus = Math.floor(player.account_level / 10)
  const supporterBonus = player.is_supporter ? 2 : 0
  const lockSlots = baseLockSlots + accountLevelBonus + supporterBonus

  // Calculate used lock slots and ensure consistency
  const usedLockSlots = tavernState.slots?.filter((slot: TavernSlot) => slot.isLocked).length || 0

  // Log or handle case where usedLockSlots exceeds available lockSlots
  // This can happen if supporter status was removed or level decreased
  if (usedLockSlots > lockSlots) {
    console.warn(`Player ${player.id} has ${usedLockSlots} locked slots but only ${lockSlots} available`)
    // Optionally: auto-unlock excess slots or handle in UI
  }

  // Calculate next refresh cost
  const paidRefreshesSinceFree = tavernState.paid_refreshes_since_free || 0
  const nextRefreshCost = calculateRefreshCost(paidRefreshesSinceFree)

  // Return tavern state
  const response: TavernState = {
    slots: tavernState.slots || [],
    lockSlots,
    usedLockSlots,
    lastRefreshAt: tavernState.last_refresh_at,
    nextRefreshAt: tavernState.next_refresh_at,
    paidRefreshesSinceFree,
    nextRefreshCost,
  }

  return response
})
