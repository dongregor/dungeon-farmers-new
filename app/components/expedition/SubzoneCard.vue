<template>
  <div
    :class="[
      'subzone-card rounded-lg p-4 transition-all cursor-pointer',
      isDiscovered
        ? 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
        : 'bg-gray-900 border-2 border-gray-800 opacity-50 cursor-not-allowed',
      selected && 'border-blue-500 ring-2 ring-blue-500/50'
    ]"
    @click="isDiscovered && $emit('select', subzone.id)"
  >
    <!-- Header -->
    <div class="header flex justify-between items-start mb-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="text-lg font-bold text-white">{{ subzone.name }}</h4>
          <span
            v-if="isMastered"
            class="mastery-badge px-2 py-0.5 text-xs font-semibold rounded bg-purple-900/50 text-purple-400"
          >
            ⭐ Mastered
          </span>
        </div>
        <p class="text-sm text-gray-400">{{ subzone.description }}</p>
      </div>
      <div
        v-if="!isDiscovered"
        class="locked-icon text-2xl text-gray-600"
      >
        🔒
      </div>
    </div>

    <!-- Subzone Info -->
    <div v-if="isDiscovered" class="subzone-info space-y-3">
      <!-- Mastery Progress -->
      <div class="mastery">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-400">Mastery</span>
          <span
            :class="[
              'font-semibold',
              isMastered ? 'text-purple-400' : 'text-blue-400'
            ]"
          >
            {{ mastery }}/100
          </span>
        </div>
        <div class="progress-bar w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            :class="[
              'h-full transition-all duration-500',
              isMastered ? 'bg-purple-500' : 'bg-blue-500'
            ]"
            :style="{ width: `${mastery}%` }"
          />
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats grid grid-cols-2 gap-3 text-sm">
        <div class="stat">
          <div class="text-gray-500 text-xs">Duration</div>
          <div class="text-white font-semibold">{{ subzone.baseDuration }}m</div>
        </div>
        <div class="stat">
          <div class="text-gray-500 text-xs">Difficulty</div>
          <div class="text-white font-semibold">
            <span v-for="i in subzone.difficulty" :key="i" class="text-yellow-400">★</span>
            <span v-for="i in (5 - subzone.difficulty)" :key="i + 10" class="text-gray-600">★</span>
          </div>
        </div>
      </div>

      <!-- Threats -->
      <div v-if="subzone.threats && subzone.threats.length > 0" class="threats">
        <div class="text-xs text-gray-500 mb-1">Threats:</div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="threat in subzone.threats.slice(0, 3)"
            :key="threat"
            class="threat-tag px-2 py-0.5 text-xs rounded bg-red-900/30 text-red-400"
          >
            {{ formatThreatName(threat) }}
          </span>
          <span
            v-if="subzone.threats.length > 3"
            class="text-xs text-gray-500"
          >
            +{{ subzone.threats.length - 3 }} more
          </span>
        </div>
      </div>

      <!-- Mastery Benefits -->
      <div v-if="masteryBenefits.length > 0" class="benefits">
        <div class="text-xs text-gray-500 mb-1">Active Benefits:</div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="benefit in masteryBenefits"
            :key="benefit.threshold"
            class="benefit-tag px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400"
          >
            {{ benefit.threshold }}%: +{{ benefit.benefit.dropRateBonus }}% drops
          </span>
        </div>
      </div>

      <!-- Loot Preview (simplified) -->
      <div class="loot text-xs text-gray-500">
        Drops: Equipment, Materials, Gold
      </div>
    </div>

    <!-- Discovery Requirement (for undiscovered subzones) -->
    <div v-if="!isDiscovered && subzone.requiredZoneFamiliarity" class="requirement text-xs text-gray-500 mt-2">
      Requires {{ subzone.requiredZoneFamiliarity }}% zone familiarity
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Subzone } from '~~/types'

interface Props {
  subzone: Subzone
  mastery?: number
  isDiscovered?: boolean
  isMastered?: boolean
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mastery: 0,
  isDiscovered: false,
  isMastered: false,
  selected: false
})

defineEmits<{
  (e: 'select', subzoneId: string): void
}>()

// Calculate which mastery benefits are active
const masteryBenefits = computed(() => {
  // TODO: Get actual SUBZONE_MASTERY_BENEFITS
  const mockBenefits = [
    { threshold: 25, benefit: { dropRateBonus: 10 } },
    { threshold: 50, benefit: { dropRateBonus: 20 } },
    { threshold: 75, benefit: { dropRateBonus: 35 } },
    { threshold: 100, benefit: { dropRateBonus: 50 } }
  ]

  return mockBenefits.filter(b => props.mastery >= b.threshold)
})

function formatThreatName(threat: string): string {
  return threat
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
.subzone-card {
  transition: all 0.2s ease;
}

.subzone-card:hover:not(.cursor-not-allowed) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
