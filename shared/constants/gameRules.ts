/**
 * Game Rules Constants
 * Centralized location for all game balance values and magic numbers
 * Auto-imported across client and server
 */

// ===== HERO PROGRESSION =====

/**
 * Maximum hero level before prestige required
 */
export const MAX_HERO_LEVEL = 60

/**
 * XP progression is tiered and defined in app/utils/xpService.ts
 * - Levels 1-10: 100 XP per level
 * - Levels 11-20: 200 XP per level
 * - Levels 21-30: 350 XP per level
 * - Levels 31-40: 500 XP per level
 * - Levels 41-50: 750 XP per level
 * - Levels 51-60: 1000 XP per level
 *
 * Use getXpForLevel() from xpService.ts for XP calculations
 */

/**
 * Prestige stat bonus per prestige level
 * Applied to combat, utility, and survival stats
 */
export const PRESTIGE_STAT_BONUS_PER_LEVEL = 5

// ===== MORALE SYSTEM =====

/**
 * Morale recovery rate (points per minute)
 */
export const MORALE_RECOVERY_PER_MINUTE = 1

/**
 * Minimum morale value
 */
export const MIN_MORALE = 0

/**
 * Maximum morale value
 */
export const MAX_MORALE = 100

/**
 * Minimum morale required to start an expedition
 * Heroes must be at least "frustrated" (20+) to go on expeditions
 * Exhausted heroes (0-19) cannot participate
 */
export const MIN_MORALE_FOR_EXPEDITION = 20

/**
 * Morale penalties for various actions
 */
export const MORALE_PENALTIES = {
  expeditionComplete: -10,
  expeditionCancel: -20,
  expeditionFail: -30,
} as const

// ===== EXPEDITION EFFICIENCY =====

/**
 * Minimum expedition efficiency (percentage)
 */
export const MIN_EFFICIENCY = 60

/**
 * Maximum expedition efficiency (percentage)
 */
export const MAX_EFFICIENCY = 150

/**
 * Base efficiency (100%)
 */
export const BASE_EFFICIENCY = 100

/**
 * Threat penalty per uncountered threat
 * Formula: basePenalty * difficultyMultiplier
 */
export const THREAT_BASE_PENALTY = 5

/**
 * Difficulty multipliers for threat penalties
 */
export const THREAT_DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  extreme: 3.0,
} as const

/**
 * Calculate threat penalty for efficiency
 */
export function calculateThreatPenalty(
  uncounteredThreats: number,
  difficulty: keyof typeof THREAT_DIFFICULTY_MULTIPLIERS
): number {
  const multiplier = THREAT_DIFFICULTY_MULTIPLIERS[difficulty]
  return uncounteredThreats * THREAT_BASE_PENALTY * multiplier
}

// ===== INVENTORY =====

/**
 * Base inventory slots for all players
 */
export const BASE_INVENTORY_SLOTS = 20

/**
 * Bonus inventory slots for supporters
 */
export const SUPPORTER_INVENTORY_BONUS = 10

// ===== TAVERN =====

/**
 * Hours until tavern auto-refresh
 */
export const TAVERN_REFRESH_HOURS = 6

/**
 * Gold cost to manually refresh tavern
 */
export const TAVERN_REFRESH_COST = 50

/**
 * Free tavern refreshes per day for supporters
 */
export const SUPPORTER_FREE_REFRESHES = 3

// ===== EXPEDITION DURATION =====

/**
 * Minimum expedition duration (minutes)
 */
export const MIN_EXPEDITION_DURATION = 15

/**
 * Maximum expedition duration (minutes)
 */
export const MAX_EXPEDITION_DURATION = 360 // 6 hours

// ===== OFFLINE PROGRESS =====

/**
 * Maximum offline time to process (hours)
 * Prevents abuse from very long offline periods
 */
export const MAX_OFFLINE_HOURS = 48

/**
 * Morale recovery during offline time is calculated at reduced rate
 */
export const OFFLINE_MORALE_RECOVERY_MULTIPLIER = 0.5

// ===== PRESTIGE =====

/**
 * Prestige requirements
 */
export const PRESTIGE_REQUIREMENTS = {
  minLevel: MAX_HERO_LEVEL,
  goldCost: 0, // Free prestige
} as const

/**
 * Calculate prestige bonus based on expedition efficiency
 * Returns gold bonus granted on prestige
 */
export function calculatePrestigeBonus(efficiency: number): number {
  return 5 * efficiency
}

// ===== LOCK SLOTS =====

/**
 * Base tavern lock slots available to all players
 */
export const BASE_LOCK_SLOTS = 1

/**
 * Additional lock slots per 10 account levels
 */
export const LOCK_SLOTS_PER_10_LEVELS = 1

/**
 * Bonus lock slots for supporters
 */
export const SUPPORTER_LOCK_SLOT_BONUS = 2

// ===== RESOURCE CAPS =====

/**
 * Maximum gold a player can hold
 * Prevents overflow issues and provides progression gates
 */
export const MAX_GOLD = 999_999_999

/**
 * Gold cap warning threshold (90% of max)
 * Used for UI warnings before hitting the cap
 */
export const GOLD_CAP_WARNING_THRESHOLD = Math.floor(MAX_GOLD * 0.9)
