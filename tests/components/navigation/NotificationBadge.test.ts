import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationBadge from '~/components/navigation/NotificationBadge.vue'

describe('NotificationBadge', () => {
  describe('Visibility', () => {
    it('should not render when count is 0', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 0 },
      })

      expect(wrapper.find('span').exists()).toBe(false)
    })

    it('should render when count is greater than 0', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should render when count is 1', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 1 },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe('Count Display', () => {
    it('should display the count', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.text()).toBe('5')
    })

    it('should display single digit count', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 3 },
      })

      expect(wrapper.text()).toBe('3')
    })

    it('should display double digit count', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 42 },
      })

      expect(wrapper.text()).toBe('42')
    })

    it('should display max count with plus when exceeded', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 150 },
      })

      expect(wrapper.text()).toBe('99+')
    })

    it('should display exact count when at max', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 99 },
      })

      expect(wrapper.text()).toBe('99')
    })

    it('should use custom max value', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 15, max: 10 },
      })

      expect(wrapper.text()).toBe('10+')
    })

    it('should display exact count when at custom max', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 10, max: 10 },
      })

      expect(wrapper.text()).toBe('10')
    })
  })

  describe('Variants', () => {
    it('should use primary variant by default', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('bg-blue-600')
      expect(wrapper.find('span').classes()).toContain('text-white')
    })

    it('should apply danger variant styling', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5, variant: 'danger' },
      })

      expect(wrapper.find('span').classes()).toContain('bg-red-600')
      expect(wrapper.find('span').classes()).toContain('text-white')
    })

    it('should apply warning variant styling', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5, variant: 'warning' },
      })

      expect(wrapper.find('span').classes()).toContain('bg-yellow-500')
      expect(wrapper.find('span').classes()).toContain('text-gray-900')
    })
  })

  describe('Pulse Animation', () => {
    it('should not have pulse animation by default', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).not.toContain('animate-pulse')
    })

    it('should have pulse animation when enabled', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5, pulse: true },
      })

      expect(wrapper.find('span').classes()).toContain('animate-pulse')
    })

    it('should not pulse when pulse is false', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5, pulse: false },
      })

      expect(wrapper.find('span').classes()).not.toContain('animate-pulse')
    })
  })

  describe('Accessibility', () => {
    it('should have aria-label describing notification count', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').attributes('aria-label')).toBe('5 notifications')
    })

    it('should have correct aria-label for count 1', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 1 },
      })

      expect(wrapper.find('span').attributes('aria-label')).toBe('1 notifications')
    })

    it('should have aria-label with actual count when exceeding max', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 150 },
      })

      // aria-label shows actual count, not truncated
      expect(wrapper.find('span').attributes('aria-label')).toBe('150 notifications')
    })
  })

  describe('Styling', () => {
    it('should have rounded-full for circular badge', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('rounded-full')
    })

    it('should have inline-flex for proper alignment', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('inline-flex')
    })

    it('should have centered content', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('items-center')
      expect(wrapper.find('span').classes()).toContain('justify-center')
    })

    it('should have minimum width', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('min-w-[1.25rem]')
    })

    it('should have fixed height', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('h-5')
    })

    it('should have horizontal padding', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('px-1.5')
    })

    it('should have small text size', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('text-xs')
    })

    it('should have semibold font weight', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5 },
      })

      expect(wrapper.find('span').classes()).toContain('font-semibold')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 9999 },
      })

      expect(wrapper.text()).toBe('99+')
    })

    it('should handle max of 1', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 5, max: 1 },
      })

      expect(wrapper.text()).toBe('1+')
    })

    it('should handle negative counts as hidden', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: -5 },
      })

      // v-if="count > 0" means negative counts won't show
      expect(wrapper.find('span').exists()).toBe(false)
    })
  })

  describe('Combination of Props', () => {
    it('should handle danger variant with pulse', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 10, variant: 'danger', pulse: true },
      })

      expect(wrapper.find('span').classes()).toContain('bg-red-600')
      expect(wrapper.find('span').classes()).toContain('animate-pulse')
    })

    it('should handle warning variant with custom max', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 50, variant: 'warning', max: 25 },
      })

      expect(wrapper.text()).toBe('25+')
      expect(wrapper.find('span').classes()).toContain('bg-yellow-500')
    })

    it('should handle all props together', () => {
      const wrapper = mount(NotificationBadge, {
        props: { count: 100, max: 50, variant: 'danger', pulse: true },
      })

      expect(wrapper.text()).toBe('50+')
      expect(wrapper.find('span').classes()).toContain('bg-red-600')
      expect(wrapper.find('span').classes()).toContain('animate-pulse')
      expect(wrapper.find('span').attributes('aria-label')).toBe('100 notifications')
    })
  })
})
