<template>
  <div
    :class="[
      'zone-card rounded-lg p-5 transition-all cursor-pointer',
      isUnlocked
        ? 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
        : 'bg-gray-900 border-2 border-gray-800 opacity-60 cursor-not-allowed',
      selected && 'border-blue-500 ring-2 ring-blue-500/50'
    ]"
    @click="isUnlocked && $emit('select', zone.id)"
  >
    <!-- Header -->
    <div class="header flex justify-between items-start mb-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-xl font-bold text-white">{{ zone.name }}</h3>
          <span
            v-if="isMastered"
            class="mastery-badge px-2 py-0.5 text-xs font-semibold rounded bg-purple-900/50 text-purple-400"
          >
            ⭐ Mastered
          </span>
        </div>
        <p class="text-sm text-gray-400">{{ zone.description }}</p>
      </div>
      <div
        v-if="!isUnlocked"
        class="locked-icon text-3xl text-gray-600"
      >
        🔒
      </div>
    </div>

    <!-- Zone Info -->
    <div v-if="isUnlocked" class="zone-info space-y-3">
      <!-- Familiarity Progress -->
      <div class="familiarity">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-400">Familiarity</span>
          <span
            :class="[
              'font-semibold',
              isMastered ? 'text-purple-400' : 'text-blue-400'
            ]"
          >
            {{ familiarity }}/100
          </span>
        </div>
        <div class="progress-bar w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            :class="[
              'h-full transition-all duration-500',
              isMastered ? 'bg-purple-500' : 'bg-blue-500'
            ]"
            :style="{ width: `${familiarity}%` }"
          />
        </div>
      </div>

      <!-- Subzone Count -->
      <div class="subzones flex items-center justify-between text-sm">
        <span class="text-gray-400">Subzones Discovered</span>
        <span class="font-semibold text-gray-300">
          {{ discoveredSubzonesCount }}/{{ zone.subzones.length }}
        </span>
      </div>

      <!-- Zone Type Badge -->
      <div class="flex items-center gap-2">
        <span
          :class="[
            'type-badge px-2 py-1 text-xs font-semibold rounded',
            getZoneTypeClass(zone.type)
          ]"
        >
          {{ zone.type.toUpperCase() }}
        </span>
        <span class="text-sm text-gray-500">
          Level {{ zone.minLevel }}-{{ zone.maxLevel }}
        </span>
      </div>

      <!-- Familiarity Benefits -->
      <div v-if="benefits.length > 0" class="benefits mt-3">
        <div class="text-xs text-gray-500 mb-1">Active Benefits:</div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="benefit in benefits"
            :key="benefit.threshold"
            class="benefit-tag px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400"
          >
            {{ benefit.threshold }}%: +{{ benefit.benefit.passiveIncome }}% income
          </span>
        </div>
      </div>
    </div>

    <!-- Unlock Requirements (for locked zones) -->
    <div v-if="!isUnlocked && zone.unlockRequirement" class="requirements mt-3 p-3 bg-gray-900/50 rounded">
      <div class="text-sm text-gray-400 mb-1">Requirements:</div>
      <div class="text-xs text-gray-500 space-y-1">
        <div v-if="zone.unlockRequirement.previousZoneId">
          Complete: {{ zone.unlockRequirement.previousZoneId }}
        </div>
        <div v-if="zone.unlockRequirement.minPower">
          Minimum Power: {{ zone.unlockRequirement.minPower }}
        </div>
        <div v-if="zone.unlockRequirement.questComplete">
          Complete Quest: {{ zone.unlockRequirement.questComplete }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Zone } from '~~/types'

interface Props {
  zone: Zone
  familiarity?: number
  isUnlocked?: boolean
  isMastered?: boolean
  discoveredSubzonesCount?: number
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  familiarity: 0,
  isUnlocked: false,
  isMastered: false,
  discoveredSubzonesCount: 0,
  selected: false
})

defineEmits<{
  (e: 'select', zoneId: string): void
}>()

// Calculate which familiarity benefits are active
const benefits = computed(() => {
  // TODO: Get actual ZONE_FAMILIARITY_BENEFITS
  const mockBenefits = [
    { threshold: 25, benefit: { passiveIncome: 10 } },
    { threshold: 50, benefit: { passiveIncome: 25 } },
    { threshold: 75, benefit: { passiveIncome: 50 } },
    { threshold: 100, benefit: { passiveIncome: 100 } }
  ]

  return mockBenefits.filter(b => props.familiarity >= b.threshold)
})

function getZoneTypeClass(type: string): string {
  const classes: Record<string, string> = {
    forest: 'bg-green-900/30 text-green-400',
    cave: 'bg-gray-700 text-gray-300',
    swamp: 'bg-emerald-900/30 text-emerald-400',
    ruins: 'bg-amber-900/30 text-amber-400',
    mountain: 'bg-slate-700 text-slate-300',
    desert: 'bg-yellow-900/30 text-yellow-400'
  }
  return classes[type] || 'bg-gray-700 text-gray-300'
}
</script>

<style scoped>
.zone-card {
  transition: all 0.2s ease;
}

.zone-card:hover:not(.cursor-not-allowed) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
