import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { Hero, Rarity } from '~~/types'
import { z } from 'zod'
import { generateHero } from '~~/shared/utils/heroGenerator'

const generateSchema = z.object({
  forceRarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).optional(),
  replaceHeroId: z.string().uuid().optional(), // If provided, delete this hero first
})

export default defineEventHandler(async (event): Promise<Hero> => {
  const serviceClient = serverSupabaseServiceRole(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  // Parse body
  const body = await readBody(event)
  const parseResult = generateSchema.safeParse(body || {})

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
      data: parseResult.error.flatten(),
    })
  }

  const { forceRarity, replaceHeroId } = parseResult.data

  // Get or create player record
  let playerId: string

  const { data: existingPlayer } = await serviceClient
    .from('players')
    .select('id')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (existingPlayer) {
    playerId = existingPlayer.id
  } else {
    // Create player record for new user
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

  // If replacing an existing hero, delete it first
  if (replaceHeroId) {
    const { error: deleteError } = await serviceClient
      .from('heroes')
      .delete()
      .eq('id', replaceHeroId)
      .eq('player_id', playerId) // Ensure hero belongs to this player

    if (deleteError) {
      console.warn('Failed to delete hero for replacement:', deleteError)
      // Continue anyway - we'll just create a new one
    }
  }

  // Generate hero data
  const heroData = generateHero({ forceRarity: forceRarity as Rarity })

  // Save to database
  const { data: hero, error: heroError } = await serviceClient
    .from('heroes')
    .insert({
      player_id: playerId,
      name: heroData.name,
      gender: heroData.gender,
      culture: heroData.culture,
      titles: heroData.titles || [],
      display_title: heroData.displayTitle || null,
      rarity: heroData.rarity,
      archetype: heroData.archetype,
      archetype_tags: heroData.archetypeTags,
      base_stats: heroData.baseStats,
      level: heroData.level,
      xp: heroData.xp,
      xp_to_next_level: heroData.xpToNextLevel,
      gameplay_traits: heroData.gameplayTraits,
      story_trait_ids: heroData.storyTraitIds,
      power: heroData.power,
      equipment: heroData.equipment || {},
      prestige_level: heroData.prestigeLevel || 0,
      prestige_bonuses: heroData.prestigeBonuses || { combat: 0, utility: 0, survival: 0 },
      is_favorite: false,
      morale: 'content',
      morale_last_update: new Date().toISOString(),
      is_on_expedition: false,
      is_stationed: false,
      stationed_zone_id: null,
      current_expedition_id: null,
    })
    .select()
    .single()

  if (heroError || !hero) {
    console.error('Failed to create hero:', heroError)
    throw createError({ statusCode: 500, message: 'Failed to generate hero' })
  }

  // Transform to Hero type
  return {
    id: hero.id,
    name: hero.name,
    gender: hero.gender,
    culture: hero.culture,
    titles: hero.titles || [],
    displayTitle: hero.display_title,
    rarity: hero.rarity,
    archetype: hero.archetype,
    archetypeTags: hero.archetype_tags || [],
    baseStats: hero.base_stats,
    level: hero.level,
    xp: hero.xp,
    xpToNextLevel: hero.xp_to_next_level,
    gameplayTraits: hero.gameplay_traits || [],
    storyTraitIds: hero.story_trait_ids || [],
    power: hero.power,
    equipment: hero.equipment || {},
    prestigeLevel: hero.prestige_level,
    prestigeBonuses: hero.prestige_bonuses || { combat: 0, utility: 0, survival: 0 },
    currentExpeditionId: hero.current_expedition_id,
    isFavorite: hero.is_favorite,
    morale: hero.morale,
    moraleValue: 75,
    moraleLastUpdate: hero.morale_last_update,
    isOnExpedition: hero.is_on_expedition,
    isStationed: hero.is_stationed,
    stationedZoneId: hero.stationed_zone_id,
    createdAt: hero.created_at,
    updatedAt: hero.updated_at,
  }
})
