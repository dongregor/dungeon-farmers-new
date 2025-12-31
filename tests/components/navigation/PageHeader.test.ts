import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader from '~/components/navigation/PageHeader.vue'

// Mock useRouter
const mockPush = vi.fn()
vi.stubGlobal('useRouter', () => ({
  push: mockPush,
}))

describe('PageHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Title Display', () => {
    it('should render title', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Hero Management' },
      })

      expect(wrapper.text()).toContain('Hero Management')
    })

    it('should render title in h1 element', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Hero Management' },
      })

      expect(wrapper.find('h1').text()).toContain('Hero Management')
    })

    it('should truncate long titles', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Very Long Title That Should Be Truncated' },
      })

      expect(wrapper.find('h1').classes()).toContain('truncate')
    })
  })

  describe('Subtitle Display', () => {
    it('should not render subtitle when not provided', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      expect(wrapper.findAll('p').length).toBe(0)
    })

    it('should render subtitle when provided', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', subtitle: 'A helpful description' },
      })

      expect(wrapper.text()).toContain('A helpful description')
    })

    it('should render subtitle in p element', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', subtitle: 'Description' },
      })

      expect(wrapper.find('p').text()).toBe('Description')
    })
  })

  describe('Back Button', () => {
    it('should not render back button when backLink not provided', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should render back button when backLink is string', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: '/heroes' },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should render back button when backLink is route object', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: { name: 'heroes' } },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should have accessible label on back button', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: '/heroes' },
      })

      expect(wrapper.find('button').attributes('aria-label')).toBe('Go back')
    })

    it('should navigate when back button clicked (string)', async () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: '/heroes' },
      })

      await wrapper.find('button').trigger('click')

      expect(mockPush).toHaveBeenCalledWith('/heroes')
    })

    it('should navigate when back button clicked (route object)', async () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: { name: 'heroes', params: { id: '123' } } },
      })

      await wrapper.find('button').trigger('click')

      expect(mockPush).toHaveBeenCalledWith({ name: 'heroes', params: { id: '123' } })
    })

    it('should render arrow icon in back button', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: '/heroes' },
      })

      expect(wrapper.find('button svg').exists()).toBe(true)
    })
  })

  describe('Slots', () => {
    it('should render meta slot content', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
        slots: { meta: '<span class="meta-content">Status: Active</span>' },
      })

      expect(wrapper.find('.meta-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Status: Active')
    })

    it('should render actions slot content', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
        slots: { actions: '<button class="action-btn">Add Hero</button>' },
      })

      expect(wrapper.find('.action-btn').exists()).toBe(true)
      expect(wrapper.text()).toContain('Add Hero')
    })

    it('should render both slots together', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
        slots: {
          meta: '<span>Meta info</span>',
          actions: '<button>Action</button>',
        },
      })

      expect(wrapper.text()).toContain('Meta info')
      expect(wrapper.text()).toContain('Action')
    })

    it('should not render slot containers when slots empty', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      // With v-if on slot containers, they won't render
      const html = wrapper.html()
      expect(html).not.toContain('mt-3') // meta slot container class
    })
  })

  describe('Layout', () => {
    it('should render header element', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('should have margin bottom on header', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      expect(wrapper.find('header').classes()).toContain('mb-6')
    })

    it('should have flex layout for title and actions', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      const flexContainer = wrapper.find('.flex.items-start')
      expect(flexContainer.exists()).toBe(true)
    })
  })

  describe('Styling', () => {
    it('should have bold title', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      expect(wrapper.find('h1').classes()).toContain('font-bold')
    })

    it('should have gray subtitle text', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', subtitle: 'Subtitle' },
      })

      expect(wrapper.find('p').classes()).toContain('text-gray-600')
    })

    it('should have hover state on back button', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: '/back' },
      })

      expect(wrapper.find('button').classes()).toContain('hover:text-gray-900')
    })

    it('should have responsive text size for title', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title' },
      })

      const h1 = wrapper.find('h1')
      expect(h1.classes()).toContain('text-2xl')
      expect(h1.classes()).toContain('md:text-3xl')
    })
  })

  describe('Accessibility', () => {
    it('should hide icon from screen readers', () => {
      const wrapper = mount(PageHeader, {
        props: { title: 'Title', backLink: '/back' },
      })

      expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    })
  })
})
