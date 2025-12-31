import type { MonsterType, Element, ZoneType } from './base'

// Synergy tier determines visibility and power
export type SynergyTier = 'basic' | 'intermediate' | 'hidden'

// What the synergy affects
export type SynergyEffectType = 'loot_quality' | 'drop_rate' | 'power' | 'special_drop'

// Synergy trigger patterns
export type SynergyPattern =
  | 'type_threshold'      // 3+ same Type
  | 'element_matching'    // 3+ same Element
  | 'biome_harmony'       // All from same Biome
  | 'family_threshold'    // 3+ same Family
  | 'all_same_type'       // Every slot same Type
  | 'element_combo'       // Specific elements together
  | 'type_element'        // Type with specific element
  | 'opposites'           // Opposing elements
  | 'full_diversity'      // No Type duplicates

export interface SynergyRequirement {
  pattern: SynergyPattern
  // For threshold patterns
  monsterTypes?: MonsterType[]
  elements?: Element[]
  families?: string[]
  biomes?: ZoneType[]
  minCount?: number
  // For combo patterns
  requiredElements?: Element[]
  requiredTypes?: MonsterType[]
  // For diversity pattern
  allDifferentTypes?: boolean
}

export interface SynergyEffect {
  type: SynergyEffectType
  value: number                    // Percentage bonus (e.g., 10 = +10%)
  description: string
  targetLoot?: string              // For specific loot bonuses
}

export interface SynergyDefinition {
  id: string
  name: string
  description: string
  tier: SynergyTier
  requirement: SynergyRequirement
  effects: SynergyEffect[]
  // For hidden synergies
  hint?: string                    // Breadcrumb hint
}

export interface AppliedSynergy {
  synergyId: string
  synergy: SynergyDefinition
  contributingMonsterIds: string[]
  totalBonus: number
}

export interface SynergyCalculationResult {
  activeSynergies: AppliedSynergy[]
  totalLootBonus: number
  totalPowerBonus: number
  totalDropRateBonus: number
  cappedAt: number                 // The soft cap (60%)
  wasCapped: boolean
}

// Player's discovered synergies (for persistence)
export interface DiscoveredSynergy {
  synergyId: string
  discoveredAt: string
  discoveredInDungeonId?: string
  timesTriggered: number
}
