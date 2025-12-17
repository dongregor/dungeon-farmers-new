import type { Title } from '~~/types'

// All available titles
export const TITLES: Record<string, Title> = {
  // === ZONE MASTERY TITLES ===
  woodwalker: {
    id: 'woodwalker',
    name: 'the Woodwalker',
    rarity: 'uncommon',
    source: 'zone_mastery',
    condition: {
      type: 'zone_completion',
      target: 'verdant_woods'
    },
    bonus: {
      stat: 'utility',
      value: 2,
      context: 'in forest zones',
      description: '+2 Utility in forest zones'
    }
  },
  cave_delver: {
    id: 'cave_delver',
    name: 'the Cave Delver',
    rarity: 'uncommon',
    source: 'zone_mastery',
    condition: {
      type: 'zone_completion',
      target: 'goblin_caves'
    },
    bonus: {
      stat: 'survival',
      value: 2,
      context: 'in cave zones',
      description: '+2 Survival in cave zones'
    }
  },
  swamp_walker: {
    id: 'swamp_walker',
    name: 'the Swamp Walker',
    rarity: 'rare',
    source: 'zone_mastery',
    condition: {
      type: 'zone_completion',
      target: 'misty_swamp'
    },
    bonus: {
      stat: 'survival',
      value: 3,
      context: 'in swamp zones',
      description: '+3 Survival in swamp zones'
    }
  },

  // === MONSTER SLAYER TITLES ===
  goblin_slayer: {
    id: 'goblin_slayer',
    name: 'the Goblin Slayer',
    rarity: 'uncommon',
    source: 'achievement',
    condition: {
      type: 'monster_kills',
      target: 'goblin',
      count: 100
    },
    bonus: {
      stat: 'combat',
      value: 3,
      context: 'against goblins',
      description: '+3 Combat against goblins'
    }
  },
  beast_hunter: {
    id: 'beast_hunter',
    name: 'the Beast Hunter',
    rarity: 'uncommon',
    source: 'achievement',
    condition: {
      type: 'monster_kills',
      target: 'beast',
      count: 100
    },
    bonus: {
      stat: 'combat',
      value: 3,
      context: 'against beasts',
      description: '+3 Combat against beasts'
    }
  },

  // === DIFFICULTY TITLES ===
  hardcore_hero: {
    id: 'hardcore_hero',
    name: 'the Hardcore Hero',
    rarity: 'epic',
    source: 'difficulty',
    condition: {
      type: 'difficulty_clear',
      target: 'extreme',
      count: 10
    },
    bonus: {
      value: 5,
      description: '+5 to all stats'
    }
  },

  // === PRESTIGE TITLES ===
  veteran: {
    id: 'veteran',
    name: 'the Veteran',
    rarity: 'rare',
    source: 'prestige',
    condition: {
      type: 'prestige',
      count: 1
    },
    bonus: {
      value: 2,
      description: '+2 to all stats'
    }
  },
  master: {
    id: 'master',
    name: 'the Master',
    rarity: 'epic',
    source: 'prestige',
    condition: {
      type: 'prestige',
      count: 5
    },
    bonus: {
      value: 5,
      description: '+5 to all stats'
    }
  },
  legend: {
    id: 'legend',
    name: 'the Legend',
    rarity: 'legendary',
    source: 'prestige',
    condition: {
      type: 'prestige',
      count: 10
    },
    bonus: {
      value: 10,
      description: '+10 to all stats'
    }
  },

  // === STORY TRAIT TITLES ===
  cursed: {
    id: 'cursed',
    name: 'the Cursed',
    rarity: 'rare',
    source: 'story_trait',
    condition: {
      type: 'story_trait',
      target: 'cursed_by_witch'
    },
    bonus: {
      stat: 'utility',
      value: 5,
      context: 'dark magic resistance',
      description: '+5 Utility (dark magic resistance)'
    }
  },
  blessed: {
    id: 'blessed',
    name: 'the Blessed',
    rarity: 'rare',
    source: 'story_trait',
    condition: {
      type: 'story_trait',
      target: 'blessed_by_priest'
    },
    bonus: {
      stat: 'survival',
      value: 5,
      context: 'divine protection',
      description: '+5 Survival (divine protection)'
    }
  },

  // === SECRET TITLES ===
  dragonslayer: {
    id: 'dragonslayer',
    name: 'the Dragonslayer',
    rarity: 'legendary',
    source: 'secret',
    condition: {
      type: 'secret',
      target: 'defeat_dragon'
    },
    bonus: {
      value: 15,
      description: '+15 to all stats'
    }
  },
  immortal: {
    id: 'immortal',
    name: 'the Immortal',
    rarity: 'legendary',
    source: 'secret',
    condition: {
      type: 'secret',
      target: 'complete_100_expeditions_without_injury'
    },
    bonus: {
      stat: 'survival',
      value: 20,
      description: '+20 Survival'
    }
  }
}

// Get title by ID
export function getTitleById(id: string): Title | undefined {
  return TITLES[id]
}

// Get all titles for a source type
export function getTitlesBySource(source: Title['source']): Title[] {
  return Object.values(TITLES).filter(t => t.source === source)
}

// Get all titles for a rarity
export function getTitlesByRarity(rarity: Title['rarity']): Title[] {
  return Object.values(TITLES).filter(t => t.rarity === rarity)
}

// Check if a hero meets the condition for a title
export function checkTitleCondition(
  title: Title,
  heroData: {
    completedZones?: string[]
    monsterKills?: Record<string, number>
    difficultyClearCount?: Record<string, number>
    prestigeLevel?: number
    storyTraitIds?: string[]
    secretAchievements?: string[]
  }
): boolean {
  switch (title.condition.type) {
    case 'zone_completion':
      return heroData.completedZones?.includes(title.condition.target!) ?? false

    case 'monster_kills':
      const kills = heroData.monsterKills?.[title.condition.target!] ?? 0
      return kills >= (title.condition.count ?? 0)

    case 'difficulty_clear':
      const clears = heroData.difficultyClearCount?.[title.condition.target!] ?? 0
      return clears >= (title.condition.count ?? 0)

    case 'prestige':
      return (heroData.prestigeLevel ?? 0) >= (title.condition.count ?? 0)

    case 'story_trait':
      return heroData.storyTraitIds?.includes(title.condition.target!) ?? false

    case 'secret':
      return heroData.secretAchievements?.includes(title.condition.target!) ?? false

    default:
      return false
  }
}
