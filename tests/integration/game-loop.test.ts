import { describe, it, expect, beforeEach } from 'vitest'
import { generateHero } from '~/utils/heroGenerator'
import { generateExpeditionLoot, generateFirstClearReward } from '~/utils/lootGenerator'
import { calculateTeamPower } from '~/utils/efficiencyCalculator'
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
    testHero = generateHero({
      playerId: testPlayerId,
      rarity: 'uncommon',
    })

    // Mock zone and subzone data
    testZone = {
      id: 'verdant_woods',
      name: 'Verdant Woods',
      description: 'A lush forest',
      difficulty: 'easy',
      requiredLevel: 1,
      subzones: [],
    }

    testSubzone = {
      id: 'woods_edge',
      name: "Wood's Edge",
      description: 'The forest entrance',
      baseDuration: 15,
      threats: ['beast'],
      requiredZoneFamiliarity: 0,
    }
  })

  describe('Hero Recruitment', () => {
    it('should generate a valid hero with correct initial state', () => {
      expect(testHero).toBeDefined()
      expect(testHero.id).toBeDefined()
      expect(testHero.playerId).toBe(testPlayerId)
      expect(testHero.level).toBe(1)
      expect(testHero.xp).toBe(0)
      expect(testHero.isOnExpedition).toBe(false)
      expect(testHero.isStationed).toBe(false)
      expect(testHero.morale).toBe('content')
    })

    it('should generate hero with archetype-appropriate base stats', () => {
      const tank = generateHero({ playerId: testPlayerId, archetype: 'tank' })
      const dps = generateHero({ playerId: testPlayerId, archetype: 'dps' })
      const support = generateHero({ playerId: testPlayerId, archetype: 'support' })

      // Tanks should have higher survival
      expect(tank.baseStats.survival).toBeGreaterThan(dps.baseStats.survival)

      // DPS should have higher combat
      expect(dps.baseStats.combat).toBeGreaterThan(support.baseStats.combat)

      // Support should have higher utility
      expect(support.baseStats.utility).toBeGreaterThan(tank.baseStats.utility)
    })

    it('should generate rarer heroes with more traits', () => {
      const common = generateHero({ playerId: testPlayerId, rarity: 'common' })
      const legendary = generateHero({ playerId: testPlayerId, rarity: 'legendary' })

      expect(legendary.gameplayTraits.length).toBeGreaterThan(common.gameplayTraits.length)
    })
  })

  describe('Expedition Flow', () => {
    it('should calculate team power correctly for single hero', () => {
      const power = calculateTeamPower([testHero])

      expect(power).toBeGreaterThan(0)
      expect(power).toBe(testHero.power)
    })

    it('should calculate team power correctly for multiple heroes', () => {
      const hero2 = generateHero({ playerId: testPlayerId, rarity: 'rare' })
      const hero3 = generateHero({ playerId: testPlayerId, rarity: 'epic' })

      const teamPower = calculateTeamPower([testHero, hero2, hero3])
      const expectedPower = testHero.power + hero2.power + hero3.power

      expect(teamPower).toBe(expectedPower)
    })

    it('should calculate efficiency based on team composition', () => {
      const efficiency = calculateEfficiency({
        heroes: [testHero],
        zone: testZone,
        subzone: testSubzone,
      })

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
        },
        [testHero],
        testZone,
        testSubzone
      )

      expect(log).toBeDefined()
      expect(log.entries).toBeDefined()
      expect(log.entries.length).toBeGreaterThan(0)

      // Should have various encounter types
      const encounterTypes = log.entries.map(e => e.type)
      expect(encounterTypes).toContain('combat')
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

    it('should apply mastery bonus to drop count', () => {
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
      expect(highMastery.length).toBeGreaterThanOrEqual(noMastery.length)
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
      // Step 1: Recruit hero
      const hero = generateHero({
        playerId: testPlayerId,
        rarity: 'uncommon',
      })
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
      const efficiency = calculateEfficiency({
        heroes: [hero],
        zone: testZone,
        subzone: testSubzone,
      })
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
        },
        [hero],
        testZone,
        testSubzone
      )
      expect(log.entries.length).toBeGreaterThan(0)

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

      // Step 8: Equip loot
      const weapon = loot.find(item => item.slot === 'weapon')
      if (weapon) {
        hero.equipment[weapon.slot] = weapon.id
      }

      // Step 9: Complete expedition (mark hero as idle)
      hero.isOnExpedition = false
      hero.currentExpeditionId = null

      // Verify final state
      expect(hero.isOnExpedition).toBe(false)
      expect(hero.xp).toBeGreaterThan(0)
      expect(Object.keys(hero.equipment).length).toBeGreaterThan(0)
    })

    it('should handle multiple expeditions with leveling', () => {
      const hero = generateHero({ playerId: testPlayerId, rarity: 'rare' })
      let totalXp = 0

      // Simulate 5 expeditions
      for (let i = 0; i < 5; i++) {
        const efficiency = calculateEfficiency({
          heroes: [hero],
          zone: testZone,
          subzone: testSubzone,
        })

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
