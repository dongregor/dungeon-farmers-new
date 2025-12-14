import type { ZoneType, ZoneDifficulty } from './base'

export interface Zone {
  id: string
  name: string
  description: string
  type: ZoneType

  // Unlock
  unlockRequirement: {
    minPower?: number
    previousZoneId?: string
  }

  // Content
  subzones: Subzone[]

  // Progress
  familiarity: number
  isUnlocked: boolean
  isMastered: boolean
}

export interface Subzone {
  id: string
  name: string
  description: string

  // Discovery
  discoveryWeight: number
  requiredZoneFamiliarity: number
  isDiscovered: boolean

  // Content
  difficulty: ZoneDifficulty
  threats: string[]

  // Progress
  mastery: number

  // Rewards
  baseDuration: number // minutes
  baseGold: number
  baseXp: number
}