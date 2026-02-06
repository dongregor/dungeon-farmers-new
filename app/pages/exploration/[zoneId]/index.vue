<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Zone, Subzone } from '~~/types'

const route = useRoute()
const zoneStore = useZoneStore()
const { zones, zoneProgress, subzoneProgress, loading, error } = storeToRefs(zoneStore)

const zoneId = computed(() => route.params.zoneId as string)

// Tab management
type TabId = 'exploration' | 'stationing' | 'story' | 'discoverables'
const activeTab = ref<TabId>('exploration')

const tabs = [
  { id: 'exploration' as TabId, label: 'Exploration', icon: '🗺️' },
  { id: 'stationing' as TabId, label: 'Stationing', icon: '🏕️' },
  { id: 'story' as TabId, label: 'Story Quests', icon: '📖' },
  { id: 'discoverables' as TabId, label: 'Discoverables', icon: '🔍' },
]

// Fetch zones if not loaded
onMounted(async () => {
  if (zones.value.length === 0) {
    await zoneStore.initialize()
  }
})

// Get zone with merged progress
const zone = computed((): (Zone & { discoveredSubzonesCount: number }) | null => {
  const baseZone = zones.value.find(z => z.id === zoneId.value)
  if (!baseZone) return null

  const progress = zoneProgress.value[zoneId.value]
  return {
    ...baseZone,
    familiarity: progress?.familiarity ?? 0,
    isUnlocked: progress?.isUnlocked ?? baseZone.isUnlocked,
    isMastered: progress?.isMastered ?? false,
    discoveredSubzonesCount: progress?.discoveredSubzones?.length ?? 0,
    subzones: baseZone.subzones.map(sz => ({
      ...sz,
      isDiscovered: progress?.discoveredSubzones?.includes(sz.id) ?? false,
      mastery: subzoneProgress.value[sz.id]?.mastery ?? 0,
    })),
  }
})

// Discovered subzones list for components
const discoveredSubzoneIds = computed(() => {
  const progress = zoneProgress.value[zoneId.value]
  return progress?.discoveredSubzones ?? []
})

// Page title
definePageMeta({
  title: 'Zone Details',
})

useHead({
  title: computed(() => zone.value?.name ?? 'Zone Details'),
})

// Separate discovered and undiscovered subzones
const discoveredSubzones = computed(() => {
  return zone.value?.subzones.filter(sz => sz.isDiscovered) ?? []
})

const undiscoveredSubzones = computed(() => {
  return zone.value?.subzones.filter(sz => !sz.isDiscovered) ?? []
})

// Zone type styling
function getZoneTypeClass(type: string): string {
  const classes: Record<string, string> = {
    forest: 'bg-green-900/30 text-green-400 border-green-700',
    cave: 'bg-gray-700 text-gray-300 border-gray-600',
    swamp: 'bg-emerald-900/30 text-emerald-400 border-emerald-700',
    ruins: 'bg-amber-900/30 text-amber-400 border-amber-700',
    mountain: 'bg-slate-700 text-slate-300 border-slate-600',
    desert: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
  }
  return classes[type] || 'bg-gray-700 text-gray-300 border-gray-600'
}

// Difficulty styling
function getDifficultyStars(difficulty: string): number {
  const map: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
    extreme: 4,
  }
  return map[difficulty] || 2
}

function getDifficultyClass(difficulty: string): string {
  const classes: Record<string, string> = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    extreme: 'text-red-400',
  }
  return classes[difficulty] || 'text-gray-400'
}

// Navigate to subzone expedition page
function startExpedition(subzoneId?: string) {
  if (subzoneId) {
    // Go to dedicated subzone expedition page
    navigateTo(`/exploration/${zoneId.value}/${subzoneId}`)
  } else {
    // Go to expeditions page to select zone/subzone
    navigateTo({ path: '/expeditions' })
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <!-- Back Navigation -->
    <div class="mb-6">
      <NuxtLink
        to="/exploration"
        class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <span>&larr;</span>
        <span>Back to Exploration</span>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-gray-400">Loading zone...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Zone Not Found -->
    <div v-else-if="!zone" class="bg-gray-800 rounded-lg p-12 text-center">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-xl text-gray-300 mb-2">Zone Not Found</p>
      <p class="text-gray-500 mb-6">
        This zone doesn't exist or hasn't been discovered yet
      </p>
      <NuxtLink
        to="/exploration"
        class="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Return to Exploration
      </NuxtLink>
    </div>

    <!-- Zone Content -->
    <template v-else>
      <!-- Zone Header -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-white">{{ zone.name }}</h1>
              <span
                v-if="zone.isMastered"
                class="px-3 py-1 text-sm font-semibold rounded-full bg-purple-900/50 text-purple-400"
              >
                Mastered
              </span>
            </div>
            <p class="text-gray-400 text-lg">{{ zone.description }}</p>
          </div>

          <!-- Zone Type Badge -->
          <span
            :class="[
              'px-4 py-2 text-sm font-semibold rounded-lg border',
              getZoneTypeClass(zone.type)
            ]"
          >
            {{ zone.type.toUpperCase() }}
          </span>
        </div>

        <!-- Familiarity Progress -->
        <div class="mt-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Zone Familiarity</span>
            <span
              :class="[
                'font-semibold',
                zone.isMastered ? 'text-purple-400' : 'text-blue-400'
              ]"
            >
              {{ zone.familiarity }}/100
            </span>
          </div>
          <div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full transition-all duration-500',
                zone.isMastered ? 'bg-purple-500' : 'bg-blue-500'
              ]"
              :style="{ width: `${zone.familiarity}%` }"
            />
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div class="bg-gray-900/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-guild-gold">
              {{ zone.discoveredSubzonesCount }}
            </div>
            <div class="text-sm text-gray-400">Subzones Discovered</div>
          </div>
          <div class="bg-gray-900/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-400">
              {{ zone.subzones.length }}
            </div>
            <div class="text-sm text-gray-400">Total Subzones</div>
          </div>
          <div class="bg-gray-900/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-400">
              +{{ zone.masteryRewards.passiveIncomeBonus }}%
            </div>
            <div class="text-sm text-gray-400">Mastery Bonus</div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-6">
        <div class="flex gap-2 border-b border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors relative"
            :class="[
              activeTab === tab.id
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            <!-- Active indicator -->
            <span
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-guild-gold"
            />
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="min-h-[400px]">
        <!-- Exploration Tab -->
        <div v-if="activeTab === 'exploration'">
          <!-- Discovered Subzones -->
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-white mb-4">
              Discovered Subzones ({{ discoveredSubzones.length }})
            </h2>

            <div v-if="discoveredSubzones.length === 0" class="bg-gray-800 rounded-lg p-6 text-center">
              <p class="text-gray-400">No subzones discovered yet. Start exploring!</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="subzone in discoveredSubzones"
                :key="subzone.id"
                class="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-white">{{ subzone.name }}</h3>
                      <span
                        :class="['text-sm', getDifficultyClass(subzone.difficulty)]"
                      >
                        <span v-for="i in getDifficultyStars(subzone.difficulty)" :key="i">&#9733;</span>
                        <span
                          v-for="i in (4 - getDifficultyStars(subzone.difficulty))"
                          :key="'empty-' + i"
                          class="text-gray-600"
                        >&#9733;</span>
                      </span>
                    </div>
                    <p class="text-gray-400 text-sm mb-3">{{ subzone.description }}</p>

                    <!-- Subzone Stats -->
                    <div class="flex flex-wrap gap-4 text-sm">
                      <div class="flex items-center gap-2">
                        <span class="text-gray-500">Duration:</span>
                        <span class="text-gray-300">{{ subzone.baseDuration }} min</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-gray-500">Gold:</span>
                        <span class="text-guild-gold">{{ subzone.baseGold }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-gray-500">XP:</span>
                        <span class="text-blue-400">{{ subzone.baseXp }}</span>
                      </div>
                    </div>

                    <!-- Mastery Progress -->
                    <div class="mt-3">
                      <div class="flex justify-between text-xs mb-1">
                        <span class="text-gray-500">Mastery</span>
                        <span class="text-gray-400">{{ subzone.mastery }}/100</span>
                      </div>
                      <div class="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-purple-500 transition-all"
                          :style="{ width: `${subzone.mastery}%` }"
                        />
                      </div>
                    </div>

                    <!-- Threats -->
                    <div v-if="subzone.threats.length > 0" class="mt-3 flex flex-wrap gap-2">
                      <span
                        v-for="threat in subzone.threats"
                        :key="threat"
                        class="px-2 py-1 text-xs rounded bg-red-900/30 text-red-400"
                      >
                        {{ threat.replace(/_/g, ' ') }}
                      </span>
                    </div>
                  </div>

                  <!-- Start Expedition Button -->
                  <button
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
                    @click="startExpedition(subzone.id)"
                  >
                    Start Expedition
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Undiscovered Subzones -->
          <div v-if="undiscoveredSubzones.length > 0">
            <h2 class="text-xl font-semibold text-white mb-4">
              Undiscovered Subzones ({{ undiscoveredSubzones.length }})
            </h2>

            <div class="space-y-3">
              <div
                v-for="subzone in undiscoveredSubzones"
                :key="subzone.id"
                class="bg-gray-800/50 rounded-lg p-4 border border-gray-700 border-dashed"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl text-gray-600">?</span>
                    <div>
                      <h3 class="text-gray-500 font-medium">Unknown Subzone</h3>
                      <p class="text-sm text-gray-600">
                        Requires {{ subzone.requiredZoneFamiliarity }}% zone familiarity to discover
                      </p>
                    </div>
                  </div>

                  <!-- Progress indicator -->
                  <div class="text-right">
                    <div
                      v-if="zone.familiarity >= subzone.requiredZoneFamiliarity"
                      class="text-green-400 text-sm font-medium"
                    >
                      Ready to discover!
                    </div>
                    <div v-else class="text-gray-500 text-sm">
                      {{ subzone.requiredZoneFamiliarity - zone.familiarity }}% more familiarity needed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mastery Rewards Section -->
          <div class="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Mastery Rewards</h2>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-900/50 rounded-lg p-4">
                <div class="text-sm text-gray-400 mb-1">Title Earned</div>
                <div class="text-lg font-semibold" :class="zone.isMastered ? 'text-purple-400' : 'text-gray-500'">
                  {{ zone.masteryRewards.title || 'None' }}
                  <span v-if="!zone.isMastered" class="text-xs text-gray-600">(Locked)</span>
                </div>
              </div>
              <div class="bg-gray-900/50 rounded-lg p-4">
                <div class="text-sm text-gray-400 mb-1">Passive Income Bonus</div>
                <div class="text-lg font-semibold" :class="zone.isMastered ? 'text-green-400' : 'text-gray-500'">
                  +{{ zone.masteryRewards.passiveIncomeBonus }}%
                  <span v-if="!zone.isMastered" class="text-xs text-gray-600">(Locked)</span>
                </div>
              </div>
            </div>

            <p class="mt-4 text-sm text-gray-500">
              Reach 100% zone familiarity to unlock mastery rewards
            </p>
          </div>
        </div>

        <!-- Stationing Tab -->
        <div v-else-if="activeTab === 'stationing'">
          <ZoneStationingPanel :zone-id="zoneId" :zone-name="zone.name" />
        </div>

        <!-- Story Quests Tab -->
        <div v-else-if="activeTab === 'story'">
          <ExplorationZoneStoryQuests :zone-id="zoneId" :zone-name="zone.name" />
        </div>

        <!-- Discoverables Tab -->
        <div v-else-if="activeTab === 'discoverables'">
          <ExplorationZoneDiscoverables
            :zone="zone"
            :subzone-progress="subzoneProgress"
            :discovered-subzones="discoveredSubzoneIds"
          />
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-8 text-center">
        <button
          class="px-8 py-4 bg-guild-gold hover:bg-guild-gold/80 text-gray-900 font-bold rounded-lg transition-colors text-lg"
          @click="startExpedition()"
        >
          Start Expedition in {{ zone.name }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.bg-gray-750 {
  background-color: rgb(55, 55, 65);
}
</style>
