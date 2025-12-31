import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Collectible from '~/components/collection/Collectible.vue'

describe('Collectible', () => {
  describe('Category Tabs', () => {
    it('should render all category tabs', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('Story Items')
      expect(wrapper.text()).toContain('Rare Materials')
      expect(wrapper.text()).toContain('Treasures')
    })

    it('should show story items as active by default', () => {
      const wrapper = mount(Collectible)

      const tabs = wrapper.findAll('button')
      const storyTab = tabs[0]

      expect(storyTab.classes()).toContain('bg-blue-500')
      expect(storyTab.classes()).toContain('text-white')
    })

    it('should show category stats', () => {
      const wrapper = mount(Collectible)

      // Based on mock data: 3 collected out of 4 story items
      expect(wrapper.text()).toContain('3 / 4')
    })

    it('should switch categories on click', async () => {
      const wrapper = mount(Collectible)

      const tabs = wrapper.findAll('button')
      await tabs[1].trigger('click') // Click on Materials

      expect(tabs[1].classes()).toContain('bg-blue-500')
      expect(tabs[0].classes()).not.toContain('bg-blue-500')
    })
  })

  describe('Collectibles Display', () => {
    it('should display collected items with icon', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('🗺️')
      expect(wrapper.text()).toContain('💎')
    })

    it('should display collected item names', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('Ancient Map Fragment (North)')
      expect(wrapper.text()).toContain('Glowing Crystal Shard')
    })

    it('should display item descriptions', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('torn piece of an old map')
    })

    it('should display rarity', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('rare')
      expect(wrapper.text()).toContain('epic')
    })

    it('should display source for collected items', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('Source:')
      expect(wrapper.text()).toContain('Verdant Woods')
    })

    it('should show checkmark for collected items', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('✓')
    })
  })

  describe('Uncollected Items', () => {
    it('should show question mark for uncollected item icon', () => {
      const wrapper = mount(Collectible)

      // The uncollected map piece should show ❓
      expect(wrapper.text()).toContain('❓')
    })

    it('should show ??? for uncollected item name', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('???')
    })

    it('should show undiscovered message for description', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.text()).toContain('Undiscovered collectible')
    })

    it('should have reduced opacity for uncollected items', () => {
      const wrapper = mount(Collectible)

      const items = wrapper.findAll('.border-2.rounded-lg.p-4')
      const uncollectedItem = items.find(item => item.classes().includes('opacity-60'))

      expect(uncollectedItem).toBeDefined()
    })
  })

  describe('Rarity Styling', () => {
    it('should apply correct color for rare items', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.find('.text-blue-600').exists()).toBe(true)
    })

    it('should apply correct color for epic items', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.find('.text-purple-600').exists()).toBe(true)
    })

    it('should apply correct background for rare collected items', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.find('.bg-blue-50').exists()).toBe(true)
    })

    it('should apply correct background for epic collected items', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.find('.bg-purple-50').exists()).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no collectibles in category', async () => {
      const wrapper = mount(Collectible)

      // Switch to materials (empty category)
      const tabs = wrapper.findAll('button')
      await tabs[1].trigger('click')

      expect(wrapper.text()).toContain('No collectibles in this category yet')
      expect(wrapper.text()).toContain('📦')
    })
  })

  describe('Grid Layout', () => {
    it('should use grid layout for collectibles', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.find('.grid.grid-cols-1').exists()).toBe(true)
    })

    it('should be responsive', () => {
      const wrapper = mount(Collectible)

      expect(wrapper.find('.md\\:grid-cols-2').exists()).toBe(true)
    })
  })
})
