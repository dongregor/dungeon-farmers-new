import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EfficiencyIndicator from '~/components/display/EfficiencyIndicator.vue'

describe('EfficiencyIndicator', () => {
  describe('Rendering', () => {
    it('should render efficiency percentage', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 85 },
      })

      expect(wrapper.text()).toContain('85%')
    })

    it('should round percentage to nearest integer', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 85.7 },
      })

      expect(wrapper.text()).toContain('86%')
    })

    it('should render icon', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 100 },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })

  describe('Tier Classification', () => {
    it('should classify poor tier (< 70%)', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 60 },
      })

      expect(wrapper.text()).toContain('Poor')
      expect(wrapper.classes()).toContain('bg-red-100')
      expect(wrapper.classes()).toContain('border-red-300')
    })

    it('should classify below optimal tier (70-99%)', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 85 },
      })

      expect(wrapper.text()).toContain('Below Optimal')
      expect(wrapper.classes()).toContain('bg-yellow-100')
      expect(wrapper.classes()).toContain('border-yellow-300')
    })

    it('should classify optimal tier (100-119%)', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 110 },
      })

      expect(wrapper.text()).toContain('Optimal')
      expect(wrapper.classes()).toContain('bg-green-100')
      expect(wrapper.classes()).toContain('border-green-300')
    })

    it('should classify excellent tier (120%+)', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 130 },
      })

      expect(wrapper.text()).toContain('Excellent')
      expect(wrapper.classes()).toContain('bg-blue-100')
      expect(wrapper.classes()).toContain('border-blue-300')
    })
  })

  describe('Tier Boundaries', () => {
    it('should be poor at 69%', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 69 },
      })

      expect(wrapper.text()).toContain('Poor')
    })

    it('should be below optimal at 70%', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 70 },
      })

      expect(wrapper.text()).toContain('Below Optimal')
    })

    it('should be below optimal at 99%', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 99 },
      })

      expect(wrapper.text()).toContain('Below Optimal')
    })

    it('should be optimal at 100%', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 100 },
      })

      expect(wrapper.text()).toContain('Optimal')
    })

    it('should be optimal at 119%', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 119 },
      })

      expect(wrapper.text()).toContain('Optimal')
    })

    it('should be excellent at 120%', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 120 },
      })

      expect(wrapper.text()).toContain('Excellent')
    })
  })

  describe('Label Visibility', () => {
    it('should show label by default', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 100 },
      })

      expect(wrapper.text()).toContain('(Optimal)')
    })

    it('should hide label when showLabel is false', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 100, showLabel: false },
      })

      expect(wrapper.text()).not.toContain('Optimal')
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 100, size: 'sm' },
      })

      expect(wrapper.classes()).toContain('text-xs')
      expect(wrapper.classes()).toContain('px-2')
      expect(wrapper.find('svg').classes()).toContain('w-3')
      expect(wrapper.find('svg').classes()).toContain('h-3')
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 100 },
      })

      expect(wrapper.classes()).toContain('text-sm')
      expect(wrapper.classes()).toContain('px-3')
      expect(wrapper.find('svg').classes()).toContain('w-4')
      expect(wrapper.find('svg').classes()).toContain('h-4')
    })

    it('should apply large size classes', () => {
      const wrapper = mount(EfficiencyIndicator, {
        props: { value: 100, size: 'lg' },
      })

      expect(wrapper.classes()).toContain('text-base')
      expect(wrapper.classes()).toContain('px-4')
      expect(wrapper.find('svg').classes()).toContain('w-5')
      expect(wrapper.find('svg').classes()).toContain('h-5')
    })
  })
})
