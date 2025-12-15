import type {
  Rarity, Stats, Archetype, Culture, Gender, EquipmentSlot,
  MoraleState
} from './base'
import type { ArchetypeTag } from './archetypes'
import type { HeroGameplayTrait, StoryTrait } from './traits'

// Hero definition
export interface Hero {
  id: string

  // Identity
  name: string
  gender: Gender
  culture: Culture
  titles: string[]         // Earned titles
  displayTitle: string | null  // Currently displayed title

  // Classification
  rarity: Rarity
  archetype: Archetype
  archetypeTags: ArchetypeTag[]

  // Stats
  baseStats: Stats
  level: number
  xp: number
  xpToNextLevel: number

  // Traits
  gameplayTraits: HeroGameplayTrait[]
  storyTraitIds: string[]

  // Calculated power (cached)
  power: number

  // Equipment (slot -> equipment id)
  equipment: Partial<Record<EquipmentSlot, string>>

  // Prestige
  prestigeLevel: number
  prestigeBonuses: Stats  // Permanent stat bonuses from prestige

  // State
  currentExpeditionId: string | null
  isFavorite: boolean

  // Morale tracking
  morale: MoraleState
  moraleLastUpdate: string
  
  // Active status
  isOnExpedition: boolean
  isStationed: boolean
  stationedZoneId: string | null

  // Timestamps
  createdAt: string
  updatedAt: string
}

// The Guild Master (player's character) - different from regular heroes
export interface GuildMaster {
  id: string

  // Identity (set by player)
  name: string
  gender: Gender

  // Always legendary
  rarity: 'legendary'

  // Player chooses archetype at milestones
  archetype: Archetype | null
  archetypeTags: ArchetypeTag[]

  // Stats (scales with account progress)
  baseStats: Stats
  level: number

  // Equippable traits (swappable)
  equippedTraitIds: string[]
  maxEquippedTraits: number

  // Unlocked traits (pool to equip from)
  unlockedTraitIds: string[]

  // Unique properties
  leaderBonus: number      // % buff to party when leading
  mentorBonus: number      // % XP boost to party members

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Tavern hero (available for recruitment)
export interface TavernHero extends Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt' | 'isOnExpedition' | 'isStationed' | 'stationedZoneId' | 'morale' | 'moraleLastUpdate'> {
  recruitCost: number
  isLocked: boolean
  expiresAt: string  // When this hero leaves the tavern
}

// Hero generation input
export interface HeroGenerationOptions {
  forceRarity?: Rarity
  forceArchetype?: Archetype
  forceCulture?: Culture
  forceGender?: Gender
}

// Party preset
export interface PartyPreset {
  id: string
  name: string
  heroIds: string[]
  createdAt: string
}
