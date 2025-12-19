import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { TavernSlot, TavernHero } from '~~/types'
import { TAVERN_REFRESH_HOURS } from '~~/types/recruitment'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// Mock hero generator
vi.mock('~/utils/heroGenerator', () => ({
  generateTavernHero: vi.fn(),
}))

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123'),
}))

import { generateTavernHero } from '~/utils/heroGenerator'
import getTavernHandler from '~~/server/api/tavern/index.get'
import refreshTavernHandler from '~~/server/api/tavern/refresh.post'
import recruitHeroHandler from '~~/server/api/tavern/recruit.post'
import lockSlotHandler from '~~/server/api/tavern/lock/[index].post'
import unlockSlotHandler from '~~/server/api/tavern/unlock/[index].post'

// Test helpers
function createMockEvent(options: {
  user?: { id: string } | null
  body?: unknown
  params?: Record<string, string>
} = {}) {
  // Mock readBody to return the body
  if (options.body !== undefined) {
    global.readBody = vi.fn().mockResolvedValue(options.body)
  }

  // Mock getRouterParam to return params
  if (options.params) {
    global.getRouterParam = vi.fn((event: any, key: string) => options.params?.[key])
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

function createMockTavernHero(overrides: Partial<TavernHero> = {}): TavernHero {
  return {
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
    power: 14,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
    recruitCost: 100,
    isLocked: false,
    expiresAt: new Date(Date.now() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000).toISOString(),
    ...overrides,
  }
}

function createMockTavernSlots(): TavernSlot[] {
  return [
    {
      index: 0,
      hero: createMockTavernHero({ name: 'Hero 1' }),
      rarity: 'common',
      isLocked: false,
    },
    {
      index: 1,
      hero: createMockTavernHero({ name: 'Hero 2' }),
      rarity: 'common',
      isLocked: false,
    },
    {
      index: 2,
      hero: createMockTavernHero({ name: 'Hero 3', rarity: 'uncommon', recruitCost: 250 }),
      rarity: 'uncommon',
      isLocked: false,
    },
  ]
}

function createMockSupabaseClient(mockData: {
  player?: any
  tavernState?: any
  hero?: any
  playerError?: any
  tavernError?: any
  heroError?: any
  updateResult?: any
  updateError?: any
} = {}) {
  const mockClient = {
    from: vi.fn(),
  }

  const createQueryChain = (tableName: string) => {
    const chain: any = {
      select: vi.fn(() => chain),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      delete: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      gte: vi.fn(() => chain),
      single: vi.fn(() => {
        if (tableName === 'players') {
          return Promise.resolve({
            data: mockData.player || null,
            error: mockData.playerError || null,
          })
        }
        if (tableName === 'tavern_state') {
          return Promise.resolve({
            data: mockData.tavernState || null,
            error: mockData.tavernError || null,
          })
        }
        if (tableName === 'heroes') {
          return Promise.resolve({
            data: mockData.hero || null,
            error: mockData.heroError || null,
          })
        }
        return Promise.resolve({ data: null, error: null })
      }),
      maybeSingle: vi.fn(() => {
        return Promise.resolve({
          data: mockData.updateResult || null,
          error: mockData.updateError || null,
        })
      }),
    }
    return chain
  }

  mockClient.from.mockImplementation((tableName: string) => createQueryChain(tableName))

  return mockClient
}

describe('Tavern API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/tavern', () => {
    it('should return tavern state for authenticated user', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 5,
        is_supporter: false,
      }
      const mockTavernState = {
        slots: createMockTavernSlots(),
        last_refresh_at: new Date().toISOString(),
        next_refresh_at: new Date(Date.now() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000).toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({ user: mockUser })
      const result = await getTavernHandler(event)

      expect(result.slots).toHaveLength(3)
      expect(result.lockSlots).toBe(1) // Base 1 + floor(5/10) = 1
      expect(result.usedLockSlots).toBe(0)
      expect(result.lastRefreshAt).toBe(mockTavernState.last_refresh_at)
      expect(result.nextRefreshAt).toBe(mockTavernState.next_refresh_at)
    })

    it('should calculate lock slots with account level bonus', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 25,
        is_supporter: false,
      }
      const mockTavernState = {
        slots: createMockTavernSlots(),
        last_refresh_at: new Date().toISOString(),
        next_refresh_at: new Date(Date.now() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000).toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({ user: mockUser })
      const result = await getTavernHandler(event)

      expect(result.lockSlots).toBe(3) // Base 1 + floor(25/10) = 3
    })

    it('should calculate lock slots with supporter bonus', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 15,
        is_supporter: true,
      }
      const mockTavernState = {
        slots: createMockTavernSlots(),
        last_refresh_at: new Date().toISOString(),
        next_refresh_at: new Date(Date.now() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000).toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({ user: mockUser })
      const result = await getTavernHandler(event)

      expect(result.lockSlots).toBe(4) // Base 1 + floor(15/10) + 2 = 4
    })

    it('should count used lock slots correctly', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 10,
        is_supporter: false,
      }
      const slots = createMockTavernSlots()
      slots[0].isLocked = true
      slots[2].isLocked = true

      const mockTavernState = {
        slots,
        last_refresh_at: new Date().toISOString(),
        next_refresh_at: new Date(Date.now() + TAVERN_REFRESH_HOURS * 60 * 60 * 1000).toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({ user: mockUser })
      const result = await getTavernHandler(event)

      expect(result.usedLockSlots).toBe(2)
    })

    it('should throw 401 for unauthenticated user', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      const event = createMockEvent({ user: null })

      await expect(getTavernHandler(event)).rejects.toThrow('Unauthorized')
    })

    it('should throw 404 if player not found', async () => {
      const mockUser = { id: 'user-123' }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: null,
        }) as any
      )

      const event = createMockEvent({ user: mockUser })

      await expect(getTavernHandler(event)).rejects.toThrow('Player not found')
    })

    it('should throw 404 if tavern state not found', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 5,
        is_supporter: false,
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: null,
          tavernError: { message: 'Not found' },
        }) as any
      )

      const event = createMockEvent({ user: mockUser })

      await expect(getTavernHandler(event)).rejects.toThrow('Tavern state not found')
    })
  })

  describe('POST /api/tavern/refresh', () => {
    it('should perform free refresh when timer expired', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 1,
        gold: 500,
      }
      const pastTime = new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() // 10 hours ago
      const mockTavernState = {
        slots: createMockTavernSlots(),
        last_refresh_at: pastTime,
        nextRefreshAt: pastTime, // Handler uses camelCase
        updated_at: new Date().toISOString(),
      }

      const mockNewHero = createMockTavernHero({ name: 'New Hero' })
      vi.mocked(generateTavernHero).mockReturnValue(mockNewHero)

      const mockClient = createMockSupabaseClient({
        player: mockPlayer,
        tavernState: mockTavernState,
      })

      // Mock successful update
      const updateChain = {
        update: vi.fn(() => updateChain),
        eq: vi.fn(() => updateChain),
        select: vi.fn(() => Promise.resolve({
          data: [{ updated_at: new Date().toISOString() }],
          error: null,
        })),
      }
      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'tavern_state') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockTavernState,
                  error: null,
                })),
              })),
            })),
            update: updateChain.update,
          }
          return chain
        }
        return createMockSupabaseClient({ player: mockPlayer }).from(tableName)
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({ user: mockUser })
      const result = await refreshTavernHandler(event)

      expect(result.wasPaidRefresh).toBe(false)
      expect(result.costPaid).toBe(0)
      expect(result.slots).toHaveLength(3)
      expect(generateTavernHero).toHaveBeenCalledTimes(3)
    })

    it('should preserve locked slots during refresh', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 1,
        gold: 500,
      }
      const pastTime = new Date(Date.now() - 1000).toISOString()
      const slots = createMockTavernSlots()
      slots[1].isLocked = true
      const lockedHero = slots[1].hero

      const mockTavernState = {
        slots,
        last_refresh_at: pastTime,
        nextRefreshAt: pastTime, // Handler uses camelCase
        updated_at: new Date().toISOString(),
      }

      const mockNewHero = createMockTavernHero({ name: 'New Hero' })
      vi.mocked(generateTavernHero).mockReturnValue(mockNewHero)

      const mockClient = createMockSupabaseClient({
        player: mockPlayer,
        tavernState: mockTavernState,
      })

      const updateChain = {
        update: vi.fn(() => updateChain),
        eq: vi.fn(() => updateChain),
        select: vi.fn(() => Promise.resolve({
          data: [{ updated_at: new Date().toISOString() }],
          error: null,
        })),
      }
      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'tavern_state') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockTavernState,
                  error: null,
                })),
              })),
            })),
            update: updateChain.update,
          }
          return chain
        }
        return createMockSupabaseClient({ player: mockPlayer }).from(tableName)
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({ user: mockUser })
      const result = await refreshTavernHandler(event)

      expect(result.slots[1].hero).toEqual(lockedHero)
      expect(result.slots[1].isLocked).toBe(true)
      expect(generateTavernHero).toHaveBeenCalledTimes(2) // Only non-locked slots
    })

    it('should deduct gold for paid refresh', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 1,
        gold: 500,
      }
      const futureTime = new Date(Date.now() + 1000000).toISOString()
      const mockTavernState = {
        slots: createMockTavernSlots(),
        last_refresh_at: new Date().toISOString(),
        nextRefreshAt: futureTime, // Handler uses camelCase
        updated_at: new Date().toISOString(),
      }

      const mockNewHero = createMockTavernHero({ name: 'New Hero' })
      vi.mocked(generateTavernHero).mockReturnValue(mockNewHero)

      const mockClient = createMockSupabaseClient({
        player: mockPlayer,
        tavernState: mockTavernState,
      })

      // Mock gold deduction
      const goldUpdateChain = {
        update: vi.fn(() => goldUpdateChain),
        eq: vi.fn(() => goldUpdateChain),
        gte: vi.fn(() => goldUpdateChain),
        select: vi.fn(() => goldUpdateChain),
        single: vi.fn(() => Promise.resolve({
          data: { gold: 425 }, // 500 - 75
          error: null,
        })),
      }

      const tavernUpdateChain = {
        update: vi.fn(() => tavernUpdateChain),
        eq: vi.fn(() => tavernUpdateChain),
        select: vi.fn(() => Promise.resolve({
          data: [{ updated_at: new Date().toISOString() }],
          error: null,
        })),
      }

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'players') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockPlayer,
                  error: null,
                })),
              })),
            })),
            update: goldUpdateChain.update,
          }
          return chain
        }
        if (tableName === 'tavern_state') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockTavernState,
                  error: null,
                })),
              })),
            })),
            update: tavernUpdateChain.update,
          }
          return chain
        }
        return createMockSupabaseClient({}).from(tableName)
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({ user: mockUser })
      const result = await refreshTavernHandler(event)

      expect(result.wasPaidRefresh).toBe(true)
      expect(result.costPaid).toBe(75)
      expect(result.remainingGold).toBe(425)
    })

    it('should throw error if insufficient gold for paid refresh', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 1,
        gold: 50, // Less than 75
      }
      const futureTime = new Date(Date.now() + 1000000).toISOString()
      const mockTavernState = {
        slots: createMockTavernSlots(),
        last_refresh_at: new Date().toISOString(),
        nextRefreshAt: futureTime, // Handler uses camelCase
        updated_at: new Date().toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({ user: mockUser })

      await expect(refreshTavernHandler(event)).rejects.toThrow('Not enough gold for early refresh')
    })
  })

  describe('POST /api/tavern/recruit', () => {
    it('should recruit hero and deduct gold', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        gold: 500,
      }
      const mockTavernState = {
        slots: createMockTavernSlots(),
        updated_at: new Date().toISOString(),
      }

      const mockCreatedHero = {
        id: 'mock-uuid-123',
        name: 'Hero 1',
        // ... other hero fields
      }

      const mockClient = createMockSupabaseClient({
        player: mockPlayer,
        tavernState: mockTavernState,
      })

      // Mock hero creation
      const heroInsertChain = {
        insert: vi.fn(() => heroInsertChain),
        select: vi.fn(() => heroInsertChain),
        single: vi.fn(() => Promise.resolve({
          data: mockCreatedHero,
          error: null,
        })),
      }

      // Mock gold deduction
      const goldUpdateChain = {
        update: vi.fn(() => goldUpdateChain),
        eq: vi.fn(() => goldUpdateChain),
        gte: vi.fn(() => goldUpdateChain),
        select: vi.fn(() => goldUpdateChain),
        single: vi.fn(() => Promise.resolve({
          data: { gold: 400 }, // 500 - 100
          error: null,
        })),
      }

      // Mock tavern update
      const tavernUpdateChain = {
        update: vi.fn(() => tavernUpdateChain),
        eq: vi.fn(() => tavernUpdateChain),
        select: vi.fn(() => tavernUpdateChain),
        maybeSingle: vi.fn(() => Promise.resolve({
          data: { updated_at: new Date().toISOString() },
          error: null,
        })),
      }

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'heroes') {
          return heroInsertChain as any
        }
        if (tableName === 'players') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockPlayer,
                  error: null,
                })),
              })),
            })),
            update: goldUpdateChain.update,
          }
          return chain
        }
        if (tableName === 'tavern_state') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockTavernState,
                  error: null,
                })),
              })),
            })),
            update: tavernUpdateChain.update,
          }
          return chain
        }
        return createMockSupabaseClient({}).from(tableName)
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        body: { slotIndex: 0 },
      })
      const result = await recruitHeroHandler(event)

      expect(result.success).toBe(true)
      expect(result.hero).toEqual(mockCreatedHero)
      expect(result.remainingGold).toBe(400)
    })

    it('should throw error if insufficient gold', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        gold: 50, // Less than 100
      }
      const mockTavernState = {
        slots: createMockTavernSlots(),
        updated_at: new Date().toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({
        user: mockUser,
        body: { slotIndex: 0 },
      })

      await expect(recruitHeroHandler(event)).rejects.toThrow('Not enough gold')
    })

    it('should validate slot index', async () => {
      const mockUser = { id: 'user-123' }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)

      const event = createMockEvent({
        user: mockUser,
        body: { slotIndex: -1 },
      })

      await expect(recruitHeroHandler(event)).rejects.toThrow() // Validation error
    })

    it('should throw error if slot is empty', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        gold: 500,
      }
      const slots = createMockTavernSlots()
      slots[0].hero = null

      const mockTavernState = {
        slots,
        updated_at: new Date().toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({
        user: mockUser,
        body: { slotIndex: 0 },
      })

      await expect(recruitHeroHandler(event)).rejects.toThrow('No hero in this slot')
    })
  })

  describe('POST /api/tavern/lock/[index]', () => {
    it('should lock a slot', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 10,
        is_supporter: false,
      }
      const mockTavernState = {
        slots: createMockTavernSlots(),
        updated_at: new Date().toISOString(),
      }

      const mockClient = createMockSupabaseClient({
        player: mockPlayer,
        tavernState: mockTavernState,
      })

      const tavernUpdateChain = {
        update: vi.fn(() => tavernUpdateChain),
        eq: vi.fn(() => tavernUpdateChain),
        select: vi.fn(() => Promise.resolve({
          data: [{ updated_at: new Date().toISOString() }],
          error: null,
        })),
      }

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'tavern_state') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockTavernState,
                  error: null,
                })),
              })),
            })),
            update: tavernUpdateChain.update,
          }
          return chain
        }
        return createMockSupabaseClient({ player: mockPlayer }).from(tableName)
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { index: '0' },
      })

      const result = await lockSlotHandler(event)

      expect(result.success).toBe(true)
      expect(result.slotIndex).toBe(0)
      expect(result.usedLockSlots).toBe(1)
      expect(result.maxLockSlots).toBe(2) // Base 1 + floor(10/10) = 2
    })

    it('should throw error if slot already locked', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 10,
        is_supporter: false,
      }
      const slots = createMockTavernSlots()
      slots[0].isLocked = true

      const mockTavernState = {
        slots,
        updated_at: new Date().toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({
        user: mockUser,
        params: { index: '0' },
      })

      await expect(lockSlotHandler(event)).rejects.toThrow('Slot is already locked')
    })

    it('should throw error if maximum lock slots exceeded', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 1,
        is_supporter: false,
      }
      const slots = createMockTavernSlots()
      slots[0].isLocked = true // Already using 1 lock slot

      const mockTavernState = {
        slots,
        updated_at: new Date().toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({
        user: mockUser,
        params: { index: '1' },
      })

      await expect(lockSlotHandler(event)).rejects.toThrow('Maximum lock slots (1) already in use')
    })

    it('should throw error if slot is empty', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
        account_level: 10,
        is_supporter: false,
      }
      const slots = createMockTavernSlots()
      slots[0].hero = null

      const mockTavernState = {
        slots,
        updated_at: new Date().toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({
        user: mockUser,
        params: { index: '0' },
      })

      await expect(lockSlotHandler(event)).rejects.toThrow('Cannot lock empty slot')
    })

    it('should validate index parameter', async () => {
      const mockUser = { id: 'user-123' }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)

      const event = createMockEvent({
        user: mockUser,
        params: { index: 'invalid' },
      })

      await expect(lockSlotHandler(event)).rejects.toThrow() // Validation error
    })
  })

  describe('POST /api/tavern/unlock/[index]', () => {
    it('should unlock a locked slot', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
      }
      const slots = createMockTavernSlots()
      slots[0].isLocked = true
      slots[1].isLocked = true

      const mockTavernState = {
        slots,
        updated_at: new Date().toISOString(),
      }

      const mockClient = createMockSupabaseClient({
        player: mockPlayer,
        tavernState: mockTavernState,
      })

      const tavernUpdateChain = {
        update: vi.fn(() => tavernUpdateChain),
        eq: vi.fn(() => tavernUpdateChain),
        select: vi.fn(() => Promise.resolve({
          data: [{ updated_at: new Date().toISOString() }],
          error: null,
        })),
      }

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'tavern_state') {
          const chain: any = {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({
                  data: mockTavernState,
                  error: null,
                })),
              })),
            })),
            update: tavernUpdateChain.update,
          }
          return chain
        }
        return createMockSupabaseClient({ player: mockPlayer }).from(tableName)
      })

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient as any)

      const event = createMockEvent({
        user: mockUser,
        params: { index: '0' },
      })

      const result = await unlockSlotHandler(event)

      expect(result.success).toBe(true)
      expect(result.slotIndex).toBe(0)
      expect(result.usedLockSlots).toBe(1) // One slot still locked
    })

    it('should throw error if slot is not locked', async () => {
      const mockUser = { id: 'user-123' }
      const mockPlayer = {
        id: 'player-123',
      }
      const mockTavernState = {
        slots: createMockTavernSlots(),
        updated_at: new Date().toISOString(),
      }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createMockSupabaseClient({
          player: mockPlayer,
          tavernState: mockTavernState,
        }) as any
      )

      const event = createMockEvent({
        user: mockUser,
        params: { index: '0' },
      })

      await expect(unlockSlotHandler(event)).rejects.toThrow('Slot is not locked')
    })

    it('should validate index parameter', async () => {
      const mockUser = { id: 'user-123' }

      vi.mocked(serverSupabaseUser).mockResolvedValue(mockUser as any)

      const event = createMockEvent({
        user: mockUser,
        params: { index: 'invalid' },
      })

      await expect(unlockSlotHandler(event)).rejects.toThrow() // Validation error
    })
  })
})
