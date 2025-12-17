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
  const { data: player } = await client
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get tavern state
  const { data: tavernState } = await client
    .from('tavern_state')
    .select('*')
    .eq('player_id', player.id)
    .single()

  if (!tavernState) {
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

  const { error: updateError } = await client
    .from('tavern_state')
    .update({
      slots: updatedSlots,
      updated_at: new Date().toISOString(),
    })
    .eq('player_id', player.id)

  if (updateError) {
    console.error('Error unlocking slot:', updateError)
    throw createError({ statusCode: 500, message: 'Failed to unlock slot' })
  }

  // Count remaining locked slots
  const usedLockSlots = updatedSlots.filter(s => s.isLocked).length

  return {
    success: true,
    slotIndex: index,
    usedLockSlots,
  }
})
