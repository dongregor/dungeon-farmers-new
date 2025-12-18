/**
 * Supabase database row types
 * These represent the snake_case database schema
 */

export interface SupabaseExpeditionRow {
  id: string
  player_id: string
  zone_id: string
  subzone_id: string
  hero_ids: string[]
  team_power: number
  status: string
  started_at: string
  completes_at: string
  duration_minutes?: number
  duration?: number
  auto_repeat: boolean
  auto_repeat_limit?: number
  stop_conditions: {
    anyHeroTired: boolean
    inventoryFull: boolean
    resourceCap: boolean
  }
  events: unknown[]
  pending_choices: unknown[]
  efficiency?: number
  rewards?: unknown
  log?: unknown
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
