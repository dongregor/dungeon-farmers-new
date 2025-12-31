import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import BreadcrumbNav from '~/components/navigation/BreadcrumbNav.vue'

describe('BreadcrumbNav', () => {
  const defaultItems = [
    { label: 'Home', to: '/' },
    { label: 'Heroes', to: '/heroes' },
    { label: 'Sir Lancelot' },
  ]

  describe('Rendering', () => {
    it('should render nav element', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('should render ordered list', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.find('ol').exists()).toBe(true)
    })

    it('should render all items', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.text()).toContain('Home')
      expect(wrapper.text()).toContain('Heroes')
      expect(wrapper.text()).toContain('Sir Lancelot')
    })

    it('should render list items for each breadcrumb', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.findAll('li').length).toBe(3)
    })
  })

  describe('Links', () => {
    it('should render links for items with "to" property (except last)', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBe(2) // Home and Heroes, not Sir Lancelot
    })

    it('should link to correct paths', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].props('to')).toBe('/')
      expect(links[1].props('to')).toBe('/heroes')
    })

    it('should handle route objects', () => {
      const items = [
        { label: 'Home', to: { name: 'index' } },
        { label: 'Heroes', to: { name: 'heroes', params: { type: 'all' } } },
        { label: 'Current' },
      ]

      const wrapper = mount(BreadcrumbNav, {
        props: { items },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].props('to')).toEqual({ name: 'index' })
      expect(links[1].props('to')).toEqual({ name: 'heroes', params: { type: 'all' } })
    })

    it('should not link the last item even if it has "to"', () => {
      const items = [
        { label: 'Home', to: '/' },
        { label: 'Current Page', to: '/current' }, // Has "to" but is last
      ]

      const wrapper = mount(BreadcrumbNav, {
        props: { items },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.length).toBe(1) // Only Home
    })
  })

  describe('Current Page', () => {
    it('should render last item as text (not link)', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const lastLi = wrapper.findAll('li').at(-1)
      expect(lastLi?.findComponent(RouterLinkStub).exists()).toBe(false)
      // Find the span with aria-current (the current page marker)
      expect(lastLi?.find('[aria-current="page"]').text()).toBe('Sir Lancelot')
    })

    it('should mark current page with aria-current', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const currentSpan = wrapper.find('[aria-current="page"]')
      expect(currentSpan.exists()).toBe(true)
      expect(currentSpan.text()).toBe('Sir Lancelot')
    })

    it('should style current page with font-medium', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const currentSpan = wrapper.find('[aria-current="page"]')
      expect(currentSpan.classes()).toContain('font-medium')
    })
  })

  describe('Separators', () => {
    it('should not show separator before first item', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const firstLi = wrapper.findAll('li').at(0)
      // First item should not have a separator SVG before it
      const svgs = firstLi?.findAll('svg')
      expect(svgs?.length || 0).toBe(0)
    })

    it('should show separators between items', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      // Second and third items should have separators
      const separators = wrapper.findAll('svg')
      expect(separators.length).toBe(2) // Between Home-Heroes and Heroes-Sir Lancelot
    })

    it('should hide separators from screen readers', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const separators = wrapper.findAll('[aria-hidden="true"]')
      expect(separators.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have breadcrumb aria-label on nav', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
    })
  })

  describe('Styling', () => {
    it('should have flex layout for list', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.find('ol').classes()).toContain('flex')
    })

    it('should have margin bottom on nav', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.find('nav').classes()).toContain('mb-4')
    })

    it('should have blue link styling', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.classes()).toContain('text-blue-600')
    })

    it('should have hover state on links', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.classes()).toContain('hover:text-blue-800')
      expect(link.classes()).toContain('hover:underline')
    })

    it('should have gray separator color', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: defaultItems },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      const separator = wrapper.find('[aria-hidden="true"]')
      expect(separator.classes()).toContain('text-gray-400')
    })
  })

  describe('Edge Cases', () => {
    it('should handle single item', () => {
      const wrapper = mount(BreadcrumbNav, {
        props: { items: [{ label: 'Home' }] },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.findAll('li').length).toBe(1)
      expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(0)
    })

    it('should handle two items', () => {
      const items = [
        { label: 'Home', to: '/' },
        { label: 'Current' },
      ]

      const wrapper = mount(BreadcrumbNav, {
        props: { items },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(1)
      expect(wrapper.findAll('svg').length).toBe(1) // One separator
    })

    it('should handle many items', () => {
      const items = [
        { label: 'Home', to: '/' },
        { label: 'Category', to: '/category' },
        { label: 'Subcategory', to: '/category/sub' },
        { label: 'Item', to: '/category/sub/item' },
        { label: 'Detail' },
      ]

      const wrapper = mount(BreadcrumbNav, {
        props: { items },
        global: {
          stubs: { NuxtLink: RouterLinkStub },
        },
      })

      expect(wrapper.findAll('li').length).toBe(5)
      expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(4)
      expect(wrapper.findAll('svg').length).toBe(4) // 4 separators
    })
  })
})
