import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '~/components/utility/EmptyState.vue'

describe('EmptyState', () => {
  describe('Rendering', () => {
    it('should render title', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'No items found' },
      })

      expect(wrapper.text()).toContain('No items found')
    })

    it('should render description when provided', () => {
      const wrapper = mount(EmptyState, {
        props: {
          title: 'Empty',
          description: 'Try adding some items',
        },
      })

      expect(wrapper.text()).toContain('Try adding some items')
    })

    it('should not render description when not provided', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'Empty' },
      })

      expect(wrapper.find('p').exists()).toBe(false)
    })
  })

  describe('Slots', () => {
    it('should render icon slot', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'Empty' },
        slots: { icon: '<svg class="custom-icon"></svg>' },
      })

      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })

    it('should render action slot', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'Empty' },
        slots: { action: '<button>Add Item</button>' },
      })

      expect(wrapper.find('button').text()).toBe('Add Item')
    })

    it('should not render icon container when no icon slot', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'Empty' },
      })

      expect(wrapper.find('.text-gray-400').exists()).toBe(false)
    })
  })

  describe('Styling', () => {
    it('should be centered', () => {
      const wrapper = mount(EmptyState, {
        props: { title: 'Empty' },
      })

      expect(wrapper.classes()).toContain('items-center')
      expect(wrapper.classes()).toContain('justify-center')
      expect(wrapper.classes()).toContain('text-center')
    })
  })
})
