import type { Monster, MonsterType, Element } from '~~/types'

export const MONSTERS: Monster[] = [
  {
    id: 'forest_wolf',
    baseName: 'Forest Wolf',
    type: 'beast',
    family: 'Wolf',
    element: 'physical',
    packType: 'trash',
    biome: 'forest',
    basePower: 20,
    baseCaptureChance: 0.3,
    lootTable: [
      { itemId: 'wolf_pelt', itemType: 'material', weight: 80, dropChance: 0.6 },
      { itemId: 'sharp_fang', itemType: 'material', weight: 20, dropChance: 0.3 }
    ]
  },
  {
    id: 'goblin_scout',
    baseName: 'Goblin Scout',
    type: 'humanoid',
    family: 'Goblin',
    element: 'physical',
    packType: 'trash',
    biome: 'cave',
    basePower: 15,
    baseCaptureChance: 0.2,
    lootTable: [
      { itemId: 'rusty_dagger', itemType: 'equipment', weight: 40, dropChance: 0.15 },
      { itemId: 'goblin_ear', itemType: 'material', weight: 60, dropChance: 0.4 }
    ]
  },
  {
    id: 'goblin_archer',
    baseName: 'Goblin Archer',
    type: 'humanoid',
    family: 'Goblin',
    element: 'physical',
    packType: 'trash',
    biome: 'cave',
    basePower: 18,
    baseCaptureChance: 0.2,
    lootTable: [
      { itemId: 'crude_bow', itemType: 'equipment', weight: 30, dropChance: 0.12 },
      { itemId: 'poison_arrow', itemType: 'material', weight: 50, dropChance: 0.25 },
      { itemId: 'goblin_ear', itemType: 'material', weight: 20, dropChance: 0.3 }
    ]
  },
  {
    id: 'swamp_toad',
    baseName: 'Giant Swamp Toad',
    type: 'beast',
    family: 'Amphibian',
    element: 'nature',
    packType: 'elite',
    biome: 'swamp',
    basePower: 35,
    baseCaptureChance: 0.15,
    lootTable: [
      { itemId: 'toxic_gland', itemType: 'material', weight: 70, dropChance: 0.5 },
      { itemId: 'swamp_hide', itemType: 'material', weight: 30, dropChance: 0.35 }
    ]
  }
]

export function getMonsterById(id: string): Monster | undefined {
  return MONSTERS.find(monster => monster.id === id)
}

export function getMonstersByFamily(family: string): Monster[] {
  return MONSTERS.filter(monster => monster.family === family)
}

export function getMonstersByBiome(biome: string): Monster[] {
  return MONSTERS.filter(monster => monster.biome === biome)
}

export function getMonstersByType(type: MonsterType): Monster[] {
  return MONSTERS.filter(monster => monster.type === type)
}

export function getMonstersByElement(element: Element): Monster[] {
  return MONSTERS.filter(monster => monster.element === element)
}
