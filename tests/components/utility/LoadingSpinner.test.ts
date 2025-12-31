import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '~/components/utility/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('should render spinner element', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })

    it('should be a div element', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should have rounded-full class', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.classes()).toContain('rounded-full')
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(LoadingSpinner, {
        props: { size: 'sm' },
      })

      expect(wrapper.classes()).toContain('h-4')
      expect(wrapper.classes()).toContain('w-4')
      expect(wrapper.classes()).toContain('border-2')
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.classes()).toContain('h-8')
      expect(wrapper.classes()).toContain('w-8')
      expect(wrapper.classes()).toContain('border-4')
    })

    it('should apply large size classes', () => {
      const wrapper = mount(LoadingSpinner, {
        props: { size: 'lg' },
      })

      expect(wrapper.classes()).toContain('h-12')
      expect(wrapper.classes()).toContain('w-12')
      expect(wrapper.classes()).toContain('border-4')
    })
  })

  describe('Color Variants', () => {
    const colors = [
      { color: 'blue', expectedClass: 'border-blue-500' },
      { color: 'green', expectedClass: 'border-green-500' },
      { color: 'purple', expectedClass: 'border-purple-500' },
      { color: 'yellow', expectedClass: 'border-yellow-500' },
      { color: 'red', expectedClass: 'border-red-500' },
      { color: 'orange', expectedClass: 'border-orange-500' },
      { color: 'white', expectedClass: 'border-white' },
    ] as const

    colors.forEach(({ color, expectedClass }) => {
      it(`should apply ${color} color class`, () => {
        const wrapper = mount(LoadingSpinner, {
          props: { color },
        })

        expect(wrapper.classes()).toContain(expectedClass)
      })
    })

    it('should apply blue color by default', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.classes()).toContain('border-blue-500')
    })

    it('should have transparent top border for spinner effect', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.classes()).toContain('border-t-transparent')
    })
  })

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.attributes('role')).toBe('status')
    })

    it('should have aria-live="polite"', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.attributes('aria-live')).toBe('polite')
    })

    it('should have aria-label', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.attributes('aria-label')).toBe('Loading')
    })

    it('should have screen reader text', () => {
      const wrapper = mount(LoadingSpinner)

      expect(wrapper.find('.sr-only').text()).toBe('Loading...')
    })
  })
})
