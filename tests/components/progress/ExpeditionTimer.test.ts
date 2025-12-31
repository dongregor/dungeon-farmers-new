import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpeditionTimer from '~/components/progress/ExpeditionTimer.vue'

describe('ExpeditionTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render timer component', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.font-mono').exists()).toBe(true)
    })

    it('should show Time Remaining label', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.text()).toContain('Time Remaining')
    })

    it('should display time in HH:MM:SS format', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      // Should show time in HH:MM:SS format
      expect(wrapper.text()).toMatch(/\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('Progress Bar', () => {
    it('should not show progress bar by default', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.bg-blue-500').exists()).toBe(false)
    })

    it('should show progress bar when showProgress is true', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime, showProgress: true, totalDuration: 3600000 },
      })

      expect(wrapper.find('.bg-blue-500').exists()).toBe(true)
    })

    it('should have progress bar inside container', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime, showProgress: true, totalDuration: 3600000 },
      })

      // Progress bar container should have correct styling
      expect(wrapper.find('.bg-gray-200.rounded-full').exists()).toBe(true)
    })
  })

  describe('Timer Completion', () => {
    it('should emit complete event when timer reaches zero', async () => {
      const endTime = Date.now() - 1000 // Past time
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('complete')).toBeTruthy()
    })

    it('should show 00:00:00 when timer is complete', () => {
      const endTime = Date.now() - 1000 // Past time
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.text()).toContain('00:00:00')
    })
  })

  describe('Date Input Types', () => {
    it('should accept Date object', () => {
      const endTime = new Date(Date.now() + 60000)
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.font-mono').exists()).toBe(true)
    })

    it('should accept timestamp number', () => {
      const endTime = Date.now() + 60000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.font-mono').exists()).toBe(true)
    })
  })

  describe('Styling', () => {
    it('should have bold styling for timer display', () => {
      const endTime = Date.now() + 60000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.font-bold').exists()).toBe(true)
    })

    it('should have tabular-nums class for consistent width', () => {
      const endTime = Date.now() + 60000
      const wrapper = mount(ExpeditionTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.tabular-nums').exists()).toBe(true)
    })
  })
})
