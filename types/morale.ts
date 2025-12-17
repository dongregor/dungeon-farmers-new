import type { MoraleState } from './base'

export interface HeroMorale {
  current: number           // 0-100
  state: MoraleState
  lastExpeditionAt: string
  consecutiveExpeditions: number
}

// Morale thresholds
export const MORALE_THRESHOLDS = {
  excited: { min: 80, max: 100 },
  content: { min: 50, max: 79 },
  tired: { min: 30, max: 49 },
  frustrated: { min: 15, max: 29 },
  exhausted: { min: 0, max: 14 },
}

// Morale changes by action
export const MORALE_CHANGES = {
  completeExpedition: { min: -15, max: -5 }, // Based on duration
  rest: 5, // Per hour
  bigLootDrop: 10,
  discoverSubzone: 15,
  counterThreat: 5,
  failedThreat: -10,
  levelUp: 20,
  expeditionWithFavoriteAlly: 5,
  sameZone3Times: -10, // Bored
}

export function getMoraleState(moraleValue: number): MoraleState {
  if (moraleValue >= MORALE_THRESHOLDS.excited.min) return 'excited'
  if (moraleValue >= MORALE_THRESHOLDS.content.min) return 'content'
  if (moraleValue >= MORALE_THRESHOLDS.tired.min) return 'tired'
  if (moraleValue >= MORALE_THRESHOLDS.frustrated.min) return 'frustrated'
  return 'exhausted'
}