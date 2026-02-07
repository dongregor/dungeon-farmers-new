<script setup lang="ts">
import type { GazetteArticle } from '~~/types'

interface Props {
  letters: GazetteArticle[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="letters.length > 0" class="border border-gray-700 rounded-lg p-5 bg-gray-800/30">
    <h3 class="text-sm uppercase tracking-wider text-orange-400 font-bold mb-4">
      Letters to the Editor
    </h3>
    <div class="space-y-4">
      <div
        v-for="letter in letters"
        :key="letter.id"
        class="text-sm text-gray-400 leading-relaxed p-4 bg-gray-900/50 rounded border border-gray-700 whitespace-pre-line font-mono"
      >
        {{ letter.body }}
      </div>
    </div>
  </div>
</template>
