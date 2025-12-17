import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const heroId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!heroId) {
    throw createError({ statusCode: 400, message: 'Hero ID required' })
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

  // Verify hero belongs to player
  const { data: hero } = await client
    .from('heroes')
    .select('id')
    .eq('id', heroId)
    .eq('player_id', player.id)
    .single()

  if (!hero) {
    throw createError({ statusCode: 404, message: 'Hero not found' })
  }

  // Define allowed fields for direct updates
  const allowedFields = [
    'display_title',
    'equipment',
    'is_favorite',
    'stationed_zone_id',
  ]

  // Filter body to only include allowed fields
  const updates: Record<string, any> = {}
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: 'No valid fields to update' })
  }

  // Add updated_at timestamp
  updates.updated_at = new Date().toISOString()

  // Update hero
  const { data: updatedHero, error: updateError } = await client
    .from('heroes')
    .update(updates)
    .eq('id', heroId)
    .select()
    .single()

  if (updateError) {
    console.error('Error updating hero:', updateError)
    throw createError({ statusCode: 500, message: 'Failed to update hero' })
  }

  return updatedHero
})
