<template>
  <div class="expedition-active bg-gray-800 rounded-lg p-6 space-y-6">
    <!-- Header -->
    <div class="header flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold text-white mb-1">
          {{ zone?.name }} - {{ subzone?.name }}
        </h2>
        <div class="text-sm text-gray-400">
          {{ expedition.autoRepeat ? '🔁 Auto-repeat enabled' : 'Single run' }}
        </div>
      </div>
      <div
        v-if="expedition.efficiency"
        :class="[
          'efficiency-badge px-3 py-1 rounded-full font-semibold',
          expedition.efficiency >= 100 ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
        ]"
      >
        {{ Math.round(expedition.efficiency) }}% Efficiency
      </div>
    </div>

    <!-- Timer and Progress -->
    <div class="timer-section">
      <!-- Progress Bar -->
      <div class="progress-bar-container mb-3">
        <div class="relative w-full h-8 bg-gray-700 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000"
            :style="{ width: `${progressPercentage}%` }"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-white font-semibold text-sm z-10">
              {{ progressPercentage }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Time Display -->
      <div class="flex justify-between items-center text-lg">
        <div class="text-gray-400">
          Time Remaining:
        </div>
        <div
          :class="[
            'font-bold tabular-nums',
            isComplete ? 'text-green-400' : 'text-white'
          ]"
        >
          {{ isComplete ? 'Complete!' : formatTime(timeRemaining) }}
        </div>
      </div>
    </div>

    <!-- Hero Party Display -->
    <div class="party-section">
      <h3 class="text-lg font-semibold text-white mb-3">Party</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="hero in heroes"
          :key="hero.id"
          class="hero-card bg-gray-700 rounded-lg p-3 flex items-center gap-3"
        >
          <div class="flex-1">
            <div class="font-semibold text-white">{{ hero.name }}</div>
            <div class="text-sm text-gray-400">Level {{ hero.level }} {{ hero.archetype }}</div>
            <div class="text-xs text-gray-500 mt-1">
              Morale: {{ hero.moraleValue }}/100
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-400">Power</div>
            <div class="text-lg font-bold text-blue-400">{{ hero.power }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Stats -->
    <div class="team-stats grid grid-cols-3 gap-4">
      <div class="stat-card bg-gray-700 rounded-lg p-4">
        <div class="text-sm text-gray-400 mb-1">Team Power</div>
        <div class="text-2xl font-bold text-blue-400">{{ expedition.teamPower }}</div>
      </div>
      <div class="stat-card bg-gray-700 rounded-lg p-4">
        <div class="text-sm text-gray-400 mb-1">Duration</div>
        <div class="text-2xl font-bold text-gray-300">{{ expedition.durationMinutes }}m</div>
      </div>
      <div class="stat-card bg-gray-700 rounded-lg p-4">
        <div class="text-sm text-gray-400 mb-1">Status</div>
        <div
          :class="[
            'text-2xl font-bold',
            isComplete ? 'text-green-400' : 'text-yellow-400'
          ]"
        >
          {{ isComplete ? 'Ready' : 'Active' }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions flex gap-3">
      <button
        v-if="isComplete"
        @click="completeExpedition"
        :disabled="loading"
        class="flex-1 py-3 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Completing...' : 'Complete Expedition' }}
      </button>
      <button
        v-if="!isComplete"
        @click="showCancelConfirm = true"
        :disabled="loading"
        class="px-6 py-3 rounded-lg border border-red-600 text-red-400 hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div
      v-if="showCancelConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showCancelConfirm = false"
    >
      <div class="bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-xl font-bold text-white mb-4">Cancel Expedition?</h3>
        <p class="text-gray-300 mb-6">
          Canceling will free your heroes but they will lose 20 morale and receive no rewards.
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelExpedition"
            :disabled="loading"
            class="flex-1 py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Canceling...' : 'Confirm Cancel' }}
          </button>
          <button
            @click="showCancelConfirm = false"
            :disabled="loading"
            class="flex-1 py-2 px-4 rounded border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Keep Going
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useExpeditionStore } from '~/stores/expeditions'
import { useHeroStore } from '~/stores/heroes'
import type { Expedition, Zone, Subzone, Hero } from '~~/types'
import { toError } from '~~/shared/utils/errorHandler'

interface Props {
  expedition: Expedition
  zone?: Zone
  subzone?: Subzone
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'completed'): void
  (e: 'canceled'): void
}>()

const expeditionStore = useExpeditionStore()
const heroStore = useHeroStore()

const timeRemaining = ref(0)
const progressPercentage = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)
const showCancelConfirm = ref(false)

let intervalId: NodeJS.Timeout | null = null

// Get heroes in this expedition
const heroes = computed(() => {
  return heroStore.heroes.filter(h => props.expedition.heroIds.includes(h.id))
})

const isComplete = computed(() => {
  return timeRemaining.value <= 0
})

function calculateTimeRemaining() {
  const now = new Date().getTime()
  const endTime = new Date(props.expedition.completesAt).getTime()
  const remaining = Math.max(0, endTime - now)

  timeRemaining.value = remaining

  // Calculate progress percentage
  const startTime = new Date(props.expedition.startedAt).getTime()
  const totalDuration = endTime - startTime
  const elapsed = now - startTime
  progressPercentage.value = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
}

function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

async function completeExpedition() {
  if (!isComplete.value) return

  loading.value = true
  error.value = null

  try {
    await expeditionStore.completeExpedition(props.expedition.id)
    emit('completed')
  } catch (err: unknown) {
    const e = toError(err)
    error.value = e.message || 'Failed to complete expedition'
  } finally {
    loading.value = false
  }
}

async function cancelExpedition() {
  loading.value = true
  error.value = null
  showCancelConfirm.value = false

  try {
    await $fetch(`/api/expeditions/${props.expedition.id}/cancel`, {
      method: 'POST'
    })
    emit('canceled')
  } catch (err: unknown) {
    const e = toError(err)
    error.value = e.message || 'Failed to cancel expedition'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  calculateTimeRemaining()
  intervalId = setInterval(calculateTimeRemaining, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.expedition-active {
  max-width: 800px;
  margin: 0 auto;
}
</style>
