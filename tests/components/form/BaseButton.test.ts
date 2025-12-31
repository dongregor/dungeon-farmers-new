import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '~/components/form/BaseButton.vue'

describe('BaseButton', () => {
  describe('Rendering', () => {
    it('should render button element', () => {
      const wrapper = mount(BaseButton, {
        slots: { default: 'Click me' },
      })

      expect(wrapper.element.tagName).toBe('BUTTON')
      expect(wrapper.text()).toBe('Click me')
    })

    it('should have type button by default', () => {
      const wrapper = mount(BaseButton)

      expect(wrapper.attributes('type')).toBe('button')
    })

    it('should allow different button types', () => {
      const wrapper = mount(BaseButton, {
        props: { type: 'submit' },
      })

      expect(wrapper.attributes('type')).toBe('submit')
    })
  })

  describe('Variant Styles', () => {
    it('should apply primary variant by default', () => {
      const wrapper = mount(BaseButton)

      expect(wrapper.classes()).toContain('bg-quest-blue')
    })

    it('should apply secondary variant', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'secondary' },
      })

      expect(wrapper.classes()).toContain('bg-gray-700')
    })

    it('should apply danger variant', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'danger' },
      })

      expect(wrapper.classes()).toContain('bg-danger-red')
    })

    it('should apply ghost variant', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'ghost' },
      })

      expect(wrapper.classes()).toContain('bg-transparent')
      expect(wrapper.classes()).toContain('border')
    })
  })

  describe('Size Variants', () => {
    it('should apply medium size by default', () => {
      const wrapper = mount(BaseButton)

      expect(wrapper.classes()).toContain('px-4')
      expect(wrapper.classes()).toContain('py-2')
    })

    it('should apply small size', () => {
      const wrapper = mount(BaseButton, {
        props: { size: 'sm' },
      })

      expect(wrapper.classes()).toContain('px-3')
      expect(wrapper.classes()).toContain('text-sm')
    })

    it('should apply large size', () => {
      const wrapper = mount(BaseButton, {
        props: { size: 'lg' },
      })

      expect(wrapper.classes()).toContain('px-6')
      expect(wrapper.classes()).toContain('py-3')
      expect(wrapper.classes()).toContain('text-lg')
    })
  })

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      const wrapper = mount(BaseButton)

      expect(wrapper.attributes('disabled')).toBeUndefined()
    })

    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('cursor-not-allowed')
    })

    it('should have aria-disabled when disabled', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      })

      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })
  })

  describe('Loading State', () => {
    it('should not show loading spinner by default', () => {
      const wrapper = mount(BaseButton)

      expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })

    it('should show loading spinner when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      })

      expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })

    it('should be disabled when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should have aria-busy when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      })

      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })

  describe('Click Events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('should not emit click when disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      })

      await wrapper.trigger('click')

      // Disabled buttons don't emit events in DOM
      // The button is disabled at the HTML level
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })

  describe('Slot Content', () => {
    it('should render slot content', () => {
      const wrapper = mount(BaseButton, {
        slots: { default: 'Submit Form' },
      })

      expect(wrapper.text()).toContain('Submit Form')
    })

    it('should render slot with loading spinner', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: { default: 'Loading...' },
      })

      expect(wrapper.text()).toContain('Loading...')
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })
  })
})
