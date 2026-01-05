<script setup lang="ts">
import type { Tabard } from '~~/types'

const props = withDefaults(defineProps<{
  tabard: Tabard
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showEmblem?: boolean
}>(), {
  size: 'md',
  showEmblem: true,
})

const emblemIcons: Record<string, string> = {
  sword: '⚔️',
  shield: '🛡️',
  crown: '👑',
  dragon: '🐉',
  wolf: '🐺',
  eagle: '🦅',
  lion: '🦁',
  star: '⭐',
  moon: '🌙',
  skull: '💀',
  flame: '🔥',
  tree: '🌳',
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-6 h-8'
    case 'sm':
      return 'w-8 h-10'
    case 'lg':
      return 'w-24 h-32'
    case 'xl':
      return 'w-32 h-40'
    default:
      return 'w-16 h-20'
  }
})

const emblemSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs'
    case 'sm':
      return 'text-sm'
    case 'lg':
      return 'text-3xl'
    case 'xl':
      return 'text-4xl'
    default:
      return 'text-xl'
  }
})

const emblemIcon = computed(() => {
  return emblemIcons[props.tabard.emblem] || ''
})

const tabardStyle = computed(() => {
  const { primaryColor, secondaryColor, pattern } = props.tabard

  switch (pattern) {
    case 'solid':
      return { background: primaryColor }
    case 'divided':
      return { background: `linear-gradient(to right, ${primaryColor} 50%, ${secondaryColor} 50%)` }
    case 'quartered':
      return { background: `conic-gradient(${primaryColor} 90deg, ${secondaryColor} 90deg 180deg, ${primaryColor} 180deg 270deg, ${secondaryColor} 270deg)` }
    case 'striped':
      return { background: `repeating-linear-gradient(to bottom, ${primaryColor}, ${primaryColor} 20%, ${secondaryColor} 20%, ${secondaryColor} 40%)` }
    case 'diagonal':
      return { background: `linear-gradient(135deg, ${primaryColor} 50%, ${secondaryColor} 50%)` }
    case 'bordered':
      return { background: primaryColor, border: `4px solid ${secondaryColor}` }
    default:
      return { background: primaryColor }
  }
})
</script>

<template>
  <div
    class="rounded-t-full rounded-b-sm shadow-lg flex-shrink-0 relative flex items-center justify-center"
    :class="sizeClasses"
    :style="tabardStyle"
  >
    <span
      v-if="showEmblem && emblemIcon"
      :class="emblemSizeClass"
      class="drop-shadow-md"
      style="filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5))"
    >
      {{ emblemIcon }}
    </span>
  </div>
</template>
