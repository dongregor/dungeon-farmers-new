import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZoneCard from '~/components/expedition/ZoneCard.vue'
import type { Zone, ZoneType } from '~~/types'

describe('ZoneCard', () => {
  const createZone = (overrides: Partial<Zone> = {}): Zone => ({
    id: 'zone-1',
    name: 'Dark Forest',
    description: 'A mysterious forest filled with dangers',
    type: 'forest',
    unlockRequirement: {},
    subzones: [
      {
        id: 'subzone-1',
        name: 'Forest Edge',
        description: 'The outer edge of the forest',
        discoveryWeight: 100,
        requiredZoneFamiliarity: 0,
        isDiscovered: true,
        difficulty: 'easy',
        threats: [],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 0,
        bonusGoldPercent: 0,
        baseDuration: 15,
        baseGold: 100,
        baseXp: 50,
        mastery: 0,
      },
      {
        id: 'subzone-2',
        name: 'Deep Woods',
        description: 'The heart of the forest',
        discoveryWeight: 50,
        requiredZoneFamiliarity: 25,
        isDiscovered: false,
        difficulty: 'medium',
        threats: [],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 10,
        bonusGoldPercent: 10,
        baseDuration: 30,
        baseGold: 200,
        baseXp: 100,
        mastery: 0,
      },
    ],
    masteryRewards: { passiveIncomeBonus: 10 },
    familiarity: 0,
    isUnlocked: false,
    isMastered: false,
    ...overrides,
  })

  describe('Rendering', () => {
    it('should render zone name', () => {
      const zone = createZone({ name: 'Haunted Caves' })
      const wrapper = mount(ZoneCard, {
        props: { zone },
      })

      expect(wrapper.text()).toContain('Haunted Caves')
    })

    it('should render zone description', () => {
      const zone = createZone({ description: 'Ancient ruins full of treasure' })
      const wrapper = mount(ZoneCard, {
        props: { zone },
      })

      expect(wrapper.text()).toContain('Ancient ruins full of treasure')
    })

    it('should render zone type badge', () => {
      const zone = createZone({ type: 'cave' })
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true },
      })

      expect(wrapper.text()).toContain('CAVE')
    })

    it('should render level range', () => {
      const zone = createZone()
      // @ts-expect-error - adding minLevel/maxLevel for test
      zone.minLevel = 5
      // @ts-expect-error - adding minLevel/maxLevel for test
      zone.maxLevel = 15

      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true },
      })

      expect(wrapper.text()).toContain('Level 5-15')
    })
  })

  describe('Locked State', () => {
    it('should show lock icon when not unlocked', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: false },
      })

      expect(wrapper.text()).toContain('🔒')
    })

    it('should not show lock icon when unlocked', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true },
      })

      expect(wrapper.text()).not.toContain('🔒')
    })

    it('should apply reduced opacity when locked', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: false },
      })

      expect(wrapper.classes()).toContain('opacity-60')
    })

    it('should apply cursor-not-allowed when locked', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: false },
      })

      expect(wrapper.classes()).toContain('cursor-not-allowed')
    })

    it('should show unlock requirements when locked', () => {
      const zone = createZone({
        unlockRequirement: {
          minPower: 100,
          previousZoneId: 'zone-0',
        },
      })
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: false },
      })

      expect(wrapper.text()).toContain('Requirements:')
      expect(wrapper.text()).toContain('Minimum Power: 100')
      expect(wrapper.text()).toContain('Complete: zone-0')
    })
  })

  describe('Unlocked State', () => {
    it('should show familiarity progress when unlocked', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, familiarity: 50 },
      })

      expect(wrapper.text()).toContain('Familiarity')
      expect(wrapper.text()).toContain('50/100')
    })

    it('should show subzone count when unlocked', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, discoveredSubzonesCount: 1 },
      })

      expect(wrapper.text()).toContain('Subzones Discovered')
      expect(wrapper.text()).toContain('1/2')
    })
  })

  describe('Mastered State', () => {
    it('should show mastery badge when mastered', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, isMastered: true },
      })

      expect(wrapper.text()).toContain('Mastered')
    })

    it('should not show mastery badge when not mastered', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, isMastered: false },
      })

      expect(wrapper.find('.mastery-badge').exists()).toBe(false)
    })

    it('should apply purple styling to familiarity when mastered', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, isMastered: true, familiarity: 100 },
      })

      expect(wrapper.find('.text-purple-400').exists()).toBe(true)
    })
  })

  describe('Familiarity Benefits', () => {
    it('should show active benefits based on familiarity', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, familiarity: 50 },
      })

      expect(wrapper.text()).toContain('Active Benefits:')
      expect(wrapper.text()).toContain('25%')
      expect(wrapper.text()).toContain('50%')
    })

    it('should not show benefits section when familiarity is 0', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, familiarity: 0 },
      })

      expect(wrapper.text()).not.toContain('Active Benefits:')
    })

    it('should show all benefits at 100% familiarity', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, familiarity: 100 },
      })

      expect(wrapper.text()).toContain('100%')
    })
  })

  describe('Selection State', () => {
    it('should apply selected styling when selected', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, selected: true },
      })

      expect(wrapper.classes()).toContain('border-blue-500')
    })

    it('should not apply selected styling when not selected', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, selected: false },
      })

      expect(wrapper.classes()).not.toContain('border-blue-500')
    })
  })

  describe('Zone Type Styling', () => {
    it.each([
      ['forest', 'bg-green-900/30'],
      ['cave', 'bg-gray-700'],
      ['swamp', 'bg-emerald-900/30'],
      ['ruins', 'bg-amber-900/30'],
      ['mountain', 'bg-slate-700'],
      ['desert', 'bg-yellow-900/30'],
    ] as const)('should apply correct styling for %s type', (type, expectedClass) => {
      const zone = createZone({ type: type as ZoneType })
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true },
      })

      expect(wrapper.find('.type-badge').classes()).toContain(expectedClass)
    })
  })

  describe('Events', () => {
    it('should emit select event when clicked and unlocked', async () => {
      const zone = createZone({ id: 'zone-123' })
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual(['zone-123'])
    })

    it('should not emit select event when clicked and locked', async () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: false },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('select')).toBeFalsy()
    })
  })

  describe('Progress Bar', () => {
    it('should render familiarity progress bar', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, familiarity: 75 },
      })

      const progressBar = wrapper.find('.progress-bar')
      expect(progressBar.exists()).toBe(true)
    })

    it('should set correct width for progress bar', () => {
      const zone = createZone()
      const wrapper = mount(ZoneCard, {
        props: { zone, isUnlocked: true, familiarity: 75 },
      })

      const progressFill = wrapper.find('.progress-bar > div')
      expect(progressFill.attributes('style')).toContain('width: 75%')
    })
  })
})
