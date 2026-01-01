import type { LogRarity } from '~~/types/expedition'
import type { EquipmentRarity } from '~~/types/base'

const RARITY_ORDER: LogRarity[] = [
  'common',
  'standard',
  'noteworthy',
  'memorable',
  'epic',
  'legendary'
]

const LOOT_RARITY_BOOST: Record<EquipmentRarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 0,
  epic: 1,
  legendary: 2,
  mythic: 3
}

/**
 * Boost a rarity by a specified number of tiers
 */
export function boostRarity(baseRarity: LogRarity, boost: number): LogRarity {
  const currentIndex = RARITY_ORDER.indexOf(baseRarity)
  const newIndex = Math.min(currentIndex + boost, RARITY_ORDER.length - 1)
  return RARITY_ORDER[Math.max(0, newIndex)]
}

/**
 * Get the index of a rarity tier
 */
export function getRarityIndex(rarity: LogRarity): number {
  return RARITY_ORDER.indexOf(rarity)
}

export interface RarityContext {
  reactionBoosts: number
  lootRarity?: EquipmentRarity
  isDiscovery?: boolean
  isStoryHook?: boolean
  isBossKill?: boolean
}

/**
 * Calculate final rarity based on all factors
 */
export function calculateFinalRarity(
  baseRarity: LogRarity,
  context: RarityContext
): LogRarity {
  let totalBoost = context.reactionBoosts

  // Loot rarity boost
  if (context.lootRarity) {
    totalBoost += LOOT_RARITY_BOOST[context.lootRarity]
  }

  // Discovery boost
  if (context.isDiscovery) {
    totalBoost += 2
  }

  // Story hook boost
  if (context.isStoryHook) {
    totalBoost += 2
  }

  // Boss kill boost
  if (context.isBossKill) {
    totalBoost += 2
  }

  return boostRarity(baseRarity, totalBoost)
}

/**
 * Check if a rarity is at least "noteworthy" (highlight-worthy)
 */
export function isHighlight(rarity: LogRarity): boolean {
  return getRarityIndex(rarity) >= getRarityIndex('noteworthy')
}

/**
 * Get CSS class for a rarity
 */
export function getRarityClass(rarity: LogRarity): string {
  const classes: Record<LogRarity, string> = {
    common: 'text-gray-500',
    standard: 'text-gray-200',
    noteworthy: 'text-green-400',
    memorable: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400'
  }
  return classes[rarity]
}
