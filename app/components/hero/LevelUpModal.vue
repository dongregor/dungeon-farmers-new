<script setup lang="ts">
import type { Hero } from '~~/types'

interface Props {
  hero: Hero
  oldLevel: number
  newLevel: number
  powerGain: number
  show: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const levelsGained = computed(() => props.newLevel - props.oldLevel)

const statGainPerLevel = 0.5 // From power calculator

const totalStatGain = computed(() => {
  return Math.round(levelsGained.value * statGainPerLevel * 3 * 10) / 10
})

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="text-6xl mb-2">⭐</div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">
          Level Up!
        </h2>
        <p class="text-xl text-gray-600">
          {{ hero.name }} reached level {{ newLevel }}!
        </p>
      </div>

      <!-- Stats -->
      <div class="space-y-4 mb-6">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 font-medium">Level</span>
            <span class="text-2xl font-bold text-blue-600">
              {{ oldLevel }} → {{ newLevel }}
            </span>
          </div>
          <div v-if="levelsGained > 1" class="text-sm text-gray-600 text-right mt-1">
            +{{ levelsGained }} levels
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-700 font-medium">Power</span>
            <span class="text-2xl font-bold text-purple-600">
              +{{ powerGain }}
            </span>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-gray-700 font-medium mb-2">Stat Increases</div>
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div class="text-center">
              <div class="text-gray-600">Combat</div>
              <div class="font-bold text-green-600">+{{ statGainPerLevel * levelsGained }}</div>
            </div>
            <div class="text-center">
              <div class="text-gray-600">Utility</div>
              <div class="font-bold text-green-600">+{{ statGainPerLevel * levelsGained }}</div>
            </div>
            <div class="text-center">
              <div class="text-gray-600">Survival</div>
              <div class="font-bold text-green-600">+{{ statGainPerLevel * levelsGained }}</div>
            </div>
          </div>
        </div>

        <!-- Prestige hint at level 60 -->
        <div v-if="newLevel >= 60" class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl">👑</span>
            <div>
              <div class="font-bold text-yellow-800">Prestige Available!</div>
              <div class="text-sm text-yellow-700">
                Your hero has reached max level and can now prestige for permanent bonuses.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close button -->
      <button
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        @click="handleClose"
      >
        Continue
      </button>
    </div>
  </div>
</template>
