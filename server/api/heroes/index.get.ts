import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Hero } from '~~/types'

export default defineEventHandler(async (event): Promise<Hero[]> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get all heroes for this player
  const { data: heroes, error: heroesError } = await client
    .from('heroes')
    .select('*')
    .eq('player_id', player.id)
    .order('created_at', { ascending: false })

  if (heroesError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch heroes' })
  }

  return heroes || []
})
