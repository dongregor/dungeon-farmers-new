// Rarities
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type EquipmentRarity = Rarity | 'mythic'

// Stats (3-stat system)
export type StatType = 'combat' | 'utility' | 'survival'
export interface Stats {
  combat: number
  utility: number
  survival: number
}

// Archetypes
export type Archetype = 'tank' | 'healer' | 'debuffer' | 'melee_dps' | 'ranged_dps' | 'caster'

// Identity
export type Gender = 'male' | 'female' | 'nonbinary'
export type Culture = 'northfolk' | 'coastborn' | 'woodwalkers' | 'crownlanders'

// Traits
export type TraitQuality = 'normal' | 'magic' | 'perfect'

// Equipment
export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2'

// Zones
export type ZoneType = 'forest' | 'cave' | 'mountain' | 'swamp' | 'desert' | 'ruins'
export type ZoneDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'

// Morale
export type MoraleState = 'excited' | 'content' | 'tired' | 'frustrated' | 'exhausted'

// Constants
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1
}

export const STAT_POINTS_BY_RARITY: Record<Rarity, number> = {
  common: 12, uncommon: 14, rare: 16, epic: 18, legendary: 20
}

export const DIFFICULTY_MULTIPLIERS: Record<ZoneDifficulty, number> = {
  easy: 0.5, medium: 1.0, hard: 1.5, extreme: 2.0
}