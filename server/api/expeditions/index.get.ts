import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Expedition } from '~~/types'

export default defineEventHandler(async (event) => {
  // Auth check
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  const supabase = await serverSupabaseClient(event)

  // Get player
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', userId)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Parse query params
  const query = getQuery(event)
  const status = query.status as 'active' | 'completed' | 'all' | undefined
  const limit = query.limit ? parseInt(query.limit as string) : 10

  try {
    // Fetch active expeditions (is_completed = false)
    let activeExpeditions: Expedition[] = []
    if (status === 'active' || status === 'all' || !status) {
      const { data, error } = await supabase
        .from('expeditions')
        .select('*')
        .eq('player_id', player.id)
        .eq('is_completed', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      activeExpeditions = data || []
    }

    // Fetch completed expeditions (is_completed = true)
    let completedExpeditions: Expedition[] = []
    if (status === 'completed' || status === 'all' || !status) {
      const { data, error } = await supabase
        .from('expeditions')
        .select('*')
        .eq('player_id', player.id)
        .eq('is_completed', true)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      completedExpeditions = data || []
    }

    return {
      active: activeExpeditions,
      completed: completedExpeditions
    }
  } catch (err: unknown) {
    const error = toError(err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch expeditions',
      data: { error: error.message }
    })
  }
})
