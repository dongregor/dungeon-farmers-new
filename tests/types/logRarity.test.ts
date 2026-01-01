import { describe, it, expect } from 'vitest'
import type { LogRarity, LogEntry } from '~~/types/expedition'
import { RARITY_ORDER, RARITY_COLORS } from '~~/types/expedition'

describe('Log Rarity Types', () => {
  it('LogRarity should include all 6 tiers', () => {
    const rarities: LogRarity[] = ['common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary']
    expect(rarities).toHaveLength(6)
  })

  it('LogEntry should include rarity field', () => {
    const entry: LogEntry = {
      text: 'Test entry',
      type: 'narrative',
      rarity: 'noteworthy'
    }
    expect(entry.rarity).toBe('noteworthy')
  })

  it('LogEntry should include rarityBoost field', () => {
    const entry: LogEntry = {
      text: 'Boosted entry',
      type: 'reaction',
      rarity: 'memorable',
      rarityBoost: 2
    }
    expect(entry.rarityBoost).toBe(2)
  })

  it('RARITY_ORDER should contain all rarities in ascending order', () => {
    expect(RARITY_ORDER).toEqual(['common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary'])
    expect(RARITY_ORDER).toHaveLength(6)
  })

  it('RARITY_COLORS should map all rarities to Tailwind classes', () => {
    expect(RARITY_COLORS.common).toBe('text-gray-500')
    expect(RARITY_COLORS.standard).toBe('text-gray-200')
    expect(RARITY_COLORS.noteworthy).toBe('text-green-400')
    expect(RARITY_COLORS.memorable).toBe('text-blue-400')
    expect(RARITY_COLORS.epic).toBe('text-purple-400')
    expect(RARITY_COLORS.legendary).toBe('text-orange-400')
  })

  it('RARITY_COLORS should have an entry for each rarity in RARITY_ORDER', () => {
    for (const rarity of RARITY_ORDER) {
      expect(RARITY_COLORS[rarity]).toBeDefined()
      expect(typeof RARITY_COLORS[rarity]).toBe('string')
    }
  })
})
