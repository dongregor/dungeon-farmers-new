import type { Hero, Expedition, PendingLoot, Zone, Subzone } from '~~/types'
import { calculateMoraleRecovery } from './moraleService'
import { completeExpedition } from './expeditionEngine'

export interface OfflineProgressResult {
  completedExpeditions: Expedition[]
  heroUpdates: Map<string, Partial<Hero>>
  newExpeditions: Expedition[]
  pendingLoot: PendingLoot[]
  moraleRecovery: Map<string, { morale: string; hoursRested: number }>
}

/**
 * Calculate offline progress for a player
 * Processes completed expeditions, morale recovery, and auto-repeat
 */
export function calculateOfflineProgress(
  currentTime: Date,
  lastOnlineTime: Date,
  activeExpeditions: Expedition[],
  heroes: Hero[],
  zones: Zone[],
  inventorySlots: number,
  usedInventorySlots: number,
  currentGold = 0
): OfflineProgressResult {
  const result: OfflineProgressResult = {
    completedExpeditions: [],
    heroUpdates: new Map(),
    newExpeditions: [],
    pendingLoot: [],
    moraleRecovery: new Map(),
  }

  const now = currentTime.getTime()
  const heroMap = new Map(heroes.map(h => [h.id, h]))

  // Process active expeditions
  for (const expedition of activeExpeditions) {
    const completesAt = new Date(expedition.completesAt).getTime()

    if (completesAt <= now) {
      // Find zone and subzone for this expedition
      const zone = zones.find(z => z.id === expedition.zoneId)
      if (!zone) continue

      const subzone = zone.subzones.find(s => s.id === expedition.subzoneId)
      if (!subzone) continue

      // Get heroes for this expedition
      const expeditionHeroes = expedition.heroIds
        .map(id => heroMap.get(id))
        .filter((h): h is Hero => h !== undefined)

      // Complete the expedition properly
      const completedExpedition = completeExpedition(
        expedition,
        expeditionHeroes,
        zone,
        subzone
      )

      result.completedExpeditions.push(completedExpedition)

      const rewards = completedExpedition.rewards!

      // Check inventory space
      const availableSlots = inventorySlots - usedInventorySlots - result.pendingLoot.length
      const equipmentCount = rewards.equipment.length

      if (equipmentCount > availableSlots) {
        // Create pending loot for overflow
        const pendingEquipment = rewards.equipment.slice(availableSlots)
        const expiresAt = new Date(completesAt + 48 * 60 * 60 * 1000) // 48 hours

        result.pendingLoot.push({
          expeditionId: expedition.id,
          items: pendingEquipment,
          expiresAt: expiresAt.toISOString(),
        })

        // Only keep equipment that fits
        rewards.equipment = rewards.equipment.slice(0, availableSlots)
      }

      // Update heroes with XP and morale
      for (const heroId of expedition.heroIds) {
        const hero = heroMap.get(heroId)
        if (!hero) continue

        const existingUpdate = result.heroUpdates.get(heroId) || {}

        result.heroUpdates.set(heroId, {
          ...existingUpdate,
          xp: (existingUpdate.xp || hero.xp) + rewards.xp,
          // Morale will be updated separately
        })
      }

      // Handle auto-repeat
      // Track accumulated gold for cap checking
      const accumulatedGold = currentGold + result.completedExpeditions.reduce(
        (sum, exp) => sum + (exp.rewards?.gold || 0),
        0
      )

      if (
        expedition.autoRepeat &&
        !shouldStopAutoRepeat(expedition, heroes, inventorySlots, usedInventorySlots, accumulatedGold)
      ) {
        // Create new expedition
        const timeSinceCompletion = now - completesAt
        const newStartTime = completesAt
        const newCompletionTime = completesAt + expedition.durationMinutes * 60 * 1000

        const newExpedition: Expedition = {
          ...expedition,
          id: crypto.randomUUID(),
          startedAt: new Date(newStartTime).toISOString(),
          completesAt: new Date(newCompletionTime).toISOString(),
          events: [],
          pendingChoices: [],
          createdAt: new Date(newStartTime).toISOString(),
          updatedAt: new Date(newStartTime).toISOString(),
        }

        result.newExpeditions.push(newExpedition)
      }
    }
  }

  // Calculate morale recovery for resting heroes
  for (const hero of heroes) {
    // Skip heroes that are on expedition
    if (activeExpeditions.some(exp => exp.heroIds.includes(hero.id))) {
      continue
    }

    const recovery = calculateMoraleRecovery({
      ...hero,
      moraleLastUpdate: lastOnlineTime.toISOString(),
    })

    if (recovery.hoursRested > 0) {
      result.moraleRecovery.set(hero.id, {
        morale: recovery.morale,
        hoursRested: recovery.hoursRested,
      })

      const existingUpdate = result.heroUpdates.get(hero.id) || {}
      result.heroUpdates.set(hero.id, {
        ...existingUpdate,
        morale: recovery.morale as any,
        moraleValue: recovery.moraleValue,
        moraleLastUpdate: currentTime.toISOString(),
      })
    }
  }

  return result
}

/**
 * Check if auto-repeat should stop based on stop conditions
 */
function shouldStopAutoRepeat(
  expedition: Expedition,
  heroes: Hero[],
  inventorySlots: number,
  usedInventorySlots: number,
  currentGold: number
): boolean {
  const { stopConditions } = expedition

  // Check inventory full
  if (stopConditions.inventoryFull && usedInventorySlots >= inventorySlots) {
    return true
  }

  // Check hero morale
  if (stopConditions.anyHeroTired) {
    const expeditionHeroes = heroes.filter(h => expedition.heroIds.includes(h.id))
    const anyTired = expeditionHeroes.some(h => {
      const moraleLevel = getMoraleLevel(h.morale as any)
      return moraleLevel <= 2 // Tired, unhappy, or miserable
    })

    if (anyTired) {
      return true
    }
  }

  // Check resource cap (if enabled)
  if (stopConditions.resourceCap) {
    // Stop auto-repeat if gold is at or above the cap
    // Using MAX_GOLD constant from gameRules
    const MAX_GOLD = 999_999_999
    if (currentGold >= MAX_GOLD) {
      return true
    }
  }

  return false
}

/**
 * Get numeric morale level for comparison
 */
function getMoraleLevel(morale: 'excited' | 'content' | 'tired' | 'frustrated' | 'exhausted'): number {
  switch (morale) {
    case 'exhausted': return 0
    case 'frustrated': return 1
    case 'tired': return 2
    case 'content': return 3
    case 'excited': return 4
    default: return 2
  }
}

/**
 * Calculate hours offline
 */
export function calculateHoursOffline(lastOnlineTime: Date, currentTime: Date): number {
  const msOffline = currentTime.getTime() - lastOnlineTime.getTime()
  return Math.floor(msOffline / (1000 * 60 * 60))
}

/**
 * Get human-readable offline duration
 */
export function formatOfflineDuration(hours: number): string {
  if (hours < 1) return 'less than an hour'
  if (hours === 1) return '1 hour'
  if (hours < 24) return `${hours} hours`

  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  if (days === 1) {
    if (remainingHours === 0) return '1 day'
    return `1 day, ${remainingHours} hours`
  }

  if (remainingHours === 0) return `${days} days`
  return `${days} days, ${remainingHours} hours`
}
