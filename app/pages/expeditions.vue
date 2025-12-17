<script setup lang="ts">
import { useExpeditionStore } from '~/stores/expeditions'
import { useZoneStore } from '~/stores/zones'
import { useHeroStore } from '~/stores/heroes'
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Expeditions',
})

const expeditionStore = useExpeditionStore()
const zoneStore = useZoneStore()
const heroStore = useHeroStore()

const { activeExpeditions } = storeToRefs(expeditionStore)
const { zones } = storeToRefs(zoneStore)
const { heroes } = storeToRefs(heroStore)

// UI state
const showStartExpedition = ref(false)
const selectedZoneId = ref<string | null>(null)
const selectedSubzoneId = ref<string | null>(null)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    expeditionStore.fetchActiveExpeditions(),
    zoneStore.fetchZones(),
    heroStore.fetchHeroes(),
  ])
})

// Computed
const selectedZone = computed(() => {
  if (!selectedZoneId.value) return null
  return zones.value.find(z => z.id === selectedZoneId.value)
})

const selectedSubzone = computed(() => {
  if (!selectedZone.value || !selectedSubzoneId.value) return null
  return selectedZone.value.subzones.find(s => s.id === selectedSubzoneId.value)
})

const availableHeroes = computed(() => {
  // Filter out heroes that are already on expeditions
  return heroes.value.filter(hero => {
    return !hero.isOnExpedition && hero.morale !== 'exhausted'
  })
})

const hasAvailableSlots = computed(() => {
  // Check if player has room for more expeditions
  // This would depend on account level or supporter status
  const maxExpeditions = 5 // Could be dynamic based on account
  return activeExpeditions.value.length < maxExpeditions
})

// Methods
const handleStartExpedition = () => {
  if (!hasAvailableSlots.value) {
    alert('Maximum expedition slots reached. Wait for expeditions to complete.')
    return
  }

  if (availableHeroes.value.length === 0) {
    alert('No heroes available. All heroes are on expeditions or need rest.')
    return
  }

  showStartExpedition.value = true
  selectedZoneId.value = null
  selectedSubzoneId.value = null
}

const handleSelectZone = (zoneId: string) => {
  selectedZoneId.value = zoneId
  selectedSubzoneId.value = null
}

const handleSelectSubzone = (subzoneId: string) => {
  selectedSubzoneId.value = subzoneId
}

const handleBack = () => {
  if (selectedSubzoneId.value) {
    selectedSubzoneId.value = null
  } else if (selectedZoneId.value) {
    selectedZoneId.value = null
  } else {
    showStartExpedition.value = false
  }
}

const handleExpeditionStarted = () => {
  showStartExpedition.value = false
  selectedZoneId.value = null
  selectedSubzoneId.value = null
  expeditionStore.fetchActiveExpeditions()
}

const handleComplete = async (expeditionId: string) => {
  try {
    await expeditionStore.completeExpedition(expeditionId)
  } catch (error) {
    console.error('Failed to complete expedition:', error)
  }
}

const handleCancel = async (expeditionId: string) => {
  if (!confirm('Are you sure you want to cancel this expedition? Heroes will return without rewards.')) {
    return
  }

  try {
    await expeditionStore.cancelExpedition(expeditionId)
  } catch (error) {
    console.error('Failed to cancel expedition:', error)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          Expeditions
        </h1>
        <p class="text-gray-600">
          Send your heroes on adventures
        </p>
      </div>

      <button
        v-if="!showStartExpedition"
        :disabled="!hasAvailableSlots || availableHeroes.length === 0"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleStartExpedition"
      >
        + Start New Expedition
      </button>
    </div>

    <!-- Start Expedition Flow -->
    <div v-if="showStartExpedition" class="mb-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button @click="handleBack" class="hover:text-blue-600 transition-colors">
            ← Back
          </button>
          <span>|</span>
          <span v-if="!selectedZoneId">Select Zone</span>
          <span v-else-if="!selectedSubzoneId">{{ selectedZone?.name }} - Select Subzone</span>
          <span v-else>{{ selectedZone?.name }} - {{ selectedSubzone?.name }}</span>
        </div>

        <!-- Zone Selection -->
        <div v-if="!selectedZoneId" class="space-y-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Select Zone</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ZoneCard
              v-for="zone in zones"
              :key="zone.id"
              :zone="zone"
              @select="handleSelectZone"
            />
          </div>
        </div>

        <!-- Subzone Selection -->
        <div v-else-if="!selectedSubzoneId" class="space-y-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Select Subzone</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SubzoneCard
              v-for="subzone in selectedZone?.subzones"
              :key="subzone.id"
              :subzone="subzone"
              :zone="selectedZone"
              @select="handleSelectSubzone"
            />
          </div>
        </div>

        <!-- Expedition Setup -->
        <div v-else>
          <ExpeditionSetup
            :zone="selectedZone"
            :subzone="selectedSubzone"
            :available-heroes="availableHeroes"
            @started="handleExpeditionStarted"
            @cancel="handleBack"
          />
        </div>
      </div>
    </div>

    <!-- Active Expeditions -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">
          Active Expeditions ({{ activeExpeditions.length }})
        </h2>
      </div>

      <!-- Expedition List -->
      <div v-if="activeExpeditions.length > 0" class="grid grid-cols-1 gap-6">
        <ExpeditionActive
          v-for="expedition in activeExpeditions"
          :key="expedition.id"
          :expedition="expedition"
          :heroes="heroes.filter(h => expedition.heroIds.includes(h.id))"
          @complete="handleComplete"
          @cancel="handleCancel"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <div class="text-6xl mb-4">🗺️</div>
        <p class="text-xl text-gray-700 mb-2">No Active Expeditions</p>
        <p class="text-gray-600 mb-6">
          Start an expedition to send your heroes on adventures and earn rewards
        </p>
        <button
          v-if="!showStartExpedition"
          :disabled="!hasAvailableSlots || availableHeroes.length === 0"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleStartExpedition"
        >
          Start Your First Expedition
        </button>
        <p v-if="availableHeroes.length === 0" class="text-sm text-red-600 mt-4">
          All heroes are currently busy or need rest
        </p>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
      <h3 class="font-bold text-blue-900 mb-3">Expedition Tips</h3>
      <ul class="space-y-2 text-sm text-blue-800">
        <li>• Build balanced parties with different archetypes for better success</li>
        <li>• Match hero tags to subzone threats for efficiency bonuses</li>
        <li>• Heroes recover morale while resting between expeditions</li>
        <li>• Enable auto-repeat to farm zones while you're away</li>
        <li>• Higher difficulty tiers offer better rewards but need stronger teams</li>
      </ul>
    </div>
  </div>
</template>
