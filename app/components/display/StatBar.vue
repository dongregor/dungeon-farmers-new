<script setup lang="ts">
interface Props {
  stat: string
  value: number
  max: number
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange' | 'teal'
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  showValue: true,
  size: 'md',
})

const percentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'green':
      return 'bg-green-500'
    case 'purple':
      return 'bg-purple-500'
    case 'yellow':
      return 'bg-yellow-500'
    case 'red':
      return 'bg-red-500'
    case 'orange':
      return 'bg-orange-500'
    case 'teal':
      return 'bg-teal-500'
    case 'blue':
    default:
      return 'bg-blue-500'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-2'
    case 'lg':
      return 'h-6'
    case 'md':
    default:
      return 'h-4'
  }
})

const textSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs'
    case 'lg':
      return 'text-base'
    case 'md':
    default:
      return 'text-sm'
  }
})

const statLabel = computed(() => {
  return props.stat.charAt(0).toUpperCase() + props.stat.slice(1)
})
</script>

<template>
  <div class="w-full">
    <!-- Label row -->
    <div class="flex justify-between mb-1" :class="textSizeClasses">
      <span class="font-medium text-gray-700">{{ statLabel }}</span>
      <span v-if="showValue" class="text-gray-600">{{ value }} / {{ max }}</span>
    </div>

    <!-- Stat bar -->
    <div class="w-full bg-gray-200 rounded-full overflow-hidden" :class="sizeClasses">
      <div
        class="h-full rounded-full transition-all duration-300 ease-out"
        :class="colorClasses"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
