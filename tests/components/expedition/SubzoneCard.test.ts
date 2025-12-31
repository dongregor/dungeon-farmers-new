import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SubzoneCard from '~/components/expedition/SubzoneCard.vue'
import type { Subzone } from '~~/types'

describe('SubzoneCard', () => {
  // Note: The component expects difficulty as a number (1-5) for star display
  // even though the Subzone type has difficulty as a string
  const createSubzone = (overrides: Partial<Subzone> = {}): Subzone => ({
    id: 'subzone-1',
    name: 'Forest Edge',
    description: 'The outer edge of the forest',
    discoveryWeight: 100,
    requiredZoneFamiliarity: 0,
    isDiscovered: true,
    // @ts-expect-error - component expects number for v-for star display
    difficulty: 1,
    threats: ['goblin_ambush', 'poison_plants'],
    monsters: [],
    collectibles: [],
    lootTable: [],
    bonusXpPercent: 0,
    bonusGoldPercent: 0,
    baseDuration: 15,
    baseGold: 100,
    baseXp: 50,
    mastery: 0,
    ...overrides,
  })

  // Convert difficulty string to number for the component (based on template)
  const difficultyToNumber = (difficulty: string): number => {
    const map: Record<string, number> = { easy: 1, medium: 2, hard: 3, extreme: 4 }
    return map[difficulty] || 1
  }

  describe('Rendering', () => {
    it('should render subzone name', () => {
      const subzone = createSubzone({ name: 'Crystal Cavern' })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).toContain('Crystal Cavern')
    })

    it('should render subzone description', () => {
      const subzone = createSubzone({ description: 'A shimmering cave' })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).toContain('A shimmering cave')
    })

    it('should render base duration', () => {
      const subzone = createSubzone({ baseDuration: 30 })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).toContain('30m')
    })
  })

  describe('Discovered State', () => {
    it('should show mastery progress when discovered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, mastery: 50 },
      })

      expect(wrapper.text()).toContain('Mastery')
      expect(wrapper.text()).toContain('50/100')
    })

    it('should not show lock icon when discovered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).not.toContain('🔒')
    })

    it('should show loot preview when discovered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).toContain('Drops:')
    })
  })

  describe('Undiscovered State', () => {
    it('should show lock icon when not discovered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: false },
      })

      expect(wrapper.text()).toContain('🔒')
    })

    it('should apply reduced opacity when not discovered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: false },
      })

      expect(wrapper.classes()).toContain('opacity-50')
    })

    it('should apply cursor-not-allowed when not discovered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: false },
      })

      expect(wrapper.classes()).toContain('cursor-not-allowed')
    })

    it('should show familiarity requirement when not discovered', () => {
      const subzone = createSubzone({ requiredZoneFamiliarity: 50 })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: false },
      })

      expect(wrapper.text()).toContain('Requires 50% zone familiarity')
    })

    it('should not show mastery section when not discovered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: false },
      })

      expect(wrapper.find('.mastery').exists()).toBe(false)
    })
  })

  describe('Mastered State', () => {
    it('should show mastery badge when mastered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, isMastered: true },
      })

      expect(wrapper.text()).toContain('Mastered')
    })

    it('should not show mastery badge when not mastered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, isMastered: false },
      })

      expect(wrapper.find('.mastery-badge').exists()).toBe(false)
    })

    it('should apply purple styling when mastered', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, isMastered: true, mastery: 100 },
      })

      expect(wrapper.find('.text-purple-400').exists()).toBe(true)
    })
  })

  describe('Selection State', () => {
    it('should apply selected styling when selected', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, selected: true },
      })

      expect(wrapper.classes()).toContain('border-blue-500')
    })

    it('should not apply selected styling when not selected', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, selected: false },
      })

      expect(wrapper.classes()).not.toContain('border-blue-500')
    })
  })

  describe('Threats Display', () => {
    it('should render threats when discovered', () => {
      const subzone = createSubzone({
        threats: ['goblin_ambush', 'poison_plants'],
      })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).toContain('Threats:')
      expect(wrapper.text()).toContain('Goblin Ambush')
      expect(wrapper.text()).toContain('Poison Plants')
    })

    it('should limit threats to 3 with more indicator', () => {
      const subzone = createSubzone({
        threats: ['threat1', 'threat2', 'threat3', 'threat4', 'threat5'],
      })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).toContain('+2 more')
    })

    it('should not show threats section when empty', () => {
      const subzone = createSubzone({ threats: [] })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.find('.threats').exists()).toBe(false)
    })
  })

  describe('Mastery Benefits', () => {
    it('should show active benefits based on mastery', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, mastery: 50 },
      })

      expect(wrapper.text()).toContain('Active Benefits:')
      expect(wrapper.text()).toContain('25%')
      expect(wrapper.text()).toContain('50%')
    })

    it('should not show benefits section when mastery is 0', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, mastery: 0 },
      })

      expect(wrapper.text()).not.toContain('Active Benefits:')
    })

    it('should show all benefits at 100% mastery', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, mastery: 100 },
      })

      expect(wrapper.text()).toContain('100%')
    })
  })

  describe('Progress Bar', () => {
    it('should render mastery progress bar', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, mastery: 75 },
      })

      const progressBar = wrapper.find('.progress-bar')
      expect(progressBar.exists()).toBe(true)
    })

    it('should set correct width for progress bar', () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true, mastery: 75 },
      })

      const progressFill = wrapper.find('.progress-bar > div')
      expect(progressFill.attributes('style')).toContain('width: 75%')
    })
  })

  describe('Events', () => {
    it('should emit select event when clicked and discovered', async () => {
      const subzone = createSubzone({ id: 'subzone-123' })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual(['subzone-123'])
    })

    it('should not emit select event when clicked and not discovered', async () => {
      const subzone = createSubzone()
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: false },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toBeFalsy()
    })
  })

  describe('Difficulty Display', () => {
    it('should render difficulty stars', () => {
      // @ts-expect-error - component expects number for v-for star display
      const subzone = createSubzone({ difficulty: 3 })
      const wrapper = mount(SubzoneCard, {
        props: { subzone, isDiscovered: true },
      })

      expect(wrapper.text()).toContain('Difficulty')
    })
  })
})
