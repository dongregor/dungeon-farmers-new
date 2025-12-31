import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import AppNav from '~/components/AppNav.vue'

describe('AppNav', () => {
  const mountNav = () => {
    return mount(AppNav, {
      global: {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
      },
    })
  }

  describe('Rendering', () => {
    it('should render navigation element', () => {
      const wrapper = mountNav()

      expect(wrapper.find('nav').exists()).toBe(true)
    })

    it('should be fixed at bottom', () => {
      const wrapper = mountNav()

      expect(wrapper.find('nav.fixed.bottom-0').exists()).toBe(true)
    })

    it('should span full width', () => {
      const wrapper = mountNav()

      expect(wrapper.find('nav.left-0.right-0').exists()).toBe(true)
    })

    it('should have dark background', () => {
      const wrapper = mountNav()

      expect(wrapper.find('.bg-gray-800').exists()).toBe(true)
    })

    it('should have top border', () => {
      const wrapper = mountNav()

      expect(wrapper.find('.border-t.border-gray-700').exists()).toBe(true)
    })
  })

  describe('Navigation Links', () => {
    it('should have Heroes link', () => {
      const wrapper = mountNav()

      expect(wrapper.text()).toContain('Heroes')
      expect(wrapper.text()).toContain('⚔️')
    })

    it('should have Expeditions link', () => {
      const wrapper = mountNav()

      expect(wrapper.text()).toContain('Expeditions')
      expect(wrapper.text()).toContain('🗺️')
    })

    it('should have Inventory link', () => {
      const wrapper = mountNav()

      expect(wrapper.text()).toContain('Inventory')
      expect(wrapper.text()).toContain('🎒')
    })

    it('should link Heroes to root path', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      const heroesLink = links.find(link => link.text().includes('Heroes'))

      expect(heroesLink?.props('to')).toBe('/')
    })

    it('should link Expeditions to /expeditions', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      const expeditionsLink = links.find(link => link.text().includes('Expeditions'))

      expect(expeditionsLink?.props('to')).toBe('/expeditions')
    })

    it('should link Inventory to /inventory', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      const inventoryLink = links.find(link => link.text().includes('Inventory'))

      expect(inventoryLink?.props('to')).toBe('/inventory')
    })
  })

  describe('Link Styling', () => {
    it('should have flex column layout for links', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].classes()).toContain('flex')
      expect(links[0].classes()).toContain('flex-col')
    })

    it('should have centered items', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].classes()).toContain('items-center')
    })

    it('should have padding', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].classes()).toContain('p-2')
    })

    it('should have gray text color', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].classes()).toContain('text-gray-400')
    })

    it('should have hover state', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].classes()).toContain('hover:text-guild-gold')
    })

    it('should have active class', () => {
      const wrapper = mountNav()

      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links[0].attributes('active-class')).toBe('text-guild-gold')
    })
  })

  describe('Icon Styling', () => {
    it('should have large icons', () => {
      const wrapper = mountNav()

      expect(wrapper.find('.text-2xl').exists()).toBe(true)
    })

    it('should have small label text', () => {
      const wrapper = mountNav()

      expect(wrapper.find('.text-xs').exists()).toBe(true)
    })
  })

  describe('Layout', () => {
    it('should use container with mx-auto', () => {
      const wrapper = mountNav()

      expect(wrapper.find('.container.mx-auto').exists()).toBe(true)
    })

    it('should use flex with justify-around', () => {
      const wrapper = mountNav()

      expect(wrapper.find('.flex.justify-around').exists()).toBe(true)
    })

    it('should have vertical padding', () => {
      const wrapper = mountNav()

      expect(wrapper.find('.py-2').exists()).toBe(true)
    })
  })
})
