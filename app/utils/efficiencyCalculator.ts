import type { Hero, Subzone, ZoneDifficulty } from '~~/types'
import { DIFFICULTY_MULTIPLIERS } from '~~/types/base'
import {
  MIN_EFFICIENCY,
  MAX_EFFICIENCY,
  BASE_EFFICIENCY,
  THREAT_BASE_PENALTY,
  calculateThreatPenalty,
} from '~~/shared/constants/gameRules'

/**
 * Calculate expedition efficiency based on team power vs required power
 * Returns a percentage (60-150%) that modifies rewards
 *
 * @param heroes - Team of heroes
 * @param subzone - Target subzone
 * @param threatCounterResult - Optional pre-calculated threat counter result (for performance)
 */
export function calculateEfficiency (
  heroes: Hero[],
  subzone: Subzone,
  threatCounterResult?: ReturnType<typeof checkThreatCounters>
): number {
  const teamPower = sumHeroPower(heroes)
  const requiredPower = calculateRequiredPower(subzone)

  // Base efficiency from power ratio
  const powerRatio = teamPower / requiredPower
  const baseRange = BASE_EFFICIENCY - MIN_EFFICIENCY
  let efficiency = MIN_EFFICIENCY + (powerRatio * baseRange) // MIN_EFFICIENCY to BASE_EFFICIENCY range

  // Calculate threat counter result if not provided
  const threatResult = threatCounterResult ?? checkThreatCounters(heroes, subzone)

  // Bonus for countered threats (THREAT_BASE_PENALTY percentage points per countered threat)
  efficiency += threatResult.counteredThreats.length * THREAT_BASE_PENALTY

  // Penalty for uncountered threats (scaled by difficulty)
  const threatPenalty = calculateThreatPenalty(threatResult.uncounteredThreats.length, subzone.difficulty)
  efficiency -= threatPenalty

  // Cap efficiency at MIN_EFFICIENCY-MAX_EFFICIENCY
  return Math.max(MIN_EFFICIENCY, Math.min(MAX_EFFICIENCY, Math.round(efficiency)))
}

/**
 * Sum pre-calculated hero power values
 * Use calculateTeamPower from powerCalculator.ts for full calculation with equipment
 */
function sumHeroPower(heroes: Hero[]): number {
  return heroes.reduce((total, hero) => total + hero.power, 0)
}

/**
 * Calculate required power for a subzone
 */
export function calculateRequiredPower(subzone: Subzone): number {
  const basePower = 50 // Base power requirement
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[subzone.difficulty]
  const threatMultiplier = 1 + (subzone.threats.length * 0.1)

  return Math.max(1, Math.round(basePower * difficultyMultiplier * threatMultiplier))
}

/**
 * Check if team counters all threats in a subzone
 */
export function checkThreatCounters(heroes: Hero[], subzone: Subzone): {
  allCountered: boolean
  counteredThreats: string[]
  uncounteredThreats: string[]
} {
  const heroTags = heroes.flatMap(h => h.archetypeTags)
  const counteredThreats: string[] = []
  const uncounteredThreats: string[] = []

  for (const threat of subzone.threats) {
    // Check if any hero tag counters this threat
    const countered = heroTags.some(tag => threatCounters(tag, threat))

    if (countered) {
      counteredThreats.push(threat)
    } else {
      uncounteredThreats.push(threat)
    }
  }

  return {
    allCountered: uncounteredThreats.length === 0,
    counteredThreats,
    uncounteredThreats
  }
}

/**
 * Check if a hero tag counters a specific threat
 * This is a simplified version - full implementation would use THREATS data
 */
function threatCounters(tag: string, threat: string): boolean {
  // Simplified threat/counter mapping
  const counterMap: Record<string, string[]> = {
    // Tank tags
    taunt: ['boss_focus', 'split_damage'],
    heavy_armor: ['physical_burst', 'piercing'],
    magic_resist: ['spell_barrages', 'elemental'],
    shield_wall: ['aoe_damage', 'swarms'],
    intercept: ['sneak_attacks', 'assassins'],
    endurance: ['attrition', 'marathon'],

    // Healer tags
    burst_heals: ['spike_damage', 'executes'],
    regen: ['attrition', 'long_expeditions'],
    decurse: ['curses', 'hexes'],
    cleanse: ['poison', 'disease'],
    shields: ['predictable_damage', 'traps'],
    immunity: ['instant_death', 'stuns'],

    // Debuffer tags
    dispel: ['enemy_buffs', 'enemy_shields'],
    weaken: ['enraged', 'berserkers'],
    slow: ['fast_enemies', 'fleeing'],
    blind: ['accurate_enemies', 'crits'],
    silence: ['casters', 'summoners'],
    expose: ['armored', 'resistant'],

    // DPS tags
    cleave: ['swarms', 'grouped_enemies'],
    execute: ['bosses', 'high_hp'],
    armor_break: ['armored', 'fortified'],
    charge: ['ranged_enemies', 'fleeing'],
    parry: ['duelist', 'counter_attackers'],
    frenzy: ['time_pressure', 'dps_checks'],
    snipe: ['flying', 'elevated'],
    volley: ['swarms', 'spread_out'],
    kite: ['melee_only', 'slow_enemies'],
    precision: ['evasive', 'small_targets'],
    traps: ['ambushers', 'flankers'],
    scout: ['hidden_enemies', 'ambush'],

    // Caster tags
    fire: ['ice_enemies', 'regenerators'],
    ice: ['fast_enemies', 'fire_enemies'],
    lightning: ['armored', 'constructs'],
    arcane: ['magic_resist', 'anti_physical'],
    aoe_blast: ['swarms', 'clusters'],
    channel: ['single_target', 'bosses']
  }

  const counters = counterMap[tag] ?? []
  return counters.includes(threat)
}

/**
 * Calculate efficiency penalty for uncountered threats
 * @deprecated Use calculateThreatPenalty from shared/constants/gameRules instead
 */
export function calculateThreatPenaltyLegacy(
  subzone: Subzone,
  uncounteredThreats: string[]
): number {
  return calculateThreatPenalty(uncounteredThreats.length, subzone.difficulty)
}

/**
 * Get efficiency color for UI display
 */
export function getEfficiencyColor(efficiency: number): string {
  if (efficiency >= 130) return 'text-legendary'
  if (efficiency >= 110) return 'text-epic'
  if (efficiency >= 90) return 'text-rare'
  if (efficiency >= 70) return 'text-uncommon'
  return 'text-common'
}

/**
 * Get efficiency description
 */
export function getEfficiencyDescription(efficiency: number): string {
  if (efficiency >= 140) return 'Flawless Victory!'
  if (efficiency >= 120) return 'Dominant Performance'
  if (efficiency >= 100) return 'Excellent'
  if (efficiency >= 80) return 'Good'
  if (efficiency >= 70) return 'Adequate'
  return 'Barely Survived'
}
