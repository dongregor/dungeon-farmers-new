import { requireAdmin } from '~~/server/utils/adminAuth'
import { mapSupabaseExpeditionToExpedition } from '~~/server/utils/mappers'

/**
 * GET /api/admin/expeditions
 * List recent expeditions across all guilds.
 * Supports query params: ?status=completed|active&limit=50
 */
export default defineEventHandler(async (event) => {
  const { supabase } = await requireAdmin(event)

  const query = getQuery(event)
  const status = query.status as string | undefined
  const limit = Math.min(Number(query.limit) || 50, 200)

  let dbQuery = supabase
    .from('expeditions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status === 'completed') {
    dbQuery = dbQuery.eq('is_completed', true)
  } else if (status === 'active') {
    dbQuery = dbQuery.eq('is_completed', false)
  }

  const { data: rawExpeditions, error: expError } = await dbQuery

  if (expError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch expeditions', data: { error: expError.message } })
  }

  const expeditions = (rawExpeditions || []).map(mapSupabaseExpeditionToExpedition)

  // Get player info for each unique player_id
  const playerIds = [...new Set(rawExpeditions?.map(e => e.player_id) || [])]

  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, username, guild_name')
    .in('id', playerIds)

  if (playersError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch players', data: { error: playersError.message } })
  }

  const playerMap: Record<string, { username: string; guildName: string }> = {}
  for (const p of players || []) {
    playerMap[p.id] = { username: p.username, guildName: p.guild_name }
  }

  const expeditionsWithPlayer = expeditions.map(exp => ({
    ...exp,
    playerUsername: playerMap[exp.playerId]?.username || 'Unknown',
    guildName: playerMap[exp.playerId]?.guildName || 'Unknown',
    hasDebugLog: !!(rawExpeditions?.find(r => r.id === exp.id) as any)?.debug_log,
  }))

  return { expeditions: expeditionsWithPlayer }
})
