import { computed, type Ref } from 'vue'
import type { Expedition } from '~~/types'
import { useGameClock } from './useGameClock'

function pad(num: number): string {
  return num.toString().padStart(2, '0')
}

export function useExpeditionTimer(expedition: Ref<Expedition | null>) {
  const { now } = useGameClock()

  const completesAt = computed(() => {
    if (!expedition.value) return 0
    return new Date(expedition.value.completesAt).getTime()
  })

  const remainingMs = computed(() => {
    return Math.max(0, completesAt.value - now.value)
  })

  const elapsedMs = computed(() => {
    if (!expedition.value) return 0
    const started = new Date(expedition.value.startedAt).getTime()
    const total = expedition.value.durationMinutes * 60 * 1000
    return Math.min(total, now.value - started)
  })

  const totalMs = computed(() => {
    if (!expedition.value) return 0
    return expedition.value.durationMinutes * 60 * 1000
  })

  const percentComplete = computed(() => {
    if (totalMs.value === 0) return 0
    return Math.min(100, (elapsedMs.value / totalMs.value) * 100)
  })

  const isComplete = computed(() => remainingMs.value === 0)

  const formattedTime = computed(() => {
    const ms = remainingMs.value
    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / 60000) % 60
    const hours = Math.floor(ms / 3600000)

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`
    }
    return `${minutes}:${pad(seconds)}`
  })

  return {
    remainingMs,
    elapsedMs,
    totalMs,
    percentComplete,
    isComplete,
    formattedTime,
  }
}
