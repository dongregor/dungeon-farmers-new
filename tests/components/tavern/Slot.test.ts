import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TavernSlot from '~/components/tavern/Slot.vue'
import type { TavernHero } from '~~/types'

// Mock the getArchetypeById function
vi.mock('~~/types/archetypes', () => ({
  getArchetypeById: vi.fn((archetype: string) => ({
    id: archetype,
    name: archetype === 'tank' ? 'Tank' : archetype === 'healer' ? 'Healer' : 'Warrior',
    description: `A ${archetype} class`,
  })),
}))

describe('TavernSlot', () => {
  const createTavernHero = (overrides: Partial<TavernHero> = {}): TavernHero => ({
    name: 'Test Hero',
    gender: 'male',
    culture: 'northfolk',
    titles: [],
    displayTitle: null,
    rarity: 'common',
    archetype: 'tank',
    archetypeTags: ['taunt'],
    baseStats: { combat: 10, utility: 8, survival: 12 },
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gameplayTraits: [
      { traitId: 'brawny', quality: 'normal', rolledValue: 10 },
    ],
    storyTraitIds: ['cheese_obsessed'],
    power: 30,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
    recruitCost: 100,
    isLocked: false,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Empty Slot', () => {
    it('should render empty slot message when no hero', () => {
      const wrapper = mount(TavernSlot, {
        props: { hero: null, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('Empty Slot')
    })

    it('should have gray border when empty', () => {
      const wrapper = mount(TavernSlot, {
        props: { hero: null, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.classes()).toContain('border-gray-600')
    })

    it('should not render recruit button when empty', () => {
      const wrapper = mount(TavernSlot, {
        props: { hero: null, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('Hero Display', () => {
    it('should render hero name', () => {
      const hero = createTavernHero({ name: 'Sir Lancelot' })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('Sir Lancelot')
    })

    it('should render hero rarity', () => {
      const hero = createTavernHero({ rarity: 'epic' })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('epic')
    })

    it('should render hero archetype', () => {
      const hero = createTavernHero({ archetype: 'healer' })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('Healer')
    })

    it('should render hero level', () => {
      const hero = createTavernHero({ level: 5 })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('Lvl 5')
    })

    it('should render hero stats', () => {
      const hero = createTavernHero({
        baseStats: { combat: 15, utility: 10, survival: 20 },
      })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('Combat: 15')
      expect(wrapper.text()).toContain('Utility: 10')
      expect(wrapper.text()).toContain('Survival: 20')
    })

    it('should render hero traits', () => {
      const hero = createTavernHero({
        gameplayTraits: [
          { traitId: 'cave_dweller', quality: 'normal', rolledValue: 10 },
        ],
      })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('cave dweller')
    })

    it('should limit traits to 3', () => {
      const hero = createTavernHero({
        gameplayTraits: [
          { traitId: 'trait1', quality: 'normal', rolledValue: 5 },
          { traitId: 'trait2', quality: 'normal', rolledValue: 5 },
          { traitId: 'trait3', quality: 'normal', rolledValue: 5 },
          { traitId: 'trait4', quality: 'normal', rolledValue: 5 },
        ],
      })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      // Should show first 3 traits but not the 4th
      // Check that trait4 is not displayed
      expect(wrapper.text()).toContain('trait1')
      expect(wrapper.text()).toContain('trait2')
      expect(wrapper.text()).toContain('trait3')
      expect(wrapper.text()).not.toContain('trait4')
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
      const hero = createTavernHero({ rarity })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.classes()).toContain(expectedClass)
    })
  })

  describe('Recruit Button', () => {
    it('should render recruit button with cost', () => {
      const hero = createTavernHero({ recruitCost: 250 })
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('Recruit (250 Gold)')
    })

    it('should emit recruit event when button clicked', async () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 2, isLocked: false },
      })

      // Find the recruit button specifically (contains "Recruit")
      const recruitButton = wrapper.findAll('button').find(b => b.text().includes('Recruit'))
      await recruitButton?.trigger('click')

      expect(wrapper.emitted('recruit')).toBeTruthy()
      expect(wrapper.emitted('recruit')![0]).toEqual([2])
    })

    it('should disable recruit button when locked', () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: true },
      })

      // Find the recruit button specifically (contains "Recruit")
      const recruitButton = wrapper.findAll('button').find(b => b.text().includes('Recruit'))
      expect(recruitButton?.attributes('disabled')).toBeDefined()
    })
  })

  describe('Lock Toggle', () => {
    it('should show unlocked icon when not locked', () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      expect(wrapper.text()).toContain('🔓')
    })

    it('should show locked icon when locked', () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: true },
      })

      expect(wrapper.text()).toContain('🔒')
    })

    it('should emit lock event when clicking unlocked icon', async () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 1, isLocked: false },
      })

      const lockButton = wrapper.findAll('button').find(b => b.text().includes('🔓'))
      await lockButton?.trigger('click')

      expect(wrapper.emitted('lock')).toBeTruthy()
      expect(wrapper.emitted('lock')![0]).toEqual([1])
    })

    it('should emit unlock event when clicking locked icon', async () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 1, isLocked: true },
      })

      const lockButton = wrapper.findAll('button').find(b => b.text().includes('🔒'))
      await lockButton?.trigger('click')

      expect(wrapper.emitted('unlock')).toBeTruthy()
      expect(wrapper.emitted('unlock')![0]).toEqual([1])
    })

    it('should have correct title for lock button', () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: false },
      })

      const lockButton = wrapper.findAll('button').find(b => b.text().includes('🔓'))
      expect(lockButton?.attributes('title')).toBe('Lock this hero')
    })

    it('should have correct title for unlock button', () => {
      const hero = createTavernHero()
      const wrapper = mount(TavernSlot, {
        props: { hero, slotIndex: 0, isLocked: true },
      })

      const lockButton = wrapper.findAll('button').find(b => b.text().includes('🔒'))
      expect(lockButton?.attributes('title')).toBe('Unlock this hero')
    })
  })
})
