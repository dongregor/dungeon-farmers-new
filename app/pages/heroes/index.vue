<script setup lang="ts">
import { useHeroStore } from '~/stores/heroes'
import { storeToRefs } from 'pinia'
import type { Hero, Rarity, Archetype } from '~~/types'

definePageMeta({
  title: 'Hero Roster',
})

const heroStore = useHeroStore()
const { heroes, loading, error } = storeToRefs(heroStore)

// Filters
const searchQuery = ref('')
const filterRarity = ref<Rarity | 'all'>('all')
const filterArchetype = ref<Archetype | 'all'>('all')
const filterStatus = ref<'all' | 'available' | 'expedition' | 'stationed'>('all')
const sortBy = ref<'name' | 'level' | 'power' | 'rarity'>('level')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Rarity and archetype options
const rarityOptions: Array<Rarity | 'all'> = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary']
const archetypeOptions: Array<Archetype | 'all'> = ['all', 'tank', 'healer', 'debuffer', 'melee_dps', 'ranged_dps', 'caster']

// Rarity order for sorting
const rarityOrder: Record<Rarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
}

// Filtered and sorted heroes
const filteredHeroes = computed(() => {
  let result = [...heroes.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(h =>
      h.name.toLowerCase().includes(query) ||
      h.archetype.toLowerCase().includes(query)
    )
  }

  // Rarity filter
  if (filterRarity.value !== 'all') {
    result = result.filter(h => h.rarity === filterRarity.value)
  }

  // Archetype filter
  if (filterArchetype.value !== 'all') {
    result = result.filter(h => h.archetype === filterArchetype.value)
  }

  // Status filter
  if (filterStatus.value !== 'all') {
    switch (filterStatus.value) {
      case 'available':
        result = result.filter(h => !h.isOnExpedition && !h.isStationed)
        break
      case 'expedition':
        result = result.filter(h => h.isOnExpedition)
        break
      case 'stationed':
        result = result.filter(h => h.isStationed)
        break
    }
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0

    switch (sortBy.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'level':
        comparison = a.level - b.level
        break
      case 'power':
        comparison = a.power - b.power
        break
      case 'rarity':
        comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        break
    }

    return sortOrder.value === 'desc' ? -comparison : comparison
  })

  return result
})

// Stats
const heroStats = computed(() => ({
  total: heroes.value.length,
  available: heroes.value.filter(h => !h.isOnExpedition && !h.isStationed).length,
  onExpedition: heroes.value.filter(h => h.isOnExpedition).length,
  stationed: heroes.value.filter(h => h.isStationed).length,
  canPrestige: heroes.value.filter(h => h.level >= 60).length,
}))

// Toggle sort order
const toggleSort = (field: typeof sortBy.value) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
}

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  filterRarity.value = 'all'
  filterArchetype.value = 'all'
  filterStatus.value = 'all'
}

// Fetch heroes on mount
onMounted(() => {
  heroStore.fetchHeroes()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Hero Roster</h1>
        <p class="text-gray-600">Manage your guild's heroes</p>
      </div>
      <NuxtLink
        to="/tavern"
        class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <span class="text-xl">🍺</span>
        <span>Visit Tavern</span>
      </NuxtLink>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <p class="text-2xl font-bold text-gray-800">{{ heroStats.total }}</p>
        <p class="text-sm text-gray-600">Total Heroes</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <p class="text-2xl font-bold text-green-600">{{ heroStats.available }}</p>
        <p class="text-sm text-gray-600">Available</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <p class="text-2xl font-bold text-blue-600">{{ heroStats.onExpedition }}</p>
        <p class="text-sm text-gray-600">On Expedition</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <p class="text-2xl font-bold text-purple-600">{{ heroStats.stationed }}</p>
        <p class="text-sm text-gray-600">Stationed</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <p class="text-2xl font-bold text-yellow-600">{{ heroStats.canPrestige }}</p>
        <p class="text-sm text-gray-600">Can Prestige</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="flex flex-wrap gap-4 items-end">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Rarity Filter -->
        <div class="w-40">
          <label class="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
          <select
            v-model="filterRarity"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize"
          >
            <option v-for="rarity in rarityOptions" :key="rarity" :value="rarity" class="capitalize">
              {{ rarity === 'all' ? 'All Rarities' : rarity }}
            </option>
          </select>
        </div>

        <!-- Archetype Filter -->
        <div class="w-40">
          <label class="block text-sm font-medium text-gray-700 mb-1">Archetype</label>
          <select
            v-model="filterArchetype"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="archetype in archetypeOptions" :key="archetype" :value="archetype">
              {{ archetype === 'all' ? 'All Classes' : archetype.replace('_', ' ') }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="w-40">
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="expedition">On Expedition</option>
            <option value="stationed">Stationed</option>
          </select>
        </div>

        <!-- Clear Filters -->
        <button
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <!-- Sort Options -->
      <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
        <span class="text-sm text-gray-600">Sort by:</span>
        <div class="flex gap-2">
          <button
            v-for="option in [
              { value: 'level', label: 'Level' },
              { value: 'power', label: 'Power' },
              { value: 'rarity', label: 'Rarity' },
              { value: 'name', label: 'Name' },
            ]"
            :key="option.value"
            @click="toggleSort(option.value as typeof sortBy)"
            class="px-3 py-1 text-sm rounded-lg transition-colors"
            :class="sortBy === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ option.label }}
            <span v-if="sortBy === option.value" class="ml-1">
              {{ sortOrder === 'desc' ? '↓' : '↑' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="heroStore.fetchHeroes()"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Heroes Grid -->
    <div v-else-if="filteredHeroes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <NuxtLink
        v-for="hero in filteredHeroes"
        :key="hero.id"
        :to="`/heroes/${hero.id}`"
        class="block transition-transform hover:scale-[1.02]"
      >
        <HeroCard :hero="hero" :show-details="false" />
        <!-- Status badge -->
        <div class="relative -mt-2">
          <div
            v-if="hero.isOnExpedition"
            class="absolute right-2 top-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
          >
            On Expedition
          </div>
          <div
            v-else-if="hero.isStationed"
            class="absolute right-2 top-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-full"
          >
            Stationed
          </div>
          <div
            v-else-if="hero.level >= 60"
            class="absolute right-2 top-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full"
          >
            Can Prestige
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow p-12 text-center">
      <div class="text-6xl mb-4">👥</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        {{ heroes.length === 0 ? 'No Heroes Yet' : 'No Matching Heroes' }}
      </h2>
      <p class="text-gray-600 mb-6">
        {{ heroes.length === 0
          ? 'Visit the tavern to recruit your first hero!'
          : 'Try adjusting your filters to find heroes.'
        }}
      </p>
      <NuxtLink
        v-if="heroes.length === 0"
        to="/tavern"
        class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Visit Tavern
      </NuxtLink>
      <button
        v-else
        @click="clearFilters"
        class="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>
