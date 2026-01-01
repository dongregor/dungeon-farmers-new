import { describe, it, expect } from 'vitest'
import { PAIR_REACTIONS, findPairReaction, getTraitIdsInPairs } from '~/data/logs/reactions/pairs'
import type { TraitPairReaction, LogEntryType } from '~~/types/logs'

describe('Pair Reactions Data', () => {
  describe('PAIR_REACTIONS', () => {
    it('should have at least 5 pair reactions', () => {
      expect(PAIR_REACTIONS.length).toBeGreaterThanOrEqual(5)
    })

    it('each pair should have two trait IDs', () => {
      for (const pair of PAIR_REACTIONS) {
        expect(pair.traitIds).toHaveLength(2)
      }
    })

    it('each pair should have required fields', () => {
      for (const pair of PAIR_REACTIONS) {
        expect(pair.traitIds).toBeDefined()
        expect(pair.triggers).toBeDefined()
        expect(pair.reactions.length).toBeGreaterThan(0)
        expect(pair.triggerChance).toBeGreaterThan(0)
        expect(pair.triggerChance).toBeLessThanOrEqual(1)
        expect([1, 2]).toContain(pair.rarityBoost)
      }
    })

    it('all pair reactions should include {hero1} and {hero2} placeholders', () => {
      for (const pair of PAIR_REACTIONS) {
        for (const text of pair.reactions) {
          expect(text).toContain('{hero1}')
          expect(text).toContain('{hero2}')
        }
      }
    })

    it('should include coward + overconfident pair for combat', () => {
      const pair = PAIR_REACTIONS.find(
        p => (p.traitIds.includes('coward') && p.traitIds.includes('overconfident'))
      )
      expect(pair).toBeDefined()
      expect(pair?.triggers.entryTypes).toContain('combat')
    })

    it('should include lootGoblin + treasureHunter pair for loot', () => {
      const pair = PAIR_REACTIONS.find(
        p => (p.traitIds.includes('lootGoblin') && p.traitIds.includes('treasureHunter'))
      )
      expect(pair).toBeDefined()
      expect(pair?.triggers.entryTypes).toContain('loot')
    })

    it('should include pyromaniac + bookworm pair for event', () => {
      const pair = PAIR_REACTIONS.find(
        p => (p.traitIds.includes('pyromaniac') && p.traitIds.includes('bookworm'))
      )
      expect(pair).toBeDefined()
      expect(pair?.triggers.entryTypes).toContain('event')
    })

    it('should include grumpy + dramatic pair', () => {
      const pair = PAIR_REACTIONS.find(
        p => (p.traitIds.includes('grumpy') && p.traitIds.includes('dramatic'))
      )
      expect(pair).toBeDefined()
    })

    it('should include nightOwl + superstitious pair', () => {
      const pair = PAIR_REACTIONS.find(
        p => (p.traitIds.includes('nightOwl') && p.traitIds.includes('superstitious'))
      )
      expect(pair).toBeDefined()
    })
  })

  describe('findPairReaction', () => {
    it('should find matching pair for coward + overconfident on combat', () => {
      const result = findPairReaction(['coward', 'overconfident'], 'combat')
      expect(result).toBeDefined()
      expect(result?.traitIds).toEqual(expect.arrayContaining(['coward', 'overconfident']))
    })

    it('should work regardless of trait order', () => {
      const result1 = findPairReaction(['coward', 'overconfident'], 'combat')
      const result2 = findPairReaction(['overconfident', 'coward'], 'combat')
      expect(result1).toEqual(result2)
    })

    it('should return null for non-matching entry type', () => {
      // coward + overconfident only trigger on combat
      const result = findPairReaction(['coward', 'overconfident'], 'loot')
      expect(result).toBeNull()
    })

    it('should return null when no matching pair exists', () => {
      const result = findPairReaction(['nonexistent1', 'nonexistent2'], 'combat')
      expect(result).toBeNull()
    })

    it('should return null when only one trait matches', () => {
      const result = findPairReaction(['coward', 'nonexistent'], 'combat')
      expect(result).toBeNull()
    })

    it('should find pairs from larger trait arrays', () => {
      // Party has multiple traits, should still find the matching pair
      const result = findPairReaction(['grumpy', 'coward', 'overconfident', 'brawny'], 'combat')
      expect(result).toBeDefined()
    })

    it('should respect zone type restrictions when provided', () => {
      // Find a pair that has zone restrictions (if any exist)
      const pairWithZone = PAIR_REACTIONS.find(p => p.triggers.zoneTypes && p.triggers.zoneTypes.length > 0)
      if (pairWithZone) {
        const validZone = pairWithZone.triggers.zoneTypes![0]
        const entryType = pairWithZone.triggers.entryTypes?.[0] ?? 'event'

        // Should match with correct zone
        const resultWithZone = findPairReaction(pairWithZone.traitIds, entryType, validZone)
        expect(resultWithZone).toBeDefined()

        // Should not match with wrong zone
        const resultWrongZone = findPairReaction(pairWithZone.traitIds, entryType, 'nonexistent_zone')
        expect(resultWrongZone).toBeNull()
      }
    })
  })

  describe('getTraitIdsInPairs', () => {
    it('should return an array of unique trait IDs', () => {
      const traitIds = getTraitIdsInPairs()
      expect(Array.isArray(traitIds)).toBe(true)
      expect(traitIds.length).toBeGreaterThan(0)

      // Check for uniqueness
      const uniqueSet = new Set(traitIds)
      expect(uniqueSet.size).toBe(traitIds.length)
    })

    it('should include traits from all pair reactions', () => {
      const traitIds = getTraitIdsInPairs()

      // Each pair's traits should be in the result
      for (const pair of PAIR_REACTIONS) {
        expect(traitIds).toContain(pair.traitIds[0])
        expect(traitIds).toContain(pair.traitIds[1])
      }
    })
  })
})
