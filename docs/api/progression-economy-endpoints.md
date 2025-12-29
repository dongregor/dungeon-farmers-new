# API Endpoints: Progression & Economy

**Date:** 2025-12-29
**Based on:** User Stories (US-PM-XXX, US-OB-XXX)
**Tech Stack:** Nuxt 4 Server Routes + Supabase + Stripe

---

## Table of Contents

1. [Player/Account API](#1-playeraccount-api)
2. [Zones API](#2-zones-api)
3. [Quests API](#3-quests-api)
4. [Achievements API](#4-achievements-api)
5. [Login Rewards API](#5-login-rewards-api)
6. [Shop/Payments API](#6-shoppayments-api)
7. [Cosmetics API](#7-cosmetics-api)
8. [Currency API](#8-currency-api)
9. [Onboarding API](#9-onboarding-api)
10. [Tutorial Progress API](#10-tutorial-progress-api)

---

## 1. Player/Account API

### GET `/api/player/profile`
**Purpose:** Get player profile data including account level, XP, guild name, supporter status

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
// No body
```

**Response:**
```typescript
{
  id: string                    // UUID
  username: string              // Display name
  guildName: string             // Guild name (US-OB-009)
  email: string                 // Email (masked)
  accountLevel: number          // US-PM-037
  accountXp: number
  accountXpToNextLevel: number
  isSupporter: boolean          // US-PM-017
  supporterSince: Date | null
  createdAt: Date
  lastLogin: Date
  playTime: number              // Seconds

  // Supporter features
  dailyRecruitmentCount: number // US-PM-005, US-PM-006
  dailyRecruitmentCap: number   // 5 for free, -1 for unlimited
  dailyRecruitmentResetAt: Date

  // Slot counts
  heroSlots: number             // US-PM-013, US-PM-032 (50 free, 100 supporter)
  heroSlotsUsed: number
  dungeonSlots: number          // (5 free, 10 supporter)
  dungeonSlotsUsed: number

  // Stats
  stats: {
    totalExpeditions: number
    totalHeroesRecruited: number
    totalMonstersCapture: number
    totalGoldEarned: number
    totalGemsEarned: number
    prestigeCount: number       // US-PM-038
  }
}
```

**Related Stories:** US-PM-020, US-PM-023, US-PM-037, US-OB-009

**Priority:** Phase 1 (MVP)

**Notes:**
- Authentication via Supabase Auth middleware
- Cache profile data with short TTL (5 min)
- Include supporter badge metadata

---

### PATCH `/api/player/profile`
**Purpose:** Update player profile (username, guild name)

**Request:**
```typescript
{
  username?: string         // 3-20 chars, alphanumeric (US-PM-020)
  guildName?: string        // 3-24 chars (US-OB-009)
  avatar?: string           // Avatar ID from available options
  badge?: string            // Badge ID (if unlocked)
}
```

**Response:**
```typescript
{
  success: true
  profile: PlayerProfile    // Updated profile object
  cooldowns: {
    usernameChangeAvailableAt: Date | null  // Once/month limit
  }
}
```

**Related Stories:** US-PM-020, US-OB-009

**Priority:** Phase 1

**Notes:**
- Validate username uniqueness (check Supabase)
- Apply cooldown for username changes (30 days)
- Profanity filter for guild name
- Transaction log for audit trail

---

### GET `/api/player/preferences`
**Purpose:** Get player preferences and settings

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  notifications: {
    expeditionComplete: boolean
    dailyRewards: boolean
    achievements: boolean
    newFeatures: boolean
  }
  sound: {
    masterVolume: number      // 0-100
    music: number             // 0-100
    sfx: number               // 0-100
    muted: boolean
  }
  accessibility: {
    textSize: "small" | "medium" | "large"
    colorBlindMode: boolean
    reducedAnimations: boolean
  }
  ui: {
    theme: string             // US-PM-027 (default, dark, supporter themes)
    tooltipsEnabled: boolean
    hintsEnabled: boolean     // US-OB-022
  }
  privacy: {
    shareStats: boolean       // Future leaderboards
  }
}
```

**Related Stories:** US-PM-021, US-PM-027

**Priority:** Phase 2

**Notes:**
- Sync to Supabase (cross-device)
- LocalStorage fallback for guests
- Apply preferences client-side

---

### PATCH `/api/player/preferences`
**Purpose:** Update player preferences

**Request:**
```typescript
{
  // Any subset of preferences object
  notifications?: { ... }
  sound?: { ... }
  // etc.
}
```

**Response:**
```typescript
{
  success: true
  preferences: PlayerPreferences
}
```

**Related Stories:** US-PM-021

**Priority:** Phase 2

---

### GET `/api/player/data-export`
**Purpose:** Export all player data (GDPR compliance)

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  exportedAt: Date
  player: { /* Full profile */ }
  heroes: Hero[]
  inventory: Item[]
  expeditions: Expedition[]
  monsters: Monster[]
  dungeons: Dungeon[]
  transactions: Transaction[]
  achievements: Achievement[]
  // ... all player data
}
```

**Related Stories:** US-PM-022

**Priority:** Phase 2

**Notes:**
- Generate JSON export
- Include all relational data
- Rate limit: 1 export per day
- Log export for compliance

---

### DELETE `/api/player/account`
**Purpose:** Delete player account (GDPR right to deletion)

**Request:**
```typescript
{
  confirmation: string      // Must be "DELETE MY ACCOUNT"
  password: string          // Re-authentication required
}
```

**Response:**
```typescript
{
  success: true
  deletionScheduledFor: Date  // 7-day grace period
  message: "Your account will be permanently deleted in 7 days. Contact support to cancel."
}
```

**Related Stories:** US-PM-022

**Priority:** Phase 2

**Notes:**
- 7-day grace period before permanent deletion
- Soft delete initially, hard delete after grace period
- Send confirmation email
- Refund logic for supporters (if applicable)
- Anonymize instead of delete if regulatory requirement

---

### GET `/api/player/stats`
**Purpose:** Get detailed player statistics

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  accountLevel: number
  accountXp: number
  playTime: number              // Seconds

  heroes: {
    total: number
    byRarity: Record<Rarity, number>
    prestiged: number
    maxLevel: number
  }

  expeditions: {
    total: number
    byType: { zones: number, story: number, dungeons: number }
    totalTimeSpent: number      // Seconds
    avgEfficiency: number       // 0-150%
  }

  combat: {
    totalPower: number          // Highest team power
    totalGearScore: number      // Sum of all heroes
  }

  collection: {
    monstersUnique: number
    monstersCaptured: number
    schematicsUnlocked: number
    dungeonsBuilt: number
  }

  economy: {
    goldTotal: number
    goldEarned: number
    goldSpent: number
    gemsTotal: number
    gemsEarned: number
    gemsSpent: number
  }

  progression: {
    zonesUnlocked: number
    zonesTotal: number
    storyProgress: number       // Chapter number
    achievementsCompleted: number
    achievementsTotal: number
  }
}
```

**Related Stories:** US-PM-037, US-PM-024

**Priority:** Phase 2

---

## 2. Zones API

### GET `/api/zones`
**Purpose:** List all zones with unlock status and requirements

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  zones: [
    {
      id: string
      name: string
      description: string
      level: number             // Progression order

      // Unlock requirements (US-PM-001)
      unlocked: boolean
      requirements: {
        teamPower?: number
        storyMissionId?: string
        accountLevel?: number
      }

      // Progress towards unlock
      progress: {
        currentTeamPower: number
        requiredTeamPower: number
        percentage: number      // 0-100
        status: "locked" | "close" | "unlocked"  // red/yellow/green
      }

      // Zone data
      familiarity: number       // 0-100% (US-PM-002)
      recommendedPower: number
      expeditionDurations: {
        short: number           // Minutes
        medium: number
        long: number
      }

      // Rewards info
      primaryResources: string[]
      monsterTypes: string[]

      // UI
      isNew: boolean            // First visit tracking (US-PM-002)
      imagePath: string
    }
  ]
}
```

**Related Stories:** US-PM-001, US-PM-002, US-PM-004

**Priority:** Phase 1

**Notes:**
- Calculate current team power server-side
- Track "isNew" flag per player
- Include passive assignment data if hero stationed

---

### GET `/api/zones/:id`
**Purpose:** Get detailed zone information

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
// Params: :id (zone UUID)
```

**Response:**
```typescript
{
  id: string
  name: string
  description: string
  lore: string                // Flavor text

  unlocked: boolean
  requirements: { /* ... */ }
  familiarity: number
  familiarityLevel: number    // 0-5

  // Expedition options
  expeditionTypes: [
    {
      duration: number        // Minutes
      recommendedPower: number
      rewardMultiplier: number
    }
  ]

  // Monster capture rates
  monsters: [
    {
      id: string
      name: string
      captureRate: number     // Base %
      familiarityBonus: number
    }
  ]

  // Passive assignment info
  passiveIncome: {
    goldPerHour: number
    xpPerHour: number
    materials: Array<{ type: string, amountPerHour: number }>
  }

  // Currently assigned heroes (if any)
  assignedHeroes: Hero[] | []
}
```

**Related Stories:** US-PM-001, US-PM-002

**Priority:** Phase 1

---

### PATCH `/api/zones/:id/familiarity`
**Purpose:** Update zone familiarity (incremented after expeditions)

**Request:**
```typescript
{
  familiarityGained: number   // From expedition completion
}
```

**Response:**
```typescript
{
  success: true
  zone: {
    id: string
    familiarity: number       // Updated value
    familiarityLevel: number
    leveledUp: boolean        // True if crossed threshold
  }
}
```

**Related Stories:** US-PM-002

**Priority:** Phase 2

**Notes:**
- Called automatically after expedition completion
- Familiarity increases capture rates, passive income
- Level up triggers notification

---

## 3. Quests API

### GET `/api/quests/daily`
**Purpose:** Get daily quests with progress

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  resetAt: Date               // When quests reset (server time)
  quests: [
    {
      id: string
      type: "daily"
      title: string           // "Complete 3 Expeditions"
      description: string

      objective: {
        type: "expedition_complete" | "hero_recruit" | "gold_earn" | "level_up"
        target: number        // Required count
        current: number       // Current progress
      }

      rewards: {
        gold?: number
        xp?: number
        gems?: number         // US-PM-009
      }

      status: "active" | "completed" | "claimed"
      completedAt?: Date
      claimedAt?: Date

      // UI
      progress: number        // 0-100%
      canClaim: boolean
    }
  ]
}
```

**Related Stories:** US-PM-008, US-PM-009

**Priority:** Phase 1

**Notes:**
- Auto-generate 3-5 daily quests at server midnight
- Track progress in real-time
- Free players earn 10-25 gems/day from dailies

---

### GET `/api/quests/weekly`
**Purpose:** Get weekly quests with progress

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  resetAt: Date               // When quests reset (weekly)
  quests: [
    {
      id: string
      type: "weekly"
      title: string           // "Recruit 10 Heroes"
      description: string

      objective: {
        type: string
        target: number
        current: number
      }

      rewards: {
        gold?: number
        gems?: number         // US-PM-009 (50-100 gems)
        traitTokens?: number
      }

      status: "active" | "completed" | "claimed"
      completedAt?: Date
      claimedAt?: Date

      progress: number
      canClaim: boolean
    }
  ]
}
```

**Related Stories:** US-PM-008, US-PM-009

**Priority:** Phase 1

**Notes:**
- Generate 3-5 weekly quests
- Harder objectives than dailies
- Better rewards (50-100 gems)

---

### POST `/api/quests/:id/claim`
**Purpose:** Claim quest reward

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
// Params: :id (quest UUID)
// Body: empty
```

**Response:**
```typescript
{
  success: true
  quest: {
    id: string
    status: "claimed"
    claimedAt: Date
  }
  rewards: {
    gold?: number
    xp?: number
    gems?: number
    traitTokens?: number
  }
  // Updated currency balances
  player: {
    gold: number
    gems: number
    accountXp: number
  }
}
```

**Related Stories:** US-PM-008

**Priority:** Phase 1

**Notes:**
- Validate quest is completed and not already claimed
- Transaction for currency updates
- Can auto-claim on completion (optional)

---

### GET `/api/quests/progress/:objectiveType`
**Purpose:** Get progress for specific objective type (for UI updates)

**Request:**
```typescript
// Params: :objectiveType (expedition_complete, hero_recruit, etc.)
```

**Response:**
```typescript
{
  objectiveType: string
  dailyQuests: Array<{ questId: string, current: number, target: number }>
  weeklyQuests: Array<{ questId: string, current: number, target: number }>
}
```

**Related Stories:** US-PM-008

**Priority:** Phase 2

**Notes:**
- Real-time progress tracking
- Called after relevant actions (expedition complete, recruitment, etc.)

---

## 4. Achievements API

### GET `/api/achievements`
**Purpose:** List all achievements with progress and unlock status

**Request:**
```typescript
// Query params:
// ?filter=all|completed|in-progress|locked
// ?category=heroes|expeditions|collection|combat|economy
```

**Response:**
```typescript
{
  achievements: [
    {
      id: string
      title: string
      description: string
      category: "heroes" | "expeditions" | "collection" | "combat" | "economy"

      // Hidden achievements (US-PM-025)
      hidden: boolean
      hintText?: string       // Cryptic hint if hidden and not unlocked

      // Progress
      objective: {
        type: string          // prestige_count, monsters_unique, etc.
        target: number
        current: number
      }

      // Rewards
      rewards: {
        gems?: number         // 50-500 gems (US-PM-024)
        cosmetics?: Array<{ type: string, id: string }>
        title?: string
        badge?: string
      }

      // Status
      status: "locked" | "in-progress" | "completed" | "claimed"
      unlockedAt?: Date
      claimedAt?: Date

      // UI
      progress: number        // 0-100%
      canClaim: boolean
      isNew: boolean          // Just unlocked
      rarity: "common" | "rare" | "epic" | "legendary"
    }
  ],

  summary: {
    total: number
    completed: number
    claimed: number
    progress: number          // Overall %
  }
}
```

**Related Stories:** US-PM-024, US-PM-025

**Priority:** Phase 3

**Notes:**
- Hidden achievements show "???" until unlocked
- Track "isNew" flag for fanfare notification
- Incremental achievements (47/100 heroes recruited)

---

### POST `/api/achievements/:id/claim`
**Purpose:** Claim achievement reward

**Request:**
```typescript
// Params: :id (achievement UUID)
```

**Response:**
```typescript
{
  success: true
  achievement: {
    id: string
    status: "claimed"
    claimedAt: Date
  }
  rewards: {
    gems?: number
    cosmetics?: Array<{ type: string, id: string, name: string }>
    title?: string
    badge?: string
  }
  player: {
    gems: number            // Updated balance
    unlockedCosmetics: string[]
  }
}
```

**Related Stories:** US-PM-024

**Priority:** Phase 3

---

### GET `/api/achievements/progress`
**Purpose:** Get progress summary for dashboard/UI

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  recentUnlocks: Array<{    // Last 5 unlocked
    id: string
    title: string
    unlockedAt: Date
    claimed: boolean
  }>

  nearCompletion: Array<{   // Close to completing (80%+)
    id: string
    title: string
    progress: number
  }>

  categories: {
    heroes: { completed: number, total: number }
    expeditions: { completed: number, total: number }
    collection: { completed: number, total: number }
    combat: { completed: number, total: number }
    economy: { completed: number, total: number }
  }
}
```

**Related Stories:** US-PM-024

**Priority:** Phase 3

---

## 5. Login Rewards API

### GET `/api/login-rewards/calendar`
**Purpose:** Get daily login calendar and current streak

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  currentStreak: number       // Consecutive days
  maxStreak: number           // Lifetime max
  lastLoginDate: Date
  nextResetAt: Date           // Server midnight

  calendar: [
    {
      day: number             // 1-7
      rewards: {
        gold?: number
        gems?: number
        traitTokens?: number
        items?: Array<{ id: string, name: string, quantity: number }>
      }
      claimed: boolean
      claimableToday: boolean
    }
  ],

  // Grace period (US-PM-007)
  gracePeriodActive: boolean
  gracePeriodEndsAt?: Date    // 1 day grace if missed

  // Today's reward
  todayReward: {
    day: number
    rewards: { /* ... */ }
    claimed: boolean
  }
}
```

**Related Stories:** US-PM-007, US-OB-026

**Priority:** Phase 2

**Notes:**
- 7-day cycle, day 7 is best reward
- 1-day grace period if missed (doesn't break streak)
- Rewards scale with account level (optional)

---

### POST `/api/login-rewards/claim`
**Purpose:** Claim daily login reward

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
// Body: empty (claims today's reward)
```

**Response:**
```typescript
{
  success: true
  reward: {
    day: number
    gold?: number
    gems?: number
    traitTokens?: number
    items?: Array<{ id: string, name: string, quantity: number }>
  }
  streak: {
    current: number
    max: number
    bonusApplied: boolean     // Streak bonus if applicable
  }
  player: {
    gold: number
    gems: number
  }
  nextClaimAt: Date           // Tomorrow
}
```

**Related Stories:** US-PM-007, US-OB-026

**Priority:** Phase 2

**Notes:**
- One claim per day
- Auto-claim on first login (modal) or manual claim
- Update streak counter

---

## 6. Shop/Payments API

### GET `/api/shop/supporter-pack`
**Purpose:** Get supporter pack details and purchase status

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  purchased: boolean
  purchasedAt?: Date

  pack: {
    id: "supporter-pack"
    name: "Supporter Pack"
    price: 1999              // Cents ($19.99)
    currency: "usd"

    // Benefits (US-PM-015)
    benefits: {
      oneTime: [
        "5,000 gems immediately",
        "5 trait reroll tokens",
        "Exclusive cosmetics (3 UI themes, 5 hero skins)",
        "Supporter badge"
      ],
      ongoing: [
        "100 gems daily (auto-accumulate, 7-day cap)",
        "Unlimited hero recruitment",
        "2x hero slots (100 instead of 50)",
        "2x dungeon slots (10 instead of 5)",
        "2 trait tokens monthly"
      ]
    },

    // Value calculation (US-PM-035)
    valueBreakdown: {
      gemsValue: 5000,        // Upfront gems
      monthlyValue: 3500,     // 100/day + tokens
      totalFirstMonthValue: 8500,
      equivalentPrice: "$85 value"
    }
  },

  // Free vs Supporter comparison (US-PM-015, US-PM-035)
  comparison: {
    recruitment: { free: "5 per day", supporter: "Unlimited" },
    gems: { free: "~25 per day", supporter: "~117 per day" },
    heroSlots: { free: 50, supporter: 100 },
    dungeonSlots: { free: 5, supporter: 10 },
    cosmetics: { free: "Basic", supporter: "Exclusive themes & skins" }
  }
}
```

**Related Stories:** US-PM-015, US-PM-035

**Priority:** Phase 2

**Notes:**
- One-time purchase only
- Show value breakdown to justify price
- Emphasize "faster not further" philosophy

---

### POST `/api/shop/create-checkout`
**Purpose:** Create Stripe checkout session for supporter pack

**Request:**
```typescript
{
  productId: "supporter-pack"
  successUrl: string        // Redirect after purchase
  cancelUrl: string         // Redirect if canceled
}
```

**Response:**
```typescript
{
  sessionId: string         // Stripe checkout session ID
  checkoutUrl: string       // Redirect URL
}
```

**Related Stories:** US-PM-016

**Priority:** Phase 2

**Notes:**
- Use Stripe Checkout (hosted payment page)
- Create checkout session server-side
- Redirect user to Stripe
- Webhook handles fulfillment

---

### POST `/api/shop/webhook`
**Purpose:** Handle Stripe webhook events (payment success, refund, etc.)

**Request:**
```typescript
// Stripe webhook payload
// Headers: Stripe-Signature
```

**Response:**
```typescript
{
  received: true
}
```

**Related Stories:** US-PM-016

**Priority:** Phase 2

**Notes:**
- Verify webhook signature
- Handle events:
  - `checkout.session.completed` → Grant supporter status
  - `charge.refunded` → Revoke supporter status
- Idempotency key to prevent double-processing
- Grant benefits immediately:
  - Set `isSupporter = true`
  - Add 5000 gems
  - Add 5 trait tokens
  - Unlock cosmetics
  - Increase slots
  - Send confirmation email

---

### GET `/api/shop/purchase-history`
**Purpose:** Get player's purchase history

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  purchases: [
    {
      id: string
      type: "supporter-pack" | "gem-purchase"  // Future gem packs
      amount: number          // Cents
      currency: string
      status: "completed" | "refunded" | "pending"
      purchasedAt: Date
      refundedAt?: Date
      receiptUrl?: string     // Stripe receipt
    }
  ]
}
```

**Related Stories:** US-PM-016

**Priority:** Phase 2

---

### POST `/api/shop/gems/refresh-pool`
**Purpose:** Spend gems to refresh recruitment pool

**Request:**
```typescript
{
  cost: number              // 50-100 gems (confirm client/server match)
}
```

**Response:**
```typescript
{
  success: true
  gemsSpent: 50
  gemsRemaining: number
  newPool: Hero[]           // 5 new random heroes
  refreshedAt: Date
  nextFreeRefreshAt: Date   // 24h from now
}
```

**Related Stories:** US-PM-010

**Priority:** Phase 2

**Notes:**
- Validate player has sufficient gems
- Generate new recruitment pool
- Track refresh count for analytics
- Free refresh every 24h (don't charge)

---

### POST `/api/shop/gems/skip-expedition`
**Purpose:** Spend gems to skip expedition wait time

**Request:**
```typescript
{
  expeditionId: string
  timeRemaining: number     // Seconds (verify server-side)
}
```

**Response:**
```typescript
{
  success: true
  gemsCost: number          // 10 gems per hour, rounded up
  gemsRemaining: number
  expedition: {
    id: string
    status: "completed"
    completedAt: Date
  }
  rewards: { /* Expedition rewards */ }
}
```

**Related Stories:** US-PM-012

**Priority:** Phase 2

**Notes:**
- Cost: 10 gems/hour remaining (round up)
- Expensive for long waits (discourage abuse)
- Complete expedition immediately
- Grant same rewards as waiting

---

### POST `/api/shop/gems/expand-slots`
**Purpose:** Spend gems to purchase additional hero/dungeon slots

**Request:**
```typescript
{
  slotType: "hero" | "dungeon"
  quantity: number          // How many slots to buy
}
```

**Response:**
```typescript
{
  success: true
  slotType: "hero" | "dungeon"
  slotsPurchased: number
  gemsCost: number          // Scaling cost
  gemsRemaining: number
  newSlotCount: number
  newSlotCap: number        // Max 200 heroes, 20 dungeons
}
```

**Related Stories:** US-PM-013, US-PM-032

**Priority:** Phase 2

**Notes:**
- Scaling cost (first cheap, later expensive)
  - Heroes: 50, 75, 100, 150, 200... gems
  - Dungeons: 100, 150, 200, 300... gems
- Cap at 200 heroes, 20 dungeons
- Permanent unlocks (not consumable)
- Supporters start with more base slots

---

## 7. Cosmetics API

### GET `/api/cosmetics`
**Purpose:** List all cosmetics (themes, skins, badges) with unlock status

**Request:**
```typescript
// Query params:
// ?type=theme|skin|badge
// ?unlocked=true|false
```

**Response:**
```typescript
{
  cosmetics: [
    {
      id: string
      type: "theme" | "skin" | "badge"
      name: string
      description: string
      rarity: "common" | "rare" | "legendary"

      // Unlock requirements
      unlocked: boolean
      requiresSupporter: boolean        // US-PM-019, US-PM-027
      unlockMethod: "supporter" | "achievement" | "event" | "default"
      achievementId?: string

      // Preview data
      previewImage: string

      // If skin
      appliesToHeroId?: string          // Specific hero or null for any

      // Status
      equipped: boolean
    }
  ],

  equipped: {
    theme: string | null
    badges: string[]                    // Can equip multiple badges
    heroSkins: Record<string, string>   // heroId -> skinId
  }
}
```

**Related Stories:** US-PM-019, US-PM-027, US-PM-028, US-PM-029

**Priority:** Phase 2-3

---

### GET `/api/cosmetics/equipped`
**Purpose:** Get currently equipped cosmetics

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  theme: {
    id: string
    name: string
    cssVariables: Record<string, string>  // Tailwind CSS vars
  },
  badges: [
    {
      id: string
      name: string
      imagePath: string
      position: number        // Display order
    }
  ],
  heroSkins: [
    {
      heroId: string
      skinId: string
      skinName: string
      imagePath: string
    }
  ]
}
```

**Related Stories:** US-PM-027, US-PM-028, US-PM-029

**Priority:** Phase 2-3

---

### POST `/api/cosmetics/apply`
**Purpose:** Apply a cosmetic (theme, skin, badge)

**Request:**
```typescript
{
  cosmeticId: string
  cosmeticType: "theme" | "skin" | "badge"
  heroId?: string           // Required if type=skin
  action: "equip" | "unequip"
}
```

**Response:**
```typescript
{
  success: true
  equipped: {
    theme: string | null
    badges: string[]
    heroSkins: Record<string, string>
  }
}
```

**Related Stories:** US-PM-027, US-PM-028, US-PM-029

**Priority:** Phase 2-3

**Notes:**
- Validate cosmetic is unlocked
- Theme: switch instantly, no reload
- Badge: can equip multiple (limit 3?)
- Skin: per-hero customization
- Save to preferences (sync cross-device)

---

## 8. Currency API

### GET `/api/currency/balances`
**Purpose:** Get current currency balances

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  gold: number
  gems: number
  traitTokens: number

  // Breakdown (US-PM-014)
  gems: {
    total: number
    earnedThisWeek: number
    earnedAllTime: number
    spentAllTime: number
  },

  gold: {
    total: number
    earnedToday: number       // US-PM-039
    earnedAllTime: number
    spentAllTime: number
  }
}
```

**Related Stories:** US-PM-014, US-PM-039

**Priority:** Phase 1

**Notes:**
- Update in real-time via WebSocket/SSE
- Cache with short TTL
- Include breakdown for motivation

---

### GET `/api/currency/transactions`
**Purpose:** Get currency transaction history

**Request:**
```typescript
// Query params:
// ?type=gold|gems|trait-tokens
// ?limit=50
// ?offset=0
```

**Response:**
```typescript
{
  transactions: [
    {
      id: string
      type: "gold" | "gems" | "trait-tokens"
      amount: number          // Positive = earned, negative = spent
      balance: number         // Balance after transaction
      source: "expedition" | "quest" | "achievement" | "purchase" | "supporter-daily" | "shop"
      description: string
      metadata: {
        questId?: string
        expeditionId?: string
        purchaseId?: string
      }
      createdAt: Date
    }
  ],

  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}
```

**Related Stories:** US-PM-014

**Priority:** Phase 2

---

### POST `/api/currency/add`
**Purpose:** Add currency (internal use - called by other systems)

**Request:**
```typescript
{
  playerId: string
  type: "gold" | "gems" | "trait-tokens"
  amount: number
  source: string            // expedition, quest, achievement, etc.
  metadata?: object
}
```

**Response:**
```typescript
{
  success: true
  transaction: {
    id: string
    type: string
    amount: number
    balance: number
    createdAt: Date
  }
}
```

**Related Stories:** All currency-earning stories

**Priority:** Phase 1

**Notes:**
- Server-side only (not exposed to client)
- Called by quest completion, expedition rewards, etc.
- Transaction log for audit trail

---

### POST `/api/currency/spend`
**Purpose:** Spend currency (internal use - called by other systems)

**Request:**
```typescript
{
  playerId: string
  type: "gold" | "gems" | "trait-tokens"
  amount: number
  purpose: string           // recruitment, refresh-pool, skip-wait, etc.
  metadata?: object
}
```

**Response:**
```typescript
{
  success: true
  transaction: {
    id: string
    type: string
    amount: number          // Negative
    balance: number
    createdAt: Date
  }
}
```

**Related Stories:** All currency-spending stories

**Priority:** Phase 1

**Notes:**
- Validate sufficient balance
- Atomic transaction
- Rollback on error

---

## 9. Onboarding API

### POST `/api/onboarding/guest-session`
**Purpose:** Create a guest session for new players

**Request:**
```typescript
{
  deviceId?: string         // Optional device fingerprint
}
```

**Response:**
```typescript
{
  success: true
  guestId: string           // Temporary UUID
  sessionToken: string      // JWT for guest session
  expiresAt: Date           // Token expiration

  // Initial game state
  player: {
    id: string              // Guest ID
    isGuest: true
    username: "Guest_12345"
    guildName: "Adventurer's Guild"
    accountLevel: 1
    accountXp: 0
    gold: 1000              // Starting gold
    gems: 100               // Starting gems (tutorial)
    heroSlots: 50
    dungeonSlots: 5
  },

  // First hero (US-OB-007)
  firstHero: Hero
}
```

**Related Stories:** US-OB-001, US-OB-007

**Priority:** Phase 1 (MVP)

**Notes:**
- No account creation required
- Store guest data in localStorage initially
- Create temp record in Supabase
- Guest sessions expire after 30 days of inactivity
- Track conversion funnel: guest → account

---

### POST `/api/onboarding/link-account`
**Purpose:** Link guest session to new account

**Request:**
```typescript
{
  guestId: string
  email: string
  password: string
  username: string
  guildName?: string
  acceptedTerms: boolean
}
```

**Response:**
```typescript
{
  success: true
  playerId: string          // New account ID
  sessionToken: string      // New JWT

  // Migrated data summary
  migrated: {
    heroes: number
    gold: number
    gems: number
    expeditions: number
    progress: string
  }

  message: "Your progress has been saved! Welcome to Dungeon Farmers."
}
```

**Related Stories:** US-OB-005

**Priority:** Phase 1

**Notes:**
- Migrate all guest data to new account
- Invalidate guest session token
- Send welcome email
- Update all foreign keys (heroId, expeditionId, etc.)
- One-way operation (cannot unlink)
- Edge case: Handle if email already exists

---

### GET `/api/onboarding/tutorial-progress`
**Purpose:** Get tutorial completion status

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  completed: boolean
  currentStep: string | null  // null if completed

  steps: {
    welcomeScreen: boolean      // US-OB-006
    firstHero: boolean          // US-OB-007
    uiTour: boolean             // US-OB-008
    guildName: boolean          // US-OB-009
    firstExpedition: boolean    // US-OB-010
    expeditionLog: boolean      // US-OB-011
    equipGear: boolean          // US-OB-012
    recruitSecond: boolean      // US-OB-013
    formTeam: boolean           // US-OB-014
    firstCapture: boolean       // US-OB-015 (Phase 2)
    firstDungeon: boolean       // US-OB-016 (Phase 2)
    firstDungeonRun: boolean    // US-OB-017 (Phase 2)
  },

  percentComplete: number       // 0-100
  canSkip: boolean
  skipped: boolean
}
```

**Related Stories:** US-OB-006 to US-OB-017

**Priority:** Phase 1

---

### PATCH `/api/onboarding/tutorial-progress`
**Purpose:** Update tutorial progress (mark step complete)

**Request:**
```typescript
{
  step: string                // Step name
  completed: boolean
  skipped?: boolean           // True if skipping entire tutorial
}
```

**Response:**
```typescript
{
  success: true
  tutorialProgress: {
    completed: boolean
    currentStep: string | null
    percentComplete: number
  }
}
```

**Related Stories:** US-OB-006 to US-OB-017

**Priority:** Phase 1

**Notes:**
- Track which steps completed
- Allow skipping but track skip rate
- Resume if interrupted

---

### POST `/api/onboarding/daily-login`
**Purpose:** Record daily login (for returning players)

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
// Body: empty
```

**Response:**
```typescript
{
  success: true
  isFirstLoginToday: boolean

  // Offline progress (US-OB-023)
  offlineProgress: {
    timeAway: number          // Seconds
    expeditionsCompleted: Expedition[]
    passiveIncome: {
      gold: number
      xp: number
      materials: Array<{ type: string, amount: number }>
    }
    totalRewards: {
      gold: number
      xp: number
      items: Item[]
    }
  },

  // Daily login reward (US-OB-026)
  dailyReward: {
    available: boolean
    claimed: boolean
    rewards: { /* ... */ }
  }
}
```

**Related Stories:** US-OB-023, US-OB-024, US-OB-026

**Priority:** Phase 2

**Notes:**
- Calculate offline progress server-side
- Cap at 24-48 hours max accumulation
- Show "Welcome Back" modal client-side
- Trigger daily reward modal if available

---

## 10. Tutorial Progress API

### GET `/api/tutorial/tooltips`
**Purpose:** Get shown tooltips for progressive disclosure

**Request:**
```typescript
// Headers: Authorization: Bearer <token>
```

**Response:**
```typescript
{
  shown: string[]           // Array of tooltip IDs shown
  dismissed: string[]       // Array of tooltip IDs permanently dismissed
  enabled: boolean          // Global tooltip setting
}
```

**Related Stories:** US-OB-018

**Priority:** Phase 2

---

### PATCH `/api/tutorial/tooltips`
**Purpose:** Update tooltip tracking

**Request:**
```typescript
{
  tooltipId: string
  action: "shown" | "dismissed"
}
```

**Response:**
```typescript
{
  success: true
  tooltips: {
    shown: string[]
    dismissed: string[]
  }
}
```

**Related Stories:** US-OB-018

**Priority:** Phase 2

---

### GET `/api/tutorial/hints`
**Purpose:** Get contextual hints based on player state

**Request:**
```typescript
// Query params:
// ?context=recruitment|expedition|inventory|stuck
```

**Response:**
```typescript
{
  hint: {
    id: string
    context: string
    text: string            // In-character advisor text
    suggestedAction?: string
    helpLink?: string
  } | null
}
```

**Related Stories:** US-OB-022

**Priority:** Phase 3

**Notes:**
- Context-aware hints
- Inactivity detection (5+ mins)
- In-character flavor (guild advisor)
- Track hint usage for analytics

---

## Implementation Priority Summary

### Phase 1 (MVP - Core Progression)
**Critical for launch:**
- Player/Account: `GET/PATCH profile`, `GET currency/balances`
- Zones: `GET zones`, `GET zones/:id`
- Quests: `GET daily`, `GET weekly`, `POST claim`
- Currency: `POST add`, `POST spend`
- Onboarding: `POST guest-session`, `GET/PATCH tutorial-progress`

**Total Endpoints:** ~12

---

### Phase 2 (Monetization & Depth)
**Supporter pack and premium features:**
- Player: `GET/PATCH preferences`, `GET data-export`
- Zones: `PATCH familiarity`
- Login Rewards: `GET calendar`, `POST claim`
- Shop: `GET supporter-pack`, `POST create-checkout`, `POST webhook`, all gem spending endpoints
- Cosmetics: `GET cosmetics`, `POST apply`
- Currency: `GET transactions`
- Onboarding: `POST link-account`, `POST daily-login`

**Total Endpoints:** ~15

---

### Phase 3 (Endgame & Polish)
**Achievements, milestones, advanced features:**
- Player: `DELETE account`, `GET stats`
- Achievements: `GET achievements`, `POST claim`, `GET progress`
- Cosmetics: `GET equipped` (advanced)
- Tutorial: `GET/PATCH tooltips`, `GET hints`

**Total Endpoints:** ~8

---

## Technical Notes

### Authentication
- All endpoints require authentication (except `POST /guest-session`)
- Use Supabase Auth middleware
- JWT tokens with refresh mechanism
- Rate limiting per endpoint

### Database Schema Considerations
```sql
-- Players table
- id (UUID, PK)
- username (unique)
- email (unique)
- guild_name
- account_level, account_xp
- is_supporter, supporter_since
- daily_recruitment_count, daily_recruitment_reset_at
- hero_slots, dungeon_slots
- gold, gems, trait_tokens
- preferences (JSONB)
- created_at, updated_at

-- Transactions table (audit log)
- id (UUID, PK)
- player_id (FK)
- type (gold, gems, trait-tokens)
- amount
- balance_after
- source
- metadata (JSONB)
- created_at

-- Quests table
- id (UUID, PK)
- player_id (FK)
- type (daily, weekly)
- objective_type
- objective_target, objective_current
- rewards (JSONB)
- status
- completed_at, claimed_at

-- Achievements table (template)
- id (UUID, PK)
- title, description
- category
- hidden
- objective_type, objective_target
- rewards (JSONB)

-- Player Achievements (progress)
- player_id, achievement_id (composite PK)
- current_progress
- status
- unlocked_at, claimed_at

-- Tutorial Progress
- player_id (PK, FK)
- steps (JSONB)
- current_step
- completed, skipped

-- Cosmetics (template)
- id (UUID, PK)
- type, name, description
- requires_supporter
- unlock_method

-- Player Cosmetics (unlocked)
- player_id, cosmetic_id (composite PK)
- unlocked_at, equipped
```

### Stripe Integration
1. Create product in Stripe Dashboard ("Supporter Pack", $19.99)
2. Use Stripe Checkout for payment (hosted page)
3. Webhook endpoint for fulfillment
4. Test mode for development
5. Production keys in environment variables

### Real-time Updates
- Use Server-Sent Events (MVP) or Supabase Realtime
- Currency balance updates
- Quest progress updates
- Expedition completions
- Achievement unlocks

### Error Handling
```typescript
// Standard error response
{
  error: {
    code: "INSUFFICIENT_GEMS" | "QUEST_NOT_FOUND" | etc.
    message: "User-friendly error message"
    details?: object
  }
}
```

### Rate Limiting
- Guest creation: 10/hour per IP
- Purchase endpoints: 5/minute per user
- General API: 100/minute per user
- Webhook: Stripe signature verification

---

## Nuxt 4 File Structure

```
server/
├── api/
│   ├── player/
│   │   ├── profile.get.ts
│   │   ├── profile.patch.ts
│   │   ├── preferences.get.ts
│   │   ├── preferences.patch.ts
│   │   ├── data-export.get.ts
│   │   ├── account.delete.ts
│   │   └── stats.get.ts
│   │
│   ├── zones/
│   │   ├── index.get.ts
│   │   ├── [id].get.ts
│   │   └── [id]/
│   │       └── familiarity.patch.ts
│   │
│   ├── quests/
│   │   ├── daily.get.ts
│   │   ├── weekly.get.ts
│   │   ├── [id]/
│   │   │   └── claim.post.ts
│   │   └── progress/
│   │       └── [objectiveType].get.ts
│   │
│   ├── achievements/
│   │   ├── index.get.ts
│   │   ├── [id]/
│   │   │   └── claim.post.ts
│   │   └── progress.get.ts
│   │
│   ├── login-rewards/
│   │   ├── calendar.get.ts
│   │   └── claim.post.ts
│   │
│   ├── shop/
│   │   ├── supporter-pack.get.ts
│   │   ├── create-checkout.post.ts
│   │   ├── webhook.post.ts
│   │   ├── purchase-history.get.ts
│   │   └── gems/
│   │       ├── refresh-pool.post.ts
│   │       ├── skip-expedition.post.ts
│   │       └── expand-slots.post.ts
│   │
│   ├── cosmetics/
│   │   ├── index.get.ts
│   │   ├── equipped.get.ts
│   │   └── apply.post.ts
│   │
│   ├── currency/
│   │   ├── balances.get.ts
│   │   ├── transactions.get.ts
│   │   ├── add.post.ts          # Internal use
│   │   └── spend.post.ts        # Internal use
│   │
│   ├── onboarding/
│   │   ├── guest-session.post.ts
│   │   ├── link-account.post.ts
│   │   ├── tutorial-progress.get.ts
│   │   ├── tutorial-progress.patch.ts
│   │   └── daily-login.post.ts
│   │
│   └── tutorial/
│       ├── tooltips.get.ts
│       ├── tooltips.patch.ts
│       └── hints.get.ts
│
├── utils/
│   ├── db.ts                    # Supabase client
│   ├── auth.ts                  # Auth helpers
│   ├── stripe.ts                # Stripe client
│   ├── currency.ts              # Currency transaction helpers
│   └── quest-generator.ts       # Auto-generate daily/weekly quests
│
└── middleware/
    ├── auth.ts                  # Verify JWT, attach user
    ├── supporter.ts             # Check supporter status
    └── rate-limit.ts            # Rate limiting

```

---

## Next Steps

1. **Phase 1 Implementation:**
   - Set up Supabase project + schema
   - Implement auth middleware
   - Build core player/currency/quest endpoints
   - Test guest session flow

2. **Phase 2 Implementation:**
   - Stripe integration (test mode)
   - Supporter pack purchase flow
   - Gem spending endpoints
   - Login rewards system

3. **Phase 3 Implementation:**
   - Achievement system
   - Cosmetics system
   - Advanced analytics

4. **Testing:**
   - Unit tests for currency transactions
   - Integration tests for purchase flow
   - E2E tests for onboarding

---

**End of Document**
