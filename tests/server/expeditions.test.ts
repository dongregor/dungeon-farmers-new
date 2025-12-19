import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Expedition, Hero, ExpeditionLog, ExpeditionEvent } from '~~/types'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// Mock zone data
vi.mock('~/data/zones', () => ({
  getZoneAndSubzone: vi.fn(),
}))

// Mock log generator
vi.mock('~/utils/logGenerator', () => ({
  generateExpeditionLog: vi.fn(),
}))

// Mock morale service
vi.mock('~/utils/moraleService', () => ({
  applyMoraleChange: vi.fn((value: number, change: number) => ({
    moraleValue: Math.max(0, Math.min(100, value + change)),
    morale: 'content' as const,
  })),
}))

import { getZoneAndSubzone } from '~/data/zones'
import { generateExpeditionLog } from '~/utils/logGenerator'
import getExpeditionsHandler from '~~/server/api/expeditions/index.get'
import getExpeditionHandler from '~~/server/api/expeditions/[id].get'
import previewExpeditionHandler from '~~/server/api/expeditions/preview.get'
import startExpeditionHandler from '~~/server/api/expeditions/start.post'
import completeExpeditionHandler from '~~/server/api/expeditions/[id]/complete.post'
import cancelExpeditionHandler from '~~/server/api/expeditions/[id]/cancel.post'
import choiceExpeditionHandler from '~~/server/api/expeditions/[id]/choice.post'

// Test helpers
function createMockEvent(options: {
  user?: { id: string } | null
  body?: unknown
  params?: Record<string, string>
  query?: Record<string, string>
} = {}) {
  // Mock readBody
  if (options.body !== undefined) {
    global.readBody = vi.fn().mockResolvedValue(options.body)
  }

  // Mock getRouterParam
  if (options.params) {
    global.getRouterParam = vi.fn((event: any, key: string) => options.params?.[key])
  }

  // Mock getQuery
  if (options.query) {
    global.getQuery = vi.fn().mockReturnValue(options.query)
  }

  return {
    context: {},
    node: {
      req: {},
      res: {},
    },
    ...options,
  } as any
}

function createMockHero(overrides: Partial<Hero> = {}): Hero {
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
    level: 10,
    xp: 100,
    xpToNextLevel: 200,
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

function createMockExpedition(overrides: Partial<Expedition> = {}): Expedition {
  const now = new Date()
  const completesAt = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes

  return {
    id: 'exp-1',
    playerId: 'player-1',
    zoneId: 'verdant_woods',
    subzoneId: 'meadow',
    heroIds: ['hero-1', 'hero-2'],
    teamPower: 100,
    startedAt: now.toISOString(),
    completesAt: completesAt.toISOString(),
    durationMinutes: 30,
    status: 'in_progress',
    events: [],
    pendingChoices: [],
    autoRepeat: false,
    autoRepeatLimit: undefined,
    stopConditions: {
      anyHeroTired: false,
      inventoryFull: false,
      resourceCap: false,
    },
    efficiency: undefined,
    rewards: undefined,
    log: undefined,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides,
  }
}

function createMockSupabaseClient(mockData: {
  player?: any
  expedition?: any
  expeditions?: any[]
  activeExpeditions?: any[]
  completedExpeditions?: any[]
  heroes?: any[]
  zoneProgress?: any
  playerError?: any
  expeditionError?: any
  heroesError?: any
  updateResult?: any
  updateError?: any
  rpcResult?: any
  rpcError?: any
} = {}) {
  const mockClient = {
    from: vi.fn(),
    rpc: vi.fn(),
  }

  // Mock RPC calls
  mockClient.rpc.mockImplementation((funcName: string, params: any) => {
    if (funcName === 'increment_player_gold') {
      return Promise.resolve({
        data: mockData.rpcResult || null,
        error: mockData.rpcError || null,
      })
    }
    return Promise.resolve({ data: null, error: null })
  })

  const createQueryChain = (tableName: string) => {
    const chain: any = {
      select: vi.fn(() => chain),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      delete: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      in: vi.fn(() => chain),
      order: vi.fn(() => chain),
      limit: vi.fn(() => chain),
      single: vi.fn(() => {
        if (tableName === 'expeditions') {
          return Promise.resolve({
            data: mockData.expedition || null,
            error: mockData.expeditionError || null,
          })
        }
        if (tableName === 'heroes') {
          return Promise.resolve({
            data: mockData.heroes?.[0] || null,
            error: mockData.heroesError || null,
          })
        }
        if (tableName === 'zone_progress') {
          return Promise.resolve({
            data: mockData.zoneProgress || null,
            error: null,
          })
        }
        return Promise.resolve({ data: null, error: null })
      }),
    }

    // Special handling for list queries
    chain.select.mockImplementation(() => ({
      ...chain,
      eq: vi.fn(() => ({
        ...chain,
        order: vi.fn(() => ({
          ...chain,
          limit: vi.fn(() => ({
            ...chain,
            then: (callback: any) => callback({
              data: tableName === 'expeditions'
                ? (mockData.completedExpeditions || [])
                : (mockData.heroes || []),
              error: null,
            }),
          })),
          then: (callback: any) => callback({
            data: tableName === 'expeditions'
              ? (mockData.activeExpeditions || [])
              : (mockData.heroes || []),
            error: null,
          }),
        })),
      })),
      in: vi.fn(() => ({
        ...chain,
        eq: vi.fn(() => Promise.resolve({
          data: mockData.heroes || [],
          error: mockData.heroesError || null,
        })),
      })),
    }))

    // For insert/update
    chain.insert.mockImplementation(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: mockData.expedition || null,
          error: mockData.expeditionError || null,
        })),
      })),
    }))

    chain.update.mockImplementation(() => ({
      ...chain,
      eq: vi.fn(() => ({
        ...chain,
        in: vi.fn(() => Promise.resolve({
          data: mockData.updateResult || null,
          error: mockData.updateError || null,
        })),
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: mockData.heroes?.[0] || null,
            error: mockData.updateError || null,
          })),
        })),
      })),
      in: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({
          data: mockData.updateResult || null,
          error: mockData.updateError || null,
        })),
      })),
    }))

    return chain
  }

  mockClient.from.mockImplementation((tableName: string) => createQueryChain(tableName))

  return mockClient
}

describe('Expedition API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/expeditions', () => {
    // TODO: Fix Supabase query chain mock for list queries
    it.skip('should return active and completed expeditions', async () => {
      const mockUser = { id: 'user-123' }
      const mockActiveExp = createMockExpedition({ id: 'exp-active', status: 'in_progress' })
      const mockCompletedExp = createMockExpedition({ id: 'exp-complete', status: 'completed' })

      const mockClient = createMockSupabaseClient({
        activeExpeditions: [mockActiveExp],
        completedExpeditions: [mockCompletedExp],
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({ user: mockUser })
      const result = await getExpeditionsHandler(event)

      expect(result.active).toHaveLength(1)
      expect(result.completed).toHaveLength(1)
      expect(result.active[0].id).toBe('exp-active')
      expect(result.completed[0].id).toBe('exp-complete')
    })

    // TODO: Fix Supabase query chain mock for list queries
    it.skip('should filter by status query param', async () => {
      const mockUser = { id: 'user-123' }
      const mockActiveExp = createMockExpedition({ id: 'exp-active', status: 'in_progress' })

      const mockClient = createMockSupabaseClient({
        activeExpeditions: [mockActiveExp],
        completedExpeditions: [],
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        query: { status: 'active' }
      })
      const result = await getExpeditionsHandler(event)

      expect(result.active).toHaveLength(1)
      expect(result.completed).toHaveLength(0)
    })

    it('should throw 401 for unauthenticated user', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      const event = createMockEvent({ user: null })

      await expect(getExpeditionsHandler(event)).rejects.toThrow('Unauthorized')
    })
  })

  describe('GET /api/expeditions/[id]', () => {
    it('should return expedition with heroes', async () => {
      const mockUser = { id: 'user-123' }
      const mockExpedition = createMockExpedition()
      const mockHeroes = [createMockHero({ id: 'hero-1' }), createMockHero({ id: 'hero-2' })]

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
        heroes: mockHeroes,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' }
      })
      const result = await getExpeditionHandler(event)

      expect(result.expedition).toBeDefined()
      expect(result.heroes).toHaveLength(2)
    })

    it('should include log if expedition is completed', async () => {
      const mockUser = { id: 'user-123' }
      const mockLog: ExpeditionLog = {
        events: [],
        summary: {
          totalEvents: 0,
          encountersDefeated: 0,
          treasureFound: 0,
          choicesMade: 0,
        },
      }
      const mockExpedition = createMockExpedition({
        status: 'completed',
        log: mockLog,
      })

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
        heroes: [],
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' }
      })
      const result = await getExpeditionHandler(event)

      expect(result.log).toBeDefined()
      expect(result.log?.events).toEqual([])
    })

    it('should throw 404 if expedition not found', async () => {
      const mockUser = { id: 'user-123' }

      const mockClient = createMockSupabaseClient({
        expedition: null,
        expeditionError: { message: 'Not found' },
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-nonexistent' }
      })

      await expect(getExpeditionHandler(event)).rejects.toThrow('Expedition not found')
    })
  })

  describe('GET /api/expeditions/preview', () => {
    it('should return expedition preview with efficiency and threats', async () => {
      const mockUser = { id: 'user-123' }
      const mockHeroes = [
        createMockHero({ id: 'hero-1', power: 50, archetypeTags: ['melee'] }),
        createMockHero({ id: 'hero-2', power: 50, archetypeTags: ['ranged'] }),
      ]

      const mockClient = createMockSupabaseClient({
        heroes: mockHeroes,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        query: {
          zoneId: 'verdant_woods',
          subzoneId: 'meadow',
          heroIds: 'hero-1,hero-2',
        }
      })
      const result = await previewExpeditionHandler(event)

      expect(result.estimatedEfficiency).toBeDefined()
      expect(result.threats).toBeDefined()
      expect(result.counters).toBeDefined()
      expect(result.estimatedRewards).toBeDefined()
    })

    it('should throw 400 if required params missing', async () => {
      const mockUser = { id: 'user-123' }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)

      const event = createMockEvent({
        user: mockUser,
        query: { zoneId: 'verdant_woods' } // Missing subzoneId and heroIds
      })

      await expect(previewExpeditionHandler(event)).rejects.toThrow('Missing required parameters')
    })
  })

  describe('POST /api/expeditions/start', () => {
    // TODO: Fix mock data structure to match mapSupabaseHeroToHero expectations
    it.skip('should start expedition with valid heroes and zone', async () => {
      const mockUser = { id: 'user-123' }
      const mockHeroes = [
        createMockHero({ id: 'hero-1', moraleValue: 80, isOnExpedition: false }),
        createMockHero({ id: 'hero-2', moraleValue: 70, isOnExpedition: false }),
      ]
      const mockExpedition = createMockExpedition()

      const mockClient = createMockSupabaseClient({
        heroes: mockHeroes,
        expedition: mockExpedition,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)
      vi.mocked(getZoneAndSubzone).mockReturnValue({
        zone: {
          id: 'verdant_woods',
          name: 'Verdant Woods',
          type: 'forest',
          unlockRequirement: {},
          subzones: [],
          masteryRewards: { passiveIncomeBonus: 0 },
          familiarity: 0,
          isUnlocked: true,
          isMastered: false,
        },
        subzone: {
          id: 'meadow',
          name: 'Meadow',
          description: 'A peaceful meadow',
          discoveryWeight: 1,
          requiredZoneFamiliarity: 0,
          isDiscovered: true,
          difficulty: 'easy',
          threats: [],
          monsters: [],
          collectibles: [],
          lootTable: [],
          bonusXpPercent: 0,
          bonusGoldPercent: 0,
          baseDuration: 30,
          baseGold: 50,
          baseXp: 25,
          mastery: 0,
        },
      })

      const event = createMockEvent({
        user: mockUser,
        body: {
          zoneId: 'verdant_woods',
          subzoneId: 'meadow',
          heroIds: ['hero-1', 'hero-2'],
          autoRepeat: false,
        }
      })
      const result = await startExpeditionHandler(event)

      expect(result.expedition).toBeDefined()
      expect(result.heroesUpdated).toBeDefined()
    })

    // TODO: Fix mock data structure to match mapSupabaseHeroToHero expectations
    it.skip('should throw error if hero is exhausted', async () => {
      const mockUser = { id: 'user-123' }
      const mockHeroes = [
        createMockHero({ id: 'hero-1', moraleValue: 10 }), // Exhausted
      ]

      const mockClient = createMockSupabaseClient({
        heroes: mockHeroes,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        body: {
          zoneId: 'verdant_woods',
          subzoneId: 'meadow',
          heroIds: ['hero-1'],
        }
      })

      await expect(startExpeditionHandler(event)).rejects.toThrow('HERO_EXHAUSTED')
    })

    // TODO: Fix mock data structure to match mapSupabaseHeroToHero expectations
    it.skip('should throw error if hero is busy', async () => {
      const mockUser = { id: 'user-123' }
      const mockHeroes = [
        createMockHero({ id: 'hero-1', isOnExpedition: true }),
      ]

      const mockClient = createMockSupabaseClient({
        heroes: mockHeroes,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        body: {
          zoneId: 'verdant_woods',
          subzoneId: 'meadow',
          heroIds: ['hero-1'],
        }
      })

      await expect(startExpeditionHandler(event)).rejects.toThrow('HERO_BUSY')
    })

    it('should validate request body schema', async () => {
      const mockUser = { id: 'user-123' }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)

      const event = createMockEvent({
        user: mockUser,
        body: {
          zoneId: '',  // Empty string should fail
          subzoneId: 'meadow',
          heroIds: [],  // Empty array should fail
        }
      })

      await expect(startExpeditionHandler(event)).rejects.toThrow()
    })
  })

  describe('POST /api/expeditions/[id]/complete', () => {
    // TODO: Fix mock update chain for hero updates
    it.skip('should complete expedition and award rewards', async () => {
      const mockUser = { id: 'user-123' }
      const pastTime = new Date(Date.now() - 60000).toISOString() // 1 minute ago
      const mockExpedition = createMockExpedition({
        completesAt: pastTime,
        status: 'in_progress',
      })
      const mockHeroes = [
        createMockHero({ id: 'hero-1', xp: 100, level: 5 }),
        createMockHero({ id: 'hero-2', xp: 150, level: 5 }),
      ]
      const mockLog: ExpeditionLog = {
        events: [],
        summary: { totalEvents: 0, encountersDefeated: 0, treasureFound: 0, choicesMade: 0 },
      }

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
        heroes: mockHeroes,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)
      vi.mocked(generateExpeditionLog).mockReturnValue(mockLog)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' }
      })
      const result = await completeExpeditionHandler(event)

      expect(result.expedition).toBeDefined()
      expect(result.rewards).toBeDefined()
      expect(result.rewards.gold).toBeGreaterThan(0)
      expect(result.rewards.xp).toBeGreaterThan(0)
      expect(result.log).toBeDefined()
    })

    // TODO: Fix mock update chain for hero updates
    it.skip('should throw error if expedition not ready', async () => {
      const mockUser = { id: 'user-123' }
      const futureTime = new Date(Date.now() + 60000).toISOString() // 1 minute in future
      const mockExpedition = createMockExpedition({
        completesAt: futureTime,
        status: 'in_progress',
      })

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' }
      })

      await expect(completeExpeditionHandler(event)).rejects.toThrow('EXPEDITION_NOT_READY')
    })
  })

  describe('POST /api/expeditions/[id]/cancel', () => {
    // TODO: Fix mock update chain for hero updates
    it.skip('should cancel in-progress expedition', async () => {
      const mockUser = { id: 'user-123' }
      const mockExpedition = createMockExpedition({ status: 'in_progress' })
      const mockHeroes = [
        createMockHero({ id: 'hero-1', moraleValue: 80 }),
        createMockHero({ id: 'hero-2', moraleValue: 70 }),
      ]

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
        heroes: mockHeroes,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' }
      })
      const result = await cancelExpeditionHandler(event)

      expect(result.heroesFreed).toBeDefined()
      expect(result.penaltyApplied).toBeDefined()
    })

    it('should throw error if expedition not in progress', async () => {
      const mockUser = { id: 'user-123' }
      const mockExpedition = createMockExpedition({ status: 'completed' })

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' }
      })

      await expect(cancelExpeditionHandler(event)).rejects.toThrow('Can only cancel in-progress expeditions')
    })
  })

  describe('POST /api/expeditions/[id]/choice', () => {
    it('should resolve expedition choice', async () => {
      const mockUser = { id: 'user-123' }
      const mockEvent: ExpeditionEvent = {
        id: 'event-1',
        type: 'choice',
        timestamp: new Date().toISOString(),
        data: {
          prompt: 'What do you do?',
          options: [
            { text: 'Fight', outcome: 'victory' },
            { text: 'Flee', outcome: 'escape' },
          ],
        },
      }
      const mockLog: ExpeditionLog = {
        events: [mockEvent],
        summary: { totalEvents: 1, encountersDefeated: 0, treasureFound: 0, choicesMade: 0 },
      }
      const mockExpedition = createMockExpedition({ log: mockLog })

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' },
        body: {
          eventId: 'event-1',
          choiceId: 0,
        }
      })
      const result = await choiceExpeditionHandler(event)

      expect(result.event).toBeDefined()
      expect(result.additionalRewards).toBeDefined()
    })

    it('should throw error for invalid choice ID', async () => {
      const mockUser = { id: 'user-123' }
      const mockEvent: ExpeditionEvent = {
        id: 'event-1',
        type: 'choice',
        timestamp: new Date().toISOString(),
        data: {
          prompt: 'What do you do?',
          options: [
            { text: 'Fight', outcome: 'victory' },
          ],
        },
      }
      const mockLog: ExpeditionLog = {
        events: [mockEvent],
        summary: { totalEvents: 1, encountersDefeated: 0, treasureFound: 0, choicesMade: 0 },
      }
      const mockExpedition = createMockExpedition({ log: mockLog })

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' },
        body: {
          eventId: 'event-1',
          choiceId: 99,  // Invalid choice ID
        }
      })

      await expect(choiceExpeditionHandler(event)).rejects.toThrow('Invalid choice ID')
    })

    it('should throw error for non-choice event', async () => {
      const mockUser = { id: 'user-123' }
      const mockEvent: ExpeditionEvent = {
        id: 'event-1',
        type: 'encounter',
        timestamp: new Date().toISOString(),
        data: {},
      }
      const mockLog: ExpeditionLog = {
        events: [mockEvent],
        summary: { totalEvents: 1, encountersDefeated: 0, treasureFound: 0, choicesMade: 0 },
      }
      const mockExpedition = createMockExpedition({ log: mockLog })

      const mockClient = createMockSupabaseClient({
        expedition: mockExpedition,
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { id: 'exp-1' },
        body: {
          eventId: 'event-1',
          choiceId: 0,
        }
      })

      await expect(choiceExpeditionHandler(event)).rejects.toThrow('Event is not a choice')
    })
  })
})
