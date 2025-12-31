import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EventChoice from '~/components/expedition/EventChoice.vue'
import type { ExpeditionEvent } from '~~/types'

describe('EventChoice', () => {
  const createEvent = (overrides: Partial<ExpeditionEvent> = {}): ExpeditionEvent => ({
    id: 'event-1',
    timestamp: new Date().toISOString(),
    phaseIndex: 1,
    type: 'choice',
    narrative: 'You encounter a fork in the road. Which path will you take?',
    traitReactions: ['Sir Lancelot feels uneasy about the left path.'],
    choice: {
      options: [
        {
          text: 'Take the left path through the dark forest',
          risk: 'high',
          hint: 'May encounter dangerous creatures',
        },
        {
          text: 'Take the right path along the stream',
          risk: 'low',
          hint: 'A safer but longer route',
        },
        {
          text: 'Use your survival skills to find a hidden trail',
          requiresStat: { stat: 'survival', value: 20 },
          risk: 'medium',
        },
      ],
    },
    ...overrides,
  })

  describe('Visibility', () => {
    it('should render when show is true and event has choice', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.find('.fixed').exists()).toBe(true)
    })

    it('should not render when show is false', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: false },
      })

      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should not render when event has no choice', () => {
      const eventWithoutChoice = createEvent()
      delete eventWithoutChoice.choice

      const wrapper = mount(EventChoice, {
        props: { event: eventWithoutChoice, show: true },
      })

      expect(wrapper.find('.fixed').exists()).toBe(false)
    })
  })

  describe('Event Display', () => {
    it('should display event narrative', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('You encounter a fork in the road')
    })

    it('should display trait reactions', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('Sir Lancelot feels uneasy about the left path')
    })

    it('should not show trait reactions section when empty', () => {
      const eventNoReactions = createEvent({ traitReactions: [] })

      const wrapper = mount(EventChoice, {
        props: { event: eventNoReactions, show: true },
      })

      expect(wrapper.find('.border-l-2.border-blue-200').exists()).toBe(false)
    })
  })

  describe('Options Display', () => {
    it('should display all choice options', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('Take the left path through the dark forest')
      expect(wrapper.text()).toContain('Take the right path along the stream')
      expect(wrapper.text()).toContain('Use your survival skills')
    })

    it('should display risk levels', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('Risk: High')
      expect(wrapper.text()).toContain('Risk: Low')
      expect(wrapper.text()).toContain('Risk: Medium')
    })

    it('should display stat requirements', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('Requires: survival 20+')
    })

    it('should display hints', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('May encounter dangerous creatures')
      expect(wrapper.text()).toContain('A safer but longer route')
    })
  })

  describe('Option Icons', () => {
    it('should show sword icon for stat requirement options', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('⚔️')
    })

    it('should show warning icon for high risk options', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('⚠️')
    })

    it('should show lightning icon for medium risk options', () => {
      const event = createEvent()
      event.choice!.options = [
        { text: 'Medium risk option', risk: 'medium' },
      ]

      const wrapper = mount(EventChoice, {
        props: { event, show: true },
      })

      expect(wrapper.text()).toContain('⚡')
    })

    it('should show checkmark icon for low/no risk options', () => {
      const event = createEvent()
      event.choice!.options = [
        { text: 'Safe option' },
      ]

      const wrapper = mount(EventChoice, {
        props: { event, show: true },
      })

      expect(wrapper.text()).toContain('✓')
    })
  })

  describe('Selection', () => {
    it('should start with no option selected', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.findAll('.border-blue-500').length).toBe(0)
    })

    it('should highlight selected option', async () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      const options = wrapper.findAll('.cursor-pointer')
      await options[0].trigger('click')

      expect(options[0].classes()).toContain('border-blue-500')
      expect(options[0].classes()).toContain('bg-blue-50')
    })

    it('should show checkmark on selected option', async () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      const options = wrapper.findAll('.cursor-pointer')
      await options[0].trigger('click')

      expect(options[0].find('.text-blue-500.text-2xl').exists()).toBe(true)
    })

    it('should change selection when clicking different option', async () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      const options = wrapper.findAll('.cursor-pointer')
      await options[0].trigger('click')
      await options[1].trigger('click')

      expect(options[0].classes()).not.toContain('border-blue-500')
      expect(options[1].classes()).toContain('border-blue-500')
    })
  })

  describe('Confirm Button', () => {
    it('should be disabled when no option selected', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      const confirmBtn = wrapper.findAll('button').find(b => b.text().includes('Confirm'))
      expect(confirmBtn?.attributes('disabled')).toBeDefined()
    })

    it('should be enabled when option selected', async () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      const options = wrapper.findAll('.cursor-pointer')
      await options[0].trigger('click')

      const confirmBtn = wrapper.findAll('button').find(b => b.text().includes('Confirm'))
      expect(confirmBtn?.attributes('disabled')).toBeUndefined()
    })

    it('should emit select event with option index when confirmed', async () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      const options = wrapper.findAll('.cursor-pointer')
      await options[1].trigger('click')

      const confirmBtn = wrapper.findAll('button').find(b => b.text().includes('Confirm'))
      await confirmBtn?.trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual([1])
    })
  })

  describe('Cancel', () => {
    it('should have cancel button', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('Cancel')
    })

    it('should emit close when cancel clicked', async () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Cancel')
      await cancelBtn?.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit close when clicking overlay', async () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      await wrapper.find('.fixed').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Warning Display', () => {
    it('should show warning message', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('This choice will affect the outcome')
    })

    it('should show info note about stats and traits', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.text()).toContain('Some choices may require specific stats or traits')
    })
  })

  describe('Risk Colors', () => {
    it('should have red color for high risk', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.find('.text-red-600').exists()).toBe(true)
    })

    it('should have yellow color for medium risk', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.find('.text-yellow-600').exists()).toBe(true)
    })

    it('should have green color for low risk', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.find('.text-green-600').exists()).toBe(true)
    })
  })

  describe('Styling', () => {
    it('should have modal overlay', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.find('.bg-black.bg-opacity-50').exists()).toBe(true)
    })

    it('should have white modal container', () => {
      const wrapper = mount(EventChoice, {
        props: { event: createEvent(), show: true },
      })

      expect(wrapper.find('.bg-white.rounded-lg').exists()).toBe(true)
    })
  })
})
