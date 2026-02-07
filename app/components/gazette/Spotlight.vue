<script setup lang="ts">
import type { GazetteArticle } from '~~/types'

interface Props {
  article: GazetteArticle
}

defineProps<Props>()
</script>

<template>
  <div class="border border-purple-800 rounded-lg p-5 bg-purple-900/10">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">&#11088;</span>
      <div class="text-sm uppercase tracking-wider text-purple-400 font-bold">
        {{ article.title }}
      </div>
    </div>
    <div class="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
      {{ article.body }}
    </div>
  </div>
</template>
