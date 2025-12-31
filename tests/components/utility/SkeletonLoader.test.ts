import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonLoader from '~/components/utility/SkeletonLoader.vue'

describe('SkeletonLoader', () => {
  describe('Text Variant', () => {
    it('should render text variant by default', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.findAll('.h-4').length).toBeGreaterThan(0)
    })

    it('should render default 3 lines for text variant', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'text' },
      })

      expect(wrapper.findAll('.h-4').length).toBe(3)
    })

    it('should render custom number of lines', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'text', lines: 5 },
      })

      expect(wrapper.findAll('.h-4').length).toBe(5)
    })

    it('should render single line when lines is 1', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'text', lines: 1 },
      })

      expect(wrapper.findAll('.h-4').length).toBe(1)
    })

    it('should have last line at 70% width', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'text', lines: 3 },
      })

      const lines = wrapper.findAll('.h-4')
      const lastLine = lines[lines.length - 1]
      expect(lastLine.attributes('style')).toContain('width: 70%')
    })

    it('should have other lines at 100% width', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'text', lines: 3 },
      })

      const lines = wrapper.findAll('.h-4')
      expect(lines[0].attributes('style')).toContain('width: 100%')
      expect(lines[1].attributes('style')).toContain('width: 100%')
    })
  })

  describe('Card Variant', () => {
    it('should render card variant', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'card' },
      })

      expect(wrapper.find('.h-48').exists()).toBe(true)
    })

    it('should have full width for card', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'card' },
      })

      expect(wrapper.find('.w-full').exists()).toBe(true)
    })

    it('should have rounded-lg for card', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'card' },
      })

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })
  })

  describe('Avatar Variant', () => {
    it('should render avatar variant', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'avatar' },
      })

      expect(wrapper.find('.h-12.w-12').exists()).toBe(true)
    })

    it('should have rounded-full for avatar', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'avatar' },
      })

      expect(wrapper.find('.rounded-full').exists()).toBe(true)
    })
  })

  describe('Button Variant', () => {
    it('should render button variant', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'button' },
      })

      expect(wrapper.find('.h-10.w-24').exists()).toBe(true)
    })

    it('should have rounded-md for button', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'button' },
      })

      expect(wrapper.find('.rounded-md').exists()).toBe(true)
    })
  })

  describe('Custom Dimensions', () => {
    it('should apply custom width', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'card', width: '200px' },
      })

      const skeleton = wrapper.find('.h-48')
      expect(skeleton.attributes('style')).toContain('width: 200px')
    })

    it('should apply custom height', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'card', height: '100px' },
      })

      const skeleton = wrapper.find('.h-48')
      expect(skeleton.attributes('style')).toContain('height: 100px')
    })

    it('should apply both custom width and height', () => {
      const wrapper = mount(SkeletonLoader, {
        props: { variant: 'card', width: '150px', height: '80px' },
      })

      const skeleton = wrapper.find('.h-48')
      expect(skeleton.attributes('style')).toContain('width: 150px')
      expect(skeleton.attributes('style')).toContain('height: 80px')
    })
  })

  describe('Animation', () => {
    it('should have pulse animation', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.find('.animate-pulse').exists()).toBe(true)
    })

    it('should have shimmer effect classes', () => {
      const wrapper = mount(SkeletonLoader)

      // shimmer uses before: pseudo-element prefix
      expect(wrapper.find('.overflow-hidden').exists()).toBe(true)
      const skeletonEl = wrapper.find('.overflow-hidden')
      expect(skeletonEl.classes().some(c => c.includes('animate-shimmer'))).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.find('[role="status"]').exists()).toBe(true)
    })

    it('should have aria-busy="true"', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    })

    it('should have aria-label', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.find('[aria-label="Loading content"]').exists()).toBe(true)
    })

    it('should have screen reader only text', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.find('.sr-only').exists()).toBe(true)
      expect(wrapper.find('.sr-only').text()).toBe('Loading...')
    })
  })

  describe('Styling', () => {
    it('should have gray background', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.find('.bg-gray-200').exists()).toBe(true)
    })

    it('should have rounded corners', () => {
      const wrapper = mount(SkeletonLoader)

      expect(wrapper.find('.rounded').exists()).toBe(true)
    })
  })
})
