import type { StatType, TraitQuality } from './base'

export interface GameplayTraitDefinition {
  id: string
  name: string
  description: string
  statType: StatType
  minValue: number
  maxValue: number
  isNegative: boolean
  qualityMultipliers: Record<TraitQuality, number>
  reactions: string[]
}

export interface StoryTraitDefinition {
  id: string
  name: string
  description: string
  reactions: string[]
  titleUnlocks: string[]
}

export interface HeroTrait {
  traitId: string
  rolledValue: number
  quality: TraitQuality
}

export interface StoryTrait {
  traitId: string
}