import { describe, it, expect } from 'vitest'
import { SCHEMATICS, getSchematicById, getSchematicsByRarity } from '~/data/schematics'
import { SCHEMATIC_SLOT_COUNTS, SCHEMATIC_THEMED_SLOTS } from '~~/types'

describe('Schematic Definitions', () => {
  describe('SCHEMATICS array', () => {
    it('should have at least 10 schematics defined', () => {
      expect(SCHEMATICS.length).toBeGreaterThanOrEqual(10)
    })

    it('should have schematics in all rarity tiers', () => {
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']
      for (const rarity of rarities) {
        const found = SCHEMATICS.filter(s => s.rarity === rarity)
        expect(found.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('should have unique IDs', () => {
      const ids = SCHEMATICS.map(s => s.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have slot counts matching rarity requirements', () => {
      for (const schematic of SCHEMATICS) {
        const expected = SCHEMATIC_SLOT_COUNTS[schematic.rarity]
        expect(schematic.slots.length).toBeGreaterThanOrEqual(expected.min)
        expect(schematic.slots.length).toBeLessThanOrEqual(expected.max)
      }
    })

    it('should have themed slot counts matching rarity', () => {
      for (const schematic of SCHEMATICS) {
        const expectedMax = SCHEMATIC_THEMED_SLOTS[schematic.rarity]
        const themedCount = schematic.slots.filter(s => s.themed).length
        expect(themedCount).toBeLessThanOrEqual(expectedMax)
      }
    })
  })

  describe('getSchematicById', () => {
    it('should return schematic by ID', () => {
      const schematic = getSchematicById('basic_cave')
      expect(schematic).toBeDefined()
      expect(schematic!.rarity).toBe('common')
    })

    it('should return undefined for unknown ID', () => {
      const schematic = getSchematicById('nonexistent')
      expect(schematic).toBeUndefined()
    })
  })

  describe('getSchematicsByRarity', () => {
    it('should return only common schematics', () => {
      const common = getSchematicsByRarity('common')
      expect(common.every(s => s.rarity === 'common')).toBe(true)
    })
  })
})
