import { requireAdmin } from '~~/server/utils/adminAuth'
import { mapSupabaseHeroToHero, mapSupabaseExpeditionToExpedition } from '~~/server/utils/mappers'

/**
 * GET /api/admin/guilds/:playerId
 * Detailed view of a single guild: player info, full roster, all expeditions.
 */
export default defineEventHandler(async (event) => {
  const { supabase } = await requireAdmin(event)
  const playerId = getRouterParam(event, 'playerId')

  if (!playerId) {
    throw createError({ statusCode: 400, statusMessage: 'Player ID required' })
  }

  // Fetch player
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, statusMessage: 'Player not found' })
  }

  // Fetch guild master
  const { data: guildMaster, error: gmError } = await supabase
    .from('guild_masters')
    .select('*')
    .eq('player_id', playerId)
    .single()

  // Fetch all heroes
  const { data: rawHeroes, error: heroesError } = await supabase
    .from('heroes')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })

  if (heroesError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch heroes', data: { error: heroesError.message } })
  }

  const heroes = (rawHeroes || []).map(mapSupabaseHeroToHero)

  // Fetch all expeditions (recent 50)
  const { data: rawExpeditions, error: expeditionsError } = await supabase
    .from('expeditions')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (expeditionsError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch expeditions', data: { error: expeditionsError.message } })
  }

  const expeditions = (rawExpeditions || []).map(mapSupabaseExpeditionToExpedition)

  // Fetch equipment
  const { data: equipment, error: equipError } = await supabase
    .from('equipment')
    .select('*')
    .eq('player_id', playerId)

  if (equipError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch equipment', data: { error: equipError.message } })
  }

  return {
    player: {
      id: player.id,
      username: player.username,
      email: player.email,
      guildName: player.guild_name,
      guildTabard: player.guild_tabard,
      guildLevel: player.guild_level,
      gold: player.gold,
      gems: player.gems,
      isSupporter: player.is_supporter,
      isAdmin: player.is_admin,
      createdAt: player.created_at,
      updatedAt: player.updated_at,
    },
    guildMaster: guildMaster ? {
      id: guildMaster.id,
      name: guildMaster.name,
      level: guildMaster.level,
      archetype: guildMaster.archetype,
      rarity: guildMaster.rarity,
    } : null,
    heroes,
    expeditions,
    equipmentCount: equipment?.length || 0,
  }
})
