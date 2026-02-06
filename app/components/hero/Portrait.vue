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
  size?: 'sm' | 'md' | 'lg' | 'xl'
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
  xl: 256,
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

// Unique ID for SVG gradient (use id if Hero, fallback to name for TavernHero)
const uniqueId = computed(() => {
  return 'id' in props.hero ? props.hero.id : props.hero.name.replace(/\s+/g, '-')
})

// Archetype silhouette paths (body and detail layers)
const SILHOUETTE_PATHS: Record<Archetype, { body: string; detail: string }> = {
  tank: {
    body: 'M60,85 L55,180 L137,180 L132,85 C132,85 130,75 96,75 C62,75 60,85 60,85 Z',
    detail: 'M65,95 L70,130 L122,130 L127,95 C127,95 120,90 96,90 C72,90 65,95 65,95 Z',
  },
  healer: {
    body: 'M68,85 L60,180 L132,180 L124,85 C124,85 120,78 96,78 C72,78 68,85 68,85 Z',
    detail: 'M72,95 L68,140 L124,140 L120,95 C115,92 96,90 96,90 C96,90 77,92 72,95 Z',
  },
  melee_dps: {
    body: 'M62,82 L50,180 L142,180 L130,82 C130,82 125,72 96,72 C67,72 62,82 62,82 Z',
    detail: 'M68,88 L72,120 L120,120 L124,88 C120,85 96,82 96,82 C96,82 72,85 68,88 Z',
  },
  ranged_dps: {
    body: 'M70,85 L65,180 L127,180 L122,85 C122,85 118,78 96,78 C74,78 70,85 70,85 Z',
    detail: 'M74,92 L76,125 L116,125 L118,92 C114,90 96,88 96,88 C96,88 78,90 74,92 Z',
  },
  caster: {
    body: 'M55,82 L45,180 L147,180 L137,82 C137,82 130,75 96,75 C62,75 55,82 55,82 Z',
    detail: 'M62,90 L58,150 L134,150 L130,90 C125,87 96,85 96,85 C96,85 67,87 62,90 Z',
  },
  debuffer: {
    body: 'M65,85 L58,180 L134,180 L127,85 C127,85 122,77 96,77 C70,77 65,85 65,85 Z',
    detail: 'M70,92 L68,135 L124,135 L122,92 C118,89 96,87 96,87 C96,87 74,89 70,92 Z',
  },
}

const silhouettePaths = computed(() => SILHOUETTE_PATHS[props.hero.archetype])

// Hair paths based on style and gender
const HAIR_STYLES: Record<number, string> = {
  0: 'M68,45 Q68,25 96,22 Q124,25 124,45 L120,55 Q96,50 72,55 Z', // Short
  1: 'M65,48 Q65,22 96,18 Q127,22 127,48 L122,60 Q96,52 70,60 Z', // Medium
  2: 'M62,50 Q62,18 96,15 Q130,18 130,50 L130,85 Q96,75 62,85 Z', // Long
  3: 'M70,42 Q70,28 96,25 Q122,28 122,42 L118,52 Q96,48 74,52 Z', // Buzz
  4: 'M66,46 Q66,24 96,20 Q126,24 126,46 L124,58 Q110,50 96,50 Q82,50 68,58 Z', // Wavy
  5: 'M68,44 Q68,26 96,23 Q124,26 124,44 L96,35 Z', // Mohawk/styled
}

const hairPath = computed(() => {
  const style = props.hero.visualTraits?.hairStyle ?? 0
  return HAIR_STYLES[style] || HAIR_STYLES[0]
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
      <!-- Background gradient -->
      <defs>
        <linearGradient :id="`bg-${uniqueId}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="rarityStyle.borderColor" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#1a1a2e" />
        </linearGradient>
      </defs>

      <rect width="192" height="192" :fill="`url(#bg-${uniqueId})`" />

      <!-- Body/Clothing base layer -->
      <path :d="silhouettePaths.body" :fill="primaryClothingColor" />

      <!-- Clothing detail layer -->
      <path :d="silhouettePaths.detail" :fill="secondaryClothingColor" />

      <!-- Head/Face -->
      <ellipse
        :cx="96"
        :cy="55"
        :rx="28 + (hero.visualTraits?.faceShape ?? 0) * 2"
        :ry="32 - (hero.visualTraits?.faceShape ?? 0)"
        :fill="skinColor"
      />

      <!-- Hair -->
      <path :d="hairPath" :fill="hairColor" />

      <!-- Simple face features -->
      <ellipse cx="86" cy="52" rx="3" ry="4" fill="#1a1a1a" />
      <ellipse cx="106" cy="52" rx="3" ry="4" fill="#1a1a1a" />
    </svg>
  </div>
</template>

<style scoped>
.hero-portrait {
  flex-shrink: 0;
}
</style>
