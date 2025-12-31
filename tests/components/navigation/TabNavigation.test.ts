import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TabNavigation from '~/components/navigation/TabNavigation.vue'

describe('TabNavigation', () => {
  const defaultTabs = [
    { id: 'heroes', label: 'Heroes' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'expeditions', label: 'Expeditions' },
  ]

  describe('Rendering', () => {
    it('should render all tabs', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      expect(wrapper.findAll('button[role="tab"]').length).toBe(3)
    })

    it('should render tab labels', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      expect(wrapper.text()).toContain('Heroes')
      expect(wrapper.text()).toContain('Equipment')
      expect(wrapper.text()).toContain('Expeditions')
    })

    it('should render tab icons when provided', () => {
      const tabs = [
        { id: 'heroes', label: 'Heroes', icon: 'icon-heroes' },
      ]
      const wrapper = mount(TabNavigation, {
        props: { tabs, modelValue: 'heroes' },
      })

      expect(wrapper.find('.icon-heroes').exists()).toBe(true)
    })

    it('should render tab badges when provided', () => {
      const tabs = [
        { id: 'heroes', label: 'Heroes', badge: 5 },
      ]
      const wrapper = mount(TabNavigation, {
        props: { tabs, modelValue: 'heroes' },
      })

      expect(wrapper.text()).toContain('5')
    })

    it('should render string badges', () => {
      const tabs = [
        { id: 'heroes', label: 'Heroes', badge: 'New' },
      ]
      const wrapper = mount(TabNavigation, {
        props: { tabs, modelValue: 'heroes' },
      })

      expect(wrapper.text()).toContain('New')
    })
  })

  describe('Active State', () => {
    it('should mark active tab with aria-selected', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'equipment' },
      })

      const tabs = wrapper.findAll('button[role="tab"]')
      expect(tabs[0].attributes('aria-selected')).toBe('false')
      expect(tabs[1].attributes('aria-selected')).toBe('true')
      expect(tabs[2].attributes('aria-selected')).toBe('false')
    })

    it('should set tabindex 0 on active tab only', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'equipment' },
      })

      const tabs = wrapper.findAll('button[role="tab"]')
      expect(tabs[0].attributes('tabindex')).toBe('-1')
      expect(tabs[1].attributes('tabindex')).toBe('0')
      expect(tabs[2].attributes('tabindex')).toBe('-1')
    })
  })

  describe('Tab Selection', () => {
    it('should emit update:modelValue when tab clicked', async () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      await wrapper.findAll('button[role="tab"]').at(1)?.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['equipment'])
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate right with ArrowRight', async () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      const firstTab = wrapper.findAll('button[role="tab"]').at(0)
      await firstTab?.trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['equipment'])
    })

    it('should navigate left with ArrowLeft', async () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'equipment' },
      })

      const secondTab = wrapper.findAll('button[role="tab"]').at(1)
      await secondTab?.trigger('keydown', { key: 'ArrowLeft' })

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['heroes'])
    })

    it('should wrap around when pressing ArrowRight on last tab', async () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'expeditions' },
      })

      const lastTab = wrapper.findAll('button[role="tab"]').at(2)
      await lastTab?.trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['heroes'])
    })

    it('should wrap around when pressing ArrowLeft on first tab', async () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      const firstTab = wrapper.findAll('button[role="tab"]').at(0)
      await firstTab?.trigger('keydown', { key: 'ArrowLeft' })

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['expeditions'])
    })

    it('should navigate to first tab with Home', async () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'expeditions' },
      })

      const lastTab = wrapper.findAll('button[role="tab"]').at(2)
      await lastTab?.trigger('keydown', { key: 'Home' })

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['heroes'])
    })

    it('should navigate to last tab with End', async () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      const firstTab = wrapper.findAll('button[role="tab"]').at(0)
      await firstTab?.trigger('keydown', { key: 'End' })

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['expeditions'])
    })
  })

  describe('Variants', () => {
    it('should apply default variant classes', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes', variant: 'default' },
      })

      expect(wrapper.find('[role="tablist"]').classes()).toContain('border-b')
    })

    it('should apply pills variant classes', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes', variant: 'pills' },
      })

      expect(wrapper.find('[role="tablist"]').classes()).toContain('bg-gray-100')
      expect(wrapper.find('[role="tablist"]').classes()).toContain('rounded-lg')
    })

    it('should apply underline variant classes', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes', variant: 'underline' },
      })

      expect(wrapper.find('[role="tablist"]').classes()).toContain('border-b')
    })
  })

  describe('Badge Styling', () => {
    it('should style active tab badge differently', () => {
      const tabs = [
        { id: 'heroes', label: 'Heroes', badge: 5 },
        { id: 'equipment', label: 'Equipment', badge: 3 },
      ]
      const wrapper = mount(TabNavigation, {
        props: { tabs, modelValue: 'heroes' },
      })

      const badges = wrapper.findAll('.rounded-full')
      // Active tab badge
      expect(badges[0].classes()).toContain('bg-blue-100')
      expect(badges[0].classes()).toContain('text-blue-700')
      // Inactive tab badge
      expect(badges[1].classes()).toContain('bg-gray-200')
      expect(badges[1].classes()).toContain('text-gray-700')
    })
  })

  describe('Accessibility', () => {
    it('should have tablist role on container', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    })

    it('should have aria-label on tablist', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      expect(wrapper.find('[role="tablist"]').attributes('aria-label')).toBe('Navigation tabs')
    })

    it('should have aria-controls on tabs', () => {
      const wrapper = mount(TabNavigation, {
        props: { tabs: defaultTabs, modelValue: 'heroes' },
      })

      const tab = wrapper.find('button[role="tab"]')
      expect(tab.attributes('aria-controls')).toBe('tabpanel-heroes')
    })

    it('should have aria-label on badges', () => {
      const tabs = [{ id: 'heroes', label: 'Heroes', badge: 5 }]
      const wrapper = mount(TabNavigation, {
        props: { tabs, modelValue: 'heroes' },
      })

      const badge = wrapper.find('.rounded-full')
      expect(badge.attributes('aria-label')).toBe('5 items')
    })
  })
})
