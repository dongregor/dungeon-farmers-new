/**
 * Gold Sink Definitions
 *
 * Philosophy: Sink-Driven Economy
 * - Gold flows generously, but meaningful sinks keep it valuable
 * - Players feel rich but always have something to spend on
 */

export interface GoldSink {
  id: string
  name: string
  description: string
  baseCost: number
  category: 'small' | 'medium' | 'large' | 'aspirational'
  isRepeatable: boolean
  scalingFormula?: (count: number) => number
  requirements?: {
    playerLevel?: number
    heroLevel?: number
    unlockCondition?: string
  }
}

// ===== SMALL SINKS (frequent use, 50-200g) =====

export const SMALL_GOLD_SINKS: Record<string, GoldSink> = {
  tavern_refresh: {
    id: 'tavern_refresh',
    name: 'Tavern Refresh',
    description: 'Refresh the tavern roster immediately',
    baseCost: 75,
    category: 'small',
    isRepeatable: true,
    scalingFormula: (count) => 75 + (count * 25), // +25g per refresh today
  },

  quick_recover: {
    id: 'quick_recover',
    name: 'Quick Recovery',
    description: 'Restore hero morale from tired to content (skip 1hr wait)',
    baseCost: 100,
    category: 'small',
    isRepeatable: true,
  },

  expedition_speedup: {
    id: 'expedition_speedup',
    name: 'Expedition Speed-Up (10%)',
    description: 'Reduce expedition duration by 10%',
    baseCost: 50,
    category: 'small',
    isRepeatable: true,
  },
}

// ===== MEDIUM SINKS (regular use, 200-800g) =====

export const MEDIUM_GOLD_SINKS: Record<string, GoldSink> = {
  upgrade_normal_to_magic: {
    id: 'upgrade_normal_to_magic',
    name: 'Equipment Upgrade: Normal → Magic',
    description: 'Upgrade equipment quality to Magic tier (requires materials)',
    baseCost: 300,
    category: 'medium',
    isRepeatable: true,
  },

  upgrade_magic_to_perfect: {
    id: 'upgrade_magic_to_perfect',
    name: 'Equipment Upgrade: Magic → Perfect',
    description: 'Upgrade equipment quality to Perfect tier (requires rare materials)',
    baseCost: 600,
    category: 'medium',
    isRepeatable: true,
  },

  reroll_equipment_trait: {
    id: 'reroll_equipment_trait',
    name: 'Reroll Equipment Trait',
    description: 'Randomize one trait on an equipment piece',
    baseCost: 400,
    category: 'medium',
    isRepeatable: true,
  },

  cleanse_minor_curse: {
    id: 'cleanse_minor_curse',
    name: 'Cleanse Minor Curse',
    description: 'Remove a minor curse from equipment or hero',
    baseCost: 200,
    category: 'medium',
    isRepeatable: true,
  },

  cleanse_major_curse: {
    id: 'cleanse_major_curse',
    name: 'Cleanse Major Curse',
    description: 'Remove a major curse from equipment or hero',
    baseCost: 500,
    category: 'medium',
    isRepeatable: true,
  },
}

// ===== LARGE SINKS (investments, 1000-3000g) =====

export const LARGE_GOLD_SINKS: Record<string, GoldSink> = {
  unlock_tavern_slot: {
    id: 'unlock_tavern_slot',
    name: 'Unlock Tavern Slot',
    description: 'Permanently increase tavern roster size by 1',
    baseCost: 1500,
    category: 'large',
    isRepeatable: true,
    scalingFormula: (count) => 1500 * Math.pow(1.5, count), // Exponential scaling
  },

  unlock_party_preset_slot: {
    id: 'unlock_party_preset_slot',
    name: 'Unlock Party Preset Slot',
    description: 'Permanently add one party preset slot',
    baseCost: 1000,
    category: 'large',
    isRepeatable: true,
    requirements: {
      playerLevel: 10,
    },
  },

  unlock_difficulty_tier: {
    id: 'unlock_difficulty_tier',
    name: 'Unlock Difficulty Tier',
    description: 'Unlock a new difficulty tier (requires power threshold)',
    baseCost: 2000,
    category: 'large',
    isRepeatable: true,
  },

  reroll_hero_negative_trait: {
    id: 'reroll_hero_negative_trait',
    name: 'Reroll Hero Negative Trait',
    description: 'Replace a negative trait with a random new trait',
    baseCost: 2500,
    category: 'large',
    isRepeatable: true,
  },
}

// ===== ASPIRATIONAL SINKS (endgame, 5000g+) =====

export const ASPIRATIONAL_GOLD_SINKS: Record<string, GoldSink> = {
  add_hero_trait_slot: {
    id: 'add_hero_trait_slot',
    name: 'Add Hero Trait Slot',
    description: 'Permanently add one trait slot to a hero (once per hero)',
    baseCost: 8000,
    category: 'aspirational',
    isRepeatable: false,
    requirements: {
      heroLevel: 40,
    },
  },

  targeted_trait_reroll: {
    id: 'targeted_trait_reroll',
    name: 'Targeted Trait Reroll',
    description: 'Reroll a trait and choose the category (combat/utility/survival)',
    baseCost: 5000,
    category: 'aspirational',
    isRepeatable: true,
    requirements: {
      playerLevel: 30,
    },
  },

  instant_prestige_recovery: {
    id: 'instant_prestige_recovery',
    name: 'Instant Prestige Recovery',
    description: 'Skip prestige downtime and start at level 10 instead of level 1',
    baseCost: 10000,
    category: 'aspirational',
    isRepeatable: true,
  },
}

// ===== INCOME RATES =====

export interface IncomeRate {
  duration: number // minutes
  goldMin: number
  goldMax: number
  zoneMultiplier: number
}

export const BASE_INCOME_RATES: Record<number, IncomeRate> = {
  15: {
    duration: 15,
    goldMin: 30,
    goldMax: 50,
    zoneMultiplier: 1.0,
  },
  30: {
    duration: 30,
    goldMin: 70,
    goldMax: 100,
    zoneMultiplier: 1.0,
  },
  60: {
    duration: 60,
    goldMin: 150,
    goldMax: 200,
    zoneMultiplier: 1.0,
  },
  120: {
    duration: 120,
    goldMin: 350,
    goldMax: 450,
    zoneMultiplier: 1.0,
  },
}

/**
 * Calculate gold reward for an expedition
 */
export function calculateGoldReward(
  durationMinutes: number,
  zoneLevel: number,
  difficultyTier: number,
  efficiency: number
): number {
  // Find closest duration bracket
  const durations = Object.keys(BASE_INCOME_RATES).map(Number)
  const closestDuration = durations.reduce((prev, curr) => {
    return Math.abs(curr - durationMinutes) < Math.abs(prev - durationMinutes) ? curr : prev
  })

  const rateData = BASE_INCOME_RATES[closestDuration]
  if (!rateData) return 0

  // Base gold (random in range)
  const baseGold = rateData.goldMin + Math.random() * (rateData.goldMax - rateData.goldMin)

  // Zone multiplier (each zone increases by 30%)
  const zoneMultiplier = Math.pow(1.3, zoneLevel - 1)

  // Difficulty tier multiplier (from difficulty tiers system)
  const tierMultiplier = 1.0 + ((difficultyTier - 1) * 0.15)

  // Efficiency multiplier (60% to 150%)
  const efficiencyMultiplier = efficiency

  // Calculate final gold
  const finalGold = baseGold * zoneMultiplier * tierMultiplier * efficiencyMultiplier

  return Math.round(finalGold)
}

/**
 * Calculate cost with scaling formula
 */
export function calculateScaledCost(sink: GoldSink, usageCount: number): number {
  if (!sink.scalingFormula) {
    return sink.baseCost
  }

  return Math.round(sink.scalingFormula(usageCount))
}

/**
 * Get all gold sinks
 */
export function getAllGoldSinks(): GoldSink[] {
  return [
    ...Object.values(SMALL_GOLD_SINKS),
    ...Object.values(MEDIUM_GOLD_SINKS),
    ...Object.values(LARGE_GOLD_SINKS),
    ...Object.values(ASPIRATIONAL_GOLD_SINKS),
  ]
}

/**
 * Get gold sinks by category
 */
export function getGoldSinksByCategory(category: GoldSink['category']): GoldSink[] {
  return getAllGoldSinks().filter(sink => sink.category === category)
}

/**
 * Get gold sink by ID
 */
export function getGoldSinkById(id: string): GoldSink | undefined {
  return getAllGoldSinks().find(sink => sink.id === id)
}

/**
 * Check if player can afford a gold sink
 */
export function canAfford(playerGold: number, sinkId: string, usageCount: number = 0): boolean {
  const sink = getGoldSinkById(sinkId)
  if (!sink) return false

  const cost = calculateScaledCost(sink, usageCount)
  return playerGold >= cost
}

/**
 * Get recommended gold sinks for player
 */
export function getRecommendedSinks(
  playerGold: number,
  playerLevel: number
): GoldSink[] {
  const affordable = getAllGoldSinks().filter(sink => {
    // Check level requirement
    if (sink.requirements?.playerLevel && playerLevel < sink.requirements.playerLevel) {
      return false
    }

    // Check affordability (with 20% buffer for scaling)
    const cost = calculateScaledCost(sink, 0) * 1.2
    return playerGold >= cost
  })

  // Sort by value (medium sinks first for engagement)
  return affordable.sort((a, b) => {
    const order = { small: 2, medium: 1, large: 3, aspirational: 4 }
    return order[a.category] - order[b.category]
  })
}
