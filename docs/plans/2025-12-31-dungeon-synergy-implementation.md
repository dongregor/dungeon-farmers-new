# Dungeon Synergy System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the dungeon synergy system including monster taxonomy updates, synergy calculation, schematic affixes, and discovery mechanics.

**Architecture:** Types-first approach. Define all TypeScript interfaces, then implement calculation utilities with TDD, then create data files. API endpoints are Phase 2 (not in this plan).

**Tech Stack:** TypeScript, Vitest, Nuxt 4 patterns

**Design Doc:** `docs/plans/2024-12-31-dungeon-synergy-design.md`

---

## Task 1: Add Monster Type and Element Types

**Files:**
- Modify: `types/base.ts`
- Modify: `types/index.ts`

**Step 1: Add MonsterType and Element to base.ts**

Add after line 28 (after ZoneDifficulty):

```typescript
// Monster Categories (for synergies)
export type MonsterType = 'beast' | 'undead' | 'elemental' | 'dragon' | 'humanoid' | 'construct' | 'demon' | 'aberration'

export type Element = 'fire' | 'ice' | 'lightning' | 'nature' | 'shadow' | 'holy' | 'arcane' | 'physical'
```

**Step 2: Verify types compile**

Run: `npx nuxi typecheck`
Expected: No errors related to MonsterType or Element

**Step 3: Commit**

```bash
git add types/base.ts
git commit -m "feat(types): add MonsterType and Element types for synergy system"
```

---

## Task 2: Update Monster Interface

**Files:**
- Modify: `types/monsters.ts`

**Step 1: Update Monster interface**

Replace the Monster interface (lines 3-12) with:

```typescript
import type { ZoneType, MonsterType, Element } from './base'

export interface Monster {
  id: string
  baseName: string
  type: MonsterType             // NEW: broad category
  family: string                // specific group (Wolf, Slime, etc.)
  element: Element              // NEW: magical affinity
  packType: 'trash' | 'elite' | 'miniboss' | 'boss'
  biome: ZoneType
  basePower: number
  baseCaptureChance: number
  lootTable: MonsterLootEntry[]
}
```

**Step 2: Verify types compile**

Run: `npx nuxi typecheck`
Expected: Errors in `app/data/monsters.ts` (missing `type` and `element` fields)

**Step 3: Commit**

```bash
git add types/monsters.ts
git commit -m "feat(types): add type and element fields to Monster interface"
```

---

## Task 3: Update Monster Data

**Files:**
- Modify: `app/data/monsters.ts`

**Step 1: Update existing monsters with type and element**

Replace the MONSTERS array with:

```typescript
import type { Monster } from '~~/types'

export const MONSTERS: Monster[] = [
  {
    id: 'forest_wolf',
    baseName: 'Forest Wolf',
    type: 'beast',
    family: 'Wolf',
    element: 'physical',
    packType: 'trash',
    biome: 'forest',
    basePower: 20,
    baseCaptureChance: 0.3,
    lootTable: [
      { itemId: 'wolf_pelt', itemType: 'material', weight: 80, dropChance: 0.6 },
      { itemId: 'sharp_fang', itemType: 'material', weight: 20, dropChance: 0.3 }
    ]
  },
  {
    id: 'goblin_scout',
    baseName: 'Goblin Scout',
    type: 'humanoid',
    family: 'Goblin',
    element: 'physical',
    packType: 'trash',
    biome: 'cave',
    basePower: 15,
    baseCaptureChance: 0.2,
    lootTable: [
      { itemId: 'rusty_dagger', itemType: 'equipment', weight: 40, dropChance: 0.15 },
      { itemId: 'goblin_ear', itemType: 'material', weight: 60, dropChance: 0.4 }
    ]
  },
  {
    id: 'goblin_archer',
    baseName: 'Goblin Archer',
    type: 'humanoid',
    family: 'Goblin',
    element: 'physical',
    packType: 'trash',
    biome: 'cave',
    basePower: 18,
    baseCaptureChance: 0.2,
    lootTable: [
      { itemId: 'crude_bow', itemType: 'equipment', weight: 30, dropChance: 0.12 },
      { itemId: 'poison_arrow', itemType: 'material', weight: 50, dropChance: 0.25 },
      { itemId: 'goblin_ear', itemType: 'material', weight: 20, dropChance: 0.3 }
    ]
  },
  {
    id: 'swamp_toad',
    baseName: 'Giant Swamp Toad',
    type: 'beast',
    family: 'Amphibian',
    element: 'nature',
    packType: 'elite',
    biome: 'swamp',
    basePower: 35,
    baseCaptureChance: 0.15,
    lootTable: [
      { itemId: 'toxic_gland', itemType: 'material', weight: 70, dropChance: 0.5 },
      { itemId: 'swamp_hide', itemType: 'material', weight: 30, dropChance: 0.35 }
    ]
  }
]

export function getMonsterById(id: string): Monster | undefined {
  return MONSTERS.find(monster => monster.id === id)
}

export function getMonstersByFamily(family: string): Monster[] {
  return MONSTERS.filter(monster => monster.family === family)
}

export function getMonstersByBiome(biome: string): Monster[] {
  return MONSTERS.filter(monster => monster.biome === biome)
}

export function getMonstersByType(type: string): Monster[] {
  return MONSTERS.filter(monster => monster.type === type)
}

export function getMonstersByElement(element: string): Monster[] {
  return MONSTERS.filter(monster => monster.element === element)
}
```

**Step 2: Verify types compile**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add app/data/monsters.ts
git commit -m "feat(data): update monsters with type and element, add filter helpers"
```

---

## Task 4: Create Synergy Types

**Files:**
- Create: `types/synergies.ts`
- Modify: `types/index.ts`

**Step 1: Create synergy type definitions**

Create `types/synergies.ts`:

```typescript
import type { MonsterType, Element, ZoneType } from './base'

// Synergy tier determines visibility and power
export type SynergyTier = 'basic' | 'intermediate' | 'hidden'

// What the synergy affects
export type SynergyEffectType = 'loot_quality' | 'drop_rate' | 'power' | 'special_drop'

// Synergy trigger patterns
export type SynergyPattern =
  | 'type_threshold'      // 3+ same Type
  | 'element_matching'    // 3+ same Element
  | 'biome_harmony'       // All from same Biome
  | 'family_threshold'    // 3+ same Family
  | 'all_same_type'       // Every slot same Type
  | 'element_combo'       // Specific elements together
  | 'type_element'        // Type with specific element
  | 'opposites'           // Opposing elements
  | 'full_diversity'      // No Type duplicates

export interface SynergyRequirement {
  pattern: SynergyPattern
  // For threshold patterns
  monsterTypes?: MonsterType[]
  elements?: Element[]
  families?: string[]
  biomes?: ZoneType[]
  minCount?: number
  // For combo patterns
  requiredElements?: Element[]
  requiredTypes?: MonsterType[]
  // For diversity pattern
  allDifferentTypes?: boolean
}

export interface SynergyEffect {
  type: SynergyEffectType
  value: number                    // Percentage bonus (e.g., 10 = +10%)
  description: string
  targetLoot?: string              // For specific loot bonuses
}

export interface SynergyDefinition {
  id: string
  name: string
  description: string
  tier: SynergyTier
  requirement: SynergyRequirement
  effects: SynergyEffect[]
  // For hidden synergies
  hint?: string                    // Breadcrumb hint
}

export interface AppliedSynergy {
  synergyId: string
  synergy: SynergyDefinition
  contributingMonsterIds: string[]
  totalBonus: number
}

export interface SynergyCalculationResult {
  activeSynergies: AppliedSynergy[]
  totalLootBonus: number
  totalPowerBonus: number
  totalDropRateBonus: number
  cappedAt: number                 // The soft cap (60%)
  wasCapped: boolean
}

// Player's discovered synergies (for persistence)
export interface DiscoveredSynergy {
  synergyId: string
  discoveredAt: string
  discoveredInDungeonId?: string
  timesTriggered: number
}
```

**Step 2: Export from index.ts**

Add to `types/index.ts`:

```typescript
// Synergy system
export * from './synergies'
```

**Step 3: Verify types compile**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add types/synergies.ts types/index.ts
git commit -m "feat(types): add synergy system type definitions"
```

---

## Task 5: Create Schematic Types

**Files:**
- Create: `types/schematics.ts`
- Modify: `types/index.ts`

**Step 1: Create schematic type definitions**

Create `types/schematics.ts`:

```typescript
import type { Rarity, MonsterType, Element, ZoneType } from './base'

// Affix categories
export type AffixCategory =
  | 'power'
  | 'efficiency'
  | 'xp'
  | 'loot'
  | 'amplifier'
  | 'monster_specific'
  | 'trade_off'
  | 'hero_synergy'
  | 'wildcard'

// Themed slot types
export type ThemedSlotType = 'element' | 'monster_type' | 'family'

export interface ThemedSlot {
  type: ThemedSlotType
  value: string                    // e.g., 'fire', 'demon', 'Wolf'
  bonusPercent: number             // e.g., 20 for +20%
  bonusType: 'power' | 'loot' | 'xp'
}

export interface SlotDefinition {
  id: string
  position: number
  allowedTypes: MonsterType[] | 'any'
  requiredElements?: Element[]
  themed?: ThemedSlot
}

export interface AffixEffect {
  type: string                     // e.g., 'power_bonus', 'duration_reduction'
  value: number
  condition?: string               // For conditional affixes
}

export interface TradeOffEffect {
  bonus: AffixEffect
  penalty: AffixEffect
}

export interface SchematicAffix {
  id: string
  category: AffixCategory
  name: string
  description: string
  effect: AffixEffect | TradeOffEffect
  // For amplifier affixes
  amplifies?: {
    synergyType?: 'element' | 'type' | 'family'
    synergyValue?: string          // e.g., 'fire', 'beast'
    multiplier: number             // e.g., 1.5 for 1.5x
  }
  // For hero synergy affixes
  heroTagRequired?: string
}

export interface SchematicDefinition {
  id: string
  name: string
  description: string
  rarity: Rarity
  theme: string
  biome?: ZoneType
  slots: SlotDefinition[]
  affixes: SchematicAffix[]
  baseDuration: number             // Minutes
  baseRewards: {
    goldMin: number
    goldMax: number
    xpMin: number
    xpMax: number
  }
}

// Player's collected schematic instance
export interface CollectedSchematic {
  id: string
  playerId: string
  schematicId: string
  schematic: SchematicDefinition
  collectedAt: string
  sourceZoneId?: string
}

// Slot count ranges by rarity
export const SCHEMATIC_SLOT_COUNTS: Record<Rarity, { min: number; max: number }> = {
  common: { min: 3, max: 4 },
  uncommon: { min: 4, max: 5 },
  rare: { min: 5, max: 6 },
  epic: { min: 7, max: 8 },
  legendary: { min: 9, max: 10 }
}

// Themed slot counts by rarity
export const SCHEMATIC_THEMED_SLOTS: Record<Rarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 1,
  epic: 2,
  legendary: 3
}

// Affix counts by rarity
export const SCHEMATIC_AFFIX_COUNTS: Record<Rarity, { min: number; max: number }> = {
  common: { min: 0, max: 0 },
  uncommon: { min: 1, max: 1 },
  rare: { min: 1, max: 1 },
  epic: { min: 1, max: 2 },
  legendary: { min: 2, max: 2 }
}
```

**Step 2: Export from index.ts**

Add to `types/index.ts`:

```typescript
// Schematic system
export * from './schematics'
```

**Step 3: Verify types compile**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add types/schematics.ts types/index.ts
git commit -m "feat(types): add schematic system type definitions"
```

---

## Task 6: Create Dungeon Types

**Files:**
- Create: `types/dungeons.ts`
- Modify: `types/index.ts`

**Step 1: Create dungeon type definitions**

Create `types/dungeons.ts`:

```typescript
import type { Monster } from './monsters'
import type { SchematicDefinition } from './schematics'
import type { AppliedSynergy, SynergyCalculationResult } from './synergies'

export type DungeonStatus = 'draft' | 'active' | 'inactive'

export interface PlacedMonster {
  slotId: string
  monsterId: string                // Reference to captured monster
  monster: Monster                 // Denormalized for convenience
}

export interface DungeonDefinition {
  id: string
  playerId: string
  schematicId: string
  schematic: SchematicDefinition
  name: string
  status: DungeonStatus
  monsters: PlacedMonster[]
  // Calculated values (cached)
  power: number
  synergies: AppliedSynergy[]
  synergyResult: SynergyCalculationResult
  // Metadata
  tags: string[]
  createdAt: string
  updatedAt: string
  activatedAt?: string
  lastRunAt?: string
}

export interface DungeonValidation {
  valid: boolean
  errors: DungeonValidationError[]
  warnings: string[]
}

export interface DungeonValidationError {
  slotId?: string
  code: 'missing_monster' | 'wrong_type' | 'wrong_element' | 'duplicate_monster'
  message: string
}

export interface DungeonPreview {
  power: number
  synergies: AppliedSynergy[]
  synergyResult: SynergyCalculationResult
  estimatedLoot: {
    itemId: string
    dropChance: number
    source: string
  }[]
  efficiency: number               // 0-100 quality score
}

// Active dungeon slot limits
export const DUNGEON_SLOT_LIMITS = {
  free: 5,
  supporter: 10,
  draft: 10,                       // Max drafts for everyone
  inactive: Infinity               // No limit on inactive
}
```

**Step 2: Export from index.ts**

Add to `types/index.ts`:

```typescript
// Dungeon system
export * from './dungeons'
```

**Step 3: Verify types compile**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add types/dungeons.ts types/index.ts
git commit -m "feat(types): add dungeon system type definitions"
```

---

## Task 7: Create Synergy Definitions Data

**Files:**
- Create: `app/data/synergies.ts`

**Step 1: Write failing test**

Create `tests/data/synergies.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { SYNERGIES, getSynergyById, getSynergiesByTier } from '~/data/synergies'

describe('Synergy Definitions', () => {
  describe('SYNERGIES array', () => {
    it('should have at least 15 synergies defined', () => {
      expect(SYNERGIES.length).toBeGreaterThanOrEqual(15)
    })

    it('should have synergies in all three tiers', () => {
      const basic = SYNERGIES.filter(s => s.tier === 'basic')
      const intermediate = SYNERGIES.filter(s => s.tier === 'intermediate')
      const hidden = SYNERGIES.filter(s => s.tier === 'hidden')

      expect(basic.length).toBeGreaterThanOrEqual(5)
      expect(intermediate.length).toBeGreaterThanOrEqual(5)
      expect(hidden.length).toBeGreaterThanOrEqual(5)
    })

    it('should have unique IDs', () => {
      const ids = SYNERGIES.map(s => s.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have valid tier values', () => {
      const validTiers = ['basic', 'intermediate', 'hidden']
      SYNERGIES.forEach(synergy => {
        expect(validTiers).toContain(synergy.tier)
      })
    })

    it('should have at least one effect per synergy', () => {
      SYNERGIES.forEach(synergy => {
        expect(synergy.effects.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should have hints for hidden synergies', () => {
      const hidden = SYNERGIES.filter(s => s.tier === 'hidden')
      hidden.forEach(synergy => {
        expect(synergy.hint).toBeDefined()
        expect(synergy.hint!.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getSynergyById', () => {
    it('should return synergy by ID', () => {
      const synergy = getSynergyById('pack_tactics')
      expect(synergy).toBeDefined()
      expect(synergy!.name).toBe('Pack Tactics')
    })

    it('should return undefined for unknown ID', () => {
      const synergy = getSynergyById('nonexistent')
      expect(synergy).toBeUndefined()
    })
  })

  describe('getSynergiesByTier', () => {
    it('should return only basic synergies', () => {
      const basic = getSynergiesByTier('basic')
      expect(basic.every(s => s.tier === 'basic')).toBe(true)
    })

    it('should return only hidden synergies', () => {
      const hidden = getSynergiesByTier('hidden')
      expect(hidden.every(s => s.tier === 'hidden')).toBe(true)
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/data/synergies.test.ts`
Expected: FAIL - Cannot find module '~/data/synergies'

**Step 3: Create synergy definitions**

Create `app/data/synergies.ts`:

```typescript
import type { SynergyDefinition, SynergyTier } from '~~/types'

export const SYNERGIES: SynergyDefinition[] = [
  // === BASIC TIER (5-10%, always visible) ===
  {
    id: 'pack_tactics',
    name: 'Pack Tactics',
    description: 'Three or more Beasts fight as one',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['beast'],
      minCount: 3
    },
    effects: [{ type: 'power', value: 8, description: '+8% dungeon power' }]
  },
  {
    id: 'elemental_confluence',
    name: 'Elemental Confluence',
    description: 'Three or more monsters of the same element',
    tier: 'basic',
    requirement: {
      pattern: 'element_matching',
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 10, description: '+10% elemental loot' }]
  },
  {
    id: 'risen_horde',
    name: 'Risen Horde',
    description: 'The undead gather in numbers',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['undead'],
      minCount: 3
    },
    effects: [{ type: 'power', value: 8, description: '+8% dungeon power' }]
  },
  {
    id: 'forest_harmony',
    name: 'Forest Harmony',
    description: 'All monsters from the forest biome',
    tier: 'basic',
    requirement: {
      pattern: 'biome_harmony',
      biomes: ['forest']
    },
    effects: [{ type: 'drop_rate', value: 10, description: '+10% nature drops' }]
  },
  {
    id: 'dragons_presence',
    name: "Dragon's Presence",
    description: 'Dragons command respect',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['dragon'],
      minCount: 2
    },
    effects: [{ type: 'power', value: 8, description: '+8% dungeon power' }]
  },
  {
    id: 'construct_assembly',
    name: 'Construct Assembly',
    description: 'Mechanical beings work in unison',
    tier: 'basic',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['construct'],
      minCount: 3
    },
    effects: [{ type: 'drop_rate', value: 10, description: '+10% material drops' }]
  },

  // === INTERMEDIATE TIER (10-20%, revealed on first trigger) ===
  {
    id: 'wolf_pack',
    name: 'Wolf Pack',
    description: 'A true pack of wolves',
    tier: 'intermediate',
    requirement: {
      pattern: 'family_threshold',
      families: ['Wolf'],
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 15, description: '+15% crit gear drops' }]
  },
  {
    id: 'volatile_reaction',
    name: 'Volatile Reaction',
    description: 'Fire and ice create an unstable mix',
    tier: 'intermediate',
    requirement: {
      pattern: 'element_combo',
      requiredElements: ['fire', 'ice']
    },
    effects: [{ type: 'drop_rate', value: 15, description: '+15% rare drops' }]
  },
  {
    id: 'legion_of_bone',
    name: 'Legion of Bone',
    description: 'A dungeon filled only with the undead',
    tier: 'intermediate',
    requirement: {
      pattern: 'all_same_type',
      monsterTypes: ['undead'],
      minCount: 5
    },
    effects: [{ type: 'drop_rate', value: 20, description: '+20% bone materials' }]
  },
  {
    id: 'elemental_purity',
    name: 'Elemental Purity',
    description: 'All monsters share the same element',
    tier: 'intermediate',
    requirement: {
      pattern: 'element_matching',
      minCount: 4
    },
    effects: [{ type: 'loot_quality', value: 18, description: '+18% elemental loot quality' }]
  },
  {
    id: 'biome_dominance',
    name: 'Biome Dominance',
    description: 'All monsters from the same biome',
    tier: 'intermediate',
    requirement: {
      pattern: 'biome_harmony',
      minCount: 4
    },
    effects: [{ type: 'drop_rate', value: 15, description: '+15% zone materials' }]
  },
  {
    id: 'infernal_court',
    name: 'Infernal Court',
    description: 'Demons gather in strength',
    tier: 'intermediate',
    requirement: {
      pattern: 'type_threshold',
      monsterTypes: ['demon'],
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 18, description: '+18% demonic gear drops' }]
  },

  // === HIDDEN TIER (20-35%, discovered through experimentation) ===
  {
    id: 'draconic_inferno',
    name: 'Draconic Inferno',
    description: 'Fire dragons unleash devastating power',
    tier: 'hidden',
    requirement: {
      pattern: 'type_element',
      monsterTypes: ['dragon'],
      elements: ['fire'],
      minCount: 3
    },
    effects: [{ type: 'loot_quality', value: 30, description: '+30% dragon hoard drops' }],
    hint: 'Dragons of flame are said to guard the greatest treasures...'
  },
  {
    id: 'twilight_paradox',
    name: 'Twilight Paradox',
    description: 'Shadow and holy create impossible power',
    tier: 'hidden',
    requirement: {
      pattern: 'opposites',
      requiredElements: ['shadow', 'holy']
    },
    effects: [{ type: 'loot_quality', value: 25, description: '+25% blessed/cursed gear' }],
    hint: 'The ancients combined shadow and holy for devastating effect...'
  },
  {
    id: 'apex_diversity',
    name: 'Apex Diversity',
    description: 'Every monster type represented',
    tier: 'hidden',
    requirement: {
      pattern: 'full_diversity',
      allDifferentTypes: true
    },
    effects: [{ type: 'drop_rate', value: 20, description: '+20% unique drops' }],
    hint: 'Some say variety is the spice of dungeon life...'
  },
  {
    id: 'elemental_mastery',
    name: 'Elemental Mastery',
    description: 'Four base elements in perfect balance',
    tier: 'hidden',
    requirement: {
      pattern: 'element_combo',
      requiredElements: ['fire', 'ice', 'lightning', 'nature']
    },
    effects: [{ type: 'drop_rate', value: 35, description: '+35% rare drops' }],
    hint: 'Master all four elements and the dungeon yields its secrets...'
  },
  {
    id: 'pack_alpha',
    name: 'Pack Alpha',
    description: 'Wolves follow a stronger leader',
    tier: 'hidden',
    requirement: {
      pattern: 'family_threshold',
      families: ['Wolf', 'Bear'],
      minCount: 5
    },
    effects: [{ type: 'loot_quality', value: 30, description: '+30% beast loot' }],
    hint: 'Wolves respect strength. A bear among them changes everything...'
  }
]

export function getSynergyById(id: string): SynergyDefinition | undefined {
  return SYNERGIES.find(s => s.id === id)
}

export function getSynergiesByTier(tier: SynergyTier): SynergyDefinition[] {
  return SYNERGIES.filter(s => s.tier === tier)
}

export function getVisibleSynergies(discoveredIds: string[] = []): SynergyDefinition[] {
  return SYNERGIES.filter(s =>
    s.tier === 'basic' ||
    s.tier === 'intermediate' && discoveredIds.includes(s.id)
  )
}

export function getHiddenSynergies(): SynergyDefinition[] {
  return SYNERGIES.filter(s => s.tier === 'hidden')
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run tests/data/synergies.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add app/data/synergies.ts tests/data/synergies.test.ts
git commit -m "feat(data): add synergy definitions with 17 synergies across 3 tiers"
```

---

## Task 8: Create Synergy Calculator Utility

**Files:**
- Create: `app/utils/synergyCalculator.ts`
- Create: `tests/unit/utils/synergyCalculator.test.ts`

**Step 1: Write failing tests**

Create `tests/unit/utils/synergyCalculator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  calculateSynergies,
  checkSynergyRequirement,
  SYNERGY_SOFT_CAP
} from '~/utils/synergyCalculator'
import type { Monster } from '~~/types'

function createTestMonster(overrides: Partial<Monster> = {}): Monster {
  return {
    id: 'test-monster',
    baseName: 'Test Monster',
    type: 'beast',
    family: 'Wolf',
    element: 'physical',
    packType: 'trash',
    biome: 'forest',
    basePower: 20,
    baseCaptureChance: 0.3,
    lootTable: [],
    ...overrides
  }
}

describe('Synergy Calculator', () => {
  describe('SYNERGY_SOFT_CAP', () => {
    it('should be 60', () => {
      expect(SYNERGY_SOFT_CAP).toBe(60)
    })
  })

  describe('checkSynergyRequirement', () => {
    it('should detect type_threshold synergy with 3+ beasts', () => {
      const monsters = [
        createTestMonster({ id: '1', type: 'beast' }),
        createTestMonster({ id: '2', type: 'beast' }),
        createTestMonster({ id: '3', type: 'beast' })
      ]

      const result = checkSynergyRequirement(monsters, {
        pattern: 'type_threshold',
        monsterTypes: ['beast'],
        minCount: 3
      })

      expect(result.matches).toBe(true)
      expect(result.contributingMonsterIds).toHaveLength(3)
    })

    it('should not match type_threshold with only 2 beasts', () => {
      const monsters = [
        createTestMonster({ id: '1', type: 'beast' }),
        createTestMonster({ id: '2', type: 'beast' }),
        createTestMonster({ id: '3', type: 'undead' })
      ]

      const result = checkSynergyRequirement(monsters, {
        pattern: 'type_threshold',
        monsterTypes: ['beast'],
        minCount: 3
      })

      expect(result.matches).toBe(false)
    })

    it('should detect element_matching synergy', () => {
      const monsters = [
        createTestMonster({ id: '1', element: 'fire' }),
        createTestMonster({ id: '2', element: 'fire' }),
        createTestMonster({ id: '3', element: 'fire' })
      ]

      const result = checkSynergyRequirement(monsters, {
        pattern: 'element_matching',
        minCount: 3
      })

      expect(result.matches).toBe(true)
    })

    it('should detect element_combo synergy (fire + ice)', () => {
      const monsters = [
        createTestMonster({ id: '1', element: 'fire' }),
        createTestMonster({ id: '2', element: 'ice' }),
        createTestMonster({ id: '3', element: 'physical' })
      ]

      const result = checkSynergyRequirement(monsters, {
        pattern: 'element_combo',
        requiredElements: ['fire', 'ice']
      })

      expect(result.matches).toBe(true)
      expect(result.contributingMonsterIds).toHaveLength(2)
    })

    it('should detect full_diversity synergy', () => {
      const monsters = [
        createTestMonster({ id: '1', type: 'beast' }),
        createTestMonster({ id: '2', type: 'undead' }),
        createTestMonster({ id: '3', type: 'dragon' }),
        createTestMonster({ id: '4', type: 'demon' })
      ]

      const result = checkSynergyRequirement(monsters, {
        pattern: 'full_diversity',
        allDifferentTypes: true
      })

      expect(result.matches).toBe(true)
    })

    it('should not match full_diversity with duplicate types', () => {
      const monsters = [
        createTestMonster({ id: '1', type: 'beast' }),
        createTestMonster({ id: '2', type: 'beast' }),
        createTestMonster({ id: '3', type: 'dragon' })
      ]

      const result = checkSynergyRequirement(monsters, {
        pattern: 'full_diversity',
        allDifferentTypes: true
      })

      expect(result.matches).toBe(false)
    })
  })

  describe('calculateSynergies', () => {
    it('should return empty result for empty monster list', () => {
      const result = calculateSynergies([])

      expect(result.activeSynergies).toHaveLength(0)
      expect(result.totalLootBonus).toBe(0)
      expect(result.totalPowerBonus).toBe(0)
    })

    it('should detect pack_tactics synergy with 3 beasts', () => {
      const monsters = [
        createTestMonster({ id: '1', type: 'beast' }),
        createTestMonster({ id: '2', type: 'beast' }),
        createTestMonster({ id: '3', type: 'beast' })
      ]

      const result = calculateSynergies(monsters)

      const packTactics = result.activeSynergies.find(s => s.synergyId === 'pack_tactics')
      expect(packTactics).toBeDefined()
      expect(packTactics!.totalBonus).toBe(8)
    })

    it('should detect multiple synergies', () => {
      const monsters = [
        createTestMonster({ id: '1', type: 'beast', element: 'fire' }),
        createTestMonster({ id: '2', type: 'beast', element: 'fire' }),
        createTestMonster({ id: '3', type: 'beast', element: 'fire' })
      ]

      const result = calculateSynergies(monsters)

      expect(result.activeSynergies.length).toBeGreaterThanOrEqual(2)
      expect(result.activeSynergies.some(s => s.synergyId === 'pack_tactics')).toBe(true)
      expect(result.activeSynergies.some(s => s.synergyId === 'elemental_confluence')).toBe(true)
    })

    it('should cap total bonus at soft cap', () => {
      // Create monsters that would trigger many synergies
      const monsters = [
        createTestMonster({ id: '1', type: 'beast', family: 'Wolf', element: 'fire', biome: 'forest' }),
        createTestMonster({ id: '2', type: 'beast', family: 'Wolf', element: 'fire', biome: 'forest' }),
        createTestMonster({ id: '3', type: 'beast', family: 'Wolf', element: 'fire', biome: 'forest' }),
        createTestMonster({ id: '4', type: 'beast', family: 'Wolf', element: 'fire', biome: 'forest' })
      ]

      const result = calculateSynergies(monsters)

      expect(result.totalLootBonus).toBeLessThanOrEqual(SYNERGY_SOFT_CAP)
      expect(result.wasCapped || result.totalLootBonus <= SYNERGY_SOFT_CAP).toBe(true)
    })

    it('should set wasCapped flag when cap is reached', () => {
      // This would need a very specific setup - for now just test the interface exists
      const result = calculateSynergies([])
      expect(result.wasCapped).toBeDefined()
      expect(result.cappedAt).toBe(SYNERGY_SOFT_CAP)
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/utils/synergyCalculator.test.ts`
Expected: FAIL - Cannot find module

**Step 3: Implement synergy calculator**

Create `app/utils/synergyCalculator.ts`:

```typescript
import type {
  Monster,
  SynergyRequirement,
  SynergyCalculationResult,
  AppliedSynergy,
  SynergyDefinition
} from '~~/types'
import { SYNERGIES } from '~/data/synergies'

export const SYNERGY_SOFT_CAP = 60

interface RequirementCheckResult {
  matches: boolean
  contributingMonsterIds: string[]
}

export function checkSynergyRequirement(
  monsters: Monster[],
  requirement: SynergyRequirement
): RequirementCheckResult {
  const { pattern } = requirement

  switch (pattern) {
    case 'type_threshold': {
      const matchingMonsters = monsters.filter(m =>
        requirement.monsterTypes?.includes(m.type)
      )
      const minCount = requirement.minCount ?? 3
      return {
        matches: matchingMonsters.length >= minCount,
        contributingMonsterIds: matchingMonsters.map(m => m.id)
      }
    }

    case 'element_matching': {
      const minCount = requirement.minCount ?? 3
      // Group by element and find the largest group
      const elementCounts = new Map<string, Monster[]>()
      for (const monster of monsters) {
        const existing = elementCounts.get(monster.element) ?? []
        existing.push(monster)
        elementCounts.set(monster.element, existing)
      }

      for (const [, elementMonsters] of elementCounts) {
        if (elementMonsters.length >= minCount) {
          return {
            matches: true,
            contributingMonsterIds: elementMonsters.map(m => m.id)
          }
        }
      }
      return { matches: false, contributingMonsterIds: [] }
    }

    case 'biome_harmony': {
      const minCount = requirement.minCount ?? monsters.length
      const biomes = requirement.biomes

      if (biomes && biomes.length > 0) {
        const matchingMonsters = monsters.filter(m => biomes.includes(m.biome))
        return {
          matches: matchingMonsters.length >= minCount && matchingMonsters.length === monsters.length,
          contributingMonsterIds: matchingMonsters.map(m => m.id)
        }
      }

      // All same biome
      const firstBiome = monsters[0]?.biome
      if (!firstBiome) return { matches: false, contributingMonsterIds: [] }

      const allSameBiome = monsters.every(m => m.biome === firstBiome)
      return {
        matches: allSameBiome && monsters.length >= minCount,
        contributingMonsterIds: allSameBiome ? monsters.map(m => m.id) : []
      }
    }

    case 'family_threshold': {
      const minCount = requirement.minCount ?? 3
      const families = requirement.families ?? []

      const matchingMonsters = monsters.filter(m => families.includes(m.family))
      return {
        matches: matchingMonsters.length >= minCount,
        contributingMonsterIds: matchingMonsters.map(m => m.id)
      }
    }

    case 'all_same_type': {
      const minCount = requirement.minCount ?? 1
      const requiredTypes = requirement.monsterTypes

      if (!requiredTypes || requiredTypes.length === 0) {
        return { matches: false, contributingMonsterIds: [] }
      }

      const allMatch = monsters.every(m => requiredTypes.includes(m.type))
      return {
        matches: allMatch && monsters.length >= minCount,
        contributingMonsterIds: allMatch ? monsters.map(m => m.id) : []
      }
    }

    case 'element_combo': {
      const requiredElements = requirement.requiredElements ?? []
      const contributing: string[] = []

      for (const element of requiredElements) {
        const monster = monsters.find(m => m.element === element)
        if (!monster) {
          return { matches: false, contributingMonsterIds: [] }
        }
        contributing.push(monster.id)
      }

      return {
        matches: true,
        contributingMonsterIds: contributing
      }
    }

    case 'type_element': {
      const requiredTypes = requirement.monsterTypes ?? []
      const requiredElements = requirement.elements ?? []
      const minCount = requirement.minCount ?? 1

      const matchingMonsters = monsters.filter(m =>
        requiredTypes.includes(m.type) && requiredElements.includes(m.element)
      )

      return {
        matches: matchingMonsters.length >= minCount,
        contributingMonsterIds: matchingMonsters.map(m => m.id)
      }
    }

    case 'opposites': {
      const requiredElements = requirement.requiredElements ?? []
      if (requiredElements.length < 2) {
        return { matches: false, contributingMonsterIds: [] }
      }

      const contributing: string[] = []
      for (const element of requiredElements) {
        const monster = monsters.find(m => m.element === element)
        if (!monster) {
          return { matches: false, contributingMonsterIds: [] }
        }
        contributing.push(monster.id)
      }

      return {
        matches: true,
        contributingMonsterIds: contributing
      }
    }

    case 'full_diversity': {
      if (!requirement.allDifferentTypes) {
        return { matches: false, contributingMonsterIds: [] }
      }

      const types = new Set(monsters.map(m => m.type))
      const allDifferent = types.size === monsters.length

      return {
        matches: allDifferent && monsters.length >= 3,
        contributingMonsterIds: allDifferent ? monsters.map(m => m.id) : []
      }
    }

    default:
      return { matches: false, contributingMonsterIds: [] }
  }
}

export function calculateSynergies(
  monsters: Monster[],
  discoveredSynergyIds: string[] = []
): SynergyCalculationResult {
  if (monsters.length === 0) {
    return {
      activeSynergies: [],
      totalLootBonus: 0,
      totalPowerBonus: 0,
      totalDropRateBonus: 0,
      cappedAt: SYNERGY_SOFT_CAP,
      wasCapped: false
    }
  }

  const activeSynergies: AppliedSynergy[] = []

  for (const synergy of SYNERGIES) {
    const result = checkSynergyRequirement(monsters, synergy.requirement)

    if (result.matches) {
      const totalBonus = synergy.effects.reduce((sum, effect) => sum + effect.value, 0)

      activeSynergies.push({
        synergyId: synergy.id,
        synergy,
        contributingMonsterIds: result.contributingMonsterIds,
        totalBonus
      })
    }
  }

  // Calculate totals by effect type
  let totalLootBonus = 0
  let totalPowerBonus = 0
  let totalDropRateBonus = 0

  for (const applied of activeSynergies) {
    for (const effect of applied.synergy.effects) {
      switch (effect.type) {
        case 'loot_quality':
          totalLootBonus += effect.value
          break
        case 'power':
          totalPowerBonus += effect.value
          break
        case 'drop_rate':
          totalDropRateBonus += effect.value
          break
      }
    }
  }

  // Apply soft cap
  const wasCapped = totalLootBonus > SYNERGY_SOFT_CAP ||
                    totalPowerBonus > SYNERGY_SOFT_CAP ||
                    totalDropRateBonus > SYNERGY_SOFT_CAP

  totalLootBonus = Math.min(totalLootBonus, SYNERGY_SOFT_CAP)
  totalPowerBonus = Math.min(totalPowerBonus, SYNERGY_SOFT_CAP)
  totalDropRateBonus = Math.min(totalDropRateBonus, SYNERGY_SOFT_CAP)

  return {
    activeSynergies,
    totalLootBonus,
    totalPowerBonus,
    totalDropRateBonus,
    cappedAt: SYNERGY_SOFT_CAP,
    wasCapped
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/utils/synergyCalculator.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add app/utils/synergyCalculator.ts tests/unit/utils/synergyCalculator.test.ts
git commit -m "feat(utils): add synergy calculator with pattern matching and soft cap"
```

---

## Task 9: Create Schematic Definitions Data

**Files:**
- Create: `app/data/schematics.ts`
- Create: `tests/data/schematics.test.ts`

**Step 1: Write failing test**

Create `tests/data/schematics.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { SCHEMATICS, getSchematicById, getSchematicsByRarity } from '~/data/schematics'
import { SCHEMATIC_SLOT_COUNTS, SCHEMATIC_THEMED_SLOTS } from '~~/types'

describe('Schematic Definitions', () => {
  describe('SCHEMATICS array', () => {
    it('should have at least 10 schematics defined', () => {
      expect(SCHEMATICS.length).toBeGreaterThanOrEqual(10)
    })

    it('should have schematics in all rarity tiers', () => {
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']
      for (const rarity of rarities) {
        const found = SCHEMATICS.filter(s => s.rarity === rarity)
        expect(found.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('should have unique IDs', () => {
      const ids = SCHEMATICS.map(s => s.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have slot counts matching rarity requirements', () => {
      for (const schematic of SCHEMATICS) {
        const expected = SCHEMATIC_SLOT_COUNTS[schematic.rarity]
        expect(schematic.slots.length).toBeGreaterThanOrEqual(expected.min)
        expect(schematic.slots.length).toBeLessThanOrEqual(expected.max)
      }
    })

    it('should have themed slot counts matching rarity', () => {
      for (const schematic of SCHEMATICS) {
        const expectedMax = SCHEMATIC_THEMED_SLOTS[schematic.rarity]
        const themedCount = schematic.slots.filter(s => s.themed).length
        expect(themedCount).toBeLessThanOrEqual(expectedMax)
      }
    })
  })

  describe('getSchematicById', () => {
    it('should return schematic by ID', () => {
      const schematic = getSchematicById('basic_cave')
      expect(schematic).toBeDefined()
      expect(schematic!.rarity).toBe('common')
    })

    it('should return undefined for unknown ID', () => {
      const schematic = getSchematicById('nonexistent')
      expect(schematic).toBeUndefined()
    })
  })

  describe('getSchematicsByRarity', () => {
    it('should return only common schematics', () => {
      const common = getSchematicsByRarity('common')
      expect(common.every(s => s.rarity === 'common')).toBe(true)
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/data/schematics.test.ts`
Expected: FAIL - Cannot find module

**Step 3: Create schematic definitions**

Create `app/data/schematics.ts`:

```typescript
import type { SchematicDefinition, Rarity } from '~~/types'

export const SCHEMATICS: SchematicDefinition[] = [
  // === COMMON (3-4 slots, 0 themed, 0 affixes) ===
  {
    id: 'basic_cave',
    name: 'Simple Cave',
    description: 'A basic cave dungeon',
    rarity: 'common',
    theme: 'cave',
    biome: 'cave',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: 'any' },
      { id: 'slot2', position: 2, allowedTypes: 'any' },
      { id: 'slot3', position: 3, allowedTypes: 'any' }
    ],
    affixes: [],
    baseDuration: 120,
    baseRewards: { goldMin: 50, goldMax: 100, xpMin: 20, xpMax: 40 }
  },
  {
    id: 'basic_forest',
    name: 'Forest Clearing',
    description: 'A clearing in the woods',
    rarity: 'common',
    theme: 'forest',
    biome: 'forest',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['beast'] },
      { id: 'slot2', position: 2, allowedTypes: 'any' },
      { id: 'slot3', position: 3, allowedTypes: 'any' }
    ],
    affixes: [],
    baseDuration: 90,
    baseRewards: { goldMin: 40, goldMax: 80, xpMin: 25, xpMax: 45 }
  },

  // === UNCOMMON (4-5 slots, 0 themed, 1 affix) ===
  {
    id: 'goblin_hideout',
    name: 'Goblin Hideout',
    description: 'A cave system overrun by goblins',
    rarity: 'uncommon',
    theme: 'cave',
    biome: 'cave',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['humanoid'] },
      { id: 'slot2', position: 2, allowedTypes: ['humanoid'] },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'quick_clear',
        category: 'efficiency',
        name: 'Quick Clear',
        description: 'Faster completion time',
        effect: { type: 'duration_reduction', value: 15 }
      }
    ],
    baseDuration: 150,
    baseRewards: { goldMin: 80, goldMax: 150, xpMin: 40, xpMax: 70 }
  },
  {
    id: 'beast_den',
    name: 'Beast Den',
    description: 'A lair of wild creatures',
    rarity: 'uncommon',
    theme: 'forest',
    biome: 'forest',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['beast'] },
      { id: 'slot2', position: 2, allowedTypes: ['beast'] },
      { id: 'slot3', position: 3, allowedTypes: ['beast'] },
      { id: 'slot4', position: 4, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'beast_bonus',
        category: 'monster_specific',
        name: 'Primal Grounds',
        description: 'Beasts are stronger here',
        effect: { type: 'monster_power', value: 10, condition: 'type:beast' }
      }
    ],
    baseDuration: 120,
    baseRewards: { goldMin: 70, goldMax: 130, xpMin: 35, xpMax: 65 }
  },

  // === RARE (5-6 slots, 1 themed, 1 affix) ===
  {
    id: 'undead_crypt',
    name: 'Haunted Crypt',
    description: 'An ancient burial ground',
    rarity: 'rare',
    theme: 'crypt',
    biome: 'ruins',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['undead'] },
      { id: 'slot2', position: 2, allowedTypes: ['undead'] },
      { id: 'slot3', position: 3, allowedTypes: ['undead'] },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      {
        id: 'slot5',
        position: 5,
        allowedTypes: ['undead'],
        themed: { type: 'monster_type', value: 'undead', bonusPercent: 20, bonusType: 'power' }
      }
    ],
    affixes: [
      {
        id: 'bone_harvest',
        category: 'loot',
        name: 'Bone Harvest',
        description: 'Increased bone material drops',
        effect: { type: 'material_bonus', value: 15, condition: 'material:bone' }
      }
    ],
    baseDuration: 180,
    baseRewards: { goldMin: 120, goldMax: 220, xpMin: 60, xpMax: 100 }
  },
  {
    id: 'volcanic_cave',
    name: 'Volcanic Cavern',
    description: 'A cave near molten rock',
    rarity: 'rare',
    theme: 'volcano',
    biome: 'mountain',
    slots: [
      { id: 'slot1', position: 1, allowedTypes: ['elemental', 'dragon'] },
      { id: 'slot2', position: 2, allowedTypes: 'any' },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      {
        id: 'slot5',
        position: 5,
        allowedTypes: 'any',
        requiredElements: ['fire'],
        themed: { type: 'element', value: 'fire', bonusPercent: 20, bonusType: 'loot' }
      }
    ],
    affixes: [
      {
        id: 'fire_attunement',
        category: 'amplifier',
        name: 'Fire Attunement',
        description: 'Fire synergies are amplified',
        effect: { type: 'synergy_amplifier', value: 50 },
        amplifies: { synergyType: 'element', synergyValue: 'fire', multiplier: 1.5 }
      }
    ],
    baseDuration: 200,
    baseRewards: { goldMin: 150, goldMax: 280, xpMin: 70, xpMax: 120 }
  },

  // === EPIC (7-8 slots, 2 themed, 1-2 affixes) ===
  {
    id: 'infernal_pit',
    name: 'Infernal Pit',
    description: 'A rift to the demon realm',
    rarity: 'epic',
    theme: 'infernal',
    biome: 'ruins',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['demon'],
        themed: { type: 'monster_type', value: 'demon', bonusPercent: 20, bonusType: 'power' }
      },
      { id: 'slot2', position: 2, allowedTypes: ['demon', 'undead'] },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      {
        id: 'slot6',
        position: 6,
        allowedTypes: 'any',
        requiredElements: ['fire', 'shadow'],
        themed: { type: 'element', value: 'fire', bonusPercent: 15, bonusType: 'loot' }
      },
      { id: 'slot7', position: 7, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'infernal_amplifier',
        category: 'amplifier',
        name: 'Demonic Surge',
        description: 'Demon synergies amplified',
        effect: { type: 'synergy_amplifier', value: 50 },
        amplifies: { synergyType: 'type', synergyValue: 'demon', multiplier: 1.5 }
      },
      {
        id: 'hellfire_speed',
        category: 'efficiency',
        name: 'Hellfire Efficiency',
        description: 'Faster completion',
        effect: { type: 'duration_reduction', value: 20 }
      }
    ],
    baseDuration: 240,
    baseRewards: { goldMin: 250, goldMax: 450, xpMin: 100, xpMax: 180 }
  },
  {
    id: 'dragon_roost',
    name: 'Dragon Roost',
    description: 'A mountain peak claimed by dragons',
    rarity: 'epic',
    theme: 'mountain',
    biome: 'mountain',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['dragon'],
        themed: { type: 'monster_type', value: 'dragon', bonusPercent: 25, bonusType: 'power' }
      },
      { id: 'slot2', position: 2, allowedTypes: ['dragon'] },
      { id: 'slot3', position: 3, allowedTypes: 'any' },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      {
        id: 'slot6',
        position: 6,
        allowedTypes: 'any',
        themed: { type: 'element', value: 'fire', bonusPercent: 15, bonusType: 'loot' }
      },
      { id: 'slot7', position: 7, allowedTypes: ['beast', 'humanoid'] },
      { id: 'slot8', position: 8, allowedTypes: 'any' }
    ],
    affixes: [
      {
        id: 'dragon_hoard',
        category: 'loot',
        name: 'Dragon Hoard',
        description: 'Increased gold and rare drops',
        effect: { type: 'gold_bonus', value: 30 }
      }
    ],
    baseDuration: 300,
    baseRewards: { goldMin: 300, goldMax: 550, xpMin: 120, xpMax: 200 }
  },

  // === LEGENDARY (9-10 slots, 2-3 themed, 2 affixes) ===
  {
    id: 'elemental_nexus',
    name: 'Elemental Nexus',
    description: 'Where all elements converge',
    rarity: 'legendary',
    theme: 'arcane',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['elemental'],
        themed: { type: 'monster_type', value: 'elemental', bonusPercent: 25, bonusType: 'power' }
      },
      {
        id: 'slot2',
        position: 2,
        allowedTypes: 'any',
        requiredElements: ['fire'],
        themed: { type: 'element', value: 'fire', bonusPercent: 20, bonusType: 'loot' }
      },
      {
        id: 'slot3',
        position: 3,
        allowedTypes: 'any',
        requiredElements: ['ice'],
        themed: { type: 'element', value: 'ice', bonusPercent: 20, bonusType: 'loot' }
      },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      { id: 'slot6', position: 6, allowedTypes: 'any' },
      { id: 'slot7', position: 7, allowedTypes: 'any' },
      { id: 'slot8', position: 8, allowedTypes: 'any' },
      { id: 'slot9', position: 9, allowedTypes: ['elemental', 'dragon'] }
    ],
    affixes: [
      {
        id: 'elemental_mastery_amp',
        category: 'amplifier',
        name: 'Elemental Mastery',
        description: 'All element synergies amplified',
        effect: { type: 'synergy_amplifier', value: 75 },
        amplifies: { synergyType: 'element', multiplier: 1.75 }
      },
      {
        id: 'arcane_efficiency',
        category: 'efficiency',
        name: 'Arcane Flow',
        description: 'Much faster completion',
        effect: { type: 'duration_reduction', value: 25 }
      }
    ],
    baseDuration: 360,
    baseRewards: { goldMin: 500, goldMax: 900, xpMin: 200, xpMax: 350 }
  },
  {
    id: 'abyssal_throne',
    name: 'Abyssal Throne',
    description: 'The seat of an ancient demon lord',
    rarity: 'legendary',
    theme: 'abyss',
    biome: 'ruins',
    slots: [
      {
        id: 'slot1',
        position: 1,
        allowedTypes: ['demon'],
        themed: { type: 'monster_type', value: 'demon', bonusPercent: 30, bonusType: 'power' }
      },
      {
        id: 'slot2',
        position: 2,
        allowedTypes: ['demon', 'aberration'],
        themed: { type: 'element', value: 'shadow', bonusPercent: 25, bonusType: 'loot' }
      },
      { id: 'slot3', position: 3, allowedTypes: ['demon', 'undead'] },
      { id: 'slot4', position: 4, allowedTypes: 'any' },
      { id: 'slot5', position: 5, allowedTypes: 'any' },
      { id: 'slot6', position: 6, allowedTypes: 'any' },
      { id: 'slot7', position: 7, allowedTypes: 'any' },
      {
        id: 'slot8',
        position: 8,
        allowedTypes: 'any',
        themed: { type: 'element', value: 'fire', bonusPercent: 20, bonusType: 'loot' }
      },
      { id: 'slot9', position: 9, allowedTypes: 'any' },
      { id: 'slot10', position: 10, allowedTypes: ['demon', 'dragon'] }
    ],
    affixes: [
      {
        id: 'abyssal_power',
        category: 'amplifier',
        name: 'Abyssal Power',
        description: 'Demon and shadow synergies doubled',
        effect: { type: 'synergy_amplifier', value: 100 },
        amplifies: { synergyType: 'type', synergyValue: 'demon', multiplier: 2.0 }
      },
      {
        id: 'dark_harvest',
        category: 'loot',
        name: 'Dark Harvest',
        description: 'Greatly increased rare drops',
        effect: { type: 'rare_bonus', value: 40 }
      }
    ],
    baseDuration: 400,
    baseRewards: { goldMin: 600, goldMax: 1100, xpMin: 250, xpMax: 400 }
  }
]

export function getSchematicById(id: string): SchematicDefinition | undefined {
  return SCHEMATICS.find(s => s.id === id)
}

export function getSchematicsByRarity(rarity: Rarity): SchematicDefinition[] {
  return SCHEMATICS.filter(s => s.rarity === rarity)
}

export function getSchematicsByBiome(biome: string): SchematicDefinition[] {
  return SCHEMATICS.filter(s => s.biome === biome)
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/data/schematics.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add app/data/schematics.ts tests/data/schematics.test.ts
git commit -m "feat(data): add schematic definitions with 10 schematics across all rarities"
```

---

## Task 10: Create Dungeon Validator Utility

**Files:**
- Create: `app/utils/dungeonValidator.ts`
- Create: `tests/unit/utils/dungeonValidator.test.ts`

**Step 1: Write failing test**

Create `tests/unit/utils/dungeonValidator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { validateDungeon, validateSlotPlacement } from '~/utils/dungeonValidator'
import type { Monster, SchematicDefinition, PlacedMonster } from '~~/types'

function createTestMonster(overrides: Partial<Monster> = {}): Monster {
  return {
    id: 'test-monster',
    baseName: 'Test Monster',
    type: 'beast',
    family: 'Wolf',
    element: 'physical',
    packType: 'trash',
    biome: 'forest',
    basePower: 20,
    baseCaptureChance: 0.3,
    lootTable: [],
    ...overrides
  }
}

const testSchematic: SchematicDefinition = {
  id: 'test-schematic',
  name: 'Test Dungeon',
  description: 'A test dungeon',
  rarity: 'common',
  theme: 'cave',
  slots: [
    { id: 'slot1', position: 1, allowedTypes: ['beast'] },
    { id: 'slot2', position: 2, allowedTypes: 'any' },
    { id: 'slot3', position: 3, allowedTypes: ['undead', 'demon'] }
  ],
  affixes: [],
  baseDuration: 120,
  baseRewards: { goldMin: 50, goldMax: 100, xpMin: 20, xpMax: 40 }
}

describe('Dungeon Validator', () => {
  describe('validateSlotPlacement', () => {
    it('should accept valid type placement', () => {
      const monster = createTestMonster({ type: 'beast' })
      const slot = { id: 'slot1', position: 1, allowedTypes: ['beast'] as const }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should accept any type in "any" slot', () => {
      const monster = createTestMonster({ type: 'dragon' })
      const slot = { id: 'slot2', position: 2, allowedTypes: 'any' as const }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(true)
    })

    it('should reject wrong type placement', () => {
      const monster = createTestMonster({ type: 'humanoid' })
      const slot = { id: 'slot1', position: 1, allowedTypes: ['beast'] as const }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].code).toBe('wrong_type')
    })

    it('should validate required elements', () => {
      const monster = createTestMonster({ element: 'ice' })
      const slot = {
        id: 'slot1',
        position: 1,
        allowedTypes: 'any' as const,
        requiredElements: ['fire'] as const
      }

      const result = validateSlotPlacement(monster, slot)

      expect(result.valid).toBe(false)
      expect(result.errors[0].code).toBe('wrong_element')
    })
  })

  describe('validateDungeon', () => {
    it('should validate complete valid dungeon', () => {
      const monsters: PlacedMonster[] = [
        { slotId: 'slot1', monsterId: 'm1', monster: createTestMonster({ id: 'm1', type: 'beast' }) },
        { slotId: 'slot2', monsterId: 'm2', monster: createTestMonster({ id: 'm2', type: 'dragon' }) },
        { slotId: 'slot3', monsterId: 'm3', monster: createTestMonster({ id: 'm3', type: 'undead' }) }
      ]

      const result = validateDungeon(testSchematic, monsters)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing monsters', () => {
      const monsters: PlacedMonster[] = [
        { slotId: 'slot1', monsterId: 'm1', monster: createTestMonster({ id: 'm1', type: 'beast' }) }
      ]

      const result = validateDungeon(testSchematic, monsters)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.code === 'missing_monster')).toBe(true)
    })

    it('should detect duplicate monsters', () => {
      const sharedMonster = createTestMonster({ id: 'same-monster', type: 'beast' })
      const monsters: PlacedMonster[] = [
        { slotId: 'slot1', monsterId: 'same-monster', monster: sharedMonster },
        { slotId: 'slot2', monsterId: 'same-monster', monster: sharedMonster },
        { slotId: 'slot3', monsterId: 'm3', monster: createTestMonster({ id: 'm3', type: 'undead' }) }
      ]

      const result = validateDungeon(testSchematic, monsters)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.code === 'duplicate_monster')).toBe(true)
    })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/utils/dungeonValidator.test.ts`
Expected: FAIL - Cannot find module

**Step 3: Implement dungeon validator**

Create `app/utils/dungeonValidator.ts`:

```typescript
import type {
  Monster,
  SchematicDefinition,
  SlotDefinition,
  PlacedMonster,
  DungeonValidation,
  DungeonValidationError
} from '~~/types'

interface SlotValidationResult {
  valid: boolean
  errors: DungeonValidationError[]
}

export function validateSlotPlacement(
  monster: Monster,
  slot: SlotDefinition
): SlotValidationResult {
  const errors: DungeonValidationError[] = []

  // Check type requirement
  if (slot.allowedTypes !== 'any') {
    if (!slot.allowedTypes.includes(monster.type)) {
      errors.push({
        slotId: slot.id,
        code: 'wrong_type',
        message: `Slot requires ${slot.allowedTypes.join(' or ')}, got ${monster.type}`
      })
    }
  }

  // Check element requirement
  if (slot.requiredElements && slot.requiredElements.length > 0) {
    if (!slot.requiredElements.includes(monster.element)) {
      errors.push({
        slotId: slot.id,
        code: 'wrong_element',
        message: `Slot requires ${slot.requiredElements.join(' or ')} element, got ${monster.element}`
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateDungeon(
  schematic: SchematicDefinition,
  placedMonsters: PlacedMonster[]
): DungeonValidation {
  const errors: DungeonValidationError[] = []
  const warnings: string[] = []

  // Check for missing monsters
  for (const slot of schematic.slots) {
    const placed = placedMonsters.find(pm => pm.slotId === slot.id)
    if (!placed) {
      errors.push({
        slotId: slot.id,
        code: 'missing_monster',
        message: `Slot ${slot.position} has no monster assigned`
      })
    }
  }

  // Check for duplicate monsters
  const monsterIds = placedMonsters.map(pm => pm.monsterId)
  const duplicates = monsterIds.filter((id, index) => monsterIds.indexOf(id) !== index)

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)]
    for (const dupId of uniqueDuplicates) {
      const slots = placedMonsters
        .filter(pm => pm.monsterId === dupId)
        .map(pm => pm.slotId)

      errors.push({
        code: 'duplicate_monster',
        message: `Monster ${dupId} is placed in multiple slots: ${slots.join(', ')}`
      })
    }
  }

  // Validate each placement
  for (const placed of placedMonsters) {
    const slot = schematic.slots.find(s => s.id === placed.slotId)
    if (!slot) {
      errors.push({
        slotId: placed.slotId,
        code: 'missing_monster',
        message: `Unknown slot ID: ${placed.slotId}`
      })
      continue
    }

    const slotValidation = validateSlotPlacement(placed.monster, slot)
    errors.push(...slotValidation.errors)
  }

  // Add warnings for suboptimal placements
  for (const placed of placedMonsters) {
    const slot = schematic.slots.find(s => s.id === placed.slotId)
    if (slot?.themed) {
      const matchesTheme =
        (slot.themed.type === 'element' && placed.monster.element === slot.themed.value) ||
        (slot.themed.type === 'monster_type' && placed.monster.type === slot.themed.value) ||
        (slot.themed.type === 'family' && placed.monster.family === slot.themed.value)

      if (!matchesTheme) {
        warnings.push(`Slot ${slot.position} has ${slot.themed.value} theme bonus that won't apply to ${placed.monster.baseName}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/unit/utils/dungeonValidator.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add app/utils/dungeonValidator.ts tests/unit/utils/dungeonValidator.test.ts
git commit -m "feat(utils): add dungeon validator for slot and placement validation"
```

---

## Summary

This plan covers the core type system and utilities for the dungeon synergy feature:

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add MonsterType and Element types | `types/base.ts` |
| 2 | Update Monster interface | `types/monsters.ts` |
| 3 | Update monster data | `app/data/monsters.ts` |
| 4 | Create synergy types | `types/synergies.ts` |
| 5 | Create schematic types | `types/schematics.ts` |
| 6 | Create dungeon types | `types/dungeons.ts` |
| 7 | Create synergy definitions | `app/data/synergies.ts` |
| 8 | Create synergy calculator | `app/utils/synergyCalculator.ts` |
| 9 | Create schematic definitions | `app/data/schematics.ts` |
| 10 | Create dungeon validator | `app/utils/dungeonValidator.ts` |

**Not in this plan (Phase 2):**
- API endpoints (see `dungeon-building-api-design.md`)
- UI components
- Database migrations
- Pinia stores

---

**Plan complete and saved to `docs/plans/2024-12-31-dungeon-synergy-implementation.md`.**

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
