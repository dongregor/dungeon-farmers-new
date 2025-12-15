import type { TraitQuality, StatType, ZoneType } from './base'

// === GAMEPLAY TRAITS ===

// Effect types for gameplay traits
export type GameplayTraitEffect =
  | 'stat_bonus'        // Flat stat increase
  | 'conditional_bonus' // Bonus in specific conditions
  | 'loot_bonus'        // Better loot drops
  | 'expedition_bonus'  // Expedition speed/rewards
  | 'trade_off'         // Positive and negative effects

// Gameplay trait definition
export interface GameplayTrait {
  id: string
  name: string
  description: string // Uses {value} placeholder for rolled value
  effect: GameplayTraitEffect
  isNegative: boolean

  // Value range (for rolling)
  minValue: number
  maxValue: number

  // Effect details
  statBonus?: {
    stat: StatType
    isPercent: boolean
  }
  conditionalBonus?: {
    condition: 'zone_type' | 'expedition_length' | 'enemy_type' | 'party_size'
    conditionValue: string // e.g., 'cave', 'long', 'dragon', 'solo'
    stat?: StatType
    allStats?: boolean
  }
  lootBonus?: {
    type: 'gold' | 'rare_drops' | 'materials' | 'xp'
  }
  expeditionBonus?: {
    type: 'speed' | 'event_chance' | 'efficiency'
  }
  tradeOff?: {
    positiveStat: StatType
    negativeStat: StatType
    negativeRatio: number // How much negative compared to positive
  }

  // Story reactions (optional - for expedition logs)
  reactions?: {
    onCombat?: string[]
    onLoot?: string[]
    onEvent?: string[]
  }
}

// Rolled gameplay trait on a hero
export interface HeroGameplayTrait {
  traitId: string
  quality: TraitQuality
  rolledValue: number // Actual value within range based on quality
}

// === NEGATIVE TRAITS ===

export type NegativeSeverity = 'mild' | 'moderate' | 'severe'

export interface NegativeTrait extends GameplayTrait {
  severity: NegativeSeverity
  // Can be removed/reduced
  canOvercome: boolean
  overcomeCost?: {
    type: 'gold' | 'expeditions' | 'healer'
    amount: number
  }
}

// Severity multipliers for negative effects
export const NEGATIVE_SEVERITY_MULTIPLIERS: Record<NegativeSeverity, number> = {
  mild: 0.5,
  moderate: 1.0,
  severe: 1.5,
}

// === STORY TRAITS ===

export interface StoryTrait {
  id: string
  name: string
  description: string

  // How this trait was acquired
  source: 'generation' | 'expedition' | 'event' | 'milestone' | 'curse'

  // Reactions for expedition logs
  reactions: {
    onCombat?: string[]
    onLoot?: string[]
    onEvent?: string[]
    onZoneType?: Partial<Record<ZoneType, string[]>>
    onPartyMember?: string[] // Reactions to other heroes
  }

  // Can grant a title
  grantsTitle?: string
}

// === TRAIT COUNTS ===

import type { Rarity } from './base'

// Gameplay trait counts by rarity
export const GAMEPLAY_TRAIT_COUNT: Record<Rarity, { min: number; max: number; cap: number }> = {
  common: { min: 1, max: 2, cap: 3 },
  uncommon: { min: 2, max: 2, cap: 4 },
  rare: { min: 2, max: 3, cap: 5 },
  epic: { min: 3, max: 3, cap: 6 },
  legendary: { min: 3, max: 4, cap: 7 },
}

// Story trait starting counts
export const STORY_TRAIT_STARTING_COUNT = { min: 2, max: 5 }
