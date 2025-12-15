<script setup lang="ts">
import { useHeroStore } from '~/stores/heroes'
import { useExpeditionStore } from '~/stores/expeditions'
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Dashboard',
})

const heroStore = useHeroStore()
const expeditionStore = useExpeditionStore()

const { heroes } = storeToRefs(heroStore)
const { activeExpeditions } = storeToRefs(expeditionStore)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    heroStore.fetchHeroes(),
    expeditionStore.fetchActiveExpeditions(),
  ])
})

// Stats
const heroStats = computed(() => {
  const total = heroes.value.length
  const onExpedition = heroes.value.filter(h => h.isOnExpedition).length
  const resting = total - onExpedition
  const canPrestige = heroes.value.filter(h => h.level >= 60).length

  return { total, onExpedition, resting, canPrestige }
})

const expeditionStats = computed(() => {
  return {
    active: activeExpeditions.value.length,
    autoRepeat: activeExpeditions.value.filter(e => e.autoRepeat).length,
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        Guild Dashboard
      </h1>
      <p class="text-gray-600">
        Welcome back, Guild Master
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Heroes stat -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">Total Heroes</p>
            <p class="text-3xl font-bold text-gray-800">{{ heroStats.total }}</p>
          </div>
          <div class="text-4xl">👥</div>
        </div>
        <div class="mt-3 text-sm text-gray-600">
          {{ heroStats.onExpedition }} active, {{ heroStats.resting }} resting
        </div>
      </div>

      <!-- Expeditions stat -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">Active Expeditions</p>
            <p class="text-3xl font-bold text-gray-800">{{ expeditionStats.active }}</p>
          </div>
          <div class="text-4xl">🗺️</div>
        </div>
        <div class="mt-3 text-sm text-gray-600">
          {{ expeditionStats.autoRepeat }} on auto-repeat
        </div>
      </div>

      <!-- Prestige ready stat -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm mb-1">Ready to Prestige</p>
            <p class="text-3xl font-bold text-gray-800">{{ heroStats.canPrestige }}</p>
          </div>
          <div class="text-4xl">👑</div>
        </div>
        <div class="mt-3 text-sm text-gray-600">
          Level 60 heroes
        </div>
      </div>

      <!-- Quick action -->
      <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <p class="text-sm mb-2 opacity-90">Quick Action</p>
        <NuxtLink
          to="/tavern"
          class="block text-2xl font-bold hover:underline"
        >
          Visit Tavern →
        </NuxtLink>
        <p class="mt-3 text-sm opacity-90">
          Recruit new heroes
        </p>
      </div>
    </div>

    <!-- Active Expeditions -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-800">
            Active Expeditions
          </h2>
          <NuxtLink
            to="/expeditions"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </NuxtLink>
        </div>
      </div>

      <div v-if="activeExpeditions.length > 0" class="divide-y divide-gray-200">
        <div
          v-for="expedition in activeExpeditions.slice(0, 5)"
          :key="expedition.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="font-bold text-gray-800 mb-1">
                {{ expedition.zoneId }} - {{ expedition.subzoneId }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ expedition.heroIds.length }} heroes • {{ expedition.durationMinutes }}min
              </p>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600 mb-1">
                In Progress
              </div>
              <div v-if="expedition.autoRepeat" class="text-xs text-blue-600 font-medium">
                Auto-Repeat ON
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center text-gray-500">
        <div class="text-6xl mb-4">🗺️</div>
        <p class="text-lg mb-2">No active expeditions</p>
        <p class="text-sm mb-4">Send your heroes on an adventure!</p>
        <NuxtLink
          to="/expeditions"
          class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Start Expedition
        </NuxtLink>
      </div>
    </div>

    <!-- Hero Roster -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-800">
            Hero Roster
          </h2>
          <NuxtLink
            to="/heroes"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </NuxtLink>
        </div>
      </div>

      <div v-if="heroes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <div
          v-for="hero in heroes.slice(0, 6)"
          :key="hero.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="font-bold text-gray-800">{{ hero.name }}</h3>
              <p class="text-sm text-gray-600 capitalize">
                {{ hero.rarity }} {{ hero.archetype }}
              </p>
            </div>
            <div class="text-2xl">
              {{ hero.isOnExpedition ? '🗺️' : '😴' }}
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Level {{ hero.level }}</span>
            <span class="text-gray-600">Power {{ hero.power }}</span>
          </div>
          <div v-if="hero.level >= 60" class="mt-2 text-xs text-yellow-600 font-medium">
            👑 Can Prestige
          </div>
        </div>
      </div>

      <div v-else class="p-12 text-center text-gray-500">
        <div class="text-6xl mb-4">👥</div>
        <p class="text-lg mb-2">No heroes yet</p>
        <p class="text-sm mb-4">Visit the tavern to recruit your first hero!</p>
        <NuxtLink
          to="/tavern"
          class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Visit Tavern
        </NuxtLink>
      </div>
    </div>
  </div>
</template>