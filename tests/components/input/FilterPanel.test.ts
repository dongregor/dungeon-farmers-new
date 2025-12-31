import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterPanel from '~/components/input/FilterPanel.vue'

describe('FilterPanel', () => {
  const checkboxFilters = [
    {
      id: 'rarity',
      label: 'Rarity',
      type: 'checkbox' as const,
      options: [
        { value: 'common', label: 'Common' },
        { value: 'rare', label: 'Rare' },
        { value: 'epic', label: 'Epic' },
      ],
    },
  ]

  const radioFilters = [
    {
      id: 'status',
      label: 'Status',
      type: 'radio' as const,
      options: [
        { value: 'idle', label: 'Idle' },
        { value: 'busy', label: 'Busy' },
      ],
    },
  ]

  const selectFilters = [
    {
      id: 'archetype',
      label: 'Archetype',
      type: 'select' as const,
      options: [
        { value: 'tank', label: 'Tank' },
        { value: 'healer', label: 'Healer' },
        { value: 'dps', label: 'DPS' },
      ],
    },
  ]

  const toggleFilters = [
    {
      id: 'showEquipped',
      label: 'Show Equipped Only',
      type: 'toggle' as const,
    },
  ]

  describe('Rendering', () => {
    it('should render header with Filters title', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.text()).toContain('Filters')
    })

    it('should render filter labels', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.text()).toContain('Rarity')
    })

    it('should render checkbox options', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.text()).toContain('Common')
      expect(wrapper.text()).toContain('Rare')
      expect(wrapper.text()).toContain('Epic')
    })

    it('should render radio options', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: radioFilters, modelValue: {} },
      })

      expect(wrapper.text()).toContain('Idle')
      expect(wrapper.text()).toContain('Busy')
    })

    it('should render select dropdown', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: selectFilters, modelValue: {} },
      })

      const select = wrapper.find('select')
      expect(select.exists()).toBe(true)
      expect(wrapper.text()).toContain('Tank')
      expect(wrapper.text()).toContain('Healer')
    })

    it('should render toggle switch', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: toggleFilters, modelValue: {} },
      })

      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.exists()).toBe(true)
    })
  })

  describe('Active Filter Count', () => {
    it('should not show count badge when no filters active', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.find('.bg-blue-100').exists()).toBe(false)
    })

    it('should show count badge when filters active', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: { rarity: ['common'] },
        },
      })

      expect(wrapper.find('.bg-blue-100').exists()).toBe(true)
      expect(wrapper.find('.bg-blue-100').text()).toBe('1')
    })

    it('should count multiple filter groups', () => {
      const filters = [...checkboxFilters, ...radioFilters]
      const wrapper = mount(FilterPanel, {
        props: {
          filters,
          modelValue: { rarity: ['common'], status: 'idle' },
        },
      })

      expect(wrapper.find('.bg-blue-100').text()).toBe('2')
    })

    it('should not count empty arrays', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: { rarity: [] },
        },
      })

      expect(wrapper.find('.bg-blue-100').exists()).toBe(false)
    })
  })

  describe('Clear All', () => {
    it('should not show clear all when no filters active', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.text()).not.toContain('Clear All')
    })

    it('should show clear all when filters active', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: { rarity: ['common'] },
        },
      })

      expect(wrapper.text()).toContain('Clear All')
    })

    it('should emit empty object when clear all clicked', async () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: { rarity: ['common', 'rare'] },
        },
      })

      const clearButton = wrapper.find('button.text-blue-600')
      await clearButton.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{}])
    })
  })

  describe('Checkbox Interactions', () => {
    it('should toggle checkbox selection', async () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ rarity: ['common'] }])
    })

    it('should add to existing checkbox selection', async () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: { rarity: ['common'] },
        },
      })

      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      await checkboxes[1].setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ rarity: ['common', 'rare'] }])
    })

    it('should remove from checkbox selection', async () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: { rarity: ['common', 'rare'] },
        },
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setValue(false)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ rarity: ['rare'] }])
    })

    it('should show checkbox as checked when in model', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: { rarity: ['common'] },
        },
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect((checkbox.element as HTMLInputElement).checked).toBe(true)
    })
  })

  describe('Radio Interactions', () => {
    it('should select radio option', async () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: radioFilters, modelValue: {} },
      })

      const radio = wrapper.find('input[type="radio"]')
      await radio.setValue(true)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ status: 'idle' }])
    })

    it('should show radio as checked when in model', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: radioFilters,
          modelValue: { status: 'idle' },
        },
      })

      const radio = wrapper.find('input[type="radio"]')
      expect((radio.element as HTMLInputElement).checked).toBe(true)
    })
  })

  describe('Select Interactions', () => {
    it('should update on select change', async () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: selectFilters, modelValue: {} },
      })

      const select = wrapper.find('select')
      await select.setValue('tank')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ archetype: 'tank' }])
    })

    it('should clear on empty select', async () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: selectFilters,
          modelValue: { archetype: 'tank' },
        },
      })

      const select = wrapper.find('select')
      await select.setValue('')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{}])
    })

    it('should have All option as default', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: selectFilters, modelValue: {} },
      })

      const options = wrapper.findAll('select option')
      expect(options[0].text()).toBe('All')
    })
  })

  describe('Toggle Interactions', () => {
    it('should toggle on click', async () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: toggleFilters, modelValue: {} },
      })

      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ showEquipped: true }])
    })

    it('should toggle off on second click', async () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: toggleFilters,
          modelValue: { showEquipped: true },
        },
      })

      const toggle = wrapper.find('[role="switch"]')
      await toggle.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      // Component keeps false value in the object (doesn't delete the key)
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([{ showEquipped: false }])
    })

    it('should show active state when on', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: toggleFilters,
          modelValue: { showEquipped: true },
        },
      })

      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.classes()).toContain('bg-blue-600')
    })

    it('should have aria-checked attribute', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: toggleFilters,
          modelValue: { showEquipped: true },
        },
      })

      const toggle = wrapper.find('[role="switch"]')
      expect(toggle.attributes('aria-checked')).toBe('true')
    })
  })

  describe('Collapsible Behavior', () => {
    it('should show collapse button when collapsible', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: {},
          collapsible: true,
        },
      })

      const collapseButton = wrapper.find('[aria-label="Collapse filters"]')
      expect(collapseButton.exists()).toBe(true)
    })

    it('should not show collapse button when not collapsible', () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: {},
          collapsible: false,
        },
      })

      const collapseButton = wrapper.find('[aria-label="Collapse filters"]')
      expect(collapseButton.exists()).toBe(false)
    })

    it('should toggle aria-expanded on collapse', async () => {
      const wrapper = mount(FilterPanel, {
        props: {
          filters: checkboxFilters,
          modelValue: {},
          collapsible: true,
        },
      })

      const collapseButton = wrapper.find('[aria-expanded]')
      expect(collapseButton.attributes('aria-expanded')).toBe('true')

      await collapseButton.trigger('click')
      expect(collapseButton.attributes('aria-expanded')).toBe('false')
    })
  })

  describe('Styling', () => {
    it('should have white background', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('should have rounded corners', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })

    it('should have border', () => {
      const wrapper = mount(FilterPanel, {
        props: { filters: checkboxFilters, modelValue: {} },
      })

      expect(wrapper.find('.border-gray-200').exists()).toBe(true)
    })
  })

  describe('Multiple Filter Types', () => {
    it('should render all filter types together', () => {
      const allFilters = [
        ...checkboxFilters,
        ...radioFilters,
        ...selectFilters,
        ...toggleFilters,
      ]

      const wrapper = mount(FilterPanel, {
        props: { filters: allFilters, modelValue: {} },
      })

      expect(wrapper.findAll('input[type="checkbox"]').length).toBe(3)
      expect(wrapper.findAll('input[type="radio"]').length).toBe(2)
      expect(wrapper.findAll('select').length).toBe(1)
      expect(wrapper.findAll('[role="switch"]').length).toBe(1)
    })
  })
})
