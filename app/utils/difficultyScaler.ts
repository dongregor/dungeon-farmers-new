import type { Hero } from '~~/types'
import { DIFFICULTY_TIERS, getDifficultyTier, getAllDifficultyTiers, MAX_DIFFICULTY_TIER, MIN_DIFFICULTY_TIER } from '~/data/difficultyTiers'

/**
 * Get the highest difficulty tier a hero/party can access based on power
 */
export function getMaxAccessibleTier(teamPower: number): number {
  const tiers = getAllDifficultyTiers()

  // Find the highest tier where power requirement is met
  let maxTier = MIN_DIFFICULTY_TIER

  for (const tier of tiers) {
    if (teamPower >= tier.powerRequirement) {
      maxTier = tier.tier
    } else {
      break // Tiers are sorted, so we can stop here
    }
  }

  return maxTier
}

/**
 * Get all tiers accessible to a hero/party
 */
export function getAccessibleTiers(teamPower: number): number[] {
  const maxTier = getMaxAccessibleTier(teamPower)
  const tiers: number[] = []

  for (let tier = MIN_DIFFICULTY_TIER; tier <= maxTier; tier++) {
    tiers.push(tier)
  }

  return tiers
}

/**
 * Check if a hero/party can access a specific tier
 */
export function canAccessTier(teamPower: number, tier: number): boolean {
  const tierData = getDifficultyTier(tier)
  if (!tierData) return false

  return teamPower >= tierData.powerRequirement
}

/**
 * Get the recommended tier for a given team power
 * Returns a tier where the party has a reasonable chance
 */
export function getRecommendedTier(teamPower: number): number {
  const maxTier = getMaxAccessibleTier(teamPower)

  // Recommend the tier just below max for a balanced challenge
  // Unless they're at tier 1-2, then recommend max
  if (maxTier <= 2) {
    return maxTier
  }

  return Math.max(MIN_DIFFICULTY_TIER, maxTier - 1)
}

/**
 * Scale enemy power based on difficulty tier
 */
export function scaleEnemyPower(basePower: number, tier: number): number {
  const tierData = getDifficultyTier(tier)
  if (!tierData) return basePower

  return Math.round(basePower * tierData.enemyMultiplier)
}

/**
 * Scale loot quantity/quality based on difficulty tier
 */
export function scaleLootReward(baseReward: number, tier: number): number {
  const tierData = getDifficultyTier(tier)
  if (!tierData) return baseReward

  return Math.round(baseReward * tierData.lootMultiplier)
}

/**
 * Calculate item level with difficulty tier bonus
 */
export function calculateItemLevel(baseItemLevel: number, tier: number): number {
  const tierData = getDifficultyTier(tier)
  if (!tierData) return baseItemLevel

  return baseItemLevel + tierData.itemLevelBonus
}

/**
 * Calculate gold reward with difficulty tier multiplier
 */
export function scaleGoldReward(baseGold: number, tier: number): number {
  return scaleLootReward(baseGold, tier)
}

/**
 * Calculate XP reward with difficulty tier multiplier
 */
export function scaleXpReward(baseXp: number, tier: number): number {
  return scaleLootReward(baseXp, tier)
}

/**
 * Get power requirement for next tier
 */
export function getPowerRequirementForNextTier(currentTier: number): number | null {
  if (currentTier >= MAX_DIFFICULTY_TIER) {
    return null // Already at max tier
  }

  const nextTier = getDifficultyTier(currentTier + 1)
  return nextTier?.powerRequirement ?? null
}

/**
 * Get power gap to next tier
 */
export function getPowerGapToNextTier(teamPower: number): {
  currentTier: number
  nextTier: number | null
  powerNeeded: number | null
  percentProgress: number | null
} {
  const currentTier = getMaxAccessibleTier(teamPower)

  if (currentTier >= MAX_DIFFICULTY_TIER) {
    return {
      currentTier,
      nextTier: null,
      powerNeeded: null,
      percentProgress: 100,
    }
  }

  const nextTierData = getDifficultyTier(currentTier + 1)
  if (!nextTierData) {
    return {
      currentTier,
      nextTier: null,
      powerNeeded: null,
      percentProgress: 100,
    }
  }

  const currentTierData = getDifficultyTier(currentTier)
  const currentReq = currentTierData?.powerRequirement ?? 0
  const nextReq = nextTierData.powerRequirement

  const powerNeeded = Math.max(0, nextReq - teamPower)
  const progress = currentReq === nextReq
    ? 100
    : Math.min(100, ((teamPower - currentReq) / (nextReq - currentReq)) * 100)

  return {
    currentTier,
    nextTier: currentTier + 1,
    powerNeeded,
    percentProgress: Math.round(progress * 10) / 10, // Round to 1 decimal
  }
}

/**
 * Check if a tier unlocks special content
 */
export function tierHasUnlocks(tier: number): boolean {
  const tierData = getDifficultyTier(tier)
  return tierData?.unlocks !== undefined && tierData.unlocks.length > 0
}

/**
 * Get tier unlocks
 */
export function getTierUnlocks(tier: number): string[] {
  const tierData = getDifficultyTier(tier)
  return tierData?.unlocks ?? []
}

/**
 * Calculate efficiency based on team power vs scaled enemy power
 * Returns a value between 0.6 (60%) and 1.5 (150%)
 */
export function calculateTierEfficiency(
  teamPower: number,
  baseThreatPower: number,
  tier: number
): number {
  const scaledThreatPower = scaleEnemyPower(baseThreatPower, tier)

  // Power ratio: higher = better efficiency
  const powerRatio = teamPower / scaledThreatPower

  // Efficiency curve:
  // - powerRatio 2.0+ = 150% efficiency (overpowered)
  // - powerRatio 1.5 = 125% efficiency (well-equipped)
  // - powerRatio 1.0 = 100% efficiency (balanced)
  // - powerRatio 0.75 = 80% efficiency (challenging)
  // - powerRatio 0.5 = 60% efficiency (very difficult)
  // - powerRatio <0.5 = 60% efficiency (floor)

  let efficiency: number

  if (powerRatio >= 2.0) {
    efficiency = 1.5 // 150% max
  } else if (powerRatio >= 1.5) {
    efficiency = 1.0 + (powerRatio - 1.0) * 0.5 // 100% to 150%
  } else if (powerRatio >= 1.0) {
    efficiency = 1.0 // 100%
  } else if (powerRatio >= 0.75) {
    efficiency = 0.8 + (powerRatio - 0.75) * 0.8 // 80% to 100%
  } else if (powerRatio >= 0.5) {
    efficiency = 0.6 + (powerRatio - 0.5) * 0.8 // 60% to 80%
  } else {
    efficiency = 0.6 // 60% floor
  }

  return Math.round(efficiency * 1000) / 1000 // Round to 3 decimals
}

/**
 * Get tier color for UI
 */
export function getTierColor(tier: number): string {
  if (tier >= 10) return 'text-purple-500'
  if (tier >= 8) return 'text-pink-500'
  if (tier >= 6) return 'text-orange-500'
  if (tier >= 4) return 'text-yellow-500'
  if (tier >= 3) return 'text-blue-500'
  return 'text-gray-500'
}

/**
 * Get tier description with scaling info
 */
export function getTierDescription(tier: number): string {
  const tierData = getDifficultyTier(tier)
  if (!tierData) return 'Unknown difficulty tier'

  return tierData.description
}

/**
 * Format tier display name
 */
export function formatTierName(tier: number): string {
  const tierData = getDifficultyTier(tier)
  return tierData ? `Tier ${tier}: ${tierData.name}` : `Tier ${tier}`
}
