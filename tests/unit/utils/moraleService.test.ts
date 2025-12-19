import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getMoraleState,
  getMoraleValue,
  applyMoraleChange,
  calculateMoraleRecovery,
  updateMoraleAfterExpedition,
  updateMoraleAfterLevelUp,
  canGoOnExpedition,
  getMoraleEfficiencyModifier,
  getMoraleColor,
  getMoraleDescription,
  MORALE_EFFICIENCY_MODIFIERS,
} from '~/utils/moraleService'
import type { Hero } from '~~/types'

// Test helper to create a basic hero
function createTestHero(overrides: Partial<Hero> = {}): Hero {
  return {
    id: 'hero-1',
    name: 'Test Hero',
    gender: 'male',
    culture: 'forest-folk',
    titles: [],
    displayTitle: null,
    rarity: 'common',
    archetype: 'warrior',
    archetypeTags: ['melee', 'tank'],
    baseStats: { combat: 5, utility: 3, survival: 4 },
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gameplayTraits: [],
    storyTraitIds: [],
    power: 50,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
    currentExpeditionId: null,
    isFavorite: false,
    morale: 'content',
    moraleValue: 70,
    moraleLastUpdate: new Date().toISOString(),
    isOnExpedition: false,
    isStationed: false,
    stationedZoneId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('Morale Service', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('getMoraleState', () => {
    it('should return exhausted for values 0-19', () => {
      expect(getMoraleState(0)).toBe('exhausted')
      expect(getMoraleState(10)).toBe('exhausted')
      expect(getMoraleState(19)).toBe('exhausted')
    })

    it('should return frustrated for values 20-29', () => {
      expect(getMoraleState(20)).toBe('frustrated')
      expect(getMoraleState(25)).toBe('frustrated')
      expect(getMoraleState(29)).toBe('frustrated')
    })

    it('should return tired for values 30-49', () => {
      expect(getMoraleState(30)).toBe('tired')
      expect(getMoraleState(40)).toBe('tired')
      expect(getMoraleState(49)).toBe('tired')
    })

    it('should return content for values 50-79', () => {
      expect(getMoraleState(50)).toBe('content')
      expect(getMoraleState(65)).toBe('content')
      expect(getMoraleState(79)).toBe('content')
    })

    it('should return excited for values 80-100', () => {
      expect(getMoraleState(80)).toBe('excited')
      expect(getMoraleState(90)).toBe('excited')
      expect(getMoraleState(100)).toBe('excited')
    })
  })

  describe('getMoraleValue', () => {
    it('should return mid-range value for each state', () => {
      expect(getMoraleValue('exhausted')).toBeGreaterThanOrEqual(0)
      expect(getMoraleValue('exhausted')).toBeLessThan(20)

      expect(getMoraleValue('frustrated')).toBeGreaterThanOrEqual(20)
      expect(getMoraleValue('frustrated')).toBeLessThan(30)

      expect(getMoraleValue('tired')).toBeGreaterThanOrEqual(30)
      expect(getMoraleValue('tired')).toBeLessThan(50)

      expect(getMoraleValue('content')).toBeGreaterThanOrEqual(50)
      expect(getMoraleValue('content')).toBeLessThan(80)

      expect(getMoraleValue('excited')).toBeGreaterThanOrEqual(80)
      expect(getMoraleValue('excited')).toBeLessThanOrEqual(100)
    })

    it('should return consistent values', () => {
      // Test that it returns the same value each time
      const contentValue = getMoraleValue('content')
      expect(getMoraleValue('content')).toBe(contentValue)
    })
  })

  describe('applyMoraleChange', () => {
    it('should increase morale value', () => {
      const result = applyMoraleChange(50, 20)

      expect(result.moraleValue).toBe(70)
      expect(result.morale).toBe('content')
    })

    it('should decrease morale value', () => {
      const result = applyMoraleChange(65, -20)

      expect(result.moraleValue).toBe(45)
      expect(result.morale).toBe('tired')
    })

    it('should cap at 100', () => {
      const result = applyMoraleChange(95, 20)

      expect(result.moraleValue).toBe(100)
      expect(result.morale).toBe('excited')
    })

    it('should cap at 0', () => {
      const result = applyMoraleChange(10, -20)

      expect(result.moraleValue).toBe(0)
      expect(result.morale).toBe('exhausted')
    })

    it('should transition states correctly', () => {
      // tired (40) -> content (60)
      let result = applyMoraleChange(40, 20)
      expect(result.morale).toBe('content')

      // content (65) -> tired (45)
      result = applyMoraleChange(65, -20)
      expect(result.morale).toBe('tired')

      // tired (30) -> exhausted (10)
      result = applyMoraleChange(30, -20)
      expect(result.morale).toBe('exhausted')
    })
  })

  describe('calculateMoraleRecovery', () => {
    it('should calculate recovery for resting hero', () => {
      const now = new Date('2024-01-01T10:00:00Z')
      vi.setSystemTime(now)

      const hero = createTestHero({
        morale: 'tired',
        moraleValue: 50,
        moraleLastUpdate: new Date('2024-01-01T08:00:00Z').toISOString(), // 2 hours ago
      })

      const result = calculateMoraleRecovery(hero)

      expect(result.hoursRested).toBe(2)
      expect(result.moraleValue).toBe(60) // 50 + (2 * 5)
      expect(result.morale).toBe('content')
    })

    it('should return 0 recovery for no time passed', () => {
      const now = new Date('2024-01-01T10:00:00Z')
      vi.setSystemTime(now)

      const hero = createTestHero({
        morale: 'tired',
        moraleValue: 50,
        moraleLastUpdate: now.toISOString(),
      })

      const result = calculateMoraleRecovery(hero)

      expect(result.hoursRested).toBe(0)
      expect(result.moraleValue).toBe(50)
      expect(result.morale).toBe('tired')
    })

    it('should cap recovery at 100', () => {
      const now = new Date('2024-01-01T20:00:00Z')
      vi.setSystemTime(now)

      const hero = createTestHero({
        morale: 'content',
        moraleValue: 70,
        moraleLastUpdate: new Date('2024-01-01T00:00:00Z').toISOString(), // 20 hours ago
      })

      const result = calculateMoraleRecovery(hero)

      expect(result.hoursRested).toBe(20)
      expect(result.moraleValue).toBe(100) // 70 + (20 * 5) = 170 -> capped at 100
      expect(result.morale).toBe('excited')
    })

    it('should handle partial hours', () => {
      const now = new Date('2024-01-01T10:30:00Z')
      vi.setSystemTime(now)

      const hero = createTestHero({
        morale: 'tired',
        moraleValue: 50,
        moraleLastUpdate: new Date('2024-01-01T08:00:00Z').toISOString(), // 2.5 hours ago
      })

      const result = calculateMoraleRecovery(hero)

      expect(result.hoursRested).toBe(2) // Floored to 2
      expect(result.moraleValue).toBe(60)
    })
  })

  describe('updateMoraleAfterExpedition', () => {
    beforeEach(() => {
      const now = new Date('2024-01-01T10:00:00Z')
      vi.setSystemTime(now)
    })

    it('should decrease morale after short expedition', () => {
      const hero = createTestHero({
        morale: 'content',
        moraleValue: 70,
      })

      const result = updateMoraleAfterExpedition(hero, 30) // 30 minutes

      expect(result.moraleValue).toBeLessThan(70)
      expect(result.moraleLastUpdate).toBe(new Date().toISOString())
    })

    it('should decrease morale more for longer expeditions', () => {
      const hero = createTestHero({
        morale: 'content',
        moraleValue: 70,
      })

      const shortResult = updateMoraleAfterExpedition(hero, 30) // 30 min
      const longResult = updateMoraleAfterExpedition(hero, 120) // 2 hours

      expect(longResult.moraleValue).toBeLessThan(shortResult.moraleValue)
    })

    it('should increase morale for big loot', () => {
      const hero = createTestHero({
        morale: 'tired',
        moraleValue: 50,
      })

      const withoutLoot = updateMoraleAfterExpedition(hero, 60)
      const withLoot = updateMoraleAfterExpedition(hero, 60, { bigLoot: true })

      expect(withLoot.moraleValue).toBeGreaterThan(withoutLoot.moraleValue)
    })

    it('should increase morale for discovering subzone', () => {
      const hero = createTestHero({
        morale: 'tired',
        moraleValue: 50,
      })

      const withoutDiscovery = updateMoraleAfterExpedition(hero, 60)
      const withDiscovery = updateMoraleAfterExpedition(hero, 60, {
        discoverSubzone: true,
      })

      expect(withDiscovery.moraleValue).toBeGreaterThan(
        withoutDiscovery.moraleValue
      )
    })

    it('should increase morale for countering threat', () => {
      const hero = createTestHero({
        morale: 'tired',
        moraleValue: 50,
      })

      const withoutCounter = updateMoraleAfterExpedition(hero, 60)
      const withCounter = updateMoraleAfterExpedition(hero, 60, {
        counterThreat: true,
      })

      expect(withCounter.moraleValue).toBeGreaterThan(
        withoutCounter.moraleValue
      )
    })

    it('should decrease morale for failed threat', () => {
      const hero = createTestHero({
        morale: 'content',
        moraleValue: 70,
      })

      const withoutFail = updateMoraleAfterExpedition(hero, 60)
      const withFail = updateMoraleAfterExpedition(hero, 60, {
        failedThreat: true,
      })

      expect(withFail.moraleValue).toBeLessThan(withoutFail.moraleValue)
    })

    it('should handle multiple event modifiers', () => {
      const hero = createTestHero({
        morale: 'content',
        moraleValue: 70,
      })

      const result = updateMoraleAfterExpedition(hero, 60, {
        bigLoot: true,
        counterThreat: true,
        discoverSubzone: true,
      })

      // With multiple positive events, should increase despite expedition fatigue
      expect(result.moraleValue).toBeGreaterThan(70)
    })
  })

  describe('updateMoraleAfterLevelUp', () => {
    it('should increase morale after level up', () => {
      const now = new Date('2024-01-01T10:00:00Z')
      vi.setSystemTime(now)

      const hero = createTestHero({
        morale: 'tired',
        moraleValue: 50,
      })

      const result = updateMoraleAfterLevelUp(hero)

      expect(result.moraleValue).toBeGreaterThan(50)
      expect(result.moraleLastUpdate).toBe(now.toISOString())
    })

    it('should cap at 100', () => {
      const hero = createTestHero({
        morale: 'excited',
        moraleValue: 95,
      })

      const result = updateMoraleAfterLevelUp(hero)

      expect(result.moraleValue).toBeLessThanOrEqual(100)
      expect(result.morale).toBe('excited')
    })
  })

  describe('canGoOnExpedition', () => {
    it('should allow content heroes on any expedition', () => {
      const hero = createTestHero({ morale: 'content' })

      expect(canGoOnExpedition(hero, 30).canGo).toBe(true)
      expect(canGoOnExpedition(hero, 120).canGo).toBe(true)
    })

    it('should allow excited heroes on any expedition', () => {
      const hero = createTestHero({ morale: 'excited' })

      expect(canGoOnExpedition(hero, 30).canGo).toBe(true)
      expect(canGoOnExpedition(hero, 180).canGo).toBe(true)
    })

    it('should block exhausted heroes from all expeditions', () => {
      const hero = createTestHero({ morale: 'exhausted' })

      const result = canGoOnExpedition(hero, 30)
      expect(result.canGo).toBe(false)
      expect(result.reason).toContain('exhausted')
    })

    it('should block frustrated heroes from long expeditions', () => {
      const hero = createTestHero({ morale: 'frustrated' })

      const shortResult = canGoOnExpedition(hero, 60)
      expect(shortResult.canGo).toBe(true)

      const longResult = canGoOnExpedition(hero, 90)
      expect(longResult.canGo).toBe(false)
      expect(longResult.reason).toContain('frustrated')
    })

    it('should allow tired heroes on any expedition', () => {
      const hero = createTestHero({ morale: 'tired' })

      expect(canGoOnExpedition(hero, 30).canGo).toBe(true)
      expect(canGoOnExpedition(hero, 120).canGo).toBe(true)
    })
  })

  describe('getMoraleEfficiencyModifier', () => {
    it('should return correct modifiers for each state', () => {
      expect(getMoraleEfficiencyModifier('excited')).toBe(0.1)
      expect(getMoraleEfficiencyModifier('content')).toBe(0)
      expect(getMoraleEfficiencyModifier('tired')).toBe(-0.05)
      expect(getMoraleEfficiencyModifier('frustrated')).toBe(-0.15)
      expect(getMoraleEfficiencyModifier('exhausted')).toBe(-0.25)
    })

    it('should match MORALE_EFFICIENCY_MODIFIERS constant', () => {
      expect(getMoraleEfficiencyModifier('excited')).toBe(
        MORALE_EFFICIENCY_MODIFIERS.excited
      )
      expect(getMoraleEfficiencyModifier('content')).toBe(
        MORALE_EFFICIENCY_MODIFIERS.content
      )
      expect(getMoraleEfficiencyModifier('tired')).toBe(
        MORALE_EFFICIENCY_MODIFIERS.tired
      )
      expect(getMoraleEfficiencyModifier('frustrated')).toBe(
        MORALE_EFFICIENCY_MODIFIERS.frustrated
      )
      expect(getMoraleEfficiencyModifier('exhausted')).toBe(
        MORALE_EFFICIENCY_MODIFIERS.exhausted
      )
    })
  })

  describe('getMoraleColor', () => {
    it('should return appropriate colors for each state', () => {
      expect(getMoraleColor('excited')).toBe('text-purple-500')
      expect(getMoraleColor('content')).toBe('text-blue-500')
      expect(getMoraleColor('tired')).toBe('text-yellow-500')
      expect(getMoraleColor('frustrated')).toBe('text-orange-500')
      expect(getMoraleColor('exhausted')).toBe('text-red-500')
    })
  })

  describe('getMoraleDescription', () => {
    it('should return descriptive text for each state', () => {
      expect(getMoraleDescription('excited')).toContain('fantastic')
      expect(getMoraleDescription('content')).toContain('Rested')
      expect(getMoraleDescription('tired')).toContain('tired')
      expect(getMoraleDescription('frustrated')).toContain('grumpy')
      expect(getMoraleDescription('exhausted')).toContain('exhausted')
    })

    it('should return non-empty strings for all states', () => {
      const states: Array<'excited' | 'content' | 'tired' | 'frustrated' | 'exhausted'> = [
        'excited',
        'content',
        'tired',
        'frustrated',
        'exhausted',
      ]

      states.forEach((state) => {
        const description = getMoraleDescription(state)
        expect(description).toBeTruthy()
        expect(description.length).toBeGreaterThan(0)
      })
    })
  })
})
