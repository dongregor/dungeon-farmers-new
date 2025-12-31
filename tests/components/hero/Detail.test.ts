import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroDetail from '~/components/hero/Detail.vue'
import type { Hero } from '~~/types'

// Mock the helper functions
vi.mock('~~/types/archetypes', () => ({
  getArchetypeById: vi.fn((archetype: string) => ({
    id: archetype,
    name: archetype === 'tank' ? 'Tank' : archetype === 'healer' ? 'Healer' : 'Warrior',
    description: `A ${archetype} class that excels in combat`,
  })),
}))

vi.mock('~/data/gameplayTraits', () => ({
  getGameplayTraitById: vi.fn((id: string) => ({
    id,
    name: id.replace(/_/g, ' '),
    description: `+{value}% Combat`,
    effect: 'stat_bonus',
    isNegative: id.includes('clumsy'),
    statType: 'combat',
  })),
}))

vi.mock('~/data/storyTraits', () => ({
  getStoryTraitById: vi.fn((id: string) => ({
    id,
    name: id.replace(/_/g, ' '),
    description: `A story trait about ${id}`,
    reactions: ['curious', 'amused'],
  })),
}))

vi.mock('~/data/cultures', () => ({
  getCultureInfo: vi.fn((culture: string) => ({
    id: culture,
    name: culture === 'northfolk' ? 'Northfolk' : culture.charAt(0).toUpperCase() + culture.slice(1),
    description: `A proud ${culture} culture`,
  })),
}))

describe('HeroDetail', () => {
  const createHero = (overrides: Partial<Hero> = {}): Hero => ({
    id: 'hero-1',
    name: 'Test Hero',
    gender: 'male',
    culture: 'northfolk',
    titles: [],
    displayTitle: null,
    rarity: 'common',
    archetype: 'tank',
    archetypeTags: ['taunt'],
    baseStats: { combat: 10, utility: 8, survival: 12 },
    level: 5,
    xp: 100,
    xpToNextLevel: 500,
    gameplayTraits: [
      { traitId: 'brawny', quality: 'normal', rolledValue: 10 },
    ],
    storyTraitIds: ['cheese_obsessed'],
    power: 50,
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

  const mountOptions = {
    global: {
      stubs: { Teleport: true },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render hero name', () => {
      const hero = createHero({ name: 'Sir Galahad' })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Sir Galahad')
    })

    it('should render archetype name and description', () => {
      const hero = createHero({ archetype: 'tank' })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Tank')
      expect(wrapper.text()).toContain('A tank class that excels in combat')
    })

    it('should render culture name and description', () => {
      const hero = createHero({ culture: 'northfolk' })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Northfolk')
      expect(wrapper.text()).toContain('A proud northfolk culture')
    })

    it('should render close button', () => {
      const hero = createHero()
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      const closeButton = wrapper.find('button')
      expect(closeButton.exists()).toBe(true)
      expect(closeButton.text()).toContain('×')
    })
  })

  describe('Rarity Border', () => {
    it.each([
      ['common', 'border-common'],
      ['uncommon', 'border-uncommon'],
      ['rare', 'border-rare'],
      ['epic', 'border-epic'],
      ['legendary', 'border-legendary'],
    ] as const)('should apply %s border class', (rarity, expectedClass) => {
      const hero = createHero({ rarity })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.find('.border-2').classes()).toContain(expectedClass)
    })
  })

  describe('Stats Display', () => {
    it('should display combat stat', () => {
      const hero = createHero({ baseStats: { combat: 15, utility: 8, survival: 12 } })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Combat')
      expect(wrapper.text()).toContain('15')
    })

    it('should display utility stat', () => {
      const hero = createHero({ baseStats: { combat: 10, utility: 20, survival: 12 } })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Utility')
      expect(wrapper.text()).toContain('20')
    })

    it('should display survival stat', () => {
      const hero = createHero({ baseStats: { combat: 10, utility: 8, survival: 25 } })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Survival')
      expect(wrapper.text()).toContain('25')
    })

    it('should display total stats', () => {
      const hero = createHero({ baseStats: { combat: 10, utility: 8, survival: 12 } })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Total')
      expect(wrapper.text()).toContain('30')
    })
  })

  describe('Power Breakdown', () => {
    it('should display base power', () => {
      const hero = createHero({ baseStats: { combat: 10, utility: 10, survival: 10 } })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Base Stats')
      expect(wrapper.text()).toContain('30') // Total base stats
    })

    it('should display level bonus', () => {
      const hero = createHero({ level: 10 })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Level Bonus')
      expect(wrapper.text()).toContain('+20') // level * 2
    })

    it('should display trait bonus', () => {
      const hero = createHero({
        gameplayTraits: [
          { traitId: 'brawny', quality: 'normal', rolledValue: 10 },
          { traitId: 'tough', quality: 'magic', rolledValue: 15 },
        ],
      })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Trait Bonus')
    })

    it('should display total power', () => {
      const hero = createHero()
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Total Power')
    })
  })

  describe('Gameplay Traits', () => {
    it('should display gameplay traits section', () => {
      const hero = createHero()
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('GAMEPLAY TRAITS')
    })

    it('should display trait name', () => {
      const hero = createHero({
        gameplayTraits: [{ traitId: 'brawny', quality: 'normal', rolledValue: 10 }],
      })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('brawny')
    })

    it('should display trait rolled value', () => {
      const hero = createHero({
        gameplayTraits: [{ traitId: 'brawny', quality: 'normal', rolledValue: 15 }],
      })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('15')
    })

    it('should display trait quality', () => {
      const hero = createHero({
        gameplayTraits: [{ traitId: 'brawny', quality: 'magic', rolledValue: 10 }],
      })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('magic')
    })

    it('should apply green color for positive traits', () => {
      const hero = createHero({
        gameplayTraits: [{ traitId: 'brawny', quality: 'normal', rolledValue: 10 }],
      })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.find('.text-success-green').exists()).toBe(true)
    })

    it('should apply red color for negative traits', () => {
      const hero = createHero({
        gameplayTraits: [{ traitId: 'clumsy', quality: 'normal', rolledValue: 5 }],
      })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.find('.text-danger-red').exists()).toBe(true)
    })
  })

  describe('Story Traits', () => {
    it('should display story traits section when hero has story traits', () => {
      const hero = createHero({ storyTraitIds: ['cheese_obsessed'] })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('STORY TRAITS')
    })

    it('should not display story traits section when hero has no story traits', () => {
      const hero = createHero({ storyTraitIds: [] })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).not.toContain('STORY TRAITS')
    })

    it('should display story trait name', () => {
      const hero = createHero({ storyTraitIds: ['cheese_obsessed'] })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('cheese obsessed')
    })
  })

  describe('Status Information', () => {
    it('should display hero level', () => {
      const hero = createHero({ level: 25 })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Level 25')
    })

    it('should display prestige level', () => {
      const hero = createHero({ prestigeLevel: 3 })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Prestige 3')
    })

    it('should display morale', () => {
      const hero = createHero({ morale: 'excited' })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('excited')
      expect(wrapper.text()).toContain('Morale')
    })

    it('should show "On Expedition" status', () => {
      const hero = createHero({ isOnExpedition: true, isStationed: false })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('On Expedition')
    })

    it('should show "Stationed" status', () => {
      const hero = createHero({ isOnExpedition: false, isStationed: true })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Stationed')
    })

    it('should show "Available" status when idle', () => {
      const hero = createHero({ isOnExpedition: false, isStationed: false })
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.text()).toContain('Available')
    })
  })

  describe('Events', () => {
    it('should emit close event when close button is clicked', async () => {
      const hero = createHero()
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Modal Structure', () => {
    it('should render as a fixed overlay', () => {
      const hero = createHero()
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    })

    it('should have dark background overlay', () => {
      const hero = createHero()
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.find('.bg-black.bg-opacity-75').exists()).toBe(true)
    })

    it('should center content', () => {
      const hero = createHero()
      const wrapper = mount(HeroDetail, {
        props: { hero },
        ...mountOptions,
      })

      expect(wrapper.find('.flex.items-center.justify-center').exists()).toBe(true)
    })
  })
})
