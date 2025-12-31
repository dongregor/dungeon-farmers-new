import { describe, it, expect } from 'vitest'
import { validateDungeon, validateSlotPlacement } from '~/utils/dungeonValidator'
import type { Monster, SchematicDefinition, PlacedMonster } from '~~/types'

function createTestMonster(overrides: Partial<Monster> = {}): Monster {
  return {
    id: 'test-monster',
    baseName: 'Test Monster',
    type: 'beast',
    family: 'Wolf',
    element: 'physical',
    packType: 'trash',
    biome: 'forest',
    basePower: 20,
    baseCaptureChance: 0.3,
    lootTable: [],
    ...overrides
  }
}

const testSchematic: SchematicDefinition = {
  id: 'test-schematic',
  name: 'Test Dungeon',
  description: 'A test dungeon',
  rarity: 'common',
  theme: 'cave',
  slots: [
    { id: 'slot1', position: 1, allowedTypes: ['beast'] },
    { id: 'slot2', position: 2, allowedTypes: 'any' },
    { id: 'slot3', position: 3, allowedTypes: ['undead', 'demon'] }
  ],
  affixes: [],
  baseDuration: 120,
  baseRewards: { goldMin: 50, goldMax: 100, xpMin: 20, xpMax: 40 }
}

describe('Dungeon Validator', () => {
  describe('validateSlotPlacement', () => {
    it('should accept valid type placement', () => {
      const monster = createTestMonster({ type: 'beast' })
      const slot = { id: 'slot1', position: 1, allowedTypes: ['beast'] as const }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept any type in "any" slot', () => {
      const monster = createTestMonster({ type: 'dragon' })
      const slot = { id: 'slot2', position: 2, allowedTypes: 'any' as const }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(true)
    })

    it('should reject wrong type placement', () => {
      const monster = createTestMonster({ type: 'humanoid' })
      const slot = { id: 'slot1', position: 1, allowedTypes: ['beast'] as const }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].code).toBe('wrong_type')
    })

    it('should validate required elements', () => {
      const monster = createTestMonster({ element: 'ice' })
      const slot = {
        id: 'slot1',
        position: 1,
        allowedTypes: 'any' as const,
        requiredElements: ['fire'] as const
      }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(false)
      expect(result.errors[0].code).toBe('wrong_element')
    })
  })

  describe('validateDungeon', () => {
    it('should validate complete valid dungeon', () => {
      const monsters: PlacedMonster[] = [
        { slotId: 'slot1', monsterId: 'm1', monster: createTestMonster({ id: 'm1', type: 'beast' }) },
        { slotId: 'slot2', monsterId: 'm2', monster: createTestMonster({ id: 'm2', type: 'dragon' }) },
        { slotId: 'slot3', monsterId: 'm3', monster: createTestMonster({ id: 'm3', type: 'undead' }) }
      ]

      const result = validateDungeon(testSchematic, monsters)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing monsters', () => {
      const monsters: PlacedMonster[] = [
        { slotId: 'slot1', monsterId: 'm1', monster: createTestMonster({ id: 'm1', type: 'beast' }) }
      ]

      const result = validateDungeon(testSchematic, monsters)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.code === 'missing_monster')).toBe(true)
    })

    it('should detect duplicate monsters', () => {
      const sharedMonster = createTestMonster({ id: 'same-monster', type: 'beast' })
      const monsters: PlacedMonster[] = [
        { slotId: 'slot1', monsterId: 'same-monster', monster: sharedMonster },
        { slotId: 'slot2', monsterId: 'same-monster', monster: sharedMonster },
        { slotId: 'slot3', monsterId: 'm3', monster: createTestMonster({ id: 'm3', type: 'undead' }) }
      ]

      const result = validateDungeon(testSchematic, monsters)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.code === 'duplicate_monster')).toBe(true)
    })
  })
})
