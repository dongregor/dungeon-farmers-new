import type { Hero } from '~~/types'
import type { Title, TitleCondition } from '~~/types/titles'
import { TITLES } from '~/data/titles'

/**
 * Player progress data for title checking
 * This data should come from the player's profile/progress tracking
 */
export interface PlayerProgress {
  completedZones?: string[]
  monsterKills?: Record<string, number>
  monsterCaptures?: Record<string, number>
  difficultyClearCount?: Record<string, number>
  secretAchievements?: string[]
}

/**
 * Check if a title condition is met
 */
export function checkTitleCondition(
  title: Title,
  hero: Hero,
  progress: PlayerProgress
): boolean {
  const { condition } = title

  switch (condition.type) {
    case 'zone_completion':
      return progress.completedZones?.includes(condition.target!) ?? false

    case 'monster_kills': {
      const kills = progress.monsterKills?.[condition.target!] ?? 0
      return kills >= (condition.count ?? 0)
    }

    case 'monster_captures': {
      const captures = progress.monsterCaptures?.[condition.target!] ?? 0
      return captures >= (condition.count ?? 0)
    }

    case 'difficulty_clear': {
      const clears = progress.difficultyClearCount?.[condition.target!] ?? 0
      return clears >= (condition.count ?? 0)
    }

    case 'prestige':
      return hero.prestigeLevel >= (condition.count ?? 0)

    case 'story_trait':
      return hero.storyTraitIds.includes(condition.target!)

    case 'secret':
      return progress.secretAchievements?.includes(condition.target!) ?? false

    default:
      return false
  }
}

/**
 * Get all available titles that a hero could potentially earn
 */
export function getAvailableTitles(): Title[] {
  return Object.values(TITLES)
}

/**
 * Get all titles that a hero currently qualifies for but hasn't earned
 */
export function getUnlockedTitles(
  hero: Hero,
  progress: PlayerProgress
): Title[] {
  const availableTitles = getAvailableTitles()
  const earnedTitleIds = new Set(hero.titles)

  return availableTitles.filter(title => {
    // Skip if already earned
    if (earnedTitleIds.has(title.id)) return false

    // Check if condition is met
    return checkTitleCondition(title, hero, progress)
  })
}

/**
 * Award a title to a hero
 */
export function awardTitle(hero: Hero, titleId: string): Hero {
  // Don't award duplicate titles
  if (hero.titles.includes(titleId)) {
    return hero
  }

  const newTitles = [...hero.titles, titleId]

  return {
    ...hero,
    titles: newTitles,
    // Set as display title if it's the hero's first title
    displayTitle: hero.displayTitle === null ? titleId : hero.displayTitle,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Remove a title from a hero (for admin/testing purposes)
 */
export function removeTitle(hero: Hero, titleId: string): Hero {
  const newTitles = hero.titles.filter(id => id !== titleId)

  return {
    ...hero,
    titles: newTitles,
    // Clear display title if it was the removed title
    displayTitle: hero.displayTitle === titleId ? null : hero.displayTitle,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Set a hero's displayed title
 */
export function setDisplayTitle(hero: Hero, titleId: string | null): Hero {
  // Verify the hero has earned this title
  if (titleId !== null && !hero.titles.includes(titleId)) {
    throw new Error(`Hero has not earned title: ${titleId}`)
  }

  return {
    ...hero,
    displayTitle: titleId,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Get the title object for a title ID
 */
export function getTitleById(titleId: string): Title | undefined {
  return TITLES[titleId]
}

/**
 * Get title bonus stats for a hero's displayed title
 */
export function getTitleBonus(hero: Hero): {
  stat?: string
  value: number
  context?: string
  description: string
} | null {
  if (!hero.displayTitle) return null

  const title = getTitleById(hero.displayTitle)
  if (!title || !title.bonus) return null

  return {
    stat: title.bonus.stat,
    value: title.bonus.value ?? 0,
    context: title.bonus.context,
    description: title.bonus.description,
  }
}

/**
 * Calculate total stat bonuses from a hero's displayed title
 */
export function calculateTitleStatBonus(
  hero: Hero,
  context?: {
    zoneType?: string
    enemyType?: string
  }
): {
  combat: number
  utility: number
  survival: number
} {
  const bonus = getTitleBonus(hero)
  if (!bonus) {
    return { combat: 0, utility: 0, survival: 0 }
  }

  // Check if context-dependent bonus applies
  if (bonus.context && context) {
    // Context-specific logic would go here
    // For now, simplified: if there's a context requirement, it must match
    // This would need more sophisticated matching in production
  }

  // Apply stat bonus
  const statBonus = { combat: 0, utility: 0, survival: 0 }

  if (bonus.stat) {
    statBonus[bonus.stat as keyof typeof statBonus] = bonus.value
  } else {
    // All stats bonus
    statBonus.combat = bonus.value
    statBonus.utility = bonus.value
    statBonus.survival = bonus.value
  }

  return statBonus
}

/**
 * Check all titles and award new ones to a hero
 * Returns the updated hero and a list of newly awarded titles
 */
export function checkAndAwardTitles(
  hero: Hero,
  progress: PlayerProgress
): {
  hero: Hero
  newTitles: Title[]
} {
  const unlockedTitles = getUnlockedTitles(hero, progress)

  if (unlockedTitles.length === 0) {
    return { hero, newTitles: [] }
  }

  let updatedHero = hero

  for (const title of unlockedTitles) {
    updatedHero = awardTitle(updatedHero, title.id)
  }

  return {
    hero: updatedHero,
    newTitles: unlockedTitles,
  }
}

/**
 * Get titles by source type
 */
export function getTitlesBySource(
  source: Title['source']
): Title[] {
  return Object.values(TITLES).filter(t => t.source === source)
}

/**
 * Get titles by rarity
 */
export function getTitlesByRarity(
  rarity: Title['rarity']
): Title[] {
  return Object.values(TITLES).filter(t => t.rarity === rarity)
}

/**
 * Get human-readable title name with "the" prefix
 */
export function formatTitleName(titleId: string): string {
  const title = getTitleById(titleId)
  return title?.name ?? titleId
}

/**
 * Get a hero's full name with title
 */
export function getHeroNameWithTitle(hero: Hero): string {
  if (!hero.displayTitle) {
    return hero.name
  }

  const titleName = formatTitleName(hero.displayTitle)
  return `${hero.name} ${titleName}`
}
