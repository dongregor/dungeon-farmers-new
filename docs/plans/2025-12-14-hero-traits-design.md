# Hero & Traits System Design

**Date:** 2024-12-14
**Status:** Brainstormed, ready for implementation
**Related:** GAME_DESIGN_V2.md (Phase 1 MVP)

> ⚠️ **When implementing:** Follow patterns in `docs/plans/BEST_PRACTICES_REVIEW.md`

---

## Overview

This document details the hero generation, trait systems, and recruitment mechanics for Dungeon Farmers. The system is designed for variety, humor, and strategic depth while remaining accessible.

---

## Hero Stats

### Three Core Stats (Role-Based)

| Stat | Purpose |
|------|---------|
| **Combat** | Fighting effectiveness, damage dealt |
| **Utility** | Finding loot, triggering events, solving puzzles |
| **Survival** | Staying healthy, avoiding hazards, expedition efficiency |

### Stat Distribution

Stats are determined by two factors:

1. **Rarity determines total points:**
   - Common: ~12 points
   - Uncommon: ~14 points
   - Rare: ~16 points
   - Epic: ~18 points
   - Legendary: ~20 points

2. **Archetype weights distribution:**
   - Tank: Survival-heavy
   - Healer: Survival/Utility
   - Debuffer: Utility/Combat
   - Melee DPS: Combat-heavy
   - Ranged DPS: Combat/Utility
   - Caster: Combat-heavy (magic)

---

## Archetypes

### Six Base Archetypes

| Archetype | Stat Lean | Role |
|-----------|-----------|------|
| **Tank** | Survival | Absorb damage, protect party |
| **Healer** | Survival/Utility | Counter attrition and status effects |
| **Debuffer** | Utility/Combat | Weaken enemies, remove buffs |
| **Melee DPS** | Combat | Direct engagement, burst damage |
| **Ranged DPS** | Combat/Utility | Distance attacks, scouting |
| **Caster** | Combat | Magic damage, elemental effects |

Each hero has exactly ONE archetype.

---

## Archetype Tags

Each archetype has a pool of 6 tags. Heroes roll tags from their archetype's pool to counter expedition threats.

### Tag Count by Rarity

| Rarity | Tag Count |
|--------|-----------|
| Common | 1 |
| Uncommon | 1 |
| Rare | 2 |
| Epic | 2 |
| Legendary | 3 |

### Tag Pools

**TANK**
| Tag | Counters |
|-----|----------|
| `Taunt` | Boss Focus, AoE Damage |
| `Heavy Armor` | Physical Burst, Piercing |
| `Magic Resist` | Spell Barrages, Enemy Buffs |
| `Shield Wall` | AoE Damage, Swarms |
| `Intercept` | Ambush, Spike Damage |
| `Endurance` | Attrition, Time Pressure |

**HEALER**
| Tag | Counters |
|-----|----------|
| `Burst Heals` | Spike Damage, Bosses |
| `Regen` | Attrition, Poison |
| `Decurse` | Curses, Enemy Buffs |
| `Cleanse` | Poison, Disease |
| `Shields` | Physical Burst, Piercing |
| `Immunity` | Stuns, Disease |

**DEBUFFER**
| Tag | Counters |
|-----|----------|
| `Dispel` | Enemy Buffs, Enraged |
| `Weaken` | Enraged, Enemy Buffs |
| `Slow` | Fast Enemies, Fleeing |
| `Blind` | Evasive, Fast Enemies |
| `Silence` | Summoners, Spell Barrages |
| `Expose` | Armored, Enemy Buffs |

**MELEE DPS**
| Tag | Counters |
|-----|----------|
| `Cleave` | Swarms, AoE Damage |
| `Execute` | Bosses, Regenerators |
| `Armor Break` | Armored, Enemy Buffs |
| `Charge` | Fleeing, Ambush |
| `Parry` | Bosses, Physical Burst |
| `Frenzy` | Time Pressure, Bosses |

**RANGED DPS**
| Tag | Counters |
|-----|----------|
| `Snipe` | Flying, Summoners |
| `Volley` | Swarms, Flying |
| `Kite` | Fast Enemies, Ambush |
| `Precision` | Evasive, Flying |
| `Traps` | Ambush, Fleeing |
| `Scout` | Ambush, Summoners |

**CASTER**
| Tag | Counters |
|-----|----------|
| `Fire` | Regenerators, Armored |
| `Ice` | Fast Enemies, Regenerators |
| `Lightning` | Armored, Swarms |
| `Arcane` | Enemy Buffs, Armored |
| `AoE Blast` | Swarms, Evasive |
| `Channel` | Bosses, Time Pressure |

---

## Expedition Threats

### Threat Categories (24 Total)

**DAMAGE THREATS (6)**
| Threat | Description | Countered By |
|--------|-------------|--------------|
| `Physical Burst` | High single-target physical damage | `Heavy Armor`, `Shields` |
| `Piercing` | Armor-ignoring physical attacks | `Heavy Armor`, `Shields` |
| `Spike Damage` | Sudden HP drops | `Burst Heals`, `Intercept` |
| `AoE Damage` | Party-wide attacks | `Shield Wall`, `Regen` |
| `Attrition` | Slow constant damage | `Endurance`, `Regen` |
| `Spell Barrages` | Magic damage waves | `Magic Resist`, `Immunity` |

**ENEMY TYPE THREATS (6)**
| Threat | Description | Countered By |
|--------|-------------|--------------|
| `Swarms` | Many weak enemies | `Cleave`, `Volley`, `AoE Blast` |
| `Armored` | High physical resist | `Armor Break`, `Lightning`, `Expose` |
| `Flying` | Can't be reached by melee | `Snipe`, `Volley` |
| `Evasive` | Hard to hit | `Precision`, `AoE Blast` |
| `Fast Enemies` | Quick attackers | `Ice`, `Slow` |
| `Bosses` | High HP single target | `Execute`, `Channel` |

**STATUS THREATS (6)**
| Threat | Description | Countered By |
|--------|-------------|--------------|
| `Poison` | Damage over time | `Cleanse`, `Regen` |
| `Curses` | Stat debuffs | `Decurse`, `Dispel` |
| `Disease` | Spreading affliction | `Cleanse`, `Immunity` |
| `Stuns` | Incapacitates heroes | `Immunity`, `Shields` |
| `Enraged` | Buffed enemies | `Weaken`, `Dispel` |
| `Enemy Buffs` | Shields, damage boosts | `Dispel`, `Silence` |

**MECHANIC THREATS (6)**
| Threat | Description | Countered By |
|--------|-------------|--------------|
| `Boss Focus` | Boss targets one hero | `Taunt`, `Intercept` |
| `Time Pressure` | DPS check / timer | `Frenzy`, `Execute` |
| `Ambush` | Surprise attacks | `Scout`, `Traps` |
| `Fleeing` | Enemies try to escape | `Charge`, `Slow` |
| `Summoners` | Spawn adds constantly | `Silence`, `Snipe` |
| `Regenerators` | Enemies heal | `Fire`, `Execute` |

### Threat Mechanics

**Threat Severity** (inherent to threat)
- Minor: Base -5% efficiency
- Major: Base -10% efficiency
- Deadly: Base -15% efficiency

**Difficulty Multiplier** (based on zone/content)
- Easy: 0.5x penalty
- Medium: 1x penalty
- Hard: 1.5x penalty
- Extreme: 2x penalty

**Counter Matching**
- Matching tag negates penalty entirely
- Also grants +5% efficiency bonus
- Multiple counters don't stack (one match = handled)

**Example:**
Major threat (-10%) in Hard zone (1.5x) = -15% efficiency if uncountered.
With matching tag = 0% penalty + 5% bonus = +5% efficiency.

---

## Trait System

Traits are SEPARATE from archetype tags. Two categories:

### Gameplay Traits

Mechanical impact on expeditions and stats.

**Trait Count by Rarity:**
| Rarity | Starting | Max |
|--------|----------|-----|
| Common | 1-2 | 3 |
| Uncommon | 2 | 4 |
| Rare | 2-3 | 5 |
| Epic | 3 | 6 |
| Legendary | 3-4 | 7 |

**Quality Tiers** (affects roll ranges)
- Normal: Low end of range
- Magic: Mid range
- Perfect: High end of range

**Effect Categories:**

*Stat Bonuses (Flat)*
| Trait | Normal | Magic | Perfect |
|-------|--------|-------|---------|
| `Brawny` | +3-5% Combat | +6-10% Combat | +11-15% Combat |
| `Nimble` | +3-5% Utility | +6-10% Utility | +11-15% Utility |
| `Tough` | +3-5% Survival | +6-10% Survival | +11-15% Survival |

*Conditional*
| Trait | Effect |
|-------|--------|
| `Cave Dweller` | +10-25% all stats in underground zones |
| `Night Owl` | +15-30% efficiency on long expeditions (4hr+) |
| `Dragon Slayer` | +20-40% Combat vs dragon-type enemies |

*Loot & Rewards*
| Trait | Effect |
|-------|--------|
| `Lucky` | +5-15% rare drop chance |
| `Greedy` | +10-25% gold find |
| `Scavenger` | +10-20% material drops |

*Expedition Modifiers*
| Trait | Effect |
|-------|--------|
| `Swift` | -5-15% expedition time |
| `Mentor` | +10-25% XP to party members |
| `Thorough` | +10-20% event discovery chance |

*Trade-offs*
| Trait | Effect |
|-------|--------|
| `Glass Cannon` | +15-25% Combat, -10-20% Survival |
| `Hoarder` | +20-30% loot find, -10-15% expedition speed |
| `Lone Wolf` | +20-35% solo stats, -15-25% in full parties |

### Negative Traits

**Pure Negatives** (just bad)
- `Clumsy`: -3/6/10% Utility (Mild/Moderate/Severe)
- `Frail`: -3/6/10% Survival
- `Weak`: -3/6/10% Combat

**Trade-offs** (risk vs reward)
- `Reckless`: +15% Combat, -10% Survival

**Severity Tiers**
- Mild: Small penalty, almost ignorable
- Moderate: Noticeable, worth considering
- Severe: Significant, might avoid for certain content

**Curses** (acquired, removable)
- Gained from failed events, dangerous expeditions
- Can be cleansed (gold cost, healer hero, time)

**Handling Negative Traits:**
- Heroes with negatives cost less gold to recruit (discounted)
- Premium currency can reroll a specific negative trait
- Some negatives can be "overcome" through gameplay (reduce severity or remove)

### Story Traits

Personality and flavor - no mechanical impact.

**Characteristics:**
- No upper limit - heroes accumulate over time
- Random starting amount (2-5)
- Acquired through expeditions, events, milestones

**Acquisition Sources:**
- Random expedition drops (small chance per expedition)
- Event-driven (specific events grant related traits)
- Milestones (X expeditions, X levels, first prestige)

**Example Story Traits:**
| Trait | Expedition Log Reactions |
|-------|--------------------------|
| `Cheese Obsessed` | "Insisted on checking every barrel for cheese" |
| `Chronic Napper` | "Fell asleep during the boss strategy meeting" |
| `Overly Dramatic` | "Declared this was surely their final adventure (again)" |
| `Afraid of Heights` | "Crawled across the rope bridge on all fours" |
| `Conspiracy Theorist` | "Explained how the goblins are connected to Big Potion" |

**Trait Conflicts:**
- Contradictory traits are ALLOWED (e.g., "Brave" + "Coward")
- Creates comedy in expedition logs
- Not prevented during generation

---

## Hero Identity

### Names

**First Name Only at Generation**
- No rarity weighting (Legendary Greg is valid)
- Name pools: Classic Fantasy, Rustic/Common, Exotic, Silly-Adjacent

**Example Names:**
- Classic: Aldric, Brom, Elira, Lyra
- Rustic: Bart, Finn, Gus, Mabel, Nell
- Exotic: Azim, Kael, Nyx, Zara
- Silly-Adjacent: Bob, Greg, Kevin, Brenda, Susan

### Titles

**Earned Through Play:**
- Milestones: "the Initiate" → "the Veteran" → "the Reborn"
- Achievements: "Slay 100 dragons" → "Dragonbane"
- Story traits: "Cheese Obsessed" → "the Cheese-Seeker"

**Display:**
- Heroes collect multiple titles
- Context-sensitive: Roster shows one (player's choice), profile shows all
- Player picks favorite title for display

### Gender

- Affects pronouns in expedition logs
- Affects name pool weighting (some names gender-coded)
- No mechanical impact

### Culture Origin

**4 Starting Cultures (expandable):**
| Culture | Vibe |
|---------|------|
| **Northfolk** | Hardy mountain/tundra people |
| **Coastborn** | Seafaring island traders |
| **Woodwalkers** | Forest-dwelling naturalists |
| **Crownlanders** | Urban city-state citizens |

**Purpose:**
- Story trait hooks (culture-specific quirks)
- Expedition log flavor ("felt homesick in the swamp")
- Visual hints for Phase 2+ (clothing, features)

**NOT a Constraint:**
- Doesn't lock heroes out of content
- Doesn't restrict archetypes or gameplay traits
- Purely flavor enrichment

---

## The Guild Master

The player's personal character - fundamentally different from random heroes.

### Core Differences

| Aspect | Random Heroes | Guild Master |
|--------|---------------|--------------|
| Name | Generated | Player's name |
| Rarity | Common-Legendary | Always Legendary |
| Traits | Fixed at generation | Equippable from unlocked pool |
| Availability | Locked during expeditions | Always available |
| Progression | Level + prestige | Account-wide milestones |

### Unique Mechanics

1. **Leader Bonus** - Passive buff to any party the GM leads
2. **Always Available** - Not locked by expedition timers, can lead multiple runs
3. **Mentor** - Boosts XP gain for all party members

### Equippable Trait System

Unlike random heroes with fixed traits, the Guild Master:
- Unlocks traits through gameplay (achievements, content completion, milestones)
- Equips traits from unlocked pool before expeditions
- Can swap loadouts to optimize for different content
- Trait slots scale with account progression (starts small, grows with milestones)

### Tutorial

The Guild Master is introduced as the tutorial preset hero - guaranteed solid start, teaches core mechanics.

---

## Recruitment

### Tavern Model

Visit the tavern to see available heroes. Pick one to recruit or wait for refresh.

### Rarity-Tiered Slots (Scales with Progression)

**Starting Tavern (Early Game):**
- 2 Common slots
- 1 Uncommon slot

**Upgraded Tavern (Mid Game):**
- 2 Common slots
- 2 Uncommon slots
- 1 Rare slot

**Full Tavern (Late Game):**
- 2 Common slots
- 2 Uncommon slots
- 2 Rare slots
- 1 Epic+ slot

### Refresh Mechanics

- **Free refresh:** Every 8 hours (morning, afternoon, evening)
- **Gold refresh:** Pay gold to refresh all slots
- **Premium refresh:** Premium currency for instant refresh

### Hero Locking

- 1-2 free lock slots (scales with progression)
- Locked heroes don't disappear on refresh
- Stay until recruited or manually unlocked
- Prevents "saw great hero, couldn't afford" frustration

### Recruitment Cost

**Rarity-scaled gold:**
| Rarity | Cost |
|--------|------|
| Common | 100g |
| Uncommon | 250g |
| Rare | 500g |
| Epic | 1000g |
| Legendary | 5000g |

### Full Transparency

All hero details visible before recruiting:
- Stats, archetype, tags
- All gameplay and story traits
- Trait quality and values
- Gender, culture, name

No hidden information. Players make informed decisions.

---

## Hero Management

### Retirement

When dismissing unwanted heroes:
- Receive small gold/resource bonus
- Can pass one story trait to another hero (trait inheritance)

### Favorites & Party Presets

- Mark heroes as favorites for quick roster access
- Save party compositions ("Dragon Hunting Team", "Gold Farm Squad")
- Quick-select saved parties for expedition assignment

### Prestige

When a hero reaches max level:
- Reset to level 1
- Gain permanent stat bonuses
- Gain new trait slot
- Low chance for existing trait to upgrade quality (Normal → Magic → Perfect)
- Keep all story traits

---

## Party Synergies (Phase 2)

Flagged for future implementation:
- Same culture bonuses (small efficiency boost)
- Complementary story traits (rivals push each other)
- Archetype combinations (Tank + Healer synergy)

---

## Open Questions for Implementation

1. Exact stat point distributions by rarity
2. Trait catalog size for MVP (20-30 gameplay traits?)
3. Story trait acquisition rates
4. Guild Master trait slot progression curve
5. Prestige stat bonus amounts
6. Trait quality upgrade chance on prestige
7. Curse cleansing mechanics and costs
8. Party synergy bonus amounts (Phase 2)

---

## Summary

The hero system creates variety through:
- **Archetypes + Tags** = Team composition puzzle
- **Gameplay Traits** = Power and optimization
- **Story Traits** = Personality and humor
- **Guild Master** = Player investment and progression
- **Recruitment** = Strategic decision-making

Heroes feel like individuals with history, not interchangeable units.
