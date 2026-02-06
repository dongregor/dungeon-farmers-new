<script setup lang="ts">
import { useTavernStore } from '~/stores/tavern'
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'Tavern',
})

const tavernStore = useTavernStore()
const toast = useToast()
const { slots, loading, nextRefreshAt, nextRefreshCost } = storeToRefs(tavernStore)

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

// Check if refresh is free (timer expired)
const isFreeRefresh = computed(() => {
  if (!nextRefreshAt.value) return false
  return new Date(nextRefreshAt.value).getTime() <= Date.now()
})

// Refresh button label
const refreshButtonLabel = computed(() => {
  if (isFreeRefresh.value) {
    return 'Refresh (Free)'
  }
  return `Refresh (${nextRefreshCost.value} Gold)`
})

// Update timer every second
onMounted(() => {
  updateRefreshTimer()
  const interval = setInterval(updateRefreshTimer, 1000)
  onUnmounted(() => clearInterval(interval))
})

const handleRefresh = async () => {
  try {
    await tavernStore.refreshTavern()
    toast.success('Tavern refreshed!')
  } catch (error: any) {
    toast.error({
      title: 'Refresh failed',
      message: getErrorMessage(error),
    })
  }
}

const handleRecruit = async (index: number) => {
  const hero = slots.value[index]?.hero
  try {
    await tavernStore.recruitHero(index)
    toast.success({
      title: 'Hero recruited!',
      message: hero ? `${hero.name} has joined your guild` : undefined,
    })
  } catch (error: any) {
    toast.error({
      title: 'Recruitment failed',
      message: getErrorMessage(error),
    })
  }
}

const handleLock = async (index: number) => {
  try {
    await tavernStore.lockHero(index)
    toast.info('Hero locked')
  } catch (error: any) {
    toast.error({
      title: 'Lock failed',
      message: getErrorMessage(error),
    })
  }
}

const handleUnlock = async (index: number) => {
  try {
    await tavernStore.unlockHero(index)
    toast.info('Hero unlocked')
  } catch (error: any) {
    toast.error({
      title: 'Unlock failed',
      message: getErrorMessage(error),
    })
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
          class="text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          :class="isFreeRefresh ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'"
          @click="handleRefresh"
        >
          {{ refreshButtonLabel }}
        </button>
      </div>
    </div>

    <!-- Tavern heroes -->
    <div v-if="!loading && slots.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TavernSlot
        v-for="slot in slots"
        :key="slot.index"
        :hero="slot.hero"
        :slot-index="slot.index"
        :is-locked="slot.isLocked"
        @recruit="handleRecruit"
        @lock="handleLock"
        @unlock="handleUnlock"
      />
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading" class="bg-white rounded-lg shadow p-12 text-center">
      <div class="text-6xl mb-4">🍺</div>
      <p class="text-xl text-gray-700 mb-2">The tavern is empty</p>
      <p class="text-gray-600 mb-6">Wait for the next refresh or spend gold to refresh early</p>
      <button
        class="inline-block text-white font-bold py-3 px-6 rounded-lg transition-colors"
        :class="isFreeRefresh ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'"
        @click="handleRefresh"
      >
        {{ refreshButtonLabel }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">Loading tavern...</p>
    </div>
  </div>
</template>
