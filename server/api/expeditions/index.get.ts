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

  const supabase = await serverSupabaseClient(event)

  // Parse query params
  const query = getQuery(event)
  const status = query.status as 'active' | 'completed' | 'all' | undefined
  const limit = query.limit ? parseInt(query.limit as string) : 10

  try {
    // Fetch active expeditions
    let activeExpeditions: Expedition[] = []
    if (status === 'active' || status === 'all' || !status) {
      const { data, error } = await supabase
        .from('expeditions')
        .select('*')
        .eq('player_id', user.id)
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })

      if (error) throw error
      activeExpeditions = data || []
    }

    // Fetch completed expeditions
    let completedExpeditions: Expedition[] = []
    if (status === 'completed' || status === 'all' || !status) {
      const { data, error } = await supabase
        .from('expeditions')
        .select('*')
        .eq('player_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      completedExpeditions = data || []
    }

    return {
      active: activeExpeditions,
      completed: completedExpeditions
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch expeditions',
      data: { error: error.message }
    })
  }
})
