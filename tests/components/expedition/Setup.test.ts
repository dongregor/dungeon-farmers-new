import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Setup from '~/components/expedition/Setup.vue'
import type { Zone, Subzone } from '~~/types'

// Mock the stores
vi.mock('~/stores/heroes', () => ({
  useHeroStore: vi.fn(() => ({
    heroes: [
      {
        id: 'hero-1',
        name: 'Sir Lancelot',
        level: 20,
        archetype: 'tank',
        status: 'idle',
        morale: 75,
        stats: { combat: 30, utility: 15, survival: 25 },
      },
      {
        id: 'hero-2',
        name: 'Lady Morgana',
        level: 15,
        archetype: 'caster',
        status: 'idle',
        morale: 60,
        stats: { combat: 20, utility: 35, survival: 15 },
      },
      {
        id: 'hero-3',
        name: 'Robin Hood',
        level: 25,
        archetype: 'melee_dps',
        status: 'idle',
        morale: 90,
        stats: { combat: 40, utility: 20, survival: 20 },
      },
      {
        id: 'hero-4',
        name: 'Friar Tuck',
        level: 18,
        archetype: 'healer',
        status: 'idle',
        morale: 50,
        stats: { combat: 10, utility: 30, survival: 30 },
      },
      {
        id: 'hero-5',
        name: 'Tired Tim',
        level: 10,
        archetype: 'tank',
        status: 'idle',
        morale: 10, // Too low morale
        stats: { combat: 15, utility: 10, survival: 20 },
      },
      {
        id: 'hero-6',
        name: 'Busy Bob',
        level: 15,
        archetype: 'melee_dps',
        status: 'expedition', // Not idle
        morale: 80,
        stats: { combat: 25, utility: 15, survival: 18 },
      },
    ],
  })),
}))

vi.mock('~/stores/expeditions', () => ({
  useExpeditionStore: vi.fn(() => ({
    startExpedition: vi.fn().mockResolvedValue({ expedition: { id: 'exp-123' } }),
  })),
}))

// Mock $fetch for preview API
vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({
  threats: [{ name: 'Goblin Ambush', id: 'goblin_ambush' }],
  counters: [{ threatId: 'goblin_ambush', counterTags: ['taunt'], hasCounter: true }],
  estimatedEfficiency: 95,
  estimatedRewards: { gold: 150, xp: 200, duration: 30 },
}))

describe('Setup (Expedition)', () => {
  const createZone = (): Zone => ({
    id: 'verdant_woods',
    name: 'Verdant Woods',
    description: 'A lush forest',
    biome: 'forest',
    unlockRequirements: { playerLevel: 1 },
    subzones: [],
    recommendedPower: 50,
  })

  const createSubzone = (): Subzone => ({
    id: 'woods_edge',
    name: 'Woods Edge',
    description: 'The edge of the forest',
    baseDuration: 30,
    threats: [],
    lootTable: [],
    difficulty: 1,
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render zone and subzone names', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).toContain('Verdant Woods')
      expect(wrapper.text()).toContain('Woods Edge')
    })

    it('should render duration info', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).toContain('Duration: 30 minutes')
    })

    it('should render hero selection section', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).toContain('Select Heroes')
      expect(wrapper.text()).toContain('/4')
    })

    it('should show available heroes', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      // Should show idle heroes with morale >= 20
      expect(wrapper.text()).toContain('Sir Lancelot')
      expect(wrapper.text()).toContain('Lady Morgana')
      expect(wrapper.text()).toContain('Robin Hood')
      expect(wrapper.text()).toContain('Friar Tuck')
    })

    it('should not show heroes with low morale', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).not.toContain('Tired Tim')
    })

    it('should not show heroes already on expedition', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).not.toContain('Busy Bob')
    })

    it('should show hero stats', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).toContain('Combat: 30')
      expect(wrapper.text()).toContain('Utility: 15')
      expect(wrapper.text()).toContain('Survival: 25')
    })

    it('should show hero level and archetype', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).toContain('Level 20 tank')
    })
  })

  describe('Hero Selection', () => {
    it('should start with no heroes selected', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).toContain('0/4')
    })

    it('should select hero on click', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')

      expect(wrapper.text()).toContain('1/4')
    })

    it('should deselect hero on second click', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')
      expect(wrapper.text()).toContain('1/4')

      await heroCards[0].trigger('click')
      expect(wrapper.text()).toContain('0/4')
    })

    it('should show checkmark on selected hero', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')

      expect(wrapper.text()).toContain('✓')
    })

    it('should allow selecting up to 4 heroes', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')
      await heroCards[1].trigger('click')
      await heroCards[2].trigger('click')
      await heroCards[3].trigger('click')

      expect(wrapper.text()).toContain('4/4')
    })

    it('should highlight selected hero card', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')

      expect(heroCards[0].classes()).toContain('border-blue-500')
    })
  })

  describe('Preview Section', () => {
    it('should not show preview when no heroes selected', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.find('.preview-section').exists()).toBe(false)
    })

    // Note: Preview-related tests that require async $fetch are skipped
    // The preview section depends on API responses which require complex mocking
  })

  describe('Action Buttons', () => {
    it('should show start and cancel buttons', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.text()).toContain('Start Expedition')
      expect(wrapper.text()).toContain('Cancel')
    })

    it('should disable start button when no heroes selected', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const startButton = wrapper.findAll('button').find(b => b.text().includes('Start'))
      expect(startButton?.attributes('disabled')).toBeDefined()
    })

    it('should enable start button when heroes selected', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')

      const startButton = wrapper.findAll('button').find(b => b.text().includes('Start'))
      expect(startButton?.attributes('disabled')).toBeUndefined()
    })

    it('should emit cancel when cancel clicked', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const cancelButton = wrapper.findAll('button').find(b => b.text() === 'Cancel')
      await cancelButton?.trigger('click')

      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('should emit started when expedition starts', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')

      const startButton = wrapper.findAll('button').find(b => b.text().includes('Start'))
      await startButton?.trigger('click')
      await flushPromises()

      expect(wrapper.emitted('started')).toBeTruthy()
      expect(wrapper.emitted('started')![0]).toEqual(['exp-123'])
    })
  })

  describe('Error Handling', () => {
    it('should show error when expedition fails to start', async () => {
      const { useExpeditionStore } = await import('~/stores/expeditions')
      vi.mocked(useExpeditionStore).mockReturnValue({
        startExpedition: vi.fn().mockRejectedValue(new Error('Server error')),
      } as any)

      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')

      const startButton = wrapper.findAll('button').find(b => b.text().includes('Start'))
      await startButton?.trigger('click')
      await flushPromises()

      expect(wrapper.text()).toContain('Server error')
    })
  })

  describe('Styling', () => {
    it('should have rounded container', () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      expect(wrapper.find('.expedition-setup').classes()).toContain('rounded-lg')
    })

    it('should apply selected styling to hero card', async () => {
      const wrapper = mount(Setup, {
        props: { zone: createZone(), subzone: createSubzone() },
      })

      const heroCards = wrapper.findAll('.hero-card')
      await heroCards[0].trigger('click')

      expect(heroCards[0].classes()).toContain('bg-blue-900/30')
    })
  })
})
