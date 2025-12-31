import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmationDialog from '~/components/modals/ConfirmationDialog.vue'
import BaseModal from '~/components/modals/BaseModal.vue'

describe('ConfirmationDialog', () => {
  const defaultProps = {
    modelValue: true,
    message: 'Are you sure you want to proceed?',
  }

  const mountOptions = {
    global: {
      stubs: { Teleport: true },
      components: { BaseModal },
    },
  }

  describe('Rendering', () => {
    it('should render when modelValue is true', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Are you sure you want to proceed?')
    })

    it('should use BaseModal component', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      expect(wrapper.findComponent(BaseModal).exists()).toBe(true)
    })

    it('should render default title', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Confirm')
    })

    it('should render custom title', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: { ...defaultProps, title: 'Delete Item?' },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Delete Item?')
    })
  })

  describe('Buttons', () => {
    it('should render confirm button with default text', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.some(b => b.text() === 'Confirm')).toBe(true)
    })

    it('should render cancel button with default text', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.some(b => b.text() === 'Cancel')).toBe(true)
    })

    it('should render custom button text', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: {
          ...defaultProps,
          confirmText: 'Delete',
          cancelText: 'Keep',
        },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Delete')
      expect(wrapper.text()).toContain('Keep')
    })
  })

  describe('Events', () => {
    it('should emit confirm when confirm button clicked', async () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      const confirmButton = wrapper.findAll('button').find(b => b.text() === 'Confirm')
      await confirmButton?.trigger('click')

      expect(wrapper.emitted('confirm')).toBeTruthy()
    })

    it('should emit update:modelValue false when confirm clicked', async () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      const confirmButton = wrapper.findAll('button').find(b => b.text() === 'Confirm')
      await confirmButton?.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emits = wrapper.emitted('update:modelValue') as boolean[][]
      expect(emits[emits.length - 1]).toEqual([false])
    })

    it('should emit cancel when cancel button clicked', async () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      const cancelButton = wrapper.findAll('button').find(b => b.text() === 'Cancel')
      await cancelButton?.trigger('click')

      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('should emit update:modelValue false when cancel clicked', async () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      const cancelButton = wrapper.findAll('button').find(b => b.text() === 'Cancel')
      await cancelButton?.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emits = wrapper.emitted('update:modelValue') as boolean[][]
      expect(emits[emits.length - 1]).toEqual([false])
    })
  })

  describe('Variant Styling', () => {
    it('should apply info styling by default', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      // Info icon background
      expect(wrapper.find('.bg-blue-100').exists()).toBe(true)
    })

    it('should apply danger styling', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: { ...defaultProps, variant: 'danger' },
        ...mountOptions,
      })

      expect(wrapper.find('.bg-red-100').exists()).toBe(true)
    })

    it('should apply warning styling', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: { ...defaultProps, variant: 'warning' },
        ...mountOptions,
      })

      expect(wrapper.find('.bg-yellow-100').exists()).toBe(true)
    })

    it('should apply danger button styling for danger variant', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: { ...defaultProps, variant: 'danger' },
        ...mountOptions,
      })

      const confirmButton = wrapper.findAll('button').find(b => b.text() === 'Confirm')
      expect(confirmButton?.classes()).toContain('bg-red-500')
    })
  })

  describe('Icon', () => {
    it('should display icon in circle', () => {
      const wrapper = mount(ConfirmationDialog, {
        props: defaultProps,
        ...mountOptions,
      })

      expect(wrapper.find('.rounded-full').exists()).toBe(true)
    })
  })
})
