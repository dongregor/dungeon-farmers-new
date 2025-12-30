<script setup lang="ts">
import { useExpeditionStore } from '~/stores/expeditions'
import { useHeroStore } from '~/stores/heroes'
import { useStationingStore } from '~/stores/stationing'
import { useZoneStore } from '~/stores/zones'
import { storeToRefs } from 'pinia'
import type { Expedition } from '~~/types'

definePageMeta({
  title: 'Active Expeditions',
})

const expeditionStore = useExpeditionStore()
const heroStore = useHeroStore()
const stationingStore = useStationingStore()
const zoneStore = useZoneStore()

const { activeExpeditions } = storeToRefs(expeditionStore)
const { heroes } = storeToRefs(heroStore)
const { stationed } = storeToRefs(stationingStore)

// UI state
const sortBy = ref<'timeRemaining' | 'zone' | 'teamPower'>('timeRemaining')
const filterType = ref<'all' | 'zone' | 'story' | 'dungeon'>('all')
const expandedExpeditionId = ref<string | null>(null)
const recallConfirmId = ref<string | null>(null)
const recallStationedHeroId = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Reactive current time for real-time timer updates
const now = ref(Date.now())
let timerInterval: ReturnType<typeof setInterval> | null = null

// Fetch data on mount
onMounted(async () => {
  // Start timer interval for real-time updates
  timerInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  loading.value = true
  try {
    await Promise.all([
      expeditionStore.fetchExpeditions(),
      heroStore.fetchHeroes(),
      stationingStore.fetchStationed(),
      zoneStore.initialize(),
    ])
  } catch (err) {
    error.value = 'Failed to load expedition data'
    console.error('Error loading expedition data:', err)
  } finally {
    loading.value = false
  }
})

// Clear interval on unmount
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
})

// Computed
const sortedExpeditions = computed(() => {
  let sorted = [...activeExpeditions.value]

  switch (sortBy.value) {
    case 'timeRemaining':
      sorted.sort((a, b) => {
        const timeA = new Date(a.completesAt).getTime()
        const timeB = new Date(b.completesAt).getTime()
        return timeA - timeB
      })
      break
    case 'zone':
      sorted.sort((a, b) => a.zoneId.localeCompare(b.zoneId))
      break
    case 'teamPower':
      sorted.sort((a, b) => b.teamPower - a.teamPower)
      break
  }

  return sorted
})

const filteredExpeditions = computed(() => {
  if (filterType.value === 'all') return sortedExpeditions.value

  // Filter by expedition type based on zone/subzone properties
  return sortedExpeditions.value.filter(exp => {
    const zone = zoneStore.getZoneById(exp.zoneId)
    const subzone = zoneStore.getSubzoneById(exp.zoneId, exp.subzoneId)

    // Filter based on subzone type or zone type
    // For MVP, check if subzone has a type property
    const expeditionType = (subzone as any)?.type || 'zone'

    return filterType.value === expeditionType
  })
})

const stationedHeroesWithInfo = computed(() => {
  return stationed.value.map(s => {
    const hero = heroes.value.find(h => h.id === s.heroId)
    const zone = zoneStore.getZoneById(s.zoneId)
    return {
      ...s,
      hero,
      zone,
    }
  })
})

// Methods
const getExpeditionHeroes = (expedition: Expedition) => {
  return heroes.value.filter(h => expedition.heroIds.includes(h.id))
}

const getExpeditionZone = (expedition: Expedition) => {
  return zoneStore.getZoneById(expedition.zoneId)
}

const getExpeditionSubzone = (expedition: Expedition) => {
  return zoneStore.getSubzoneById(expedition.zoneId, expedition.subzoneId)
}

const toggleExpanded = (expeditionId: string) => {
  if (expandedExpeditionId.value === expeditionId) {
    expandedExpeditionId.value = null
  } else {
    expandedExpeditionId.value = expeditionId
  }
}

const showRecallConfirm = (expeditionId: string) => {
  recallConfirmId.value = expeditionId
}

const handleRecallExpedition = async () => {
  if (!recallConfirmId.value) return

  try {
    await expeditionStore.cancelExpedition(recallConfirmId.value)
    recallConfirmId.value = null
  } catch (err) {
    error.value = 'Failed to recall expedition'
    console.error('Error recalling expedition:', err)
  }
}

const handleCompleteExpedition = async (expeditionId: string) => {
  try {
    await expeditionStore.completeExpedition(expeditionId)
    // Navigate to results page or show results modal
    // navigateTo(`/expeditions/${expeditionId}/results`)
  } catch (err) {
    error.value = 'Failed to complete expedition'
    console.error('Error completing expedition:', err)
  }
}

const showRecallStationedConfirm = (heroId: string) => {
  recallStationedHeroId.value = heroId
}

const handleRecallStationed = async () => {
  if (!recallStationedHeroId.value) return

  try {
    await stationingStore.recallHero(recallStationedHeroId.value)
    recallStationedHeroId.value = null
  } catch (err) {
    error.value = 'Failed to recall stationed hero'
    console.error('Error recalling stationed hero:', err)
  }
}

const formatTimeRemaining = (completesAt: string) => {
  // Use reactive now.value for real-time updates
  const end = new Date(completesAt).getTime()
  const remaining = Math.max(0, end - now.value)

  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

const calculateProgress = (expedition: Expedition) => {
  const start = new Date(expedition.startedAt).getTime()
  const end = new Date(expedition.completesAt).getTime()
  const total = end - start
  const elapsed = now.value - start

  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

const isExpeditionComplete = (expedition: Expedition) => {
  // Use reactive now.value for real-time updates
  return new Date(expedition.completesAt).getTime() <= now.value
}

// Computed for dialog visibility (proper v-model binding)
const showRecallDialog = computed({
  get: () => recallConfirmId.value !== null,
  set: (value: boolean) => {
    if (!value) recallConfirmId.value = null
  },
})

const showRecallStationedDialog = computed({
  get: () => recallStationedHeroId.value !== null,
  set: (value: boolean) => {
    if (!value) recallStationedHeroId.value = null
  },
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Page Header -->
    <PageHeader
      title="Active Expeditions"
      subtitle="Monitor your ongoing expeditions and stationed heroes"
      :back-link="'/expeditions'"
    >
      <template #meta>
        <div class="flex gap-2 items-center">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {{ activeExpeditions.length }} Active
          </span>
          <span v-if="stationed.length > 0" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {{ stationed.length }} Stationed
          </span>
        </div>
      </template>
    </PageHeader>

    <!-- Error Display -->
    <div v-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else class="space-y-8">
      <!-- Filters and Sorting -->
      <div v-if="activeExpeditions.length > 0" class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div class="flex gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            v-model="sortBy"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="timeRemaining">Time Remaining</option>
            <option value="zone">Zone</option>
            <option value="teamPower">Team Power</option>
          </select>
        </div>

        <div class="flex gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Filter:</label>
          <select
            v-model="filterType"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="zone">Zone Expeditions</option>
            <option value="story">Story Missions</option>
            <option value="dungeon">Dungeons</option>
          </select>
        </div>
      </div>

      <!-- Active Expeditions List -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-gray-800">Ongoing Expeditions</h2>

        <div v-if="filteredExpeditions.length > 0" class="space-y-4">
          <div
            v-for="expedition in filteredExpeditions"
            :key="expedition.id"
            class="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors"
          >
            <!-- Expedition Card Header -->
            <div class="p-4">
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900">
                    {{ getExpeditionZone(expedition)?.name }} - {{ getExpeditionSubzone(expedition)?.name }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ expedition.heroIds.length }} Heroes • {{ expedition.durationMinutes }}min
                  </p>
                </div>
                <div
                  v-if="expedition.efficiency"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-semibold',
                    expedition.efficiency >= 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ Math.round(expedition.efficiency) }}%
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-3">
                <div class="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                    :style="{ width: `${calculateProgress(expedition)}%` }"
                  />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xs font-semibold text-gray-700">
                      {{ Math.round(calculateProgress(expedition)) }}%
                    </span>
                  </div>
                </div>
              </div>

              <!-- Timer -->
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-gray-600">Time Remaining:</span>
                <span
                  :class="[
                    'text-lg font-bold font-mono',
                    isExpeditionComplete(expedition) ? 'text-green-600' : 'text-gray-900'
                  ]"
                >
                  {{ isExpeditionComplete(expedition) ? 'Complete!' : formatTimeRemaining(expedition.completesAt) }}
                </span>
              </div>

              <!-- Hero Team (Compact) -->
              <div class="mb-4">
                <div class="flex gap-2 flex-wrap">
                  <div
                    v-for="hero in getExpeditionHeroes(expedition).slice(0, 4)"
                    :key="hero.id"
                    class="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
                  >
                    <span class="text-sm font-medium text-gray-900">{{ hero.name }}</span>
                    <span class="text-xs text-gray-600">Lvl {{ hero.level }}</span>
                  </div>
                  <div
                    v-if="getExpeditionHeroes(expedition).length > 4"
                    class="flex items-center bg-gray-100 rounded-lg px-3 py-2"
                  >
                    <span class="text-sm text-gray-600">+{{ getExpeditionHeroes(expedition).length - 4 }} more</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <button
                  v-if="isExpeditionComplete(expedition)"
                  @click="handleCompleteExpedition(expedition.id)"
                  class="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Complete Expedition
                </button>
                <button
                  @click="toggleExpanded(expedition.id)"
                  class="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  {{ expandedExpeditionId === expedition.id ? 'Hide Details' : 'View Details' }}
                </button>
                <button
                  v-if="!isExpeditionComplete(expedition)"
                  @click="showRecallConfirm(expedition.id)"
                  class="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors"
                >
                  Recall
                </button>
              </div>

              <!-- Expanded Details -->
              <div v-if="expandedExpeditionId === expedition.id" class="mt-4 pt-4 border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Full Team Display -->
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">Team</h4>
                    <div class="space-y-2">
                      <div
                        v-for="hero in getExpeditionHeroes(expedition)"
                        :key="hero.id"
                        class="bg-gray-50 rounded p-2 flex justify-between items-center"
                      >
                        <div>
                          <div class="font-medium text-sm">{{ hero.name }}</div>
                          <div class="text-xs text-gray-600">{{ hero.archetype }} • Lvl {{ hero.level }}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-xs text-gray-600">Power</div>
                          <div class="font-bold text-blue-600">{{ hero.power }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Zone & Estimated Rewards -->
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">Zone Info</h4>
                    <div class="bg-gray-50 rounded p-3 space-y-2 text-sm">
                      <div>
                        <span class="text-gray-600">Zone:</span>
                        <span class="ml-2 font-medium">{{ getExpeditionZone(expedition)?.name }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Location:</span>
                        <span class="ml-2 font-medium">{{ getExpeditionSubzone(expedition)?.name }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Difficulty:</span>
                        <span class="ml-2 font-medium capitalize">{{ getExpeditionSubzone(expedition)?.difficulty }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Team Power:</span>
                        <span class="ml-2 font-medium">{{ expedition.teamPower }}</span>
                      </div>
                    </div>

                    <h4 class="font-semibold text-gray-900 mt-4 mb-2">Estimated Rewards</h4>
                    <div class="bg-gray-50 rounded p-3 space-y-1 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Gold:</span>
                        <span class="font-medium">~{{ getExpeditionSubzone(expedition)?.baseGold || 0 }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">XP:</span>
                        <span class="font-medium">~{{ getExpeditionSubzone(expedition)?.baseXp || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Active Expeditions -->
        <EmptyState
          v-else
          icon="🗺️"
          title="No Active Expeditions"
          description="You don't have any expeditions in progress. Start one from the Expeditions page."
        >
          <template #action>
            <NuxtLink
              to="/expeditions"
              class="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Start Expedition
            </NuxtLink>
          </template>
        </EmptyState>
      </div>

      <!-- Passive Assignments Section -->
      <div v-if="stationedHeroesWithInfo.length > 0" class="space-y-4">
        <h2 class="text-xl font-bold text-gray-800">Stationed Heroes</h2>
        <p class="text-sm text-gray-600">Heroes passively gathering resources in zones</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="stationed in stationedHeroesWithInfo"
            :key="stationed.heroId"
            class="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-gray-900">{{ stationed.hero?.name }}</h3>
                <p class="text-sm text-gray-600">{{ stationed.zone?.name }}</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                Stationed
              </span>
            </div>

            <div class="mb-3 text-sm text-gray-600">
              <div>Since: {{ new Date(stationed.stationedAt).toLocaleDateString() }}</div>
              <div>Last collected: {{ new Date(stationed.lastCollectedAt).toLocaleDateString() }}</div>
            </div>

            <button
              @click="showRecallStationedConfirm(stationed.heroId)"
              class="w-full py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
            >
              Recall Hero
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recall Expedition Confirmation -->
    <ConfirmationDialog
      v-model="showRecallDialog"
      title="Recall Expedition?"
      message="Recalling the expedition will return your heroes immediately, but they will receive no rewards and lose some morale. Are you sure?"
      confirm-text="Recall"
      cancel-text="Continue Expedition"
      variant="danger"
      @confirm="handleRecallExpedition"
    />

    <!-- Recall Stationed Hero Confirmation -->
    <ConfirmationDialog
      v-model="showRecallStationedDialog"
      title="Recall Stationed Hero?"
      message="Recalling this hero will collect any pending rewards. The hero will be available for expeditions again."
      confirm-text="Recall"
      cancel-text="Leave Stationed"
      variant="info"
      @confirm="handleRecallStationed"
    />
  </div>
</template>
