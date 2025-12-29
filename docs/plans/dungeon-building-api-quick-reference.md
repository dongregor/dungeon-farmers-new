# Dungeon Building API - Quick Reference

**Date:** 2025-12-29
**Full Documentation:** [dungeon-building-api-design.md](./dungeon-building-api-design.md)

---

## Endpoint Summary

### Monsters API (8 endpoints)

| Method | Path | Purpose | Phase | Stories |
|--------|------|---------|-------|---------|
| GET | `/api/monsters` | List captured monsters with filters | 2a | US-DB-001 |
| GET | `/api/monsters/[id]` | Monster details and loot table | 2b | US-DB-002 |
| GET | `/api/monsters/progress` | Collection progress tracking | 3 | US-DB-003, US-DB-009 |
| GET | `/api/monsters/by-zone/[zoneId]` | Monsters available in zone | 2b | US-DB-006 |
| GET | `/api/monsters/loot-tables/[monsterId]` | Detailed loot table | 2b | US-DB-002, US-DB-027 |

### Schematics API (4 endpoints)

| Method | Path | Purpose | Phase | Stories |
|--------|------|---------|-------|---------|
| GET | `/api/schematics` | List collected schematics | 2a | US-DB-010 |
| GET | `/api/schematics/[id]` | Schematic details and requirements | 2a | US-DB-011 |
| GET | `/api/schematics/buildable` | Filter to buildable only | 2a | US-DB-012 |
| GET | `/api/schematics/sources/[schematicId]` | Where to find schematic | 3 | US-DB-013 |

### Dungeons API (8 endpoints)

| Method | Path | Purpose | Phase | Stories |
|--------|------|---------|-------|---------|
| POST | `/api/dungeons` | Create dungeon from schematic | 2a | US-DB-014 |
| GET | `/api/dungeons` | List player's dungeons | 2a | US-DB-025, US-DB-032 |
| GET | `/api/dungeons/[id]` | Dungeon details and stats | 2a | US-DB-017, US-DB-033 |
| PATCH | `/api/dungeons/[id]` | Update/swap monsters | 2b | US-DB-029, US-DB-030, US-DB-032 |
| DELETE | `/api/dungeons/[id]` | Delete dungeon draft | 2b | US-DB-018 |
| GET | `/api/dungeons/[id]/preview` | Preview rewards before building | 2b | US-DB-017 |
| GET | `/api/dungeons/[id]/statistics` | Detailed dungeon statistics | 3 | US-DB-033 |
| POST | `/api/dungeons/[id]/optimize` | Get optimization suggestions | 3 | US-DB-019 |

### Dungeon Runs API (5 endpoints)

| Method | Path | Purpose | Phase | Stories |
|--------|------|---------|-------|---------|
| POST | `/api/dungeons/[id]/start` | Start dungeon run with heroes | 2a | US-DB-025 |
| GET | `/api/dungeons/runs/[runId]` | Get run status and progress | 2a | US-DB-025, US-DB-026 |
| POST | `/api/dungeons/runs/[runId]/complete` | Collect rewards | 2a | US-DB-026 |
| GET | `/api/dungeons/runs/active` | List active runs | 2a | US-DB-025 |
| GET | `/api/dungeons/runs/history` | View past runs | 3 | US-DB-033 |

### Synergies API (4 endpoints)

| Method | Path | Purpose | Phase | Stories |
|--------|------|---------|-------|---------|
| GET | `/api/synergies` | List discovered synergies | 3 | US-DB-022 |
| GET | `/api/synergies/[id]` | Synergy details | 3 | US-DB-022 |
| POST | `/api/synergies/validate` | Check monster combination | 2b | US-DB-020 |
| GET | `/api/synergies/codex` | Full synergy codex | 3 | US-DB-022 |

**Total Endpoints:** 29

---

## Implementation Priority

### Phase 2a: Core Loop (10 endpoints)
**Goal:** Capture → Build → Farm working end-to-end

```
✅ Monster capture (handled in expedition completion)
✅ GET /api/monsters
✅ GET /api/schematics
✅ GET /api/schematics/[id]
✅ POST /api/dungeons
✅ GET /api/dungeons
✅ GET /api/dungeons/[id]
✅ POST /api/dungeons/[id]/start
✅ POST /api/dungeons/runs/[runId]/complete
✅ GET /api/dungeons/runs/active
```

### Phase 2b: Optimization (8 endpoints)
**Goal:** Tools to manage and optimize dungeons

```
⬜ GET /api/monsters/[id]
⬜ GET /api/monsters/by-zone/[zoneId]
⬜ GET /api/monsters/loot-tables/[monsterId]
⬜ GET /api/schematics/buildable
⬜ PATCH /api/dungeons/[id]
⬜ DELETE /api/dungeons/[id]
⬜ GET /api/dungeons/[id]/preview
⬜ POST /api/synergies/validate
⬜ GET /api/dungeons/runs/[runId]
```

### Phase 3: Depth & Discovery (11 endpoints)
**Goal:** Statistics, discovery, advanced features

```
⬜ GET /api/monsters/progress
⬜ GET /api/schematics/sources/[schematicId]
⬜ GET /api/dungeons/[id]/statistics
⬜ POST /api/dungeons/[id]/optimize
⬜ GET /api/dungeons/runs/history
⬜ GET /api/synergies
⬜ GET /api/synergies/[id]
⬜ GET /api/synergies/codex
```

---

## Key Data Flows

### 1. Capture Monster (During Expedition)
```
Expedition completes
  ↓
Calculate capture rolls (server-side)
  ↓
Create captured_monsters records
  ↓
Include in expedition completion response
  ↓
Client updates monster collection
```

### 2. Build Dungeon
```
Client: GET /api/schematics/[id]
  ↓
Verify buildable (has required monsters)
  ↓
Client: Build UI with monster selection
  ↓
Client: POST /api/dungeons
  - schematicId
  - monsters: [{slotId, capturedMonsterId}]
  - status: 'active'
  ↓
Server validates:
  - Slot requirements met
  - Player owns monsters
  - Not exceeding active slot limit
  ↓
Calculate power & synergies
  ↓
Create dungeon record
  ↓
Return dungeon + preview
```

### 3. Run Dungeon
```
Client: POST /api/dungeons/[id]/start
  - heroIds: [...]
  ↓
Server validates:
  - Heroes available
  - Dungeon active
  ↓
Create dungeon_run record
Mark heroes busy
Set completion timer
  ↓
Return run + estimates
  ↓
Client polls: GET /api/dungeons/runs/[runId]
  ↓
When complete:
Client: POST /api/dungeons/runs/[runId]/complete
  ↓
Server generates loot:
  - Roll on combined loot table
  - Apply efficiency modifier
  - Apply synergy bonuses
  - Generate expedition log
  ↓
Award loot & XP
Free heroes
Update statistics
  ↓
Return rewards + log
```

### 4. Optimize Dungeon
```
Client: GET /api/dungeons/[id]/preview
  - Alternative monster combinations
  ↓
Server calculates for each:
  - Total power
  - Active synergies
  - Loot table
  - Efficiency score
  ↓
Return comparisons
  ↓
Client: PATCH /api/dungeons/[id]
  - monsters: [new configuration]
  ↓
Server re-validates and updates
```

---

## Database Schema Summary

```sql
-- Core tables for Phase 2
CREATE TABLE captured_monsters (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  monster_definition_id TEXT NOT NULL,
  rarity TEXT NOT NULL,
  power INTEGER NOT NULL,
  captured_at TIMESTAMP DEFAULT NOW(),
  captured_zone_id TEXT,
  captured_subzone_id TEXT
);

CREATE TABLE player_schematics (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  schematic_id TEXT NOT NULL,
  collected_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, schematic_id)
);

CREATE TABLE dungeons (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  schematic_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',  -- draft | active | inactive
  monsters JSONB NOT NULL,       -- [{slotId, capturedMonsterId}]
  power INTEGER NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dungeon_runs (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  dungeon_id UUID REFERENCES dungeons(id),
  hero_ids UUID[] NOT NULL,
  status TEXT DEFAULT 'in_progress',  -- in_progress | completed | collected
  started_at TIMESTAMP DEFAULT NOW(),
  completes_at TIMESTAMP NOT NULL,
  efficiency INTEGER,
  rewards JSONB,
  log JSONB
);

-- Phase 3 addition
CREATE TABLE discovered_synergies (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  synergy_id TEXT NOT NULL,
  discovered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, synergy_id)
);
```

---

## Request/Response Examples

### Create Dungeon
```typescript
// POST /api/dungeons
{
  "schematicId": "cave-ruins-3",
  "name": "Fire Gear Farm",
  "monsters": [
    { "slotId": "slot-1", "capturedMonsterId": "uuid-1" },
    { "slotId": "slot-2", "capturedMonsterId": "uuid-2" },
    { "slotId": "slot-3", "capturedMonsterId": "uuid-3" }
  ],
  "status": "active"
}

// Response
{
  "dungeon": {
    "id": "dungeon-uuid",
    "name": "Fire Gear Farm",
    "status": "active",
    "power": 850,
    // ... full dungeon object
  },
  "validation": {
    "valid": true,
    "errors": []
  },
  "preview": {
    "power": 850,
    "estimatedRewards": {
      "gold": { "min": 100, "max": 150 },
      "items": [
        { "itemId": "fire-sword", "dropChance": 0.15 },
        { "itemId": "fire-armor", "dropChance": 0.12 }
      ]
    },
    "synergies": [
      {
        "synergyId": "fire-family",
        "name": "Fire Family",
        "bonus": 15,
        "contributingMonsters": ["uuid-1", "uuid-2"]
      }
    ],
    "efficiency": 85
  }
}
```

### Start Dungeon Run
```typescript
// POST /api/dungeons/[id]/start
{
  "heroIds": ["hero-uuid-1", "hero-uuid-2"]
}

// Response
{
  "run": {
    "id": "run-uuid",
    "dungeonId": "dungeon-uuid",
    "status": "in_progress",
    "startedAt": "2025-12-29T10:00:00Z",
    "completesAt": "2025-12-29T12:00:00Z"
  },
  "heroes": [
    { "id": "hero-uuid-1", "isOnExpedition": true, /* ... */ },
    { "id": "hero-uuid-2", "isOnExpedition": true, /* ... */ }
  ],
  "estimatedCompletion": "2025-12-29T12:00:00Z",
  "preview": {
    "power": 600,
    "vsRequirement": 500,
    "efficiency": 120,
    "estimatedLoot": { /* ... */ }
  }
}
```

### Complete Dungeon Run
```typescript
// POST /api/dungeons/runs/[runId]/complete
// (No body required)

// Response
{
  "run": { /* ... */ },
  "rewards": {
    "loot": [
      {
        "item": { "id": "fire-sword", "name": "Flame Blade" },
        "source": {
          "monsterId": "fire-elemental-uuid",
          "monsterName": "Fire Elemental"
        },
        "rare": false,
        "synergyBonus": true
      }
    ],
    "gold": 125,
    "xp": {
      "hero-uuid-1": 50,
      "hero-uuid-2": 50
    }
  },
  "heroes": [
    { "id": "hero-uuid-1", "isOnExpedition": false, /* ... */ }
  ],
  "statistics": {
    "efficiency": 120,
    "vsExpected": {
      "better": ["fire-sword"],
      "worse": [],
      "luckyDrops": []
    }
  },
  "log": { /* Expedition-style log with trait reactions */ }
}
```

---

## Validation Schemas

### Create Dungeon
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

### Start Dungeon Run
```typescript
const startDungeonRunSchema = z.object({
  heroIds: z.array(z.string().uuid()).min(1).max(4)
})
```

### Update Dungeon
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

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "statusMessage": "Unauthorized"
}
```

**400 Validation Failed:**
```json
{
  "statusCode": 400,
  "statusMessage": "Invalid request",
  "data": {
    "errors": [
      {
        "path": ["monsters", 0, "slotId"],
        "message": "Invalid slot ID"
      }
    ]
  }
}
```

**403 Slot Limit:**
```json
{
  "statusCode": 403,
  "statusMessage": "SLOT_LIMIT_REACHED",
  "data": {
    "current": 5,
    "max": 5,
    "message": "Deactivate a dungeon or upgrade to Supporter for more slots"
  }
}
```

**409 Monster In Use:**
```json
{
  "statusCode": 409,
  "statusMessage": "MONSTER_IN_USE",
  "data": {
    "monsterId": "uuid",
    "dungeonId": "existing-dungeon-uuid",
    "message": "Monster already placed in 'Fire Farm' dungeon"
  }
}
```

---

## Performance Tips

### Caching Strategy
- **Static data** (monster definitions, schematics, synergies): Cache indefinitely
- **Player collection** (captured monsters): Cache with 5min TTL
- **Dungeon list**: Cache with 1min TTL, invalidate on mutations
- **Active runs**: No cache, always fresh data

### Query Optimization
```typescript
// ✅ Good: Single query with joins
const { data } = await supabase
  .from('dungeons')
  .select(`
    *,
    captured_monsters!inner(*)
  `)
  .eq('player_id', playerId)

// ❌ Bad: N+1 queries
const dungeons = await getDungeons(playerId)
for (const dungeon of dungeons) {
  const monsters = await getMonsters(dungeon.id) // N queries!
}
```

### Pagination
```typescript
// Always paginate large result sets
const limit = Math.min(requestedLimit || 50, 100) // Max 100
const offset = requestedOffset || 0

const { data, count } = await supabase
  .from('table')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1)
```

---

## Security Checklist

- [ ] All endpoints check `serverSupabaseUser`
- [ ] All mutations verify `player_id` ownership
- [ ] Monster placement verifies monster ownership
- [ ] Slot limits enforced server-side
- [ ] Rewards can only be collected once (check status)
- [ ] Input sanitization on all text fields (names, tags)
- [ ] Rate limiting on expensive operations (optimize, preview)
- [ ] RLS policies on all tables
- [ ] No sensitive data in error messages

---

## Client-Side Integration

### Pinia Stores

```typescript
// stores/monsters.ts
export const useMonsterStore = defineStore('monsters', () => {
  const monsters = ref<CapturedMonster[]>([])
  const loading = ref(false)

  async function fetchMonsters(filters?: MonsterFilters) {
    loading.value = true
    const data = await $fetch('/api/monsters', { query: filters })
    monsters.value = data.monsters
    loading.value = false
  }

  return { monsters, loading, fetchMonsters }
})

// stores/dungeons.ts
export const useDungeonStore = defineStore('dungeons', () => {
  const dungeons = ref<Dungeon[]>([])
  const activeDungeon = ref<Dungeon | null>(null)

  async function createDungeon(payload: CreateDungeonPayload) {
    const dungeon = await $fetch('/api/dungeons', {
      method: 'POST',
      body: payload
    })
    dungeons.value.push(dungeon)
    return dungeon
  }

  async function startRun(dungeonId: string, heroIds: string[]) {
    return await $fetch(`/api/dungeons/${dungeonId}/start`, {
      method: 'POST',
      body: { heroIds }
    })
  }

  return { dungeons, activeDungeon, createDungeon, startRun }
})
```

### Composables

```typescript
// composables/useDungeonBuilder.ts
export function useDungeonBuilder(schematicId: string) {
  const monsterStore = useMonsterStore()
  const placement = ref<Map<string, string>>(new Map())

  const preview = computedAsync(async () => {
    if (placement.value.size === 0) return null

    return await $fetch(`/api/dungeons/preview`, {
      method: 'POST',
      body: {
        schematicId,
        monsters: Array.from(placement.value.entries()).map(
          ([slotId, monsterId]) => ({ slotId, capturedMonsterId: monsterId })
        )
      }
    })
  })

  function placeMonster(slotId: string, monsterId: string) {
    placement.value.set(slotId, monsterId)
  }

  function removeMonster(slotId: string) {
    placement.value.delete(slotId)
  }

  return { placement, preview, placeMonster, removeMonster }
}
```

---

## Testing Examples

### Endpoint Test
```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('POST /api/dungeons', () => {
  beforeEach(async () => {
    await seedTestData()
  })

  it('creates dungeon successfully', async () => {
    const response = await $fetch('/api/dungeons', {
      method: 'POST',
      body: {
        schematicId: 'test-schematic',
        monsters: [
          { slotId: 'slot-1', capturedMonsterId: 'monster-1' }
        ],
        status: 'active'
      },
      headers: authHeaders()
    })

    expect(response.dungeon).toBeDefined()
    expect(response.dungeon.status).toBe('active')
    expect(response.validation.valid).toBe(true)
  })

  it('rejects invalid slot types', async () => {
    await expect(
      $fetch('/api/dungeons', {
        method: 'POST',
        body: {
          schematicId: 'test-schematic',
          monsters: [
            { slotId: 'beast-slot', capturedMonsterId: 'elemental-monster' }
          ],
          status: 'active'
        },
        headers: authHeaders()
      })
    ).rejects.toThrow(/SLOT_MISMATCH/)
  })

  it('enforces slot limits', async () => {
    // Create 5 active dungeons (free player limit)
    await createActiveDungeons(5)

    await expect(
      $fetch('/api/dungeons', {
        method: 'POST',
        body: validPayload(),
        headers: authHeaders()
      })
    ).rejects.toThrow(/SLOT_LIMIT_REACHED/)
  })
})
```

---

## Next Steps

1. ✅ Review API design
2. ⬜ Create TypeScript types (`/types/dungeons.ts`)
3. ⬜ Create database migrations
4. ⬜ Implement Phase 2a endpoints (10 endpoints)
5. ⬜ Create Pinia stores
6. ⬜ Build UI components (DungeonBuilder, MonsterCollection)
7. ⬜ Write tests
8. ⬜ Implement Phase 2b (optimization)
9. ⬜ Implement Phase 3 (discovery & stats)

---

**For full details, see:** [dungeon-building-api-design.md](./dungeon-building-api-design.md)
