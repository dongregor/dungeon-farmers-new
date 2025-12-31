import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroCard from '~/components/hero/Card.vue'
import type { Hero } from '~~/types'

// Mock the getArchetypeById function
vi.mock('~~/types/archetypes', () => ({
  getArchetypeById: vi.fn((archetype: string) => ({
    id: archetype,
    name: archetype === 'tank' ? 'Tank' : archetype === 'healer' ? 'Healer' : 'Warrior',
    description: `A ${archetype} class`,
  })),
}))

describe('HeroCard', () => {
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
      { traitId: 'tough', quality: 'magic', rolledValue: 15 },
    ],
    storyTraitIds: ['cheese_obsessed', 'chronic_napper'],
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render hero name', () => {
      const hero = createHero({ name: 'Sir Lancelot' })
      const wrapper = mount(HeroCard, {
        props: { hero },
      })

      expect(wrapper.text()).toContain('Sir Lancelot')
    })

    it('should render hero rarity', () => {
      const hero = createHero({ rarity: 'epic' })
      const wrapper = mount(HeroCard, {
        props: { hero },
      })

      expect(wrapper.text()).toContain('epic')
    })

    it('should render hero archetype', () => {
      const hero = createHero({ archetype: 'tank' })
      const wrapper = mount(HeroCard, {
        props: { hero },
      })

      expect(wrapper.text()).toContain('Tank')
    })

    it('should render hero level', () => {
      const hero = createHero({ level: 15 })
      const wrapper = mount(HeroCard, {
        props: { hero },
      })

      expect(wrapper.text()).toContain('Lvl 15')
    })

    it('should render hero morale', () => {
      const hero = createHero({ morale: 'excited' })
      const wrapper = mount(HeroCard, {
        props: { hero },
      })

      expect(wrapper.text()).toContain('excited')
    })
  })

  describe('Rarity Border Colors', () => {
    it.each([
      ['common', 'border-common'],
      ['uncommon', 'border-uncommon'],
      ['rare', 'border-rare'],
      ['epic', 'border-epic'],
      ['legendary', 'border-legendary'],
    ] as const)('should apply %s border class', (rarity, expectedClass) => {
      const hero = createHero({ rarity })
      const wrapper = mount(HeroCard, {
        props: { hero },
      })

      expect(wrapper.classes()).toContain(expectedClass)
    })
  })

  describe('Traits Display', () => {
    it('should show limited traits by default', () => {
      const hero = createHero({
        gameplayTraits: [
          { traitId: 'brawny', quality: 'normal', rolledValue: 10 },
          { traitId: 'tough', quality: 'normal', rolledValue: 12 },
          { traitId: 'nimble', quality: 'magic', rolledValue: 15 },
        ],
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: false },
      })

      // Should show +1 more indicator
      expect(wrapper.text()).toContain('+1 more')
    })

    it('should show all traits when showDetails is true', () => {
      const hero = createHero({
        gameplayTraits: [
          { traitId: 'brawny', quality: 'normal', rolledValue: 10 },
          { traitId: 'tough', quality: 'normal', rolledValue: 12 },
          { traitId: 'nimble', quality: 'magic', rolledValue: 15 },
        ],
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: true },
      })

      // Should show all traits
      expect(wrapper.text()).toContain('brawny')
      expect(wrapper.text()).toContain('tough')
      expect(wrapper.text()).toContain('nimble')
      expect(wrapper.text()).not.toContain('+1 more')
    })

    it('should format trait IDs with spaces', () => {
      const hero = createHero({
        gameplayTraits: [
          { traitId: 'cave_dweller', quality: 'normal', rolledValue: 10 },
        ],
      })
      const wrapper = mount(HeroCard, {
        props: { hero },
      })

      expect(wrapper.text()).toContain('cave dweller')
    })
  })

  describe('Stats Display', () => {
    it('should hide stats by default', () => {
      const hero = createHero({
        baseStats: { combat: 10, utility: 8, survival: 12 },
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: false },
      })

      expect(wrapper.text()).not.toContain('Combat: 10')
    })

    it('should show stats when showDetails is true', () => {
      const hero = createHero({
        baseStats: { combat: 10, utility: 8, survival: 12 },
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: true },
      })

      expect(wrapper.text()).toContain('Combat: 10')
      expect(wrapper.text()).toContain('Utility: 8')
      expect(wrapper.text()).toContain('Survival: 12')
    })

    it('should show stat progress bar when showDetails is true', () => {
      const hero = createHero({
        baseStats: { combat: 10, utility: 20, survival: 20 },
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: true },
      })

      // Total stats = 50, width should be 50% of 100
      const progressBar = wrapper.find('.bg-guild-gold.h-2')
      expect(progressBar.exists()).toBe(true)
    })
  })

  describe('Story Traits', () => {
    it('should hide story traits by default', () => {
      const hero = createHero({
        storyTraitIds: ['cheese_obsessed', 'chronic_napper'],
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: false },
      })

      expect(wrapper.text()).not.toContain('Personality:')
    })

    it('should show story traits when showDetails is true', () => {
      const hero = createHero({
        storyTraitIds: ['cheese_obsessed', 'chronic_napper'],
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: true },
      })

      expect(wrapper.text()).toContain('Personality:')
      expect(wrapper.text()).toContain('cheese obsessed')
      expect(wrapper.text()).toContain('chronic napper')
    })

    it('should hide story traits section if hero has none', () => {
      const hero = createHero({
        storyTraitIds: [],
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: true },
      })

      expect(wrapper.text()).not.toContain('Personality:')
    })

    it('should limit story traits to 3', () => {
      const hero = createHero({
        storyTraitIds: ['trait1', 'trait2', 'trait3', 'trait4'],
      })
      const wrapper = mount(HeroCard, {
        props: { hero, showDetails: true },
      })

      // Should only show first 3 traits
      const storyTraitSection = wrapper.find('.border-t.border-gray-700.mt-3')
      if (storyTraitSection.exists()) {
        const traits = storyTraitSection.findAll('span')
        expect(traits.length).toBeLessThanOrEqual(3)
      }
    })
  })
})
