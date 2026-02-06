import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { mapSupabaseHeroToHero, mapSupabaseExpeditionToExpedition } from '~~/server/utils/mappers'
import type { Expedition, ExpeditionLog, Hero } from '~~/types'

export default defineEventHandler(async (event) => {
  // Auth check
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const supabase = await serverSupabaseClient(event)
  const expeditionId = getRouterParam(event, 'id')

  if (!expeditionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Expedition ID required'
    })
  }

  // Get auth user ID
  const authUserId = user.id || (user as any).sub
  if (!authUserId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User ID not found'
    })
  }

  // Get player by auth user ID
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', authUserId)
    .single()

  if (playerError || !player) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Player not found'
    })
  }

  const playerId = player.id

  try {
    // Fetch expedition
    const { data: expedition, error: expeditionError } = await supabase
      .from('expeditions')
      .select('*')
      .eq('id', expeditionId)
      .eq('player_id', playerId)
      .single()

    if (expeditionError || !expedition) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Expedition not found'
      })
    }

    // Fetch heroes in the party
    const { data: heroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', expedition.hero_ids)
      .eq('player_id', playerId)

    if (heroesError) throw heroesError

    // Fetch log if expedition is completed
    let log: ExpeditionLog | undefined
    if (expedition.is_completed && expedition.log) {
      log = expedition.log as ExpeditionLog
    }

    return {
      expedition: mapSupabaseExpeditionToExpedition(expedition),
      log,
      heroes: (heroes || []).map(mapSupabaseHeroToHero)
    }
  } catch (err: unknown) {
    const error = toError(err)
    if (error.statusCode) throw err

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch expedition',
      data: { error: error.message }
    })
  }
})
