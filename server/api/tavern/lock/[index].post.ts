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
    .select('id, account_level, is_supporter')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Calculate available lock slots
  const baseLockSlots = 1
  const accountLevelBonus = Math.floor(player.account_level / 10)
  const supporterBonus = player.is_supporter ? 2 : 0
  const maxLockSlots = baseLockSlots + accountLevelBonus + supporterBonus

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

  const { error: updateError } = await client
    .from('tavern_state')
    .update({
      slots: updatedSlots,
      updated_at: new Date().toISOString(),
    })
    .eq('player_id', player.id)

  if (updateError) {
    console.error('Error locking slot:', updateError)
    throw createError({ statusCode: 500, message: 'Failed to lock slot' })
  }

  return {
    success: true,
    slotIndex: index,
    usedLockSlots: usedLockSlots + 1,
    maxLockSlots,
  }
})
