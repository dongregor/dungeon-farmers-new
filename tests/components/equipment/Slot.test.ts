import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EquipmentSlot from '~/components/equipment/Slot.vue'
import type { Equipment, EquipmentSlot as EquipmentSlotType } from '~~/types'

describe('EquipmentSlot', () => {
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
    isEquipped: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  })

  describe('Empty Slot', () => {
    it('should render slot icon when empty', () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon' },
      })

      expect(wrapper.text()).toContain('⚔️')
    })

    it('should render slot name when empty', () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon' },
      })

      expect(wrapper.text()).toContain('Weapon')
    })

    it.each([
      ['weapon', '⚔️', 'Weapon'],
      ['armor', '🛡️', 'Armor'],
      ['helmet', '⛑️', 'Helmet'],
      ['boots', '👢', 'Boots'],
      ['accessory1', '💍', 'Accessory 1'],
      ['accessory2', '📿', 'Accessory 2'],
    ] as const)('should render correct icon and name for %s slot', (slot, icon, name) => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: slot as EquipmentSlotType },
      })

      expect(wrapper.text()).toContain(icon)
      expect(wrapper.text()).toContain(name)
    })

    it('should have gray border when empty', () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon' },
      })

      expect(wrapper.classes()).toContain('border-gray-600')
    })
  })

  describe('Equipped Slot', () => {
    it('should render equipment name', () => {
      const equipment = createEquipment({ name: 'Dragon Slayer' })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.text()).toContain('Dragon Slayer')
    })

    it('should render item level', () => {
      const equipment = createEquipment({ itemLevel: 25 })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.text()).toContain('iLvl 25')
    })

    it('should render gear score', () => {
      const equipment = createEquipment({ gearScore: 150 })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.text()).toContain('150')
    })

    it('should render equipped checkmark', () => {
      const equipment = createEquipment()
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.text()).toContain('✓')
    })

    it('should render trait count for single trait', () => {
      const equipment = createEquipment({
        traits: [{ traitId: 'strength', quality: 'normal', rolledValue: 5 }],
      })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.text()).toContain('1 trait')
    })

    it('should render trait count for multiple traits', () => {
      const equipment = createEquipment({
        traits: [
          { traitId: 'strength', quality: 'normal', rolledValue: 5 },
          { traitId: 'cunning', quality: 'magic', rolledValue: 8 },
        ],
      })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.text()).toContain('2 traits')
    })

    it('should not render trait count when equipment has no traits', () => {
      const equipment = createEquipment({ traits: [] })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.text()).not.toContain('trait')
    })
  })

  describe('Rarity Styling', () => {
    it.each([
      ['common', 'border-common'],
      ['uncommon', 'border-uncommon'],
      ['rare', 'border-rare'],
      ['epic', 'border-epic'],
      ['legendary', 'border-legendary'],
      ['mythic', 'border-mythic'],
    ] as const)('should apply %s border class when equipped', (rarity, expectedClass) => {
      const equipment = createEquipment({ rarity })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.classes()).toContain(expectedClass)
    })

    it.each([
      ['common', 'text-common'],
      ['uncommon', 'text-uncommon'],
      ['rare', 'text-rare'],
      ['epic', 'text-epic'],
      ['legendary', 'text-legendary'],
      ['mythic', 'text-mythic'],
    ] as const)('should apply %s text color to equipment name', (rarity, expectedClass) => {
      const equipment = createEquipment({ rarity })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.find('.font-bold.truncate').classes()).toContain(expectedClass)
    })
  })

  describe('Set Indicator', () => {
    it('should show set indicator when equipment is part of a set', () => {
      const equipment = createEquipment({ setName: 'Dragon Set' })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.find('.bg-loot-purple.rounded-full').exists()).toBe(true)
    })

    it('should not show set indicator when equipment is not part of a set', () => {
      const equipment = createEquipment({ setName: undefined })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      expect(wrapper.find('.bg-loot-purple.rounded-full').exists()).toBe(false)
    })

    it('should show set name in title attribute', () => {
      const equipment = createEquipment({ setName: 'Dragon Set' })
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment },
      })

      const indicator = wrapper.find('.bg-loot-purple.rounded-full')
      expect(indicator.attributes('title')).toBe('Dragon Set')
    })
  })

  describe('Clickable Behavior', () => {
    it('should not be clickable by default', () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon' },
      })

      expect(wrapper.classes()).not.toContain('cursor-pointer')
    })

    it('should be clickable when clickable prop is true', () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', clickable: true },
      })

      expect(wrapper.classes()).toContain('cursor-pointer')
    })

    it('should emit click event with slot when clicked (empty)', async () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', clickable: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0]).toEqual(['weapon', undefined])
    })

    it('should emit click event with slot and equipment when clicked (equipped)', async () => {
      const equipment = createEquipment()
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', equipment, clickable: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')![0]).toEqual(['weapon', equipment])
    })

    it('should not emit click event when not clickable', async () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', clickable: false },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should apply hover effects when clickable', () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon', clickable: true },
      })

      expect(wrapper.classes()).toContain('hover:shadow-lg')
      expect(wrapper.classes()).toContain('hover:scale-105')
    })
  })

  describe('Aspect Ratio', () => {
    it('should maintain square aspect ratio', () => {
      const wrapper = mount(EquipmentSlot, {
        props: { slot: 'weapon' },
      })

      expect(wrapper.find('.aspect-square').exists()).toBe(true)
    })
  })
})
