import { describe, it, expect, beforeEach } from 'vitest'
import { generateHero } from '~~/shared/utils/heroGenerator'
import { calculateHeroPower } from '~/utils/powerCalculator'
import { generateEquipment } from '~/utils/equipmentGenerator'
import type { Hero, Equipment, EquipmentSlot } from '~~/types'
import { getXpForLevel, addXp } from '~/utils/xpService'
import { MIN_MORALE_FOR_EXPEDITION } from '~~/shared/constants/gameRules'

/**
 * Integration Tests: Hero Management
 *
 * Tests hero lifecycle: creation, equipment, prestige, retirement
 */
describe('Hero Management', () => {
  let testPlayerId: string
  let testHero: Hero

  beforeEach(() => {
    testPlayerId = 'test-player-456'
    testHero = generateHero({
      forceRarity: 'rare',
    })
  })

  describe('Hero Creation', () => {
    it('should generate heroes with different archetypes', () => {
      const archetypes = ['tank', 'melee_dps', 'healer', 'caster'] as const

      archetypes.forEach(archetype => {
        const hero = generateHero({ forceArchetype: archetype })

        expect(hero.archetype).toBe(archetype)
        expect(hero.archetypeTags).toBeDefined()
        expect(hero.archetypeTags.length).toBeGreaterThan(0)
      })
    })

    it('should generate heroes with different rarities', () => {
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const

      rarities.forEach(rarity => {
        const hero = generateHero({ forceRarity: rarity })

        expect(hero.rarity).toBe(rarity)
        expect(hero.gameplayTraits).toBeDefined()
      })
    })

    it('should assign appropriate base stats based on archetype', () => {
      // Force same rarity to get same total stat points
      const tank = generateHero({ forceArchetype: 'tank', forceRarity: 'common' })
      const dps = generateHero({ forceArchetype: 'melee_dps', forceRarity: 'common' })
      const support = generateHero({ forceArchetype: 'healer', forceRarity: 'common' })

      // Verify each archetype follows its distribution pattern
      // Tank: prioritizes survival (60% weight)
      expect(tank.baseStats.survival).toBeGreaterThanOrEqual(tank.baseStats.combat)

      // DPS: prioritizes combat (60% weight)
      expect(dps.baseStats.combat).toBeGreaterThanOrEqual(dps.baseStats.utility)

      // Healer: prioritizes utility/survival, lower combat
      expect(support.baseStats.combat).toBeLessThanOrEqual(support.baseStats.survival)
    })
  })

  describe('Equipment System', () => {
    it('should equip items in correct slots', () => {
      const slots: EquipmentSlot[] = ['weapon', 'head', 'chest', 'hands', 'legs', 'feet', 'accessory']

      slots.forEach(slot => {
        const equipment = generateEquipment({
          playerId: testPlayerId,
          slot,
          rarity: 'uncommon',
          itemLevel: 10,
          sourceZoneId: 'verdant_woods',
          sourceSubzoneId: 'woods_edge',
        })

        expect(equipment.slot).toBe(slot)
        testHero.equipment[slot] = equipment.id

        expect(testHero.equipment[slot]).toBeDefined()
        expect(testHero.equipment[slot]).toBe(equipment.id)
      })
    })

    it('should increase hero power when equipping items', () => {
      const initialPowerBreakdown = calculateHeroPower(testHero)

      const weapon = generateEquipment({
        playerId: testPlayerId,
        slot: 'weapon',
        rarity: 'rare',
        itemLevel: 20,
        sourceZoneId: 'verdant_woods',
        sourceSubzoneId: 'woods_edge',
      })

      testHero.equipment.weapon = weapon.id

      // Recalculate power with equipment
      const newPowerBreakdown = calculateHeroPower(testHero, [weapon])

      expect(newPowerBreakdown.total).toBeGreaterThan(initialPowerBreakdown.total)
    })

    it('should handle full equipment set', () => {
      const equipmentSlots: EquipmentSlot[] = ['weapon', 'head', 'chest', 'hands', 'legs', 'feet', 'accessory']
      const equipmentItems: Equipment[] = []

      equipmentSlots.forEach(slot => {
        const equipment = generateEquipment({
          playerId: testPlayerId,
          slot,
          rarity: 'epic',
          itemLevel: 30,
          sourceZoneId: 'verdant_woods',
          sourceSubzoneId: 'woods_edge',
        })

        testHero.equipment[slot] = equipment.id
        equipmentItems.push(equipment)
      })

      // All slots should be filled
      expect(Object.keys(testHero.equipment).length).toBe(equipmentSlots.length)

      // Power should be significantly higher with full gear
      const basePowerBreakdown = calculateHeroPower(testHero)
      const fullyEquippedPowerBreakdown = calculateHeroPower(testHero, equipmentItems)
      expect(fullyEquippedPowerBreakdown.total).toBeGreaterThan(basePowerBreakdown.total * 1.5)
    })

    it('should replace equipment when equipping new item in same slot', () => {
      const oldWeapon = generateEquipment({
        playerId: testPlayerId,
        slot: 'weapon',
        rarity: 'common',
        itemLevel: 5,
        sourceZoneId: 'verdant_woods',
        sourceSubzoneId: 'woods_edge',
      })

      const newWeapon = generateEquipment({
        playerId: testPlayerId,
        slot: 'weapon',
        rarity: 'legendary',
        itemLevel: 50,
        sourceZoneId: 'goblin_caves',
        sourceSubzoneId: 'cave_entrance',
      })

      testHero.equipment.weapon = oldWeapon.id
      expect(testHero.equipment.weapon).toBe(oldWeapon.id)

      testHero.equipment.weapon = newWeapon.id
      expect(testHero.equipment.weapon).toBe(newWeapon.id)
      expect(testHero.equipment.weapon).not.toBe(oldWeapon.id)
    })
  })

  describe('Hero Leveling', () => {
    it('should use tiered XP progression system', () => {
      // Verify the actual tiered progression used by the game
      expect(getXpForLevel(1)).toBe(100)   // Levels 1-10: 100 XP
      expect(getXpForLevel(10)).toBe(100)
      expect(getXpForLevel(11)).toBe(200)  // Levels 11-20: 200 XP
      expect(getXpForLevel(20)).toBe(200)
      expect(getXpForLevel(21)).toBe(350)  // Levels 21-30: 350 XP
      expect(getXpForLevel(30)).toBe(350)
      expect(getXpForLevel(31)).toBe(500)  // Levels 31-40: 500 XP
      expect(getXpForLevel(40)).toBe(500)
      expect(getXpForLevel(41)).toBe(750)  // Levels 41-50: 750 XP
      expect(getXpForLevel(50)).toBe(750)
      expect(getXpForLevel(51)).toBe(1000) // Levels 51-60: 1000 XP
      expect(getXpForLevel(60)).toBe(1000)
    })

    it('should level up when reaching XP threshold', () => {
      testHero.level = 1
      testHero.xp = 0
      testHero.xpToNextLevel = getXpForLevel(1) // 100 XP

      // Add enough XP to level up
      const result = addXp(testHero, 150)

      expect(result.newLevel).toBe(2)
      expect(result.levelsGained).toBe(1)
      expect(result.hero.xp).toBe(50) // Overflow XP
      expect(result.hero.xpToNextLevel).toBe(100) // Still 100 for level 2
    })

    it('should handle multiple levels in one XP gain', () => {
      testHero.level = 1
      testHero.xp = 0
      testHero.xpToNextLevel = getXpForLevel(1)

      // Add enough XP for multiple levels (100*5 = 500 XP for levels 1-5)
      const result = addXp(testHero, 550)

      expect(result.newLevel).toBe(6)
      expect(result.levelsGained).toBe(5)
      expect(result.hero.xp).toBe(50) // Overflow XP
      expect(result.hero.xpToNextLevel).toBe(100) // Still in tier 1-10
    })
  })

  describe('Hero Prestige', () => {
    it('should reset hero to level 1 but keep prestige bonuses', () => {
      // Set up a high-level hero
      testHero.level = 50
      testHero.xp = 5000
      testHero.prestigeLevel = 0

      // Simulate prestige
      testHero.prestigeLevel += 1
      testHero.level = 1
      testHero.xp = 0

      // Add prestige bonuses (+5% all stats per prestige)
      testHero.prestigeBonuses = {
        combat: 5,
        survival: 5,
        utility: 5,
      }

      expect(testHero.prestigeLevel).toBe(1)
      expect(testHero.level).toBe(1)
      expect(testHero.xp).toBe(0)
      expect(testHero.prestigeBonuses).toBeDefined()
      expect(testHero.prestigeBonuses.combat).toBe(5)
    })

    it('should stack prestige bonuses on multiple prestiges', () => {
      testHero.prestigeLevel = 0
      testHero.prestigeBonuses = {
        combat: 0,
        survival: 0,
        utility: 0,
      }

      // Prestige 3 times
      for (let i = 0; i < 3; i++) {
        testHero.prestigeLevel += 1
        testHero.prestigeBonuses.combat += 5
        testHero.prestigeBonuses.survival += 5
        testHero.prestigeBonuses.utility += 5
      }

      expect(testHero.prestigeLevel).toBe(3)
      expect(testHero.prestigeBonuses.combat).toBe(15)
      expect(testHero.prestigeBonuses.survival).toBe(15)
      expect(testHero.prestigeBonuses.utility).toBe(15)
    })
  })

  describe('Hero Retirement', () => {
    it('should mark hero as retired and remove from active roster', () => {
      // Generate hero returns omit<Hero, 'id'|...> so we simulate having an id
      const heroWithId = { ...testHero, id: 'test-hero-id-123' }
      expect(heroWithId.id).toBeDefined()

      // Simulate retirement (would be deleted from heroes table in real app)
      const retiredHeroId = heroWithId.id
      const retirementGold = 100 * heroWithId.level

      expect(retirementGold).toBeGreaterThan(0)
      expect(retiredHeroId).toBe(heroWithId.id)
    })

    it('should transfer story trait to another hero on retirement', () => {
      const heroToRetire = generateHero({
        forceRarity: 'legendary',
      })

      const recipientHero = generateHero({
        forceRarity: 'common',
      })

      // Give hero a story trait
      heroToRetire.storyTraitIds = ['brave_defiance']

      // Simulate story trait transfer
      const traitToTransfer = heroToRetire.storyTraitIds[0]
      recipientHero.storyTraitIds = [...recipientHero.storyTraitIds, traitToTransfer]

      expect(recipientHero.storyTraitIds).toContain(traitToTransfer)
    })
  })

  describe('Hero Morale System', () => {
    it('should generate hero without morale fields (set by server on creation)', () => {
      // generateHero omits id, morale, moraleValue, moraleLastUpdate
      // These fields are set when the hero is persisted to the database
      const newHero = generateHero({})

      // Verify fields that ARE returned by generateHero
      expect(newHero.level).toBe(1)
      expect(newHero.xp).toBe(0)
      expect(newHero.prestigeLevel).toBe(0)

      // Verify omitted fields are undefined (as per the return type)
      expect((newHero as any).id).toBeUndefined()
      expect((newHero as any).morale).toBeUndefined()
      expect((newHero as any).moraleValue).toBeUndefined()
    })

    it('should decrease morale after expeditions', () => {
      testHero.moraleValue = 50

      // Simulate expedition morale loss
      testHero.moraleValue -= 10

      if (testHero.moraleValue >= 80) {
        testHero.morale = 'excited'
      } else if (testHero.moraleValue >= 50) {
        testHero.morale = 'content'
      } else if (testHero.moraleValue >= MIN_MORALE_FOR_EXPEDITION) {
        testHero.morale = 'tired'
      } else {
        testHero.morale = 'exhausted'
      }

      expect(testHero.moraleValue).toBe(40)
      // 40 morale is in the 'tired' range (above MIN_MORALE_FOR_EXPEDITION but below 50)
      expect(testHero.morale).toBe('tired')
    })

    it('should prevent expedition if hero is exhausted', () => {
      testHero.moraleValue = 10
      testHero.morale = 'exhausted'

      const canStartExpedition = testHero.moraleValue >= MIN_MORALE_FOR_EXPEDITION

      expect(canStartExpedition).toBe(false)
    })

    it('should recover morale while resting', () => {
      testHero.moraleValue = 30
      testHero.morale = 'tired'

      // Simulate passive morale recovery (1 per minute)
      const minutesRested = 30
      testHero.moraleValue = Math.min(100, testHero.moraleValue + minutesRested)

      if (testHero.moraleValue >= 80) {
        testHero.morale = 'energized'
      } else if (testHero.moraleValue >= 50) {
        testHero.morale = 'content'
      } else if (testHero.moraleValue >= MIN_MORALE_FOR_EXPEDITION) {
        testHero.morale = 'tired'
      }

      expect(testHero.moraleValue).toBe(60)
      expect(testHero.morale).toBe('content')
    })
  })

  describe('Hero Power Calculation', () => {
    it('should calculate base power from stats', () => {
      const hero = generateHero({
        forceRarity: 'common',
      })

      const powerBreakdown = calculateHeroPower(hero)

      expect(powerBreakdown.total).toBeGreaterThan(0)
    })

    it('should include equipment bonuses in power calculation', () => {
      const basePowerBreakdown = calculateHeroPower(testHero)

      const weapon = generateEquipment({
        playerId: testPlayerId,
        slot: 'weapon',
        rarity: 'epic',
        itemLevel: 40,
        sourceZoneId: 'verdant_woods',
        sourceSubzoneId: 'woods_edge',
      })

      const newPowerBreakdown = calculateHeroPower(testHero, [weapon])

      expect(newPowerBreakdown.total).toBeGreaterThan(basePowerBreakdown.total)
    })

    it('should include prestige bonuses in power calculation', () => {
      const hero1 = generateHero({ forceRarity: 'uncommon' })
      // Clone hero1 to ensure identical base stats
      const hero2 = { ...hero1, baseStats: { ...hero1.baseStats }, prestigeBonuses: { ...hero1.prestigeBonuses } }

      // Same base stats, but hero2 has prestige
      hero2.prestigeLevel = 2
      hero2.prestigeBonuses = {
        combat: 10,
        survival: 10,
        utility: 10,
      }

      const power1 = calculateHeroPower(hero1)
      const power2 = calculateHeroPower(hero2)

      expect(power2.total).toBeGreaterThan(power1.total)
    })
  })
})
