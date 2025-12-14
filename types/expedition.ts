import type { Hero } from './hero'

export type ExpeditionStatus = 'in_progress' | 'waiting_choices' | 'completed' | 'failed'

export interface Expedition {
  id: string
  playerId: string
  zoneId: string
  subzoneId: string
  heroIds: string[]
  teamPower: number
  status: ExpeditionStatus
  startedAt: string
  completesAt: string
  durationMinutes: number
  
  // Auto-repeat settings
  autoRepeat: boolean
  autoRepeatLimit?: number
  stopConditions: {
    anyHeroTired: boolean
    inventoryFull: boolean
    resourceCap: boolean
  }
  
  // Events
  events: ExpeditionEvent[]
  pendingChoices: ExpeditionEvent[]
  
  // Results
  efficiency?: number
  rewards?: ExpeditionRewards
  log?: ExpeditionLog
}

export interface ExpeditionEvent {
  id: string
  type: 'flavor' | 'skill_check' | 'choice' | 'rare'
  title: string
  description: string
  timestamp: string
  
  // For skill checks
  statType?: 'combat' | 'utility' | 'survival'
  difficulty?: number
  success?: boolean
  
  // For choices
  choices?: ExpeditionChoice[]
  selectedChoice?: string
  
  // Trait reactions
  traitReactions?: TraitReaction[]
}

export interface ExpeditionChoice {
  id: string
  description: string
  statRequirements?: Partial<Record<'combat' | 'utility' | 'survival', number>>
  outcomes: ChoiceOutcome[]
}

export interface ChoiceOutcome {
  success: boolean
  description: string
  rewards?: Partial<ExpeditionRewards>
  penalties?: Partial<ExpeditionRewards>
}

export interface TraitReaction {
  heroId: string
  traitId: string
  reactionText: string
}

export interface ExpeditionRewards {
  gold: number
  xp: number
  items: ExpeditionItem[]
  titles?: string[]
  discoveries?: string[]
}

export interface ExpeditionItem {
  id: string
  type: 'equipment' | 'consumable' | 'material'
  rarity: string
  quantity: number
}

export interface ExpeditionLog {
  sections: LogSection[]
  summary: LogSummary
}

export interface LogSection {
  title: string
  entries: LogEntry[]
}

export interface LogEntry {
  text: string
  isImportant?: boolean
  traitReactions?: TraitReaction[]
}

export interface LogSummary {
  duration: string
  efficiency: string
  rewards: string
  notableEvents: string[]
}