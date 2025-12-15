import type { StatType } from './base'

export interface Title {
  id: string
  name: string              // "the Dragonslayer"
  rarity: 'uncommon' | 'rare' | 'epic' | 'legendary'
  source: 'zone_mastery' | 'achievement' | 'story_trait' | 'difficulty' | 'prestige' | 'secret'
  condition: TitleCondition
  bonus?: {
    stat?: StatType
    value?: number
    context?: string  // "in forest zones"
    description: string
  }
}

export interface TitleCondition {
  type: 'zone_completion' | 'monster_kills' | 'monster_captures' |
        'difficulty_clear' | 'story_trait' | 'prestige' | 'secret'
  target?: string
  count?: number
}

export interface EarnedTitle {
  id: string
  titleId: string
  heroId?: string // If hero-specific
  earnedAt: string
}