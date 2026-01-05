import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { TavernSlot } from '~~/types'
import { indexParamSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const slotIndex = getRouterParam(event, 'index')

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  const parseResult = indexParamSchema.safeParse(slotIndex)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: parseResult.error.errors[0]?.message || 'Valid slot index required'
    })
  }

  const index = parseResult.data

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id')
    .eq('auth_user_id', userId)
    .single()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

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

    if (!slot.isLocked) {
      throw createError({ statusCode: 400, message: 'Slot is not locked' })
    }

    // Unlock the slot
    const updatedSlots = [...slots]
    updatedSlots[index] = {
      ...slot,
      isLocked: false,
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
      console.error('Error unlocking slot:', updateError)
      throw createError({ statusCode: 500, message: 'Failed to unlock slot' })
    }

    // Check if update affected any rows (optimistic lock succeeded)
    if (updateResult && updateResult.length > 0) {
      // Success - count remaining locked slots
      const usedLockSlots = updatedSlots.filter(s => s.isLocked).length

      return {
        success: true,
        slotIndex: index,
        usedLockSlots,
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
  throw createError({ statusCode: 500, message: 'Unexpected error in unlock operation' })
})
