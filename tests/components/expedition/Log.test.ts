import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpeditionLog from '~/components/expedition/Log.vue'
import type { Hero, ExpeditionRewards } from '~~/types'

// The component expects a different Log shape than the type definition
// Using the actual shape from the component
interface ComponentLog {
  zoneName: string
  subzoneName: string
  durationMinutes: number
  events: Array<{
    type: 'flavor' | 'skill_check' | 'choice' | 'rare'
    section?: 'start' | 'journey' | 'climax' | 'end'
    narrative: string
    traitReactions?: string[]
    skillCheck?: { success: boolean }
    choice?: { selectedOption: string }
    loot?: { itemName: string }
  }>
  efficiency?: number
  summary?: string
}

describe('ExpeditionLog', () => {
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
    gameplayTraits: [],
    storyTraitIds: [],
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

  const createLog = (overrides: Partial<ComponentLog> = {}): ComponentLog => ({
    zoneName: 'Dark Forest',
    subzoneName: 'Forest Edge',
    durationMinutes: 30,
    events: [
      {
        type: 'flavor',
        section: 'start',
        narrative: 'The party set out at dawn.',
      },
    ],
    ...overrides,
  })

  const createRewards = (overrides: Partial<ExpeditionRewards> = {}): ExpeditionRewards => ({
    gold: 100,
    xp: 50,
    equipment: [],
    materials: {},
    familiarityGain: 5,
    masteryGain: 3,
    ...overrides,
  })

  describe('Header', () => {
    it('should render zone name', () => {
      const log = createLog({ zoneName: 'Haunted Caves' })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Haunted Caves')
    })

    it('should render subzone name', () => {
      const log = createLog({ subzoneName: 'Crystal Chamber' })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Crystal Chamber')
    })

    it('should render duration', () => {
      const log = createLog({ durationMinutes: 45 })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Duration: 45 minutes')
    })

    it('should render expedition log title', () => {
      const log = createLog()
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Expedition Log')
    })
  })

  describe('Party Display', () => {
    it('should render party section', () => {
      const log = createLog()
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Party')
    })

    it('should render hero names', () => {
      const log = createLog()
      const heroes = [
        createHero({ id: 'h1', name: 'Sir Lancelot' }),
        createHero({ id: 'h2', name: 'Lady Guinevere' }),
      ]
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes },
      })

      expect(wrapper.text()).toContain('Sir Lancelot')
      expect(wrapper.text()).toContain('Lady Guinevere')
    })
  })

  describe('Events Display', () => {
    it('should render event narrative', () => {
      const log = createLog({
        events: [
          { type: 'flavor', section: 'journey', narrative: 'They encountered a strange creature.' },
        ],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('They encountered a strange creature.')
    })

    it('should render trait reactions', () => {
      const log = createLog({
        events: [
          {
            type: 'flavor',
            section: 'journey',
            narrative: 'A chest appeared.',
            traitReactions: ['Hero checked it for cheese.', 'Hero counted the coins.'],
          },
        ],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Hero checked it for cheese.')
      expect(wrapper.text()).toContain('Hero counted the coins.')
    })

    it('should render skill check success', () => {
      const log = createLog({
        events: [
          {
            type: 'skill_check',
            section: 'journey',
            narrative: 'They attempted to pick the lock.',
            skillCheck: { success: true },
          },
        ],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Success')
    })

    it('should render skill check failure', () => {
      const log = createLog({
        events: [
          {
            type: 'skill_check',
            section: 'journey',
            narrative: 'They attempted to pick the lock.',
            skillCheck: { success: false },
          },
        ],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Failed')
    })

    it('should render choice made', () => {
      const log = createLog({
        events: [
          {
            type: 'choice',
            section: 'journey',
            narrative: 'A fork in the road appeared.',
            choice: { selectedOption: 'Go left' },
          },
        ],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Choice: Go left')
    })

    it('should render loot found', () => {
      const log = createLog({
        events: [
          {
            type: 'rare',
            section: 'journey',
            narrative: 'Found a hidden chest!',
            loot: { itemName: 'Golden Sword' },
          },
        ],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Loot: Golden Sword')
    })
  })

  describe('Event Type Icons', () => {
    it('should show book icon for flavor events', () => {
      const log = createLog({
        events: [{ type: 'flavor', narrative: 'Text' }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('📖')
    })

    it('should show sword icon for skill check events', () => {
      const log = createLog({
        events: [{ type: 'skill_check', narrative: 'Text', skillCheck: { success: true } }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('⚔️')
    })

    it('should show branch icon for choice events', () => {
      const log = createLog({
        events: [{ type: 'choice', narrative: 'Text', choice: { selectedOption: 'A' } }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('🔀')
    })

    it('should show sparkle icon for rare events', () => {
      const log = createLog({
        events: [{ type: 'rare', narrative: 'Text' }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('✨')
    })
  })

  describe('Section Titles', () => {
    it('should render Departure section', () => {
      const log = createLog({
        events: [{ type: 'flavor', section: 'start', narrative: 'Text' }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Departure')
    })

    it('should render The Journey section', () => {
      const log = createLog({
        events: [{ type: 'flavor', section: 'journey', narrative: 'Text' }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('The Journey')
    })

    it('should render Climax section', () => {
      const log = createLog({
        events: [{ type: 'flavor', section: 'climax', narrative: 'Text' }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Climax')
    })

    it('should render Return section', () => {
      const log = createLog({
        events: [{ type: 'flavor', section: 'end', narrative: 'Text' }],
      })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Return')
    })
  })

  describe('Summary', () => {
    it('should render summary when provided', () => {
      const log = createLog({ summary: 'A successful expedition overall.' })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Summary')
      expect(wrapper.text()).toContain('A successful expedition overall.')
    })

    it('should not render summary section when not provided', () => {
      const log = createLog({ summary: undefined })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.find('.bg-blue-50').exists()).toBe(false)
    })
  })

  describe('Rewards Display', () => {
    it('should render rewards section when provided', () => {
      const log = createLog()
      const rewards = createRewards({ gold: 500 })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()], rewards },
      })

      expect(wrapper.text()).toContain('Rewards Earned')
    })

    it('should render gold reward', () => {
      const log = createLog()
      const rewards = createRewards({ gold: 500 })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()], rewards },
      })

      expect(wrapper.text()).toContain('500')
      expect(wrapper.text()).toContain('Gold')
    })

    it('should render XP reward', () => {
      const log = createLog()
      const rewards = createRewards({ xp: 250 })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()], rewards },
      })

      expect(wrapper.text()).toContain('250')
      expect(wrapper.text()).toContain('XP')
    })

    it('should render equipment count', () => {
      const log = createLog()
      const rewards = createRewards({ equipment: ['eq1', 'eq2', 'eq3'] })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()], rewards },
      })

      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('Equipment')
    })

    it('should not show zero rewards', () => {
      const log = createLog()
      const rewards = createRewards({ gold: 0, xp: 0 })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()], rewards },
      })

      // Gold section should not exist when gold is 0
      const goldSections = wrapper.findAll('.text-yellow-600')
      expect(goldSections.length).toBe(0)
    })

    it('should not render rewards section when not provided', () => {
      const log = createLog()
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.find('.bg-green-50').exists()).toBe(false)
    })
  })

  describe('Efficiency Display', () => {
    it('should render efficiency when provided', () => {
      const log = createLog({ efficiency: 0.85 })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).toContain('Efficiency: 85%')
    })

    it('should not render efficiency when not provided', () => {
      const log = createLog({ efficiency: undefined })
      const wrapper = mount(ExpeditionLog, {
        props: { log: log as any, heroes: [createHero()] },
      })

      expect(wrapper.text()).not.toContain('Efficiency:')
    })
  })
})
