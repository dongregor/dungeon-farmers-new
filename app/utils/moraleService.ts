import type { Hero, Morale } from '~~/types'

// Morale thresholds
export const MORALE_THRESHOLDS = {
  jubilant: 80,
  happy: 60,
  content: 40,
  unhappy: 20,
  miserable: 0,
}

// Morale effects on efficiency
export const MORALE_EFFICIENCY_MODIFIERS: Record<Morale, number> = {
  jubilant: 0.10,   // +10% efficiency
  happy: 0.05,      // +5% efficiency
  content: 0,       // Normal
  unhappy: -0.05,   // -5% efficiency
  miserable: -0.15, // -15% efficiency
}

// Morale change amounts
export const MORALE_CHANGES = {
  // Expedition completion (based on duration)
  expeditionShort: -5,
  expeditionMedium: -10,
  expeditionLong: -15,

  // Positive events
  restPerHour: 5,
  bigLoot: 10,
  discoverSubzone: 15,
  counterThreat: 5,
  levelUp: 20,
  favoriteAlly: 5,

  // Negative events
  failedThreat: -10,
  sameZoneBoredom: -10,
}

// Calculate morale state from numeric value (0-100)
export function getMoraleState(moraleValue: number): Morale {
  if (moraleValue >= MORALE_THRESHOLDS.jubilant) return 'jubilant'
  if (moraleValue >= MORALE_THRESHOLDS.happy) return 'happy'
  if (moraleValue >= MORALE_THRESHOLDS.content) return 'content'
  if (moraleValue >= MORALE_THRESHOLDS.unhappy) return 'unhappy'
  return 'miserable'
}

// Get numeric morale value from state (for initialization)
export function getMoraleValue(state: Morale): number {
  switch (state) {
    case 'jubilant': return 90
    case 'happy': return 70
    case 'content': return 50
    case 'unhappy': return 30
    case 'miserable': return 10
  }
}

// Apply morale change and return new state
export function applyMoraleChange(
  currentMorale: Morale,
  change: number
): { morale: Morale; moraleValue: number } {
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
  morale: Morale
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
  const recovery = hoursRested * MORALE_CHANGES.restPerHour
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

  // Base expedition fatigue
  if (durationMinutes < 30) {
    totalChange += MORALE_CHANGES.expeditionShort
  } else if (durationMinutes < 60) {
    totalChange += MORALE_CHANGES.expeditionMedium
  } else {
    totalChange += MORALE_CHANGES.expeditionLong
  }

  // Event modifiers
  if (events.bigLoot) totalChange += MORALE_CHANGES.bigLoot
  if (events.discoverSubzone) totalChange += MORALE_CHANGES.discoverSubzone
  if (events.counterThreat) totalChange += MORALE_CHANGES.counterThreat
  if (events.failedThreat) totalChange += MORALE_CHANGES.failedThreat
  if (events.favoriteAlly) totalChange += MORALE_CHANGES.favoriteAlly
  if (events.sameZoneBoredom) totalChange += MORALE_CHANGES.sameZoneBoredom

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
  if (hero.morale === 'miserable') {
    return {
      canGo: false,
      reason: 'Hero is exhausted and needs rest',
    }
  }

  // Frustrated heroes refuse long expeditions
  if (hero.morale === 'unhappy' && durationMinutes > 60) {
    return {
      canGo: false,
      reason: 'Hero is too frustrated for long expeditions',
    }
  }

  return { canGo: true }
}

// Get morale efficiency modifier
export function getMoraleEfficiencyModifier(morale: Morale): number {
  return MORALE_EFFICIENCY_MODIFIERS[morale]
}

// Get morale color for UI
export function getMoraleColor(morale: Morale): string {
  switch (morale) {
    case 'jubilant': return 'text-purple-500'
    case 'happy': return 'text-green-500'
    case 'content': return 'text-blue-500'
    case 'unhappy': return 'text-yellow-500'
    case 'miserable': return 'text-red-500'
  }
}

// Get morale description
export function getMoraleDescription(morale: Morale): string {
  switch (morale) {
    case 'jubilant': return 'Feeling fantastic! Ready for anything!'
    case 'happy': return 'In good spirits and eager for adventure'
    case 'content': return 'Rested and ready to work'
    case 'unhappy': return 'Tired and grumpy'
    case 'miserable': return 'Completely exhausted'
  }
}
