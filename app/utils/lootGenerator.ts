import type { Equipment } from '~~/types'
import { generateEquipment } from './equipmentGenerator'
import {
  getLootTableForTier,
  rollLootDrop,
  calculateItemLevel,
  getMasteryDropBonus,
} from '~/data/lootTables'

/**
 * Generate loot for an expedition completion
 *
 * @param playerId - Player ID
 * @param zoneId - Zone ID
 * @param subzoneId - Subzone ID
 * @param zoneDifficulty - Zone difficulty (easy/medium/hard/extreme)
 * @param tier - Difficulty tier (1-10)
 * @param mastery - Subzone mastery (0-100)
 * @param dropCount - Number of items to roll
 * @returns Array of generated equipment
 */
export function generateExpeditionLoot(params: {
  playerId: string
  zoneId: string
  subzoneId: string
  zoneDifficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  tier?: number
  mastery?: number
  dropCount?: number
}): Equipment[] {
  const {
    playerId,
    zoneId,
    subzoneId,
    zoneDifficulty,
    tier = 1,
    mastery = 0,
    dropCount = 1,
  } = params

  const loot: Equipment[] = []
  const lootTable = getLootTableForTier(zoneId, subzoneId, tier)
  const itemLevel = calculateItemLevel(zoneDifficulty, tier)
  const masteryBonus = getMasteryDropBonus(mastery)

  // Apply mastery bonus to drop count (rounds down)
  const effectiveDropCount = Math.floor(dropCount * masteryBonus)

  for (let i = 0; i < effectiveDropCount; i++) {
    const drop = rollLootDrop(lootTable)
    if (!drop) continue

    const equipment = generateEquipment({
      playerId,
      slot: drop.slot,
      rarity: drop.rarity,
      itemLevel,
      sourceZoneId: zoneId,
      sourceSubzoneId: subzoneId,
    })

    loot.push(equipment)
  }

  return loot
}

/**
 * Generate guaranteed loot for first-time completion
 */
export function generateFirstClearReward(params: {
  playerId: string
  zoneId: string
  subzoneId: string
  zoneDifficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  tier?: number
}): Equipment {
  const { playerId, zoneId, subzoneId, zoneDifficulty, tier = 1 } = params
  const lootTable = getLootTableForTier(zoneId, subzoneId, tier)
  const itemLevel = calculateItemLevel(zoneDifficulty, tier)

  // Force a drop with higher rarity for first clear
  const drop = rollLootDrop(lootTable)

  // Upgrade rarity for first clear reward
  const upgradedRarity = upgradeRarity(drop?.rarity || 'common')

  return generateEquipment({
    playerId,
    slot: drop?.slot || 'weapon',
    rarity: upgradedRarity,
    itemLevel,
    sourceZoneId: zoneId,
    sourceSubzoneId: subzoneId,
  })
}

/**
 * Upgrade rarity by one tier (for special rewards)
 */
function upgradeRarity(rarity: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' {
  const rarityOrder: Array<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'> = [
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary',
    'mythic',
  ]

  const currentIndex = rarityOrder.indexOf(rarity as any)
  if (currentIndex === -1 || currentIndex === rarityOrder.length - 1) {
    return rarity as any
  }

  return rarityOrder[currentIndex + 1]
}

/**
 * Calculate expected loot quality for a zone/tier (for UI preview)
 */
export function calculateExpectedLootQuality(params: {
  zoneId: string
  subzoneId: string
  zoneDifficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  tier?: number
  mastery?: number
}): {
  averageItemLevel: number
  commonChance: number
  uncommonChance: number
  rareChance: number
  epicChance: number
  legendaryChance: number
  mythicChance: number
  masteryBonus: number
} {
  const { zoneId, subzoneId, zoneDifficulty, tier = 1, mastery = 0 } = params

  const lootTable = getLootTableForTier(zoneId, subzoneId, tier)
  const itemLevel = calculateItemLevel(zoneDifficulty, tier)
  const masteryBonus = getMasteryDropBonus(mastery)

  // Calculate rarity distribution
  const rarityCounts: Record<string, number> = {}
  let totalWeight = 0

  for (const entry of lootTable) {
    rarityCounts[entry.rarity] = (rarityCounts[entry.rarity] || 0) + entry.weight
    totalWeight += entry.weight
  }

  return {
    averageItemLevel: itemLevel,
    commonChance: ((rarityCounts.common || 0) / totalWeight) * 100,
    uncommonChance: ((rarityCounts.uncommon || 0) / totalWeight) * 100,
    rareChance: ((rarityCounts.rare || 0) / totalWeight) * 100,
    epicChance: ((rarityCounts.epic || 0) / totalWeight) * 100,
    legendaryChance: ((rarityCounts.legendary || 0) / totalWeight) * 100,
    mythicChance: ((rarityCounts.mythic || 0) / totalWeight) * 100,
    masteryBonus: (masteryBonus - 1) * 100, // Convert to percentage
  }
}
