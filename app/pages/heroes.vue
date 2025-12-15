<script setup lang="ts">
import { useHeroStore } from '~/stores/heroes'
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Heroes',
})

const heroStore = useHeroStore()
const { heroes, loading } = storeToRefs(heroStore)

onMounted(() => {
  heroStore.fetchHeroes()
})

const filterRarity = ref<string>('all')
const filterArchetype = ref<string>('all')
const sortBy = ref<'name' | 'level' | 'power' | 'rarity'>('power')

const filteredHeroes = computed(() => {
  let filtered = [...heroes.value]

  if (filterRarity.value !== 'all') {
    filtered = filtered.filter(h => h.rarity === filterRarity.value)
  }

  if (filterArchetype.value !== 'all') {
    filtered = filtered.filter(h => h.archetype === filterArchetype.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'level':
        return b.level - a.level
      case 'power':
        return b.power - a.power
      case 'rarity':
        const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 }
        return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0)
      default:
        return 0
    }
  })

  return filtered
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        Hero Roster
      </h1>
      <p class="text-gray-600">
        Manage your guild members
      </p>
    </div>

    <!-- Filters and sorting -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Archetype</label>
          <select
            v-model="filterArchetype"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Archetypes</option>
            <option value="warrior">Warrior</option>
            <option value="rogue">Rogue</option>
            <option value="mage">Mage</option>
            <option value="ranger">Ranger</option>
            <option value="cleric">Cleric</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="power">Power (High to Low)</option>
            <option value="level">Level (High to Low)</option>
            <option value="name">Name (A-Z)</option>
            <option value="rarity">Rarity</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Heroes grid -->
    <div v-if="!loading && filteredHeroes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="hero in filteredHeroes"
        :key="hero.id"
        :to="`/heroes/${hero.id}`"
        class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-blue-300"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">{{ hero.name }}</h3>
            <p class="text-sm text-gray-600 capitalize">
              {{ hero.rarity }} {{ hero.archetype }}
            </p>
          </div>
          <div class="text-3xl">
            {{ hero.isOnExpedition ? '🗺️' : '😴' }}
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Level</span>
            <span class="font-bold text-gray-800">{{ hero.level }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Power</span>
            <span class="font-bold text-gray-800">{{ hero.power }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Prestige</span>
            <span class="font-bold text-gray-800">{{ hero.prestigeLevel }}</span>
          </div>
        </div>

        <div v-if="hero.level >= 60" class="bg-yellow-50 border border-yellow-300 rounded-lg p-2 text-center text-sm text-yellow-800 font-medium">
          👑 Can Prestige
        </div>

        <div v-if="hero.isOnExpedition" class="bg-blue-50 border border-blue-300 rounded-lg p-2 text-center text-sm text-blue-800 font-medium mt-2">
          On Expedition
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading" class="bg-white rounded-lg shadow p-12 text-center">
      <div class="text-6xl mb-4">👥</div>
      <p class="text-xl text-gray-700 mb-2">No heroes found</p>
      <p class="text-gray-600 mb-6">Visit the tavern to recruit your first hero!</p>
      <NuxtLink
        to="/tavern"
        class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Visit Tavern
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">Loading heroes...</p>
    </div>
  </div>
</template>
