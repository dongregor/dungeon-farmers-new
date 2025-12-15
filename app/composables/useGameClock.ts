import { ref, readonly, onMounted, onUnmounted } from 'vue'

const now = ref(Date.now())
let interval: ReturnType<typeof setInterval> | null = null
let subscribers = 0

function startClock() {
  if (interval) return
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function stopClock() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

export function useGameClock() {
  onMounted(() => {
    subscribers++
    startClock()
  })

  onUnmounted(() => {
    subscribers--
    if (subscribers === 0) {
      stopClock()
    }
  })

  return { now: readonly(now) }
}
