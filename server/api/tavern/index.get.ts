import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { TavernSlot, TavernState } from '~~/types'

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
  const { data: tavernState, error: tavernError } = await client
    .from('tavern_state')
    .select('*')
    .eq('player_id', player.id)
    .single()

  if (tavernError || !tavernState) {
    throw createError({ statusCode: 404, message: 'Tavern state not found' })
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

  // Return tavern state
  const response: TavernState = {
    slots: tavernState.slots || [],
    lockSlots,
    usedLockSlots,
    lastRefreshAt: tavernState.last_refresh_at,
    nextRefreshAt: tavernState.next_refresh_at,
  }

  return response
})
