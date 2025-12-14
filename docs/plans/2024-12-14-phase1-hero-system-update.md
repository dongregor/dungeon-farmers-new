# Phase 1: Hero System Update

> **Replaces:** Sections 2-3 of `2024-12-14-phase1-mvp-core-loop.md`
> **Based on:** `2024-12-14-hero-traits-design.md` brainstorming results
>
> ⚠️ **IMPORTANT:** Read `docs/plans/BEST_PRACTICES_REVIEW.md` before implementing.

This document updates the Phase 1 implementation plan with the new hero and traits system design.

**Nuxt 4 Notes:**
- Types go in `types/` at project root (shared between client/server)
- Client utils go in `app/utils/`
- Stores go in `app/stores/` and use `$fetch` (NOT `useFetch`)
- Import types with `~~/types` (double tilde = rootDir)

---

## Updated Section 2: Database Schema & Types (Tasks 9-16)

### Task 9: Define Core TypeScript Types - Base Types

**Files:**
- Create: `types/base.ts`

**Step 1: Create types/base.ts**

```typescript
// === RARITY ===
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type EquipmentRarity = Rarity | 'mythic'

// Rarity weights for random selection
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
}

// === STATS ===
export type StatType = 'combat' | 'utility' | 'survival'

export interface Stats {
  combat: number
  utility: number
  survival: number
}

// Stat points by rarity
export const STAT_POINTS_BY_RARITY: Record<Rarity, number> = {
  common: 12,
  uncommon: 14,
  rare: 16,
  epic: 18,
  legendary: 20,
}

// === ARCHETYPES ===
export type Archetype = 'tank' | 'healer' | 'debuffer' | 'melee_dps' | 'ranged_dps' | 'caster'

// Stat distribution weights by archetype (how to distribute stat points)
export const ARCHETYPE_STAT_WEIGHTS: Record<Archetype, Stats> = {
  tank: { combat: 0.2, utility: 0.2, survival: 0.6 },
  healer: { combat: 0.1, utility: 0.4, survival: 0.5 },
  debuffer: { combat: 0.3, utility: 0.5, survival: 0.2 },
  melee_dps: { combat: 0.6, utility: 0.2, survival: 0.2 },
  ranged_dps: { combat: 0.5, utility: 0.3, survival: 0.2 },
  caster: { combat: 0.6, utility: 0.3, survival: 0.1 },
}

// === CULTURES ===
export type Culture = 'northfolk' | 'coastborn' | 'woodwalkers' | 'crownlanders'

// === GENDER ===
export type Gender = 'male' | 'female' | 'nonbinary'

// === QUALITY (for gameplay traits) ===
export type TraitQuality = 'normal' | 'magic' | 'perfect'

// Quality multipliers for trait value ranges
export const QUALITY_MULTIPLIERS: Record<TraitQuality, { min: number; max: number }> = {
  normal: { min: 0.3, max: 0.5 },
  magic: { min: 0.5, max: 0.8 },
  perfect: { min: 0.8, max: 1.0 },
}

// === EQUIPMENT ===
export type EquipmentSlot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2'

// === EXPEDITION ===
export type ExpeditionStatus = 'idle' | 'in_progress' | 'completed'

// === ZONE ===
export type ZoneType = 'forest' | 'cave' | 'mountain' | 'swamp' | 'desert' | 'ruins'
export type ZoneDifficulty = 'easy' | 'medium' | 'hard' | 'extreme'

// Difficulty penalty multipliers
export const DIFFICULTY_MULTIPLIERS: Record<ZoneDifficulty, number> = {
  easy: 0.5,
  medium: 1.0,
  hard: 1.5,
  extreme: 2.0,
}
```

**Step 2: Commit**

```bash
git add types/base.ts
git commit -m "feat: add base type definitions for hero system"
```

---

### Task 10: Define Archetype Tag Types

**Files:**
- Create: `types/archetypes.ts`

**Step 1: Create types/archetypes.ts**

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

**Step 2: Commit**

```bash
git add types/archetypes.ts
git commit -m "feat: add archetype and tag type definitions"
```

---

### Task 11: Define Threat Types

**Files:**
- Create: `types/threats.ts`

**Step 1: Create types/threats.ts**

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

**Step 2: Commit**

```bash
git add types/threats.ts
git commit -m "feat: add threat type definitions and penalty calculations"
```

---

### Task 12: Define Trait Types

**Files:**
- Create: `types/traits.ts`

**Step 1: Create types/traits.ts**

```typescript
import type { TraitQuality, StatType, ZoneType } from './base'

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

import type { Rarity } from './base'

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

**Step 2: Commit**

```bash
git add types/traits.ts
git commit -m "feat: add gameplay and story trait type definitions"
```

---

### Task 13: Define Hero Types

**Files:**
- Create: `types/hero.ts`

**Step 1: Create types/hero.ts**

```typescript
import type {
  Rarity, Stats, Archetype, Culture, Gender, EquipmentSlot
} from './base'
import type { ArchetypeTag } from './archetypes'
import type { HeroGameplayTrait, StoryTrait } from './traits'

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

  // State
  currentExpeditionId: string | null
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

  // Stats scale with account
  baseStats: Stats

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
export interface TavernHero extends Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt'> {
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

// Party preset
export interface PartyPreset {
  id: string
  name: string
  heroIds: string[]
  createdAt: string
}
```

**Step 2: Commit**

```bash
git add types/hero.ts
git commit -m "feat: add hero and guild master type definitions"
```

---

### Task 14: Define Recruitment Types

**Files:**
- Create: `types/recruitment.ts`

**Step 1: Create types/recruitment.ts**

```typescript
import type { Rarity } from './base'
import type { TavernHero } from './hero'

// Tavern slot configuration
export interface TavernSlot {
  id: string
  rarity: Rarity | 'epic_plus'  // 'epic_plus' = epic or legendary
  hero: TavernHero | null
  isLocked: boolean
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
export const TAVERN_PROGRESSION = {
  // Account level -> tavern configuration
  1: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
    ],
    lockSlots: 1,
  },
  5: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
    ],
    lockSlots: 1,
  },
  10: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'rare' as const },
    ],
    lockSlots: 2,
  },
  20: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'rare' as const },
      { rarity: 'rare' as const },
    ],
    lockSlots: 2,
  },
  30: {
    slots: [
      { rarity: 'common' as const },
      { rarity: 'common' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'uncommon' as const },
      { rarity: 'rare' as const },
      { rarity: 'rare' as const },
      { rarity: 'epic_plus' as const },
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
```

**Step 2: Commit**

```bash
git add types/recruitment.ts
git commit -m "feat: add recruitment and tavern type definitions"
```

---

### Task 15: Create Type Index

**Files:**
- Create: `types/index.ts`

**Step 1: Create types/index.ts**

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
```

**Step 2: Commit**

```bash
git add types/index.ts
git commit -m "feat: add types index for clean imports"
```

---

### Task 16: Create Database Schema

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

  -- Resources
  gold INTEGER NOT NULL DEFAULT 100,
  premium_currency INTEGER NOT NULL DEFAULT 0,

  -- Progression
  account_level INTEGER NOT NULL DEFAULT 1,
  account_xp INTEGER NOT NULL DEFAULT 0,

  -- Daily limits
  hero_recruitments_today INTEGER NOT NULL DEFAULT 0,
  last_recruitment_reset TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Tavern state
  tavern_last_refresh TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Heroes table
CREATE TABLE heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,

  -- Identity
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  culture TEXT NOT NULL,
  titles TEXT[] NOT NULL DEFAULT '{}',
  display_title TEXT,

  -- Classification
  rarity TEXT NOT NULL,
  archetype TEXT NOT NULL,
  archetype_tags TEXT[] NOT NULL,

  -- Stats (stored as JSONB for flexibility)
  base_stats JSONB NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL DEFAULT 100,

  -- Traits
  gameplay_traits JSONB NOT NULL DEFAULT '[]',
  story_trait_ids TEXT[] NOT NULL DEFAULT '{}',

  -- Power (cached)
  power INTEGER NOT NULL DEFAULT 0,

  -- Equipment
  equipment JSONB NOT NULL DEFAULT '{}',

  -- Prestige
  prestige_level INTEGER NOT NULL DEFAULT 0,
  prestige_bonuses JSONB NOT NULL DEFAULT '{"combat": 0, "utility": 0, "survival": 0}',

  -- State
  current_expedition_id UUID,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guild Master table (one per player)
CREATE TABLE guild_masters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE UNIQUE,

  -- Identity
  name TEXT NOT NULL,
  gender TEXT NOT NULL,

  -- Classification
  archetype TEXT,
  archetype_tags TEXT[] NOT NULL DEFAULT '{}',

  -- Stats
  base_stats JSONB NOT NULL DEFAULT '{"combat": 10, "utility": 10, "survival": 10}',

  -- Equippable traits
  equipped_trait_ids TEXT[] NOT NULL DEFAULT '{}',
  max_equipped_traits INTEGER NOT NULL DEFAULT 2,
  unlocked_trait_ids TEXT[] NOT NULL DEFAULT '{}',

  -- Bonuses
  leader_bonus INTEGER NOT NULL DEFAULT 5,
  mentor_bonus INTEGER NOT NULL DEFAULT 10,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tavern heroes (available for recruitment)
CREATE TABLE tavern_heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  slot_index INTEGER NOT NULL,

  -- Hero data (same structure as heroes)
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

  -- Recruitment
  recruit_cost INTEGER NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,

  -- Timestamps
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

  -- Stats
  stats JSONB NOT NULL,
  gear_score INTEGER NOT NULL,

  -- Set bonus
  set_id TEXT,

  -- Owner
  equipped_hero_id UUID REFERENCES heroes(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_heroes_player ON heroes(player_id);
CREATE INDEX idx_heroes_expedition ON heroes(current_expedition_id);
CREATE INDEX idx_equipment_player ON equipment(player_id);
CREATE INDEX idx_equipment_hero ON equipment(equipped_hero_id);
CREATE INDEX idx_tavern_player ON tavern_heroes(player_id);

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
```

**Step 2: Commit**

```bash
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat: add initial database schema"
```

---

## Updated Section 3: Hero System (Tasks 17-26)

### Task 17: Create Name Data

**Files:**
- Create: `app/data/names.ts`

**Step 1: Create data/names.ts**

```typescript
import type { Gender, Culture } from '~~/types'

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

**Step 2: Commit**

```bash
git add data/names.ts
git commit -m "feat: add hero name data with culture preferences"
```

---

### Task 18: Create Gameplay Trait Data

**Files:**
- Create: `app/data/gameplayTraits.ts`

**Step 1: Create data/gameplayTraits.ts**

```typescript
import type { GameplayTrait } from '~~/types'

export const GAMEPLAY_TRAITS: Record<string, GameplayTrait> = {
  // === STAT BONUSES ===
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
  nimble: {
    id: 'nimble',
    name: 'Nimble',
    description: '+{value}% Utility',
    effect: 'stat_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    statBonus: { stat: 'utility', isPercent: true },
    reactions: {
      onLoot: [
        '{hero} spotted the hidden chest first.',
        '{hero} picked the lock in seconds.',
      ],
    },
  },
  tough: {
    id: 'tough',
    name: 'Tough',
    description: '+{value}% Survival',
    effect: 'stat_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    statBonus: { stat: 'survival', isPercent: true },
    reactions: {
      onCombat: [
        '{hero} barely flinched from the hit.',
        '{hero} shrugged off what should have hurt.',
      ],
    },
  },

  // === CONDITIONAL BONUSES ===
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
    reactions: {
      onEvent: [
        '{hero} navigated the dark tunnels with ease.',
        '{hero} felt right at home in the depths.',
      ],
    },
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: '+{value}% efficiency on long expeditions',
    effect: 'conditional_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    conditionalBonus: {
      condition: 'expedition_length',
      conditionValue: 'long',
      allStats: true,
    },
  },
  dragon_slayer: {
    id: 'dragon_slayer',
    name: 'Dragon Slayer',
    description: '+{value}% Combat vs dragon enemies',
    effect: 'conditional_bonus',
    isNegative: false,
    minValue: 15,
    maxValue: 40,
    conditionalBonus: {
      condition: 'enemy_type',
      conditionValue: 'dragon',
      stat: 'combat',
    },
  },
  lone_wolf: {
    id: 'lone_wolf',
    name: 'Lone Wolf',
    description: '+{value}% stats solo, -{value2}% in full parties',
    effect: 'trade_off',
    isNegative: false,
    minValue: 20,
    maxValue: 35,
    tradeOff: {
      positiveStat: 'combat',
      negativeStat: 'combat',
      negativeRatio: 0.6,
    },
    conditionalBonus: {
      condition: 'party_size',
      conditionValue: 'solo',
      allStats: true,
    },
  },

  // === LOOT BONUSES ===
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    description: '+{value}% rare drop chance',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    lootBonus: { type: 'rare_drops' },
    reactions: {
      onLoot: [
        '{hero} found something shiny!',
        'Of course {hero} found the good stuff.',
      ],
    },
  },
  greedy: {
    id: 'greedy',
    name: 'Greedy',
    description: '+{value}% gold find',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    lootBonus: { type: 'gold' },
    reactions: {
      onLoot: [
        '{hero} immediately counted the coins.',
        '{hero} was suspiciously thorough searching corpses.',
      ],
    },
  },
  scavenger: {
    id: 'scavenger',
    name: 'Scavenger',
    description: '+{value}% material drops',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 20,
    lootBonus: { type: 'materials' },
  },

  // === EXPEDITION BONUSES ===
  swift: {
    id: 'swift',
    name: 'Swift',
    description: '-{value}% expedition time',
    effect: 'expedition_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    expeditionBonus: { type: 'speed' },
  },
  thorough: {
    id: 'thorough',
    name: 'Thorough',
    description: '+{value}% event discovery chance',
    effect: 'expedition_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    expeditionBonus: { type: 'event_chance' },
    reactions: {
      onEvent: [
        '{hero} noticed something others missed.',
        '{hero} insisted on checking one more room.',
      ],
    },
  },
  mentor: {
    id: 'mentor',
    name: 'Mentor',
    description: '+{value}% XP to party members',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    lootBonus: { type: 'xp' },
  },

  // === TRADE-OFFS ===
  glass_cannon: {
    id: 'glass_cannon',
    name: 'Glass Cannon',
    description: '+{value}% Combat, -{value2}% Survival',
    effect: 'trade_off',
    isNegative: false,
    minValue: 15,
    maxValue: 30,
    tradeOff: {
      positiveStat: 'combat',
      negativeStat: 'survival',
      negativeRatio: 0.7,
    },
  },
  hoarder: {
    id: 'hoarder',
    name: 'Hoarder',
    description: '+{value}% loot, -{value2}% expedition speed',
    effect: 'trade_off',
    isNegative: false,
    minValue: 20,
    maxValue: 35,
    tradeOff: {
      positiveStat: 'utility',
      negativeStat: 'utility',
      negativeRatio: 0.5,
    },
    lootBonus: { type: 'materials' },
    expeditionBonus: { type: 'speed' },
  },

  // === NEGATIVE TRAITS ===
  clumsy: {
    id: 'clumsy',
    name: 'Clumsy',
    description: '-{value}% Utility',
    effect: 'stat_bonus',
    isNegative: true,
    minValue: 3,
    maxValue: 10,
    statBonus: { stat: 'utility', isPercent: true },
    reactions: {
      onEvent: [
        '{hero} tripped over nothing.',
        '{hero} knocked something over. Again.',
      ],
    },
  },
  frail: {
    id: 'frail',
    name: 'Frail',
    description: '-{value}% Survival',
    effect: 'stat_bonus',
    isNegative: true,
    minValue: 3,
    maxValue: 10,
    statBonus: { stat: 'survival', isPercent: true },
  },
  weak: {
    id: 'weak',
    name: 'Weak',
    description: '-{value}% Combat',
    effect: 'stat_bonus',
    isNegative: true,
    minValue: 3,
    maxValue: 10,
    statBonus: { stat: 'combat', isPercent: true },
  },
  cowardly: {
    id: 'cowardly',
    name: 'Cowardly',
    description: '-{value}% Combat when facing bosses',
    effect: 'conditional_bonus',
    isNegative: true,
    minValue: 10,
    maxValue: 25,
    conditionalBonus: {
      condition: 'enemy_type',
      conditionValue: 'boss',
      stat: 'combat',
    },
    reactions: {
      onCombat: [
        '{hero} hid behind the nearest party member.',
        '{hero} suggested a tactical retreat.',
      ],
    },
  },
  unlucky: {
    id: 'unlucky',
    name: 'Unlucky',
    description: '-{value}% rare drop chance',
    effect: 'loot_bonus',
    isNegative: true,
    minValue: 5,
    maxValue: 15,
    lootBonus: { type: 'rare_drops' },
    reactions: {
      onLoot: [
        '{hero} found nothing but cobwebs.',
        'The chest was empty. Classic {hero}.',
      ],
    },
  },
}

// Helper functions
export function getGameplayTraitById(id: string): GameplayTrait | undefined {
  return GAMEPLAY_TRAITS[id]
}

export function getPositiveGameplayTraits(): GameplayTrait[] {
  return Object.values(GAMEPLAY_TRAITS).filter(t => !t.isNegative)
}

export function getNegativeGameplayTraits(): GameplayTrait[] {
  return Object.values(GAMEPLAY_TRAITS).filter(t => t.isNegative)
}
```

**Step 2: Commit**

```bash
git add data/gameplayTraits.ts
git commit -m "feat: add gameplay trait data with effects and reactions"
```

---

### Task 19: Create Story Trait Data

**Files:**
- Create: `app/data/storyTraits.ts`

**Step 1: Create data/storyTraits.ts**

```typescript
import type { StoryTrait, ZoneType } from '~~/types'

export const STORY_TRAITS: Record<string, StoryTrait> = {
  // === PERSONALITY QUIRKS ===
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
  overly_dramatic: {
    id: 'overly_dramatic',
    name: 'Overly Dramatic',
    description: 'Treats everything like a grand performance',
    source: 'generation',
    reactions: {
      onCombat: [
        '{hero} announced their attack with a flourish.',
        '{hero} narrated the battle in third person.',
      ],
      onEvent: [
        '{hero} declared this was surely the end.',
        '{hero} monologued about their destiny.',
      ],
    },
    grantsTitle: 'the Theatrical',
  },
  compulsive_counter: {
    id: 'compulsive_counter',
    name: 'Compulsive Counter',
    description: 'Counts everything obsessively',
    source: 'generation',
    reactions: {
      onLoot: [
        '{hero} counted exactly how many coins dropped.',
        '{hero} organized the loot by quantity.',
      ],
      onEvent: [
        '{hero} counted the enemies. Twice.',
        '{hero} noted there were 47 steps in the corridor.',
      ],
    },
  },
  terrible_singer: {
    id: 'terrible_singer',
    name: 'Terrible Singer',
    description: 'Sings badly at inappropriate moments',
    source: 'generation',
    reactions: {
      onEvent: [
        '{hero} hummed loudly, alerting enemies.',
        '{hero}\'s singing echoed through the dungeon.',
      ],
    },
  },
  superstitious: {
    id: 'superstitious',
    name: 'Superstitious',
    description: 'Follows bizarre rituals for "luck"',
    source: 'generation',
    reactions: {
      onEvent: [
        '{hero} refused to step on cracks.',
        '{hero} performed a luck ritual before entering.',
      ],
      onLoot: [
        '{hero} credited their lucky charm.',
        '{hero} needed to find a four-leaf clover first.',
      ],
    },
  },

  // === FEARS & PHOBIAS ===
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
  bug_phobia: {
    id: 'bug_phobia',
    name: 'Bug Phobia',
    description: 'Screams at insects',
    source: 'generation',
    reactions: {
      onZoneType: {
        cave: [
          '{hero} screamed at a spider.',
          '{hero} demanded someone else handle the bugs.',
        ],
        swamp: [
          '{hero} was covered in mosquitos.',
          '{hero} jumped at every buzzing sound.',
        ],
      },
    },
  },
  claustrophobic: {
    id: 'claustrophobic',
    name: 'Claustrophobic',
    description: 'Panics in tight spaces',
    source: 'generation',
    reactions: {
      onZoneType: {
        cave: [
          '{hero} hyperventilated in the narrow tunnel.',
          '{hero} needed fresh air breaks.',
        ],
      },
    },
  },

  // === OBSESSIONS & HOBBIES ===
  amateur_botanist: {
    id: 'amateur_botanist',
    name: 'Amateur Botanist',
    description: 'Obsessed with cataloging plants',
    source: 'generation',
    reactions: {
      onZoneType: {
        forest: [
          '{hero} stopped to identify every plant.',
          '{hero} collected leaf samples.',
        ],
        swamp: [
          '{hero} was excited about rare fungi.',
          '{hero} warned about poisonous plants.',
        ],
      },
      onEvent: [
        '{hero} found a new species. Probably.',
        '{hero} made notes about the local flora.',
      ],
    },
    grantsTitle: 'the Botanist',
  },
  rock_collector: {
    id: 'rock_collector',
    name: 'Rock Collector',
    description: 'Picks up interesting rocks everywhere',
    source: 'generation',
    reactions: {
      onZoneType: {
        cave: [
          '{hero}\'s pockets were suspiciously heavy.',
          '{hero} found "the perfect specimen".',
        ],
        mountain: [
          '{hero} evaluated every boulder.',
          '{hero} insisted this rock was special.',
        ],
      },
    },
  },
  conspiracy_theorist: {
    id: 'conspiracy_theorist',
    name: 'Conspiracy Theorist',
    description: 'Sees connections everywhere',
    source: 'generation',
    reactions: {
      onEvent: [
        '{hero} explained how this was all connected.',
        '{hero} mentioned Big Potion was behind it.',
      ],
      onLoot: [
        '{hero} claimed the treasure was planted.',
        '{hero} looked for hidden messages in the loot.',
      ],
    },
  },
  wannabe_chef: {
    id: 'wannabe_chef',
    name: 'Wannabe Chef',
    description: 'Tries to cook with anything',
    source: 'generation',
    reactions: {
      onLoot: [
        '{hero} wondered if this was edible.',
        '{hero} planned tonight\'s dinner.',
      ],
      onEvent: [
        '{hero} suggested a cooking break.',
        '{hero} seasoned the rations. Unwisely.',
      ],
    },
    grantsTitle: 'the Cook',
  },

  // === ACQUIRED TRAITS (from events) ===
  dragon_survivor: {
    id: 'dragon_survivor',
    name: 'Dragon Survivor',
    description: 'Lived through a dragon encounter',
    source: 'event',
    reactions: {
      onCombat: [
        '{hero} recalled facing worse.',
        '{hero} mentioned that one time with the dragon.',
      ],
    },
    grantsTitle: 'the Dragon Survivor',
  },
  cursed: {
    id: 'cursed',
    name: 'Cursed',
    description: 'Something dark follows them',
    source: 'curse',
    reactions: {
      onEvent: [
        'Something unlucky happened near {hero}.',
        '{hero}\'s curse acted up again.',
      ],
    },
    grantsTitle: 'the Cursed',
  },
}

// Helper functions
export function getStoryTraitById(id: string): StoryTrait | undefined {
  return STORY_TRAITS[id]
}

export function getGenerationStoryTraits(): StoryTrait[] {
  return Object.values(STORY_TRAITS).filter(t => t.source === 'generation')
}

export function getEventStoryTraits(): StoryTrait[] {
  return Object.values(STORY_TRAITS).filter(t => t.source === 'event')
}
```

**Step 2: Commit**

```bash
git add data/storyTraits.ts
git commit -m "feat: add story trait data with reactions and titles"
```

---

### Task 20: Create Culture Data

**Files:**
- Create: `app/data/cultures.ts`

**Step 1: Create data/cultures.ts**

```typescript
import type { Culture } from '~~/types'

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

**Step 2: Commit**

```bash
git add data/cultures.ts
git commit -m "feat: add culture data with flavor texts"
```

---

### Task 21: Create Hero Generator

**Files:**
- Create: `app/utils/heroGenerator.ts`
- Create: `tests/utils/heroGenerator.test.ts`

**Step 1: Write test**

Create `tests/utils/heroGenerator.test.ts`:

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

**Step 2: Run test to see it fail**

```bash
npm run test:run -- tests/utils/heroGenerator.test.ts
```

**Step 3: Create utils/heroGenerator.ts**

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
    const quality = generateQuality() // Higher quality = more severe for negatives

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

  // Bonus from positive traits (simplified)
  power += gameplayTraits.filter(t => !t.traitId.startsWith('weak') && !t.traitId.startsWith('clumsy')).length * 5

  return Math.round(power)
}

// Main hero generation function
export function generateHero(options: HeroGenerationOptions = {}): Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt'> {
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

**Step 4: Run tests**

```bash
npm run test:run -- tests/utils/heroGenerator.test.ts
```

**Step 5: Commit**

```bash
git add utils/heroGenerator.ts tests/utils/heroGenerator.test.ts
git commit -m "feat: add hero generator with archetypes, tags, and traits"
```

---

### Task 22-26: Remaining Hero System Tasks

The remaining tasks follow the same pattern:

- **Task 22:** Create hero power calculator utility
- **Task 23:** Create hero store (Pinia) with CRUD operations
- **Task 24:** Create recruitment/tavern store
- **Task 25:** Create hero API routes
- **Task 26:** Create Guild Master initialization

Each task follows TDD pattern: write test → see fail → implement → verify → commit.

---

## Updated Section 4: Expedition System Changes

The expedition system needs updates to integrate the threat/counter system:

### Key Changes

1. **Zone definitions include threats:**
```typescript
interface Zone {
  // ... existing fields
  threats: string[] // Threat IDs from THREATS
  difficulty: ZoneDifficulty
}
```

2. **Efficiency calculation includes threat matching:**
```typescript
function calculateEfficiency(team: Hero[], zone: Zone): number {
  let efficiency = calculateBasePower(team) / zone.requiredPower

  // Apply threat penalties/bonuses
  for (const threatId of zone.threats) {
    const threat = THREATS[threatId]
    const hasCounter = team.some(hero =>
      hero.archetypeTags.some(tag => threat.counteredBy.includes(tag))
    )
    efficiency += calculateThreatPenalty(threat, zone.difficulty, hasCounter) / 100
  }

  return Math.max(0.6, Math.min(1.5, efficiency))
}
```

3. **Expedition logs reference tag counters:**
```typescript
// When a threat is countered
"{heroName}'s {tagName} ability neutralized the {threatName} threat."
```

---

## Summary of Changes

### New Files
- `types/base.ts` - Core enums and constants
- `types/archetypes.ts` - Archetype tags and pools
- `types/threats.ts` - Threat definitions
- `types/traits.ts` - Gameplay and story traits
- `types/hero.ts` - Hero and Guild Master types
- `types/recruitment.ts` - Tavern system
- `data/names.ts` - Name pools
- `data/gameplayTraits.ts` - Gameplay trait definitions
- `data/storyTraits.ts` - Story trait definitions
- `data/cultures.ts` - Culture information
- `utils/heroGenerator.ts` - Hero generation logic

### Removed/Replaced
- Old `types/game.ts` - Replace with new modular types
- Old trait system (flat/conditional/tag) - Replace with gameplay/story split

### Key Architectural Changes
1. Three stats (combat/utility/survival) instead of four
2. Archetypes with tag pools for threat countering
3. Dual trait system (gameplay with quality, story with reactions)
4. Tavern-based recruitment with rarity slots
5. Guild Master as unique player character

---

## Next Steps

After implementing this update:
1. Update expedition system for threat integration
2. Update UI components for new hero display
3. Add tavern UI for recruitment
4. Add Guild Master creation flow in tutorial
