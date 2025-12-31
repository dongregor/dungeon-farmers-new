import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseModal from '~/components/modals/BaseModal.vue'

describe('BaseModal', () => {
  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = ''
  })

  afterEach(() => {
    // Cleanup
    document.body.style.overflow = ''
  })

  describe('Rendering', () => {
    it('should not render content when closed', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: false },
        slots: { default: 'Modal content' },
      })

      expect(wrapper.text()).not.toContain('Modal content')
    })

    it('should render content when open', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
        slots: { default: 'Modal content' },
      })

      expect(wrapper.text()).toContain('Modal content')
    })

    it('should render title when provided', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true, title: 'Test Title' },
      })

      expect(wrapper.text()).toContain('Test Title')
    })

    it('should have dialog role', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
      })

      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })

    it('should have aria-modal attribute', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
      })

      expect(wrapper.find('[aria-modal="true"]').exists()).toBe(true)
    })
  })

  describe('Size Variants', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const
    const expectedClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    }

    sizes.forEach((size) => {
      it(`should apply ${size} size class`, () => {
        const wrapper = mount(BaseModal, {
          props: { modelValue: true, size },
        })

        const dialog = wrapper.find('[role="dialog"]')
        expect(dialog.classes()).toContain(expectedClasses[size])
      })
    })
  })

  describe('Close Button', () => {
    it('should show close button by default', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
      })

      expect(wrapper.find('button[aria-label="Close modal"]').exists()).toBe(true)
    })

    it('should hide close button when closable is false', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true, closable: false },
      })

      expect(wrapper.find('button[aria-label="Close modal"]').exists()).toBe(false)
    })

    it('should emit update:modelValue with false when close button clicked', async () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
      })

      await wrapper.find('button[aria-label="Close modal"]').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })
  })

  describe('Overlay Click', () => {
    it('should close on overlay click by default', async () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
      })

      // Click on the overlay (the fixed div)
      const overlay = wrapper.find('.fixed.inset-0')
      await overlay.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })

    it('should not close on overlay click when closeOnOverlay is false', async () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true, closeOnOverlay: false },
      })

      const overlay = wrapper.find('.fixed.inset-0')
      await overlay.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('should not close when clicking inside modal content', async () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
        slots: { default: '<div class="content">Content</div>' },
      })

      const dialog = wrapper.find('[role="dialog"]')
      await dialog.trigger('click')

      // Modal content click should stop propagation
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('Slots', () => {
    it('should render default slot content', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
        slots: { default: 'Main content' },
      })

      expect(wrapper.text()).toContain('Main content')
    })

    it('should render header slot', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
        slots: { header: 'Custom Header' },
      })

      expect(wrapper.text()).toContain('Custom Header')
    })

    it('should render footer slot', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
        slots: { footer: 'Footer content' },
      })

      expect(wrapper.text()).toContain('Footer content')
    })
  })

  describe('Accessibility', () => {
    it('should have aria-labelledby when title is provided', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true, title: 'Test' },
      })

      const dialog = wrapper.find('[role="dialog"]')
      expect(dialog.attributes('aria-labelledby')).toBe('modal-title')
    })

    it('should not have aria-labelledby when no title', () => {
      const wrapper = mount(BaseModal, {
        props: { modelValue: true },
      })

      const dialog = wrapper.find('[role="dialog"]')
      expect(dialog.attributes('aria-labelledby')).toBeUndefined()
    })
  })
})
