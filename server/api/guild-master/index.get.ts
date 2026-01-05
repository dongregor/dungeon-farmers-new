import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Guild, GuildMaster, Gender, Archetype, Tabard } from '~~/types'

interface GuildDataResponse {
  guild: Guild | null
  guildMaster: GuildMaster | null
  availableTraits: Array<{
    traitId: string
    name: string
    description: string
    tags: string[]
    effectDescription: string
  }>
}

const defaultTabard: Tabard = {
  primaryColor: '#6366f1',
  secondaryColor: '#fbbf24',
  pattern: 'solid',
  emblem: 'sword',
}

export default defineEventHandler(async (event): Promise<GuildDataResponse> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  // Get player with guild data
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, guild_name, guild_tabard, guild_level, created_at, updated_at')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

  // No player = no guild
  if (!player) {
    return {
      guild: null,
      guildMaster: null,
      availableTraits: [],
    }
  }

  // Get guild master character data
  const { data: guildMasterData, error: gmError } = await client
    .from('guild_masters')
    .select('*')
    .eq('player_id', player.id)
    .maybeSingle()

  if (gmError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch guild master' })
  }

  // Transform to Guild type (from players table)
  const guild: Guild | null = player.guild_name ? {
    id: player.id, // Use player ID as guild ID (1:1 relationship)
    name: player.guild_name,
    tabard: player.guild_tabard || defaultTabard,
    level: player.guild_level || 1,
    createdAt: player.created_at,
    updatedAt: player.updated_at,
  } : null

  // Transform to GuildMaster type (character data only)
  const guildMaster: GuildMaster | null = guildMasterData ? {
    id: guildMasterData.id,
    gender: guildMasterData.gender as Gender,
    rarity: 'legendary',
    archetype: guildMasterData.archetype as Archetype,
    archetypeTags: guildMasterData.archetype_tags || [],
    baseStats: guildMasterData.base_stats || { combat: 10, utility: 10, survival: 10 },
    level: guildMasterData.level || 1,
    equippedTraitIds: [],
    maxEquippedTraits: 2,
    unlockedTraitIds: [],
    leaderBonus: 5,
    mentorBonus: 10,
    createdAt: guildMasterData.created_at,
    updatedAt: guildMasterData.updated_at,
  } : null

  // Available traits would come from a traits table or be defined here
  const availableTraits: GuildDataResponse['availableTraits'] = []

  return {
    guild,
    guildMaster,
    availableTraits,
  }
})
