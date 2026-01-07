<script setup lang="ts">
import type { Hero, TavernHero } from '~~/types'
import type { Rarity, Archetype } from '~~/types/base'
import {
  SKIN_TONES,
  HAIR_COLORS,
  CLOTHING_PALETTES,
  RARITY_COLORS,
} from '~~/types/heroVisuals'

const props = withDefaults(defineProps<{
  hero: Hero | TavernHero
  size?: 'sm' | 'md' | 'lg'
  showRarityEffects?: boolean
}>(), {
  size: 'md',
  showRarityEffects: true,
})

// Size in pixels
const sizeMap = {
  sm: 48,
  md: 96,
  lg: 192,
}

const pixelSize = computed(() => sizeMap[props.size])

// Get colors from traits
const skinColor = computed(() => SKIN_TONES[props.hero.visualTraits?.skinTone ?? 2])
const hairColor = computed(() => HAIR_COLORS[props.hero.visualTraits?.hairColor ?? 0])
const primaryClothingColor = computed(() => {
  const palette = CLOTHING_PALETTES[props.hero.archetype]
  return palette[props.hero.visualTraits?.primaryColor ?? 0]
})
const secondaryClothingColor = computed(() => {
  const palette = CLOTHING_PALETTES[props.hero.archetype]
  return palette[props.hero.visualTraits?.secondaryColor ?? 1]
})

// Rarity styling
const rarityStyle = computed(() => {
  const rarity = props.hero.rarity as Rarity
  const colors = RARITY_COLORS[rarity]
  return {
    borderColor: colors.border,
    boxShadow: props.showRarityEffects ? colors.glow : 'none',
  }
})
</script>

<template>
  <div
    class="hero-portrait relative rounded-lg border-2 overflow-hidden bg-gray-900"
    :style="{
      width: `${pixelSize}px`,
      height: `${pixelSize}px`,
      ...rarityStyle,
    }"
  >
    <svg
      :width="pixelSize"
      :height="pixelSize"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background gradient based on rarity -->
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="rarityStyle.borderColor" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#1a1a2e" stop-opacity="1" />
        </linearGradient>
      </defs>

      <rect width="192" height="192" fill="url(#bg-gradient)" />

      <!-- Placeholder: Archetype silhouette will go here -->
      <text
        x="96"
        y="100"
        text-anchor="middle"
        :fill="skinColor"
        font-size="48"
        font-weight="bold"
      >
        {{ hero.name.charAt(0) }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.hero-portrait {
  flex-shrink: 0;
}
</style>
