<script setup lang="ts">
import type { GazetteStats } from '~~/types'

interface Props {
  stats: GazetteStats
}

defineProps<Props>()
</script>

<template>
  <div class="border border-gray-700 rounded-lg p-5 bg-gray-800/30">
    <h3 class="text-sm uppercase tracking-wider text-gray-400 font-bold mb-4">
      Yesterday In Numbers
    </h3>

    <div class="grid grid-cols-2 gap-3 text-sm mb-4">
      <div class="flex justify-between">
        <span class="text-gray-500">Expeditions</span>
        <span class="text-gray-200 font-bold">{{ stats.expeditionsCompleted }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Gold Earned</span>
        <span class="text-guild-gold font-bold">{{ stats.goldEarned.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Level Ups</span>
        <span class="text-green-400 font-bold">{{ stats.heroesLeveledUp }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Items Found</span>
        <span class="text-gray-200 font-bold">{{ stats.itemsFound }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Rare+ Items</span>
        <span class="text-purple-400 font-bold">{{ stats.rareItemsFound }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Monsters</span>
        <span class="text-red-400 font-bold">{{ stats.monstersDefeated }}</span>
      </div>
    </div>

    <!-- MVP -->
    <div v-if="stats.mvp" class="border-t border-gray-700 pt-3 mb-3">
      <div class="text-xs uppercase tracking-wider text-yellow-500 font-bold mb-1">MVP</div>
      <div class="text-sm text-gray-300">
        <span class="font-bold text-gray-100">{{ stats.mvp.heroName }}</span>
        <span class="text-gray-500"> - {{ stats.mvp.reason }}</span>
      </div>
    </div>

    <!-- Fun stat -->
    <div class="border-t border-gray-700 pt-3">
      <div class="text-xs text-gray-600 italic">
        {{ stats.funStat }}
      </div>
    </div>
  </div>
</template>
