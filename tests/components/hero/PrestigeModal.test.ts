import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrestigeModal from '~/components/hero/PrestigeModal.vue'
import type { Hero } from '~~/types'

// Mock the prestige service
vi.mock('~/utils/prestigeService', () => ({
  getPrestigeInfo: vi.fn((prestigeLevel: number) => {
    const bonuses = [3, 4, 5, 6, 7]
    const chances = [0.10, 0.15, 0.20, 0.25, 0.30]
    const traitSlots = [true, false, true, false, true]
    const idx = Math.min(prestigeLevel, 4)
    return {
      statBonus: bonuses[idx],
      upgradeChance: chances[idx],
      grantsTraitSlot: traitSlots[idx],
    }
  }),
}))

describe('PrestigeModal', () => {
  const createHero = (overrides: Partial<Hero> = {}): Hero => ({
    id: 'hero-1',
    name: 'Sir Galahad',
    gender: 'male',
    culture: 'northfolk',
    titles: [],
    displayTitle: null,
    rarity: 'epic',
    archetype: 'tank',
    archetypeTags: ['taunt', 'shield'],
    baseStats: { combat: 20, utility: 15, survival: 30 },
    level: 60,
    xp: 0,
    xpToNextLevel: 1000,
    gameplayTraits: [],
    storyTraitIds: [],
    power: 200,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
    currentExpeditionId: null,
    isFavorite: false,
    morale: 'excited',
    moraleValue: 90,
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
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: false },
      })

      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should render when show is true', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.find('.fixed').exists()).toBe(true)
    })
  })

  describe('Header Display', () => {
    it('should display crown icon', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('👑')
    })

    it('should display Prestige Hero title', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('Prestige Hero')
    })

    it('should display hero name and level', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ name: 'Lady Guinevere', level: 60 }), show: true },
      })

      expect(wrapper.text()).toContain('Lady Guinevere')
      expect(wrapper.text()).toContain('Level 60')
    })

    it('should display current prestige level', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 2 }), show: true },
      })

      expect(wrapper.text()).toContain('Current Prestige')
      expect(wrapper.text()).toContain('2')
    })
  })

  describe('Prestige Benefits', () => {
    it('should display stat bonus info', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 0 }), show: true },
      })

      expect(wrapper.text()).toContain('Prestige Benefits')
      expect(wrapper.text()).toContain('+3 to All Stats')
    })

    it('should display trait upgrade chance', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 0 }), show: true },
      })

      expect(wrapper.text()).toContain('Trait Upgrade Chance')
      expect(wrapper.text()).toContain('10%')
    })

    it('should show trait slot gain when applicable', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 0 }), show: true },
      })

      expect(wrapper.text()).toContain('Gain Extra Trait Slot')
    })

    it('should display morale restore benefit', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('Full Morale Restore')
    })

    it('should show green checkmarks for benefits', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('✓')
    })
  })

  describe('Reset Warnings', () => {
    it('should display reset warnings section', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('Reset on Prestige')
    })

    it('should warn about level reset', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('Level resets to 1')
    })

    it('should warn about equipment unequip', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('All equipment unequipped')
    })

    it('should show warning icons', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('⚠')
    })
  })

  describe('Cannot Prestige Warning', () => {
    it('should show warning when hero level below 60', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ level: 50 }), show: true },
      })

      expect(wrapper.text()).toContain('Cannot Prestige')
      expect(wrapper.text()).toContain('Hero must reach level 60')
      expect(wrapper.text()).toContain('🚫')
    })

    it('should not show warning when hero at level 60', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ level: 60 }), show: true },
      })

      expect(wrapper.text()).not.toContain('Cannot Prestige')
    })

    it('should not show warning when hero above level 60', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ level: 65 }), show: true },
      })

      expect(wrapper.text()).not.toContain('Cannot Prestige')
    })
  })

  describe('Action Buttons', () => {
    it('should show Cancel button', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('Cancel')
    })

    it('should show Prestige button with new level', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 2 }), show: true },
      })

      expect(wrapper.text()).toContain('Prestige to 3')
    })

    it('should disable prestige button when hero below level 60', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ level: 45 }), show: true },
      })

      const prestigeButton = wrapper.findAll('button').find(b => b.text().includes('Prestige to'))
      expect(prestigeButton?.attributes('disabled')).toBeDefined()
    })

    it('should enable prestige button when hero at level 60', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ level: 60 }), show: true },
      })

      const prestigeButton = wrapper.findAll('button').find(b => b.text().includes('Prestige to'))
      expect(prestigeButton?.attributes('disabled')).toBeUndefined()
    })

    it('should emit close when Cancel clicked', async () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      const cancelButton = wrapper.findAll('button').find(b => b.text() === 'Cancel')
      await cancelButton?.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit confirm when Prestige clicked', async () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ level: 60 }), show: true },
      })

      const prestigeButton = wrapper.findAll('button').find(b => b.text().includes('Prestige to'))
      await prestigeButton?.trigger('click')

      expect(wrapper.emitted('confirm')).toBeTruthy()
    })

    it('should not emit confirm when disabled', async () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ level: 45 }), show: true },
      })

      const prestigeButton = wrapper.findAll('button').find(b => b.text().includes('Prestige to'))
      await prestigeButton?.trigger('click')

      expect(wrapper.emitted('confirm')).toBeFalsy()
    })
  })

  describe('Backdrop', () => {
    it('should emit close when clicking backdrop', async () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      await wrapper.find('.fixed').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should not close when clicking modal content', async () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      await wrapper.find('.bg-white').trigger('click')

      // Should not emit close (self modifier on backdrop)
      expect(wrapper.emitted('close')?.length || 0).toBe(0)
    })
  })

  describe('Styling', () => {
    it('should have backdrop with opacity', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      const backdrop = wrapper.find('.fixed')
      expect(backdrop.classes()).toContain('bg-black')
      expect(backdrop.classes()).toContain('bg-opacity-50')
    })

    it('should center modal content', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      const backdrop = wrapper.find('.fixed')
      expect(backdrop.classes()).toContain('flex')
      expect(backdrop.classes()).toContain('items-center')
      expect(backdrop.classes()).toContain('justify-center')
    })

    it('should have purple background for prestige level', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.find('.bg-purple-50').exists()).toBe(true)
    })

    it('should have purple prestige button', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      const prestigeButton = wrapper.findAll('button').find(b => b.text().includes('Prestige to'))
      expect(prestigeButton?.classes()).toContain('bg-purple-500')
    })
  })

  describe('Info Note', () => {
    it('should display permanence warning', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero(), show: true },
      })

      expect(wrapper.text()).toContain('Prestige is permanent')
      expect(wrapper.text()).toContain('cannot be undone')
    })
  })

  describe('Different Prestige Levels', () => {
    it('should show correct info for prestige 0 -> 1', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 0 }), show: true },
      })

      expect(wrapper.text()).toContain('Prestige to 1')
      expect(wrapper.text()).toContain('+3 to All Stats')
    })

    it('should show correct info for prestige 1 -> 2', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 1 }), show: true },
      })

      expect(wrapper.text()).toContain('Prestige to 2')
      expect(wrapper.text()).toContain('+4 to All Stats')
    })

    it('should show correct info for prestige 2 -> 3', () => {
      const wrapper = mount(PrestigeModal, {
        props: { hero: createHero({ prestigeLevel: 2 }), show: true },
      })

      expect(wrapper.text()).toContain('Prestige to 3')
      expect(wrapper.text()).toContain('+5 to All Stats')
    })
  })
})
