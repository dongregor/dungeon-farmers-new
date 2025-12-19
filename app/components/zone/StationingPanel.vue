<script setup lang="ts">
import { useStationingStore } from '~/stores/stationing'
import { useHeroStore } from '~/stores/heroes'
import { storeToRefs } from 'pinia'
import type { Hero } from '~/types'

interface Props {
  zoneId: string
  zoneName: string
}

const props = defineProps<Props>()

const stationingStore = useStationingStore()
const heroStore = useHeroStore()

const { capacity, limits, byZone, readyToCollectCount } = storeToRefs(stationingStore)
const { heroes } = storeToRefs(heroStore)

const showStationModal = ref(false)
const showRewardsModal = ref(false)
const selectedHeroId = ref<string | null>(null)
const processing = ref(false)
const lastRewards = ref<any>(null)

onMounted(() => {
  stationingStore.fetchStationed()
})

const stationedInZone = computed(() => {
  return byZone.value(props.zoneId)
})

const stationedHeroes = computed(() => {
  return stationedInZone.value
    .map(s => heroes.value.find(h => h.id === s.heroId))
    .filter((h): h is Hero => h !== undefined)
})

const availableHeroes = computed(() => {
  return heroes.value.filter(hero => {
    // Not on expedition
    // Not already stationed
    // Not tired or frustrated
    return !hero.expeditionId &&
      !stationingStore.isHeroStationed(hero.id) &&
      hero.morale !== 'Tired' &&
      hero.morale !== 'Frustrated'
  })
})

const canStationMore = computed(() => {
  return stationingStore.canStationMore && stationingStore.canStationInZone(props.zoneId)
})

const formatDuration = (stationedAt: string) => {
  const now = Date.now()
  const stationed = new Date(stationedAt).getTime()
  const diff = now - stationed

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const canCollect = (stationedAt: string, lastCollectedAt: string) => {
  const now = Date.now()
  const lastCollected = new Date(lastCollectedAt).getTime()
  const minDuration = 60 * 60 * 1000 // 1 hour

  return now - lastCollected >= minDuration
}

const handleStationHero = async () => {
  if (!selectedHeroId.value) return

  processing.value = true
  try {
    await stationingStore.stationHero(selectedHeroId.value, props.zoneId)
    showStationModal.value = false
    selectedHeroId.value = null
  } catch (err: unknown) {
      const error = toError(err)
    alert(error.message)
  } finally {
    processing.value = false
  }
}

const handleRecallHero = async (heroId: string) => {
  processing.value = true
  try {
    const data = await stationingStore.recallHero(heroId)
    lastRewards.value = data.rewards
    showRewardsModal.value = true
  } catch (err: unknown) {
      const error = toError(err)
    alert(error.message)
  } finally {
    processing.value = false
  }
}

const handleCollectRewards = async (heroId: string) => {
  processing.value = true
  try {
    const data = await stationingStore.collectRewards(heroId)
    lastRewards.value = data.rewards
    showRewardsModal.value = true

    if (data.autoRecalled) {
      alert(`Hero was recalled due to low morale (${data.heroMoraleStatus})`)
    }
  } catch (err: unknown) {
      const error = toError(err)
    alert(error.message)
  } finally {
    processing.value = false
  }
}

const handleCollectAll = async () => {
  processing.value = true
  try {
    const data = await stationingStore.collectAllRewards()
    if (data.collected > 0) {
      lastRewards.value = data.totalRewards
      showRewardsModal.value = true

      if (data.autoRecalled.length > 0) {
        alert(`${data.autoRecalled.length} hero(es) were recalled due to low morale`)
      }
    }
  } catch (err: unknown) {
      const error = toError(err)
    alert(error.message)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-400 to-green-600 p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-white">Stationed Heroes</h3>
          <p class="text-sm text-green-100">{{ zoneName }}</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-green-100">Global: {{ capacity.currentStationedCount }} / {{ limits.globalCap }}</div>
          <div class="text-sm text-green-100">This Zone: {{ stationedInZone.length }} / {{ limits.perZoneCap }}</div>
        </div>
      </div>
    </div>

    <!-- Stationed Heroes List -->
    <div class="p-4">
      <div v-if="stationedHeroes.length > 0" class="space-y-3">
        <div
          v-for="hero in stationedHeroes"
          :key="hero.id"
          class="border-2 border-green-300 rounded-lg p-3 bg-green-50"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-bold text-gray-800">{{ hero.name }}</h4>
                <span class="text-xs bg-gray-200 px-2 py-1 rounded">{{ hero.archetype }}</span>
              </div>
              <div class="text-sm text-gray-600 mb-2">
                Stationed for: <span class="font-medium">{{ formatDuration(stationingStore.getStationedHero(hero.id)!.stationedAt) }}</span>
              </div>
              <div class="text-xs text-gray-500">
                Generating: Zone materials, Familiarity, Subzone discoveries
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <button
                v-if="canCollect(
                  stationingStore.getStationedHero(hero.id)!.stationedAt,
                  stationingStore.getStationedHero(hero.id)!.lastCollectedAt
                )"
                class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold px-3 py-1 rounded transition-colors"
                :disabled="processing"
                @click="handleCollectRewards(hero.id)"
              >
                Collect
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-3 py-1 rounded transition-colors"
                :disabled="processing"
                @click="handleRecallHero(hero.id)"
              >
                Recall
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <div class="text-4xl mb-2">🏕️</div>
        <p>No heroes stationed in this zone</p>
      </div>

      <!-- Station Hero Button -->
      <div v-if="canStationMore" class="mt-4">
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
          @click="showStationModal = true"
        >
          + Station Hero
        </button>
      </div>

      <div v-else class="mt-4 text-center text-sm text-gray-500">
        <p v-if="!stationingStore.canStationMore">
          Global limit reached ({{ limits.globalCap }})
        </p>
        <p v-else>
          Zone limit reached ({{ limits.perZoneCap }})
        </p>
      </div>

      <!-- Collect All Button -->
      <div v-if="readyToCollectCount > 0" class="mt-3">
        <button
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg transition-colors"
          :disabled="processing"
          @click="handleCollectAll"
        >
          Collect All Rewards ({{ readyToCollectCount }})
        </button>
      </div>
    </div>

    <!-- Station Hero Modal -->
    <div
      v-if="showStationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showStationModal = false"
    >
      <div class="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Select Hero to Station</h3>

        <div v-if="availableHeroes.length > 0" class="space-y-2">
          <button
            v-for="hero in availableHeroes"
            :key="hero.id"
            class="w-full text-left border-2 rounded-lg p-3 hover:bg-gray-50 transition-colors"
            :class="selectedHeroId === hero.id ? 'border-green-500 bg-green-50' : 'border-gray-200'"
            @click="selectedHeroId = hero.id"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-gray-800">{{ hero.name }}</div>
                <div class="text-sm text-gray-600">{{ hero.archetype }} • Lv{{ hero.level }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  Survival: {{ hero.stats.survival }} (affects station duration)
                </div>
              </div>
              <div class="text-2xl">
                {{ selectedHeroId === hero.id ? '✓' : '' }}
              </div>
            </div>
          </button>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <p>No available heroes</p>
          <p class="text-sm mt-2">Heroes must be rested and not on expeditions</p>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition-colors"
            @click="showStationModal = false"
          >
            Cancel
          </button>
          <button
            class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
            :disabled="!selectedHeroId || processing"
            @click="handleStationHero"
          >
            Station Hero
          </button>
        </div>
      </div>
    </div>

    <!-- Rewards Modal -->
    <div
      v-if="showRewardsModal && lastRewards"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showRewardsModal = false"
    >
      <div class="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Rewards Collected!</h3>

        <div class="space-y-3">
          <!-- Materials -->
          <div v-if="lastRewards.materials && lastRewards.materials.length > 0" class="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
            <div class="font-bold text-gray-700 mb-2">Materials</div>
            <div class="space-y-1">
              <div
                v-for="material in lastRewards.materials"
                :key="material.id"
                class="flex items-center justify-between text-sm"
              >
                <span>{{ material.name }}</span>
                <span class="font-bold">+{{ material.count }}</span>
              </div>
            </div>
          </div>

          <!-- Familiarity -->
          <div v-if="lastRewards.familiarityGain > 0" class="bg-purple-50 border-2 border-purple-300 rounded-lg p-3">
            <div class="font-bold text-gray-700">Familiarity</div>
            <div class="text-sm">+{{ lastRewards.familiarityGain }} familiarity</div>
          </div>

          <!-- Subzone Discovery -->
          <div v-if="lastRewards.subzoneDiscovered" class="bg-green-50 border-2 border-green-300 rounded-lg p-3">
            <div class="font-bold text-gray-700 mb-1">🎉 Subzone Discovered!</div>
            <div class="text-sm">{{ lastRewards.subzoneDiscovered.name }}</div>
          </div>

          <!-- Quest Hook -->
          <div v-if="lastRewards.questHookGenerated" class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
            <div class="font-bold text-gray-700 mb-1">📜 Quest Available!</div>
            <div class="text-sm">{{ lastRewards.questHookGenerated.title }}</div>
          </div>
        </div>

        <button
          class="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
          @click="showRewardsModal = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
