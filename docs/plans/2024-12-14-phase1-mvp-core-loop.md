# Phase 1: MVP Core Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
>
> ⚠️ **IMPORTANT:** Read `docs/plans/BEST_PRACTICES_REVIEW.md` before implementing.

**Goal:** Build a playable idle RPG with hero recruitment, zone expeditions, equipment drops, leveling, and expedition logs with trait-flavored reactions.

**Architecture:** Nuxt 4 full-stack app with Vue 3 frontend, server API routes, and PostgreSQL database via Supabase. State management with Pinia. Real-time updates via polling (MVP) or SSE. Mobile-first responsive UI with Tailwind CSS.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Pinia, Supabase (PostgreSQL + Auth), Vitest, Playwright

---

## Directory Structure (Nuxt 4)

Client-side code goes in `app/`, server code in `server/`, shared types in `types/`.

```
app/                    # srcDir (client-side)
├── components/
├── composables/
├── layouts/
├── pages/
├── stores/
├── utils/
└── app.vue
server/                 # Server-side (at root)
├── api/
└── utils/
types/                  # Shared types (at root)
```

---

## Overview

Phase 1 delivers the core gameplay loop:
1. Players recruit randomly-generated heroes with traits
2. Send heroes on zone expeditions (timed)
3. Expeditions complete with loot drops, XP, and story logs
4. Heroes level up and equip gear
5. Stronger heroes tackle harder zones

**Estimated Tasks:** 45 tasks across 7 sections

---

## Section 1: Project Setup (Tasks 1-8)

### Task 1: Initialize Nuxt 3 Project

**Files:**
- Create: `package.json`
- Create: `nuxt.config.ts`
- Create: `tsconfig.json`
- Create: `app.vue`

**Step 1: Create Nuxt 3 project**

```bash
npx nuxi@latest init dungeon-farmers-app --template v3
cd dungeon-farmers-app
```

**Step 2: Verify project runs**

```bash
npm run dev
```

Expected: Dev server starts at http://localhost:3000

**Step 3: Commit**

```bash
git add .
git commit -m "chore: initialize Nuxt 3 project"
```

---

### Task 2: Configure TypeScript Strictly

**Files:**
- Modify: `tsconfig.json`
- Modify: `nuxt.config.ts`

**Step 1: Update tsconfig.json**

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Step 2: Verify TypeScript works**

```bash
npx nuxi typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: configure strict TypeScript"
```

---

### Task 3: Install and Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.js`
- Create: `app/assets/css/main.css`
- Modify: `nuxt.config.ts`

> ✅ Using `@nuxtjs/tailwindcss` module (already installed) simplifies configuration.

**Step 1: Install Tailwind module (if not already installed)**

```bash
npm install -D @nuxtjs/tailwindcss
```

**Step 2: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Content paths auto-configured by @nuxtjs/tailwindcss
  theme: {
    extend: {
      colors: {
        // Fantasy parody theme colors
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

**Step 3: Create app/assets/css/main.css**

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

**Step 4: Update nuxt.config.ts**

```typescript
// ✅ Simpler config - @nuxtjs/tailwindcss handles postcss automatically
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  // No manual postcss config needed!
})
```

**Step 5: Verify Tailwind works**

Update `app/app.vue`:
```vue
<template>
  <div class="min-h-screen flex items-center justify-center">
    <h1 class="text-4xl font-bold text-guild-gold">Dungeon Farmers</h1>
  </div>
</template>
```

Run: `npm run dev`
Expected: Gold colored title centered on dark background

**Step 6: Commit**

```bash
git add .
git commit -m "chore: add Tailwind CSS with game theme colors"
```

---

### Task 4: Install and Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Create: `tests/example.test.ts`

**Step 1: Install Vitest**

```bash
npm install -D vitest @vue/test-utils happy-dom
```

**Step 2: Create vitest.config.ts**

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

**Step 3: Add test script to package.json**

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

**Step 4: Create tests/example.test.ts**

```typescript
import { describe, it, expect } from 'vitest'

describe('Example', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
})
```

**Step 5: Run test to verify setup**

```bash
npm run test:run
```

Expected: 1 test passes

**Step 6: Commit**

```bash
git add .
git commit -m "chore: add Vitest testing framework"
```

---

### Task 5: Install Pinia for State Management

**Files:**
- Modify: `nuxt.config.ts`
- Create: `app/stores/game.ts`

**Step 1: Install Pinia**

```bash
npm install pinia @pinia/nuxt
```

**Step 2: Update nuxt.config.ts**

```typescript
// ✅ Clean config with modules
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
})
```

**Step 3: Create app/stores/game.ts**

```typescript
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gold: 100,
    playerLevel: 1,
  }),

  getters: {
    canRecruitHero: (state) => state.gold >= 50,
  },

  actions: {
    addGold(amount: number) {
      this.gold += amount
    },
    spendGold(amount: number) {
      if (this.gold >= amount) {
        this.gold -= amount
        return true
      }
      return false
    },
  },
})
```

**Step 4: Verify Pinia works**

Update `app/app.vue`:
```vue
<script setup lang="ts">
const gameStore = useGameStore()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 class="text-4xl font-bold text-guild-gold">Dungeon Farmers</h1>
    <p class="text-xl">Gold: {{ gameStore.gold }}</p>
  </div>
</template>
```

Run: `npm run dev`
Expected: Shows "Gold: 100"

**Step 5: Commit**

```bash
git add .
git commit -m "chore: add Pinia state management"
```

---

### Task 6: Install Supabase Client

**Files:**
- Modify: `nuxt.config.ts`
- Create: `.env.example`
- Create: `.env`

**Step 1: Install Supabase**

```bash
npm install @nuxtjs/supabase
```

**Step 2: Update nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/supabase'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  supabase: {
    redirect: false,
  },
})
```

**Step 3: Create .env.example**

```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
```

**Step 4: Create .env with your Supabase credentials**

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

**Step 5: Add .env to .gitignore**

```bash
echo ".env" >> .gitignore
```

**Step 6: Commit**

```bash
git add .gitignore .env.example nuxt.config.ts package.json package-lock.json
git commit -m "chore: add Supabase client"
```

---

### Task 7: Create Base Layout

**Files:**
- Create: `app/layouts/default.vue`
- Create: `app/components/AppHeader.vue`
- Create: `app/components/AppNav.vue`

**Step 1: Create app/layouts/default.vue**

```vue
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <AppHeader />
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
    <AppNav />
  </div>
</template>
```

**Step 2: Create app/components/AppHeader.vue**

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

**Step 3: Create app/components/AppNav.vue**

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

**Step 4: Update app/app.vue to use layout**

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

**Step 5: Create pages/index.vue**

```vue
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Your Heroes</h2>
    <p class="text-gray-400">No heroes yet. Recruit some!</p>
  </div>
</template>
```

**Step 6: Verify layout works**

Run: `npm run dev`
Expected: Header with gold count, main content, bottom navigation

**Step 7: Commit**

```bash
git add .
git commit -m "feat: add base layout with header and navigation"
```

---

### Task 8: Create Placeholder Pages

**Files:**
- Create: `app/pages/expeditions.vue`
- Create: `app/pages/inventory.vue`

**Step 1: Create pages/expeditions.vue**

```vue
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Expeditions</h2>
    <p class="text-gray-400">No zones unlocked yet.</p>
  </div>
</template>
```

**Step 2: Create pages/inventory.vue**

```vue
<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Inventory</h2>
    <p class="text-gray-400">No items yet.</p>
  </div>
</template>
```

**Step 3: Verify navigation works**

Run: `npm run dev`
Expected: Can navigate between all three pages

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add placeholder pages for expeditions and inventory"
```

---

## Section 2: Database Schema & Types (Tasks 9-14)

### Task 9: Define Core TypeScript Types

**Files:**
- Create: `types/game.ts`  (at root, shared types)

**Step 1: Create types/game.ts**

```typescript
// Rarity tiers for heroes, equipment, and monsters
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

// Equipment rarity includes mythic
export type EquipmentRarity = Rarity | 'mythic'

// Equipment slots
export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2'

// Trait types
export type TraitType = 'flat' | 'conditional' | 'tag'

// Zone types (for conditional traits)
export type ZoneType = 'forest' | 'cave' | 'mountain' | 'swamp' | 'desert' | 'ruins'

// Expedition status
export type ExpeditionStatus = 'idle' | 'in_progress' | 'completed'

// Base trait definition
export interface Trait {
  id: string
  name: string
  description: string
  type: TraitType
  // For flat bonuses
  statBonus?: {
    stat: 'attack' | 'defense' | 'speed' | 'luck'
    percent: number
  }
  // For conditional bonuses
  condition?: {
    zoneType?: ZoneType
    triggerChance?: number
  }
  conditionBonus?: number
  // For tags
  tags?: string[]
  // Flavor text for expedition logs
  reactions?: {
    onCombat?: string[]
    onLoot?: string[]
    onEvent?: string[]
  }
}

// Hero definition
export interface Hero {
  id: string
  name: string
  rarity: Rarity
  level: number
  xp: number
  xpToNextLevel: number

  // Base stats (before equipment/traits)
  baseAttack: number
  baseDefense: number
  baseSpeed: number
  baseLuck: number

  // Traits
  traitIds: string[]
  maxTraits: number

  // Equipment (slot -> equipment id)
  equipment: Partial<Record<EquipmentSlot, string>>

  // Calculated power (cached, recalculate on changes)
  power: number

  // State
  currentExpeditionId: string | null

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Equipment definition
export interface Equipment {
  id: string
  name: string
  slot: EquipmentSlot
  rarity: EquipmentRarity
  itemLevel: number

  // Stats
  attack: number
  defense: number
  speed: number
  luck: number

  // Gear score (single number for power)
  gearScore: number

  // Set bonus (optional)
  setId?: string

  // Which hero has this equipped (null = in inventory)
  equippedHeroId: string | null

  // Timestamps
  createdAt: string
}

// Zone definition
export interface Zone {
  id: string
  name: string
  description: string
  type: ZoneType

  // Requirements
  minPower: number
  unlocked: boolean

  // Expedition settings
  minDurationMinutes: number
  maxDurationMinutes: number

  // Rewards
  baseXp: number
  baseGold: number
  lootTable: LootTableEntry[]

  // Flavor
  possibleEvents: string[]
}

// Loot table entry
export interface LootTableEntry {
  equipmentTemplateId: string
  dropChance: number // 0-1
  minItemLevel: number
  maxItemLevel: number
}

// Active expedition
export interface Expedition {
  id: string
  odId: string
  heroIds: string[]

  status: ExpeditionStatus
  startedAt: string
  completesAt: string

  // Results (populated on completion)
  efficiency?: number // 60-150
  xpGained?: number
  goldGained?: number
  lootIds?: string[]
  log?: ExpeditionLogEntry[]
}

// Expedition log entry
export interface ExpeditionLogEntry {
  timestamp: string
  type: 'combat' | 'loot' | 'event' | 'reaction'
  text: string
  heroId?: string // For reactions
}

// Player state
export interface PlayerState {
  odId: string
  odLevel: number
  gold: number
  premiumCurrency: number

  // Daily limits
  heroRecruitmentToday: number
  lastRecruitmentReset: string

  // Unlocks
  unlockedZoneIds: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
}
```

**Step 2: Commit**

```bash
git add types/game.ts
git commit -m "feat: add core TypeScript type definitions"
```

---

### Task 10: Create Trait Data

**Files:**
- Create: `app/data/traits.ts`
- Create: `tests/data/traits.test.ts`

**Step 1: Write test for trait data**

Create `tests/data/traits.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { TRAITS, getTraitById, getTraitsByType } from '~/data/traits'

describe('Traits Data', () => {
  it('should have at least 10 traits', () => {
    expect(Object.keys(TRAITS).length).toBeGreaterThanOrEqual(10)
  })

  it('should have traits of each type', () => {
    const flatTraits = getTraitsByType('flat')
    const conditionalTraits = getTraitsByType('conditional')
    const tagTraits = getTraitsByType('tag')

    expect(flatTraits.length).toBeGreaterThan(0)
    expect(conditionalTraits.length).toBeGreaterThan(0)
    expect(tagTraits.length).toBeGreaterThan(0)
  })

  it('should return trait by id', () => {
    const trait = getTraitById('brawny')
    expect(trait).toBeDefined()
    expect(trait?.name).toBe('Brawny')
  })

  it('should return undefined for unknown trait', () => {
    const trait = getTraitById('nonexistent')
    expect(trait).toBeUndefined()
  })

  it('flat traits should have statBonus', () => {
    const flatTraits = getTraitsByType('flat')
    flatTraits.forEach(trait => {
      expect(trait.statBonus).toBeDefined()
    })
  })

  it('conditional traits should have condition and conditionBonus', () => {
    const conditionalTraits = getTraitsByType('conditional')
    conditionalTraits.forEach(trait => {
      expect(trait.condition).toBeDefined()
      expect(trait.conditionBonus).toBeDefined()
    })
  })

  it('tag traits should have tags array', () => {
    const tagTraits = getTraitsByType('tag')
    tagTraits.forEach(trait => {
      expect(trait.tags).toBeDefined()
      expect(trait.tags!.length).toBeGreaterThan(0)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/data/traits.test.ts
```

Expected: FAIL - module not found

**Step 3: Create data/traits.ts**

```typescript
import type { Trait, TraitType } from '~~/types/game'

export const TRAITS: Record<string, Trait> = {
  // === FLAT BONUS TRAITS ===
  brawny: {
    id: 'brawny',
    name: 'Brawny',
    description: '+10% Attack',
    type: 'flat',
    statBonus: { stat: 'attack', percent: 10 },
    reactions: {
      onCombat: [
        '{hero} flexed menacingly at the enemy.',
        '{hero} cracked their knuckles before the fight.',
      ],
    },
  },
  sturdy: {
    id: 'sturdy',
    name: 'Sturdy',
    description: '+10% Defense',
    type: 'flat',
    statBonus: { stat: 'defense', percent: 10 },
    reactions: {
      onCombat: [
        '{hero} barely flinched from the hit.',
        '{hero} stood their ground like a wall.',
      ],
    },
  },
  nimble: {
    id: 'nimble',
    name: 'Nimble',
    description: '+10% Speed',
    type: 'flat',
    statBonus: { stat: 'speed', percent: 10 },
    reactions: {
      onCombat: [
        '{hero} dodged with annoying ease.',
        '{hero} was already behind the enemy.',
      ],
    },
  },
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    description: '+10% Luck',
    type: 'flat',
    statBonus: { stat: 'luck', percent: 10 },
    reactions: {
      onLoot: [
        '{hero} found a coin in the monster\'s pocket.',
        'Something shiny caught {hero}\'s eye.',
      ],
    },
  },
  lootGoblin: {
    id: 'lootGoblin',
    name: 'Loot Goblin',
    description: '+15% Luck',
    type: 'flat',
    statBonus: { stat: 'luck', percent: 15 },
    reactions: {
      onLoot: [
        '{hero} was already looting before the monster hit the ground.',
        '{hero}\'s eyes sparkled at the sight of treasure.',
        '{hero} whispered "mine" possessively.',
      ],
    },
  },

  // === CONDITIONAL TRAITS ===
  pyromaniac: {
    id: 'pyromaniac',
    name: 'Pyromaniac',
    description: '+25% Attack in volcanic/fire zones',
    type: 'conditional',
    condition: { zoneType: 'desert' },
    conditionBonus: 25,
    reactions: {
      onCombat: [
        '{hero} cackled maniacally as flames spread.',
        '"MORE FIRE!" shouted {hero}.',
      ],
      onEvent: [
        '{hero} complained about the lack of fire here.',
      ],
    },
  },
  caveExplorer: {
    id: 'caveExplorer',
    name: 'Cave Explorer',
    description: '+20% all stats in caves',
    type: 'conditional',
    condition: { zoneType: 'cave' },
    conditionBonus: 20,
    reactions: {
      onEvent: [
        '{hero} navigated the tunnels with ease.',
        '"I know these caves," muttered {hero}.',
      ],
    },
  },
  forestFriend: {
    id: 'forestFriend',
    name: 'Forest Friend',
    description: '+20% all stats in forests',
    type: 'conditional',
    condition: { zoneType: 'forest' },
    conditionBonus: 20,
    reactions: {
      onEvent: [
        'The trees seemed to part for {hero}.',
        '{hero} paused to greet a passing squirrel.',
      ],
    },
  },
  treasureHunter: {
    id: 'treasureHunter',
    name: 'Treasure Hunter',
    description: '15% chance to find bonus loot',
    type: 'conditional',
    condition: { triggerChance: 0.15 },
    conditionBonus: 0,
    reactions: {
      onLoot: [
        '{hero}\'s treasure sense was tingling.',
        '"There\'s more here," {hero} insisted.',
      ],
    },
  },

  // === TAG TRAITS ===
  stealthy: {
    id: 'stealthy',
    name: 'Stealthy',
    description: 'Can complete stealth objectives',
    type: 'tag',
    tags: ['stealth', 'sneaky'],
    reactions: {
      onCombat: [
        '{hero} struck from the shadows.',
        'The enemy never saw {hero} coming.',
      ],
      onEvent: [
        '{hero} scouted ahead silently.',
      ],
    },
  },
  healer: {
    id: 'healer',
    name: 'Healer',
    description: 'Can heal allies, required for some content',
    type: 'tag',
    tags: ['healing', 'support'],
    reactions: {
      onCombat: [
        '{hero} patched up the team\'s wounds.',
        '"Hold still," {hero} muttered while bandaging.',
      ],
    },
  },
  fireMagic: {
    id: 'fireMagic',
    name: 'Fire Magic',
    description: 'Can use fire magic',
    type: 'tag',
    tags: ['fire', 'magic', 'elemental'],
    reactions: {
      onCombat: [
        '{hero} hurled a fireball at the enemy.',
        'Flames danced around {hero}\'s hands.',
      ],
    },
  },
  tank: {
    id: 'tank',
    name: 'Tank',
    description: 'Can absorb damage for the team',
    type: 'tag',
    tags: ['tank', 'frontline'],
    reactions: {
      onCombat: [
        '{hero} stepped in front of an attack.',
        '"Get behind me!" yelled {hero}.',
      ],
    },
  },

  // === FUN/QUIRKY TRAITS ===
  coward: {
    id: 'coward',
    name: 'Coward',
    description: '-5% Attack, +20% chance to find hidden things',
    type: 'flat',
    statBonus: { stat: 'attack', percent: -5 },
    reactions: {
      onCombat: [
        '{hero} hid behind a rock during the fight.',
        '{hero} fought from a safe distance. Very safe.',
      ],
      onLoot: [
        '{hero} found a secret passage while hiding.',
        'Cowering in a corner, {hero} noticed a hidden chest.',
      ],
    },
  },
  overconfident: {
    id: 'overconfident',
    name: 'Overconfident',
    description: '+15% Attack, -10% Defense',
    type: 'flat',
    statBonus: { stat: 'attack', percent: 15 },
    reactions: {
      onCombat: [
        '"Is that all you\'ve got?" taunted {hero}.',
        '{hero} didn\'t bother dodging. Mistake.',
      ],
    },
  },
  caffeineDependent: {
    id: 'caffeineDependent',
    name: 'Caffeine Dependent',
    description: '+20% Speed after using potions',
    type: 'conditional',
    condition: { triggerChance: 0.3 },
    conditionBonus: 20,
    reactions: {
      onEvent: [
        '{hero} desperately searched for coffee.',
        '"Need... caffeine..." mumbled {hero}.',
      ],
    },
  },
}

export function getTraitById(id: string): Trait | undefined {
  return TRAITS[id]
}

export function getTraitsByType(type: TraitType): Trait[] {
  return Object.values(TRAITS).filter(t => t.type === type)
}

export function getRandomTraits(count: number, exclude: string[] = []): Trait[] {
  const available = Object.values(TRAITS).filter(t => !exclude.includes(t.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/data/traits.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add data/traits.ts tests/data/traits.test.ts
git commit -m "feat: add trait definitions with reactions"
```

---

### Task 11: Create Zone Data

**Files:**
- Create: `app/data/zones.ts`
- Create: `tests/data/zones.test.ts`

**Step 1: Write test for zone data**

Create `tests/data/zones.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { ZONES, getZoneById, getUnlockedZones } from '~/data/zones'

describe('Zones Data', () => {
  it('should have at least 3 zones', () => {
    expect(Object.keys(ZONES).length).toBeGreaterThanOrEqual(3)
  })

  it('should have first zone unlocked by default', () => {
    const firstZone = Object.values(ZONES)[0]
    expect(firstZone.unlocked).toBe(true)
  })

  it('should return zone by id', () => {
    const zone = getZoneById('verdant_woods')
    expect(zone).toBeDefined()
    expect(zone?.name).toBe('Verdant Woods')
  })

  it('zones should have required properties', () => {
    Object.values(ZONES).forEach(zone => {
      expect(zone.id).toBeDefined()
      expect(zone.name).toBeDefined()
      expect(zone.type).toBeDefined()
      expect(zone.minPower).toBeGreaterThanOrEqual(0)
      expect(zone.minDurationMinutes).toBeGreaterThan(0)
      expect(zone.maxDurationMinutes).toBeGreaterThanOrEqual(zone.minDurationMinutes)
    })
  })

  it('getUnlockedZones should return only unlocked zones', () => {
    const unlockedIds = ['verdant_woods']
    const unlocked = getUnlockedZones(unlockedIds)
    expect(unlocked.length).toBe(1)
    expect(unlocked[0].id).toBe('verdant_woods')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/data/zones.test.ts
```

Expected: FAIL - module not found

**Step 3: Create data/zones.ts**

```typescript
import type { Zone } from '~~/types/game'

export const ZONES: Record<string, Zone> = {
  verdant_woods: {
    id: 'verdant_woods',
    name: 'Verdant Woods',
    description: 'A peaceful forest, perfect for beginners. Watch out for angry squirrels.',
    type: 'forest',
    minPower: 0,
    unlocked: true,
    minDurationMinutes: 15,
    maxDurationMinutes: 30,
    baseXp: 50,
    baseGold: 25,
    lootTable: [
      { equipmentTemplateId: 'wooden_sword', dropChance: 0.3, minItemLevel: 1, maxItemLevel: 5 },
      { equipmentTemplateId: 'leather_armor', dropChance: 0.2, minItemLevel: 1, maxItemLevel: 5 },
    ],
    possibleEvents: [
      'found_mushrooms',
      'angry_squirrel',
      'lost_traveler',
      'hidden_clearing',
    ],
  },

  goblin_caves: {
    id: 'goblin_caves',
    name: 'Goblin Caves',
    description: 'Dark tunnels full of goblins and their questionable treasure hoards.',
    type: 'cave',
    minPower: 100,
    unlocked: false,
    minDurationMinutes: 30,
    maxDurationMinutes: 60,
    baseXp: 100,
    baseGold: 60,
    lootTable: [
      { equipmentTemplateId: 'iron_sword', dropChance: 0.25, minItemLevel: 5, maxItemLevel: 10 },
      { equipmentTemplateId: 'chain_armor', dropChance: 0.2, minItemLevel: 5, maxItemLevel: 10 },
      { equipmentTemplateId: 'goblin_ring', dropChance: 0.1, minItemLevel: 5, maxItemLevel: 10 },
    ],
    possibleEvents: [
      'goblin_ambush',
      'shiny_distraction',
      'cave_in',
      'goblin_merchant',
    ],
  },

  misty_swamp: {
    id: 'misty_swamp',
    name: 'Misty Swamp',
    description: 'A foggy wetland where things squelch ominously.',
    type: 'swamp',
    minPower: 200,
    unlocked: false,
    minDurationMinutes: 45,
    maxDurationMinutes: 90,
    baseXp: 175,
    baseGold: 100,
    lootTable: [
      { equipmentTemplateId: 'swamp_staff', dropChance: 0.2, minItemLevel: 10, maxItemLevel: 15 },
      { equipmentTemplateId: 'toad_boots', dropChance: 0.15, minItemLevel: 10, maxItemLevel: 15 },
    ],
    possibleEvents: [
      'quicksand',
      'will_o_wisp',
      'frog_choir',
      'sunken_ruins',
    ],
  },

  ancient_ruins: {
    id: 'ancient_ruins',
    name: 'Ancient Ruins',
    description: 'Crumbling temples full of traps and treasure. Mostly traps.',
    type: 'ruins',
    minPower: 350,
    unlocked: false,
    minDurationMinutes: 60,
    maxDurationMinutes: 120,
    baseXp: 300,
    baseGold: 180,
    lootTable: [
      { equipmentTemplateId: 'ancient_blade', dropChance: 0.15, minItemLevel: 15, maxItemLevel: 25 },
      { equipmentTemplateId: 'relic_amulet', dropChance: 0.1, minItemLevel: 15, maxItemLevel: 25 },
    ],
    possibleEvents: [
      'dart_trap',
      'puzzle_door',
      'ghost_librarian',
      'treasure_mimic',
    ],
  },

  scorching_desert: {
    id: 'scorching_desert',
    name: 'Scorching Desert',
    description: 'Endless sand, relentless sun, and creatures that somehow thrive here.',
    type: 'desert',
    minPower: 500,
    unlocked: false,
    minDurationMinutes: 60,
    maxDurationMinutes: 120,
    baseXp: 400,
    baseGold: 250,
    lootTable: [
      { equipmentTemplateId: 'flame_scimitar', dropChance: 0.12, minItemLevel: 20, maxItemLevel: 30 },
      { equipmentTemplateId: 'sun_shield', dropChance: 0.1, minItemLevel: 20, maxItemLevel: 30 },
    ],
    possibleEvents: [
      'sandstorm',
      'oasis_mirage',
      'buried_temple',
      'friendly_caravan',
    ],
  },
}

export function getZoneById(id: string): Zone | undefined {
  return ZONES[id]
}

export function getUnlockedZones(unlockedIds: string[]): Zone[] {
  return Object.values(ZONES).filter(zone =>
    zone.unlocked || unlockedIds.includes(zone.id)
  )
}

export function getZonesForPower(power: number): Zone[] {
  return Object.values(ZONES).filter(zone => zone.minPower <= power)
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/data/zones.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add data/zones.ts tests/data/zones.test.ts
git commit -m "feat: add zone definitions"
```

---

### Task 12: Create Equipment Template Data

**Files:**
- Create: `app/data/equipment.ts`
- Create: `tests/data/equipment.test.ts`

**Step 1: Write test for equipment data**

Create `tests/data/equipment.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { EQUIPMENT_TEMPLATES, getEquipmentTemplateById, generateEquipment } from '~/data/equipment'

describe('Equipment Data', () => {
  it('should have equipment templates', () => {
    expect(Object.keys(EQUIPMENT_TEMPLATES).length).toBeGreaterThan(0)
  })

  it('should return template by id', () => {
    const template = getEquipmentTemplateById('wooden_sword')
    expect(template).toBeDefined()
    expect(template?.name).toBe('Wooden Sword')
    expect(template?.slot).toBe('weapon')
  })

  it('generateEquipment should create equipment with correct item level', () => {
    const equipment = generateEquipment('wooden_sword', 10)
    expect(equipment.itemLevel).toBe(10)
    expect(equipment.slot).toBe('weapon')
    expect(equipment.gearScore).toBeGreaterThan(0)
  })

  it('generateEquipment should scale stats with item level', () => {
    const lowLevel = generateEquipment('wooden_sword', 1)
    const highLevel = generateEquipment('wooden_sword', 50)
    expect(highLevel.attack).toBeGreaterThan(lowLevel.attack)
    expect(highLevel.gearScore).toBeGreaterThan(lowLevel.gearScore)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/data/equipment.test.ts
```

Expected: FAIL - module not found

**Step 3: Create data/equipment.ts**

```typescript
import type { Equipment, EquipmentSlot, EquipmentRarity } from '~~/types/game'

export interface EquipmentTemplate {
  id: string
  name: string
  slot: EquipmentSlot
  baseRarity: EquipmentRarity
  // Base stats at item level 1
  baseAttack: number
  baseDefense: number
  baseSpeed: number
  baseLuck: number
  // Set bonus (optional)
  setId?: string
  // Flavor
  description: string
}

export const EQUIPMENT_TEMPLATES: Record<string, EquipmentTemplate> = {
  // === WEAPONS ===
  wooden_sword: {
    id: 'wooden_sword',
    name: 'Wooden Sword',
    slot: 'weapon',
    baseRarity: 'common',
    baseAttack: 5,
    baseDefense: 0,
    baseSpeed: 1,
    baseLuck: 0,
    description: 'A training sword. Still hurts if you hit hard enough.',
  },
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    slot: 'weapon',
    baseRarity: 'uncommon',
    baseAttack: 10,
    baseDefense: 0,
    baseSpeed: 0,
    baseLuck: 0,
    description: 'A reliable sword. Nothing fancy, but it gets the job done.',
  },
  ancient_blade: {
    id: 'ancient_blade',
    name: 'Ancient Blade',
    slot: 'weapon',
    baseRarity: 'rare',
    baseAttack: 18,
    baseDefense: 2,
    baseSpeed: 3,
    baseLuck: 2,
    description: 'A blade from a forgotten era. Still sharp after millennia.',
  },
  flame_scimitar: {
    id: 'flame_scimitar',
    name: 'Flame Scimitar',
    slot: 'weapon',
    baseRarity: 'epic',
    baseAttack: 25,
    baseDefense: 0,
    baseSpeed: 5,
    baseLuck: 0,
    description: 'A curved blade that burns with eternal fire.',
  },
  swamp_staff: {
    id: 'swamp_staff',
    name: 'Swamp Staff',
    slot: 'weapon',
    baseRarity: 'uncommon',
    baseAttack: 8,
    baseDefense: 3,
    baseSpeed: 0,
    baseLuck: 5,
    description: 'A gnarled staff that smells faintly of pond water.',
  },

  // === ARMOR ===
  leather_armor: {
    id: 'leather_armor',
    name: 'Leather Armor',
    slot: 'armor',
    baseRarity: 'common',
    baseAttack: 0,
    baseDefense: 5,
    baseSpeed: 1,
    baseLuck: 0,
    description: 'Basic protection. Squeaks when you move.',
  },
  chain_armor: {
    id: 'chain_armor',
    name: 'Chain Armor',
    slot: 'armor',
    baseRarity: 'uncommon',
    baseAttack: 0,
    baseDefense: 12,
    baseSpeed: -1,
    baseLuck: 0,
    description: 'Heavy but protective. Jingles constantly.',
  },

  // === BOOTS ===
  toad_boots: {
    id: 'toad_boots',
    name: 'Toad Boots',
    slot: 'boots',
    baseRarity: 'uncommon',
    baseAttack: 0,
    baseDefense: 3,
    baseSpeed: 8,
    baseLuck: 2,
    description: 'Made from swamp toads. Surprisingly comfortable.',
  },

  // === ACCESSORIES ===
  goblin_ring: {
    id: 'goblin_ring',
    name: 'Goblin Ring',
    slot: 'accessory1',
    baseRarity: 'uncommon',
    baseAttack: 3,
    baseDefense: 0,
    baseSpeed: 2,
    baseLuck: 5,
    description: 'Stolen from a goblin. They steal from everyone, so it\'s fine.',
  },
  relic_amulet: {
    id: 'relic_amulet',
    name: 'Relic Amulet',
    slot: 'accessory1',
    baseRarity: 'rare',
    baseAttack: 5,
    baseDefense: 5,
    baseSpeed: 5,
    baseLuck: 5,
    description: 'An ancient amulet humming with power.',
  },
  sun_shield: {
    id: 'sun_shield',
    name: 'Sun Shield',
    slot: 'accessory2',
    baseRarity: 'epic',
    baseAttack: 0,
    baseDefense: 20,
    baseSpeed: 0,
    baseLuck: 3,
    description: 'A shield blessed by the desert sun. Blindingly shiny.',
  },
}

export function getEquipmentTemplateById(id: string): EquipmentTemplate | undefined {
  return EQUIPMENT_TEMPLATES[id]
}

// Calculate gear score from stats
function calculateGearScore(attack: number, defense: number, speed: number, luck: number): number {
  return Math.round(attack * 1.2 + defense * 1.0 + speed * 0.8 + luck * 0.5)
}

// Scale stat by item level (1.5% per level)
function scaleStatByLevel(baseStat: number, itemLevel: number): number {
  const multiplier = 1 + (itemLevel - 1) * 0.015
  return Math.round(baseStat * multiplier)
}

// Rarity multipliers
const RARITY_MULTIPLIERS: Record<EquipmentRarity, number> = {
  common: 1.0,
  uncommon: 1.15,
  rare: 1.35,
  epic: 1.6,
  legendary: 2.0,
  mythic: 2.5,
}

export function generateEquipment(templateId: string, itemLevel: number, rarity?: EquipmentRarity): Equipment {
  const template = EQUIPMENT_TEMPLATES[templateId]
  if (!template) {
    throw new Error(`Unknown equipment template: ${templateId}`)
  }

  const finalRarity = rarity || template.baseRarity
  const rarityMult = RARITY_MULTIPLIERS[finalRarity]

  const attack = Math.round(scaleStatByLevel(template.baseAttack, itemLevel) * rarityMult)
  const defense = Math.round(scaleStatByLevel(template.baseDefense, itemLevel) * rarityMult)
  const speed = Math.round(scaleStatByLevel(template.baseSpeed, itemLevel) * rarityMult)
  const luck = Math.round(scaleStatByLevel(template.baseLuck, itemLevel) * rarityMult)
  const gearScore = calculateGearScore(attack, defense, speed, luck)

  return {
    id: crypto.randomUUID(),
    name: template.name,
    slot: template.slot,
    rarity: finalRarity,
    itemLevel,
    attack,
    defense,
    speed,
    luck,
    gearScore,
    setId: template.setId,
    equippedHeroId: null,
    createdAt: new Date().toISOString(),
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/data/equipment.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add data/equipment.ts tests/data/equipment.test.ts
git commit -m "feat: add equipment templates and generation"
```

---

### Task 13: Create Hero Name Generator

**Files:**
- Create: `app/utils/heroGenerator.ts`
- Create: `tests/utils/heroGenerator.test.ts`

**Step 1: Write test for hero generator**

Create `tests/utils/heroGenerator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { generateHeroName, generateHero, getTraitCountForRarity } from '~/utils/heroGenerator'

describe('Hero Generator', () => {
  describe('generateHeroName', () => {
    it('should generate a name', () => {
      const name = generateHeroName()
      expect(name).toBeDefined()
      expect(name.length).toBeGreaterThan(0)
    })

    it('should generate different names', () => {
      const names = new Set()
      for (let i = 0; i < 20; i++) {
        names.add(generateHeroName())
      }
      // Should have at least some variety
      expect(names.size).toBeGreaterThan(5)
    })
  })

  describe('getTraitCountForRarity', () => {
    it('common heroes should have 1-2 traits', () => {
      for (let i = 0; i < 10; i++) {
        const count = getTraitCountForRarity('common')
        expect(count).toBeGreaterThanOrEqual(1)
        expect(count).toBeLessThanOrEqual(2)
      }
    })

    it('legendary heroes should have 3-4 traits', () => {
      for (let i = 0; i < 10; i++) {
        const count = getTraitCountForRarity('legendary')
        expect(count).toBeGreaterThanOrEqual(3)
        expect(count).toBeLessThanOrEqual(4)
      }
    })
  })

  describe('generateHero', () => {
    it('should generate a valid hero', () => {
      const hero = generateHero()
      expect(hero.id).toBeDefined()
      expect(hero.name).toBeDefined()
      expect(hero.rarity).toBeDefined()
      expect(hero.level).toBe(1)
      expect(hero.traitIds.length).toBeGreaterThan(0)
    })

    it('should respect rarity distribution', () => {
      const rarities: Record<string, number> = {}
      for (let i = 0; i < 100; i++) {
        const hero = generateHero()
        rarities[hero.rarity] = (rarities[hero.rarity] || 0) + 1
      }
      // Common should be most frequent
      expect(rarities['common'] || 0).toBeGreaterThan(rarities['legendary'] || 0)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/utils/heroGenerator.test.ts
```

Expected: FAIL - module not found

**Step 3: Create utils/heroGenerator.ts**

```typescript
import type { Hero, Rarity } from '~~/types/game'
import { getRandomTraits } from '~/data/traits'

// Fantasy-parody name parts
const FIRST_NAMES = [
  // Classic fantasy
  'Aldric', 'Brynn', 'Cedric', 'Dara', 'Elwin', 'Fira', 'Grim', 'Hilda',
  'Iris', 'Jasper', 'Kira', 'Lorn', 'Mira', 'Nix', 'Orin', 'Petra',
  'Quinn', 'Rook', 'Sage', 'Thorne', 'Una', 'Vex', 'Wren', 'Xara',
  // Silly/parody
  'Stabby', 'Bonk', 'Sneaky', 'Grumble', 'Bumble', 'Sparkle', 'Mudge',
  'Twig', 'Pebble', 'Dusty', 'Crispy', 'Soggy', 'Fluffy', 'Chompy',
]

const LAST_NAMES = [
  // Classic fantasy
  'Ironforge', 'Shadowmend', 'Brightblade', 'Stormwind', 'Darkhollow',
  'Frostborn', 'Flameheart', 'Stonefist', 'Swiftarrow', 'Moonwhisper',
  // Silly/parody
  'McStabface', 'Buttsworth', 'Bonkington', 'Lootgrabber', 'Trapfinder',
  'Dooropener', 'Chestkicker', 'Goblinpunter', 'Ratslayer', 'Mudwrestler',
  'the Hungry', 'the Confused', 'the Lost', 'the Adequate', 'the Okay',
]

// Rarity weights (out of 100)
const RARITY_WEIGHTS: { rarity: Rarity; weight: number }[] = [
  { rarity: 'common', weight: 50 },
  { rarity: 'uncommon', weight: 30 },
  { rarity: 'rare', weight: 15 },
  { rarity: 'epic', weight: 4 },
  { rarity: 'legendary', weight: 1 },
]

// Trait counts by rarity
const TRAIT_COUNTS: Record<Rarity, { min: number; max: number }> = {
  common: { min: 1, max: 2 },
  uncommon: { min: 2, max: 2 },
  rare: { min: 2, max: 3 },
  epic: { min: 3, max: 3 },
  legendary: { min: 3, max: 4 },
}

// Max traits by rarity
const MAX_TRAITS: Record<Rarity, number> = {
  common: 3,
  uncommon: 4,
  rare: 5,
  epic: 6,
  legendary: 7,
}

// Base stats by rarity
const BASE_STATS: Record<Rarity, { attack: number; defense: number; speed: number; luck: number }> = {
  common: { attack: 10, defense: 10, speed: 10, luck: 5 },
  uncommon: { attack: 12, defense: 12, speed: 12, luck: 6 },
  rare: { attack: 15, defense: 15, speed: 15, luck: 8 },
  epic: { attack: 18, defense: 18, speed: 18, luck: 10 },
  legendary: { attack: 22, defense: 22, speed: 22, luck: 12 },
}

// XP required for each level (simple formula)
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1))
}

export function generateHeroName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  return `${firstName} ${lastName}`
}

export function rollRarity(): Rarity {
  const roll = Math.random() * 100
  let cumulative = 0
  for (const { rarity, weight } of RARITY_WEIGHTS) {
    cumulative += weight
    if (roll < cumulative) {
      return rarity
    }
  }
  return 'common'
}

export function getTraitCountForRarity(rarity: Rarity): number {
  const { min, max } = TRAIT_COUNTS[rarity]
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function calculateHeroPower(hero: Hero): number {
  // Base power from stats
  const statPower = hero.baseAttack + hero.baseDefense + hero.baseSpeed + hero.baseLuck
  // Level bonus (2% per level)
  const levelMultiplier = 1 + (hero.level - 1) * 0.02
  return Math.round(statPower * levelMultiplier)
}

export function generateHero(forcedRarity?: Rarity): Hero {
  const rarity = forcedRarity || rollRarity()
  const baseStats = BASE_STATS[rarity]
  const traitCount = getTraitCountForRarity(rarity)
  const traits = getRandomTraits(traitCount)

  const hero: Hero = {
    id: crypto.randomUUID(),
    name: generateHeroName(),
    rarity,
    level: 1,
    xp: 0,
    xpToNextLevel: xpForLevel(2),
    baseAttack: baseStats.attack,
    baseDefense: baseStats.defense,
    baseSpeed: baseStats.speed,
    baseLuck: baseStats.luck,
    traitIds: traits.map(t => t.id),
    maxTraits: MAX_TRAITS[rarity],
    equipment: {},
    power: 0,
    currentExpeditionId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Calculate initial power
  hero.power = calculateHeroPower(hero)

  return hero
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/utils/heroGenerator.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add utils/heroGenerator.ts tests/utils/heroGenerator.test.ts
git commit -m "feat: add hero name and stat generation"
```

---

### Task 14: Create Supabase Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: Create migration file**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  gold INTEGER NOT NULL DEFAULT 100,
  premium_currency INTEGER NOT NULL DEFAULT 0,
  hero_recruitment_today INTEGER NOT NULL DEFAULT 0,
  last_recruitment_reset TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unlocked_zone_ids TEXT[] NOT NULL DEFAULT ARRAY['verdant_woods'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Heroes table
CREATE TABLE heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL DEFAULT 100,
  base_attack INTEGER NOT NULL,
  base_defense INTEGER NOT NULL,
  base_speed INTEGER NOT NULL,
  base_luck INTEGER NOT NULL,
  trait_ids TEXT[] NOT NULL DEFAULT '{}',
  max_traits INTEGER NOT NULL DEFAULT 3,
  power INTEGER NOT NULL DEFAULT 0,
  current_expedition_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Equipment table
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slot TEXT NOT NULL CHECK (slot IN ('weapon', 'armor', 'helmet', 'boots', 'accessory1', 'accessory2')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  item_level INTEGER NOT NULL DEFAULT 1,
  attack INTEGER NOT NULL DEFAULT 0,
  defense INTEGER NOT NULL DEFAULT 0,
  speed INTEGER NOT NULL DEFAULT 0,
  luck INTEGER NOT NULL DEFAULT 0,
  gear_score INTEGER NOT NULL DEFAULT 0,
  set_id TEXT,
  equipped_hero_id UUID REFERENCES heroes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expeditions table
CREATE TABLE expeditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  hero_ids UUID[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'claimed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completes_at TIMESTAMPTZ NOT NULL,
  efficiency INTEGER,
  xp_gained INTEGER,
  gold_gained INTEGER,
  loot_ids UUID[],
  log JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expedition logs (for history)
CREATE TABLE expedition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  expedition_id UUID NOT NULL REFERENCES expeditions(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  hero_ids UUID[] NOT NULL,
  efficiency INTEGER NOT NULL,
  xp_gained INTEGER NOT NULL,
  gold_gained INTEGER NOT NULL,
  loot_ids UUID[],
  log JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_heroes_player_id ON heroes(player_id);
CREATE INDEX idx_equipment_player_id ON equipment(player_id);
CREATE INDEX idx_equipment_equipped_hero_id ON equipment(equipped_hero_id);
CREATE INDEX idx_expeditions_player_id ON expeditions(player_id);
CREATE INDEX idx_expeditions_status ON expeditions(status);
CREATE INDEX idx_expedition_logs_player_id ON expedition_logs(player_id);

-- Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedition_logs ENABLE ROW LEVEL SECURITY;

-- Players can only see/modify their own data
CREATE POLICY "Players can view own data" ON players
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Players can update own data" ON players
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Players can insert own data" ON players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Heroes policies
CREATE POLICY "Players can view own heroes" ON heroes
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can insert own heroes" ON heroes
  FOR INSERT WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can update own heroes" ON heroes
  FOR UPDATE USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can delete own heroes" ON heroes
  FOR DELETE USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Equipment policies
CREATE POLICY "Players can view own equipment" ON equipment
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can insert own equipment" ON equipment
  FOR INSERT WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can update own equipment" ON equipment
  FOR UPDATE USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can delete own equipment" ON equipment
  FOR DELETE USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Expeditions policies
CREATE POLICY "Players can view own expeditions" ON expeditions
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can insert own expeditions" ON expeditions
  FOR INSERT WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can update own expeditions" ON expeditions
  FOR UPDATE USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Expedition logs policies
CREATE POLICY "Players can view own expedition logs" ON expedition_logs
  FOR SELECT USING (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

CREATE POLICY "Players can insert own expedition logs" ON expedition_logs
  FOR INSERT WITH CHECK (player_id IN (SELECT id FROM players WHERE user_id = auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_heroes_updated_at
  BEFORE UPDATE ON heroes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Step 2: Commit**

```bash
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat: add initial database schema"
```

---

---

## Section 3: Hero System API & Store (Tasks 15-20)

### Task 15: Create Hero Pinia Store

**Files:**
- Create: `app/stores/heroes.ts`
- Create: `tests/stores/heroes.test.ts`

**Step 1: Write test for hero store**

Create `tests/stores/heroes.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHeroStore } from '~/stores/heroes'
import type { Hero } from '~~/types/game'

const mockHero: Hero = {
  id: 'test-hero-1',
  name: 'Test Hero',
  rarity: 'common',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  baseAttack: 10,
  baseDefense: 10,
  baseSpeed: 10,
  baseLuck: 5,
  traitIds: ['brawny'],
  maxTraits: 3,
  equipment: {},
  power: 35,
  currentExpeditionId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('Hero Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should start with empty heroes', () => {
    const store = useHeroStore()
    expect(store.heroes).toEqual([])
  })

  it('should add a hero', () => {
    const store = useHeroStore()
    store.addHero(mockHero)
    expect(store.heroes).toHaveLength(1)
    expect(store.heroes[0].id).toBe('test-hero-1')
  })

  it('should get hero by id', () => {
    const store = useHeroStore()
    store.addHero(mockHero)
    const hero = store.getHeroById('test-hero-1')
    expect(hero).toBeDefined()
    expect(hero?.name).toBe('Test Hero')
  })

  it('should get available heroes (not on expedition)', () => {
    const store = useHeroStore()
    store.addHero(mockHero)
    store.addHero({ ...mockHero, id: 'test-hero-2', currentExpeditionId: 'exp-1' })

    const available = store.availableHeroes
    expect(available).toHaveLength(1)
    expect(available[0].id).toBe('test-hero-1')
  })

  it('should update hero', () => {
    const store = useHeroStore()
    store.addHero(mockHero)
    store.updateHero('test-hero-1', { level: 5 })

    const hero = store.getHeroById('test-hero-1')
    expect(hero?.level).toBe(5)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/stores/heroes.test.ts
```

Expected: FAIL - module not found

**Step 3: Create stores/heroes.ts**

```typescript
import { defineStore } from 'pinia'
import type { Hero } from '~~/types/game'

interface HeroState {
  heroes: Hero[]
  loading: boolean
  error: string | null
}

export const useHeroStore = defineStore('heroes', {
  state: (): HeroState => ({
    heroes: [],
    loading: false,
    error: null,
  }),

  getters: {
    getHeroById: (state) => (id: string) => {
      return state.heroes.find(h => h.id === id)
    },

    availableHeroes: (state) => {
      return state.heroes.filter(h => h.currentExpeditionId === null)
    },

    heroesOnExpedition: (state) => {
      return state.heroes.filter(h => h.currentExpeditionId !== null)
    },

    totalPower: (state) => {
      return state.heroes.reduce((sum, h) => sum + h.power, 0)
    },

    heroesByRarity: (state) => {
      return (rarity: string) => state.heroes.filter(h => h.rarity === rarity)
    },
  },

  actions: {
    addHero(hero: Hero) {
      this.heroes.push(hero)
    },

    setHeroes(heroes: Hero[]) {
      this.heroes = heroes
    },

    updateHero(id: string, updates: Partial<Hero>) {
      const index = this.heroes.findIndex(h => h.id === id)
      if (index !== -1) {
        this.heroes[index] = { ...this.heroes[index], ...updates }
      }
    },

    removeHero(id: string) {
      const index = this.heroes.findIndex(h => h.id === id)
      if (index !== -1) {
        this.heroes.splice(index, 1)
      }
    },

    setHeroExpedition(heroId: string, expeditionId: string | null) {
      this.updateHero(heroId, { currentExpeditionId: expeditionId })
    },
  },
})
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/stores/heroes.test.ts
```

Expected: All tests pass

**Step 5: Commit**

```bash
git add stores/heroes.ts tests/stores/heroes.test.ts
git commit -m "feat: add hero Pinia store"
```

---

### Task 16: Create Hero API Routes

**Files:**
- Create: `server/api/heroes/index.get.ts`
- Create: `server/api/heroes/index.post.ts`
- Create: `server/api/heroes/[id].patch.ts`

**Step 1: Create server/api/heroes/index.get.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Get player id
  const { data: player } = await client
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get heroes
  const { data: heroes, error } = await client
    .from('heroes')
    .select('*')
    .eq('player_id', player.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return heroes
})
```

**Step 2: Create server/api/heroes/index.post.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { generateHero } from '~/utils/heroGenerator'

const RECRUITMENT_COST = 50

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Check gold
  if (player.gold < RECRUITMENT_COST) {
    throw createError({ statusCode: 400, message: 'Not enough gold' })
  }

  // Generate hero
  const hero = generateHero()

  // Insert hero
  const { data: newHero, error: heroError } = await client
    .from('heroes')
    .insert({
      player_id: player.id,
      name: hero.name,
      rarity: hero.rarity,
      level: hero.level,
      xp: hero.xp,
      xp_to_next_level: hero.xpToNextLevel,
      base_attack: hero.baseAttack,
      base_defense: hero.baseDefense,
      base_speed: hero.baseSpeed,
      base_luck: hero.baseLuck,
      trait_ids: hero.traitIds,
      max_traits: hero.maxTraits,
      power: hero.power,
    })
    .select()
    .single()

  if (heroError) {
    throw createError({ statusCode: 500, message: heroError.message })
  }

  // Deduct gold
  await client
    .from('players')
    .update({ gold: player.gold - RECRUITMENT_COST })
    .eq('id', player.id)

  return {
    hero: newHero,
    goldSpent: RECRUITMENT_COST,
    remainingGold: player.gold - RECRUITMENT_COST,
  }
})
```

**Step 3: Create server/api/heroes/[id].patch.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const heroId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!heroId) {
    throw createError({ statusCode: 400, message: 'Hero ID required' })
  }

  // Get player
  const { data: player } = await client
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Verify hero belongs to player
  const { data: existingHero } = await client
    .from('heroes')
    .select('id')
    .eq('id', heroId)
    .eq('player_id', player.id)
    .single()

  if (!existingHero) {
    throw createError({ statusCode: 404, message: 'Hero not found' })
  }

  // Update hero
  const { data: updatedHero, error } = await client
    .from('heroes')
    .update(body)
    .eq('id', heroId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return updatedHero
})
```

**Step 4: Commit**

```bash
git add server/api/heroes/
git commit -m "feat: add hero API routes"
```

---

### Task 17: Create Player Initialization

**Files:**
- Create: `server/api/player/init.post.ts`
- Create: `server/api/player/index.get.ts`

**Step 1: Create server/api/player/init.post.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Check if player already exists
  const { data: existingPlayer } = await client
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existingPlayer) {
    return { message: 'Player already exists', playerId: existingPlayer.id }
  }

  // Create new player
  const { data: newPlayer, error } = await client
    .from('players')
    .insert({
      user_id: user.id,
      level: 1,
      gold: 100,
      premium_currency: 0,
      unlocked_zone_ids: ['verdant_woods'],
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { message: 'Player created', playerId: newPlayer.id }
})
```

**Step 2: Create server/api/player/index.get.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { data: player, error } = await client
    .from('players')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  return player
})
```

**Step 3: Commit**

```bash
git add server/api/player/
git commit -m "feat: add player API routes"
```

---

### Task 18: Create Game Store with Player Data

**Files:**
- Modify: `app/stores/game.ts`

**Step 1: Update stores/game.ts**

```typescript
import { defineStore } from 'pinia'

interface PlayerData {
  id: string
  level: number
  gold: number
  premiumCurrency: number
  unlockedZoneIds: string[]
}

interface GameState {
  player: PlayerData | null
  loading: boolean
  error: string | null
  initialized: boolean
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    player: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isLoggedIn: (state) => state.player !== null,
    gold: (state) => state.player?.gold ?? 0,
    canRecruitHero: (state) => (state.player?.gold ?? 0) >= 50,
    unlockedZones: (state) => state.player?.unlockedZoneIds ?? [],
  },

  actions: {
    setPlayer(player: PlayerData) {
      this.player = player
      this.initialized = true
    },

    updateGold(amount: number) {
      if (this.player) {
        this.player.gold += amount
      }
    },

    spendGold(amount: number): boolean {
      if (this.player && this.player.gold >= amount) {
        this.player.gold -= amount
        return true
      }
      return false
    },

    unlockZone(zoneId: string) {
      if (this.player && !this.player.unlockedZoneIds.includes(zoneId)) {
        this.player.unlockedZoneIds.push(zoneId)
      }
    },

    async fetchPlayer() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch('/api/player')
        this.setPlayer({
          id: data.id,
          level: data.level,
          gold: data.gold,
          premiumCurrency: data.premium_currency,
          unlockedZoneIds: data.unlocked_zone_ids,
        })
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async initPlayer() {
      try {
        await $fetch('/api/player/init', { method: 'POST' })
        await this.fetchPlayer()
      } catch (e: any) {
        this.error = e.message
      }
    },
  },
})
```

**Step 2: Commit**

```bash
git add stores/game.ts
git commit -m "feat: enhance game store with player data"
```

---

### Task 19: Create Composable for Hero Actions

**Files:**
- Create: `app/composables/useHeroes.ts`

**Step 1: Create composables/useHeroes.ts**

```typescript
import { useHeroStore } from '~/stores/heroes'
import { useGameStore } from '~/stores/game'
import type { Hero } from '~~/types/game'

export function useHeroes() {
  const heroStore = useHeroStore()
  const gameStore = useGameStore()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchHeroes() {
    loading.value = true
    error.value = null
    try {
      const heroes = await $fetch<Hero[]>('/api/heroes')
      heroStore.setHeroes(heroes.map(h => ({
        id: h.id,
        name: h.name,
        rarity: h.rarity,
        level: h.level,
        xp: h.xp,
        xpToNextLevel: h.xp_to_next_level,
        baseAttack: h.base_attack,
        baseDefense: h.base_defense,
        baseSpeed: h.base_speed,
        baseLuck: h.base_luck,
        traitIds: h.trait_ids,
        maxTraits: h.max_traits,
        equipment: {},
        power: h.power,
        currentExpeditionId: h.current_expedition_id,
        createdAt: h.created_at,
        updatedAt: h.updated_at,
      })))
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function recruitHero() {
    if (!gameStore.canRecruitHero) {
      error.value = 'Not enough gold'
      return null
    }

    loading.value = true
    error.value = null
    try {
      const result = await $fetch('/api/heroes', { method: 'POST' })

      // Add hero to store
      const hero: Hero = {
        id: result.hero.id,
        name: result.hero.name,
        rarity: result.hero.rarity,
        level: result.hero.level,
        xp: result.hero.xp,
        xpToNextLevel: result.hero.xp_to_next_level,
        baseAttack: result.hero.base_attack,
        baseDefense: result.hero.base_defense,
        baseSpeed: result.hero.base_speed,
        baseLuck: result.hero.base_luck,
        traitIds: result.hero.trait_ids,
        maxTraits: result.hero.max_traits,
        equipment: {},
        power: result.hero.power,
        currentExpeditionId: null,
        createdAt: result.hero.created_at,
        updatedAt: result.hero.updated_at,
      }
      heroStore.addHero(hero)

      // Update gold
      gameStore.updateGold(-result.goldSpent)

      return hero
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    heroes: computed(() => heroStore.heroes),
    availableHeroes: computed(() => heroStore.availableHeroes),
    loading,
    error,
    fetchHeroes,
    recruitHero,
    getHeroById: heroStore.getHeroById,
  }
}
```

**Step 2: Commit**

```bash
git add composables/useHeroes.ts
git commit -m "feat: add useHeroes composable"
```

---

### Task 20: Create Hero Card Component

**Files:**
- Create: `app/components/hero/HeroCard.vue`
- Create: `app/components/ui/RarityBadge.vue`

**Step 1: Create components/RarityBadge.vue**

```vue
<script setup lang="ts">
import type { Rarity } from '~~/types/game'

const props = defineProps<{
  rarity: Rarity
}>()

const rarityColors: Record<Rarity, string> = {
  common: 'bg-common text-gray-900',
  uncommon: 'bg-uncommon text-white',
  rare: 'bg-rare text-white',
  epic: 'bg-epic text-white',
  legendary: 'bg-legendary text-gray-900',
}

const rarityLabels: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
}
</script>

<template>
  <span
    class="px-2 py-0.5 rounded text-xs font-semibold uppercase"
    :class="rarityColors[rarity]"
  >
    {{ rarityLabels[rarity] }}
  </span>
</template>
```

**Step 2: Create components/HeroCard.vue**

```vue
<script setup lang="ts">
import type { Hero } from '~~/types/game'
import { getTraitById } from '~/data/traits'

const props = defineProps<{
  hero: Hero
  selectable?: boolean
  selected?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', hero: Hero): void
}>()

const traits = computed(() => {
  return props.hero.traitIds.map(id => getTraitById(id)).filter(Boolean)
})

const isOnExpedition = computed(() => props.hero.currentExpeditionId !== null)

function handleClick() {
  if (props.selectable && !isOnExpedition.value) {
    emit('select', props.hero)
  }
}
</script>

<template>
  <div
    class="bg-gray-800 rounded-lg p-4 border-2 transition-all"
    :class="{
      'border-gray-700': !selected,
      'border-guild-gold': selected,
      'opacity-50': isOnExpedition,
      'cursor-pointer hover:border-gray-600': selectable && !isOnExpedition,
    }"
    @click="handleClick"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-2">
      <div>
        <h3 class="font-bold text-lg">{{ hero.name }}</h3>
        <RarityBadge :rarity="hero.rarity" />
      </div>
      <div class="text-right">
        <div class="text-guild-gold font-bold">{{ hero.power }}</div>
        <div class="text-xs text-gray-400">Power</div>
      </div>
    </div>

    <!-- Level -->
    <div class="mb-3">
      <div class="flex justify-between text-sm mb-1">
        <span>Level {{ hero.level }}</span>
        <span class="text-gray-400">{{ hero.xp }}/{{ hero.xpToNextLevel }} XP</span>
      </div>
      <div class="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-quest-blue transition-all"
          :style="{ width: `${(hero.xp / hero.xpToNextLevel) * 100}%` }"
        />
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-2 text-center text-sm mb-3">
      <div>
        <div class="text-danger-red font-semibold">{{ hero.baseAttack }}</div>
        <div class="text-xs text-gray-400">ATK</div>
      </div>
      <div>
        <div class="text-quest-blue font-semibold">{{ hero.baseDefense }}</div>
        <div class="text-xs text-gray-400">DEF</div>
      </div>
      <div>
        <div class="text-success-green font-semibold">{{ hero.baseSpeed }}</div>
        <div class="text-xs text-gray-400">SPD</div>
      </div>
      <div>
        <div class="text-guild-gold font-semibold">{{ hero.baseLuck }}</div>
        <div class="text-xs text-gray-400">LCK</div>
      </div>
    </div>

    <!-- Traits -->
    <div class="flex flex-wrap gap-1">
      <span
        v-for="trait in traits"
        :key="trait!.id"
        class="px-2 py-0.5 bg-gray-700 rounded text-xs"
        :title="trait!.description"
      >
        {{ trait!.name }}
      </span>
    </div>

    <!-- Status -->
    <div v-if="isOnExpedition" class="mt-2 text-sm text-quest-blue">
      On expedition...
    </div>
  </div>
</template>
```

**Step 3: Commit**

```bash
git add components/HeroCard.vue components/RarityBadge.vue
git commit -m "feat: add HeroCard and RarityBadge components"
```

---

## Section 4: Equipment System (Tasks 21-26)

### Task 21: Create Equipment Pinia Store

**Files:**
- Create: `app/stores/equipment.ts`

**Step 1: Create stores/equipment.ts**

```typescript
import { defineStore } from 'pinia'
import type { Equipment, EquipmentSlot } from '~~/types/game'

interface EquipmentState {
  inventory: Equipment[]
  loading: boolean
  error: string | null
}

export const useEquipmentStore = defineStore('equipment', {
  state: (): EquipmentState => ({
    inventory: [],
    loading: false,
    error: null,
  }),

  getters: {
    getEquipmentById: (state) => (id: string) => {
      return state.inventory.find(e => e.id === id)
    },

    unequippedItems: (state) => {
      return state.inventory.filter(e => e.equippedHeroId === null)
    },

    getEquippedByHero: (state) => (heroId: string) => {
      return state.inventory.filter(e => e.equippedHeroId === heroId)
    },

    getUnequippedBySlot: (state) => (slot: EquipmentSlot) => {
      return state.inventory.filter(e => e.equippedHeroId === null && e.slot === slot)
    },

    totalGearScore: (state) => {
      return state.inventory.reduce((sum, e) => sum + e.gearScore, 0)
    },
  },

  actions: {
    setInventory(items: Equipment[]) {
      this.inventory = items
    },

    addEquipment(item: Equipment) {
      this.inventory.push(item)
    },

    updateEquipment(id: string, updates: Partial<Equipment>) {
      const index = this.inventory.findIndex(e => e.id === id)
      if (index !== -1) {
        this.inventory[index] = { ...this.inventory[index], ...updates }
      }
    },

    equipToHero(equipmentId: string, heroId: string) {
      this.updateEquipment(equipmentId, { equippedHeroId: heroId })
    },

    unequipFromHero(equipmentId: string) {
      this.updateEquipment(equipmentId, { equippedHeroId: null })
    },

    removeEquipment(id: string) {
      const index = this.inventory.findIndex(e => e.id === id)
      if (index !== -1) {
        this.inventory.splice(index, 1)
      }
    },
  },
})
```

**Step 2: Commit**

```bash
git add stores/equipment.ts
git commit -m "feat: add equipment Pinia store"
```

---

### Task 22: Create Equipment API Routes

**Files:**
- Create: `server/api/equipment/index.get.ts`
- Create: `server/api/equipment/equip.post.ts`
- Create: `server/api/equipment/unequip.post.ts`

**Step 1: Create server/api/equipment/index.get.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { data: player } = await client
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  const { data: equipment, error } = await client
    .from('equipment')
    .select('*')
    .eq('player_id', player.id)
    .order('gear_score', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return equipment
})
```

**Step 2: Create server/api/equipment/equip.post.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const body = await readBody(event)

  const { equipmentId, heroId } = body

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!equipmentId || !heroId) {
    throw createError({ statusCode: 400, message: 'equipmentId and heroId required' })
  }

  const { data: player } = await client
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Verify equipment belongs to player
  const { data: equipment } = await client
    .from('equipment')
    .select('*, slot')
    .eq('id', equipmentId)
    .eq('player_id', player.id)
    .single()

  if (!equipment) {
    throw createError({ statusCode: 404, message: 'Equipment not found' })
  }

  // Verify hero belongs to player
  const { data: hero } = await client
    .from('heroes')
    .select('id')
    .eq('id', heroId)
    .eq('player_id', player.id)
    .single()

  if (!hero) {
    throw createError({ statusCode: 404, message: 'Hero not found' })
  }

  // Unequip any existing item in that slot from this hero
  await client
    .from('equipment')
    .update({ equipped_hero_id: null })
    .eq('equipped_hero_id', heroId)
    .eq('slot', equipment.slot)

  // Equip the new item
  const { data: updated, error } = await client
    .from('equipment')
    .update({ equipped_hero_id: heroId })
    .eq('id', equipmentId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return updated
})
```

**Step 3: Create server/api/equipment/unequip.post.ts**

```typescript
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const body = await readBody(event)

  const { equipmentId } = body

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!equipmentId) {
    throw createError({ statusCode: 400, message: 'equipmentId required' })
  }

  const { data: player } = await client
    .from('players')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  const { data: updated, error } = await client
    .from('equipment')
    .update({ equipped_hero_id: null })
    .eq('id', equipmentId)
    .eq('player_id', player.id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return updated
})
```

**Step 4: Commit**

```bash
git add server/api/equipment/
git commit -m "feat: add equipment API routes"
```

---

### Task 23: Create Equipment Card Component

**Files:**
- Create: `app/components/equipment/EquipmentCard.vue`

**Step 1: Create components/EquipmentCard.vue**

```vue
<script setup lang="ts">
import type { Equipment, EquipmentRarity } from '~~/types/game'

const props = defineProps<{
  equipment: Equipment
  compact?: boolean
}>()

const emit = defineEmits<{
  (e: 'equip'): void
  (e: 'unequip'): void
}>()

const rarityColors: Record<EquipmentRarity, string> = {
  common: 'border-common',
  uncommon: 'border-uncommon',
  rare: 'border-rare',
  epic: 'border-epic',
  legendary: 'border-legendary',
  mythic: 'border-mythic',
}

const slotIcons: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  helmet: '⛑️',
  boots: '👢',
  accessory1: '💍',
  accessory2: '📿',
}

const isEquipped = computed(() => props.equipment.equippedHeroId !== null)
</script>

<template>
  <div
    class="bg-gray-800 rounded-lg p-3 border-2"
    :class="rarityColors[equipment.rarity]"
  >
    <div class="flex items-start gap-2">
      <span class="text-2xl">{{ slotIcons[equipment.slot] }}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h4 class="font-semibold truncate">{{ equipment.name }}</h4>
          <span class="text-xs text-gray-400">iLvl {{ equipment.itemLevel }}</span>
        </div>

        <div v-if="!compact" class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
          <div v-if="equipment.attack" class="text-danger-red">
            +{{ equipment.attack }} ATK
          </div>
          <div v-if="equipment.defense" class="text-quest-blue">
            +{{ equipment.defense }} DEF
          </div>
          <div v-if="equipment.speed" class="text-success-green">
            +{{ equipment.speed }} SPD
          </div>
          <div v-if="equipment.luck" class="text-guild-gold">
            +{{ equipment.luck }} LCK
          </div>
        </div>

        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-gray-400">
            GS: {{ equipment.gearScore }}
          </span>
          <button
            v-if="isEquipped"
            class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            @click="emit('unequip')"
          >
            Unequip
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

**Step 2: Commit**

```bash
git add components/EquipmentCard.vue
git commit -m "feat: add EquipmentCard component"
```

---

### Task 24-26: Equipment UI Integration

*(Tasks 24-26 involve integrating equipment into hero detail view and inventory page - similar patterns to above)*

---

## Section 5: Expedition System (Tasks 27-34)

### Task 27: Create Expedition Pinia Store

**Files:**
- Create: `app/stores/expeditions.ts`

**Step 1: Create stores/expeditions.ts**

```typescript
import { defineStore } from 'pinia'
import type { Expedition } from '~~/types/game'

interface ExpeditionState {
  activeExpeditions: Expedition[]
  loading: boolean
  error: string | null
}

export const useExpeditionStore = defineStore('expeditions', {
  state: (): ExpeditionState => ({
    activeExpeditions: [],
    loading: false,
    error: null,
  }),

  getters: {
    getExpeditionById: (state) => (id: string) => {
      return state.activeExpeditions.find(e => e.id === id)
    },

    completedExpeditions: (state) => {
      const now = new Date()
      return state.activeExpeditions.filter(e =>
        e.status === 'in_progress' && new Date(e.completesAt) <= now
      )
    },

    inProgressExpeditions: (state) => {
      const now = new Date()
      return state.activeExpeditions.filter(e =>
        e.status === 'in_progress' && new Date(e.completesAt) > now
      )
    },
  },

  actions: {
    setExpeditions(expeditions: Expedition[]) {
      this.activeExpeditions = expeditions
    },

    addExpedition(expedition: Expedition) {
      this.activeExpeditions.push(expedition)
    },

    updateExpedition(id: string, updates: Partial<Expedition>) {
      const index = this.activeExpeditions.findIndex(e => e.id === id)
      if (index !== -1) {
        this.activeExpeditions[index] = { ...this.activeExpeditions[index], ...updates }
      }
    },

    removeExpedition(id: string) {
      const index = this.activeExpeditions.findIndex(e => e.id === id)
      if (index !== -1) {
        this.activeExpeditions.splice(index, 1)
      }
    },
  },
})
```

**Step 2: Commit**

```bash
git add stores/expeditions.ts
git commit -m "feat: add expedition Pinia store"
```

---

### Task 28: Create Expedition API Routes

**Files:**
- Create: `server/api/expeditions/index.get.ts`
- Create: `server/api/expeditions/start.post.ts`
- Create: `server/api/expeditions/complete.post.ts`

*(Full implementation follows same patterns as hero/equipment APIs)*

---

### Task 29: Create Expedition Calculator Utility

**Files:**
- Create: `app/utils/expeditionCalculator.ts`
- Create: `tests/utils/expeditionCalculator.test.ts`

**Step 1: Write test**

```typescript
import { describe, it, expect } from 'vitest'
import { calculateEfficiency, calculateRewards, calculateExpeditionDuration } from '~/utils/expeditionCalculator'

describe('Expedition Calculator', () => {
  it('should calculate efficiency based on power ratio', () => {
    // Underpowered team
    expect(calculateEfficiency(50, 100)).toBeLessThan(100)
    expect(calculateEfficiency(50, 100)).toBeGreaterThanOrEqual(60)

    // Matched power
    expect(calculateEfficiency(100, 100)).toBe(100)

    // Overpowered team
    expect(calculateEfficiency(200, 100)).toBeGreaterThan(100)
    expect(calculateEfficiency(200, 100)).toBeLessThanOrEqual(150)
  })

  it('should calculate rewards based on efficiency', () => {
    const baseRewards = { xp: 100, gold: 50 }

    const lowEfficiency = calculateRewards(baseRewards, 60)
    expect(lowEfficiency.xp).toBe(60)
    expect(lowEfficiency.gold).toBe(30)

    const highEfficiency = calculateRewards(baseRewards, 150)
    expect(highEfficiency.xp).toBe(150)
    expect(highEfficiency.gold).toBe(75)
  })
})
```

**Step 2: Create utils/expeditionCalculator.ts**

```typescript
import type { Hero, Zone, ExpeditionLogEntry } from '~~/types/game'
import { getTraitById } from '~/data/traits'

export function calculateTeamPower(heroes: Hero[], zone: Zone): number {
  let totalPower = 0

  for (const hero of heroes) {
    let heroPower = hero.power

    // Apply conditional trait bonuses
    for (const traitId of hero.traitIds) {
      const trait = getTraitById(traitId)
      if (trait?.type === 'conditional' && trait.condition?.zoneType === zone.type) {
        heroPower *= (1 + (trait.conditionBonus || 0) / 100)
      }
    }

    totalPower += heroPower
  }

  return Math.round(totalPower)
}

export function calculateEfficiency(teamPower: number, requiredPower: number): number {
  const ratio = teamPower / Math.max(requiredPower, 1)

  // Efficiency formula: 60% minimum, 150% maximum
  // Linear scaling between 0.5x and 2x power ratio
  if (ratio <= 0.5) return 60
  if (ratio >= 2) return 150

  // Linear interpolation
  const efficiency = 60 + (ratio - 0.5) * (90 / 1.5)
  return Math.round(Math.min(150, Math.max(60, efficiency)))
}

export function calculateRewards(
  baseRewards: { xp: number; gold: number },
  efficiency: number
): { xp: number; gold: number } {
  const multiplier = efficiency / 100
  return {
    xp: Math.round(baseRewards.xp * multiplier),
    gold: Math.round(baseRewards.gold * multiplier),
  }
}

export function calculateExpeditionDuration(zone: Zone): number {
  // Returns duration in milliseconds
  const minMs = zone.minDurationMinutes * 60 * 1000
  const maxMs = zone.maxDurationMinutes * 60 * 1000
  return Math.round(minMs + Math.random() * (maxMs - minMs))
}

export function generateExpeditionLog(
  heroes: Hero[],
  zone: Zone,
  efficiency: number,
  rewards: { xp: number; gold: number; loot: any[] }
): ExpeditionLogEntry[] {
  const log: ExpeditionLogEntry[] = []
  const timestamp = new Date().toISOString()

  // Starting message
  log.push({
    timestamp,
    type: 'event',
    text: `The party entered ${zone.name}.`,
  })

  // Hero reactions based on traits
  for (const hero of heroes) {
    for (const traitId of hero.traitIds) {
      const trait = getTraitById(traitId)
      if (trait?.reactions?.onEvent && Math.random() < 0.3) {
        const reaction = trait.reactions.onEvent[
          Math.floor(Math.random() * trait.reactions.onEvent.length)
        ]
        log.push({
          timestamp,
          type: 'reaction',
          text: reaction.replace('{hero}', hero.name),
          heroId: hero.id,
        })
        break // One reaction per hero
      }
    }
  }

  // Combat encounter
  log.push({
    timestamp,
    type: 'combat',
    text: `The party encountered hostile creatures!`,
  })

  // Combat reactions
  for (const hero of heroes) {
    for (const traitId of hero.traitIds) {
      const trait = getTraitById(traitId)
      if (trait?.reactions?.onCombat && Math.random() < 0.4) {
        const reaction = trait.reactions.onCombat[
          Math.floor(Math.random() * trait.reactions.onCombat.length)
        ]
        log.push({
          timestamp,
          type: 'reaction',
          text: reaction.replace('{hero}', hero.name),
          heroId: hero.id,
        })
        break
      }
    }
  }

  // Loot found
  if (rewards.loot.length > 0 || rewards.gold > 0) {
    log.push({
      timestamp,
      type: 'loot',
      text: `Found ${rewards.gold} gold and ${rewards.loot.length} item(s).`,
    })

    // Loot reactions
    for (const hero of heroes) {
      for (const traitId of hero.traitIds) {
        const trait = getTraitById(traitId)
        if (trait?.reactions?.onLoot && Math.random() < 0.3) {
          const reaction = trait.reactions.onLoot[
            Math.floor(Math.random() * trait.reactions.onLoot.length)
          ]
          log.push({
            timestamp,
            type: 'reaction',
            text: reaction.replace('{hero}', hero.name),
            heroId: hero.id,
          })
          break
        }
      }
    }
  }

  // Completion message
  log.push({
    timestamp,
    type: 'event',
    text: `Expedition complete! Efficiency: ${efficiency}%`,
  })

  return log
}
```

**Step 3: Commit**

```bash
git add utils/expeditionCalculator.ts tests/utils/expeditionCalculator.test.ts
git commit -m "feat: add expedition calculation utilities"
```

---

*(Tasks 30-34 continue with Zone selection UI, Expedition progress component, Expedition completion flow)*

---

## Section 6: Expedition Logs (Tasks 35-38)

### Task 35: Create Expedition Log Component

**Files:**
- Create: `app/components/expedition/ExpeditionLog.vue`

```vue
<script setup lang="ts">
import type { ExpeditionLogEntry } from '~~/types/game'

const props = defineProps<{
  log: ExpeditionLogEntry[]
}>()

const typeIcons: Record<string, string> = {
  combat: '⚔️',
  loot: '💰',
  event: '📜',
  reaction: '💬',
}

const typeColors: Record<string, string> = {
  combat: 'text-danger-red',
  loot: 'text-guild-gold',
  event: 'text-gray-300',
  reaction: 'text-quest-blue',
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(entry, index) in log"
      :key="index"
      class="flex items-start gap-2 text-sm"
    >
      <span class="flex-shrink-0">{{ typeIcons[entry.type] }}</span>
      <p :class="typeColors[entry.type]">{{ entry.text }}</p>
    </div>
  </div>
</template>
```

---

## Section 7: Core UI Pages (Tasks 39-45)

### Task 39: Create Heroes Page

**Files:**
- Modify: `app/pages/index.vue`

```vue
<script setup lang="ts">
const { heroes, loading, error, fetchHeroes, recruitHero } = useHeroes()
const gameStore = useGameStore()

const showRecruitModal = ref(false)
const recruitedHero = ref(null)

onMounted(() => {
  fetchHeroes()
})

async function handleRecruit() {
  const hero = await recruitHero()
  if (hero) {
    recruitedHero.value = hero
    showRecruitModal.value = true
  }
}
</script>

<template>
  <div class="pb-20">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Your Heroes</h2>
      <button
        class="px-4 py-2 bg-guild-gold text-gray-900 font-semibold rounded-lg disabled:opacity-50"
        :disabled="!gameStore.canRecruitHero || loading"
        @click="handleRecruit"
      >
        Recruit (50g)
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      Loading heroes...
    </div>

    <div v-else-if="heroes.length === 0" class="text-center py-8 text-gray-400">
      <p class="mb-4">No heroes yet. Recruit your first adventurer!</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <HeroCard
        v-for="hero in heroes"
        :key="hero.id"
        :hero="hero"
      />
    </div>

    <!-- Recruit Success Modal -->
    <Teleport to="body">
      <div
        v-if="showRecruitModal && recruitedHero"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click="showRecruitModal = false"
      >
        <div
          class="bg-gray-800 rounded-lg p-6 max-w-md w-full"
          @click.stop
        >
          <h3 class="text-xl font-bold mb-4 text-center">New Hero Recruited!</h3>
          <HeroCard :hero="recruitedHero" />
          <button
            class="w-full mt-4 px-4 py-2 bg-guild-gold text-gray-900 font-semibold rounded-lg"
            @click="showRecruitModal = false"
          >
            Awesome!
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
```

---

### Task 40-45: Remaining UI Pages

*(Tasks for Expeditions page, Inventory page, Hero detail modal, Zone selection, Expedition progress, etc. follow similar patterns)*

---

## Summary

**Total Tasks:** 45
**Sections:**
1. Project Setup (8 tasks)
2. Database & Types (6 tasks)
3. Hero System (6 tasks)
4. Equipment System (6 tasks)
5. Expedition System (8 tasks)
6. Expedition Logs (4 tasks)
7. Core UI (7 tasks)

**Key Deliverables:**
- Fully functional hero recruitment with random generation
- Zone expeditions with timed completion
- Equipment drops and inventory management
- Expedition logs with trait-flavored reactions
- Mobile-first responsive UI

**After completing this plan, the game will have:**
- A working core loop players can engage with
- Hero collection with meaningful variety (traits, rarity)
- Progression through leveling and gear
- The foundation for Phase 2 (monster capture, dungeon building)
