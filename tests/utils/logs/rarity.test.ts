import { describe, it, expect } from 'vitest'
import { calculateFinalRarity, boostRarity } from '~/utils/logs/rarity'
import type { LogRarity } from '~~/types/expedition'

describe('Rarity Calculator', () => {
  describe('boostRarity', () => {
    it('should boost rarity by specified amount', () => {
      expect(boostRarity('common', 1)).toBe('standard')
      expect(boostRarity('common', 2)).toBe('noteworthy')
      expect(boostRarity('standard', 3)).toBe('epic')
    })

    it('should cap at legendary', () => {
      expect(boostRarity('epic', 5)).toBe('legendary')
      expect(boostRarity('legendary', 1)).toBe('legendary')
    })

    it('should not go below common', () => {
      expect(boostRarity('common', 0)).toBe('common')
    })
  })

  describe('calculateFinalRarity', () => {
    it('should return base rarity with no boosts', () => {
      const result = calculateFinalRarity('standard', { reactionBoosts: 0 })
      expect(result).toBe('standard')
    })

    it('should apply reaction boosts', () => {
      const result = calculateFinalRarity('standard', { reactionBoosts: 2 })
      expect(result).toBe('memorable')
    })

    it('should boost for epic loot', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        lootRarity: 'epic'
      })
      expect(result).toBe('noteworthy')
    })

    it('should boost for mythic loot', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        lootRarity: 'mythic'
      })
      expect(result).toBe('epic')
    })

    it('should boost for legendary loot', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        lootRarity: 'legendary'
      })
      expect(result).toBe('memorable')
    })

    it('should boost for discovery', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        isDiscovery: true
      })
      expect(result).toBe('memorable')
    })

    it('should boost for story hook', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        isStoryHook: true
      })
      expect(result).toBe('memorable')
    })

    it('should combine all boosts', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 1,
        lootRarity: 'legendary',
        isDiscovery: true
      })
      expect(result).toBe('legendary')
    })

    it('should cap at legendary even with many boosts', () => {
      const result = calculateFinalRarity('epic', {
        reactionBoosts: 5,
        lootRarity: 'mythic',
        isDiscovery: true,
        isStoryHook: true
      })
      expect(result).toBe('legendary')
    })
  })
})
