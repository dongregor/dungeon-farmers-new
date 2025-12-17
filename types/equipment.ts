import type { EquipmentSlot, EquipmentRarity, Stats, TraitQuality, ZoneType } from './base'

// Equipment item
export interface Equipment {
  id: string
  playerId: string

  // Identity
  name: string
  description: string
  slot: EquipmentSlot
  rarity: EquipmentRarity

  // Stats
  baseStats: Stats
  itemLevel: number
  gearScore: number

  // Traits
  traits: EquipmentTrait[]
  maxTraits: number

  // Set
  setId?: string
  setName?: string

  // State
  isEquipped: boolean
  equippedBy?: string // Hero ID

  // Source tracking (for loot tables)
  sourceZoneId?: string
  sourceSubzoneId?: string

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Equipment trait
export interface EquipmentTrait {
  traitId: string
  quality: TraitQuality
  rolledValue: number
}

// Equipment set
export interface EquipmentSet {
  id: string
  name: string
  description: string
  pieces: string[]  // Equipment item IDs
  bonuses: SetBonus[]
  biome?: ZoneType
  sourceZone?: string
}

export interface SetBonus {
  requiredPieces: number  // 2, 4, or 6
  grantedTraits: SetBonusTrait[]
}

export interface SetBonusTrait {
  traitId: string
  quality: TraitQuality
  fixedValue: number  // Sets have fixed values
}

// Slot stat tendencies
export const SLOT_STAT_TENDENCIES = {
  weapon: { primary: 'combat', secondary: 'utility', rare: 'survival' },
  armor: { primary: 'survival', secondary: 'combat', rare: 'utility' },
  helmet: { primary: 'survival', secondary: 'utility', rare: 'combat' },
  boots: { primary: 'utility', secondary: 'survival', rare: 'combat' },
  accessory1: { primary: 'any', secondary: null, rare: null },
  accessory2: { primary: 'any', secondary: null, rare: null },
}

// Trait slots by rarity
export const TRAIT_SLOTS_BY_RARITY: Record<EquipmentRarity, { min: number; max: number; qualityWeights: Record<TraitQuality, number> }> = {
  common: { min: 0, max: 0, qualityWeights: { normal: 0, magic: 0, perfect: 0 } },
  uncommon: { min: 0, max: 1, qualityWeights: { normal: 1.0, magic: 0, perfect: 0 } },
  rare: { min: 1, max: 1, qualityWeights: { normal: 0.7, magic: 0.3, perfect: 0 } },
  epic: { min: 1, max: 2, qualityWeights: { normal: 0.4, magic: 0.5, perfect: 0.1 } },
  legendary: { min: 2, max: 2, qualityWeights: { normal: 0.2, magic: 0.6, perfect: 0.2 } },
  mythic: { min: 2, max: 3, qualityWeights: { normal: 0.1, magic: 0.4, perfect: 0.5 } },
}

// Gear score formula
export function calculateGearScore(equipment: Equipment): number {
  const rarityMultiplier = {
    common: 1.0,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2.0,
    legendary: 2.5,
    mythic: 3.0,
  }[equipment.rarity]

  const baseScore = equipment.itemLevel * rarityMultiplier
  const statScore = equipment.baseStats.combat + equipment.baseStats.utility + equipment.baseStats.survival
  const traitScore = equipment.traits.reduce((sum, t) => sum + t.rolledValue, 0)

  return Math.round(baseScore + statScore + traitScore)
}
