import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { Guild, GuildMaster, Gender, Archetype, Tabard } from '~~/types'
import { z } from 'zod'
import { generateHero } from '~~/shared/utils/heroGenerator'

const tabardSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  pattern: z.enum(['solid', 'divided', 'quartered', 'striped', 'diagonal', 'bordered']),
  emblem: z.string(),
})

const initializeSchema = z.object({
  name: z.string().min(2).max(30), // Guild name
  gender: z.enum(['male', 'female', 'nonbinary']), // Guild master character gender
  tabard: tabardSchema.optional(),
})

interface InitializeResponse {
  guild: Guild
  guildMaster: GuildMaster
}

export default defineEventHandler(async (event): Promise<InitializeResponse> => {
  const serviceClient = serverSupabaseServiceRole(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  // Parse and validate body
  const body = await readBody(event)
  const parseResult = initializeSchema.safeParse(body)

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
      data: parseResult.error.flatten(),
    })
  }

  const { name, gender, tabard } = parseResult.data

  // Default tabard if not provided
  const defaultTabard: Tabard = {
    primaryColor: '#6366f1',
    secondaryColor: '#fbbf24',
    pattern: 'solid',
    emblem: 'sword',
  }

  const finalTabard = tabard || defaultTabard

  // Get or create player record (use service role to bypass RLS for bootstrap)
  let playerId: string

  const { data: existingPlayer } = await serviceClient
    .from('players')
    .select('id, guild_name')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (existingPlayer) {
    // Check if guild already exists
    if (existingPlayer.guild_name) {
      throw createError({ statusCode: 409, message: 'Guild already exists' })
    }
    playerId = existingPlayer.id
  } else {
    // Create player record for new user (service role bypasses RLS)
    const { data: newPlayer, error: playerError } = await serviceClient
      .from('players')
      .insert({
        auth_user_id: userId,
        username: user.email?.split('@')[0] || `player_${Date.now()}`,
        email: user.email || `${userId}@unknown.com`,
        gold: 1000,
        gems: 0,
        is_supporter: false,
        account_level: 1,
      })
      .select('id')
      .single()

    if (playerError || !newPlayer) {
      console.error('Failed to create player:', playerError)
      throw createError({ statusCode: 500, message: 'Failed to create player record' })
    }
    playerId = newPlayer.id
  }

  // Check if guild master character already exists
  const { data: existingGM } = await serviceClient
    .from('guild_masters')
    .select('id')
    .eq('player_id', playerId)
    .maybeSingle()

  if (existingGM) {
    throw createError({ statusCode: 409, message: 'Guild master already exists' })
  }

  // Generate a legendary hero to use as base stats for the guild master
  const baseHero = generateHero({ forceRarity: 'legendary' })

  // 1. Update player with guild data (name, tabard)
  const { data: updatedPlayer, error: playerUpdateError } = await serviceClient
    .from('players')
    .update({
      guild_name: name,
      guild_tabard: finalTabard,
      guild_level: 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', playerId)
    .select('id, guild_name, guild_tabard, guild_level, created_at, updated_at')
    .single()

  if (playerUpdateError || !updatedPlayer) {
    console.error('Failed to update player with guild data:', playerUpdateError)
    throw createError({ statusCode: 500, message: 'Failed to create guild' })
  }

  // 2. Create guild master character record
  // Note: guild_masters uses player_id (not auth_user_id) - lookup via players table
  const { data: guildMasterData, error: gmError } = await serviceClient
    .from('guild_masters')
    .insert({
      player_id: playerId,
      name: 'Guild Master', // Character name, not guild name
      gender,
      culture: baseHero.culture,
      titles: [],
      display_title: null,
      rarity: 'legendary',
      archetype: baseHero.archetype,
      archetype_tags: baseHero.archetypeTags,
      base_stats: baseHero.baseStats,
      level: 1,
      xp: 0,
      xp_to_next_level: baseHero.xpToNextLevel,
      power: baseHero.power,
      gameplay_traits: baseHero.gameplayTraits,
      story_trait_ids: baseHero.storyTraitIds,
    })
    .select()
    .single()

  if (gmError || !guildMasterData) {
    console.error('Failed to create guild master:', gmError)
    throw createError({ statusCode: 500, message: 'Failed to create guild master' })
  }

  // Transform to response types
  const guild: Guild = {
    id: updatedPlayer.id,
    name: updatedPlayer.guild_name,
    tabard: updatedPlayer.guild_tabard || finalTabard,
    level: updatedPlayer.guild_level || 1,
    createdAt: updatedPlayer.created_at,
    updatedAt: updatedPlayer.updated_at,
  }

  const guildMaster: GuildMaster = {
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
  }

  return {
    guild,
    guildMaster,
  }
})
