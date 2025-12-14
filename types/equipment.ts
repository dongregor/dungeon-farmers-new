import type { EquipmentRarity, EquipmentSlot, Stats } from './base'

export interface Equipment {
  id: string
  playerId: string
  name: string
  description: string
  slot: EquipmentSlot
  rarity: EquipmentRarity
  itemLevel: number
  
  // Stats
  baseStats: Stats
  currentStats: Stats
  
  // Traits
  traits: EquipmentTrait[]
  maxTraits: number
  
  // Set
  setId?: string
  
  // State
  equippedHeroId?: string
  isLocked: boolean
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface EquipmentTrait {
  id: string
  value: number
  quality: 'normal' | 'magic' | 'perfect'
}

export interface EquipmentSet {
  id: string
  name: string
  description: string
  bonuses: {
    twoPieces?: Stats
    fourPieces?: Stats
    sixPieces?: Stats
  }
}

export interface LootTable {
  id: string
  zoneId: string
  subzoneId: string
  items: LootTableItem[]
}

export interface LootTableItem {
  id: string
  weight: number
  minQuantity: number
  maxQuantity: number
}