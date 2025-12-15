import type { Rarity } from './base'
import type { TavernHero } from './hero'

// Tavern slot configuration
export interface TavernSlot {
  id: string
  rarity: Rarity | 'epic_plus'  // 'epic_plus' = epic or legendary
  hero: TavernHero | null
  isLocked: boolean
}

// Tavern state
export interface TavernState {
  slots: TavernSlot[]
  lockSlots: number         // How many heroes can be locked
  usedLockSlots: number
  lastRefreshAt: string
  nextRefreshAt: string
}

// Tavern progression (unlocks with account level)
export const TAVERN_PROGRESSION = {
  // Account level -> tavern configuration
  1: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
    ],
    lockSlots: 1,
  },
  5: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
    ],
    lockSlots: 1,
  },
  10: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'rare' as const },
    ],
    lockSlots: 2,
  },
  20: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'rare' as const },
      { rarity: 'rare' as const },
    ],
    lockSlots: 2,
  },
  30: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'rare' as const },
      { rarity: 'rare' as const },
      { rarity: 'epic_plus' as const },
    ],
    lockSlots: 3,
  },
}

// Recruitment costs by rarity
export const RECRUITMENT_COSTS: Record<Rarity, number> = {
  common: 100,
  uncommon: 250,
  rare: 500,
  epic: 1000,
  legendary: 5000,
}

// Refresh timing
export const TAVERN_REFRESH_HOURS = 8
