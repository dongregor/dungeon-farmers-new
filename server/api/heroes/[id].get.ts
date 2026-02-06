import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { mapSupabaseHeroToHero } from '~~/server/utils/mappers'
import type { Hero } from '~~/types'

export default defineEventHandler(async (event): Promise<Hero> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const heroId = getRouterParam(event, 'id')

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  if (!heroId) {
    throw createError({ statusCode: 400, message: 'Hero ID required' })
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

  // Get hero
  const { data: hero, error: heroError } = await client
    .from('heroes')
    .select('*')
    .eq('id', heroId)
    .eq('player_id', player.id)
    .single()

  if (heroError || !hero) {
    throw createError({ statusCode: 404, message: 'Hero not found' })
  }

  return mapSupabaseHeroToHero(hero)
})
