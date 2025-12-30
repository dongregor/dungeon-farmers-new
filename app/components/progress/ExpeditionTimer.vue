<script setup lang="ts">
interface Props {
  endTime: Date | number
  showProgress?: boolean
  totalDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: false,
})

const emit = defineEmits<{
  complete: []
}>()

const timeRemaining = ref(0)
const isComplete = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const totalSeconds = Math.max(0, Math.floor(timeRemaining.value / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
})

const progressPercentage = computed(() => {
  if (!props.showProgress || !props.totalDuration) return 0
  const elapsed = props.totalDuration - timeRemaining.value
  return Math.min(100, Math.max(0, (elapsed / props.totalDuration) * 100))
})

const updateTimer = () => {
  const endTimeMs = props.endTime instanceof Date ? props.endTime.getTime() : props.endTime
  const now = Date.now()
  timeRemaining.value = Math.max(0, endTimeMs - now)

  if (timeRemaining.value === 0 && !isComplete.value) {
    isComplete.value = true
    emit('complete')
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}

onMounted(() => {
  updateTimer()
  intervalId = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})

// Watch for endTime changes
watch(() => props.endTime, () => {
  isComplete.value = false
  updateTimer()
  if (!intervalId) {
    intervalId = setInterval(updateTimer, 1000)
  }
})
</script>

<template>
  <div class="w-full">
    <!-- Timer display -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">Time Remaining</span>
      <span class="text-lg font-mono font-bold text-gray-900 tabular-nums">
        {{ formattedTime }}
      </span>
    </div>

    <!-- Progress bar -->
    <div v-if="showProgress" class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        class="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-linear"
        :style="{ width: `${progressPercentage}%` }"
      />
    </div>
  </div>
</template>
