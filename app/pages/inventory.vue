<script setup lang="ts">
import { useInventoryStore } from '~/stores/inventory'
import { useHeroStore } from '~/stores/heroes'
import { storeToRefs } from 'pinia'
import type { Equipment, EquipmentRarity, EquipmentSlot } from '~~/types'

definePageMeta({
  title: 'Inventory',
})

const inventoryStore = useInventoryStore()
const heroStore = useHeroStore()

const { inventory, loading } = storeToRefs(inventoryStore)
const { heroes } = storeToRefs(heroStore)

// Filters
const filterSlot = ref<EquipmentSlot | 'all'>('all')
const filterRarity = ref<EquipmentRarity | 'all'>('all')
const filterEquipped = ref<'all' | 'equipped' | 'unequipped'>('all')
const sortBy = ref<'name' | 'rarity' | 'itemLevel' | 'gearScore'>('gearScore')
const searchQuery = ref('')

// Selected equipment for details
const selectedEquipment = ref<Equipment | null>(null)
const showEquipModal = ref(false)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    inventoryStore.fetchInventory(),
    heroStore.fetchHeroes(),
  ])
})

// Computed
const filteredAndSortedEquipment = computed(() => {
  let filtered = [...inventory.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  // Slot filter
  if (filterSlot.value !== 'all') {
    filtered = filtered.filter(item => item.slot === filterSlot.value)
  }

  // Rarity filter
  if (filterRarity.value !== 'all') {
    filtered = filtered.filter(item => item.rarity === filterRarity.value)
  }

  // Equipped filter
  if (filterEquipped.value === 'equipped') {
    filtered = filtered.filter(item => item.isEquipped)
  } else if (filterEquipped.value === 'unequipped') {
    filtered = filtered.filter(item => !item.isEquipped)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'itemLevel':
        return b.itemLevel - a.itemLevel
      case 'gearScore':
        return b.gearScore - a.gearScore
      case 'rarity': {
        const rarityOrder: Record<EquipmentRarity, number> = {
          common: 0,
          uncommon: 1,
          rare: 2,
          epic: 3,
          legendary: 4,
          mythic: 5,
        }
        return rarityOrder[b.rarity] - rarityOrder[a.rarity]
      }
      default:
        return 0
    }
  })

  return filtered
})

const inventoryStats = computed(() => {
  const total = inventory.value.length
  const equipped = inventory.value.filter(e => e.isEquipped).length
  const unequipped = total - equipped

  return { total, equipped, unequipped }
})

// Methods
const handleSelectEquipment = (equipment: Equipment) => {
  selectedEquipment.value = equipment
  showEquipModal.value = true
}

const handleEquip = async (heroId: string) => {
  if (!selectedEquipment.value) return

  try {
    await inventoryStore.equipItem(selectedEquipment.value.id, heroId)
    await heroStore.fetchHeroes()
    showEquipModal.value = false
    selectedEquipment.value = null
  } catch (error) {
    console.error('Failed to equip item:', error)
    alert('Failed to equip item')
  }
}

const handleUnequip = async () => {
  if (!selectedEquipment.value || !selectedEquipment.value.equippedBy) return

  try {
    await inventoryStore.unequipItem(selectedEquipment.value.id)
    await heroStore.fetchHeroes()
    showEquipModal.value = false
    selectedEquipment.value = null
  } catch (error) {
    console.error('Failed to unequip item:', error)
    alert('Failed to unequip item')
  }
}

const handleDelete = async () => {
  if (!selectedEquipment.value) return

  if (!confirm(`Are you sure you want to delete ${selectedEquipment.value.name}? This cannot be undone.`)) {
    return
  }

  try {
    await inventoryStore.deleteItem(selectedEquipment.value.id)
    showEquipModal.value = false
    selectedEquipment.value = null
  } catch (error) {
    console.error('Failed to delete item:', error)
    alert('Failed to delete item')
  }
}

const getEquippedHero = (equipmentId: string) => {
  const equipment = inventory.value.find(e => e.id === equipmentId)
  if (!equipment?.equippedBy) return null
  return heroes.value.find(h => h.id === equipment.equippedBy)
}

const getRarityColor = (rarity: EquipmentRarity): string => {
  const colors: Record<EquipmentRarity, string> = {
    common: 'border-gray-400 bg-gray-50',
    uncommon: 'border-green-500 bg-green-50',
    rare: 'border-blue-500 bg-blue-50',
    epic: 'border-purple-500 bg-purple-50',
    legendary: 'border-yellow-500 bg-yellow-50',
    mythic: 'border-red-500 bg-red-50',
  }
  return colors[rarity] || colors.common
}

const getRarityTextColor = (rarity: EquipmentRarity): string => {
  const colors: Record<EquipmentRarity, string> = {
    common: 'text-gray-700',
    uncommon: 'text-green-700',
    rare: 'text-blue-700',
    epic: 'text-purple-700',
    legendary: 'text-yellow-700',
    mythic: 'text-red-700',
  }
  return colors[rarity] || colors.common
}

const getSlotIcon = (slot: EquipmentSlot): string => {
  const icons: Record<EquipmentSlot, string> = {
    weapon: '⚔️',
    head: '🪖',
    chest: '🛡️',
    hands: '🧤',
    legs: '👖',
    feet: '👢',
    accessory: '💍',
  }
  return icons[slot] || '📦'
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        Inventory
      </h1>
      <p class="text-gray-600">
        Manage your equipment and gear
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Total Items</div>
        <div class="text-3xl font-bold text-gray-800">{{ inventoryStats.total }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Equipped</div>
        <div class="text-3xl font-bold text-green-600">{{ inventoryStats.equipped }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-600">Unequipped</div>
        <div class="text-3xl font-bold text-blue-600">{{ inventoryStats.unequipped }}</div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Slot Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Slot</label>
          <select
            v-model="filterSlot"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Slots</option>
            <option value="weapon">Weapon</option>
            <option value="head">Head</option>
            <option value="chest">Chest</option>
            <option value="hands">Hands</option>
            <option value="legs">Legs</option>
            <option value="feet">Feet</option>
            <option value="accessory">Accessory</option>
          </select>
        </div>

        <!-- Rarity Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
          <select
            v-model="filterRarity"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic">Mythic</option>
          </select>
        </div>

        <!-- Equipped Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filterEquipped"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Items</option>
            <option value="equipped">Equipped</option>
            <option value="unequipped">Unequipped</option>
          </select>
        </div>
      </div>

      <!-- Sort -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <div class="flex gap-2">
          <button
            v-for="sort in [
              { value: 'gearScore', label: 'Gear Score' },
              { value: 'itemLevel', label: 'Item Level' },
              { value: 'rarity', label: 'Rarity' },
              { value: 'name', label: 'Name' },
            ]"
            :key="sort.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              sortBy === sort.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
            @click="sortBy = sort.value as any"
          >
            {{ sort.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Equipment Grid -->
    <div v-if="!loading && filteredAndSortedEquipment.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="equipment in filteredAndSortedEquipment"
        :key="equipment.id"
        :class="[
          'equipment-card rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg',
          getRarityColor(equipment.rarity)
        ]"
        @click="handleSelectEquipment(equipment)"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ getSlotIcon(equipment.slot) }}</span>
            <div>
              <div :class="['font-bold', getRarityTextColor(equipment.rarity)]">
                {{ equipment.name }}
              </div>
              <div class="text-xs text-gray-600 capitalize">
                {{ equipment.slot }} • {{ equipment.rarity }}
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="space-y-1 mb-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Item Level</span>
            <span class="font-bold text-gray-800">{{ equipment.itemLevel }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Gear Score</span>
            <span class="font-bold text-gray-800">{{ equipment.gearScore }}</span>
          </div>
        </div>

        <!-- Base Stats -->
        <div class="text-xs text-gray-700 mb-3">
          <div class="flex justify-between">
            <span>Combat</span>
            <span class="font-medium">{{ equipment.baseStats.combat }}</span>
          </div>
          <div class="flex justify-between">
            <span>Utility</span>
            <span class="font-medium">{{ equipment.baseStats.utility }}</span>
          </div>
          <div class="flex justify-between">
            <span>Survival</span>
            <span class="font-medium">{{ equipment.baseStats.survival }}</span>
          </div>
        </div>

        <!-- Equipped Status -->
        <div v-if="equipment.isEquipped" class="bg-green-100 border border-green-300 rounded px-2 py-1 text-xs text-green-800 font-medium text-center">
          Equipped by {{ getEquippedHero(equipment.id)?.name || 'Unknown' }}
        </div>
        <div v-else class="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs text-gray-600 text-center">
          Unequipped
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-white rounded-lg shadow p-12 text-center">
      <div class="text-6xl mb-4">📦</div>
      <p class="text-xl text-gray-700 mb-2">
        {{ searchQuery || filterSlot !== 'all' || filterRarity !== 'all'
          ? 'No items match your filters'
          : 'Your inventory is empty'
        }}
      </p>
      <p class="text-gray-600">
        {{ searchQuery || filterSlot !== 'all' || filterRarity !== 'all'
          ? 'Try adjusting your filters'
          : 'Complete expeditions to earn equipment'
        }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">Loading inventory...</p>
    </div>

    <!-- Equipment Detail Modal -->
    <div
      v-if="showEquipModal && selectedEquipment"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      @click.self="showEquipModal = false"
    >
      <div :class="['bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border-4', getRarityColor(selectedEquipment.rarity)]">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">{{ getSlotIcon(selectedEquipment.slot) }}</span>
            <div>
              <h2 :class="['text-2xl font-bold', getRarityTextColor(selectedEquipment.rarity)]">
                {{ selectedEquipment.name }}
              </h2>
              <p class="text-gray-600 capitalize">
                {{ selectedEquipment.slot }} • {{ selectedEquipment.rarity }}
              </p>
            </div>
          </div>
          <button
            class="text-gray-400 hover:text-gray-600 text-2xl"
            @click="showEquipModal = false"
          >
            ×
          </button>
        </div>

        <!-- Description -->
        <p class="text-gray-700 mb-6">{{ selectedEquipment.description }}</p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-sm text-gray-600">Item Level</div>
            <div class="text-2xl font-bold text-gray-800">{{ selectedEquipment.itemLevel }}</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="text-sm text-gray-600">Gear Score</div>
            <div class="text-2xl font-bold text-gray-800">{{ selectedEquipment.gearScore }}</div>
          </div>
        </div>

        <!-- Base Stats -->
        <div class="mb-6">
          <h3 class="font-bold text-gray-800 mb-3">Base Stats</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-2 bg-red-50 rounded">
              <span class="text-gray-700">⚔️ Combat</span>
              <span class="font-bold text-gray-800">{{ selectedEquipment.baseStats.combat }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span class="text-gray-700">🔧 Utility</span>
              <span class="font-bold text-gray-800">{{ selectedEquipment.baseStats.utility }}</span>
            </div>
            <div class="flex justify-between items-center p-2 bg-green-50 rounded">
              <span class="text-gray-700">❤️ Survival</span>
              <span class="font-bold text-gray-800">{{ selectedEquipment.baseStats.survival }}</span>
            </div>
          </div>
        </div>

        <!-- Traits -->
        <div v-if="selectedEquipment.traits && selectedEquipment.traits.length > 0" class="mb-6">
          <h3 class="font-bold text-gray-800 mb-3">Traits ({{ selectedEquipment.traits.length }}/{{ selectedEquipment.maxTraits }})</h3>
          <div class="space-y-2">
            <div
              v-for="(trait, index) in selectedEquipment.traits"
              :key="index"
              class="bg-purple-50 border border-purple-200 rounded-lg p-3"
            >
              <div class="font-medium text-purple-800">{{ trait.traitId }}</div>
              <div class="text-sm text-purple-600 capitalize">{{ trait.quality }} • Value: {{ trait.rolledValue }}</div>
            </div>
          </div>
        </div>

        <!-- Set Info -->
        <div v-if="selectedEquipment.setId" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">🎯</span>
            <span class="font-bold text-yellow-800">{{ selectedEquipment.setName }}</span>
          </div>
          <div class="text-sm text-yellow-700">Part of equipment set</div>
        </div>

        <!-- Source Info -->
        <div v-if="selectedEquipment.sourceZoneId" class="mb-6 text-sm text-gray-600">
          <div>Source: {{ selectedEquipment.sourceZoneId }} - {{ selectedEquipment.sourceSubzoneId }}</div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            v-if="selectedEquipment.isEquipped"
            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            @click="handleUnequip"
          >
            Unequip
          </button>
          <button
            v-else
            class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            @click="() => {}"
          >
            Equip to Hero
          </button>
          <button
            v-if="!selectedEquipment.isEquipped"
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            @click="handleDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
