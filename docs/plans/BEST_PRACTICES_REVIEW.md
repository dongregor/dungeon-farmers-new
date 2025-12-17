# Implementation Plans - Best Practices Review

**Date:** 2024-12-14  
**Reviewed:** All files in `docs/plans/`  
**Against:** Nuxt 4, Pinia, Supabase official documentation
**Status:** ✅ Fixes applied to all plan files

---

## Summary

The implementation plans have been updated to follow Nuxt 4 and library best practices.

**Fixes Applied:**
- ✅ Updated all file paths to use Nuxt 4's `app/` directory structure
- ✅ Fixed Pinia store actions to use `$fetch` instead of `useFetch`
- ✅ Simplified Tailwind configuration to use `@nuxtjs/tailwindcss` module
- ✅ Updated type imports to use `~~/types` for root-level types
- ✅ Added best practices notes to all plan file headers

| Category | Status | Priority |
|----------|--------|----------|
| Directory Structure | ⚠️ Needs Update | High |
| Pinia Store Actions | ❌ Incorrect | High |
| Server Routes | ✅ Correct | - |
| TypeScript Types | ⚠️ Minor Issues | Medium |
| Composables | ⚠️ Needs Update | Medium |

---

## Issue 1: Directory Structure (High Priority)

### Problem

The plans use **Nuxt 3 directory structure** (files at root), but Nuxt 4 defaults to the new `app/` directory structure.

**Plans specify:**
```
components/
stores/
composables/
utils/
types/
data/
pages/
```

**Nuxt 4 expects:**
```
app/
  components/
  composables/
  utils/
  pages/
  layouts/
  plugins/
  app.vue
server/
  api/
  utils/
  middleware/
types/          # Can stay at root (shared types)
```

### Solution

Update all file paths in the plans to use the Nuxt 4 structure:

| Old Path | New Path |
|----------|----------|
| `components/hero/HeroCard.vue` | `app/components/hero/HeroCard.vue` |
| `stores/heroes.ts` | `app/stores/heroes.ts` |
| `composables/useTimer.ts` | `app/composables/useTimer.ts` |
| `utils/heroGenerator.ts` | `app/utils/heroGenerator.ts` |
| `pages/index.vue` | `app/pages/index.vue` |
| `data/zones.ts` | `app/data/zones.ts` or `app/utils/zones.ts` |
| `server/api/*` | `server/api/*` (stays the same) |
| `server/utils/*` | `server/utils/*` (stays the same) |
| `types/*` | `types/` or `shared/types/` (can stay at root) |

### Documentation Reference

From [Nuxt 4 Upgrade Guide](https://nuxt.com/docs/getting-started/upgrade#new-directory-structure):
> "The new Nuxt default `srcDir` is `app/` by default, and most things are resolved from there."

---

## Issue 2: useFetch in Pinia Store Actions (High Priority)

### Problem

The plans use `useFetch` inside Pinia store actions. This is **incorrect**.

**From `2024-12-14-implementation-plan.md` Task 19:**
```typescript
// ❌ WRONG - useFetch is a composable, can't be used in store actions
export const useHeroStore = defineStore('heroes', {
  actions: {
    async fetchHeroes() {
      this.loading = true
      try {
        const { data } = await useFetch('/api/heroes')  // ❌ ERROR
        this.heroes = data.value || []
      } finally {
        this.loading = false
      }
    },
  }
})
```

### Why This is Wrong

From [Nuxt Documentation on $fetch](https://nuxt.com/docs/api/utils/dollarfetch):
> "`useFetch` should be used in setup context. For actions or event handlers, use `$fetch` instead."

`useFetch` is a **composable** that:
- Requires the Nuxt instance context
- Is designed for SSR hydration (prevents double-fetch)
- Only works in `<script setup>`, `setup()`, or composables

### Solution

Use `$fetch` in store actions instead:

```typescript
// ✅ CORRECT - use $fetch in store actions
export const useHeroStore = defineStore('heroes', {
  actions: {
    async fetchHeroes() {
      this.loading = true
      try {
        this.heroes = await $fetch('/api/heroes')  // ✅ $fetch works in actions
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.loading = false
      }
    },

    async recruitHero(tavernHeroId: string) {
      const hero = await $fetch('/api/heroes/recruit', {
        method: 'POST',
        body: { tavernHeroId }
      })
      this.heroes.push(hero)
      return hero
    },

    async updateHero(hero: Partial<Hero> & { id: string }) {
      const updated = await $fetch(`/api/heroes/${hero.id}`, {
        method: 'PATCH',
        body: hero
      })
      const index = this.heroes.findIndex(h => h.id === hero.id)
      if (index !== -1) {
        this.heroes[index] = updated
      }
    },
  }
})
```

### Alternative: Setup Store Syntax

For more complex stores, consider Pinia's Setup Store syntax:

```typescript
// ✅ Setup Store syntax (more flexible)
export const useHeroStore = defineStore('heroes', () => {
  const heroes = ref<Hero[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getHeroById = computed(() => (id: string) =>
    heroes.value.find(h => h.id === id)
  )

  const availableHeroes = computed(() =>
    heroes.value.filter(h => !h.isOnExpedition && !h.isStationed)
  )

  async function fetchHeroes() {
    loading.value = true
    try {
      heroes.value = await $fetch('/api/heroes')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function recruitHero(tavernHeroId: string) {
    const hero = await $fetch('/api/heroes/recruit', {
      method: 'POST',
      body: { tavernHeroId }
    })
    heroes.value.push(hero)
    return hero
  }

  return {
    heroes,
    loading,
    error,
    getHeroById,
    availableHeroes,
    fetchHeroes,
    recruitHero,
  }
})
```

### Documentation Reference

From [Pinia Core Concepts](https://pinia.vuejs.org/core-concepts/):
> "Setup stores bring more flexibility... you can create watchers within a store and freely use any composable."

---

## Issue 3: Tailwind CSS Configuration (Medium Priority)

### Problem

Plans show manual Tailwind setup, but `@nuxtjs/tailwindcss` is already installed and handles this automatically.

**From `2024-12-14-phase1-mvp-core-loop.md` Task 3:**
```typescript
// ❌ Manual postcss config not needed with @nuxtjs/tailwindcss
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
```

### Solution

With `@nuxtjs/tailwindcss`, just add the module:

```typescript
// ✅ Simpler with Nuxt Tailwind module
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  // Tailwind auto-configures postcss
})
```

The `tailwind.config.js` content paths are also auto-configured.

---

## Issue 4: Server Utils Auto-Import (Minor)

### Correct ✅

The plans correctly place server utilities in `server/utils/`. Nuxt 4 auto-imports from this directory.

From [Nuxt 4 Server Docs](https://nuxt.com/docs/guide/directory-structure/server):
> "Nuxt auto-imports exported functions and variables from `server/utils/`."

---

## Issue 5: Type Imports (Minor)

### Current

```typescript
import type { Hero } from '~/types'
```

### Nuxt 4 Consideration

With Nuxt 4's new directory structure, `~` resolves to `app/`. If types are at root, use:

```typescript
// If types/ is at root (outside app/)
import type { Hero } from '~~/types'  // ~~ = rootDir

// Or configure in nuxt.config.ts
alias: {
  '@types': './types'
}
// Then use:
import type { Hero } from '@types'
```

### Recommendation

Keep shared types in root `types/` directory (or `shared/types/`) and configure an alias.

---

## Issue 6: Composable Context Warnings (Medium Priority)

### Problem

Some planned composables use Nuxt composables at the top level (outside functions).

**Example of what to avoid:**
```typescript
// ❌ WRONG - useRuntimeConfig called outside composable function
const config = useRuntimeConfig()

export const useMyComposable = () => {
  // ...
}
```

### Solution

Always call Nuxt composables inside the composable function:

```typescript
// ✅ CORRECT - useRuntimeConfig called inside composable
export const useMyComposable = () => {
  const config = useRuntimeConfig()
  // ...
}
```

From [Nuxt Auto-Imports Docs](https://nuxt.com/docs/guide/concepts/auto-imports):
> "You cannot use composables outside a Nuxt plugin, Nuxt route middleware or Vue setup function."

---

## Issue 7: Server Route Validation (Best Practice)

### Current

Plans show manual parameter validation:

```typescript
export default defineEventHandler((event) => {
  const id = event.context.params?.id
  if (!id) throw createError({ statusCode: 400, message: 'ID required' })
})
```

### Best Practice

Use `getValidatedRouterParams` with Zod for type-safe validation:

```typescript
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string().uuid()
  }).parse)
  
  // id is now typed and validated
})
```

Similarly for body:

```typescript
const body = await readValidatedBody(event, z.object({
  tavernHeroId: z.string().uuid()
}).parse)
```

### Add Zod Dependency

```bash
npm install zod
```

---

## Recommended Changes to Plans

### 1. Update Directory Structure

All plans should reference:
- `app/components/` instead of `components/`
- `app/composables/` instead of `composables/`
- `app/stores/` instead of `stores/`
- `app/utils/` instead of `utils/` (for client-side)
- `app/pages/` instead of `pages/`
- `app/data/` instead of `data/` (or move to `app/utils/`)

### 2. Fix Pinia Store Actions

Replace all `useFetch` calls with `$fetch` in store actions.

### 3. Add Zod for Validation

Add runtime validation to server routes using Zod.

### 4. Simplify Tailwind Setup

Remove manual postcss configuration, rely on `@nuxtjs/tailwindcss` module.

---

## Checklist for Implementation

**Plan files updated:** ✅
- [x] Update all file path references in plans
- [x] Replace `useFetch` with `$fetch` in all store examples
- [x] Update Tailwind config examples for new structure
- [x] Add best practices notes to all plan headers

**When starting development:**
- [ ] Create `app/` directory structure
- [ ] Move client-side code into `app/`
- [ ] Keep `server/`, `types/`, `public/` at root
- [ ] Install Zod for server route validation: `npm install zod`
- [ ] Configure type alias in `nuxt.config.ts` if needed

---

## Nuxt 4 Auto-Imports Guide

### What Gets Auto-Imported

Nuxt automatically imports from these directories:

| Directory | Auto-Imported | Available In |
|-----------|---------------|--------------|
| `app/components/` | Vue components | Templates |
| `app/composables/` | Vue composables | `.vue`, `.ts`, `.js` files |
| `app/utils/` | Utility functions | `.vue`, `.ts`, `.js` files |
| `server/utils/` | Server utilities | `server/` directory only |
| `shared/utils/` | Shared utilities | Both client and server |
| `shared/types/` | Shared types | Both client and server |

### Built-in Auto-Imports

These are available everywhere without importing:

```typescript
// Vue Reactivity
ref, reactive, computed, watch, watchEffect

// Vue Lifecycle
onMounted, onUnmounted, onBeforeMount, etc.

// Nuxt Composables
useFetch, useAsyncData, useState, useRuntimeConfig,
useRoute, useRouter, useHead, useCookie, etc.

// Nuxt Utilities
$fetch, navigateTo, defineNuxtComponent, etc.
```

### File Scanning Rules

**Top-level only by default:**

```
app/composables/
├── useFoo.ts          ✅ Scanned
├── useBar.ts          ✅ Scanned
├── index.ts           ✅ Scanned
└── nested/
    └── useDeep.ts     ❌ NOT scanned
```

**To include nested directories, re-export from index.ts:**

```typescript
// app/composables/index.ts
export { useDeep } from './nested/useDeep'
```

**Or configure in nuxt.config.ts:**

```typescript
export default defineNuxtConfig({
  imports: {
    dirs: [
      'composables',
      'composables/**',  // Scan all subdirectories
    ],
  },
})
```

---

## Naming Conventions

### Composables

| Pattern | Example | Auto-Import Name |
|---------|---------|------------------|
| Named export | `export const useFoo = () => {}` | `useFoo` |
| Default export | `export default function() {}` | camelCase of filename |
| File: `useFoo.ts` | default export | `useFoo` |
| File: `use-foo.ts` | default export | `useFoo` |

**Convention:** Prefix composables with `use` (e.g., `useHero`, `useExpedition`).

### Utils

| Pattern | Example | Auto-Import Name |
|---------|---------|------------------|
| Named export | `export const formatGold = () => {}` | `formatGold` |
| Default export | `export default function() {}` | camelCase of filename |
| File: `heroGenerator.ts` | default export | `heroGenerator` |
| File: `hero-generator.ts` | default export | `heroGenerator` |

### Components

Components are named based on **directory path + filename**:

```
app/components/
├── Button.vue              → <Button />
├── hero/
│   ├── HeroCard.vue        → <HeroHeroCard /> (duplicate removed → <HeroCard />)
│   └── Card.vue            → <HeroCard />
├── expedition/
│   └── Timer.vue           → <ExpeditionTimer />
└── ui/
    └── ProgressBar.vue     → <UiProgressBar />
```

**Best Practice:** Name component files to match their final component name:

```
app/components/
├── hero/
│   └── HeroCard.vue        → <HeroCard />
├── expedition/
│   └── ExpeditionTimer.vue → <ExpeditionTimer />
└── ui/
    └── UiProgressBar.vue   → <UiProgressBar />
```

### Pinia Stores

**Convention:** Prefix store functions with `use` and suffix with `Store`:

```typescript
// app/stores/heroes.ts
export const useHeroStore = defineStore('heroes', { ... })

// app/stores/expeditions.ts  
export const useExpeditionStore = defineStore('expeditions', { ... })

// app/stores/game.ts
export const useGameStore = defineStore('game', { ... })
```

**Store ID:** Use lowercase, singular or plural noun (matches domain).

### Server Routes

**File-based routing with HTTP method suffix:**

```
server/api/
├── heroes/
│   ├── index.get.ts        → GET /api/heroes
│   ├── index.post.ts       → POST /api/heroes
│   ├── [id].get.ts         → GET /api/heroes/:id
│   ├── [id].patch.ts       → PATCH /api/heroes/:id
│   └── [id]/
│       └── retire.post.ts  → POST /api/heroes/:id/retire
```

**Without `/api` prefix:**

```
server/routes/
├── health.get.ts           → GET /health
└── webhook.post.ts         → POST /webhook
```

---

## Pinia Store Patterns

### Option Store (Simple)

```typescript
export const useHeroStore = defineStore('heroes', {
  state: () => ({
    heroes: [] as Hero[],
    loading: false,
  }),
  getters: {
    availableHeroes: (state) => state.heroes.filter(h => !h.isOnExpedition),
  },
  actions: {
    async fetchHeroes() {
      this.loading = true
      this.heroes = await $fetch('/api/heroes')
      this.loading = false
    },
  },
})
```

### Setup Store (Flexible)

```typescript
export const useHeroStore = defineStore('heroes', () => {
  // State
  const heroes = ref<Hero[]>([])
  const loading = ref(false)
  
  // Getters
  const availableHeroes = computed(() => 
    heroes.value.filter(h => !h.isOnExpedition)
  )
  
  // Actions
  async function fetchHeroes() {
    loading.value = true
    heroes.value = await $fetch('/api/heroes')
    loading.value = false
  }
  
  // Must return all state, getters, and actions
  return { heroes, loading, availableHeroes, fetchHeroes }
})
```

**When to use Setup Stores:**
- Need watchers inside the store
- Need to use Vue composables
- Complex computed dependencies
- More TypeScript-friendly

---

## Shared Code (Client + Server)

Use `shared/` directory for code that runs on both client and server:

```
shared/
├── utils/
│   └── formatGold.ts    ✅ Auto-imported everywhere
├── types/
│   └── game.ts          ✅ Auto-imported everywhere
└── validators/
    └── heroSchema.ts    ❌ Must import manually
```

**Manual import:**

```typescript
import { heroSchema } from '#shared/validators/heroSchema'
```

**Limitation:** Code in `shared/` cannot import Vue or Nitro code.

---

## Common Mistakes to Avoid

### ❌ Using Composables Outside Context

```typescript
// ❌ WRONG - called at module level
const config = useRuntimeConfig()

export const useMyThing = () => { ... }
```

```typescript
// ✅ CORRECT - called inside function
export const useMyThing = () => {
  const config = useRuntimeConfig()
  // ...
}
```

### ❌ Using useFetch in Store Actions

```typescript
// ❌ WRONG - useFetch needs Nuxt context
actions: {
  async fetch() {
    const { data } = await useFetch('/api/data')
  }
}
```

```typescript
// ✅ CORRECT - $fetch works anywhere
actions: {
  async fetch() {
    const data = await $fetch('/api/data')
  }
}
```

### ❌ Destructuring Store State

```typescript
// ❌ WRONG - loses reactivity
const { heroes, loading } = useHeroStore()
```

```typescript
// ✅ CORRECT - use storeToRefs
import { storeToRefs } from 'pinia'
const store = useHeroStore()
const { heroes, loading } = storeToRefs(store)
const { fetchHeroes } = store  // Actions can be destructured directly
```

---

## References

- [Nuxt 4 Upgrade Guide](https://nuxt.com/docs/getting-started/upgrade)
- [Nuxt 4 Auto-Imports](https://nuxt.com/docs/4.x/guide/concepts/auto-imports)
- [Nuxt 4 Composables Directory](https://nuxt.com/docs/4.x/directory-structure/app/composables)
- [Nuxt 4 Utils Directory](https://nuxt.com/docs/4.x/directory-structure/app/utils)
- [Nuxt 4 Components Directory](https://nuxt.com/docs/4.x/directory-structure/app/components)
- [Nuxt 4 Shared Directory](https://nuxt.com/docs/4.x/directory-structure/shared)
- [Nuxt 4 Server Routes](https://nuxt.com/docs/4.x/directory-structure/server)
- [Nuxt $fetch Documentation](https://nuxt.com/docs/api/utils/dollarfetch)
- [Pinia Core Concepts](https://pinia.vuejs.org/core-concepts/)
- [Pinia Actions](https://pinia.vuejs.org/core-concepts/actions.html)
- [Nuxt Supabase Module](https://supabase.nuxtjs.org/)





