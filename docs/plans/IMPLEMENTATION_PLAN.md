# Dungeon Farmers - Complete Implementation Plan

> **For Claude:** Use `superpowers:executing-plans` to implement this plan task-by-task.
>
> ⚠️ **IMPORTANT:** This plan is self-contained. All implementation details are included below. Follow Nuxt 4 best practices: use `$fetch` in Pinia stores (not `useFetch`), use `~~/types` for type imports, and call Nuxt composables inside functions.

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
5. **Best Practices** - Use `$fetch` in stores, `~~/types` for imports, composables in functions

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

// Stat distribution weights by archetype (how to distribute stat points)
export const ARCHETYPE_STAT_WEIGHTS: Record<Archetype, Stats> = {
  tank: { combat: 0.2, utility: 0.2, survival: 0.6 },
  healer: { combat: 0.1, utility: 0.4, survival: 0.5 },
  debuffer: { combat: 0.3, utility: 0.5, survival: 0.2 },
  melee_dps: { combat: 0.6, utility: 0.2, survival: 0.2 },
  ranged_dps: { combat: 0.5, utility: 0.3, survival: 0.2 },
  caster: { combat: 0.6, utility: 0.3, survival: 0.1 },
}

// Quality multipliers for trait value ranges
export const QUALITY_MULTIPLIERS: Record<TraitQuality, { min: number; max: number }> = {
  normal: { min: 0.3, max: 0.5 },
  magic: { min: 0.5, max: 0.8 },
  perfect: { min: 0.8, max: 1.0 },
}
```

**Commit:** `feat: add base type definitions`

---

### Task 8: Create Archetype Types

**Files:** `types/archetypes.ts`

```typescript
import type { Archetype } from './base'

// All possible archetype tags
export type ArchetypeTag =
  // Tank tags
  | 'taunt' | 'heavy_armor' | 'magic_resist' | 'shield_wall' | 'intercept' | 'endurance'
  // Healer tags
  | 'burst_heals' | 'regen' | 'decurse' | 'cleanse' | 'shields' | 'immunity'
  // Debuffer tags
  | 'dispel' | 'weaken' | 'slow' | 'blind' | 'silence' | 'expose'
  // Melee DPS tags
  | 'cleave' | 'execute' | 'armor_break' | 'charge' | 'parry' | 'frenzy'
  // Ranged DPS tags
  | 'snipe' | 'volley' | 'kite' | 'precision' | 'traps' | 'scout'
  // Caster tags
  | 'fire' | 'ice' | 'lightning' | 'arcane' | 'aoe_blast' | 'channel'

// Tag pool for each archetype
export const ARCHETYPE_TAG_POOLS: Record<Archetype, ArchetypeTag[]> = {
  tank: ['taunt', 'heavy_armor', 'magic_resist', 'shield_wall', 'intercept', 'endurance'],
  healer: ['burst_heals', 'regen', 'decurse', 'cleanse', 'shields', 'immunity'],
  debuffer: ['dispel', 'weaken', 'slow', 'blind', 'silence', 'expose'],
  melee_dps: ['cleave', 'execute', 'armor_break', 'charge', 'parry', 'frenzy'],
  ranged_dps: ['snipe', 'volley', 'kite', 'precision', 'traps', 'scout'],
  caster: ['fire', 'ice', 'lightning', 'arcane', 'aoe_blast', 'channel'],
}

// Tag count by rarity
export const TAG_COUNT_BY_RARITY: Record<import('./base').Rarity, number> = {
  common: 1,
  uncommon: 1,
  rare: 2,
  epic: 2,
  legendary: 3,
}

// Tag display info
export interface TagInfo {
  id: ArchetypeTag
  name: string
  description: string
  counters: string[] // Threat IDs this tag counters
}

export const TAG_INFO: Record<ArchetypeTag, TagInfo> = {
  // Tank
  taunt: { id: 'taunt', name: 'Taunt', description: 'Forces enemies to attack you', counters: ['boss_focus', 'split_damage'] },
  heavy_armor: { id: 'heavy_armor', name: 'Heavy Armor', description: 'Reduces physical damage taken', counters: ['physical_burst', 'piercing'] },
  magic_resist: { id: 'magic_resist', name: 'Magic Resist', description: 'Reduces magic damage taken', counters: ['spell_barrages', 'elemental'] },
  shield_wall: { id: 'shield_wall', name: 'Shield Wall', description: 'Protects entire party from AoE', counters: ['aoe_damage', 'swarms'] },
  intercept: { id: 'intercept', name: 'Intercept', description: 'Blocks attacks on allies', counters: ['sneak_attacks', 'assassins'] },
  endurance: { id: 'endurance', name: 'Endurance', description: 'Sustains through long fights', counters: ['attrition', 'marathon'] },

  // Healer
  burst_heals: { id: 'burst_heals', name: 'Burst Heals', description: 'Rapid emergency healing', counters: ['spike_damage', 'executes'] },
  regen: { id: 'regen', name: 'Regeneration', description: 'Sustained healing over time', counters: ['attrition', 'long_expeditions'] },
  decurse: { id: 'decurse', name: 'Decurse', description: 'Removes curses and hexes', counters: ['curses', 'hexes'] },
  cleanse: { id: 'cleanse', name: 'Cleanse', description: 'Removes poisons and diseases', counters: ['poison', 'disease'] },
  shields: { id: 'shields', name: 'Shields', description: 'Prevents incoming damage', counters: ['predictable_damage', 'traps'] },
  immunity: { id: 'immunity', name: 'Immunity', description: 'Grants immunity to effects', counters: ['instant_death', 'stuns'] },

  // Debuffer
  dispel: { id: 'dispel', name: 'Dispel', description: 'Removes enemy buffs', counters: ['enemy_buffs', 'enemy_shields'] },
  weaken: { id: 'weaken', name: 'Weaken', description: 'Reduces enemy power', counters: ['enraged', 'berserkers'] },
  slow: { id: 'slow', name: 'Slow', description: 'Reduces enemy speed', counters: ['fast_enemies', 'fleeing'] },
  blind: { id: 'blind', name: 'Blind', description: 'Reduces enemy accuracy', counters: ['accurate_enemies', 'crits'] },
  silence: { id: 'silence', name: 'Silence', description: 'Prevents enemy casting', counters: ['casters', 'summoners'] },
  expose: { id: 'expose', name: 'Expose', description: 'Reduces enemy defenses', counters: ['armored', 'resistant'] },

  // Melee DPS
  cleave: { id: 'cleave', name: 'Cleave', description: 'Hits multiple enemies', counters: ['swarms', 'grouped_enemies'] },
  execute: { id: 'execute', name: 'Execute', description: 'Finishes low HP enemies', counters: ['bosses', 'high_hp'] },
  armor_break: { id: 'armor_break', name: 'Armor Break', description: 'Ignores armor', counters: ['armored', 'fortified'] },
  charge: { id: 'charge', name: 'Charge', description: 'Closes distance quickly', counters: ['ranged_enemies', 'fleeing'] },
  parry: { id: 'parry', name: 'Parry', description: 'Counters melee attacks', counters: ['duelist', 'counter_attackers'] },
  frenzy: { id: 'frenzy', name: 'Frenzy', description: 'Increased attack speed', counters: ['time_pressure', 'dps_checks'] },

  // Ranged DPS
  snipe: { id: 'snipe', name: 'Snipe', description: 'Long range precision', counters: ['flying', 'elevated'] },
  volley: { id: 'volley', name: 'Volley', description: 'Hits multiple targets', counters: ['swarms', 'spread_out'] },
  kite: { id: 'kite', name: 'Kite', description: 'Attack while moving', counters: ['melee_only', 'slow_enemies'] },
  precision: { id: 'precision', name: 'Precision', description: 'High accuracy shots', counters: ['evasive', 'small_targets'] },
  traps: { id: 'traps', name: 'Traps', description: 'Sets traps for enemies', counters: ['ambushers', 'flankers'] },
  scout: { id: 'scout', name: 'Scout', description: 'Detects hidden threats', counters: ['hidden_enemies', 'ambush'] },

  // Caster
  fire: { id: 'fire', name: 'Fire Magic', description: 'Burns enemies', counters: ['ice_enemies', 'regenerators'] },
  ice: { id: 'ice', name: 'Ice Magic', description: 'Freezes and slows', counters: ['fast_enemies', 'fire_enemies'] },
  lightning: { id: 'lightning', name: 'Lightning Magic', description: 'Piercing electric damage', counters: ['armored', 'constructs'] },
  arcane: { id: 'arcane', name: 'Arcane Magic', description: 'Pure magical damage', counters: ['magic_resist', 'anti_physical'] },
  aoe_blast: { id: 'aoe_blast', name: 'AoE Blast', description: 'Area damage spells', counters: ['swarms', 'clusters'] },
  channel: { id: 'channel', name: 'Channel', description: 'Powerful focused spells', counters: ['single_target', 'bosses'] },
}
```

**Commit:** `feat: add archetype and tag type definitions`

---

### Task 9: Create Threat Types

**Files:** `types/threats.ts`

```typescript
import type { ZoneDifficulty } from './base'
import type { ArchetypeTag } from './archetypes'

// Threat severity levels
export type ThreatSeverity = 'minor' | 'major' | 'deadly'

// Base penalties by severity
export const SEVERITY_BASE_PENALTY: Record<ThreatSeverity, number> = {
  minor: 5,
  major: 10,
  deadly: 15,
}

// Threat categories
export type ThreatCategory = 'damage' | 'enemy_type' | 'status' | 'mechanic'

// Threat definition
export interface Threat {
  id: string
  name: string
  description: string
  category: ThreatCategory
  severity: ThreatSeverity
  counteredBy: ArchetypeTag[]
}

// All threats
export const THREATS: Record<string, Threat> = {
  // DAMAGE THREATS
  physical_burst: {
    id: 'physical_burst',
    name: 'Physical Burst',
    description: 'High single-target physical damage',
    category: 'damage',
    severity: 'major',
    counteredBy: ['heavy_armor', 'shields'],
  },
  spike_damage: {
    id: 'spike_damage',
    name: 'Spike Damage',
    description: 'Sudden HP drops',
    category: 'damage',
    severity: 'major',
    counteredBy: ['burst_heals', 'intercept'],
  },
  aoe_damage: {
    id: 'aoe_damage',
    name: 'AoE Damage',
    description: 'Party-wide attacks',
    category: 'damage',
    severity: 'major',
    counteredBy: ['shield_wall', 'regen'],
  },
  attrition: {
    id: 'attrition',
    name: 'Attrition',
    description: 'Slow constant damage',
    category: 'damage',
    severity: 'minor',
    counteredBy: ['endurance', 'regen'],
  },
  spell_barrages: {
    id: 'spell_barrages',
    name: 'Spell Barrages',
    description: 'Magic damage waves',
    category: 'damage',
    severity: 'major',
    counteredBy: ['magic_resist', 'immunity'],
  },

  // ENEMY TYPE THREATS
  swarms: {
    id: 'swarms',
    name: 'Swarms',
    description: 'Many weak enemies',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['cleave', 'volley', 'aoe_blast'],
  },
  armored: {
    id: 'armored',
    name: 'Armored',
    description: 'High physical resist enemies',
    category: 'enemy_type',
    severity: 'major',
    counteredBy: ['armor_break', 'lightning', 'expose'],
  },
  flying: {
    id: 'flying',
    name: 'Flying',
    description: 'Enemies out of melee reach',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['snipe', 'volley'],
  },
  evasive: {
    id: 'evasive',
    name: 'Evasive',
    description: 'Hard to hit enemies',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['precision', 'aoe_blast'],
  },
  fast_enemies: {
    id: 'fast_enemies',
    name: 'Fast Enemies',
    description: 'Quick attackers',
    category: 'enemy_type',
    severity: 'minor',
    counteredBy: ['ice', 'slow'],
  },
  bosses: {
    id: 'bosses',
    name: 'Bosses',
    description: 'High HP single targets',
    category: 'enemy_type',
    severity: 'deadly',
    counteredBy: ['execute', 'channel'],
  },

  // STATUS THREATS
  poison: {
    id: 'poison',
    name: 'Poison',
    description: 'Damage over time',
    category: 'status',
    severity: 'minor',
    counteredBy: ['cleanse', 'regen'],
  },
  curses: {
    id: 'curses',
    name: 'Curses',
    description: 'Stat debuffs',
    category: 'status',
    severity: 'major',
    counteredBy: ['decurse', 'dispel'],
  },
  disease: {
    id: 'disease',
    name: 'Disease',
    description: 'Spreading affliction',
    category: 'status',
    severity: 'major',
    counteredBy: ['cleanse', 'immunity'],
  },
  stuns: {
    id: 'stuns',
    name: 'Stuns',
    description: 'Incapacitates heroes',
    category: 'status',
    severity: 'major',
    counteredBy: ['immunity', 'shields'],
  },
  enraged: {
    id: 'enraged',
    name: 'Enraged',
    description: 'Buffed enemies',
    category: 'status',
    severity: 'minor',
    counteredBy: ['weaken', 'dispel'],
  },
  enemy_buffs: {
    id: 'enemy_buffs',
    name: 'Enemy Buffs',
    description: 'Shields and damage boosts',
    category: 'status',
    severity: 'minor',
    counteredBy: ['dispel', 'silence'],
  },

  // MECHANIC THREATS
  boss_focus: {
    id: 'boss_focus',
    name: 'Boss Focus',
    description: 'Boss targets one hero',
    category: 'mechanic',
    severity: 'major',
    counteredBy: ['taunt', 'intercept'],
  },
  time_pressure: {
    id: 'time_pressure',
    name: 'Time Pressure',
    description: 'DPS check / timer',
    category: 'mechanic',
    severity: 'major',
    counteredBy: ['frenzy', 'execute'],
  },
  ambush: {
    id: 'ambush',
    name: 'Ambush',
    description: 'Surprise attacks',
    category: 'mechanic',
    severity: 'minor',
    counteredBy: ['scout', 'traps'],
  },
  fleeing: {
    id: 'fleeing',
    name: 'Fleeing',
    description: 'Enemies try to escape',
    category: 'mechanic',
    severity: 'minor',
    counteredBy: ['charge', 'slow'],
  },
  summoners: {
    id: 'summoners',
    name: 'Summoners',
    description: 'Spawn adds constantly',
    category: 'mechanic',
    severity: 'major',
    counteredBy: ['silence', 'snipe'],
  },
  regenerators: {
    id: 'regenerators',
    name: 'Regenerators',
    description: 'Enemies heal themselves',
    category: 'mechanic',
    severity: 'minor',
    counteredBy: ['fire', 'execute'],
  },
}

// Calculate penalty for uncountered threat
export function calculateThreatPenalty(
  threat: Threat,
  difficulty: ZoneDifficulty,
  hasCounter: boolean
): number {
  if (hasCounter) {
    return -5 // Bonus for countering
  }

  const basePenalty = SEVERITY_BASE_PENALTY[threat.severity]
  const multiplier = {
    easy: 0.5,
    medium: 1.0,
    hard: 1.5,
    extreme: 2.0,
  }[difficulty]

  return basePenalty * multiplier
}
```

**Commit:** `feat: add threat type definitions and penalty calculations`

---

### Task 10: Create Trait Types

**Files:** `types/traits.ts`

```typescript
import type { TraitQuality, StatType, ZoneType, Rarity } from './base'

// === GAMEPLAY TRAITS ===

// Effect types for gameplay traits
export type GameplayTraitEffect =
  | 'stat_bonus'        // Flat stat increase
  | 'conditional_bonus' // Bonus in specific conditions
  | 'loot_bonus'        // Better loot drops
  | 'expedition_bonus'  // Expedition speed/rewards
  | 'trade_off'         // Positive and negative effects

// Gameplay trait definition
export interface GameplayTrait {
  id: string
  name: string
  description: string // Uses {value} placeholder for rolled value
  effect: GameplayTraitEffect
  isNegative: boolean

  // Value range (for rolling)
  minValue: number
  maxValue: number

  // Effect details
  statBonus?: {
    stat: StatType
    isPercent: boolean
  }
  conditionalBonus?: {
    condition: 'zone_type' | 'expedition_length' | 'enemy_type' | 'party_size'
    conditionValue: string // e.g., 'cave', 'long', 'dragon', 'solo'
    stat?: StatType
    allStats?: boolean
  }
  lootBonus?: {
    type: 'gold' | 'rare_drops' | 'materials' | 'xp'
  }
  expeditionBonus?: {
    type: 'speed' | 'event_chance' | 'efficiency'
  }
  tradeOff?: {
    positiveStat: StatType
    negativeStat: StatType
    negativeRatio: number // How much negative compared to positive
  }

  // Story reactions (optional - for expedition logs)
  reactions?: {
    onCombat?: string[]
    onLoot?: string[]
    onEvent?: string[]
  }
}

// Rolled gameplay trait on a hero
export interface HeroGameplayTrait {
  traitId: string
  quality: TraitQuality
  rolledValue: number // Actual value within range based on quality
}

// === NEGATIVE TRAITS ===

export type NegativeSeverity = 'mild' | 'moderate' | 'severe'

export interface NegativeTrait extends GameplayTrait {
  severity: NegativeSeverity
  // Can be removed/reduced
  canOvercome: boolean
  overcomeCost?: {
    type: 'gold' | 'expeditions' | 'healer'
    amount: number
  }
}

// Severity multipliers for negative effects
export const NEGATIVE_SEVERITY_MULTIPLIERS: Record<NegativeSeverity, number> = {
  mild: 0.5,
  moderate: 1.0,
  severe: 1.5,
}

// === STORY TRAITS ===

export interface StoryTrait {
  id: string
  name: string
  description: string

  // How this trait was acquired
  source: 'generation' | 'expedition' | 'event' | 'milestone' | 'curse'

  // Reactions for expedition logs
  reactions: {
    onCombat?: string[]
    onLoot?: string[]
    onEvent?: string[]
    onZoneType?: Partial<Record<ZoneType, string[]>>
    onPartyMember?: string[] // Reactions to other heroes
  }

  // Can grant a title
  grantsTitle?: string
}

// === TRAIT COUNTS ===

// Gameplay trait counts by rarity
export const GAMEPLAY_TRAIT_COUNT: Record<Rarity, { min: number; max: number; cap: number }> = {
  common: { min: 1, max: 2, cap: 3 },
  uncommon: { min: 2, max: 2, cap: 4 },
  rare: { min: 2, max: 3, cap: 5 },
  epic: { min: 3, max: 3, cap: 6 },
  legendary: { min: 3, max: 4, cap: 7 },
}

// Story trait starting counts
export const STORY_TRAIT_STARTING_COUNT = { min: 2, max: 5 }
```

**Commit:** `feat: add gameplay and story trait type definitions`

---

### Task 11: Create Hero Types

**Files:** `types/hero.ts`

```typescript
import type {
  Rarity, Stats, Archetype, Culture, Gender, EquipmentSlot
} from './base'
import type { ArchetypeTag } from './archetypes'
import type { HeroGameplayTrait, StoryTrait } from './traits'
import type { MoraleState } from './morale'

// Hero definition
export interface Hero {
  id: string

  // Identity
  name: string
  gender: Gender
  culture: Culture
  titles: string[]         // Earned titles
  displayTitle: string | null  // Currently displayed title

  // Classification
  rarity: Rarity
  archetype: Archetype
  archetypeTags: ArchetypeTag[]

  // Stats
  baseStats: Stats
  level: number
  xp: number
  xpToNextLevel: number

  // Traits
  gameplayTraits: HeroGameplayTrait[]
  storyTraitIds: string[]

  // Calculated power (cached)
  power: number

  // Equipment (slot -> equipment id)
  equipment: Partial<Record<EquipmentSlot, string>>

  // Prestige
  prestigeLevel: number
  prestigeBonuses: Stats  // Permanent stat bonuses from prestige

  // Morale tracking
  morale: MoraleState
  moraleLastUpdate: string

  // Active status
  isOnExpedition: boolean
  isStationed: boolean
  stationedZoneId: string | null
  currentExpeditionId: string | null

  // State
  isFavorite: boolean

  // Timestamps
  createdAt: string
  updatedAt: string
}

// The Guild Master (player's character) - different from regular heroes
export interface GuildMaster {
  id: string

  // Identity (set by player)
  name: string
  gender: Gender

  // Always legendary
  rarity: 'legendary'

  // Player chooses archetype at milestones
  archetype: Archetype | null
  archetypeTags: ArchetypeTag[]

  // Stats (scales with account progress)
  baseStats: Stats
  level: number

  // Equippable traits (swappable)
  equippedTraitIds: string[]
  maxEquippedTraits: number

  // Unlocked traits (pool to equip from)
  unlockedTraitIds: string[]

  // Unique properties
  leaderBonus: number      // % buff to party when leading
  mentorBonus: number      // % XP boost to party members

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Tavern hero (available for recruitment)
export interface TavernHero extends Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt' | 'isOnExpedition' | 'isStationed' | 'stationedZoneId' | 'morale' | 'moraleLastUpdate'> {
  recruitCost: number
  isLocked: boolean
  expiresAt: string  // When this hero leaves the tavern
}

// Hero generation input
export interface HeroGenerationOptions {
  forceRarity?: Rarity
  forceArchetype?: Archetype
  forceCulture?: Culture
  forceGender?: Gender
}
```

**Commit:** `feat: add hero and guild master type definitions`

---

### Task 12: Create Recruitment Types

**Files:** `types/recruitment.ts`

```typescript
import type { Rarity } from './base'
import type { Hero } from './hero'

// Tavern slot (one hero available for recruitment)
export interface TavernSlot {
  index: number
  hero: Hero | null
  rarity: Rarity
  isLocked: boolean
  lockedUntil?: string // ISO timestamp
}

// Tavern state (all available slots)
export interface Tavern {
  slots: TavernSlot[]
  lastRefresh: string // ISO timestamp
  refreshCost: number // Gold cost to refresh
  lockCost: number    // Gold cost to lock a slot
}

// Tavern state
export interface TavernState {
  slots: TavernSlot[]
  lockSlots: number         // How many heroes can be locked
  usedLockSlots: number
  lastRefreshAt: string
  nextRefreshAt: string
}

// Tavern progression (unlocks with account level)
export const TAVERN_PROGRESSION: Record<number, {
  slots: Array<{ rarity: Rarity | 'epic_plus' }>
  lockSlots: number
}> = {
  // Account level -> tavern configuration
  1: {
    slots: [
      { rarity: 'common' },
      { rarity: 'common' },
      { rarity: 'uncommon' },
    ],
    lockSlots: 1,
  },
  5: {
    slots: [
      { rarity: 'common' },
      { rarity: 'common' },
      { rarity: 'uncommon' },
      { rarity: 'uncommon' },
    ],
    lockSlots: 1,
  },
  10: {
    slots: [
      { rarity: 'common' },
      { rarity: 'common' },
      { rarity: 'uncommon' },
      { rarity: 'uncommon' },
      { rarity: 'rare' },
    ],
    lockSlots: 2,
  },
  20: {
    slots: [
      { rarity: 'common' },
      { rarity: 'common' },
      { rarity: 'uncommon' },
      { rarity: 'uncommon' },
      { rarity: 'rare' },
      { rarity: 'rare' },
    ],
    lockSlots: 2,
  },
  30: {
    slots: [
      { rarity: 'common' },
      { rarity: 'common' },
      { rarity: 'uncommon' },
      { rarity: 'uncommon' },
      { rarity: 'rare' },
      { rarity: 'rare' },
      { rarity: 'epic_plus' },
    ],
    lockSlots: 3,
  },
}

// Recruitment costs by rarity
export const RECRUITMENT_COSTS: Record<Rarity, number> = {
  common: 100,
  uncommon: 250,
  rare: 500,
  epic: 1000,
  legendary: 5000,
}

// Refresh timing
export const TAVERN_REFRESH_HOURS = 8

// Recruitment request
export interface RecruitmentRequest {
  slotIndex: number
  lockSlot?: boolean
}
```

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
    questComplete?: string
  }

  // Content
  subzones: Subzone[]

  // Rewards for mastery
  masteryRewards: {
    title?: string
    passiveIncomeBonus: number
  }

  // Progress
  familiarity: number
  isUnlocked: boolean
  isMastered: boolean
}

// Zone Familiarity Benefits
export const ZONE_FAMILIARITY_BENEFITS = {
  25: { unlockSubzone: 2, passiveIncome: 5 },
  50: { unlockSubzone: 3, passiveIncome: 10, rareEvents: true },
  75: { unlockSubzone: 4, passiveIncome: 15 },
  100: { mastered: true, passiveIncome: 20, title: true },
}

// Subzone Mastery Benefits
export const SUBZONE_MASTERY_BENEFITS = {
  33: { improvedLoot: true },
  66: { rareSpawnChance: 10 },
  100: { mastered: true, collectibleCompletion: true },
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
  monsters: MonsterSpawn[]
  collectibles: Collectible[]
  lootTable: LootTableEntry[]
}

export interface LootTableEntry {
  itemId: string
  itemType: 'equipment' | 'material' | 'collectible'
  weight: number
  minTier?: number  // Difficulty tier requirement
  maxTier?: number
}

export interface MonsterLootEntry {
  itemId: string
  itemType: 'equipment' | 'material'
  weight: number
  dropChance: number

  // Rewards
  bonusXpPercent: number
  bonusGoldPercent: number
  baseDuration: number // minutes
  baseGold: number
  baseXp: number

  // Progress
  mastery: number
}

export interface Collectible {
  id: string
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare'
  type: 'trophy' | 'material' | 'both'
  craftingUse?: string
  dropChance: number
  requiresMastery: number
}
```

**Commit:** `feat: add zone and subzone type definitions`

---

### Task 14: Create Expedition Types

**Files:** `types/expedition.ts`

```typescript
import type { ExpeditionStatus } from './base'

// Expedition status
export type ExpeditionStatus = 'idle' | 'in_progress' | 'completed' | 'failed'

// Expedition definition
export interface Expedition {
  id: string
  playerId: string

  // Location
  zoneId: string
  subzoneId: string

  // Party
  heroIds: string[]
  teamPower: number  // Calculated total power of party

  // Timing
  startedAt: string      // ISO timestamp
  completesAt: string    // ISO timestamp
  durationMinutes: number
  status: ExpeditionStatus

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

  // Results (populated on completion)
  efficiency?: number  // Calculated efficiency (60-150%)
  rewards?: ExpeditionRewards
  log?: ExpeditionLog

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Expedition rewards
export interface ExpeditionRewards {
  gold: number
  xp: number
  equipment: string[] // Equipment IDs
  materials: Record<string, number> // Material type -> quantity
  familiarityGain: number
  masteryGain: number
}

// Expedition event types
export type ExpeditionEventType = 
  | 'flavor' 
  | 'skill_check' 
  | 'choice' 
  | 'rare' 
  | 'story_hook' 
  | 'injury'

export interface ExpeditionEvent {
  id: string
  type: ExpeditionEventType
  timestamp: string // ISO timestamp
  
  // Event-specific data
  data: {
    // Flavor
    text?: string
    
    // Skill check
    stat?: 'combat' | 'utility' | 'survival'
    difficulty?: number
    passed?: boolean
    
    // Choice
    prompt?: string
    options?: ChoiceOption[]
    selectedOption?: number
    
    // Rare
    rarity?: string
    reward?: any
    
    // Story hook
    hookId?: string
    unlocked?: string[]
    
    // Injury
    heroId?: string
    severity?: 'minor' | 'major' | 'severe'
    
    // Story hook
    hookId?: string
    hookProgress?: StoryHookProgress
  }
}

// Story Hook
export interface StoryHook {
  id: string
  name: string
  type: 'immediate' | 'collection' | 'delayed' | 'conditional'
  triggeredBy: string
  triggeredHeroId: string
  progress: StoryHookProgress
  completion: StoryHookReward
}

export type StoryHookProgress =
  | { type: 'immediate', ready: true }
  | { type: 'collection', current: number, required: number, itemName: string }
  | { type: 'delayed', expeditionsRemaining: number }
  | { type: 'conditional', condition: string, met: boolean }

export interface StoryHookReward {
  unlockSubzone?: string
  unlockMonster?: string
  grantTitle?: string
  grantStoryTrait?: string
  grantEquipment?: string
  grantGold?: number
  specialText: string
}

// Hero Injury
export interface HeroInjury {
  heroId: string
  type: 'sprain' | 'poison' | 'curse' | 'exhaustion'
  statPenalty: Partial<Stats>
  expiresAfterExpeditions: number  // Heals after X resting
  cureCost?: {
    gold?: number
    healerTag?: boolean  // Party member with Healer can cure
  }
}

// Injury Types:

| Type | Penalty | Heals After | Cure Cost |
|------|---------|-------------|-----------|
| Sprain | -3 Combat | 2 expeditions | 50 gold |
| Poison | -3 Survival | 3 expeditions | Cleanse tag or 75 gold |
| Curse | -2 all stats | 5 expeditions | Decurse tag or 150 gold |
| Exhaustion | -5 Utility | 1 expedition | Rest only |

// Pending Loot
export interface PendingLoot {
  expeditionId: string
  items: Equipment[]
  expiresAt: string    // 48 hours to claim
}

// Expedition Settings
export interface ExpeditionSettings {
  autoRepeat: boolean
  autoRepeatLimit?: number    // Max repeats (null = unlimited)
  stopConditions: {
    anyHeroTired: boolean     // Stop if any hero hits Tired
    inventoryFull: boolean    // Stop if inventory full
    resourceCap: boolean      // Stop if gold cap reached
  }
}

export interface ChoiceOption {
  id: number
  text: string
  outcome: string
}

// Expedition log (generated on completion)
export interface ExpeditionLog {
  summary: {
    duration: string
    efficiency: string
    rewards: {
      gold: number
      xp: number
      itemCount: number
      rareItems: string[]
      familiarityGain: number
      masteryGain: number
    }
  }
  sections: LogSection[]
}

export interface LogSection {
  type: 'departure' | 'travel' | 'encounter' | 'discovery' | 'return'
  title: string
  entries: LogEntry[]
}

export interface LogEntry {
  text: string
  heroId?: string
  traitId?: string
  eventId?: string
  type: 'narrative' | 'reaction' | 'combat' | 'loot' | 'choice_result'
}
```

**Commit:** `feat: add expedition type definitions`

---

### Task 15: Create Equipment Types

**Files:** `types/equipment.ts`

```typescript
import type { EquipmentSlot, EquipmentRarity, Stats } from './base'

// Equipment item
export interface Equipment {
  id: string
  playerId: string

  // Identity
  name: string
  description: string
  slot: EquipmentSlot
  rarity: EquipmentRarity

  // Stats
  baseStats: Stats
  itemLevel: number
  gearScore: number

  // Traits
  traits: EquipmentTrait[]
  maxTraits: number

  // Set
  setId?: string
  setName?: string

  // State
  isEquipped: boolean
  equippedBy?: string // Hero ID

  // Source tracking (for loot tables)
  sourceZoneId?: string
  sourceSubzoneId?: string

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Equipment trait
export interface EquipmentTrait {
  traitId: string
  quality: TraitQuality
  rolledValue: number
}

// Equipment set
export interface EquipmentSet {
  id: string
  name: string
  description: string
  pieces: string[]  // Equipment slot IDs
  bonuses: SetBonus[]
  biome?: ZoneType
  sourceZone?: string
}

export interface SetBonus {
  requiredPieces: number  // 2, 4, or 6
  grantedTraits: SetBonusTrait[]
}

export interface SetBonusTrait {
  traitId: string
  quality: TraitQuality
  fixedValue: number  // Sets have fixed values
}

// Slot stat tendencies
export const SLOT_STAT_TENDENCIES = {
  weapon: { primary: 'combat', secondary: 'utility', rare: 'survival' },
  armor: { primary: 'survival', secondary: 'combat', rare: 'utility' },
  helmet: { primary: 'survival', secondary: 'utility', rare: 'combat' },
  boots: { primary: 'utility', secondary: 'survival', rare: 'combat' },
  accessory1: { primary: 'any', secondary: null, rare: null },
  accessory2: { primary: 'any', secondary: null, rare: null },
}

// Trait slots by rarity
export const TRAIT_SLOTS_BY_RARITY: Record<EquipmentRarity, { min: number; max: number; qualityWeights: Record<TraitQuality, number> }> = {
  common: { min: 0, max: 0, qualityWeights: {} },
  uncommon: { min: 0, max: 1, qualityWeights: { normal: 1.0, magic: 0, perfect: 0 } },
  rare: { min: 1, max: 1, qualityWeights: { normal: 0.7, magic: 0.3, perfect: 0 } },
  epic: { min: 1, max: 2, qualityWeights: { normal: 0.4, magic: 0.5, perfect: 0.1 } },
  legendary: { min: 2, max: 2, qualityWeights: { normal: 0.2, magic: 0.6, perfect: 0.2 } },
  mythic: { min: 2, max: 3, qualityWeights: { normal: 0.1, magic: 0.4, perfect: 0.5 } },
}

// Gear score formula
export function calculateGearScore(equipment: Equipment): number {
  const rarityMultiplier = {
    common: 1.0,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2.0,
    legendary: 2.5,
    mythic: 3.0,
  }[equipment.rarity]

  const baseScore = equipment.itemLevel * rarityMultiplier
  const statScore = equipment.baseStats.combat + equipment.baseStats.utility + equipment.baseStats.survival
  const traitScore = equipment.traits.reduce((sum, t) => sum + t.rolledValue, 0)

  return Math.round(baseScore + statScore + traitScore)
}
```

**Commit:** `feat: add equipment type definitions`

---

### Task 16: Create Additional Types

**Files:** `types/monsters.ts`, `types/titles.ts`, `types/morale.ts`, `types/presets.ts`

**Monsters (`types/monsters.ts`):**

```typescript
export interface Monster {
  id: string
  baseName: string           // "Slime"
  family: string             // "Ooze"
  packType: 'trash' | 'elite' | 'miniboss' | 'boss'
  biome: ZoneType            // For dungeon synergy (Phase 2)
  basePower: number
  baseCaptureChance: number
  lootTable: MonsterLootEntry[]
}

export interface MonsterSpawn {
  monsterId: string
  spawnType: 'common' | 'uncommon' | 'rare' | 'boss'
  baseSpawnChance: number
  requiredMastery: number
  baseCaptureChance: number
  threatContribution: string[]
  power: number
}

export interface MonsterPack {
  monsters: Monster[]
  totalThreats: string[]
}
```

**Titles (`types/titles.ts`):**

```typescript
export interface Title {
  id: string
  name: string              // "the Dragonslayer"
  rarity: 'uncommon' | 'rare' | 'epic' | 'legendary'
  source: 'zone_mastery' | 'achievement' | 'story_trait' | 'difficulty' | 'secret'
  condition: TitleCondition
  bonus?: {
    stat?: StatType
    value?: number
    context?: string  // "in forest zones"
    description: string
  }
}

export interface TitleCondition {
  type: 'zone_completion' | 'monster_kills' | 'monster_captures' |
        'difficulty_clear' | 'story_trait' | 'prestige' | 'secret'
  target?: string
  count?: number
}

export interface EarnedTitle {
  id: string
  titleId: string
  heroId?: string // If hero-specific
  earnedAt: string
}
```

**Morale (`types/morale.ts`):**

```typescript
import type { MoraleState } from './base'

export interface HeroMorale {
  current: number           // 0-100
  state: MoraleState
  lastExpeditionAt: string
  consecutiveExpeditions: number
}

export type MoraleState = 'excited' | 'content' | 'tired' | 'frustrated' | 'exhausted'

// Morale thresholds
export const MORALE_THRESHOLDS = {
  excited: { min: 80, max: 100 },
  content: { min: 50, max: 79 },
  tired: { min: 30, max: 49 },
  frustrated: { min: 15, max: 29 },
  exhausted: { min: 0, max: 14 },
}

// Morale changes by action
export const MORALE_CHANGES = {
  completeExpedition: { min: -15, max: -5 }, // Based on duration
  rest: 5, // Per hour
  bigLootDrop: 10,
  discoverSubzone: 15,
  counterThreat: 5,
  failedThreat: -10,
  levelUp: 20,
  expeditionWithFavoriteAlly: 5,
  sameZone3Times: -10, // Bored
}

export function getMoraleState(moraleValue: number): MoraleState {
  if (moraleValue >= 80) return 'excited'
  if (moraleValue >= 60) return 'content'
  if (moraleValue >= 40) return 'tired'
  if (moraleValue >= 20) return 'frustrated'
  return 'exhausted'
}
```

**Presets (`types/presets.ts`):**

```typescript
export interface PartyPreset {
  id: string
  playerId: string
  name: string
  heroIds: string[] // Max 4 heroes
  createdAt: string
}
```

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

**Full SQL Schema:**

Create PostgreSQL schema with tables for:
- `players` - Player account data (id, user_id, gold, account_level, tavern state)
- `heroes` - Hero data (id, name, stats, level, xp, traits, equipment, prestige, morale, status)
- `guild_masters` - Player character (id, player_id, name, stats, archetype, traits, bonuses)
- `zones` - Zone definitions (id, name, type, unlock_requirement, familiarity, is_unlocked, is_mastered)
- `subzones` - Subzone definitions (id, zone_id, name, difficulty, threats, discovery_weight, mastery)
- `equipment` - Equipment items (id, player_id, name, slot, rarity, stats, item_level, traits, set_id)
- `expeditions` - Active/completed expeditions (id, player_id, zone_id, subzone_id, hero_ids, started_at, completes_at, status, auto_repeat, events, rewards, log)
- `tavern_heroes` - Tavern recruitment heroes (id, player_id, slot_index, hero data, recruit_cost, is_locked, expires_at)
- `party_presets` - Saved party compositions (id, player_id, name, hero_ids)
- `titles` - Earned titles (id, player_id, hero_id, title_id, earned_at)

**Example SQL structure:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gold INTEGER NOT NULL DEFAULT 100,
  account_level INTEGER NOT NULL DEFAULT 1,
  tavern_last_refresh TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Heroes table
CREATE TABLE heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  culture TEXT NOT NULL,
  rarity TEXT NOT NULL,
  archetype TEXT NOT NULL,
  archetype_tags TEXT[] NOT NULL,
  base_stats JSONB NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  gameplay_traits JSONB NOT NULL DEFAULT '[]',
  story_trait_ids TEXT[] NOT NULL DEFAULT '{}',
  power INTEGER NOT NULL DEFAULT 0,
  equipment JSONB NOT NULL DEFAULT '{}',
  prestige_level INTEGER NOT NULL DEFAULT 0,
  prestige_bonuses JSONB NOT NULL DEFAULT '{"combat": 0, "utility": 0, "survival": 0}',
  current_expedition_id UUID,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guild Master table (one per player)
CREATE TABLE guild_masters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  archetype TEXT,
  archetype_tags TEXT[] NOT NULL DEFAULT '{}',
  base_stats JSONB NOT NULL DEFAULT '{"combat": 10, "utility": 10, "survival": 10}',
  equipped_trait_ids TEXT[] NOT NULL DEFAULT '{}',
  max_equipped_traits INTEGER NOT NULL DEFAULT 2,
  unlocked_trait_ids TEXT[] NOT NULL DEFAULT '{}',
  leader_bonus INTEGER NOT NULL DEFAULT 5,
  mentor_bonus INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tavern heroes (available for recruitment)
CREATE TABLE tavern_heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  slot_index INTEGER NOT NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  culture TEXT NOT NULL,
  rarity TEXT NOT NULL,
  archetype TEXT NOT NULL,
  archetype_tags TEXT[] NOT NULL,
  base_stats JSONB NOT NULL,
  gameplay_traits JSONB NOT NULL DEFAULT '[]',
  story_trait_ids TEXT[] NOT NULL DEFAULT '{}',
  power INTEGER NOT NULL DEFAULT 0,
  recruit_cost INTEGER NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(player_id, slot_index)
);

-- Party presets
CREATE TABLE party_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hero_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Equipment table
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slot TEXT NOT NULL,
  rarity TEXT NOT NULL,
  item_level INTEGER NOT NULL,
  stats JSONB NOT NULL,
  gear_score INTEGER NOT NULL,
  traits JSONB NOT NULL DEFAULT '[]',
  set_id TEXT,
  source_zone_id TEXT,
  source_subzone_id TEXT,
  equipped_hero_id UUID REFERENCES heroes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expeditions table
CREATE TABLE expeditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  subzone_id TEXT NOT NULL,
  hero_ids UUID[] NOT NULL,
  team_power INTEGER NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completes_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  auto_repeat BOOLEAN NOT NULL DEFAULT FALSE,
  auto_repeat_limit INTEGER,
  stop_conditions JSONB NOT NULL DEFAULT '{}',
  events JSONB NOT NULL DEFAULT '[]',
  pending_choices JSONB NOT NULL DEFAULT '[]',
  efficiency REAL,
  rewards JSONB,
  log JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Zones table (player progress)
CREATE TABLE zone_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  familiarity INTEGER NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
  discovered_subzones TEXT[] NOT NULL DEFAULT '{}',
  UNIQUE(player_id, zone_id)
);

-- Subzone progress
CREATE TABLE subzone_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  subzone_id TEXT NOT NULL,
  mastery INTEGER NOT NULL DEFAULT 0,
  UNIQUE(player_id, zone_id, subzone_id)
);

-- Titles (earned)
CREATE TABLE earned_titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  hero_id UUID REFERENCES heroes(id) ON DELETE CASCADE,
  title_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_heroes_player ON heroes(player_id);
CREATE INDEX idx_heroes_expedition ON heroes(current_expedition_id);
CREATE INDEX idx_equipment_player ON equipment(player_id);
CREATE INDEX idx_equipment_hero ON equipment(equipped_hero_id);
CREATE INDEX idx_tavern_player ON tavern_heroes(player_id);
CREATE INDEX idx_expeditions_player ON expeditions(player_id);
CREATE INDEX idx_expeditions_status ON expeditions(status);
CREATE INDEX idx_zone_progress_player ON zone_progress(player_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER heroes_updated_at
  BEFORE UPDATE ON heroes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER guild_masters_updated_at
  BEFORE UPDATE ON guild_masters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER expeditions_updated_at
  BEFORE UPDATE ON expeditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Row Level Security (RLS) Policies:**

Enable RLS on all tables and create policies to ensure players can only access their own data:

```sql
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavern_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subzone_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE earned_titles ENABLE ROW LEVEL SECURITY;

-- Example policy for heroes (apply similar pattern to all tables)
CREATE POLICY "Users can view own heroes"
  ON heroes FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own heroes"
  ON heroes FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own heroes"
  ON heroes FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));
```

Use Supabase Row Level Security (RLS) policies to ensure players can only access their own data.

**Commit:** `feat: add initial database schema`

---

## Phase 1.1: Hero System

### Task 19: Create Name Data

**Files:** `app/data/names.ts`

Create data structure with name pools by culture and gender:

```typescript
import type { Culture, Gender } from '~~/types'

// Name pools by gender
export const FIRST_NAMES: Record<Gender, string[]> = {
  male: [
    // Classic fantasy
    'Aldric', 'Brom', 'Cedric', 'Dorian', 'Erik', 'Gareth', 'Hadrian', 'Leoric',
    'Marcus', 'Nolan', 'Orion', 'Roland', 'Theron', 'Victor', 'William',
    // Rustic
    'Bart', 'Finn', 'Gus', 'Hob', 'Jasper', 'Milo', 'Ned', 'Pip', 'Rolf', 'Tom',
    // Exotic
    'Azim', 'Dax', 'Kael', 'Orin', 'Thane', 'Vex', 'Zephyr',
    // Silly-adjacent
    'Bob', 'Greg', 'Kevin', 'Steve', 'Todd', 'Dave', 'Frank',
  ],
  female: [
    // Classic fantasy
    'Alara', 'Brynn', 'Celia', 'Elira', 'Freya', 'Helena', 'Lyra', 'Sera',
    'Astrid', 'Diana', 'Iris', 'Luna', 'Maya', 'Nora', 'Vera',
    // Rustic
    'Ada', 'Bess', 'Cora', 'Dottie', 'Effie', 'Greta', 'Mabel', 'Nell', 'Tilly', 'Wren',
    // Exotic
    'Ishara', 'Kira', 'Nyx', 'Riven', 'Sable', 'Vela', 'Zara',
    // Silly-adjacent
    'Barb', 'Brenda', 'Linda', 'Pam', 'Susan', 'Carol', 'Janet',
  ],
  nonbinary: [
    // Gender-neutral names
    'Ash', 'Blake', 'Casey', 'Drew', 'Ellis', 'Finley', 'Gray', 'Haven',
    'Indigo', 'Jordan', 'Kerry', 'Lane', 'Morgan', 'Nico', 'Phoenix',
    'Quinn', 'Reese', 'Sage', 'Taylor', 'Val', 'Winter', 'Wren',
  ],
}

// Culture-specific name weights (some names feel more "right" for certain cultures)
export const CULTURE_NAME_PREFERENCES: Record<Culture, Partial<Record<Gender, string[]>>> = {
  northfolk: {
    male: ['Brom', 'Erik', 'Finn', 'Gareth', 'Hadrian', 'Rolf', 'Thane', 'Theron'],
    female: ['Astrid', 'Brynn', 'Freya', 'Greta', 'Helga', 'Ingrid', 'Sigrid'],
  },
  coastborn: {
    male: ['Dorian', 'Marcus', 'Nolan', 'Orion', 'Victor', 'Bart', 'Jasper'],
    female: ['Celia', 'Diana', 'Helena', 'Iris', 'Luna', 'Marina', 'Vera'],
  },
  woodwalkers: {
    male: ['Aldric', 'Finn', 'Kael', 'Milo', 'Orin', 'Pip', 'Zephyr'],
    female: ['Alara', 'Elira', 'Lyra', 'Nyx', 'Sera', 'Vela', 'Wren'],
  },
  crownlanders: {
    male: ['Cedric', 'Dorian', 'Leoric', 'Roland', 'Victor', 'William', 'Bob', 'Greg'],
    female: ['Celia', 'Diana', 'Helena', 'Nora', 'Vera', 'Ada', 'Susan'],
  },
}

// Get a random name, optionally weighted by culture
export function getRandomName(gender: Gender, culture?: Culture): string {
  // 50% chance to use culture-preferred name if available
  if (culture && Math.random() < 0.5) {
    const preferred = CULTURE_NAME_PREFERENCES[culture][gender]
    if (preferred && preferred.length > 0) {
      return preferred[Math.floor(Math.random() * preferred.length)]
    }
  }

  const names = FIRST_NAMES[gender]
  return names[Math.floor(Math.random() * names.length)]
}
```

**Commit:** `feat: add hero name data with culture preferences`

---

### Task 20: Create Gameplay Trait Data

**Files:** `app/data/gameplayTraits.ts`

Create data structure with gameplay traits following the `GameplayTrait` interface from `types/traits.ts`. Include:

- **Stat bonus traits** - Flat increases to combat/utility/survival
- **Conditional bonus traits** - Bonuses in specific zones, expedition lengths, etc.
- **Loot bonus traits** - Increased gold, rare drops, materials, XP
- **Expedition bonus traits** - Speed, event chance, efficiency improvements
- **Trade-off traits** - Positive and negative stat combinations

Each trait should have:
- Unique ID
- Name and description (with `{value}` placeholder)
- Effect type and details
- Min/max value ranges
- Optional story reactions for expedition logs

**Example traits:**

```typescript
brawny: {
  id: 'brawny',
  name: 'Brawny',
  description: '+{value}% Combat',
  effect: 'stat_bonus',
  isNegative: false,
  minValue: 5,
  maxValue: 15,
  statBonus: { stat: 'combat', isPercent: true },
  reactions: {
    onCombat: [
      '{hero} flexed menacingly at the enemy.',
      '{hero} cracked their knuckles before the fight.',
    ],
  },
},
cave_dweller: {
  id: 'cave_dweller',
  name: 'Cave Dweller',
  description: '+{value}% all stats in underground zones',
  effect: 'conditional_bonus',
  isNegative: false,
  minValue: 10,
  maxValue: 25,
  conditionalBonus: {
    condition: 'zone_type',
    conditionValue: 'cave',
    allStats: true,
  },
},
lucky: {
  id: 'lucky',
  name: 'Lucky',
  description: '+{value}% rare drop chance',
  effect: 'loot_bonus',
  isNegative: false,
  minValue: 5,
  maxValue: 15,
  lootBonus: { type: 'rare_drops' },
},
clumsy: {
  id: 'clumsy',
  name: 'Clumsy',
  description: '-{value}% Utility',
  effect: 'stat_bonus',
  isNegative: true,
  minValue: 3,
  maxValue: 10,
  statBonus: { stat: 'utility', isPercent: true },
},
```

Include helper functions:
- `getGameplayTraitById(id: string): GameplayTrait | undefined`
- `getPositiveGameplayTraits(): GameplayTrait[]`
- `getNegativeGameplayTraits(): GameplayTrait[]`

Include 30-50 gameplay traits total, with mix of positive and negative traits.

**Commit:** `feat: add gameplay trait data with effects and reactions`

---

### Task 21: Create Story Trait Data

**Files:** `app/data/storyTraits.ts`

Create data structure with story traits following the `StoryTrait` interface from `types/traits.ts`. Include:

- **Generation traits** - Starting personality traits
- **Expedition traits** - Earned from expedition events
- **Event traits** - From special encounters
- **Milestone traits** - From level/achievement milestones
- **Curse traits** - Negative story traits

Each trait should have:
- Unique ID
- Name and description
- Source type
- Reactions arrays for: onCombat, onLoot, onEvent, onZoneType, onPartyMember
- Optional title grant

**Example traits:**

```typescript
cheese_obsessed: {
  id: 'cheese_obsessed',
  name: 'Cheese Obsessed',
  description: 'Has an inexplicable fixation on cheese',
  source: 'generation',
  reactions: {
    onLoot: [
      '{hero} checked every container for cheese.',
      '{hero} was disappointed by the lack of cheese.',
    ],
    onEvent: [
      '{hero} asked if there was cheese involved.',
      '{hero} suggested cheese as a solution.',
    ],
  },
  grantsTitle: 'the Cheese-Seeker',
},
chronic_napper: {
  id: 'chronic_napper',
  name: 'Chronic Napper',
  description: 'Falls asleep at the worst times',
  source: 'generation',
  reactions: {
    onCombat: [
      '{hero} yawned mid-battle.',
      '{hero} almost dozed off between swings.',
    ],
    onEvent: [
      '{hero} napped while others kept watch.',
      '{hero} had to be woken up. Again.',
    ],
  },
},
afraid_of_heights: {
  id: 'afraid_of_heights',
  name: 'Afraid of Heights',
  description: 'Terrified of high places',
  source: 'generation',
  reactions: {
    onZoneType: {
      mountain: [
        '{hero} crawled along cliff edges.',
        '{hero} refused to look down.',
      ],
    },
    onEvent: [
      '{hero} clung to the wall on the bridge.',
      '{hero} took the stairs instead of climbing.',
    ],
  },
},
```

Include helper functions:
- `getStoryTraitById(id: string): StoryTrait | undefined`
- `getGenerationStoryTraits(): StoryTrait[]`
- `getEventStoryTraits(): StoryTrait[]`

Include 50-100 story traits total. Reactions should be flavor text strings that can be injected into expedition logs.

**Commit:** `feat: add story trait data with reactions and titles`

---

### Task 22: Create Culture Data

**Files:** `app/data/cultures.ts`

Create data structure with culture information:

```typescript
import type { Culture, ZoneType } from '~~/types'

export interface CultureInfo {
  id: Culture
  name: string
  description: string
  preferredStoryTraits: string[] // More likely to roll these
  flavorTexts: {
    homesick: string[]
    comfortable: string[]
  }
}

export const CULTURES: Record<Culture, CultureInfo> = {
  northfolk: {
    id: 'northfolk',
    name: 'Northfolk',
    description: 'Hardy mountain and tundra dwellers, known for their resilience and blunt honesty.',
    preferredStoryTraits: ['chronic_napper', 'rock_collector', 'superstitious'],
    flavorTexts: {
      homesick: [
        '{hero} missed the cold mountain air.',
        '{hero} complained about the heat.',
        '{hero} longed for proper ale.',
      ],
      comfortable: [
        '{hero} felt at home in the cold.',
        '{hero} recognized the mountain paths.',
      ],
    },
  },
  coastborn: {
    id: 'coastborn',
    name: 'Coastborn',
    description: 'Seafaring island traders, superstitious and shrewd negotiators.',
    preferredStoryTraits: ['superstitious', 'compulsive_counter', 'terrible_singer'],
    flavorTexts: {
      homesick: [
        '{hero} missed the sound of waves.',
        '{hero} kept looking for the horizon.',
        '{hero} complained the air was too dry.',
      ],
      comfortable: [
        '{hero} recognized the tide patterns.',
        '{hero} felt the sea breeze and smiled.',
      ],
    },
  },
  woodwalkers: {
    id: 'woodwalkers',
    name: 'Woodwalkers',
    description: 'Forest-dwelling naturalists who commune with nature and distrust cities.',
    preferredStoryTraits: ['amateur_botanist', 'bug_phobia', 'cheese_obsessed'],
    flavorTexts: {
      homesick: [
        '{hero} missed the forest canopy.',
        '{hero} felt exposed without trees.',
        '{hero} talked to a plant out of habit.',
      ],
      comfortable: [
        '{hero} recognized these woods.',
        '{hero} moved silently through the trees.',
      ],
    },
  },
  crownlanders: {
    id: 'crownlanders',
    name: 'Crownlanders',
    description: 'Urban city-state citizens, well-educated but sometimes snobbish about the "wilds".',
    preferredStoryTraits: ['overly_dramatic', 'compulsive_counter', 'wannabe_chef'],
    flavorTexts: {
      homesick: [
        '{hero} missed proper civilization.',
        '{hero} complained about the lack of roads.',
        '{hero} longed for a proper bed.',
      ],
      comfortable: [
        '{hero} recognized the architecture.',
        '{hero} knew the local customs.',
      ],
    },
  },
}

// Get culture info
export function getCultureInfo(culture: Culture): CultureInfo {
  return CULTURES[culture]
}

// Random culture selection
export function getRandomCulture(): Culture {
  const cultures = Object.keys(CULTURES) as Culture[]
  return cultures[Math.floor(Math.random() * cultures.length)]
}
```

**Commit:** `feat: add culture data with flavor texts`

---

### Task 23: Create Hero Generator

**Files:** `app/utils/heroGenerator.ts`, `tests/utils/heroGenerator.test.ts`

Implement hero generation function that:

1. **Rolls rarity** - Uses `RARITY_WEIGHTS` from `types/base.ts`
2. **Selects archetype** - Random from all 6 archetypes
3. **Generates identity** - Random name (culture-weighted), gender, culture
4. **Distributes stats** - Uses `ARCHETYPE_STAT_WEIGHTS` and `STAT_POINTS_BY_RARITY`
5. **Selects archetype tags** - Random from archetype's tag pool, count based on rarity
6. **Rolls gameplay traits** - Count based on rarity, quality based on rarity
7. **Selects story traits** - 2-5 random story traits
8. **Calculates initial power** - Uses power calculator
9. **Sets initial state** - Level 1, no XP, no equipment, no prestige

Function signature:
```typescript
export function generateHero(options?: HeroGenerationOptions): Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt' | 'isOnExpedition' | 'isStationed' | 'stationedZoneId' | 'morale' | 'moraleLastUpdate'>

export function generateTavernHero(slotRarity: Rarity | 'epic_plus'): TavernHero
```

**Full implementation:**

```typescript
import { v4 as uuid } from 'uuid'
import type {
  Hero,
  TavernHero,
  Rarity,
  Stats,
  Archetype,
  Culture,
  Gender,
  HeroGameplayTrait,
  TraitQuality,
  HeroGenerationOptions,
} from '~~/types'
import {
  RARITY_WEIGHTS,
  STAT_POINTS_BY_RARITY,
  ARCHETYPE_STAT_WEIGHTS,
  QUALITY_MULTIPLIERS,
} from '~~/types/base'
import { ARCHETYPE_TAG_POOLS, TAG_COUNT_BY_RARITY } from '~~/types/archetypes'
import { GAMEPLAY_TRAIT_COUNT, STORY_TRAIT_STARTING_COUNT } from '~~/types/traits'
import { RECRUITMENT_COSTS, TAVERN_REFRESH_HOURS } from '~~/types/recruitment'
import { getRandomName } from '~/data/names'
import { getPositiveGameplayTraits, getNegativeGameplayTraits } from '~/data/gameplayTraits'
import { getGenerationStoryTraits } from '~/data/storyTraits'
import { getRandomCulture } from '~/data/cultures'

// Weighted random selection
function weightedRandom<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][]
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let random = Math.random() * total

  for (const [key, weight] of entries) {
    random -= weight
    if (random <= 0) return key
  }

  return entries[0][0]
}

// Random array element
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Random elements without replacement
function randomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, arr.length))
}

// Random int in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate rarity
function generateRarity(): Rarity {
  return weightedRandom(RARITY_WEIGHTS)
}

// Generate archetype
function generateArchetype(): Archetype {
  const archetypes: Archetype[] = ['tank', 'healer', 'debuffer', 'melee_dps', 'ranged_dps', 'caster']
  return randomElement(archetypes)
}

// Generate gender
function generateGender(): Gender {
  const roll = Math.random()
  if (roll < 0.45) return 'male'
  if (roll < 0.90) return 'female'
  return 'nonbinary'
}

// Generate stats based on rarity and archetype
function generateStats(rarity: Rarity, archetype: Archetype): Stats {
  const totalPoints = STAT_POINTS_BY_RARITY[rarity]
  const weights = ARCHETYPE_STAT_WEIGHTS[archetype]

  // Add some variance (±20%)
  const variance = 0.2
  const combatWeight = weights.combat * (1 + (Math.random() - 0.5) * variance)
  const utilityWeight = weights.utility * (1 + (Math.random() - 0.5) * variance)
  const survivalWeight = weights.survival * (1 + (Math.random() - 0.5) * variance)

  // Normalize weights
  const totalWeight = combatWeight + utilityWeight + survivalWeight

  return {
    combat: Math.round(totalPoints * (combatWeight / totalWeight)),
    utility: Math.round(totalPoints * (utilityWeight / totalWeight)),
    survival: Math.round(totalPoints * (survivalWeight / totalWeight)),
  }
}

// Generate archetype tags
function generateArchetypeTags(archetype: Archetype, rarity: Rarity): string[] {
  const pool = ARCHETYPE_TAG_POOLS[archetype]
  const count = TAG_COUNT_BY_RARITY[rarity]
  return randomElements(pool, count)
}

// Generate quality
function generateQuality(): TraitQuality {
  const roll = Math.random()
  if (roll < 0.6) return 'normal'
  if (roll < 0.9) return 'magic'
  return 'perfect'
}

// Roll trait value based on quality
function rollTraitValue(minValue: number, maxValue: number, quality: TraitQuality): number {
  const multipliers = QUALITY_MULTIPLIERS[quality]
  const range = maxValue - minValue
  const qualityMin = minValue + range * multipliers.min
  const qualityMax = minValue + range * multipliers.max
  return Math.round(qualityMin + Math.random() * (qualityMax - qualityMin))
}

// Generate gameplay traits
function generateGameplayTraits(rarity: Rarity): HeroGameplayTrait[] {
  const config = GAMEPLAY_TRAIT_COUNT[rarity]
  const count = randomInt(config.min, config.max)

  const positiveTraits = getPositiveGameplayTraits()
  const negativeTraits = getNegativeGameplayTraits()

  const result: HeroGameplayTrait[] = []
  const usedIds = new Set<string>()

  // Mostly positive traits
  const positiveCount = Math.max(1, count - (Math.random() < 0.3 ? 1 : 0))

  for (let i = 0; i < positiveCount; i++) {
    const available = positiveTraits.filter(t => !usedIds.has(t.id))
    if (available.length === 0) break

    const trait = randomElement(available)
    const quality = generateQuality()

    result.push({
      traitId: trait.id,
      quality,
      rolledValue: rollTraitValue(trait.minValue, trait.maxValue, quality),
    })
    usedIds.add(trait.id)
  }

  // Maybe one negative trait
  if (count > positiveCount && Math.random() < 0.3) {
    const trait = randomElement(negativeTraits)
    const quality = generateQuality()

    result.push({
      traitId: trait.id,
      quality,
      rolledValue: rollTraitValue(trait.minValue, trait.maxValue, quality),
    })
  }

  return result
}

// Generate story traits
function generateStoryTraits(): string[] {
  const count = randomInt(STORY_TRAIT_STARTING_COUNT.min, STORY_TRAIT_STARTING_COUNT.max)
  const available = getGenerationStoryTraits()
  return randomElements(available, count).map(t => t.id)
}

// Calculate hero power
function calculatePower(stats: Stats, gameplayTraits: HeroGameplayTrait[]): number {
  // Base power from stats
  let power = stats.combat + stats.utility + stats.survival

  // Bonus from positive traits (simplified - use power calculator for full calculation)
  const positiveTraits = getPositiveGameplayTraits()
  power += gameplayTraits.filter(t => {
    // Filter out negative traits
    return positiveTraits.some(gt => gt.id === t.traitId)
  }).length * 5

  return Math.round(power)
}

// Main hero generation function
export function generateHero(options: HeroGenerationOptions = {}): Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt' | 'isOnExpedition' | 'isStationed' | 'stationedZoneId' | 'morale' | 'moraleLastUpdate'> {
  const rarity = options.forceRarity ?? generateRarity()
  const archetype = options.forceArchetype ?? generateArchetype()
  const gender = options.forceGender ?? generateGender()
  const culture = options.forceCulture ?? getRandomCulture()

  const baseStats = generateStats(rarity, archetype)
  const archetypeTags = generateArchetypeTags(archetype, rarity)
  const gameplayTraits = generateGameplayTraits(rarity)
  const storyTraitIds = generateStoryTraits()

  const name = getRandomName(gender, culture)
  const power = calculatePower(baseStats, gameplayTraits)

  return {
    name,
    gender,
    culture,
    titles: [],
    displayTitle: null,
    rarity,
    archetype,
    archetypeTags,
    baseStats,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gameplayTraits,
    storyTraitIds,
    power,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
  }
}

// Generate tavern hero (for recruitment)
export function generateTavernHero(slotRarity: Rarity | 'epic_plus'): TavernHero {
  // Epic+ slot can generate epic or legendary
  const rarity: Rarity = slotRarity === 'epic_plus'
    ? (Math.random() < 0.8 ? 'epic' : 'legendary')
    : slotRarity

  const hero = generateHero({ forceRarity: rarity })

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + TAVERN_REFRESH_HOURS)

  return {
    ...hero,
    recruitCost: RECRUITMENT_COSTS[rarity],
    isLocked: false,
    expiresAt: expiresAt.toISOString(),
  }
}
```

**Test cases:**

```typescript
import { describe, it, expect } from 'vitest'
import { generateHero, generateTavernHero } from '~/utils/heroGenerator'

describe('Hero Generator', () => {
  it('should generate a hero with all required properties', () => {
    const hero = generateHero()

    expect(hero.name).toBeTruthy()
    expect(hero.gender).toBeTruthy()
    expect(hero.culture).toBeTruthy()
    expect(hero.rarity).toBeTruthy()
    expect(hero.archetype).toBeTruthy()
    expect(hero.archetypeTags.length).toBeGreaterThan(0)
    expect(hero.baseStats.combat).toBeGreaterThan(0)
    expect(hero.baseStats.utility).toBeGreaterThan(0)
    expect(hero.baseStats.survival).toBeGreaterThan(0)
    expect(hero.gameplayTraits.length).toBeGreaterThan(0)
    expect(hero.storyTraitIds.length).toBeGreaterThan(0)
  })

  it('should respect forced rarity', () => {
    const hero = generateHero({ forceRarity: 'legendary' })
    expect(hero.rarity).toBe('legendary')
  })

  it('should respect forced archetype', () => {
    const hero = generateHero({ forceArchetype: 'tank' })
    expect(hero.archetype).toBe('tank')
  })

  it('should give legendary heroes more tags', () => {
    const common = generateHero({ forceRarity: 'common' })
    const legendary = generateHero({ forceRarity: 'legendary' })

    expect(legendary.archetypeTags.length).toBeGreaterThan(common.archetypeTags.length)
  })

  it('should give higher rarity heroes more stat points', () => {
    const common = generateHero({ forceRarity: 'common' })
    const legendary = generateHero({ forceRarity: 'legendary' })

    const commonTotal = common.baseStats.combat + common.baseStats.utility + common.baseStats.survival
    const legendaryTotal = legendary.baseStats.combat + legendary.baseStats.utility + legendary.baseStats.survival

    expect(legendaryTotal).toBeGreaterThan(commonTotal)
  })

  it('should generate tavern hero with recruit cost', () => {
    const tavernHero = generateTavernHero('rare')

    expect(tavernHero.rarity).toBe('rare')
    expect(tavernHero.recruitCost).toBe(500)
    expect(tavernHero.expiresAt).toBeTruthy()
  })
})
```

**Commit:** `feat: add hero generator with archetypes, tags, and traits`

---

### Task 24: Create Power Calculator

**Files:** `app/utils/powerCalculator.ts`, `tests/utils/powerCalculator.test.ts`

```typescript
import type { Hero, Equipment, Stats } from '~~/types'
import { getGameplayTraitById } from '~/data/gameplayTraits'

export interface PowerBreakdown {
  statPower: number
  gearPower: number
  traitPower: number
  equipTraitPower: number
  total: number
}

export function calculateHeroPower(hero: Hero, equipment: Equipment[]): PowerBreakdown {
  // 1. Base Stats (level scaling + prestige)
  const baseStats = {
    combat: hero.baseStats.combat + (hero.level * 0.5) + hero.prestigeBonuses.combat,
    utility: hero.baseStats.utility + (hero.level * 0.5) + hero.prestigeBonuses.utility,
    survival: hero.baseStats.survival + (hero.level * 0.5) + hero.prestigeBonuses.survival,
  }
  const statPower = baseStats.combat + baseStats.utility + baseStats.survival

  // 2. Gear Score
  const gearPower = equipment.reduce((sum, eq) => sum + eq.gearScore, 0)

  // 3. Hero Trait Power
  const traitPower = hero.gameplayTraits.reduce((sum, trait) => {
    const def = getGameplayTraitById(trait.traitId)
    return sum + (def?.isNegative ? -trait.rolledValue : trait.rolledValue)
  }, 0)

  // 4. Equipment Trait Power
  const equipTraitPower = equipment.reduce((sum, eq) => {
    return sum + eq.traits.reduce((s, t) => s + t.rolledValue, 0)
  }, 0)

  return {
    statPower,
    gearPower,
    traitPower,
    equipTraitPower,
    total: statPower + gearPower + traitPower + equipTraitPower
  }
}

// Power ranges by progression
export const POWER_RANGES = {
  freshHero: { min: 15, max: 25 },
  gearedLevel20: { min: 80, max: 120 },
  gearedLevel40: { min: 200, max: 300 },
  maxLevelPrePrestige: { min: 400, max: 500 },
  prestige3Optimized: { min: 600, max: Infinity },
}
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

**Example structure:**

```typescript
import type { Zone, Subzone } from '~~/types'

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
  {
    id: 'goblin_caves',
    name: 'Goblin Caves',
    description: 'Dark tunnels filled with goblin warrens and hidden dangers.',
    type: 'cave',
    unlockRequirement: { minPower: 30 },
    subzones: [
      {
        id: 'cave_entrance',
        name: 'Cave Entrance',
        description: 'The first chamber, dimly lit by scattered torches.',
        discoveryWeight: 100,
        requiredZoneFamiliarity: 0,
        isDiscovered: true,
        difficulty: 'easy',
        threats: ['swarms', 'ambush'],
        mastery: 0,
        baseDuration: 20,
        baseGold: 50,
        baseXp: 35,
      },
      // Add 2-3 more subzones...
    ],
    familiarity: 0,
    isUnlocked: false,
    isMastered: false,
  },
  // Add 3 more zones: Misty Swamp, Ancient Ruins, Scorching Desert
]

export function getZoneById(id: string): Zone | undefined {
  return ZONES.find(z => z.id === id)
}

export function getUnlockedZones(): Zone[] {
  return ZONES.filter(z => z.isUnlocked)
}
```

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
  // Calculate total team power
  const teamPower = heroes.reduce((sum, h) => sum + calculateHeroPower(h).total, 0)
  const now = new Date()
  const completesAt = new Date(now.getTime() + subzone.baseDuration * 60 * 1000)

  return {
    id: crypto.randomUUID(),
    playerId,
    zoneId: zone.id,
    subzoneId: subzone.id,
    heroIds: heroes.map(h => h.id),
    teamPower, // Store calculated power for reference
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
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
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

function calculateRewards(
  subzone: Subzone,
  efficiency: number,
  events: ExpeditionEvent[]
): ExpeditionRewards {
  // Accumulate event bonuses
  const eventBonuses = events.reduce((acc, e) => ({
    gold: acc.gold + (e.data.reward?.gold || 0),
    xp: acc.xp + (e.data.reward?.xp || 0),
  }), { gold: 0, xp: 0 })

  return {
    gold: Math.round(subzone.baseGold * efficiency + eventBonuses.gold),
    xp: Math.round(subzone.baseXp * efficiency + eventBonuses.xp),
    equipment: [], // Rolled separately from loot tables
    materials: {}, // Rolled separately from loot tables
    familiarityGain: Math.round(5 * efficiency),
    masteryGain: Math.round(3 * efficiency),
  }
}
```

**Commit:** `feat: add expedition engine`

---

### Task 35: Create Efficiency Calculator

**Files:** `app/utils/efficiencyCalculator.ts`

```typescript
import type { Hero, Zone, Subzone } from '~~/types'
import { THREATS, SEVERITY_BASE_PENALTY } from '~~/types/threats'
import { DIFFICULTY_MULTIPLIERS } from '~~/types/base'

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

**Commit:** `feat: add efficiency calculator with threat system`

---

### Task 36: Create Event Generator

**Files:** `app/utils/eventGenerator.ts`

Implement all event types with full structure:

**Event Categories:**

| Type | Frequency | Resolution | Impact |
|------|-----------|------------|--------|
| Flavor | 50% | Auto, during expedition | Log texture only |
| Skill Check | 25% | Auto, during expedition | Rewards or penalties |
| Choice | 20% | Queued, after return | Player decides outcome |
| Rare Occurrence | 5% | Mixed | Story traits, discoveries, hooks |

**Event Count Per Expedition:**

```typescript
const EVENTS_BY_DURATION = {
  short: { min: 2, max: 4 },    // < 30 min
  medium: { min: 3, max: 6 },   // 30-60 min
  long: { min: 5, max: 8 },     // 1-2 hr
  extended: { min: 6, max: 10 } // 2+ hr
}
```

**1. Flavor Events:**
- Text events that add expedition log texture
- No mechanical impact
- Trigger trait reactions

**2. Skill Check Events:**
- Auto-resolved based on hero stats, tags, or traits
- Check types: 'stat' | 'tag' | 'trait'
- Severity: 'minor' | 'moderate' | 'major'
- Consequences by severity:
  - Minor: Success = bonus loot/gold, Failure = reduced rewards only
  - Moderate: Success = good rewards + possible discovery, Failure = morale -5, efficiency -3%
  - Major: Success = great rewards + rare drops, Failure = morale -10, efficiency -8%, possible injury

**3. Choice Events:**
- Queued for player resolution after expedition returns
- Options can have requirements (requiresTag, requiresStat)
- Weighted random outcomes
- Auto-resolve if player skips (defaultOptionIndex)

**4. Rare Occurrences:**
- Types: 'hero_moment' | 'discovery' | 'story_hook' | 'windfall'
- Trigger conditions: trait-based, mastery-based, difficulty-based
- Outcomes: grantsStoryTrait, discoversSubzone, discoversMonster, bonusLoot, startsStoryHook

**5. Story Hooks:**
- Multi-step stories triggered by rare events
- Types: 'immediate' | 'collection' | 'delayed' | 'conditional'
- Completion rewards: unlockSubzone, unlockMonster, grantTitle, grantStoryTrait, grantEquipment

**6. Injury System:**
- Major skill check failures can cause temporary injuries
- Types: 'sprain' | 'poison' | 'curse' | 'exhaustion'
- Stat penalties and duration
- Early cure options (gold cost or healer tag)

**Event Generation Flow:**
1. Calculate event count based on duration × zone modifier
2. Roll event type for each slot from distribution weights
3. Filter available events by zone, subzone, party composition
4. Select random event from filtered pool
5. Resolve or queue (Flavor → Add to log, Skill Check → Resolve immediately, Choice → Queue, Rare → Process outcome)
6. Check rare occurrence triggers (trait-based, mastery-based)
7. Add trait reactions where heroes have matching traits

Include trait reaction triggers.

**Commit:** `feat: add expedition event generator`

---

### Task 37: Create Log Generator

**Files:** `app/utils/logGenerator.ts`

Implement log generation system using template + event injection approach:

**Log Structure:**
```typescript
interface ExpeditionLog {
  summary: {
    duration: string          // "32 minutes"
    efficiency: string        // "112% efficiency"
    rewards: RewardSummary    // gold, xp, items count
  }
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
```

**Template Flow:**
1. **Departure** - Always generated, sets the scene (zone-type specific templates)
2. **Travel** - Zone-type reactions from heroes (optional, 30% chance per hero, max 2-3 total)
3. **Encounter(s)** - From events: combat, skill checks, choices
4. **Discovery** - Loot found, subzone discoveries
5. **Return** - Wrap-up with efficiency-based comment

**Template Data:**

```typescript
// Departure templates by zone type
const DEPARTURE_TEMPLATES: Record<ZoneType, string[]> = {
  forest: [
    "The party gathered their supplies and headed into {zoneName}.",
    "With weapons ready, the group ventured beneath the forest canopy.",
    "{leaderName} led the way as the trees closed in around them.",
  ],
  // ... (cave, mountain, swamp, desert, ruins)
}

// Return templates (efficiency-based)
const RETURN_TEMPLATES = {
  high: [  // 120%+
    "The expedition was a resounding success.",
    "Spirits were high as the party returned triumphant.",
  ],
  medium: [  // 80-120%
    "Tired but satisfied, the party made their way back.",
    "A solid expedition, all things considered.",
  ],
  low: [  // <80%
    "Battered and bruised, the group limped home.",
    "It could have gone better, but they survived.",
  ],
}
```

**Trait Reaction Triggers:**
- Probability-based: ~30% chance per relevant trigger, soft cap 2-3 reactions per hero per expedition
- Trigger types: Zone type matches trait, Combat occurs, Loot found, Events occur, Culture mismatch

**Implementation:**
```typescript
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
```

Include template arrays for all zone types and event types.

**Commit:** `feat: add expedition log generator with templates`

---

### Task 38: Create Timer Composables

**Files:** `app/composables/useGameClock.ts`, `app/composables/useExpeditionTimer.ts`

Implement timer system with server truth + client display architecture:

**Architecture:**
- Server stores `startedAt` and `completesAt` timestamps
- Client calculates countdown from server timestamps
- On completion, client calls server to resolve
- Server validates time actually passed

**useGameClock.ts:**

```typescript
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

**useExpeditionTimer.ts:**

```typescript
export function useExpeditionTimer(expedition: Ref<Expedition | null>) {
  const { now } = useGameClock()

  const completesAt = computed(() => {
    if (!expedition.value) return 0
    return new Date(expedition.value.completesAt).getTime()
  })

  const remainingMs = computed(() => {
    return Math.max(0, completesAt.value - now.value)
  })

  const elapsedMs = computed(() => {
    if (!expedition.value) return 0
    const started = new Date(expedition.value.startedAt).getTime()
    const total = expedition.value.durationMinutes * 60 * 1000
    return Math.min(total, now.value - started)
  })

  const totalMs = computed(() => {
    if (!expedition.value) return 0
    return expedition.value.durationMinutes * 60 * 1000
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
```

**Completion flow:**
- Use `watchThrottled` from VueUse to watch `isComplete`
- On completion, call `expeditionStore.completeExpedition()`
- Handle auto-repeat if enabled

**Offline Handling:**
- Sync endpoint on app load: Single call resolves all completed expeditions
- Server validates time actually passed before processing

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

Implement all expedition API routes. See "API Routes Specification" section below for complete route details.

**Routes to implement:**
- `GET /api/expeditions` - List active and completed expeditions
- `POST /api/expeditions/start` - Start new expedition
- `GET /api/expeditions/[id]` - Get expedition details
- `POST /api/expeditions/[id]/complete` - Complete expedition
- `POST /api/expeditions/[id]/choice` - Resolve choice event
- `GET /api/expeditions/preview` - Preview expedition rewards

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

**Slot Stat Tendencies:**

| Slot | Primary (60%) | Secondary (25%) | Rare (15%) |
|------|---------------|-----------------|------------|
| Weapon | Combat | Utility | Survival |
| Armor | Survival | Combat | Utility |
| Helmet | Survival | Utility | Combat |
| Boots | Utility | Survival | Combat |
| Accessory 1 | Any (33% each) | - | - |
| Accessory 2 | Any (33% each) | - | - |

**Trait Slots by Rarity:**

| Rarity | Trait Slots | Quality Weights |
|--------|-------------|-----------------|
| Common | 0 | - |
| Uncommon | 0-1 | Normal only |
| Rare | 1 | Normal/Magic |
| Epic | 1-2 | Any quality |
| Legendary | 2 | Magic/Perfect weighted |
| Mythic | 2-3 | Perfect weighted |

**Equipment Trait Types:**

| Trait | Effect | Slot Affinity |
|-------|--------|---------------|
| Sharp | +X% Combat | Weapons |
| Reinforced | +X% Survival | Armor, Helmet |
| Lightfoot | -X% expedition time | Boots |
| Lucky Charm | +X% rare drops | Accessories |
| Threatening | +X% threat counter effectiveness | Any |
| Attuned | +X% stats in matching biome | Any |

**Set Bonuses:**

Example Set: Forest Stalker

| Pieces | Bonus |
|--------|-------|
| 2-piece | Nimble (Magic, +8% Utility) |
| 4-piece | Forest Attunement (+15% all stats in forest) + Scout's Eye (+10% event discovery) |
| 6-piece | Apex Predator (+20% Combat) + Nature's Blessing (poison immunity) |

**Set Sizes:**
- **6-piece** - Major zone sets (full equipment)
- **4-piece** - Themed mini-sets (allows mixing)

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

Implement all equipment API routes. See "API Routes Specification" section below for complete route details.

**Routes to implement:**
- `GET /api/equipment` - List equipment
- `POST /api/equipment/[id]/equip` - Equip item
- `POST /api/equipment/[id]/upgrade` - Upgrade trait

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

**Prestige System Details:**

**When:** Hero reaches level 60

**Resets:**
- Level → 1
- XP → 0
- Equipped gear → returns to inventory

**Keeps:**
- All traits (gameplay + story)
- Titles
- Archetype/tags
- Favorite status

**Gains:**

| Prestige | Stat Bonus | New Trait Slot | Quality Upgrade % |
|----------|------------|----------------|-------------------|
| 1 | +3 each | +1 | 10% |
| 2 | +4 each | - | 15% |
| 3 | +5 each | +1 | 20% |
| 4 | +6 each | - | 25% |
| 5+ | +7 each | +1 every 2 | 30% cap |

**Soft cap:** Diminishing returns after prestige 5, but can continue indefinitely.

**Commit:** `feat: add prestige service`

---

### Task 54: Create Morale Service

**Files:** `app/utils/moraleService.ts`

Track morale changes, recovery over time. Implement all triggers from comprehensive plan.

**Morale Thresholds & Effects:**

| State | Range | Effect |
|-------|-------|--------|
| Excited | 80-100 | +10% efficiency, bonus reactions |
| Content | 50-79 | Normal performance |
| Tired | 30-49 | -5% efficiency, grumpy reactions |
| Frustrated | 15-29 | -15% efficiency, may refuse long expeditions |
| Exhausted | 0-14 | Unavailable until rested |

**Morale Changes:**

| Action | Change |
|--------|--------|
| Complete expedition | -5 to -15 (based on duration) |
| Rest (not on expedition) | +5 per hour |
| Big loot drop | +10 |
| Discover new subzone | +15 |
| Counter threat successfully | +5 |
| Failed threat (took damage) | -10 |
| Level up | +20 (fully rested) |
| Expedition with favorite ally | +5 |
| Same zone 3+ times in row | -10 (bored) |

**Key Design Principles:**
- Auto-recovers when resting (not micromanagement)
- Big rewards boost morale (feels good)
- Variety prevents boredom
- Exhausted heroes auto-recover, just slower

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

**Difficulty Tiers:**

| Tier | Name | Power Req | Enemy × | Loot × | Item Level + |
|------|------|-----------|---------|--------|--------------|
| 1 | Novice | 0 | 1.0× | 1.0× | +0 |
| 2 | Adventurer | 100 | 1.3× | 1.15× | +3 |
| 3 | Veteran | 200 | 1.6× | 1.3× | +6 |
| 4 | Elite | 350 | 2.0× | 1.5× | +10 |
| 5 | Champion | 500 | 2.5× | 1.75× | +15 |
| 6 | Heroic | 700 | 3.0× | 2.0× | +20 |
| 7 | Legendary | 900 | 3.5× | 2.25× | +25 |
| 8 | Mythic | 1100 | 4.0× | 2.5× | +30 |
| 9 | Ascended | 1300 | 4.5× | 2.75× | +35 |
| 10 | Transcendent | 1500+ | 5.0× | 3.0× | +40 |

**Tier-Exclusive Content:**

| Tier | Unlocks |
|------|---------|
| 4+ (Elite) | Rare subzone variants, uncommon monster spawns increased |
| 6+ (Heroic) | Hidden subzones, rare monster spawns, exclusive collectibles |
| 8+ (Mythic) | Secret bosses, legendary monster variants, mythic gear drops |
| 10 (Transcendent) | Ultimate challenges, cosmetic rewards, titles |

**How It Works:**
- Unlock tiers by reaching power threshold
- Select tier when starting expedition
- Higher tier = harder threats, better gear
- Same zone, scaled challenge

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

**Offline Behavior by System:**

| System | Offline Behavior |
|--------|------------------|
| Active Expeditions | Complete normally, rewards stored |
| Auto-Repeat | If enabled, starts new expedition immediately |
| Passive Income | Accumulates at full rate |
| Morale Recovery | +5 per hour for resting heroes |
| Morale Drain | Applied per expedition completed |
| Tavern Refresh | Refreshes on schedule (every 8 hours) |
| XP/Leveling | Applied from completed expeditions |
| Discoveries | Subzones/monsters discovered, stored for reveal |

**Caps & Limits:**

| Resource | Cap | Behavior When Full |
|----------|-----|-------------------|
| Gold | None | Keeps accumulating |
| XP | None | Levels up automatically |
| Materials | None | Keeps accumulating |
| Equipment | Inventory slots | Auto-repeat pauses, notification |
| Collectibles | None | Keeps accumulating |

**Stop Conditions for Auto-Repeat:**

| Condition | Behavior |
|-----------|----------|
| Inventory full | Pause, store "pending loot" |
| Any hero exhausted | Pause, hero rests |
| Any hero levels up (optional) | Pause for player to see |
| Repeat limit reached | Pause |

**Pending Loot System:**

When inventory is full, loot goes to pending storage:
- Loot waits in "pending" for 48 hours
- Player must make room and claim
- After 48h, auto-sells for gold value

**Auto-Repeat System:**

Auto-repeat is set per expedition (whole party repeats together).

```typescript
interface ExpeditionSettings {
  autoRepeat: boolean
  autoRepeatLimit?: number    // Max repeats (null = unlimited)
  stopConditions: {
    anyHeroTired: boolean     // Stop if any hero hits Tired
    inventoryFull: boolean    // Stop if inventory full
    resourceCap: boolean      // Stop if gold cap reached
  }
}
```

When expedition completes:
1. Check stop conditions
2. If auto-repeat ON and no stop conditions met → same team, same zone, same difficulty, restart
3. Party stays together until stopped

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

**Party Preset Structure:**

```typescript
interface PartyPreset {
  id: string
  name: string                // "Dragon Hunters"
  heroIds: string[]           // Ordered list (max 4)
  preferredZoneId?: string
  preferredSubzoneId?: string
  preferredDifficulty?: number
  createdAt: string
  lastUsedAt: string
}
```

**Features:**
- Custom naming - Player names their presets
- Hero order - Order preserved (first = leader)
- Zone pairing - Optionally link to specific content
- Quick launch - One-click expedition start
- Auto-replace - Suggest replacement if hero unavailable

**Preset Limits (Scales with Progression):**

| Account Level | Preset Slots |
|---------------|--------------|
| 1 | 3 |
| 10 | 4 |
| 20 | 5 |
| 30 | 6 |
| 40+ | 8 |

**Commit:** `feat: add party preset system`

---

### Task 67: Create Hero Retirement System

**Files:** `app/components/hero/RetirementModal.vue`

Retirement with rewards and story trait transfer.

**Retirement Rewards Formula:**

| Factor | Contribution |
|--------|--------------|
| Level | level × 10 gold |
| Rarity | Common ×1, Legendary ×5 multiplier |
| Prestige | +50 gold per prestige level |
| Expeditions | +1 gold each |

**Example:** Level 45 Rare hero, Prestige 2, 200 expeditions
- Base: 45 × 10 = 450
- Rarity: ×3 = 1,350
- Prestige: +100 = 1,450
- Expeditions: +200 = **1,650 gold**

**Story Trait Transfer:**
1. Choose "Retire Hero"
2. Select one story trait to preserve
3. Choose any recipient hero (no restrictions)
4. Trait added to recipient
5. Gold paid, hero removed

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

**Philosophy:** Hybrid Approach
- Quick mandatory intro gets players into the loop fast
- Optional mentor quests guide deeper learning

**Mandatory Intro (~2 minutes):**
1. Name your Guild Master
2. Send GM on tutorial expedition (instant complete)
3. See expedition log + loot
4. "You're ready. Check mentor quests for more."

Players see the complete loop (expedition → log → loot) before being set free.

**Mentor Quest System:**

**Structure:** Always visible checklist
- All quests visible from start
- Grayed out with unlock conditions shown
- Players see full scope, work toward what interests them
- Self-directed learning

**Reward Tiers:**
- Early quests: Resources (gold, gear)
- Mid quests: One-time boosts (free recruit, free refresh)
- Final quest: Exclusive title/cosmetic

**Mentor Quest List:**

**Early Quests (unlock: immediate):**
- First Steps: Complete tutorial expedition → 100g
- Open for Business: Visit the tavern → 50g
- New Blood: Recruit your first hero → 150g + basic weapon
- Stronger Together: Send a 2+ hero party → 200g
- Spoils of War: Equip an item on any hero → Basic armor piece

**Mid Quests (unlock: various conditions):**
- Know Your Team: Recruit 3 heroes → Read a hero's full profile → 250g
- Counter Play: Complete 5 expeditions → Match a tag to a threat → Free tavern refresh
- Explorer: Unlock 2 zones → Discover a subzone → 300g + materials
- Dressed for Success: Own 5 equipment pieces → Equip a full set on one hero → Free recruitment (once)
- Rest & Recovery: Have a tired hero → Let a hero recover to Content → 200g

**Late Quests (unlock: progression milestones):**
- Veteran: Any hero reaches level 10 → View prestige screen → 500g
- Team Builder: Own 5+ heroes → Save a party preset → Free tavern refresh
- Moving On: Own 6+ heroes → Retire a hero → 300g + their gold value
- Completionist: Complete all above → Title: "The Prepared"

**Commit:** `feat: add tutorial flow`

---

### Task 72: Implement Economy Balance

**Files:** `app/data/goldSinks.ts`

Gold sink definitions and costs.

**Philosophy:** Sink-Driven Economy
- Gold flows generously, but meaningful sinks keep it valuable
- Players feel rich but always have something to spend on

**Income by Content Type:**
- Exploration: Best gold/hour
- Dungeons: Best loot/materials
- Quests: One-time big payouts + unlocks
- Stationing: Low but passive

**Base Income by Duration (Zone 1, exploration):**

| Duration | Gold Range |
|----------|------------|
| 15 min | 30-50g |
| 30 min | 70-100g |
| 1 hr | 150-200g |
| 2 hr | 350-450g |

Scales with zone difficulty and tier.

**Gold Sinks:**

**Small Sinks (frequent use, 50-200g):**
- Tavern refresh: 75g (scales +25g per refresh/day)
- Quick recover (tired→content): 100g (skip 1hr wait)
- Expedition speed-up (10%): 50g (per expedition)

**Medium Sinks (regular use, 200-800g):**
- Equipment upgrade (Normal→Magic): 300g + materials
- Equipment upgrade (Magic→Perfect): 600g + rare materials
- Reroll equipment trait: 400g (random new trait)
- Cleanse minor curse: 200g
- Cleanse major curse: 500g

**Large Sinks (investments, 1000-3000g):**
- Unlock tavern slot: 1500g (permanent)
- Unlock party preset slot: 1000g (permanent)
- Unlock difficulty tier: 2000g + power requirement
- Reroll hero negative trait: 2500g (random replacement)

**Aspirational Sinks (endgame, 5000g+):**
- Add hero trait slot: 8000g (once per hero)
- Targeted trait reroll: 5000g (pick trait category)
- Instant prestige recovery: 10000g (skip prestige downtime)

**Commit:** `feat: add economy balance system`

---

### Task 73: Create Notification System

**Files:** `app/stores/notifications.ts`, `app/components/ui/NotificationCenter.vue`

Opt-in push notifications + daily digest.

**Philosophy:**
- Opt-in push notifications + daily digest option
- Players control their experience

**Notification Categories:**

**Expedition Events:**

| Event | Default | Notes |
|-------|---------|-------|
| Expedition complete | ON | Core loop |
| Choices waiting | ON | Need player input |
| Auto-repeat stopped (inventory full) | ON | Action needed |
| Rare drop found | OFF | Nice-to-know |

**Hero Events:**

| Event | Default | Notes |
|-------|---------|-------|
| Hero exhausted | OFF | Check when playing |
| Hero level up | OFF | Frequent, noisy |
| Hero ready to prestige | ON | Milestone |
| Stationed hero tired | OFF | Batch in digest |

**Tavern Events:**

| Event | Default | Notes |
|-------|---------|-------|
| Free refresh available | OFF | Every 8 hours is too much |
| Rare+ hero appeared | ON | Don't miss good ones |
| Locked hero expiring | ON | Prevent loss |

**System Events:**

| Event | Default | Notes |
|-------|---------|-------|
| Daily digest | ON | Summary option |
| Quest completed | OFF | Check in-game |
| New zone unlocked | ON | Progression milestone |

**Daily Digest:**

Optional morning summary:
- "Yesterday: 5 expeditions, 2 level-ups, 1 rare drop"
- Plus critical alerts for queued choices
- Minimal interruption for players who prefer less noise

Player can toggle each notification type individually.

**Commit:** `feat: add notification system`

---

### Task 74: Create Achievement System

**Files:** `app/data/achievements.ts`, `app/stores/achievements.ts`, `app/components/achievements/AchievementCard.vue`

**Philosophy:**
- Separate from hero titles. Titles are hero accomplishments, achievements are account milestones.
- Rewards: Unlocks + Cosmetics (no percentage bonuses - keeps it fair for new players)

**Rewards:**
- Early achievements: One-time resources
- Mid achievements: Unlock features (extra preset slot, station slot)
- Endgame achievements: Exclusive cosmetics, profile titles

**Categories (Tiered: Bronze → Silver → Gold → Platinum):**

| Category | Tracks | Bronze | Silver | Gold | Platinum |
|----------|--------|--------|--------|------|----------|
| Explorer | Expeditions completed | 10 | 100 | 500 | 2000 |
| Collector | Unique heroes recruited | 5 | 25 | 75 | 150 |
| Hoarder | Equipment pieces owned | 20 | 100 | 300 | 750 |
| Storyteller | Story traits discovered | 10 | 50 | 150 | 300 |
| Master | Zones fully mastered | 1 | 3 | 7 | 12 |
| Veteran | Heroes prestiged | 1 | 5 | 15 | 30 |
| Merchant | Gold earned (lifetime) | 10k | 100k | 500k | 2M |
| Challenger | Highest difficulty cleared | Tier 3 | Tier 5 | Tier 7 | Tier 10 |

**Hidden Achievements:**

Discovered through play, not shown until triggered:
- Oops: Retire a legendary hero
- Against All Odds: Clear hard content with all-common party
- Cheese Enthusiast: Collect 5 cheese-related story traits
- Night Shift: Complete 100 expeditions between midnight-6am
- Full House: Have 5 heroes with contradictory traits
- Lucky Find: Discover a rare subzone on first zone visit
- Minimalist: Clear a dungeon with single hero

**Guild Page Display (Flex System):**
- Trophy Case: Select 3-6 achievements to showcase
- Stat Banner: Key lifetime stats (expeditions, heroes, gold)
- Rarest Badge: Auto-displays your rarest achievement
- Completion Bar: Overall achievement %
- Hidden Counter: "X/? secrets discovered"

**Commit:** `feat: add achievement system`

---

### Task 75: Create Daily/Weekly Challenges

**Files:** `app/stores/challenges.ts`, `app/components/challenges/ChallengeBoard.vue`

**Philosophy:** Challenge Board
- Bonus opportunities, not exclusive content
- No FOMO - missing a day means missing bonus rewards, not unique content

**Daily Challenges:**

Refresh every 24 hours at server reset. Complete for bonus rewards.

**Example Daily Challenges:**
- Complete 3 expeditions → 100g
- Use a hero with Combat 6+ → 75g
- Discover a subzone → 150g + materials
- Complete an expedition under 30min → 50g
- Send a full party (4 heroes) → 100g

**Daily Slots:** 3 challenges per day, pick any to complete.

**Weekly Challenges:**

Refresh every 7 days. Larger scope, better rewards.

**Example Weekly Challenges:**
- Complete 20 expeditions → 500g
- Recruit 2 heroes → 300g + free refresh
- Level up any hero 3 times → 400g
- Complete expeditions in 3 different zones → 350g + materials
- Earn 2000g total → 250g bonus

**Weekly Slots:** 5 challenges per week, all completable.

**Challenge Board UI:**
- Visible from main screen (badge if unclaimed rewards)
- Shows progress on each challenge
- Claim button when complete
- Timer until next refresh
- No penalty for incomplete challenges - they just reset

**Commit:** `feat: add challenge system`

---

### Task 76: Create Passive Stationing

**Files:** `app/stores/stationing.ts`, `app/components/zone/StationingPanel.vue`

Heroes station in zones for passive income.

**Philosophy:**
- Heroes not on expeditions can be stationed in discovered zones for idle income
- Ties into zone mastery system

**What Stationed Heroes Generate:**
- **Zone resources:** Materials tied to zone's biome
- **Familiarity progress:** Slowly builds zone/subzone familiarity
- **Subzone discovery:** Chance to discover subzones over time
- **Quest hooks:** Chance to generate quests from scouting

No gold from stationing - exploration stays king for income.

**Duration:**
- **Until morale drops** - heroes station until they hit "Tired" or "Frustrated"
- Creates natural rotation
- High-survival heroes last longer (valuable for stationing)
- Prevents "station everyone forever" cheese

**Limits:**

| Progression | Global Cap | Per Zone |
|-------------|------------|----------|
| Early game | 3 heroes | 1 max |
| Mid game | 6 heroes | 2 max |
| Late game | 10 heroes | 2 max |

Encourages breadth - explore more zones to station more heroes.

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

### Conventions

**Route Pattern:**
```
server/api/{resource}/[action].{method}.ts
```

**Authentication:** Supabase built-in via `@nuxtjs/supabase` module.
- Use `serverSupabaseUser(event)` in all protected routes
- Returns user or throws 401

**Validation:** Use Zod schemas with H3 validation helpers.

```typescript
import { z } from 'zod'
import { readValidatedBody, getValidatedRouterParams } from 'h3'

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
- Success responses return data directly
- Error responses use `createError()` with status codes

**Standard Error Codes:**
```typescript
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
  lastRefreshAt: string       // ISO timestamp
  nextFreeRefresh: string      // ISO timestamp
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
  log?: ExpeditionLog
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
  stopConditions?: {
    anyHeroTired: boolean
    inventoryFull: boolean
    resourceCap: boolean
  }
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
  choiceId: number  // Choice option ID
}
```

**Response:**
```typescript
{
  event: ExpeditionEvent    // With outcome filled
  additionalRewards?: Partial<ExpeditionRewards>
  injury?: {
    heroId: string
    severity: 'minor' | 'major' | 'severe'
  }
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
    hasCounter: boolean
    counterTags: ArchetypeTag[]
  }[]
  estimatedRewards: {
    gold: number
    xp: number
    duration: number
  }
}
```

---

### Equipment

#### GET /api/equipment

List all player's equipment.

**Query Params:**
```typescript
{
  equipped?: boolean  // Filter by equipped status
  heroId?: string     // Filter by equipped hero
}
```

**Response:**
```typescript
{ equipment: Equipment[] }
```

#### POST /api/equipment/[id]/equip

Equip item to hero.

**Request:**
```typescript
{
  heroId: string
  slot: EquipmentSlot
}
```

**Response:**
```typescript
{
  equipment: Equipment      // The equipped item
  hero: Hero                // Updated hero
  unequipped?: Equipment    // If slot was occupied
}
```

**Errors:**
- `NOT_FOUND` - Equipment doesn't exist
- `INVALID_INPUT` - Slot mismatch

#### POST /api/equipment/[id]/upgrade

Upgrade equipment trait quality.

**Request:**
```typescript
{
  traitIndex: number
  goldCost: number
}
```

**Response:**
```typescript
{
  equipment: Equipment      // With upgraded trait
  goldSpent: number
}
```

**Errors:**
- `INSUFFICIENT_GOLD` - Can't afford upgrade
- `INVALID_INPUT` - Trait already max quality

---

### Zones

#### GET /api/zones

List all zones with player progress.

**Response:**
```typescript
{
  zones: Zone[]
  playerProgress: {
    zoneId: string
    familiarity: number
    mastery: number
    isUnlocked: boolean
    isMastered: boolean
    discoveredSubzones: string[]
  }[]
}
```

#### POST /api/zones/[id]/station

Station hero in zone for passive income.

**Request:**
```typescript
{
  heroId: string
  subzoneId: string
}
```

**Response:**
```typescript
{
  hero: Hero                // Updated with stationed status
  incomeRate: {
    goldPerHour: number
    xpPerHour: number
  }
}
```

**Errors:**
- `HERO_BUSY` - Hero is on expedition
- `NOT_FOUND` - Zone/subzone not found

#### POST /api/zones/[id]/recall

Recall stationed hero.

**Request:**
```typescript
{
  heroId: string
}
```

**Response:**
```typescript
{
  hero: Hero
  rewards: {
    gold: number
    xp: number
  }
}
```

---

### Player

#### GET /api/player

Get player state.

**Response:**
```typescript
{
  player: {
    id: string
    gold: number
    accountLevel: number
    accountXp: number
  }
  guildMaster?: GuildMaster
}
```

#### GET /api/player/presets

Get all party presets.

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
  heroIds: string[]  // Max 4
}
```

**Response:**
```typescript
{ preset: PartyPreset }
```

#### DELETE /api/player/presets/[id]

Delete party preset.

**Response:**
```typescript
{ success: boolean }
```

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

**Note:** This plan is self-contained. All implementation details are included above. For additional context on game design philosophy, see `design/GAME_DESIGN_V2.md` (optional reference).







