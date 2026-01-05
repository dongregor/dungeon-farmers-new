import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Equipment } from '~~/types'

export default defineEventHandler(async (event): Promise<{ equipment: Equipment[] }> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const query = getQuery(event)

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
    .select('id')
    .eq('auth_user_id', userId)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Build equipment query
  let equipmentQuery = client
    .from('equipment')
    .select('*')
    .eq('player_id', player.id)

  // Filter by equipped status if provided
  if (query.equipped !== undefined) {
    const isEquipped = query.equipped === 'true' || query.equipped === true
    equipmentQuery = equipmentQuery.eq('is_equipped', isEquipped)
  }

  // Filter by hero ID if provided
  if (query.heroId) {
    equipmentQuery = equipmentQuery.eq('equipped_by', query.heroId)
  }

  // Get equipment
  const { data: equipment, error: equipmentError } = await equipmentQuery

  if (equipmentError) {
    console.error('Error fetching equipment:', equipmentError)
    throw createError({ statusCode: 500, message: 'Failed to fetch equipment' })
  }

  return { equipment: equipment || [] }
})
