import type { LogEntryType } from '~~/types/logs'

export interface SkeletonSlot {
  type: LogEntryType
  isClimax?: boolean
}

/**
 * Calculate number of log entries based on expedition duration.
 *
 * Longer expeditions generate more log entries to provide
 * a richer narrative experience.
 *
 * @param durationMinutes - Expedition duration in minutes
 * @returns Number of log entries to generate
 */
export function calculateEntryCount(durationMinutes: number): number {
  if (durationMinutes <= 15) return 3 + Math.floor(Math.random() * 2) // 3-4
  if (durationMinutes <= 30) return 4 + Math.floor(Math.random() * 2) // 4-5
  if (durationMinutes <= 45) return 5 + Math.floor(Math.random() * 2) // 5-6
  if (durationMinutes <= 60) return 6 + Math.floor(Math.random() * 2) // 6-7
  if (durationMinutes <= 90) return 7 + Math.floor(Math.random() * 2) // 7-8
  return 8 + Math.floor(Math.random() * 3) // 8-10
}

/**
 * Build a narrative arc skeleton for the log.
 *
 * Creates a structure following traditional story arc:
 * - Departure (opening)
 * - Rising action (travel, events)
 * - Climax (combat or major event) at ~60-70%
 * - Falling action (loot, resolution)
 * - Return (closing)
 *
 * @param entryCount - Total number of entries to generate
 * @returns Array of skeleton slots defining entry types
 */
export function buildSkeleton(entryCount: number): SkeletonSlot[] {
  const skeleton: SkeletonSlot[] = []

  // Always start with departure
  skeleton.push({ type: 'departure' })

  // Always end with return (we'll add it last)
  const middleCount = entryCount - 2

  // Climax should be around 60-70% through
  const climaxIndex = Math.floor(middleCount * 0.6) + 1 // +1 for departure

  // Fill middle slots with narrative arc
  const middleTypes: LogEntryType[] = []

  // Rising action: travel and events
  for (let i = 0; i < middleCount; i++) {
    if (i < middleCount * 0.3) {
      // First 30%: mostly travel with some events
      middleTypes.push(Math.random() < 0.7 ? 'travel' : 'event')
    } else if (i < middleCount * 0.6) {
      // 30-60%: mix of event and combat leading to climax
      middleTypes.push(Math.random() < 0.5 ? 'event' : 'combat')
    } else if (i < middleCount * 0.8) {
      // 60-80%: falling action - loot and events
      middleTypes.push(Math.random() < 0.6 ? 'loot' : 'event')
    } else {
      // Last bit: wind down with travel
      middleTypes.push('travel')
    }
  }

  // Ensure at least one combat
  if (!middleTypes.includes('combat')) {
    const combatIndex = Math.floor(middleCount * 0.5)
    middleTypes[combatIndex] = 'combat'
  }

  // Add middle slots to skeleton
  for (let i = 0; i < middleTypes.length; i++) {
    const isClimax = (i + 1) === climaxIndex
    skeleton.push({
      type: middleTypes[i],
      isClimax
    })
  }

  // End with return
  skeleton.push({ type: 'return' })

  return skeleton
}

/**
 * Get entry types suitable for a narrative position.
 *
 * @param position - Position in the narrative arc
 * @returns Array of suitable entry types for that position
 */
export function getSuitableTypes(position: 'rising' | 'climax' | 'falling'): LogEntryType[] {
  switch (position) {
    case 'rising':
      return ['travel', 'event']
    case 'climax':
      return ['combat', 'event']
    case 'falling':
      return ['loot', 'event', 'travel']
  }
}
