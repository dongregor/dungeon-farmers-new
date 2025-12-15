/**
 * Achievement System
 *
 * Philosophy:
 * - Separate from hero titles. Titles are hero accomplishments, achievements are account milestones.
 * - Rewards: Unlocks + Cosmetics (no percentage bonuses - keeps it fair for new players)
 */

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export type AchievementCategory =
  | 'explorer'
  | 'collector'
  | 'hoarder'
  | 'storyteller'
  | 'master'
  | 'veteran'
  | 'merchant'
  | 'challenger'
  | 'hidden'

export interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  tier: AchievementTier
  isHidden: boolean

  // Requirements
  requirement: {
    type: 'count' | 'milestone' | 'condition'
    target: string
    count?: number
  }

  // Rewards
  reward: {
    type: 'gold' | 'unlock' | 'cosmetic' | 'title'
    value?: number
    unlockId?: string
    description: string
  }

  // Display
  icon: string
  points: number
}

// ===== EXPLORER ACHIEVEMENTS =====

export const EXPLORER_ACHIEVEMENTS: Record<string, Achievement> = {
  explorer_bronze: {
    id: 'explorer_bronze',
    name: 'Novice Explorer',
    description: 'Complete 10 expeditions',
    category: 'explorer',
    tier: 'bronze',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'expeditions_completed',
      count: 10,
    },
    reward: {
      type: 'gold',
      value: 200,
      description: '200 gold',
    },
    icon: '🗺️',
    points: 10,
  },
  explorer_silver: {
    id: 'explorer_silver',
    name: 'Seasoned Explorer',
    description: 'Complete 100 expeditions',
    category: 'explorer',
    tier: 'silver',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'expeditions_completed',
      count: 100,
    },
    reward: {
      type: 'gold',
      value: 1000,
      description: '1000 gold',
    },
    icon: '🗺️',
    points: 25,
  },
  explorer_gold: {
    id: 'explorer_gold',
    name: 'Master Explorer',
    description: 'Complete 500 expeditions',
    category: 'explorer',
    tier: 'gold',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'expeditions_completed',
      count: 500,
    },
    reward: {
      type: 'unlock',
      unlockId: 'extra_preset_slot',
      description: 'Unlock extra party preset slot',
    },
    icon: '🗺️',
    points: 50,
  },
  explorer_platinum: {
    id: 'explorer_platinum',
    name: 'Legendary Explorer',
    description: 'Complete 2000 expeditions',
    category: 'explorer',
    tier: 'platinum',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'expeditions_completed',
      count: 2000,
    },
    reward: {
      type: 'title',
      description: 'Unlock profile title: "The Wanderer"',
    },
    icon: '🗺️',
    points: 100,
  },
}

// ===== COLLECTOR ACHIEVEMENTS =====

export const COLLECTOR_ACHIEVEMENTS: Record<string, Achievement> = {
  collector_bronze: {
    id: 'collector_bronze',
    name: 'Hero Collector',
    description: 'Recruit 5 unique heroes',
    category: 'collector',
    tier: 'bronze',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'unique_heroes_recruited',
      count: 5,
    },
    reward: {
      type: 'gold',
      value: 300,
      description: '300 gold',
    },
    icon: '👥',
    points: 10,
  },
  collector_silver: {
    id: 'collector_silver',
    name: 'Guild Builder',
    description: 'Recruit 25 unique heroes',
    category: 'collector',
    tier: 'silver',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'unique_heroes_recruited',
      count: 25,
    },
    reward: {
      type: 'gold',
      value: 1500,
      description: '1500 gold',
    },
    icon: '👥',
    points: 25,
  },
  collector_gold: {
    id: 'collector_gold',
    name: 'Master Recruiter',
    description: 'Recruit 75 unique heroes',
    category: 'collector',
    tier: 'gold',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'unique_heroes_recruited',
      count: 75,
    },
    reward: {
      type: 'unlock',
      unlockId: 'extra_tavern_slot',
      description: 'Unlock extra tavern slot',
    },
    icon: '👥',
    points: 50,
  },
  collector_platinum: {
    id: 'collector_platinum',
    name: 'Guild Master Supreme',
    description: 'Recruit 150 unique heroes',
    category: 'collector',
    tier: 'platinum',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'unique_heroes_recruited',
      count: 150,
    },
    reward: {
      type: 'cosmetic',
      description: 'Unlock exclusive guild banner',
    },
    icon: '👥',
    points: 100,
  },
}

// ===== HOARDER ACHIEVEMENTS =====

export const HOARDER_ACHIEVEMENTS: Record<string, Achievement> = {
  hoarder_bronze: {
    id: 'hoarder_bronze',
    name: 'Gear Collector',
    description: 'Own 20 equipment pieces',
    category: 'hoarder',
    tier: 'bronze',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'equipment_owned',
      count: 20,
    },
    reward: {
      type: 'gold',
      value: 250,
      description: '250 gold',
    },
    icon: '⚔️',
    points: 10,
  },
  hoarder_silver: {
    id: 'hoarder_silver',
    name: 'Arsenal Builder',
    description: 'Own 100 equipment pieces',
    category: 'hoarder',
    tier: 'silver',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'equipment_owned',
      count: 100,
    },
    reward: {
      type: 'gold',
      value: 1200,
      description: '1200 gold',
    },
    icon: '⚔️',
    points: 25,
  },
  hoarder_gold: {
    id: 'hoarder_gold',
    name: 'Legendary Armory',
    description: 'Own 300 equipment pieces',
    category: 'hoarder',
    tier: 'gold',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'equipment_owned',
      count: 300,
    },
    reward: {
      type: 'unlock',
      unlockId: 'extra_inventory_slots',
      description: 'Unlock +50 inventory slots',
    },
    icon: '⚔️',
    points: 50,
  },
  hoarder_platinum: {
    id: 'hoarder_platinum',
    name: 'Infinite Arsenal',
    description: 'Own 750 equipment pieces',
    category: 'hoarder',
    tier: 'platinum',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'equipment_owned',
      count: 750,
    },
    reward: {
      type: 'title',
      description: 'Unlock profile title: "The Hoarder"',
    },
    icon: '⚔️',
    points: 100,
  },
}

// ===== VETERAN ACHIEVEMENTS =====

export const VETERAN_ACHIEVEMENTS: Record<string, Achievement> = {
  veteran_bronze: {
    id: 'veteran_bronze',
    name: 'First Prestige',
    description: 'Prestige a hero for the first time',
    category: 'veteran',
    tier: 'bronze',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'heroes_prestiged',
      count: 1,
    },
    reward: {
      type: 'gold',
      value: 500,
      description: '500 gold',
    },
    icon: '👑',
    points: 15,
  },
  veteran_silver: {
    id: 'veteran_silver',
    name: 'Prestige Master',
    description: 'Prestige 5 heroes',
    category: 'veteran',
    tier: 'silver',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'heroes_prestiged',
      count: 5,
    },
    reward: {
      type: 'gold',
      value: 2000,
      description: '2000 gold',
    },
    icon: '👑',
    points: 30,
  },
  veteran_gold: {
    id: 'veteran_gold',
    name: 'Elite Trainer',
    description: 'Prestige 15 heroes',
    category: 'veteran',
    tier: 'gold',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'heroes_prestiged',
      count: 15,
    },
    reward: {
      type: 'unlock',
      unlockId: 'prestige_bonus',
      description: 'Unlock prestige XP boost',
    },
    icon: '👑',
    points: 60,
  },
  veteran_platinum: {
    id: 'veteran_platinum',
    name: 'Eternal Mentor',
    description: 'Prestige 30 heroes',
    category: 'veteran',
    tier: 'platinum',
    isHidden: false,
    requirement: {
      type: 'count',
      target: 'heroes_prestiged',
      count: 30,
    },
    reward: {
      type: 'cosmetic',
      description: 'Unlock exclusive prestige effect',
    },
    icon: '👑',
    points: 120,
  },
}

// ===== HIDDEN ACHIEVEMENTS =====

export const HIDDEN_ACHIEVEMENTS: Record<string, Achievement> = {
  oops: {
    id: 'oops',
    name: 'Oops',
    description: 'Retire a legendary hero',
    category: 'hidden',
    tier: 'bronze',
    isHidden: true,
    requirement: {
      type: 'condition',
      target: 'retire_legendary_hero',
    },
    reward: {
      type: 'gold',
      value: 100,
      description: '100 gold (consolation prize)',
    },
    icon: '😅',
    points: 5,
  },
  against_all_odds: {
    id: 'against_all_odds',
    name: 'Against All Odds',
    description: 'Clear hard content with an all-common party',
    category: 'hidden',
    tier: 'gold',
    isHidden: true,
    requirement: {
      type: 'condition',
      target: 'clear_hard_with_commons',
    },
    reward: {
      type: 'title',
      description: 'Unlock title: "The Underdog"',
    },
    icon: '💪',
    points: 75,
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clear a dungeon with a single hero',
    category: 'hidden',
    tier: 'silver',
    isHidden: true,
    requirement: {
      type: 'condition',
      target: 'clear_dungeon_solo',
    },
    reward: {
      type: 'gold',
      value: 1000,
      description: '1000 gold',
    },
    icon: '🎯',
    points: 40,
  },
  night_shift: {
    id: 'night_shift',
    name: 'Night Shift',
    description: 'Complete 100 expeditions between midnight-6am',
    category: 'hidden',
    tier: 'silver',
    isHidden: true,
    requirement: {
      type: 'count',
      target: 'night_expeditions',
      count: 100,
    },
    reward: {
      type: 'cosmetic',
      description: 'Unlock "Night Owl" profile badge',
    },
    icon: '🦉',
    points: 35,
  },
}

/**
 * Get all achievements
 */
export function getAllAchievements(): Achievement[] {
  return [
    ...Object.values(EXPLORER_ACHIEVEMENTS),
    ...Object.values(COLLECTOR_ACHIEVEMENTS),
    ...Object.values(HOARDER_ACHIEVEMENTS),
    ...Object.values(VETERAN_ACHIEVEMENTS),
    ...Object.values(HIDDEN_ACHIEVEMENTS),
  ]
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return getAllAchievements().filter(a => a.category === category)
}

/**
 * Get achievements by tier
 */
export function getAchievementsByTier(tier: AchievementTier): Achievement[] {
  return getAllAchievements().filter(a => a.tier === tier)
}

/**
 * Get visible achievements (non-hidden or unlocked hidden)
 */
export function getVisibleAchievements(unlockedIds: string[]): Achievement[] {
  return getAllAchievements().filter(a => {
    if (!a.isHidden) return true
    return unlockedIds.includes(a.id)
  })
}

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return getAllAchievements().find(a => a.id === id)
}

/**
 * Calculate total achievement points
 */
export function calculateTotalPoints(unlockedIds: string[]): number {
  return unlockedIds.reduce((total, id) => {
    const achievement = getAchievementById(id)
    return total + (achievement?.points || 0)
  }, 0)
}

/**
 * Calculate completion percentage
 */
export function calculateCompletionPercentage(unlockedIds: string[]): number {
  const total = getAllAchievements().length
  const unlocked = unlockedIds.length
  return Math.round((unlocked / total) * 100)
}

/**
 * Get rarest achievement
 */
export function getRarestAchievement(
  unlockedIds: string[],
  globalStats: Record<string, number>
): Achievement | undefined {
  const unlocked = unlockedIds
    .map(id => ({
      achievement: getAchievementById(id),
      rarity: globalStats[id] || 100,
    }))
    .filter(({ achievement }) => achievement !== undefined)
    .sort((a, b) => a.rarity - b.rarity)

  return unlocked[0]?.achievement
}
