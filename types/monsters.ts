import type { Rarity, Stats } from './base'

export interface Monster {
  id: string
  name: string
  description: string
  rarity: Rarity
  
  // Stats
  baseStats: Stats
  
  // Threats
  threats: string[]
  
  // Loot
  lootTableId: string
  
  // Spawn info
  spawnZones: string[]
  spawnWeight: number
  
  // Capture (Phase 2)
  isCapturable: boolean
  captureRate: number
}

export interface MonsterFamily {
  id: string
  name: string
  description: string
  members: string[]
}

export interface MonsterPack {
  id: string
  name: string
  type: 'trash' | 'elite' | 'miniboss' | 'boss'
  members: MonsterPackMember[]
}

export interface MonsterPackMember {
  monsterId: string
  count: number
  weight: number
}