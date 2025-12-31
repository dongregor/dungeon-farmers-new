import type { SchematicDefinition, Rarity } from '~~/types'

export const SCHEMATICS: SchematicDefinition[] = [
  // === COMMON (3-4 slots, 0 themed, 0 affixes) ===
  {
    id: 'basic_cave',
    name: 'Simple Cave',
    description: 'A basic cave dungeon',
    rarity: 'common',
    theme: 'cave',
    biome: 'cave',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: 'any' },
      { id: 'slot2', position: 2, allowedTypes: 'any' },
      { id: 'slot3', position: 3, allowedTypes: 'any' }
    ],
    affixes: [],
    baseDuration: 120,
    baseRewards: { goldMin: 50, goldMax: 100, xpMin: 20, xpMax: 40 }
  },
  {
    id: 'basic_forest',
    name: 'Forest Clearing',
    description: 'A clearing in the woods',
    rarity: 'common',
    theme: 'forest',
    biome: 'forest',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['beast'] },
      { id: 'slot2', position: 2, allowedTypes: 'any' },
      { id: 'slot3', position: 3, allowedTypes: 'any' }
    ],
    affixes: [],
    baseDuration: 90,
    baseRewards: { goldMin: 40, goldMax: 80, xpMin: 25, xpMax: 45 }
  },

  // === UNCOMMON (4-5 slots, 0 themed, 1 affix) ===
  {
    id: 'goblin_hideout',
    name: 'Goblin Hideout',
    description: 'A cave system overrun by goblins',
    rarity: 'uncommon',
    theme: 'cave',
    biome: 'cave',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['humanoid'] },
      { id: 'slot2', position: 2, allowedTypes: ['humanoid'] },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'quick_clear',
        category: 'efficiency',
        name: 'Quick Clear',
        description: 'Faster completion time',
        effect: { type: 'duration_reduction', value: 15 }
      }
    ],
    baseDuration: 150,
    baseRewards: { goldMin: 80, goldMax: 150, xpMin: 40, xpMax: 70 }
  },
  {
    id: 'beast_den',
    name: 'Beast Den',
    description: 'A lair of wild creatures',
    rarity: 'uncommon',
    theme: 'forest',
    biome: 'forest',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['beast'] },
      { id: 'slot2', position: 2, allowedTypes: ['beast'] },
      { id: 'slot3', position: 3, allowedTypes: ['beast'] },
      { id: 'slot4', position: 4, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'beast_bonus',
        category: 'monster_specific',
        name: 'Primal Grounds',
        description: 'Beasts are stronger here',
        effect: { type: 'monster_power', value: 10, condition: 'type:beast' }
      }
    ],
    baseDuration: 120,
    baseRewards: { goldMin: 70, goldMax: 130, xpMin: 35, xpMax: 65 }
  },

  // === RARE (5-6 slots, 1 themed, 1 affix) ===
  {
    id: 'undead_crypt',
    name: 'Haunted Crypt',
    description: 'An ancient burial ground',
    rarity: 'rare',
    theme: 'crypt',
    biome: 'ruins',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['undead'] },
      { id: 'slot2', position: 2, allowedTypes: ['undead'] },
      { id: 'slot3', position: 3, allowedTypes: ['undead'] },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      {
        id: 'slot5',
        position: 5,
        allowedTypes: ['undead'],
        themed: { type: 'monster_type', value: 'undead', bonusPercent: 20, bonusType: 'power' }
      }
    ],
    affixes: [
      {
        id: 'bone_harvest',
        category: 'loot',
        name: 'Bone Harvest',
        description: 'Increased bone material drops',
        effect: { type: 'material_bonus', value: 15, condition: 'material:bone' }
      }
    ],
    baseDuration: 180,
    baseRewards: { goldMin: 120, goldMax: 220, xpMin: 60, xpMax: 100 }
  },
  {
    id: 'volcanic_cave',
    name: 'Volcanic Cavern',
    description: 'A cave near molten rock',
    rarity: 'rare',
    theme: 'volcano',
    biome: 'mountain',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['elemental', 'dragon'] },
      { id: 'slot2', position: 2, allowedTypes: 'any' },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      {
        id: 'slot5',
        position: 5,
        allowedTypes: 'any',
        requiredElements: ['fire'],
        themed: { type: 'element', value: 'fire', bonusPercent: 20, bonusType: 'loot' }
      }
    ],
    affixes: [
      {
        id: 'fire_attunement',
        category: 'amplifier',
        name: 'Fire Attunement',
        description: 'Fire synergies are amplified',
        effect: { type: 'synergy_amplifier', value: 50 },
        amplifies: { synergyType: 'element', synergyValue: 'fire', multiplier: 1.5 }
      }
    ],
    baseDuration: 200,
    baseRewards: { goldMin: 150, goldMax: 280, xpMin: 70, xpMax: 120 }
  },

  // === EPIC (7-8 slots, 2 themed, 1-2 affixes) ===
  {
    id: 'infernal_pit',
    name: 'Infernal Pit',
    description: 'A rift to the demon realm',
    rarity: 'epic',
    theme: 'infernal',
    biome: 'ruins',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['demon'],
        themed: { type: 'monster_type', value: 'demon', bonusPercent: 20, bonusType: 'power' }
      },
      { id: 'slot2', position: 2, allowedTypes: ['demon', 'undead'] },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      {
        id: 'slot6',
        position: 6,
        allowedTypes: 'any',
        requiredElements: ['fire', 'shadow'],
        themed: { type: 'element', value: 'fire', bonusPercent: 15, bonusType: 'loot' }
      },
      { id: 'slot7', position: 7, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'infernal_amplifier',
        category: 'amplifier',
        name: 'Demonic Surge',
        description: 'Demon synergies amplified',
        effect: { type: 'synergy_amplifier', value: 50 },
        amplifies: { synergyType: 'type', synergyValue: 'demon', multiplier: 1.5 }
      },
      {
        id: 'hellfire_speed',
        category: 'efficiency',
        name: 'Hellfire Efficiency',
        description: 'Faster completion',
        effect: { type: 'duration_reduction', value: 20 }
      }
    ],
    baseDuration: 240,
    baseRewards: { goldMin: 250, goldMax: 450, xpMin: 100, xpMax: 180 }
  },
  {
    id: 'dragon_roost',
    name: 'Dragon Roost',
    description: 'A mountain peak claimed by dragons',
    rarity: 'epic',
    theme: 'mountain',
    biome: 'mountain',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['dragon'],
        themed: { type: 'monster_type', value: 'dragon', bonusPercent: 25, bonusType: 'power' }
      },
      { id: 'slot2', position: 2, allowedTypes: ['dragon'] },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      {
        id: 'slot6',
        position: 6,
        allowedTypes: 'any',
        themed: { type: 'element', value: 'fire', bonusPercent: 15, bonusType: 'loot' }
      },
      { id: 'slot7', position: 7, allowedTypes: ['beast', 'humanoid'] },
      { id: 'slot8', position: 8, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'dragon_hoard',
        category: 'loot',
        name: 'Dragon Hoard',
        description: 'Increased gold and rare drops',
        effect: { type: 'gold_bonus', value: 30 }
      }
    ],
    baseDuration: 300,
    baseRewards: { goldMin: 300, goldMax: 550, xpMin: 120, xpMax: 200 }
  },

  // === LEGENDARY (9-10 slots, 2-3 themed, 2 affixes) ===
  {
    id: 'elemental_nexus',
    name: 'Elemental Nexus',
    description: 'Where all elements converge',
    rarity: 'legendary',
    theme: 'arcane',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['elemental'],
        themed: { type: 'monster_type', value: 'elemental', bonusPercent: 25, bonusType: 'power' }
      },
      {
        id: 'slot2',
        position: 2,
        allowedTypes: 'any',
        requiredElements: ['fire'],
        themed: { type: 'element', value: 'fire', bonusPercent: 20, bonusType: 'loot' }
      },
      {
        id: 'slot3',
        position: 3,
        allowedTypes: 'any',
        requiredElements: ['ice'],
        themed: { type: 'element', value: 'ice', bonusPercent: 20, bonusType: 'loot' }
      },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      { id: 'slot6', position: 6, allowedTypes: 'any' },
      { id: 'slot7', position: 7, allowedTypes: 'any' },
      { id: 'slot8', position: 8, allowedTypes: 'any' },
      { id: 'slot9', position: 9, allowedTypes: ['elemental', 'dragon'] }
    ],
    affixes: [
      {
        id: 'elemental_mastery_amp',
        category: 'amplifier',
        name: 'Elemental Mastery',
        description: 'All element synergies amplified',
        effect: { type: 'synergy_amplifier', value: 75 },
        amplifies: { synergyType: 'element', multiplier: 1.75 }
      },
      {
        id: 'arcane_efficiency',
        category: 'efficiency',
        name: 'Arcane Flow',
        description: 'Much faster completion',
        effect: { type: 'duration_reduction', value: 25 }
      }
    ],
    baseDuration: 360,
    baseRewards: { goldMin: 500, goldMax: 900, xpMin: 200, xpMax: 350 }
  },
  {
    id: 'abyssal_throne',
    name: 'Abyssal Throne',
    description: 'The seat of an ancient demon lord',
    rarity: 'legendary',
    theme: 'abyss',
    biome: 'ruins',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['demon'],
        themed: { type: 'monster_type', value: 'demon', bonusPercent: 30, bonusType: 'power' }
      },
      {
        id: 'slot2',
        position: 2,
        allowedTypes: ['demon', 'aberration'],
        themed: { type: 'element', value: 'shadow', bonusPercent: 25, bonusType: 'loot' }
      },
      { id: 'slot3', position: 3, allowedTypes: ['demon', 'undead'] },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      { id: 'slot6', position: 6, allowedTypes: 'any' },
      { id: 'slot7', position: 7, allowedTypes: 'any' },
      {
        id: 'slot8',
        position: 8,
        allowedTypes: 'any',
        themed: { type: 'element', value: 'fire', bonusPercent: 20, bonusType: 'loot' }
      },
      { id: 'slot9', position: 9, allowedTypes: 'any' },
      { id: 'slot10', position: 10, allowedTypes: ['demon', 'dragon'] }
    ],
    affixes: [
      {
        id: 'abyssal_power',
        category: 'amplifier',
        name: 'Abyssal Power',
        description: 'Demon and shadow synergies doubled',
        effect: { type: 'synergy_amplifier', value: 100 },
        amplifies: { synergyType: 'type', synergyValue: 'demon', multiplier: 2.0 }
      },
      {
        id: 'dark_harvest',
        category: 'loot',
        name: 'Dark Harvest',
        description: 'Greatly increased rare drops',
        effect: { type: 'rare_bonus', value: 40 }
      }
    ],
    baseDuration: 400,
    baseRewards: { goldMin: 600, goldMax: 1100, xpMin: 250, xpMax: 400 }
  }
]

export function getSchematicById(id: string): SchematicDefinition | undefined {
  return SCHEMATICS.find(s => s.id === id)
}

export function getSchematicsByRarity(rarity: Rarity): SchematicDefinition[] {
  return SCHEMATICS.filter(s => s.rarity === rarity)
}

export function getSchematicsByBiome(biome: string): SchematicDefinition[] {
  return SCHEMATICS.filter(s => s.biome === biome)
}
