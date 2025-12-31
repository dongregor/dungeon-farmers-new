import { describe, it, expect } from 'vitest'
import { SYNERGIES, getSynergyById, getSynergiesByTier } from '~/data/synergies'

describe('Synergy Definitions', () => {
  describe('SYNERGIES array', () => {
    it('should have at least 15 synergies defined', () => {
      expect(SYNERGIES.length).toBeGreaterThanOrEqual(15)
    })

    it('should have synergies in all three tiers', () => {
      const basic = SYNERGIES.filter(s => s.tier === 'basic')
      const intermediate = SYNERGIES.filter(s => s.tier === 'intermediate')
      const hidden = SYNERGIES.filter(s => s.tier === 'hidden')

      expect(basic.length).toBeGreaterThanOrEqual(5)
      expect(intermediate.length).toBeGreaterThanOrEqual(5)
      expect(hidden.length).toBeGreaterThanOrEqual(5)
    })

    it('should have unique IDs', () => {
      const ids = SYNERGIES.map(s => s.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid tier values', () => {
      const validTiers = ['basic', 'intermediate', 'hidden']
      SYNERGIES.forEach(synergy => {
        expect(validTiers).toContain(synergy.tier)
      })
    })

    it('should have at least one effect per synergy', () => {
      SYNERGIES.forEach(synergy => {
        expect(synergy.effects.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should have hints for hidden synergies', () => {
      const hidden = SYNERGIES.filter(s => s.tier === 'hidden')
      hidden.forEach(synergy => {
        expect(synergy.hint).toBeDefined()
        expect(synergy.hint!.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getSynergyById', () => {
    it('should return synergy by ID', () => {
      const synergy = getSynergyById('pack_tactics')
      expect(synergy).toBeDefined()
      expect(synergy!.name).toBe('Pack Tactics')
    })

    it('should return undefined for unknown ID', () => {
      const synergy = getSynergyById('nonexistent')
      expect(synergy).toBeUndefined()
    })
  })

  describe('getSynergiesByTier', () => {
    it('should return only basic synergies', () => {
      const basic = getSynergiesByTier('basic')
      expect(basic.every(s => s.tier === 'basic')).toBe(true)
    })

    it('should return only hidden synergies', () => {
      const hidden = getSynergiesByTier('hidden')
      expect(hidden.every(s => s.tier === 'hidden')).toBe(true)
    })
  })
})
