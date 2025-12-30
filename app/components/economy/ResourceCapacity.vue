<script setup lang="ts">
interface Props {
  current: number
  max: number
  type?: string
  warningThreshold?: number
  criticalThreshold?: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
  size: 'md',
})

const percentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min(100, Math.max(0, (props.current / props.max) * 100))
})

const capacityRatio = computed(() => {
  if (props.max === 0) return 0
  return props.current / props.max
})

const capacityState = computed(() => {
  if (capacityRatio.value >= props.criticalThreshold) {
    return 'critical'
  } else if (capacityRatio.value >= props.warningThreshold) {
    return 'warning'
  } else {
    return 'normal'
  }
})

const barColor = computed(() => {
  switch (capacityState.value) {
    case 'critical':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'normal':
    default:
      return 'bg-green-500'
  }
})

const textColor = computed(() => {
  switch (capacityState.value) {
    case 'critical':
      return 'text-red-700'
    case 'warning':
      return 'text-yellow-700'
    case 'normal':
    default:
      return 'text-gray-700'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        bar: 'h-2',
        text: 'text-xs',
      }
    case 'lg':
      return {
        bar: 'h-6',
        text: 'text-base',
      }
    case 'md':
    default:
      return {
        bar: 'h-4',
        text: 'text-sm',
      }
  }
})

const statusIcon = computed(() => {
  switch (capacityState.value) {
    case 'critical':
      return '⚠️'
    case 'warning':
      return '⚡'
    default:
      return ''
  }
})
</script>

<template>
  <div class="w-full">
    <!-- Label and values -->
    <div class="flex justify-between items-center mb-1" :class="sizeClasses.text">
      <div class="flex items-center gap-1.5">
        <span v-if="type" class="font-medium text-gray-700">{{ type }}</span>
        <span v-if="statusIcon" class="text-xs">{{ statusIcon }}</span>
      </div>
      <span class="font-semibold tabular-nums" :class="textColor">
        {{ current.toLocaleString() }} / {{ max.toLocaleString() }}
      </span>
    </div>

    <!-- Capacity bar -->
    <div class="w-full bg-gray-200 rounded-full overflow-hidden" :class="sizeClasses.bar">
      <div
        class="h-full rounded-full transition-all duration-300 ease-out"
        :class="[barColor, { 'animate-pulse': capacityState === 'critical' }]"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <!-- Capacity percentage and status -->
    <div v-if="size !== 'sm'" class="flex justify-between items-center mt-1" :class="sizeClasses.text">
      <span class="text-gray-500">
        {{ Math.round(percentage) }}% full
      </span>
      <span v-if="capacityState !== 'normal'" class="font-medium" :class="textColor">
        {{ capacityState === 'critical' ? 'Almost Full!' : 'Nearly Full' }}
      </span>
    </div>
  </div>
</template>
