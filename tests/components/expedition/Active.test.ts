import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import ExpeditionActive from '~/components/expedition/Active.vue'
import type { Expedition, Zone, Subzone, Hero } from '~~/types'

// Mock the stores
vi.mock('~/stores/expeditions', () => ({
  useExpeditionStore: vi.fn(() => ({
    completeExpedition: vi.fn(),
  })),
}))

vi.mock('~/stores/heroes', () => ({
  useHeroStore: vi.fn(() => ({
    heroes: [
      {
        id: 'hero-1',
        name: 'Test Hero',
        level: 5,
        archetype: 'tank',
        moraleValue: 75,
        power: 50,
      },
    ],
  })),
}))

// Mock $fetch
vi.stubGlobal('$fetch', vi.fn())

describe('ExpeditionActive', () => {
  // Fixed time for consistent testing - must be before createExpedition
  const fixedNow = new Date('2024-06-15T12:00:00.000Z')

  const createExpedition = (overrides: Partial<Expedition> = {}): Expedition => {
    // Use fixedNow as the reference point for time calculations
    const now = fixedNow
    const startedAt = new Date(now.getTime() - 15 * 60 * 1000) // 15 minutes ago
    const completesAt = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes from now

    return {
      id: 'exp-1',
      playerId: 'player-1',
      zoneId: 'zone-1',
      subzoneId: 'subzone-1',
      heroIds: ['hero-1'],
      status: 'in_progress',
      startedAt: startedAt.toISOString(),
      completesAt: completesAt.toISOString(),
      durationMinutes: 30,
      teamPower: 100,
      autoRepeat: false,
      events: [],
      pendingChoices: [],
      createdAt: startedAt.toISOString(),
      updatedAt: startedAt.toISOString(),
      ...overrides,
    }
  }

  const createZone = (): Zone => ({
    id: 'zone-1',
    name: 'Dark Forest',
    description: 'A mysterious forest',
    type: 'forest',
    unlockRequirement: {},
    subzones: [],
    masteryRewards: { passiveIncomeBonus: 10 },
    familiarity: 0,
    isUnlocked: true,
    isMastered: false,
  })

  const createSubzone = (): Subzone => ({
    id: 'subzone-1',
    name: 'Forest Edge',
    description: 'The outer edge',
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
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(fixedNow)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Header', () => {
    it('should render zone and subzone name', () => {
      const expedition = createExpedition()
      const zone = createZone()
      const subzone = createSubzone()

      const wrapper = mount(ExpeditionActive, {
        props: { expedition, zone, subzone },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Dark Forest')
      expect(wrapper.text()).toContain('Forest Edge')
    })

    it('should show auto-repeat status when enabled', () => {
      const expedition = createExpedition({ autoRepeat: true })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Auto-repeat enabled')
    })

    it('should show single run status when auto-repeat disabled', () => {
      const expedition = createExpedition({ autoRepeat: false })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Single run')
    })

    it('should show efficiency badge when efficiency is set', () => {
      const expedition = createExpedition({ efficiency: 120 })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('120% Efficiency')
    })
  })

  describe('Progress Display', () => {
    it('should show time remaining text', () => {
      const expedition = createExpedition()

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Time Remaining:')
    })

    it('should show progress percentage', () => {
      const expedition = createExpedition()

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      // Should have a percentage displayed
      expect(wrapper.find('.progress-bar-container').exists()).toBe(true)
    })
  })

  describe('Party Display', () => {
    it('should render party section', () => {
      const expedition = createExpedition()

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Party')
    })

    it('should display hero names', () => {
      const expedition = createExpedition({ heroIds: ['hero-1'] })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Test Hero')
    })

    it('should display hero levels', () => {
      const expedition = createExpedition({ heroIds: ['hero-1'] })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Level 5')
    })

    it('should display hero power', () => {
      const expedition = createExpedition({ heroIds: ['hero-1'] })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Power')
      expect(wrapper.text()).toContain('50')
    })
  })

  describe('Team Stats', () => {
    it('should display team power', () => {
      const expedition = createExpedition({ teamPower: 250 })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Team Power')
      expect(wrapper.text()).toContain('250')
    })

    it('should display duration', () => {
      const expedition = createExpedition({ durationMinutes: 45 })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Duration')
      expect(wrapper.text()).toContain('45m')
    })

    it('should display status', () => {
      const expedition = createExpedition()

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.text()).toContain('Status')
    })
  })

  describe('Efficiency Badge Styling', () => {
    it('should apply green styling for high efficiency', () => {
      const expedition = createExpedition({ efficiency: 110 })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.find('.efficiency-badge').classes()).toContain('text-green-400')
    })

    it('should apply yellow styling for low efficiency', () => {
      const expedition = createExpedition({ efficiency: 85 })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.find('.efficiency-badge').classes()).toContain('text-yellow-400')
    })
  })

  describe('Action Buttons', () => {
    it('should show cancel button when expedition is active', async () => {
      // Use fixedNow and set completion time in the future
      const startedAt = new Date(fixedNow.getTime() - 15 * 60 * 1000) // 15 min before fixedNow
      const completesAt = new Date(fixedNow.getTime() + 30 * 60 * 1000) // 30 min after fixedNow
      const expedition = createExpedition({
        startedAt: startedAt.toISOString(),
        completesAt: completesAt.toISOString(),
      })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      // Wait for component to fully initialize
      await nextTick()
      await flushPromises()

      expect(wrapper.text()).toContain('Cancel')
    })

    it('should show complete button when expedition is finished', async () => {
      // Use fixedNow and set completion time in the past
      const startedAt = new Date(fixedNow.getTime() - 30 * 60 * 1000) // 30 min before fixedNow
      const completesAt = new Date(fixedNow.getTime() - 5 * 60 * 1000) // 5 min before fixedNow
      const expedition = createExpedition({
        startedAt: startedAt.toISOString(),
        completesAt: completesAt.toISOString(),
      })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      // Wait for component to fully initialize
      await nextTick()
      await flushPromises()

      expect(wrapper.text()).toContain('Complete Expedition')
    })
  })

  describe('Cancel Confirmation Modal', () => {
    it('should show cancel confirmation when cancel clicked', async () => {
      // Use fixedNow for consistent time - expedition in progress
      const startedAt = new Date(fixedNow.getTime() - 15 * 60 * 1000) // 15 min before fixedNow
      const completesAt = new Date(fixedNow.getTime() + 30 * 60 * 1000) // 30 min after fixedNow
      const expedition = createExpedition({
        startedAt: startedAt.toISOString(),
        completesAt: completesAt.toISOString(),
      })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      // Wait for component to fully initialize
      await nextTick()
      await flushPromises()

      const cancelButton = wrapper.findAll('button').find(b => b.text().includes('Cancel'))
      await cancelButton?.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('Cancel Expedition?')
      expect(wrapper.text()).toContain('lose 20 morale')
    })

    it('should have confirm and keep going buttons in modal', async () => {
      // Use fixedNow for consistent time - expedition in progress
      const startedAt = new Date(fixedNow.getTime() - 15 * 60 * 1000) // 15 min before fixedNow
      const completesAt = new Date(fixedNow.getTime() + 30 * 60 * 1000) // 30 min after fixedNow
      const expedition = createExpedition({
        startedAt: startedAt.toISOString(),
        completesAt: completesAt.toISOString(),
      })

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      // Wait for component to fully initialize
      await nextTick()
      await flushPromises()

      const cancelButton = wrapper.findAll('button').find(b => b.text().includes('Cancel'))
      await cancelButton?.trigger('click')
      await nextTick()

      expect(wrapper.text()).toContain('Confirm Cancel')
      expect(wrapper.text()).toContain('Keep Going')
    })
  })

  describe('Error Display', () => {
    it('should not show error by default', () => {
      const expedition = createExpedition()

      const wrapper = mount(ExpeditionActive, {
        props: { expedition },
        global: { stubs: { Teleport: true } },
      })

      expect(wrapper.find('.error').exists()).toBe(false)
    })
  })
})
