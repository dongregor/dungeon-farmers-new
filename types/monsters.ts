import type { ZoneType, MonsterType, Element } from './base'

export interface Monster {
  id: string
  baseName: string
  type: MonsterType             // broad category (beast, undead, etc.)
  family: string                // specific group (Wolf, Slime, etc.)
  element: Element              // magical affinity
  packType: 'trash' | 'elite' | 'miniboss' | 'boss'
  biome: ZoneType
  basePower: number
  baseCaptureChance: number
  lootTable: MonsterLootEntry[]
}

export interface MonsterLootEntry {
  itemId: string
  itemType: 'equipment' | 'material'
  weight: number
  dropChance: number
}

// Re-export MonsterSpawn from zones for convenience
export type { MonsterSpawn } from './zones'

export interface MonsterPack {
  monsters: Monster[]
  totalThreats: string[]
}
