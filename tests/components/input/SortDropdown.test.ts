import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SortDropdown from '~/components/input/SortDropdown.vue'

describe('SortDropdown', () => {
  const defaultOptions = [
    { value: 'name', label: 'Name' },
    { value: 'level', label: 'Level' },
    { value: 'power', label: 'Power' },
    { value: 'rarity', label: 'Rarity' },
  ]

  describe('Rendering', () => {
    it('should render select element', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('should render all options', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const options = wrapper.findAll('option')
      expect(options.length).toBe(4)
      expect(options[0].text()).toBe('Name')
      expect(options[1].text()).toBe('Level')
      expect(options[2].text()).toBe('Power')
      expect(options[3].text()).toBe('Rarity')
    })

    it('should render direction toggle button', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(1)
    })

    it('should show current value as selected', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'power',
        },
      })

      const select = wrapper.find('select')
      expect((select.element as HTMLSelectElement).value).toBe('power')
    })
  })

  describe('Sort Selection', () => {
    it('should emit update:modelValue on selection change', async () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const select = wrapper.find('select')
      await select.setValue('level')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['level'])
    })

    it('should emit correct value for each option', async () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const select = wrapper.find('select')

      await select.setValue('power')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['power'])

      await select.setValue('rarity')
      expect(wrapper.emitted('update:modelValue')![1]).toEqual(['rarity'])
    })
  })

  describe('Direction Toggle', () => {
    it('should default to ascending direction', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Sort ascending')
    })

    it('should show descending when direction is desc', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
          direction: 'desc',
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Sort descending')
    })

    it('should emit update:direction when toggle clicked', async () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
          direction: 'asc',
        },
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('update:direction')).toBeTruthy()
      expect(wrapper.emitted('update:direction')![0]).toEqual(['desc'])
    })

    it('should toggle from desc to asc', async () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
          direction: 'desc',
        },
      })

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(wrapper.emitted('update:direction')![0]).toEqual(['asc'])
    })
  })

  describe('Direction Icons', () => {
    it('should show ascending icon when direction is asc', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
          direction: 'asc',
        },
      })

      const button = wrapper.find('button')
      const svgs = button.findAll('svg')
      // Should have one SVG (ascending icon)
      expect(svgs.length).toBe(1)
    })

    it('should show descending icon when direction is desc', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
          direction: 'desc',
        },
      })

      const button = wrapper.find('button')
      const svg = button.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it('should hide icons from screen readers', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const svgs = wrapper.findAll('svg[aria-hidden="true"]')
      expect(svgs.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have aria-label on select', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const select = wrapper.find('select')
      expect(select.attributes('aria-label')).toBe('Sort by')
    })

    it('should have aria-label on direction button', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBeTruthy()
    })
  })

  describe('Styling', () => {
    it('should have flex layout', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      expect(wrapper.find('.flex.items-center').exists()).toBe(true)
    })

    it('should have rounded corners on select', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('rounded-lg')
    })

    it('should have rounded corners on button', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const button = wrapper.find('button')
      expect(button.classes()).toContain('rounded-lg')
    })

    it('should have border on select', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: defaultOptions,
          modelValue: 'name',
        },
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('border-gray-300')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: [],
          modelValue: '',
        },
      })

      const options = wrapper.findAll('option')
      expect(options.length).toBe(0)
    })

    it('should handle single option', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: [{ value: 'name', label: 'Name' }],
          modelValue: 'name',
        },
      })

      const options = wrapper.findAll('option')
      expect(options.length).toBe(1)
    })

    it('should handle option with long label', () => {
      const wrapper = mount(SortDropdown, {
        props: {
          options: [
            { value: 'long', label: 'This is a very long label for sorting' },
          ],
          modelValue: 'long',
        },
      })

      expect(wrapper.text()).toContain('This is a very long label for sorting')
    })
  })
})
