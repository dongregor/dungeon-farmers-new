import type { Hero } from '~~/types'

// Tiered linear XP curve
export function getXpForLevel(level: number): number {
  if (level <= 10) return 100
  if (level <= 20) return 200
  if (level <= 30) return 350
  if (level <= 40) return 500
  if (level <= 50) return 750
  return 1000
}

// Calculate total XP needed to reach a level from level 1
export function getTotalXpForLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i)
  }
  return total
}

// Add XP to hero and handle level ups
export function addXp(hero: Hero, xpGain: number): {
  hero: Hero
  levelsGained: number
  newLevel: number
} {
  let currentXp = hero.xp + xpGain
  let currentLevel = hero.level
  let levelsGained = 0

  // Process level ups
  while (currentXp >= hero.xpToNextLevel && currentLevel < 60) {
    currentXp -= hero.xpToNextLevel
    currentLevel++
    levelsGained++
  }

  // Calculate new XP to next level
  const xpToNextLevel = currentLevel >= 60 ? 0 : getXpForLevel(currentLevel)

  return {
    hero: {
      ...hero,
      xp: currentXp,
      level: currentLevel,
      xpToNextLevel,
    },
    levelsGained,
    newLevel: currentLevel,
  }
}

// Check if hero can prestige
export function canPrestige(hero: Hero): boolean {
  return hero.level >= 60
}

// Get XP progress percentage
export function getXpProgress(hero: Hero): number {
  if (hero.xpToNextLevel === 0) return 100
  return Math.min(100, (hero.xp / hero.xpToNextLevel) * 100)
}
