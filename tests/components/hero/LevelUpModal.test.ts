import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LevelUpModal from '~/components/hero/LevelUpModal.vue'
import type { Hero } from '~~/types'

describe('LevelUpModal', () => {
  const createHero = (overrides: Partial<Hero> = {}): Hero => ({
    id: 'hero-1',
    name: 'Sir Lancelot',
    gender: 'male',
    culture: 'northfolk',
    titles: [],
    displayTitle: null,
    rarity: 'rare',
    archetype: 'tank',
    archetypeTags: ['taunt'],
    baseStats: { combat: 15, utility: 10, survival: 20 },
    level: 10,
    xp: 500,
    xpToNextLevel: 1000,
    gameplayTraits: [],
    storyTraitIds: [],
    power: 100,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
    currentExpeditionId: null,
    isFavorite: false,
    morale: 'content',
    moraleValue: 75,
    moraleLastUpdate: new Date().toISOString(),
    isOnExpedition: false,
    isStationed: false,
    stationedZoneId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  })

  describe('Visibility', () => {
    it('should not render when show is false', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: false,
        },
      })

      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should render when show is true', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.find('.fixed').exists()).toBe(true)
    })
  })

  describe('Content Display', () => {
    it('should display hero name', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero({ name: 'Lady Guinevere' }),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('Lady Guinevere')
    })

    it('should display new level', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('reached level 10')
    })

    it('should display level change', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('9 → 10')
    })

    it('should display power gain', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 15,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('+15')
    })

    it('should display Level Up! title', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('Level Up!')
    })

    it('should display star icon', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('⭐')
    })
  })

  describe('Multiple Level Gains', () => {
    it('should show +X levels when gaining multiple levels', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 5,
          newLevel: 8,
          powerGain: 15,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('+3 levels')
    })

    it('should not show +X levels for single level gain', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).not.toContain('+1 levels')
    })
  })

  describe('Stat Increases', () => {
    it('should display stat increases section', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('Stat Increases')
      expect(wrapper.text()).toContain('Combat')
      expect(wrapper.text()).toContain('Utility')
      expect(wrapper.text()).toContain('Survival')
    })

    it('should calculate stat gain based on levels gained', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 5,
          newLevel: 10,
          powerGain: 25,
          show: true,
        },
      })

      // 5 levels * 0.5 per level = +2.5 per stat
      expect(wrapper.text()).toContain('+2.5')
    })
  })

  describe('Prestige Hint', () => {
    it('should show prestige hint at level 60', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 59,
          newLevel: 60,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('Prestige Available!')
      expect(wrapper.text()).toContain('👑')
    })

    it('should show prestige hint above level 60', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 60,
          newLevel: 65,
          powerGain: 25,
          show: true,
        },
      })

      expect(wrapper.text()).toContain('Prestige Available!')
    })

    it('should not show prestige hint below level 60', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 58,
          newLevel: 59,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.text()).not.toContain('Prestige Available!')
    })
  })

  describe('Close Functionality', () => {
    it('should emit close when Continue button clicked', async () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should have Continue button text', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.find('button').text()).toBe('Continue')
    })

    it('should emit close when clicking backdrop', async () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      await wrapper.find('.fixed').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Styling', () => {
    it('should have backdrop with opacity', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.find('.fixed').classes()).toContain('bg-black')
      expect(wrapper.find('.fixed').classes()).toContain('bg-opacity-50')
    })

    it('should center modal content', () => {
      const wrapper = mount(LevelUpModal, {
        props: {
          hero: createHero(),
          oldLevel: 9,
          newLevel: 10,
          powerGain: 5,
          show: true,
        },
      })

      expect(wrapper.find('.fixed').classes()).toContain('flex')
      expect(wrapper.find('.fixed').classes()).toContain('items-center')
      expect(wrapper.find('.fixed').classes()).toContain('justify-center')
    })
  })
})
