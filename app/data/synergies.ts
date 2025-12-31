import type { SynergyDefinition, SynergyTier } from '~~/types'

export const SYNERGIES: SynergyDefinition[] = [
  // === BASIC TIER (5-10%, always visible) ===
  {
    id: 'pack_tactics',
    name: 'Pack Tactics',
    description: 'Three or more Beasts fight as one',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['beast'],
      minCount: 3
    },
    effects: [{ type: 'power', value: 8, description: '+8% dungeon power' }]
  },
  {
    id: 'elemental_confluence',
    name: 'Elemental Confluence',
    description: 'Three or more monsters of the same element',
    tier: 'basic',
    requirement: {
      pattern: 'element_matching',
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 10, description: '+10% elemental loot' }]
  },
  {
    id: 'risen_horde',
    name: 'Risen Horde',
    description: 'The undead gather in numbers',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['undead'],
      minCount: 3
    },
    effects: [{ type: 'power', value: 8, description: '+8% dungeon power' }]
  },
  {
    id: 'forest_harmony',
    name: 'Forest Harmony',
    description: 'All monsters from the forest biome',
    tier: 'basic',
    requirement: {
      pattern: 'biome_harmony',
      biomes: ['forest']
    },
    effects: [{ type: 'drop_rate', value: 10, description: '+10% nature drops' }]
  },
  {
    id: 'dragons_presence',
    name: "Dragon's Presence",
    description: 'Dragons command respect',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['dragon'],
      minCount: 2
    },
    effects: [{ type: 'power', value: 8, description: '+8% dungeon power' }]
  },
  {
    id: 'construct_assembly',
    name: 'Construct Assembly',
    description: 'Mechanical beings work in unison',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['construct'],
      minCount: 3
    },
    effects: [{ type: 'drop_rate', value: 10, description: '+10% material drops' }]
  },

  // === INTERMEDIATE TIER (10-20%, revealed on first trigger) ===
  {
    id: 'wolf_pack',
    name: 'Wolf Pack',
    description: 'A true pack of wolves',
    tier: 'intermediate',
    requirement: {
      pattern: 'family_threshold',
      families: ['Wolf'],
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 15, description: '+15% crit gear drops' }]
  },
  {
    id: 'volatile_reaction',
    name: 'Volatile Reaction',
    description: 'Fire and ice create an unstable mix',
    tier: 'intermediate',
    requirement: {
      pattern: 'element_combo',
      requiredElements: ['fire', 'ice']
    },
    effects: [{ type: 'drop_rate', value: 15, description: '+15% rare drops' }]
  },
  {
    id: 'legion_of_bone',
    name: 'Legion of Bone',
    description: 'A dungeon filled only with the undead',
    tier: 'intermediate',
    requirement: {
      pattern: 'all_same_type',
      monsterTypes: ['undead'],
      minCount: 5
    },
    effects: [{ type: 'drop_rate', value: 20, description: '+20% bone materials' }]
  },
  {
    id: 'elemental_purity',
    name: 'Elemental Purity',
    description: 'All monsters share the same element',
    tier: 'intermediate',
    requirement: {
      pattern: 'element_matching',
      minCount: 4
    },
    effects: [{ type: 'loot_quality', value: 18, description: '+18% elemental loot quality' }]
  },
  {
    id: 'biome_dominance',
    name: 'Biome Dominance',
    description: 'All monsters from the same biome',
    tier: 'intermediate',
    requirement: {
      pattern: 'biome_harmony',
      minCount: 4
    },
    effects: [{ type: 'drop_rate', value: 15, description: '+15% zone materials' }]
  },
  {
    id: 'infernal_court',
    name: 'Infernal Court',
    description: 'Demons gather in strength',
    tier: 'intermediate',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['demon'],
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 18, description: '+18% demonic gear drops' }]
  },

  // === HIDDEN TIER (20-35%, discovered through experimentation) ===
  {
    id: 'draconic_inferno',
    name: 'Draconic Inferno',
    description: 'Fire dragons unleash devastating power',
    tier: 'hidden',
    requirement: {
      pattern: 'type_element',
      monsterTypes: ['dragon'],
      elements: ['fire'],
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 30, description: '+30% dragon hoard drops' }],
    hint: 'Dragons of flame are said to guard the greatest treasures...'
  },
  {
    id: 'twilight_paradox',
    name: 'Twilight Paradox',
    description: 'Shadow and holy create impossible power',
    tier: 'hidden',
    requirement: {
      pattern: 'opposites',
      requiredElements: ['shadow', 'holy']
    },
    effects: [{ type: 'loot_quality', value: 25, description: '+25% blessed/cursed gear' }],
    hint: 'The ancients combined shadow and holy for devastating effect...'
  },
  {
    id: 'apex_diversity',
    name: 'Apex Diversity',
    description: 'Every monster type represented',
    tier: 'hidden',
    requirement: {
      pattern: 'full_diversity',
      allDifferentTypes: true
    },
    effects: [{ type: 'drop_rate', value: 20, description: '+20% unique drops' }],
    hint: 'Some say variety is the spice of dungeon life...'
  },
  {
    id: 'elemental_mastery',
    name: 'Elemental Mastery',
    description: 'Four base elements in perfect balance',
    tier: 'hidden',
    requirement: {
      pattern: 'element_combo',
      requiredElements: ['fire', 'ice', 'lightning', 'nature']
    },
    effects: [{ type: 'drop_rate', value: 35, description: '+35% rare drops' }],
    hint: 'Master all four elements and the dungeon yields its secrets...'
  },
  {
    id: 'pack_alpha',
    name: 'Pack Alpha',
    description: 'Wolves follow a stronger leader',
    tier: 'hidden',
    requirement: {
      pattern: 'family_threshold',
      families: ['Wolf', 'Bear'],
      minCount: 5
    },
    effects: [{ type: 'loot_quality', value: 30, description: '+30% beast loot' }],
    hint: 'Wolves respect strength. A bear among them changes everything...'
  }
]

export function getSynergyById(id: string): SynergyDefinition | undefined {
  return SYNERGIES.find(s => s.id === id)
}

export function getSynergiesByTier(tier: SynergyTier): SynergyDefinition[] {
  return SYNERGIES.filter(s => s.tier === tier)
}

export function getVisibleSynergies(discoveredIds: string[] = []): SynergyDefinition[] {
  return SYNERGIES.filter(s =>
    s.tier === 'basic' ||
    s.tier === 'intermediate' && discoveredIds.includes(s.id)
  )
}

export function getHiddenSynergies(): SynergyDefinition[] {
  return SYNERGIES.filter(s => s.tier === 'hidden')
}
