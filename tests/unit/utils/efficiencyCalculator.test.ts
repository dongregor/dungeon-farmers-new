import { describe, it, expect } from 'vitest'
import {
  calculateEfficiency,
  calculateTeamPower,
  calculateRequiredPower,
  checkThreatCounters,
  getEfficiencyColor,
  getEfficiencyDescription,
} from '~/utils/efficiencyCalculator'
import type { Hero, Subzone } from '~~/types'
import {
  MIN_EFFICIENCY,
  MAX_EFFICIENCY,
  BASE_EFFICIENCY,
  THREAT_BASE_PENALTY,
} from '~~/shared/constants/gameRules'

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
    power: 50, // Default power for testing
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

// Test helper to create a subzone
function createTestSubzone(overrides: Partial<Subzone> = {}): Subzone {
  return {
    id: 'test_subzone',
    name: 'Test Subzone',
    description: 'A test subzone',
    difficulty: 'medium',
    baseRewardGold: 50,
    baseRewardXP: 100,
    threats: [],
    lootTableOverride: null,
    requiredPower: 50,
    estimatedDuration: 60,
    unlockRequirements: null,
    ...overrides,
  }
}

describe('Efficiency Calculator', () => {
  describe('calculateTeamPower', () => {
    it('should sum hero power values', () => {
      const heroes = [
        createTestHero({ power: 50 }),
        createTestHero({ power: 75 }),
        createTestHero({ power: 100 }),
      ]

      const teamPower = calculateTeamPower(heroes)
      expect(teamPower).toBe(225)
    })

    it('should return 0 for empty team', () => {
      expect(calculateTeamPower([])).toBe(0)
    })

    it('should handle single hero', () => {
      const heroes = [createTestHero({ power: 123 })]
      expect(calculateTeamPower(heroes)).toBe(123)
    })
  })

  describe('calculateRequiredPower', () => {
    it('should calculate basic required power for easy subzone', () => {
      const subzone = createTestSubzone({
        difficulty: 'easy',
        threats: [],
      })

      // basePower (50) * difficulty (0.5) * threatMultiplier (1 + 0 * 0.1) = 25
      expect(calculateRequiredPower(subzone)).toBe(25)
    })

    it('should calculate required power for medium subzone', () => {
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: [],
      })

      // basePower (50) * difficulty (1.0) * threatMultiplier (1.0) = 50
      expect(calculateRequiredPower(subzone)).toBe(50)
    })

    it('should calculate required power for hard subzone', () => {
      const subzone = createTestSubzone({
        difficulty: 'hard',
        threats: [],
      })

      // basePower (50) * difficulty (1.5) * threatMultiplier (1.0) = 75
      expect(calculateRequiredPower(subzone)).toBe(75)
    })

    it('should calculate required power for extreme subzone', () => {
      const subzone = createTestSubzone({
        difficulty: 'extreme',
        threats: [],
      })

      // basePower (50) * difficulty (2.0) * threatMultiplier (1.0) = 100
      expect(calculateRequiredPower(subzone)).toBe(100)
    })

    it('should increase power for each threat', () => {
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: ['swarms', 'bosses'],
      })

      // basePower (50) * difficulty (1.0) * threatMultiplier (1 + 2 * 0.1) = 60
      expect(calculateRequiredPower(subzone)).toBe(60)
    })

    it('should handle multiple threats on hard difficulty', () => {
      const subzone = createTestSubzone({
        difficulty: 'hard',
        threats: ['swarms', 'bosses', 'armored'],
      })

      // basePower (50) * difficulty (1.5) * threatMultiplier (1 + 3 * 0.1) = 97.5 -> 98
      expect(calculateRequiredPower(subzone)).toBe(98)
    })
  })

  describe('checkThreatCounters', () => {
    it('should find all threats countered', () => {
      const heroes = [
        createTestHero({ archetypeTags: ['cleave', 'aoe_blast'] }),
        createTestHero({ archetypeTags: ['execute'] }),
      ]
      const subzone = createTestSubzone({
        threats: ['swarms', 'bosses'],
      })

      const result = checkThreatCounters(heroes, subzone)

      expect(result.allCountered).toBe(true)
      expect(result.counteredThreats).toHaveLength(2)
      expect(result.uncounteredThreats).toHaveLength(0)
      expect(result.counteredThreats).toContain('swarms')
      expect(result.counteredThreats).toContain('bosses')
    })

    it('should find no threats countered', () => {
      const heroes = [
        createTestHero({ archetypeTags: ['melee', 'tank'] }),
      ]
      const subzone = createTestSubzone({
        threats: ['swarms', 'bosses'],
      })

      const result = checkThreatCounters(heroes, subzone)

      expect(result.allCountered).toBe(false)
      expect(result.counteredThreats).toHaveLength(0)
      expect(result.uncounteredThreats).toHaveLength(2)
      expect(result.uncounteredThreats).toContain('swarms')
      expect(result.uncounteredThreats).toContain('bosses')
    })

    it('should handle partial threat counters', () => {
      const heroes = [
        createTestHero({ archetypeTags: ['cleave'] }),
      ]
      const subzone = createTestSubzone({
        threats: ['swarms', 'bosses', 'armored'],
      })

      const result = checkThreatCounters(heroes, subzone)

      expect(result.allCountered).toBe(false)
      expect(result.counteredThreats).toHaveLength(1)
      expect(result.uncounteredThreats).toHaveLength(2)
      expect(result.counteredThreats).toContain('swarms')
      expect(result.uncounteredThreats).toContain('bosses')
      expect(result.uncounteredThreats).toContain('armored')
    })

    it('should handle empty threats', () => {
      const heroes = [createTestHero()]
      const subzone = createTestSubzone({ threats: [] })

      const result = checkThreatCounters(heroes, subzone)

      expect(result.allCountered).toBe(true)
      expect(result.counteredThreats).toHaveLength(0)
      expect(result.uncounteredThreats).toHaveLength(0)
    })

    it('should aggregate tags from all heroes', () => {
      const heroes = [
        createTestHero({ archetypeTags: ['cleave'] }),
        createTestHero({ archetypeTags: ['execute'] }),
        createTestHero({ archetypeTags: ['armor_break'] }),
      ]
      const subzone = createTestSubzone({
        threats: ['swarms', 'bosses', 'armored'],
      })

      const result = checkThreatCounters(heroes, subzone)

      expect(result.allCountered).toBe(true)
      expect(result.counteredThreats).toHaveLength(3)
      expect(result.uncounteredThreats).toHaveLength(0)
    })
  })

  describe('calculateEfficiency', () => {
    it('should return BASE_EFFICIENCY (100) when power equals required power', () => {
      const heroes = [createTestHero({ power: 50 })]
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: [],
        requiredPower: 50,
      })

      const efficiency = calculateEfficiency(heroes, subzone)
      expect(efficiency).toBe(BASE_EFFICIENCY)
    })

    it('should return close to MIN_EFFICIENCY (60) when power is very low', () => {
      const heroes = [createTestHero({ power: 1 })]
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: [],
        requiredPower: 100,
      })

      const efficiency = calculateEfficiency(heroes, subzone)
      expect(efficiency).toBeGreaterThanOrEqual(MIN_EFFICIENCY)
      expect(efficiency).toBeLessThanOrEqual(MIN_EFFICIENCY + 5) // Allow small margin
    })

    it('should increase efficiency when overpowered', () => {
      const heroes = [createTestHero({ power: 100 })]
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: [],
        requiredPower: 50,
      })

      const efficiency = calculateEfficiency(heroes, subzone)

      // powerRatio = 100/50 = 2.0
      // baseRange = 100 - 60 = 40
      // efficiency = 60 + (2.0 * 40) = 140
      expect(efficiency).toBe(140)
    })

    it('should cap efficiency at MAX_EFFICIENCY (150)', () => {
      const heroes = [createTestHero({ power: 1000 })]
      const subzone = createTestSubzone({
        difficulty: 'easy',
        threats: [],
        requiredPower: 10,
      })

      const efficiency = calculateEfficiency(heroes, subzone)
      expect(efficiency).toBe(MAX_EFFICIENCY)
    })

    it('should add bonus for countered threats', () => {
      const heroes = [
        createTestHero({ power: 60, archetypeTags: ['cleave', 'execute'] }),
      ]
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: ['swarms', 'bosses'],
      })

      const efficiency = calculateEfficiency(heroes, subzone)

      // Required power = 50 * 1.0 * (1 + 2 * 0.1) = 60
      // powerRatio = 60/60 = 1.0
      // Base efficiency = 60 + (1.0 * 40) = 100
      // Bonus: 2 countered threats * 5 = +10
      // Total: 110
      expect(efficiency).toBe(110)
    })

    it('should subtract penalty for uncountered threats on easy difficulty', () => {
      const heroes = [createTestHero({ power: 30, archetypeTags: [] })]
      const subzone = createTestSubzone({
        difficulty: 'easy',
        threats: ['swarms', 'bosses'],
      })

      const efficiency = calculateEfficiency(heroes, subzone)

      // Required power = 50 * 0.5 * (1 + 2 * 0.1) = 30
      // powerRatio = 30/30 = 1.0
      // Base efficiency = 60 + (1.0 * 40) = 100
      // Penalty: 2 uncountered * 5 * 1.0 (easy) = -10
      // Total: 90
      expect(efficiency).toBe(90)
    })

    it('should apply higher penalty for uncountered threats on hard difficulty', () => {
      const heroes = [createTestHero({ power: 90, archetypeTags: [] })]
      const subzone = createTestSubzone({
        difficulty: 'hard',
        threats: ['swarms', 'bosses'],
      })

      const efficiency = calculateEfficiency(heroes, subzone)

      // Required power = 50 * 1.5 * (1 + 2 * 0.1) = 90
      // powerRatio = 90/90 = 1.0
      // Base efficiency = 60 + (1.0 * 40) = 100
      // Penalty: 2 uncountered * 5 * 2.0 (hard) = -20
      // Total: 80
      expect(efficiency).toBe(80)
    })

    it('should apply highest penalty for uncountered threats on extreme difficulty', () => {
      const heroes = [createTestHero({ power: 120, archetypeTags: [] })]
      const subzone = createTestSubzone({
        difficulty: 'extreme',
        threats: ['swarms', 'bosses'],
      })

      const efficiency = calculateEfficiency(heroes, subzone)

      // Required power = 50 * 2.0 * (1 + 2 * 0.1) = 120
      // powerRatio = 120/120 = 1.0
      // Base efficiency = 60 + (1.0 * 40) = 100
      // Penalty: 2 uncountered * 5 * 3.0 (extreme) = -30
      // Total: 70
      expect(efficiency).toBe(70)
    })

    it('should handle mixed countered and uncountered threats', () => {
      const heroes = [
        createTestHero({ power: 65, archetypeTags: ['cleave'] }),
      ]
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: ['swarms', 'bosses', 'armored'],
      })

      const efficiency = calculateEfficiency(heroes, subzone)

      // Required power = 50 * 1.0 * (1 + 3 * 0.1) = 65
      // powerRatio = 65/65 = 1.0
      // Base efficiency = 60 + (1.0 * 40) = 100
      // Bonus: 1 countered (swarms) * 5 = +5
      // Penalty: 2 uncountered * 5 * 1.5 (medium) = -15
      // Total: 90
      expect(efficiency).toBe(90)
    })

    it('should respect MIN_EFFICIENCY floor even with many uncountered threats', () => {
      const heroes = [createTestHero({ power: 10, archetypeTags: [] })]
      const subzone = createTestSubzone({
        difficulty: 'extreme',
        threats: ['swarms', 'bosses', 'armored', 'casters', 'regenerators'],
        requiredPower: 100,
      })

      const efficiency = calculateEfficiency(heroes, subzone)
      expect(efficiency).toBe(MIN_EFFICIENCY)
      expect(efficiency).toBeGreaterThanOrEqual(MIN_EFFICIENCY)
    })

    it('should accept pre-calculated threat counter result for performance', () => {
      const heroes = [
        createTestHero({ power: 60, archetypeTags: ['cleave'] }),
      ]
      const subzone = createTestSubzone({
        difficulty: 'medium',
        threats: ['swarms', 'bosses'],
      })

      const threatResult = checkThreatCounters(heroes, subzone)
      const efficiency = calculateEfficiency(heroes, subzone, threatResult)

      // Required power = 50 * 1.0 * (1 + 2 * 0.1) = 60
      // powerRatio = 60/60 = 1.0
      // Base efficiency = 60 + (1.0 * 40) = 100
      // Bonus: 1 countered (swarms) * 5 = +5
      // Penalty: 1 uncountered (bosses) * 5 * 1.5 = -7.5 -> -7 (rounded)
      // Total: 98
      expect(efficiency).toBe(98)
    })

    it('should always return value within bounds', () => {
      // Test various scenarios
      const scenarios = [
        { power: 1, requiredPower: 1000, threats: ['swarms', 'bosses', 'armored'] },
        { power: 1000, requiredPower: 1, threats: [] },
        { power: 50, requiredPower: 50, threats: ['swarms'] },
      ]

      scenarios.forEach((scenario) => {
        const heroes = [createTestHero({ power: scenario.power, archetypeTags: [] })]
        const subzone = createTestSubzone({
          difficulty: 'extreme',
          threats: scenario.threats,
          requiredPower: scenario.requiredPower,
        })

        const efficiency = calculateEfficiency(heroes, subzone)
        expect(efficiency).toBeGreaterThanOrEqual(MIN_EFFICIENCY)
        expect(efficiency).toBeLessThanOrEqual(MAX_EFFICIENCY)
      })
    })
  })

  describe('getEfficiencyColor', () => {
    it('should return legendary color for very high efficiency', () => {
      expect(getEfficiencyColor(150)).toBe('text-legendary')
      expect(getEfficiencyColor(140)).toBe('text-legendary')
      expect(getEfficiencyColor(130)).toBe('text-legendary')
    })

    it('should return epic color for high efficiency', () => {
      expect(getEfficiencyColor(129)).toBe('text-epic')
      expect(getEfficiencyColor(120)).toBe('text-epic')
      expect(getEfficiencyColor(110)).toBe('text-epic')
    })

    it('should return rare color for above average efficiency', () => {
      expect(getEfficiencyColor(109)).toBe('text-rare')
      expect(getEfficiencyColor(100)).toBe('text-rare')
      expect(getEfficiencyColor(90)).toBe('text-rare')
    })

    it('should return uncommon color for average efficiency', () => {
      expect(getEfficiencyColor(89)).toBe('text-uncommon')
      expect(getEfficiencyColor(80)).toBe('text-uncommon')
      expect(getEfficiencyColor(70)).toBe('text-uncommon')
    })

    it('should return common color for low efficiency', () => {
      expect(getEfficiencyColor(69)).toBe('text-common')
      expect(getEfficiencyColor(60)).toBe('text-common')
      expect(getEfficiencyColor(50)).toBe('text-common')
    })
  })

  describe('getEfficiencyDescription', () => {
    it('should return appropriate descriptions', () => {
      expect(getEfficiencyDescription(150)).toBe('Flawless Victory!')
      expect(getEfficiencyDescription(140)).toBe('Flawless Victory!')
      expect(getEfficiencyDescription(130)).toBe('Dominant Performance')
      expect(getEfficiencyDescription(120)).toBe('Dominant Performance')
      expect(getEfficiencyDescription(110)).toBe('Excellent')
      expect(getEfficiencyDescription(100)).toBe('Excellent')
      expect(getEfficiencyDescription(90)).toBe('Good')
      expect(getEfficiencyDescription(80)).toBe('Good')
      expect(getEfficiencyDescription(75)).toBe('Adequate')
      expect(getEfficiencyDescription(70)).toBe('Adequate')
      expect(getEfficiencyDescription(69)).toBe('Barely Survived')
      expect(getEfficiencyDescription(60)).toBe('Barely Survived')
    })
  })
})
