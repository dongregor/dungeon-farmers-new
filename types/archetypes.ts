import type { Archetype } from './base'

// All possible archetype tags
export type ArchetypeTag =
  // Tank tags
  | 'taunt' | 'heavy_armor' | 'magic_resist' | 'shield_wall' | 'intercept' | 'endurance'
  // Healer tags
  | 'burst_heals' | 'regen' | 'decurse' | 'cleanse' | 'shields' | 'immunity'
  // Debuffer tags
  | 'dispel' | 'weaken' | 'slow' | 'blind' | 'silence' | 'expose'
  // Melee DPS tags
  | 'cleave' | 'execute' | 'armor_break' | 'charge' | 'parry' | 'frenzy'
  // Ranged DPS tags
  | 'snipe' | 'volley' | 'kite' | 'precision' | 'traps' | 'scout'
  // Caster tags
  | 'fire' | 'ice' | 'lightning' | 'arcane' | 'aoe_blast' | 'channel'

// Tag pool for each archetype
export const ARCHETYPE_TAG_POOLS: Record<Archetype, ArchetypeTag[]> = {
  tank: ['taunt', 'heavy_armor', 'magic_resist', 'shield_wall', 'intercept', 'endurance'],
  healer: ['burst_heals', 'regen', 'decurse', 'cleanse', 'shields', 'immunity'],
  debuffer: ['dispel', 'weaken', 'slow', 'blind', 'silence', 'expose'],
  melee_dps: ['cleave', 'execute', 'armor_break', 'charge', 'parry', 'frenzy'],
  ranged_dps: ['snipe', 'volley', 'kite', 'precision', 'traps', 'scout'],
  caster: ['fire', 'ice', 'lightning', 'arcane', 'aoe_blast', 'channel'],
}

// Tag count by rarity
export const TAG_COUNT_BY_RARITY: Record<import('./base').Rarity, number> = {
  common: 1,
  uncommon: 1,
  rare: 2,
  epic: 2,
  legendary: 3,
}

// Tag display info
export interface TagInfo {
  id: ArchetypeTag
  name: string
  description: string
  counters: string[] // Threat IDs this tag counters
}

export const TAG_INFO: Record<ArchetypeTag, TagInfo> = {
  // Tank
  taunt: { id: 'taunt', name: 'Taunt', description: 'Forces enemies to attack you', counters: ['boss_focus', 'split_damage'] },
  heavy_armor: { id: 'heavy_armor', name: 'Heavy Armor', description: 'Reduces physical damage taken', counters: ['physical_burst', 'piercing'] },
  magic_resist: { id: 'magic_resist', name: 'Magic Resist', description: 'Reduces magic damage taken', counters: ['spell_barrages', 'elemental'] },
  shield_wall: { id: 'shield_wall', name: 'Shield Wall', description: 'Protects entire party from AoE', counters: ['aoe_damage', 'swarms'] },
  intercept: { id: 'intercept', name: 'Intercept', description: 'Blocks attacks on allies', counters: ['sneak_attacks', 'assassins'] },
  endurance: { id: 'endurance', name: 'Endurance', description: 'Sustains through long fights', counters: ['attrition', 'marathon'] },

  // Healer
  burst_heals: { id: 'burst_heals', name: 'Burst Heals', description: 'Rapid emergency healing', counters: ['spike_damage', 'executes'] },
  regen: { id: 'regen', name: 'Regeneration', description: 'Sustained healing over time', counters: ['attrition', 'long_expeditions'] },
  decurse: { id: 'decurse', name: 'Decurse', description: 'Removes curses and hexes', counters: ['curses', 'hexes'] },
  cleanse: { id: 'cleanse', name: 'Cleanse', description: 'Removes poisons and diseases', counters: ['poison', 'disease'] },
  shields: { id: 'shields', name: 'Shields', description: 'Prevents incoming damage', counters: ['predictable_damage', 'traps'] },
  immunity: { id: 'immunity', name: 'Immunity', description: 'Grants immunity to effects', counters: ['instant_death', 'stuns'] },

  // Debuffer
  dispel: { id: 'dispel', name: 'Dispel', description: 'Removes enemy buffs', counters: ['enemy_buffs', 'enemy_shields'] },
  weaken: { id: 'weaken', name: 'Weaken', description: 'Reduces enemy power', counters: ['enraged', 'berserkers'] },
  slow: { id: 'slow', name: 'Slow', description: 'Reduces enemy speed', counters: ['fast_enemies', 'fleeing'] },
  blind: { id: 'blind', name: 'Blind', description: 'Reduces enemy accuracy', counters: ['accurate_enemies', 'crits'] },
  silence: { id: 'silence', name: 'Silence', description: 'Prevents enemy casting', counters: ['casters', 'summoners'] },
  expose: { id: 'expose', name: 'Expose', description: 'Reduces enemy defenses', counters: ['armored', 'resistant'] },

  // Melee DPS
  cleave: { id: 'cleave', name: 'Cleave', description: 'Hits multiple enemies', counters: ['swarms', 'grouped_enemies'] },
  execute: { id: 'execute', name: 'Execute', description: 'Finishes low HP enemies', counters: ['bosses', 'high_hp'] },
  armor_break: { id: 'armor_break', name: 'Armor Break', description: 'Ignores armor', counters: ['armored', 'fortified'] },
  charge: { id: 'charge', name: 'Charge', description: 'Closes distance quickly', counters: ['ranged_enemies', 'fleeing'] },
  parry: { id: 'parry', name: 'Parry', description: 'Counters melee attacks', counters: ['duelist', 'counter_attackers'] },
  frenzy: { id: 'frenzy', name: 'Frenzy', description: 'Increased attack speed', counters: ['time_pressure', 'dps_checks'] },

  // Ranged DPS
  snipe: { id: 'snipe', name: 'Snipe', description: 'Long range precision', counters: ['flying', 'elevated'] },
  volley: { id: 'volley', name: 'Volley', description: 'Hits multiple targets', counters: ['swarms', 'spread_out'] },
  kite: { id: 'kite', name: 'Kite', description: 'Attack while moving', counters: ['melee_only', 'slow_enemies'] },
  precision: { id: 'precision', name: 'Precision', description: 'High accuracy shots', counters: ['evasive', 'small_targets'] },
  traps: { id: 'traps', name: 'Traps', description: 'Sets traps for enemies', counters: ['ambushers', 'flankers'] },
  scout: { id: 'scout', name: 'Scout', description: 'Detects hidden threats', counters: ['hidden_enemies', 'ambush'] },

  // Caster
  fire: { id: 'fire', name: 'Fire Magic', description: 'Burns enemies', counters: ['ice_enemies', 'regenerators'] },
  ice: { id: 'ice', name: 'Ice Magic', description: 'Freezes and slows', counters: ['fast_enemies', 'fire_enemies'] },
  lightning: { id: 'lightning', name: 'Lightning Magic', description: 'Piercing electric damage', counters: ['armored', 'constructs'] },
  arcane: { id: 'arcane', name: 'Arcane Magic', description: 'Pure magical damage', counters: ['magic_resist', 'anti_physical'] },
  aoe_blast: { id: 'aoe_blast', name: 'AoE Blast', description: 'Area damage spells', counters: ['swarms', 'clusters'] },
  channel: { id: 'channel', name: 'Channel', description: 'Powerful focused spells', counters: ['single_target', 'bosses'] },
}
