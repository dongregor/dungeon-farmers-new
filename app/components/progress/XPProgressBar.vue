<script setup lang="ts">
interface Props {
  currentXP: number
  requiredXP: number
  level: number
  maxLevel?: number
  showMilestones?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showMilestones: false,
  size: 'md',
})

const percentage = computed(() => {
  if (props.requiredXP === 0) return 100
  return Math.min(100, Math.max(0, (props.currentXP / props.requiredXP) * 100))
})

const isMaxLevel = computed(() => {
  return props.maxLevel !== undefined && props.level >= props.maxLevel
})

const barColor = computed(() => {
  if (isMaxLevel.value) return 'bg-yellow-500'
  return 'bg-blue-500'
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

// Calculate milestone positions (every 25%)
const milestones = computed(() => {
  if (!props.showMilestones) return []
  return [25, 50, 75]
})
</script>

<template>
  <div class="w-full">
    <!-- Level and XP info -->
    <div class="flex justify-between items-baseline mb-1" :class="textSizeClasses">
      <div class="flex items-baseline gap-2">
        <span class="font-bold text-gray-900">
          Level {{ level }}
        </span>
        <span v-if="isMaxLevel" class="text-yellow-600 font-semibold text-xs">
          MAX
        </span>
      </div>
      <span class="text-gray-600 font-medium tabular-nums">
        {{ currentXP.toLocaleString() }} / {{ requiredXP.toLocaleString() }} XP
      </span>
    </div>

    <!-- Progress bar with milestones -->
    <div class="relative w-full bg-gray-200 rounded-full overflow-hidden" :class="sizeClasses">
      <!-- XP progress -->
      <div
        class="h-full rounded-full transition-all duration-300 ease-out"
        :class="[barColor, { 'animate-pulse': isMaxLevel }]"
        :style="{ width: `${percentage}%` }"
      />

      <!-- Milestone markers -->
      <div
        v-if="showMilestones"
        class="absolute inset-0 flex items-center pointer-events-none"
      >
        <div
          v-for="milestone in milestones"
          :key="milestone"
          class="absolute h-full w-0.5 bg-gray-400/50"
          :style="{ left: `${milestone}%` }"
        />
      </div>
    </div>

    <!-- Percentage -->
    <div v-if="size !== 'sm'" class="mt-1 text-right" :class="textSizeClasses">
      <span class="text-gray-500">
        {{ Math.round(percentage) }}%
      </span>
    </div>
  </div>
</template>
