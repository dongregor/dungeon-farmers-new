# Dungeon Building APIs

**Category:** Monsters, Schematics, Dungeons
**Total Endpoints:** ~30
**Priority:** Phase 2

---

## 1. Monsters API

Base path: `/api/monsters`

### US-DB-001 to US-DB-012: Monster Capture & Collection

#### GET /api/monsters
List all captured monsters.

```typescript
// Request
GET /api/monsters?rarity=Rare&assigned=false&sort=power

// Query Parameters
interface MonsterListParams {
  page?: number
  limit?: number
  rarity?: string
  type?: string          // "beast", "undead", "elemental"
  assigned?: boolean     // Filter by dungeon assignment
  dungeonId?: string     // Monsters in specific dungeon
  sort?: 'power' | 'rarity' | 'captured' | 'name'
  order?: 'asc' | 'desc'
  search?: string
}

// Response
{
  success: true,
  data: MonsterSummary[],
  meta: {
    page: 1,
    total: 45,
    capacity: { current: 45, max: 100 }
  }
}

interface MonsterSummary {
  id: string
  templateId: string
  name: string
  type: string
  rarity: Rarity
  power: number
  level: number

  traits: TraitSummary[]
  lootPreview: string[]   // Top 3 notable drops

  assignedTo?: {
    dungeonId: string
    dungeonName: string
    slotIndex: number
  }

  capturedFrom: string    // Zone name
  capturedAt: number
}
```

**Related User Stories:** US-DB-001, US-DB-002
**Priority:** Phase 2

---

#### GET /api/monsters/:id
Get detailed monster information.

```typescript
// Response
{
  success: true,
  data: {
    id: "monster123",
    templateId: "forest_sprite",
    name: "Mystic Forest Sprite",
    description: "A playful elemental spirit...",

    type: "elemental",
    subtype: "nature",
    rarity: "Rare",
    level: 15,
    power: 450,

    // Stats
    stats: {
      health: 1200,
      attack: 85,
      defense: 45,
      speed: 120
    },

    // Traits
    traits: [
      {
        id: "nature_affinity",
        name: "Nature Affinity",
        description: "+25% loot when in forest dungeons",
        effect: { type: "loot_bonus", biome: "forest", value: 25 }
      }
    ],

    // Loot table
    lootTable: {
      gold: { base: 50, variance: 20 },
      items: [
        {
          templateId: "sprite_dust",
          name: "Sprite Dust",
          rarity: "Uncommon",
          dropRate: 0.35
        },
        {
          templateId: "nature_crystal",
          name: "Nature Crystal",
          rarity: "Rare",
          dropRate: 0.08
        }
      ],
      materials: [
        { type: "essence_nature", chance: 0.5, amount: { min: 1, max: 3 } }
      ]
    },

    // Synergies
    synergies: {
      types: ["elemental", "nature"],
      dungeonBonuses: [
        { dungeonType: "forest", bonus: "+15% all loot" }
      ],
      monsterSynergies: [
        { withType: "beast", bonus: "+10% experience" }
      ]
    },

    // Assignment
    assignedTo: {
      dungeonId: "dungeon123",
      dungeonName: "My Forest Dungeon",
      slotIndex: 2,
      slotType: "elemental"
    },

    // History
    capturedFrom: {
      zoneId: "zone_forest",
      zoneName: "Whispering Woods",
      date: 1704000000000
    },

    // Statistics
    stats_history: {
      timesDefeated: 127,
      totalLootDropped: 15000,
      bestDrop: ItemSummary
    }
  }
}
```

**Related User Stories:** US-DB-003, US-DB-004
**Priority:** Phase 2

---

#### POST /api/monsters/:id/assign
Assign monster to a dungeon slot.

```typescript
// Request
POST /api/monsters/monster123/assign
{
  "dungeonId": "dungeon456",
  "slotIndex": 2
}

// Response
{
  success: true,
  data: {
    monsterId: "monster123",
    dungeonId: "dungeon456",
    slotIndex: 2,
    slotType: "elemental",
    matchBonus: 25,  // Percentage bonus for type match

    dungeonUpdates: {
      totalPower: { from: 1200, to: 1650, diff: 450 },
      synergyBonuses: [
        { type: "elemental_2", effect: "+10% elemental loot", active: true }
      ]
    }
  }
}

// Error responses
{
  success: false,
  error: {
    code: "SLOT_OCCUPIED",
    message: "Slot 2 already has a monster assigned",
    details: { currentMonster: "Ancient Treant" }
  }
}

{
  success: false,
  error: {
    code: "TYPE_MISMATCH",
    message: "This slot requires a 'beast' type monster",
    details: { required: "beast", provided: "elemental" }
  }
}
```

**Related User Stories:** US-DB-005, US-DB-006
**Priority:** Phase 2

---

#### POST /api/monsters/:id/unassign
Remove monster from dungeon.

```typescript
// Request
POST /api/monsters/monster123/unassign

// Response
{
  success: true,
  data: {
    monsterId: "monster123",
    unassigned: true,
    previousDungeon: "dungeon456",
    previousSlot: 2
  }
}
```

**Related User Stories:** US-DB-007
**Priority:** Phase 2

---

#### POST /api/monsters/:id/release
Release monster (delete from collection).

```typescript
// Request
POST /api/monsters/monster123/release
{
  "confirm": true
}

// Response
{
  success: true,
  data: {
    monsterId: "monster123",
    released: true,
    rewards: {
      essence: { type: "monster_essence", amount: 5 }
    }
  }
}

// Error (assigned monster)
{
  success: false,
  error: {
    code: "MONSTER_ASSIGNED",
    message: "Cannot release a monster assigned to a dungeon",
    details: { dungeon: "My Forest Dungeon" }
  }
}
```

**Related User Stories:** US-DB-008
**Priority:** Phase 2

---

#### GET /api/monsters/templates
Get all discoverable monster types.

```typescript
// Response
{
  success: true,
  data: {
    discovered: MonsterTemplate[],
    undiscovered: number,
    totalTemplates: 150
  }
}

interface MonsterTemplate {
  id: string
  name: string
  type: string
  rarity: Rarity
  discovered: boolean
  captureCount: number
  bestCaptured?: MonsterSummary
  locations: string[]  // Zones where found
}
```

**Related User Stories:** US-DB-009
**Priority:** Phase 2

---

## 2. Schematics API

Base path: `/api/schematics`

### US-DB-013 to US-DB-020: Schematic Collection

#### GET /api/schematics
List all collected schematics.

```typescript
// Request
GET /api/schematics?rarity=Epic&unlocked=true

// Query Parameters
interface SchematicListParams {
  page?: number
  limit?: number
  rarity?: string
  biome?: string
  unlocked?: boolean   // Has been built at least once
  sort?: 'rarity' | 'acquired' | 'name' | 'power'
}

// Response
{
  success: true,
  data: SchematicSummary[],
  meta: {
    total: 25,
    discovered: 25,
    totalAvailable: 50
  }
}

interface SchematicSummary {
  id: string
  name: string
  biome: string
  rarity: Rarity
  slotCount: number
  slotTypes: string[]

  unlocked: boolean
  timesBuilt: number

  bestLoot: string[]
  estimatedValue: number

  acquiredFrom: string
  acquiredAt: number
}
```

**Related User Stories:** US-DB-013, US-DB-014
**Priority:** Phase 2

---

#### GET /api/schematics/:id
Get detailed schematic information.

```typescript
// Response
{
  success: true,
  data: {
    id: "schematic_ancient_forest",
    name: "Ancient Forest Ruins",
    description: "Crumbling ruins deep in the forest...",

    biome: "forest",
    rarity: "Epic",

    // Slot configuration
    slots: [
      { index: 0, type: "any", powerMultiplier: 1.0 },
      { index: 1, type: "beast", powerMultiplier: 1.2 },
      { index: 2, type: "elemental", powerMultiplier: 1.2 },
      { index: 3, type: "nature", powerMultiplier: 1.5 },
      { index: 4, type: "any", powerMultiplier: 1.0 }
    ],

    // Base stats
    baseStats: {
      runDuration: 3600000,  // 1 hour base
      lootMultiplier: 1.5,
      experienceMultiplier: 1.2
    },

    // Possible synergies
    synergies: [
      {
        id: "forest_harmony",
        name: "Forest Harmony",
        requirement: "3+ nature monsters",
        effect: "+25% nature item drops"
      }
    ],

    // Requirements to build
    buildRequirements: {
      gold: 5000,
      materials: [
        { type: "ancient_stone", amount: 10 }
      ]
    },

    // Collection info
    unlocked: true,
    timesBuilt: 3,
    acquiredFrom: {
      type: "expedition",
      zone: "Ancient Ruins",
      date: 1704000000000
    },

    // Best builds
    recommendedMonsters: MonsterSummary[]
  }
}
```

**Related User Stories:** US-DB-015, US-DB-016
**Priority:** Phase 2

---

## 3. Dungeons API

Base path: `/api/dungeons`

### US-DB-021 to US-DB-033: Dungeon Building & Running

#### GET /api/dungeons
List all player-built dungeons.

```typescript
// Response
{
  success: true,
  data: DungeonSummary[],
  meta: {
    dungeonSlots: { used: 3, max: 5 },
    totalRuns: 127,
    totalLootValue: 45000
  }
}

interface DungeonSummary {
  id: string
  name: string
  schematicId: string
  schematicName: string
  biome: string
  rarity: Rarity

  power: number
  efficiency: number

  monsters: {
    filled: number
    total: number
    types: string[]
  }

  synergies: {
    active: number
    total: number
  }

  lastRun?: number
  runCount: number

  status: 'ready' | 'incomplete' | 'running'
  currentRun?: {
    startedAt: number
    completesAt: number
  }
}
```

**Related User Stories:** US-DB-021
**Priority:** Phase 2

---

#### GET /api/dungeons/:id
Get detailed dungeon information.

```typescript
// Response
{
  success: true,
  data: {
    id: "dungeon123",
    name: "My Forest Dungeon",

    schematic: SchematicSummary,

    // Monster slots
    slots: [
      {
        index: 0,
        type: "any",
        powerMultiplier: 1.0,
        monster: MonsterSummary | null,
        matchBonus: 0
      },
      {
        index: 1,
        type: "beast",
        powerMultiplier: 1.2,
        monster: MonsterSummary,
        matchBonus: 20  // Type matches
      }
    ],

    // Calculated stats
    stats: {
      totalPower: 2500,
      efficiency: 135,
      runDuration: 3200000,  // Reduced from bonuses
      lootMultiplier: 1.8,
      experienceMultiplier: 1.5
    },

    // Active synergies
    synergies: [
      {
        id: "beast_pack",
        name: "Beast Pack",
        requirement: "2+ beast monsters",
        effect: "+15% beast loot",
        active: true,
        contributors: ["monster1", "monster2"]
      }
    ],

    // Loot table (aggregated from monsters)
    lootTable: {
      gold: { min: 200, max: 400 },
      items: LootTableEntry[],
      materials: MaterialDrop[]
    },

    // Run history
    recentRuns: DungeonRunSummary[],
    statistics: {
      totalRuns: 47,
      totalGold: 15000,
      bestItem: ItemSummary,
      averageRunValue: 320
    },

    // Current run (if active)
    currentRun: DungeonRun | null,

    createdAt: number,
    lastModified: number
  }
}
```

**Related User Stories:** US-DB-022, US-DB-023
**Priority:** Phase 2

---

#### POST /api/dungeons
Create a new dungeon from schematic.

```typescript
// Request
POST /api/dungeons
{
  "schematicId": "schematic_ancient_forest",
  "name": "My Forest Dungeon"
}

// Response
{
  success: true,
  data: {
    dungeon: DungeonDetail,
    resourcesSpent: {
      gold: 5000,
      materials: [{ type: "ancient_stone", amount: 10 }]
    },
    slotsRemaining: 2
  }
}

// Error
{
  success: false,
  error: {
    code: "INSUFFICIENT_MATERIALS",
    message: "Not enough ancient_stone (need 10, have 7)",
    details: { required: 10, have: 7 }
  }
}
```

**Related User Stories:** US-DB-024
**Priority:** Phase 2

---

#### PATCH /api/dungeons/:id
Update dungeon (rename, etc.).

```typescript
// Request
PATCH /api/dungeons/dungeon123
{
  "name": "Epic Forest Dungeon"
}

// Response
{
  success: true,
  data: {
    id: "dungeon123",
    name: "Epic Forest Dungeon",
    updated: true
  }
}
```

**Related User Stories:** US-DB-025
**Priority:** Phase 2

---

#### DELETE /api/dungeons/:id
Demolish a dungeon.

```typescript
// Request
DELETE /api/dungeons/dungeon123?confirm=true

// Response
{
  success: true,
  data: {
    dungeonId: "dungeon123",
    demolished: true,
    monstersFreed: ["monster1", "monster2"],  // Returned to collection
    materialsRecovered: [
      { type: "ancient_stone", amount: 5 }  // Partial refund
    ]
  }
}
```

**Related User Stories:** US-DB-026
**Priority:** Phase 2

---

## 4. Dungeon Runs API

Base path: `/api/dungeons/:id/runs`

### Running and Farming Dungeons

#### GET /api/dungeons/:id/runs
List run history for a dungeon.

```typescript
// Request
GET /api/dungeons/dungeon123/runs?limit=10

// Response
{
  success: true,
  data: DungeonRunSummary[],
  meta: {
    total: 47,
    averageValue: 320,
    bestRun: DungeonRunSummary
  }
}

interface DungeonRunSummary {
  id: string
  startedAt: number
  completedAt: number
  duration: number

  efficiency: number

  rewards: {
    gold: number
    items: number
    materials: number
    totalValue: number
  }

  notableDrops: ItemSummary[]
}
```

**Related User Stories:** US-DB-027
**Priority:** Phase 2

---

#### POST /api/dungeons/:id/runs/start
Start a dungeon run (farming).

```typescript
// Request
POST /api/dungeons/dungeon123/runs/start

// Response
{
  success: true,
  data: {
    runId: "run789",
    dungeonId: "dungeon123",
    startedAt: 1704000000000,
    completesAt: 1704003600000,
    duration: 3600000,

    estimatedRewards: RewardPreview,

    status: "running"
  }
}

// Error
{
  success: false,
  error: {
    code: "DUNGEON_INCOMPLETE",
    message: "Dungeon must have at least 1 monster assigned",
    details: { monstersRequired: 1, monstersAssigned: 0 }
  }
}
```

**Related User Stories:** US-DB-028
**Priority:** Phase 2

---

#### GET /api/dungeons/:id/runs/:runId
Get current run status.

```typescript
// Response
{
  success: true,
  data: {
    id: "run789",
    dungeonId: "dungeon123",

    status: "running",
    startedAt: 1704000000000,
    completesAt: 1704003600000,
    progressPercent: 45,

    // Real-time log
    log: RunLogEntry[],

    estimatedRewards: RewardPreview
  }
}

interface RunLogEntry {
  timestamp: number
  type: 'monster_defeated' | 'loot_drop' | 'bonus_triggered'
  message: string
  details?: any
}
```

**Related User Stories:** US-DB-029
**Priority:** Phase 2

---

#### POST /api/dungeons/:id/runs/:runId/complete
Complete dungeon run and claim rewards.

```typescript
// Request
POST /api/dungeons/dungeon123/runs/run789/complete

// Response
{
  success: true,
  data: {
    runId: "run789",
    completed: true,

    rewards: {
      gold: 350,
      items: [ItemDetail, ItemDetail],
      materials: [
        { type: "essence_nature", amount: 5 }
      ],
      experience: 500,
      totalValue: 850
    },

    statistics: {
      monstersDefeated: 5,
      synergyBonusesTriggered: 2,
      luckRolls: 3
    },

    log: RunLogEntry[],

    // Streak bonus (consecutive runs)
    streakBonus: {
      current: 5,
      bonus: "+5% loot",
      nextBonus: "+7% loot at 7 runs"
    }
  }
}
```

**Related User Stories:** US-DB-030
**Priority:** Phase 2

---

#### POST /api/dungeons/:id/runs/:runId/cancel
Cancel active run.

```typescript
// Request
POST /api/dungeons/dungeon123/runs/run789/cancel

// Response
{
  success: true,
  data: {
    runId: "run789",
    cancelled: true,
    partialRewards: {
      gold: 50
    }
  }
}
```

**Related User Stories:** US-DB-031
**Priority:** Phase 2

---

## 5. Synergies API

Base path: `/api/synergies`

### Synergy Calculation and Preview

#### GET /api/synergies/calculate
Calculate synergies for a dungeon configuration.

```typescript
// Request
GET /api/synergies/calculate?dungeonId=dungeon123

// Or preview without saving
GET /api/synergies/calculate?schematicId=schematic1&monsters=m1,m2,m3

// Response
{
  success: true,
  data: {
    activeSynergies: [
      {
        id: "beast_pack",
        name: "Beast Pack",
        requirement: "2+ beast monsters",
        effect: "+15% beast loot",
        active: true,
        contributors: ["m1", "m2"],
        value: 15
      }
    ],

    potentialSynergies: [
      {
        id: "elemental_harmony",
        name: "Elemental Harmony",
        requirement: "3+ elemental monsters",
        effect: "+25% elemental loot",
        active: false,
        progress: "2/3 elementals",
        missingTypes: ["elemental"]
      }
    ],

    totalBonuses: {
      lootMultiplier: 1.15,
      experienceMultiplier: 1.0,
      goldMultiplier: 1.05,
      durationReduction: 0
    },

    recommendations: [
      {
        action: "Add elemental monster to slot 3",
        effect: "Activates Elemental Harmony (+25% elemental loot)",
        suggestedMonsters: MonsterSummary[]
      }
    ]
  }
}
```

**Related User Stories:** US-DB-032
**Priority:** Phase 2

---

#### GET /api/synergies/types
Get all synergy types and requirements.

```typescript
// Response
{
  success: true,
  data: {
    monsterSynergies: [
      {
        id: "beast_pack",
        name: "Beast Pack",
        requirement: { type: "beast", count: 2 },
        effect: { lootBonus: 15, type: "beast" },
        tier: 1
      },
      {
        id: "beast_army",
        name: "Beast Army",
        requirement: { type: "beast", count: 4 },
        effect: { lootBonus: 35, type: "beast" },
        tier: 2
      }
    ],

    biomeSynergies: [
      {
        id: "forest_harmony",
        name: "Forest Harmony",
        requirement: { biome: "forest", monsterTypes: ["nature", "beast"] },
        effect: { allLoot: 20 }
      }
    ],

    specialSynergies: [
      {
        id: "elemental_chaos",
        name: "Elemental Chaos",
        requirement: "One of each elemental type",
        effect: { experienceBonus: 50 }
      }
    ]
  }
}
```

**Related User Stories:** US-DB-033
**Priority:** Phase 2

---

## Summary

### Endpoint Count by Category
- **Monsters:** 6 endpoints
- **Schematics:** 2 endpoints
- **Dungeons:** 5 endpoints
- **Dungeon Runs:** 5 endpoints
- **Synergies:** 2 endpoints

**Total:** 20 endpoints

### Implementation Priority

**Phase 2 (Core Dungeon Building):**
- All Monsters endpoints
- All Schematics endpoints
- Dungeons: list, detail, create, update
- Dungeon Runs: start, complete
- Synergies: calculate

**Phase 2b:**
- Dungeons: delete
- Dungeon Runs: history, status, cancel
- Synergies: types reference
- Monster templates/codex

**Phase 3+:**
- Advanced synergy optimization
- Dungeon recommendations
- Automated farming
- Statistics and analytics
