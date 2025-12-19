import type { Hero, Equipment } from '~~/types'
import { addXp, canPrestige } from './xpService'
import { calculateHeroPower } from './powerCalculator'

export interface LevelUpResult {
  hero: Hero
  levelsGained: number
  newLevel: number
  canPrestige: boolean
  powerGain: number
}

// Handle level up for a hero
export function levelUpHero(hero: Hero, xpGain: number, equipment: Equipment[] = []): LevelUpResult {
  const oldPower = calculateHeroPower(hero, equipment).total

  // Add XP and process level ups
  const result = addXp(hero, xpGain)

  // Recalculate power with new level
  const newPower = calculateHeroPower(result.hero, equipment).total

  return {
    hero: {
      ...result.hero,
      power: newPower,
    },
    levelsGained: result.levelsGained,
    newLevel: result.newLevel,
    canPrestige: canPrestige(result.hero),
    powerGain: newPower - oldPower,
  }
}

// Batch level up multiple heroes
export function levelUpParty(
  heroes: Hero[],
  xpGain: number,
  equipmentMap: Record<string, Equipment[]> = {}
): Map<string, LevelUpResult> {
  const results = new Map<string, LevelUpResult>()

  for (const hero of heroes) {
    const equipment = equipmentMap[hero.id] || []
    const result = levelUpHero(hero, xpGain, equipment)
    results.set(hero.id, result)
  }

  return results
}

// Get stat increase per level (used for display)
export function getStatIncreasePerLevel(): number {
  return 0.5 // Each stat increases by 0.5 per level (from power calculator)
}
