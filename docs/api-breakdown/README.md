# Dungeon Farmers - API Breakdown

**Last Updated:** 2025-12-29
**Status:** Comprehensive API documentation based on user stories
**Total Endpoints:** 140+
**Tech Stack:** Nuxt 4 Server Routes + Supabase

---

## Overview

This directory contains a complete breakdown of all API endpoints required to implement the Dungeon Farmers game based on the user stories in `docs/user-stories/`.

The API design follows RESTful conventions with Nuxt 4 file-based routing patterns.

---

## Documentation Structure

| File | Description | Endpoints |
|------|-------------|-----------|
| [01-core-game-api.md](./01-core-game-api.md) | Heroes, Expeditions, Equipment | ~50 endpoints |
| [02-dungeon-building-api.md](./02-dungeon-building-api.md) | Monsters, Schematics, Dungeons | ~30 endpoints |
| [03-progression-economy-api.md](./03-progression-economy-api.md) | Player, Zones, Quests, Shop | ~35 endpoints |
| [04-auth-realtime-api.md](./04-auth-realtime-api.md) | Auth, Onboarding, Sync, SSE | ~27 endpoints |

---

## Quick Statistics

### By Category
- **Core Game APIs:** ~50 endpoints (Heroes, Expeditions, Equipment)
- **Dungeon Building APIs:** ~30 endpoints (Monsters, Schematics, Dungeons)
- **Progression/Economy APIs:** ~35 endpoints (Player, Zones, Quests, Shop)
- **Auth/Real-time APIs:** ~27 endpoints (Auth, Onboarding, Sync, SSE)

### By HTTP Method
- **GET:** ~55 (List, Detail, Preview endpoints)
- **POST:** ~65 (Create, Action endpoints)
- **PATCH:** ~15 (Update endpoints)
- **DELETE:** ~8 (Remove endpoints)

### By Implementation Phase
- **Phase 1 (MVP):** ~60 endpoints
- **Phase 2:** ~50 endpoints
- **Phase 3+:** ~30 endpoints

---

## API Conventions

### File Naming (Nuxt 4)

```
server/api/
├── heroes/
│   ├── index.get.ts          # GET /api/heroes
│   ├── [id].get.ts           # GET /api/heroes/:id
│   ├── [id].patch.ts         # PATCH /api/heroes/:id
│   └── [id]/
│       ├── retire.post.ts    # POST /api/heroes/:id/retire
│       └── prestige.post.ts  # POST /api/heroes/:id/prestige
```

### Authentication

All authenticated endpoints expect:
```typescript
// Header
Authorization: Bearer <jwt_token>

// Or for guest accounts
X-Guest-Token: <guest_token>
```

### Response Format

```typescript
// Success
{
  success: true,
  data: T,
  meta?: {
    page?: number,
    total?: number,
    timestamp?: number
  }
}

// Error
{
  success: false,
  error: {
    code: string,      // e.g., "HERO_NOT_FOUND"
    message: string,   // Human-readable message
    details?: any      // Additional context
  }
}
```

### Pagination

```typescript
// Request
GET /api/heroes?page=1&limit=20&sort=power&order=desc

// Response Meta
{
  meta: {
    page: 1,
    limit: 20,
    total: 127,
    totalPages: 7
  }
}
```

---

## Existing Implementation

The following endpoints are already implemented in `server/api/`:

### Heroes (5 endpoints)
- `GET /api/heroes` - List all heroes
- `GET /api/heroes/:id` - Get hero details
- `PATCH /api/heroes/:id` - Update hero
- `POST /api/heroes/:id/retire` - Retire hero
- `POST /api/heroes/:id/prestige` - Prestige hero

### Tavern (5 endpoints)
- `GET /api/tavern` - Get tavern state
- `POST /api/tavern/recruit` - Recruit hero
- `POST /api/tavern/refresh` - Refresh tavern
- `POST /api/tavern/lock/:index` - Lock slot
- `POST /api/tavern/unlock/:index` - Unlock slot

### Expeditions (7 endpoints)
- `GET /api/expeditions` - List expeditions
- `GET /api/expeditions/:id` - Get expedition details
- `GET /api/expeditions/preview` - Preview expedition
- `POST /api/expeditions/start` - Start expedition
- `POST /api/expeditions/:id/complete` - Complete expedition
- `POST /api/expeditions/:id/cancel` - Cancel expedition
- `POST /api/expeditions/:id/choice` - Make choice in expedition

### Equipment (3 endpoints)
- `GET /api/equipment` - List equipment
- `POST /api/equipment/:id/equip` - Equip item
- `POST /api/equipment/:id/upgrade` - Upgrade item

### Sync (1 endpoint)
- `POST /api/sync` - Sync game state

---

## API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Nuxt App)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Pinia Store │──│ $fetch()    │──│ useAsyncData()     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  (Nuxt Server)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│  Auth Layer   │   │  Rate Limiter │   │  Validation   │
│  (Supabase)   │   │  (per-route)  │   │  (Zod)        │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Input Sanitize │◄─── XSS/Injection Protection
                    │  (server/utils) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Business Logic │
                    │  (Server Utils) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Error Handler  │◄─── Transforms errors to safe responses
                    │  (middleware)   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Audit Logger   │◄─── Logs sensitive operations
                    │  (async)        │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Supabase     │
                    │   PostgreSQL    │
                    └─────────────────┘
```

### Security Layers Explained

1. **Auth Layer (Supabase):** JWT validation, session management
2. **Rate Limiter:** Per-route limits, IP tracking, abuse prevention
3. **Validation (Zod):** Schema validation, type checking
4. **Input Sanitize:** XSS prevention, SQL injection protection
5. **Error Handler:** Safe error responses (no stack traces in production)
6. **Audit Logger:** Logs purchases, account changes, admin actions

---

## Security Considerations

### Authentication
- JWT tokens for registered users (Supabase Auth)
- Guest tokens for anonymous play (linkable to account)
- Token refresh handled automatically
- Secure token storage (httpOnly cookies)

### Anti-Cheat Measures
- Server-side timestamp validation for all timed events
- Offline progress capped at 24-48 hours
- Rate limiting on all mutation endpoints
- Server-side random number generation
- Expedition completion validation against start time

### Input Validation
- All inputs validated with Zod schemas
- Sanitize user-generated content (hero names, etc.)
- Prevent SQL injection via Supabase client
- XSS protection on text fields

---

## Real-time Updates

### Server-Sent Events (MVP)
```typescript
// Client subscribes
const eventSource = new EventSource('/api/events/subscribe')

eventSource.addEventListener('expedition_complete', (e) => {
  const data = JSON.parse(e.data)
  // Handle expedition completion
})
```

### Event Types
- `expedition_complete` - Expedition finished
- `expedition_event` - Choice/event during expedition
- `tavern_refresh` - Tavern auto-refreshed
- `daily_reset` - Daily rewards available
- `achievement_unlocked` - Achievement earned

### Supabase Realtime (Production)
```typescript
// Subscribe to player's expeditions
supabase
  .channel('expeditions')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'expeditions',
    filter: `player_id=eq.${playerId}`
  }, (payload) => {
    // Handle update
  })
  .subscribe()
```

---

## User Story Coverage Map

| Category | Stories | Primary APIs |
|----------|---------|--------------|
| Onboarding | 27 | Auth, Player, Tutorial |
| Hero Management | 30 | Heroes, Tavern |
| Expeditions | 35 | Expeditions, Zones, Events |
| Dungeon Building | 33 | Monsters, Schematics, Dungeons |
| Equipment | 27 | Equipment, Inventory |
| Progression | 40 | Player, Quests, Achievements, Shop |

---

## Implementation Priority

### Phase 1 - MVP Core Loop
**Goal:** Playable hero management and expedition system

**APIs:**
- Auth (register, login, guest)
- Heroes (CRUD, level up)
- Tavern (recruit, refresh)
- Expeditions (start, complete, events)
- Equipment (view, equip)
- Inventory (basic management)
- Player (stats, resources)
- Sync (offline progress)

### Phase 2 - Dungeon Building
**Goal:** Monster capture, schematic collection, dungeon building

**APIs:**
- Monsters (capture, collection, assign)
- Schematics (collect, view)
- Dungeons (build, configure, run)
- Synergies (calculate, preview)
- Shop (supporter pack, cosmetics)
- Achievements (unlock, claim)

### Phase 3 - Depth & Polish
**Goal:** Optimization features, advanced progression

**APIs:**
- Set planning and optimization
- Loadouts (save, apply)
- Statistics and analytics
- Advanced filters/sorting
- Leaderboards (basic)

### Phase 4+ - Social & Content
**Goal:** Community features, AI content

**APIs:**
- Alliances (create, join, manage)
- Social (friends, sharing)
- AI-generated events
- Advanced leaderboards
- Raid system

---

## Related Documentation

- [User Stories](../user-stories/) - Complete user story definitions
- [UI Breakdown](../ui-breakdown/) - Pages, modals, and components
- [Tech Stack](../tech-stack-recommendation.md) - Technical architecture
- [Game Design](../../design/GAME_DESIGN_V2.md) - Game design document
- [Implementation Plans](../plans/) - Development roadmaps

---

## Database Schema Reference

Key tables (managed by Supabase):

```
players
├── id (uuid, PK)
├── email
├── display_name
├── gold, gems (resources)
├── supporter_status
├── deleted_at (nullable)     -- Soft delete for GDPR grace period
└── created_at, last_login
    INDEX: (email) UNIQUE
    INDEX: (deleted_at) WHERE deleted_at IS NULL

heroes
├── id (uuid, PK)
├── player_id (FK)
├── name, rarity, level
├── power_score (computed)    -- Denormalized for sorting
├── traits (jsonb)
├── stats (jsonb)
└── equipped_items (FK[])
    INDEX: (player_id, status)
    INDEX: (player_id, rarity)
    INDEX: (player_id, power_score DESC)

expeditions
├── id (uuid, PK)
├── player_id (FK)
├── hero_ids (FK[])
├── zone_id, type, status
├── started_at, completes_at
└── events, rewards (jsonb)
    INDEX: (player_id, status)
    INDEX: (completes_at) WHERE status = 'active'

items
├── id (uuid, PK)
├── player_id (FK)
├── template_id, rarity
├── power_score (computed)
├── stats (jsonb)
├── equipped_by (FK, nullable)
└── locked (boolean)
    INDEX: (player_id, slot)
    INDEX: (player_id, rarity)
    INDEX: (player_id, power_score DESC)

monsters
├── id (uuid, PK)
├── player_id (FK)
├── template_id, rarity
├── power, traits
└── assigned_dungeon (FK, nullable)
    INDEX: (player_id, assigned_dungeon)
    INDEX: (player_id, template_id)

dungeons
├── id (uuid, PK)
├── player_id (FK)
├── schematic_id (FK)
├── slots (jsonb)
├── synergy_bonuses (jsonb)
└── created_at, last_run
    INDEX: (player_id, status)
```

### Data Retention & GDPR Compliance

1. **Soft Delete Strategy:**
   - Account deletion sets `deleted_at` timestamp
   - Data retained for 30-day grace period (account recovery)
   - Automated job permanently deletes after 30 days
   - Anonymization alternative available (keeps gameplay stats, removes PII)

2. **Data Export:**
   - `GET /api/player/export` returns all player data as JSON
   - Includes: profile, heroes, items, monsters, dungeons, statistics
   - GDPR Article 20 compliant (data portability)

3. **Right to Erasure:**
   - `DELETE /api/auth/account` initiates deletion
   - Cascades to all player-owned data
   - Third-party integrations notified (Stripe customer deleted)

4. **Audit Trail:**
   - Login attempts, purchases, and account changes logged
   - Logs retained 90 days for security, then purged

---

## Next Steps

1. Review all documentation files in this directory
2. Implement Phase 1 APIs starting with auth
3. Set up Supabase database with schema
4. Create API integration tests
5. Document any deviations from spec
