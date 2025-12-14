import type { 
  Rarity, 
  Archetype, 
  Gender, 
  Culture, 
  Stats,
  MoraleState,
  HeroTrait,
  StoryTrait
} from './base'
import type { GameplayTraitDefinition, StoryTraitDefinition } from './traits'

export interface Hero {
  id: string
  playerId: string
  name: string
  rarity: Rarity
  archetype: Archetype
  gender: Gender
  culture: Culture
  
  // Visual
  portrait: string
  
  // Stats
  level: number
  xp: number
  baseStats: Stats
  currentStats: Stats
  
  // Traits
  gameplayTraits: HeroTrait[]
  storyTraits: StoryTrait[]
  
  // Progression
  prestigeLevel: number
  prestigeBonuses: Stats
  
  // State
  isFavorite: boolean
  isLocked: boolean
  
  // Morale tracking
  morale: MoraleState
  moraleLastUpdate: string
  
  // Active status
  isOnExpedition: boolean
  isStationed: boolean
  stationedZoneId: string | null
  
  // Equipment
  equippedItems: Record<string, string> // slotId -> equipmentId
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface GuildMaster {
  id: string
  playerId: string
  name: string
  level: number
  xp: number
  
  // Equipped traits
  equippedTraits: string[]
  
  // Progression
  prestigeLevel: number
  prestigePoints: number
  
  // Metadata
  createdAt: string
  updatedAt: string
}