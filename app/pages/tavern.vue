<script setup lang="ts">
import { useTavernStore } from '~/stores/tavern'
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Tavern',
})

const tavernStore = useTavernStore()
const { tavernHeroes, loading, nextRefreshAt } = storeToRefs(tavernStore)

onMounted(() => {
  tavernStore.fetchTavern()
})

const timeUntilRefresh = ref('')

// Calculate time until refresh
const updateRefreshTimer = () => {
  if (!nextRefreshAt.value) {
    timeUntilRefresh.value = ''
    return
  }

  const now = Date.now()
  const refreshTime = new Date(nextRefreshAt.value).getTime()
  const diff = refreshTime - now

  if (diff <= 0) {
    timeUntilRefresh.value = 'Ready to refresh'
    return
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  timeUntilRefresh.value = `${hours}h ${minutes}m ${seconds}s`
}

// Update timer every second
onMounted(() => {
  updateRefreshTimer()
  const interval = setInterval(updateRefreshTimer, 1000)
  onUnmounted(() => clearInterval(interval))
})

const handleRefresh = async () => {
  await tavernStore.refreshTavern()
}

const handleRecruit = async (index: number) => {
  try {
    await tavernStore.recruitHero(index)
  } catch (error) {
    console.error('Failed to recruit hero:', error)
  }
}

const handleLock = async (index: number) => {
  try {
    await tavernStore.lockHero(index)
  } catch (error) {
    console.error('Failed to lock hero:', error)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        The Tavern
      </h1>
      <p class="text-gray-600">
        Recruit heroes to join your guild
      </p>
    </div>

    <!-- Refresh info -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-800 mb-1">Next Refresh</h3>
          <p class="text-gray-600">{{ timeUntilRefresh || 'Loading...' }}</p>
        </div>
        <button
          :disabled="loading"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          @click="handleRefresh"
        >
          Manual Refresh (50 gems)
        </button>
      </div>
    </div>

    <!-- Tavern heroes -->
    <div v-if="!loading && tavernHeroes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(hero, index) in tavernHeroes"
        :key="index"
        class="bg-white rounded-lg shadow p-6 border-2"
        :class="hero.isLocked ? 'border-yellow-500' : 'border-gray-200'"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">{{ hero.name }}</h3>
            <p class="text-sm text-gray-600 capitalize">
              {{ hero.rarity }} {{ hero.archetype }}
            </p>
          </div>
          <button
            class="text-2xl hover:scale-110 transition-transform"
            @click="handleLock(index)"
          >
            {{ hero.isLocked ? '🔒' : '🔓' }}
          </button>
        </div>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Power</span>
            <span class="font-bold text-gray-800">{{ hero.power }}</span>
          </div>
          <div class="text-sm text-gray-600">
            <span class="font-medium">Traits:</span> {{ hero.gameplayTraits.length }} gameplay, {{ hero.storyTraitIds.length }} story
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-gray-600">Recruit Cost</span>
            <span class="text-xl font-bold text-gray-800">{{ hero.recruitCost }} 💰</span>
          </div>
          <button
            :disabled="loading"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            @click="handleRecruit(index)"
          >
            Recruit Hero
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading" class="bg-white rounded-lg shadow p-12 text-center">
      <div class="text-6xl mb-4">🍺</div>
      <p class="text-xl text-gray-700 mb-2">The tavern is empty</p>
      <p class="text-gray-600 mb-6">Wait for the next refresh or use gems to refresh now</p>
      <button
        class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        @click="handleRefresh"
      >
        Refresh Now (50 gems)
      </button>
    </div>

    <!-- Loading state -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">Loading tavern...</p>
    </div>
  </div>
</template>
