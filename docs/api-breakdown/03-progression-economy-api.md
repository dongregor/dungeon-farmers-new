# Progression & Economy APIs

**Category:** Player, Zones, Quests, Achievements, Shop
**Total Endpoints:** ~35
**Priority:** Phase 1-3

---

## 1. Player API

Base path: `/api/player`

### US-PM-001 to US-PM-010: Player Profile & Resources

#### GET /api/player
Get current player profile and resources.

```typescript
// Response
{
  success: true,
  data: {
    id: "player123",
    displayName: "DragonSlayer42",
    email: "player@example.com",

    // Resources
    resources: {
      gold: 15420,
      gems: 250,  // Premium currency (supporters only)
      materials: {
        common_shard: 450,
        rare_crystal: 85,
        epic_essence: 12,
        legendary_fragment: 2
      }
    },

    // Capacity limits
    capacity: {
      heroes: { current: 45, max: 50 },
      inventory: { current: 127, max: 200 },
      monsters: { current: 32, max: 100 },
      dungeons: { current: 3, max: 5 }
    },

    // Account status
    supporter: {
      active: true,
      tier: "supporter",
      purchasedAt: 1704000000000,
      benefits: [
        "2x hero roster (100)",
        "2x inventory (400)",
        "5 expedition slots",
        "Exclusive cosmetics"
      ]
    },

    // Progress
    progress: {
      level: 25,
      experience: 12500,
      experienceToNext: 15000,
      furthestZone: "zone_dark_forest",
      totalExpeditions: 347,
      totalDungeonRuns: 89
    },

    // Statistics
    statistics: {
      heroesRecruited: 127,
      heroesRetired: 82,
      heroesPrestiged: 5,
      monstersCapured: 156,
      schematicsCollected: 25,
      dungeonsBuilt: 8,
      totalPlayTime: 864000000,  // 10 days in ms
      joinedAt: 1700000000000
    },

    // Settings
    settings: {
      notifications: true,
      autoSalvage: false,
      theme: "default"
    },

    lastLogin: 1704067200000,
    createdAt: 1700000000000
  }
}
```

**Related User Stories:** US-PM-001, US-PM-002
**Priority:** Phase 1

---

#### PATCH /api/player
Update player profile.

```typescript
// Request
PATCH /api/player
{
  "displayName": "MightySword",
  "settings": {
    "notifications": false
  }
}

// Response
{
  success: true,
  data: {
    updated: ["displayName", "settings.notifications"]
  }
}
```

**Related User Stories:** US-PM-003
**Priority:** Phase 1

---

#### GET /api/player/resources
Get detailed resource information.

```typescript
// Response
{
  success: true,
  data: {
    gold: {
      current: 15420,
      income: {
        perHour: 125,
        sources: {
          passiveAssignments: 75,
          dailyLogin: 50,
          other: 0
        }
      },
      recentTransactions: [
        { type: "expedition_reward", amount: 350, timestamp: 1704067000000 },
        { type: "hero_recruit", amount: -500, timestamp: 1704066000000 }
      ]
    },

    gems: {
      current: 250,
      source: "supporter_pack"
    },

    materials: {
      common_shard: {
        current: 450,
        uses: ["Common item upgrades"],
        sources: ["Salvaging common items"]
      },
      rare_crystal: {
        current: 85,
        uses: ["Rare item upgrades", "Tavern refresh"],
        sources: ["Salvaging rare items", "Expedition rewards"]
      }
    }
  }
}
```

**Related User Stories:** US-EQ-026, US-EQ-027
**Priority:** Phase 1

---

#### POST /api/player/spend
Spend resources (generic endpoint for purchases).

```typescript
// Request
POST /api/player/spend
{
  "type": "tavern_refresh",
  "cost": {
    "gold": 100
  }
}

// Response
{
  success: true,
  data: {
    spent: { gold: 100 },
    remaining: { gold: 15320 },
    transaction: {
      id: "txn123",
      type: "tavern_refresh",
      timestamp: 1704067200000
    }
  }
}
```

**Related User Stories:** US-PM-004
**Priority:** Phase 1

---

## 2. Quests API

Base path: `/api/quests`

### US-PM-011 to US-PM-020: Quest System

#### GET /api/quests
Get all active and available quests.

```typescript
// Response
{
  success: true,
  data: {
    daily: {
      quests: Quest[],
      resetAt: 1704153600000,  // Next reset timestamp
      completedToday: 3,
      totalToday: 5
    },

    weekly: {
      quests: Quest[],
      resetAt: 1704672000000,
      completedThisWeek: 2,
      totalThisWeek: 3
    },

    story: {
      current: Quest,
      chapter: 3,
      completed: 12,
      total: 50
    },

    achievement: {
      inProgress: Quest[],
      nearCompletion: Quest[]  // >75% progress
    }
  }
}

interface Quest {
  id: string
  type: 'daily' | 'weekly' | 'story' | 'achievement'
  name: string
  description: string

  progress: {
    current: number
    required: number
    percent: number
  }

  rewards: Reward[]

  completed: boolean
  claimed: boolean

  expiresAt?: number  // For daily/weekly
}
```

**Related User Stories:** US-PM-011, US-PM-012
**Priority:** Phase 2

---

#### GET /api/quests/:id
Get detailed quest information.

```typescript
// Response
{
  success: true,
  data: {
    id: "quest_daily_expeditions",
    type: "daily",
    name: "Daily Explorer",
    description: "Complete 3 expeditions today",

    objectives: [
      {
        id: "complete_expeditions",
        description: "Complete expeditions",
        progress: 2,
        required: 3
      }
    ],

    rewards: [
      { type: "gold", amount: 500 },
      { type: "experience", amount: 200 }
    ],

    completed: false,
    claimed: false,

    tips: [
      "Shorter zone expeditions count too!",
      "Story missions give bonus progress"
    ]
  }
}
```

**Related User Stories:** US-PM-013
**Priority:** Phase 2

---

#### POST /api/quests/:id/claim
Claim quest rewards.

```typescript
// Request
POST /api/quests/quest_daily_expeditions/claim

// Response
{
  success: true,
  data: {
    questId: "quest_daily_expeditions",
    claimed: true,
    rewards: {
      gold: 500,
      experience: 200
    },
    newTotals: {
      gold: 15920,
      playerExperience: 12700
    },

    // New quests unlocked
    unlockedQuests: []
  }
}

// Error
{
  success: false,
  error: {
    code: "QUEST_INCOMPLETE",
    message: "Quest is not complete (2/3 expeditions)",
    details: { progress: 2, required: 3 }
  }
}
```

**Related User Stories:** US-PM-014
**Priority:** Phase 2

---

## 3. Achievements API

Base path: `/api/achievements`

### US-PM-021 to US-PM-028: Achievement System

#### GET /api/achievements
Get all achievements and progress.

```typescript
// Request
GET /api/achievements?category=heroes&status=in_progress

// Query Parameters
interface AchievementParams {
  category?: 'heroes' | 'expeditions' | 'dungeons' | 'collection' | 'progression'
  status?: 'locked' | 'in_progress' | 'completed' | 'claimed'
}

// Response
{
  success: true,
  data: {
    achievements: Achievement[],
    summary: {
      total: 150,
      completed: 45,
      claimed: 42,
      points: 4200
    },
    categories: [
      { id: "heroes", name: "Heroes", completed: 12, total: 30 },
      { id: "expeditions", name: "Expeditions", completed: 15, total: 40 }
    ]
  }
}

interface Achievement {
  id: string
  category: string
  name: string
  description: string

  tiers?: AchievementTier[]  // For progressive achievements

  progress: {
    current: number
    required: number
    percent: number
  }

  rewards: Reward[]
  points: number

  status: 'locked' | 'in_progress' | 'completed' | 'claimed'
  completedAt?: number

  secret: boolean  // Hidden until conditions met
  hint?: string    // For secret achievements
}

interface AchievementTier {
  tier: number
  requirement: number
  rewards: Reward[]
  completed: boolean
  claimed: boolean
}
```

**Related User Stories:** US-PM-021, US-PM-022
**Priority:** Phase 2

---

#### GET /api/achievements/:id
Get detailed achievement information.

```typescript
// Response
{
  success: true,
  data: {
    id: "ach_hero_collector",
    category: "heroes",
    name: "Hero Collector",
    description: "Recruit heroes of increasing rarity",

    tiers: [
      {
        tier: 1,
        name: "Novice Recruiter",
        description: "Recruit 10 heroes",
        requirement: 10,
        progress: 10,
        rewards: [{ type: "gold", amount: 500 }],
        completed: true,
        claimed: true
      },
      {
        tier: 2,
        name: "Experienced Recruiter",
        description: "Recruit 50 heroes",
        requirement: 50,
        progress: 47,
        rewards: [{ type: "gold", amount: 2000 }],
        completed: false,
        claimed: false
      }
    ],

    totalProgress: {
      currentTier: 2,
      overallPercent: 47
    },

    relatedAchievements: ["ach_rare_collector", "ach_legendary_finder"]
  }
}
```

**Related User Stories:** US-PM-023
**Priority:** Phase 2

---

#### POST /api/achievements/:id/claim
Claim achievement rewards.

```typescript
// Request
POST /api/achievements/ach_hero_collector/claim
{
  "tier": 2  // Optional, for tiered achievements
}

// Response
{
  success: true,
  data: {
    achievementId: "ach_hero_collector",
    tier: 2,
    claimed: true,
    rewards: {
      gold: 2000
    },
    pointsEarned: 100,
    totalPoints: 4300
  }
}
```

**Related User Stories:** US-PM-024
**Priority:** Phase 2

---

## 4. Daily Login API

Base path: `/api/daily`

### US-PM-029 to US-PM-033: Daily Login Rewards

#### GET /api/daily
Get daily login status and rewards.

```typescript
// Response
{
  success: true,
  data: {
    today: {
      day: 15,
      claimed: false,
      rewards: [
        { type: "gold", amount: 500 },
        { type: "material", subtype: "rare_crystal", amount: 5 }
      ]
    },

    streak: {
      current: 15,
      best: 23,
      multiplier: 1.5  // Bonus for long streaks
    },

    calendar: [
      {
        day: 1,
        rewards: [{ type: "gold", amount: 100 }],
        claimed: true,
        milestone: false
      },
      {
        day: 7,
        rewards: [
          { type: "gold", amount: 1000 },
          { type: "hero_ticket", amount: 1 }
        ],
        claimed: true,
        milestone: true
      }
      // ... 28 or 30 days
    ],

    milestones: [
      { day: 7, bonus: "Rare Hero Ticket", claimed: true },
      { day: 14, bonus: "Epic Equipment Chest", claimed: true },
      { day: 28, bonus: "Legendary Schematic", claimed: false }
    ],

    resetAt: 1704153600000
  }
}
```

**Related User Stories:** US-PM-029, US-PM-030
**Priority:** Phase 2

---

#### POST /api/daily/claim
Claim daily login reward.

```typescript
// Request
POST /api/daily/claim

// Response
{
  success: true,
  data: {
    day: 15,
    claimed: true,
    rewards: {
      gold: 500,
      materials: [{ type: "rare_crystal", amount: 5 }]
    },
    streakBonus: {
      multiplier: 1.5,
      bonusGold: 250
    },

    newStreak: 16,
    nextMilestone: {
      day: 21,
      reward: "Premium Material Pack"
    }
  }
}

// Error (already claimed)
{
  success: false,
  error: {
    code: "ALREADY_CLAIMED",
    message: "Daily reward already claimed today",
    details: { nextClaimAt: 1704153600000 }
  }
}
```

**Related User Stories:** US-PM-031
**Priority:** Phase 2

---

## 5. Shop API

Base path: `/api/shop`

### US-PM-034 to US-PM-040: Shop & Monetization

#### GET /api/shop
Get shop inventory and offers.

```typescript
// Response
{
  success: true,
  data: {
    // One-time purchases
    supporterPack: {
      id: "supporter_pack",
      name: "Supporter Pack",
      description: "Support the developer and unlock permanent benefits!",
      price: {
        amount: 1999,  // cents
        currency: "USD"
      },
      benefits: [
        "2x Hero Roster (100 heroes)",
        "2x Inventory Space (400 items)",
        "5 Expedition Slots (up from 3)",
        "2x Monster Storage (200)",
        "Exclusive Cosmetics Pack",
        "Supporter Badge",
        "Priority Support"
      ],
      purchased: false
    },

    // Cosmetics (gems or real money)
    cosmetics: {
      themes: [
        {
          id: "theme_dark",
          name: "Dark Mode",
          price: { gems: 100 },
          owned: false
        }
      ],
      portraits: [
        {
          id: "portrait_dragon",
          name: "Dragon Frame",
          price: { gems: 50 },
          owned: true
        }
      ],
      effects: [...]
    },

    // Time-limited offers
    featured: [
      {
        id: "starter_bundle",
        name: "Starter Bundle",
        description: "Great value for new players!",
        price: { amount: 499, currency: "USD" },
        contents: [...],
        expiresAt: 1704672000000,
        purchased: false,
        discount: 50  // Percent off
      }
    ],

    // Resource purchases (supporters only, or limited)
    resources: {
      available: true,  // Supporters can buy resources with gems
      options: [
        {
          id: "gold_pack_small",
          name: "Gold Pouch",
          gives: { gold: 5000 },
          price: { gems: 50 }
        }
      ]
    }
  }
}
```

**Related User Stories:** US-PM-034, US-PM-035
**Priority:** Phase 2

---

#### GET /api/shop/:itemId
Get detailed shop item information.

```typescript
// Response
{
  success: true,
  data: {
    id: "supporter_pack",
    name: "Supporter Pack",
    description: "Support independent game development...",

    price: {
      amount: 1999,
      currency: "USD",
      formatted: "$19.99"
    },

    benefits: [
      {
        id: "roster_2x",
        name: "Double Hero Roster",
        description: "Increase max heroes from 50 to 100",
        icon: "users"
      }
    ],

    faq: [
      {
        question: "Is this a subscription?",
        answer: "No! This is a one-time purchase with permanent benefits."
      }
    ],

    purchased: false,
    purchaseCount: 15000  // Community stat
  }
}
```

**Related User Stories:** US-PM-036
**Priority:** Phase 2

---

#### POST /api/shop/purchase
Initiate a purchase.

```typescript
// Request
POST /api/shop/purchase
{
  "itemId": "supporter_pack",
  "paymentMethod": "stripe"
}

// Response (creates checkout session)
{
  success: true,
  data: {
    checkoutUrl: "https://checkout.stripe.com/...",
    sessionId: "cs_xxx",
    expiresAt: 1704070800000
  }
}

// For gem purchases
POST /api/shop/purchase
{
  "itemId": "gold_pack_small",
  "currency": "gems"
}

// Response (immediate)
{
  success: true,
  data: {
    purchased: true,
    itemId: "gold_pack_small",
    spent: { gems: 50 },
    received: { gold: 5000 },
    newTotals: {
      gems: 200,
      gold: 20420
    }
  }
}
```

**Related User Stories:** US-PM-037
**Priority:** Phase 2

---

#### POST /api/shop/webhook
Stripe webhook for payment confirmation (internal).

```typescript
// Stripe sends payment confirmation
// Server updates player supporter status
// Triggers SSE event to client
```

**Related User Stories:** US-PM-038
**Priority:** Phase 2

---

## 6. Cosmetics API

Base path: `/api/cosmetics`

### US-PM-039 to US-PM-040: Cosmetics System

#### GET /api/cosmetics
Get owned and available cosmetics.

```typescript
// Response
{
  success: true,
  data: {
    owned: {
      themes: ["theme_default", "theme_dark"],
      portraits: ["portrait_default", "portrait_dragon"],
      effects: ["effect_sparkle"]
    },

    equipped: {
      theme: "theme_dark",
      portrait: "portrait_dragon",
      effect: null
    },

    available: {
      themes: CosmeticItem[],
      portraits: CosmeticItem[],
      effects: CosmeticItem[]
    }
  }
}

interface CosmeticItem {
  id: string
  name: string
  description: string
  preview: string  // Image URL
  category: 'theme' | 'portrait' | 'effect'
  rarity: Rarity

  owned: boolean
  equipped: boolean

  acquisition: {
    type: 'shop' | 'achievement' | 'supporter' | 'event'
    price?: { gems?: number, gold?: number }
    requirement?: string
  }
}
```

**Related User Stories:** US-PM-039
**Priority:** Phase 3

---

#### POST /api/cosmetics/equip
Equip a cosmetic item.

```typescript
// Request
POST /api/cosmetics/equip
{
  "category": "theme",
  "itemId": "theme_dark"
}

// Response
{
  success: true,
  data: {
    category: "theme",
    equipped: "theme_dark",
    previous: "theme_default"
  }
}
```

**Related User Stories:** US-PM-040
**Priority:** Phase 3

---

## 7. Statistics API

Base path: `/api/stats`

### Player Statistics and Analytics

#### GET /api/stats
Get player statistics.

```typescript
// Response
{
  success: true,
  data: {
    overview: {
      playTime: 864000000,
      level: 25,
      totalPower: 45000,
      efficiency: 125
    },

    heroes: {
      recruited: 127,
      retired: 82,
      prestiged: 5,
      maxLevel: 3,
      legendaryCount: 2,
      averagePower: 890
    },

    expeditions: {
      completed: 347,
      cancelled: 12,
      totalDuration: 432000000,
      bestEfficiency: 185,
      averageEfficiency: 112,
      favoriteZone: "Whispering Woods"
    },

    dungeons: {
      built: 8,
      demolished: 5,
      runsCompleted: 89,
      monstersCaputed: 156,
      schematicsCollected: 25
    },

    economy: {
      goldEarned: 1500000,
      goldSpent: 1484580,
      itemsLooted: 2500,
      itemsSold: 2100,
      itemsSalvaged: 200
    },

    records: {
      longestStreak: 23,
      highestHeroPower: 2500,
      mostValuableDrop: ItemSummary,
      fastestExpedition: 1800000
    }
  }
}
```

**Related User Stories:** US-PM-002
**Priority:** Phase 3

---

#### GET /api/stats/history
Get historical statistics.

```typescript
// Request
GET /api/stats/history?metric=gold_earned&period=week

// Response
{
  success: true,
  data: {
    metric: "gold_earned",
    period: "week",
    dataPoints: [
      { date: "2024-12-23", value: 15000 },
      { date: "2024-12-24", value: 18500 },
      // ...
    ],
    summary: {
      total: 125000,
      average: 17857,
      best: 22000,
      trend: "up"
    }
  }
}
```

**Related User Stories:** US-PM-002
**Priority:** Phase 3

---

## Summary

### Endpoint Count by Category
- **Player:** 4 endpoints
- **Quests:** 3 endpoints
- **Achievements:** 3 endpoints
- **Daily Login:** 2 endpoints
- **Shop:** 4 endpoints
- **Cosmetics:** 2 endpoints
- **Statistics:** 2 endpoints

**Total:** 20 endpoints

### Implementation Priority

**Phase 1 (MVP):**
- Player: profile, update, resources, spend
- Basic statistics

**Phase 2:**
- All Quests endpoints
- All Achievements endpoints
- All Daily Login endpoints
- Shop: list, detail, purchase, webhook
- Extended statistics

**Phase 3+:**
- All Cosmetics endpoints
- Statistics: history, analytics
- Advanced shop features
- Leaderboards integration
