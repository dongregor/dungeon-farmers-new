<script setup lang="ts">
interface Props {
  current: number
  max: number
  label?: string
  showPercentage?: boolean
  showValues?: boolean
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  size: 'md',
  showPercentage: false,
  showValues: false,
  animated: false,
})

const percentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min(100, Math.max(0, (props.current / props.max) * 100))
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
</script>

<template>
  <div class="w-full">
    <!-- Label row -->
    <div v-if="label || showPercentage || showValues" class="flex justify-between mb-1" :class="textSizeClasses">
      <span v-if="label" class="font-medium text-gray-700">{{ label }}</span>
      <span v-if="showValues" class="text-gray-600">{{ current }} / {{ max }}</span>
      <span v-if="showPercentage && !showValues" class="text-gray-600">{{ Math.round(percentage) }}%</span>
    </div>

    <!-- Progress bar -->
    <div class="w-full bg-gray-200 rounded-full overflow-hidden" :class="sizeClasses">
      <div
        class="h-full rounded-full transition-all duration-300 ease-out"
        :class="[colorClasses, { 'animate-pulse': animated }]"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
