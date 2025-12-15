<script setup lang="ts">
import type { Hero } from '~~/types'
import { getPrestigeInfo } from '~/utils/prestigeService'

interface Props {
  hero: Hero
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const prestigeInfo = computed(() => getPrestigeInfo(props.hero.prestigeLevel))

const newPrestigeLevel = computed(() => props.hero.prestigeLevel + 1)

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const canPrestige = computed(() => props.hero.level >= 60)
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="text-6xl mb-2">👑</div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">
          Prestige Hero
        </h2>
        <p class="text-lg text-gray-600">
          {{ hero.name }} - Level {{ hero.level }}
        </p>
      </div>

      <!-- Current Prestige Level -->
      <div class="bg-purple-50 rounded-lg p-4 mb-4">
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-1">Current Prestige</div>
          <div class="text-3xl font-bold text-purple-600">
            {{ hero.prestigeLevel }}
          </div>
        </div>
      </div>

      <!-- What You'll Gain -->
      <div class="mb-6">
        <h3 class="font-bold text-gray-800 mb-3 text-lg">Prestige Benefits:</h3>
        <div class="space-y-3">
          <div class="flex items-start gap-2">
            <span class="text-green-500 text-xl">✓</span>
            <div>
              <div class="font-medium text-gray-800">
                +{{ prestigeInfo.statBonus }} to All Stats (Permanent)
              </div>
              <div class="text-sm text-gray-600">
                Applies to Combat, Utility, and Survival
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <span class="text-green-500 text-xl">✓</span>
            <div>
              <div class="font-medium text-gray-800">
                {{ Math.round(prestigeInfo.upgradeChance * 100) }}% Trait Upgrade Chance
              </div>
              <div class="text-sm text-gray-600">
                Each trait may upgrade: Normal → Magic → Perfect
              </div>
            </div>
          </div>

          <div v-if="prestigeInfo.grantsTraitSlot" class="flex items-start gap-2">
            <span class="text-green-500 text-xl">✓</span>
            <div>
              <div class="font-medium text-gray-800">
                Gain Extra Trait Slot
              </div>
              <div class="text-sm text-gray-600">
                Unlock an additional gameplay trait
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <span class="text-green-500 text-xl">✓</span>
            <div>
              <div class="font-medium text-gray-800">
                Full Morale Restore
              </div>
              <div class="text-sm text-gray-600">
                Hero returns refreshed and eager
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- What You'll Lose -->
      <div class="mb-6">
        <h3 class="font-bold text-gray-800 mb-3 text-lg">Reset on Prestige:</h3>
        <div class="space-y-2">
          <div class="flex items-start gap-2">
            <span class="text-red-500 text-xl">⚠</span>
            <div>
              <div class="font-medium text-gray-800">
                Level resets to 1
              </div>
              <div class="text-sm text-gray-600">
                Start leveling journey again
              </div>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <span class="text-red-500 text-xl">⚠</span>
            <div>
              <div class="font-medium text-gray-800">
                All equipment unequipped
              </div>
              <div class="text-sm text-gray-600">
                Items return to inventory
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning if not max level -->
      <div v-if="!canPrestige" class="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🚫</span>
          <div>
            <div class="font-bold text-red-800">Cannot Prestige</div>
            <div class="text-sm text-red-700">
              Hero must reach level 60 before prestiging.
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3">
        <button
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          :disabled="!canPrestige"
          class="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleConfirm"
        >
          Prestige to {{ newPrestigeLevel }}
        </button>
      </div>

      <!-- Info note -->
      <div class="mt-4 text-xs text-gray-500 text-center">
        Prestige is permanent and cannot be undone.
      </div>
    </div>
  </div>
</template>
