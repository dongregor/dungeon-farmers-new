import type { Hero, Equipment, Stats } from '~~/types'
import { getGameplayTraitById } from '~/data/gameplayTraits'

export interface PowerBreakdown {
  statPower: number
  levelPower: number
  prestigePower: number
  gearPower: number
  traitPower: number
  total: number
}

export function calculateHeroPower(
  hero: Hero,
  equipment: Equipment[] = []
): PowerBreakdown {
  // Base stats
  const statPower = hero.baseStats.combat + hero.baseStats.utility + hero.baseStats.survival

  // Level scaling
  const levelPower = hero.level * 2

  // Prestige bonuses
  const prestigePower = hero.prestigeBonuses.combat + 
                        hero.prestigeBonuses.utility + 
                        hero.prestigeBonuses.survival

  // Gear score
  const gearPower = equipment.reduce((sum, eq) => sum + eq.gearScore, 0)

  // Trait power (positive - negative)
  const traitPower = hero.gameplayTraits.reduce((sum, trait) => {
    const def = getGameplayTraitById(trait.traitId)
    if (!def) return sum
    return sum + (def.isNegative ? -trait.rolledValue : trait.rolledValue)
  }, 0)

  return {
    statPower,
    levelPower,
    prestigePower,
    gearPower,
    traitPower,
    total: statPower + levelPower + prestigePower + gearPower + traitPower
  }
}

// Power ranges by progression
export const POWER_RANGES = {
  freshHero: { min: 15, max: 25 },
  gearedLevel20: { min: 80, max: 120 },
  gearedLevel40: { min: 200, max: 300 },
  maxLevelPrePrestige: { min: 400, max: 500 },
  prestige3Optimized: { min: 600, max: Infinity },
}

export function calculateTeamPower(heroes: Hero[], equipmentMap: Record<string, Equipment[]> = {}): number {
  return heroes.reduce((sum, hero) => {
    const heroEquipment = equipmentMap[hero.id] || []
    return sum + calculateHeroPower(hero, heroEquipment).total
  }, 0)
}