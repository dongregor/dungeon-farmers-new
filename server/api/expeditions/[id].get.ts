import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
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

  try {
    // Fetch expedition
    const { data: expedition, error: expeditionError } = await supabase
      .from('expeditions')
      .select('*')
      .eq('id', expeditionId)
      .eq('player_id', user.id)
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
      .eq('player_id', user.id)

    if (heroesError) throw heroesError

    // Fetch log if expedition is completed
    let log: ExpeditionLog | undefined
    if (expedition.status === 'completed' && expedition.log) {
      log = expedition.log as ExpeditionLog
    }

    return {
      expedition: expedition as Expedition,
      log,
      heroes: (heroes || []) as Hero[]
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
