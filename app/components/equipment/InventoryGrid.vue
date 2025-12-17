<script setup lang="ts">
import type { Equipment, EquipmentSlot, EquipmentRarity } from '~~/types'

const props = defineProps<{
  equipment: Equipment[]
  loading?: boolean
}>()

const emit = defineEmits<{
  equipmentClick: [equipment: Equipment]
}>()

// Filters
const selectedSlot = ref<EquipmentSlot | 'all'>('all')
const selectedRarity = ref<EquipmentRarity | 'all'>('all')
const showEquippedOnly = ref(false)
const sortBy = ref<'gearScore' | 'itemLevel' | 'rarity' | 'name'>('gearScore')

// Filtered and sorted equipment
const filteredEquipment = computed(() => {
  let items = [...props.equipment]

  // Filter by slot
  if (selectedSlot.value !== 'all') {
    items = items.filter(e => e.slot === selectedSlot.value)
  }

  // Filter by rarity
  if (selectedRarity.value !== 'all') {
    items = items.filter(e => e.rarity === selectedRarity.value)
  }

  // Filter by equipped status
  if (showEquippedOnly.value) {
    items = items.filter(e => e.isEquipped)
  }

  // Sort
  items.sort((a, b) => {
    switch (sortBy.value) {
      case 'gearScore':
        return b.gearScore - a.gearScore
      case 'itemLevel':
        return b.itemLevel - a.itemLevel
      case 'rarity': {
        const rarityOrder: Record<EquipmentRarity, number> = {
          mythic: 6,
          legendary: 5,
          epic: 4,
          rare: 3,
          uncommon: 2,
          common: 1
        }
        return rarityOrder[b.rarity] - rarityOrder[a.rarity]
      }
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return items
})

// Available slots from equipment
const availableSlots = computed(() => {
  const slots = new Set(props.equipment.map(e => e.slot))
  return Array.from(slots).sort()
})

// Available rarities from equipment
const availableRarities = computed(() => {
  const rarities = new Set(props.equipment.map(e => e.rarity))
  return Array.from(rarities).sort((a, b) => {
    const order: Record<EquipmentRarity, number> = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
      mythic: 6
    }
    return order[b] - order[a]
  })
})

function handleEquipmentClick(equipment: Equipment) {
  emit('equipmentClick', equipment)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Slot Filter -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">Slot</label>
          <select
            v-model="selectedSlot"
            class="w-full bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm"
          >
            <option value="all">All Slots</option>
            <option v-for="slot in availableSlots" :key="slot" :value="slot" class="capitalize">
              {{ slot.replace(/(\d+)$/, ' $1') }}
            </option>
          </select>
        </div>

        <!-- Rarity Filter -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">Rarity</label>
          <select
            v-model="selectedRarity"
            class="w-full bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm"
          >
            <option value="all">All Rarities</option>
            <option
              v-for="rarity in availableRarities"
              :key="rarity"
              :value="rarity"
              class="capitalize"
            >
              {{ rarity }}
            </option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-xs text-gray-400 mb-1">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm"
          >
            <option value="gearScore">Gear Score</option>
            <option value="itemLevel">Item Level</option>
            <option value="rarity">Rarity</option>
            <option value="name">Name</option>
          </select>
        </div>

        <!-- Equipped Filter -->
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="showEquippedOnly"
              type="checkbox"
              class="form-checkbox h-4 w-4 text-guild-gold rounded"
            />
            <span class="text-sm text-gray-300">Equipped Only</span>
          </label>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mt-3 text-xs text-gray-400">
        {{ filteredEquipment.length }} item{{ filteredEquipment.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-400">Loading inventory...</div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredEquipment.length === 0"
      class="bg-gray-800 rounded-lg p-12 text-center"
    >
      <div class="text-gray-400 mb-2">No equipment found</div>
      <div class="text-sm text-gray-500">
        {{ equipment.length === 0 ? 'Your inventory is empty' : 'Try adjusting your filters' }}
      </div>
    </div>

    <!-- Equipment Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <EquipmentCard
        v-for="item in filteredEquipment"
        :key="item.id"
        :equipment="item"
        :show-details="true"
        :clickable="true"
        @click="handleEquipmentClick"
      />
    </div>
  </div>
</template>
