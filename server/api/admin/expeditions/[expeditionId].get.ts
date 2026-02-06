import { requireAdmin } from '~~/server/utils/adminAuth'
import { mapSupabaseHeroToHero, mapSupabaseExpeditionToExpedition } from '~~/server/utils/mappers'
import type { ExpeditionDebugLog } from '~~/types'

/**
 * GET /api/admin/expeditions/:expeditionId
 * Detailed expedition view with full debug log, hero data, and narrative log.
 */
export default defineEventHandler(async (event) => {
  const { supabase } = await requireAdmin(event)
  const expeditionId = getRouterParam(event, 'expeditionId')

  if (!expeditionId) {
    throw createError({ statusCode: 400, statusMessage: 'Expedition ID required' })
  }

  // Fetch expedition (including debug_log)
  const { data: rawExpedition, error: expeditionError } = await supabase
    .from('expeditions')
    .select('*')
    .eq('id', expeditionId)
    .single()

  if (expeditionError || !rawExpedition) {
    throw createError({ statusCode: 404, statusMessage: 'Expedition not found' })
  }

  const expedition = mapSupabaseExpeditionToExpedition(rawExpedition)
  const debugLog: ExpeditionDebugLog | null = (rawExpedition as any).debug_log ?? null

  // Fetch heroes who participated
  const { data: rawHeroes, error: heroesError } = await supabase
    .from('heroes')
    .select('*')
    .in('id', rawExpedition.hero_ids || [])

  if (heroesError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch heroes' })
  }

  const heroes = (rawHeroes || []).map(mapSupabaseHeroToHero)

  // Fetch player info
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, username, guild_name')
    .eq('id', rawExpedition.player_id)
    .single()

  return {
    expedition,
    debugLog,
    heroes,
    player: player ? {
      id: player.id,
      username: player.username,
      guildName: player.guild_name,
    } : null,
  }
})
