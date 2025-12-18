/**
 * Challenge System Data
 *
 * Philosophy: Challenge Board
 * - Bonus opportunities, not exclusive content
 * - No FOMO - missing a day means missing bonus rewards, not unique content
 */

import type {
  Challenge,
  ChallengeType,
  ChallengeRequirement,
  ChallengeReward,
} from '~/stores/challenges'

// ===== DAILY CHALLENGES =====

/**
 * Daily challenge pool
 * Server picks 3 random challenges from this pool each day
 */
export const DAILY_CHALLENGE_POOL: Omit<Challenge, 'id' | 'type'>[] = [
  {
    title: 'Daily Explorer',
    description: 'Complete 3 expeditions',
    requirement: {
      type: 'expedition_count',
      target: 3,
    },
    reward: {
      gold: 100,
      description: '100 gold',
    },
    icon: '🗺️',
  },
  {
    title: 'Combat Specialist',
    description: 'Use a hero with Combat 6+ on an expedition',
    requirement: {
      type: 'hero_stat_threshold',
      target: 6,
      metadata: { stat: 'combat' },
    },
    reward: {
      gold: 75,
      description: '75 gold',
    },
    icon: '⚔️',
  },
  {
    title: 'Discovery',
    description: 'Discover a new subzone',
    requirement: {
      type: 'subzone_discovery',
      target: 1,
    },
    reward: {
      gold: 150,
      materials: [
        { id: 'wood', count: 5 },
        { id: 'stone', count: 5 },
      ],
      description: '150 gold + materials',
    },
    icon: '🔍',
  },
  {
    title: 'Speed Runner',
    description: 'Complete an expedition in under 30 minutes',
    requirement: {
      type: 'expedition_duration',
      target: 30,
    },
    reward: {
      gold: 50,
      description: '50 gold',
    },
    icon: '⚡',
  },
  {
    title: 'Full Party',
    description: 'Send a full party (4 heroes) on an expedition',
    requirement: {
      type: 'full_party',
      target: 1,
    },
    reward: {
      gold: 100,
      description: '100 gold',
    },
    icon: '👥',
  },
  {
    title: 'Utility Expert',
    description: 'Use a hero with Utility 6+ on an expedition',
    requirement: {
      type: 'hero_stat_threshold',
      target: 6,
      metadata: { stat: 'utility' },
    },
    reward: {
      gold: 75,
      description: '75 gold',
    },
    icon: '🛠️',
  },
  {
    title: 'Survival Specialist',
    description: 'Use a hero with Survival 6+ on an expedition',
    requirement: {
      type: 'hero_stat_threshold',
      target: 6,
      metadata: { stat: 'survival' },
    },
    reward: {
      gold: 75,
      description: '75 gold',
    },
    icon: '🛡️',
  },
  {
    title: 'Quick Expedition',
    description: 'Complete a 15-minute expedition',
    requirement: {
      type: 'expedition_duration',
      target: 15,
    },
    reward: {
      gold: 40,
      description: '40 gold',
    },
    icon: '⏱️',
  },
  {
    title: 'Power Duo',
    description: 'Complete an expedition with exactly 2 heroes',
    requirement: {
      type: 'full_party',
      target: 1,
      metadata: { exactSize: 2 },
    },
    reward: {
      gold: 80,
      description: '80 gold',
    },
    icon: '🤝',
  },
  {
    title: 'Material Gatherer',
    description: 'Discover 2 subzones',
    requirement: {
      type: 'subzone_discovery',
      target: 2,
    },
    reward: {
      gold: 200,
      materials: [
        { id: 'wood', count: 10 },
        { id: 'stone', count: 10 },
        { id: 'iron', count: 5 },
      ],
      description: '200 gold + materials',
    },
    icon: '📦',
  },
]

// ===== WEEKLY CHALLENGES =====

/**
 * Weekly challenge pool
 * Server picks 5 challenges from this pool each week
 */
export const WEEKLY_CHALLENGE_POOL: Omit<Challenge, 'id' | 'type'>[] = [
  {
    title: 'Weekly Explorer',
    description: 'Complete 20 expeditions',
    requirement: {
      type: 'expedition_count',
      target: 20,
    },
    reward: {
      gold: 500,
      description: '500 gold',
    },
    icon: '🗺️',
  },
  {
    title: 'Recruiter',
    description: 'Recruit 2 heroes from the tavern',
    requirement: {
      type: 'recruit_count',
      target: 2,
    },
    reward: {
      gold: 300,
      freeRefresh: true,
      description: '300 gold + free tavern refresh',
    },
    icon: '👤',
  },
  {
    title: 'Training Montage',
    description: 'Level up any hero 3 times',
    requirement: {
      type: 'level_up_count',
      target: 3,
    },
    reward: {
      gold: 400,
      description: '400 gold',
    },
    icon: '⬆️',
  },
  {
    title: 'World Traveler',
    description: 'Complete expeditions in 3 different zones',
    requirement: {
      type: 'unique_zones',
      target: 3,
    },
    reward: {
      gold: 350,
      materials: [
        { id: 'wood', count: 20 },
        { id: 'stone', count: 20 },
        { id: 'iron', count: 10 },
      ],
      description: '350 gold + materials',
    },
    icon: '🌍',
  },
  {
    title: 'Gold Rush',
    description: 'Earn 2000 gold total from expeditions',
    requirement: {
      type: 'gold_earned',
      target: 2000,
    },
    reward: {
      gold: 250,
      description: '250 gold bonus',
    },
    icon: '💰',
  },
  {
    title: 'Expedition Marathon',
    description: 'Complete 30 expeditions',
    requirement: {
      type: 'expedition_count',
      target: 30,
    },
    reward: {
      gold: 750,
      description: '750 gold',
    },
    icon: '🏃',
  },
  {
    title: 'Guild Builder',
    description: 'Recruit 3 heroes from the tavern',
    requirement: {
      type: 'recruit_count',
      target: 3,
    },
    reward: {
      gold: 450,
      freeRefresh: true,
      description: '450 gold + free tavern refresh',
    },
    icon: '🏰',
  },
  {
    title: 'Power Leveling',
    description: 'Level up any hero 5 times',
    requirement: {
      type: 'level_up_count',
      target: 5,
    },
    reward: {
      gold: 600,
      description: '600 gold',
    },
    icon: '💪',
  },
  {
    title: 'Zone Explorer',
    description: 'Complete expeditions in 5 different zones',
    requirement: {
      type: 'unique_zones',
      target: 5,
    },
    reward: {
      gold: 500,
      materials: [
        { id: 'wood', count: 30 },
        { id: 'stone', count: 30 },
        { id: 'iron', count: 15 },
        { id: 'crystal', count: 5 },
      ],
      description: '500 gold + materials',
    },
    icon: '🧭',
  },
  {
    title: 'Treasure Hunter',
    description: 'Earn 3500 gold total from expeditions',
    requirement: {
      type: 'gold_earned',
      target: 3500,
    },
    reward: {
      gold: 400,
      description: '400 gold bonus',
    },
    icon: '💎',
  },
  {
    title: 'Full Party Marathon',
    description: 'Send 10 full party (4 heroes) expeditions',
    requirement: {
      type: 'full_party',
      target: 10,
    },
    reward: {
      gold: 450,
      description: '450 gold',
    },
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Discovery Expert',
    description: 'Discover 5 new subzones',
    requirement: {
      type: 'subzone_discovery',
      target: 5,
    },
    reward: {
      gold: 550,
      materials: [
        { id: 'wood', count: 25 },
        { id: 'stone', count: 25 },
        { id: 'iron', count: 15 },
      ],
      description: '550 gold + materials',
    },
    icon: '🔭',
  },
]

/**
 * Generate random daily challenges
 */
export function generateDailyChallenges(count: number = 3, seed?: number): Challenge[] {
  // Create a seeded PRNG that advances state on each call
  let currentSeed = seed ?? Math.floor(Math.random() * 233280)
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    return currentSeed / 233280
  }

  const shuffled = [...DAILY_CHALLENGE_POOL].sort(() => {
    return (seed !== undefined ? seededRandom() : Math.random()) - 0.5
  })

  return shuffled.slice(0, count).map((challenge, index) => ({
    id: `daily_${new Date().toISOString().split('T')[0]}_${index}`,
    type: 'daily' as ChallengeType,
    ...challenge,
  }))
}

/**
 * Generate random weekly challenges
 */
export function generateWeeklyChallenges(count: number = 5, seed?: number): Challenge[] {
  // Create a seeded PRNG that advances state on each call
  let currentSeed = seed ?? Math.floor(Math.random() * 233280)
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    return currentSeed / 233280
  }

  const shuffled = [...WEEKLY_CHALLENGE_POOL].sort(() => {
    return (seed !== undefined ? seededRandom() : Math.random()) - 0.5
  })

  return shuffled.slice(0, count).map((challenge, index) => ({
    id: `weekly_${getWeekNumber()}_${index}`,
    type: 'weekly' as ChallengeType,
    ...challenge,
  }))
}

/**
 * Get current week number (for consistent weekly challenges)
 */
function getWeekNumber(): string {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  const weekNumber = Math.floor(diff / oneWeek)
  return `${now.getFullYear()}_W${weekNumber}`
}

/**
 * Get daily reset time (midnight UTC)
 */
export function getDailyResetTime(): Date {
  const now = new Date()
  const reset = new Date(now)
  reset.setUTCHours(24, 0, 0, 0)
  return reset
}

/**
 * Get weekly reset time (Monday midnight UTC)
 */
export function getWeeklyResetTime(): Date {
  const now = new Date()
  const reset = new Date(now)
  const daysUntilMonday = (8 - reset.getUTCDay()) % 7 || 7
  reset.setUTCDate(reset.getUTCDate() + daysUntilMonday)
  reset.setUTCHours(0, 0, 0, 0)
  return reset
}

/**
 * Get challenge by ID
 */
export function getChallengeById(id: string): Challenge | undefined {
  const allChallenges = [
    ...DAILY_CHALLENGE_POOL.map((c, i) => ({ id: `daily_${i}`, type: 'daily' as ChallengeType, ...c })),
    ...WEEKLY_CHALLENGE_POOL.map((c, i) => ({ id: `weekly_${i}`, type: 'weekly' as ChallengeType, ...c })),
  ]
  return allChallenges.find(c => c.id === id)
}

/**
 * Check if a challenge type is valid
 */
export function isValidChallengeType(type: string): type is ChallengeType {
  return type === 'daily' || type === 'weekly'
}

/**
 * Get recommended challenge count
 */
export function getRecommendedChallengeCount(type: ChallengeType): number {
  return type === 'daily' ? 3 : 5
}

/**
 * Get all daily challenge templates
 */
export function getDailyChallengeTemplates() {
  return DAILY_CHALLENGE_POOL
}

/**
 * Get all weekly challenge templates
 */
export function getWeeklyChallengeTemplates() {
  return WEEKLY_CHALLENGE_POOL
}
