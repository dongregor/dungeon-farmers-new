import { describe, it, expect } from 'vitest'
import {
  calculateHeroPower,
  calculateTeamPower,
  POWER_RANGES,
} from '~/utils/powerCalculator'
import type { Hero, Equipment } from '~~/types'

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
    power: 0,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
    currentExpeditionId: null,
    isFavorite: false,
    morale: 'excellent',
    moraleValue: 100,
    moraleLastUpdate: new Date().toISOString(),
    isOnExpedition: false,
    isStationed: false,
    stationedZoneId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

// Test helper to create equipment
function createTestEquipment(overrides: Partial<Equipment> = {}): Equipment {
  return {
    id: 'eq-1',
    playerId: 'player-1',
    name: 'Test Sword',
    description: 'A basic sword',
    slot: 'weapon',
    rarity: 'common',
    baseStats: { combat: 2, utility: 0, survival: 0 },
    itemLevel: 1,
    gearScore: 10,
    traits: [],
    maxTraits: 1,
    isEquipped: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('Power Calculator', () => {
  describe('calculateHeroPower', () => {
    it('should calculate base power for level 1 hero with no gear', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const power = calculateHeroPower(hero)

      expect(power.statPower).toBe(12) // 5 + 3 + 4
      expect(power.levelPower).toBe(2) // level * 2
      expect(power.prestigePower).toBe(0)
      expect(power.gearPower).toBe(0)
      expect(power.traitPower).toBe(0)
      expect(power.total).toBe(14)
    })

    it('should scale power with level', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 20,
      })

      const power = calculateHeroPower(hero)

      expect(power.levelPower).toBe(40) // 20 * 2
      expect(power.total).toBe(52) // 12 + 40 + 0 + 0 + 0
    })

    it('should include prestige bonuses', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
        prestigeLevel: 2,
        prestigeBonuses: { combat: 10, utility: 5, survival: 8 },
      })

      const power = calculateHeroPower(hero)

      expect(power.prestigePower).toBe(23) // 10 + 5 + 8
      expect(power.total).toBe(37) // 12 + 2 + 23 + 0 + 0
    })

    it('should include gear power', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const equipment = [
        createTestEquipment({ gearScore: 15 }),
        createTestEquipment({ gearScore: 20 }),
        createTestEquipment({ gearScore: 12 }),
      ]

      const power = calculateHeroPower(hero, equipment)

      expect(power.gearPower).toBe(47) // 15 + 20 + 12
      expect(power.total).toBe(61) // 12 + 2 + 0 + 47 + 0
    })

    it('should include positive trait power', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
        gameplayTraits: [
          { traitId: 'brawny', rolledValue: 10 },
          { traitId: 'nimble', rolledValue: 8 },
        ],
      })

      const power = calculateHeroPower(hero)

      expect(power.traitPower).toBe(18) // 10 + 8
      expect(power.total).toBe(32) // 12 + 2 + 0 + 0 + 18
    })

    it('should subtract negative trait power', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
        gameplayTraits: [
          { traitId: 'clumsy', rolledValue: 5 },
          { traitId: 'frail', rolledValue: 8 },
        ],
      })

      const power = calculateHeroPower(hero)

      expect(power.traitPower).toBe(-13) // -5 + -8
      expect(power.total).toBe(1) // 12 + 2 + 0 + 0 - 13
    })

    it('should handle mix of positive and negative traits', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
        gameplayTraits: [
          { traitId: 'brawny', rolledValue: 10 },
          { traitId: 'clumsy', rolledValue: 5 },
          { traitId: 'tough', rolledValue: 12 },
        ],
      })

      const power = calculateHeroPower(hero)

      expect(power.traitPower).toBe(17) // 10 - 5 + 12
      expect(power.total).toBe(31) // 12 + 2 + 0 + 0 + 17
    })

    it('should calculate full-power hero correctly', () => {
      const hero = createTestHero({
        baseStats: { combat: 10, utility: 8, survival: 9 },
        level: 30,
        prestigeLevel: 2,
        prestigeBonuses: { combat: 15, utility: 10, survival: 12 },
        gameplayTraits: [
          { traitId: 'brawny', rolledValue: 12 },
          { traitId: 'nimble', rolledValue: 10 },
        ],
      })

      const equipment = [
        createTestEquipment({ gearScore: 25 }),
        createTestEquipment({ gearScore: 30 }),
        createTestEquipment({ gearScore: 22 }),
        createTestEquipment({ gearScore: 18 }),
      ]

      const power = calculateHeroPower(hero, equipment)

      expect(power.statPower).toBe(27) // 10 + 8 + 9
      expect(power.levelPower).toBe(60) // 30 * 2
      expect(power.prestigePower).toBe(37) // 15 + 10 + 12
      expect(power.gearPower).toBe(95) // 25 + 30 + 22 + 18
      expect(power.traitPower).toBe(22) // 12 + 10
      expect(power.total).toBe(241)
    })

    it('should handle empty equipment array', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const power = calculateHeroPower(hero, [])

      expect(power.gearPower).toBe(0)
      expect(power.total).toBe(14)
    })

    it('should handle undefined equipment', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const power = calculateHeroPower(hero)

      expect(power.gearPower).toBe(0)
      expect(power.total).toBe(14)
    })

    it('should handle hero with no traits', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
        gameplayTraits: [],
      })

      const power = calculateHeroPower(hero)

      expect(power.traitPower).toBe(0)
      expect(power.total).toBe(14)
    })

    it('should ignore traits not found in trait definitions', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
        gameplayTraits: [
          { traitId: 'nonexistent-trait', rolledValue: 999 },
          { traitId: 'brawny', rolledValue: 10 },
        ],
      })

      const power = calculateHeroPower(hero)

      expect(power.traitPower).toBe(10) // Only brawny counts
      expect(power.total).toBe(24)
    })

    it('should handle level 60 hero', () => {
      const hero = createTestHero({
        baseStats: { combat: 8, utility: 6, survival: 7 },
        level: 60,
      })

      const power = calculateHeroPower(hero)

      expect(power.levelPower).toBe(120) // 60 * 2
      expect(power.statPower).toBe(21)
      expect(power.total).toBe(141)
    })

    it('should be within fresh hero power range', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 4, survival: 6 },
        level: 1,
        gameplayTraits: [{ traitId: 'brawny', rolledValue: 5 }],
      })

      const power = calculateHeroPower(hero)

      expect(power.total).toBeGreaterThanOrEqual(POWER_RANGES.freshHero.min)
      expect(power.total).toBeLessThanOrEqual(POWER_RANGES.freshHero.max)
    })
  })

  describe('calculateTeamPower', () => {
    it('should calculate total power for team of heroes', () => {
      const hero1 = createTestHero({
        id: 'hero-1',
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const hero2 = createTestHero({
        id: 'hero-2',
        baseStats: { combat: 6, utility: 4, survival: 5 },
        level: 2,
      })

      const hero3 = createTestHero({
        id: 'hero-3',
        baseStats: { combat: 7, utility: 5, survival: 6 },
        level: 3,
      })

      const teamPower = calculateTeamPower([hero1, hero2, hero3])

      const expected =
        calculateHeroPower(hero1).total +
        calculateHeroPower(hero2).total +
        calculateHeroPower(hero3).total

      expect(teamPower).toBe(expected)
      expect(teamPower).toBe(57) // 14 + 19 + 24
    })

    it('should include equipment when provided', () => {
      const hero1 = createTestHero({
        id: 'hero-1',
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const hero2 = createTestHero({
        id: 'hero-2',
        baseStats: { combat: 6, utility: 4, survival: 5 },
        level: 1,
      })

      const equipmentMap = {
        'hero-1': [createTestEquipment({ gearScore: 20 })],
        'hero-2': [
          createTestEquipment({ gearScore: 15 }),
          createTestEquipment({ gearScore: 18 }),
        ],
      }

      const teamPower = calculateTeamPower([hero1, hero2], equipmentMap)

      expect(teamPower).toBe(84) // (12+2+20) + (15+2+33)
    })

    it('should handle heroes with no equipment in map', () => {
      const hero1 = createTestHero({
        id: 'hero-1',
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const hero2 = createTestHero({
        id: 'hero-2',
        baseStats: { combat: 6, utility: 4, survival: 5 },
        level: 1,
      })

      const equipmentMap = {
        'hero-1': [createTestEquipment({ gearScore: 20 })],
        // hero-2 has no entry
      }

      const teamPower = calculateTeamPower([hero1, hero2], equipmentMap)

      expect(teamPower).toBe(51) // (12+2+20) + (15+2+0)
    })

    it('should handle empty team', () => {
      const teamPower = calculateTeamPower([])
      expect(teamPower).toBe(0)
    })

    it('should handle single hero team', () => {
      const hero = createTestHero({
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const teamPower = calculateTeamPower([hero])
      expect(teamPower).toBe(14)
    })

    it('should handle empty equipment map', () => {
      const hero1 = createTestHero({
        id: 'hero-1',
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 1,
      })

      const hero2 = createTestHero({
        id: 'hero-2',
        baseStats: { combat: 6, utility: 4, survival: 5 },
        level: 1,
      })

      const teamPower = calculateTeamPower([hero1, hero2], {})

      expect(teamPower).toBe(31) // Both heroes with no gear
    })

    it('should handle team with mixed prestige levels', () => {
      const hero1 = createTestHero({
        id: 'hero-1',
        baseStats: { combat: 5, utility: 3, survival: 4 },
        level: 10,
        prestigeLevel: 0,
        prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
      })

      const hero2 = createTestHero({
        id: 'hero-2',
        baseStats: { combat: 6, utility: 4, survival: 5 },
        level: 10,
        prestigeLevel: 2,
        prestigeBonuses: { combat: 10, utility: 8, survival: 9 },
      })

      const teamPower = calculateTeamPower([hero1, hero2])

      expect(teamPower).toBe(94) // (12+20+0) + (15+20+27)
    })
  })

  describe('POWER_RANGES', () => {
    it('should define expected power ranges', () => {
      expect(POWER_RANGES.freshHero).toEqual({ min: 15, max: 25 })
      expect(POWER_RANGES.gearedLevel20).toEqual({ min: 80, max: 120 })
      expect(POWER_RANGES.gearedLevel40).toEqual({ min: 200, max: 300 })
      expect(POWER_RANGES.maxLevelPrePrestige).toEqual({ min: 400, max: 500 })
      expect(POWER_RANGES.prestige3Optimized).toEqual({
        min: 600,
        max: Infinity,
      })
    })

    it('should have ascending min values', () => {
      const ranges = Object.values(POWER_RANGES).filter(
        (r) => r.max !== Infinity
      )
      for (let i = 1; i < ranges.length; i++) {
        expect(ranges[i].min).toBeGreaterThan(ranges[i - 1].min)
      }
    })
  })
})
