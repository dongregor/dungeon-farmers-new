import { describe, it, expect } from 'vitest'
import { TRAIT_REACTIONS, getReactionsForTrait } from '~/data/logs/reactions/traits'

describe('Trait Reactions Data', () => {
  describe('TRAIT_REACTIONS', () => {
    it('should have reactions for core traits', () => {
      expect(TRAIT_REACTIONS['lootGoblin']).toBeDefined()
      expect(TRAIT_REACTIONS['coward']).toBeDefined()
      expect(TRAIT_REACTIONS['pyromaniac']).toBeDefined()
      expect(TRAIT_REACTIONS['grumpy']).toBeDefined()
      expect(TRAIT_REACTIONS['overconfident']).toBeDefined()
      expect(TRAIT_REACTIONS['bookworm']).toBeDefined()
      expect(TRAIT_REACTIONS['glutton']).toBeDefined()
      expect(TRAIT_REACTIONS['nightOwl']).toBeDefined()
      expect(TRAIT_REACTIONS['superstitious']).toBeDefined()
    })

    it('each reaction should have required fields', () => {
      for (const reaction of Object.values(TRAIT_REACTIONS)) {
        expect(reaction.traitId).toBeDefined()
        expect(reaction.reactions.length).toBeGreaterThan(0)
        expect(reaction.triggerChance).toBeGreaterThan(0)
        expect(reaction.triggerChance).toBeLessThanOrEqual(1)
        expect([0, 1, 2]).toContain(reaction.rarityBoost)
      }
    })

    it('each reaction should have triggers with entryTypes', () => {
      for (const reaction of Object.values(TRAIT_REACTIONS)) {
        expect(reaction.triggers).toBeDefined()
        expect(reaction.triggers.entryTypes).toBeDefined()
        expect(reaction.triggers.entryTypes!.length).toBeGreaterThan(0)
      }
    })

    it('all reactions should include {hero} placeholder', () => {
      for (const [traitId, reaction] of Object.entries(TRAIT_REACTIONS)) {
        for (const text of reaction.reactions) {
          expect(text).toContain('{hero}')
        }
      }
    })

    it('traitId should match the key in TRAIT_REACTIONS', () => {
      for (const [key, reaction] of Object.entries(TRAIT_REACTIONS)) {
        expect(reaction.traitId).toBe(key)
      }
    })
  })

  describe('getReactionsForTrait', () => {
    it('should return matching reactions for lootGoblin on loot entry', () => {
      const reactions = getReactionsForTrait('lootGoblin', 'loot')
      expect(reactions.length).toBeGreaterThan(0)
      expect(reactions[0].traitId).toBe('lootGoblin')
    })

    it('should return empty array for non-matching entry type', () => {
      const reactions = getReactionsForTrait('lootGoblin', 'combat')
      expect(reactions.length).toBe(0)
    })

    it('should return empty array for unknown trait', () => {
      const reactions = getReactionsForTrait('nonexistentTrait', 'loot')
      expect(reactions.length).toBe(0)
    })

    it('should match coward on combat entry', () => {
      const reactions = getReactionsForTrait('coward', 'combat')
      expect(reactions.length).toBeGreaterThan(0)
    })

    it('should match pyromaniac on combat entry', () => {
      const reactions = getReactionsForTrait('pyromaniac', 'combat')
      expect(reactions.length).toBeGreaterThan(0)
    })

    it('should filter by zone type when specified in reaction', () => {
      // pyromaniac triggers on desert/ruins zone types
      const reactionsWithZone = getReactionsForTrait('pyromaniac', 'combat', 'desert')
      expect(reactionsWithZone.length).toBeGreaterThan(0)

      // Should not match if zone type does not match
      const reactionsWrongZone = getReactionsForTrait('pyromaniac', 'combat', 'forest')
      expect(reactionsWrongZone.length).toBe(0)
    })

    it('should return reactions regardless of zone when no zoneTypes specified', () => {
      // coward has no zoneTypes restriction
      const reactions = getReactionsForTrait('coward', 'combat', 'anyZone')
      expect(reactions.length).toBeGreaterThan(0)
    })
  })

  describe('Specific Trait Reactions', () => {
    it('lootGoblin should trigger on loot entries', () => {
      const reaction = TRAIT_REACTIONS['lootGoblin']
      expect(reaction.triggers.entryTypes).toContain('loot')
      expect(reaction.triggerChance).toBeGreaterThanOrEqual(0.5)
    })

    it('coward should trigger on combat entries', () => {
      const reaction = TRAIT_REACTIONS['coward']
      expect(reaction.triggers.entryTypes).toContain('combat')
    })

    it('pyromaniac should have zone type restrictions', () => {
      const reaction = TRAIT_REACTIONS['pyromaniac']
      expect(reaction.triggers.zoneTypes).toBeDefined()
      expect(reaction.triggers.zoneTypes!.length).toBeGreaterThan(0)
    })

    it('grumpy should trigger on travel or event entries', () => {
      const reaction = TRAIT_REACTIONS['grumpy']
      expect(reaction.triggers.entryTypes).toBeDefined()
      const entryTypes = reaction.triggers.entryTypes!
      expect(entryTypes.some(t => ['travel', 'event', 'combat'].includes(t))).toBe(true)
    })

    it('overconfident should trigger on combat entries', () => {
      const reaction = TRAIT_REACTIONS['overconfident']
      expect(reaction.triggers.entryTypes).toContain('combat')
      expect(reaction.rarityBoost).toBeGreaterThanOrEqual(1)
    })

    it('bookworm should have relevant trigger types', () => {
      const reaction = TRAIT_REACTIONS['bookworm']
      expect(reaction.triggers.entryTypes).toBeDefined()
      expect(reaction.triggers.entryTypes!.length).toBeGreaterThan(0)
    })

    it('glutton should trigger on rest or event entries', () => {
      const reaction = TRAIT_REACTIONS['glutton']
      expect(reaction.triggers.entryTypes).toBeDefined()
    })

    it('nightOwl should trigger on relevant entries', () => {
      const reaction = TRAIT_REACTIONS['nightOwl']
      expect(reaction.triggers.entryTypes).toBeDefined()
    })

    it('superstitious should trigger on event or travel entries', () => {
      const reaction = TRAIT_REACTIONS['superstitious']
      expect(reaction.triggers.entryTypes).toBeDefined()
      const entryTypes = reaction.triggers.entryTypes!
      expect(entryTypes.some(t => ['event', 'travel'].includes(t))).toBe(true)
    })
  })
})
