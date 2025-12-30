<script setup lang="ts">
interface Props {
  value: number // Percentage (0-150+)
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showLabel: true,
})

const tier = computed(() => {
  if (props.value < 70) return 'poor'
  if (props.value < 100) return 'below'
  if (props.value < 120) return 'optimal'
  return 'excellent'
})

const tierLabel = computed(() => {
  switch (tier.value) {
    case 'poor':
      return 'Poor'
    case 'below':
      return 'Below Optimal'
    case 'optimal':
      return 'Optimal'
    case 'excellent':
      return 'Excellent'
    default:
      return ''
  }
})

const colorClasses = computed(() => {
  switch (tier.value) {
    case 'poor':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'below':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'optimal':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'excellent':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-2 py-1'
    case 'lg':
      return 'text-base px-4 py-2'
    case 'md':
    default:
      return 'text-sm px-3 py-1.5'
  }
})

const percentageText = computed(() => {
  return `${Math.round(props.value)}%`
})
</script>

<template>
  <div
    class="inline-flex items-center gap-2 rounded-lg border font-semibold"
    :class="[colorClasses, sizeClasses]"
  >
    <!-- Efficiency icon -->
    <svg
      class="flex-shrink-0"
      :class="{
        'w-3 h-3': size === 'sm',
        'w-4 h-4': size === 'md',
        'w-5 h-5': size === 'lg',
      }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>

    <!-- Percentage and label -->
    <div class="flex items-center gap-1.5">
      <span>{{ percentageText }}</span>
      <span
        v-if="showLabel"
        class="opacity-75 font-normal"
        :class="{
          'hidden sm:inline': size === 'sm',
        }"
      >
        ({{ tierLabel }})
      </span>
    </div>
  </div>
</template>
