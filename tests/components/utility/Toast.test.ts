import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from '~/components/utility/Toast.vue'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render toast with message', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test notification' },
      })

      expect(wrapper.text()).toContain('Test notification')
    })

    it('should have alert role', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test' },
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    })

    it('should render icon', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test' },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })

  describe('Type Variants', () => {
    it('should apply info styling by default', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Info message' },
      })

      const alert = wrapper.find('[role="alert"]')
      expect(alert.classes()).toContain('bg-blue-50')
      expect(alert.classes()).toContain('border-blue-200')
    })

    it('should apply success styling', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Success!', type: 'success' },
      })

      const alert = wrapper.find('[role="alert"]')
      expect(alert.classes()).toContain('bg-green-50')
      expect(alert.classes()).toContain('border-green-200')
    })

    it('should apply error styling', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Error!', type: 'error' },
      })

      const alert = wrapper.find('[role="alert"]')
      expect(alert.classes()).toContain('bg-red-50')
      expect(alert.classes()).toContain('border-red-200')
    })

    it('should apply warning styling', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Warning!', type: 'warning' },
      })

      const alert = wrapper.find('[role="alert"]')
      expect(alert.classes()).toContain('bg-yellow-50')
      expect(alert.classes()).toContain('border-yellow-200')
    })
  })

  describe('Dismissible', () => {
    it('should show close button by default', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test' },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should hide close button when not dismissible', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test', dismissible: false },
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should emit close when dismiss button clicked', async () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test', duration: 0 },
      })

      await wrapper.find('button').trigger('click')

      // Wait for animation timeout
      vi.advanceTimersByTime(300)

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should have accessible dismiss button', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test' },
      })

      expect(wrapper.find('button').attributes('aria-label')).toBe('Dismiss notification')
    })
  })

  describe('Auto-dismiss', () => {
    it('should auto-dismiss after duration', async () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test', duration: 3000 },
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(true)

      vi.advanceTimersByTime(3000)
      await wrapper.vm.$nextTick()

      // Wait for close animation
      vi.advanceTimersByTime(300)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not auto-dismiss when duration is 0', async () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test', duration: 0 },
      })

      vi.advanceTimersByTime(10000)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('should use 3000ms duration by default', async () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test' },
      })

      // Not dismissed before 3000ms
      vi.advanceTimersByTime(2999)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('close')).toBeFalsy()

      // Dismissed at 3000ms
      vi.advanceTimersByTime(1)
      await wrapper.vm.$nextTick()
      vi.advanceTimersByTime(300) // Animation delay
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have aria-live="polite"', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test' },
      })

      expect(wrapper.find('[role="alert"]').attributes('aria-live')).toBe('polite')
    })

    it('should have aria-atomic="true"', () => {
      const wrapper = mount(Toast, {
        props: { message: 'Test' },
      })

      expect(wrapper.find('[role="alert"]').attributes('aria-atomic')).toBe('true')
    })
  })
})
