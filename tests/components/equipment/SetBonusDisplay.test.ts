import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SetBonusDisplay from '~/components/equipment/SetBonusDisplay.vue'
import type { Equipment, EquipmentSet } from '~~/types'

// Mock the formatTraitDescription function
vi.mock('~/data/equipmentTraits', () => ({
  formatTraitDescription: vi.fn((traitId: string, value?: number) => {
    if (value) return `${traitId}: +${value}`
    return traitId
  }),
}))

describe('SetBonusDisplay', () => {
  const createEquipment = (overrides: Partial<Equipment> = {}): Equipment => ({
    id: 'eq-' + Math.random().toString(36).substr(2, 9),
    name: 'Iron Sword',
    slot: 'weapon',
    rarity: 'common',
    itemLevel: 10,
    gearScore: 100,
    stats: { combat: 10, utility: 0, survival: 5 },
    bonuses: [],
    isEquipped: true,
    equippedByHeroId: 'hero-1',
    playerId: 'player-1',
    sourceZoneId: 'zone-1',
    sourceSubzoneId: 'subzone-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  })

  const createSet = (overrides: Partial<EquipmentSet> = {}): EquipmentSet => ({
    id: 'set-warriors',
    name: "Warrior's Might",
    pieces: ['eq-1', 'eq-2', 'eq-3', 'eq-4', 'eq-5', 'eq-6'],
    bonuses: [
      {
        requiredPieces: 2,
        grantedTraits: [{ traitId: 'strength_boost', fixedValue: 10, quality: 'uncommon' }],
      },
      {
        requiredPieces: 4,
        grantedTraits: [{ traitId: 'defense_boost', fixedValue: 15, quality: 'rare' }],
      },
      {
        requiredPieces: 6,
        grantedTraits: [{ traitId: 'ultimate_power', fixedValue: 25, quality: 'epic' }],
      },
    ],
    ...overrides,
  })

  describe('Empty State', () => {
    it('should show no sets message when no set items equipped', () => {
      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: [] },
      })

      expect(wrapper.text()).toContain('No set bonuses active')
    })

    it('should show helpful hint in empty state', () => {
      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: [] },
      })

      expect(wrapper.text()).toContain('Equip multiple pieces from the same set to gain bonuses')
    })

    it('should show empty when items have no setId', () => {
      const items = [
        createEquipment({ id: 'eq-1' }),
        createEquipment({ id: 'eq-2' }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items },
      })

      expect(wrapper.text()).toContain('No set bonuses active')
    })
  })

  describe('Set Detection', () => {
    it('should detect equipped set items', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).toContain("Warrior's Might")
    })

    it('should show piece count', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).toContain('2/6 pieces')
    })

    it('should handle multiple sets', () => {
      const warriorSet = createSet()
      const mageSet = createSet({
        id: 'set-mages',
        name: "Mage's Wisdom",
        pieces: ['eq-10', 'eq-11', 'eq-12', 'eq-13'],
        bonuses: [
          { requiredPieces: 2, grantedTraits: [{ traitId: 'magic_boost', fixedValue: 10, quality: 'uncommon' }] },
        ],
      })

      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-10', setId: 'set-mages', setName: "Mage's Wisdom" }),
        createEquipment({ id: 'eq-11', setId: 'set-mages', setName: "Mage's Wisdom" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [warriorSet, mageSet] },
      })

      expect(wrapper.text()).toContain("Warrior's Might")
      expect(wrapper.text()).toContain("Mage's Wisdom")
    })
  })

  describe('Active Bonuses', () => {
    it('should show active 2-piece bonus', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).toContain('✓ 2-Piece Bonus')
      expect(wrapper.text()).toContain('strength_boost')
    })

    it('should show multiple active bonuses', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-3', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-4', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).toContain('✓ 2-Piece Bonus')
      expect(wrapper.text()).toContain('✓ 4-Piece Bonus')
    })

    it('should show trait quality', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).toContain('(uncommon)')
    })
  })

  describe('Next Bonus Preview', () => {
    it('should show next bonus when not all bonuses unlocked', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).toContain('4-Piece Bonus')
      expect(wrapper.text()).toContain('2 more needed')
    })

    it('should calculate pieces needed correctly', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-3', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      // Next is 4-piece, have 3, need 1 more
      expect(wrapper.text()).toContain('1 more needed')
    })

    it('should show next bonus preview with reduced opacity', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.find('.opacity-50').exists()).toBe(true)
    })
  })

  describe('All Bonuses Unlocked', () => {
    it('should show celebration message when all bonuses unlocked', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-3', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-4', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-5', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-6', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).toContain('All set bonuses unlocked!')
    })

    it('should not show next bonus when all unlocked', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-3', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-4', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-5', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-6', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.text()).not.toContain('more needed')
    })
  })

  describe('Progress Bar', () => {
    it('should show progress bar', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.find('.bg-gray-700.rounded-full.h-2').exists()).toBe(true)
    })

    it('should calculate progress percentage correctly', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-3', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      // 3/6 = 50%
      const progressBar = wrapper.find('.bg-loot-purple.h-2')
      expect(progressBar.attributes('style')).toContain('width: 50%')
    })
  })

  describe('Styling', () => {
    it('should have dark background for empty state', () => {
      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: [] },
      })

      expect(wrapper.find('.bg-gray-800').exists()).toBe(true)
    })

    it('should have purple border for active sets', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.find('.border-loot-purple\\/50').exists()).toBe(true)
    })

    it('should have green checkmark for active bonuses', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      expect(wrapper.find('.text-success-green').exists()).toBe(true)
    })
  })

  describe('Sorting', () => {
    it('should sort sets by equipped count (descending)', () => {
      const warriorSet = createSet()
      const mageSet = createSet({
        id: 'set-mages',
        name: "Mage's Wisdom",
        pieces: ['eq-10', 'eq-11', 'eq-12', 'eq-13'],
        bonuses: [
          { requiredPieces: 2, grantedTraits: [{ traitId: 'magic_boost', fixedValue: 10, quality: 'uncommon' }] },
        ],
      })

      // 4 warrior pieces, 2 mage pieces - warrior should be first
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-2', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-3', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-4', setId: 'set-warriors', setName: "Warrior's Might" }),
        createEquipment({ id: 'eq-10', setId: 'set-mages', setName: "Mage's Wisdom" }),
        createEquipment({ id: 'eq-11', setId: 'set-mages', setName: "Mage's Wisdom" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [warriorSet, mageSet] },
      })

      const setNames = wrapper.findAll('.text-loot-purple')
      expect(setNames[0].text()).toBe("Warrior's Might")
    })
  })

  describe('Edge Cases', () => {
    it('should handle set without matching definition', () => {
      const items = [
        createEquipment({ id: 'eq-1', setId: 'unknown-set', setName: 'Unknown Set' }),
        createEquipment({ id: 'eq-2', setId: 'unknown-set', setName: 'Unknown Set' }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [] },
      })

      // Should not crash, should show empty state
      expect(wrapper.text()).toContain('No set bonuses active')
    })

    it('should handle one piece of a set (no bonus yet)', () => {
      const set = createSet()
      const items = [
        createEquipment({ id: 'eq-1', setId: 'set-warriors', setName: "Warrior's Might" }),
      ]

      const wrapper = mount(SetBonusDisplay, {
        props: { equippedItems: items, availableSets: [set] },
      })

      // Should show set but no active bonuses
      expect(wrapper.text()).toContain("Warrior's Might")
      expect(wrapper.text()).toContain('1/6 pieces')
      expect(wrapper.text()).not.toContain('✓')
    })
  })
})
