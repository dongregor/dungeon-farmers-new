import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseToggle from '~/components/form/BaseToggle.vue'

describe('BaseToggle', () => {
  describe('Rendering', () => {
    it('should render toggle button', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      expect(wrapper.find('button[role="switch"]').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false, label: 'Dark mode' },
      })

      expect(wrapper.find('label').text()).toBe('Dark mode')
    })

    it('should render description when provided', () => {
      const wrapper = mount(BaseToggle, {
        props: {
          modelValue: false,
          label: 'Notifications',
          description: 'Receive push notifications',
        },
      })

      expect(wrapper.text()).toContain('Receive push notifications')
    })

    it('should not render label area when no label or description', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      expect(wrapper.find('label').exists()).toBe(false)
    })
  })

  describe('Toggle State', () => {
    it('should show off state when modelValue is false', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-gray-600')
      expect(button.attributes('aria-checked')).toBe('false')
    })

    it('should show on state when modelValue is true', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: true },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('bg-success-green')
      expect(button.attributes('aria-checked')).toBe('true')
    })

    it('should move toggle circle when on', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: true },
      })

      const circle = wrapper.find('[aria-hidden="true"]')
      expect(circle.classes()).toContain('translate-x-5')
    })

    it('should not move toggle circle when off', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      const circle = wrapper.find('[aria-hidden="true"]')
      expect(circle.classes()).toContain('translate-x-0')
    })
  })

  describe('Value Binding', () => {
    it('should emit update:modelValue when clicked', async () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    })

    it('should toggle off when clicked while on', async () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: true },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })
  })

  describe('Keyboard Support', () => {
    it('should toggle on Space key', async () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      await wrapper.find('button').trigger('keydown', { key: ' ' })

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    })

    it('should toggle on Enter key', async () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      await wrapper.find('button').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
    })

    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false, disabled: true },
      })

      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('should not emit when clicked while disabled', async () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false, disabled: true },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('should apply disabled styling', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false, disabled: true },
      })

      expect(wrapper.find('button').classes()).toContain('opacity-50')
      expect(wrapper.find('button').classes()).toContain('cursor-not-allowed')
    })
  })

  describe('Accessibility', () => {
    it('should have role="switch"', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      expect(wrapper.find('button').attributes('role')).toBe('switch')
    })

    it('should have aria-checked attribute', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: true },
      })

      expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
    })

    it('should have screen reader text', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false, label: 'Enable feature' },
      })

      expect(wrapper.find('.sr-only').text()).toBe('Enable feature')
    })

    it('should use fallback text when no label', () => {
      const wrapper = mount(BaseToggle, {
        props: { modelValue: false },
      })

      expect(wrapper.find('.sr-only').text()).toBe('Toggle')
    })

    it('should have aria-describedby when description provided', () => {
      const wrapper = mount(BaseToggle, {
        props: {
          modelValue: false,
          label: 'Test',
          description: 'Description text',
        },
      })

      const button = wrapper.find('button')
      const descId = button.attributes('aria-describedby')
      expect(descId).toBeTruthy()

      const descElement = wrapper.find(`#${descId}`)
      expect(descElement.text()).toBe('Description text')
    })
  })
})
