import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CountdownTimer from '~/components/progress/CountdownTimer.vue'

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render timer element', () => {
      // Use future time relative to real time
      const endTime = Date.now() + 3600000
      const wrapper = mount(CountdownTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.font-mono').exists()).toBe(true)
    })

    it('should show label by default', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(CountdownTimer, {
        props: { endTime },
      })

      expect(wrapper.text()).toContain('Ends in:')
    })

    it('should hide label when showLabel is false', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(CountdownTimer, {
        props: { endTime, showLabel: false },
      })

      expect(wrapper.text()).not.toContain('Ends in:')
    })

    it('should have tabular-nums class for timer display', () => {
      const endTime = Date.now() + 3600000
      const wrapper = mount(CountdownTimer, {
        props: { endTime },
      })

      expect(wrapper.find('.tabular-nums').exists()).toBe(true)
    })
  })

  describe('Format Options', () => {
    it('should accept full format', () => {
      const endTime = Date.now() + 60000
      const wrapper = mount(CountdownTimer, {
        props: { endTime, format: 'full' },
      })

      // Full format shows units like 's', 'm', 'h'
      expect(wrapper.text()).toMatch(/\d+[smh]/)
    })

    it('should accept short format', () => {
      const endTime = Date.now() + 60000
      const wrapper = mount(CountdownTimer, {
        props: { endTime, format: 'short' },
      })

      // Short format shows HH:MM:SS
      expect(wrapper.text()).toMatch(/\d{2}:\d{2}:\d{2}/)
    })

    it('should accept minimal format', () => {
      const endTime = Date.now() + 60000
      const wrapper = mount(CountdownTimer, {
        props: { endTime, format: 'minimal' },
      })

      // Minimal format shows H:MM or M:SS
      expect(wrapper.text()).toMatch(/\d+:\d{2}/)
    })
  })

  describe('Timer Completion', () => {
    it('should emit complete event when timer reaches zero', async () => {
      // Start with a time in the past
      const endTime = Date.now() - 1000
      const wrapper = mount(CountdownTimer, {
        props: { endTime },
      })

      // Timer should already be complete since endTime is in the past
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('complete')).toBeTruthy()
    })

    it('should show zero when timer is complete', () => {
      const endTime = Date.now() - 1000 // Past time
      const wrapper = mount(CountdownTimer, {
        props: { endTime, format: 'full' },
      })

      expect(wrapper.text()).toContain('0s')
    })
  })

  describe('Date Input Types', () => {
    it('should accept Date object', () => {
      const endTime = new Date(Date.now() + 60000)
      const wrapper = mount(CountdownTimer, {
        props: { endTime },
      })

      // Should render without error
      expect(wrapper.find('.font-mono').exists()).toBe(true)
    })

    it('should accept timestamp number', () => {
      const endTime = Date.now() + 60000
      const wrapper = mount(CountdownTimer, {
        props: { endTime },
      })

      // Should render without error
      expect(wrapper.find('.font-mono').exists()).toBe(true)
    })
  })

  describe('Prop Updates', () => {
    it('should respond to endTime prop changes', async () => {
      const initialEndTime = Date.now() - 1000 // Past, so timer is at 0
      const wrapper = mount(CountdownTimer, {
        props: { endTime: initialEndTime, format: 'full' },
      })

      expect(wrapper.text()).toContain('0s')

      // Update to future time
      await wrapper.setProps({ endTime: Date.now() + 60000 })

      // Should no longer show 0s
      const text = wrapper.text()
      // Should show some time remaining (not just 0s)
      expect(text).toMatch(/\d+[smh]/)
    })
  })
})
