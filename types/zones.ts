import type { ZoneType, ZoneDifficulty } from './base'

export interface Zone {
  id: string
  name: string
  description: string
  type: ZoneType

  // Unlock
  unlockRequirement: {
    minPower?: number
    previousZoneId?: string
    questComplete?: string
  }

  // Content
  subzones: Subzone[]

  // Rewards for mastery
  masteryRewards: {
    title?: string
    passiveIncomeBonus: number
  }

  // Progress
  familiarity: number
  isUnlocked: boolean
  isMastered: boolean
}

// Zone Familiarity Benefits
export const ZONE_FAMILIARITY_BENEFITS = {
  25: { unlockSubzone: 2, passiveIncome: 5 },
  50: { unlockSubzone: 3, passiveIncome: 10, rareEvents: true },
  75: { unlockSubzone: 4, passiveIncome: 15 },
  100: { mastered: true, passiveIncome: 20, title: true },
}

// Subzone Mastery Benefits
export const SUBZONE_MASTERY_BENEFITS = {
  33: { improvedLoot: true },
  66: { rareSpawnChance: 10 },
  100: { mastered: true, collectibleCompletion: true },
}

export interface Subzone {
  id: string
  name: string
  description: string

  // Discovery
  discoveryWeight: number
  requiredZoneFamiliarity: number
  isDiscovered: boolean

  // Content
  difficulty: ZoneDifficulty
  threats: string[]
  monsters: MonsterSpawn[]
  collectibles: Collectible[]
  lootTable: LootTableEntry[]

  // Rewards
  bonusXpPercent: number
  bonusGoldPercent: number
  baseDuration: number // minutes
  baseGold: number
  baseXp: number

  // Progress
  mastery: number
}

export interface MonsterSpawn {
  monsterId: string
  spawnType: 'common' | 'uncommon' | 'rare' | 'boss'
  baseSpawnChance: number
  requiredMastery: number
  baseCaptureChance: number
  threatContribution: string[]
  power: number
}

export interface LootTableEntry {
  itemId: string
  itemType: 'equipment' | 'material' | 'collectible'
  weight: number
  minTier?: number  // Difficulty tier requirement
  maxTier?: number
}

export interface Collectible {
  id: string
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare'
  type: 'trophy' | 'material' | 'both'
  craftingUse?: string
  dropChance: number
  requiresMastery: number
}
