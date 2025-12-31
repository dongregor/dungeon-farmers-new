import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '~/components/AppHeader.vue'

// Mock the game store
const mockGameStore = {
  gold: 1500,
}

// Mock Supabase
const mockSignOut = vi.fn(() => Promise.resolve({ error: null }))
const mockSupabaseClient = {
  auth: {
    signOut: mockSignOut,
  },
}

const mockUser = { value: { id: 'user-1', email: 'test@example.com' } }

// Use stubGlobal for Nuxt auto-imports
vi.stubGlobal('useGameStore', () => mockGameStore)
vi.stubGlobal('useSupabaseClient', () => mockSupabaseClient)
vi.stubGlobal('useSupabaseUser', () => mockUser)
vi.stubGlobal('navigateTo', vi.fn())

describe('AppHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGameStore.gold = 1500
  })

  describe('Rendering', () => {
    it('should display game title', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.text()).toContain('Dungeon Farmers')
    })

    it('should display gold amount', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.text()).toContain('1500 Gold')
    })

    it('should have dark background', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('.bg-gray-800').exists()).toBe(true)
    })

    it('should have border at bottom', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('.border-b.border-gray-700').exists()).toBe(true)
    })
  })

  describe('Gold Display', () => {
    it('should update when gold changes', async () => {
      mockGameStore.gold = 2500

      const wrapper = mount(AppHeader)

      expect(wrapper.text()).toContain('2500 Gold')
    })

    it('should have gold color styling', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('.text-guild-gold').exists()).toBe(true)
    })
  })

  describe('Logout Button', () => {
    it('should show logout button when user is logged in', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.text()).toContain('Logout')
    })

    it('should have hover styling', () => {
      const wrapper = mount(AppHeader)

      const logoutBtn = wrapper.find('button')
      expect(logoutBtn.classes()).toContain('hover:text-white')
    })
  })

  describe('Layout', () => {
    it('should use container with mx-auto', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('.container.mx-auto').exists()).toBe(true)
    })

    it('should use flex layout with justify-between', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('.flex.items-center.justify-between').exists()).toBe(true)
    })
  })

  describe('Title Styling', () => {
    it('should have bold title', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('h1.font-bold').exists()).toBe(true)
    })

    it('should have appropriate text size', () => {
      const wrapper = mount(AppHeader)

      expect(wrapper.find('h1.text-xl').exists()).toBe(true)
    })
  })
})
