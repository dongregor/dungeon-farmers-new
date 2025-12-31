import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TraitDisplay from '~/components/display/TraitDisplay.vue'

describe('TraitDisplay', () => {
  const baseTrait = { name: 'Test Trait', description: 'A test trait description' }

  describe('Rendering', () => {
    it('should render trait name', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait },
      })

      expect(wrapper.text()).toContain('Test Trait')
    })

    it('should render trait description by default', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait },
      })

      expect(wrapper.text()).toContain('A test trait description')
    })

    it('should hide description in compact mode', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait, compact: true },
      })

      expect(wrapper.text()).not.toContain('A test trait description')
    })

    it('should have title attribute with description in compact mode', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait, compact: true },
      })

      expect(wrapper.attributes('title')).toBe('A test trait description')
    })

    it('should render icon', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })

  describe('Trait Types', () => {
    it('should apply buff styling', () => {
      const trait = { ...baseTrait, type: 'buff' as const }
      const wrapper = mount(TraitDisplay, {
        props: { trait },
      })

      expect(wrapper.classes()).toContain('bg-green-50')
      expect(wrapper.classes()).toContain('border-green-300')
    })

    it('should apply debuff styling', () => {
      const trait = { ...baseTrait, type: 'debuff' as const }
      const wrapper = mount(TraitDisplay, {
        props: { trait },
      })

      expect(wrapper.classes()).toContain('bg-red-50')
      expect(wrapper.classes()).toContain('border-red-300')
    })

    it('should apply neutral styling by default', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait },
      })

      expect(wrapper.classes()).toContain('bg-blue-50')
      expect(wrapper.classes()).toContain('border-blue-300')
    })

    it('should show plus icon for buff', () => {
      const trait = { ...baseTrait, type: 'buff' as const }
      const wrapper = mount(TraitDisplay, {
        props: { trait },
      })

      // Buff shows plus icon with path "M12 5v14M5 12h14"
      expect(wrapper.find('svg path[d="M12 5v14M5 12h14"]').exists()).toBe(true)
    })

    it('should show minus icon for debuff', () => {
      const trait = { ...baseTrait, type: 'debuff' as const }
      const wrapper = mount(TraitDisplay, {
        props: { trait },
      })

      // Debuff shows minus icon with path "M5 12h14"
      expect(wrapper.find('svg path[d="M5 12h14"]').exists()).toBe(true)
    })
  })

  describe('Active State', () => {
    it('should be active by default', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait },
      })

      expect(wrapper.classes()).not.toContain('opacity-60')
    })

    it('should apply inactive styling when not active', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait, active: false },
      })

      expect(wrapper.classes()).toContain('opacity-60')
      expect(wrapper.classes()).toContain('bg-gray-100')
      expect(wrapper.classes()).toContain('text-gray-500')
    })
  })

  describe('Compact Mode', () => {
    it('should have smaller padding in compact mode', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait, compact: true },
      })

      expect(wrapper.classes()).toContain('py-1')
    })

    it('should not have compact padding by default', () => {
      const wrapper = mount(TraitDisplay, {
        props: { trait: baseTrait },
      })

      expect(wrapper.classes()).not.toContain('py-1')
    })
  })
})
