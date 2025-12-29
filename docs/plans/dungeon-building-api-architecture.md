# Dungeon Building API - Architecture & Flow Diagrams

**Date:** 2025-12-29
**Related:** [API Design](./dungeon-building-api-design.md) | [Quick Reference](./dungeon-building-api-quick-reference.md)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Nuxt App)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Monster    │  │  Schematic   │  │   Dungeon    │          │
│  │ Collection   │  │  Collection  │  │   Builder    │          │
│  │     UI       │  │     UI       │  │     UI       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│  ┌──────▼──────────────────▼──────────────────▼───────┐          │
│  │           Pinia Stores (State Management)           │          │
│  │  • useMonsterStore  • useSchematicStore             │          │
│  │  • useDungeonStore  • useSynergyStore               │          │
│  └──────────────────────┬──────────────────────────────┘          │
│                         │                                         │
│  ┌──────────────────────▼──────────────────────────────┐          │
│  │       Composables (Business Logic)                  │          │
│  │  • useDungeonBuilder  • useMonsterCapture           │          │
│  │  • useSynergyCalculator  • useLootPreview           │          │
│  └──────────────────────┬──────────────────────────────┘          │
│                         │                                         │
└─────────────────────────┼─────────────────────────────────────────┘
                          │ $fetch
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                    NUXT SERVER ROUTES                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  /api/monsters/*        /api/schematics/*                         │
│  ├─ index.get.ts        ├─ index.get.ts                          │
│  ├─ [id].get.ts         ├─ [id].get.ts                           │
│  ├─ progress.get.ts     └─ buildable.get.ts                      │
│  └─ by-zone/[id].get.ts                                          │
│                                                                   │
│  /api/dungeons/*        /api/synergies/*                          │
│  ├─ index.get.ts        ├─ index.get.ts                          │
│  ├─ index.post.ts       ├─ [id].get.ts                           │
│  ├─ [id].get.ts         ├─ validate.post.ts                      │
│  ├─ [id].patch.ts       └─ codex.get.ts                          │
│  ├─ [id].delete.ts                                               │
│  └─ [id]/                                                         │
│     ├─ start.post.ts                                             │
│     ├─ preview.get.ts                                            │
│     └─ optimize.post.ts                                          │
│                                                                   │
│  /api/dungeons/runs/*                                             │
│  ├─ [runId].get.ts                                               │
│  ├─ [runId]/complete.post.ts                                     │
│  ├─ active.get.ts                                                │
│  └─ history.get.ts                                               │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│                  SERVER UTILITIES                                 │
│  • validation.ts (Zod schemas)                                   │
│  • mappers.ts (snake_case ↔ camelCase)                           │
│  • calculations.ts (power, synergies, loot)                      │
│  • lootGenerator.ts (reward generation)                          │
└───────────────────────────┬───────────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│                      SUPABASE                                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────┐  ┌────────────────────┐                  │
│  │  captured_monsters │  │ player_schematics  │                  │
│  ├────────────────────┤  ├────────────────────┤                  │
│  │ id (PK)            │  │ id (PK)            │                  │
│  │ player_id (FK)     │  │ player_id (FK)     │                  │
│  │ monster_def_id     │  │ schematic_id       │                  │
│  │ rarity             │  │ collected_at       │                  │
│  │ power              │  └────────────────────┘                  │
│  │ captured_at        │                                          │
│  │ captured_zone_id   │                                          │
│  └────────────────────┘                                          │
│                                                                   │
│  ┌────────────────────┐  ┌────────────────────┐                  │
│  │     dungeons       │  │   dungeon_runs     │                  │
│  ├────────────────────┤  ├────────────────────┤                  │
│  │ id (PK)            │  │ id (PK)            │                  │
│  │ player_id (FK)     │  │ player_id (FK)     │                  │
│  │ schematic_id       │  │ dungeon_id (FK)    │                  │
│  │ name               │  │ hero_ids[]         │                  │
│  │ status             │  │ status             │                  │
│  │ monsters (JSONB)   │  │ started_at         │                  │
│  │ power              │  │ completes_at       │                  │
│  │ tags[]             │  │ efficiency         │                  │
│  │ created_at         │  │ rewards (JSONB)    │                  │
│  │ updated_at         │  │ log (JSONB)        │                  │
│  └────────────────────┘  └────────────────────┘                  │
│                                                                   │
│  ┌────────────────────┐                                          │
│  │discovered_synergies│                                          │
│  ├────────────────────┤                                          │
│  │ id (PK)            │                                          │
│  │ player_id (FK)     │                                          │
│  │ synergy_id         │                                          │
│  │ discovered_at      │                                          │
│  └────────────────────┘                                          │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Monster Capture

```
┌──────────────┐
│  Expedition  │
│   Running    │
└──────┬───────┘
       │
       │ Time elapses
       ▼
┌──────────────────────────────────────────────────────┐
│  POST /api/expeditions/[id]/complete                 │
├──────────────────────────────────────────────────────┤
│  1. Verify expedition complete                       │
│  2. Calculate efficiency (60-150%)                   │
│  3. Generate base loot                               │
│  4. CAPTURE ROLLS:                                   │
│     For each monster in zone:                        │
│       - Roll capture (baseCaptureChance × efficiency)│
│       - Apply hero traits (e.g., "Monster Whisperer")│
│       - If success: CREATE captured_monsters record  │
│  5. Generate expedition log (include captures)       │
│  6. Return rewards + captured monsters               │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  Client Updates                             │
├─────────────────────────────────────────────┤
│  • useMonsterStore.add(capturedMonsters)    │
│  • Show "New Monster Captured!" notification│
│  • Update collection progress               │
│  • Check if schematics now buildable        │
└─────────────────────────────────────────────┘
```

---

## Data Flow: Build Dungeon

```
┌─────────────────┐
│  Player selects │
│   schematic     │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  GET /api/schematics/[id]                │
├──────────────────────────────────────────┤
│  Returns:                                │
│  • Slot requirements                     │
│  • canBuild: true/false                  │
│  • missing monster types                 │
└────────┬─────────────────────────────────┘
         │
         │ If buildable
         ▼
┌─────────────────────────────────────────┐
│  Dungeon Builder UI                     │
├─────────────────────────────────────────┤
│  1. Show empty slots with requirements  │
│  2. Player drags monsters from collection│
│  3. Real-time validation:                │
│     - Check slot type compatibility      │
│     - Preview synergies (POST /validate) │
│     - Preview loot (GET /preview)        │
└────────┬────────────────────────────────┘
         │
         │ Player clicks "Activate"
         ▼
┌──────────────────────────────────────────────────────┐
│  POST /api/dungeons                                  │
├──────────────────────────────────────────────────────┤
│  Request:                                            │
│  {                                                   │
│    schematicId: "cave-ruins-3",                      │
│    name: "Fire Gear Farm",                           │
│    monsters: [                                       │
│      {slotId: "slot-1", capturedMonsterId: "uuid-1"},│
│      {slotId: "slot-2", capturedMonsterId: "uuid-2"} │
│    ],                                                │
│    status: "active"                                  │
│  }                                                   │
│                                                      │
│  Server Validation:                                  │
│  1. ✓ Player owns schematic                          │
│  2. ✓ Player owns all monsters                       │
│  3. ✓ Monsters not already placed                    │
│  4. ✓ Slot requirements met                          │
│  5. ✓ Active dungeon limit not exceeded              │
│                                                      │
│  Calculations:                                       │
│  1. Calculate total power                            │
│  2. Identify active synergies                        │
│  3. Build combined loot table                        │
│  4. Apply synergy bonuses to loot                    │
│                                                      │
│  Database:                                           │
│  1. INSERT INTO dungeons (...)                       │
│  2. UPDATE captured_monsters (mark as placed)        │
│                                                      │
│  Response:                                           │
│  {                                                   │
│    dungeon: { /* full dungeon */ },                  │
│    validation: { valid: true },                      │
│    preview: {                                        │
│      power: 850,                                     │
│      synergies: [...],                               │
│      estimatedRewards: { /* loot table */ }          │
│    }                                                 │
│  }                                                   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  Client Updates                             │
├─────────────────────────────────────────────┤
│  • useDungeonStore.add(dungeon)             │
│  • Navigate to dungeon management           │
│  • Show "Dungeon Active!" notification      │
│  • Update active dungeon count (5/5)        │
└─────────────────────────────────────────────┘
```

---

## Data Flow: Run Dungeon

```
┌─────────────────┐
│  Player selects │
│  dungeon + heroes│
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│  POST /api/dungeons/[id]/start                       │
├──────────────────────────────────────────────────────┤
│  Request: { heroIds: ["uuid-1", "uuid-2"] }          │
│                                                      │
│  Validation:                                         │
│  1. ✓ Dungeon is active                              │
│  2. ✓ Heroes available (not on expedition)           │
│  3. ✓ Heroes not exhausted (morale > 20)             │
│                                                      │
│  Calculations:                                       │
│  1. teamPower = sum(heroes.power)                    │
│  2. efficiency = teamPower / dungeonRequirement      │
│  3. completionTime = baseDuration (from schematic)   │
│                                                      │
│  Database:                                           │
│  1. INSERT INTO dungeon_runs (                       │
│       dungeon_id, hero_ids, team_power,              │
│       started_at, completes_at, status='in_progress')│
│  2. UPDATE heroes SET is_on_expedition=true          │
│                                                      │
│  Response:                                           │
│  {                                                   │
│    run: { /* run details */ },                       │
│    heroes: [ /* updated heroes */ ],                 │
│    estimatedCompletion: "2025-12-29T12:00:00Z",      │
│    preview: { efficiency: 120%, estimatedLoot }      │
│  }                                                   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  Client: Active Run Display                 │
├─────────────────────────────────────────────┤
│  • Show countdown timer                     │
│  • Display heroes (busy)                    │
│  • Periodic polling: GET /runs/[id]         │
└────────┬────────────────────────────────────┘
         │
         │ Timer completes
         ▼
┌─────────────────────────────────────────────┐
│  Client detects completion                  │
├─────────────────────────────────────────────┤
│  • Show "Run Complete!" notification        │
│  • Enable "Collect Rewards" button          │
└────────┬────────────────────────────────────┘
         │
         │ Player clicks "Collect"
         ▼
┌──────────────────────────────────────────────────────┐
│  POST /api/dungeons/runs/[runId]/complete           │
├──────────────────────────────────────────────────────┤
│  Validation:                                         │
│  1. ✓ Run belongs to player                          │
│  2. ✓ Run is complete (time elapsed)                 │
│  3. ✓ Rewards not already collected                  │
│                                                      │
│  Loot Generation:                                    │
│  1. Load dungeon's combined loot table               │
│  2. For each loot entry:                             │
│     a. Roll RNG against dropChance                   │
│     b. Apply efficiency modifier (60-150%)           │
│     c. Apply synergy bonuses                         │
│     d. Track source monster                          │
│  3. Award guaranteed drops                           │
│  4. Calculate gold & XP                              │
│                                                      │
│  Log Generation:                                     │
│  1. Generate expedition-style log                    │
│  2. Include trait reactions:                         │
│     - "Loot Goblin was thrilled by the gold!"        │
│     - "Fire Mage enjoyed fighting fire monsters"     │
│  3. Track notable moments (rare drops, close calls)  │
│                                                      │
│  Database Updates:                                   │
│  1. UPDATE dungeon_runs SET                          │
│       status='collected', rewards=..., log=...       │
│  2. INSERT INTO inventory (loot items)               │
│  3. UPDATE heroes SET                                │
│       is_on_expedition=false, xp+=gained             │
│  4. UPDATE dungeons SET                              │
│       last_run_at=now, statistics (aggregate)        │
│                                                      │
│  Response:                                           │
│  {                                                   │
│    run: { /* completed run */ },                     │
│    rewards: {                                        │
│      loot: [                                         │
│        {                                             │
│          item: { name: "Flame Blade" },              │
│          source: { monsterName: "Fire Elemental" },  │
│          rare: false,                                │
│          synergyBonus: true                          │
│        }                                             │
│      ],                                              │
│      gold: 125,                                      │
│      xp: { "hero-1": 50, "hero-2": 50 }              │
│    },                                                │
│    heroes: [ /* freed heroes */ ],                   │
│    statistics: {                                     │
│      efficiency: 120,                                │
│      vsExpected: { better: [...], worse: [...] }     │
│    },                                                │
│    log: { /* expedition log */ }                     │
│  }                                                   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  Client Updates                             │
├─────────────────────────────────────────────┤
│  • Add items to inventory                   │
│  • Free heroes                              │
│  • Update hero XP/levels                    │
│  • Show loot results modal                  │
│  • Display expedition log                   │
│  • Update dungeon statistics                │
│  • Celebrate rare drops (if any)            │
└─────────────────────────────────────────────┘
```

---

## Data Flow: Synergy Discovery

```
┌─────────────────┐
│  Player builds  │
│    dungeon      │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│  POST /api/synergies/validate                        │
├──────────────────────────────────────────────────────┤
│  Request:                                            │
│  {                                                   │
│    schematicId: "cave-ruins-3",                      │
│    monsters: [                                       │
│      {slotId: "slot-1", capturedMonsterId: "fire-1"},│
│      {slotId: "slot-2", capturedMonsterId: "fire-2"},│
│      {slotId: "slot-3", capturedMonsterId: "fire-3"} │
│    ]                                                 │
│  }                                                   │
│                                                      │
│  Synergy Checking:                                   │
│  1. Load all synergy rules                           │
│  2. For each rule:                                   │
│     a. Check if monster combination matches          │
│     b. Check player's discovered_synergies           │
│     c. Flag as newDiscovery if not known             │
│  3. Calculate total bonuses                          │
│                                                      │
│  Example Match:                                      │
│  Rule: "Fire Family" = 3+ Fire-type monsters         │
│  Monsters: Fire Elem, Fire Drake, Fire Golem         │
│  ✓ MATCH! → 15% loot quality bonus                   │
│                                                      │
│  Response:                                           │
│  {                                                   │
│    synergies: [                                      │
│      {                                               │
│        synergyId: "fire-family",                     │
│        name: "Fire Family",                          │
│        discovered: false,      ← Not known yet!      │
│        newDiscovery: true,     ← First time!         │
│        bonus: { type: "loot_quality", value: 15 },   │
│        contributingMonsters: ["fire-1","fire-2","fire-3"]│
│      }                                               │
│    ],                                                │
│    totalBonus: { lootQualityBonus: 15 }              │
│  }                                                   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  Client: Builder UI                         │
├─────────────────────────────────────────────┤
│  • Show synergy indicators                  │
│  • Highlight "New Synergy!" badge           │
│  • Visual connections between monsters      │
│  • Preview bonus: +15% loot quality         │
└────────┬────────────────────────────────────┘
         │
         │ Player activates dungeon
         ▼
┌──────────────────────────────────────────────────────┐
│  POST /api/dungeons (activation)                     │
├──────────────────────────────────────────────────────┤
│  During creation:                                    │
│  1. Validate synergies again (server-side)           │
│  2. For each NEW synergy discovered:                 │
│     INSERT INTO discovered_synergies (               │
│       player_id, synergy_id, discovered_at,          │
│       discovered_in_dungeon_id                       │
│     )                                                │
│  3. Apply bonuses to dungeon loot table              │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│  Client: Discovery Celebration              │
├─────────────────────────────────────────────┤
│  • "New Synergy Discovered!" modal          │
│  • Show synergy card with details           │
│  • Confetti animation                       │
│  • Award discovery bonus (currency/XP)      │
│  • Add to synergy codex                     │
│  • Update useSynergyStore                   │
└─────────────────────────────────────────────┘
```

---

## Calculation Flow: Dungeon Power & Loot

```
┌─────────────────────────────────────────────────────┐
│  Calculate Dungeon Power                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Base Power = Sum of Monster Powers              │
│     power = monster1.power + monster2.power + ...   │
│                                                     │
│  2. Synergy Multipliers                             │
│     For each active synergy:                        │
│       if synergy.type === 'power':                  │
│         powerMultiplier *= (1 + synergy.value/100)  │
│                                                     │
│  3. Schematic Bonus                                 │
│     power *= schematic.powerMultiplier              │
│                                                     │
│  4. Final Dungeon Power                             │
│     dungeonPower = basePower × multipliers          │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Build Combined Loot Table                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Start with Schematic Base Rewards               │
│     lootTable = { ...schematic.baseRewards }        │
│                                                     │
│  2. Add Each Monster's Loot Table                   │
│     For each monster:                               │
│       For each lootEntry in monster.lootTable:      │
│         Add to combinedLootTable[itemId]:           │
│           - dropChance (aggregate)                  │
│           - sourceMonster (track)                   │
│           - weight (for RNG)                        │
│                                                     │
│  3. Apply Synergy Bonuses                           │
│     For each active synergy:                        │
│       if synergy.type === 'loot_quality':           │
│         boost all drop qualities by synergy.value%  │
│       if synergy.type === 'drop_rate':              │
│         increase drop chances by synergy.value%     │
│       if synergy.type === 'special_drop':           │
│         add unique item to loot table               │
│                                                     │
│  4. Normalize Drop Rates                            │
│     Ensure total probability ≤ 100%                 │
│     Distribute excess across tiers                  │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Generate Loot (On Run Completion)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Input:                                             │
│  • combinedLootTable (from dungeon)                 │
│  • efficiency (60-150%, from run)                   │
│  • synergies (active bonuses)                       │
│                                                     │
│  Process:                                           │
│  1. For each item in lootTable:                     │
│     a. adjustedChance = baseChance × (efficiency/100)│
│     b. adjustedChance += synergyBonus               │
│     c. roll = random(0, 1)                          │
│     d. if roll < adjustedChance:                    │
│        → Award item                                 │
│        → Track source monster                       │
│        → Flag if synergy contributed                │
│                                                     │
│  2. Guaranteed Drops:                               │
│     Always award items with 100% chance             │
│                                                     │
│  3. Bonus Rolls (from high efficiency):             │
│     if efficiency > 120%:                           │
│       extraRolls = floor((efficiency - 100) / 20)   │
│       Perform extraRolls on loot table              │
│                                                     │
│  4. Quality Scaling:                                │
│     itemQuality = baseQuality × (efficiency / 100)  │
│                                                     │
│  Output:                                            │
│  [                                                  │
│    {                                                │
│      itemId: "fire-sword",                          │
│      sourceMonster: "fire-elemental-uuid",          │
│      rare: false,                                   │
│      synergyBonus: true,                            │
│      quality: 125                                   │
│    }                                                │
│  ]                                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────┐
│  useMonsterStore (Pinia)                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  State:                                             │
│  • monsters: CapturedMonster[]                      │
│  • loading: boolean                                 │
│  • filters: MonsterFilters                          │
│  • collectionStats: CollectionStats                 │
│                                                     │
│  Getters:                                           │
│  • monstersByType: (type) => CapturedMonster[]      │
│  • availableMonsters: () => CapturedMonster[]       │
│    (not placed in dungeons)                         │
│  • monstersForSlot: (slotReq) => CapturedMonster[]  │
│    (filter by slot type compatibility)              │
│                                                     │
│  Actions:                                           │
│  • async fetchMonsters(filters?)                    │
│  • async fetchMonsterDetails(id)                    │
│  • async fetchProgress()                            │
│  • addCapturedMonster(monster)                      │
│    (after expedition completion)                    │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  useSchematicStore (Pinia)                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  State:                                             │
│  • schematics: PlayerSchematic[]                    │
│  • loading: boolean                                 │
│  • selectedSchematic: Schematic | null              │
│                                                     │
│  Getters:                                           │
│  • buildableSchematics: () => PlayerSchematic[]     │
│    (cross-reference with monster collection)        │
│  • schematicById: (id) => Schematic                 │
│                                                     │
│  Actions:                                           │
│  • async fetchSchematics()                          │
│  • async fetchSchematicDetails(id)                  │
│  • async fetchBuildable()                           │
│  • addSchematic(schematic)                          │
│    (after expedition drop)                          │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  useDungeonStore (Pinia)                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  State:                                             │
│  • dungeons: Dungeon[]                              │
│  • activeRuns: DungeonRun[]                         │
│  • loading: boolean                                 │
│  • limits: { active, maxActive, draft, maxDraft }   │
│                                                     │
│  Getters:                                           │
│  • activeDungeons: () => Dungeon[]                  │
│  • canActivateMore: () => boolean                   │
│  • runningDungeons: () => DungeonRun[]              │
│                                                     │
│  Actions:                                           │
│  • async fetchDungeons()                            │
│  • async fetchDungeonDetails(id)                    │
│  • async createDungeon(payload)                     │
│  • async updateDungeon(id, changes)                 │
│  • async deleteDungeon(id)                          │
│  • async startRun(dungeonId, heroIds)               │
│  • async completeRun(runId)                         │
│  • async fetchActiveRuns()                          │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  useSynergyStore (Pinia)                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  State:                                             │
│  • discoveredSynergies: DiscoveredSynergy[]         │
│  • allSynergies: SynergyRule[]                      │
│  • loading: boolean                                 │
│                                                     │
│  Getters:                                           │
│  • hiddenSynergies: () => SynergyRule[]             │
│    (not yet discovered)                             │
│  • discoveryPercentage: () => number                │
│                                                     │
│  Actions:                                           │
│  • async fetchDiscovered()                          │
│  • async fetchCodex()                               │
│  • async validateCombination(schematicId, monsters) │
│  • discoverSynergy(synergyId)                       │
│    (after activation)                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Security Model

```
┌─────────────────────────────────────────────────────┐
│  Request Flow with Security Checks                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Authentication                                  │
│     ┌─────────────────────────────────────┐        │
│     │ serverSupabaseUser(event)           │        │
│     └─────────────┬───────────────────────┘        │
│                   │                                 │
│                   ▼                                 │
│     ┌─────────────────────────────────────┐        │
│     │ if (!user) throw 401 Unauthorized    │        │
│     └─────────────────────────────────────┘        │
│                                                     │
│  2. Authorization (Ownership)                       │
│     ┌─────────────────────────────────────┐        │
│     │ Query with .eq('player_id', user.id)│        │
│     └─────────────┬───────────────────────┘        │
│                   │                                 │
│                   ▼                                 │
│     ┌─────────────────────────────────────┐        │
│     │ if (!found) throw 404 Not Found      │        │
│     └─────────────────────────────────────┘        │
│                                                     │
│  3. Validation (Request Body)                       │
│     ┌─────────────────────────────────────┐        │
│     │ const parsed = schema.safeParse(body)│        │
│     └─────────────┬───────────────────────┘        │
│                   │                                 │
│                   ▼                                 │
│     ┌─────────────────────────────────────┐        │
│     │ if (!parsed.success) throw 400       │        │
│     └─────────────────────────────────────┘        │
│                                                     │
│  4. Business Rules                                  │
│     ┌─────────────────────────────────────┐        │
│     │ • Check slot limits                  │        │
│     │ • Verify monster ownership           │        │
│     │ • Validate slot compatibility        │        │
│     │ • Check monster not already placed   │        │
│     └─────────────┬───────────────────────┘        │
│                   │                                 │
│                   ▼                                 │
│     ┌─────────────────────────────────────┐        │
│     │ if (violation) throw 400/403/409     │        │
│     └─────────────────────────────────────┘        │
│                                                     │
│  5. Database Security (RLS)                         │
│     ┌─────────────────────────────────────┐        │
│     │ Row-Level Security policies ensure: │        │
│     │ • Users only see own data            │        │
│     │ • Mutations require ownership        │        │
│     └─────────────────────────────────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘

Example RLS Policies:

-- Captured Monsters
CREATE POLICY "Users can view own monsters"
  ON captured_monsters FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "System can insert monsters"
  ON captured_monsters FOR INSERT
  WITH CHECK (player_id = auth.uid());

-- Dungeons
CREATE POLICY "Users can view own dungeons"
  ON dungeons FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Users can create dungeons"
  ON dungeons FOR INSERT
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Users can update own dungeons"
  ON dungeons FOR UPDATE
  USING (player_id = auth.uid())
  WITH CHECK (player_id = auth.uid());

-- Dungeon Runs
CREATE POLICY "Users can view own runs"
  ON dungeon_runs FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "System can create runs"
  ON dungeon_runs FOR INSERT
  WITH CHECK (player_id = auth.uid());
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────┐
│  Caching Strategy                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Static Data (Redis/Memory Cache)            │   │
│  ├─────────────────────────────────────────────┤   │
│  │ • Monster Definitions    → Cache forever    │   │
│  │ • Schematic Definitions  → Cache forever    │   │
│  │ • Synergy Rules          → Cache forever    │   │
│  │ • Zone Data              → Cache forever    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Player Data (Short TTL)                      │   │
│  ├─────────────────────────────────────────────┤   │
│  │ • Captured Monsters      → TTL: 5 min       │   │
│  │ • Schematics Collection  → TTL: 5 min       │   │
│  │ • Dungeon List           → TTL: 1 min       │   │
│  │ • Discovered Synergies   → TTL: 10 min      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ No Cache (Always Fresh)                      │   │
│  ├─────────────────────────────────────────────┤   │
│  │ • Active Runs            → Real-time        │   │
│  │ • Run Completion         → No cache         │   │
│  │ • Dungeon Statistics     → No cache         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Cache Invalidation:                                │
│  • POST /dungeons         → Invalidate dungeon list │
│  • PATCH /dungeons/[id]   → Invalidate that dungeon │
│  • Expedition complete    → Invalidate monsters     │
│  • Synergy discovered     → Invalidate synergies    │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Query Optimization                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Indexes (PostgreSQL):                              │
│  • CREATE INDEX idx_monsters_player                 │
│      ON captured_monsters(player_id);               │
│  • CREATE INDEX idx_dungeons_player_status          │
│      ON dungeons(player_id, status);                │
│  • CREATE INDEX idx_runs_player                     │
│      ON dungeon_runs(player_id);                    │
│  • CREATE INDEX idx_runs_status                     │
│      ON dungeon_runs(status);                       │
│  • CREATE INDEX idx_runs_completes_at               │
│      ON dungeon_runs(completes_at)                  │
│      WHERE status = 'in_progress';                  │
│                                                     │
│  Join Optimization:                                 │
│  • Use select('*') with joins instead of N+1        │
│  • Fetch related data in single query               │
│                                                     │
│  Pagination:                                        │
│  • Always use .range(offset, limit)                 │
│  • Max 100 items per page                           │
│  • Return total count for UI                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

1. ✅ Review architecture diagrams
2. ⬜ Set up database schema
3. ⬜ Implement Phase 2a endpoints
4. ⬜ Create Pinia stores
5. ⬜ Build UI components
6. ⬜ Write tests

---

**Related Documentation:**
- [Full API Design](./dungeon-building-api-design.md)
- [Quick Reference](./dungeon-building-api-quick-reference.md)
- [User Stories](../user-stories/04-dungeon-building.md)
