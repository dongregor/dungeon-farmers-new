import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import InventoryGrid from '~/components/equipment/InventoryGrid.vue'
import type { Equipment, EquipmentSlot, EquipmentRarity } from '~~/types'

// EquipmentCard stub component
const EquipmentCardStub = {
  name: 'EquipmentCard',
  props: ['equipment', 'showDetails', 'clickable'],
  emits: ['click'],
  setup(props: any, { emit }: any) {
    return () => h('div', {
      class: 'equipment-card',
      onClick: () => emit('click', props.equipment),
    }, props.equipment.name)
  },
}

// Global stubs config
const globalStubs = {
  global: {
    stubs: {
      EquipmentCard: EquipmentCardStub,
    },
  },
}

describe('InventoryGrid', () => {
  const createEquipment = (overrides: Partial<Equipment> = {}): Equipment => ({
    id: 'eq-' + Math.random().toString(36).substr(2, 9),
    name: 'Iron Sword',
    slot: 'weapon',
    rarity: 'common',
    itemLevel: 10,
    gearScore: 100,
    stats: { combat: 10, utility: 0, survival: 5 },
    bonuses: [],
    isEquipped: false,
    equippedByHeroId: null,
    playerId: 'player-1',
    sourceZoneId: 'verdant_woods',
    sourceSubzoneId: 'woods_edge',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  })

  const createEquipmentList = (): Equipment[] => [
    createEquipment({ id: 'eq-1', name: 'Iron Sword', slot: 'weapon', rarity: 'common', gearScore: 100, itemLevel: 10 }),
    createEquipment({ id: 'eq-2', name: 'Steel Helm', slot: 'head', rarity: 'uncommon', gearScore: 150, itemLevel: 15 }),
    createEquipment({ id: 'eq-3', name: 'Mithril Chest', slot: 'chest', rarity: 'rare', gearScore: 250, itemLevel: 25 }),
    createEquipment({ id: 'eq-4', name: 'Dragon Gauntlets', slot: 'hands', rarity: 'epic', gearScore: 400, itemLevel: 40 }),
    createEquipment({ id: 'eq-5', name: 'Legendary Boots', slot: 'feet', rarity: 'legendary', gearScore: 600, itemLevel: 50, isEquipped: true }),
    createEquipment({ id: 'eq-6', name: 'Fire Staff', slot: 'weapon', rarity: 'epic', gearScore: 450, itemLevel: 45 }),
  ]

  describe('Rendering', () => {
    it('should render filter section', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('Slot')
      expect(wrapper.text()).toContain('Rarity')
      expect(wrapper.text()).toContain('Sort By')
    })

    it('should render slot filter dropdown', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const selects = wrapper.findAll('select')
      expect(selects.length).toBeGreaterThan(0)
      expect(wrapper.text()).toContain('All Slots')
    })

    it('should render rarity filter dropdown', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('All Rarities')
    })

    it('should render sort dropdown', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('Gear Score')
      expect(wrapper.text()).toContain('Item Level')
      expect(wrapper.text()).toContain('Rarity')
      expect(wrapper.text()).toContain('Name')
    })

    it('should render equipped only checkbox', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('Equipped Only')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('should show item count', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('6 items')
    })

    it('should show singular item count', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: [createEquipment()] },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('1 item')
    })
  })

  describe('Loading State', () => {
    it('should show loading message when loading', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: [], loading: true },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('Loading inventory...')
    })

    it('should not show grid when loading', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList(), loading: true },
        ...globalStubs,
      })

      expect(wrapper.find('.equipment-card').exists()).toBe(false)
    })
  })

  describe('Empty State', () => {
    it('should show empty message when no equipment', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: [] },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('No equipment found')
      expect(wrapper.text()).toContain('Your inventory is empty')
    })

    it('should show filter message when filters result in no items', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      // Select mythic rarity (none exist in test data)
      const raritySelect = wrapper.findAll('select')[1]
      await raritySelect.setValue('mythic')

      expect(wrapper.text()).toContain('No equipment found')
      expect(wrapper.text()).toContain('Try adjusting your filters')
    })
  })

  describe('Slot Filter', () => {
    it('should filter by weapon slot', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const slotSelect = wrapper.findAll('select')[0]
      await slotSelect.setValue('weapon')

      expect(wrapper.text()).toContain('2 items')
      expect(wrapper.text()).toContain('Iron Sword')
      expect(wrapper.text()).toContain('Fire Staff')
      expect(wrapper.text()).not.toContain('Steel Helm')
    })

    it('should filter by head slot', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const slotSelect = wrapper.findAll('select')[0]
      await slotSelect.setValue('head')

      expect(wrapper.text()).toContain('1 item')
      expect(wrapper.text()).toContain('Steel Helm')
    })

    it('should show all slots option', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('All Slots')
    })
  })

  describe('Rarity Filter', () => {
    it('should filter by epic rarity', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const raritySelect = wrapper.findAll('select')[1]
      await raritySelect.setValue('epic')

      expect(wrapper.text()).toContain('2 items')
      expect(wrapper.text()).toContain('Dragon Gauntlets')
      expect(wrapper.text()).toContain('Fire Staff')
    })

    it('should filter by rare rarity', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const raritySelect = wrapper.findAll('select')[1]
      await raritySelect.setValue('rare')

      expect(wrapper.text()).toContain('1 item')
      expect(wrapper.text()).toContain('Mithril Chest')
    })
  })

  describe('Equipped Filter', () => {
    it('should filter to show only equipped items', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setValue(true)

      expect(wrapper.text()).toContain('1 item')
      expect(wrapper.text()).toContain('Legendary Boots')
    })

    it('should show all items when unchecked', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.text()).toContain('6 items')
    })
  })

  describe('Sorting', () => {
    it('should sort by gear score by default (descending)', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const cards = wrapper.findAll('.equipment-card')
      // Highest gear score first: Legendary Boots (600)
      expect(cards[0].text()).toContain('Legendary Boots')
    })

    it('should sort by item level', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const sortSelect = wrapper.findAll('select')[2]
      await sortSelect.setValue('itemLevel')

      const cards = wrapper.findAll('.equipment-card')
      // Highest item level first: Legendary Boots (50)
      expect(cards[0].text()).toContain('Legendary Boots')
    })

    it('should sort by rarity', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const sortSelect = wrapper.findAll('select')[2]
      await sortSelect.setValue('rarity')

      const cards = wrapper.findAll('.equipment-card')
      // Highest rarity first: legendary
      expect(cards[0].text()).toContain('Legendary Boots')
    })

    it('should sort by name alphabetically', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      const sortSelect = wrapper.findAll('select')[2]
      await sortSelect.setValue('name')

      const cards = wrapper.findAll('.equipment-card')
      // First alphabetically: Dragon Gauntlets
      expect(cards[0].text()).toContain('Dragon Gauntlets')
    })
  })

  describe('Combined Filters', () => {
    it('should apply multiple filters together', async () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      // Filter by weapon slot AND epic rarity
      const slotSelect = wrapper.findAll('select')[0]
      const raritySelect = wrapper.findAll('select')[1]

      await slotSelect.setValue('weapon')
      await raritySelect.setValue('epic')

      expect(wrapper.text()).toContain('1 item')
      expect(wrapper.text()).toContain('Fire Staff')
    })
  })

  describe('Equipment Click', () => {
    it('should emit equipmentClick when equipment clicked', async () => {
      const equipment = createEquipmentList()
      const wrapper = mount(InventoryGrid, {
        props: { equipment },
        ...globalStubs,
      })

      const firstCard = wrapper.find('.equipment-card')
      await firstCard.trigger('click')

      expect(wrapper.emitted('equipmentClick')).toBeTruthy()
    })
  })

  describe('Available Filters', () => {
    it('should show only slots present in equipment', () => {
      const equipment = [
        createEquipment({ slot: 'weapon' }),
        createEquipment({ slot: 'head' }),
      ]
      const wrapper = mount(InventoryGrid, {
        props: { equipment },
        ...globalStubs,
      })

      const slotSelect = wrapper.findAll('select')[0]
      const options = slotSelect.findAll('option')

      // All Slots + weapon + head
      expect(options.length).toBe(3)
    })

    it('should show only rarities present in equipment', () => {
      const equipment = [
        createEquipment({ rarity: 'common' }),
        createEquipment({ rarity: 'rare' }),
      ]
      const wrapper = mount(InventoryGrid, {
        props: { equipment },
        ...globalStubs,
      })

      const raritySelect = wrapper.findAll('select')[1]
      const options = raritySelect.findAll('option')

      // All Rarities + common + rare (sorted by rarity order)
      expect(options.length).toBe(3)
    })
  })

  describe('Grid Layout', () => {
    it('should use grid layout for equipment display', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.find('.grid').exists()).toBe(true)
    })
  })

  describe('Styling', () => {
    it('should have dark background for filters', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.find('.bg-gray-800').exists()).toBe(true)
    })

    it('should have rounded corners on filter section', () => {
      const wrapper = mount(InventoryGrid, {
        props: { equipment: createEquipmentList() },
        ...globalStubs,
      })

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })
  })
})
