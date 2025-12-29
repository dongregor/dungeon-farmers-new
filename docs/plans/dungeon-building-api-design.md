# Dungeon Building API Design

**Date:** 2025-12-29
**Status:** Comprehensive API specification for Phase 2
**Related:** User Stories (04-dungeon-building.md), Game Design v2

---

## Table of Contents

1. [Overview](#overview)
2. [Monsters API](#1-monsters-api)
3. [Schematics API](#2-schematics-api)
4. [Dungeons API](#3-dungeons-api)
5. [Dungeon Runs API](#4-dungeon-runs-api)
6. [Synergies API](#5-synergies-api)
7. [Data Models](#6-data-models)
8. [Implementation Phases](#7-implementation-phases)

---

## Overview

### Design Principles
- Follow Nuxt 4 server route conventions (`[method].ts` suffix)
- Supabase authentication via `serverSupabaseUser`
- Zod validation for all request bodies
- Mappers for snake_case ↔ camelCase conversion
- Detailed error responses with actionable messages
- Client-side calculations where possible, server validation always

### Authentication Pattern
All endpoints require authentication. Use standard pattern:
```typescript
const user = await serverSupabaseUser(event)
if (!user) {
  throw createError({ statusCode: 401, message: 'Unauthorized' })
}
```

### Error Response Format
```typescript
{
  statusCode: number
  statusMessage: string
  data?: {
    errors?: any[]
    message?: string
    [key: string]: any
  }
}
```

---

## 1. Monsters API

### 1.1 GET /api/monsters

**Purpose:** List all captured monsters for the authenticated player

**Related Stories:** US-DB-001 (View Monster Collection)

**Priority:** Phase 2a (Core Loop)

**Query Parameters:**
```typescript
{
  filter?: {
    type?: string[]           // Filter by monster type/family
    rarity?: string[]         // Filter by rarity tier
    zoneId?: string           // Filter by captured zone
    lootType?: string         // Filter by what loot they drop
    inDungeon?: boolean       // Show only/exclude placed monsters
  }
  sort?: 'power' | 'rarity' | 'recent' | 'alphabetical'
  limit?: number              // Pagination limit
  offset?: number             // Pagination offset
}
```

**Response:**
```typescript
{
  monsters: CapturedMonster[]
  total: number
  collectionStats: {
    totalCaptured: number
    totalUnique: number
    byType: Record<string, number>
    byRarity: Record<string, number>
    completionPercentage: number
  }
}
```

**Implementation Notes:**
- Query `captured_monsters` table joined with monster definitions
- Account-wide collection (not per-hero)
- Include `placed_in_dungeons` array to show usage
- Calculate stats server-side for accuracy
- Support complex filtering for advanced searches

**Validation:**
- Validate filter enums against allowed values
- Sanitize sort parameter
- Limit max results per page (100)

---

### 1.2 GET /api/monsters/[id]

**Purpose:** Get detailed information about a specific captured monster

**Related Stories:** US-DB-002 (View Monster Details)

**Priority:** Phase 2b (Optimization)

**Response:**
```typescript
{
  monster: CapturedMonster
  lootTable: {
    items: LootTableEntry[]
    dropRates: Record<string, number>
  }
  synergies: {
    compatible: string[]      // Monster types that synergize
    families: string[]        // Family synergies
    biomes: string[]         // Biome synergies
  }
  captureInfo: {
    capturedAt: string
    capturedFrom: {
      zoneId: string
      zoneName: string
      subzoneId: string
    }
    firstCapture: boolean
  }
  usage: {
    placedInDungeons: Dungeon[]
    timesUsed: number
  }
}
```

**Implementation Notes:**
- Join captured monster with base monster definition
- Calculate synergy information from synergy rules
- Include full capture metadata
- Show where monster is currently used

**Validation:**
- Verify monster ID exists in player's collection
- Return 404 if not found or not owned

---

### 1.3 GET /api/monsters/progress

**Purpose:** Track collection progress and missing monsters

**Related Stories:** US-DB-003 (Track Collection Progress), US-DB-009 (Track Capture Progress Per Zone)

**Priority:** Phase 3 (Depth)

**Query Parameters:**
```typescript
{
  groupBy?: 'type' | 'zone' | 'rarity'
  showMissing?: boolean
}
```

**Response:**
```typescript
{
  overall: {
    captured: number
    total: number
    percentage: number
  }
  byType: {
    [type: string]: {
      captured: number
      total: number
      percentage: number
      missing: MonsterSilhouette[]  // If showMissing=true
    }
  }
  byZone: {
    [zoneId: string]: {
      zoneName: string
      captured: number
      total: number
      percentage: number
      missing: MonsterSilhouette[]
    }
  }
  byRarity: {
    [rarity: string]: {
      captured: number
      total: number
    }
  }
  recentCaptures: CapturedMonster[]  // Last 10
  milestones: {
    next: number           // Next milestone at X monsters
    rewards: string[]      // What you get at milestone
  }
}
```

**Implementation Notes:**
- Heavy calculation - consider caching
- Silhouettes hide details of uncaptured monsters
- Calculate from all available monsters vs player's captures
- Track first capture dates for "recent" sorting

**Validation:**
- None required (read-only, no parameters)

---

### 1.4 GET /api/monsters/by-zone/[zoneId]

**Purpose:** Show monsters available in a specific zone with capture rates

**Related Stories:** US-DB-006 (See Capture Rates and Availability)

**Priority:** Phase 2b (Optimization)

**Response:**
```typescript
{
  zone: {
    id: string
    name: string
  }
  monsters: {
    monster: MonsterDefinition
    captured: boolean
    captureRate: {
      base: number           // Base chance %
      withEfficiency: {      // Range based on efficiency
        min: number          // At 60% efficiency
        max: number          // At 150% efficiency
      }
    }
    rarity: string
    firstCaptureBonus: boolean  // If not captured yet
  }[]
  summary: {
    total: number
    captured: number
    new: number             // Not yet captured
  }
}
```

**Implementation Notes:**
- Query zone's monster spawns
- Cross-reference with player's captures
- Calculate capture rates based on monster rarity + zone difficulty
- Hero traits may modify rates (note in response)

**Validation:**
- Verify zone exists
- Return 404 for invalid zoneId

---

### 1.5 GET /api/monsters/loot-tables/[monsterId]

**Purpose:** Get detailed loot table for a monster type

**Related Stories:** US-DB-002 (View Monster Details), US-DB-027 (Target Specific Gear)

**Priority:** Phase 2b (Optimization)

**Response:**
```typescript
{
  monster: {
    id: string
    name: string
    rarity: string
  }
  lootTable: {
    guaranteed: LootDrop[]    // 100% drop rate
    common: LootDrop[]        // 50-80%
    uncommon: LootDrop[]      // 20-50%
    rare: LootDrop[]          // 5-20%
    veryRare: LootDrop[]      // <5%
  }
  rarityComparison?: {        // If multiple rarities exist
    [rarity: string]: {
      lootQuality: number
      additionalDrops: LootDrop[]
    }
  }
}

interface LootDrop {
  itemId: string
  itemName: string
  itemType: 'equipment' | 'material' | 'currency'
  dropChance: number
  quantity: { min: number, max: number }
}
```

**Implementation Notes:**
- Load from monster definition's loot table
- Group by drop rate tiers for clarity
- Compare rarities if monster has multiple versions
- Used for planning which dungeons to build

**Validation:**
- Verify monster definition exists
- Return 404 for invalid monster

---

## 2. Schematics API

### 2.1 GET /api/schematics

**Purpose:** List all collected schematics for the authenticated player

**Related Stories:** US-DB-010 (View Schematic Collection)

**Priority:** Phase 2a (Core Loop)

**Query Parameters:**
```typescript
{
  filter?: {
    rarity?: string[]
    slotCount?: number[]
    rewardType?: string[]
    buildable?: boolean      // Has monsters for all slots
    inUse?: boolean         // Currently used in active dungeon
  }
  sort?: 'recent' | 'rarity' | 'slots' | 'name'
  limit?: number
  offset?: number
}
```

**Response:**
```typescript
{
  schematics: {
    schematic: Schematic
    collectedAt: string
    buildable: boolean
    inUse: boolean
    activeDungeons: number    // Count of active dungeons using this
  }[]
  total: number
  stats: {
    totalCollected: number
    byRarity: Record<string, number>
    buildableCount: number
  }
}
```

**Implementation Notes:**
- Query `player_schematics` table
- Calculate buildable status by checking slot requirements vs monster collection
- Show which schematics are in active use
- Client can filter for "buildable now"

**Validation:**
- Validate filter parameters
- Limit pagination (max 100 per page)

---

### 2.2 GET /api/schematics/[id]

**Purpose:** View detailed schematic requirements and rewards

**Related Stories:** US-DB-011 (View Schematic Details)

**Priority:** Phase 2a (Core Loop)

**Response:**
```typescript
{
  schematic: Schematic
  requirements: {
    slots: SlotRequirement[]
    totalSlots: number
  }
  canBuild: {
    buildable: boolean
    fulfilled: number         // Slots player can fill
    missing: SlotRequirement[] // Slots without monsters
  }
  rewards: {
    baseRewards: RewardDefinition
    estimatedLoot: LootEstimate  // Based on typical monsters
    completionTime: number       // Minutes
  }
  synergies: {
    potential: SynergyRule[]  // Synergies available with this schematic
    discovered: string[]      // IDs of synergies player found
  }
  sources: {
    dropFrom: string[]        // Zone/mission IDs
    dropRate: number
  }
}

interface SlotRequirement {
  slotId: string
  types: string[]            // Allowed monster types ["Beast", "Dragon"]
  anyType: boolean           // True if "Any" slot
  playerHasMonsters: boolean // Can fill this slot
  availableMonsters: number  // Count of owned monsters that fit
}
```

**Implementation Notes:**
- Join schematic with player's monster collection
- Calculate which slots are fillable
- Show "almost buildable" (e.g., 3/4 slots)
- Link to monster collection filtered by requirements
- Estimate rewards based on average monster power

**Validation:**
- Verify schematic exists in player's collection
- Return 404 if not collected

---

### 2.3 GET /api/schematics/buildable

**Purpose:** Quickly filter to buildable schematics only

**Related Stories:** US-DB-012 (Identify Buildable Schematics)

**Priority:** Phase 2a (Core Loop)

**Response:**
```typescript
{
  buildable: {
    schematic: Schematic
    readyToActivate: boolean   // All slots can be perfectly filled
    partialMatch: number       // Percentage of slots fillable
  }[]
  almostBuildable: {           // 1-2 monsters away
    schematic: Schematic
    missingTypes: string[]
    slotsNeeded: number
  }[]
  total: number
}
```

**Implementation Notes:**
- Filter schematics where all slot requirements can be met
- Separate "fully buildable" from "partially buildable"
- "Almost buildable" helps guide farming targets
- Real-time updates as collection grows

**Validation:**
- None (filtered subset of owned schematics)

---

### 2.4 GET /api/schematics/sources/[schematicId]

**Purpose:** Show where to find a specific schematic

**Related Stories:** US-DB-013 (Track Schematic Sources)

**Priority:** Phase 3 (Depth)

**Response:**
```typescript
{
  schematic: {
    id: string
    name: string
    collected: boolean
  }
  sources: {
    zoneId: string
    zoneName: string
    subzoneId?: string
    subzoneName?: string
    dropRate: number
    requirements: {
      minPower?: number
      unlocked: boolean
    }
  }[]
  playerAttempts?: {         // If collected
    totalRuns: number
    runsUntilDrop: number
    luckyDrop: boolean       // Got it faster than average
  }
}
```

**Implementation Notes:**
- Query drop tables for schematic sources
- Show all possible sources with rates
- Track player's attempts (for statistics)
- Help plan farming routes

**Validation:**
- Verify schematic definition exists

---

## 3. Dungeons API

### 3.1 POST /api/dungeons

**Purpose:** Create a new dungeon from a schematic

**Related Stories:** US-DB-014 (Create Dungeon from Schematic)

**Priority:** Phase 2a (Core Loop)

**Request Body:**
```typescript
{
  schematicId: string
  name?: string               // Optional custom name
  monsters: {
    slotId: string
    capturedMonsterId: string  // From player's collection
  }[]
  status: 'draft' | 'active'   // Save draft or activate
}
```

**Response:**
```typescript
{
  dungeon: Dungeon
  validation: {
    valid: boolean
    errors: ValidationError[]
    warnings: string[]        // e.g., "Could optimize slot 3"
  }
  preview: {
    power: number
    estimatedRewards: LootEstimate
    synergies: AppliedSynergy[]
    efficiency: number        // 0-100 quality score
  }
}
```

**Implementation Notes:**
- Validate all slot requirements are met
- Verify player owns all specified monsters
- Check monsters aren't already placed (if re-using)
- Calculate power and synergies server-side
- Enforce active dungeon slot limits (5 free, 10 supporter)
- Auto-generate name if not provided

**Validation:**
```typescript
const createDungeonSchema = z.object({
  schematicId: z.string().uuid(),
  name: z.string().min(1).max(50).optional(),
  monsters: z.array(z.object({
    slotId: z.string(),
    capturedMonsterId: z.string().uuid()
  })).min(1).max(20),
  status: z.enum(['draft', 'active'])
})
```

**Error Cases:**
- 400: Validation failed (wrong monster types, missing slots)
- 403: Slot limit reached (active dungeons)
- 404: Schematic not found or not owned
- 409: Monster already placed in another dungeon

---

### 3.2 GET /api/dungeons

**Purpose:** List player's dungeons (active, inactive, drafts)

**Related Stories:** US-DB-025 (Send Heroes to Farm Dungeons), US-DB-032 (Organize and Label)

**Priority:** Phase 2a (Core Loop)

**Query Parameters:**
```typescript
{
  status?: 'active' | 'inactive' | 'draft' | 'all'
  sort?: 'recent' | 'name' | 'power' | 'rewards'
  tags?: string[]            // Custom tags
  search?: string            // Search by name
}
```

**Response:**
```typescript
{
  dungeons: {
    dungeon: Dungeon
    stats: {
      totalRuns: number
      averageTime: number
      totalLoot: number
      lastRunAt?: string
    }
    availability: {
      canRun: boolean
      heroesAvailable: number
      currentlyRunning: boolean
    }
  }[]
  limits: {
    active: number           // Current count
    maxActive: number        // Based on supporter status
    draft: number
    maxDraft: number
    inactive: number         // Unlimited
  }
}
```

**Implementation Notes:**
- Query `dungeons` table filtered by player
- Include run statistics from `dungeon_runs`
- Check hero availability for "can run now"
- Show slot usage prominently for management

**Validation:**
- Sanitize search input
- Validate status enum

---

### 3.3 GET /api/dungeons/[id]

**Purpose:** Get detailed dungeon information

**Related Stories:** US-DB-017 (Preview Dungeon Rewards), US-DB-033 (View Dungeon Statistics)

**Priority:** Phase 2a (Core Loop)

**Response:**
```typescript
{
  dungeon: Dungeon
  monsters: {
    slot: SlotDefinition
    monster: CapturedMonster
    contribution: {
      power: number
      lootBonus: number
      synergies: string[]    // Active synergy IDs
    }
  }[]
  rewards: {
    lootTable: CombinedLootTable
    dropRates: Record<string, number>
    synergiesBonuses: {
      synergyId: string
      effect: string
      bonus: number
    }[]
    estimatedValue: number
  }
  requirements: {
    recommendedPower: number
    minimumPower: number
    duration: number         // Minutes
  }
  statistics: {
    totalRuns: number
    successRate: number      // Always 100%, but efficiency varies
    averageEfficiency: number
    totalLoot: LootSummary
    bestRun: RunSummary
    recentRuns: RunSummary[] // Last 5
  }
}
```

**Implementation Notes:**
- Calculate combined loot table from all monsters
- Apply synergy bonuses to rates
- Load run statistics from history
- Show optimization opportunities

**Validation:**
- Verify dungeon belongs to player
- Return 404 if not found or not owned

---

### 3.4 PATCH /api/dungeons/[id]

**Purpose:** Update dungeon (swap monsters, rename, change status)

**Related Stories:** US-DB-029 (Swap Monsters), US-DB-030 (Deactivate), US-DB-032 (Organize)

**Priority:** Phase 2b (Optimization)

**Request Body:**
```typescript
{
  name?: string
  tags?: string[]
  monsters?: {
    slotId: string
    capturedMonsterId: string
  }[]
  status?: 'active' | 'inactive' | 'draft'
}
```

**Response:**
```typescript
{
  dungeon: Dungeon
  changes: {
    monstersSwapped: number
    statusChanged: boolean
    powerDelta: number        // Change in dungeon power
    lootTableChanged: boolean
  }
  validation: {
    valid: boolean
    errors: ValidationError[]
  }
  preview: {                  // If monsters changed
    newPower: number
    newRewards: LootEstimate
    synergiesChanged: boolean
  }
}
```

**Implementation Notes:**
- Can't swap during active run (check in_use flag)
- Re-validate slot requirements if monsters change
- Recalculate synergies after swap
- Allow status change only if valid
- Track modification history (for stats)

**Validation:**
```typescript
const updateDungeonSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  tags: z.array(z.string()).max(10).optional(),
  monsters: z.array(z.object({
    slotId: z.string(),
    capturedMonsterId: z.string().uuid()
  })).optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional()
})
```

**Error Cases:**
- 400: Validation failed, dungeon in use
- 403: Exceeds active slot limit
- 404: Dungeon not found

---

### 3.5 DELETE /api/dungeons/[id]

**Purpose:** Delete a dungeon draft

**Related Stories:** US-DB-018 (Save Incomplete Dungeons)

**Priority:** Phase 2b (Optimization)

**Response:**
```typescript
{
  deleted: boolean
  freedMonsters: string[]    // Monster IDs now available
}
```

**Implementation Notes:**
- Only allow deletion of drafts and inactive dungeons
- Active dungeons must be deactivated first
- Free up monsters for reuse
- Soft delete (keep history) or hard delete

**Validation:**
- Verify dungeon belongs to player
- Verify status is draft or inactive

**Error Cases:**
- 400: Cannot delete active dungeon
- 404: Dungeon not found

---

### 3.6 GET /api/dungeons/[id]/preview

**Purpose:** Preview rewards before building/swapping

**Related Stories:** US-DB-017 (Preview Dungeon Rewards)

**Priority:** Phase 2b (Optimization)

**Request Body (POST alternative for complex preview):**
```typescript
{
  monsters: {
    slotId: string
    capturedMonsterId: string
  }[]
}
```

**Response:**
```typescript
{
  power: number
  lootTable: {
    [itemId: string]: {
      itemName: string
      dropChance: number
      source: string         // Which monster
    }
  }
  synergies: {
    active: AppliedSynergy[]
    potential: SynergyRule[] // Could activate with different monsters
  }
  efficiency: {
    score: number            // 0-100
    optimization: string[]   // Suggestions
  }
  comparison?: {             // If updating existing
    powerDelta: number
    newDrops: string[]       // Items now available
    lostDrops: string[]      // Items no longer drop
  }
}
```

**Implementation Notes:**
- Client-side calculation with server validation
- Used in builder UI for real-time feedback
- Compare configurations easily
- Suggest optimizations

**Validation:**
- Verify all monsters owned by player
- Validate against schematic requirements

---

### 3.7 GET /api/dungeons/[id]/statistics

**Purpose:** Detailed statistics for a specific dungeon

**Related Stories:** US-DB-033 (View Dungeon Statistics)

**Priority:** Phase 3 (Depth)

**Query Parameters:**
```typescript
{
  period?: 'day' | 'week' | 'month' | 'all'
  includeRuns?: boolean     // Include individual run details
}
```

**Response:**
```typescript
{
  dungeon: {
    id: string
    name: string
    createdAt: string
  }
  summary: {
    totalRuns: number
    averageCompletionTime: number  // Minutes
    totalLootValue: number
    uniqueHeroesUsed: number
  }
  performance: {
    averageEfficiency: number
    bestEfficiency: number
    worstEfficiency: number
    efficiencyTrend: number[]  // Last 10 runs
  }
  loot: {
    totalItems: number
    byRarity: Record<string, number>
    topDrops: {
      itemId: string
      itemName: string
      dropCount: number
      expectedRate: number
      actualRate: number
    }[]
    rareDrops: {
      itemId: string
      droppedAt: string
      heroName: string
    }[]
  }
  runs?: DungeonRun[]        // If includeRuns=true, last 20
}
```

**Implementation Notes:**
- Aggregate from `dungeon_runs` table
- Calculate expected vs actual drop rates
- Track rare drop occurrences
- Consider data retention policy (keep last 100 runs?)

**Validation:**
- Verify dungeon belongs to player
- Validate period enum

---

### 3.8 POST /api/dungeons/[id]/optimize

**Purpose:** Get optimization suggestions for dungeon

**Related Stories:** US-DB-019 (Quick-Optimize Dungeon)

**Priority:** Phase 3 (Depth)

**Response:**
```typescript
{
  currentSetup: {
    power: number
    synergies: number
    efficiency: number
  }
  suggestions: {
    type: 'power' | 'synergy' | 'loot'
    slotId: string
    currentMonster: CapturedMonster
    suggestedMonster: CapturedMonster
    improvement: {
      powerGain: number
      synergyGain: string[]
      lootImprovement: string  // Description
    }
    reason: string
  }[]
  optimalSetup?: {           // Best possible with current collection
    monsters: Record<string, string>
    projectedPower: number
    projectedSynergies: AppliedSynergy[]
  }
}
```

**Implementation Notes:**
- Algorithm: maximize power + synergies + target loot
- Don't auto-apply (educational)
- Compare current vs potential
- Consider player's goals (loot type preference)

**Validation:**
- Verify dungeon belongs to player

---

## 4. Dungeon Runs API

### 4.1 POST /api/dungeons/[id]/start

**Purpose:** Start a dungeon run with selected heroes

**Related Stories:** US-DB-025 (Send Heroes to Farm Dungeons)

**Priority:** Phase 2a (Core Loop)

**Request Body:**
```typescript
{
  heroIds: string[]          // 1-4 heroes
}
```

**Response:**
```typescript
{
  run: DungeonRun
  heroes: Hero[]             // Updated with is_on_expedition=true
  estimatedCompletion: string  // ISO timestamp
  preview: {
    power: number
    vsRequirement: number
    efficiency: number       // Estimated 60-150%
    estimatedLoot: LootEstimate
  }
}
```

**Implementation Notes:**
- Similar to expedition start logic
- Check heroes available (not on expedition/stationed)
- Calculate team power vs dungeon difficulty
- Estimate efficiency and loot
- Mark heroes as busy
- Set completion timer based on dungeon definition

**Validation:**
```typescript
const startDungeonRunSchema = z.object({
  heroIds: z.array(z.string().uuid()).min(1).max(4)
})
```

**Error Cases:**
- 400: Heroes busy, exhausted, invalid count
- 403: Dungeon not active
- 404: Dungeon not found

---

### 4.2 GET /api/dungeons/runs/[runId]

**Purpose:** Get status of an active or completed dungeon run

**Related Stories:** US-DB-025 (Send Heroes), US-DB-026 (View Results)

**Priority:** Phase 2a (Core Loop)

**Response:**
```typescript
{
  run: DungeonRun
  dungeon: {
    id: string
    name: string
  }
  heroes: Hero[]
  status: 'in_progress' | 'completed' | 'collected'
  progress: {
    startedAt: string
    completesAt: string
    remainingMs: number
    percentComplete: number
  }
  results?: {                // If completed
    efficiency: number
    loot: LootResult[]
    log: ExpeditionLog       // Similar to expedition logs
    xpGained: Record<string, number>  // Per hero
  }
}
```

**Implementation Notes:**
- Check if run is complete based on timestamp
- Generate results on first completion check
- Cache results after generation
- Include trait reactions in log

**Validation:**
- Verify run belongs to player's heroes

---

### 4.3 POST /api/dungeons/runs/[runId]/complete

**Purpose:** Manually complete a finished run and collect rewards

**Related Stories:** US-DB-026 (View Dungeon Loot Results)

**Priority:** Phase 2a (Core Loop)

**Response:**
```typescript
{
  run: DungeonRun
  rewards: {
    loot: {
      item: Item
      source: {
        monsterId: string
        monsterName: string
      }
      rare: boolean
      synergyBonus: boolean
    }[]
    gold: number
    xp: Record<string, number>  // Per hero
  }
  heroes: Hero[]             // Updated (freed, xp gained)
  statistics: {
    efficiency: number
    vsExpected: {            // Actual vs expected drops
      better: string[]
      worse: string[]
      luckyDrops: string[]
    }
  }
  log: ExpeditionLog
}
```

**Implementation Notes:**
- Verify run is complete (time elapsed)
- Generate loot based on:
  - Dungeon's combined loot table
  - Efficiency modifier
  - Synergy bonuses
  - RNG rolls
- Track which monster dropped each item
- Apply XP to heroes
- Free heroes from expedition
- Mark run as collected
- Save to dungeon statistics

**Validation:**
- Verify run belongs to player
- Verify run is complete (not early)
- Verify run not already collected

**Error Cases:**
- 400: Run not yet complete
- 409: Rewards already collected

---

### 4.4 GET /api/dungeons/runs/active

**Purpose:** List all active dungeon runs for the player

**Related Stories:** US-DB-025 (Send Heroes to Farm)

**Priority:** Phase 2a (Core Loop)

**Response:**
```typescript
{
  runs: {
    run: DungeonRun
    dungeon: {
      id: string
      name: string
    }
    heroes: Hero[]
    remainingMs: number
    percentComplete: number
  }[]
  total: number
}
```

**Implementation Notes:**
- Query runs with status='in_progress'
- Calculate remaining time
- Include dungeon details for context
- Order by completion time (soonest first)

**Validation:**
- None (player's own runs)

---

### 4.5 GET /api/dungeons/runs/history

**Purpose:** View past dungeon runs

**Related Stories:** US-DB-033 (View Dungeon Statistics)

**Priority:** Phase 3 (Depth)

**Query Parameters:**
```typescript
{
  dungeonId?: string         // Filter by dungeon
  heroId?: string           // Filter by hero
  limit?: number
  offset?: number
  sortBy?: 'recent' | 'efficiency' | 'loot'
}
```

**Response:**
```typescript
{
  runs: {
    run: DungeonRun
    dungeon: SimpleDungeonInfo
    heroes: SimpleHeroInfo[]
    efficiency: number
    lootValue: number
    notableDrops: string[]   // Rare items
  }[]
  total: number
  aggregates: {
    totalRuns: number
    averageEfficiency: number
    totalLootValue: number
    bestRun: DungeonRun
  }
}
```

**Implementation Notes:**
- Query completed runs from history
- Paginate for performance
- Include aggregate statistics
- Filter options for analysis

**Validation:**
- Limit pagination (max 100)
- Validate filter parameters

---

## 5. Synergies API

### 5.1 GET /api/synergies

**Purpose:** Get all discovered synergies

**Related Stories:** US-DB-022 (Track Discovered Synergies)

**Priority:** Phase 3 (Depth)

**Query Parameters:**
```typescript
{
  filter?: {
    monsterType?: string[]
    discovered?: boolean
  }
  search?: string
}
```

**Response:**
```typescript
{
  synergies: {
    synergy: SynergyRule
    discovered: boolean
    discoveredAt?: string
    usedInDungeons: number   // How many dungeons use this
    requirements: {
      monsterTypes: string[]
      minCount?: number
      sameFamily?: boolean
      sameBiome?: boolean
    }
    effects: {
      description: string
      bonus: number
      applies_to: 'loot' | 'power' | 'drops'
    }[]
  }[]
  stats: {
    totalSynergies: number
    discovered: number
    hidden: number
    percentage: number
  }
}
```

**Implementation Notes:**
- Load all synergy definitions
- Cross-reference with player's discovered list
- Hide details of undiscovered synergies (show as "???")
- Track discovery dates
- Show usage in dungeons

**Validation:**
- None (read-only)

---

### 5.2 GET /api/synergies/[id]

**Purpose:** Get details about a specific synergy

**Related Stories:** US-DB-022 (Synergy Codex)

**Priority:** Phase 3 (Depth)

**Response:**
```typescript
{
  synergy: SynergyRule
  discovered: boolean
  discoveredAt?: string
  requirements: {
    monsterTypes: string[]
    exactCombination?: string[]  // If specific monsters needed
    conditions: string[]         // Description of requirements
  }
  effects: SynergyEffect[]
  examples: {
    dungeonId?: string          // Example dungeon using it
    monsters: string[]          // Example monster combo
  }[]
  relatedMonsters: CapturedMonster[]  // Owned monsters that work
}
```

**Implementation Notes:**
- Show full details if discovered
- Limited info if not discovered
- Link to monsters that enable it
- Show example combinations

**Validation:**
- Verify synergy exists

---

### 5.3 POST /api/synergies/validate

**Purpose:** Check if a monster combination creates synergies

**Related Stories:** US-DB-020 (See Basic Synergies During Placement)

**Priority:** Phase 2b (Optimization)

**Request Body:**
```typescript
{
  schematicId: string
  monsters: {
    slotId: string
    capturedMonsterId: string
  }[]
}
```

**Response:**
```typescript
{
  synergies: {
    synergyId: string
    name: string
    discovered: boolean      // Player knows about this one
    newDiscovery: boolean    // Would be first time discovering
    bonus: {
      type: string
      value: number
      description: string
    }
    contributingMonsters: string[]  // Which monsters trigger it
  }[]
  totalBonus: {
    powerMultiplier: number
    lootQualityBonus: number
    dropRateBonus: number
  }
  missingPotential: {        // Synergies almost achieved
    synergyId: string
    name: string
    needsChange: {
      slotId: string
      currentType: string
      requiredType: string
    }[]
  }[]
}
```

**Implementation Notes:**
- Client-side validation with server confirmation
- Check all synergy rules against combination
- Highlight new discoveries (first time)
- Suggest near-miss synergies
- Real-time feedback in builder UI

**Validation:**
```typescript
const validateSynergiesSchema = z.object({
  schematicId: z.string().uuid(),
  monsters: z.array(z.object({
    slotId: z.string(),
    capturedMonsterId: z.string().uuid()
  }))
})
```

---

### 5.4 GET /api/synergies/codex

**Purpose:** Full synergy codex (discovered and undiscovered)

**Related Stories:** US-DB-022 (Track Discovered Synergies)

**Priority:** Phase 3 (Depth)

**Response:**
```typescript
{
  discovered: SynergyCodexEntry[]
  hidden: {
    count: number
    hints: string[]          // Vague hints about undiscovered
  }
  categories: {
    [category: string]: {
      synergies: string[]    // Synergy IDs
      discovered: number
      total: number
    }
  }
  recentDiscoveries: {
    synergy: SynergyRule
    discoveredAt: string
    discoveredIn: string     // Dungeon name
  }[]
}

interface SynergyCodexEntry {
  synergy: SynergyRule
  discoveredAt: string
  timesUsed: number
  bestDungeon?: {
    dungeonId: string
    dungeonName: string
    effectivness: number
  }
}
```

**Implementation Notes:**
- Educational resource
- Group by categories (type, family, biome)
- Track usage statistics
- Gamify discovery (achievements)
- Community can share discoveries

**Validation:**
- None (read-only)

---

## 6. Data Models

### Core Types

```typescript
interface Schematic {
  id: string
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  slots: SlotDefinition[]
  theme: string
  baseDuration: number        // Minutes
  baseRewards: RewardDefinition
  unlockRequirement?: {
    minPower?: number
    zoneComplete?: string
  }
}

interface SlotDefinition {
  id: string
  position: number
  allowedTypes: string[]      // ['Beast', 'Dragon'] or ['Any']
  requiredTags?: string[]
}

interface Dungeon {
  id: string
  playerId: string
  schematicId: string
  name: string
  status: 'draft' | 'active' | 'inactive'
  monsters: PlacedMonster[]
  power: number               // Calculated total
  tags: string[]             // Player-added tags
  createdAt: string
  updatedAt: string
  activatedAt?: string
  lastRunAt?: string
}

interface PlacedMonster {
  slotId: string
  capturedMonsterId: string
  monster: CapturedMonster
  contribution: {
    power: number
    synergies: string[]      // Active synergy IDs
  }
}

interface CapturedMonster {
  id: string                 // Unique capture instance
  playerId: string
  monsterDefinitionId: string
  monster: MonsterDefinition
  rarity: string
  power: number
  capturedAt: string
  capturedFrom: {
    zoneId: string
    subzoneId: string
  }
  placedInDungeons: string[] // Dungeon IDs
}

interface MonsterDefinition {
  id: string
  baseName: string
  family: string
  type: string
  biome: string
  packType: 'trash' | 'elite' | 'miniboss' | 'boss'
  rarityTiers: {
    [rarity: string]: {
      basePower: number
      lootTable: LootTableEntry[]
    }
  }
}

interface DungeonRun {
  id: string
  dungeonId: string
  playerId: string
  heroIds: string[]
  status: 'in_progress' | 'completed' | 'collected'
  startedAt: string
  completesAt: string
  completedAt?: string
  teamPower: number
  efficiency: number          // Calculated on completion
  rewards?: RunRewards
  log?: ExpeditionLog
}

interface RunRewards {
  loot: {
    itemId: string
    sourceMonster: string
    rare: boolean
    synergyBonus: boolean
  }[]
  gold: number
  xp: Record<string, number>
}

interface SynergyRule {
  id: string
  name: string
  description: string
  hidden: boolean             // Discoverable synergy
  requirements: {
    monsterTypes?: string[]
    sameFamily?: boolean
    sameBiome?: boolean
    specificMonsters?: string[]
    minCount?: number
  }
  effects: SynergyEffect[]
}

interface SynergyEffect {
  type: 'loot_quality' | 'drop_rate' | 'power' | 'special_drop'
  value: number               // Percentage or multiplier
  description: string
}

interface AppliedSynergy {
  synergyId: string
  synergy: SynergyRule
  contributingMonsters: string[]
  effectiveBonus: number
}
```

### Database Tables

```sql
-- Player's captured monsters (account-wide)
CREATE TABLE captured_monsters (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  monster_definition_id TEXT NOT NULL,
  rarity TEXT NOT NULL,
  power INTEGER NOT NULL,
  captured_at TIMESTAMP DEFAULT NOW(),
  captured_zone_id TEXT,
  captured_subzone_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player's schematic collection
CREATE TABLE player_schematics (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  schematic_id TEXT NOT NULL,
  collected_at TIMESTAMP DEFAULT NOW(),
  source_zone_id TEXT,
  UNIQUE(player_id, schematic_id)
);

-- Player's built dungeons
CREATE TABLE dungeons (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  schematic_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  monsters JSONB NOT NULL,    -- Array of {slotId, capturedMonsterId}
  power INTEGER NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  activated_at TIMESTAMP,
  last_run_at TIMESTAMP
);

-- Dungeon runs (similar to expeditions)
CREATE TABLE dungeon_runs (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  dungeon_id UUID REFERENCES dungeons(id),
  hero_ids UUID[] NOT NULL,
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT NOW(),
  completes_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  team_power INTEGER NOT NULL,
  efficiency INTEGER,
  rewards JSONB,
  log JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Discovered synergies (per player)
CREATE TABLE discovered_synergies (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  synergy_id TEXT NOT NULL,
  discovered_at TIMESTAMP DEFAULT NOW(),
  discovered_in_dungeon_id UUID,
  UNIQUE(player_id, synergy_id)
);

-- Indexes
CREATE INDEX idx_captured_monsters_player ON captured_monsters(player_id);
CREATE INDEX idx_dungeons_player_status ON dungeons(player_id, status);
CREATE INDEX idx_dungeon_runs_player ON dungeon_runs(player_id);
CREATE INDEX idx_dungeon_runs_status ON dungeon_runs(status);
```

---

## 7. Implementation Phases

### Phase 2a: Core Loop (MVP)
**Goal:** Basic capture → build → farm loop working

**Endpoints:**
1. `POST /api/monsters/capture` (handled in expedition completion)
2. `GET /api/monsters` - List collection
3. `GET /api/schematics` - List schematics
4. `GET /api/schematics/[id]` - View details
5. `POST /api/dungeons` - Create dungeon
6. `GET /api/dungeons` - List dungeons
7. `GET /api/dungeons/[id]` - View dungeon
8. `POST /api/dungeons/[id]/start` - Start run
9. `POST /api/dungeons/runs/[runId]/complete` - Collect rewards
10. `GET /api/dungeons/runs/active` - Active runs

**Database:**
- All core tables created
- Basic validation rules
- Simple synergies (no discovery system yet)

---

### Phase 2b: Optimization & Management
**Goal:** Tools to optimize dungeons and manage collection

**Endpoints:**
1. `GET /api/monsters/[id]` - Monster details
2. `GET /api/monsters/by-zone/[zoneId]` - Target captures
3. `GET /api/schematics/buildable` - Quick filter
4. `PATCH /api/dungeons/[id]` - Update/swap
5. `DELETE /api/dungeons/[id]` - Delete drafts
6. `GET /api/dungeons/[id]/preview` - Preview rewards
7. `POST /api/synergies/validate` - Check synergies
8. `GET /api/dungeons/runs/[runId]` - Check status

**Features:**
- Monster swapping
- Reward previews
- Basic synergy display
- Draft management

---

### Phase 3: Depth & Discovery
**Goal:** Advanced features, discovery system, statistics

**Endpoints:**
1. `GET /api/monsters/progress` - Collection tracking
2. `GET /api/monsters/loot-tables/[monsterId]` - Loot details
3. `GET /api/schematics/sources/[schematicId]` - Find sources
4. `GET /api/dungeons/[id]/statistics` - Dungeon stats
5. `POST /api/dungeons/[id]/optimize` - Optimization suggestions
6. `GET /api/dungeons/runs/history` - Run history
7. `GET /api/synergies` - Synergy list
8. `GET /api/synergies/[id]` - Synergy details
9. `GET /api/synergies/codex` - Full codex

**Features:**
- Synergy discovery system
- Hidden synergies revealed
- Detailed statistics
- Optimization algorithms
- Collection milestones

---

### Phase 4: Polish & Content
**Goal:** Refinement, more content, AI features

**Endpoints:**
- Additional query parameters for filtering
- Bulk operations
- Export/import builds
- Leaderboards (social features)

**Features:**
- AI-generated dungeon names
- Build sharing
- Community synergy discoveries
- Advanced analytics

---

## Implementation Guidelines

### Validation Pattern
```typescript
import { z } from 'zod'

const schema = z.object({
  // Define schema
})

const body = await readBody(event)
const parsed = schema.safeParse(body)

if (!parsed.success) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid request',
    data: { errors: parsed.error.issues }
  })
}
```

### Authentication Pattern
```typescript
const user = await serverSupabaseUser(event)
if (!user) {
  throw createError({ statusCode: 401, message: 'Unauthorized' })
}

const supabase = await serverSupabaseClient(event)
```

### Database Queries
```typescript
// Always filter by player_id for security
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('player_id', user.id)

if (error) {
  throw createError({ statusCode: 500, message: 'Database error' })
}
```

### Mapper Pattern
```typescript
// Use mappers for snake_case ↔ camelCase
import { mapSupabaseDungeonToDungeon } from '../../utils/mappers'

const dungeons = rawDungeons.map(mapSupabaseDungeonToDungeon)
```

### Response Pattern
```typescript
return {
  data: mappedData,
  meta: {
    total: count,
    page: currentPage,
    limit: pageLimit
  }
}
```

---

## Testing Strategy

### Unit Tests
- Validation schemas
- Mapper functions
- Synergy calculation logic
- Loot table calculations

### Integration Tests
- Full endpoint flows
- Database operations
- Error handling
- Authorization checks

### E2E Tests (Playwright)
- Complete dungeon building flow
- Capture → Build → Run → Collect
- Synergy discovery
- Monster swapping

---

## Performance Considerations

### Caching
- Monster definitions (static data)
- Schematic definitions (static data)
- Synergy rules (static data)
- Player collection (cache with TTL)

### Query Optimization
- Index on player_id for all tables
- Join optimization for complex queries
- Pagination for large result sets
- Aggregate calculations server-side

### Real-time Updates
- SSE for active runs countdown
- Websockets for dungeon run completion
- Optimistic UI updates with rollback

---

## Security Considerations

1. **Always verify ownership:** Check player_id on all mutations
2. **Validate monster ownership:** Can't place monsters you don't own
3. **Enforce slot limits:** Server-side check on activation
4. **Prevent double-collection:** Run rewards can only be collected once
5. **Rate limiting:** Prevent spam on expensive endpoints (optimize, preview)
6. **Input sanitization:** All text inputs (names, tags)

---

## Error Codes Reference

| Code | Message | Meaning |
|------|---------|---------|
| 400 | VALIDATION_FAILED | Request body invalid |
| 400 | HERO_BUSY | Heroes on expedition/stationed |
| 400 | SLOT_MISMATCH | Wrong monster type for slot |
| 400 | RUN_NOT_COMPLETE | Trying to collect early |
| 401 | UNAUTHORIZED | Not logged in |
| 403 | SLOT_LIMIT_REACHED | Too many active dungeons |
| 403 | DUNGEON_LOCKED | Requirements not met |
| 404 | NOT_FOUND | Resource doesn't exist |
| 404 | NOT_OWNED | Player doesn't own resource |
| 409 | MONSTER_IN_USE | Monster already placed |
| 409 | ALREADY_COLLECTED | Rewards claimed already |
| 500 | DATABASE_ERROR | Server error |

---

## Next Steps

1. **Create types:** Define all TypeScript interfaces in `/types/dungeons.ts`
2. **Database schema:** Apply migrations for new tables
3. **Implement Phase 2a:** Core loop endpoints first
4. **Client stores:** Create Pinia stores for monsters, schematics, dungeons
5. **UI components:** Build dungeon builder interface
6. **Testing:** Write tests for each endpoint
7. **Documentation:** API reference for frontend developers

---

**End of Dungeon Building API Design**
