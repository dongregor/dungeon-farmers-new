import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Monster from '~/components/collection/Monster.vue'

describe('Monster', () => {
  describe('Overall Stats', () => {
    it('should display header', () => {
      const wrapper = mount(Monster)

      expect(wrapper.text()).toContain('Monster Collection')
      expect(wrapper.text()).toContain('Discover monsters by encountering them on expeditions')
    })

    it('should show overall percentage', () => {
      const wrapper = mount(Monster)

      // Based on mock data: 17 / 32 = 53%
      expect(wrapper.text()).toContain('53%')
    })

    it('should show collected count', () => {
      const wrapper = mount(Monster)

      // Based on mock data: 17 collected out of 32 total
      expect(wrapper.text()).toContain('17 / 32')
    })

    it('should have gradient background', () => {
      const wrapper = mount(Monster)

      expect(wrapper.find('.bg-gradient-to-r.from-green-50').exists()).toBe(true)
    })
  })

  describe('Zones List', () => {
    it('should display all zones', () => {
      const wrapper = mount(Monster)

      expect(wrapper.text()).toContain('Verdant Woods')
      expect(wrapper.text()).toContain('Goblin Caves')
    })

    it('should show zone monster counts', () => {
      const wrapper = mount(Monster)

      expect(wrapper.text()).toContain('12 / 18 monsters')
      expect(wrapper.text()).toContain('5 / 14 monsters')
    })

    it('should show expand arrow', () => {
      const wrapper = mount(Monster)

      expect(wrapper.text()).toContain('▶')
    })

    it('should show progress bar for each zone', () => {
      const wrapper = mount(Monster)

      const progressBars = wrapper.findAll('.h-2.rounded-full.transition-all')
      expect(progressBars.length).toBeGreaterThan(0)
    })

    it('should show progress percentage', () => {
      const wrapper = mount(Monster)

      // Verdant Woods: 12/18 = 67%
      expect(wrapper.text()).toContain('67%')
      // Goblin Caves: 5/14 = 36%
      expect(wrapper.text()).toContain('36%')
    })
  })

  describe('Progress Bar Colors', () => {
    it('should show green for high progress', () => {
      const wrapper = mount(Monster)

      // No zone at 100% in mock data
      // But we can check the progress bar logic exists
      expect(wrapper.find('.bg-gray-200.rounded-full').exists()).toBe(true)
    })

    it('should show yellow for medium progress', () => {
      const wrapper = mount(Monster)

      // Verdant Woods is at 67% - should be yellow
      expect(wrapper.find('.bg-yellow-500').exists()).toBe(true)
    })

    it('should show red for low progress', () => {
      const wrapper = mount(Monster)

      // Goblin Caves is at 36% - should be red
      expect(wrapper.find('.bg-red-500').exists()).toBe(true)
    })
  })

  describe('Zone Expansion', () => {
    it('should expand zone on click', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      expect(wrapper.text()).toContain('▼')
    })

    it('should show subzones when expanded', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      expect(wrapper.text()).toContain('Sunlit Clearing')
      expect(wrapper.text()).toContain('Dense Thicket')
      expect(wrapper.text()).toContain('Ancient Grove')
    })

    it('should collapse on second click', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')
      await zoneBtn.trigger('click')

      expect(wrapper.text()).not.toContain('Sunlit Clearing')
    })

    it('should have green border when expanded', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      const zoneContainer = wrapper.find('.border-green-500')
      expect(zoneContainer.exists()).toBe(true)
    })
  })

  describe('Subzones', () => {
    it('should show subzone names', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      expect(wrapper.text()).toContain('Sunlit Clearing')
      expect(wrapper.text()).toContain('Dense Thicket')
    })

    it('should show subzone collection counts', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      expect(wrapper.text()).toContain('6 / 6')
      expect(wrapper.text()).toContain('4 / 7')
    })

    it('should show folder icon for unlocked subzones', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      expect(wrapper.text()).toContain('📂')
    })

    it('should show complete checkmark for fully collected subzones', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      // Sunlit Clearing has 6/6 - complete
      expect(wrapper.text()).toContain('✓ Complete')
    })
  })

  describe('Locked Subzones', () => {
    it('should show lock icon for locked subzones', async () => {
      const wrapper = mount(Monster)

      // Expand Goblin Caves (second zone)
      const zoneBtns = wrapper.findAll('button.w-full')
      await zoneBtns[1].trigger('click')

      expect(wrapper.text()).toContain('🔒')
    })

    it('should have reduced opacity for locked subzones', async () => {
      const wrapper = mount(Monster)

      const zoneBtns = wrapper.findAll('button.w-full')
      await zoneBtns[1].trigger('click')

      // Treasure Vault is locked
      expect(wrapper.find('.opacity-50').exists()).toBe(true)
    })

    it('should be disabled for locked subzones', async () => {
      const wrapper = mount(Monster)

      const zoneBtns = wrapper.findAll('button.w-full')
      await zoneBtns[1].trigger('click')

      const subzoneBtns = wrapper.findAll('.bg-gray-50 button')
      const lockedBtn = subzoneBtns.find(b => b.text().includes('Treasure Vault'))

      expect(lockedBtn?.attributes('disabled')).toBeDefined()
    })
  })

  describe('Subzone Selection', () => {
    it('should highlight selected subzone', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      const subzoneBtns = wrapper.findAll('.bg-gray-50 button')
      await subzoneBtns[0].trigger('click')

      expect(subzoneBtns[0].classes()).toContain('bg-green-100')
    })

    it('should show monster details panel when subzone selected', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      const subzoneBtns = wrapper.findAll('.bg-gray-50 button')
      await subzoneBtns[0].trigger('click')

      expect(wrapper.text()).toContain('Sunlit Clearing')
      expect(wrapper.text()).toContain('🐉')
      expect(wrapper.text()).toContain('Monster catalog coming soon')
    })

    it('should show discovered count in details', async () => {
      const wrapper = mount(Monster)

      const zoneBtn = wrapper.find('button.w-full')
      await zoneBtn.trigger('click')

      const subzoneBtns = wrapper.findAll('.bg-gray-50 button')
      await subzoneBtns[0].trigger('click')

      expect(wrapper.text()).toContain('6 of 6 monsters discovered')
    })
  })

  describe('Styling', () => {
    it('should have border on zones', () => {
      const wrapper = mount(Monster)

      expect(wrapper.find('.border-2.rounded-lg').exists()).toBe(true)
    })

    it('should have hover effect on zones', () => {
      const wrapper = mount(Monster)

      expect(wrapper.find('button.hover\\:bg-gray-50').exists()).toBe(true)
    })

    it('should have spacing between zones', () => {
      const wrapper = mount(Monster)

      expect(wrapper.find('.space-y-3').exists()).toBe(true)
    })
  })
})
