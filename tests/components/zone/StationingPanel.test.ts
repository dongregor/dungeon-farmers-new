import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import StationingPanel from '~/components/zone/StationingPanel.vue'
import type { Hero } from '~/types'

// Mock alert
vi.stubGlobal('alert', vi.fn())

// Create reactive refs for store state
const capacityRef = ref({ currentStationedCount: 2 })
const limitsRef = ref({ globalCap: 10, perZoneCap: 3 })
const byZoneFn = vi.fn(() => [])
const readyToCollectRef = ref(0)
const heroesRef = ref<Hero[]>([])

// Mock the stores
const mockStationingStore = {
  get capacity() { return capacityRef.value },
  set capacity(val) { capacityRef.value = val },
  get limits() { return limitsRef.value },
  set limits(val) { limitsRef.value = val },
  byZone: byZoneFn,
  get readyToCollectCount() { return readyToCollectRef.value },
  set readyToCollectCount(val) { readyToCollectRef.value = val },
  canStationMore: true,
  canStationInZone: vi.fn(() => true),
  isHeroStationed: vi.fn(() => false),
  getStationedHero: vi.fn(() => null),
  fetchStationed: vi.fn(),
  stationHero: vi.fn(),
  recallHero: vi.fn(),
  collectRewards: vi.fn(),
  collectAllRewards: vi.fn(),
}

const mockHeroStore = {
  get heroes() { return heroesRef.value },
  set heroes(val) { heroesRef.value = val },
}

vi.mock('~/stores/stationing', () => ({
  useStationingStore: () => mockStationingStore,
}))

vi.mock('~/stores/heroes', () => ({
  useHeroStore: () => mockHeroStore,
}))

vi.mock('pinia', () => ({
  storeToRefs: (store: any) => {
    if ('heroes' in store) {
      return { heroes: heroesRef }
    }
    return {
      capacity: capacityRef,
      limits: limitsRef,
      byZone: computed(() => byZoneFn),
      readyToCollectCount: readyToCollectRef,
    }
  },
}))

describe('StationingPanel', () => {
  const createHero = (overrides: Partial<Hero> = {}): Hero => ({
    id: 'hero-1',
    name: 'Sir Lancelot',
    level: 20,
    xp: 1000,
    archetype: 'tank',
    rarity: 'rare',
    status: 'idle',
    morale: 75,
    stats: { combat: 30, utility: 15, survival: 25 },
    prestigeLevel: 1,
    traitIds: [],
    storyTraitIds: [],
    equipmentIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    playerId: 'player-1',
    lastExpeditionAt: null,
    ...overrides,
  })

  const createStationedData = (heroId: string) => ({
    heroId,
    zoneId: 'zone-1',
    stationedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    lastCollectedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  })

  beforeEach(() => {
    vi.clearAllMocks()
    byZoneFn.mockReturnValue([])
    mockStationingStore.canStationMore = true
    mockStationingStore.canStationInZone.mockReturnValue(true)
    capacityRef.value = { currentStationedCount: 2 }
    limitsRef.value = { globalCap: 10, perZoneCap: 3 }
    readyToCollectRef.value = 0
    heroesRef.value = []
  })

  describe('Header', () => {
    it('should display title', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Verdant Woods' },
      })

      expect(wrapper.text()).toContain('Stationed Heroes')
    })

    it('should display zone name', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Verdant Woods' },
      })

      expect(wrapper.text()).toContain('Verdant Woods')
    })

    it('should show global capacity', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Global: 2 / 10')
    })

    it('should show zone capacity', () => {
      byZoneFn.mockReturnValue([createStationedData('hero-1')])

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('This Zone: 1 / 3')
    })

    it('should have gradient header', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.find('.bg-gradient-to-r.from-green-400').exists()).toBe(true)
    })

    it('should fetch stationed on mount', () => {
      mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(mockStationingStore.fetchStationed).toHaveBeenCalled()
    })
  })

  describe('Empty State', () => {
    it('should show empty message when no heroes stationed', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('No heroes stationed in this zone')
      expect(wrapper.text()).toContain('🏕️')
    })
  })

  describe('Stationed Heroes List', () => {
    it('should display stationed hero name', () => {
      const hero = createHero({ id: 'hero-1', name: 'Sir Test' })
      heroesRef.value = [hero]
      byZoneFn.mockReturnValue([createStationedData('hero-1')])
      mockStationingStore.getStationedHero.mockReturnValue(createStationedData('hero-1'))

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Sir Test')
    })

    it('should display hero archetype', () => {
      const hero = createHero({ id: 'hero-1', archetype: 'tank' })
      heroesRef.value = [hero]
      byZoneFn.mockReturnValue([createStationedData('hero-1')])
      mockStationingStore.getStationedHero.mockReturnValue(createStationedData('hero-1'))

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('tank')
    })

    it('should show stationed duration', () => {
      const hero = createHero({ id: 'hero-1' })
      heroesRef.value = [hero]
      byZoneFn.mockReturnValue([createStationedData('hero-1')])
      mockStationingStore.getStationedHero.mockReturnValue(createStationedData('hero-1'))

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Stationed for:')
    })

    it('should show generating info', () => {
      const hero = createHero({ id: 'hero-1' })
      heroesRef.value = [hero]
      byZoneFn.mockReturnValue([createStationedData('hero-1')])
      mockStationingStore.getStationedHero.mockReturnValue(createStationedData('hero-1'))

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Generating:')
      expect(wrapper.text()).toContain('Zone materials')
    })

    it('should have recall button', () => {
      const hero = createHero({ id: 'hero-1' })
      heroesRef.value = [hero]
      byZoneFn.mockReturnValue([createStationedData('hero-1')])
      mockStationingStore.getStationedHero.mockReturnValue(createStationedData('hero-1'))

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Recall')
    })

    it('should show collect button when ready', () => {
      const hero = createHero({ id: 'hero-1' })
      heroesRef.value = [hero]
      const stationedData = createStationedData('hero-1')
      byZoneFn.mockReturnValue([stationedData])
      mockStationingStore.getStationedHero.mockReturnValue(stationedData)

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      // lastCollectedAt is 2 hours ago, so collect should be available
      expect(wrapper.text()).toContain('Collect')
    })
  })

  describe('Station Hero Button', () => {
    it('should show station button when can station more', () => {
      mockStationingStore.canStationMore = true
      mockStationingStore.canStationInZone.mockReturnValue(true)

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('+ Station Hero')
    })

    it('should show global limit message when at global cap', () => {
      mockStationingStore.canStationMore = false
      mockStationingStore.canStationInZone.mockReturnValue(true)

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Global limit reached')
    })

    it('should show zone limit message when at zone cap', () => {
      mockStationingStore.canStationMore = true
      mockStationingStore.canStationInZone.mockReturnValue(false)

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Zone limit reached')
    })

    it('should open modal when station button clicked', async () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const stationBtn = wrapper.findAll('button').find(b => b.text().includes('Station Hero'))
      await stationBtn?.trigger('click')

      expect(wrapper.text()).toContain('Select Hero to Station')
    })
  })

  describe('Station Hero Modal', () => {
    it('should show available heroes', async () => {
      const hero = createHero({ id: 'hero-1', name: 'Available Hero' })
      heroesRef.value = [hero]

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const stationBtn = wrapper.findAll('button').find(b => b.text().includes('Station Hero'))
      await stationBtn?.trigger('click')

      expect(wrapper.text()).toContain('Available Hero')
    })

    it('should show hero stats in modal', async () => {
      const hero = createHero({ id: 'hero-1', level: 15, stats: { combat: 10, utility: 10, survival: 30 } })
      heroesRef.value = [hero]

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const stationBtn = wrapper.findAll('button').find(b => b.text().includes('Station Hero'))
      await stationBtn?.trigger('click')

      expect(wrapper.text()).toContain('Lv15')
      expect(wrapper.text()).toContain('Survival: 30')
    })

    it('should show empty message when no available heroes', async () => {
      heroesRef.value = []

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const stationBtn = wrapper.findAll('button').find(b => b.text().includes('Station Hero'))
      await stationBtn?.trigger('click')

      expect(wrapper.text()).toContain('No available heroes')
      expect(wrapper.text()).toContain('Heroes must be rested')
    })

    it('should have cancel button', async () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const stationBtn = wrapper.findAll('button').find(b => b.text().includes('Station Hero'))
      await stationBtn?.trigger('click')

      expect(wrapper.text()).toContain('Cancel')
    })

    it('should close modal on cancel', async () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const stationBtn = wrapper.findAll('button').find(b => b.text().includes('Station Hero'))
      await stationBtn?.trigger('click')

      const cancelBtn = wrapper.findAll('button').find(b => b.text() === 'Cancel')
      await cancelBtn?.trigger('click')

      expect(wrapper.text()).not.toContain('Select Hero to Station')
    })
  })

  describe('Collect All Button', () => {
    it('should show collect all when rewards available', () => {
      readyToCollectRef.value = 3

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).toContain('Collect All Rewards (3)')
    })

    it('should not show collect all when no rewards', () => {
      readyToCollectRef.value = 0

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.text()).not.toContain('Collect All Rewards')
    })

    it('should call collectAllRewards when clicked', async () => {
      readyToCollectRef.value = 2
      mockStationingStore.collectAllRewards.mockResolvedValue({
        collected: 2,
        totalRewards: { materials: [] },
        autoRecalled: [],
      })

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const collectAllBtn = wrapper.findAll('button').find(b => b.text().includes('Collect All'))
      await collectAllBtn?.trigger('click')

      expect(mockStationingStore.collectAllRewards).toHaveBeenCalled()
    })
  })

  describe('Rewards Modal', () => {
    it('should show rewards modal after collecting', async () => {
      const hero = createHero({ id: 'hero-1' })
      heroesRef.value = [hero]
      byZoneFn.mockReturnValue([createStationedData('hero-1')])
      mockStationingStore.getStationedHero.mockReturnValue(createStationedData('hero-1'))
      mockStationingStore.recallHero.mockResolvedValue({
        rewards: {
          materials: [{ id: 'mat-1', name: 'Wood', count: 5 }],
          familiarityGain: 10,
        },
      })

      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      const recallBtn = wrapper.findAll('button').find(b => b.text() === 'Recall')
      await recallBtn?.trigger('click')

      expect(wrapper.text()).toContain('Rewards Collected!')
    })
  })

  describe('Styling', () => {
    it('should have white background', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('should have rounded corners', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })

    it('should have shadow', () => {
      const wrapper = mount(StationingPanel, {
        props: { zoneId: 'zone-1', zoneName: 'Test Zone' },
      })

      expect(wrapper.find('.shadow-md').exists()).toBe(true)
    })
  })
})
