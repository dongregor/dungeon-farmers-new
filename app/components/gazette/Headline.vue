<script setup lang="ts">
import type { GazetteArticle } from '~~/types'

interface Props {
  article: GazetteArticle
}

defineProps<Props>()

const rarityBorder: Record<string, string> = {
  common: 'border-gray-700',
  noteworthy: 'border-green-800',
  memorable: 'border-blue-800',
  epic: 'border-yellow-700',
}

const rarityBg: Record<string, string> = {
  common: 'bg-gray-800/50',
  noteworthy: 'bg-green-900/20',
  memorable: 'bg-blue-900/20',
  epic: 'bg-yellow-900/20',
}
</script>

<template>
  <div
    class="border-2 rounded-lg p-6 mb-6"
    :class="[rarityBorder[article.rarity] || 'border-gray-700', rarityBg[article.rarity] || 'bg-gray-800/50']"
  >
    <div class="text-xs uppercase tracking-widest text-red-400 font-bold mb-2">
      {{ article.title }}
    </div>
    <p class="text-xl font-bold text-gray-100 leading-snug">
      {{ article.body }}
    </p>
  </div>
</template>
