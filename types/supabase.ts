/**
 * Supabase database row types
 * These represent the snake_case database schema
 */

export interface SupabaseExpeditionRow {
  id: string
  player_id: string
  type: string  // 'zone', 'story', 'dungeon'
  zone_id: string
  subzone_id: string
  hero_ids: string[]
  difficulty: string  // 'easy', 'medium', 'hard', 'extreme'
  started_at: string
  completes_at: string
  duration_minutes: number
  is_completed: boolean
  efficiency?: number
  rewards?: unknown  // { gold, xp, equipment, familiarityGain, masteryGain }
  events?: unknown[]  // Array of expedition events
  log?: unknown  // ExpeditionLog object
  debug_log?: unknown  // ExpeditionDebugLog object (admin)
  created_at: string
  updated_at: string
}

export interface SupabaseHeroRow {
  id: string
  name: string
  gender: string
  culture: string
  titles: string[]
  display_title: string | null
  rarity: string
  archetype: string
  archetype_tags: string[]
  base_stats: {
    combat: number
    utility: number
    survival: number
  }
  level: number
  xp: number
  xp_to_next_level: number
  gameplay_traits: unknown[]
  story_trait_ids: string[]
  power: number
  equipment: Record<string, string>
  prestige_level: number
  prestige_bonuses: {
    combat: number
    utility: number
    survival: number
  }
  visual_traits?: {
    skinTone: number
    hairColor: number
    hairStyle: number
    primaryColor: number
    secondaryColor: number
    faceShape: number
  } | null
  current_expedition_id: string | null
  is_favorite: boolean
  morale: string
  morale_value: number
  morale_last_update: string
  is_on_expedition: boolean
  is_stationed: boolean
  stationed_zone_id: string | null
  created_at: string
  updated_at: string
}

export interface SupabaseTabard {
  primaryColor: string
  secondaryColor: string
  pattern: 'solid' | 'divided' | 'quartered' | 'striped' | 'diagonal' | 'bordered'
  emblem: string
}

export interface SupabaseGuildMasterRow {
  id: string
  player_id: string
  name: string
  gender: string
  culture: string
  titles: string[]
  display_title: string | null
  rarity: string
  archetype: string
  archetype_tags: string[]
  base_stats: {
    combat: number
    utility: number
    survival: number
  }
  level: number
  xp: number
  xp_to_next_level: number
  gameplay_traits: unknown[]
  story_trait_ids: string[]
  power: number
  equipment: Record<string, string>
  prestige_level: number
  prestige_bonuses: {
    combat: number
    utility: number
    survival: number
  }
  is_favorite: boolean
  morale: string
  morale_last_update: string
  created_at: string
  updated_at: string
}
