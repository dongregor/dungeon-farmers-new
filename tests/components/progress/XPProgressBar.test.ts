import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import XPProgressBar from '~/components/progress/XPProgressBar.vue'

describe('XPProgressBar', () => {
  describe('Rendering', () => {
    it('should render progress bar', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 5 },
      })

      expect(wrapper.find('.bg-gray-200').exists()).toBe(true)
    })

    it('should display current level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 5 },
      })

      expect(wrapper.text()).toContain('Level 5')
    })

    it('should display XP values', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 250, requiredXP: 1000, level: 3 },
      })

      expect(wrapper.text()).toContain('250')
      // Locale-dependent formatting (may use comma, space, or period as separator)
      expect(wrapper.text()).toMatch(/1.?000/)
      expect(wrapper.text()).toContain('XP')
    })

    it('should show percentage by default', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1 },
      })

      expect(wrapper.text()).toContain('50%')
    })
  })

  describe('Progress Calculation', () => {
    it('should calculate correct progress percentage', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 25, requiredXP: 100, level: 1 },
      })

      const progressBar = wrapper.find('.bg-blue-500')
      expect(progressBar.attributes('style')).toContain('width: 25%')
    })

    it('should cap progress at 100%', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 150, requiredXP: 100, level: 1 },
      })

      const progressBar = wrapper.find('.bg-blue-500, .bg-yellow-500')
      expect(progressBar.attributes('style')).toContain('width: 100%')
    })

    it('should not go below 0%', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: -50, requiredXP: 100, level: 1 },
      })

      const progressBar = wrapper.find('.bg-blue-500')
      expect(progressBar.attributes('style')).toContain('width: 0%')
    })

    it('should handle zero requiredXP at max level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 0, requiredXP: 0, level: 50, maxLevel: 50 },
      })

      const progressBar = wrapper.find('.bg-yellow-500')
      expect(progressBar.attributes('style')).toContain('width: 100%')
    })
  })

  describe('Max Level', () => {
    it('should show MAX indicator at max level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 0, requiredXP: 0, level: 50, maxLevel: 50 },
      })

      expect(wrapper.text()).toContain('MAX')
    })

    it('should use yellow color at max level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 0, requiredXP: 100, level: 50, maxLevel: 50 },
      })

      expect(wrapper.find('.bg-yellow-500').exists()).toBe(true)
    })

    it('should not show MAX when below max level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 10, maxLevel: 50 },
      })

      expect(wrapper.text()).not.toContain('MAX')
    })

    it('should use blue color when not at max level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 10 },
      })

      expect(wrapper.find('.bg-blue-500').exists()).toBe(true)
    })
  })

  describe('Milestones', () => {
    it('should not show milestones by default', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1 },
      })

      // Milestones have a specific class
      expect(wrapper.find('.bg-gray-400\\/50').exists()).toBe(false)
    })

    it('should show milestones when showMilestones is true', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1, showMilestones: true },
      })

      // Should have 3 milestone markers (25%, 50%, 75%)
      const milestones = wrapper.findAll('.bg-gray-400\\/50')
      expect(milestones.length).toBe(3)
    })

    it('should position milestones at 25%, 50%, 75%', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1, showMilestones: true },
      })

      const milestones = wrapper.findAll('.bg-gray-400\\/50')
      expect(milestones[0].attributes('style')).toContain('left: 25%')
      expect(milestones[1].attributes('style')).toContain('left: 50%')
      expect(milestones[2].attributes('style')).toContain('left: 75%')
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1, size: 'sm' },
      })

      expect(wrapper.find('.h-2').exists()).toBe(true)
      expect(wrapper.find('.text-xs').exists()).toBe(true)
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1 },
      })

      expect(wrapper.find('.h-4').exists()).toBe(true)
      expect(wrapper.find('.text-sm').exists()).toBe(true)
    })

    it('should apply large size classes', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1, size: 'lg' },
      })

      expect(wrapper.find('.h-6').exists()).toBe(true)
      expect(wrapper.find('.text-base').exists()).toBe(true)
    })

    it('should hide percentage in small size', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 1, size: 'sm' },
      })

      // Small size should not show percentage below the bar
      expect(wrapper.findAll('.text-gray-500').filter(e => e.text().includes('%')).length).toBe(0)
    })
  })

  describe('Animations', () => {
    it('should have pulse animation at max level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 0, requiredXP: 0, level: 50, maxLevel: 50 },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })

    it('should not have pulse animation when not at max level', () => {
      const wrapper = mount(XPProgressBar, {
        props: { currentXP: 50, requiredXP: 100, level: 10 },
      })

      // The progress bar should not have animate-pulse
      const progressBar = wrapper.find('.bg-blue-500')
      expect(progressBar.classes()).not.toContain('animate-pulse')
    })
  })
})
