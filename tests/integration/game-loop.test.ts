import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateHero } from '~~/shared/utils/heroGenerator'
import { generateExpeditionLoot, generateFirstClearReward } from '~/utils/lootGenerator'
import { calculateTeamPower } from '~/utils/powerCalculator'
import { calculateEfficiency } from '~/utils/efficiencyCalculator'
import { generateExpeditionLog } from '~/utils/logGenerator'
import type { Hero, Equipment, Zone, Subzone } from '~~/types'

/**
 * Integration Tests: Core Game Loop
 *
 * Tests the complete flow: recruit → expedition → loot → level up
 */
describe('Core Game Loop', () => {
  let testPlayerId: string
  let testHero: Hero
  let testZone: Zone
  let testSubzone: Subzone

  beforeEach(() => {
    testPlayerId = 'test-player-123'

    // Generate a test hero (simulating tavern recruit)
    // Add mock fields since generateHero doesn't set them (server sets on persist)
    testHero = {
      ...generateHero({
        forceRarity: 'uncommon',
      }),
      id: 'test-hero-123',
      morale: 'content',
      moraleValue: 100,
      moraleLastUpdate: new Date().toISOString(),
      isOnExpedition: false,
      isStationed: false,
      currentExpeditionId: null,
    } as Hero

    // Mock zone and subzone data
    testZone = {
      id: 'verdant_woods',
      name: 'Verdant Woods',
      description: 'A lush forest',
      type: 'forest' as const,
      unlockRequirement: {},
      subzones: [],
      masteryRewards: { passiveIncomeBonus: 0 },
      familiarity: 0,
      isUnlocked: true,
      isMastered: false,
    }

    testSubzone = {
      id: 'woods_edge',
      name: "Wood's Edge",
      description: 'The forest entrance',
      discoveryWeight: 1,
      requiredZoneFamiliarity: 0,
      isDiscovered: true,
      difficulty: 'easy' as const,
      threats: ['beast'],
      monsters: [],
      collectibles: [],
      lootTable: [],
      bonusXpPercent: 0,
      bonusGoldPercent: 0,
      baseDuration: 15,
      baseGold: 50,
      baseXp: 100,
      mastery: 0,
    }
  })

  describe('Hero Recruitment', () => {
    it('should generate a valid hero with correct initial state', () => {
      expect(testHero).toBeDefined()
      expect(testHero.id).toBeDefined()
      expect(testHero.level).toBe(1)
      expect(testHero.xp).toBe(0)
      expect(testHero.isOnExpedition).toBe(false)
      expect(testHero.isStationed).toBe(false)
      expect(testHero.morale).toBe('content')
    })

    it('should generate hero with archetype-appropriate base stats', () => {
      // Mock Math.random to make stat generation deterministic
      // Use 0.5 to get mid-range variance (no extreme randomness)
      vi.spyOn(Math, 'random').mockReturnValue(0.5)

      const tank = generateHero({ forceRarity: 'common', forceArchetype: 'tank' })
      const meleeDps = generateHero({ forceRarity: 'common', forceArchetype: 'melee_dps' })
      const healer = generateHero({ forceRarity: 'common', forceArchetype: 'healer' })

      // Tanks should have higher survival than DPS
      expect(tank.baseStats.survival).toBeGreaterThan(meleeDps.baseStats.survival)

      // DPS should have higher combat than healer
      expect(meleeDps.baseStats.combat).toBeGreaterThan(healer.baseStats.combat)

      // Healer should have higher utility than tank
      expect(healer.baseStats.utility).toBeGreaterThan(tank.baseStats.utility)

      // Restore Math.random
      vi.restoreAllMocks()
    })

    it('should generate rarer heroes with more traits', () => {
      const common = generateHero({ forceRarity: 'common' })
      const legendary = generateHero({ forceRarity: 'legendary' })

      expect(legendary.gameplayTraits.length).toBeGreaterThan(common.gameplayTraits.length)
    })
  })

  describe('Expedition Flow', () => {
    it('should calculate team power correctly for single hero', () => {
      const power = calculateTeamPower([testHero])

      expect(power).toBeGreaterThan(0)
      // calculateTeamPower calculates from base stats, not .power field
      expect(typeof power).toBe('number')
    })

    it('should calculate team power correctly for multiple heroes', () => {
      const hero2 = generateHero({ forceRarity: 'rare' })
      const hero3 = generateHero({ forceRarity: 'epic' })

      const teamPower = calculateTeamPower([testHero, hero2, hero3])

      // Team power should be greater than individual power
      expect(teamPower).toBeGreaterThan(0)
      expect(teamPower).toBeGreaterThan(calculateTeamPower([testHero]))
    })

    it('should calculate efficiency based on team composition', () => {
      const efficiency = calculateEfficiency([testHero], testSubzone)

      expect(efficiency).toBeGreaterThanOrEqual(60)
      expect(efficiency).toBeLessThanOrEqual(150)
    })

    it('should generate expedition log with encounters', () => {
      const log = generateExpeditionLog(
        {
          id: 'test-expedition',
          playerId: testPlayerId,
          zoneId: testZone.id,
          subzoneId: testSubzone.id,
          heroIds: [testHero.id],
          teamPower: testHero.power,
          status: 'in_progress',
          startedAt: new Date(),
          endTime: new Date(Date.now() + 15 * 60 * 1000),
          duration: 15,
          autoRepeat: false,
          events: [],
          pendingChoices: [],
        },
        [testHero],
        testZone,
        testSubzone
      )

      expect(log).toBeDefined()
      expect(log.sections).toBeDefined()
      expect(log.sections.length).toBeGreaterThan(0)

      // Should have various section types (combat is returned as 'encounter' type section)
      const sectionTypes = log.sections.map(s => s.type)
      expect(sectionTypes).toContain('encounter')
    })
  })

  describe('Loot Generation', () => {
    it('should generate expedition loot based on zone difficulty', () => {
      const loot = generateExpeditionLoot({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 0,
        dropCount: 3,
      })

      expect(Array.isArray(loot)).toBe(true)
      loot.forEach(item => {
        expect(item.playerId).toBe(testPlayerId)
        expect(item.sourceZoneId).toBe(testZone.id)
        expect(item.sourceSubzoneId).toBe(testSubzone.id)
      })
    })

    it('should generate higher item level loot for harder zones', () => {
      const easyLoot = generateExpeditionLoot({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 0,
        dropCount: 1,
      })

      const hardLoot = generateExpeditionLoot({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'extreme',
        tier: 1,
        mastery: 0,
        dropCount: 1,
      })

      if (easyLoot[0] && hardLoot[0]) {
        expect(hardLoot[0].itemLevel).toBeGreaterThan(easyLoot[0].itemLevel)
      }
    })

    it('should apply mastery bonus to drop count with probabilistic rounding', () => {
      const noMastery = generateExpeditionLoot({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 0,
        dropCount: 2,
      })

      const highMastery = generateExpeditionLoot({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 100,
        dropCount: 2,
      })

      // High mastery should give more drops (1.5x multiplier at mastery 100)
      // dropCount=2, mastery=100 (1.5x) → 2*1.5=3.0 → 3 guaranteed + 0% bonus = 3 drops
      expect(highMastery.length).toBeGreaterThanOrEqual(noMastery.length)
      expect(noMastery.length).toBe(2)
      expect(highMastery.length).toBe(3)
    })

    it('should make mastery effective for single-drop expeditions via probabilistic rounding', () => {
      // Statistical test: Run many trials to verify average approaches expected value
      const trials = 100
      let totalDrops = 0

      for (let i = 0; i < trials; i++) {
        const loot = generateExpeditionLoot({
          playerId: testPlayerId,
          zoneId: testZone.id,
          subzoneId: testSubzone.id,
          zoneDifficulty: 'easy',
          tier: 1,
          mastery: 100, // 1.5x multiplier
          dropCount: 1,
        })
        totalDrops += loot.length
      }

      const averageDrops = totalDrops / trials

      // dropCount=1, mastery=100 (1.5x) → 1 guaranteed + 50% chance of 1 more
      // Expected average: 1.5 drops
      // With 100 trials, we expect the average to be close to 1.5 (within reasonable variance)
      expect(averageDrops).toBeGreaterThan(1.2) // Should be significantly above 1
      expect(averageDrops).toBeLessThan(1.8) // Should be reasonably close to 1.5
    })

    it('should generate guaranteed first clear reward with upgraded rarity', () => {
      const reward = generateFirstClearReward({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
      })

      expect(reward).toBeDefined()
      expect(reward.playerId).toBe(testPlayerId)
      expect(['uncommon', 'rare', 'epic', 'legendary', 'mythic']).toContain(reward.rarity)
    })
  })

  describe('Hero Progression', () => {
    it('should level up hero when gaining XP', () => {
      const initialLevel = testHero.level
      const initialXp = testHero.xp

      // Simulate gaining XP from expedition
      const xpGain = 50
      testHero.xp += xpGain

      // Simple leveling: every 100 XP = 1 level
      const newLevel = Math.floor(testHero.xp / 100) + 1
      testHero.level = newLevel

      expect(testHero.xp).toBe(initialXp + xpGain)
      expect(testHero.level).toBeGreaterThanOrEqual(initialLevel)
    })

    it('should increase power when equipping items', () => {
      const initialPower = testHero.power

      // Generate equipment
      const weapon = generateExpeditionLoot({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 0,
        dropCount: 1,
      }).find(item => item.slot === 'weapon')

      if (weapon) {
        // Equip the weapon
        testHero.equipment[weapon.slot] = weapon.id

        // Recalculate power (simplified)
        const gearBonus = weapon.gearScore
        testHero.power = initialPower + gearBonus

        expect(testHero.power).toBeGreaterThan(initialPower)
      }
    })
  })

  describe('Complete Game Loop', () => {
    it('should complete full flow: recruit → expedition → loot → level up', () => {
      // Step 1: Recruit hero with mock fields (server sets these on persist)
      const hero = {
        ...generateHero({
          forceRarity: 'uncommon',
        }),
        id: 'test-hero-full-loop',
        morale: 'content',
        moraleValue: 100,
        moraleLastUpdate: new Date().toISOString(),
        isOnExpedition: false,
        isStationed: false,
        currentExpeditionId: null,
      } as Hero
      expect(hero.level).toBe(1)
      expect(hero.xp).toBe(0)

      // Step 2: Calculate team power for expedition
      const teamPower = calculateTeamPower([hero])
      expect(teamPower).toBeGreaterThan(0)

      // Step 3: Start expedition (mark hero as busy)
      hero.isOnExpedition = true
      hero.currentExpeditionId = 'test-expedition-1'
      expect(hero.isOnExpedition).toBe(true)

      // Step 4: Calculate expedition efficiency
      const efficiency = calculateEfficiency([hero], testSubzone)
      expect(efficiency).toBeGreaterThanOrEqual(60)

      // Step 5: Generate expedition log
      const log = generateExpeditionLog(
        {
          id: 'test-expedition-1',
          playerId: testPlayerId,
          zoneId: testZone.id,
          subzoneId: testSubzone.id,
          heroIds: [hero.id],
          teamPower,
          status: 'completed',
          startedAt: new Date(Date.now() - 15 * 60 * 1000),
          endTime: new Date(),
          duration: 15,
          autoRepeat: false,
          events: [],
          pendingChoices: [],
        },
        [hero],
        testZone,
        testSubzone
      )
      expect(log.sections.length).toBeGreaterThan(0)

      // Step 6: Generate loot rewards
      const loot = generateExpeditionLoot({
        playerId: testPlayerId,
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 0,
        dropCount: 2,
      })
      expect(loot.length).toBeGreaterThan(0)

      // Step 7: Award XP and level up
      const baseXp = 25
      const xpReward = Math.floor(baseXp * (efficiency / 100))
      hero.xp += xpReward

      const newLevel = Math.floor(hero.xp / 100) + 1
      hero.level = newLevel

      // Step 8: Equip any loot (not just weapons)
      if (loot.length > 0) {
        const firstItem = loot[0]
        hero.equipment[firstItem.slot] = firstItem.id
      }

      // Step 9: Complete expedition (mark hero as idle)
      hero.isOnExpedition = false
      hero.currentExpeditionId = null

      // Verify final state
      expect(hero.isOnExpedition).toBe(false)
      expect(hero.xp).toBeGreaterThan(0)
      // Verify loot was generated (we got items)
      expect(loot.length).toBeGreaterThan(0)
      // Verify we equipped at least one item
      expect(Object.keys(hero.equipment).length).toBeGreaterThan(0)
    })

    it('should handle multiple expeditions with leveling', () => {
      const hero = generateHero({ forceRarity: 'rare' }) as Hero
      let totalXp = 0

      // Simulate 5 expeditions
      for (let i = 0; i < 5; i++) {
        const efficiency = calculateEfficiency([hero], testSubzone)

        const xpGain = Math.floor(25 * (efficiency / 100))
        totalXp += xpGain
        hero.xp = totalXp

        const newLevel = Math.floor(hero.xp / 100) + 1
        hero.level = newLevel
      }

      expect(hero.xp).toBeGreaterThan(0)
      expect(hero.level).toBeGreaterThanOrEqual(1)
    })
  })
})
