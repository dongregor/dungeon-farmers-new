import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EquipmentCard from '~/components/equipment/Card.vue'
import type { Equipment, EquipmentRarity, EquipmentSlot } from '~~/types'

// Mock the formatTraitDescription function
vi.mock('~/data/equipmentTraits', () => ({
  formatTraitDescription: vi.fn((traitId: string, value: number) =>
    `+${value} ${traitId.replace(/_/g, ' ')}`
  ),
}))

describe('EquipmentCard', () => {
  const createEquipment = (overrides: Partial<Equipment> = {}): Equipment => ({
    id: 'equip-1',
    playerId: 'player-1',
    name: 'Iron Sword',
    description: 'A sturdy iron sword',
    slot: 'weapon',
    rarity: 'common',
    baseStats: { combat: 10, utility: 2, survival: 3 },
    itemLevel: 10,
    gearScore: 50,
    traits: [],
    maxTraits: 2,
    isEquipped: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render equipment name', () => {
      const equipment = createEquipment({ name: 'Dragon Slayer' })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain('Dragon Slayer')
    })

    it('should render equipment slot', () => {
      const equipment = createEquipment({ slot: 'weapon' })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain('Weapon')
    })

    it('should render equipment rarity', () => {
      const equipment = createEquipment({ rarity: 'epic' })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain('epic')
    })

    it('should render item level', () => {
      const equipment = createEquipment({ itemLevel: 25 })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain('iLvl 25')
    })

    it('should render gear score', () => {
      const equipment = createEquipment({ gearScore: 150 })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain('150')
    })

    it('should render set name when equipment is part of a set', () => {
      const equipment = createEquipment({ setName: 'Dragonscale Set' })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain('Dragonscale Set')
    })

    it('should not render set name when equipment is not part of a set', () => {
      const equipment = createEquipment({ setName: undefined })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.find('.text-loot-purple').exists()).toBe(false)
    })
  })

  describe('Rarity Border Colors', () => {
    it.each([
      ['common', 'border-common'],
      ['uncommon', 'border-uncommon'],
      ['rare', 'border-rare'],
      ['epic', 'border-epic'],
      ['legendary', 'border-legendary'],
      ['mythic', 'border-mythic'],
    ] as const)('should apply %s border class', (rarity, expectedClass) => {
      const equipment = createEquipment({ rarity })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.classes()).toContain(expectedClass)
    })
  })

  describe('Rarity Text Colors', () => {
    it.each([
      ['common', 'text-common'],
      ['uncommon', 'text-uncommon'],
      ['rare', 'text-rare'],
      ['epic', 'text-epic'],
      ['legendary', 'text-legendary'],
      ['mythic', 'text-mythic'],
    ] as const)('should apply %s text color to name', (rarity, expectedClass) => {
      const equipment = createEquipment({ rarity })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      const nameElement = wrapper.find('h3')
      expect(nameElement.classes()).toContain(expectedClass)
    })
  })

  describe('Slot Names', () => {
    it.each([
      ['weapon', 'Weapon'],
      ['armor', 'Armor'],
      ['helmet', 'Helmet'],
      ['boots', 'Boots'],
      ['accessory1', 'Accessory'],
      ['accessory2', 'Accessory'],
    ] as const)('should display correct name for %s slot', (slot, displayName) => {
      const equipment = createEquipment({ slot: slot as EquipmentSlot })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain(displayName)
    })
  })

  describe('Stats Display', () => {
    it('should hide stats by default', () => {
      const equipment = createEquipment({
        baseStats: { combat: 10, utility: 5, survival: 3 },
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: false },
      })

      expect(wrapper.find('.bg-gray-700.rounded-full.h-1\\.5').exists()).toBe(false)
    })

    it('should show stats when showDetails is true', () => {
      const equipment = createEquipment({
        baseStats: { combat: 10, utility: 5, survival: 3 },
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: true },
      })

      expect(wrapper.text()).toContain('10')
      expect(wrapper.text()).toContain('5')
      expect(wrapper.text()).toContain('3')
    })

    it('should show stat progress bar when showDetails is true', () => {
      const equipment = createEquipment({
        baseStats: { combat: 50, utility: 50, survival: 50 },
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: true },
      })

      const progressBar = wrapper.find('.bg-guild-gold.h-1\\.5')
      expect(progressBar.exists()).toBe(true)
    })
  })

  describe('Traits Display', () => {
    it('should show limited traits by default', () => {
      const equipment = createEquipment({
        traits: [
          { traitId: 'strength', quality: 'normal', rolledValue: 5 },
          { traitId: 'cunning', quality: 'magic', rolledValue: 8 },
          { traitId: 'vitality', quality: 'perfect', rolledValue: 10 },
        ],
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: false },
      })

      expect(wrapper.text()).toContain('+1 more')
    })

    it('should show all traits when showDetails is true', () => {
      const equipment = createEquipment({
        traits: [
          { traitId: 'strength', quality: 'normal', rolledValue: 5 },
          { traitId: 'cunning', quality: 'magic', rolledValue: 8 },
          { traitId: 'vitality', quality: 'perfect', rolledValue: 10 },
        ],
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: true },
      })

      expect(wrapper.text()).not.toContain('+1 more')
    })

    it('should show trait quality when showDetails is true', () => {
      const equipment = createEquipment({
        traits: [{ traitId: 'strength', quality: 'magic', rolledValue: 5 }],
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: true },
      })

      expect(wrapper.text()).toContain('magic')
    })

    it('should not show trait quality when showDetails is false', () => {
      const equipment = createEquipment({
        traits: [{ traitId: 'strength', quality: 'magic', rolledValue: 5 }],
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: false },
      })

      // Quality should only appear in the trait text via showDetails
      const qualitySpan = wrapper.find('.text-gray-500.ml-1')
      expect(qualitySpan.exists()).toBe(false)
    })
  })

  describe('Trait Quality Colors', () => {
    it('should apply gray color for normal quality', () => {
      const equipment = createEquipment({
        traits: [{ traitId: 'strength', quality: 'normal', rolledValue: 5 }],
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.find('.text-gray-400').exists()).toBe(true)
    })

    it('should apply blue color for magic quality', () => {
      const equipment = createEquipment({
        traits: [{ traitId: 'strength', quality: 'magic', rolledValue: 5 }],
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.find('.text-blue-400').exists()).toBe(true)
    })

    it('should apply purple color for perfect quality', () => {
      const equipment = createEquipment({
        traits: [{ traitId: 'strength', quality: 'perfect', rolledValue: 10 }],
      })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.find('.text-purple-400').exists()).toBe(true)
    })
  })

  describe('Description', () => {
    it('should hide description by default', () => {
      const equipment = createEquipment({ description: 'A powerful weapon' })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: false },
      })

      expect(wrapper.text()).not.toContain('A powerful weapon')
    })

    it('should show description when showDetails is true', () => {
      const equipment = createEquipment({ description: 'A powerful weapon forged by dwarves' })
      const wrapper = mount(EquipmentCard, {
        props: { equipment, showDetails: true },
      })

      expect(wrapper.text()).toContain('A powerful weapon forged by dwarves')
    })
  })

  describe('Equipped State', () => {
    it('should show equipped indicator when isEquipped is true', () => {
      const equipment = createEquipment({ isEquipped: true })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).toContain('Equipped')
    })

    it('should hide equipped indicator when isEquipped is false', () => {
      const equipment = createEquipment({ isEquipped: false })
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.text()).not.toContain('Equipped')
    })
  })

  describe('Clickable Behavior', () => {
    it('should not be clickable by default', () => {
      const equipment = createEquipment()
      const wrapper = mount(EquipmentCard, {
        props: { equipment },
      })

      expect(wrapper.classes()).not.toContain('cursor-pointer')
    })

    it('should be clickable when clickable prop is true', () => {
      const equipment = createEquipment()
      const wrapper = mount(EquipmentCard, {
        props: { equipment, clickable: true },
      })

      expect(wrapper.classes()).toContain('cursor-pointer')
    })

    it('should emit click event when clicked and clickable', async () => {
      const equipment = createEquipment()
      const wrapper = mount(EquipmentCard, {
        props: { equipment, clickable: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0]).toEqual([equipment])
    })

    it('should not emit click event when clicked but not clickable', async () => {
      const equipment = createEquipment()
      const wrapper = mount(EquipmentCard, {
        props: { equipment, clickable: false },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should apply hover effects when clickable', () => {
      const equipment = createEquipment()
      const wrapper = mount(EquipmentCard, {
        props: { equipment, clickable: true },
      })

      expect(wrapper.classes()).toContain('hover:shadow-lg')
      expect(wrapper.classes()).toContain('hover:scale-105')
    })
  })
})
