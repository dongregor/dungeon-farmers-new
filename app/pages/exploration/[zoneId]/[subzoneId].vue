<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHeroStore } from '~/stores/heroes'
import { useExpeditionStore } from '~/stores/expeditions'
import type { Hero } from '~~/types'
import type { Zone, Subzone } from '~~/types/zones'
import { THREATS } from '~~/types/threats'
import { TAG_INFO, type ArchetypeTag } from '~~/types/archetypes'

const route = useRoute()
const router = useRouter()
const zoneStore = useZoneStore()
const heroStore = useHeroStore()
const expeditionStore = useExpeditionStore()
const toast = useToast()

const { zones, zoneProgress, subzoneProgress, loading: zonesLoading } = storeToRefs(zoneStore)
const { heroes, loading: heroesLoading } = storeToRefs(heroStore)
const { loading: expeditionLoading } = storeToRefs(expeditionStore)

// Route params
const zoneId = computed(() => route.params.zoneId as string)
const subzoneId = computed(() => route.params.subzoneId as string)

// Data loading
const dataLoaded = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    await Promise.all([
      zoneStore.initialize(),
      heroStore.fetchHeroes(),
    ])
    dataLoaded.value = true
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = 'Failed to load expedition data'
  }
})

// Get zone and subzone with progress
const zone = computed((): Zone | null => {
  const baseZone = zones.value.find(z => z.id === zoneId.value)
  if (!baseZone) return null

  const progress = zoneProgress.value[zoneId.value]
  return {
    ...baseZone,
    familiarity: progress?.familiarity ?? 0,
    isUnlocked: progress?.isUnlocked ?? baseZone.isUnlocked,
    isMastered: progress?.isMastered ?? false,
  }
})

const subzone = computed((): Subzone | null => {
  if (!zone.value) return null
  const sz = zone.value.subzones.find(s => s.id === subzoneId.value)
  if (!sz) return null

  return {
    ...sz,
    mastery: subzoneProgress.value[subzoneId.value]?.mastery ?? 0,
  }
})

// Team selection state
const selectedHeroIds = ref<string[]>([])
const maxTeamSize = 4

// Available heroes (not on expedition, not stationed, not exhausted)
const availableHeroes = computed(() => {
  return heroes.value.filter(h =>
    !h.isOnExpedition &&
    !h.isStationed &&
    h.morale !== 'exhausted'
  )
})

// Selected heroes
const selectedHeroes = computed(() => {
  return selectedHeroIds.value
    .map(id => heroStore.getHeroById(id))
    .filter((h): h is Hero => h !== undefined)
})

// Team stats
const totalPower = computed(() => {
  return selectedHeroes.value.reduce((sum, hero) => sum + hero.power, 0)
})

// Team tags for threat matching (map hero -> their tags)
const teamTagsByHero = computed(() => {
  const result: Map<string, { hero: Hero; tags: string[] }> = new Map()
  selectedHeroes.value.forEach(hero => {
    result.set(hero.id, { hero, tags: hero.archetypeTags || [] })
  })
  return result
})

// All team tags flattened
const allTeamTags = computed(() => {
  const tags = new Set<string>()
  selectedHeroes.value.forEach(hero => {
    (hero.archetypeTags || []).forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

// Detailed threat coverage - shows which heroes/abilities counter each threat
interface ThreatCoverageDetail {
  threatId: string
  threatName: string
  threatDescription: string
  severity: string
  isCovered: boolean
  counteredBy: Array<{
    heroId: string
    heroName: string
    tagId: string
    tagName: string
  }>
  neededTags: string[] // Tags that could counter this threat but team doesn't have
}

const threatCoverage = computed((): ThreatCoverageDetail[] => {
  if (!subzone.value) return []

  return subzone.value.threats.map(threatId => {
    const threat = THREATS[threatId]
    if (!threat) {
      return {
        threatId,
        threatName: threatId.replace(/_/g, ' '),
        threatDescription: '',
        severity: 'minor',
        isCovered: false,
        counteredBy: [],
        neededTags: [],
      }
    }

    // Find which heroes counter this threat
    const counteredBy: ThreatCoverageDetail['counteredBy'] = []

    selectedHeroes.value.forEach(hero => {
      (hero.archetypeTags || []).forEach(tagId => {
        if (threat.counteredBy.includes(tagId as ArchetypeTag)) {
          const tagInfo = TAG_INFO[tagId as ArchetypeTag]
          counteredBy.push({
            heroId: hero.id,
            heroName: hero.name,
            tagId,
            tagName: tagInfo?.name || tagId,
          })
        }
      })
    })

    // Find tags that could counter but team doesn't have
    const neededTags = threat.counteredBy
      .filter(tag => !allTeamTags.value.includes(tag))
      .map(tag => TAG_INFO[tag]?.name || tag)

    return {
      threatId,
      threatName: threat.name,
      threatDescription: threat.description,
      severity: threat.severity,
      isCovered: counteredBy.length > 0,
      counteredBy,
      neededTags,
    }
  })
})

// Summary stats
const coveredThreatsCount = computed(() => threatCoverage.value.filter(t => t.isCovered).length)
const totalThreatsCount = computed(() => threatCoverage.value.length)

// Calculate efficiency based on power and threat coverage
const estimatedEfficiency = computed(() => {
  if (!subzone.value || selectedHeroes.value.length === 0) return 0

  // Required power based on difficulty
  const difficultyMultiplier: Record<string, number> = {
    easy: 20,
    medium: 40,
    hard: 70,
    extreme: 100,
  }
  const requiredPower = difficultyMultiplier[subzone.value.difficulty] || 40

  // Base efficiency from power ratio (60-120%)
  const powerRatio = totalPower.value / requiredPower
  let efficiency = Math.min(120, Math.max(60, 60 + (powerRatio - 0.5) * 80))

  // Bonus for countered threats (+5% each)
  efficiency += coveredThreatsCount.value * 5

  // Penalty for uncountered threats (-5% to -15% based on severity)
  const uncoveredThreats = threatCoverage.value.filter(t => !t.isCovered)
  uncoveredThreats.forEach(threat => {
    const penalty = threat.severity === 'deadly' ? 15 : threat.severity === 'major' ? 10 : 5
    efficiency -= penalty
  })

  // Cap at 60-150%
  return Math.round(Math.min(150, Math.max(60, efficiency)))
})

// Estimated rewards
const estimatedRewards = computed(() => {
  if (!subzone.value || selectedHeroes.value.length === 0) return null

  const efficiencyMod = estimatedEfficiency.value / 100
  const baseGold = subzone.value.baseGold || 50
  const baseXp = subzone.value.baseXp || 25

  return {
    goldMin: Math.floor(baseGold * efficiencyMod * 0.8),
    goldMax: Math.floor(baseGold * efficiencyMod * 1.2),
    xpMin: Math.floor(baseXp * efficiencyMod * 0.8),
    xpMax: Math.floor(baseXp * efficiencyMod * 1.2),
  }
})

// Expedition preview (kept for API data if needed later)
const preview = ref<any>(null)

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

// Can start expedition
const canStart = computed(() => {
  return selectedHeroIds.value.length > 0 &&
         selectedHeroIds.value.length <= maxTeamSize &&
         zone.value &&
         subzone.value &&
         !expeditionLoading.value
})

// Methods
function toggleHero(heroId: string) {
  const index = selectedHeroIds.value.indexOf(heroId)
  if (index > -1) {
    selectedHeroIds.value.splice(index, 1)
  } else if (selectedHeroIds.value.length < maxTeamSize) {
    selectedHeroIds.value.push(heroId)
  }
}

function removeHero(heroId: string) {
  const index = selectedHeroIds.value.indexOf(heroId)
  if (index > -1) {
    selectedHeroIds.value.splice(index, 1)
  }
}

function clearTeam() {
  selectedHeroIds.value = []
}

async function startExpedition() {
  if (!canStart.value || !zone.value || !subzone.value) return

  error.value = null

  try {
    await expeditionStore.startExpedition({
      zoneId: zone.value.id,
      subzoneId: subzone.value.id,
      heroIds: selectedHeroIds.value,
    })

    toast.success({
      title: 'Expedition started!',
      message: `Your team is now exploring ${subzone.value.name}`,
    })

    // Success - go to active expeditions
    router.push('/expeditions')
  } catch (err: any) {
    const msg = getErrorMessage(err)
    error.value = msg
    toast.error({
      title: 'Failed to start expedition',
      message: msg,
    })
    console.error('Failed to start expedition:', err)
  }
}

// Difficulty styling
function getDifficultyClass(difficulty: string): string {
  const classes: Record<string, string> = {
    easy: 'text-green-400 bg-green-900/30 border-green-700',
    medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
    hard: 'text-orange-400 bg-orange-900/30 border-orange-700',
    extreme: 'text-red-400 bg-red-900/30 border-red-700',
  }
  return classes[difficulty] || 'text-gray-400 bg-gray-700 border-gray-600'
}

function getSpawnTypeClass(spawnType: string): string {
  const classes: Record<string, string> = {
    common: 'text-gray-300 bg-gray-700',
    uncommon: 'text-green-300 bg-green-900/50',
    rare: 'text-blue-300 bg-blue-900/50',
    boss: 'text-purple-300 bg-purple-900/50',
  }
  return classes[spawnType] || 'text-gray-300 bg-gray-700'
}

function getRarityClass(rarity: string): string {
  const classes: Record<string, string> = {
    common: 'text-gray-300 border-gray-600',
    uncommon: 'text-green-300 border-green-600',
    rare: 'text-blue-300 border-blue-600',
  }
  return classes[rarity] || 'text-gray-300 border-gray-600'
}

// Page meta
definePageMeta({
  title: 'Expedition Setup',
})

useHead({
  title: computed(() => subzone.value?.name ?? 'Expedition Setup'),
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Back Navigation -->
    <div class="mb-6">
      <NuxtLink
        :to="`/exploration/${zoneId}`"
        class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <span>&larr;</span>
        <span>Back to {{ zone?.name || 'Zone' }}</span>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="!dataLoaded" class="flex items-center justify-center py-20">
      <div class="text-gray-400">Loading expedition data...</div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!zone || !subzone" class="bg-gray-800 rounded-lg p-12 text-center">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-xl text-gray-300 mb-2">Subzone Not Found</p>
      <p class="text-gray-500 mb-6">This subzone doesn't exist or hasn't been discovered yet</p>
      <NuxtLink
        to="/exploration"
        class="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Return to Exploration
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Subzone Header -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-white">{{ subzone.name }}</h1>
              <span
                :class="[
                  'px-3 py-1 text-sm font-semibold rounded-lg border',
                  getDifficultyClass(subzone.difficulty)
                ]"
              >
                {{ subzone.difficulty.toUpperCase() }}
              </span>
            </div>
            <p class="text-gray-400 text-lg mb-2">{{ subzone.description }}</p>
            <p class="text-sm text-gray-500">{{ zone.name }}</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-4 gap-4 mt-6">
          <div class="bg-gray-900/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ subzone.baseDuration }}</div>
            <div class="text-sm text-gray-400">Minutes</div>
          </div>
          <div class="bg-gray-900/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-guild-gold">{{ subzone.baseGold }}</div>
            <div class="text-sm text-gray-400">Base Gold</div>
          </div>
          <div class="bg-gray-900/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-400">{{ subzone.baseXp }}</div>
            <div class="text-sm text-gray-400">Base XP</div>
          </div>
          <div class="bg-gray-900/50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-400">{{ subzone.mastery }}%</div>
            <div class="text-sm text-gray-400">Mastery</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Subzone Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Threats Section -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-red-400">⚠️</span>
              Threats
              <span v-if="selectedHeroIds.length > 0" class="text-sm font-normal ml-auto">
                <span :class="coveredThreatsCount === totalThreatsCount ? 'text-green-400' : 'text-yellow-400'">
                  {{ coveredThreatsCount }}/{{ totalThreatsCount }} countered
                </span>
              </span>
            </h2>

            <div v-if="threatCoverage.length > 0" class="space-y-3">
              <div
                v-for="threat in threatCoverage"
                :key="threat.threatId"
                class="p-3 rounded-lg"
                :class="threat.isCovered
                  ? 'bg-green-900/30 border border-green-700'
                  : 'bg-red-900/30 border border-red-700'"
              >
                <!-- Threat Header -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">
                      {{ threat.isCovered ? '✓' : '!' }}
                    </span>
                    <div>
                      <span class="font-medium text-white">{{ threat.threatName }}</span>
                      <span
                        class="ml-2 text-xs px-1.5 py-0.5 rounded capitalize"
                        :class="{
                          'bg-gray-700 text-gray-300': threat.severity === 'minor',
                          'bg-yellow-900/50 text-yellow-300': threat.severity === 'major',
                          'bg-red-900/50 text-red-300': threat.severity === 'deadly',
                        }"
                      >
                        {{ threat.severity }}
                      </span>
                    </div>
                  </div>
                  <span
                    class="text-sm px-2 py-1 rounded"
                    :class="threat.isCovered
                      ? 'bg-green-800 text-green-300'
                      : 'bg-red-800 text-red-300'"
                  >
                    {{ threat.isCovered ? 'Countered' : 'Uncountered' }}
                  </span>
                </div>

                <!-- Threat Description -->
                <p class="text-sm text-gray-400 mb-2 ml-8">{{ threat.threatDescription }}</p>

                <!-- Who counters it (if covered) -->
                <div v-if="threat.isCovered && threat.counteredBy.length > 0" class="ml-8">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="counter in threat.counteredBy"
                      :key="`${counter.heroId}-${counter.tagId}`"
                      class="text-xs bg-green-800/50 text-green-300 px-2 py-1 rounded"
                    >
                      {{ counter.heroName }}'s {{ counter.tagName }}
                    </span>
                  </div>
                </div>

                <!-- What could counter it (if not covered) -->
                <div v-else-if="!threat.isCovered && threat.neededTags.length > 0" class="ml-8">
                  <span class="text-xs text-gray-500">Needs: </span>
                  <span class="text-xs text-gray-400">{{ threat.neededTags.join(' or ') }}</span>
                </div>
              </div>

              <p class="text-sm text-gray-500 mt-4">
                Countered threats grant +5% efficiency. Uncountered threats reduce rewards based on severity.
              </p>
            </div>

            <div v-else class="text-gray-500 text-center py-4">
              No special threats in this subzone
            </div>
          </div>

          <!-- Monsters Section -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>👹</span>
              Monsters
            </h2>

            <div v-if="subzone.monsters && subzone.monsters.length > 0" class="space-y-3">
              <div
                v-for="monster in subzone.monsters"
                :key="monster.monsterId"
                class="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded capitalize',
                      getSpawnTypeClass(monster.spawnType)
                    ]"
                  >
                    {{ monster.spawnType }}
                  </span>
                  <span class="font-medium text-white capitalize">
                    {{ monster.monsterId.replace(/_/g, ' ') }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm">
                  <span class="text-gray-400">
                    Power: <span class="text-orange-400 font-semibold">{{ monster.power }}</span>
                  </span>
                  <span class="text-gray-400">
                    Capture: <span class="text-blue-400 font-semibold">{{ monster.baseCaptureChance }}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="text-gray-500 text-center py-4">
              No monster data available
            </div>
          </div>

          <!-- Collectibles Section -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💎</span>
              Collectibles & Loot
            </h2>

            <div v-if="subzone.collectibles && subzone.collectibles.length > 0" class="grid grid-cols-2 gap-3">
              <div
                v-for="collectible in subzone.collectibles"
                :key="collectible.id"
                class="p-3 bg-gray-900/50 rounded-lg border"
                :class="getRarityClass(collectible.rarity)"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-medium text-white">{{ collectible.name }}</span>
                  <span class="text-xs capitalize px-2 py-0.5 rounded bg-gray-700">
                    {{ collectible.rarity }}
                  </span>
                </div>
                <p class="text-sm text-gray-400 mb-2">{{ collectible.description }}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span>Drop: {{ collectible.dropChance }}%</span>
                  <span v-if="collectible.requiresMastery > 0">
                    Requires {{ collectible.requiresMastery }}% mastery
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="text-gray-500 text-center py-4">
              No collectibles data available
            </div>
          </div>

          <!-- Team Selection -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-bold text-white mb-4">
              Select Team ({{ selectedHeroIds.length }}/{{ maxTeamSize }})
            </h2>

            <!-- Available Heroes -->
            <div>
              <h3 class="text-sm font-semibold text-gray-400 mb-3">
                Available Heroes ({{ availableHeroes.length }})
              </h3>

              <div v-if="availableHeroes.length > 0" class="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                <button
                  v-for="hero in availableHeroes"
                  :key="hero.id"
                  @click="toggleHero(hero.id)"
                  :disabled="!selectedHeroIds.includes(hero.id) && selectedHeroIds.length >= maxTeamSize"
                  :class="[
                    'text-left transition-all relative',
                    selectedHeroIds.includes(hero.id)
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800'
                      : 'hover:ring-2 hover:ring-gray-600',
                    !selectedHeroIds.includes(hero.id) && selectedHeroIds.length >= maxTeamSize && 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  <HeroCard :hero="hero" :show-details="false" />
                  <div
                    v-if="selectedHeroIds.includes(hero.id)"
                    class="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                  >
                    ✓
                  </div>
                </button>
              </div>

              <div v-else class="text-center py-8 text-gray-500">
                <p>No heroes available</p>
                <p class="text-sm">All heroes are on expeditions or need rest</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Expedition Preview & Actions -->
        <div class="space-y-6">
          <div class="bg-gray-800 rounded-lg p-6 sticky top-6">
            <h2 class="text-xl font-bold text-white mb-4">Expedition Preview</h2>

            <!-- Team Power -->
            <div v-if="selectedHeroIds.length > 0" class="space-y-4">
              <!-- Selected Team -->
              <div class="pb-3 border-b border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400">Team ({{ selectedHeroes.length }}/{{ maxTeamSize }})</span>
                  <button
                    v-if="selectedHeroes.length > 0"
                    class="text-xs text-red-400 hover:text-red-300"
                    @click="clearTeam"
                  >
                    Clear
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="hero in selectedHeroes"
                    :key="hero.id"
                    class="flex items-center gap-2 bg-gray-700 rounded-lg px-2 py-1.5 group"
                  >
                    <HeroPortrait :hero="hero" size="sm" class="w-8 h-8" />
                    <div class="min-w-0">
                      <div class="text-sm font-medium text-white truncate max-w-[80px]">{{ hero.name }}</div>
                      <div class="text-xs text-gray-400">{{ hero.power }} pwr</div>
                    </div>
                    <button
                      class="text-gray-500 hover:text-red-400 transition-colors ml-1"
                      @click="removeHero(hero.id)"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pb-3 border-b border-gray-700">
                <span class="text-gray-400">Team Power</span>
                <span class="text-2xl font-bold text-orange-400">{{ totalPower }}</span>
              </div>

              <!-- Efficiency -->
              <div class="flex items-center justify-between pb-3 border-b border-gray-700">
                <span class="text-gray-400">Efficiency</span>
                <span
                  class="text-xl font-bold"
                  :class="{
                    'text-red-400': estimatedEfficiency < 70,
                    'text-yellow-400': estimatedEfficiency >= 70 && estimatedEfficiency < 100,
                    'text-green-400': estimatedEfficiency >= 100,
                  }"
                >
                  {{ estimatedEfficiency }}%
                </span>
              </div>

              <!-- Threat Coverage -->
              <div class="pb-3 border-b border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-gray-400">Threat Coverage</span>
                  <span class="font-semibold" :class="coveredThreatsCount === totalThreatsCount ? 'text-green-400' : 'text-yellow-400'">
                    {{ coveredThreatsCount }}/{{ totalThreatsCount }}
                  </span>
                </div>
                <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all"
                    :class="coveredThreatsCount === totalThreatsCount ? 'bg-green-500' : 'bg-yellow-500'"
                    :style="{ width: `${(coveredThreatsCount / Math.max(totalThreatsCount, 1)) * 100}%` }"
                  />
                </div>
                <!-- Mini threat list -->
                <div v-if="threatCoverage.length > 0" class="mt-2 space-y-1">
                  <div
                    v-for="threat in threatCoverage"
                    :key="threat.threatId"
                    class="flex items-center gap-2 text-xs"
                  >
                    <span :class="threat.isCovered ? 'text-green-400' : 'text-red-400'">
                      {{ threat.isCovered ? '✓' : '✗' }}
                    </span>
                    <span class="text-gray-300">{{ threat.threatName }}</span>
                    <span v-if="threat.isCovered && threat.counteredBy.length > 0" class="text-gray-500 truncate">
                      ({{ threat.counteredBy[0].tagName }})
                    </span>
                  </div>
                </div>
              </div>

              <!-- Estimated Rewards -->
              <div v-if="estimatedRewards" class="space-y-3">
                <h3 class="text-sm font-semibold text-gray-400">Estimated Rewards</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-gray-900/50 rounded-lg p-3 text-center">
                    <div class="text-xs text-gray-500 mb-1">Gold</div>
                    <div class="text-lg font-bold text-guild-gold">
                      {{ estimatedRewards.goldMin }}-{{ estimatedRewards.goldMax }}
                    </div>
                  </div>
                  <div class="bg-gray-900/50 rounded-lg p-3 text-center">
                    <div class="text-xs text-gray-500 mb-1">XP</div>
                    <div class="text-lg font-bold text-blue-400">
                      {{ estimatedRewards.xpMin }}-{{ estimatedRewards.xpMax }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Duration -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Duration</span>
                <span class="text-white">{{ subzone.baseDuration }} minutes</span>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8 text-gray-500">
              <p>Select heroes to see expedition preview</p>
            </div>

            <!-- Actions -->
            <div class="space-y-3 mt-6 pt-6 border-t border-gray-700">
              <button
                @click="startExpedition"
                :disabled="!canStart"
                :class="[
                  'w-full py-3 px-6 rounded-lg font-semibold transition-colors',
                  canStart
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                ]"
              >
                {{ expeditionLoading ? 'Starting...' : 'Start Expedition' }}
              </button>

              <NuxtLink
                :to="`/exploration/${zoneId}`"
                class="block w-full py-3 px-6 rounded-lg border border-gray-600 text-gray-300 font-semibold hover:bg-gray-700 transition-colors text-center"
              >
                Cancel
              </NuxtLink>
            </div>

            <!-- Error Display -->
            <div v-if="error" class="mt-4 bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-400 text-sm">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
