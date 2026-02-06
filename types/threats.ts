import type { ZoneDifficulty } from './base'
import type { ArchetypeTag } from './archetypes'

// Threat severity levels
export type ThreatSeverity = 'minor' | 'major' | 'deadly'

// Base penalties by severity
export const SEVERITY_BASE_PENALTY: Record<ThreatSeverity, number> = {
  minor: 5,
  major: 10,
  deadly: 15,
}

// Threat categories
export type ThreatCategory = 'damage' | 'enemy_type' | 'status' | 'mechanic'

// Threat definition
export interface Threat {
  id: string
  name: string
  description: string
  category: ThreatCategory
  severity: ThreatSeverity
  counteredBy: ArchetypeTag[]
}

// All threats
export const THREATS: Record<string, Threat> = {
  // DAMAGE THREATS
  physical_burst: {
    id: 'physical_burst',
    name: 'Physical Burst',
    description: 'High single-target physical damage',
    category: 'damage',
    severity: 'major',
    counteredBy: ['heavy_armor', 'shields'],
  },
  spike_damage: {
    id: 'spike_damage',
    name: 'Spike Damage',
    description: 'Sudden HP drops',
    category: 'damage',
    severity: 'major',
    counteredBy: ['burst_heals', 'intercept'],
  },
  aoe_damage: {
    id: 'aoe_damage',
    name: 'AoE Damage',
    description: 'Party-wide attacks',
    category: 'damage',
    severity: 'major',
    counteredBy: ['shield_wall', 'regen'],
  },
  attrition: {
    id: 'attrition',
    name: 'Attrition',
    description: 'Slow constant damage',
    category: 'damage',
    severity: 'minor',
    counteredBy: ['endurance', 'regen'],
  },
  spell_barrages: {
    id: 'spell_barrages',
    name: 'Spell Barrages',
    description: 'Magic damage waves',
    category: 'damage',
    severity: 'major',
    counteredBy: ['magic_resist', 'immunity'],
  },

  // ENEMY TYPE THREATS
  swarms: {
    id: 'swarms',
    name: 'Swarms',
    description: 'Many weak enemies',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['cleave', 'volley', 'aoe_blast', 'shield_wall'],
  },
  armored: {
    id: 'armored',
    name: 'Armored',
    description: 'High physical resist enemies',
    category: 'enemy_type',
    severity: 'major',
    counteredBy: ['armor_break', 'lightning', 'expose'],
  },
  flying: {
    id: 'flying',
    name: 'Flying',
    description: 'Enemies out of melee reach',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['snipe', 'volley'],
  },
  evasive: {
    id: 'evasive',
    name: 'Evasive',
    description: 'Hard to hit enemies',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['precision', 'aoe_blast'],
  },
  fast_enemies: {
    id: 'fast_enemies',
    name: 'Fast Enemies',
    description: 'Quick attackers',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['ice', 'slow'],
  },
  bosses: {
    id: 'bosses',
    name: 'Bosses',
    description: 'High HP single targets',
    category: 'enemy_type',
    severity: 'deadly',
    counteredBy: ['execute', 'channel'],
  },

  // STATUS THREATS
  poison: {
    id: 'poison',
    name: 'Poison',
    description: 'Damage over time',
    category: 'status',
    severity: 'minor',
    counteredBy: ['cleanse', 'regen'],
  },
  curses: {
    id: 'curses',
    name: 'Curses',
    description: 'Stat debuffs',
    category: 'status',
    severity: 'major',
    counteredBy: ['decurse', 'dispel'],
  },
  disease: {
    id: 'disease',
    name: 'Disease',
    description: 'Spreading affliction',
    category: 'status',
    severity: 'major',
    counteredBy: ['cleanse', 'immunity'],
  },
  stuns: {
    id: 'stuns',
    name: 'Stuns',
    description: 'Incapacitates heroes',
    category: 'status',
    severity: 'major',
    counteredBy: ['immunity', 'shields'],
  },
  enraged: {
    id: 'enraged',
    name: 'Enraged',
    description: 'Buffed enemies',
    category: 'status',
    severity: 'minor',
    counteredBy: ['weaken', 'dispel'],
  },
  enemy_buffs: {
    id: 'enemy_buffs',
    name: 'Enemy Buffs',
    description: 'Shields and damage boosts',
    category: 'status',
    severity: 'minor',
    counteredBy: ['dispel', 'silence'],
  },

  // MECHANIC THREATS
  boss_focus: {
    id: 'boss_focus',
    name: 'Boss Focus',
    description: 'Boss targets one hero',
    category: 'mechanic',
    severity: 'major',
    counteredBy: ['taunt', 'intercept'],
  },
  time_pressure: {
    id: 'time_pressure',
    name: 'Time Pressure',
    description: 'DPS check / timer',
    category: 'mechanic',
    severity: 'major',
    counteredBy: ['frenzy', 'execute'],
  },
  ambush: {
    id: 'ambush',
    name: 'Ambush',
    description: 'Surprise attacks',
    category: 'mechanic',
    severity: 'minor',
    counteredBy: ['scout', 'traps'],
  },
  fleeing: {
    id: 'fleeing',
    name: 'Fleeing',
    description: 'Enemies try to escape',
    category: 'mechanic',
    severity: 'minor',
    counteredBy: ['charge', 'slow'],
  },
  summoners: {
    id: 'summoners',
    name: 'Summoners',
    description: 'Spawn adds constantly',
    category: 'mechanic',
    severity: 'major',
    counteredBy: ['silence', 'snipe'],
  },
  regenerators: {
    id: 'regenerators',
    name: 'Regenerators',
    description: 'Enemies heal themselves',
    category: 'mechanic',
    severity: 'minor',
    counteredBy: ['fire', 'execute'],
  },
}

// Calculate penalty for uncountered threat
export function calculateThreatPenalty(
  threat: Threat,
  difficulty: ZoneDifficulty,
  hasCounter: boolean
): number {
  if (hasCounter) {
    return -5 // Bonus for countering
  }

  const basePenalty = SEVERITY_BASE_PENALTY[threat.severity]
  const multiplier = {
    easy: 0.5,
    medium: 1.0,
    hard: 1.5,
    extreme: 2.0,
  }[difficulty]

  return basePenalty * multiplier
}
