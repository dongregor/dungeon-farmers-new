import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CurrencyDisplay from '~/components/economy/CurrencyDisplay.vue'

describe('CurrencyDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Currency Types', () => {
    it('should render gold icon for gold type', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold' },
      })

      expect(wrapper.text()).toContain('🪙')
    })

    it('should render gems icon for gems type', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gems' },
      })

      expect(wrapper.text()).toContain('💎')
    })

    it('should render tokens icon for tokens type', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'tokens' },
      })

      expect(wrapper.text()).toContain('🎫')
    })
  })

  describe('Currency Colors', () => {
    it('should apply yellow color for gold', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold' },
      })

      expect(wrapper.classes()).toContain('text-yellow-600')
    })

    it('should apply purple color for gems', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gems' },
      })

      expect(wrapper.classes()).toContain('text-purple-600')
    })

    it('should apply blue color for tokens', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'tokens' },
      })

      expect(wrapper.classes()).toContain('text-blue-600')
    })
  })

  describe('Amount Formatting', () => {
    it('should display small numbers as-is', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 500, type: 'gold' },
      })

      expect(wrapper.text()).toContain('500')
    })

    it('should format thousands with K suffix', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 5000, type: 'gold' },
      })

      expect(wrapper.text()).toContain('5.0K')
    })

    it('should format millions with M suffix', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 2500000, type: 'gold' },
      })

      expect(wrapper.text()).toContain('2.5M')
    })

    it('should handle zero amount', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 0, type: 'gold' },
      })

      expect(wrapper.text()).toContain('0')
    })

    it('should floor decimal amounts', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 99.7, type: 'gold' },
      })

      expect(wrapper.text()).toContain('99')
    })
  })

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold', size: 'sm' },
      })

      expect(wrapper.classes()).toContain('gap-1')
      expect(wrapper.find('span').classes()).toContain('text-sm')
    })

    it('should apply medium size classes by default', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold' },
      })

      expect(wrapper.classes()).toContain('gap-1.5')
    })

    it('should apply large size classes', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold', size: 'lg' },
      })

      expect(wrapper.classes()).toContain('gap-2')
      expect(wrapper.find('span').classes()).toContain('text-2xl')
    })
  })

  describe('Animation', () => {
    it('should update display immediately when not animated', async () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold', animated: false },
      })

      await wrapper.setProps({ amount: 200 })
      await nextTick()

      expect(wrapper.text()).toContain('200')
    })

    it('should use tabular-nums for consistent number width', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold' },
      })

      const amountSpan = wrapper.findAll('span').at(1)
      expect(amountSpan?.classes()).toContain('tabular-nums')
    })
  })

  describe('Structure', () => {
    it('should render as inline-flex container', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold' },
      })

      expect(wrapper.classes()).toContain('inline-flex')
      expect(wrapper.classes()).toContain('items-center')
    })

    it('should render icon before amount', () => {
      const wrapper = mount(CurrencyDisplay, {
        props: { amount: 100, type: 'gold' },
      })

      const spans = wrapper.findAll('span')
      expect(spans.at(0)?.text()).toContain('🪙')
      expect(spans.at(1)?.text()).toContain('100')
    })
  })
})
