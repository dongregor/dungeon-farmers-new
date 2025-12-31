import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatBar from '~/components/display/StatBar.vue'

describe('StatBar', () => {
  describe('Rendering', () => {
    it('should render stat label capitalized', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'combat', value: 50, max: 100 },
      })

      expect(wrapper.text()).toContain('Combat')
    })

    it('should show value and max by default', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'health', value: 75, max: 100 },
      })

      expect(wrapper.text()).toContain('75 / 100')
    })

    it('should hide value when showValue is false', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'mana', value: 30, max: 50, showValue: false },
      })

      expect(wrapper.text()).not.toContain('30 / 50')
    })
  })

  describe('Progress Bar Width', () => {
    it('should calculate correct percentage', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'xp', value: 25, max: 100 },
      })

      const progressBar = wrapper.find('.h-full')
      expect(progressBar.attributes('style')).toContain('width: 25%')
    })

    it('should cap at 100%', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'overflow', value: 150, max: 100 },
      })

      const progressBar = wrapper.find('.h-full')
      expect(progressBar.attributes('style')).toContain('width: 100%')
    })

    it('should handle zero max value', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'empty', value: 50, max: 0 },
      })

      const progressBar = wrapper.find('.h-full')
      expect(progressBar.attributes('style')).toContain('width: 0%')
    })

    it('should not go below 0%', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'negative', value: -10, max: 100 },
      })

      const progressBar = wrapper.find('.h-full')
      expect(progressBar.attributes('style')).toContain('width: 0%')
    })
  })

  describe('Color Variants', () => {
    const colors = [
      { color: 'blue', expectedClass: 'bg-blue-500' },
      { color: 'green', expectedClass: 'bg-green-500' },
      { color: 'purple', expectedClass: 'bg-purple-500' },
      { color: 'yellow', expectedClass: 'bg-yellow-500' },
      { color: 'red', expectedClass: 'bg-red-500' },
      { color: 'orange', expectedClass: 'bg-orange-500' },
      { color: 'teal', expectedClass: 'bg-teal-500' },
    ] as const

    colors.forEach(({ color, expectedClass }) => {
      it(`should apply ${color} color class`, () => {
        const wrapper = mount(StatBar, {
          props: { stat: 'test', value: 50, max: 100, color },
        })

        const progressBar = wrapper.find('.h-full')
        expect(progressBar.classes()).toContain(expectedClass)
      })
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'test', value: 50, max: 100, size: 'sm' },
      })

      expect(wrapper.find('.w-full.bg-gray-200').classes()).toContain('h-2')
      // Stat label is capitalized, so 'test' becomes 'Test'
      expect(wrapper.text()).toContain('Test')
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'test', value: 50, max: 100 },
      })

      expect(wrapper.find('.w-full.bg-gray-200').classes()).toContain('h-4')
    })

    it('should apply large size classes', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'test', value: 50, max: 100, size: 'lg' },
      })

      expect(wrapper.find('.w-full.bg-gray-200').classes()).toContain('h-6')
    })
  })

  describe('Accessibility', () => {
    it('should have readable stat label', () => {
      const wrapper = mount(StatBar, {
        props: { stat: 'survival', value: 80, max: 100 },
      })

      expect(wrapper.text()).toContain('Survival')
      expect(wrapper.text()).toContain('80 / 100')
    })
  })
})
