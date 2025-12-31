import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RarityBadge from '~/components/display/RarityBadge.vue'

describe('RarityBadge', () => {
  describe('Rendering', () => {
    it('should render with default size', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'common' },
      })

      expect(wrapper.text()).toBe('Common')
      expect(wrapper.classes()).toContain('text-sm')
    })

    it('should capitalize rarity label', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'legendary' },
      })

      expect(wrapper.text()).toBe('Legendary')
    })

    it('should apply correct color classes for each rarity', () => {
      const rarities = [
        { rarity: 'common', expectedClass: 'bg-gray-500' },
        { rarity: 'uncommon', expectedClass: 'bg-green-600' },
        { rarity: 'rare', expectedClass: 'bg-blue-600' },
        { rarity: 'epic', expectedClass: 'bg-purple-600' },
        { rarity: 'legendary', expectedClass: 'bg-orange-500' },
      ] as const

      rarities.forEach(({ rarity, expectedClass }) => {
        const wrapper = mount(RarityBadge, {
          props: { rarity },
        })
        expect(wrapper.classes()).toContain(expectedClass)
      })
    })

    it('should apply mythic gradient class', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'mythic' },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-r')
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'common', size: 'sm' },
      })

      expect(wrapper.classes()).toContain('text-xs')
      expect(wrapper.classes()).toContain('px-2')
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'common' },
      })

      expect(wrapper.classes()).toContain('text-sm')
      expect(wrapper.classes()).toContain('px-3')
    })

    it('should apply large size classes', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'common', size: 'lg' },
      })

      expect(wrapper.classes()).toContain('text-base')
      expect(wrapper.classes()).toContain('px-4')
    })
  })

  describe('Accessibility', () => {
    it('should render as a span element', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'rare' },
      })

      expect(wrapper.element.tagName).toBe('SPAN')
    })

    it('should have text content for screen readers', () => {
      const wrapper = mount(RarityBadge, {
        props: { rarity: 'epic' },
      })

      expect(wrapper.text()).toBeTruthy()
    })
  })
})
