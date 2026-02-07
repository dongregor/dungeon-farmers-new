<script setup lang="ts">
import type { GazetteClassified } from '~~/types'

interface Props {
  classifieds: GazetteClassified[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="classifieds.length > 0" class="border border-gray-700 rounded-lg p-5 bg-gray-800/30">
    <h3 class="text-sm uppercase tracking-wider text-cyan-400 font-bold mb-4">
      Classifieds
    </h3>
    <div class="space-y-3">
      <div
        v-for="classified in classifieds"
        :key="classified.id"
        class="text-sm text-gray-400 leading-relaxed p-3 border border-dashed border-gray-700 rounded"
      >
        {{ classified.text }}
      </div>
    </div>
  </div>
</template>
