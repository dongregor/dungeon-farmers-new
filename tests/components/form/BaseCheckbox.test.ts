import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCheckbox from '~/components/form/BaseCheckbox.vue'

describe('BaseCheckbox', () => {
  describe('Rendering', () => {
    it('should render checkbox input', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false },
      })

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Accept terms' },
      })

      expect(wrapper.find('label').text()).toBe('Accept terms')
    })

    it('should render description when provided', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Newsletter',
          description: 'Get weekly updates',
        },
      })

      expect(wrapper.text()).toContain('Get weekly updates')
    })

    it('should not render label area when no label or description', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false },
      })

      expect(wrapper.find('label').exists()).toBe(false)
    })
  })

  describe('Value Binding', () => {
    it('should be checked when modelValue is true', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: true },
      })

      expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
    })

    it('should be unchecked when modelValue is false', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false },
      })

      expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
    })

    it('should emit update:modelValue when clicked', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false },
      })

      await wrapper.find('input').setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    })

    it('should emit false when unchecked', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: true },
      })

      await wrapper.find('input').setValue(false)

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })
  })

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false },
      })

      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
    })

    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false, disabled: true },
      })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('should apply disabled styling to label', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Test', disabled: true },
      })

      expect(wrapper.find('label').classes()).toContain('opacity-50')
      expect(wrapper.find('label').classes()).toContain('cursor-not-allowed')
    })
  })

  describe('Accessibility', () => {
    it('should link label to checkbox', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Test' },
      })

      const label = wrapper.find('label')
      const input = wrapper.find('input')

      expect(label.attributes('for')).toBe(input.attributes('id'))
    })

    it('should have aria-describedby when description provided', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Test',
          description: 'Description text',
        },
      })

      const input = wrapper.find('input')
      const descId = input.attributes('aria-describedby')
      expect(descId).toBeTruthy()

      const descElement = wrapper.find(`#${descId}`)
      expect(descElement.text()).toBe('Description text')
    })

    it('should not have aria-describedby when no description', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Test' },
      })

      expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()
    })

    it('should use provided id', () => {
      const wrapper = mount(BaseCheckbox, {
        props: { modelValue: false, id: 'custom-id' },
      })

      expect(wrapper.find('input').attributes('id')).toBe('custom-id')
    })
  })
})
