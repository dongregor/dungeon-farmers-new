import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelect from '~/components/form/BaseSelect.vue'

describe('BaseSelect', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  describe('Rendering', () => {
    it('should render select element', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions },
      })

      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('should render all options', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions },
      })

      const options = wrapper.findAll('option')
      expect(options.length).toBe(3)
    })

    it('should render option labels', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions },
      })

      expect(wrapper.text()).toContain('Option 1')
      expect(wrapper.text()).toContain('Option 2')
      expect(wrapper.text()).toContain('Option 3')
    })

    it('should render placeholder option when provided', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: '', options: defaultOptions, placeholder: 'Select an option' },
      })

      expect(wrapper.text()).toContain('Select an option')
      const options = wrapper.findAll('option')
      expect(options.length).toBe(4) // placeholder + 3 options
    })

    it('should render label when provided', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, label: 'Choose Type' },
      })

      expect(wrapper.find('label').text()).toContain('Choose Type')
    })

    it('should show required indicator when required', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, label: 'Type', required: true },
      })

      expect(wrapper.text()).toContain('*')
    })
  })

  describe('Selection', () => {
    it('should emit update:modelValue when option selected', async () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions },
      })

      await wrapper.find('select').setValue('option2')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option2'])
    })

    it('should handle numeric values', async () => {
      const options = [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' },
      ]
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 1, options },
      })

      await wrapper.find('select').setValue('2')

      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])
    })
  })

  describe('Disabled State', () => {
    it('should disable select when disabled prop is true', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, disabled: true },
      })

      expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    })

    it('should apply disabled styling', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, disabled: true },
      })

      expect(wrapper.find('select').classes()).toContain('opacity-50')
      expect(wrapper.find('select').classes()).toContain('cursor-not-allowed')
    })

    it('should disable individual options when option.disabled is true', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2', disabled: true },
      ]
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options },
      })

      const disabledOption = wrapper.findAll('option').at(1)
      expect(disabledOption?.attributes('disabled')).toBeDefined()
    })
  })

  describe('Error State', () => {
    it('should render error message when error prop is provided', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, error: 'Please select an option' },
      })

      expect(wrapper.text()).toContain('Please select an option')
    })

    it('should apply error styling to select', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, error: 'Error message' },
      })

      expect(wrapper.find('select').classes()).toContain('border-danger-red')
    })

    it('should set aria-invalid when error exists', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, error: 'Error' },
      })

      expect(wrapper.find('select').attributes('aria-invalid')).toBe('true')
    })

    it('should link error message with aria-describedby', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, error: 'Error', id: 'test-select' },
      })

      expect(wrapper.find('select').attributes('aria-describedby')).toBe('test-select-error')
      expect(wrapper.find('[role="alert"]').attributes('id')).toBe('test-select-error')
    })
  })

  describe('Custom ID', () => {
    it('should use custom id when provided', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, id: 'custom-select' },
      })

      expect(wrapper.find('select').attributes('id')).toBe('custom-select')
    })

    it('should link label with select via for attribute', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, id: 'custom-select', label: 'Type' },
      })

      expect(wrapper.find('label').attributes('for')).toBe('custom-select')
    })
  })

  describe('Required Attribute', () => {
    it('should set required attribute when required', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, required: true },
      })

      expect(wrapper.find('select').attributes('required')).toBeDefined()
    })
  })

  describe('Styling', () => {
    it('should have base styling classes', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions },
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('w-full')
      expect(select.classes()).toContain('rounded-lg')
      expect(select.classes()).toContain('bg-gray-800')
    })

    it('should render dropdown arrow', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have aria-label on required indicator', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, label: 'Type', required: true },
      })

      const indicator = wrapper.find('[aria-label="required"]')
      expect(indicator.exists()).toBe(true)
    })

    it('should have role alert on error message', () => {
      const wrapper = mount(BaseSelect, {
        props: { modelValue: 'option1', options: defaultOptions, error: 'Error' },
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    })
  })
})
