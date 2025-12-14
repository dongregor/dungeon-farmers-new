# Dungeon Farmers - Phase 1 Implementation Plan

> **For Claude:** Use `superpowers:executing-plans` to implement this plan task-by-task.

**Date:** 2024-12-14
**Goal:** Build MVP core loop - heroes, expeditions, equipment, progression
**Tech Stack:** Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Pinia, Supabase

---

## Implementation Phases

```
Phase 1.0: Foundation (Tasks 1-12)
    ├── Project setup
    ├── TypeScript types
    └── Database schema

Phase 1.1: Hero System (Tasks 13-24)
    ├── Data files (names, traits, cultures)
    ├── Hero generator
    ├── Recruitment/Tavern
    └── Hero UI components

Phase 1.2: Zone & Expedition (Tasks 25-36)
    ├── Zone data
    ├── Expedition engine
    ├── Timer system
    └── Expedition UI

Phase 1.3: Equipment & Loot (Tasks 37-44)
    ├── Equipment data
    ├── Loot tables
    ├── Inventory system
    └── Equipment UI

Phase 1.4: Progression (Tasks 45-52)
    ├── XP & Leveling
    ├── Power calculation
    ├── Efficiency calculation
    └── Prestige system

Phase 1.5: Polish (Tasks 53-60)
    ├── Expedition logs
    ├── Offline progress
    ├── Morale system
    └── Final integration
```

---

## Phase 1.0: Foundation

### Task 1: Project Setup
**Files:** `package.json`, `nuxt.config.ts`, `tsconfig.json`

Already partially done. Verify:
```bash
npm run dev
npm run test:run
```

### Task 2: Install Dependencies
**Files:** `package.json`

```bash
npm install uuid date-fns
npm install -D @types/uuid
```

### Task 3: Create Base Types
**Files:** `types/base.ts`

```typescript
// Rarities
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type EquipmentRarity = Rarity | 'mythic'

// Stats (3-stat system)
export type StatType = 'combat' | 'utility' | 'survival'
export interface Stats {
  combat: number
  utility: number
  survival: number
}

// Archetypes
export type Archetype = 'tank' | 'healer' | 'debuffer' | 'melee_dps' | 'ranged_dps' | 'caster'

// Identity
export type Gender = 'male' | 'female' | 'nonbinary'
export type Culture = 'northfolk' | 'coastborn' | 'woodwalkers' | 'crownlanders'

// Traits
export type TraitQuality = 'normal' | 'magic' | 'perfect'

// Equipment
export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2'

// Zones
export type ZoneType = 'forest' | 'cave' | 'mountain' | 'swamp' | 'desert' | 'ruins'
export type ZoneDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'

// Morale
export type MoraleState = 'excited' | 'content' | 'tired' | 'frustrated' | 'exhausted'

// Constants
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1
}

export const STAT_POINTS_BY_RARITY: Record<Rarity, number> = {
  common: 12, uncommon: 14, rare: 16, epic: 18, legendary: 20
}

export const DIFFICULTY_MULTIPLIERS: Record<ZoneDifficulty, number> = {
  easy: 0.5, medium: 1.0, hard: 1.5, extreme: 2.0
}
```

### Task 4: Create Archetype Types
**Files:** `types/archetypes.ts`

Copy from `phase1-hero-system-update.md` Task 10.

### Task 5: Create Threat Types
**Files:** `types/threats.ts`

Copy from `phase1-hero-system-update.md` Task 11.

### Task 6: Create Trait Types
**Files:** `types/traits.ts`

Copy from `phase1-hero-system-update.md` Task 12.

### Task 7: Create Hero Types
**Files:** `types/hero.ts`

Copy from `phase1-hero-system-update.md` Task 13, but add:

```typescript
// Morale tracking
morale: MoraleState
moraleLastUpdate: string

// Active status
isOnExpedition: boolean
isStationed: boolean
stationedZoneId: string | null
```

### Task 8: Create Recruitment Types
**Files:** `types/recruitment.ts`

Copy from `phase1-hero-system-update.md` Task 14.

### Task 9: Create Zone Types
**Files:** `types/zones.ts`

```typescript
import type { ZoneType, ZoneDifficulty } from './base'

export interface Zone {
  id: string
  name: string
  description: string
  type: ZoneType

  // Unlock
  unlockRequirement: {
    minPower?: number
    previousZoneId?: string
  }

  // Content
  subzones: Subzone[]

  // Progress
  familiarity: number
  isUnlocked: boolean
  isMastered: boolean
}

export interface Subzone {
  id: string
  name: string
  description: string

  // Discovery
  discoveryWeight: number
  requiredZoneFamiliarity: number
  isDiscovered: boolean

  // Content
  difficulty: ZoneDifficulty
  threats: string[]

  // Progress
  mastery: number

  // Rewards
  baseDuration: number // minutes
  baseGold: number
  baseXp: number
}
```

### Task 10: Create Expedition Types
**Files:** `types/expedition.ts`

```typescript
import type { Stats } from './base'

export type ExpeditionStatus = 'preparing' | 'in_progress' | 'completed' | 'waiting_choices'

export interface Expedition {
  id: string
  playerId: string

  // Location
  zoneId: string
  subzoneId: string

  // Team
  heroIds: string[]
  teamPower: number

  // Timing
  status: ExpeditionStatus
  startedAt: string
  completesAt: string
  durationMinutes: number

  // Results (filled on completion)
  efficiency?: number
  rewards?: ExpeditionRewards
  events?: ExpeditionEvent[]
  log?: ExpeditionLog
}

export interface ExpeditionRewards {
  gold: number
  xp: number
  equipment: string[]
  materials: Record<string, number>
  familiarityGain: number
  masteryGain: number
}

export interface ExpeditionEvent {
  id: string
  type: 'flavor' | 'skill_check' | 'choice' | 'rare'
  title: string
  description: string

  // For choices
  choices?: EventChoice[]
  selectedChoice?: string

  // Results
  outcome?: string
  rewards?: Partial<ExpeditionRewards>
  injury?: InjuryResult
}

export interface EventChoice {
  id: string
  text: string
  requiredStat?: keyof Stats
  requiredValue?: number
  outcome: string
}

export interface InjuryResult {
  heroId: string
  severity: 'minor' | 'moderate' | 'severe'
  effect: string
  duration: number // expeditions
}

export interface ExpeditionLog {
  summary: string
  entries: LogEntry[]
}

export interface LogEntry {
  timestamp: string
  text: string
  heroId?: string
  type: 'narrative' | 'combat' | 'loot' | 'event' | 'reaction'
}
```

### Task 11: Create Equipment Types
**Files:** `types/equipment.ts`

```typescript
import type { EquipmentRarity, EquipmentSlot, Stats, TraitQuality } from './base'

export interface Equipment {
  id: string
  playerId: string

  // Identity
  name: string
  slot: EquipmentSlot
  rarity: EquipmentRarity
  itemLevel: number

  // Stats
  stats: Stats
  gearScore: number

  // Traits
  traits: EquipmentTrait[]

  // Set
  setId?: string

  // State
  equippedHeroId: string | null

  // Source
  sourceZoneId?: string
  sourceSubzoneId?: string
}

export interface EquipmentTrait {
  traitId: string
  quality: TraitQuality
  rolledValue: number
}

export interface EquipmentSet {
  id: string
  name: string
  description: string
  pieceIds: string[]

  bonuses: SetBonus[]
}

export interface SetBonus {
  requiredPieces: number
  effects: SetBonusEffect[]
}

export interface SetBonusEffect {
  type: 'stat_bonus' | 'trait_grant'
  stat?: keyof Stats
  value?: number
  traitId?: string
}
```

### Task 12: Create Type Index & Database Schema
**Files:** `types/index.ts`, `supabase/migrations/001_initial_schema.sql`

Index exports all types. Schema from `phase1-hero-system-update.md` Task 16, extended for zones/equipment.

---

## Phase 1.1: Hero System

### Task 13: Create Name Data
**Files:** `data/names.ts`

Copy from `phase1-hero-system-update.md` Task 17.

### Task 14: Create Gameplay Trait Data
**Files:** `data/gameplayTraits.ts`

Copy from `phase1-hero-system-update.md` Task 18.

### Task 15: Create Story Trait Data
**Files:** `data/storyTraits.ts`

Copy from `phase1-hero-system-update.md` Task 19.

### Task 16: Create Culture Data
**Files:** `data/cultures.ts`

Copy from `phase1-hero-system-update.md` Task 20.

### Task 17: Create Hero Generator
**Files:** `utils/heroGenerator.ts`, `tests/utils/heroGenerator.test.ts`

Copy from `phase1-hero-system-update.md` Task 21.

### Task 18: Create Power Calculator
**Files:** `utils/powerCalculator.ts`, `tests/utils/powerCalculator.test.ts`

```typescript
import type { Hero, Equipment, Stats } from '~/types'
import { getGameplayTraitById } from '~/data/gameplayTraits'

export interface PowerBreakdown {
  statPower: number
  levelPower: number
  prestigePower: number
  gearPower: number
  traitPower: number
  total: number
}

export function calculateHeroPower(
  hero: Hero,
  equipment: Equipment[] = []
): PowerBreakdown {
  // Base stats
  const statPower = hero.baseStats.combat + hero.baseStats.utility + hero.baseStats.survival

  // Level scaling
  const levelPower = hero.level * 2

  // Prestige bonuses
  const prestigePower = hero.prestigeBonuses.combat +
                        hero.prestigeBonuses.utility +
                        hero.prestigeBonuses.survival

  // Gear score
  const gearPower = equipment.reduce((sum, eq) => sum + eq.gearScore, 0)

  // Trait power (positive - negative)
  const traitPower = hero.gameplayTraits.reduce((sum, trait) => {
    const def = getGameplayTraitById(trait.traitId)
    if (!def) return sum
    return sum + (def.isNegative ? -trait.rolledValue : trait.rolledValue)
  }, 0)

  return {
    statPower,
    levelPower,
    prestigePower,
    gearPower,
    traitPower,
    total: statPower + levelPower + prestigePower + gearPower + traitPower
  }
}
```

### Task 19: Create Hero Store (Pinia)
**Files:** `stores/heroes.ts`

```typescript
import { defineStore } from 'pinia'
import type { Hero } from '~/types'

export const useHeroStore = defineStore('heroes', {
  state: () => ({
    heroes: [] as Hero[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getHeroById: (state) => (id: string) =>
      state.heroes.find(h => h.id === id),

    availableHeroes: (state) =>
      state.heroes.filter(h => !h.isOnExpedition && !h.isStationed),

    favoriteHeroes: (state) =>
      state.heroes.filter(h => h.isFavorite),
  },

  actions: {
    async fetchHeroes() {
      this.loading = true
      try {
        const { data } = await useFetch('/api/heroes')
        this.heroes = data.value || []
      } finally {
        this.loading = false
      }
    },

    async recruitHero(tavernHeroId: string) {
      const { data } = await useFetch('/api/heroes/recruit', {
        method: 'POST',
        body: { tavernHeroId }
      })
      if (data.value) {
        this.heroes.push(data.value)
      }
      return data.value
    },

    async updateHero(hero: Partial<Hero> & { id: string }) {
      const { data } = await useFetch(`/api/heroes/${hero.id}`, {
        method: 'PATCH',
        body: hero
      })
      const index = this.heroes.findIndex(h => h.id === hero.id)
      if (index !== -1 && data.value) {
        this.heroes[index] = data.value
      }
    },

    async retireHero(heroId: string, transferTraitTo?: string) {
      await useFetch(`/api/heroes/${heroId}/retire`, {
        method: 'POST',
        body: { transferTraitTo }
      })
      this.heroes = this.heroes.filter(h => h.id !== heroId)
    }
  }
})
```

### Task 20: Create Tavern Store
**Files:** `stores/tavern.ts`

```typescript
import { defineStore } from 'pinia'
import type { TavernHero, TavernState } from '~/types'

export const useTavernStore = defineStore('tavern', {
  state: () => ({
    slots: [] as TavernHero[],
    lockSlots: 1,
    usedLockSlots: 0,
    lastRefresh: '',
    nextRefresh: '',
    loading: false,
  }),

  getters: {
    canLockMore: (state) => state.usedLockSlots < state.lockSlots,
    timeUntilRefresh: (state) => {
      const next = new Date(state.nextRefresh)
      return Math.max(0, next.getTime() - Date.now())
    }
  },

  actions: {
    async fetchTavern() {
      this.loading = true
      try {
        const { data } = await useFetch('/api/tavern')
        if (data.value) {
          this.slots = data.value.slots
          this.lockSlots = data.value.lockSlots
          this.usedLockSlots = data.value.usedLockSlots
          this.lastRefresh = data.value.lastRefresh
          this.nextRefresh = data.value.nextRefresh
        }
      } finally {
        this.loading = false
      }
    },

    async refreshTavern() {
      const { data } = await useFetch('/api/tavern/refresh', { method: 'POST' })
      if (data.value) {
        this.slots = data.value.slots
        this.lastRefresh = data.value.lastRefresh
        this.nextRefresh = data.value.nextRefresh
      }
    },

    async lockHero(slotIndex: number) {
      await useFetch(`/api/tavern/lock/${slotIndex}`, { method: 'POST' })
      this.slots[slotIndex].isLocked = true
      this.usedLockSlots++
    },

    async unlockHero(slotIndex: number) {
      await useFetch(`/api/tavern/unlock/${slotIndex}`, { method: 'POST' })
      this.slots[slotIndex].isLocked = false
      this.usedLockSlots--
    }
  }
})
```

### Task 21: Create Hero API Routes
**Files:** `server/api/heroes/index.get.ts`, `server/api/heroes/recruit.post.ts`, etc.

Implement CRUD operations using Supabase client.

### Task 22: Create HeroCard Component
**Files:** `components/hero/HeroCard.vue`

Display hero with name, rarity border, archetype icon, stats, tags, traits summary.

### Task 23: Create HeroDetail Component
**Files:** `components/hero/HeroDetail.vue`

Full hero profile: all stats, traits with descriptions, equipment slots, prestige info.

### Task 24: Create TavernSlot Component
**Files:** `components/tavern/TavernSlot.vue`

Show tavern hero with recruit button, lock button, cost.

---

## Phase 1.2: Zone & Expedition

### Task 25: Create Zone Data
**Files:** `data/zones.ts`

```typescript
import type { Zone, Subzone } from '~/types'

export const ZONES: Zone[] = [
  {
    id: 'verdant_woods',
    name: 'Verdant Woods',
    description: 'A lush forest teeming with wildlife and wandering creatures.',
    type: 'forest',
    unlockRequirement: {},
    subzones: [
      {
        id: 'forest_edge',
        name: 'Forest Edge',
        description: 'The outskirts where travelers first enter.',
        discoveryWeight: 100,
        requiredZoneFamiliarity: 0,
        isDiscovered: true,
        difficulty: 'easy',
        threats: ['swarms', 'ambush'],
        mastery: 0,
        baseDuration: 15,
        baseGold: 40,
        baseXp: 30,
      },
      {
        id: 'mushroom_grove',
        name: 'Mushroom Grove',
        description: 'A damp area covered in giant fungi.',
        discoveryWeight: 60,
        requiredZoneFamiliarity: 25,
        isDiscovered: false,
        difficulty: 'easy',
        threats: ['poison', 'evasive'],
        mastery: 0,
        baseDuration: 20,
        baseGold: 55,
        baseXp: 40,
      },
      {
        id: 'ancient_oak',
        name: 'Ancient Oak',
        description: 'A massive tree hollow home to something powerful.',
        discoveryWeight: 30,
        requiredZoneFamiliarity: 50,
        isDiscovered: false,
        difficulty: 'medium',
        threats: ['bosses', 'spell_barrages'],
        mastery: 0,
        baseDuration: 30,
        baseGold: 100,
        baseXp: 75,
      },
    ],
    familiarity: 0,
    isUnlocked: true,
    isMastered: false,
  },
  // Add 2-3 more starter zones...
]

export function getZoneById(id: string): Zone | undefined {
  return ZONES.find(z => z.id === id)
}

export function getUnlockedZones(): Zone[] {
  return ZONES.filter(z => z.isUnlocked)
}
```

### Task 26: Create Expedition Engine
**Files:** `utils/expeditionEngine.ts`

```typescript
import type { Hero, Zone, Subzone, Expedition, ExpeditionRewards } from '~/types'
import { calculateHeroPower } from './powerCalculator'
import { calculateEfficiency } from './efficiencyCalculator'
import { generateExpeditionEvents } from './eventGenerator'
import { generateExpeditionLog } from './logGenerator'

export function createExpedition(
  playerId: string,
  heroes: Hero[],
  zone: Zone,
  subzone: Subzone
): Expedition {
  const teamPower = heroes.reduce((sum, h) => sum + calculateHeroPower(h).total, 0)
  const now = new Date()
  const completesAt = new Date(now.getTime() + subzone.baseDuration * 60 * 1000)

  return {
    id: crypto.randomUUID(),
    playerId,
    zoneId: zone.id,
    subzoneId: subzone.id,
    heroIds: heroes.map(h => h.id),
    teamPower,
    status: 'in_progress',
    startedAt: now.toISOString(),
    completesAt: completesAt.toISOString(),
    durationMinutes: subzone.baseDuration,
  }
}

export function completeExpedition(
  expedition: Expedition,
  heroes: Hero[],
  zone: Zone,
  subzone: Subzone
): Expedition {
  const efficiency = calculateEfficiency(heroes, zone, subzone)
  const events = generateExpeditionEvents(subzone, heroes, efficiency)
  const rewards = calculateRewards(subzone, efficiency, events)
  const log = generateExpeditionLog(expedition, heroes, events, rewards)

  return {
    ...expedition,
    status: events.some(e => e.type === 'choice' && !e.selectedChoice)
      ? 'waiting_choices'
      : 'completed',
    efficiency,
    rewards,
    events,
    log,
  }
}

function calculateRewards(
  subzone: Subzone,
  efficiency: number,
  events: ExpeditionEvent[]
): ExpeditionRewards {
  const eventBonuses = events.reduce((acc, e) => ({
    gold: acc.gold + (e.rewards?.gold || 0),
    xp: acc.xp + (e.rewards?.xp || 0),
  }), { gold: 0, xp: 0 })

  return {
    gold: Math.round(subzone.baseGold * efficiency + eventBonuses.gold),
    xp: Math.round(subzone.baseXp * efficiency + eventBonuses.xp),
    equipment: [], // Rolled separately
    materials: {},
    familiarityGain: Math.round(5 * efficiency),
    masteryGain: Math.round(3 * efficiency),
  }
}
```

### Task 27: Create Efficiency Calculator
**Files:** `utils/efficiencyCalculator.ts`

```typescript
import type { Hero, Zone, Subzone } from '~/types'
import { THREATS, SEVERITY_BASE_PENALTY } from '~/types/threats'
import { DIFFICULTY_MULTIPLIERS } from '~/types/base'

export function calculateEfficiency(
  heroes: Hero[],
  zone: Zone,
  subzone: Subzone
): number {
  // Base efficiency from power vs requirement
  const teamPower = heroes.reduce((sum, h) => sum + h.power, 0)
  const requiredPower = getRequiredPower(subzone)
  let efficiency = teamPower / requiredPower

  // Apply threat penalties/bonuses
  for (const threatId of subzone.threats) {
    const threat = THREATS[threatId]
    if (!threat) continue

    const hasCounter = heroes.some(hero =>
      hero.archetypeTags.some(tag => threat.counteredBy.includes(tag))
    )

    if (hasCounter) {
      efficiency += 0.05 // +5% bonus for countering
    } else {
      const basePenalty = SEVERITY_BASE_PENALTY[threat.severity]
      const multiplier = DIFFICULTY_MULTIPLIERS[subzone.difficulty]
      efficiency -= (basePenalty * multiplier) / 100
    }
  }

  // Clamp to 60-150%
  return Math.max(0.6, Math.min(1.5, efficiency))
}

function getRequiredPower(subzone: Subzone): number {
  const difficultyPower = {
    easy: 20,
    medium: 50,
    hard: 100,
    extreme: 200,
  }
  return difficultyPower[subzone.difficulty]
}
```

### Task 28: Create Event Generator
**Files:** `utils/eventGenerator.ts`

Generate flavor (50%), skill checks (25%), choices (20%), rare (5%) events.

### Task 29: Create Log Generator
**Files:** `utils/logGenerator.ts`

Compose expedition narrative from events, trait reactions, combat results.

### Task 30: Create Expedition Store
**Files:** `stores/expeditions.ts`

### Task 31: Create Zone Store
**Files:** `stores/zones.ts`

### Task 32: Create Expedition API Routes
**Files:** `server/api/expeditions/*`

### Task 33: Create Timer Service
**Files:** `utils/timerService.ts`, `composables/useExpeditionTimer.ts`

Client-side countdown + server validation.

### Task 34: Create ZoneCard Component
**Files:** `components/zone/ZoneCard.vue`

### Task 35: Create ExpeditionSetup Component
**Files:** `components/expedition/ExpeditionSetup.vue`

Hero selection, threat preview, estimated rewards.

### Task 36: Create ExpeditionActive Component
**Files:** `components/expedition/ExpeditionActive.vue`

Timer, progress bar, team display.

---

## Phase 1.3: Equipment & Loot

### Task 37: Create Equipment Data
**Files:** `data/equipment.ts`

Equipment templates for each slot and rarity.

### Task 38: Create Equipment Trait Data
**Files:** `data/equipmentTraits.ts`

Traits that can roll on equipment.

### Task 39: Create Set Data
**Files:** `data/sets.ts`

Equipment sets with 2/4/6 piece bonuses.

### Task 40: Create Loot Table Data
**Files:** `data/lootTables.ts`

Loot tables per zone/subzone.

### Task 41: Create Equipment Generator
**Files:** `utils/equipmentGenerator.ts`

### Task 42: Create Inventory Store
**Files:** `stores/inventory.ts`

### Task 43: Create Equipment API Routes
**Files:** `server/api/equipment/*`

### Task 44: Create Equipment UI
**Files:** `components/equipment/*.vue`

EquipmentCard, EquipmentSlot, InventoryGrid.

---

## Phase 1.4: Progression

### Task 45: Create XP Service
**Files:** `utils/xpService.ts`

Tiered linear XP curve from comprehensive plan.

### Task 46: Create Level Up Handler
**Files:** `utils/levelUpHandler.ts`

Apply level-ups, check for prestige availability.

### Task 47: Create Prestige Service
**Files:** `utils/prestigeService.ts`

Handle prestige: reset level, apply bonuses, trait upgrade chance.

### Task 48: Create Morale Service
**Files:** `utils/moraleService.ts`

Track morale changes, recovery over time.

### Task 49: Update Hero API for Progression
**Files:** `server/api/heroes/*`

### Task 50: Create ProgressBar Component
**Files:** `components/ui/ProgressBar.vue`

### Task 51: Create LevelUpModal Component
**Files:** `components/hero/LevelUpModal.vue`

### Task 52: Create PrestigeModal Component
**Files:** `components/hero/PrestigeModal.vue`

---

## Phase 1.5: Polish

### Task 53: Create Expedition Log Display
**Files:** `components/expedition/ExpeditionLog.vue`

Render narrative log with trait reactions.

### Task 54: Create Event Choice UI
**Files:** `components/expedition/EventChoice.vue`

### Task 55: Implement Offline Progress
**Files:** `utils/offlineProgress.ts`, `server/api/sync.post.ts`

Process completed expeditions on reconnect.

### Task 56: Create Auto-Repeat Logic
**Files:** `utils/autoRepeat.ts`

Per-expedition repeat settings.

### Task 57: Create Notification Service
**Files:** `utils/notificationService.ts`

In-app notifications for expedition complete, level up, etc.

### Task 58: Create Dashboard Page
**Files:** `pages/index.vue`

Main hub: active expeditions, hero summary, quick actions.

### Task 59: Create Full Page Routes
**Files:** `pages/heroes.vue`, `pages/expeditions.vue`, `pages/tavern.vue`, `pages/inventory.vue`

### Task 60: Integration Testing
**Files:** `tests/integration/*.test.ts`

Full flow tests: recruit → expedition → loot → level up.

---

## Summary

**Total Tasks:** 60
**Critical Path:** Tasks 1-12 → 13-24 → 25-36 → 37-44 → 45-52 → 53-60

**Key Milestones:**
- After Task 12: Types and DB ready
- After Task 24: Hero system complete
- After Task 36: Expeditions working
- After Task 44: Full loot loop
- After Task 52: Progression working
- After Task 60: MVP complete

---

## Files Summary

### Types (12 files)
```
types/
├── base.ts
├── archetypes.ts
├── threats.ts
├── traits.ts
├── hero.ts
├── recruitment.ts
├── zones.ts
├── expedition.ts
├── equipment.ts
├── index.ts
```

### Data (10 files)
```
data/
├── names.ts
├── gameplayTraits.ts
├── storyTraits.ts
├── cultures.ts
├── zones.ts
├── equipment.ts
├── equipmentTraits.ts
├── sets.ts
├── lootTables.ts
```

### Utils (12 files)
```
utils/
├── heroGenerator.ts
├── powerCalculator.ts
├── efficiencyCalculator.ts
├── expeditionEngine.ts
├── eventGenerator.ts
├── logGenerator.ts
├── equipmentGenerator.ts
├── xpService.ts
├── levelUpHandler.ts
├── prestigeService.ts
├── moraleService.ts
├── offlineProgress.ts
```

### Stores (5 files)
```
stores/
├── game.ts
├── heroes.ts
├── tavern.ts
├── expeditions.ts
├── zones.ts
├── inventory.ts
```

### Components (~20 files)
```
components/
├── hero/
│   ├── HeroCard.vue
│   ├── HeroDetail.vue
│   ├── LevelUpModal.vue
│   └── PrestigeModal.vue
├── tavern/
│   └── TavernSlot.vue
├── zone/
│   └── ZoneCard.vue
├── expedition/
│   ├── ExpeditionSetup.vue
│   ├── ExpeditionActive.vue
│   ├── ExpeditionLog.vue
│   └── EventChoice.vue
├── equipment/
│   ├── EquipmentCard.vue
│   ├── EquipmentSlot.vue
│   └── InventoryGrid.vue
├── ui/
│   └── ProgressBar.vue
```

### Pages (5 files)
```
pages/
├── index.vue
├── heroes.vue
├── expeditions.vue
├── tavern.vue
└── inventory.vue
```

### API Routes (~15 files)
```
server/api/
├── heroes/
│   ├── index.get.ts
│   ├── [id].get.ts
│   ├── [id].patch.ts
│   ├── recruit.post.ts
│   └── [id]/retire.post.ts
├── tavern/
│   ├── index.get.ts
│   ├── refresh.post.ts
│   ├── lock/[index].post.ts
│   └── unlock/[index].post.ts
├── expeditions/
│   ├── index.get.ts
│   ├── start.post.ts
│   ├── [id].get.ts
│   └── [id]/complete.post.ts
├── equipment/
│   ├── index.get.ts
│   └── equip.post.ts
└── sync.post.ts
```
