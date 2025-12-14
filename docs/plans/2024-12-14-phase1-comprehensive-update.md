# Phase 1: Comprehensive Plan Update

> **Updates:** All previous Phase 1 planning documents
> **Based on:** Gap analysis and brainstorming session
> **Date:** 2024-12-14

This document consolidates all design updates from the gap-fixing session.

---

## Table of Contents

1. [Zone & Subzone System](#1-zone--subzone-system)
2. [Equipment System](#2-equipment-system)
3. [Formulas & Calculations](#3-formulas--calculations)
4. [Title System](#4-title-system)
5. [Hero Retirement](#5-hero-retirement)
6. [Party Presets](#6-party-presets)
7. [Morale System](#7-morale-system)
8. [Difficulty Scaling](#8-difficulty-scaling)
9. [UI Specifications](#9-ui-specifications)

---

## 1. Zone & Subzone System

### Overview

Zones are regions containing multiple discoverable subzones. Each subzone has unique content, threats, monsters, and collectibles.

### Zone Structure

```typescript
interface Zone {
  id: string
  name: string
  description: string
  type: ZoneType  // 'forest' | 'cave' | 'mountain' | 'swamp' | 'desert' | 'ruins'

  // Unlock requirements
  unlockRequirement: {
    minPower?: number
    previousZoneId?: string
    questComplete?: string
  }

  // Subzones (3-6 per zone, varies)
  subzones: Subzone[]

  // Zone-wide progress
  familiarity: number  // 0-100%

  // Rewards for mastery
  masteryRewards: {
    title?: string
    passiveIncomeBonus: number
  }
}
```

### Subzone Structure

```typescript
interface Subzone {
  id: string
  name: string
  description: string

  // Discovery
  discoveryWeight: number       // Higher = easier to find
  requiredZoneFamiliarity: number  // Min % to discover (0 for starting)
  isDiscovered: boolean

  // Content
  difficulty: ZoneDifficulty
  threats: string[]             // Threat IDs

  // Monsters
  monsters: MonsterSpawn[]

  // Collectibles
  collectibles: Collectible[]

  // Rewards
  lootTable: LootTableEntry[]
  bonusXpPercent: number
  bonusGoldPercent: number

  // Progress
  mastery: number  // 0-100%
}
```

### Zone Familiarity Benefits

| Familiarity % | Benefit |
|---------------|---------|
| 0-25% | Base rewards only |
| 25% | Unlock subzone 2, +5% passive income |
| 50% | Unlock subzone 3, +10% passive income, rare events |
| 75% | Unlock subzone 4 (if exists), +15% passive income |
| 100% | Zone mastered, +20% passive income, title earned |

### Subzone Mastery Benefits

| Mastery % | Benefit |
|-----------|---------|
| 0-33% | Learning phase, basic loot |
| 33% | Improved loot table unlocked |
| 66% | Rare monster spawn chance +10% |
| 100% | Subzone mastered, collectible completion possible |

### Expedition Destination Selection

- Player picks zone + preferred subzone
- "Preferred" = higher chance, not guaranteed
- Discovery of new subzones still possible each run
- Progress bar for guaranteed unlocks + random rare discoveries

### Monster Spawns

```typescript
interface MonsterSpawn {
  monsterId: string
  spawnType: 'common' | 'uncommon' | 'rare' | 'boss'

  // Spawn conditions
  baseSpawnChance: number
  requiredMastery: number

  // For Phase 2 capture
  baseCaptureChance: number

  // Combat
  threatContribution: string[]
  power: number
}
```

### Monster Definition

```typescript
interface Monster {
  id: string
  baseName: string           // "Slime"
  family: string             // "Ooze"
  packType: 'trash' | 'elite' | 'miniboss' | 'boss'
  biome: ZoneType            // For dungeon synergy (Phase 2)

  // Base stats
  basePower: number
  baseCaptureChance: number

  // Loot table for dungeon building
  lootTable: MonsterLootEntry[]
}
```

### Monster Pack Types

| Pack Type | Role | Dungeon Use (Phase 2) |
|-----------|------|----------------------|
| Trash | Filler enemies, low threat | Fill dungeon rooms |
| Elite | Tougher, specific mechanics | Mid-room challenges |
| Miniboss | Significant threat | Dungeon checkpoints |
| Boss | Major encounter, unique | Dungeon final room |

### Collectibles

```typescript
interface Collectible {
  id: string
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare'

  // Purpose
  type: 'trophy' | 'material' | 'both'
  craftingUse?: string

  // Discovery
  dropChance: number
  requiresMastery: number
}
```

---

## 2. Equipment System

### Updated Stats

Equipment now uses the 3-stat system:
- **Combat** - Fighting effectiveness
- **Utility** - Loot finding, events
- **Survival** - Staying healthy

### Equipment Structure

```typescript
interface Equipment {
  id: string
  name: string
  slot: EquipmentSlot
  rarity: EquipmentRarity  // common → mythic
  itemLevel: number

  // Stats
  stats: {
    combat: number
    utility: number
    survival: number
  }

  // Gear score
  gearScore: number

  // Traits (like hero traits)
  traits: EquipmentTrait[]
  maxTraits: number

  // Set bonus
  setId?: string

  // Source
  sourceSubzone?: string
  sourceMonster?: string
}

interface EquipmentTrait {
  traitId: string
  quality: TraitQuality  // normal, magic, perfect
  rolledValue: number
}
```

### Slot Stat Tendencies

| Slot | Primary (60%) | Secondary (25%) | Rare (15%) |
|------|---------------|-----------------|------------|
| Weapon | Combat | Utility | Survival |
| Armor | Survival | Combat | Utility |
| Helmet | Survival | Utility | Combat |
| Boots | Utility | Survival | Combat |
| Accessory 1 | Any (33% each) | - | - |
| Accessory 2 | Any (33% each) | - | - |

### Trait Slots by Rarity

| Rarity | Trait Slots | Quality Weights |
|--------|-------------|-----------------|
| Common | 0 | - |
| Uncommon | 0-1 | Normal only |
| Rare | 1 | Normal/Magic |
| Epic | 1-2 | Any quality |
| Legendary | 2 | Magic/Perfect weighted |
| Mythic | 2-3 | Perfect weighted |

### Gear Score Formula

```typescript
function calculateGearScore(equipment: Equipment): number {
  // Base from rarity and item level
  const rarityMultiplier = {
    common: 1.0,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2.0,
    legendary: 2.5,
    mythic: 3.0,
  }[equipment.rarity]

  const baseScore = equipment.itemLevel * rarityMultiplier

  // Add stats
  const statScore = equipment.stats.combat + equipment.stats.utility + equipment.stats.survival

  // Add trait values
  const traitScore = equipment.traits.reduce((sum, t) => sum + t.rolledValue, 0)

  return Math.round(baseScore + statScore + traitScore)
}
```

### Equipment Trait Types

| Trait | Effect | Slot Affinity |
|-------|--------|---------------|
| Sharp | +X% Combat | Weapons |
| Reinforced | +X% Survival | Armor, Helmet |
| Lightfoot | -X% expedition time | Boots |
| Lucky Charm | +X% rare drops | Accessories |
| Threatening | +X% threat counter effectiveness | Any |
| Attuned | +X% stats in matching biome | Any |

Traits are split into:
- **Shared pool** - Work on both heroes and gear
- **Gear-exclusive** - Durability, biome attunement
- **Hero-exclusive** - Personality-driven traits

### Set Bonuses

```typescript
interface EquipmentSet {
  id: string
  name: string
  description: string
  pieces: string[]

  // Trait-based bonuses
  bonuses: SetBonus[]

  // Theme
  biome?: ZoneType
  sourceZone?: string
}

interface SetBonus {
  requiredPieces: number  // 2, 4, or 6
  grantedTraits: SetBonusTrait[]
}

interface SetBonusTrait {
  traitId: string
  quality: TraitQuality
  fixedValue: number  // Sets have fixed values
}
```

### Example Set: Forest Stalker

| Pieces | Bonus |
|--------|-------|
| 2-piece | Nimble (Magic, +8% Utility) |
| 4-piece | Forest Attunement (+15% all stats in forest) + Scout's Eye (+10% event discovery) |
| 6-piece | Apex Predator (+20% Combat) + Nature's Blessing (poison immunity) |

### Set Sizes

- **6-piece** - Major zone sets (full equipment)
- **4-piece** - Themed mini-sets (allows mixing)

---

## 3. Formulas & Calculations

### XP & Leveling (Tiered Linear)

| Level Range | XP Per Level | Cumulative to Tier Start |
|-------------|--------------|--------------------------|
| 1-10 | 100 | 0 |
| 11-20 | 200 | 1,000 |
| 21-30 | 350 | 3,000 |
| 31-40 | 500 | 6,500 |
| 41-50 | 750 | 11,500 |
| 51-60 (max) | 1,000 | 19,000 |

```typescript
function getXpForLevel(level: number): number {
  if (level <= 10) return 100
  if (level <= 20) return 200
  if (level <= 30) return 350
  if (level <= 40) return 500
  if (level <= 50) return 750
  return 1000
}
```

### Power Calculation

```typescript
interface PowerBreakdown {
  statPower: number
  gearPower: number
  traitPower: number
  equipTraitPower: number
  total: number
}

function calculateHeroPower(hero: Hero, equipment: Equipment[]): PowerBreakdown {
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
    return sum + (def.isNegative ? -trait.rolledValue : trait.rolledValue)
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
```

### Power Ranges by Progression

| Stage | Typical Power | Content |
|-------|---------------|---------|
| Fresh hero | 15-25 | Starting zone |
| Geared level 20 | 80-120 | Mid zones |
| Geared level 40 | 200-300 | Late zones |
| Max level, pre-prestige | 400-500 | Endgame zones |
| Prestige 3+ optimized | 600+ | Challenge content |

### Prestige System

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

### Expedition Efficiency

```typescript
function calculateEfficiency(team: Hero[], zone: Zone, subzone: Subzone): number {
  // Base efficiency from power vs requirement
  const teamPower = team.reduce((sum, h) => sum + h.power, 0)
  let efficiency = teamPower / zone.powerRequirement

  // Apply threat penalties/bonuses
  for (const threatId of subzone.threats) {
    const threat = THREATS[threatId]
    const hasCounter = team.some(hero =>
      hero.archetypeTags.some(tag => threat.counteredBy.includes(tag))
    )

    if (hasCounter) {
      efficiency += 0.05  // +5% bonus
    } else {
      const penalty = SEVERITY_BASE_PENALTY[threat.severity] *
                      DIFFICULTY_MULTIPLIERS[subzone.difficulty]
      efficiency -= penalty / 100
    }
  }

  // Clamp to 60-150%
  return Math.max(0.6, Math.min(1.5, efficiency))
}
```

---

## 4. Title System

### Title Structure

```typescript
interface Title {
  id: string
  name: string              // "the Dragonslayer"
  rarity: 'uncommon' | 'rare' | 'epic' | 'legendary'
  source: 'zone_mastery' | 'achievement' | 'story_trait' | 'difficulty' | 'secret'

  // Unlock condition
  condition: TitleCondition

  // Bonus (rare+ titles only)
  bonus?: {
    stat?: StatType
    value?: number
    context?: string  // "in forest zones"
    description: string
  }
}

interface TitleCondition {
  type: 'zone_completion' | 'monster_kills' | 'monster_captures' |
        'difficulty_clear' | 'story_trait' | 'prestige' | 'secret'
  target?: string
  count?: number
}
```

### Title Rarity & Bonuses

| Rarity | Acquisition | Bonus |
|--------|-------------|-------|
| Uncommon | Zone completions, moderate achievements | None - cosmetic |
| Rare | 100% zone mastery, difficult achievements | +3-5% contextual |
| Epic | High difficulty clears, rare discoveries | +5-8% contextual |
| Legendary | Exceptional feats, prestige 5+, secrets | +10% or unique effect |

### Example Titles

| Title | Rarity | Requirement | Bonus |
|-------|--------|-------------|-------|
| "Warden of the Woods" | Rare | 100% Verdant Woods | +5% in forest zones |
| "the Heroic" | Epic | Clear Heroic difficulty | +5% XP gain |
| "Slayer of Ancients" | Legendary | Defeat 3 secret bosses | +10% vs bosses |
| "the Undying" | Legendary | Prestige 5+ with zero failed events | Immunity to one random negative/expedition |

### No Titles For

- Basic leveling (level 10, 20, etc.)
- First expedition
- Recruiting heroes
- Simple progression milestones

Every title tells a story of accomplishment.

### Title Visibility

Titles always visible to other players (future social features).

---

## 5. Hero Retirement

### When Retired

- Hero permanently removed from roster
- Rewards granted based on career

### Retirement Rewards

```typescript
interface RetirementReward {
  gold: number
  storyTraitTransfer: boolean
  collectibles?: string[]
  titleUnlock?: string
}
```

### Reward Formula

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

### Story Trait Transfer

1. Choose "Retire Hero"
2. Select one story trait to preserve
3. Choose any recipient hero (no restrictions)
4. Trait added to recipient
5. Gold paid, hero removed

---

## 6. Party Presets

### Structure

```typescript
interface PartyPreset {
  id: string
  name: string                // "Dragon Hunters"
  heroIds: string[]           // Ordered list

  // Optional targeting
  preferredZoneId?: string
  preferredSubzoneId?: string
  preferredDifficulty?: number

  // Metadata
  createdAt: string
  lastUsedAt: string
}
```

### Features

| Feature | Description |
|---------|-------------|
| Custom naming | Player names their presets |
| Hero order | Order preserved (first = leader) |
| Zone pairing | Optionally link to specific content |
| Quick launch | One-click expedition start |
| Auto-replace | Suggest replacement if hero unavailable |

### Preset Limits (Scales with Progression)

| Account Level | Preset Slots |
|---------------|--------------|
| 1 | 3 |
| 10 | 4 |
| 20 | 5 |
| 30 | 6 |
| 40+ | 8 |

---

## 7. Morale System

### Overview

Simple morale system - not micromanagement, just occasional states to manage.

### Structure

```typescript
interface HeroMorale {
  current: number           // 0-100
  state: MoraleState
  lastExpeditionAt: string
  consecutiveExpeditions: number
}

type MoraleState = 'excited' | 'content' | 'tired' | 'frustrated' | 'exhausted'
```

### Morale Thresholds

| State | Range | Effect |
|-------|-------|--------|
| Excited | 80-100 | +10% efficiency, bonus reactions |
| Content | 50-79 | Normal performance |
| Tired | 30-49 | -5% efficiency, grumpy reactions |
| Frustrated | 15-29 | -15% efficiency, may refuse long expeditions |
| Exhausted | 0-14 | Unavailable until rested |

### Morale Changes

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

### Key Design Principles

- Auto-recovers when resting (not micromanagement)
- Big rewards boost morale (feels good)
- Variety prevents boredom
- Exhausted heroes auto-recover, just slower

### UI Display

- **Icon on hero cards** - Emoji showing state
- **Bar in hero detail** - Full progress bar
- **Warning when selecting** - Alert if tired/frustrated/exhausted

---

## 8. Difficulty Scaling

### Difficulty Tiers

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

### Tier-Exclusive Content

| Tier | Unlocks |
|------|---------|
| 4+ (Elite) | Rare subzone variants, uncommon monster spawns increased |
| 6+ (Heroic) | Hidden subzones, rare monster spawns, exclusive collectibles |
| 8+ (Mythic) | Secret bosses, legendary monster variants, mythic gear drops |
| 10 (Transcendent) | Ultimate challenges, cosmetic rewards, titles |

### How It Works

- Unlock tiers by reaching power threshold
- Select tier when starting expedition
- Higher tier = harder threats, better gear
- Same zone, scaled challenge

---

## 9. UI Specifications

### Core Screens

| Screen | Purpose |
|--------|---------|
| Tavern | Hero recruitment |
| Hero Roster | View/manage heroes |
| Hero Detail | Full hero info |
| Zone Map | Select zones, subzones |
| Expedition Setup | Pick team, difficulty |
| Expedition Results | Rewards, discoveries |
| Inventory | Equipment management |
| Guild Master | Player character |
| Collection Journal | Monsters, collectibles |
| Achievements | Titles, progress |

### Tavern UI

```
┌─────────────────────────────────────────┐
│  THE RUSTY TANKARD         Refresh      │
│  Next refresh: 4h 32m      (50 gems)    │
├─────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │ COMMON  │ │ COMMON  │ │UNCOMMON │     │
│ │ ──────  │ │ ──────  │ │ ──────  │     │
│ │  Greg   │ │  Lyra   │ │  Kael   │     │
│ │  Tank   │ │ Caster  │ │  Healer │     │
│ │  Lock   │ │  Lock   │ │  Lock   │     │
│ │ 100g    │ │ 100g    │ │  250g   │     │
│ └─────────┘ └─────────┘ └─────────┘     │
│                                         │
│ Locks: 1/2 used                         │
└─────────────────────────────────────────┘
```

### Hero Detail UI

```
┌─────────────────────────────────────────┐
│ Back                        Favorite    │
├─────────────────────────────────────────┤
│        [HERO PORTRAIT]                  │
│         Greg the Heroic                 │
│      Rare Tank    [Morale: Content]     │
│         Power: 247                      │
├─────────────────────────────────────────┤
│  STATS          │  TAGS                 │
│  Combat:    45  │  Taunt                │
│  Utility:   28  │  Heavy Armor          │
│  Survival:  62  │                       │
├─────────────────────────────────────────┤
│ [Abilities] [Personality] [Equipment]   │
├─────────────────────────────────────────┤
│  Brawny (Magic)                         │
│  +12% Combat                            │
│                                         │
│  Cave Dweller (Perfect)                 │
│  +22% all stats in caves                │
│                                         │
│  Clumsy (Mild)                          │
│  -4% Utility                            │
├─────────────────────────────────────────┤
│ [Retire Hero]              [Level: 34]  │
└─────────────────────────────────────────┘
```

### Zone Map UI

```
┌─────────────────────────────────────────┐
│  ZONE MAP                    [Filters]  │
├─────────────────────────────────────────┤
│                                         │
│   Verdant Woods    [████████░░] 78%     │
│      4/5 subzones discovered            │
│      Recommended: 50+ power             │
│                                         │
│   Goblin Caves     [█████░░░░░] 45%     │
│      2/4 subzones discovered            │
│      Recommended: 150+ power            │
│                                         │
│   [Locked] Misty Swamp                  │
│      Requires: 500 power hero           │
│                                         │
└─────────────────────────────────────────┘
```

### Subzone View

```
┌─────────────────────────────────────────┐
│ Back         Verdant Woods       78%    │
├─────────────────────────────────────────┤
│                                         │
│  Sunlit Clearing      [████████] 100%   │
│     Mastered! All collectibles found    │
│                                         │
│  Dense Thicket        [██████░░]  72%   │
│     3/5 monsters discovered             │
│                                         │
│  Ancient Grove        [███░░░░░]  35%   │
│     Rare spawns active                  │
│                                         │
│  ???                   Undiscovered     │
│     Keep exploring...                   │
│                                         │
│           [Start Expedition]            │
└─────────────────────────────────────────┘
```

### Expedition Setup UI

```
┌─────────────────────────────────────────┐
│ EXPEDITION: Dense Thicket               │
├─────────────────────────────────────────┤
│  Difficulty: [< Veteran >]              │
│  Power Req: 200  │  Rewards: 1.3x       │
├─────────────────────────────────────────┤
│  THREATS           YOUR COUNTERS        │
│  ! Swarms          [OK] Cleave (Greg)   │
│  ! Poison          [X] No counter       │
│  ! Ambush          [OK] Scout (Lyra)    │
├─────────────────────────────────────────┤
│  PARTY                    [Presets v]   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │Greg │ │Lyra │ │ Add │ │ Add │       │
│  │Tank │ │Rngd │ │  +  │ │  +  │       │
│  │ :)  │ │ :|  │ │     │ │     │       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
├─────────────────────────────────────────┤
│  Est. Efficiency: 115%                  │
│  Duration: 45 min - 1h 30m              │
│                                         │
│        [Launch Expedition]              │
└─────────────────────────────────────────┘
```

### Active Expedition Widget

```
┌─────────────────────────────┐
│ Dense Thicket        32:15  │
│ [████████░░░░░░░░░░]   45%  │
└─────────────────────────────┘
```

Both floating widget + dedicated Active tab.

### Expedition Results UI

```
┌─────────────────────────────────────────┐
│        EXPEDITION COMPLETE              │
│           Dense Thicket                 │
├─────────────────────────────────────────┤
│  Efficiency: 115%                       │
│  Duration: 52 minutes                   │
├─────────────────────────────────────────┤
│  REWARDS                                │
│  ┌─────────────────────────────────┐   │
│  │ Gold           +180             │   │
│  │ XP             +125 (x1.15)     │   │
│  │ Iron Sword     Rare +8          │   │
│  │ Antidote Herb  x3               │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  DISCOVERIES                            │
│  New subzone found: Ancient Grove!      │
│  New monster: Thorn Rabbit              │
├─────────────────────────────────────────┤
│  HERO GROWTH                            │
│  Greg: Level 34 -> 35                   │
│  Lyra: +125 XP (2,340 / 3,500)          │
├─────────────────────────────────────────┤
│  [View Full Log]    [Collect & Close]   │
└─────────────────────────────────────────┘
```

### Expedition Log UI

```
┌─────────────────────────────────────────┐
│ Back              EXPEDITION LOG        │
├─────────────────────────────────────────┤
│                                         │
│ [Location] Entered Dense Thicket        │
│    "The undergrowth closed in..."       │
│                                         │
│ [Combat] Forest Sprites (x4)            │
│    Greg's Cleave made short work of     │
│    the swarm.                           │
│    > Greg: "Hardly a warm-up."          │
│                                         │
│ [Event] Suspicious Mushroom Circle      │
│    Lyra insisted on investigating.      │
│    > Lyra (Superstitious): "We need     │
│      to leave an offering first!"       │
│    Found: Glowing Spores x2             │
│                                         │
│ [Warning] Poison Gas Trap               │
│    No counter! Party took damage.       │
│    Efficiency -8%                       │
│                                         │
│ [Discovery] Thorn Rabbit spotted!       │
│                                         │
│ [Complete] Final Efficiency: 115%       │
│                                         │
└─────────────────────────────────────────┘
```

### Inventory UI

```
┌─────────────────────────────────────────┐
│ INVENTORY                 [Sort v]      │
│ 47/100 slots              [Filter v]    │
├─────────────────────────────────────────┤
│ [All] [Weapons] [Armor] [Accessories]   │
├─────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ │Weap│ │Weap│ │Armr│ │Armr│ │Boot│    │
│ │Epic│ │Rare│ │Rare│ │Ucmn│ │Epic│    │
│ │+12 │ │+8  │ │+9  │ │+4  │ │+11 │    │
│ └────┘ └────┘ └────┘ └────┘ └────┘    │
├─────────────────────────────────────────┤
│ [Sell Selected]        [Auto-Equip]     │
└─────────────────────────────────────────┘
```

### Equipment Detail Popup

```
┌─────────────────────────────────────────┐
│      BLAZING SCIMITAR                   │
│         Epic Weapon                     │
│         Item Level: 24                  │
├─────────────────────────────────────────┤
│  Combat:   +18                          │
│  Utility:  +4                           │
│  Survival: +2                           │
│  ─────────────────────                  │
│  Gear Score: 42                         │
├─────────────────────────────────────────┤
│  TRAITS                                 │
│  Fire Attuned (Magic)                   │
│     +12% damage in desert zones         │
│  Sharp (Normal)                         │
│     +5% Combat                          │
├─────────────────────────────────────────┤
│  SET: Desert Wanderer (1/4)             │
│  2pc: +8% Survival in desert            │
│  4pc: Immune to heat exhaustion         │
├─────────────────────────────────────────┤
│  [Equip to...]  [Sell: 85g]  [Lock]    │
└─────────────────────────────────────────┘
```

### Guild Master UI

```
┌─────────────────────────────────────────┐
│             GUILD MASTER                │
│              "PlayerName"               │
│           Legendary Leader              │
├─────────────────────────────────────────┤
│  BONUSES                                │
│  Leader: +8% party stats                │
│  Mentor: +12% party XP                  │
│  Always Available                       │
├─────────────────────────────────────────┤
│  EQUIPPED TRAITS (3/4 slots)            │
│  ┌─────────────────────────────────┐   │
│  │ Brawny (Perfect) +15% Combat    │ X │
│  │ Lucky (Magic) +12% rare drops   │ X │
│  │ Swift (Magic) -10% exp time     │ X │
│  │ [+ Equip Trait]                 │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  UNLOCKED TRAITS (12 available)         │
│  [View All]                             │
├─────────────────────────────────────────┤
│  ARCHETYPE: Tank                        │
│  Tags: Taunt, Shield Wall, Endurance    │
│  [Change at next milestone]             │
└─────────────────────────────────────────┘
```

### Collection Journal UI

```
┌─────────────────────────────────────────┐
│ COLLECTION JOURNAL                      │
├─────────────────────────────────────────┤
│ [Monsters] [Collectibles] [Sets]        │
├─────────────────────────────────────────┤
│                                         │
│  VERDANT WOODS                   12/18  │
│  |-- Sunlit Clearing             6/6    │
│  |-- Dense Thicket               4/7    │
│  +-- Ancient Grove               2/5    │
│                                         │
│  GOBLIN CAVES                    5/14   │
│  |-- Entrance Tunnels            3/5    │
│  |-- Fungal Grotto               2/6    │
│  +-- [Locked] Treasure Vault     0/3    │
│                                         │
│  Overall: 17/32 (53%)                   │
│                                         │
└─────────────────────────────────────────┘
```

### Achievements & Titles UI

```
┌─────────────────────────────────────────┐
│ ACHIEVEMENTS & TITLES                   │
├─────────────────────────────────────────┤
│ [Achievements] [Titles] [Statistics]    │
├─────────────────────────────────────────┤
│                                         │
│  ZONE MASTERY                           │
│  ┌─────────────────────────────────┐   │
│  │ [Done] Warden of the Woods RARE │   │
│  │   100% Verdant Woods mastery    │   │
│  │   Bonus: +5% in forest zones    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ [    ] Keeper of Caves     RARE │   │
│  │   Progress: 45/100%             │   │
│  │   [████████░░░░░░░░░░░░░]       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  SECRET                                 │
│  ┌─────────────────────────────────┐   │
│  │ ??? (Legendary)                 │   │
│  │   Hidden achievement            │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## Summary of Changes

### New Systems Added
1. **Subzone system** - Zones contain discoverable subzones
2. **Zone familiarity** - Progress unlocks content and bonuses
3. **Subzone mastery** - Deeper progress within subzones
4. **Collectibles** - Trophy + crafting materials
5. **Monster variants** - Zone-based rarity scaling
6. **Equipment traits** - Gear can roll traits like heroes
7. **Set bonuses** - Trait-based set effects
8. **Difficulty tiers** - 10 levels of scaling content
9. **Title system** - Earned achievements with rare bonuses
10. **Hero retirement** - Meaningful dismissal with rewards
11. **Party presets** - Save team compositions
12. **Morale system** - Simple hero state management

### Updated Systems
1. **Equipment stats** - Now uses Combat/Utility/Survival
2. **Gear score** - New formula with rarity + stats + traits
3. **XP/Leveling** - Tiered linear progression
4. **Power calculation** - Comprehensive formula
5. **Prestige** - Soft cap with scaling rewards

### Files to Create/Update

**New Type Files:**
- `types/zones.ts` - Zone, Subzone, Collectible
- `types/monsters.ts` - Monster, MonsterSpawn, MonsterVariant
- `types/difficulty.ts` - DifficultyTier
- `types/titles.ts` - Title, TitleCondition
- `types/morale.ts` - HeroMorale, MoraleState
- `types/presets.ts` - PartyPreset

**Updated Type Files:**
- `types/equipment.ts` - Add traits, update stats
- `types/hero.ts` - Add morale, update power

**New Data Files:**
- `data/zones/` - Zone and subzone definitions
- `data/monsters/` - Monster definitions
- `data/collectibles/` - Collectible definitions
- `data/titles/` - Title definitions
- `data/sets/` - Equipment set definitions

**New Utility Files:**
- `utils/moraleCalculator.ts`
- `utils/difficultyScaler.ts`
- `utils/titleChecker.ts`

---

## Next Steps

1. Update existing type files with new structures
2. Create new type files for added systems
3. Update hero generator for morale
4. Create zone/subzone data
5. Update expedition system for subzones
6. Implement difficulty selection
7. Build UI components per specifications
