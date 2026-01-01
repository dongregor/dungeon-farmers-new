import type { Stats } from './base'
import type { Equipment } from './equipment'

// Log entry rarity tiers
export type LogRarity = 'common' | 'standard' | 'noteworthy' | 'memorable' | 'epic' | 'legendary'

export const RARITY_ORDER: LogRarity[] = ['common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary']

export const RARITY_COLORS: Record<LogRarity, string> = {
  common: 'text-gray-500',
  standard: 'text-gray-200',
  noteworthy: 'text-green-400',
  memorable: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-orange-400'
}

export type ExpeditionStatus = 'idle' | 'in_progress' | 'completed' | 'failed' | 'waiting_choices'

// Expedition settings (reused in Expedition interface)
export interface ExpeditionSettings {
  autoRepeat: boolean
  autoRepeatLimit?: number    // Max repeats (null = unlimited)
  stopConditions: {
    anyHeroTired: boolean     // Stop if any hero hits Tired
    inventoryFull: boolean    // Stop if inventory full
    resourceCap: boolean      // Stop if gold cap reached
  }
}

export interface Expedition extends ExpeditionSettings {
  id: string
  playerId: string

  // Location
  zoneId: string
  subzoneId: string

  // Party
  heroIds: string[]
  teamPower: number  // Calculated total power of party

  // Timing
  startedAt: string      // ISO timestamp
  completesAt: string    // ISO timestamp
  durationMinutes: number
  status: ExpeditionStatus

  // Events
  events: ExpeditionEvent[]
  pendingChoices: ExpeditionEvent[]

  // Results (populated on completion)
  efficiency?: number  // Calculated efficiency (60-150%)
  rewards?: ExpeditionRewards
  log?: ExpeditionLog

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Expedition rewards
export interface ExpeditionRewards {
  gold: number
  xp: number
  equipment: string[] // Equipment IDs
  materials: Record<string, number> // Material type -> quantity
  familiarityGain: number
  masteryGain: number
}

// Expedition event types
export type ExpeditionEventType =
  | 'flavor'
  | 'skill_check'
  | 'choice'
  | 'rare'
  | 'story_hook'
  | 'injury'

export interface ExpeditionEvent {
  id: string
  type: ExpeditionEventType
  timestamp: string // ISO timestamp

  // Event-specific data
  data: {
    // Flavor
    text?: string

    // Skill check
    stat?: 'combat' | 'utility' | 'survival'
    difficulty?: number
    passed?: boolean

    // Choice
    prompt?: string
    options?: ChoiceOption[]
    selectedOption?: number

    // Rare
    rarity?: string
    reward?: any

    // Story hook
    hookId?: string
    unlocked?: string[]

    // Injury
    heroId?: string
    severity?: 'minor' | 'major' | 'severe'

    // Story hook progress
    hookProgress?: StoryHookProgress
  }
}

// Story Hook
export interface StoryHook {
  id: string
  name: string
  type: 'immediate' | 'collection' | 'delayed' | 'conditional'
  triggeredBy: string
  triggeredHeroId: string
  progress: StoryHookProgress
  completion: StoryHookReward
}

export type StoryHookProgress =
  | { type: 'immediate', ready: true }
  | { type: 'collection', current: number, required: number, itemName: string }
  | { type: 'delayed', expeditionsRemaining: number }
  | { type: 'conditional', condition: string, met: boolean }

export interface StoryHookReward {
  unlockSubzone?: string
  unlockMonster?: string
  grantTitle?: string
  grantStoryTrait?: string
  grantEquipment?: string
  grantGold?: number
  specialText: string
}

// Hero Injury
export interface HeroInjury {
  heroId: string
  type: 'sprain' | 'poison' | 'curse' | 'exhaustion'
  statPenalty: Partial<Stats>
  expiresAfterExpeditions: number  // Heals after X resting
  cureCost?: {
    gold?: number
    healerTag?: boolean  // Party member with Healer can cure
  }
}

export interface ChoiceOption {
  id: number
  text: string
  outcome: string
}

// Expedition log (generated on completion)
export interface ExpeditionLog {
  summary: {
    duration: string
    efficiency: string
    rewards: {
      gold: number
      xp: number
      itemCount: number
      rareItems: string[]
      familiarityGain: number
      masteryGain: number
    }
  }
  sections: LogSection[]
}

export interface LogSection {
  type: 'departure' | 'travel' | 'encounter' | 'discovery' | 'return'
  title: string
  entries: LogEntry[]
}

export interface LogEntry {
  text: string
  heroId?: string
  traitId?: string
  eventId?: string
  type: 'narrative' | 'reaction' | 'combat' | 'loot' | 'choice_result'
  rarity?: LogRarity  // Optional rarity tier for this entry
  rarityBoost?: number  // How much this entry boosted rarity
}

// Pending Loot
export interface PendingLoot {
  expeditionId: string
  items: Equipment[]
  expiresAt: string    // 48 hours to claim
}