<script setup lang="ts">
import type { GazetteArticle } from '~~/types'

interface Props {
  articles: GazetteArticle[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="articles.length > 0" class="border border-gray-700 rounded-lg p-5 bg-gray-800/30">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xl">&#128172;</span>
      <h3 class="text-sm uppercase tracking-wider text-pink-400 font-bold">
        Whispers &amp; Rumors
      </h3>
    </div>
    <div class="space-y-3">
      <div
        v-for="article in articles"
        :key="article.id"
        class="text-sm text-gray-400 leading-relaxed pl-3 border-l-2 border-gray-700"
      >
        <span class="text-xs text-gray-600 uppercase block mb-1">{{ article.title }}</span>
        {{ article.body }}
      </div>
    </div>
  </div>
</template>
