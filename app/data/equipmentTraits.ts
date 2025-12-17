import type { StatType } from '~~/types'

// Equipment trait definition
export interface EquipmentTraitDef {
  id: string
  name: string
  description: string
  type: 'stat_bonus' | 'conditional' | 'special'

  // Stat bonus
  stat?: StatType
  minValue: number
  maxValue: number
  isPercent?: boolean

  // Conditional
  condition?: {
    type: 'zone_type' | 'enemy_type' | 'party_composition' | 'time_of_day'
    value: string
  }

  // Special effects (for unique traits)
  effect?: string
}

// All equipment traits
export const EQUIPMENT_TRAITS: Record<string, EquipmentTraitDef> = {
  // === STAT BONUS TRAITS ===
  strength: {
    id: 'strength',
    name: 'Strength',
    description: '+{value} Combat',
    type: 'stat_bonus',
    stat: 'combat',
    minValue: 2,
    maxValue: 10
  },
  cunning: {
    id: 'cunning',
    name: 'Cunning',
    description: '+{value} Utility',
    type: 'stat_bonus',
    stat: 'utility',
    minValue: 2,
    maxValue: 10
  },
  vitality: {
    id: 'vitality',
    name: 'Vitality',
    description: '+{value} Survival',
    type: 'stat_bonus',
    stat: 'survival',
    minValue: 2,
    maxValue: 10
  },

  // === CONDITIONAL TRAITS ===
  forest_affinity: {
    id: 'forest_affinity',
    name: 'Forest Affinity',
    description: '+{value}% all stats in forest zones',
    type: 'conditional',
    minValue: 10,
    maxValue: 25,
    isPercent: true,
    condition: {
      type: 'zone_type',
      value: 'forest'
    }
  },
  cave_dweller: {
    id: 'cave_dweller',
    name: 'Cave Dweller',
    description: '+{value}% all stats in cave zones',
    type: 'conditional',
    minValue: 10,
    maxValue: 25,
    isPercent: true,
    condition: {
      type: 'zone_type',
      value: 'cave'
    }
  },
  swamp_walker: {
    id: 'swamp_walker',
    name: 'Swamp Walker',
    description: '+{value}% all stats in swamp zones',
    type: 'conditional',
    minValue: 10,
    maxValue: 25,
    isPercent: true,
    condition: {
      type: 'zone_type',
      value: 'swamp'
    }
  },
  goblin_slayer: {
    id: 'goblin_slayer',
    name: 'Goblin Slayer',
    description: '+{value}% Combat against goblins',
    type: 'conditional',
    minValue: 15,
    maxValue: 30,
    isPercent: true,
    condition: {
      type: 'enemy_type',
      value: 'goblin'
    }
  },
  beast_hunter: {
    id: 'beast_hunter',
    name: 'Beast Hunter',
    description: '+{value}% Combat against beasts',
    type: 'conditional',
    minValue: 15,
    maxValue: 30,
    isPercent: true,
    condition: {
      type: 'enemy_type',
      value: 'beast'
    }
  },

  // === SPECIAL TRAITS ===
  lifesteal: {
    id: 'lifesteal',
    name: 'Lifesteal',
    description: 'Heals for {value}% of damage dealt',
    type: 'special',
    minValue: 5,
    maxValue: 15,
    isPercent: true,
    effect: 'lifesteal'
  },
  thorns: {
    id: 'thorns',
    name: 'Thorns',
    description: 'Reflects {value}% of damage taken',
    type: 'special',
    minValue: 10,
    maxValue: 25,
    isPercent: true,
    effect: 'thorns'
  },
  gold_find: {
    id: 'gold_find',
    name: 'Gold Find',
    description: '+{value}% Gold from expeditions',
    type: 'special',
    minValue: 5,
    maxValue: 20,
    isPercent: true,
    effect: 'gold_find'
  },
  magic_find: {
    id: 'magic_find',
    name: 'Magic Find',
    description: '+{value}% chance for better loot',
    type: 'special',
    minValue: 5,
    maxValue: 15,
    isPercent: true,
    effect: 'magic_find'
  },
  experience: {
    id: 'experience',
    name: 'Experience',
    description: '+{value}% XP gain',
    type: 'special',
    minValue: 10,
    maxValue: 25,
    isPercent: true,
    effect: 'experience'
  },
  speed: {
    id: 'speed',
    name: 'Speed',
    description: 'Expeditions complete {value}% faster',
    type: 'special',
    minValue: 5,
    maxValue: 15,
    isPercent: true,
    effect: 'speed'
  }
}

// Get trait by ID
export function getEquipmentTraitById(id: string): EquipmentTraitDef | undefined {
  return EQUIPMENT_TRAITS[id]
}

// Get all traits of a specific type
export function getEquipmentTraitsByType(type: EquipmentTraitDef['type']): EquipmentTraitDef[] {
  return Object.values(EQUIPMENT_TRAITS).filter(t => t.type === type)
}

// Get traits for a specific stat
export function getEquipmentTraitsForStat(stat: StatType): EquipmentTraitDef[] {
  return Object.values(EQUIPMENT_TRAITS).filter(t => t.stat === stat)
}

// Format trait description with value
export function formatTraitDescription(traitId: string, value: number): string {
  const trait = EQUIPMENT_TRAITS[traitId]
  if (!trait) return ''
  return trait.description.replace('{value}', value.toString())
}
