import type { Expedition, Hero } from '~~/types'

export interface AutoRepeatSettings {
  autoRepeat: boolean
  autoRepeatLimit?: number // Max repeats (null = unlimited)
  stopConditions: {
    anyHeroTired: boolean // Stop if any hero hits Tired or worse
    inventoryFull: boolean // Stop if inventory full
    resourceCap: boolean // Stop if resource cap reached (future)
  }
}

export interface AutoRepeatResult {
  shouldRepeat: boolean
  reason?: string
  newExpedition?: Expedition
}

/**
 * Check if an expedition should auto-repeat
 */
export function shouldAutoRepeat(
  expedition: Expedition,
  heroes: Hero[],
  options: {
    inventorySlots: number
    usedInventorySlots: number
    currentRepeatCount?: number
  }
): AutoRepeatResult {
  // Check if auto-repeat is enabled
  if (!expedition.autoRepeat) {
    return {
      shouldRepeat: false,
      reason: 'Auto-repeat is disabled',
    }
  }

  // Check repeat limit
  const currentCount = options.currentRepeatCount || 0
  if (expedition.stopConditions.anyHeroTired !== undefined && currentCount >= (expedition.stopConditions.anyHeroTired as any)) {
    // Note: The type is wrong in the interface, should be autoRepeatLimit
    // For now, checking if limit exists
    const limit = (expedition as any).autoRepeatLimit
    if (limit !== undefined && limit !== null && currentCount >= limit) {
      return {
        shouldRepeat: false,
        reason: `Repeat limit reached (${limit})`,
      }
    }
  }

  // Check stop conditions
  const stopCheck = checkStopConditions(
    expedition.stopConditions,
    heroes.filter(h => expedition.heroIds.includes(h.id)),
    options.inventorySlots,
    options.usedInventorySlots
  )

  if (!stopCheck.canContinue) {
    return {
      shouldRepeat: false,
      reason: stopCheck.reason,
    }
  }

  // All checks passed, can repeat
  return {
    shouldRepeat: true,
  }
}

/**
 * Check stop conditions for auto-repeat
 */
export function checkStopConditions(
  stopConditions: AutoRepeatSettings['stopConditions'],
  heroes: Hero[],
  inventorySlots: number,
  usedInventorySlots: number
): {
  canContinue: boolean
  reason?: string
} {
  // Check inventory full
  if (stopConditions.inventoryFull) {
    if (usedInventorySlots >= inventorySlots) {
      return {
        canContinue: false,
        reason: 'Inventory is full',
      }
    }
  }

  // Check hero morale/tiredness
  if (stopConditions.anyHeroTired) {
    const tiredHero = heroes.find(h => {
      const moraleLevel = getMoraleLevel(h.morale)
      return moraleLevel <= 2 // content, unhappy, or miserable
    })

    if (tiredHero) {
      return {
        canContinue: false,
        reason: `${tiredHero.name} is too tired to continue`,
      }
    }
  }

  // Check resource cap (future feature)
  if (stopConditions.resourceCap) {
    // TODO: Implement when resource caps are added
    // For now, resources have no cap
  }

  return { canContinue: true }
}

/**
 * Create a new auto-repeat expedition
 */
export function createAutoRepeatExpedition(
  originalExpedition: Expedition,
  completedAt: Date
): Expedition {
  const startTime = completedAt
  const completionTime = new Date(
    startTime.getTime() + originalExpedition.durationMinutes * 60 * 1000
  )

  return {
    ...originalExpedition,
    id: crypto.randomUUID(),
    status: 'in_progress',
    startedAt: startTime.toISOString(),
    completesAt: completionTime.toISOString(),
    events: [],
    pendingChoices: [],
    createdAt: startTime.toISOString(),
    updatedAt: startTime.toISOString(),
  }
}

/**
 * Get numeric morale level for comparison
 */
function getMoraleLevel(morale: Hero['morale']): number {
  switch (morale) {
    case 'miserable':
      return 0
    case 'unhappy':
      return 1
    case 'content':
      return 2
    case 'happy':
      return 3
    case 'jubilant':
      return 4
    default:
      return 2
  }
}

/**
 * Get default auto-repeat settings
 */
export function getDefaultAutoRepeatSettings(): AutoRepeatSettings {
  return {
    autoRepeat: false,
    autoRepeatLimit: undefined,
    stopConditions: {
      anyHeroTired: true,
      inventoryFull: true,
      resourceCap: false,
    },
  }
}

/**
 * Validate auto-repeat settings
 */
export function validateAutoRepeatSettings(
  settings: Partial<AutoRepeatSettings>
): AutoRepeatSettings {
  const defaults = getDefaultAutoRepeatSettings()

  return {
    autoRepeat: settings.autoRepeat ?? defaults.autoRepeat,
    autoRepeatLimit:
      settings.autoRepeatLimit !== undefined
        ? Math.max(1, Math.min(100, settings.autoRepeatLimit))
        : undefined,
    stopConditions: {
      anyHeroTired:
        settings.stopConditions?.anyHeroTired ??
        defaults.stopConditions.anyHeroTired,
      inventoryFull:
        settings.stopConditions?.inventoryFull ??
        defaults.stopConditions.inventoryFull,
      resourceCap:
        settings.stopConditions?.resourceCap ??
        defaults.stopConditions.resourceCap,
    },
  }
}

/**
 * Get auto-repeat status for UI display
 */
export function getAutoRepeatStatus(
  expedition: Expedition,
  currentRepeatCount: number
): {
  isActive: boolean
  statusText: string
  repeatsRemaining?: number
} {
  if (!expedition.autoRepeat) {
    return {
      isActive: false,
      statusText: 'Auto-repeat disabled',
    }
  }

  const limit = (expedition as any).autoRepeatLimit
  if (limit !== undefined && limit !== null) {
    const remaining = Math.max(0, limit - currentRepeatCount)
    return {
      isActive: true,
      statusText: `Auto-repeat: ${remaining} repeats remaining`,
      repeatsRemaining: remaining,
    }
  }

  return {
    isActive: true,
    statusText: 'Auto-repeat: Unlimited',
  }
}

/**
 * Calculate estimated completion time for all repeats
 */
export function calculateAutoRepeatCompletionTime(
  expedition: Expedition,
  currentRepeatCount: number
): Date | null {
  const limit = (expedition as any).autoRepeatLimit
  if (!expedition.autoRepeat || !limit) {
    return null // Unlimited or disabled
  }

  const remainingRepeats = Math.max(0, limit - currentRepeatCount)
  const currentCompletion = new Date(expedition.completesAt)
  const totalMinutes = remainingRepeats * expedition.durationMinutes

  return new Date(currentCompletion.getTime() + totalMinutes * 60 * 1000)
}
