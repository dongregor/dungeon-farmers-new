<script setup lang="ts">
import type { EquipmentRarity } from '~~/types/base'

interface Props {
  rarity: EquipmentRarity
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const colorClasses = computed(() => {
  switch (props.rarity) {
    case 'common':
      return 'bg-gray-500 text-white'
    case 'uncommon':
      return 'bg-green-600 text-white'
    case 'rare':
      return 'bg-blue-600 text-white'
    case 'epic':
      return 'bg-purple-600 text-white'
    case 'legendary':
      return 'bg-orange-500 text-white'
    case 'mythic':
      return 'bg-gradient-to-r from-pink-600 to-red-600 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-2 py-0.5'
    case 'lg':
      return 'text-base px-4 py-2'
    case 'md':
    default:
      return 'text-sm px-3 py-1'
  }
})

const rarityLabel = computed(() => {
  return props.rarity.charAt(0).toUpperCase() + props.rarity.slice(1)
})
</script>

<template>
  <span
    class="inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-wide"
    :class="[colorClasses, sizeClasses]"
  >
    {{ rarityLabel }}
  </span>
</template>
