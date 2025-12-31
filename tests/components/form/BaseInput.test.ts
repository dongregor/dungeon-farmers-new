import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '~/components/form/BaseInput.vue'

describe('BaseInput', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should render label when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', label: 'Email' },
      })

      expect(wrapper.find('label').text()).toContain('Email')
    })

    it('should show required indicator when required', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', label: 'Name', required: true },
      })

      expect(wrapper.find('.text-danger-red').text()).toBe('*')
    })

    it('should apply placeholder', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', placeholder: 'Enter text...' },
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text...')
    })
  })

  describe('Input Types', () => {
    it('should default to text type', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should apply custom type', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', type: 'password' },
      })

      expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('should support number type', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 42, type: 'number' },
      })

      expect(wrapper.find('input').attributes('type')).toBe('number')
    })
  })

  describe('Value Binding', () => {
    it('should display modelValue', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 'test value' },
      })

      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('test value')
    })

    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })

      await wrapper.find('input').setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
    })
  })

  describe('Disabled State', () => {
    it('should not be disabled by default', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
    })

    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', disabled: true },
      })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })
  })

  describe('Error State', () => {
    it('should not show error by default', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('should show error message when error prop provided', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', error: 'This field is required' },
      })

      expect(wrapper.find('[role="alert"]').text()).toBe('This field is required')
    })

    it('should have aria-invalid when error exists', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', error: 'Error' },
      })

      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    })
  })

  describe('Hint Text', () => {
    it('should show hint when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', hint: 'Enter your email address' },
      })

      expect(wrapper.text()).toContain('Enter your email address')
    })

    it('should hide hint when error is shown', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          hint: 'Hint text',
          error: 'Error message',
        },
      })

      expect(wrapper.text()).not.toContain('Hint text')
      expect(wrapper.text()).toContain('Error message')
    })
  })

  describe('Accessibility', () => {
    it('should link label to input', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', label: 'Username' },
      })

      const label = wrapper.find('label')
      const input = wrapper.find('input')

      expect(label.attributes('for')).toBe(input.attributes('id'))
    })

    it('should have aria-describedby for error', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '', error: 'Error' },
      })

      const input = wrapper.find('input')
      const errorId = wrapper.find('[role="alert"]').attributes('id')

      expect(input.attributes('aria-describedby')).toBe(errorId)
    })
  })
})
