import type { Hero, Zone, Subzone, Expedition, ExpeditionRewards } from '~~/types'
import { calculateHeroPower } from './powerCalculator'
import { calculateEfficiency } from './efficiencyCalculator'
import { generateExpeditionEvents } from './eventGenerator'
import { generateExpeditionLog } from './logGenerator'

export function createExpedition(
  playerId: string,
  heroes: Hero[],
  zone: Zone,
  subzone: Subzone
): Expedition {
  // Calculate total team power
  const teamPower = heroes.reduce((sum, h) => sum + calculateHeroPower(h).total, 0)
  const now = new Date()
  const completesAt = new Date(now.getTime() + subzone.baseDuration * 60 * 1000)

  return {
    id: crypto.randomUUID(),
    playerId,
    zoneId: zone.id,
    subzoneId: subzone.id,
    heroIds: heroes.map(h => h.id),
    teamPower, // Store calculated power for reference
    status: 'in_progress',
    startedAt: now.toISOString(),
    completesAt: completesAt.toISOString(),
    durationMinutes: subzone.baseDuration,
    autoRepeat: false,
    stopConditions: {
      anyHeroTired: false,
      inventoryFull: false,
      resourceCap: false,
    },
    events: [],
    pendingChoices: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

export function completeExpedition(
  expedition: Expedition,
  heroes: Hero[],
  zone: Zone,
  subzone: Subzone
): Expedition {
  const efficiency = calculateEfficiency(heroes, zone, subzone)
  const events = generateExpeditionEvents(subzone, heroes, efficiency)
  const rewards = calculateRewards(subzone, efficiency, events)
  const log = generateExpeditionLog({
    expedition,
    heroes,
    zone,
    subzone,
    events,
    rewards,
    efficiency,
  })

  return {
    ...expedition,
    status: events.some(e => e.type === 'choice' && !e.selectedChoice)
      ? 'waiting_choices'
      : 'completed',
    efficiency,
    rewards,
    events,
    log,
  }
}

function calculateRewards(
  subzone: Subzone,
  efficiency: number,
  events: any[]
): ExpeditionRewards {
  // Accumulate event bonuses
  const eventBonuses = events.reduce((acc, e) => ({
    gold: acc.gold + (e.data.reward?.gold || 0),
    xp: acc.xp + (e.data.reward?.xp || 0),
  }), { gold: 0, xp: 0 })

  return {
    gold: Math.round(subzone.baseGold * efficiency + eventBonuses.gold),
    xp: Math.round(subzone.baseXp * efficiency + eventBonuses.xp),
    equipment: [], // Rolled separately from loot tables
    materials: {}, // Rolled separately from loot tables
    familiarityGain: Math.round(5 * efficiency),
    masteryGain: Math.round(3 * efficiency),
  }
}

export function checkExpeditionCompletion(expedition: Expedition): boolean {
  const now = new Date()
  const completesAt = new Date(expedition.completesAt)
  return now >= completesAt
}

export function getTimeRemaining(expedition: Expedition): number {
  const now = new Date()
  const completesAt = new Date(expedition.completesAt)
  return Math.max(0, completesAt.getTime() - now.getTime())
}

export function getProgressPercentage(expedition: Expedition): number {
  const now = new Date()
  const startedAt = new Date(expedition.startedAt)
  const completesAt = new Date(expedition.completesAt)
  const totalDuration = completesAt.getTime() - startedAt.getTime()
  const elapsed = now.getTime() - startedAt.getTime()
  
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
}