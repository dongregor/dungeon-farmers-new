import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PowerScore from '~/components/display/PowerScore.vue'

describe('PowerScore', () => {
  describe('Rendering', () => {
    it('should render power value', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 1500 },
      })

      // Value should be formatted (locale-dependent)
      expect(wrapper.text()).toContain('1500')
    })

    it('should format large numbers with locale formatting', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 1234567 },
      })

      // toLocaleString() formatting varies by locale (comma, space, period separators)
      // Just verify the number appears in some formatted way
      const text = wrapper.text()
      expect(text).toMatch(/1.?234.?567/)
    })

    it('should show icon by default', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100 },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })

    it('should hide icon when showIcon is false', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100, showIcon: false },
      })

      expect(wrapper.find('svg').exists()).toBe(false)
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100, size: 'sm' },
      })

      expect(wrapper.classes()).toContain('text-sm')
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100 },
      })

      expect(wrapper.classes()).toContain('text-base')
    })

    it('should apply large size classes', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100, size: 'lg' },
      })

      expect(wrapper.classes()).toContain('text-xl')
    })
  })

  describe('Tooltip with Breakdown', () => {
    it('should have title attribute with breakdown', () => {
      const wrapper = mount(PowerScore, {
        props: {
          value: 500,
          breakdown: {
            base: 200,
            equipment: 150,
            traits: 100,
            prestige: 50,
          },
        },
      })

      const title = wrapper.attributes('title')
      expect(title).toContain('Base: 200')
      expect(title).toContain('Equipment: 150')
      expect(title).toContain('Traits: 100')
      expect(title).toContain('Prestige: 50')
    })

    it('should not include zero values in tooltip', () => {
      const wrapper = mount(PowerScore, {
        props: {
          value: 200,
          breakdown: {
            base: 200,
            equipment: 0,
            traits: 0,
          },
        },
      })

      const title = wrapper.attributes('title')
      expect(title).toContain('Base: 200')
      expect(title).not.toContain('Equipment')
      expect(title).not.toContain('Traits')
    })

    it('should have empty title when no breakdown provided', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100 },
      })

      expect(wrapper.attributes('title')).toBe('')
    })
  })

  describe('Styling', () => {
    it('should have orange color class', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100 },
      })

      expect(wrapper.classes()).toContain('text-orange-600')
    })

    it('should have font-semibold class', () => {
      const wrapper = mount(PowerScore, {
        props: { value: 100 },
      })

      expect(wrapper.classes()).toContain('font-semibold')
    })
  })
})
