import type { LogRarity } from './expedition'
import type { ZoneType } from './base'
import type { EquipmentRarity } from './base'

// Log entry types
export type LogEntryType = 'departure' | 'travel' | 'combat' | 'event' | 'loot' | 'return'

// Trait reaction definition
export interface TraitReaction {
  traitId: string

  triggers: {
    entryTypes?: LogEntryType[]
    eventIds?: string[]
    lootRarity?: EquipmentRarity[]
    zoneTypes?: ZoneType[]
    outcome?: 'success' | 'failure' | 'any'
  }

  // Reaction text variations - {hero} replaced with hero name
  reactions: string[]

  // Probability this trait reacts when triggered (0.0 - 1.0)
  triggerChance: number

  // How much to boost entry rarity (0, 1, or 2 tiers)
  rarityBoost: 0 | 1 | 2
}

// Special pair reactions for trait combos
export interface TraitPairReaction {
  traitIds: [string, string]

  triggers: {
    entryTypes?: LogEntryType[]
    eventIds?: string[]
  }

  // {hero1} has first trait, {hero2} has second
  reactions: string[]

  triggerChance: number
  rarityBoost: 1 | 2
}

// Template variables available
export interface TemplateVariables {
  // Zone context
  zoneName: string
  zoneType: string
  subzoneName: string

  // Heroes - random selection
  randomHero: string
  anotherHero: string
  leaderHero: string

  // Heroes - role-based
  tankHero: string
  healerHero: string
  scoutHero: string
  casterHero: string

  // Combat
  enemyName: string
  enemyCount: string
  enemyPack: string

  // Loot
  itemName: string
  itemRarity: string
  goldAmount: string

  // Atmosphere
  timeOfDay: string
  weather: string
}

// Log template definition
export interface LogTemplate {
  id: string
  type: LogEntryType

  conditions?: {
    zoneTypes?: ZoneType[]
    subzoneIds?: string[]
    minMastery?: number
    requiresTags?: string[]
    eventOutcome?: 'success' | 'failure' | 'any'
  }

  templates: string[]
  baseRarity: LogRarity
  weight?: number
}

// Hero reaction in log
export interface HeroReaction {
  heroId: string
  heroName: string
  traitId: string
  text: string
  rarityBoost: number
}

// AI enhancement types
export type AITrigger =
  | 'legendary_loot'
  | 'secret_discovery'
  | 'story_hook_start'
  | 'story_hook_payoff'
  | 'boss_first_kill'
  | 'trait_synergy'

export interface AILogRequest {
  trigger: AITrigger
  zone: { name: string; type: string; subzone: string }
  heroes: { name: string; traits: string[] }[]
  triggerDetails: {
    itemName?: string
    bossName?: string
    discoveryName?: string
    hookName?: string
    synergyTraits?: string[]
  }
  previousEntries: string[]
  tone: 'lighthearted_fantasy'
}

export interface AILogResponse {
  text: string
  heroReactions?: { heroName: string; text: string }[]
}
