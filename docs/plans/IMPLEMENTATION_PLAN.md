# Dungeon Farmers - Complete Implementation Plan

> **For Claude:** Use `superpowers:executing-plans` to implement this plan task-by-task.
>
> ⚠️ **IMPORTANT:** Read `docs/plans/BEST_PRACTICES_REVIEW.md` before implementing.

**Date:** 2024-12-14  
**Status:** Consolidated from all planning documents  
**Goal:** Build complete MVP core loop with all designed systems  
**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Pinia, Supabase (PostgreSQL + Auth), Vitest, Playwright

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Directory Structure (Nuxt 4)](#directory-structure-nuxt-4)
4. [Implementation Phases](#implementation-phases)
5. [Phase 1.0: Foundation](#phase-10-foundation)
6. [Phase 1.1: Hero System](#phase-11-hero-system)
7. [Phase 1.2: Zone & Expedition System](#phase-12-zone--expedition-system)
8. [Phase 1.3: Equipment & Loot](#phase-13-equipment--loot)
9. [Phase 1.4: Progression Systems](#phase-14-progression-systems)
10. [Phase 1.5: Polish & Quality of Life](#phase-15-polish--quality-of-life)
11. [Phase 1.6: Additional Systems](#phase-16-additional-systems)
12. [API Routes Specification](#api-routes-specification)
13. [Summary & Milestones](#summary--milestones)

---

## Overview

**Dungeon Farmers** is a browser-based idle RPG where players manage a guild of quirky, randomly-generated heroes. Send them on expeditions, capture monsters, and build your own farmable dungeons.

**Phase 1 MVP Core Loop:**
1. Players recruit randomly-generated heroes with traits
2. Send heroes on zone expeditions (timed)
3. Expeditions complete with loot drops, XP, and story logs
4. Heroes level up and equip gear
5. Stronger heroes tackle harder zones
6. Discover subzones, collect items, earn titles

**Key Features:**
- Hero generation with archetypes, tags, gameplay traits, and story traits
- Zone/subzone system with discovery and mastery
- Threat/counter system for strategic team building
- Equipment with traits and set bonuses
- Difficulty tiers for content scaling
- Expedition events (flavor, skill checks, choices, rare occurrences)
- Full offline progress with auto-repeat
- Title system for achievements
- Party presets for quick team selection

---

## Tech Stack & Architecture

### Core Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Nuxt 4 + Vue 3 | Full-stack framework |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State** | Pinia | Client-side state management |
| **Database** | PostgreSQL (via Supabase) | Data persistence |
| **Auth** | Supabase Auth | User authentication |
| **Testing** | Vitest | Unit/integration tests |
| **E2E** | Playwright | End-to-end tests |

### Architecture Principles

1. **Server Truth** - All game state validated on server
2. **Offline First** - Full progress continues offline
3. **Type Safety** - TypeScript + Zod validation throughout
4. **Auto-Imports** - Nuxt 4 auto-imports from configured directories
5. **Best Practices** - Follow patterns in `BEST_PRACTICES_REVIEW.md`

### Recommended Nuxt 4 Modules

Based on project requirements and Nuxt 4 best practices:

#### Core Modules (Required)

| Module | Purpose | Installation |
|--------|---------|--------------|
| **@pinia/nuxt** | State management | `npm install @pinia/nuxt pinia` |
| **@nuxtjs/tailwindcss** | Tailwind CSS integration | `npm install -D @nuxtjs/tailwindcss` |
| **@nuxtjs/supabase** | Supabase client & auth | `npm install -D @nuxtjs/supabase` |

#### Recommended Modules (Highly Useful)

| Module | Purpose | Installation | Use Case |
|--------|---------|--------------|----------|
| **@vueuse/nuxt** | Vue composition utilities | `npm install @vueuse/nuxt @vueuse/core` | Timer composables, reactive utilities |
| **@nuxt/devtools** | Development tools | `npm install -D @nuxt/devtools` | Debugging, performance analysis |
| **@nuxt/test-utils** | Testing utilities | `npm install -D @nuxt/test-utils` | Component testing with Nuxt context |
| **@nuxt/icon** | Icon system | `npm install -D @nuxt/icon` | 200k+ icons from Iconify (UI icons) |

#### Optional Modules (Nice to Have)

| Module | Purpose | Installation | Use Case |
|--------|---------|--------------|----------|
| **@nuxtjs/color-mode** | Dark/light mode | `npm install -D @nuxtjs/color-mode` | Theme switching (future feature) |
| **@nuxt/image** | Image optimization | `npm install -D @nuxt/image` | Hero portraits, equipment images |
| **@nuxt/fonts** | Web font optimization | `npm install -D @nuxt/fonts` | Custom fonts with performance |
| **@nuxt/eslint** | ESLint integration | `npm install -D @nuxt/eslint` | Code quality and consistency |

#### Module Configuration

**`nuxt.config.ts` example:**

```typescript
export default defineNuxtConfig({
  // Core modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxt/test-utils',
    '@nuxt/icon',
    // Optional
    // '@nuxtjs/color-mode',
    // '@nuxt/image',
    // '@nuxt/fonts',
    // '@nuxt/eslint',
  ],

  // Supabase configuration
  supabase: {
    redirect: false, // Handle auth redirects manually
  },

  // Devtools (auto-enabled in dev)
  devtools: {
    enabled: true,
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // CSS
  css: ['~/app/assets/css/main.css'],
})
```

#### Why These Modules?

**@vueuse/nuxt:**
- Provides `watchThrottled` for timer completion watchers
- Reactive utilities like `useInterval`, `useTimeout`
- `useLocalStorage` for client-side persistence
- Essential for expedition timer logic

**@nuxt/devtools:**
- Visual debugging for Pinia stores
- Component inspection
- Performance profiling
- API route testing

**@nuxt/test-utils:**
- Provides `mountSuspended` for testing Nuxt components
- Auto-imports Nuxt composables in tests
- Essential for component testing

**@nuxt/icon:**
- 200k+ icons from Iconify
- Tree-shakeable (only imports used icons)
- Perfect for UI icons (heroes, equipment, zones)

#### Installation Command

```bash
# Core modules
npm install @pinia/nuxt pinia @nuxtjs/tailwindcss @nuxtjs/supabase

# Recommended modules
npm install @vueuse/nuxt @vueuse/core
npm install -D @nuxt/devtools @nuxt/test-utils @nuxt/icon

# Optional modules (install as needed)
npm install -D @nuxtjs/color-mode @nuxt/image @nuxt/fonts @nuxt/eslint
```

---

## Directory Structure (Nuxt 4)

```
app/                    # Client-side (srcDir)
├── components/         # Auto-imported Vue components
│   ├── hero/
│   ├── expedition/
│   ├── equipment/
│   ├── zone/
│   └── ui/
├── composables/        # Auto-imported Vue composables (use*)
│   ├── useHeroes.ts
│   ├── useExpeditionTimer.ts
│   └── useGameClock.ts
├── stores/             # Pinia stores (use*Store)
│   ├── heroes.ts
│   ├── expeditions.ts
│   ├── equipment.ts
│   ├── zones.ts
│   ├── tavern.ts
│   └── game.ts
├── utils/              # Auto-imported utility functions
│   ├── heroGenerator.ts
│   ├── powerCalculator.ts
│   ├── expeditionEngine.ts
│   ├── logGenerator.ts
│   └── efficiencyCalculator.ts
├── data/               # Static game data
│   ├── names.ts
│   ├── gameplayTraits.ts
│   ├── storyTraits.ts
│   ├── cultures.ts
│   ├── zones.ts
│   ├── monsters.ts
│   ├── equipment.ts
│   ├── equipmentTraits.ts
│   ├── sets.ts
│   └── titles.ts
├── pages/              # File-based routing
│   ├── index.vue
│   ├── heroes.vue
│   ├── expeditions.vue
│   ├── tavern.vue
│   └── inventory.vue
├── layouts/            # Page layouts
│   └── default.vue
└── app.vue             # Root component

server/                 # Server-side (at root)
├── api/                # API routes (/api/*)
│   ├── heroes/
│   ├── expeditions/
│   ├── equipment/
│   ├── zones/
│   ├── tavern/
│   └── player/
├── routes/             # Non-API routes
└── utils/              # Server utilities (auto-imported in server/)

types/                  # Shared TypeScript types (at root)
├── base.ts
├── archetypes.ts
├── threats.ts
├── traits.ts
├── hero.ts
├── recruitment.ts
├── zones.ts
├── expedition.ts
├── equipment.ts
├── monsters.ts
├── titles.ts
├── morale.ts
├── presets.ts
└── index.ts

shared/                 # Shared client+server code
├── utils/              # Auto-imported everywhere
└── types/              # Auto-imported everywhere

supabase/
└── migrations/
    └── 001_initial_schema.sql

tests/
├── utils/
├── stores/
└── integration/
```

### Auto-Imports (No `import` needed)

| Directory | What's Auto-Imported |
|-----------|---------------------|
| `app/components/` | Vue components (in templates) |
| `app/composables/` | Composables (`.vue`, `.ts`, `.js`) |
| `app/utils/` | Utility functions (`.vue`, `.ts`, `.js`) |
| `server/utils/` | Server utilities (in `server/` only) |
| `shared/utils/` | Shared utilities (everywhere) |

**Note:** Only top-level files are scanned. Nested files must be re-exported from `index.ts`.

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Composables | `use*` prefix | `useHero.ts` → `useHero()` |
| Stores | `use*Store` | `useHeroStore` in `stores/heroes.ts` |
| Components | PascalCase, path-based | `hero/Card.vue` → `<HeroCard />` |
| Server routes | `[method].ts` suffix | `index.get.ts`, `[id].patch.ts` |

### Key Rules

1. **Pinia Stores:** Use `$fetch` in actions (NOT `useFetch`)
   ```typescript
   const heroes = await $fetch<Hero[]>('/api/heroes')
   ```

2. **Type Imports:** Use `~~/types` for root-level types
   ```typescript
   import type { Hero } from '~~/types'
   ```

3. **Composable Context:** Call Nuxt composables INSIDE functions
   ```typescript
   // ✅ Correct
   export const useMyThing = () => {
     const config = useRuntimeConfig()
   }
   ```

4. **Store Destructuring:** Use `storeToRefs()` for state
   ```typescript
   const store = useHeroStore()
   const { heroes } = storeToRefs(store) // Reactive
   const { fetchHeroes } = store // Actions ok to destructure
   ```

---

## Implementation Phases

```
Phase 1.0: Foundation (Tasks 1-12)
    ├── Project setup
    ├── TypeScript types
    └── Database schema

Phase 1.1: Hero System (Tasks 13-26)
    ├── Data files (names, traits, cultures)
    ├── Hero generator
    ├── Recruitment/Tavern
    └── Hero UI components

Phase 1.2: Zone & Expedition (Tasks 27-42)
    ├── Zone/subzone data
    ├── Expedition engine
    ├── Timer system
    ├── Event system
    └── Expedition UI

Phase 1.3: Equipment & Loot (Tasks 43-52)
    ├── Equipment data
    ├── Equipment traits
    ├── Equipment sets
    ├── Loot tables
    ├── Inventory system
    └── Equipment UI

Phase 1.4: Progression (Tasks 53-62)
    ├── XP & Leveling
    ├── Power calculation
    ├── Efficiency calculation
    ├── Prestige system
    ├── Morale system
    └── Title system

Phase 1.5: Polish (Tasks 63-72)
    ├── Expedition logs
    ├── Offline progress
    ├── Party presets
    ├── Hero retirement
    └── Final integration

Phase 1.6: Additional Systems (Tasks 73-80)
    ├── Tutorial flow
    ├── Economy balance
    ├── Notification system
    └── Achievement system
```

**Total Tasks:** 80 tasks across 7 phases

---

## Phase 1.0: Foundation

### Task 1: Project Setup

**Files:** `package.json`, `nuxt.config.ts`, `tsconfig.json`

**Step 1: Install Core Modules**

```bash
# Core modules (required)
npm install @pinia/nuxt pinia @nuxtjs/tailwindcss @nuxtjs/supabase

# Recommended modules
npm install @vueuse/nuxt @vueuse/core
npm install -D @nuxt/devtools @nuxt/test-utils @nuxt/icon

# Optional modules (install as needed)
npm install -D @nuxtjs/color-mode @nuxt/image @nuxt/fonts @nuxt/eslint
```

**Step 2: Verify Nuxt 4 project**

```bash
npm run dev
npm run test:run
```

**Step 3: Update `nuxt.config.ts`**

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxt/test-utils',
    '@nuxt/icon',
    // Optional: '@nuxtjs/color-mode', '@nuxt/image', '@nuxt/fonts', '@nuxt/eslint'
  ],
  css: ['~/app/assets/css/main.css'],
  typescript: {
    strict: true,
  },
  supabase: {
    redirect: false,
  },
})
```

**Step 4: Commit**

```bash
git add .
git commit -m "chore: setup Nuxt 4 project with recommended modules"
```

---

### Task 2: Install Dependencies

**Files:** `package.json`

```bash
npm install uuid date-fns zod
npm install -D @types/uuid
```

**Commit:** `chore: add utility dependencies`

---

### Task 3: Configure Tailwind CSS

**Files:** `tailwind.config.js`, `app/assets/css/main.css`, `nuxt.config.ts`

**Step 1: Create `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'guild-gold': '#D4AF37',
        'quest-blue': '#4A90D9',
        'loot-purple': '#9B59B6',
        'danger-red': '#E74C3C',
        'success-green': '#27AE60',
        'common': '#9CA3AF',
        'uncommon': '#22C55E',
        'rare': '#3B82F6',
        'epic': '#A855F7',
        'legendary': '#F59E0B',
        'mythic': '#EF4444',
      }
    },
  },
  plugins: [],
}
```

**Step 2: Create `app/assets/css/main.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-900 text-gray-100;
  }
}
```

**Step 3: Verify Tailwind works**

Update `app/app.vue`:
```vue
<template>
  <div class="min-h-screen flex items-center justify-center">
    <h1 class="text-4xl font-bold text-guild-gold">Dungeon Farmers</h1>
  </div>
</template>
```

**Commit:** `chore: configure Tailwind CSS with game theme colors`

---

### Task 4: Configure Vitest

**Files:** `vitest.config.ts`, `package.json`

**Step 1: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, './'),
    },
  },
})
```

**Step 2: Add test scripts to `package.json`**

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

**Commit:** `chore: configure Vitest testing framework`

---

### Task 5: Create Base Layout

**Files:** `app/layouts/default.vue`, `app/components/AppHeader.vue`, `app/components/AppNav.vue`

**Step 1: Create `app/layouts/default.vue`**

```vue
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <AppHeader />
    <main class="container mx-auto px-4 py-6 pb-20">
      <slot />
    </main>
    <AppNav />
  </div>
</template>
```

**Step 2: Create `app/components/AppHeader.vue`**

```vue
<script setup lang="ts">
const gameStore = useGameStore()
</script>

<template>
  <header class="bg-gray-800 border-b border-gray-700 px-4 py-3">
    <div class="container mx-auto flex items-center justify-between">
      <h1 class="text-xl font-bold text-guild-gold">Dungeon Farmers</h1>
      <div class="flex items-center gap-4">
        <span class="text-guild-gold font-semibold">
          {{ gameStore.gold }} Gold
        </span>
      </div>
    </div>
  </header>
</template>
```

**Step 3: Create `app/components/AppNav.vue`**

```vue
<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
    <div class="container mx-auto flex justify-around py-2">
      <NuxtLink
        to="/"
        class="flex flex-col items-center p-2 text-gray-400 hover:text-guild-gold"
        active-class="text-guild-gold"
      >
        <span class="text-2xl">⚔️</span>
        <span class="text-xs">Heroes</span>
      </NuxtLink>
      <NuxtLink
        to="/expeditions"
        class="flex flex-col items-center p-2 text-gray-400 hover:text-guild-gold"
        active-class="text-guild-gold"
      >
        <span class="text-2xl">🗺️</span>
        <span class="text-xs">Expeditions</span>
      </NuxtLink>
      <NuxtLink
        to="/inventory"
        class="flex flex-col items-center p-2 text-gray-400 hover:text-guild-gold"
        active-class="text-guild-gold"
      >
        <span class="text-2xl">🎒</span>
        <span class="text-xs">Inventory</span>
      </NuxtLink>
    </div>
  </nav>
</template>
```

**Step 4: Update `app/app.vue`**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

**Commit:** `feat: add base layout with header and navigation`

---

### Task 6: Create Placeholder Pages

**Files:** `app/pages/index.vue`, `app/pages/expeditions.vue`, `app/pages/inventory.vue`

Create basic placeholder pages for routing.

**Commit:** `feat: add placeholder pages`

---

### Task 7: Create Base TypeScript Types

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

**Commit:** `feat: add base type definitions`

---

### Task 8: Create Archetype Types

**Files:** `types/archetypes.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 10.

**Commit:** `feat: add archetype and tag type definitions`

---

### Task 9: Create Threat Types

**Files:** `types/threats.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 11.

**Commit:** `feat: add threat type definitions and penalty calculations`

---

### Task 10: Create Trait Types

**Files:** `types/traits.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 12.

**Commit:** `feat: add gameplay and story trait type definitions`

---

### Task 11: Create Hero Types

**Files:** `types/hero.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 13, but add:

```typescript
// Morale tracking
morale: MoraleState
moraleLastUpdate: string

// Active status
isOnExpedition: boolean
isStationed: boolean
stationedZoneId: string | null
```

**Commit:** `feat: add hero and guild master type definitions`

---

### Task 12: Create Recruitment Types

**Files:** `types/recruitment.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 14.

**Commit:** `feat: add recruitment and tavern type definitions`

---

### Task 13: Create Zone Types

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

**Commit:** `feat: add zone and subzone type definitions`

---

### Task 14: Create Expedition Types

**Files:** `types/expedition.ts`

Copy from `2024-12-14-implementation-plan.md` Task 10, but extend with:

```typescript
// Auto-repeat settings
autoRepeat: boolean
autoRepeatLimit?: number
stopConditions: {
  anyHeroTired: boolean
  inventoryFull: boolean
  resourceCap: boolean
}

// Events
events: ExpeditionEvent[]
pendingChoices: ExpeditionEvent[]

// Log
log?: ExpeditionLog
```

**Commit:** `feat: add expedition type definitions`

---

### Task 15: Create Equipment Types

**Files:** `types/equipment.ts`

Copy from `2024-12-14-implementation-plan.md` Task 11, but extend with:

```typescript
// Traits
traits: EquipmentTrait[]
maxTraits: number

// Set
setId?: string
```

**Commit:** `feat: add equipment type definitions`

---

### Task 16: Create Additional Types

**Files:** `types/monsters.ts`, `types/titles.ts`, `types/morale.ts`, `types/presets.ts`

Create type files for:
- Monsters (for Phase 1 spawns, Phase 2 capture)
- Titles (achievement system)
- Morale (hero state)
- Presets (party compositions)

**Commit:** `feat: add additional type definitions`

---

### Task 17: Create Type Index

**Files:** `types/index.ts`

```typescript
// Base types
export * from './base'

// Archetype system
export * from './archetypes'

// Threat system
export * from './threats'

// Trait system
export * from './traits'

// Hero system
export * from './hero'

// Recruitment system
export * from './recruitment'

// Zone system
export * from './zones'

// Expedition system
export * from './expedition'

// Equipment system
export * from './equipment'

// Additional systems
export * from './monsters'
export * from './titles'
export * from './morale'
export * from './presets'
```

**Commit:** `feat: add types index for clean imports`

---

### Task 18: Create Database Schema

**Files:** `supabase/migrations/001_initial_schema.sql`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 16, extended for:
- Zones and subzones
- Equipment with traits
- Expeditions with events
- Party presets
- Titles
- Morale tracking

**Commit:** `feat: add initial database schema`

---

## Phase 1.1: Hero System

### Task 19: Create Name Data

**Files:** `app/data/names.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 17.

**Commit:** `feat: add hero name data with culture preferences`

---

### Task 20: Create Gameplay Trait Data

**Files:** `app/data/gameplayTraits.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 18.

**Commit:** `feat: add gameplay trait data with effects and reactions`

---

### Task 21: Create Story Trait Data

**Files:** `app/data/storyTraits.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 19.

**Commit:** `feat: add story trait data with reactions and titles`

---

### Task 22: Create Culture Data

**Files:** `app/data/cultures.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 20.

**Commit:** `feat: add culture data with flavor texts`

---

### Task 23: Create Hero Generator

**Files:** `app/utils/heroGenerator.ts`, `tests/utils/heroGenerator.test.ts`

Copy from `2024-12-14-phase1-hero-system-update.md` Task 21.

**Commit:** `feat: add hero generator with archetypes, tags, and traits`

---

### Task 24: Create Power Calculator

**Files:** `app/utils/powerCalculator.ts`, `tests/utils/powerCalculator.test.ts`

```typescript
import type { Hero, Equipment, Stats } from '~~/types'
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

**Commit:** `feat: add hero power calculator`

---

### Task 25: Create Hero Store (Pinia)

**Files:** `app/stores/heroes.ts`

```typescript
import { defineStore } from 'pinia'
import type { Hero } from '~~/types'

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
        this.heroes = await $fetch<Hero[]>('/api/heroes')
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async recruitHero(tavernHeroId: string) {
      const hero = await $fetch<Hero>('/api/tavern/recruit', {
        method: 'POST',
        body: { slotIndex: tavernHeroId }
      })
      this.heroes.push(hero)
      return hero
    },

    async updateHero(hero: Partial<Hero> & { id: string }) {
      const updated = await $fetch<Hero>(`/api/heroes/${hero.id}`, {
        method: 'PATCH',
        body: hero
      })
      const index = this.heroes.findIndex(h => h.id === hero.id)
      if (index !== -1) {
        this.heroes[index] = updated
      }
    },

    async retireHero(heroId: string, transferTraitTo?: string) {
      await $fetch(`/api/heroes/${heroId}/retire`, {
        method: 'POST',
        body: { transferTraitTo }
      })
      this.heroes = this.heroes.filter(h => h.id !== heroId)
    }
  }
})
```

**Commit:** `feat: add hero Pinia store`

---

### Task 26: Create Tavern Store

**Files:** `app/stores/tavern.ts`

```typescript
import { defineStore } from 'pinia'
import type { TavernHero, TavernState } from '~~/types'

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
        const data = await $fetch<TavernState>('/api/tavern')
        this.slots = data.slots
        this.lockSlots = data.lockSlots
        this.usedLockSlots = data.usedLockSlots
        this.lastRefresh = data.lastRefreshAt
        this.nextRefresh = data.nextFreeRefresh
      } finally {
        this.loading = false
      }
    },

    async refreshTavern() {
      const data = await $fetch<{ slots: TavernHero[], nextFreeRefresh: string }>('/api/tavern/refresh', { method: 'POST' })
      this.slots = data.slots
      this.nextRefresh = data.nextFreeRefresh
    },

    async lockHero(slotIndex: number) {
      await $fetch(`/api/tavern/lock/${slotIndex}`, { method: 'POST' })
      this.slots[slotIndex].isLocked = true
      this.usedLockSlots++
    },

    async unlockHero(slotIndex: number) {
      await $fetch(`/api/tavern/unlock/${slotIndex}`, { method: 'POST' })
      this.slots[slotIndex].isLocked = false
      this.usedLockSlots--
    }
  }
})
```

**Commit:** `feat: add tavern Pinia store`

---

### Task 27: Create Hero API Routes

**Files:** `server/api/heroes/index.get.ts`, `server/api/heroes/[id].get.ts`, `server/api/heroes/[id].patch.ts`, `server/api/heroes/[id]/retire.post.ts`, `server/api/heroes/[id]/prestige.post.ts`

Implement CRUD operations using Supabase client. Use Zod for validation.

**Commit:** `feat: add hero API routes`

---

### Task 28: Create Tavern API Routes

**Files:** `server/api/tavern/index.get.ts`, `server/api/tavern/refresh.post.ts`, `server/api/tavern/recruit.post.ts`, `server/api/tavern/lock/[index].post.ts`, `server/api/tavern/unlock/[index].post.ts`

**Commit:** `feat: add tavern API routes`

---

### Task 29: Create HeroCard Component

**Files:** `app/components/hero/HeroCard.vue`

Display hero with name, rarity border, archetype icon, stats, tags, traits summary.

**Commit:** `feat: add HeroCard component`

---

### Task 30: Create HeroDetail Component

**Files:** `app/components/hero/HeroDetail.vue`

Full hero profile: all stats, traits with descriptions, equipment slots, prestige info, morale display.

**Commit:** `feat: add HeroDetail component`

---

### Task 31: Create TavernSlot Component

**Files:** `app/components/tavern/TavernSlot.vue`

Show tavern hero with recruit button, lock button, cost.

**Commit:** `feat: add TavernSlot component`

---

## Phase 1.2: Zone & Expedition System

### Task 32: Create Zone Data

**Files:** `app/data/zones.ts`

Create zone definitions with subzones, threats, and rewards. Include:
- Verdant Woods (starter)
- Goblin Caves
- Misty Swamp
- Ancient Ruins
- Scorching Desert

Each zone should have 3-6 subzones with discovery requirements.

**Commit:** `feat: add zone and subzone data`

---

### Task 33: Create Monster Data

**Files:** `app/data/monsters.ts`

Create monster definitions for Phase 1 spawns (capture is Phase 2). Include:
- Monster families
- Pack types (trash, elite, miniboss, boss)
- Threat contributions
- Loot tables

**Commit:** `feat: add monster data`

---

### Task 34: Create Expedition Engine

**Files:** `app/utils/expeditionEngine.ts`

```typescript
import type { Hero, Zone, Subzone, Expedition, ExpeditionRewards } from '~~/types'
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
    autoRepeat: false,
    stopConditions: {
      anyHeroTired: false,
      inventoryFull: false,
      resourceCap: false,
    },
    events: [],
    pendingChoices: [],
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
  const log = generateExpeditionLog({
    expedition,
    heroes,
    zone,
    subzone,
    events,
    rewards,
    efficiency,
  })

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
```

**Commit:** `feat: add expedition engine`

---

### Task 35: Create Efficiency Calculator

**Files:** `app/utils/efficiencyCalculator.ts`

Copy from `2024-12-14-implementation-plan.md` Task 27, but extend with threat/counter system.

**Commit:** `feat: add efficiency calculator with threat system`

---

### Task 36: Create Event Generator

**Files:** `app/utils/eventGenerator.ts`

Implement all event types:
- Flavor events (50%)
- Skill check events (25%)
- Choice events (20%)
- Rare occurrences (5%)

Include trait reaction triggers.

**Commit:** `feat: add expedition event generator`

---

### Task 37: Create Log Generator

**Files:** `app/utils/logGenerator.ts`

Copy from `2024-12-14-systems-technical-design.md` Section 1.

Implement template system with trait reactions.

**Commit:** `feat: add expedition log generator with templates`

---

### Task 38: Create Timer Composables

**Files:** `app/composables/useGameClock.ts`, `app/composables/useExpeditionTimer.ts`

Copy from `2024-12-14-systems-technical-design.md` Section 2.

**Note:** Use VueUse utilities:
- `watchThrottled` from `@vueuse/core` for completion watchers
- `useInterval` for game clock (alternative to manual setInterval)
- `useLocalStorage` for client-side timer persistence (optional)

**Example using VueUse:**

```typescript
import { watchThrottled } from '@vueuse/core'

// In expedition component
watchThrottled(
  isComplete,
  async (complete) => {
    if (complete && currentExpedition.value) {
      await expeditionStore.completeExpedition(currentExpedition.value.id)
    }
  },
  { throttle: 1000 }
)
```

**Commit:** `feat: add timer composables`

---

### Task 39: Create Expedition Store

**Files:** `app/stores/expeditions.ts`

```typescript
import { defineStore } from 'pinia'
import type { Expedition } from '~~/types'

export const useExpeditionStore = defineStore('expeditions', {
  state: () => ({
    activeExpeditions: [] as Expedition[],
    completedExpeditions: [] as Expedition[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getExpeditionById: (state) => (id: string) =>
      state.activeExpeditions.find(e => e.id === id),

    completedExpeditions: (state) => {
      const now = new Date()
      return state.activeExpeditions.filter(e =>
        e.status === 'in_progress' && new Date(e.completesAt) <= now
      )
    },
  },

  actions: {
    async fetchExpeditions() {
      this.loading = true
      try {
        const data = await $fetch<{ active: Expedition[], completed: Expedition[] }>('/api/expeditions')
        this.activeExpeditions = data.active
        this.completedExpeditions = data.completed
      } finally {
        this.loading = false
      }
    },

    async startExpedition(params: {
      zoneId: string
      subzoneId: string
      heroIds: string[]
      autoRepeat?: boolean
    }) {
      const data = await $fetch<{ expedition: Expedition }>('/api/expeditions/start', {
        method: 'POST',
        body: params
      })
      this.activeExpeditions.push(data.expedition)
      return data.expedition
    },

    async completeExpedition(expeditionId: string) {
      const data = await $fetch<{ expedition: Expedition }>(`/api/expeditions/${expeditionId}/complete`, {
        method: 'POST'
      })
      const index = this.activeExpeditions.findIndex(e => e.id === expeditionId)
      if (index !== -1) {
        this.activeExpeditions[index] = data.expedition
      }
      return data.expedition
    },
  }
})
```

**Commit:** `feat: add expedition Pinia store`

---

### Task 40: Create Zone Store

**Files:** `app/stores/zones.ts`

Store for zone/subzone state, familiarity, mastery tracking.

**Commit:** `feat: add zone Pinia store`

---

### Task 41: Create Expedition API Routes

**Files:** `server/api/expeditions/*`

Implement all routes from `2024-12-14-systems-technical-design.md` Section 3.

**Commit:** `feat: add expedition API routes`

---

### Task 42: Create Expedition UI Components

**Files:** `app/components/expedition/*.vue`

- `ExpeditionSetup.vue` - Hero selection, threat preview, estimated rewards
- `ExpeditionActive.vue` - Timer, progress bar, team display
- `ExpeditionLog.vue` - Render narrative log with trait reactions
- `EventChoice.vue` - Choice event resolution UI
- `ZoneCard.vue` - Zone display with familiarity/mastery
- `SubzoneCard.vue` - Subzone display with discovery status

**Commit:** `feat: add expedition UI components`

---

## Phase 1.3: Equipment & Loot

### Task 43: Create Equipment Data

**Files:** `app/data/equipment.ts`

Equipment templates for each slot and rarity.

**Commit:** `feat: add equipment template data`

---

### Task 44: Create Equipment Trait Data

**Files:** `app/data/equipmentTraits.ts`

Traits that can roll on equipment (shared pool + gear-exclusive).

**Commit:** `feat: add equipment trait data`

---

### Task 45: Create Set Data

**Files:** `app/data/sets.ts`

Equipment sets with 2/4/6 piece bonuses.

**Commit:** `feat: add equipment set data`

---

### Task 46: Create Loot Table Data

**Files:** `app/data/lootTables.ts`

Loot tables per zone/subzone with difficulty tier scaling.

**Commit:** `feat: add loot table data`

---

### Task 47: Create Equipment Generator

**Files:** `app/utils/equipmentGenerator.ts`

Generate equipment with:
- Rarity-based stats
- Item level scaling
- Trait rolling (quality-based)
- Set assignment

**Commit:** `feat: add equipment generator`

---

### Task 48: Create Inventory Store

**Files:** `app/stores/inventory.ts`

```typescript
import { defineStore } from 'pinia'
import type { Equipment, EquipmentSlot } from '~~/types'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventory: [] as Equipment[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getEquipmentById: (state) => (id: string) =>
      state.inventory.find(e => e.id === id),

    unequippedItems: (state) =>
      state.inventory.filter(e => e.equippedHeroId === null),

    getEquippedByHero: (state) => (heroId: string) =>
      state.inventory.filter(e => e.equippedHeroId === heroId),
  },

  actions: {
    async fetchInventory() {
      this.loading = true
      try {
        const data = await $fetch<{ equipment: Equipment[] }>('/api/equipment')
        this.inventory = data.equipment
      } finally {
        this.loading = false
      }
    },

    async equipItem(equipmentId: string, heroId: string) {
      const data = await $fetch<{ equipment: Equipment }>(`/api/equipment/${equipmentId}/equip`, {
        method: 'POST',
        body: { heroId }
      })
      const index = this.inventory.findIndex(e => e.id === equipmentId)
      if (index !== -1) {
        this.inventory[index] = data.equipment
      }
      return data.equipment
    },
  }
})
```

**Commit:** `feat: add inventory Pinia store`

---

### Task 49: Create Equipment API Routes

**Files:** `server/api/equipment/*`

Implement all routes from API specification.

**Commit:** `feat: add equipment API routes`

---

### Task 50: Create Equipment UI

**Files:** `app/components/equipment/*.vue`

- `EquipmentCard.vue` - Display equipment with stats and traits
- `EquipmentSlot.vue` - Equipment slot display
- `InventoryGrid.vue` - Inventory grid view
- `SetBonusDisplay.vue` - Show active set bonuses

**Commit:** `feat: add equipment UI components`

---

## Phase 1.4: Progression Systems

### Task 51: Create XP Service

**Files:** `app/utils/xpService.ts`

Tiered linear XP curve from comprehensive plan:

```typescript
export function getXpForLevel(level: number): number {
  if (level <= 10) return 100
  if (level <= 20) return 200
  if (level <= 30) return 350
  if (level <= 40) return 500
  if (level <= 50) return 750
  return 1000
}
```

**Commit:** `feat: add XP service with tiered progression`

---

### Task 52: Create Level Up Handler

**Files:** `app/utils/levelUpHandler.ts`

Apply level-ups, check for prestige availability.

**Commit:** `feat: add level up handler`

---

### Task 53: Create Prestige Service

**Files:** `app/utils/prestigeService.ts`

Handle prestige: reset level, apply bonuses, trait upgrade chance.

**Commit:** `feat: add prestige service`

---

### Task 54: Create Morale Service

**Files:** `app/utils/moraleService.ts`

Track morale changes, recovery over time. Implement all triggers from comprehensive plan.

**Commit:** `feat: add morale service`

---

### Task 55: Create Title System

**Files:** `app/data/titles.ts`, `app/utils/titleChecker.ts`

Title definitions and unlock checking logic.

**Commit:** `feat: add title system`

---

### Task 56: Create Difficulty Tier System

**Files:** `app/data/difficultyTiers.ts`, `app/utils/difficultyScaler.ts`

10-tier difficulty system (Novice → Transcendent) with scaling.

**Commit:** `feat: add difficulty tier system`

---

### Task 57: Update Hero API for Progression

**Files:** `server/api/heroes/[id]/prestige.post.ts`

**Commit:** `feat: add prestige API endpoint`

---

### Task 58: Create ProgressBar Component

**Files:** `app/components/ui/ProgressBar.vue`

**Commit:** `feat: add ProgressBar component`

---

### Task 59: Create LevelUpModal Component

**Files:** `app/components/hero/LevelUpModal.vue`

**Commit:** `feat: add LevelUpModal component`

---

### Task 60: Create PrestigeModal Component

**Files:** `app/components/hero/PrestigeModal.vue`

**Commit:** `feat: add PrestigeModal component`

---

## Phase 1.5: Polish & Quality of Life

### Task 61: Create Expedition Log Display

**Files:** `app/components/expedition/ExpeditionLog.vue`

Render narrative log with trait reactions, sections, and summary.

**Commit:** `feat: add expedition log display`

---

### Task 62: Create Event Choice UI

**Files:** `app/components/expedition/EventChoice.vue`

**Commit:** `feat: add event choice UI`

---

### Task 63: Implement Offline Progress

**Files:** `app/utils/offlineProgress.ts`, `server/api/sync.post.ts`

Process completed expeditions on reconnect. Auto-repeat logic.

**Commit:** `feat: implement offline progress system`

---

### Task 64: Create Auto-Repeat Logic

**Files:** `app/utils/autoRepeat.ts`

Per-expedition repeat settings with stop conditions.

**Commit:** `feat: add auto-repeat logic`

---

### Task 65: Create Notification Service

**Files:** `app/utils/notificationService.ts`

In-app notifications for expedition complete, level up, etc.

**Commit:** `feat: add notification service`

---

### Task 66: Create Party Preset System

**Files:** `app/stores/presets.ts`, `app/components/expedition/PartyPresetSelector.vue`

Save/load party compositions.

**Commit:** `feat: add party preset system`

---

### Task 67: Create Hero Retirement System

**Files:** `app/components/hero/RetirementModal.vue`

Retirement with rewards and story trait transfer.

**Commit:** `feat: add hero retirement system`

---

### Task 68: Create Dashboard Page

**Files:** `app/pages/index.vue`

Main hub: active expeditions, hero summary, quick actions.

**Commit:** `feat: add dashboard page`

---

### Task 69: Create Full Page Routes

**Files:** `app/pages/heroes.vue`, `app/pages/expeditions.vue`, `app/pages/tavern.vue`, `app/pages/inventory.vue`

**Commit:** `feat: add full page routes`

---

### Task 70: Integration Testing

**Files:** `tests/integration/*.test.ts`

Full flow tests: recruit → expedition → loot → level up.

**Commit:** `feat: add integration tests`

---

## Phase 1.6: Additional Systems

### Task 71: Create Tutorial Flow

**Files:** `app/composables/useTutorial.ts`, `app/components/tutorial/*.vue`

Mandatory intro + optional mentor quests.

**Commit:** `feat: add tutorial flow`

---

### Task 72: Implement Economy Balance

**Files:** `app/data/goldSinks.ts`

Gold sink definitions and costs.

**Commit:** `feat: add economy balance system`

---

### Task 73: Create Notification System

**Files:** `app/stores/notifications.ts`, `app/components/ui/NotificationCenter.vue`

Opt-in push notifications + daily digest.

**Commit:** `feat: add notification system`

---

### Task 74: Create Achievement System

**Files:** `app/data/achievements.ts`, `app/stores/achievements.ts`, `app/components/achievements/AchievementCard.vue`

**Commit:** `feat: add achievement system`

---

### Task 75: Create Daily/Weekly Challenges

**Files:** `app/stores/challenges.ts`, `app/components/challenges/ChallengeBoard.vue`

**Commit:** `feat: add challenge system`

---

### Task 76: Create Passive Stationing

**Files:** `app/stores/stationing.ts`, `app/components/zone/StationingPanel.vue`

Heroes station in zones for passive income.

**Commit:** `feat: add passive stationing system`

---

### Task 77: Create Guild Master System

**Files:** `app/stores/guildMaster.ts`, `app/pages/guild-master.vue`

Player's unique character with equippable traits.

**Commit:** `feat: add Guild Master system`

---

### Task 78: Create Collection Journal

**Files:** `app/pages/collection.vue`, `app/components/collection/*.vue`

Monsters, collectibles, sets tracking.

**Commit:** `feat: add collection journal`

---

### Task 79: Create Player Settings

**Files:** `app/pages/settings.vue`

Notification preferences, display options.

**Commit:** `feat: add player settings`

---

### Task 80: Final Integration & Testing

**Files:** All

End-to-end testing, performance optimization, bug fixes.

**Commit:** `feat: final integration and testing`

---

## API Routes Specification

See `2024-12-14-systems-technical-design.md` Section 3 for complete API route specifications.

### Key Routes

**Auth & Sync:**
- `POST /api/sync` - Resolve offline progress

**Heroes:**
- `GET /api/heroes` - List heroes
- `GET /api/heroes/[id]` - Get hero
- `PATCH /api/heroes/[id]` - Update hero
- `POST /api/heroes/[id]/retire` - Retire hero
- `POST /api/heroes/[id]/prestige` - Prestige hero

**Tavern:**
- `GET /api/tavern` - Get tavern state
- `POST /api/tavern/refresh` - Refresh tavern
- `POST /api/tavern/recruit` - Recruit hero
- `POST /api/tavern/lock/[index]` - Lock slot
- `POST /api/tavern/unlock/[index]` - Unlock slot

**Expeditions:**
- `GET /api/expeditions` - List expeditions
- `POST /api/expeditions/start` - Start expedition
- `POST /api/expeditions/[id]/complete` - Complete expedition
- `POST /api/expeditions/[id]/choice` - Resolve choice
- `GET /api/expeditions/preview` - Preview expedition

**Equipment:**
- `GET /api/equipment` - List equipment
- `POST /api/equipment/[id]/equip` - Equip item
- `POST /api/equipment/[id]/upgrade` - Upgrade trait

**Zones:**
- `GET /api/zones` - List zones
- `POST /api/zones/[id]/station` - Station hero

**Player:**
- `GET /api/player` - Get player state
- `GET /api/player/presets` - Get presets
- `POST /api/player/presets` - Create preset

---

## Summary & Milestones

**Total Tasks:** 80 tasks across 7 phases

**Critical Path:** Tasks 1-18 → 19-31 → 32-42 → 43-50 → 51-60 → 61-70 → 71-80

**Key Milestones:**
- After Task 18: Types and DB ready
- After Task 31: Hero system complete
- After Task 42: Expeditions working
- After Task 50: Full loot loop
- After Task 60: Progression working
- After Task 70: MVP complete
- After Task 80: Full feature set

**Estimated File Count:**
- Types: ~15 files
- Data: ~12 files
- Utils: ~20 files
- Stores: ~8 files
- Components: ~30 files
- Pages: ~8 files
- API Routes: ~40 files
- Tests: ~25 files

**Total:** ~158 files

---

## Next Steps After Phase 1

1. **Phase 2:** Monster capture and dungeon building
2. **Phase 3:** Synergies, prestige depth, procedural events
3. **Phase 4:** AI-generated content, more zones
4. **Phase 5:** Social features (alliances, raids, leaderboards)

---

**For full design details, see:**
- `design/GAME_DESIGN_V2.md` - Complete game design
- `docs/plans/BEST_PRACTICES_REVIEW.md` - Implementation best practices
- `docs/tech-stack-recommendation.md` - Tech stack details
