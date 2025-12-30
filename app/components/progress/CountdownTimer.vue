<script setup lang="ts">
interface Props {
  endTime: Date | number
  format?: 'full' | 'short' | 'minimal'
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  format: 'full',
  showLabel: true,
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

  switch (props.format) {
    case 'full':
      // "2h 30m 15s" format
      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }

    case 'short':
      // "02:30:15" format
      const pad = (num: number) => num.toString().padStart(2, '0')
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

    case 'minimal':
      // "2:30" format (no seconds if > 1 minute)
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}`
      } else if (minutes > 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      } else {
        return `0:${seconds.toString().padStart(2, '0')}`
      }

    default:
      return '00:00:00'
  }
})

const updateTimer = () => {
  const endTimeMs = props.endTime instanceof Date ? props.endTime.getTime() : props.endTime
  const now = Date.now()
  const remaining = endTimeMs - now

  // Handle past times
  if (remaining <= 0) {
    timeRemaining.value = 0
    if (!isComplete.value) {
      isComplete.value = true
      emit('complete')
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  } else {
    timeRemaining.value = remaining
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
  // Clear existing interval before creating new one
  if (intervalId) {
    clearInterval(intervalId)
  }
  updateTimer()
  intervalId = setInterval(updateTimer, 1000)
})
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <span v-if="showLabel" class="text-sm text-gray-600">Ends in:</span>
    <span class="font-mono font-semibold text-gray-900 tabular-nums">
      {{ formattedTime }}
    </span>
  </div>
</template>
