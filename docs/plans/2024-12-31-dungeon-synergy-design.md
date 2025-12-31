# Dungeon Synergy System Design

**Date:** 2024-12-31
**Status:** Brainstormed, ready for implementation
**Related:** GAME_DESIGN_V2.md (Phase 2), dungeon-building-api-design.md

> When implementing: Follow patterns in `docs/plans/BEST_PRACTICES_REVIEW.md`

---

## Overview

The synergy system creates depth in dungeon building through discoverable bonuses when monsters are combined strategically. It's the "puzzle layer" that makes the dungeon system the game's differentiator.

### Core Philosophy: "Finally, it clicked!"

Synergies emerge naturally through play. Basic synergies are obvious and shown in UI. Advanced synergies reward pattern recognition. Hidden synergies exist but have breadcrumbs (monster descriptions hint at combos). Players who experiment feel clever; players who don't still find most synergies eventually.

### Two Puzzle Systems

| System | Affects | Examples |
|--------|---------|----------|
| Monster synergies | Loot quality & drops | "3+ Wolves: +15% crit gear" |
| Schematic affixes | Power, efficiency, duration, XP | "Volcanic Lair: -20% run time" |

These are separate but connected. Schematic "amplifier" affixes can boost monster synergies without gating them.

### Power Philosophy

- Synergies are meaningful but not mandatory
- Unoptimized dungeon is ~70-80% as effective as optimized
- Gap between casual and optimizer is ~35% - rewarding, not punishing
- **Soft cap:** ~60% total monster synergy bonus
- Prevents "solved" metas; multiple valid builds coexist

---

## Monster Taxonomy

### Four Categorization Axes

| Axis | Purpose | Count |
|------|---------|-------|
| **Type** | Broad creature category | ~8 |
| **Family** | Specific creature group | ~25-30 |
| **Element** | Magical affinity | ~8 |
| **Biome** | Origin zone | Matches zones |

### Types (~8)

| Type | Vibe | Example Families |
|------|------|------------------|
| Beast | Natural animals | Wolf, Bear, Boar, Serpent, Bird |
| Undead | Death-touched | Skeleton, Ghost, Zombie, Vampire |
| Elemental | Pure elements | Slime, Sprite, Wisp, Golem |
| Dragon | Draconic creatures | Drake, Wyvern, Wyrm, Hydra |
| Humanoid | Intelligent foes | Goblin, Orc, Bandit, Cultist |
| Construct | Animated objects | Golem, Automaton, Gargoyle |
| Demon | Infernal beings | Imp, Fiend, Succubus, Hellhound |
| Aberration | Otherworldly | Ooze, Beholder, Mind-flayer, Mimic |

### Elements (~8)

Fire, Ice, Lightning, Nature, Shadow, Holy, Arcane, Physical (no element)

### Monster Definition

Each monster has one Type, one Family, one Element, one Biome.

**Example:** "Fire Wolf from Volcano" = Beast (Type), Wolf (Family), Fire (Element), Volcano (Biome)

---

## Synergy Tiers & Power

### Three Synergy Tiers

| Tier | Power Range | Discovery | UI Display |
|------|-------------|-----------|------------|
| **Basic** | 5-10% | Shown before placement | Always visible |
| **Intermediate** | 10-20% | Shown after first discovery | Revealed once triggered |
| **Hidden** | 20-35% | Found through experimentation | "???" until discovered |

### Soft Cap

~60% total stacked monster synergy bonus

### Player Experience by Engagement

| Player Type | Typical Bonus | How They Get There |
|-------------|---------------|---------------------|
| New player | 0% | Just filling slots |
| Casual | 15-25% | Matching obvious patterns |
| Engaged | 30-45% | Noticing intermediate synergies |
| Optimizer | 50-60% | Stacking hidden synergies |

### Design Intent

- Gap between casual and optimizer is ~35% - meaningful but not crushing
- Casual dungeons work fine, just not maximized
- Diminishing returns past 50% discourages "one perfect build"
- Multiple ~45% builds can coexist as valid choices

---

## Synergy Patterns

### Monster Synergy Templates

| Pattern | Trigger | Tier | Example |
|---------|---------|------|---------|
| **Type threshold** | 3+ same Type | Basic | "3+ Beasts: +8% power" |
| **Element matching** | 3+ same Element | Basic | "3+ Fire: +10% fire loot" |
| **Biome harmony** | All from same Biome | Basic | "All Forest: +10% nature drops" |
| **Family threshold** | 3+ same Family | Intermediate | "3+ Wolves: +15% crit gear" |
| **All same Type** | Every slot same Type | Intermediate | "All Undead: +20% bone materials" |
| **Element combo** | Specific elements together | Intermediate | "Fire + Ice: +15% rare drops" |
| **Type + Element** | Type with specific element | Hidden | "Fire Dragons: +25% dragon hoard" |
| **Opposites** | Opposing elements together | Hidden | "Shadow + Holy: +30% blessed/cursed gear" |
| **Full diversity** | No Type duplicates | Hidden | "All different Types: +20% unique drops" |

### Pattern Notes

- Basic patterns are additive (can stack Type + Element + Biome)
- Intermediate patterns require more commitment
- Hidden patterns reward experimentation or cross-axis thinking
- Some patterns are mutually exclusive ("All same" vs "Full diversity")

---

## Schematic Structure

### Slot Count by Rarity

| Rarity | Total Slots | Themed Slots |
|--------|-------------|--------------|
| Common | 3-4 | 0 |
| Uncommon | 4-5 | 0 |
| Rare | 5-6 | 1 |
| Epic | 7-8 | 2 |
| Legendary | 9-10 | 2-3 |

### Two Affix Scopes

| Scope | Example |
|-------|---------|
| **Themed Slot** | "Fire Slot: Fire monsters here +20% power" |
| **Schematic-wide** | "Volcanic Lair: -20% run duration" |

### Nine Affix Categories

| Category | Examples | Min Rarity |
|----------|----------|------------|
| Power | "+15% dungeon power" | Uncommon |
| Efficiency | "-20% completion time" | Uncommon |
| XP | "+25% XP gained" | Uncommon |
| Loot | "+10% equipment drops", "Guaranteed material" | Rare |
| Monster-specific | "Demons +25% power", "Dragons count as 2" | Rare |
| Amplifier | "Fire synergies give 1.5x bonus" | Epic |
| Trade-off | "+40% rare drops, +30% run time" | Epic |
| Hero synergy | "Heroes with [tag] +15% efficiency" | Epic |
| Wildcard | "One slot accepts ANY type" | Legendary |

### Schematic Affix Count by Rarity

| Rarity | Schematic-wide Affixes |
|--------|------------------------|
| Common | 0 |
| Uncommon | 1 |
| Rare | 1 |
| Epic | 1-2 |
| Legendary | 2 |

### Key Principle

Schematic affixes enhance, never gate. A Fire synergy works without a fire schematic - the schematic just makes it *better*.

---

## Discovery Mechanics

### How Players Find Synergies

| Tier | Discovery Method |
|------|------------------|
| Basic | Always visible in UI before placement |
| Intermediate | Revealed after triggering once, then permanently visible |
| Hidden | Must be triggered to discover; hints exist in monster descriptions |

### Breadcrumb System

Hidden synergies aren't pure guesswork. Clues exist:

- **Monster descriptions:** "Fire Drakes are known to react violently near ice..."
- **Flavor text:** "The ancients combined shadow and holy for devastating effect"
- **Partial hints in UI:** "??? synergy possible with Fire + ???"
- **NPC dialogue:** Tavern rumors about powerful combinations

### Discovery Rewards

| Event | Reward |
|-------|--------|
| First intermediate discovery | Small gold bonus |
| First hidden discovery | Premium currency + codex entry |
| Complete a synergy category | Achievement + title |
| Find 50% of all synergies | Cosmetic reward |

### Synergy Codex

- Tracks all discovered synergies
- Shows "???" for undiscovered with vague hints
- Displays requirements once discovered
- Shows which dungeons use each synergy
- Discoveries are per-account

---

## Example Synergy Catalog

### Basic Tier (5-10%, always visible)

| Name | Trigger | Bonus |
|------|---------|-------|
| Pack Tactics | 3+ Beasts | +8% power |
| Elemental Confluence | 3+ same Element | +10% elemental loot |
| Risen Horde | 3+ Undead | +8% power |
| Forest Harmony | All from Forest biome | +10% nature drops |
| Dragon's Presence | 2+ Dragons | +8% power |
| Construct Assembly | 3+ Constructs | +10% material drops |

### Intermediate Tier (10-20%, revealed on first trigger)

| Name | Trigger | Bonus |
|------|---------|-------|
| Wolf Pack | 3+ Wolves specifically | +15% crit gear |
| Volatile Reaction | Fire + Ice together | +15% rare drops |
| Legion of Bone | All Undead, 5+ slots | +20% bone materials |
| Elemental Purity | All same Element | +18% elemental loot |
| Biome Dominance | All same Biome, 4+ slots | +15% zone materials |
| Infernal Court | 3+ Demons | +18% demonic gear |

### Hidden Tier (20-35%, discovered through experimentation)

| Name | Trigger | Bonus |
|------|---------|-------|
| Draconic Inferno | Fire Dragons, 3+ | +30% dragon hoard |
| Twilight Paradox | Shadow + Holy together | +25% blessed/cursed gear |
| Apex Diversity | All different Types | +20% unique drops |
| Elemental Mastery | All 4 base elements present | +35% rare drops |
| Pack Alpha | 4+ Wolves + 1 Bear | +30% beast loot |

---

## Complete Example Build

### Schematic: "Infernal Pit" (Epic)

| Property | Value |
|----------|-------|
| Rarity | Epic |
| Total Slots | 8 |
| Themed Slots | 2 (Demon Slot, Fire Slot) |
| Schematic Affixes | "Fire Attunement: Fire synergies 1.5x", "-15% run duration" |

### Monster Placement

| Slot | Monster | Type | Family | Element |
|------|---------|------|--------|---------|
| Demon Slot | Fire Imp | Demon | Imp | Fire |
| Fire Slot | Flame Drake | Dragon | Drake | Fire |
| Normal | Hellhound | Demon | Hellhound | Fire |
| Normal | Magma Slime | Elemental | Slime | Fire |
| Normal | Fire Sprite | Elemental | Sprite | Fire |
| Normal | Infernal Orc | Humanoid | Orc | Fire |
| Normal | Lava Golem | Construct | Golem | Fire |
| Normal | Ember Wolf | Beast | Wolf | Fire |

### Synergies Triggered

| Synergy | Type | Base Bonus | After Amplifier |
|---------|------|------------|-----------------|
| Elemental Confluence (all Fire) | Basic | +10% | +15% (1.5x) |
| Elemental Purity (all same) | Intermediate | +18% | +27% (1.5x) |
| Infernal Court (3+ Demons) | Intermediate | +18% | +18% (not Fire-specific) |

### Schematic Bonuses

- Demon Slot: Fire Imp +20% power
- Fire Slot: Flame Drake +20% power
- Schematic: -15% run duration

### Total

~60% loot bonus (near cap), strong power, fast runs

---

## TypeScript Interface Updates

The existing `Monster` interface should be updated:

```typescript
interface Monster {
  id: string
  baseName: string
  type: MonsterType           // NEW: 'Beast' | 'Undead' | 'Elemental' | etc.
  family: string              // Already exists: 'Wolf', 'Slime', etc.
  element: Element            // NEW: 'Fire' | 'Ice' | 'Shadow' | etc.
  packType: 'trash' | 'elite' | 'miniboss' | 'boss'
  biome: ZoneType
  basePower: number
  baseCaptureChance: number
  lootTable: MonsterLootEntry[]
}

type MonsterType = 'Beast' | 'Undead' | 'Elemental' | 'Dragon' | 'Humanoid' | 'Construct' | 'Demon' | 'Aberration'

type Element = 'Fire' | 'Ice' | 'Lightning' | 'Nature' | 'Shadow' | 'Holy' | 'Arcane' | 'Physical'
```

The `Schematic` interface should be updated:

```typescript
interface Schematic {
  id: string
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  slots: SlotDefinition[]
  theme: string
  baseDuration: number
  baseRewards: RewardDefinition
  affixes: SchematicAffix[]   // NEW
  unlockRequirement?: {
    minPower?: number
    zoneComplete?: string
  }
}

interface SlotDefinition {
  id: string
  position: number
  allowedTypes: string[]
  requiredTags?: string[]
  themed?: ThemedSlot         // NEW
}

interface ThemedSlot {
  type: 'element' | 'monsterType' | 'family'
  value: string               // e.g., 'Fire', 'Demon', 'Wolf'
  bonus: number               // e.g., 20 for +20% power
  bonusType: 'power' | 'loot' | 'xp'
}

interface SchematicAffix {
  id: string
  category: AffixCategory
  description: string
  effect: AffixEffect
}

type AffixCategory = 'power' | 'efficiency' | 'xp' | 'loot' | 'amplifier' | 'monster-specific' | 'trade-off' | 'hero-synergy' | 'wildcard'

interface AffixEffect {
  type: string
  value: number
  condition?: string          // For conditional affixes
  tradeoff?: {                // For trade-off affixes
    type: string
    value: number
  }
}
```

---

## Open Questions for Implementation

1. Exact synergy bonus percentages (balance testing needed)
2. Full synergy catalog size for MVP (20-30 synergies?)
3. Amplifier multiplier values (1.25x vs 1.5x vs 2x)
4. Discovery hint density (how obvious should breadcrumbs be?)
5. Codex UI/UX design
6. Trade-off affix balance (risk vs reward ratios)
7. Wildcard affix variety and power level
8. Hero synergy tag list alignment with hero trait system

---

## Summary

The dungeon synergy system creates depth through:

- **Monster synergies** = Loot optimization puzzle
- **Schematic affixes** = Strategic schematic hunting
- **Amplifiers** = Connection between both systems
- **Discovery** = Long-term mastery goals
- **Tiered power** = Accessible to casuals, rewarding for optimizers

Players feel like dungeon builders, not just slot-fillers.
