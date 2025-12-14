import type { Hero } from './hero'

export interface TavernHero extends Omit<Hero, 'playerId' | 'isFavorite' | 'isLocked' | 'isOnExpedition' | 'isStationed' | 'stationedZoneId' | 'equippedItems' | 'createdAt' | 'updatedAt'> {
  slotIndex: number
  cost: number
  isLocked: boolean
  lockExpiry?: string
}

export interface TavernState {
  slots: TavernHero[]
  lockSlots: number
  usedLockSlots: number
  lastRefreshAt: string
  nextFreeRefresh: string
  refreshCost: number
}

export interface RecruitmentCosts {
  common: number
  uncommon: number
  rare: number
  epic: number
  legendary: number
}

export interface TavernSettings {
  slotCount: number
  refreshCooldownMinutes: number
  lockSlotCost: number
  recruitmentCosts: RecruitmentCosts
}