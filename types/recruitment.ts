import type { Rarity } from './base'
import type { TavernHero } from './hero'

// Slot rarity (includes special 'epic_plus' for high-tier weighted slots)
export type SlotRarity = Rarity | 'epic_plus'

// Tavern slot (one hero available for recruitment)
export interface TavernSlot {
  index: number
  hero: TavernHero | null
  rarity: SlotRarity
  isLocked: boolean
  lockedUntil?: string // ISO timestamp
}

// Tavern state (all available slots)
export interface Tavern {
  slots: TavernSlot[]
  lastRefresh: string // ISO timestamp
  refreshCost: number // Gold cost to refresh
  lockCost: number    // Gold cost to lock a slot
}

// Tavern state
export interface TavernState {
  slots: TavernSlot[]
  lockSlots: number         // How many heroes can be locked
  usedLockSlots: number
  lastRefreshAt: string
  nextRefreshAt: string
  paidRefreshesSinceFree: number  // Counter for incremental cost calculation
  nextRefreshCost: number         // Pre-calculated cost for next paid refresh
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

// Manual refresh costs (early refresh before timer)
export const TAVERN_MANUAL_REFRESH_BASE_COST = 75
export const TAVERN_MANUAL_REFRESH_INCREMENT = 25 // Per paid refresh since last free

// Calculate refresh cost based on how many paid refreshes since last free
export function calculateRefreshCost(paidRefreshesSinceFree: number): number {
  return TAVERN_MANUAL_REFRESH_BASE_COST + (paidRefreshesSinceFree * TAVERN_MANUAL_REFRESH_INCREMENT)
}

// Recruitment request
export interface RecruitmentRequest {
  slotIndex: number
  lockSlot?: boolean
}
