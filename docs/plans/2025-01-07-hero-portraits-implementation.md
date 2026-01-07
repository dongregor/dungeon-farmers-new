# Hero Portraits Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add procedural silhouette-based portraits to heroes with stored visual traits.

**Architecture:** Visual traits (skinTone, hairColor, hairStyle, clothingColors, faceShape) are generated once at hero creation and stored in the database. A Vue component renders SVG silhouettes with layered colored regions based on archetype and traits.

**Tech Stack:** Vue 3, TypeScript, SVG, Supabase (PostgreSQL), Tailwind CSS

---

## Task 1: Add Visual Traits Types

**Files:**
- Create: `types/heroVisuals.ts`
- Modify: `types/index.ts`
- Modify: `types/hero.ts`

**Step 1: Create the visual traits type file**

Create `types/heroVisuals.ts`:

```typescript
import type { Archetype, Gender, Culture } from './base'

// Visual trait indices into color palettes
export interface HeroVisualTraits {
  skinTone: number      // 0-4 index into SKIN_TONES
  hairColor: number     // 0-7 index into HAIR_COLORS
  hairStyle: number     // 0-5 index (per gender)
  primaryColor: number  // 0-7 index into archetype clothing palette
  secondaryColor: number // 0-7 index into archetype clothing palette
  faceShape: number     // 0-3 variations
}

// Color palettes
export const SKIN_TONES = [
  '#f4d5a0', // 0: Light
  '#e6c385', // 1: Light-medium
  '#d4a574', // 2: Medium
  '#8b5a3c', // 3: Medium-dark
  '#5a3a2a', // 4: Dark
] as const

export const HAIR_COLORS = [
  '#1a1a1a', // 0: Black
  '#4a3728', // 1: Dark brown
  '#8b6914', // 2: Brown
  '#c4a35a', // 3: Dirty blonde
  '#e8d5a3', // 4: Blonde
  '#8b3a3a', // 5: Auburn
  '#4a4a4a', // 6: Gray
  '#f5f5f5', // 7: White/silver
] as const

// Clothing palettes per archetype (8 colors each)
export const CLOTHING_PALETTES: Record<Archetype, readonly string[]> = {
  tank: ['#4a5568', '#2d3748', '#1a365d', '#744210', '#5a3e2b', '#374151', '#1f2937', '#4b5563'],
  healer: ['#f0fff4', '#c6f6d5', '#9ae6b4', '#e6fffa', '#b2f5ea', '#bee3f8', '#ffffff', '#e2e8f0'],
  debuffer: ['#553c9a', '#6b46c1', '#44337a', '#1a202c', '#2d3748', '#4a5568', '#322659', '#5a3e85'],
  melee_dps: ['#c53030', '#9b2c2c', '#742a2a', '#1a202c', '#2d3748', '#6b21a8', '#831843', '#4a1d1d'],
  ranged_dps: ['#276749', '#2f855a', '#38a169', '#744210', '#975a16', '#4a5568', '#5a3e2b', '#2d3748'],
  caster: ['#6b46c1', '#553c9a', '#44337a', '#1a365d', '#2c5282', '#d69e2e', '#b7791f', '#744210'],
} as const

// Rarity border colors and glow intensities
export const RARITY_COLORS = {
  common: { border: '#6b7280', glow: 'none' },
  uncommon: { border: '#22c55e', glow: '0 0 8px #22c55e40' },
  rare: { border: '#3b82f6', glow: '0 0 12px #3b82f660' },
  epic: { border: '#a855f7', glow: '0 0 16px #a855f780' },
  legendary: { border: '#f59e0b', glow: '0 0 20px #f59e0ba0' },
} as const

// Hair style counts per gender
export const HAIR_STYLE_COUNT: Record<Gender, number> = {
  male: 6,
  female: 6,
  nonbinary: 6,
}

// Culture influences skin tone distribution (weighted)
export const CULTURE_SKIN_WEIGHTS: Record<Culture, number[]> = {
  northfolk: [0.4, 0.3, 0.2, 0.08, 0.02],
  coastborn: [0.15, 0.25, 0.35, 0.15, 0.1],
  woodwalkers: [0.1, 0.2, 0.3, 0.25, 0.15],
  crownlanders: [0.2, 0.25, 0.3, 0.15, 0.1],
}
```

**Step 2: Export from types/index.ts**

Add to `types/index.ts`:

```typescript
// Hero visuals
export * from './heroVisuals'
```

**Step 3: Add visualTraits to Hero type**

In `types/hero.ts`, add to the `Hero` interface after `equipment`:

```typescript
  // Visual appearance
  visualTraits: HeroVisualTraits
```

Add import at top:

```typescript
import type { HeroVisualTraits } from './heroVisuals'
```

**Step 4: Add visualTraits to TavernHero type**

The `TavernHero` type extends `Hero` via `Omit`, so it inherits `visualTraits` automatically. No change needed.

**Step 5: Commit**

```bash
git add types/heroVisuals.ts types/index.ts types/hero.ts
git commit -m "feat(types): add HeroVisualTraits type and color palettes"
```

---

## Task 2: Create Visual Traits Generator

**Files:**
- Create: `shared/utils/visualTraitsGenerator.ts`
- Modify: `shared/utils/index.ts` (create if needed)

**Step 1: Create the generator utility**

Create `shared/utils/visualTraitsGenerator.ts`:

```typescript
import type { HeroVisualTraits } from '~~/types/heroVisuals'
import type { Archetype, Gender, Culture } from '~~/types/base'
import {
  SKIN_TONES,
  HAIR_COLORS,
  CLOTHING_PALETTES,
  HAIR_STYLE_COUNT,
  CULTURE_SKIN_WEIGHTS,
} from '~~/types/heroVisuals'

// Seeded random number generator for reproducibility
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    hash ^= hash >>> 16
    return (hash >>> 0) / 4294967296
  }
}

// Pick index from weighted array
function weightedRandomIndex(weights: number[], rng: () => number): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = rng() * total

  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return i
  }

  return weights.length - 1
}

// Generate visual traits for a hero
export function generateVisualTraits(
  heroId: string,
  archetype: Archetype,
  gender: Gender,
  culture: Culture
): HeroVisualTraits {
  const rng = seededRandom(heroId)

  // Skin tone influenced by culture
  const skinWeights = CULTURE_SKIN_WEIGHTS[culture]
  const skinTone = weightedRandomIndex(skinWeights, rng)

  // Hair color (purely random)
  const hairColor = Math.floor(rng() * HAIR_COLORS.length)

  // Hair style (gender-specific count)
  const hairStyle = Math.floor(rng() * HAIR_STYLE_COUNT[gender])

  // Clothing colors from archetype palette
  const paletteSize = CLOTHING_PALETTES[archetype].length
  const primaryColor = Math.floor(rng() * paletteSize)
  let secondaryColor = Math.floor(rng() * paletteSize)
  // Ensure secondary differs from primary
  if (secondaryColor === primaryColor) {
    secondaryColor = (secondaryColor + 1) % paletteSize
  }

  // Face shape (simple variation)
  const faceShape = Math.floor(rng() * 4)

  return {
    skinTone,
    hairColor,
    hairStyle,
    primaryColor,
    secondaryColor,
    faceShape,
  }
}
```

**Step 2: Create shared/utils/index.ts if it doesn't exist**

Check if `shared/utils/index.ts` exists. If not, create it:

```typescript
export * from './randomization'
export * from './heroGenerator'
export * from './visualTraitsGenerator'
```

If it exists, add:

```typescript
export * from './visualTraitsGenerator'
```

**Step 3: Commit**

```bash
git add shared/utils/visualTraitsGenerator.ts shared/utils/index.ts
git commit -m "feat(utils): add visual traits generator with seeded RNG"
```

---

## Task 3: Database Migration

**Files:**
- Create: `supabase/migrations/006_hero_visual_traits.sql`

**Step 1: Create the migration file**

Create `supabase/migrations/006_hero_visual_traits.sql`:

```sql
-- Add visual_traits column to heroes table
ALTER TABLE heroes
ADD COLUMN IF NOT EXISTS visual_traits JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN heroes.visual_traits IS 'Stored visual appearance traits: skinTone, hairColor, hairStyle, primaryColor, secondaryColor, faceShape';

-- Backfill existing heroes with deterministic visual traits based on their ID
-- This will be done via application code on first access, not SQL
-- (Keeping migration simple - visual traits will be generated on-demand for existing heroes)
```

**Step 2: Commit**

```bash
git add supabase/migrations/006_hero_visual_traits.sql
git commit -m "feat(db): add visual_traits column to heroes table"
```

---

## Task 4: Update Hero Generator

**Files:**
- Modify: `shared/utils/heroGenerator.ts`

**Step 1: Add visual traits generation to generateHero**

In `shared/utils/heroGenerator.ts`:

Add import at top:

```typescript
import { generateVisualTraits } from '~~/shared/utils/visualTraitsGenerator'
```

Modify the `generateHero` function return type to include `visualTraits`:

Find the line:
```typescript
export function generateHero(options: HeroGenerationOptions = {}): Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt' | 'isOnExpedition' | 'isStationed' | 'stationedZoneId' | 'morale' | 'moraleValue' | 'moraleLastUpdate'> {
```

The return type already includes all non-excluded fields, so `visualTraits` will be included once we add it.

Inside the function, after `const power = calculatePower(baseStats, gameplayTraits)`, add:

```typescript
  // Generate a temporary ID for visual traits (will be replaced by actual ID on save)
  const tempId = uuid()
  const visualTraits = generateVisualTraits(tempId, archetype, gender, culture)
```

Add import for uuid at top if not already present:
```typescript
import { v4 as uuid } from 'uuid'
```

In the return object, add after `prestigeBonuses`:

```typescript
    visualTraits,
```

**Step 2: Commit**

```bash
git add shared/utils/heroGenerator.ts
git commit -m "feat(generator): include visual traits in hero generation"
```

---

## Task 5: Update Server API - Hero Generation

**Files:**
- Modify: `server/api/heroes/generate.post.ts`
- Modify: `server/utils/mappers.ts`

**Step 1: Add visual_traits to database insert**

In `server/api/heroes/generate.post.ts`, find the insert object (around line 93) and add:

```typescript
      visual_traits: heroData.visualTraits,
```

Add it after `prestige_bonuses`.

**Step 2: Update the mapper to include visual traits**

Read `server/utils/mappers.ts` to understand the current structure, then add `visualTraits` mapping.

In the `mapSupabaseHeroToHero` function, add:

```typescript
  visualTraits: row.visual_traits || generateVisualTraitsFromId(row.id, row.archetype, row.gender, row.culture),
```

Add import at top:

```typescript
import { generateVisualTraits } from '~~/shared/utils/visualTraitsGenerator'
```

Add helper function:

```typescript
function generateVisualTraitsFromId(id: string, archetype: string, gender: string, culture: string) {
  return generateVisualTraits(
    id,
    archetype as Archetype,
    gender as Gender,
    culture as Culture
  )
}
```

This handles backfill for existing heroes without visual_traits.

**Step 3: Commit**

```bash
git add server/api/heroes/generate.post.ts server/utils/mappers.ts
git commit -m "feat(api): persist visual traits on hero generation"
```

---

## Task 6: Update Server API - Tavern Recruit

**Files:**
- Modify: `server/api/tavern/recruit.post.ts`

**Step 1: Add visual_traits to hero insert**

In `server/api/tavern/recruit.post.ts`, find the `newHero` object (around line 89) and add:

```typescript
      visual_traits: tavernHero.visualTraits,
```

Add it after `prestige_bonuses`.

**Step 2: Commit**

```bash
git add server/api/tavern/recruit.post.ts
git commit -m "feat(api): persist visual traits on tavern recruit"
```

---

## Task 7: Create Portrait Component - Base Structure

**Files:**
- Create: `app/components/hero/Portrait.vue`

**Step 1: Create the component with props and base structure**

Create `app/components/hero/Portrait.vue`:

```vue
<script setup lang="ts">
import type { Hero, TavernHero } from '~~/types'
import type { Rarity, Archetype } from '~~/types/base'
import {
  SKIN_TONES,
  HAIR_COLORS,
  CLOTHING_PALETTES,
  RARITY_COLORS,
} from '~~/types/heroVisuals'

const props = withDefaults(defineProps<{
  hero: Hero | TavernHero
  size?: 'sm' | 'md' | 'lg'
  showRarityEffects?: boolean
}>(), {
  size: 'md',
  showRarityEffects: true,
})

// Size in pixels
const sizeMap = {
  sm: 48,
  md: 96,
  lg: 192,
}

const pixelSize = computed(() => sizeMap[props.size])

// Get colors from traits
const skinColor = computed(() => SKIN_TONES[props.hero.visualTraits?.skinTone ?? 2])
const hairColor = computed(() => HAIR_COLORS[props.hero.visualTraits?.hairColor ?? 0])
const primaryClothingColor = computed(() => {
  const palette = CLOTHING_PALETTES[props.hero.archetype]
  return palette[props.hero.visualTraits?.primaryColor ?? 0]
})
const secondaryClothingColor = computed(() => {
  const palette = CLOTHING_PALETTES[props.hero.archetype]
  return palette[props.hero.visualTraits?.secondaryColor ?? 1]
})

// Rarity styling
const rarityStyle = computed(() => {
  const rarity = props.hero.rarity as Rarity
  const colors = RARITY_COLORS[rarity]
  return {
    borderColor: colors.border,
    boxShadow: props.showRarityEffects ? colors.glow : 'none',
  }
})
</script>

<template>
  <div
    class="hero-portrait relative rounded-lg border-2 overflow-hidden bg-gray-900"
    :style="{
      width: `${pixelSize}px`,
      height: `${pixelSize}px`,
      ...rarityStyle,
    }"
  >
    <svg
      :width="pixelSize"
      :height="pixelSize"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background gradient based on rarity -->
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="rarityStyle.borderColor" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#1a1a2e" stop-opacity="1" />
        </linearGradient>
      </defs>

      <rect width="192" height="192" fill="url(#bg-gradient)" />

      <!-- Placeholder: Archetype silhouette will go here -->
      <text
        x="96"
        y="100"
        text-anchor="middle"
        :fill="skinColor"
        font-size="48"
        font-weight="bold"
      >
        {{ hero.name.charAt(0) }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.hero-portrait {
  flex-shrink: 0;
}
</style>
```

**Step 2: Commit**

```bash
git add app/components/hero/Portrait.vue
git commit -m "feat(ui): add HeroPortrait component base structure"
```

---

## Task 8: Create Archetype Silhouettes

**Files:**
- Modify: `app/components/hero/Portrait.vue`

**Step 1: Add SVG silhouette paths for each archetype**

Replace the placeholder in the SVG with actual silhouettes. Update the `<template>` section:

```vue
<template>
  <div
    class="hero-portrait relative rounded-lg border-2 overflow-hidden bg-gray-900"
    :style="{
      width: `${pixelSize}px`,
      height: `${pixelSize}px`,
      ...rarityStyle,
    }"
  >
    <svg
      :width="pixelSize"
      :height="pixelSize"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background gradient -->
      <defs>
        <linearGradient :id="`bg-${hero.id}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="rarityStyle.borderColor" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#1a1a2e" />
        </linearGradient>
      </defs>

      <rect width="192" height="192" :fill="`url(#bg-${hero.id})`" />

      <!-- Body/Clothing base layer -->
      <path :d="silhouettePaths.body" :fill="primaryClothingColor" />

      <!-- Clothing detail layer -->
      <path :d="silhouettePaths.detail" :fill="secondaryClothingColor" />

      <!-- Head/Face -->
      <ellipse
        :cx="96"
        :cy="55"
        :rx="28 + (hero.visualTraits?.faceShape ?? 0) * 2"
        :ry="32 - (hero.visualTraits?.faceShape ?? 0)"
        :fill="skinColor"
      />

      <!-- Hair -->
      <path :d="hairPath" :fill="hairColor" />

      <!-- Simple face features -->
      <ellipse cx="86" cy="52" rx="3" ry="4" fill="#1a1a1a" />
      <ellipse cx="106" cy="52" rx="3" ry="4" fill="#1a1a1a" />
    </svg>
  </div>
</template>
```

Add computed properties for silhouette paths:

```typescript
// Archetype silhouette paths (body and detail layers)
const SILHOUETTE_PATHS: Record<Archetype, { body: string; detail: string }> = {
  tank: {
    body: 'M60,85 L55,180 L137,180 L132,85 C132,85 130,75 96,75 C62,75 60,85 60,85 Z',
    detail: 'M65,95 L70,130 L122,130 L127,95 C127,95 120,90 96,90 C72,90 65,95 65,95 Z',
  },
  healer: {
    body: 'M68,85 L60,180 L132,180 L124,85 C124,85 120,78 96,78 C72,78 68,85 68,85 Z',
    detail: 'M72,95 L68,140 L124,140 L120,95 C115,92 96,90 96,90 C96,90 77,92 72,95 Z',
  },
  melee_dps: {
    body: 'M62,82 L50,180 L142,180 L130,82 C130,82 125,72 96,72 C67,72 62,82 62,82 Z',
    detail: 'M68,88 L72,120 L120,120 L124,88 C120,85 96,82 96,82 C96,82 72,85 68,88 Z',
  },
  ranged_dps: {
    body: 'M70,85 L65,180 L127,180 L122,85 C122,85 118,78 96,78 C74,78 70,85 70,85 Z',
    detail: 'M74,92 L76,125 L116,125 L118,92 C114,90 96,88 96,88 C96,88 78,90 74,92 Z',
  },
  caster: {
    body: 'M55,82 L45,180 L147,180 L137,82 C137,82 130,75 96,75 C62,75 55,82 55,82 Z',
    detail: 'M62,90 L58,150 L134,150 L130,90 C125,87 96,85 96,85 C96,85 67,87 62,90 Z',
  },
  debuffer: {
    body: 'M65,85 L58,180 L134,180 L127,85 C127,85 122,77 96,77 C70,77 65,85 65,85 Z',
    detail: 'M70,92 L68,135 L124,135 L122,92 C118,89 96,87 96,87 C96,87 74,89 70,92 Z',
  },
}

const silhouettePaths = computed(() => SILHOUETTE_PATHS[props.hero.archetype])

// Hair paths based on style and gender
const HAIR_STYLES: Record<number, string> = {
  0: 'M68,45 Q68,25 96,22 Q124,25 124,45 L120,55 Q96,50 72,55 Z', // Short
  1: 'M65,48 Q65,22 96,18 Q127,22 127,48 L122,60 Q96,52 70,60 Z', // Medium
  2: 'M62,50 Q62,18 96,15 Q130,18 130,50 L130,85 Q96,75 62,85 Z', // Long
  3: 'M70,42 Q70,28 96,25 Q122,28 122,42 L118,52 Q96,48 74,52 Z', // Buzz
  4: 'M66,46 Q66,24 96,20 Q126,24 126,46 L124,58 Q110,50 96,50 Q82,50 68,58 Z', // Wavy
  5: 'M68,44 Q68,26 96,23 Q124,26 124,44 L96,35 Z', // Mohawk/styled
}

const hairPath = computed(() => {
  const style = props.hero.visualTraits?.hairStyle ?? 0
  return HAIR_STYLES[style] || HAIR_STYLES[0]
})
```

**Step 2: Commit**

```bash
git add app/components/hero/Portrait.vue
git commit -m "feat(ui): add archetype silhouettes and hair styles to portrait"
```

---

## Task 9: Integrate Portrait into HeroCard

**Files:**
- Modify: `app/components/hero/Card.vue`

**Step 1: Add HeroPortrait to HeroCard**

In `app/components/hero/Card.vue`, update the template to include the portrait.

Find the opening `<div class="p-4">` (around line 92) and add the portrait before the name:

```vue
    <div class="p-4">
      <!-- Portrait -->
      <div class="flex gap-4 mb-3">
        <HeroPortrait :hero="hero" size="md" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-bold text-guild-gold truncate">{{ hero.name }}</h3>
            <span class="text-sm text-gray-400 capitalize">{{ hero.rarity }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm bg-gray-700 px-2 py-1 rounded">{{ archetype.name }}</span>
            <span class="text-xs text-gray-400">Lvl {{ hero.level }}</span>
            <span class="text-xs text-gray-400 capitalize">{{ hero.morale }}</span>
          </div>
        </div>
      </div>
```

Remove the duplicate name/archetype section that was there before (lines 93-102 approximately).

**Step 2: Commit**

```bash
git add app/components/hero/Card.vue
git commit -m "feat(ui): integrate HeroPortrait into HeroCard"
```

---

## Task 10: Test and Verify

**Step 1: Run the dev server**

```bash
npm run dev
```

**Step 2: Navigate to a page with heroes**

Open browser to `http://localhost:3000` and navigate to heroes page or tavern.

**Step 3: Verify portraits render correctly**

Check that:
- [ ] Portraits show with archetype-specific silhouettes
- [ ] Colors vary based on visual traits
- [ ] Rarity borders and glows appear correctly
- [ ] Different sizes (sm, md, lg) work

**Step 4: Test hero generation**

Generate a new hero and verify:
- [ ] Visual traits are persisted to database
- [ ] Same hero always shows same appearance

**Step 5: Commit any fixes if needed**

```bash
git add -A
git commit -m "fix: portrait rendering adjustments"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Visual traits types | `types/heroVisuals.ts`, `types/index.ts`, `types/hero.ts` |
| 2 | Visual traits generator | `shared/utils/visualTraitsGenerator.ts` |
| 3 | Database migration | `supabase/migrations/006_hero_visual_traits.sql` |
| 4 | Update hero generator | `shared/utils/heroGenerator.ts` |
| 5 | Update generate API | `server/api/heroes/generate.post.ts`, `server/utils/mappers.ts` |
| 6 | Update recruit API | `server/api/tavern/recruit.post.ts` |
| 7 | Portrait component base | `app/components/hero/Portrait.vue` |
| 8 | Archetype silhouettes | `app/components/hero/Portrait.vue` |
| 9 | Integrate into HeroCard | `app/components/hero/Card.vue` |
| 10 | Test and verify | Manual testing |

**Total estimated tasks:** 10
**Commits:** ~10 atomic commits
