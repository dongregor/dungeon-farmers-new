import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Hero } from '~~/types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Mock dependencies
vi.mock('#supabase/server', () => ({
  serverSupabaseClient: vi.fn(),
  serverSupabaseUser: vi.fn(),
}))

vi.mock('~~/app/utils/prestigeService', () => ({
  prestigeHero: vi.fn(),
}))

vi.mock('~~/server/utils/mappers', () => ({
  mapSupabaseHeroToHero: vi.fn(),
}))

vi.mock('~~/server/utils/validation', () => ({
  heroIdSchema: {
    safeParse: vi.fn((value) => ({ success: true, data: value })),
  },
}))

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { prestigeHero } from '~~/app/utils/prestigeService'
import { mapSupabaseHeroToHero } from '~~/server/utils/mappers'
import { heroIdSchema } from '~~/server/utils/validation'
import { MAX_HERO_LEVEL } from '~~/shared/constants/gameRules'

// Import route handlers
import getHeroHandler from '~~/server/api/heroes/[id].get'
import patchHeroHandler from '~~/server/api/heroes/[id].patch'
import retireHeroHandler from '~~/server/api/heroes/[id]/retire.post'
import prestigeHeroHandler from '~~/server/api/heroes/[id]/prestige.post'

// Test helpers
function createMockHero(overrides: Partial<Hero> = {}): Hero {
  return {
    id: 'hero-1',
    name: 'Test Hero',
    displayTitle: 'Brave',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    rarity: 'common',
    archetypeTags: ['tank'],
    gameplayTraits: [],
    flavorTraits: [],
    equipment: {},
    power: 100,
    morale: 'content',
    moraleValue: 70,
    moraleLastUpdate: new Date().toISOString(),
    prestigeLevel: 0,
    prestigeBonuses: {},
    isFavorite: false,
    isOnExpedition: false,
    expeditionId: null,
    isStationed: false,
    stationedZoneId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

function createMockSupabaseClient(): SupabaseClient {
  const client = {
    from: vi.fn(() => client),
    select: vi.fn(() => client),
    insert: vi.fn(() => client),
    update: vi.fn(() => client),
    delete: vi.fn(() => client),
    eq: vi.fn(() => client),
    in: vi.fn(() => client),
    single: vi.fn(() => ({ data: null, error: null })),
  } as unknown as SupabaseClient
  return client
}

describe('Hero API Routes', () => {
  let mockEvent: any
  let mockClient: SupabaseClient

  beforeEach(() => {
    vi.clearAllMocks()
    mockClient = createMockSupabaseClient()
    mockEvent = {}

    vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient)
    vi.mocked(serverSupabaseUser).mockResolvedValue({ id: 'user-1' } as any)
    vi.mocked(getRouterParam).mockReturnValue('hero-1')
  })

  describe('GET /api/heroes/[id]', () => {
    it('should return a hero by id', async () => {
      const mockHero = createMockHero()
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: mockHero, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
            }),
          }),
        }),
      } as any)

      const result = await getHeroHandler(mockEvent)

      expect(result).toEqual(mockHero)
      expect(serverSupabaseUser).toHaveBeenCalledWith(mockEvent)
      expect(getRouterParam).toHaveBeenCalledWith(mockEvent, 'id')
    })

    it('should throw 401 if user is not authenticated', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      await expect(getHeroHandler(mockEvent)).rejects.toThrow('Unauthorized')
    })

    it('should throw 400 if hero ID is missing', async () => {
      vi.mocked(getRouterParam).mockReturnValue(undefined)

      await expect(getHeroHandler(mockEvent)).rejects.toThrow('Hero ID required')
    })

    it('should throw 404 if player not found', async () => {
      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      } as any)

      await expect(getHeroHandler(mockEvent)).rejects.toThrow('Player not found')
    })

    it('should throw 404 if hero not found', async () => {
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
            }),
          }),
        }),
      } as any)

      await expect(getHeroHandler(mockEvent)).rejects.toThrow('Hero not found')
    })
  })

  describe('PATCH /api/heroes/[id]', () => {
    it('should update hero favorite status', async () => {
      const mockHero = createMockHero()
      const updatedHero = { ...mockHero, is_favorite: true }
      const mockPlayer = { id: 'player-1' }

      vi.mocked(readBody).mockResolvedValue({ is_favorite: true })

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: { id: 'hero-1' }, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'hero-1' }, error: null }),
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: updatedHero, error: null }),
            }),
          }),
        }),
      } as any)

      const result = await patchHeroHandler(mockEvent)

      expect(result).toEqual(updatedHero)
      expect(readBody).toHaveBeenCalledWith(mockEvent)
    })

    it('should update hero display title', async () => {
      const mockHero = createMockHero()
      const updatedHero = { ...mockHero, display_title: 'The Fearless' }
      const mockPlayer = { id: 'player-1' }

      vi.mocked(readBody).mockResolvedValue({ display_title: 'The Fearless' })

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: { id: 'hero-1' }, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'hero-1' }, error: null }),
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: updatedHero, error: null }),
            }),
          }),
        }),
      } as any)

      const result = await patchHeroHandler(mockEvent)

      expect(result.display_title).toBe('The Fearless')
    })

    it('should throw 401 if user is not authenticated', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      await expect(patchHeroHandler(mockEvent)).rejects.toThrow('Unauthorized')
    })

    it('should throw 400 if no fields to update', async () => {
      const mockPlayer = { id: 'player-1' }

      vi.mocked(readBody).mockResolvedValue({})

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: { id: 'hero-1' }, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'hero-1' }, error: null }),
            }),
          }),
        }),
      } as any)

      await expect(patchHeroHandler(mockEvent)).rejects.toThrow('No fields to update')
    })

    it('should throw 404 if hero not found', async () => {
      const mockPlayer = { id: 'player-1' }

      vi.mocked(readBody).mockResolvedValue({ is_favorite: true })

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: null, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      } as any)

      await expect(patchHeroHandler(mockEvent)).rejects.toThrow('Hero not found')
    })
  })

  describe('POST /api/heroes/[id]/retire', () => {
    it('should retire a hero successfully', async () => {
      const mockHero = createMockHero({ isOnExpedition: false, isStationed: false })
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mapSupabaseHeroToHero).mockReturnValue(mockHero)

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: mockHero, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
            }),
          }),
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      } as any)

      const result = await retireHeroHandler(mockEvent)

      expect(result.success).toBe(true)
      expect(result.message).toContain('Test Hero')
      expect(result.message).toContain('has been retired')
    })

    it('should throw 400 if hero is on expedition', async () => {
      const mockHero = createMockHero({ isOnExpedition: true, expeditionId: 'exp-1' })
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mapSupabaseHeroToHero).mockReturnValue(mockHero)

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: mockHero, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
            }),
          }),
        }),
      } as any)

      await expect(retireHeroHandler(mockEvent)).rejects.toThrow('Cannot retire hero while on expedition')
    })

    it('should throw 400 if hero is stationed', async () => {
      const mockHero = createMockHero({ isStationed: true, stationedZoneId: 'zone-1' })
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mapSupabaseHeroToHero).mockReturnValue(mockHero)

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: mockHero, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
            }),
          }),
        }),
      } as any)

      await expect(retireHeroHandler(mockEvent)).rejects.toThrow('Cannot retire hero while stationed')
    })

    it('should throw 401 if user is not authenticated', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      await expect(retireHeroHandler(mockEvent)).rejects.toThrow('Unauthorized')
    })

    it('should throw 404 if hero not found', async () => {
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
            }),
          }),
        }),
      } as any)

      await expect(retireHeroHandler(mockEvent)).rejects.toThrow('Hero not found')
    })
  })

  describe('POST /api/heroes/[id]/prestige', () => {
    it('should prestige a max-level hero successfully', async () => {
      const mockHero = createMockHero({ level: MAX_HERO_LEVEL, is_on_expedition: false })
      const mockPlayer = { id: 'player-1' }
      const prestigeResult = {
        hero: {
          ...mockHero,
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          prestigeLevel: 1,
          prestigeBonuses: { power: 5 },
          equipment: {},
        },
        statBonusGained: 5,
        upgradeTraitsCount: 1,
        gainedTraitSlot: false,
        newPrestigeLevel: 1,
      }
      const updatedHero = {
        ...mockHero,
        level: 1,
        prestige_level: 1,
      }

      vi.mocked(prestigeHero).mockReturnValue(prestigeResult)

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: mockHero, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: updatedHero, error: null }),
            }),
          }),
        }),
      } as any)

      const result = await prestigeHeroHandler(mockEvent)

      expect(result.success).toBe(true)
      expect(result.hero.prestige_level).toBe(1)
      expect(result.result.newPrestigeLevel).toBe(1)
      expect(result.result.statBonusGained).toBe(5)
      expect(prestigeHero).toHaveBeenCalledWith(mockHero)
    })

    it('should throw 400 if hero is below max level', async () => {
      const mockHero = createMockHero({ level: MAX_HERO_LEVEL - 1 })
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: mockHero, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
            }),
          }),
        }),
      } as any)

      await expect(prestigeHeroHandler(mockEvent)).rejects.toThrow(`Hero must be level ${MAX_HERO_LEVEL} to prestige`)
    })

    it('should throw 400 if hero is on expedition', async () => {
      const mockHero = createMockHero({ level: MAX_HERO_LEVEL, is_on_expedition: true })
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: mockHero, error: null }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
            }),
          }),
        }),
      } as any)

      await expect(prestigeHeroHandler(mockEvent)).rejects.toThrow('Cannot prestige while on expedition')
    })

    it('should throw 401 if user is not authenticated', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      await expect(prestigeHeroHandler(mockEvent)).rejects.toThrow('Unauthorized')
    })

    it('should throw 404 if player not found', async () => {
      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as any)

      await expect(prestigeHeroHandler(mockEvent)).rejects.toThrow('Player not found')
    })

    it('should throw 404 if hero not found', async () => {
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn()
              .mockResolvedValueOnce({ data: mockPlayer, error: null })
              .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } }),
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
            }),
          }),
        }),
      } as any)

      await expect(prestigeHeroHandler(mockEvent)).rejects.toThrow('Hero not found')
    })
  })
})
