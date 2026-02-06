import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { mapSupabaseHeroToHero } from '~~/server/utils/mappers'
import type { Hero } from '~~/types'

export default defineEventHandler(async (event): Promise<Hero[]> => {
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
    .select('id')
    .eq('auth_user_id', userId)
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

  return (heroes || []).map(mapSupabaseHeroToHero)
})
