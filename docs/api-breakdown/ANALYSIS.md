# API Analysis: Performance, Cost, and Maintainability

**Created:** 2025-12-29
**Status:** Analysis complete
**Scope:** 140+ endpoints across 4 documentation files

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Performance Analysis](#performance-analysis)
3. [Cost Analysis](#cost-analysis)
4. [Maintainability Analysis](#maintainability-analysis)
5. [JSON Content Data Structures](#json-content-data-structures)
6. [Recommendations](#recommendations)

---

## Executive Summary

### Key Findings

| Area | Status | Risk Level | Priority Actions |
|------|--------|------------|------------------|
| Performance | Good design, some concerns | Medium | Add caching layer, optimize N+1 queries |
| Cost | Reasonable for MVP | Low | Monitor SSE connections, batch operations |
| Maintainability | Strong patterns | Low | Formalize JSON content system, add validation |

### Quick Stats
- **Total Endpoints:** 140+
- **Phase 1 (MVP):** ~60 endpoints
- **Database Tables:** ~10 core tables
- **Real-time Channels:** SSE (MVP) → Supabase Realtime (Production)

---

## Performance Analysis

### 1. N+1 Query Risks

Several endpoints have potential N+1 query patterns that need careful implementation:

#### High Risk Endpoints

| Endpoint | Risk | Mitigation |
|----------|------|------------|
| `GET /api/heroes` | Heroes → Equipment → Sets → Traits | Use JOINs or DataLoader pattern |
| `GET /api/expeditions` | Expeditions → Heroes → Events → Logs | Batch hero data, paginate logs |
| `GET /api/dungeons` | Dungeons → Slots → Monsters → Synergies | Pre-compute synergy bonuses |
| `GET /api/equipment?upgradesFor=` | Items → Compare to hero stats | Cache hero stats, batch compare |

#### Recommended Solutions

```typescript
// ❌ N+1 Pattern
const heroes = await db.heroes.findMany({ where: { playerId } })
for (const hero of heroes) {
  hero.equipment = await db.items.findMany({ where: { equippedBy: hero.id } })
  hero.traits = await db.traits.findMany({ where: { heroId: hero.id } })
}

// ✅ Batched Pattern
const heroes = await db.heroes.findMany({
  where: { playerId },
  include: {
    equipment: true,
    traits: true
  }
})

// ✅ DataLoader Pattern (for complex cases)
const heroLoader = new DataLoader(async (heroIds) => {
  const equipment = await db.items.findMany({
    where: { equippedBy: { in: heroIds } }
  })
  return heroIds.map(id => equipment.filter(e => e.equippedBy === id))
})
```

### 2. Heavy Computation Endpoints

These endpoints require significant server-side computation:

| Endpoint | Computation | Recommendation |
|----------|-------------|----------------|
| `GET /api/expeditions/preview` | Efficiency calc, reward estimates | Cache zone data, pre-compute loot tables |
| `POST /api/sets/plan` | Optimization algorithm | Limit hero count, use greedy algorithm |
| `GET /api/dungeons/:id/synergies` | Multi-monster synergy calc | Denormalize synergy bonuses |
| `GET /api/equipment/compare` | Multi-item stat comparison | Limit to 5 items max |

### 3. Caching Strategy

#### Recommended Cache Layers

```plaintext
┌─────────────────────────────────────────────────────────┐
│                    Cache Hierarchy                       │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Static Content (24h TTL)                      │
│  ├── Zone definitions                                    │
│  ├── Monster templates                                   │
│  ├── Item templates                                      │
│  ├── Trait definitions                                   │
│  ├── Schematic definitions                               │
│  └── Set bonus definitions                               │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Player-Scoped (5-15min TTL)                   │
│  ├── Player profile (5min)                               │
│  ├── Hero list summary (5min)                            │
│  ├── Active expeditions (real-time invalidation)         │
│  └── Achievement progress (15min)                        │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Request-Level (no cache)                      │
│  ├── Tavern state (dynamic)                              │
│  ├── Transaction operations                              │
│  └── Real-time sync                                      │
└─────────────────────────────────────────────────────────┘
```

#### Implementation

```typescript
// Static content caching (nuxt.config.ts)
routeRules: {
  '/api/content/**': {
    cache: { maxAge: 86400 } // 24 hours
  },
  '/api/player': {
    cache: {
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: true,
      vary: ['Authorization']
    }
  }
}

// Invalidation on mutations
async function equipItem(heroId: string, itemId: string) {
  await db.items.update({ equippedBy: heroId })

  // Invalidate affected caches
  await cache.invalidate(`player:${playerId}:heroes`)
  await cache.invalidate(`player:${playerId}:items`)
}
```

### 4. Pagination & Limits

Current documented limits are appropriate:

| Resource | Default Limit | Max Limit | Recommendation |
|----------|---------------|-----------|----------------|
| Heroes | 20 | 100 | Good |
| Equipment | 20 | 100 | Good |
| Expeditions | 10 recent | N/A | Add cursor pagination |
| Notifications | 20 | 50 | Good |
| Achievements | All | All | Add category filtering |

### 5. Real-Time Performance

#### SSE Connection Concerns

| Concern | Impact | Mitigation |
|---------|--------|------------|
| Connection limits | Memory per connection | 1 connection per user |
| Reconnection storms | Server overload | Exponential backoff |
| Heartbeat overhead | Bandwidth | 30s intervals |
| Event fan-out | Database polling | Supabase Realtime (Phase 2) |

#### Recommended SSE Architecture

```typescript
// Server-side (Nuxt)
export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const playerId = await getAuthenticatedPlayer(event)

  // Close existing connection for this player
  await closeExistingConnection(playerId)

  // Create event stream
  const stream = createEventStream(playerId)

  // Heartbeat
  const heartbeat = setInterval(() => {
    stream.push({ event: 'heartbeat', data: { timestamp: Date.now() } })
  }, 30000)

  event.node.req.on('close', () => {
    clearInterval(heartbeat)
    stream.close()
  })

  return stream
})
```

---

## Cost Analysis

### 1. Supabase Pricing Impact

#### Free Tier Limits

| Resource | Free Limit | Estimated MVP Usage | Risk |
|----------|------------|---------------------|------|
| Database | 500MB | ~50MB for 1K users | Low |
| Auth MAUs | 50,000 | 1K-5K | Low |
| Storage | 1GB | ~100MB | Low |
| Bandwidth | 5GB | ~2GB/month | Low |
| Edge Functions | 500K/month | ~200K | Low |
| Realtime connections | 200 | 100-150 | Medium |

#### Cost Scaling Estimates

```plaintext
Users      Database    Auth    Realtime    Monthly Cost
1,000      Free        Free    Free        $0
5,000      Free        Free    $25         $25
10,000     $25         Free    $25         $50
50,000     $25         $100    $100        $225
100,000    $75         $200    $200        $475
```

### 2. High-Cost Operations

| Operation | Cost Factor | Mitigation |
|-----------|-------------|------------|
| `POST /api/sync` | Database reads on every reconnect | Delta sync, caching |
| `GET /api/expeditions/:id/log` | Large text storage | Log compression, pagination |
| `GET /api/events/subscribe` | Persistent connections | Connection pooling |
| `POST /api/expeditions/complete` | Complex reward calculation | Pre-compute, queue |

### 3. Cost Optimization Strategies

#### Database Query Optimization

```sql
-- Add indexes for common queries (already in schema)
CREATE INDEX idx_heroes_player_status ON heroes(player_id, status);
CREATE INDEX idx_heroes_player_power ON heroes(player_id, power_score DESC);
CREATE INDEX idx_expeditions_player_status ON expeditions(player_id, status);
CREATE INDEX idx_expeditions_completes_at ON expeditions(completes_at)
  WHERE status = 'active';

-- Consider materialized views for leaderboards (Phase 4+)
CREATE MATERIALIZED VIEW player_rankings AS
SELECT
  player_id,
  SUM(power_score) as total_power,
  COUNT(*) as hero_count
FROM heroes
GROUP BY player_id
ORDER BY total_power DESC;
```

#### Batch Operations

```typescript
// ❌ Individual updates (expensive)
for (const hero of completedHeroes) {
  await db.heroes.update({ experience: hero.experience + reward })
}

// ✅ Batch update (cheap)
await db.heroes.updateMany({
  where: { id: { in: completedHeroIds } },
  data: { experience: { increment: reward } }
})
```

### 4. Bandwidth Considerations

| Endpoint | Avg Response Size | Daily Calls (1K users) | Daily Bandwidth |
|----------|-------------------|------------------------|-----------------|
| `GET /api/heroes` | 15KB | 10,000 | 150MB |
| `GET /api/sync` | 25KB | 5,000 | 125MB |
| `GET /api/expeditions` | 8KB | 20,000 | 160MB |
| SSE events | 500B each | 100,000 | 50MB |
| **Total** | | | **~500MB/day** |

---

## Maintainability Analysis

### 1. Strong Patterns (Keep)

#### Consistent Response Format
```typescript
// All endpoints follow this pattern
interface ApiResponse<T> {
  success: true
  data: T
  meta?: {
    page?: number
    total?: number
    timestamp?: number
  }
}

interface ApiError {
  success: false
  error: {
    code: string      // Machine-readable
    message: string   // Human-readable
    details?: any     // Context
  }
}
```

#### File-Based Routing
```plaintext
server/api/
├── heroes/
│   ├── index.get.ts          # GET /api/heroes
│   ├── [id].get.ts           # GET /api/heroes/:id
│   ├── [id].patch.ts         # PATCH /api/heroes/:id
│   └── [id]/
│       └── retire.post.ts    # POST /api/heroes/:id/retire
```

#### Zod Validation
```typescript
// Consistent input validation
const HeroListSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['power', 'level', 'name', 'rarity']).optional(),
  rarity: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, HeroListSchema.parse)
  // ...
})
```

### 2. Potential Issues

#### Type Duplication Risk

```typescript
// Risk: Types defined in API docs may drift from implementation
// Solution: Single source of truth in types/ directory

// types/hero.ts (canonical)
export interface Hero {
  id: string
  name: string
  rarity: Rarity
  // ...
}

// API response types extend these
export interface HeroListResponse {
  heroes: Hero[]
  meta: PaginationMeta
}
```

#### Cross-Endpoint Dependencies

Some operations span multiple endpoints:

| Trigger | Affected Endpoints | Risk |
|---------|-------------------|------|
| Hero equip | Heroes, Equipment, Sets | State sync |
| Expedition complete | Expeditions, Heroes, Items, Achievements | Transaction integrity |
| Account delete | All player data | Cascade delete |

**Solution:** Use database transactions

```typescript
// server/utils/transactions.ts
export async function completeExpedition(expeditionId: string) {
  return await db.$transaction(async (tx) => {
    const expedition = await tx.expeditions.update({ status: 'completed' })
    await tx.heroes.updateMany({ experience: increment })
    await tx.items.createMany({ data: rewards })
    await tx.achievements.checkAndUpdate({ playerId })
    return expedition
  })
}
```

### 3. Code Organization Recommendations

```plaintext
server/
├── api/                    # Route handlers (thin layer)
├── services/               # Business logic
│   ├── heroService.ts
│   ├── expeditionService.ts
│   └── dungeonService.ts
├── repositories/           # Database access
│   ├── heroRepository.ts
│   └── expeditionRepository.ts
├── validators/             # Zod schemas
│   ├── heroSchemas.ts
│   └── expeditionSchemas.ts
└── utils/
    ├── cache.ts
    ├── transactions.ts
    └── errors.ts
```

### 4. Testing Strategy

```typescript
// Integration test example
describe('POST /api/expeditions/complete', () => {
  it('should award rewards and update heroes', async () => {
    // Setup
    const player = await createTestPlayer()
    const heroes = await createTestHeroes(player.id, 3)
    const expedition = await startTestExpedition(heroes)

    // Fast-forward time
    await advanceTime(expedition.duration)

    // Execute
    const response = await $fetch(`/api/expeditions/${expedition.id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${player.token}` }
    })

    // Assert
    expect(response.success).toBe(true)
    expect(response.data.rewards.gold).toBeGreaterThan(0)

    // Verify side effects
    const updatedHeroes = await getHeroes(player.id)
    expect(updatedHeroes[0].experience).toBeGreaterThan(heroes[0].experience)
  })
})
```

---

## JSON Content Data Structures

### 1. Content Types Overview

Static game content should be stored in JSON files for easy updates without code changes.

```plaintext
content/
├── zones/                  # Zone definitions
│   ├── index.json          # Zone list and metadata
│   └── forest.json         # Individual zone data
├── monsters/               # Monster templates
│   ├── index.json
│   └── by-zone/
│       └── forest.json
├── items/                  # Item templates
│   ├── index.json
│   ├── weapons.json
│   ├── armor.json
│   └── sets.json
├── traits/                 # Trait definitions
│   └── index.json
├── schematics/             # Dungeon schematics
│   └── index.json
├── synergies/              # Synergy definitions
│   └── index.json
├── events/                 # Expedition event templates
│   ├── index.json
│   └── by-biome/
│       └── forest.json
├── achievements/           # Achievement definitions
│   └── index.json
├── quests/                 # Quest templates
│   ├── daily.json
│   ├── weekly.json
│   └── story.json
└── localization/           # Text strings
    ├── en.json
    └── es.json
```

### 2. Zone Content Structure

```typescript
// content/zones/index.json
interface ZoneIndex {
  version: string
  lastUpdated: string
  zones: ZoneReference[]
}

interface ZoneReference {
  id: string
  file: string       // Path to full definition
  biome: string
  difficulty: number
  order: number      // Unlock order
}

// content/zones/forest.json
interface ZoneDefinition {
  id: "zone_forest"
  name: "Whispering Woods"
  description: "Ancient forest full of mystery..."
  lore: "Long ago, the elves..."

  biome: "forest"
  difficulty: {
    tier: "Normal"
    level: 1
    recommendedPower: 500
  }

  duration: {
    min: 30      // minutes
    max: 120
    baseModifier: 1.0
  }

  visuals: {
    background: "/images/zones/forest-bg.webp"
    icon: "/images/zones/forest-icon.webp"
    colors: {
      primary: "#228B22"
      secondary: "#013220"
    }
  }

  lootTable: {
    gold: {
      base: 100
      variance: 0.5   // ±50%
      efficiencyScaling: 1.2
    }
    experience: {
      base: 200
      variance: 0.3
    }
    items: [
      {
        templateId: "forest_blade"
        weight: 100          // Relative drop weight
        minEfficiency: 80    // Require 80%+ efficiency
        rarityBoost: {
          epic: 1.0          // Normal drop rate
          legendary: 0.1     // 10% of normal
        }
      }
    ]
    materials: [
      {
        id: "wood"
        amount: { min: 3, max: 8 }
        weight: 200
      }
    ]
  }

  monsters: [
    {
      templateId: "forest_sprite"
      spawnWeight: 100
      captureChance: 0.05
    },
    {
      templateId: "wild_boar"
      spawnWeight: 80
      captureChance: 0.08
    }
  ]

  events: [
    { templateId: "mysterious_chest", chance: 0.15 },
    { templateId: "ancient_tree", chance: 0.10, requiresTrait: "nature_affinity" }
  ]

  passiveIncome: {
    slots: 2
    goldPerHour: 25
    experiencePerHour: 12
    bonusTraits: ["forest_guide"]
  }

  unlockRequirements: {
    type: "zone_complete"
    zoneId: "zone_meadow"
    times: 1
  }

  achievements: [
    "ach_forest_explorer",
    "ach_forest_master"
  ]
}
```

### 3. Monster Content Structure

```typescript
// content/monsters/index.json
interface MonsterIndex {
  version: string
  monsters: MonsterReference[]
  rarityDistribution: {
    common: 0.60
    uncommon: 0.25
    rare: 0.10
    epic: 0.04
    legendary: 0.01
  }
}

// content/monsters/templates/forest_sprite.json
interface MonsterTemplate {
  id: "forest_sprite"
  name: "Forest Sprite"
  description: "A mischievous nature spirit..."

  biome: "forest"
  category: "spirit"

  baseStats: {
    power: 50
    health: 100
    attack: 30
    defense: 20
    speed: 40
  }

  rarityScaling: {
    // Multipliers per rarity
    common: 1.0
    uncommon: 1.3
    rare: 1.6
    epic: 2.0
    legendary: 2.5
  }

  traits: {
    guaranteed: ["nature_affinity"]
    possible: [
      { id: "quick", chance: 0.3 },
      { id: "elusive", chance: 0.2 }
    ]
  }

  lootTable: {
    // Drops when monster is in player's dungeon
    gold: { base: 10, variance: 0.3 }
    items: [
      {
        templateId: "sprite_dust"
        chance: 0.15
        amountRange: [1, 3]
      }
    ]
    materials: [
      { id: "nature_essence", chance: 0.10 }
    ]
  }

  synergies: {
    // Bonus when placed with these monsters
    pairs: [
      {
        monsterId: "treant"
        bonusType: "power"
        value: 0.10   // +10% power
      }
    ]
    tribes: ["nature", "spirit"]
  }

  visuals: {
    sprite: "/images/monsters/forest_sprite.webp"
    portrait: "/images/monsters/forest_sprite_portrait.webp"
    animations: {
      idle: "/animations/monsters/sprite_idle.json"
      attack: "/animations/monsters/sprite_attack.json"
    }
  }

  captureInfo: {
    baseChance: 0.05
    bonusTraits: ["monster_tamer", "nature_affinity"]
    bonusPerTrait: 0.02
  }
}
```

### 4. Item/Equipment Content Structure

```typescript
// content/items/index.json
interface ItemIndex {
  version: string
  slots: ["weapon", "armor", "accessory", "trinket"]
  rarities: Rarity[]
  sets: SetReference[]
}

// content/items/weapons.json
interface WeaponTemplates {
  templates: ItemTemplate[]
}

interface ItemTemplate {
  id: "iron_sword"
  name: "Iron Sword"
  description: "A sturdy blade..."

  slot: "weapon"
  category: "sword"

  baseStats: {
    attack: 20
    speed: 5
  }

  statRolls: {
    // Random variance on drop
    attack: { min: 0.85, max: 1.15 }
    speed: { min: 0.90, max: 1.10 }
    bonusStats: [
      { stat: "critChance", chance: 0.3, range: [2, 5] },
      { stat: "critDamage", chance: 0.2, range: [5, 15] }
    ]
  }

  rarityScaling: {
    common: { multiplier: 1.0, maxBonusStats: 0 }
    uncommon: { multiplier: 1.2, maxBonusStats: 1 }
    rare: { multiplier: 1.5, maxBonusStats: 2 }
    epic: { multiplier: 2.0, maxBonusStats: 3 }
    legendary: { multiplier: 2.5, maxBonusStats: 4, guaranteedEffect: true }
  }

  possibleEffects: [
    {
      id: "flame_strike"
      name: "Flame Strike"
      description: "5% chance to deal bonus fire damage"
      rarity: ["epic", "legendary"]
      effect: {
        trigger: "on_hit"
        chance: 0.05
        damage: { type: "fire", multiplier: 0.5 }
      }
    }
  ]

  setId: null  // or "iron_set" for set items

  sources: [
    { type: "zone", id: "zone_forest", dropRate: 0.08 },
    { type: "zone", id: "zone_caves", dropRate: 0.12 }
  ]

  sellValue: {
    common: 50
    uncommon: 100
    rare: 250
    epic: 500
    legendary: 1000
  }

  salvageValue: {
    common: { material: "iron_shard", amount: 1 }
    rare: { material: "iron_shard", amount: 3 }
    epic: { material: "refined_iron", amount: 1 }
  }

  visuals: {
    icon: "/images/items/iron_sword.webp"
    equipped: "/images/items/iron_sword_equipped.webp"
  }
}

// content/items/sets.json
interface SetDefinitions {
  sets: SetDefinition[]
}

interface SetDefinition {
  id: "forest_set"
  name: "Forest Guardian"
  description: "Worn by ancient protectors..."

  pieces: {
    weapon: "guardian_blade"
    armor: "guardian_mail"
    accessory: "guardian_amulet"
    trinket: "guardian_charm"
  }

  bonuses: [
    {
      pieces: 2
      name: "Nature's Touch"
      description: "+10% forest zone efficiency"
      effects: [
        { type: "zone_efficiency", biome: "forest", value: 0.10 }
      ]
    },
    {
      pieces: 4
      name: "Guardian's Might"
      description: "+25 defense, +10% nature damage"
      effects: [
        { type: "stat", stat: "defense", value: 25 },
        { type: "damage", damageType: "nature", value: 0.10 }
      ]
    }
  ]

  lore: "The Forest Guardians were..."

  farmingTips: [
    "All pieces drop from Whispering Woods",
    "Higher efficiency increases drop rates"
  ]
}
```

### 5. Trait Content Structure

```typescript
// content/traits/index.json
interface TraitIndex {
  version: string
  categories: ["combat", "exploration", "social", "crafting", "quirks"]
  traits: TraitDefinition[]
}

interface TraitDefinition {
  id: "forest_guide"
  name: "Forest Guide"
  description: "Knows the ways of the woods"
  flavor: "\"The trees speak to those who listen.\""

  category: "exploration"
  rarity: "rare"   // How often this trait appears

  effects: [
    {
      type: "zone_efficiency"
      biome: "forest"
      value: 0.15   // +15%
      condition: null
    }
  ]

  conditionalEffects: [
    {
      type: "expedition_duration"
      value: -0.10  // -10% duration
      condition: {
        type: "team_has_trait"
        trait: "nature_affinity"
        count: 2
      }
    }
  ]

  narrativeHooks: {
    // Used for expedition log generation
    triggers: ["forest_zone", "nature_monster", "ancient_tree_event"]
    phrases: [
      "{{hero.name}} navigates the forest paths with ease.",
      "The sprites seem to recognize {{hero.name}} as one of their own."
    ]
  }

  synergies: {
    positive: ["nature_affinity", "herbalist"]
    negative: ["city_dweller", "technophile"]
  }

  icon: "/images/traits/forest_guide.webp"
  color: "#228B22"
}
```

### 6. Event Content Structure

```typescript
// content/events/index.json
interface EventIndex {
  version: string
  eventsByBiome: Record<string, string[]>  // biome -> event IDs
  globalEvents: string[]                    // Can occur anywhere
}

// content/events/templates/mysterious_chest.json
interface EventTemplate {
  id: "mysterious_chest"
  name: "Mysterious Chest"

  biomes: ["forest", "caves", "ruins"]
  baseChance: 0.15

  trigger: {
    type: "random"
    minProgress: 0.25   // At least 25% into expedition
    maxProgress: 0.75   // Before 75%
    cooldown: null      // Can occur multiple times
  }

  introduction: {
    text: "Your party stumbles upon an ornate chest half-buried in the undergrowth. Ancient runes glow faintly on its surface."

    traitVariants: [
      {
        trait: "cautious"
        text: "{{hero.name}} eyes the chest warily. \"Could be trapped,\" they mutter."
      },
      {
        trait: "greedy"
        text: "{{hero.name}}'s eyes light up with gold-fever. \"Open it! Open it now!\""
      }
    ]
  }

  choices: [
    {
      id: "open_carefully"
      label: "Open Carefully"
      description: "Take your time to check for traps"

      requirements: null  // Available to all

      outcomes: [
        {
          weight: 60
          type: "success"
          narrative: "Your caution pays off. The chest clicks open safely, revealing..."
          rewards: {
            gold: { base: 100, variance: 0.3 }
            items: [
              { templateId: "random_equipment", chance: 0.3 }
            ]
          }
          efficiencyBonus: 5
        },
        {
          weight: 30
          type: "partial"
          narrative: "The chest was indeed trapped, but your careful approach minimized the damage."
          rewards: {
            gold: { base: 50, variance: 0.2 }
          }
          damage: { type: "team", amount: 0.05 }  // 5% team damage
        },
        {
          weight: 10
          type: "failure"
          narrative: "Despite your caution, the trap triggers. The chest was empty anyway!"
          rewards: null
          damage: { type: "team", amount: 0.10 }
        }
      ]

      traitModifiers: [
        {
          trait: "careful"
          outcomeWeights: { success: 80, partial: 18, failure: 2 }
        },
        {
          trait: "lucky"
          rewardMultiplier: 1.5
        }
      ]
    },
    {
      id: "smash_open"
      label: "Smash It Open"
      description: "Who has time for careful? LOOT!"

      requirements: {
        trait: "strong"  // Only available if party has this trait
      }

      outcomes: [
        {
          weight: 40
          type: "success"
          narrative: "{{hero.name}} smashes the chest to splinters! Gold coins scatter everywhere!"
          rewards: {
            gold: { base: 200, variance: 0.5 }
            items: [
              { templateId: "random_equipment", chance: 0.5 }
            ]
          }
        },
        {
          weight: 40
          type: "partial"
          narrative: "The chest breaks, but the violent approach damages some contents."
          rewards: {
            gold: { base: 75, variance: 0.2 }
          }
        },
        {
          weight: 20
          type: "failure"
          narrative: "BOOM! The chest explodes, showering the party with splinters and... glitter?"
          rewards: null
          damage: { type: "team", amount: 0.15 }
        }
      ]
    },
    {
      id: "leave_it"
      label: "Leave It Alone"
      description: "Not worth the risk"

      requirements: null

      outcomes: [
        {
          weight: 100
          type: "neutral"
          narrative: "The party wisely moves on, leaving the mysterious chest undisturbed."
          rewards: null
          efficiencyBonus: 2  // Small bonus for not wasting time
        }
      ]
    }
  ]

  followUp: {
    // Can chain to another event
    chance: 0.1
    eventId: "grateful_spirit"
    condition: { choice: "leave_it" }
  }
}
```

### 7. Achievement Content Structure

```typescript
// content/achievements/index.json
interface AchievementIndex {
  version: string
  categories: AchievementCategory[]
  achievements: AchievementDefinition[]
}

interface AchievementDefinition {
  id: "ach_hero_collector"
  category: "heroes"

  name: "Hero Collector"
  description: "Build your legendary roster"

  secret: false

  tiers: [
    {
      tier: 1
      name: "Novice Recruiter"
      requirement: {
        type: "stat_threshold"
        stat: "heroes_recruited"
        value: 10
      }
      rewards: [
        { type: "gold", amount: 500 },
        { type: "title", id: "title_recruiter" }
      ]
      points: 10
    },
    {
      tier: 2
      name: "Experienced Recruiter"
      requirement: {
        type: "stat_threshold"
        stat: "heroes_recruited"
        value: 50
      }
      rewards: [
        { type: "gold", amount: 2000 },
        { type: "cosmetic", id: "portrait_recruiter" }
      ]
      points: 25
    },
    {
      tier: 3
      name: "Master Recruiter"
      requirement: {
        type: "stat_threshold"
        stat: "heroes_recruited"
        value: 200
      }
      rewards: [
        { type: "gold", amount: 10000 },
        { type: "cosmetic", id: "effect_heroic_glow" }
      ]
      points: 50
    }
  ]

  hintEvolution: {
    // For secret achievements
    thresholds: [25, 50, 75]
    hints: {
      vague: "Recruit many heroes...",
      moderate: "Recruit 50+ heroes to unlock this achievement",
      specific: "You need {{remaining}} more heroes!"
    }
  }

  icon: {
    locked: "/images/achievements/hero_collector_locked.webp"
    tier1: "/images/achievements/hero_collector_1.webp"
    tier2: "/images/achievements/hero_collector_2.webp"
    tier3: "/images/achievements/hero_collector_3.webp"
  }
}
```

### 8. Content Loading Strategy

```typescript
// server/utils/content.ts
import { readFileSync } from 'fs'
import { join } from 'path'

interface ContentCache {
  zones: Map<string, ZoneDefinition>
  monsters: Map<string, MonsterTemplate>
  items: Map<string, ItemTemplate>
  traits: Map<string, TraitDefinition>
  events: Map<string, EventTemplate>
  sets: Map<string, SetDefinition>
  achievements: Map<string, AchievementDefinition>
}

let contentCache: ContentCache | null = null
let contentVersion: string | null = null

export function loadContent(forceReload = false): ContentCache {
  if (contentCache && !forceReload) {
    return contentCache
  }

  const contentDir = join(process.cwd(), 'content')

  contentCache = {
    zones: loadJsonDirectory<ZoneDefinition>(join(contentDir, 'zones')),
    monsters: loadJsonDirectory<MonsterTemplate>(join(contentDir, 'monsters')),
    items: loadJsonDirectory<ItemTemplate>(join(contentDir, 'items')),
    traits: loadJsonFile<TraitDefinition[]>(join(contentDir, 'traits/index.json')),
    events: loadJsonDirectory<EventTemplate>(join(contentDir, 'events')),
    sets: loadJsonFile<SetDefinition[]>(join(contentDir, 'items/sets.json')),
    achievements: loadJsonFile<AchievementDefinition[]>(join(contentDir, 'achievements/index.json'))
  }

  return contentCache
}

// API endpoint for client-side content
export default defineEventHandler(async (event) => {
  const content = loadContent()

  return {
    success: true,
    data: {
      version: contentVersion,
      zones: Array.from(content.zones.values()),
      // ... other content
    }
  }
})
```

### 9. Content Validation

```typescript
// scripts/validate-content.ts
import { z } from 'zod'
import { loadContent } from '../server/utils/content'

const ZoneSchema = z.object({
  id: z.string().regex(/^zone_[a-z_]+$/),
  name: z.string().min(1).max(50),
  biome: z.enum(['forest', 'caves', 'ruins', 'desert', 'mountains']),
  difficulty: z.object({
    tier: z.enum(['Easy', 'Normal', 'Hard', 'Nightmare']),
    level: z.number().min(1).max(100),
    recommendedPower: z.number().min(100)
  }),
  lootTable: z.object({
    gold: z.object({ base: z.number(), variance: z.number() }),
    items: z.array(z.object({
      templateId: z.string(),
      weight: z.number()
    }))
  })
  // ... complete schema
})

async function validateContent() {
  const content = loadContent()
  const errors: string[] = []

  // Validate zones
  for (const [id, zone] of content.zones) {
    const result = ZoneSchema.safeParse(zone)
    if (!result.success) {
      errors.push(`Zone ${id}: ${result.error.message}`)
    }
  }

  // Cross-reference validation
  for (const [id, zone] of content.zones) {
    for (const monster of zone.monsters) {
      if (!content.monsters.has(monster.templateId)) {
        errors.push(`Zone ${id} references unknown monster: ${monster.templateId}`)
      }
    }
  }

  if (errors.length > 0) {
    console.error('Content validation failed:')
    errors.forEach(e => console.error(`  - ${e}`))
    process.exit(1)
  }

  console.log('Content validation passed!')
}

validateContent()
```

---

## Recommendations

### Priority 1: Performance (Before Launch)

1. **Implement caching layer** for static content
2. **Add database indexes** as documented in schema
3. **Use batched queries** in all list endpoints
4. **Limit SSE connections** to 1 per user
5. **Add query timeout** (30s max)

### Priority 2: Cost Optimization (Ongoing)

1. **Monitor Supabase metrics** weekly
2. **Implement delta sync** to reduce bandwidth
3. **Compress expedition logs** after completion
4. **Set up alerts** for usage spikes

### Priority 3: Maintainability (Before Phase 2)

1. **Create content/ directory** with JSON files
2. **Add content validation** in CI/CD
3. **Extract business logic** to services/
4. **Write integration tests** for critical paths

### Priority 4: Content System (Phase 2)

1. **Build content editor** (admin tool)
2. **Implement hot-reload** for development
3. **Add versioning** for content updates
4. **Create content migration** system

---

## Related Documentation

- [API Breakdown README](./README.md)
- [Core Game API](./01-core-game-api.md)
- [Dungeon Building API](./02-dungeon-building-api.md)
- [Progression Economy API](./03-progression-economy-api.md)
- [Auth Realtime API](./04-auth-realtime-api.md)
- [Tech Stack Recommendation](../tech-stack-recommendation.md)
