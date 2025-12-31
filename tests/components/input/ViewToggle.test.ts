import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ViewToggle from '~/components/input/ViewToggle.vue'

describe('ViewToggle', () => {
  describe('Rendering', () => {
    it('should render two buttons', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(2)
    })

    it('should render grid and list icons', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const svgs = wrapper.findAll('svg')
      expect(svgs.length).toBe(2)
    })

    it('should render in a button group', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const group = wrapper.find('[role="group"]')
      expect(group.exists()).toBe(true)
    })
  })

  describe('Grid View Selection', () => {
    it('should highlight grid button when grid is selected', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].classes()).toContain('bg-blue-600')
      expect(buttons[0].classes()).toContain('text-white')
    })

    it('should not highlight grid button when list is selected', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'list' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].classes()).toContain('bg-white')
      expect(buttons[0].classes()).toContain('text-gray-700')
    })

    it('should emit grid when grid button clicked', async () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'list' },
      })

      const buttons = wrapper.findAll('button')
      await buttons[0].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['grid'])
    })
  })

  describe('List View Selection', () => {
    it('should highlight list button when list is selected', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'list' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[1].classes()).toContain('bg-blue-600')
      expect(buttons[1].classes()).toContain('text-white')
    })

    it('should not highlight list button when grid is selected', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[1].classes()).toContain('bg-white')
      expect(buttons[1].classes()).toContain('text-gray-700')
    })

    it('should emit list when list button clicked', async () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      await buttons[1].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['list'])
    })
  })

  describe('Accessibility', () => {
    it('should have aria-label on button group', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const group = wrapper.find('[role="group"]')
      expect(group.attributes('aria-label')).toBe('View toggle')
    })

    it('should have aria-label on grid button', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('aria-label')).toBe('Grid view')
    })

    it('should have aria-label on list button', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[1].attributes('aria-label')).toBe('List view')
    })

    it('should have aria-pressed=true on selected grid button', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('aria-pressed')).toBe('true')
      expect(buttons[1].attributes('aria-pressed')).toBe('false')
    })

    it('should have aria-pressed=true on selected list button', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'list' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('aria-pressed')).toBe('false')
      expect(buttons[1].attributes('aria-pressed')).toBe('true')
    })

    it('should hide icons from screen readers', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const svgs = wrapper.findAll('svg')
      svgs.forEach(svg => {
        expect(svg.attributes('aria-hidden')).toBe('true')
      })
    })
  })

  describe('Styling', () => {
    it('should have rounded corners on container', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })

    it('should have border on container', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      expect(wrapper.find('.border-gray-300').exists()).toBe(true)
    })

    it('should have overflow hidden on container', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      expect(wrapper.find('.overflow-hidden').exists()).toBe(true)
    })

    it('should have border between buttons', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[1].classes()).toContain('border-l')
    })

    it('should have hover state on unselected button', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[1].classes()).toContain('hover:bg-gray-50')
    })
  })

  describe('Interaction', () => {
    it('should emit even when clicking already selected view', async () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      await buttons[0].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['grid'])
    })

    it('should handle rapid clicks', async () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      await buttons[1].trigger('click')
      await buttons[0].trigger('click')
      await buttons[1].trigger('click')

      const emitted = wrapper.emitted('update:modelValue')!
      expect(emitted.length).toBe(3)
      expect(emitted[0]).toEqual(['list'])
      expect(emitted[1]).toEqual(['grid'])
      expect(emitted[2]).toEqual(['list'])
    })
  })

  describe('Button Sizing', () => {
    it('should have equal padding on buttons', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.classes()).toContain('px-3')
        expect(button.classes()).toContain('py-2')
      })
    })

    it('should have consistent icon size', () => {
      const wrapper = mount(ViewToggle, {
        props: { modelValue: 'grid' },
      })

      const svgs = wrapper.findAll('svg')
      svgs.forEach(svg => {
        expect(svg.classes()).toContain('w-5')
        expect(svg.classes()).toContain('h-5')
      })
    })
  })
})
