import type { Hero, MoraleState } from '~~/types'
import { MORALE_THRESHOLDS, MORALE_CHANGES, getMoraleState as getMoraleStateFromTypes } from '~~/types/morale'

// Morale effects on efficiency
export const MORALE_EFFICIENCY_MODIFIERS: Record<MoraleState, number> = {
  excited: 0.10,      // +10% efficiency
  content: 0,         // Normal
  tired: -0.05,       // -5% efficiency
  frustrated: -0.15,  // -15% efficiency
  exhausted: -0.25,   // -25% efficiency (unavailable)
}

// Calculate morale state from numeric value (0-100)
export function getMoraleState(moraleValue: number): MoraleState {
  return getMoraleStateFromTypes(moraleValue)
}

// Get numeric morale value from state (for initialization)
export function getMoraleValue(state: MoraleState): number {
  const thresholds = MORALE_THRESHOLDS[state]
  return Math.floor((thresholds.min + thresholds.max) / 2)
}

// Apply morale change and return new state
export function applyMoraleChange(
  currentMorale: MoraleState,
  change: number
): { morale: MoraleState; moraleValue: number } {
  const currentValue = getMoraleValue(currentMorale)
  const newValue = Math.max(0, Math.min(100, currentValue + change))
  const newMorale = getMoraleState(newValue)

  return {
    morale: newMorale,
    moraleValue: newValue,
  }
}

// Calculate morale recovery from resting
export function calculateMoraleRecovery(hero: Hero): {
  morale: MoraleState
  moraleValue: number
  hoursRested: number
} {
  const now = new Date()
  const lastUpdate = new Date(hero.moraleLastUpdate)
  const hoursRested = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60))

  if (hoursRested === 0) {
    return {
      morale: hero.morale,
      moraleValue: getMoraleValue(hero.morale),
      hoursRested: 0,
    }
  }

  // Recovery: +5 per hour
  const recovery = hoursRested * MORALE_CHANGES.rest
  const result = applyMoraleChange(hero.morale, recovery)

  return {
    ...result,
    hoursRested,
  }
}

// Update hero morale after expedition
export function updateMoraleAfterExpedition(
  hero: Hero,
  durationMinutes: number,
  events: {
    bigLoot?: boolean
    discoverSubzone?: boolean
    counterThreat?: boolean
    failedThreat?: boolean
    favoriteAlly?: boolean
    sameZoneBoredom?: boolean
  } = {}
): Hero {
  let totalChange = 0

  // Base expedition fatigue (based on duration, -5 to -15)
  const durationHours = durationMinutes / 60
  const fatigueRange = MORALE_CHANGES.completeExpedition
  const fatigueAmount = Math.round(fatigueRange.min + (fatigueRange.max - fatigueRange.min) * Math.min(1, durationHours / 2))
  totalChange += fatigueAmount

  // Event modifiers
  if (events.bigLoot) totalChange += MORALE_CHANGES.bigLootDrop
  if (events.discoverSubzone) totalChange += MORALE_CHANGES.discoverSubzone
  if (events.counterThreat) totalChange += MORALE_CHANGES.counterThreat
  if (events.failedThreat) totalChange += MORALE_CHANGES.failedThreat
  if (events.favoriteAlly) totalChange += MORALE_CHANGES.expeditionWithFavoriteAlly
  if (events.sameZoneBoredom) totalChange += MORALE_CHANGES.sameZone3Times

  const result = applyMoraleChange(hero.morale, totalChange)

  return {
    ...hero,
    morale: result.morale,
    moraleLastUpdate: new Date().toISOString(),
  }
}

// Update hero morale after level up
export function updateMoraleAfterLevelUp(hero: Hero): Hero {
  const result = applyMoraleChange(hero.morale, MORALE_CHANGES.levelUp)

  return {
    ...hero,
    morale: result.morale,
    moraleLastUpdate: new Date().toISOString(),
  }
}

// Check if hero can go on expedition based on morale
export function canGoOnExpedition(hero: Hero, durationMinutes: number): {
  canGo: boolean
  reason?: string
} {
  // Exhausted heroes can't go on any expedition
  if (hero.morale === 'exhausted') {
    return {
      canGo: false,
      reason: 'Hero is exhausted and needs rest',
    }
  }

  // Frustrated heroes refuse long expeditions
  if (hero.morale === 'frustrated' && durationMinutes > 60) {
    return {
      canGo: false,
      reason: 'Hero is too frustrated for long expeditions',
    }
  }

  return { canGo: true }
}

// Get morale efficiency modifier
export function getMoraleEfficiencyModifier(morale: MoraleState): number {
  return MORALE_EFFICIENCY_MODIFIERS[morale]
}

// Get morale color for UI
export function getMoraleColor(morale: MoraleState): string {
  switch (morale) {
    case 'excited': return 'text-purple-500'
    case 'content': return 'text-blue-500'
    case 'tired': return 'text-yellow-500'
    case 'frustrated': return 'text-orange-500'
    case 'exhausted': return 'text-red-500'
  }
}

// Get morale description
export function getMoraleDescription(morale: MoraleState): string {
  switch (morale) {
    case 'excited': return 'Feeling fantastic! Ready for anything!'
    case 'content': return 'Rested and ready to work'
    case 'tired': return 'Feeling tired, but can still work'
    case 'frustrated': return 'Tired and grumpy'
    case 'exhausted': return 'Completely exhausted and unavailable'
  }
}
