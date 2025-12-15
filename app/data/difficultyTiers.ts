export interface DifficultyTier {
  tier: number
  name: string
  powerRequirement: number
  enemyMultiplier: number
  lootMultiplier: number
  itemLevelBonus: number
  description: string
  unlocks?: string[]
}

export const DIFFICULTY_TIERS: Record<number, DifficultyTier> = {
  1: {
    tier: 1,
    name: 'Novice',
    powerRequirement: 0,
    enemyMultiplier: 1.0,
    lootMultiplier: 1.0,
    itemLevelBonus: 0,
    description: 'Recommended for new heroes. Standard difficulty.',
  },
  2: {
    tier: 2,
    name: 'Adventurer',
    powerRequirement: 100,
    enemyMultiplier: 1.3,
    lootMultiplier: 1.15,
    itemLevelBonus: 3,
    description: 'Slightly tougher enemies with better rewards.',
  },
  3: {
    tier: 3,
    name: 'Veteran',
    powerRequirement: 200,
    enemyMultiplier: 1.6,
    lootMultiplier: 1.3,
    itemLevelBonus: 6,
    description: 'Challenging battles for experienced heroes.',
  },
  4: {
    tier: 4,
    name: 'Elite',
    powerRequirement: 350,
    enemyMultiplier: 2.0,
    lootMultiplier: 1.5,
    itemLevelBonus: 10,
    description: 'Formidable foes with excellent rewards.',
    unlocks: [
      'Rare subzone variants',
      'Increased uncommon monster spawns',
    ],
  },
  5: {
    tier: 5,
    name: 'Champion',
    powerRequirement: 500,
    enemyMultiplier: 2.5,
    lootMultiplier: 1.75,
    itemLevelBonus: 15,
    description: 'Only the strongest heroes should venture here.',
  },
  6: {
    tier: 6,
    name: 'Heroic',
    powerRequirement: 700,
    enemyMultiplier: 3.0,
    lootMultiplier: 2.0,
    itemLevelBonus: 20,
    description: 'Legendary challenges await.',
    unlocks: [
      'Hidden subzones',
      'Rare monster spawns',
      'Exclusive collectibles',
    ],
  },
  7: {
    tier: 7,
    name: 'Legendary',
    powerRequirement: 900,
    enemyMultiplier: 3.5,
    lootMultiplier: 2.25,
    itemLevelBonus: 25,
    description: 'Few heroes can survive these battles.',
  },
  8: {
    tier: 8,
    name: 'Mythic',
    powerRequirement: 1100,
    enemyMultiplier: 4.0,
    lootMultiplier: 2.5,
    itemLevelBonus: 30,
    description: 'The realm of legends.',
    unlocks: [
      'Secret bosses',
      'Legendary monster variants',
      'Mythic gear drops',
    ],
  },
  9: {
    tier: 9,
    name: 'Ascended',
    powerRequirement: 1300,
    enemyMultiplier: 4.5,
    lootMultiplier: 2.75,
    itemLevelBonus: 35,
    description: 'Beyond mortal comprehension.',
  },
  10: {
    tier: 10,
    name: 'Transcendent',
    powerRequirement: 1500,
    enemyMultiplier: 5.0,
    lootMultiplier: 3.0,
    itemLevelBonus: 40,
    description: 'The ultimate test of strength.',
    unlocks: [
      'Ultimate challenges',
      'Cosmetic rewards',
      'Prestigious titles',
    ],
  },
}

// Get difficulty tier by tier number
export function getDifficultyTier(tier: number): DifficultyTier | undefined {
  return DIFFICULTY_TIERS[tier]
}

// Get all difficulty tiers as array, sorted by tier
export function getAllDifficultyTiers(): DifficultyTier[] {
  return Object.values(DIFFICULTY_TIERS).sort((a, b) => a.tier - b.tier)
}

// Get tier name by tier number
export function getDifficultyTierName(tier: number): string {
  return DIFFICULTY_TIERS[tier]?.name ?? 'Unknown'
}

// Maximum tier number
export const MAX_DIFFICULTY_TIER = 10

// Minimum tier number
export const MIN_DIFFICULTY_TIER = 1
