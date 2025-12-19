import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Equipment, Hero, TraitQuality, EquipmentRarity } from '~~/types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Mock dependencies
vi.mock('#supabase/server', () => ({
  serverSupabaseClient: vi.fn(),
  serverSupabaseUser: vi.fn(),
}))

import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// Import route handlers
import getEquipmentHandler from '~~/server/api/equipment/index.get'
import equipItemHandler from '~~/server/api/equipment/[id]/equip.post'
import upgradeEquipmentHandler from '~~/server/api/equipment/[id]/upgrade.post'

// Test helpers
// Using valid v4 UUIDs (4 in the 3rd group, 8/9/a/b in the 4th group)
const MOCK_UUID_EQUIPMENT = '550e8400-e29b-41d4-a716-446655440001'
const MOCK_UUID_HERO = '550e8400-e29b-41d4-a716-446655440010'
const MOCK_UUID_HERO_2 = '550e8400-e29b-41d4-a716-446655440011'
const MOCK_UUID_EQUIPMENT_2 = '550e8400-e29b-41d4-a716-446655440002'

function createMockEquipment(overrides: Partial<Equipment> = {}): Equipment {
  return {
    id: MOCK_UUID_EQUIPMENT,
    name: 'Iron Sword',
    slot: 'weapon',
    rarity: 'common',
    itemLevel: 1,
    basePower: 10,
    traits: [
      { traitId: 'strength', quality: 'normal' as TraitQuality, rolledValue: 5 },
    ],
    isEquipped: false,
    equippedBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

function createMockHero(overrides: Partial<Hero> = {}): Hero {
  return {
    id: MOCK_UUID_HERO,
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
    gte: vi.fn(() => client),
    in: vi.fn(() => client),
    single: vi.fn(() => ({ data: null, error: null })),
  } as unknown as SupabaseClient
  return client
}

describe('Equipment API Routes', () => {
  let mockEvent: any
  let mockClient: SupabaseClient

  beforeEach(() => {
    vi.clearAllMocks()
    mockClient = createMockSupabaseClient()
    mockEvent = {}

    vi.mocked(serverSupabaseClient).mockResolvedValue(mockClient)
    vi.mocked(serverSupabaseUser).mockResolvedValue({ id: 'user-1' } as any)
    vi.mocked(getQuery).mockReturnValue({})
    vi.mocked(getRouterParam).mockReturnValue(MOCK_UUID_EQUIPMENT)
  })

  describe('GET /api/equipment', () => {
    it('should return all equipment for a player', async () => {
      const mockEquipment = [createMockEquipment(), createMockEquipment({ id: MOCK_UUID_EQUIPMENT_2, name: 'Steel Shield' })]
      const mockPlayer = { id: 'player-1' }

      vi.mocked(mockClient.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
          }),
        }),
      } as any).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
        }),
      } as any)

      const result = await getEquipmentHandler(mockEvent)

      expect(result.equipment).toEqual(mockEquipment)
      expect(result.equipment).toHaveLength(2)
    })

    it('should filter equipment by equipped status', async () => {
      const mockEquipment = [createMockEquipment({ isEquipped: true, equippedBy: MOCK_UUID_HERO })]
      const mockPlayer = { id: 'player-1' }

      vi.mocked(getQuery).mockReturnValue({ equipped: 'true' })

      vi.mocked(mockClient.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
          }),
        }),
      } as any).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
          }),
        }),
      } as any)

      const result = await getEquipmentHandler(mockEvent)

      expect(result.equipment).toEqual(mockEquipment)
      expect(result.equipment[0].isEquipped).toBe(true)
    })

    it('should filter equipment by hero ID', async () => {
      const mockEquipment = [createMockEquipment({ isEquipped: true, equippedBy: MOCK_UUID_HERO })]
      const mockPlayer = { id: 'player-1' }

      vi.mocked(getQuery).mockReturnValue({ heroId: MOCK_UUID_HERO })

      vi.mocked(mockClient.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
          }),
        }),
      } as any).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
          }),
        }),
      } as any)

      const result = await getEquipmentHandler(mockEvent)

      expect(result.equipment).toEqual(mockEquipment)
    })

    it('should throw 401 if user is not authenticated', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      await expect(getEquipmentHandler(mockEvent)).rejects.toThrow('Unauthorized')
    })

    it('should throw 404 if player not found', async () => {
      vi.mocked(mockClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      } as any)

      await expect(getEquipmentHandler(mockEvent)).rejects.toThrow('Player not found')
    })
  })

  describe('POST /api/equipment/[id]/equip', () => {
    it('should equip an item to a hero', async () => {
      const mockEquipment = createMockEquipment()
      const mockHero = createMockHero({ equipment: {} })
      const mockPlayer = { id: 'player-1' }
      const equippedItem = { ...mockEquipment, is_equipped: true, equipped_by: MOCK_UUID_HERO }
      const updatedHero = { ...mockHero, equipment: { weapon: MOCK_UUID_EQUIPMENT } }

      vi.mocked(readBody).mockResolvedValue({ heroId: MOCK_UUID_HERO, slot: 'weapon' })

      // Mock database calls
      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: equippedItem, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: updatedHero, error: null }),
              }),
            }),
          }),
        } as any)

      const result = await equipItemHandler(mockEvent)

      expect(result.equipment).toEqual(equippedItem)
      expect(result.hero).toEqual(updatedHero)
      expect(result.unequipped).toBeUndefined()
    })

    it('should unequip previous item when equipping to occupied slot', async () => {
      const mockEquipment = createMockEquipment()
      const previousEquipment = createMockEquipment({ id: MOCK_UUID_EQUIPMENT_2, name: 'Old Sword' })
      const mockHero = createMockHero({ equipment: { weapon: MOCK_UUID_EQUIPMENT_2 } })
      const mockPlayer = { id: 'player-1' }
      const equippedItem = { ...mockEquipment, is_equipped: true, equipped_by: MOCK_UUID_HERO }
      const unequippedItem = { ...previousEquipment, is_equipped: false, equipped_by: null }
      const updatedHero = { ...mockHero, equipment: { weapon: MOCK_UUID_EQUIPMENT } }

      vi.mocked(readBody).mockResolvedValue({ heroId: MOCK_UUID_HERO, slot: 'weapon' })

      // Mock database calls
      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockHero, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: unequippedItem, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: equippedItem, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: updatedHero, error: null }),
              }),
            }),
          }),
        } as any)

      const result = await equipItemHandler(mockEvent)

      expect(result.equipment).toEqual(equippedItem)
      expect(result.hero).toEqual(updatedHero)
      expect(result.unequipped).toEqual(unequippedItem)
    })

    it('should throw 400 if slot mismatch', async () => {
      const mockEquipment = createMockEquipment({ slot: 'weapon' })
      const mockPlayer = { id: 'player-1' }

      vi.mocked(readBody).mockResolvedValue({ heroId: MOCK_UUID_HERO, slot: 'armor' })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)

      await expect(equipItemHandler(mockEvent)).rejects.toThrow('Slot mismatch')
    })

    it('should throw 401 if user is not authenticated', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      await expect(equipItemHandler(mockEvent)).rejects.toThrow('Unauthorized')
    })

    it('should throw 404 if equipment not found', async () => {
      const mockPlayer = { id: 'player-1' }

      vi.mocked(readBody).mockResolvedValue({ heroId: MOCK_UUID_HERO, slot: 'weapon' })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
              }),
            }),
          }),
        } as any)

      await expect(equipItemHandler(mockEvent)).rejects.toThrow('Equipment not found')
    })

    it('should throw 404 if hero not found', async () => {
      const mockEquipment = createMockEquipment()
      const mockPlayer = { id: 'player-1' }

      vi.mocked(readBody).mockResolvedValue({ heroId: MOCK_UUID_HERO, slot: 'weapon' })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
              }),
            }),
          }),
        } as any)

      await expect(equipItemHandler(mockEvent)).rejects.toThrow('Hero not found')
    })
  })

  describe('POST /api/equipment/[id]/upgrade', () => {
    it('should upgrade equipment trait quality', async () => {
      const mockEquipment = {
        ...createMockEquipment(),
        traits: [
          { traitId: 'strength', quality: 'normal' as TraitQuality, rolledValue: 5 },
        ],
        rarity: 'common' as EquipmentRarity,
        item_level: 1,
      }
      const mockPlayer = { id: 'player-1', gold: 1000 }
      const upgradedEquipment = {
        ...mockEquipment,
        traits: [
          { traitId: 'strength', quality: 'magic' as TraitQuality, rolledValue: 5 },
        ],
      }
      const updatedPlayer = { gold: 900 }

      vi.mocked(readBody).mockResolvedValue({ traitIndex: 0 })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: updatedPlayer, error: null }),
                }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: upgradedEquipment, error: null }),
              }),
            }),
          }),
        } as any)

      const result = await upgradeEquipmentHandler(mockEvent)

      expect(result.equipment).toEqual(upgradedEquipment)
      expect(result.goldSpent).toBe(101) // Base 100 * 1.0 (common) * 1.01 (level 1)
    })

    it('should throw 400 if trait is already max quality', async () => {
      const mockEquipment = createMockEquipment({
        traits: [
          { traitId: 'strength', quality: 'perfect' as TraitQuality, rolledValue: 5 },
        ],
      })
      const mockPlayer = { id: 'player-1', gold: 1000 }

      vi.mocked(readBody).mockResolvedValue({ traitIndex: 0 })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)

      await expect(upgradeEquipmentHandler(mockEvent)).rejects.toThrow('already at maximum quality')
    })

    it('should throw 400 if invalid trait index', async () => {
      const mockEquipment = createMockEquipment({
        traits: [
          { traitId: 'strength', quality: 'normal' as TraitQuality, rolledValue: 5 },
        ],
      })
      const mockPlayer = { id: 'player-1', gold: 1000 }

      vi.mocked(readBody).mockResolvedValue({ traitIndex: 5 })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)

      await expect(upgradeEquipmentHandler(mockEvent)).rejects.toThrow('Invalid trait index')
    })

    it('should throw 400 if insufficient gold', async () => {
      const mockEquipment = createMockEquipment({
        traits: [
          { traitId: 'strength', quality: 'normal' as TraitQuality, rolledValue: 5 },
        ],
      })
      const mockPlayer = { id: 'player-1', gold: 50 } // Not enough for 100 gold upgrade

      vi.mocked(readBody).mockResolvedValue({ traitIndex: 0 })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockEquipment, error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: { message: 'No rows' } }),
                }),
              }),
            }),
          }),
        } as any)

      await expect(upgradeEquipmentHandler(mockEvent)).rejects.toThrow('Insufficient gold')
    })

    it('should throw 401 if user is not authenticated', async () => {
      vi.mocked(serverSupabaseUser).mockResolvedValue(null)

      await expect(upgradeEquipmentHandler(mockEvent)).rejects.toThrow('Unauthorized')
    })

    it('should throw 404 if equipment not found', async () => {
      const mockPlayer = { id: 'player-1', gold: 1000 }

      vi.mocked(readBody).mockResolvedValue({ traitIndex: 0 })

      vi.mocked(mockClient.from)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockPlayer, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
              }),
            }),
          }),
        } as any)

      await expect(upgradeEquipmentHandler(mockEvent)).rejects.toThrow('Equipment not found')
    })
  })
})
