import type { Rarity, MonsterType, Element, ZoneType } from './base'

// Affix categories
export type AffixCategory =
  | 'power'
  | 'efficiency'
  | 'xp'
  | 'loot'
  | 'amplifier'
  | 'monster_specific'
  | 'trade_off'
  | 'hero_synergy'
  | 'wildcard'

// Themed slot types
export type ThemedSlotType = 'element' | 'monster_type' | 'family'

export interface ThemedSlot {
  type: ThemedSlotType
  value: string                    // e.g., 'fire', 'demon', 'Wolf'
  bonusPercent: number             // e.g., 20 for +20%
  bonusType: 'power' | 'loot' | 'xp'
}

export interface SlotDefinition {
  id: string
  position: number
  allowedTypes: MonsterType[] | 'any'
  requiredElements?: Element[]
  themed?: ThemedSlot
}

export interface AffixEffect {
  type: string                     // e.g., 'power_bonus', 'duration_reduction'
  value: number
  condition?: string               // For conditional affixes
}

export interface TradeOffEffect {
  bonus: AffixEffect
  penalty: AffixEffect
}

export interface SchematicAffix {
  id: string
  category: AffixCategory
  name: string
  description: string
  effect: AffixEffect | TradeOffEffect
  // For amplifier affixes
  amplifies?: {
    synergyType?: 'element' | 'type' | 'family'
    synergyValue?: string          // e.g., 'fire', 'beast'
    multiplier: number             // e.g., 1.5 for 1.5x
  }
  // For hero synergy affixes
  heroTagRequired?: string
}

export interface SchematicDefinition {
  id: string
  name: string
  description: string
  rarity: Rarity
  theme: string
  biome?: ZoneType
  slots: SlotDefinition[]
  affixes: SchematicAffix[]
  baseDuration: number             // Minutes
  baseRewards: {
    goldMin: number
    goldMax: number
    xpMin: number
    xpMax: number
  }
}

// Player's collected schematic instance
export interface CollectedSchematic {
  id: string
  playerId: string
  schematicId: string
  schematic: SchematicDefinition
  collectedAt: string
  sourceZoneId?: string
}

// Slot count ranges by rarity
export const SCHEMATIC_SLOT_COUNTS: Record<Rarity, { min: number; max: number }> = {
  common: { min: 3, max: 4 },
  uncommon: { min: 4, max: 5 },
  rare: { min: 5, max: 6 },
  epic: { min: 7, max: 8 },
  legendary: { min: 9, max: 10 }
}

// Themed slot counts by rarity
export const SCHEMATIC_THEMED_SLOTS: Record<Rarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 1,
  epic: 2,
  legendary: 3
}

// Affix counts by rarity
export const SCHEMATIC_AFFIX_COUNTS: Record<Rarity, { min: number; max: number }> = {
  common: { min: 0, max: 0 },
  uncommon: { min: 1, max: 1 },
  rare: { min: 1, max: 1 },
  epic: { min: 1, max: 2 },
  legendary: { min: 2, max: 2 }
}
