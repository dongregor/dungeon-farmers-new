import type { Hero, Subzone, ZoneDifficulty } from '~~/types'
import { DIFFICULTY_MULTIPLIERS } from '~~/types/base'

/**
 * Calculate expedition efficiency based on team power vs required power
 * Returns a percentage (60-150%) that modifies rewards
 */
export function calculateEfficiency (
  heroes: Hero[],
  subzone: Subzone,
  countersThreats: boolean = false
): number {
  const teamPower = calculateTeamPower(heroes)
  const requiredPower = calculateRequiredPower(subzone)

  // Base efficiency from power ratio
  const powerRatio = teamPower / requiredPower
  let efficiency = 60 + (powerRatio * 40) // 60-100% base range

  // Bonus for countering threats
  if (countersThreats) {
    efficiency += 20
  }

  // Cap efficiency at 60-150%
  return Math.max(60, Math.min(150, Math.round(efficiency)))
}

/**
 * Calculate total team power
 */
export function calculateTeamPower(heroes: Hero[]): number {
  return heroes.reduce((total, hero) => total + hero.power, 0)
}

/**
 * Calculate required power for a subzone
 */
export function calculateRequiredPower(subzone: Subzone): number {
  const basePower = 50 // Base power requirement
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[subzone.difficulty]
  const threatMultiplier = 1 + (subzone.threats.length * 0.1)

  return Math.round(basePower * difficultyMultiplier * threatMultiplier)
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
 */
export function calculateThreatPenalty(
  subzone: Subzone,
  uncounteredThreats: string[]
): number {
  const basePenalty = 5 // 5% penalty per uncountered threat
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[subzone.difficulty]

  return Math.round(uncounteredThreats.length * basePenalty * difficultyMultiplier)
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
