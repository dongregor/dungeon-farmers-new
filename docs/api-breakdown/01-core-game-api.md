# Core Game APIs

**Category:** Heroes, Expeditions, Equipment
**Total Endpoints:** ~50
**Priority:** Phase 1-2

---

## 1. Heroes API

Base path: `/api/heroes`

### US-HM-001 to US-HM-030: Hero Management

#### GET /api/heroes
List all heroes for the current player.

```typescript
// Request
GET /api/heroes?page=1&limit=20&sort=power&order=desc&rarity=Rare,Epic&status=idle

// Query Parameters
interface HeroListParams {
  page?: number           // Default: 1
  limit?: number          // Default: 20, Max: 100
  sort?: 'power' | 'level' | 'name' | 'rarity' | 'acquired'
  order?: 'asc' | 'desc'
  rarity?: string         // Comma-separated: "Rare,Epic,Legendary"
  status?: 'idle' | 'expedition' | 'assigned' | 'all'
  trait?: string          // Filter by trait name
  search?: string         // Search by name
}

// Response
interface HeroListResponse {
  success: true
  data: HeroSummary[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    rosterCount: number
    rosterCap: number
  }
}

interface HeroSummary {
  id: string
  name: string
  rarity: Rarity
  level: number
  maxLevel: number
  power: number
  traits: TraitSummary[]
  status: 'idle' | 'expedition' | 'assigned'
  currentActivity?: {
    type: 'expedition' | 'passive'
    id: string
    completesAt?: number
  }
  hasUpgradeAvailable: boolean
  portraitUrl?: string
}
```

**Related User Stories:** US-HM-001, US-HM-002, US-HM-003, US-HM-004
**Priority:** Phase 1

---

#### GET /api/heroes/:id
Get detailed hero information.

```typescript
// Request
GET /api/heroes/abc123

// Response
interface HeroDetailResponse {
  success: true
  data: HeroDetail
}

interface HeroDetail {
  id: string
  name: string
  rarity: Rarity
  level: number
  maxLevel: number
  experience: number
  experienceToNext: number
  power: number

  // Stats
  stats: {
    attack: number
    defense: number
    health: number
    speed: number
    // Derived stats
    critChance: number
    critDamage: number
  }
  baseStats: { ... }      // Stats without equipment

  // Traits
  traits: Trait[]

  // Equipment
  equipment: {
    weapon?: EquippedItem
    armor?: EquippedItem
    accessory?: EquippedItem
    trinket?: EquippedItem
  }
  gearScore: number

  // Set bonuses
  setProgess: SetProgress[]
  activeSetBonuses: SetBonus[]

  // Status
  status: 'idle' | 'expedition' | 'assigned'
  currentActivity?: ActivityDetail

  // Prestige
  prestigeLevel: number
  prestigeAvailable: boolean
  prestigeBonuses: PrestigeBonus[]

  // History
  expeditionsCompleted: number
  monstersDefeated: number
  bestLootFound: ItemSummary
  acquiredAt: number
}
```

**Related User Stories:** US-HM-005, US-HM-006, US-HM-007
**Priority:** Phase 1

---

#### PATCH /api/heroes/:id
Update hero (rename, etc.).

```typescript
// Request
PATCH /api/heroes/abc123
{
  "name": "Sir Bumblefoot the Brave"
}

// Response
{
  success: true,
  data: {
    id: "abc123",
    name: "Sir Bumblefoot the Brave",
    updated: true
  }
}
```

**Related User Stories:** US-HM-008
**Priority:** Phase 2

---

#### POST /api/heroes/:id/level-up
Level up a hero using experience/gold.

```typescript
// Request
POST /api/heroes/abc123/level-up
{
  "levels": 5  // Optional, default 1
}

// Response
{
  success: true,
  data: {
    heroId: "abc123",
    previousLevel: 10,
    newLevel: 15,
    statChanges: {
      attack: { from: 45, to: 62, diff: 17 },
      defense: { from: 38, to: 51, diff: 13 },
      health: { from: 320, to: 425, diff: 105 }
    },
    powerChange: { from: 1200, to: 1580, diff: 380 },
    goldSpent: 2500,
    experienceSpent: 5000
  }
}
```

**Related User Stories:** US-HM-009, US-HM-010
**Priority:** Phase 1

---

#### POST /api/heroes/:id/retire
Retire a hero for resources.

```typescript
// Request
POST /api/heroes/abc123/retire
{
  "confirm": true
}

// Response
{
  success: true,
  data: {
    heroId: "abc123",
    heroName: "Sir Bumblefoot",
    rewards: {
      gold: 5000,
      experience: 2500,
      materials: [
        { type: "rare_crystal", amount: 3 }
      ]
    },
    unequippedItems: ["item1", "item2"]
  }
}
```

**Related User Stories:** US-HM-011
**Priority:** Phase 1

---

#### POST /api/heroes/:id/prestige
Prestige a max-level hero.

```typescript
// Request
POST /api/heroes/abc123/prestige

// Response
{
  success: true,
  data: {
    heroId: "abc123",
    prestigeLevel: 2,
    bonusesGained: [
      { type: "stat_bonus", stat: "attack", value: 5, isPercent: true }
    ],
    levelReset: { from: 50, to: 1 },
    keepItems: true,
    keepMonsters: true,
    newMaxLevel: 55
  }
}
```

**Related User Stories:** US-HM-012, US-HM-013
**Priority:** Phase 2

---

## 2. Tavern API

Base path: `/api/tavern`

### US-HM-014 to US-HM-020: Hero Recruitment

#### GET /api/tavern
Get current tavern state.

```typescript
// Response
{
  success: true,
  data: {
    slots: [
      {
        index: 0,
        hero: HeroPreview | null,
        locked: false,
        recruitCost: 500
      },
      // ... 3-5 slots total
    ],
    refreshCost: 100,
    refreshesRemaining: 5,
    nextFreeRefresh: 1704067200000,  // Timestamp
    guaranteedRareIn: 3,  // Pity counter
    rosterSpace: { current: 45, max: 50 }
  }
}

interface HeroPreview {
  id: string
  name: string
  rarity: Rarity
  traits: TraitSummary[]
  stats: StatPreview
  power: number
}
```

**Related User Stories:** US-HM-014, US-HM-015
**Priority:** Phase 1

---

#### POST /api/tavern/recruit
Recruit a hero from a tavern slot.

```typescript
// Request
POST /api/tavern/recruit
{
  "slotIndex": 0
}

// Response
{
  success: true,
  data: {
    hero: HeroDetail,
    goldSpent: 500,
    tutorialTrigger: "first_hero"  // Optional
  }
}

// Error responses
{
  success: false,
  error: {
    code: "ROSTER_FULL",
    message: "Your hero roster is full (50/50)",
    details: { current: 50, max: 50 }
  }
}
```

**Related User Stories:** US-HM-016, US-HM-017
**Priority:** Phase 1

---

#### POST /api/tavern/refresh
Refresh all unlocked tavern slots.

```typescript
// Request
POST /api/tavern/refresh

// Response
{
  success: true,
  data: {
    slots: TavernSlot[],
    goldSpent: 100,
    refreshesRemaining: 4,
    nextFreeRefresh: 1704067200000
  }
}
```

**Related User Stories:** US-HM-018
**Priority:** Phase 1

---

#### POST /api/tavern/lock/:index
Lock a tavern slot to preserve hero.

```typescript
// Request
POST /api/tavern/lock/2

// Response
{
  success: true,
  data: {
    slotIndex: 2,
    locked: true
  }
}
```

**Related User Stories:** US-HM-019
**Priority:** Phase 1

---

#### POST /api/tavern/unlock/:index
Unlock a tavern slot.

```typescript
// Request
POST /api/tavern/unlock/2

// Response
{
  success: true,
  data: {
    slotIndex: 2,
    locked: false
  }
}
```

**Related User Stories:** US-HM-019
**Priority:** Phase 1

---

## 3. Expeditions API

Base path: `/api/expeditions`

### US-EX-001 to US-EX-035: Expedition System

#### GET /api/expeditions
List all expeditions (active and completed).

```typescript
// Request
GET /api/expeditions?status=active&type=zone

// Query Parameters
interface ExpeditionListParams {
  status?: 'active' | 'completed' | 'all'
  type?: 'zone' | 'story' | 'dungeon'
  page?: number
  limit?: number
}

// Response
{
  success: true,
  data: {
    active: ExpeditionSummary[],
    recent: ExpeditionSummary[],  // Last 10 completed
    slots: { used: 3, max: 5 }
  }
}

interface ExpeditionSummary {
  id: string
  type: 'zone' | 'story' | 'dungeon'
  targetName: string
  targetId: string
  heroes: HeroSummary[]
  status: 'active' | 'completed' | 'event_pending'
  startedAt: number
  completesAt: number
  progressPercent: number
  efficiency: number
  pendingEvent?: EventSummary
}
```

**Related User Stories:** US-EX-001, US-EX-002
**Priority:** Phase 1

---

#### GET /api/expeditions/:id
Get detailed expedition information.

```typescript
// Response
{
  success: true,
  data: {
    id: "exp123",
    type: "zone",
    target: {
      id: "zone_forest",
      name: "Whispering Woods",
      description: "A forest teeming with low-level creatures",
      recommendedPower: 500,
      difficulty: "Normal"
    },
    heroes: HeroDetail[],
    teamPower: 1250,
    efficiency: 125,  // Percentage

    status: "active",
    startedAt: 1704000000000,
    completesAt: 1704003600000,
    duration: 3600000,  // ms
    progressPercent: 45,

    // Log entries (narrative)
    log: ExpeditionLogEntry[],

    // Events/choices encountered
    events: ExpeditionEvent[],
    currentEvent?: ExpeditionEvent,

    // Rewards preview (based on efficiency)
    estimatedRewards: RewardPreview
  }
}

interface ExpeditionLogEntry {
  timestamp: number
  type: 'narrative' | 'combat' | 'discovery' | 'event'
  text: string
  heroId?: string
  traitId?: string  // If trait-triggered
}

interface ExpeditionEvent {
  id: string
  type: 'choice' | 'combat' | 'discovery'
  title: string
  description: string
  choices?: EventChoice[]
  resolved: boolean
  outcome?: EventOutcome
}
```

**Related User Stories:** US-EX-003, US-EX-004, US-EX-020
**Priority:** Phase 1

---

#### GET /api/expeditions/preview
Preview an expedition before starting.

```typescript
// Request
GET /api/expeditions/preview?targetId=zone_forest&heroIds=h1,h2,h3

// Response
{
  success: true,
  data: {
    target: ZoneDetail,
    heroes: HeroSummary[],
    teamPower: 1250,
    recommendedPower: 500,
    efficiency: 125,
    estimatedDuration: 3600000,
    estimatedRewards: {
      gold: { min: 200, max: 350 },
      experience: { min: 500, max: 800 },
      items: [
        { template: "iron_sword", chance: 0.15 },
        { template: "leather_armor", chance: 0.10 }
      ],
      monsterCapture: {
        possible: ["forest_sprite", "wild_boar"],
        baseChance: 0.05
      }
    },
    traitSynergies: [
      { trait: "Forest Guide", bonus: "+10% efficiency in forests" }
    ],
    warnings: [
      { type: "underpowered", message: "Team power below recommended" }
    ]
  }
}
```

**Related User Stories:** US-EX-005, US-EX-006, US-EX-007
**Priority:** Phase 1

---

#### POST /api/expeditions/start
Start a new expedition.

```typescript
// Request
POST /api/expeditions/start
{
  "targetType": "zone",
  "targetId": "zone_forest",
  "heroIds": ["hero1", "hero2", "hero3"]
}

// Response
{
  success: true,
  data: {
    expedition: ExpeditionDetail,
    slotsRemaining: 2
  }
}

// Error responses
{
  success: false,
  error: {
    code: "HERO_BUSY",
    message: "Hero 'Sir Bumblefoot' is already on an expedition",
    details: { heroId: "hero1", currentExpedition: "exp456" }
  }
}
```

**Related User Stories:** US-EX-008, US-EX-009
**Priority:** Phase 1

---

#### POST /api/expeditions/:id/complete
Complete an expedition and claim rewards.

```typescript
// Request
POST /api/expeditions/exp123/complete

// Response
{
  success: true,
  data: {
    expeditionId: "exp123",
    success: true,
    efficiency: 125,

    rewards: {
      gold: 325,
      experience: 750,
      items: [
        { item: ItemDetail, isNew: true, isUpgrade: true }
      ],
      materials: [
        { type: "iron_ore", amount: 5 }
      ]
    },

    // Monster capture (Phase 2)
    monstersCaptured: [
      { monster: MonsterDetail, isNew: true }
    ],

    // Schematic drops (Phase 2)
    schematicsFound: [],

    // Hero updates
    heroUpdates: [
      {
        heroId: "hero1",
        experienceGained: 250,
        leveledUp: true,
        newLevel: 15
      }
    ],

    // Full expedition log
    log: ExpeditionLogEntry[],

    // Achievements triggered
    achievementsUnlocked: []
  }
}
```

**Related User Stories:** US-EX-010, US-EX-011, US-EX-012
**Priority:** Phase 1

---

#### POST /api/expeditions/:id/cancel
Cancel an active expedition.

```typescript
// Request
POST /api/expeditions/exp123/cancel
{
  "confirm": true
}

// Response
{
  success: true,
  data: {
    expeditionId: "exp123",
    cancelled: true,
    heroesReturned: ["hero1", "hero2"],
    partialRewards: {
      gold: 50,
      experience: 100
    }
  }
}
```

**Related User Stories:** US-EX-013
**Priority:** Phase 1

---

#### POST /api/expeditions/:id/choice
Make a choice during an expedition event.

```typescript
// Request
POST /api/expeditions/exp123/choice
{
  "eventId": "event_mysterious_chest",
  "choiceId": "open_carefully"
}

// Response
{
  success: true,
  data: {
    eventId: "event_mysterious_chest",
    choiceMade: "open_carefully",
    outcome: {
      type: "success",
      narrative: "Your cautious approach pays off! The chest contains...",
      rewards: {
        items: [ItemDetail],
        bonusEfficiency: 5
      },
      traitActivated: {
        heroId: "hero1",
        trait: "Careful",
        effect: "Prevented trap damage"
      }
    },
    expeditionUpdated: ExpeditionDetail
  }
}
```

**Related User Stories:** US-EX-014, US-EX-015
**Priority:** Phase 1

---

#### GET /api/expeditions/:id/log
Get full expedition log (for completed expeditions).

```typescript
// Response
{
  success: true,
  data: {
    expeditionId: "exp123",
    entries: ExpeditionLogEntry[],
    summary: {
      duration: 3600000,
      efficiency: 125,
      combatEncounters: 5,
      choicesMade: 2,
      traitActivations: 8,
      totalLoot: 12
    }
  }
}
```

**Related User Stories:** US-EX-016, US-EX-017
**Priority:** Phase 1

---

## 4. Zones API

Base path: `/api/zones`

### Zone Discovery and Progress

#### GET /api/zones
List all zones and their status.

```typescript
// Response
{
  success: true,
  data: {
    zones: ZoneSummary[],
    currentProgress: {
      furthestZone: "zone_dark_forest",
      totalZonesUnlocked: 8,
      totalZones: 25
    }
  }
}

interface ZoneSummary {
  id: string
  name: string
  description: string
  biome: string
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Nightmare'
  recommendedPower: number
  unlocked: boolean
  unlockRequirements?: UnlockRequirement[]
  completionCount: number
  bestEfficiency: number
  lootPreview: string[]  // Notable drops
  passiveSlots: number   // For hero assignments
  assignedHeroes: HeroSummary[]
}
```

**Related User Stories:** US-EX-018, US-EX-019
**Priority:** Phase 1

---

#### GET /api/zones/:id
Get detailed zone information.

```typescript
// Response
{
  success: true,
  data: {
    id: "zone_forest",
    name: "Whispering Woods",
    description: "Ancient forest full of mystery...",
    lore: "Long ago, the elves...",

    biome: "forest",
    difficulty: "Normal",
    recommendedPower: 500,
    duration: { min: 30, max: 120 },  // minutes

    // Loot table
    lootTable: {
      gold: { base: 100, variance: 50 },
      experience: { base: 200, variance: 100 },
      items: [
        {
          template: "forest_blade",
          name: "Blade of the Woods",
          rarity: "Rare",
          dropRate: 0.08,
          powerRange: [45, 60]
        }
      ],
      materials: [
        { type: "wood", amount: { min: 3, max: 8 } }
      ]
    },

    // Monsters (Phase 2)
    monsters: MonsterPreview[],

    // Possible events
    events: EventPreview[],

    // Statistics
    stats: {
      timesCompleted: 47,
      bestEfficiency: 145,
      averageEfficiency: 112,
      totalLootValue: 25000
    },

    // Passive income
    passiveIncome: {
      slots: 2,
      assignedHeroes: HeroSummary[],
      incomePerHour: { gold: 50, experience: 25 }
    }
  }
}
```

**Related User Stories:** US-EX-020, US-EX-021
**Priority:** Phase 1

---

#### POST /api/zones/:id/assign
Assign hero to zone for passive income.

```typescript
// Request
POST /api/zones/zone_forest/assign
{
  "heroId": "hero123"
}

// Response
{
  success: true,
  data: {
    zoneId: "zone_forest",
    heroId: "hero123",
    slot: 1,
    incomePerHour: { gold: 25, experience: 12 },
    heroEfficiencyBonus: 15  // From traits
  }
}
```

**Related User Stories:** US-EX-022, US-EX-023
**Priority:** Phase 2

---

#### POST /api/zones/:id/unassign
Remove hero from zone assignment.

```typescript
// Request
POST /api/zones/zone_forest/unassign
{
  "heroId": "hero123"
}

// Response
{
  success: true,
  data: {
    zoneId: "zone_forest",
    heroId: "hero123",
    removed: true,
    accruedRewards: {
      gold: 150,
      experience: 75,
      duration: 21600000  // 6 hours in ms
    }
  }
}
```

**Related User Stories:** US-EX-024
**Priority:** Phase 2

---

## 5. Equipment API

Base path: `/api/equipment`

### US-EQ-001 to US-EQ-027: Equipment & Inventory

#### GET /api/equipment
List all equipment in inventory.

```typescript
// Request
GET /api/equipment?slot=weapon&rarity=Rare,Epic&sort=power&equipped=false

// Query Parameters
interface EquipmentListParams {
  page?: number
  limit?: number
  slot?: 'weapon' | 'armor' | 'accessory' | 'trinket'
  rarity?: string
  setId?: string
  equipped?: boolean
  locked?: boolean
  sort?: 'power' | 'rarity' | 'level' | 'acquired'
  order?: 'asc' | 'desc'
  upgradesFor?: string  // Hero ID - show only upgrades
}

// Response
{
  success: true,
  data: ItemSummary[],
  meta: {
    page: 1,
    total: 127,
    capacity: { current: 127, max: 200 }
  }
}

interface ItemSummary {
  id: string
  templateId: string
  name: string
  slot: string
  rarity: Rarity
  level: number
  power: number
  setId?: string
  setName?: string
  equippedBy?: { heroId: string, heroName: string }
  locked: boolean
  isUpgrade: boolean  // If upgradesFor specified
  upgradeAmount?: number
}
```

**Related User Stories:** US-EQ-001, US-EQ-002
**Priority:** Phase 1

---

#### GET /api/equipment/:id
Get detailed item information.

```typescript
// Response
{
  success: true,
  data: {
    id: "item123",
    templateId: "iron_sword",
    name: "Gleaming Iron Sword",
    description: "A well-crafted iron blade...",

    slot: "weapon",
    rarity: "Rare",
    level: 15,

    stats: {
      attack: 45,
      critChance: 5,
      speed: 2
    },
    baseStats: { ... },  // Before any upgrades

    power: 125,
    qualityPercentile: 85,  // "Top 15% roll"

    // Set information
    set: {
      id: "forest_set",
      name: "Forest Guardian",
      currentPieces: 3,
      ownedPieces: ["weapon", "armor", "trinket"],
      bonuses: [
        { pieces: 2, effect: "+10% forest efficiency", active: true },
        { pieces: 4, effect: "+25 defense", active: false }
      ]
    },

    // Special effects
    effects: [
      { type: "on_hit", description: "5% chance to deal bonus nature damage" }
    ],

    // Ownership
    equippedBy: { heroId: "hero1", heroName: "Sir Bumblefoot" },
    locked: false,

    // Source
    acquiredFrom: {
      type: "expedition",
      source: "Whispering Woods",
      date: 1704000000000
    },

    // Economy
    sellValue: 150,
    salvageValue: { type: "rare_crystal", amount: 2 }
  }
}
```

**Related User Stories:** US-EQ-005, US-EQ-006, US-EQ-007
**Priority:** Phase 1

---

#### POST /api/equipment/:id/equip
Equip item to a hero.

```typescript
// Request
POST /api/equipment/item123/equip
{
  "heroId": "hero456"
}

// Response
{
  success: true,
  data: {
    itemId: "item123",
    heroId: "hero456",
    slot: "weapon",
    previousItem: ItemSummary | null,
    statChanges: {
      attack: { from: 35, to: 45, diff: 10 },
      power: { from: 1100, to: 1210, diff: 110 }
    },
    setChanges: {
      activated: ["forest_2pc"],
      deactivated: []
    }
  }
}
```

**Related User Stories:** US-EQ-009
**Priority:** Phase 1

---

#### POST /api/equipment/:id/unequip
Unequip item from hero.

```typescript
// Request
POST /api/equipment/item123/unequip

// Response
{
  success: true,
  data: {
    itemId: "item123",
    heroId: "hero456",
    unequipped: true
  }
}
```

**Related User Stories:** US-EQ-012
**Priority:** Phase 1

---

#### POST /api/equipment/:id/lock
Lock item to prevent accidental disposal.

```typescript
// Request
POST /api/equipment/item123/lock

// Response
{
  success: true,
  data: {
    itemId: "item123",
    locked: true
  }
}
```

**Related User Stories:** US-EQ-025
**Priority:** Phase 1

---

#### POST /api/equipment/:id/unlock
Unlock a locked item.

```typescript
// Request
POST /api/equipment/item123/unlock

// Response
{
  success: true,
  data: {
    itemId: "item123",
    locked: false
  }
}
```

**Related User Stories:** US-EQ-025
**Priority:** Phase 1

---

#### POST /api/equipment/:id/sell
Sell item for gold.

```typescript
// Request
POST /api/equipment/item123/sell

// Response
{
  success: true,
  data: {
    itemId: "item123",
    sold: true,
    goldReceived: 150,
    newGoldTotal: 5150
  }
}

// Error (locked item)
{
  success: false,
  error: {
    code: "ITEM_LOCKED",
    message: "Cannot sell locked items"
  }
}
```

**Related User Stories:** US-EQ-022
**Priority:** Phase 1

---

#### POST /api/equipment/sell-bulk
Sell multiple items.

```typescript
// Request
POST /api/equipment/sell-bulk
{
  "itemIds": ["item1", "item2", "item3"]
}

// Response
{
  success: true,
  data: {
    sold: 3,
    skipped: 0,  // Locked items
    goldReceived: 450,
    newGoldTotal: 5450
  }
}
```

**Related User Stories:** US-EQ-022
**Priority:** Phase 1

---

#### POST /api/equipment/:id/salvage
Salvage item for materials.

```typescript
// Request
POST /api/equipment/item123/salvage

// Response
{
  success: true,
  data: {
    itemId: "item123",
    salvaged: true,
    materialsReceived: [
      { type: "rare_crystal", amount: 2 }
    ]
  }
}
```

**Related User Stories:** US-EQ-023
**Priority:** Phase 2

---

#### POST /api/equipment/salvage-bulk
Salvage multiple items.

```typescript
// Request
POST /api/equipment/salvage-bulk
{
  "itemIds": ["item1", "item2", "item3"]
}

// Response
{
  success: true,
  data: {
    salvaged: 3,
    skipped: 0,
    materialsReceived: [
      { type: "common_shard", amount: 5 },
      { type: "rare_crystal", amount: 4 }
    ]
  }
}
```

**Related User Stories:** US-EQ-023
**Priority:** Phase 2

---

#### GET /api/equipment/compare
Compare multiple items.

```typescript
// Request
GET /api/equipment/compare?ids=item1,item2,item3&heroId=hero123

// Response
{
  success: true,
  data: {
    items: [
      {
        item: ItemDetail,
        heroStats: {  // Stats if equipped on hero
          power: 1250,
          attack: 85,
          defense: 60
        }
      }
    ],
    differences: {
      power: [1250, 1180, 1320],
      attack: [85, 78, 92]
    },
    recommendation: "item3",  // Best for hero
    reasonmation: "Highest power increase (+70)"
  }
}
```

**Related User Stories:** US-EQ-008
**Priority:** Phase 2

---

#### POST /api/equipment/auto-equip
Auto-equip best gear for a hero.

```typescript
// Request
POST /api/equipment/auto-equip
{
  "heroId": "hero123",
  "strategy": "power"  // or "set_completion"
}

// Response
{
  success: true,
  data: {
    heroId: "hero123",
    changes: [
      {
        slot: "weapon",
        previousItem: ItemSummary,
        newItem: ItemSummary,
        improvement: 15
      }
    ],
    totalPowerChange: { from: 1100, to: 1350, diff: 250 },
    canRevert: true,
    revertToken: "revert_abc123"  // Use within 5 min
  }
}
```

**Related User Stories:** US-EQ-010
**Priority:** Phase 2

---

#### POST /api/equipment/auto-equip/revert
Revert last auto-equip.

```typescript
// Request
POST /api/equipment/auto-equip/revert
{
  "revertToken": "revert_abc123"
}

// Response
{
  success: true,
  data: {
    reverted: true,
    heroId: "hero123"
  }
}
```

**Related User Stories:** US-EQ-010
**Priority:** Phase 2

---

## 6. Sets API

Base path: `/api/sets`

### Set Tracking

#### GET /api/sets
List all equipment sets and collection progress.

```typescript
// Request
GET /api/sets?status=partial

// Response
{
  success: true,
  data: SetProgress[],
  meta: {
    totalSets: 25,
    completedSets: 3,
    partialSets: 8
  }
}

interface SetProgress {
  id: string
  name: string
  description: string
  pieces: {
    slot: string
    owned: boolean
    ownedCount: number
    bestOwned?: ItemSummary
    equippedOn?: string  // Hero name
  }[]
  bonuses: SetBonus[]
  activeBonusCount: number
  farmingLocations: string[]
}
```

**Related User Stories:** US-EQ-013, US-EQ-014
**Priority:** Phase 2

---

#### GET /api/sets/:id
Get detailed set information.

```typescript
// Response
{
  success: true,
  data: {
    id: "forest_set",
    name: "Forest Guardian",
    description: "Worn by ancient protectors...",

    pieces: [
      {
        slot: "weapon",
        name: "Guardian's Blade",
        owned: true,
        ownedItems: [ItemSummary, ItemSummary],
        farmLocation: "Whispering Woods"
      }
    ],

    bonuses: [
      {
        pieces: 2,
        effect: "+10% forest efficiency",
        description: "The forest recognizes you...",
        stats: { forestEfficiency: 10 }
      },
      {
        pieces: 4,
        effect: "+25 defense",
        stats: { defense: 25 }
      }
    ],

    heroesWithSet: [
      { hero: HeroSummary, pieces: 3, activeBonuses: 1 }
    ]
  }
}
```

**Related User Stories:** US-EQ-006, US-EQ-014
**Priority:** Phase 2

---

## Summary

### Endpoint Count by Category
- **Heroes:** 6 endpoints
- **Tavern:** 5 endpoints
- **Expeditions:** 7 endpoints
- **Zones:** 4 endpoints
- **Equipment:** 13 endpoints
- **Sets:** 2 endpoints

**Total:** 37 endpoints

### Implementation Priority

**Phase 1 (MVP):**
- All Heroes endpoints
- All Tavern endpoints
- All Expeditions endpoints (except complex events)
- GET /api/zones, GET /api/zones/:id
- Equipment: list, detail, equip, unequip, sell, lock

**Phase 2:**
- Zone assignments (passive income)
- Equipment: compare, auto-equip, salvage
- All Sets endpoints
- Complex expedition events

**Phase 3+:**
- Loadouts system
- Advanced optimization tools
- Statistics and analytics
