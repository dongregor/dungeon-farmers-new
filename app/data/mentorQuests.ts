/**
 * Mentor Quest System
 *
 * Philosophy: Hybrid Approach
 * - Quick mandatory intro gets players into the loop fast
 * - Optional mentor quests guide deeper learning
 * - Always visible checklist with unlock conditions
 * - Self-directed learning
 */

export type MentorQuestTier = 'early' | 'mid' | 'late' | 'final'

export interface MentorQuestRequirement {
  type: 'expedition_complete' | 'visit_tavern' | 'recruit_hero' | 'send_party' | 'equip_item' | 'recruit_count' | 'expedition_count' | 'read_profile' | 'match_tag' | 'unlock_zones' | 'discover_subzone' | 'own_equipment' | 'equip_full_set' | 'hero_tired' | 'hero_recover' | 'hero_level' | 'view_prestige' | 'own_heroes' | 'save_preset' | 'retire_hero'
  count?: number
  metadata?: Record<string, any>
}

export interface MentorQuestUnlock {
  type: 'immediate' | 'quest_complete' | 'stat_threshold'
  requiredQuestIds?: string[]
  threshold?: {
    stat: string
    value: number
  }
}

export interface MentorQuestReward {
  gold?: number
  equipment?: {
    type: string
    quality: string
  }
  materials?: Array<{ id: string; count: number }>
  unlock?: {
    type: 'free_recruit' | 'free_refresh' | 'title'
    value?: string
  }
  description: string
}

export interface MentorQuest {
  id: string
  title: string
  description: string
  tier: MentorQuestTier
  unlock: MentorQuestUnlock
  requirement: MentorQuestRequirement
  reward: MentorQuestReward
  icon: string
  order: number
}

// ===== EARLY QUESTS (unlock: immediate) =====

export const EARLY_MENTOR_QUESTS: MentorQuest[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete the tutorial expedition',
    tier: 'early',
    unlock: {
      type: 'immediate',
    },
    requirement: {
      type: 'expedition_complete',
      count: 1,
      metadata: { isTutorial: true },
    },
    reward: {
      gold: 100,
      description: '100 gold',
    },
    icon: '🎯',
    order: 1,
  },
  {
    id: 'open_for_business',
    title: 'Open for Business',
    description: 'Visit the tavern',
    tier: 'early',
    unlock: {
      type: 'immediate',
    },
    requirement: {
      type: 'visit_tavern',
      count: 1,
    },
    reward: {
      gold: 50,
      description: '50 gold',
    },
    icon: '🍺',
    order: 2,
  },
  {
    id: 'new_blood',
    title: 'New Blood',
    description: 'Recruit your first hero from the tavern',
    tier: 'early',
    unlock: {
      type: 'immediate',
    },
    requirement: {
      type: 'recruit_hero',
      count: 1,
    },
    reward: {
      gold: 150,
      equipment: {
        type: 'weapon',
        quality: 'normal',
      },
      description: '150 gold + basic weapon',
    },
    icon: '👤',
    order: 3,
  },
  {
    id: 'stronger_together',
    title: 'Stronger Together',
    description: 'Send a party with 2 or more heroes on an expedition',
    tier: 'early',
    unlock: {
      type: 'immediate',
    },
    requirement: {
      type: 'send_party',
      count: 2,
    },
    reward: {
      gold: 200,
      description: '200 gold',
    },
    icon: '👥',
    order: 4,
  },
  {
    id: 'spoils_of_war',
    title: 'Spoils of War',
    description: 'Equip an item on any hero',
    tier: 'early',
    unlock: {
      type: 'immediate',
    },
    requirement: {
      type: 'equip_item',
      count: 1,
    },
    reward: {
      equipment: {
        type: 'armor',
        quality: 'normal',
      },
      description: 'Basic armor piece',
    },
    icon: '⚔️',
    order: 5,
  },
]

// ===== MID QUESTS (unlock: various conditions) =====

export const MID_MENTOR_QUESTS: MentorQuest[] = [
  {
    id: 'know_your_team',
    title: 'Know Your Team',
    description: 'Recruit 3 heroes, then read a hero\'s full profile',
    tier: 'mid',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'heroes_recruited',
        value: 3,
      },
    },
    requirement: {
      type: 'read_profile',
      count: 1,
    },
    reward: {
      gold: 250,
      description: '250 gold',
    },
    icon: '📋',
    order: 6,
  },
  {
    id: 'counter_play',
    title: 'Counter Play',
    description: 'Complete 5 expeditions, then match a hero tag to an expedition threat',
    tier: 'mid',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'expeditions_completed',
        value: 5,
      },
    },
    requirement: {
      type: 'match_tag',
      count: 1,
    },
    reward: {
      unlock: {
        type: 'free_refresh',
      },
      description: 'Free tavern refresh (one-time)',
    },
    icon: '🎲',
    order: 7,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Unlock 2 zones, then discover a subzone',
    tier: 'mid',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'zones_unlocked',
        value: 2,
      },
    },
    requirement: {
      type: 'discover_subzone',
      count: 1,
    },
    reward: {
      gold: 300,
      materials: [
        { id: 'wood', count: 10 },
        { id: 'stone', count: 10 },
      ],
      description: '300 gold + materials',
    },
    icon: '🗺️',
    order: 8,
  },
  {
    id: 'dressed_for_success',
    title: 'Dressed for Success',
    description: 'Own 5 equipment pieces, then equip a full set on one hero',
    tier: 'mid',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'equipment_owned',
        value: 5,
      },
    },
    requirement: {
      type: 'equip_full_set',
      count: 1,
    },
    reward: {
      unlock: {
        type: 'free_recruit',
      },
      description: 'Free recruitment (one-time)',
    },
    icon: '🎭',
    order: 9,
  },
  {
    id: 'rest_and_recovery',
    title: 'Rest & Recovery',
    description: 'Have a hero become tired, then let them recover to Content',
    tier: 'mid',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'expeditions_completed',
        value: 3,
      },
    },
    requirement: {
      type: 'hero_recover',
      count: 1,
    },
    reward: {
      gold: 200,
      description: '200 gold',
    },
    icon: '😴',
    order: 10,
  },
]

// ===== LATE QUESTS (unlock: progression milestones) =====

export const LATE_MENTOR_QUESTS: MentorQuest[] = [
  {
    id: 'veteran',
    title: 'Veteran',
    description: 'Any hero reaches level 10, then view the prestige screen',
    tier: 'late',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'max_hero_level',
        value: 10,
      },
    },
    requirement: {
      type: 'view_prestige',
      count: 1,
    },
    reward: {
      gold: 500,
      description: '500 gold',
    },
    icon: '👑',
    order: 11,
  },
  {
    id: 'team_builder',
    title: 'Team Builder',
    description: 'Own 5+ heroes, then save a party preset',
    tier: 'late',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'heroes_owned',
        value: 5,
      },
    },
    requirement: {
      type: 'save_preset',
      count: 1,
    },
    reward: {
      unlock: {
        type: 'free_refresh',
      },
      description: 'Free tavern refresh (one-time)',
    },
    icon: '📝',
    order: 12,
  },
  {
    id: 'moving_on',
    title: 'Moving On',
    description: 'Own 6+ heroes, then retire a hero',
    tier: 'late',
    unlock: {
      type: 'stat_threshold',
      threshold: {
        stat: 'heroes_owned',
        value: 6,
      },
    },
    requirement: {
      type: 'retire_hero',
      count: 1,
    },
    reward: {
      gold: 300,
      description: '300 gold + hero\'s gold value',
    },
    icon: '👋',
    order: 13,
  },
]

// ===== FINAL QUEST =====

export const FINAL_MENTOR_QUEST: MentorQuest = {
  id: 'completionist',
  title: 'Completionist',
  description: 'Complete all mentor quests above',
  tier: 'final',
  unlock: {
    type: 'quest_complete',
    requiredQuestIds: [
      'first_steps',
      'open_for_business',
      'new_blood',
      'stronger_together',
      'spoils_of_war',
      'know_your_team',
      'counter_play',
      'explorer',
      'dressed_for_success',
      'rest_and_recovery',
      'veteran',
      'team_builder',
      'moving_on',
    ],
  },
  requirement: {
    type: 'expedition_complete',
    count: 0, // Automatically completed when all quests done
  },
  reward: {
    unlock: {
      type: 'title',
      value: 'The Prepared',
    },
    description: 'Exclusive title: "The Prepared"',
  },
  icon: '🏆',
  order: 14,
}

/**
 * Get all mentor quests
 */
export function getAllMentorQuests(): MentorQuest[] {
  return [
    ...EARLY_MENTOR_QUESTS,
    ...MID_MENTOR_QUESTS,
    ...LATE_MENTOR_QUESTS,
    FINAL_MENTOR_QUEST,
  ].sort((a, b) => a.order - b.order)
}

/**
 * Get mentor quests by tier
 */
export function getMentorQuestsByTier(tier: MentorQuestTier): MentorQuest[] {
  return getAllMentorQuests().filter(q => q.tier === tier)
}

/**
 * Get mentor quest by ID
 */
export function getMentorQuestById(id: string): MentorQuest | undefined {
  return getAllMentorQuests().find(q => q.id === id)
}

/**
 * Check if a quest is unlocked based on player stats
 */
export function isQuestUnlocked(
  quest: MentorQuest,
  playerStats: Record<string, number>,
  completedQuestIds: string[]
): boolean {
  switch (quest.unlock.type) {
    case 'immediate':
      return true

    case 'quest_complete':
      if (!quest.unlock.requiredQuestIds) return true
      return quest.unlock.requiredQuestIds.every(id => completedQuestIds.includes(id))

    case 'stat_threshold': {
      if (!quest.unlock.threshold) return true
      const stat = playerStats[quest.unlock.threshold.stat] || 0
      return stat >= quest.unlock.threshold.value
    }

    default:
      return false
  }
}

/**
 * Get unlocked quests
 */
export function getUnlockedQuests(
  playerStats: Record<string, number>,
  completedQuestIds: string[]
): MentorQuest[] {
  return getAllMentorQuests().filter(quest =>
    isQuestUnlocked(quest, playerStats, completedQuestIds)
  )
}

/**
 * Get locked quests with their unlock conditions
 */
export function getLockedQuests(
  playerStats: Record<string, number>,
  completedQuestIds: string[]
): MentorQuest[] {
  return getAllMentorQuests().filter(quest =>
    !isQuestUnlocked(quest, playerStats, completedQuestIds)
  )
}

/**
 * Get unlock condition text for display
 */
export function getUnlockConditionText(quest: MentorQuest, playerStats: Record<string, number>): string {
  switch (quest.unlock.type) {
    case 'immediate':
      return 'Available now'

    case 'quest_complete':
      return 'Complete previous quests'

    case 'stat_threshold': {
      if (!quest.unlock.threshold) return 'Unknown requirement'
      const stat = playerStats[quest.unlock.threshold.stat] || 0
      const target = quest.unlock.threshold.value
      const statName = quest.unlock.threshold.stat.replace(/_/g, ' ')
      return `Requires: ${statName} ${stat}/${target}`
    }

    default:
      return 'Unknown requirement'
  }
}
