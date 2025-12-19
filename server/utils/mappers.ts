import type { Expedition, Hero } from '~~/types'
import type { SupabaseExpeditionRow, SupabaseHeroRow } from '~~/types/supabase'

/**
 * Maps Supabase expedition (snake_case) to TypeScript Expedition type (camelCase)
 */
export function mapSupabaseExpeditionToExpedition(data: SupabaseExpeditionRow): Expedition {
  return {
    id: data.id,
    playerId: data.player_id,

    // Location
    zoneId: data.zone_id,
    subzoneId: data.subzone_id,

    // Party
    heroIds: data.hero_ids || [],
    teamPower: data.team_power || 0,

    // Timing
    startedAt: data.started_at,
    completesAt: data.completes_at,
    durationMinutes: data.duration_minutes || 0,
    status: data.status,

    // Events
    events: data.events || [],
    pendingChoices: data.pending_choices || [],

    // Settings
    autoRepeat: data.auto_repeat || false,
    autoRepeatLimit: data.auto_repeat_limit,
    stopConditions: data.stop_conditions || {
      anyHeroTired: false,
      inventoryFull: false,
      resourceCap: false
    },

    // Results (populated on completion)
    efficiency: data.efficiency,
    rewards: data.rewards,
    log: data.log,

    // Timestamps
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

/**
 * Maps Supabase hero (snake_case) to TypeScript Hero type (camelCase)
 */
export function mapSupabaseHeroToHero(data: SupabaseHeroRow): Hero {
  return {
    id: data.id,

    // Identity
    name: data.name,
    gender: data.gender,
    culture: data.culture,
    titles: data.titles || [],
    displayTitle: data.display_title,

    // Classification
    rarity: data.rarity,
    archetype: data.archetype,
    archetypeTags: data.archetype_tags || [],

    // Stats
    baseStats: data.base_stats || { combat: 0, utility: 0, survival: 0 },
    level: data.level || 1,
    xp: data.xp || 0,
    xpToNextLevel: data.xp_to_next_level || 100,

    // Traits
    gameplayTraits: data.gameplay_traits || [],
    storyTraitIds: data.story_trait_ids || [],

    // Calculated power
    power: data.power || 0,

    // Equipment
    equipment: data.equipment || {},

    // Prestige
    prestigeLevel: data.prestige_level || 0,
    prestigeBonuses: data.prestige_bonuses || { combat: 0, utility: 0, survival: 0 },

    // State
    currentExpeditionId: data.current_expedition_id,
    isFavorite: data.is_favorite || false,

    // Morale tracking
    morale: data.morale || 'content',
    moraleValue: data.morale_value ?? 100,
    moraleLastUpdate: data.morale_last_update || new Date().toISOString(),
    
    // Active status
    isOnExpedition: data.is_on_expedition || false,
    isStationed: data.is_stationed || false,
    stationedZoneId: data.stationed_zone_id,

    // Timestamps
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}
