import type { Hero, GameplayTrait, TraitQuality, Stats } from '~~/types'
import { getXpForLevel } from './xpService'

// Prestige stat bonuses by prestige level
const PRESTIGE_STAT_BONUSES: Record<number, number> = {
  1: 3,
  2: 4,
  3: 5,
  4: 6,
  5: 7,
}

function getPrestigeStatBonus(prestigeLevel: number): number {
  if (prestigeLevel <= 5) {
    return PRESTIGE_STAT_BONUSES[prestigeLevel] || 0
  }
  return 7 // Cap at +7 per stat after prestige 5
}

// Quality upgrade chances by prestige level
const QUALITY_UPGRADE_CHANCES: Record<number, number> = {
  1: 0.10,
  2: 0.15,
  3: 0.20,
  4: 0.25,
  5: 0.30,
}

function getQualityUpgradeChance(prestigeLevel: number): number {
  if (prestigeLevel <= 5) {
    return QUALITY_UPGRADE_CHANCES[prestigeLevel] || 0
  }
  return 0.30 // Cap at 30% after prestige 5
}

// Upgrade trait quality
function upgradeTraitQuality(currentQuality: TraitQuality): TraitQuality {
  if (currentQuality === 'normal') return 'magic'
  if (currentQuality === 'magic') return 'perfect'
  return 'perfect' // Already max quality
}

// Check if hero gets a new trait slot
function shouldGrantTraitSlot(newPrestigeLevel: number): boolean {
  if (newPrestigeLevel === 1) return true
  if (newPrestigeLevel === 3) return true
  if (newPrestigeLevel >= 5 && newPrestigeLevel % 2 === 1) return true
  return false
}

export interface PrestigeResult {
  hero: Hero
  statBonusGained: number
  upgradeTraitsCount: number
  gainedTraitSlot: boolean
  newPrestigeLevel: number
}

// Perform prestige on a hero
export function prestigeHero(hero: Hero): PrestigeResult {
  if (hero.level < 60) {
    throw new Error('Hero must be level 60 to prestige')
  }

  const newPrestigeLevel = hero.prestigeLevel + 1
  const statBonus = getPrestigeStatBonus(newPrestigeLevel)
  const upgradeChance = getQualityUpgradeChance(newPrestigeLevel)
  const gainedTraitSlot = shouldGrantTraitSlot(newPrestigeLevel)

  // Upgrade trait qualities
  let upgradeTraitsCount = 0
  const upgradedTraits = hero.gameplayTraits.map(trait => {
    if (trait.quality === 'perfect') return trait // Already max

    if (Math.random() < upgradeChance) {
      upgradeTraitsCount++
      return {
        ...trait,
        quality: upgradeTraitQuality(trait.quality),
      }
    }

    return trait
  })

  // Calculate new prestige bonuses
  const newPrestigeBonuses: Stats = {
    combat: hero.prestigeBonuses.combat + statBonus,
    utility: hero.prestigeBonuses.utility + statBonus,
    survival: hero.prestigeBonuses.survival + statBonus,
  }

  // Reset hero to level 1
  const prestigedHero: Hero = {
    ...hero,
    level: 1,
    xp: 0,
    xpToNextLevel: getXpForLevel(1),
    prestigeLevel: newPrestigeLevel,
    prestigeBonuses: newPrestigeBonuses,
    gameplayTraits: upgradedTraits,
    equipment: {}, // Unequip all gear
    morale: 'jubilant', // Fully restore morale on prestige
    moraleLastUpdate: new Date().toISOString(),
  }

  return {
    hero: prestigedHero,
    statBonusGained: statBonus,
    upgradeTraitsCount,
    gainedTraitSlot,
    newPrestigeLevel,
  }
}

// Calculate total prestige power bonus
export function calculatePrestigePowerBonus(hero: Hero): number {
  return hero.prestigeBonuses.combat +
         hero.prestigeBonuses.utility +
         hero.prestigeBonuses.survival
}

// Get prestige info for display
export function getPrestigeInfo(prestigeLevel: number): {
  statBonus: number
  upgradeChance: number
  grantsTraitSlot: boolean
} {
  return {
    statBonus: getPrestigeStatBonus(prestigeLevel + 1),
    upgradeChance: getQualityUpgradeChance(prestigeLevel + 1),
    grantsTraitSlot: shouldGrantTraitSlot(prestigeLevel + 1),
  }
}
