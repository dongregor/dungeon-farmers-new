import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from '~/components/ui/ProgressBar.vue'

describe('ProgressBar', () => {
  describe('Rendering', () => {
    it('should render progress bar', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.find('.bg-gray-200').exists()).toBe(true)
    })

    it('should not show label row by default', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.find('.justify-between').exists()).toBe(false)
    })

    it('should show label when provided', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100, label: 'Progress' },
      })

      expect(wrapper.text()).toContain('Progress')
    })
  })

  describe('Progress Calculation', () => {
    it('should calculate correct percentage width', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 25, max: 100 },
      })

      const bar = wrapper.find('.h-full')
      expect(bar.attributes('style')).toContain('width: 25%')
    })

    it('should cap at 100%', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 150, max: 100 },
      })

      const bar = wrapper.find('.h-full')
      expect(bar.attributes('style')).toContain('width: 100%')
    })

    it('should handle zero max', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 0 },
      })

      const bar = wrapper.find('.h-full')
      expect(bar.attributes('style')).toContain('width: 0%')
    })

    it('should not go below 0%', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: -10, max: 100 },
      })

      const bar = wrapper.find('.h-full')
      expect(bar.attributes('style')).toContain('width: 0%')
    })
  })

  describe('Display Options', () => {
    it('should show percentage when showPercentage is true', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 75, max: 100, showPercentage: true },
      })

      expect(wrapper.text()).toContain('75%')
    })

    it('should show values when showValues is true', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 30, max: 50, showValues: true },
      })

      expect(wrapper.text()).toContain('30 / 50')
    })

    it('should prefer values over percentage when both enabled', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100, showPercentage: true, showValues: true },
      })

      expect(wrapper.text()).toContain('50 / 100')
      // When showValues is true, showPercentage is hidden
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
    ] as const

    colors.forEach(({ color, expectedClass }) => {
      it(`should apply ${color} color class`, () => {
        const wrapper = mount(ProgressBar, {
          props: { current: 50, max: 100, color },
        })

        const bar = wrapper.find('.h-full')
        expect(bar.classes()).toContain(expectedClass)
      })
    })
  })

  describe('Size Variants', () => {
    it('should apply small size', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100, size: 'sm' },
      })

      expect(wrapper.find('.bg-gray-200').classes()).toContain('h-2')
    })

    it('should apply medium size by default', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.find('.bg-gray-200').classes()).toContain('h-4')
    })

    it('should apply large size', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100, size: 'lg' },
      })

      expect(wrapper.find('.bg-gray-200').classes()).toContain('h-6')
    })
  })

  describe('Animation', () => {
    it('should not animate by default', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100 },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(false)
    })

    it('should animate when animated prop is true', () => {
      const wrapper = mount(ProgressBar, {
        props: { current: 50, max: 100, animated: true },
      })

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })
  })
})
