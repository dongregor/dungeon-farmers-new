import { describe, it, expect } from 'vitest'
import {
  getLootTable,
  getLootTableForTier,
  rollLootDrop,
  calculateItemLevel,
  rollRarityForTier,
  getMasteryDropBonus,
  RARITY_WEIGHTS_BY_TIER,
} from '~/data/lootTables'

describe('Loot Tables', () => {
  describe('getLootTable', () => {
    it('should return loot table for Verdant Woods - Woods Edge', () => {
      const lootTable = getLootTable('verdant_woods', 'woods_edge')
      expect(lootTable).toBeDefined()
      expect(lootTable?.zoneId).toBe('verdant_woods')
      expect(lootTable?.subzoneId).toBe('woods_edge')
      expect(lootTable?.entries.length).toBeGreaterThan(0)
    })

    it('should return loot table for Goblin Caves - Cave Entrance', () => {
      const lootTable = getLootTable('goblin_caves', 'cave_entrance')
      expect(lootTable).toBeDefined()
      expect(lootTable?.zoneId).toBe('goblin_caves')
      expect(lootTable?.entries.length).toBeGreaterThan(0)
    })

    it('should return loot table for Misty Swamp - Bog of Despair', () => {
      const lootTable = getLootTable('misty_swamp', 'bog_of_despair')
      expect(lootTable).toBeDefined()
      expect(lootTable?.entries.length).toBeGreaterThan(0)
    })

    it('should return undefined for non-existent zone', () => {
      const lootTable = getLootTable('fake_zone', 'fake_subzone')
      expect(lootTable).toBeUndefined()
    })
  })

  describe('getLootTableForTier', () => {
    it('should return tier 1 loot table with common/uncommon emphasis', () => {
      const entries = getLootTableForTier('verdant_woods', 'woods_edge', 1)
      expect(entries.length).toBeGreaterThan(0)

      // Tier 1 should have lots of common items
      const commonEntries = entries.filter(e => e.rarity === 'common')
      const legendaryEntries = entries.filter(e => e.rarity === 'legendary')

      expect(commonEntries.length).toBeGreaterThan(0)
      expect(legendaryEntries.length).toBe(0) // No legendary at tier 1
    })

    it('should return tier 10 loot table with rare/epic/legendary emphasis', () => {
      const entries = getLootTableForTier('verdant_woods', 'woods_edge', 10)
      expect(entries.length).toBeGreaterThan(0)

      // Tier 10 should have no common items
      const commonEntries = entries.filter(e => e.rarity === 'common')
      const legendaryEntries = entries.filter(e => e.rarity === 'legendary')
      const mythicEntries = entries.filter(e => e.rarity === 'mythic')

      expect(commonEntries.length).toBe(0) // No common at tier 10
      expect(legendaryEntries.length).toBeGreaterThan(0)
      expect(mythicEntries.length).toBeGreaterThan(0)
    })

    it('should generate fallback loot table for unknown subzone', () => {
      const entries = getLootTableForTier('unknown_zone', 'unknown_subzone', 1)
      expect(entries.length).toBeGreaterThan(0)
    })
  })

  describe('rollLootDrop', () => {
    it('should return a valid slot and rarity from loot table', () => {
      const entries = getLootTableForTier('verdant_woods', 'woods_edge', 1)
      const drop = rollLootDrop(entries)

      expect(drop).toBeDefined()
      expect(drop?.slot).toBeDefined()
      expect(drop?.rarity).toBeDefined()
      expect(['weapon', 'head', 'chest', 'hands', 'legs', 'feet', 'accessory']).toContain(drop?.slot)
      expect(['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']).toContain(drop?.rarity)
    })

    it('should return null for empty loot table', () => {
      const drop = rollLootDrop([])
      expect(drop).toBeNull()
    })

    it('should respect loot table weights (statistical test)', () => {
      const entries = getLootTableForTier('verdant_woods', 'woods_edge', 1)
      const drops: Record<string, number> = {}

      // Roll 1000 times
      for (let i = 0; i < 1000; i++) {
        const drop = rollLootDrop(entries)
        if (drop) {
          drops[drop.rarity] = (drops[drop.rarity] || 0) + 1
        }
      }

      // At tier 1, common should be most frequent
      expect(drops.common).toBeGreaterThan(drops.rare || 0)
      expect(drops.common).toBeGreaterThan(drops.epic || 0)
    })
  })

  describe('calculateItemLevel', () => {
    it('should calculate correct item level for easy zone, tier 1', () => {
      const itemLevel = calculateItemLevel('easy', 1)
      expect(itemLevel).toBe(5)
    })

    it('should calculate correct item level for extreme zone, tier 1', () => {
      const itemLevel = calculateItemLevel('extreme', 1)
      expect(itemLevel).toBe(20)
    })

    it('should add tier bonus correctly', () => {
      const tier1 = calculateItemLevel('medium', 1)
      const tier5 = calculateItemLevel('medium', 5)
      const tier10 = calculateItemLevel('medium', 10)

      expect(tier5).toBeGreaterThan(tier1)
      expect(tier10).toBeGreaterThan(tier5)
      expect(tier10).toBe(50) // 10 base + 40 tier bonus
    })
  })

  describe('rollRarityForTier', () => {
    it('should roll common/uncommon frequently at tier 1', () => {
      const results: Record<string, number> = {}

      for (let i = 0; i < 100; i++) {
        const rarity = rollRarityForTier(1)
        results[rarity] = (results[rarity] || 0) + 1
      }

      // Tier 1 should have common and uncommon
      expect(results.common).toBeGreaterThan(0)
      expect(results.uncommon).toBeGreaterThan(0)
    })

    it('should never roll common at tier 10', () => {
      const results: Record<string, number> = {}

      for (let i = 0; i < 100; i++) {
        const rarity = rollRarityForTier(10)
        results[rarity] = (results[rarity] || 0) + 1
      }

      // Tier 10 should have no common
      expect(results.common || 0).toBe(0)
    })
  })

  describe('getMasteryDropBonus', () => {
    it('should return 1.0 for mastery below 33', () => {
      expect(getMasteryDropBonus(0)).toBe(1.0)
      expect(getMasteryDropBonus(32)).toBe(1.0)
    })

    it('should return 1.15 for mastery 33-65', () => {
      expect(getMasteryDropBonus(33)).toBe(1.15)
      expect(getMasteryDropBonus(50)).toBe(1.15)
    })

    it('should return 1.3 for mastery 66-99', () => {
      expect(getMasteryDropBonus(66)).toBe(1.3)
      expect(getMasteryDropBonus(80)).toBe(1.3)
    })

    it('should return 1.5 for mastery 100', () => {
      expect(getMasteryDropBonus(100)).toBe(1.5)
    })
  })

  describe('RARITY_WEIGHTS_BY_TIER', () => {
    it('should have weights for all 10 tiers', () => {
      for (let tier = 1; tier <= 10; tier++) {
        expect(RARITY_WEIGHTS_BY_TIER[tier]).toBeDefined()
      }
    })

    it('should have progression from common to mythic across tiers', () => {
      const tier1Common = RARITY_WEIGHTS_BY_TIER[1].common
      const tier10Common = RARITY_WEIGHTS_BY_TIER[10].common
      const tier1Mythic = RARITY_WEIGHTS_BY_TIER[1].mythic
      const tier10Mythic = RARITY_WEIGHTS_BY_TIER[10].mythic

      expect(tier1Common).toBeGreaterThan(tier10Common)
      expect(tier10Mythic).toBeGreaterThan(tier1Mythic)
    })
  })
})
