<script setup lang="ts">
import type { GazetteArticle } from '~~/types'

interface Props {
  article: GazetteArticle
}

defineProps<Props>()
</script>

<template>
  <div class="border border-gray-700 rounded-lg p-4 bg-gray-800/30">
    <div class="text-xs uppercase tracking-wider text-amber-500 font-bold mb-2">
      {{ article.title }}
    </div>
    <p class="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
      {{ article.body }}
    </p>
  </div>
</template>
