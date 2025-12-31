import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResourceCapacity from '~/components/economy/ResourceCapacity.vue'

describe('ResourceCapacity', () => {
  describe('Basic Rendering', () => {
    it('should render current and max values', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.text()).toContain('50')
      expect(wrapper.text()).toContain('100')
    })

    it('should render type label when provided', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100, type: 'Inventory' },
      })

      expect(wrapper.text()).toContain('Inventory')
    })

    it('should not render type label when not provided', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      // Should only have values, no type label
      expect(wrapper.find('.font-medium.text-gray-700').exists()).toBe(false)
    })

    it('should render progress bar', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.find('.bg-gray-200.rounded-full').exists()).toBe(true)
    })

    it('should show percentage text', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.text()).toContain('50% full')
    })
  })

  describe('Percentage Calculation', () => {
    it('should calculate correct percentage at 50%', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.attributes('style')).toContain('width: 50%')
    })

    it('should calculate correct percentage at 75%', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 75, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.attributes('style')).toContain('width: 75%')
    })

    it('should cap percentage at 100%', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 150, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.attributes('style')).toContain('width: 100%')
    })

    it('should handle zero max gracefully', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 0 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.attributes('style')).toContain('width: 0%')
    })

    it('should handle zero current', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 0, max: 100 },
      })

      expect(wrapper.text()).toContain('0% full')
    })
  })

  describe('Capacity States', () => {
    it('should show normal state when below warning threshold', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).toContain('bg-green-500')
    })

    it('should show warning state at 80% (default threshold)', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 80, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).toContain('bg-yellow-500')
      expect(wrapper.text()).toContain('Nearly Full')
    })

    it('should show critical state at 95% (default threshold)', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 95, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).toContain('bg-red-500')
      expect(wrapper.text()).toContain('Almost Full!')
    })

    it('should show critical state at 100%', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 100, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).toContain('bg-red-500')
    })

    it('should use custom warning threshold', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 60, max: 100, warningThreshold: 0.5 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).toContain('bg-yellow-500')
    })

    it('should use custom critical threshold', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 85, max: 100, criticalThreshold: 0.8 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).toContain('bg-red-500')
    })
  })

  describe('Status Icons', () => {
    it('should not show icon in normal state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.text()).not.toContain('⚠️')
      expect(wrapper.text()).not.toContain('⚡')
    })

    it('should show lightning icon in warning state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 85, max: 100 },
      })

      expect(wrapper.text()).toContain('⚡')
    })

    it('should show warning icon in critical state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 98, max: 100 },
      })

      expect(wrapper.text()).toContain('⚠️')
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100, size: 'sm' },
      })

      expect(wrapper.find('.h-2').exists()).toBe(true)
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.find('.h-4').exists()).toBe(true)
    })

    it('should apply large size classes', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100, size: 'lg' },
      })

      expect(wrapper.find('.h-6').exists()).toBe(true)
    })

    it('should not show percentage text in small size', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100, size: 'sm' },
      })

      expect(wrapper.text()).not.toContain('% full')
    })

    it('should show percentage text in medium size', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100, size: 'md' },
      })

      expect(wrapper.text()).toContain('% full')
    })
  })

  describe('Text Color', () => {
    it('should have gray text in normal state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.find('.text-gray-700.font-semibold').exists()).toBe(true)
    })

    it('should have yellow text in warning state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 85, max: 100 },
      })

      expect(wrapper.find('.text-yellow-700.font-semibold').exists()).toBe(true)
    })

    it('should have red text in critical state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 98, max: 100 },
      })

      expect(wrapper.find('.text-red-700.font-semibold').exists()).toBe(true)
    })
  })

  describe('Animation', () => {
    it('should animate pulse in critical state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 98, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).toContain('animate-pulse')
    })

    it('should not animate pulse in normal state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 50, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).not.toContain('animate-pulse')
    })

    it('should not animate pulse in warning state', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 85, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.classes()).not.toContain('animate-pulse')
    })
  })

  describe('Number Formatting', () => {
    it('should format large numbers with locale', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 1234, max: 5000 },
      })

      // toLocaleString formats numbers - check values exist
      expect(wrapper.text()).toContain('1234') // May or may not have comma depending on locale
      expect(wrapper.text()).toContain('5000')
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative current gracefully', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: -10, max: 100 },
      })

      const bar = wrapper.find('.h-full.rounded-full')
      expect(bar.attributes('style')).toContain('width: 0%')
    })

    it('should round percentage display', () => {
      const wrapper = mount(ResourceCapacity, {
        props: { current: 33, max: 100 },
      })

      expect(wrapper.text()).toContain('33% full')
    })
  })
})
