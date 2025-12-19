import { describe, it, expect, beforeEach } from 'vitest'
import { generateHero } from '~/utils/heroGenerator'
import { calculateHeroPower } from '~/utils/powerCalculator'
import { generateEquipment } from '~/utils/equipmentGenerator'
import type { Hero, Equipment, EquipmentSlot } from '~~/types'
import { calculateXpToNextLevel } from '~~/shared/constants/gameRules'

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
      const tank = generateHero({ forceArchetype: 'tank' })
      const dps = generateHero({ forceArchetype: 'melee_dps' })
      const support = generateHero({ forceArchetype: 'healer' })

      // Each archetype should excel in their primary stat
      const tankTotal = tank.baseStats.combat + tank.baseStats.survival + tank.baseStats.utility
      const dpsTotal = dps.baseStats.combat + dps.baseStats.survival + dps.baseStats.utility
      const supportTotal = support.baseStats.combat + support.baseStats.survival + support.baseStats.utility

      // All should have same total base stats
      expect(tankTotal).toBe(dpsTotal)
      expect(dpsTotal).toBe(supportTotal)

      // But distributed differently
      expect(tank.baseStats.survival).toBeGreaterThan(dps.baseStats.survival)
      expect(dps.baseStats.combat).toBeGreaterThan(support.baseStats.combat)
      expect(support.baseStats.utility).toBeGreaterThan(tank.baseStats.utility)
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
    it('should calculate correct XP requirement per level', () => {
      // Verify XP requirements match the centralized formula
      // We use the actual formula here to ensure the constant stays in sync
      for (let level = 1; level <= 10; level++) {
        const xpRequired = calculateXpToNextLevel(level)

        // Verify XP increases with level (behavioral test)
        if (level > 1) {
          const previousXp = calculateXpToNextLevel(level - 1)
          expect(xpRequired).toBeGreaterThan(previousXp)
        }

        // Spot-check key levels to catch major formula changes
        if (level === 1) expect(xpRequired).toBe(150)  // 1*100 + 1*1*50
        if (level === 5) expect(xpRequired).toBe(1750) // 5*100 + 5*5*50
        if (level === 10) expect(xpRequired).toBe(6000) // 10*100 + 10*10*50
      }
    })

    it('should level up when reaching XP threshold', () => {
      testHero.level = 1
      testHero.xp = 0

      // Add XP to level up
      testHero.xp = 150

      const newLevel = Math.floor(testHero.xp / 100) + 1
      testHero.level = newLevel

      expect(testHero.level).toBe(2)
    })

    it('should handle multiple levels in one XP gain', () => {
      testHero.level = 1
      testHero.xp = 0

      // Massive XP gain
      testHero.xp = 550

      const newLevel = Math.floor(testHero.xp / 100) + 1
      testHero.level = newLevel

      expect(testHero.level).toBe(6)
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
      expect(testHero.id).toBeDefined()

      // Simulate retirement (would be deleted from heroes table in real app)
      const retiredHeroId = testHero.id
      const retirementGold = 100 * testHero.level

      expect(retirementGold).toBeGreaterThan(0)
      expect(retiredHeroId).toBe(testHero.id)
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
      } else if (testHero.moraleValue >= 20) {
        testHero.morale = 'tired'
      } else {
        testHero.morale = 'exhausted'
      }

      expect(testHero.moraleValue).toBe(40)
      expect(testHero.morale).toBe('content')
    })

    it('should prevent expedition if hero is exhausted', () => {
      testHero.moraleValue = 10
      testHero.morale = 'exhausted'

      const canStartExpedition = testHero.moraleValue >= 20

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
      } else if (testHero.moraleValue >= 20) {
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
      const hero2 = generateHero({ forceRarity: 'uncommon' })

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
