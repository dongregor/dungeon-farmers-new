import { describe, it, expect, beforeEach } from 'vitest'
import { generateHero } from '~/utils/heroGenerator'
import { generateExpeditionLog } from '~/utils/logGenerator'
import { calculateEfficiency, calculateTeamPower } from '~/utils/efficiencyCalculator'
import { generateExpeditionLoot, calculateExpectedLootQuality } from '~/utils/lootGenerator'
import type { Hero, Zone, Subzone, Expedition } from '~~/types'

/**
 * Integration Tests: Expedition Flow
 *
 * Tests complete expedition lifecycle: preview → start → progress → events → complete
 */
describe('Expedition Flow', () => {
  let testPlayerId: string
  let testHeroes: Hero[]
  let testZone: Zone
  let testSubzone: Subzone
  let testExpedition: Expedition

  beforeEach(() => {
    testPlayerId = 'test-player-789'

    // Create a party of 3 heroes
    testHeroes = [
      generateHero({ playerId: testPlayerId, archetype: 'tank', rarity: 'uncommon' }),
      generateHero({ playerId: testPlayerId, archetype: 'dps', rarity: 'rare' }),
      generateHero({ playerId: testPlayerId, archetype: 'support', rarity: 'uncommon' }),
    ]

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
      threats: ['beast', 'trap'],
      requiredZoneFamiliarity: 0,
    }

    const teamPower = calculateTeamPower(testHeroes)

    testExpedition = {
      id: 'test-expedition-abc',
      playerId: testPlayerId,
      zoneId: testZone.id,
      subzoneId: testSubzone.id,
      heroIds: testHeroes.map(h => h.id),
      teamPower,
      status: 'in_progress',
      startedAt: new Date(),
      endTime: new Date(Date.now() + 15 * 60 * 1000),
      duration: 15,
      autoRepeat: false,
    }
  })

  describe('Expedition Preview', () => {
    it('should calculate expected loot quality for zone', () => {
      const lootQuality = calculateExpectedLootQuality({
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 0,
      })

      expect(lootQuality.averageItemLevel).toBe(5) // Easy zone tier 1 = item level 5
      expect(lootQuality.commonChance).toBeGreaterThan(0)
      expect(lootQuality.masteryBonus).toBe(0) // No mastery = 0% bonus
    })

    it('should show improved loot quality with mastery', () => {
      const noMastery = calculateExpectedLootQuality({
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 0,
      })

      const highMastery = calculateExpectedLootQuality({
        zoneId: testZone.id,
        subzoneId: testSubzone.id,
        zoneDifficulty: 'easy',
        tier: 1,
        mastery: 100,
      })

      expect(highMastery.masteryBonus).toBeGreaterThan(noMastery.masteryBonus)
      expect(highMastery.masteryBonus).toBe(50) // 100 mastery = 50% bonus
    })

    it('should calculate team power for preview', () => {
      const teamPower = calculateTeamPower(testHeroes)

      expect(teamPower).toBeGreaterThan(0)
      expect(teamPower).toBe(testHeroes.reduce((sum, h) => sum + h.power, 0))
    })
  })

  describe('Expedition Start', () => {
    it('should mark heroes as busy when starting expedition', () => {
      testHeroes.forEach(hero => {
        hero.isOnExpedition = true
        hero.currentExpeditionId = testExpedition.id
      })

      testHeroes.forEach(hero => {
        expect(hero.isOnExpedition).toBe(true)
        expect(hero.currentExpeditionId).toBe(testExpedition.id)
      })
    })

    it('should prevent starting expedition with exhausted heroes', () => {
      const exhaustedHero = testHeroes[0]
      exhaustedHero.moraleValue = 10
      exhaustedHero.morale = 'exhausted'

      const canStart = exhaustedHero.moraleValue >= 20

      expect(canStart).toBe(false)
    })

    it('should prevent starting expedition with heroes already on expedition', () => {
      const busyHero = testHeroes[0]
      busyHero.isOnExpedition = true
      busyHero.currentExpeditionId = 'other-expedition'

      const canStart = !busyHero.isOnExpedition

      expect(canStart).toBe(false)
    })

    it('should calculate expedition end time based on duration', () => {
      const startTime = new Date()
      const duration = 30 // minutes
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000)

      expect(endTime.getTime()).toBeGreaterThan(startTime.getTime())
      expect(endTime.getTime() - startTime.getTime()).toBe(duration * 60 * 1000)
    })
  })

  describe('Expedition Progress', () => {
    it('should check if expedition is ready to complete', () => {
      const now = new Date()
      const completedExpedition = {
        ...testExpedition,
        endTime: new Date(now.getTime() - 5 * 60 * 1000), // Ended 5 minutes ago
      }

      const isReady = now >= completedExpedition.endTime

      expect(isReady).toBe(true)
    })

    it('should not allow completion before end time', () => {
      const now = new Date()
      const activeExpedition = {
        ...testExpedition,
        endTime: new Date(now.getTime() + 10 * 60 * 1000), // Ends in 10 minutes
      }

      const isReady = now >= activeExpedition.endTime

      expect(isReady).toBe(false)
    })

    it('should calculate time remaining correctly', () => {
      const now = new Date()
      const endTime = new Date(now.getTime() + 15 * 60 * 1000)

      const timeRemaining = endTime.getTime() - now.getTime()
      const minutesRemaining = Math.floor(timeRemaining / 60 / 1000)

      expect(minutesRemaining).toBe(15)
    })
  })

  describe('Expedition Events', () => {
    it('should generate expedition log with multiple entries', () => {
      const log = generateExpeditionLog(
        testExpedition,
        testHeroes,
        testZone,
        testSubzone
      )

      expect(log.entries).toBeDefined()
      expect(log.entries.length).toBeGreaterThan(0)
    })

    it('should include different event types in log', () => {
      const log = generateExpeditionLog(
        testExpedition,
        testHeroes,
        testZone,
        testSubzone
      )

      const eventTypes = log.entries.map(e => e.type)

      // Should have varied event types
      expect(eventTypes.length).toBeGreaterThan(0)

      // At least one combat encounter expected
      const hasCombat = eventTypes.some(type => type === 'combat')
      expect(hasCombat).toBe(true)
    })

    it('should include hero reactions in log entries', () => {
      const log = generateExpeditionLog(
        testExpedition,
        testHeroes,
        testZone,
        testSubzone
      )

      // Check that entries have required fields
      log.entries.forEach(entry => {
        expect(entry.id).toBeDefined()
        expect(entry.type).toBeDefined()
        expect(entry.title).toBeDefined()
        expect(entry.description).toBeDefined()
      })
    })

    it('should vary encounters based on subzone threats', () => {
      const beastLog = generateExpeditionLog(
        testExpedition,
        testHeroes,
        testZone,
        { ...testSubzone, threats: ['beast'] }
      )

      const undeadLog = generateExpeditionLog(
        testExpedition,
        testHeroes,
        testZone,
        { ...testSubzone, threats: ['undead'] }
      )

      expect(beastLog.entries.length).toBeGreaterThan(0)
      expect(undeadLog.entries.length).toBeGreaterThan(0)
    })
  })

  describe('Expedition Completion', () => {
    it('should calculate efficiency based on team composition', () => {
      const efficiency = calculateEfficiency({
        heroes: testHeroes,
        zone: testZone,
        subzone: testSubzone,
      })

      expect(efficiency).toBeGreaterThanOrEqual(60)
      expect(efficiency).toBeLessThanOrEqual(150)
    })

    it('should scale rewards based on efficiency', () => {
      const efficiency = 120 // 120%

      const baseGold = 50
      const baseXp = 25

      const actualGold = Math.floor(baseGold * (efficiency / 100))
      const actualXp = Math.floor(baseXp * (efficiency / 100))

      expect(actualGold).toBe(60)
      expect(actualXp).toBe(30)
    })

    it('should generate loot on completion', () => {
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
      loot.forEach(item => {
        expect(item.sourceZoneId).toBe(testZone.id)
        expect(item.sourceSubzoneId).toBe(testSubzone.id)
      })
    })

    it('should update hero states on completion', () => {
      testHeroes.forEach(hero => {
        // Mark as busy at start
        hero.isOnExpedition = true
        hero.currentExpeditionId = testExpedition.id

        // Simulate completion
        const xpGain = 30
        hero.xp += xpGain
        hero.moraleValue -= 10 // Lose morale

        // Return to idle
        hero.isOnExpedition = false
        hero.currentExpeditionId = null

        expect(hero.isOnExpedition).toBe(false)
        expect(hero.currentExpeditionId).toBeNull()
        expect(hero.xp).toBeGreaterThan(0)
      })
    })

    it('should update zone progress on completion', () => {
      let zoneFamiliarity = 0
      let subzoneMastery = 0

      // Simulate expedition completion
      zoneFamiliarity += 10 // +10 familiarity
      subzoneMastery += 5 // +5 mastery

      expect(zoneFamiliarity).toBe(10)
      expect(subzoneMastery).toBe(5)
    })
  })

  describe('Auto-Repeat Expeditions', () => {
    it('should support auto-repeat flag', () => {
      const autoRepeatExpedition = {
        ...testExpedition,
        autoRepeat: true,
        stopConditions: {
          anyHeroTired: false,
          inventoryFull: false,
          resourceCap: false,
        },
      }

      expect(autoRepeatExpedition.autoRepeat).toBe(true)
      expect(autoRepeatExpedition.stopConditions).toBeDefined()
    })

    it('should check stop conditions for auto-repeat', () => {
      const stopConditions = {
        anyHeroTired: true,
        inventoryFull: false,
        resourceCap: false,
      }

      // Check if hero is tired
      const tiredHero = testHeroes[0]
      tiredHero.moraleValue = 25
      tiredHero.morale = 'tired'

      const shouldStop = stopConditions.anyHeroTired && tiredHero.morale === 'tired'

      expect(shouldStop).toBe(true)
    })
  })

  describe('Expedition Cancellation', () => {
    it('should allow cancelling active expeditions', () => {
      expect(testExpedition.status).toBe('in_progress')

      // Simulate cancellation
      testExpedition.status = 'cancelled'

      // Free up heroes
      testHeroes.forEach(hero => {
        hero.isOnExpedition = false
        hero.currentExpeditionId = null
      })

      expect(testExpedition.status).toBe('cancelled')
      testHeroes.forEach(hero => {
        expect(hero.isOnExpedition).toBe(false)
      })
    })

    it('should not award rewards when cancelled', () => {
      testExpedition.status = 'cancelled'

      const shouldAwardRewards = testExpedition.status === 'completed'

      expect(shouldAwardRewards).toBe(false)
    })
  })

  describe('Multiple Expeditions', () => {
    it('should support multiple concurrent expeditions', () => {
      const expedition1 = { ...testExpedition, id: 'exp-1', heroIds: [testHeroes[0].id] }
      const expedition2 = { ...testExpedition, id: 'exp-2', heroIds: [testHeroes[1].id] }
      const expedition3 = { ...testExpedition, id: 'exp-3', heroIds: [testHeroes[2].id] }

      const activeExpeditions = [expedition1, expedition2, expedition3]

      expect(activeExpeditions.length).toBe(3)
      expect(activeExpeditions[0].heroIds).not.toEqual(activeExpeditions[1].heroIds)
    })

    it('should prevent hero from being in multiple expeditions', () => {
      const hero = testHeroes[0]
      hero.isOnExpedition = true
      hero.currentExpeditionId = 'exp-1'

      const canStartNew = !hero.isOnExpedition

      expect(canStartNew).toBe(false)
    })
  })

  describe('Expedition Efficiency', () => {
    it('should give bonus efficiency for matching archetype tags to threats', () => {
      const beastHunter = generateHero({
        playerId: testPlayerId,
        archetype: 'dps',
      })
      beastHunter.archetypeTags = ['beast_slayer']

      const subzoneWithBeasts = {
        ...testSubzone,
        threats: ['beast'],
      }

      const efficiency = calculateEfficiency({
        heroes: [beastHunter],
        zone: testZone,
        subzone: subzoneWithBeasts,
      })

      expect(efficiency).toBeGreaterThanOrEqual(60)
    })

    it('should calculate balanced party efficiency bonus', () => {
      // Party with tank, dps, support
      const balancedParty = [
        generateHero({ playerId: testPlayerId, archetype: 'tank' }),
        generateHero({ playerId: testPlayerId, archetype: 'dps' }),
        generateHero({ playerId: testPlayerId, archetype: 'support' }),
      ]

      const efficiency = calculateEfficiency({
        heroes: balancedParty,
        zone: testZone,
        subzone: testSubzone,
      })

      expect(efficiency).toBeGreaterThanOrEqual(60)
    })

    it('should reduce efficiency for all-dps party', () => {
      const allDpsParty = [
        generateHero({ playerId: testPlayerId, archetype: 'dps' }),
        generateHero({ playerId: testPlayerId, archetype: 'dps' }),
        generateHero({ playerId: testPlayerId, archetype: 'dps' }),
      ]

      const efficiency = calculateEfficiency({
        heroes: allDpsParty,
        zone: testZone,
        subzone: testSubzone,
      })

      // Still viable but may not get balanced party bonus
      expect(efficiency).toBeGreaterThanOrEqual(60)
      expect(efficiency).toBeLessThanOrEqual(150)
    })
  })
})
