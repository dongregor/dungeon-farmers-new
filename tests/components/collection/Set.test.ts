import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Set from '~/components/collection/Set.vue'

describe('Set (Equipment Sets)', () => {
  describe('Stats Overview', () => {
    it('should display header', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('Equipment Sets')
      expect(wrapper.text()).toContain('Collect complete sets to unlock powerful bonuses')
    })

    it('should show completion stats', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('Complete:')
      expect(wrapper.text()).toContain('In Progress:')
    })

    it('should have gradient background for overview', () => {
      const wrapper = mount(Set)

      expect(wrapper.find('.bg-gradient-to-r.from-purple-50').exists()).toBe(true)
    })
  })

  describe('Set List', () => {
    it('should display all sets', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain("Guardian's Plate")
      expect(wrapper.text()).toContain("Shadow Veil")
      expect(wrapper.text()).toContain("Arcane Regalia")
    })

    it('should show set icons', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('🛡️')
      expect(wrapper.text()).toContain('🗡️')
      expect(wrapper.text()).toContain('✨')
    })

    it('should display set descriptions', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('Heavy armor forged for defenders')
      expect(wrapper.text()).toContain('crafted for those who strike from darkness')
    })

    it('should show set rarity', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('rare')
      expect(wrapper.text()).toContain('epic')
      expect(wrapper.text()).toContain('legendary')
    })

    it('should display theme', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('Theme:')
      expect(wrapper.text()).toContain('Defense')
      expect(wrapper.text()).toContain('Stealth')
      expect(wrapper.text()).toContain('Magic')
    })

    it('should show piece progress', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('Progress:')
      expect(wrapper.text()).toContain('4 / 6')
      expect(wrapper.text()).toContain('2 / 5')
      expect(wrapper.text()).toContain('0 / 6')
    })
  })

  describe('Rarity Styling', () => {
    it('should have blue border for rare sets', () => {
      const wrapper = mount(Set)

      expect(wrapper.find('.border-blue-500').exists()).toBe(true)
    })

    it('should have purple border for epic sets', () => {
      const wrapper = mount(Set)

      expect(wrapper.find('.border-purple-500').exists()).toBe(true)
    })

    it('should have yellow border for legendary sets', () => {
      const wrapper = mount(Set)

      expect(wrapper.find('.border-yellow-500').exists()).toBe(true)
    })

    it('should have gradient header bar', () => {
      const wrapper = mount(Set)

      expect(wrapper.find('.h-2.bg-gradient-to-r').exists()).toBe(true)
    })
  })

  describe('Expand/Collapse', () => {
    it('should show expand arrow when collapsed', () => {
      const wrapper = mount(Set)

      expect(wrapper.text()).toContain('▶')
    })

    it('should expand set on click', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.text()).toContain('▼')
      expect(wrapper.text()).toContain('Set Pieces')
    })

    it('should show pieces when expanded', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.text()).toContain("Guardian's Helm")
      expect(wrapper.text()).toContain("Guardian's Breastplate")
    })

    it('should show bonuses when expanded', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.text()).toContain('Set Bonuses')
      expect(wrapper.text()).toContain('2 Pieces')
      expect(wrapper.text()).toContain('+3 Survival')
    })

    it('should collapse on second click', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')
      await setBtn.trigger('click')

      // Should not show details anymore
      expect(wrapper.text()).not.toContain('Set Pieces')
    })

    it('should add shadow when expanded', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      const setContainer = setBtn.element.closest('.border-2.rounded-lg')
      expect(setContainer?.classList.contains('shadow-lg')).toBe(true)
    })
  })

  describe('Pieces Display', () => {
    it('should show piece slots', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.text()).toContain('Head')
      expect(wrapper.text()).toContain('Chest')
      expect(wrapper.text()).toContain('Legs')
      expect(wrapper.text()).toContain('Hands')
    })

    it('should show checkmark for collected pieces', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      // Should have checkmarks for collected pieces
      const collectedPieces = wrapper.findAll('.text-green-600.font-bold')
      expect(collectedPieces.length).toBeGreaterThan(0)
    })

    it('should show X for uncollected pieces', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      // Should have X marks for uncollected pieces
      expect(wrapper.text()).toContain('✗')
    })

    it('should show ??? for uncollected piece names', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.text()).toContain('???')
    })

    it('should have green border for collected pieces', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.find('.border-green-500.bg-green-50').exists()).toBe(true)
    })

    it('should have reduced opacity for uncollected pieces', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.find('.opacity-60').exists()).toBe(true)
    })
  })

  describe('Bonuses Display', () => {
    it('should show all bonus tiers', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.text()).toContain('2 Pieces')
      expect(wrapper.text()).toContain('4 Pieces')
      expect(wrapper.text()).toContain('6 Pieces')
    })

    it('should show active bonuses', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      // Guardian's Plate has 4 pieces, so 2 and 4 piece bonuses should be active
      expect(wrapper.text()).toContain('✓ Active')
    })

    it('should show locked bonuses', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.text()).toContain('Locked')
    })

    it('should have purple styling for active bonuses', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.find('.border-purple-500.bg-purple-50').exists()).toBe(true)
    })
  })

  describe('Grid Layout', () => {
    it('should use grid for pieces', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.find('.grid.grid-cols-2').exists()).toBe(true)
    })

    it('should be responsive', async () => {
      const wrapper = mount(Set)

      const setBtn = wrapper.find('button.w-full')
      await setBtn.trigger('click')

      expect(wrapper.find('.md\\:grid-cols-3').exists()).toBe(true)
    })
  })
})
