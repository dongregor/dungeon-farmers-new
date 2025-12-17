import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { TavernSlot } from '~~/types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const slotIndex = getRouterParam(event, 'index')

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const index = parseInt(slotIndex || '', 10)
  if (isNaN(index) || index < 0) {
    throw createError({ statusCode: 400, message: 'Valid slot index required' })
  }

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, account_level, is_supporter')
    .eq('auth_user_id', user.id)
    .single()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Calculate available lock slots
  const baseLockSlots = 1
  const accountLevelBonus = Math.floor(player.account_level / 10)
  const supporterBonus = player.is_supporter ? 2 : 0
  const maxLockSlots = baseLockSlots + accountLevelBonus + supporterBonus

  // Optimistic concurrency control - retry once on conflict
  let retryCount = 0
  const maxRetries = 1

  while (retryCount <= maxRetries) {
    // Get tavern state with version (updated_at)
    const { data: tavernState, error: fetchError } = await client
      .from('tavern_state')
      .select('*')
      .eq('player_id', player.id)
      .single()

    if (fetchError || !tavernState) {
      throw createError({ statusCode: 404, message: 'Tavern state not found' })
    }

    const slots = (tavernState.slots || []) as TavernSlot[]
    const slot = slots[index]

    if (!slot) {
      throw createError({ statusCode: 404, message: 'Slot not found' })
    }

    if (!slot.hero) {
      throw createError({ statusCode: 400, message: 'Cannot lock empty slot' })
    }

    if (slot.isLocked) {
      throw createError({ statusCode: 400, message: 'Slot is already locked' })
    }

    // Count currently locked slots
    const usedLockSlots = slots.filter(s => s.isLocked).length

    if (usedLockSlots >= maxLockSlots) {
      throw createError({
        statusCode: 400,
        message: `Maximum lock slots (${maxLockSlots}) already in use`,
      })
    }

    // Lock the slot
    const updatedSlots = [...slots]
    updatedSlots[index] = {
      ...slot,
      isLocked: true,
    }

    const now = new Date().toISOString()

    // Optimistic update - only succeeds if updated_at hasn't changed
    const { data: updateResult, error: updateError } = await client
      .from('tavern_state')
      .update({
        slots: updatedSlots,
        updated_at: now,
      })
      .eq('player_id', player.id)
      .eq('updated_at', tavernState.updated_at)  // Version check
      .select('updated_at')

    if (updateError) {
      console.error('Error locking slot:', updateError)
      throw createError({ statusCode: 500, message: 'Failed to lock slot' })
    }

    // Check if update affected any rows (optimistic lock succeeded)
    if (updateResult && updateResult.length > 0) {
      // Success
      return {
        success: true,
        slotIndex: index,
        usedLockSlots: usedLockSlots + 1,
        maxLockSlots,
      }
    }

    // No rows updated - concurrent modification detected
    retryCount++
    if (retryCount > maxRetries) {
      throw createError({
        statusCode: 409,
        message: 'Tavern state was modified by another request. Please try again.',
      })
    }
    // Retry loop will fetch fresh state
  }

  // Should never reach here
  throw createError({ statusCode: 500, message: 'Unexpected error in lock operation' })
})
