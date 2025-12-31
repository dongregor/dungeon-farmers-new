import type { Monster } from './monsters'
import type { SchematicDefinition } from './schematics'
import type { AppliedSynergy, SynergyCalculationResult } from './synergies'

export type DungeonStatus = 'draft' | 'active' | 'inactive'

export interface PlacedMonster {
  slotId: string
  monsterId: string                // Reference to captured monster
  monster: Monster                 // Denormalized for convenience
}

export interface DungeonDefinition {
  id: string
  playerId: string
  schematicId: string
  schematic: SchematicDefinition
  name: string
  status: DungeonStatus
  monsters: PlacedMonster[]
  // Calculated values (cached)
  power: number
  synergies: AppliedSynergy[]
  synergyResult: SynergyCalculationResult
  // Metadata
  tags: string[]
  createdAt: string
  updatedAt: string
  activatedAt?: string
  lastRunAt?: string
}

export interface DungeonValidation {
  valid: boolean
  errors: DungeonValidationError[]
  warnings: string[]
}

export interface DungeonValidationError {
  slotId?: string
  code: 'missing_monster' | 'wrong_type' | 'wrong_element' | 'duplicate_monster'
  message: string
}

export interface DungeonPreview {
  power: number
  synergies: AppliedSynergy[]
  synergyResult: SynergyCalculationResult
  estimatedLoot: {
    itemId: string
    dropChance: number
    source: string
  }[]
  efficiency: number               // 0-100 quality score
}

// Active dungeon slot limits
export const DUNGEON_SLOT_LIMITS = {
  free: 5,
  supporter: 10,
  draft: 10,                       // Max drafts for everyone
  inactive: Infinity               // No limit on inactive
}
