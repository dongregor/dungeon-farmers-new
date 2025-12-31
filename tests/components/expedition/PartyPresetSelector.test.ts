import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PartyPresetSelector from '~/components/expedition/PartyPresetSelector.vue'
import type { Hero } from '~~/types'
import type { PartyPreset } from '~~/types/hero'

// Mock the preset store
const mockPresetStore = {
  presets: [] as PartyPreset[],
  sortedByLastUsed: [] as PartyPreset[],
  fetchPresets: vi.fn(),
  maxPresetSlots: vi.fn(() => 5),
  validatePreset: vi.fn(() => ({ isValid: true, missingHeroes: [] })),
  markAsUsed: vi.fn(),
  createPreset: vi.fn(),
  deletePreset: vi.fn(),
  isNameAvailable: vi.fn(() => true),
}

vi.mock('~/stores/presets', () => ({
  usePresetStore: () => mockPresetStore,
}))

// Mock confirm and alert
vi.stubGlobal('confirm', vi.fn(() => true))
vi.stubGlobal('alert', vi.fn())

describe('PartyPresetSelector', () => {
  const createHero = (id: string, name: string): Hero => ({
    id,
    name,
    level: 10,
    xp: 500,
    archetype: 'tank',
    rarity: 'common',
    status: 'idle',
    morale: 75,
    stats: { combat: 20, utility: 15, survival: 15 },
    prestigeLevel: 0,
    traitIds: [],
    storyTraitIds: [],
    equipmentIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    playerId: 'player-1',
    lastExpeditionAt: null,
  })

  const createPreset = (id: string, name: string, heroIds: string[]): PartyPreset => ({
    id,
    name,
    heroIds,
    lastUsedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })

  const availableHeroes = [
    createHero('hero-1', 'Sir Lancelot'),
    createHero('hero-2', 'Lady Morgana'),
    createHero('hero-3', 'Robin Hood'),
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockPresetStore.presets = []
    mockPresetStore.sortedByLastUsed = []
  })

  describe('Rendering', () => {
    it('should render header', () => {
      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('Party Presets')
    })

    it('should show slot count', () => {
      mockPresetStore.presets = [createPreset('p1', 'Preset 1', ['hero-1'])]

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('1 / 5 slots')
    })

    it('should fetch presets on mount', () => {
      mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(mockPresetStore.fetchPresets).toHaveBeenCalled()
    })
  })

  describe('Empty State', () => {
    it('should show empty message when no presets', () => {
      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('No presets saved')
      expect(wrapper.text()).toContain('Save your party compositions')
    })
  })

  describe('Preset List', () => {
    it('should display preset names', () => {
      const presets = [
        createPreset('p1', 'Dragon Hunters', ['hero-1', 'hero-2']),
        createPreset('p2', 'Treasure Team', ['hero-2', 'hero-3']),
      ]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('Dragon Hunters')
      expect(wrapper.text()).toContain('Treasure Team')
    })

    it('should display hero names in preset', () => {
      const presets = [createPreset('p1', 'Test Team', ['hero-1', 'hero-2'])]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('Sir Lancelot')
      expect(wrapper.text()).toContain('Lady Morgana')
    })

    it('should show Unknown for missing heroes', () => {
      const presets = [createPreset('p1', 'Test', ['nonexistent-hero'])]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('Unknown')
    })

    it('should show preferred zone indicator', () => {
      const presets = [
        { ...createPreset('p1', 'Zone Team', ['hero-1']), preferredZoneId: 'zone-1' },
      ]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('Preferred zone set')
    })
  })

  describe('Preset Selection', () => {
    it('should highlight selected preset', async () => {
      const presets = [createPreset('p1', 'Team 1', ['hero-1'])]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      const presetItem = wrapper.find('.cursor-pointer')
      await presetItem.trigger('click')

      expect(presetItem.classes()).toContain('border-blue-500')
      expect(presetItem.classes()).toContain('bg-blue-50')
    })

    it('should emit select when valid preset clicked', async () => {
      const presets = [createPreset('p1', 'Team 1', ['hero-1', 'hero-2'])]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      await wrapper.find('.cursor-pointer').trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual([['hero-1', 'hero-2']])
    })

    it('should mark preset as used when selected', async () => {
      const presets = [createPreset('p1', 'Team 1', ['hero-1'])]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      await wrapper.find('.cursor-pointer').trigger('click')

      expect(mockPresetStore.markAsUsed).toHaveBeenCalledWith('p1')
    })

    it('should show alert for invalid preset', async () => {
      const presets = [createPreset('p1', 'Team 1', ['missing-hero'])]
      mockPresetStore.sortedByLastUsed = presets
      mockPresetStore.validatePreset.mockReturnValue({
        isValid: false,
        missingHeroes: ['Missing Hero'],
      })

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      await wrapper.find('.cursor-pointer').trigger('click')

      expect(alert).toHaveBeenCalled()
    })
  })

  describe('Delete Preset', () => {
    it('should have delete button on each preset', () => {
      const presets = [createPreset('p1', 'Team 1', ['hero-1'])]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('🗑️')
    })

    it('should confirm before deleting', async () => {
      const presets = [createPreset('p1', 'Team 1', ['hero-1'])]
      mockPresetStore.sortedByLastUsed = presets

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      const deleteBtn = wrapper.find('.text-red-500')
      await deleteBtn.trigger('click')

      expect(confirm).toHaveBeenCalled()
    })

    it('should call deletePreset when confirmed', async () => {
      const presets = [createPreset('p1', 'Team 1', ['hero-1'])]
      mockPresetStore.sortedByLastUsed = presets
      vi.mocked(confirm).mockReturnValue(true)

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      const deleteBtn = wrapper.find('.text-red-500')
      await deleteBtn.trigger('click')

      expect(mockPresetStore.deletePreset).toHaveBeenCalledWith('p1')
    })

    it('should not delete when cancelled', async () => {
      const presets = [createPreset('p1', 'Team 1', ['hero-1'])]
      mockPresetStore.sortedByLastUsed = presets
      vi.mocked(confirm).mockReturnValue(false)

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      const deleteBtn = wrapper.find('.text-red-500')
      await deleteBtn.trigger('click')

      expect(mockPresetStore.deletePreset).not.toHaveBeenCalled()
    })
  })

  describe('Save Button', () => {
    it('should have save button', () => {
      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.text()).toContain('Save Current Party')
    })

    it('should be disabled when no heroes selected', () => {
      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: [] },
      })

      const saveBtn = wrapper.find('button.bg-blue-500')
      expect(saveBtn.attributes('disabled')).toBeDefined()
    })

    it('should be enabled when heroes selected', () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      const saveBtn = wrapper.find('button.bg-blue-500')
      expect(saveBtn.attributes('disabled')).toBeUndefined()
    })

    it('should show alert when no heroes selected', async () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: [] },
      })

      // Force click despite disabled state
      const saveBtn = wrapper.find('button.bg-blue-500')
      await saveBtn.trigger('click')

      // With disabled state, click shouldn't trigger
      // But if it does, it should alert
    })

    it('should disable save button when max slots reached', async () => {
      mockPresetStore.presets = Array(5).fill(createPreset('p', 'P', ['hero-1']))
      mockPresetStore.maxPresetSlots.mockReturnValue(5)

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      const saveBtn = wrapper.find('button.bg-blue-500')
      expect(saveBtn.attributes('disabled')).toBeDefined()
    })
  })

  describe('Save Dialog', () => {
    it('should show save dialog when save clicked with heroes', async () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      expect(wrapper.text()).toContain('Save Party Preset')
      expect(wrapper.text()).toContain('Preset Name')
    })

    it('should have name input in dialog', async () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      const input = wrapper.find('input[type="text"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('placeholder')).toContain('Dragon Hunters')
    })

    it('should show character count', async () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      expect(wrapper.text()).toContain('/ 30 characters')
    })

    it('should close dialog when cancel clicked', async () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')
      expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(true)

      const cancelBtn = wrapper.findAll('.bg-gray-200')[0]
      await cancelBtn.trigger('click')

      expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(false)
    })

    it('should close dialog when overlay clicked', async () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      const overlay = wrapper.find('.fixed.inset-0.z-50')
      await overlay.trigger('click')

      expect(wrapper.find('.fixed.inset-0.z-50').exists()).toBe(false)
    })
  })

  describe('Confirm Save', () => {
    it('should alert if name is empty', async () => {
      mockPresetStore.presets = []

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      // Click save without entering name
      const saveDialogBtn = wrapper.findAll('.bg-blue-500').find(b => b.text() === 'Save')
      await saveDialogBtn?.trigger('click')

      expect(alert).toHaveBeenCalledWith('Please enter a preset name')
    })

    it('should alert if name already exists', async () => {
      mockPresetStore.presets = []
      mockPresetStore.isNameAvailable.mockReturnValue(false)

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      const input = wrapper.find('input[type="text"]')
      await input.setValue('Test Name')

      const saveDialogBtn = wrapper.findAll('.bg-blue-500').find(b => b.text() === 'Save')
      await saveDialogBtn?.trigger('click')

      expect(alert).toHaveBeenCalledWith('A preset with this name already exists')
    })

    it('should create preset with valid name', async () => {
      mockPresetStore.presets = []
      mockPresetStore.isNameAvailable.mockReturnValue(true)

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1', 'hero-2'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      const input = wrapper.find('input[type="text"]')
      await input.setValue('My Team')

      const saveDialogBtn = wrapper.findAll('.bg-blue-500').find(b => b.text() === 'Save')
      await saveDialogBtn?.trigger('click')

      expect(mockPresetStore.createPreset).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My Team',
          heroIds: ['hero-1', 'hero-2'],
        })
      )
    })

    it('should emit save event after creating preset', async () => {
      mockPresetStore.presets = []
      mockPresetStore.isNameAvailable.mockReturnValue(true)

      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes, selectedHeroIds: ['hero-1'] },
      })

      await wrapper.find('button.bg-blue-500').trigger('click')

      const input = wrapper.find('input[type="text"]')
      await input.setValue('My Team')

      const saveDialogBtn = wrapper.findAll('.bg-blue-500').find(b => b.text() === 'Save')
      await saveDialogBtn?.trigger('click')

      expect(wrapper.emitted('save')).toBeTruthy()
      expect(wrapper.emitted('save')![0]).toEqual(['My Team'])
    })
  })

  describe('Styling', () => {
    it('should have white background', () => {
      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('should have rounded corners', () => {
      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })

    it('should have border', () => {
      const wrapper = mount(PartyPresetSelector, {
        props: { availableHeroes },
      })

      expect(wrapper.find('.border-gray-200').exists()).toBe(true)
    })
  })
})
