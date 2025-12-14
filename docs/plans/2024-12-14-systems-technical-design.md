# Systems Technical Design

**Date:** 2024-12-14
**Status:** Brainstormed, ready for implementation
**Covers:** Log Generation, Timer Logic, API Routes

---

## Table of Contents

1. [Log Generation System](#1-log-generation-system)
2. [Timer Logic](#2-timer-logic)
3. [API Routes Specification](#3-api-routes-specification)

---

## 1. Log Generation System

### Philosophy

Hybrid approach: Quick summary for scanning + highlight moments with personality. Players who just want results can skim, but trait reactions add engagement.

### Log Structure

```typescript
interface ExpeditionLog {
  // Quick summary (always shown at top)
  summary: {
    duration: string          // "32 minutes"
    efficiency: string        // "112% efficiency"
    rewards: RewardSummary    // gold, xp, items count
  }

  // Structured narrative sections
  sections: LogSection[]
}

interface LogSection {
  type: 'departure' | 'travel' | 'encounter' | 'discovery' | 'return'
  title: string
  entries: LogEntry[]
}

interface LogEntry {
  text: string
  heroId?: string        // If hero-specific
  traitId?: string       // If trait reaction
  eventId?: string       // If from event
  type: 'narrative' | 'reaction' | 'combat' | 'loot' | 'choice_result'
}

interface RewardSummary {
  gold: number
  xp: number
  itemCount: number
  rareItems: string[]
  familiarityGain: number
  masteryGain: number
}
```

### Generation Approach

**Template + Event Injection:**
- Base template provides consistent structure (intro, conclusion)
- Events inject entries into middle sections
- Trait reactions triggered by relevant events with probability

### Template Flow

1. **Departure** - Always generated, sets the scene
2. **Travel** - Zone-type reactions from heroes (optional)
3. **Encounter(s)** - From events: combat, skill checks, choices
4. **Discovery** - Loot found, subzone discoveries
5. **Return** - Wrap-up with efficiency-based comment

### Trait Reaction Triggers

**Probability-based:** ~30% chance per relevant trigger, soft cap 2-3 reactions per hero per expedition.

**Trigger Types:**
- Zone type matches trait (Cave Dweller in caves)
- Combat occurs (combat-related traits)
- Loot found (loot-related traits)
- Events occur (story traits react to situations)
- Culture mismatch (homesick reactions)

### Template Data

```typescript
// Departure templates by zone type
const DEPARTURE_TEMPLATES: Record<ZoneType, string[]> = {
  forest: [
    "The party gathered their supplies and headed into {zoneName}.",
    "With weapons ready, the group ventured beneath the forest canopy.",
    "{leaderName} led the way as the trees closed in around them.",
  ],
  cave: [
    "Torches lit, the party descended into {zoneName}.",
    "The darkness of {zoneName} swallowed the group whole.",
    "Cool air rushed past as they entered {zoneName}.",
  ],
  mountain: [
    "The climb into {zoneName} began under clear skies.",
    "Rocky paths wound upward into {zoneName}.",
    "{leaderName} set a steady pace up the mountain trail.",
  ],
  swamp: [
    "Mud squelched underfoot as they entered {zoneName}.",
    "The fetid air of {zoneName} greeted them immediately.",
    "Careful steps carried the party into {zoneName}.",
  ],
  desert: [
    "Sand stretched endlessly as they crossed into {zoneName}.",
    "The heat of {zoneName} hit them like a wall.",
    "Covering their faces, the party pushed into {zoneName}.",
  ],
  ruins: [
    "Crumbling stones marked the entrance to {zoneName}.",
    "Ancient walls loomed as they approached {zoneName}.",
    "History whispered from every corner of {zoneName}.",
  ],
}

// Travel reactions (culture/trait based)
const TRAVEL_REACTIONS = {
  culture_mismatch: "{heroName} {cultureReaction}",
  culture_comfortable: "{heroName} {cultureReaction}",
  trait_zone_positive: "{heroName} {traitReaction}",
  trait_zone_negative: "{heroName} {traitReaction}",
}

// Encounter templates
const ENCOUNTER_TEMPLATES = {
  combat_start: "The party encountered {enemyDescription}.",
  combat_counter: "{heroName}'s {tagName} proved effective against the {threatName}.",
  combat_struggle: "Without a counter for {threatName}, the party struggled.",
  combat_end: "After a {duration} fight, the enemies were defeated.",
  skill_check_pass: "{heroName} used their {stat} to {action}.",
  skill_check_fail: "{heroName} attempted to {action}, but failed.",
  choice_made: "Faced with {situation}, the party chose to {choice}.",
}

// Discovery templates
const DISCOVERY_TEMPLATES = {
  loot_found: "Among the remains, they found {lootDescription}.",
  loot_chest: "A hidden chest yielded {lootDescription}.",
  subzone_discovered: "{heroName} noticed a path leading to {subzoneName}.",
  rare_drop: "Something glinted in the corner - {itemName}!",
  material_gathered: "The party collected {materials} along the way.",
}

// Return templates (efficiency-based)
const RETURN_TEMPLATES = {
  high: [  // 120%+
    "The expedition was a resounding success.",
    "Spirits were high as the party returned triumphant.",
    "Everything had gone better than expected.",
  ],
  medium: [  // 80-120%
    "Tired but satisfied, the party made their way back.",
    "A solid expedition, all things considered.",
    "The journey back was uneventful.",
  ],
  low: [  // <80%
    "Battered and bruised, the group limped home.",
    "It could have gone better, but they survived.",
    "The retreat was as swift as dignity allowed.",
  ],
}
```

### Log Generator Implementation

```typescript
// app/utils/logGenerator.ts

import type {
  Expedition, Hero, ExpeditionEvent, ExpeditionRewards,
  ExpeditionLog, LogSection, LogEntry, ZoneType
} from '~~/types'
import { getStoryTraitById } from '~/data/storyTraits'
import { getGameplayTraitById } from '~/data/gameplayTraits'
import { getCultureInfo } from '~/data/cultures'

interface LogContext {
  expedition: Expedition
  heroes: Hero[]
  events: ExpeditionEvent[]
  rewards: ExpeditionRewards
  zoneType: ZoneType
  zoneName: string
  subzoneName: string
  efficiency: number
}

export function generateExpeditionLog(ctx: LogContext): ExpeditionLog {
  const sections: LogSection[] = []

  // 1. Departure
  sections.push(generateDepartureSection(ctx))

  // 2. Travel (with trait reactions)
  const travelSection = generateTravelSection(ctx)
  if (travelSection.entries.length > 0) {
    sections.push(travelSection)
  }

  // 3. Encounters (from events)
  for (const event of ctx.events) {
    sections.push(generateEncounterSection(event, ctx))
  }

  // 4. Discovery (loot)
  sections.push(generateDiscoverySection(ctx))

  // 5. Return
  sections.push(generateReturnSection(ctx))

  return {
    summary: generateSummary(ctx),
    sections,
  }
}

function generateSummary(ctx: LogContext): ExpeditionLog['summary'] {
  const duration = ctx.expedition.durationMinutes
  const hours = Math.floor(duration / 60)
  const mins = duration % 60
  const durationStr = hours > 0
    ? `${hours}h ${mins}m`
    : `${mins} minutes`

  return {
    duration: durationStr,
    efficiency: `${Math.round(ctx.efficiency * 100)}% efficiency`,
    rewards: {
      gold: ctx.rewards.gold,
      xp: ctx.rewards.xp,
      itemCount: ctx.rewards.equipment.length,
      rareItems: [], // Filter rare+ from equipment
      familiarityGain: ctx.rewards.familiarityGain,
      masteryGain: ctx.rewards.masteryGain,
    },
  }
}

function generateDepartureSection(ctx: LogContext): LogSection {
  const templates = DEPARTURE_TEMPLATES[ctx.zoneType]
  const template = randomElement(templates)
  const leader = ctx.heroes[0]

  const text = template
    .replace('{zoneName}', ctx.subzoneName)
    .replace('{leaderName}', leader.name)

  return {
    type: 'departure',
    title: 'Setting Out',
    entries: [{ text, type: 'narrative' }],
  }
}

function generateTravelSection(ctx: LogContext): LogSection {
  const entries: LogEntry[] = []
  const usedHeroes = new Set<string>()

  for (const hero of ctx.heroes) {
    // Max 2-3 reactions total in travel
    if (entries.length >= 3) break

    // 30% chance per hero
    if (Math.random() > 0.3) continue
    if (usedHeroes.has(hero.id)) continue

    const reaction = getTravelReaction(hero, ctx.zoneType)
    if (reaction) {
      entries.push({
        text: reaction.text,
        heroId: hero.id,
        traitId: reaction.traitId,
        type: 'reaction',
      })
      usedHeroes.add(hero.id)
    }
  }

  return {
    type: 'travel',
    title: 'The Journey',
    entries,
  }
}

function getTravelReaction(
  hero: Hero,
  zoneType: ZoneType
): { text: string, traitId?: string } | null {
  // Check culture match
  const culture = getCultureInfo(hero.culture)
  // ... check if zone matches culture preferences

  // Check story traits for zone reactions
  for (const traitId of hero.storyTraitIds) {
    const trait = getStoryTraitById(traitId)
    if (trait?.reactions.onZoneType?.[zoneType]) {
      const reactions = trait.reactions.onZoneType[zoneType]
      const text = randomElement(reactions).replace('{hero}', hero.name)
      return { text, traitId }
    }
  }

  return null
}

// ... additional section generators

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
```

---

## 2. Timer Logic

### Architecture

**Server truth + client display:**
- Server stores `startedAt` and `completesAt` timestamps
- Client calculates countdown from server timestamps
- On completion, client calls server to resolve
- Server validates time actually passed

### Data Model

```typescript
// Database / API response
interface ExpeditionTimer {
  expeditionId: string
  startedAt: string      // ISO timestamp
  completesAt: string    // ISO timestamp
  durationMinutes: number
}

// Client-side computed state
interface TimerDisplay {
  expeditionId: string
  remainingMs: number
  totalMs: number
  percentComplete: number
  isComplete: boolean
  formattedTime: string  // "12:34" or "1:23:45"
}
```

### Client Implementation

**Reactive computation pattern:** Single tick source, multiple reactive consumers.

```typescript
// app/composables/useGameClock.ts
const now = ref(Date.now())
let interval: ReturnType<typeof setInterval> | null = null
let subscribers = 0

function startClock() {
  if (interval) return
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function stopClock() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

export function useGameClock() {
  onMounted(() => {
    subscribers++
    startClock()
  })

  onUnmounted(() => {
    subscribers--
    if (subscribers === 0) {
      stopClock()
    }
  })

  return { now: readonly(now) }
}
```

```typescript
// app/composables/useExpeditionTimer.ts
import type { Expedition } from '~~/types'

export function useExpeditionTimer(expedition: Ref<Expedition | null>) {
  const { now } = useGameClock()

  const completesAt = computed(() => {
    if (!expedition.value) return 0
    return new Date(expedition.value.completesAt).getTime()
  })

  const startedAt = computed(() => {
    if (!expedition.value) return 0
    return new Date(expedition.value.startedAt).getTime()
  })

  const totalMs = computed(() => {
    if (!expedition.value) return 0
    return expedition.value.durationMinutes * 60 * 1000
  })

  const remainingMs = computed(() => {
    return Math.max(0, completesAt.value - now.value)
  })

  const elapsedMs = computed(() => {
    return Math.min(totalMs.value, now.value - startedAt.value)
  })

  const percentComplete = computed(() => {
    if (totalMs.value === 0) return 0
    return Math.min(100, (elapsedMs.value / totalMs.value) * 100)
  })

  const isComplete = computed(() => remainingMs.value === 0)

  const formattedTime = computed(() => {
    const ms = remainingMs.value
    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / 60000) % 60
    const hours = Math.floor(ms / 3600000)

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`
    }
    return `${minutes}:${pad(seconds)}`
  })

  return {
    remainingMs,
    elapsedMs,
    totalMs,
    percentComplete,
    isComplete,
    formattedTime,
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}
```

### Completion Flow

**Watcher with throttle:** Watch `isComplete`, throttled API call, chain auto-repeat.

```typescript
// In expedition component or store
import { watchThrottled } from '@vueuse/core'

const expeditionStore = useExpeditionStore()
const { isComplete } = useExpeditionTimer(currentExpedition)

watchThrottled(
  isComplete,
  async (complete) => {
    if (complete && currentExpedition.value) {
      await expeditionStore.completeExpedition(currentExpedition.value.id)

      // Handle auto-repeat
      if (currentExpedition.value.autoRepeat) {
        await expeditionStore.startExpedition({
          zoneId: currentExpedition.value.zoneId,
          subzoneId: currentExpedition.value.subzoneId,
          heroIds: currentExpedition.value.heroIds,
          autoRepeat: true,
        })
      }
    }
  },
  { throttle: 1000 }
)
```

### Offline Handling

**Sync endpoint on app load:** Single call resolves all completed expeditions.

```typescript
// app/plugins/sync.client.ts
export default defineNuxtPlugin(async () => {
  const { data } = await useFetch('/api/sync', { method: 'POST' })

  if (data.value) {
    const expeditionStore = useExpeditionStore()
    const heroStore = useHeroStore()

    // Update stores with resolved expeditions
    for (const result of data.value.completedExpeditions) {
      expeditionStore.addCompletedExpedition(result)
    }

    // Show notification if pending choices
    if (data.value.pendingChoices.length > 0) {
      // Trigger notification
    }
  }
})
```

### Server Validation

```typescript
// server/api/expeditions/[id]/complete.post.ts
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const expeditionId = getRouterParam(event, 'id')

  // Fetch expedition
  const expedition = await getExpedition(expeditionId)

  // Validate ownership
  if (expedition.playerId !== user.id) {
    throw createError({ statusCode: 403, message: 'Not your expedition' })
  }

  // Validate time has passed
  const completesAt = new Date(expedition.completesAt)
  const now = new Date()

  if (now < completesAt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'EXPEDITION_NOT_READY',
      message: 'Expedition not yet complete'
    })
  }

  // Process completion...
})
```

---

## 3. API Routes Specification

### Conventions

**Route Pattern:**
```
server/api/{resource}/[action].{method}.ts
```

**Authentication:** Supabase built-in via `@nuxtjs/supabase` module.
- Use `serverSupabaseUser(event)` in all protected routes
- Returns user or throws 401

**Validation:** H3 built-in with Zod schemas.

```typescript
import { z } from 'zod'

const schema = z.object({
  heroIds: z.array(z.string().uuid()).min(1).max(4),
  zoneId: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  // body is fully typed
})
```

**Response Envelope:**

```typescript
// Success responses return data directly
// Error responses use createError()

// Standard error codes
type ErrorCode =
  | 'UNAUTHORIZED'          // 401 - Not logged in
  | 'FORBIDDEN'             // 403 - Can't access resource
  | 'NOT_FOUND'             // 404 - Resource doesn't exist
  | 'INVALID_INPUT'         // 400 - Bad request body
  | 'INSUFFICIENT_GOLD'     // 400 - Can't afford action
  | 'HERO_BUSY'             // 400 - Hero on expedition/stationed
  | 'HERO_EXHAUSTED'        // 400 - Hero morale too low
  | 'SLOT_LOCKED'           // 400 - Tavern slot is locked
  | 'EXPEDITION_NOT_READY'  // 400 - Timer not complete
  | 'INVENTORY_FULL'        // 400 - No space for items
```

---

### Auth & Sync

#### POST /api/sync
Called on app load to resolve offline progress.

**Request:** `{}`

**Response:**
```typescript
{
  completedExpeditions: {
    expedition: Expedition
    log: ExpeditionLog
    rewards: ExpeditionRewards
    heroesUpdated: Hero[]
    equipmentDropped: Equipment[]
  }[]
  pendingChoices: {
    expeditionId: string
    events: ExpeditionEvent[]
  }[]
  notifications: {
    type: string
    message: string
    data?: unknown
  }[]
  serverTime: string  // ISO timestamp for clock sync
}
```

---

### Heroes

#### GET /api/heroes
List all player's heroes.

**Response:**
```typescript
{ heroes: Hero[] }
```

#### GET /api/heroes/[id]
Get single hero with equipment.

**Response:**
```typescript
{
  hero: Hero
  equipment: Equipment[]  // Currently equipped
}
```

#### PATCH /api/heroes/[id]
Update hero properties.

**Request:**
```typescript
{
  isFavorite?: boolean
  displayTitle?: string | null
}
```

**Response:**
```typescript
{ hero: Hero }
```

#### POST /api/heroes/[id]/equip
Equip item to hero.

**Request:**
```typescript
{
  equipmentId: string
  slot: EquipmentSlot
}
```

**Response:**
```typescript
{
  hero: Hero
  equipment: Equipment      // The equipped item
  unequipped?: Equipment    // If slot was occupied
}
```

#### POST /api/heroes/[id]/retire
Retire hero, optionally transfer a story trait.

**Request:**
```typescript
{
  transferTraitId?: string      // Story trait to transfer
  transferToHeroId?: string     // Recipient hero
}
```

**Response:**
```typescript
{
  goldReceived: number
  traitTransferred: boolean
}
```

**Errors:**
- `NOT_FOUND` - Hero doesn't exist
- `HERO_BUSY` - Hero is on expedition or stationed

#### POST /api/heroes/[id]/prestige
Prestige a max-level hero.

**Request:** `{}`

**Response:**
```typescript
{
  hero: Hero                // Reset to level 1
  bonusesGained: Stats      // Permanent stat bonuses
  traitUpgraded?: {         // If trait quality improved
    traitId: string
    oldQuality: TraitQuality
    newQuality: TraitQuality
  }
}
```

**Errors:**
- `INVALID_INPUT` - Hero not at max level
- `HERO_BUSY` - Hero is on expedition

---

### Tavern

#### GET /api/tavern
Get current tavern state.

**Response:**
```typescript
{
  slots: TavernHero[]
  lockSlots: number           // Total lock slots available
  usedLockSlots: number       // Currently used
  nextFreeRefresh: string     // ISO timestamp
  refreshCost: number         // Gold cost for manual refresh
}
```

#### POST /api/tavern/refresh
Refresh tavern heroes (free if timer ready, or pay gold).

**Request:**
```typescript
{ useGold?: boolean }  // Force gold refresh even if free available
```

**Response:**
```typescript
{
  slots: TavernHero[]
  goldSpent: number
  nextFreeRefresh: string
}
```

**Errors:**
- `INSUFFICIENT_GOLD` - Can't afford refresh

#### POST /api/tavern/recruit
Recruit hero from tavern slot.

**Request:**
```typescript
{ slotIndex: number }
```

**Response:**
```typescript
{
  hero: Hero          // The recruited hero (now in roster)
  goldSpent: number
}
```

**Errors:**
- `INVALID_INPUT` - Invalid slot index
- `INSUFFICIENT_GOLD` - Can't afford recruitment
- `NOT_FOUND` - Slot is empty

#### POST /api/tavern/lock/[index]
Lock a tavern slot to preserve hero across refreshes.

**Response:**
```typescript
{ success: boolean }
```

**Errors:**
- `INVALID_INPUT` - No lock slots available

#### POST /api/tavern/unlock/[index]
Unlock a tavern slot.

**Response:**
```typescript
{ success: boolean }
```

---

### Expeditions

#### GET /api/expeditions
List expeditions.

**Query Params:**
```typescript
{
  status?: 'active' | 'completed' | 'all'
  limit?: number  // For completed, default 10
}
```

**Response:**
```typescript
{
  active: Expedition[]
  completed: Expedition[]
}
```

#### GET /api/expeditions/[id]
Get single expedition with full details.

**Response:**
```typescript
{
  expedition: Expedition
  log: ExpeditionLog
  heroes: Hero[]
}
```

#### POST /api/expeditions/start
Start a new expedition.

**Request:**
```typescript
{
  zoneId: string
  subzoneId: string
  heroIds: string[]       // 1-4 heroes
  autoRepeat?: boolean
}
```

**Response:**
```typescript
{
  expedition: Expedition
  heroesUpdated: Hero[]   // Now marked as busy
}
```

**Errors:**
- `HERO_BUSY` - One or more heroes unavailable
- `HERO_EXHAUSTED` - Hero morale too low
- `NOT_FOUND` - Zone/subzone not found or not unlocked

#### POST /api/expeditions/[id]/complete
Resolve a completed expedition.

**Request:** `{}`

**Response:**
```typescript
{
  expedition: Expedition      // With results filled
  log: ExpeditionLog
  rewards: ExpeditionRewards
  heroesUpdated: Hero[]       // XP, morale changes
  equipmentDropped: Equipment[]
  zoneProgress: {
    familiarity: number
    mastery: number
  }
  pendingChoices?: ExpeditionEvent[]  // If choices need resolution
}
```

**Errors:**
- `EXPEDITION_NOT_READY` - Timer not complete
- `NOT_FOUND` - Expedition doesn't exist

#### POST /api/expeditions/[id]/choice
Resolve a pending choice event.

**Request:**
```typescript
{
  eventId: string
  choiceId: string
}
```

**Response:**
```typescript
{
  event: ExpeditionEvent    // With outcome filled
  additionalRewards?: Partial<ExpeditionRewards>
  injury?: InjuryResult
}
```

#### POST /api/expeditions/[id]/cancel
Cancel an in-progress expedition.

**Request:** `{}`

**Response:**
```typescript
{
  heroesFreed: Hero[]
  penaltyApplied: string    // Description of penalty
}
```

#### GET /api/expeditions/preview
Preview expedition before starting.

**Query Params:**
```typescript
{
  zoneId: string
  subzoneId: string
  heroIds: string  // Comma-separated
}
```

**Response:**
```typescript
{
  estimatedEfficiency: number
  threats: Threat[]
  counters: {
    threatId: string
    heroId: string
    tagId: string
  }[]
  uncounteredThreats: string[]
  estimatedRewards: {
    gold: { min: number, max: number }
    xp: { min: number, max: number }
  }
  duration: number  // minutes
}
```

---

### Equipment

#### GET /api/equipment
List player's equipment.

**Query Params:**
```typescript
{
  equipped?: boolean          // Filter by equipped status
  slot?: EquipmentSlot        // Filter by slot
  minRarity?: EquipmentRarity
}
```

**Response:**
```typescript
{ equipment: Equipment[] }
```

#### GET /api/equipment/[id]
Get single equipment with set info.

**Response:**
```typescript
{
  equipment: Equipment
  setInfo?: {
    set: EquipmentSet
    ownedPieces: number
    activeBonuses: SetBonus[]
  }
}
```

#### POST /api/equipment/[id]/equip
Equip to a hero.

**Request:**
```typescript
{ heroId: string }
```

**Response:**
```typescript
{
  equipment: Equipment
  hero: Hero
  unequipped?: Equipment
}
```

**Errors:**
- `HERO_BUSY` - Hero on expedition

#### POST /api/equipment/[id]/unequip
Remove from hero.

**Request:** `{}`

**Response:**
```typescript
{
  equipment: Equipment
  hero: Hero
}
```

#### POST /api/equipment/[id]/upgrade
Upgrade trait quality.

**Request:** `{}`

**Response:**
```typescript
{
  equipment: Equipment
  goldSpent: number
  materialsSpent: Record<string, number>
  upgraded: boolean  // False if already perfect
}
```

**Errors:**
- `INSUFFICIENT_GOLD`
- `INVALID_INPUT` - No traits to upgrade

#### POST /api/equipment/[id]/reroll
Reroll a specific trait.

**Request:**
```typescript
{ traitIndex: number }
```

**Response:**
```typescript
{
  equipment: Equipment
  goldSpent: number
  oldTrait: EquipmentTrait
  newTrait: EquipmentTrait
}
```

#### DELETE /api/equipment/[id]
Salvage equipment for materials.

**Response:**
```typescript
{
  materialsGained: Record<string, number>
  goldGained: number
}
```

---

### Zones

#### GET /api/zones
List all zones with unlock status.

**Response:**
```typescript
{
  zones: Zone[]
  playerPower: number  // For unlock requirement display
}
```

#### GET /api/zones/[id]
Get zone with subzones and stationed heroes.

**Response:**
```typescript
{
  zone: Zone
  subzones: Subzone[]
  stationedHeroes: Hero[]
}
```

#### POST /api/zones/[id]/station
Station a hero for passive income.

**Request:**
```typescript
{ heroId: string }
```

**Response:**
```typescript
{
  hero: Hero
  zone: Zone
  stationingLimit: { used: number, max: number }
}
```

**Errors:**
- `HERO_BUSY` - Hero unavailable
- `INVALID_INPUT` - Zone/per-zone limit reached

#### POST /api/zones/[id]/recall
Recall stationed hero.

**Request:**
```typescript
{ heroId: string }
```

**Response:**
```typescript
{
  hero: Hero
  resourcesCollected: Record<string, number>
  familiarityGained: number
}
```

---

### Player

#### GET /api/player
Get player state.

**Response:**
```typescript
{
  gold: number
  premiumCurrency: number
  accountLevel: number
  accountXp: number
  settings: PlayerSettings
  stationingLimits: { global: number, perZone: number }
  presetSlots: number
}
```

#### PATCH /api/player/settings
Update player settings.

**Request:**
```typescript
{ settings: Partial<PlayerSettings> }
```

**Response:**
```typescript
{ settings: PlayerSettings }
```

#### GET /api/player/presets
Get party presets.

**Response:**
```typescript
{ presets: PartyPreset[] }
```

#### POST /api/player/presets
Create party preset.

**Request:**
```typescript
{
  name: string
  heroIds: string[]
}
```

**Response:**
```typescript
{ preset: PartyPreset }
```

**Errors:**
- `INVALID_INPUT` - No preset slots available

#### DELETE /api/player/presets/[id]
Delete a preset.

**Response:**
```typescript
{ success: boolean }
```

---

## Summary

| System | Approach | Key Decision |
|--------|----------|--------------|
| **Log Generation** | Template + event injection | Probability-based trait reactions (30%, cap 2-3/hero) |
| **Timers** | Server truth + client display | Reactive computation with single tick source |
| **Completion** | Watcher with throttle | Auto-chains repeat expeditions |
| **Offline** | Sync endpoint on load | Single POST resolves all completed |
| **Auth** | Supabase built-in | `serverSupabaseUser(event)` |
| **Validation** | H3 + Zod | `readValidatedBody(event, schema.parse)` |

All systems designed for:
- **Idle game patterns** - Works offline, resolves on return
- **Security** - Server validates all state changes
- **Performance** - Single tick source, batched operations
- **Type safety** - Zod schemas, TypeScript throughout
