import { requireAdmin } from '~~/server/utils/adminAuth'

/**
 * GET /api/admin/guilds
 * List all guilds (players with guild data) for admin panel.
 * Returns guild name, player info, hero count, expedition count.
 */
export default defineEventHandler(async (event) => {
  const { supabase } = await requireAdmin(event)

  // Fetch all players with guild data
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, auth_user_id, username, email, guild_name, guild_tabard, guild_level, gold, gems, is_supporter, is_admin, created_at, updated_at')
    .not('guild_name', 'is', null)
    .order('created_at', { ascending: false })

  if (playersError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch guilds', data: { error: playersError.message } })
  }

  if (!players || players.length === 0) {
    return { guilds: [] }
  }

  const playerIds = players.map(p => p.id)

  // Fetch hero counts per player
  const { data: heroCounts, error: heroCountError } = await supabase
    .from('heroes')
    .select('player_id')
    .in('player_id', playerIds)

  if (heroCountError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch hero counts', data: { error: heroCountError.message } })
  }

  // Fetch expedition counts per player
  const { data: expeditionCounts, error: expCountError } = await supabase
    .from('expeditions')
    .select('player_id, is_completed')
    .in('player_id', playerIds)

  if (expCountError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch expedition counts', data: { error: expCountError.message } })
  }

  // Aggregate counts
  const heroCountMap: Record<string, number> = {}
  for (const h of heroCounts ?? []) {
    heroCountMap[h.player_id] = (heroCountMap[h.player_id] || 0) + 1
  }

  const expCountMap: Record<string, { total: number; active: number; completed: number }> = {}
  for (const e of expeditionCounts ?? []) {
    if (!expCountMap[e.player_id]) {
      expCountMap[e.player_id] = { total: 0, active: 0, completed: 0 }
    }
    expCountMap[e.player_id].total++
    if (e.is_completed) {
      expCountMap[e.player_id].completed++
    } else {
      expCountMap[e.player_id].active++
    }
  }

  const guilds = players.map(p => ({
    playerId: p.id,
    username: p.username,
    email: p.email,
    guildName: p.guild_name,
    guildTabard: p.guild_tabard,
    guildLevel: p.guild_level,
    gold: p.gold,
    gems: p.gems,
    isSupporter: p.is_supporter,
    isAdmin: p.is_admin,
    heroCount: heroCountMap[p.id] || 0,
    expeditions: expCountMap[p.id] || { total: 0, active: 0, completed: 0 },
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }))

  return { guilds }
})
