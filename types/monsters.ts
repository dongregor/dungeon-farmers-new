import type { ZoneType } from './base'

export interface Monster {
  id: string
  baseName: string           // "Slime"
  family: string             // "Ooze"
  packType: 'trash' | 'elite' | 'miniboss' | 'boss'
  biome: ZoneType            // For dungeon synergy (Phase 2)
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
