<script setup lang="ts">
import { useHeroStore } from '~/stores/heroes'
import { useExpeditionStore } from '~/stores/expeditions'
import { usePresetStore } from '~/stores/presets'
import { useZoneStore } from '~/stores/zones'
import { storeToRefs } from 'pinia'
import type { Hero } from '~~/types'
import type { Zone, Subzone } from '~~/types/zones'

definePageMeta({
  title: 'Team Formation',
})

// Stores
const heroStore = useHeroStore()
const expeditionStore = useExpeditionStore()
const presetStore = usePresetStore()
const zoneStore = useZoneStore()
const router = useRouter()
const route = useRoute()

// Store refs
const { heroes } = storeToRefs(heroStore)
const { loading: expeditionLoading } = storeToRefs(expeditionStore)

// Route params (zone/subzone from query or state) - reactive to route changes
const zoneId = computed(() => route.query.zoneId as string || null)
const subzoneId = computed(() => route.query.subzoneId as string || null)

// Team state
const selectedHeroIds = ref<string[]>([])
const selectedDuration = ref<number>(0) // Index in duration options
const showPresetPanel = ref(false)
const searchQuery = ref('')
const filters = ref<Record<string, any>>({})
const error = ref<string | null>(null)

// Loading state
const loading = ref(true)
const preview = ref<any>(null)

// Fetch data on mount
onMounted(async () => {
  try {
    await Promise.all([
      heroStore.fetchHeroes(),
      zoneStore.initialize(),
      presetStore.fetchPresets(),
    ])
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = 'Failed to load required data'
  } finally {
    loading.value = false
  }
})

// Computed zone/subzone
const zone = computed<Zone | undefined>(() => {
  if (!zoneId.value) return undefined
  return zoneStore.getZoneById(zoneId.value)
})

const subzone = computed<Subzone | undefined>(() => {
  if (!zoneId.value || !subzoneId.value) return undefined
  return zoneStore.getSubzoneById(zoneId.value, subzoneId.value)
})

// Team size based on zone (could be dynamic)
const maxTeamSize = computed(() => {
  // Could vary based on zone type or difficulty
  return 4
})

// Duration options based on subzone
const durationOptions = computed(() => {
  if (!subzone.value) return []
  const base = subzone.value.baseDuration

  return [
    { label: 'Quick', minutes: base * 0.5, rewardMultiplier: 0.75 },
    { label: 'Standard', minutes: base, rewardMultiplier: 1.0 },
    { label: 'Extended', minutes: base * 1.5, rewardMultiplier: 1.3 },
    { label: 'Long', minutes: base * 2, rewardMultiplier: 1.6 },
  ]
})

// Available heroes (not on expedition, not stationed)
const availableHeroes = computed(() => {
  let filtered = heroes.value.filter(h =>
    !h.isOnExpedition &&
    !h.isStationed &&
    h.morale !== 'exhausted'
  )

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(h =>
      h.name.toLowerCase().includes(query) ||
      h.archetype.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (filters.value.archetype) {
    filtered = filtered.filter(h => h.archetype === filters.value.archetype)
  }
  if (filters.value.rarity) {
    filtered = filtered.filter(h => h.rarity === filters.value.rarity)
  }
  if (filters.value.minLevel) {
    filtered = filtered.filter(h => h.level >= parseInt(filters.value.minLevel, 10))
  }
  if (filters.value.favoritesOnly) {
    filtered = filtered.filter(h => h.isFavorite)
  }

  return filtered
})

// Selected heroes (in order)
const selectedHeroes = computed(() => {
  return selectedHeroIds.value
    .map(id => heroStore.getHeroById(id))
    .filter((h): h is Hero => h !== undefined)
})

// Team stats
const totalPower = computed(() => {
  return selectedHeroes.value.reduce((sum, hero) => sum + hero.power, 0)
})

const teamComposition = computed(() => {
  const archetypes: Record<string, number> = {}
  const tags = new Set<string>()

  selectedHeroes.value.forEach(hero => {
    archetypes[hero.archetype] = (archetypes[hero.archetype] || 0) + 1
    hero.archetypeTags.forEach(tag => tags.add(tag))
  })

  return {
    archetypes,
    tags: Array.from(tags),
    size: selectedHeroes.value.length,
  }
})

// Can start expedition
const canStart = computed(() => {
  return selectedHeroIds.value.length > 0 &&
         selectedHeroIds.value.length <= maxTeamSize.value &&
         zone.value &&
         subzone.value &&
         !expeditionLoading.value
})

// Filter configuration
const filterConfig = computed(() => [
  {
    id: 'archetype',
    label: 'Archetype',
    type: 'select' as const,
    options: [
      { value: 'warrior', label: 'Warrior' },
      { value: 'rogue', label: 'Rogue' },
      { value: 'mage', label: 'Mage' },
      { value: 'ranger', label: 'Ranger' },
      { value: 'cleric', label: 'Cleric' },
    ],
  },
  {
    id: 'rarity',
    label: 'Rarity',
    type: 'select' as const,
    options: [
      { value: 'common', label: 'Common' },
      { value: 'uncommon', label: 'Uncommon' },
      { value: 'rare', label: 'Rare' },
      { value: 'epic', label: 'Epic' },
      { value: 'legendary', label: 'Legendary' },
    ],
  },
  {
    id: 'favoritesOnly',
    label: 'Favorites Only',
    type: 'toggle' as const,
  },
])

// Methods
const toggleHero = (heroId: string) => {
  const index = selectedHeroIds.value.indexOf(heroId)
  if (index > -1) {
    selectedHeroIds.value.splice(index, 1)
  } else if (selectedHeroIds.value.length < maxTeamSize.value) {
    selectedHeroIds.value.push(heroId)
  }
}

const removeHero = (heroId: string) => {
  const index = selectedHeroIds.value.indexOf(heroId)
  if (index > -1) {
    selectedHeroIds.value.splice(index, 1)
  }
}

const clearTeam = () => {
  selectedHeroIds.value = []
}

const handlePresetSelected = (heroIds: string[]) => {
  selectedHeroIds.value = heroIds.filter(id => {
    const hero = heroStore.getHeroById(id)
    return hero && !hero.isOnExpedition && !hero.isStationed
  }).slice(0, maxTeamSize.value)
  showPresetPanel.value = false
}

const handlePresetSaved = () => {
  // Refresh presets
  presetStore.fetchPresets()
}

const goBack = () => {
  router.push('/expeditions')
}

const startExpedition = async () => {
  if (!canStart.value || !zone.value || !subzone.value) return

  error.value = null

  try {
    const duration = durationOptions.value[selectedDuration.value]

    // TODO: Backend doesn't currently support custom duration/reward multiplier
    // When implemented, pass duration.minutes and duration.rewardMultiplier to API
    await expeditionStore.startExpedition({
      zoneId: zone.value.id,
      subzoneId: subzone.value.id,
      heroIds: selectedHeroIds.value,
      settings: {
        autoRepeat: false,
        stopConditions: {
          anyHeroTired: false,
          inventoryFull: false,
          resourceCap: false,
        },
        // duration: duration.minutes, // TODO: Add when backend supports it
        // rewardMultiplier: duration.rewardMultiplier, // TODO: Add when backend supports it
      },
    })

    // Success - go back to expeditions page
    router.push('/expeditions')
  } catch (err: any) {
    error.value = err.message || 'Failed to start expedition'
    console.error('Failed to start expedition:', err)
  }
}

// Watch for hero selection changes to update preview
watch(selectedHeroIds, async (newIds) => {
  if (newIds.length > 0 && zone.value && subzone.value) {
    try {
      preview.value = await expeditionStore.previewExpedition({
        zoneId: zone.value.id,
        subzoneId: subzone.value.id,
        heroIds: newIds,
      })
    } catch (err) {
      console.error('Failed to fetch preview:', err)
      preview.value = null
    }
  } else {
    preview.value = null
  }
}, { immediate: true })
</script>

<template>
  <div class="container mx-auto px-4 py-6 max-w-7xl">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!zone || !subzone" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-800 font-semibold mb-2">Invalid Expedition</p>
        <p class="text-red-600 text-sm mb-4">Zone or subzone not found</p>
        <button
          class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          @click="goBack"
        >
          Back to Expeditions
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <PageHeader
        title="Team Formation"
        :subtitle="`${zone.name} - ${subzone.name}`"
        :back-link="'/expeditions'"
      >
        <template #meta>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span class="flex items-center gap-1">
              <span class="capitalize">{{ subzone.difficulty }}</span> Difficulty
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ durationOptions[selectedDuration]?.minutes || subzone.baseDuration }} min
            </span>
          </div>
        </template>
      </PageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Team Building -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Team Slots -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-900">
                Your Team ({{ selectedHeroIds.length }}/{{ maxTeamSize }})
              </h2>
              <div class="flex gap-2">
                <button
                  v-if="selectedHeroIds.length > 0"
                  class="text-sm text-red-600 hover:text-red-700 font-medium"
                  @click="clearTeam"
                >
                  Clear All
                </button>
                <button
                  class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  @click="showPresetPanel = !showPresetPanel"
                >
                  {{ showPresetPanel ? 'Hide' : 'Load' }} Presets
                </button>
              </div>
            </div>

            <!-- Preset Panel -->
            <div v-if="showPresetPanel" class="mb-6">
              <ExpeditionPartyPresetSelector
                :selected-hero-ids="selectedHeroIds"
                :available-heroes="heroes"
                :account-level="1"
                @select="handlePresetSelected"
                @save="handlePresetSaved"
              />
            </div>

            <!-- Team Slots Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Filled Slots -->
              <div
                v-for="(heroId, index) in selectedHeroIds"
                :key="heroId"
                class="relative"
              >
                <div v-if="heroStore.getHeroById(heroId)" class="relative">
                  <HeroCard :hero="heroStore.getHeroById(heroId)!" :show-details="false" />
                  <button
                    class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg transition-colors"
                    @click="removeHero(heroId)"
                    :aria-label="`Remove hero`"
                  >
                    ×
                  </button>
                </div>
              </div>

              <!-- Empty Slots -->
              <div
                v-for="index in Math.max(0, maxTeamSize - selectedHeroIds.length)"
                :key="`empty-${index}`"
                class="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <div class="text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <p class="text-sm">Empty Slot</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Selection -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Available Heroes</h2>

            <!-- Search and Filters -->
            <div class="space-y-4 mb-6">
              <SearchBar
                v-model="searchQuery"
                placeholder="Search heroes by name or archetype..."
              />

              <FilterPanel
                v-model="filters"
                :filters="filterConfig"
                :collapsible="true"
              />
            </div>

            <!-- Hero Grid -->
            <div v-if="availableHeroes.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="hero in availableHeroes"
                :key="hero.id"
                @click="toggleHero(hero.id)"
                :disabled="!selectedHeroIds.includes(hero.id) && selectedHeroIds.length >= maxTeamSize"
                :class="[
                  'text-left transition-all relative',
                  selectedHeroIds.includes(hero.id)
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : 'hover:ring-2 hover:ring-gray-300',
                  !selectedHeroIds.includes(hero.id) && selectedHeroIds.length >= maxTeamSize && 'opacity-50 cursor-not-allowed'
                ]"
              >
                <HeroCard :hero="hero" :show-details="false" />
                <div
                  v-if="selectedHeroIds.includes(hero.id)"
                  class="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
                >
                  ✓
                </div>
              </button>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-lg font-semibold mb-2">No Heroes Available</p>
              <p class="text-sm">
                {{ searchQuery || Object.keys(filters).length > 0
                  ? 'Try adjusting your filters'
                  : 'All heroes are on expeditions or need rest'
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column - Team Summary & Actions -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Team Summary -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Expedition Preview</h2>

            <!-- Duration Selector -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <div class="space-y-2">
                <button
                  v-for="(option, index) in durationOptions"
                  :key="index"
                  @click="selectedDuration = index"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-lg border-2 transition-all',
                    selectedDuration === index
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-semibold">{{ option.label }}</div>
                      <div class="text-sm text-gray-600">{{ option.minutes }} minutes</div>
                    </div>
                    <div class="text-sm font-medium text-gray-700">
                      {{ Math.round(option.rewardMultiplier * 100) }}% rewards
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Stats -->
            <div v-if="selectedHeroIds.length > 0" class="space-y-4">
              <!-- Power -->
              <div class="flex items-center justify-between pb-3 border-b border-gray-200">
                <span class="text-sm font-medium text-gray-700">Team Power</span>
                <PowerScore :value="totalPower" :size="'lg'" />
              </div>

              <!-- Efficiency -->
              <div v-if="preview" class="flex items-center justify-between pb-3 border-b border-gray-200">
                <span class="text-sm font-medium text-gray-700">Efficiency</span>
                <EfficiencyIndicator :value="preview.efficiency" :size="'md'" />
              </div>

              <!-- Composition -->
              <div class="pb-3 border-b border-gray-200">
                <div class="text-sm font-medium text-gray-700 mb-2">Team Composition</div>
                <div class="space-y-1">
                  <div
                    v-for="(count, archetype) in teamComposition.archetypes"
                    :key="archetype"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-gray-600 capitalize">{{ archetype }}</span>
                    <span class="font-medium text-gray-900">{{ count }}</span>
                  </div>
                </div>
              </div>

              <!-- Estimated Rewards -->
              <div v-if="preview" class="space-y-2">
                <div class="text-sm font-medium text-gray-700 mb-2">Estimated Rewards</div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div class="text-xs text-yellow-700 mb-1">Gold</div>
                    <div class="text-lg font-bold text-yellow-900">
                      {{ preview.goldMin }}-{{ preview.goldMax }}
                    </div>
                  </div>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="text-xs text-blue-700 mb-1">XP</div>
                    <div class="text-lg font-bold text-blue-900">
                      {{ preview.xpMin }}-{{ preview.xpMax }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Threat Coverage -->
              <div v-if="preview && preview.threatsTotal > 0" class="pt-3 border-t border-gray-200">
                <div class="text-sm font-medium text-gray-700 mb-2">Threat Coverage</div>
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all"
                      :class="preview.threatsCountered === preview.threatsTotal ? 'bg-green-500' : 'bg-yellow-500'"
                      :style="`width: ${(preview.threatsCountered / preview.threatsTotal) * 100}%`"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-700">
                    {{ preview.threatsCountered }}/{{ preview.threatsTotal }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8 text-gray-500">
              <p class="text-sm">Select heroes to see expedition preview</p>
            </div>

            <!-- Actions -->
            <div class="space-y-3 mt-6 pt-6 border-t border-gray-200">
              <button
                @click="startExpedition"
                :disabled="!canStart"
                :class="[
                  'w-full py-3 px-6 rounded-lg font-semibold transition-colors',
                  canStart
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                {{ expeditionLoading ? 'Starting...' : 'Start Expedition' }}
              </button>

              <button
                @click="goBack"
                class="w-full py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            <!-- Error Display -->
            <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
