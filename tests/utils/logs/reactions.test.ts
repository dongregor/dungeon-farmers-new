import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { selectReactions, getTotalRarityBoost } from '~/utils/logs/reactions'
import type { Hero } from '~~/types'

// Mock heroes
const mockHeroes: Partial<Hero>[] = [
  { id: '1', name: 'Greg', storyTraitIds: ['lootGoblin'] },
  { id: '2', name: 'Lyra', storyTraitIds: ['coward'] },
  { id: '3', name: 'Kael', storyTraitIds: ['overconfident'] },
]

describe('Reaction Selector', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1) // Always trigger
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should select matching reactions for entry type', () => {
    const result = selectReactions(mockHeroes as Hero[], 'loot', 'forest')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].traitId).toBe('lootGoblin')
  })

  it('should prefer pair reactions when available', () => {
    const result = selectReactions(mockHeroes as Hero[], 'combat', 'forest')
    // coward + overconfident should trigger pair
    const hasPair = result.some(r => r.text.includes('Lyra') || r.text.includes('Kael'))
    expect(hasPair).toBe(true)
  })

  it('should return max 2 reactions', () => {
    const result = selectReactions(mockHeroes as Hero[], 'combat', 'forest')
    expect(result.length).toBeLessThanOrEqual(2)
  })

  it('should fill hero name in template', () => {
    const result = selectReactions(mockHeroes as Hero[], 'loot', 'forest')
    if (result.length > 0) {
      expect(result[0].text).not.toContain('{hero}')
    }
  })

  it('should return empty array when no traits match', () => {
    const heroesWithNoMatchingTraits: Partial<Hero>[] = [
      { id: '1', name: 'Test', storyTraitIds: ['unknownTrait'] },
    ]
    const result = selectReactions(heroesWithNoMatchingTraits as Hero[], 'loot', 'forest')
    expect(result).toEqual([])
  })

  it('should not trigger when random exceeds trigger chance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99) // Never trigger
    const result = selectReactions(mockHeroes as Hero[], 'loot', 'forest')
    expect(result).toEqual([])
  })
})

describe('getTotalRarityBoost', () => {
  it('should return 0 for empty reactions', () => {
    expect(getTotalRarityBoost([])).toBe(0)
  })

  it('should sum rarity boosts from all reactions', () => {
    const reactions = [
      { heroId: '1', heroName: 'Test', traitId: 'test', text: 'test', rarityBoost: 1 },
      { heroId: '2', heroName: 'Test2', traitId: 'test2', text: 'test', rarityBoost: 2 },
    ]
    expect(getTotalRarityBoost(reactions)).toBe(3)
  })
})
