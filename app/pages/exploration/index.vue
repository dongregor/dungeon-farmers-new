<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Exploration',
})

const zoneStore = useZoneStore()
const { zones, zoneProgress, loading, error } = storeToRefs(zoneStore)

// View mode: 'map' or 'list'
const viewMode = ref<'map' | 'list'>('list')

// Persist view mode preference
onMounted(async () => {
  // Load saved preference
  const saved = localStorage.getItem('exploration-view-mode')
  if (saved === 'map' || saved === 'list') {
    viewMode.value = saved
  }

  // Fetch zones if not already loaded
  if (zones.value.length === 0) {
    await zoneStore.initialize()
  }
})

watch(viewMode, (newMode) => {
  localStorage.setItem('exploration-view-mode', newMode)
})

// Computed zone data with progress merged
const zonesWithProgress = computed(() => {
  return zones.value.map(zone => {
    const progress = zoneProgress.value[zone.id]
    return {
      ...zone,
      familiarity: progress?.familiarity ?? 0,
      isUnlocked: progress?.isUnlocked ?? zone.isUnlocked,
      isMastered: progress?.isMastered ?? false,
      discoveredSubzonesCount: progress?.discoveredSubzones?.length ?? 0,
    }
  })
})

// Sort: unlocked first, then by name
const sortedZones = computed(() => {
  return [...zonesWithProgress.value].sort((a, b) => {
    // Unlocked zones first
    if (a.isUnlocked && !b.isUnlocked) return -1
    if (!a.isUnlocked && b.isUnlocked) return 1
    // Then by name
    return a.name.localeCompare(b.name)
  })
})

function navigateToZone(zoneId: string) {
  navigateTo(`/exploration/${zoneId}`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Exploration</h1>
        <p class="text-gray-400">
          Discover new zones and uncover their secrets
        </p>
      </div>

      <!-- View Mode Toggle -->
      <div class="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
        <button
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'list'
            ? 'bg-gray-700 text-white'
            : 'text-gray-400 hover:text-white'"
          @click="viewMode = 'list'"
        >
          List
        </button>
        <button
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="viewMode === 'map'
            ? 'bg-gray-700 text-white'
            : 'text-gray-400 hover:text-white'"
          @click="viewMode = 'map'"
        >
          Map
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-gray-400">Loading zones...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
      <p class="text-red-400">{{ error }}</p>
      <button
        class="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
        @click="zoneStore.initialize()"
      >
        Retry
      </button>
    </div>

    <!-- Map View -->
    <div v-else-if="viewMode === 'map'">
      <ExplorationWorldMap
        :zones="sortedZones"
        @select="navigateToZone"
      />
    </div>

    <!-- List View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="zone in sortedZones"
        :key="zone.id"
        class="cursor-pointer"
        @click="zone.isUnlocked && navigateToZone(zone.id)"
      >
        <ExpeditionZoneCard
          :zone="zone"
          :familiarity="zone.familiarity"
          :is-unlocked="zone.isUnlocked"
          :is-mastered="zone.isMastered"
          :discovered-subzones-count="zone.discoveredSubzonesCount"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !error && zones.length === 0"
      class="bg-gray-800 rounded-lg p-12 text-center"
    >
      <div class="text-6xl mb-4">🌍</div>
      <p class="text-xl text-gray-300 mb-2">No Zones Available</p>
      <p class="text-gray-500">
        Zones will appear here as you progress through the game
      </p>
    </div>

    <!-- Zone Stats Summary -->
    <div v-if="!loading && zones.length > 0" class="mt-8 bg-gray-800 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-white mb-4">Exploration Progress</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-guild-gold">
            {{ sortedZones.filter(z => z.isUnlocked).length }}
          </div>
          <div class="text-sm text-gray-400">Zones Unlocked</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-400">
            {{ sortedZones.filter(z => z.isMastered).length }}
          </div>
          <div class="text-sm text-gray-400">Zones Mastered</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400">
            {{ sortedZones.reduce((sum, z) => sum + z.discoveredSubzonesCount, 0) }}
          </div>
          <div class="text-sm text-gray-400">Subzones Discovered</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400">
            {{ Math.round(sortedZones.reduce((sum, z) => sum + z.familiarity, 0) / Math.max(1, sortedZones.length)) }}%
          </div>
          <div class="text-sm text-gray-400">Avg Familiarity</div>
        </div>
      </div>
    </div>
  </div>
</template>
