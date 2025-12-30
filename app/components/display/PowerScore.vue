<script setup lang="ts">
interface PowerBreakdown {
  base?: number
  equipment?: number
  traits?: number
  prestige?: number
  [key: string]: number | undefined
}

interface Props {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  breakdown?: PowerBreakdown
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showIcon: true,
})

const formattedValue = computed(() => {
  return props.value.toLocaleString()
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm'
    case 'lg':
      return 'text-xl'
    case 'md':
    default:
      return 'text-base'
  }
})

const iconSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3 h-3'
    case 'lg':
      return 'w-6 h-6'
    case 'md':
    default:
      return 'w-4 h-4'
  }
})

const tooltipText = computed(() => {
  if (!props.breakdown) return ''

  const lines = Object.entries(props.breakdown)
    .filter(([_, value]) => value !== undefined && value > 0)
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1)
      return `${label}: ${value?.toLocaleString()}`
    })

  return lines.join('\n')
})
</script>

<template>
  <div
    class="inline-flex items-center gap-1 font-semibold text-orange-600"
    :class="sizeClasses"
    :title="tooltipText"
  >
    <svg
      v-if="showIcon"
      :class="iconSizeClasses"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- Sword icon -->
      <path d="M14.5 2L20 7.5L7.5 20L2 14.5L14.5 2Z" />
      <path d="M2 14.5L9.5 22" />
      <path d="M7.5 20L2 14.5" />
    </svg>
    <span>{{ formattedValue }}</span>
  </div>
</template>
