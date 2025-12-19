import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  calculateOfflineProgress,
  calculateHoursOffline,
  formatOfflineDuration,
} from '~/utils/offlineProgress'
import type { Hero, Expedition, Zone } from '~~/types'

// Mock dependencies
vi.mock('~/utils/expeditionEngine', () => ({
  completeExpedition: vi.fn((expedition, heroes, zone, subzone) => ({
    ...expedition,
    status: 'completed',
    rewards: {
      gold: 100,
      xp: 50,
      equipment: [],
      materials: [],
    },
  })),
}))

vi.mock('~/utils/moraleService', () => ({
  calculateMoraleRecovery: vi.fn((hero) => {
    const now = new Date()
    const lastUpdate = new Date(hero.moraleLastUpdate)
    const hoursRested = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)
    )

    if (hoursRested === 0) {
      return {
        morale: hero.morale,
        moraleValue: hero.moraleValue,
        hoursRested: 0,
      }
    }

    const recovery = hoursRested * 5 // +5 per hour
    const newValue = Math.min(100, hero.moraleValue + recovery)

    return {
      morale: newValue >= 80 ? 'excited' : newValue >= 60 ? 'content' : 'tired',
      moraleValue: newValue,
      hoursRested,
    }
  }),
}))

// Test helpers
function createTestHero(overrides: Partial<Hero> = {}): Hero {
  return {
    id: 'hero-1',
    name: 'Test Hero',
    gender: 'male',
    culture: 'forest-folk',
    titles: [],
    displayTitle: null,
    rarity: 'common',
    archetype: 'warrior',
    archetypeTags: ['melee', 'tank'],
    baseStats: { combat: 5, utility: 3, survival: 4 },
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gameplayTraits: [],
    storyTraitIds: [],
    power: 50,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
    currentExpeditionId: null,
    isFavorite: false,
    morale: 'content',
    moraleValue: 70,
    moraleLastUpdate: new Date().toISOString(),
    isOnExpedition: false,
    isStationed: false,
    stationedZoneId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

function createTestExpedition(overrides: Partial<Expedition> = {}): Expedition {
  const now = new Date()
  return {
    id: 'exp-1',
    playerId: 'player-1',
    zoneId: 'verdant_woods',
    subzoneId: 'woods_edge',
    heroIds: ['hero-1'],
    status: 'in_progress',
    startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    completesAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago (completed)
    durationMinutes: 60,
    efficiency: 100,
    autoRepeat: false,
    stopConditions: {
      inventoryFull: false,
      anyHeroTired: false,
      resourceCap: false,
    },
    events: [],
    pendingChoices: [],
    rewards: null,
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    ...overrides,
  }
}

function createTestZone(overrides: Partial<Zone> = {}): Zone {
  return {
    id: 'verdant_woods',
    name: 'Verdant Woods',
    description: 'A lush forest',
    type: 'forest',
    unlockRequirement: {},
    subzones: [
      {
        id: 'woods_edge',
        name: 'Woods Edge',
        description: 'Edge of the forest',
        difficulty: 'easy',
        discoveryWeight: 1,
        requiredZoneFamiliarity: 0,
        isDiscovered: true,
        threats: [],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 0,
        bonusGoldPercent: 0,
        baseDuration: 60,
        baseGold: 50,
        baseXp: 100,
        mastery: 0,
      },
    ],
    masteryRewards: {
      passiveIncomeBonus: 0,
    },
    familiarity: 0,
    isUnlocked: true,
    isMastered: false,
    ...overrides,
  }
}

describe('Offline Progress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('calculateHoursOffline', () => {
    it('should calculate hours between two dates', () => {
      const lastOnline = new Date('2024-01-01T00:00:00Z')
      const current = new Date('2024-01-01T05:30:00Z')

      const hours = calculateHoursOffline(lastOnline, current)
      expect(hours).toBe(5)
    })

    it('should floor partial hours', () => {
      const lastOnline = new Date('2024-01-01T00:00:00Z')
      const current = new Date('2024-01-01T02:45:00Z')

      const hours = calculateHoursOffline(lastOnline, current)
      expect(hours).toBe(2)
    })

    it('should return 0 for same time', () => {
      const time = new Date('2024-01-01T00:00:00Z')

      const hours = calculateHoursOffline(time, time)
      expect(hours).toBe(0)
    })

    it('should handle multiple days', () => {
      const lastOnline = new Date('2024-01-01T00:00:00Z')
      const current = new Date('2024-01-03T12:00:00Z')

      const hours = calculateHoursOffline(lastOnline, current)
      expect(hours).toBe(60) // 2.5 days = 60 hours (floored)
    })
  })

  describe('formatOfflineDuration', () => {
    it('should format less than 1 hour', () => {
      expect(formatOfflineDuration(0)).toBe('less than an hour')
    })

    it('should format exactly 1 hour', () => {
      expect(formatOfflineDuration(1)).toBe('1 hour')
    })

    it('should format multiple hours', () => {
      expect(formatOfflineDuration(5)).toBe('5 hours')
      expect(formatOfflineDuration(23)).toBe('23 hours')
    })

    it('should format exactly 1 day', () => {
      expect(formatOfflineDuration(24)).toBe('1 day')
    })

    it('should format 1 day with hours', () => {
      expect(formatOfflineDuration(27)).toBe('1 day, 3 hours')
    })

    it('should format multiple days', () => {
      expect(formatOfflineDuration(48)).toBe('2 days')
      expect(formatOfflineDuration(72)).toBe('3 days')
    })

    it('should format multiple days with hours', () => {
      expect(formatOfflineDuration(50)).toBe('2 days, 2 hours')
      expect(formatOfflineDuration(75)).toBe('3 days, 3 hours')
    })
  })

  describe('calculateOfflineProgress', () => {
    it('should handle no expeditions', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
      const heroes = [createTestHero()]
      const zones = [createTestZone()]

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [],
        heroes,
        zones,
        50,
        0
      )

      expect(result.completedExpeditions).toHaveLength(0)
      expect(result.newExpeditions).toHaveLength(0)
      expect(result.pendingLoot).toHaveLength(0)
    })

    it('should complete expeditions that finished while offline', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago

      const hero = createTestHero({ id: 'hero-1' })
      const expedition = createTestExpedition({
        id: 'exp-1',
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      })
      const zones = [createTestZone()]

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        zones,
        50,
        0
      )

      expect(result.completedExpeditions).toHaveLength(1)
      expect(result.completedExpeditions[0].id).toBe('exp-1')
      expect(result.completedExpeditions[0].status).toBe('completed')
    })

    it('should not complete expeditions still in progress', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago

      const hero = createTestHero({ id: 'hero-1' })
      const expedition = createTestExpedition({
        id: 'exp-1',
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
      })
      const zones = [createTestZone()]

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        zones,
        50,
        0
      )

      expect(result.completedExpeditions).toHaveLength(0)
    })

    it('should update hero XP from completed expeditions', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000)

      const hero = createTestHero({ id: 'hero-1', xp: 100 })
      const expedition = createTestExpedition({
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      })
      const zones = [createTestZone()]

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        zones,
        50,
        0
      )

      const heroUpdate = result.heroUpdates.get('hero-1')
      expect(heroUpdate).toBeDefined()
      expect(heroUpdate!.xp).toBe(150) // 100 + 50 from rewards
    })

    it('should calculate morale recovery for resting heroes', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago

      const hero = createTestHero({
        id: 'hero-1',
        morale: 'tired',
        moraleValue: 50,
        moraleLastUpdate: lastOnline.toISOString(),
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [],
        [hero],
        [createTestZone()],
        50,
        0
      )

      const moraleUpdate = result.moraleRecovery.get('hero-1')
      expect(moraleUpdate).toBeDefined()
      expect(moraleUpdate!.hoursRested).toBe(2)
      expect(moraleUpdate!.morale).toBe('content') // 50 + (2 * 5) = 60

      const heroUpdate = result.heroUpdates.get('hero-1')
      expect(heroUpdate!.moraleValue).toBe(60)
    })

    it('should not calculate morale recovery for heroes on expedition', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000)

      const hero = createTestHero({
        id: 'hero-1',
        moraleLastUpdate: lastOnline.toISOString(),
      })

      const expedition = createTestExpedition({
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() + 1 * 60 * 60 * 1000).toISOString(), // Still in progress
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        [createTestZone()],
        50,
        0
      )

      const moraleUpdate = result.moraleRecovery.get('hero-1')
      expect(moraleUpdate).toBeUndefined()
    })

    it('should handle auto-repeat when enabled', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000)

      const hero = createTestHero({ id: 'hero-1', morale: 'content' })
      const expedition = createTestExpedition({
        id: 'exp-1',
        heroIds: ['hero-1'],
        autoRepeat: true,
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        [createTestZone()],
        50,
        0
      )

      expect(result.completedExpeditions).toHaveLength(1)
      expect(result.newExpeditions).toHaveLength(1)
      expect(result.newExpeditions[0].id).not.toBe('exp-1') // New ID
      expect(result.newExpeditions[0].heroIds).toEqual(['hero-1'])
    })

    it('should stop auto-repeat when inventory is full', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000)

      const hero = createTestHero({ id: 'hero-1', morale: 'content' })
      const expedition = createTestExpedition({
        autoRepeat: true,
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        stopConditions: {
          inventoryFull: true,
          anyHeroTired: false,
          resourceCap: false,
        },
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        [createTestZone()],
        50, // total slots
        50 // used slots (full!)
      )

      expect(result.completedExpeditions).toHaveLength(1)
      expect(result.newExpeditions).toHaveLength(0) // Auto-repeat stopped
    })

    it('should stop auto-repeat when hero is tired', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000)

      const hero = createTestHero({ id: 'hero-1', morale: 'tired' })
      const expedition = createTestExpedition({
        autoRepeat: true,
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        stopConditions: {
          inventoryFull: false,
          anyHeroTired: true,
          resourceCap: false,
        },
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        [createTestZone()],
        50,
        0
      )

      expect(result.completedExpeditions).toHaveLength(1)
      expect(result.newExpeditions).toHaveLength(0) // Auto-repeat stopped due to tired hero
    })

    it('should stop auto-repeat when gold cap is reached', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000)

      const hero = createTestHero({ id: 'hero-1', morale: 'content' })
      const expedition = createTestExpedition({
        autoRepeat: true,
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        stopConditions: {
          inventoryFull: false,
          anyHeroTired: false,
          resourceCap: true,
        },
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        [createTestZone()],
        50,
        0,
        999_999_999 // At gold cap
      )

      expect(result.completedExpeditions).toHaveLength(1)
      expect(result.newExpeditions).toHaveLength(0) // Auto-repeat stopped due to gold cap
    })

    it('should handle multiple completed expeditions', () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 4 * 60 * 60 * 1000) // 4 hours ago

      const hero1 = createTestHero({ id: 'hero-1' })
      const hero2 = createTestHero({ id: 'hero-2' })

      const expedition1 = createTestExpedition({
        id: 'exp-1',
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      })

      const expedition2 = createTestExpedition({
        id: 'exp-2',
        heroIds: ['hero-2'],
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition1, expedition2],
        [hero1, hero2],
        [createTestZone()],
        50,
        0
      )

      expect(result.completedExpeditions).toHaveLength(2)
      expect(result.heroUpdates.size).toBe(2)
    })

    it('should create pending loot when inventory overflows', async () => {
      const current = new Date()
      const lastOnline = new Date(current.getTime() - 2 * 60 * 60 * 1000)

      const hero = createTestHero({ id: 'hero-1' })

      // Mock completeExpedition to return equipment
      const { completeExpedition } = await import('~/utils/expeditionEngine')
      vi.mocked(completeExpedition).mockReturnValueOnce({
        ...createTestExpedition(),
        status: 'completed',
        rewards: {
          gold: 100,
          xp: 50,
          equipment: [
            { id: 'eq-1' } as any,
            { id: 'eq-2' } as any,
            { id: 'eq-3' } as any,
          ],
          materials: [],
        },
      })

      const expedition = createTestExpedition({
        heroIds: ['hero-1'],
        completesAt: new Date(current.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      })

      const result = calculateOfflineProgress(
        current,
        lastOnline,
        [expedition],
        [hero],
        [createTestZone()],
        50, // total slots
        49 // used slots (only 1 available)
      )

      expect(result.pendingLoot).toHaveLength(1)
      expect(result.pendingLoot[0].items).toHaveLength(2) // 2 overflow items
      expect(result.completedExpeditions[0].rewards!.equipment).toHaveLength(1) // 1 fits
    })
  })
})
