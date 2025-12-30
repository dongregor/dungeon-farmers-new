# API Implementation Guide

**Created:** 2025-12-30
**Status:** Ready for implementation
**Related:** [ANALYSIS.md](./ANALYSIS.md) | [README.md](./README.md)

This guide provides concrete implementation patterns for the API endpoints based on the recommendations in the analysis document.

---

## Table of Contents

1. [Caching Layer](#caching-layer)
2. [Batched Query Patterns](#batched-query-patterns)
3. [SSE Connection Management](#sse-connection-management)
4. [Delta Sync System](#delta-sync-system)
5. [Content Loading System](#content-loading-system)
6. [Database Indexes](#database-indexes)
7. [Rate Limiting](#rate-limiting)

---

## Caching Layer

### Cache Configuration (nuxt.config.ts)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Static content - cache 24 hours
    '/api/content/**': {
      cache: {
        maxAge: 86400,
        staleWhileRevalidate: 3600,
        swr: true
      }
    },

    // Zone data - cache 1 hour (rarely changes)
    '/api/zones': {
      cache: {
        maxAge: 3600,
        staleWhileRevalidate: 600,
        swr: true
      }
    },
    '/api/zones/**': {
      cache: {
        maxAge: 3600,
        staleWhileRevalidate: 600,
        swr: true
      }
    },

    // Player-scoped - short cache with auth vary
    '/api/player': {
      cache: {
        maxAge: 300, // 5 minutes
        staleWhileRevalidate: 60,
        varies: ['Authorization']
      }
    },
    '/api/heroes': {
      cache: {
        maxAge: 300,
        staleWhileRevalidate: 60,
        varies: ['Authorization']
      }
    },

    // No cache - real-time data
    '/api/sync': { cache: false },
    '/api/tavern': { cache: false },
    '/api/events/**': { cache: false },
    '/api/expeditions/*/complete': { cache: false }
  }
})
```

### Server-Side Cache Utility

```typescript
// server/utils/cache.ts
import { LRUCache } from 'lru-cache'

interface CacheOptions {
  ttl: number          // Time to live in ms
  maxSize?: number     // Max items in cache
  staleWhileRevalidate?: number
}

// In-memory LRU cache
const cache = new LRUCache<string, { data: any; timestamp: number }>({
  max: 1000,
  ttl: 1000 * 60 * 5  // 5 minutes default
})

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  return entry.data as T
}

export function setCache<T>(key: string, data: T, ttl?: number): void {
  cache.set(key, { data, timestamp: Date.now() }, { ttl })
}

export function invalidateCache(pattern: string): void {
  const keys = [...cache.keys()].filter(k => k.startsWith(pattern))
  keys.forEach(k => cache.delete(k))
}

export function invalidatePlayerCache(playerId: string): void {
  invalidateCache(`player:${playerId}:`)
}

// Cache key generators
export const cacheKeys = {
  playerHeroes: (playerId: string) => `player:${playerId}:heroes`,
  playerItems: (playerId: string) => `player:${playerId}:items`,
  playerProfile: (playerId: string) => `player:${playerId}:profile`,
  zoneDetails: (zoneId: string) => `zone:${zoneId}`,
  contentVersion: () => 'content:version'
}
```

### Cache Usage in Endpoints

```typescript
// server/api/heroes/index.get.ts
import { getCached, setCache, cacheKeys } from '~/server/utils/cache'

export default defineEventHandler(async (event) => {
  const playerId = await getAuthenticatedPlayer(event)
  const cacheKey = cacheKeys.playerHeroes(playerId)

  // Check cache first
  const cached = getCached<HeroListResponse>(cacheKey)
  if (cached) {
    return { success: true, data: cached, meta: { cached: true } }
  }

  // Fetch from database
  const heroes = await db.heroes.findMany({
    where: { playerId },
    include: { equipment: true, traits: true },
    orderBy: { powerScore: 'desc' }
  })

  // Cache for 5 minutes
  setCache(cacheKey, heroes, 1000 * 60 * 5)

  return { success: true, data: heroes }
})

// Invalidate on mutations
// server/api/heroes/[id]/level-up.post.ts
export default defineEventHandler(async (event) => {
  const playerId = await getAuthenticatedPlayer(event)
  const heroId = getRouterParam(event, 'id')

  // ... level up logic ...

  // Invalidate caches
  invalidatePlayerCache(playerId)

  return { success: true, data: result }
})
```

---

## Batched Query Patterns

### The Problem: N+1 Queries

```typescript
// ❌ BAD: N+1 query pattern
async function getHeroesWithEquipment(playerId: string) {
  const heroes = await db.heroes.findMany({ where: { playerId } })

  // This runs N queries!
  for (const hero of heroes) {
    hero.equipment = await db.items.findMany({
      where: { equippedBy: hero.id }
    })
    hero.traits = await db.heroTraits.findMany({
      where: { heroId: hero.id }
    })
  }

  return heroes
}
```

### Solution 1: Include (Eager Loading)

```typescript
// ✅ GOOD: Single query with includes
async function getHeroesWithEquipment(playerId: string) {
  return db.heroes.findMany({
    where: { playerId },
    include: {
      equipment: true,
      traits: true,
      currentExpedition: {
        select: { id: true, status: true, completesAt: true }
      }
    }
  })
}
```

### Solution 2: DataLoader Pattern

```typescript
// server/utils/dataLoaders.ts
import DataLoader from 'dataloader'

// Equipment loader - batches item fetches
export function createEquipmentLoader() {
  return new DataLoader<string, Item[]>(async (heroIds) => {
    // Single query for all heroes
    const items = await db.items.findMany({
      where: { equippedBy: { in: [...heroIds] } }
    })

    // Group by heroId
    const itemsByHero = new Map<string, Item[]>()
    for (const item of items) {
      const heroItems = itemsByHero.get(item.equippedBy) || []
      heroItems.push(item)
      itemsByHero.set(item.equippedBy, heroItems)
    }

    // Return in same order as input
    return heroIds.map(id => itemsByHero.get(id) || [])
  })
}

// Usage in resolver
export default defineEventHandler(async (event) => {
  const equipmentLoader = createEquipmentLoader()

  const heroes = await db.heroes.findMany({ where: { playerId } })

  // These are batched automatically!
  const heroesWithEquipment = await Promise.all(
    heroes.map(async hero => ({
      ...hero,
      equipment: await equipmentLoader.load(hero.id)
    }))
  )

  return heroesWithEquipment
})
```

### Solution 3: Batch Updates

```typescript
// ❌ BAD: Individual updates
async function grantExpeditionRewards(heroIds: string[], xpAmount: number) {
  for (const heroId of heroIds) {
    await db.heroes.update({
      where: { id: heroId },
      data: { experience: { increment: xpAmount } }
    })
  }
}

// ✅ GOOD: Batch update
async function grantExpeditionRewards(heroIds: string[], xpAmount: number) {
  await db.heroes.updateMany({
    where: { id: { in: heroIds } },
    data: { experience: { increment: xpAmount } }
  })

  // If you need the updated records
  return db.heroes.findMany({
    where: { id: { in: heroIds } }
  })
}
```

### Expedition Completion Example

```typescript
// server/api/expeditions/[id]/complete.post.ts
export default defineEventHandler(async (event) => {
  const playerId = await getAuthenticatedPlayer(event)
  const expeditionId = getRouterParam(event, 'id')

  // Use transaction for atomicity
  return db.$transaction(async (tx) => {
    // 1. Get expedition with all related data in ONE query
    const expedition = await tx.expeditions.findUnique({
      where: { id: expeditionId },
      include: {
        heroes: { include: { equipment: true } },
        zone: true
      }
    })

    if (!expedition || expedition.playerId !== playerId) {
      throw createError({ statusCode: 404, message: 'Expedition not found' })
    }

    // 2. Calculate rewards (in-memory, no DB)
    const rewards = calculateExpeditionRewards(expedition)

    // 3. Batch update heroes
    await tx.heroes.updateMany({
      where: { id: { in: expedition.heroes.map(h => h.id) } },
      data: { status: 'idle' }
    })

    // 4. Batch create items
    if (rewards.items.length > 0) {
      await tx.items.createMany({
        data: rewards.items.map(item => ({
          ...item,
          playerId,
          acquiredFrom: expeditionId
        }))
      })
    }

    // 5. Update player resources (single query)
    await tx.players.update({
      where: { id: playerId },
      data: {
        gold: { increment: rewards.gold },
        // Experience handled per-hero above
      }
    })

    // 6. Update expedition status
    await tx.expeditions.update({
      where: { id: expeditionId },
      data: { status: 'completed', rewards }
    })

    // 7. Invalidate caches
    invalidatePlayerCache(playerId)

    return { success: true, data: { expedition, rewards } }
  })
})
```

---

## SSE Connection Management

### Connection Limits & Tracking

```typescript
// server/utils/sseConnections.ts
interface SSEConnection {
  playerId: string
  connectionId: string
  controller: ReadableStreamController
  createdAt: number
  lastHeartbeat: number
}

// Track active connections per player
const connections = new Map<string, SSEConnection>()

export function registerConnection(
  playerId: string,
  controller: ReadableStreamController
): string {
  const connectionId = `conn_${Date.now()}_${Math.random().toString(36).slice(2)}`

  // Close existing connection for this player (1 per user limit)
  const existing = connections.get(playerId)
  if (existing) {
    try {
      existing.controller.close()
    } catch {
      // Already closed
    }
    console.log(`[SSE] Closed existing connection for player ${playerId}`)
  }

  // Register new connection
  connections.set(playerId, {
    playerId,
    connectionId,
    controller,
    createdAt: Date.now(),
    lastHeartbeat: Date.now()
  })

  console.log(`[SSE] New connection ${connectionId} for player ${playerId}`)
  return connectionId
}

export function removeConnection(playerId: string): void {
  connections.delete(playerId)
}

export function sendEventToPlayer(
  playerId: string,
  event: string,
  data: any
): boolean {
  const conn = connections.get(playerId)
  if (!conn) return false

  try {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    conn.controller.enqueue(new TextEncoder().encode(message))
    return true
  } catch {
    // Connection closed
    connections.delete(playerId)
    return false
  }
}

export function broadcastEvent(event: string, data: any): number {
  let sent = 0
  for (const [playerId] of connections) {
    if (sendEventToPlayer(playerId, event, data)) {
      sent++
    }
  }
  return sent
}

// Heartbeat to keep connections alive
setInterval(() => {
  const now = Date.now()
  for (const [playerId, conn] of connections) {
    // Close stale connections (no heartbeat ack in 2 minutes)
    if (now - conn.lastHeartbeat > 120000) {
      try {
        conn.controller.close()
      } catch {}
      connections.delete(playerId)
      console.log(`[SSE] Closed stale connection for player ${playerId}`)
      continue
    }

    // Send heartbeat
    sendEventToPlayer(playerId, 'heartbeat', { timestamp: now })
  }
}, 30000) // Every 30 seconds
```

### SSE Endpoint Implementation

```typescript
// server/api/events/subscribe.get.ts
import { registerConnection, removeConnection, sendEventToPlayer } from '~/server/utils/sseConnections'

export default defineEventHandler(async (event) => {
  const playerId = await getAuthenticatedPlayer(event)

  // Set SSE headers
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no') // Disable nginx buffering

  // Create readable stream
  const stream = new ReadableStream({
    start(controller) {
      const connectionId = registerConnection(playerId, controller)

      // Send connected event
      const message = `event: connected\ndata: ${JSON.stringify({
        connectionId,
        timestamp: Date.now()
      })}\n\n`
      controller.enqueue(new TextEncoder().encode(message))
    },
    cancel() {
      removeConnection(playerId)
    }
  })

  // Handle client disconnect
  event.node.req.on('close', () => {
    removeConnection(playerId)
  })

  return sendStream(event, stream)
})
```

### Sending Events from Other Endpoints

```typescript
// server/api/expeditions/[id]/complete.post.ts
import { sendEventToPlayer } from '~/server/utils/sseConnections'

export default defineEventHandler(async (event) => {
  // ... expedition completion logic ...

  // Send SSE event
  sendEventToPlayer(playerId, 'expedition_complete', {
    expeditionId,
    rewards,
    timestamp: Date.now()
  })

  return { success: true, data: result }
})

// Scheduled job for expedition completion checks
// server/tasks/check-expeditions.ts
import { sendEventToPlayer } from '~/server/utils/sseConnections'

export async function checkCompletedExpeditions() {
  const completed = await db.expeditions.findMany({
    where: {
      status: 'active',
      completesAt: { lte: new Date() }
    },
    include: { player: true }
  })

  for (const expedition of completed) {
    sendEventToPlayer(expedition.playerId, 'expedition_complete', {
      expeditionId: expedition.id,
      requiresAction: true,
      timestamp: Date.now()
    })
  }
}
```

---

## Delta Sync System

### Sync State Tracking

```typescript
// server/utils/syncState.ts
interface SyncCheckpoint {
  syncId: string
  timestamp: number
  heroesVersion: number
  itemsVersion: number
  expeditionsVersion: number
  monstersVersion: number
  dungeonsVersion: number
}

// Store last sync per player (in Redis or DB for production)
const syncCheckpoints = new Map<string, SyncCheckpoint>()

export function getLastSync(playerId: string): SyncCheckpoint | null {
  return syncCheckpoints.get(playerId) || null
}

export function saveSync(playerId: string, checkpoint: SyncCheckpoint): void {
  syncCheckpoints.set(playerId, checkpoint)
}

// Entity version tracking
// Each update increments the version in the database
async function incrementVersion(
  tx: Transaction,
  playerId: string,
  entity: 'heroes' | 'items' | 'expeditions' | 'monsters' | 'dungeons'
): Promise<number> {
  const result = await tx.playerVersions.upsert({
    where: { playerId_entity: { playerId, entity } },
    create: { playerId, entity, version: 1 },
    update: { version: { increment: 1 } }
  })
  return result.version
}
```

### Delta Sync Endpoint

```typescript
// server/api/sync.post.ts
import { getLastSync, saveSync } from '~/server/utils/syncState'

export default defineEventHandler(async (event) => {
  const playerId = await getAuthenticatedPlayer(event)
  const body = await readBody(event)

  const {
    clientTimestamp,
    clientVersion,
    lastSyncId
  } = body

  const lastSync = lastSyncId ? getLastSync(playerId) : null
  const isFullSync = !lastSync
  const serverTimestamp = Date.now()

  // Get current versions
  const versions = await db.playerVersions.findMany({
    where: { playerId }
  })
  const versionMap = Object.fromEntries(
    versions.map(v => [v.entity, v.version])
  )

  // Build response based on what changed
  const response: any = {
    syncId: `sync_${serverTimestamp}`,
    serverTimestamp,
    fullSync: isFullSync
  }

  if (isFullSync) {
    // Full sync - return everything
    const [heroes, items, expeditions, monsters, dungeons, player] = await Promise.all([
      db.heroes.findMany({ where: { playerId }, include: { equipment: true } }),
      db.items.findMany({ where: { playerId } }),
      db.expeditions.findMany({ where: { playerId, status: 'active' } }),
      db.monsters.findMany({ where: { playerId } }),
      db.dungeons.findMany({ where: { playerId } }),
      db.players.findUnique({ where: { id: playerId } })
    ])

    response.state = { heroes, items, expeditions, monsters, dungeons, player }
    response.versions = versionMap
  } else {
    // Delta sync - only return changed entities
    response.changes = {}
    response.versions = versionMap

    if (versionMap.heroes !== lastSync.heroesVersion) {
      response.changes.heroes = await db.heroes.findMany({
        where: { playerId, updatedAt: { gt: new Date(lastSync.timestamp) } },
        include: { equipment: true }
      })
    }

    if (versionMap.items !== lastSync.itemsVersion) {
      response.changes.items = await db.items.findMany({
        where: { playerId, updatedAt: { gt: new Date(lastSync.timestamp) } }
      })
    }

    if (versionMap.expeditions !== lastSync.expeditionsVersion) {
      response.changes.expeditions = await db.expeditions.findMany({
        where: { playerId, updatedAt: { gt: new Date(lastSync.timestamp) } }
      })
    }

    // Track deleted IDs
    response.deleted = await db.deletedEntities.findMany({
      where: { playerId, deletedAt: { gt: new Date(lastSync.timestamp) } }
    })
  }

  // Calculate offline progress
  const offlineDuration = serverTimestamp - (lastSync?.timestamp || serverTimestamp)
  if (offlineDuration > 60000) { // More than 1 minute offline
    response.offlineProgress = await calculateOfflineProgress(playerId, offlineDuration)
  }

  // Save sync checkpoint
  saveSync(playerId, {
    syncId: response.syncId,
    timestamp: serverTimestamp,
    heroesVersion: versionMap.heroes || 0,
    itemsVersion: versionMap.items || 0,
    expeditionsVersion: versionMap.expeditions || 0,
    monstersVersion: versionMap.monsters || 0,
    dungeonsVersion: versionMap.dungeons || 0
  })

  return { success: true, data: response }
})
```

### Client-Side Sync

```typescript
// composables/useSync.ts
export const useSync = () => {
  const lastSyncId = ref<string | null>(localStorage.getItem('lastSyncId'))
  const isSyncing = ref(false)

  async function sync(force = false) {
    if (isSyncing.value) return
    isSyncing.value = true

    try {
      const response = await $fetch('/api/sync', {
        method: 'POST',
        body: {
          clientTimestamp: Date.now(),
          clientVersion: useRuntimeConfig().public.appVersion,
          lastSyncId: force ? null : lastSyncId.value
        }
      })

      if (response.success) {
        // Update stores with new data
        if (response.data.fullSync) {
          // Replace all state
          useHeroStore().setHeroes(response.data.state.heroes)
          useItemStore().setItems(response.data.state.items)
          // ... etc
        } else {
          // Merge changes
          useHeroStore().mergeHeroes(response.data.changes.heroes || [])
          useItemStore().mergeItems(response.data.changes.items || [])

          // Handle deletions
          for (const deleted of response.data.deleted || []) {
            switch (deleted.entity) {
              case 'hero':
                useHeroStore().removeHero(deleted.entityId)
                break
              case 'item':
                useItemStore().removeItem(deleted.entityId)
                break
            }
          }
        }

        // Handle offline progress
        if (response.data.offlineProgress) {
          showOfflineProgressModal(response.data.offlineProgress)
        }

        // Save sync ID
        lastSyncId.value = response.data.syncId
        localStorage.setItem('lastSyncId', response.data.syncId)
      }
    } finally {
      isSyncing.value = false
    }
  }

  return { sync, isSyncing, lastSyncId }
}
```

---

## Content Loading System

### Server-Side Content Loader

```typescript
// server/utils/content.ts
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface ContentCache {
  version: string
  loadedAt: number
  zones: Map<string, ZoneDefinition>
  monsters: Map<string, MonsterTemplate>
  items: Map<string, ItemTemplate>
  traits: Map<string, TraitDefinition>
  events: Map<string, EventTemplate>
  sets: Map<string, SetDefinition>
  achievements: Map<string, AchievementDefinition>
  schematics: Map<string, SchematicDefinition>
  synergies: SynergyConfig
}

let contentCache: ContentCache | null = null

function loadJsonFile<T>(path: string): T {
  const content = readFileSync(path, 'utf-8')
  return JSON.parse(content)
}

function loadContentDirectory<T>(
  dir: string,
  indexFile: string,
  itemKey: string
): Map<string, T> {
  const indexPath = join(dir, indexFile)
  const index = loadJsonFile<any>(indexPath)
  const items = new Map<string, T>()

  for (const ref of index[itemKey] || []) {
    if (ref.file) {
      const itemPath = join(dir, ref.file)
      if (existsSync(itemPath)) {
        items.set(ref.id, loadJsonFile<T>(itemPath))
      }
    } else if (ref.id) {
      // Inline definition
      items.set(ref.id, ref)
    }
  }

  return items
}

export function loadContent(forceReload = false): ContentCache {
  if (contentCache && !forceReload) {
    return contentCache
  }

  const contentDir = join(process.cwd(), 'content')
  const startTime = Date.now()

  console.log('[Content] Loading content files...')

  contentCache = {
    version: loadJsonFile<any>(join(contentDir, 'zones/index.json')).version,
    loadedAt: Date.now(),
    zones: loadContentDirectory(join(contentDir, 'zones'), 'index.json', 'zones'),
    monsters: loadContentDirectory(join(contentDir, 'monsters'), 'index.json', 'monsters'),
    items: loadContentDirectory(join(contentDir, 'items'), 'index.json', 'templates'),
    traits: new Map(loadJsonFile<any>(join(contentDir, 'traits/index.json')).traits.map((t: any) => [t.id, t])),
    events: loadContentDirectory(join(contentDir, 'events'), 'index.json', 'events'),
    sets: loadContentDirectory(join(contentDir, 'items/sets'), '../index.json', 'sets'),
    achievements: new Map(loadJsonFile<any>(join(contentDir, 'achievements/index.json')).achievements.map((a: any) => [a.id, a])),
    schematics: loadContentDirectory(join(contentDir, 'schematics'), 'index.json', 'schematics'),
    synergies: loadJsonFile(join(contentDir, 'synergies/index.json'))
  }

  console.log(`[Content] Loaded in ${Date.now() - startTime}ms:`)
  console.log(`  - Zones: ${contentCache.zones.size}`)
  console.log(`  - Monsters: ${contentCache.monsters.size}`)
  console.log(`  - Items: ${contentCache.items.size}`)
  console.log(`  - Traits: ${contentCache.traits.size}`)

  return contentCache
}

// Getters
export function getZone(id: string): ZoneDefinition | undefined {
  return loadContent().zones.get(id)
}

export function getMonster(id: string): MonsterTemplate | undefined {
  return loadContent().monsters.get(id)
}

export function getItem(id: string): ItemTemplate | undefined {
  return loadContent().items.get(id)
}

export function getTrait(id: string): TraitDefinition | undefined {
  return loadContent().traits.get(id)
}

export function getEvent(id: string): EventTemplate | undefined {
  return loadContent().events.get(id)
}

export function getContentVersion(): string {
  return loadContent().version
}

// Hot reload for development
if (process.dev) {
  // Watch content directory and reload on changes
  const chokidar = await import('chokidar')
  const watcher = chokidar.watch(join(process.cwd(), 'content'), {
    ignoreInitial: true
  })

  watcher.on('change', (path) => {
    console.log(`[Content] File changed: ${path}`)
    loadContent(true)
  })
}
```

### Content API Endpoint

```typescript
// server/api/content/index.get.ts
import { loadContent, getContentVersion } from '~/server/utils/content'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const clientVersion = query.v as string

  const content = loadContent()
  const serverVersion = getContentVersion()

  // Return 304 if client has latest version
  if (clientVersion === serverVersion) {
    setResponseStatus(event, 304)
    return null
  }

  return {
    success: true,
    data: {
      version: serverVersion,
      zones: Array.from(content.zones.values()),
      monsters: Array.from(content.monsters.values()),
      items: Array.from(content.items.values()),
      traits: Array.from(content.traits.values()),
      events: Array.from(content.events.values()),
      sets: Array.from(content.sets.values()),
      achievements: Array.from(content.achievements.values()),
      synergies: content.synergies
    }
  }
})
```

---

## Database Indexes

### Required Indexes (SQL)

```sql
-- Players table
CREATE UNIQUE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_deleted ON players(deleted_at) WHERE deleted_at IS NULL;

-- Heroes table
CREATE INDEX idx_heroes_player_status ON heroes(player_id, status);
CREATE INDEX idx_heroes_player_rarity ON heroes(player_id, rarity);
CREATE INDEX idx_heroes_player_power ON heroes(player_id, power_score DESC);
CREATE INDEX idx_heroes_updated ON heroes(updated_at);

-- Items table
CREATE INDEX idx_items_player_slot ON items(player_id, slot);
CREATE INDEX idx_items_player_rarity ON items(player_id, rarity);
CREATE INDEX idx_items_player_power ON items(player_id, power_score DESC);
CREATE INDEX idx_items_equipped ON items(equipped_by) WHERE equipped_by IS NOT NULL;
CREATE INDEX idx_items_updated ON items(updated_at);

-- Expeditions table
CREATE INDEX idx_expeditions_player_status ON expeditions(player_id, status);
CREATE INDEX idx_expeditions_completes ON expeditions(completes_at)
  WHERE status = 'active';
CREATE INDEX idx_expeditions_updated ON expeditions(updated_at);

-- Monsters table
CREATE INDEX idx_monsters_player_dungeon ON monsters(player_id, assigned_dungeon);
CREATE INDEX idx_monsters_player_template ON monsters(player_id, template_id);
CREATE INDEX idx_monsters_updated ON monsters(updated_at);

-- Dungeons table
CREATE INDEX idx_dungeons_player_status ON dungeons(player_id, status);
CREATE INDEX idx_dungeons_updated ON dungeons(updated_at);

-- Sync tracking
CREATE INDEX idx_deleted_entities ON deleted_entities(player_id, deleted_at);
CREATE INDEX idx_player_versions ON player_versions(player_id);
```

### Supabase Migration

```typescript
// supabase/migrations/001_add_performance_indexes.sql
-- Add performance indexes for common queries

-- Heroes
CREATE INDEX IF NOT EXISTS idx_heroes_player_status
  ON heroes(player_id, status);
CREATE INDEX IF NOT EXISTS idx_heroes_player_power
  ON heroes(player_id, power_score DESC);

-- Items
CREATE INDEX IF NOT EXISTS idx_items_player_slot
  ON items(player_id, slot);
CREATE INDEX IF NOT EXISTS idx_items_equipped
  ON items(equipped_by) WHERE equipped_by IS NOT NULL;

-- Expeditions
CREATE INDEX IF NOT EXISTS idx_expeditions_active
  ON expeditions(completes_at) WHERE status = 'active';

-- Add updated_at columns for delta sync
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE expeditions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE monsters ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE dungeons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER heroes_updated_at BEFORE UPDATE ON heroes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER expeditions_updated_at BEFORE UPDATE ON expeditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Rate Limiting

### Rate Limiter Utility

```typescript
// server/utils/rateLimit.ts
import { LRUCache } from 'lru-cache'

interface RateLimitConfig {
  windowMs: number    // Time window in ms
  maxRequests: number // Max requests per window
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitCache = new LRUCache<string, RateLimitEntry>({
  max: 10000,
  ttl: 1000 * 60 * 5 // 5 minute cleanup
})

const routeConfigs: Record<string, RateLimitConfig> = {
  // Auth endpoints - strict
  '/api/auth/login': { windowMs: 60000, maxRequests: 5 },
  '/api/auth/register': { windowMs: 60000, maxRequests: 3 },
  '/api/auth/guest': { windowMs: 3600000, maxRequests: 3 },

  // Mutation endpoints - moderate
  '/api/expeditions/start': { windowMs: 60000, maxRequests: 20 },
  '/api/tavern/recruit': { windowMs: 60000, maxRequests: 30 },
  '/api/heroes/*/level-up': { windowMs: 60000, maxRequests: 50 },

  // Read endpoints - generous
  '/api/heroes': { windowMs: 60000, maxRequests: 100 },
  '/api/expeditions': { windowMs: 60000, maxRequests: 100 },

  // Default
  'default': { windowMs: 60000, maxRequests: 100 }
}

export function checkRateLimit(
  identifier: string,
  route: string
): { allowed: boolean; remaining: number; resetAt: number } {
  // Find matching config
  let config = routeConfigs.default
  for (const [pattern, cfg] of Object.entries(routeConfigs)) {
    if (pattern === 'default') continue
    const regex = new RegExp('^' + pattern.replace(/\*/g, '[^/]+') + '$')
    if (regex.test(route)) {
      config = cfg
      break
    }
  }

  const key = `${identifier}:${route}`
  const now = Date.now()

  let entry = rateLimitCache.get(key)
  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + config.windowMs }
  }

  entry.count++
  rateLimitCache.set(key, entry)

  const remaining = Math.max(0, config.maxRequests - entry.count)
  const allowed = entry.count <= config.maxRequests

  return { allowed, remaining, resetAt: entry.resetAt }
}
```

### Rate Limit Middleware

```typescript
// server/middleware/rateLimit.ts
import { checkRateLimit } from '~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Skip for non-API routes
  if (!event.path.startsWith('/api/')) return

  // Get identifier (user ID or IP)
  const playerId = await getAuthenticatedPlayerSafe(event)
  const identifier = playerId || getRequestIP(event) || 'unknown'

  const result = checkRateLimit(identifier, event.path)

  // Set rate limit headers
  setHeader(event, 'X-RateLimit-Remaining', result.remaining.toString())
  setHeader(event, 'X-RateLimit-Reset', result.resetAt.toString())

  if (!result.allowed) {
    throw createError({
      statusCode: 429,
      message: 'Too many requests',
      data: {
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
      }
    })
  }
})
```

---

## Related Documentation

- [ANALYSIS.md](./ANALYSIS.md) - Performance, cost, and maintainability analysis
- [README.md](./README.md) - API overview and conventions
- [01-core-game-api.md](./01-core-game-api.md) - Core game endpoints
- [02-dungeon-building-api.md](./02-dungeon-building-api.md) - Dungeon system endpoints
- [03-progression-economy-api.md](./03-progression-economy-api.md) - Progression endpoints
- [04-auth-realtime-api.md](./04-auth-realtime-api.md) - Auth and real-time endpoints
