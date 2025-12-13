# Hero System - Dungeon Farmers

**Tavern-Only Acquisition | Stat Variety | Diablo-Style Trait Affixes**

**Last Updated**: 2025-11-05
**Status**: Phase 1 MVP (Tavern System, Base Stats, Trait Rolling)
**Dependencies**: [RNG_SYSTEM.md](RNG_SYSTEM.md), [TRAIT_SYSTEM_EXPANDED.md](TRAIT_SYSTEM_EXPANDED.md)

---

## 🎯 Core Philosophy

**Single Source. Stat Variety. Numerical Complexity.**

- **Tavern-Only Acquisition**: All heroes recruited from player's personal Tavern (no gacha, no story drops)
- **Stat Balance Ranges**: Heroes of same archetype vary by ±10% (no clones)
- **Diablo-Style Traits**: All traits have numerical ranges (e.g., "Fire Affinity: +35-50% fire damage")
- **Progressive Unlocking**: Tavern slots and rarity odds improve with player progression
- **12-Hour Refresh**: Tavern pool refreshes every 12 hours (or manually for gold cost)

---

## 📊 Hero Archetypes

Six distinct classes with different roles and stat growth patterns:

### 1. TANK - Ultimate Survivability
**Role**: Frontline protector, draws aggro, shields team

**Stat Growth (per level):**
- HP: +45-55 (highest)
- ATK: +2-4 (lowest)
- DEF: +6-8 (highest)
- SPD: +1-2 (lowest)

**Typical Traits**: +HP, +DEF, Taunt abilities, Shield generation

**Example**: Thrain Ironfist - "Traditional tank who prefers fighting alongside fellow warriors"

### 2. HEALER - Support & Restoration
**Role**: Keep team alive, cleanse debuffs, sustain

**Stat Growth (per level):**
- HP: +25-35
- ATK: +3-5 (determines healing power)
- DEF: +3-5
- SPD: +2-4

**Typical Traits**: +Healing power, +MP regen, Cleanse, Revive

**Example**: Luna Moonwhisper - "Wise healer who rests when needed but stays vigilant"

### 3. RANGED DPS - Precision Damage
**Role**: High damage from safe distance, crit specialist

**Stat Growth (per level):**
- HP: +20-30 (lowest)
- ATK: +6-8 (highest)
- DEF: +2-4 (lowest)
- SPD: +4-6 (high)

**Typical Traits**: +Crit chance/damage, +Accuracy, +Range, Pierce

**Example**: Sylvana Shadowbow - "Adventurous hunter who documents her exploits"

### 4. MELEE DPS - Close-Combat Damage
**Role**: Balanced frontline damage dealer

**Stat Growth (per level):**
- HP: +35-45
- ATK: +5-7
- DEF: +3-5
- SPD: +3-5

**Typical Traits**: +ATK, +Crit, Bleed effects, Execute mechanics

**Example**: Grimnar the Relentless - "Fierce warrior who never backs down"

### 5. CASTER - Magic Damage Specialist
**Role**: Magic attacks that bypass physical defense, elemental variety

**Stat Growth (per level):**
- HP: +18-28 (lowest)
- ATK: +6-8 (magic power)
- DEF: +2-4 (lowest)
- SPD: +3-5

**Typical Traits**: +Magic damage, +MP pool, Elemental affinities, AOE

**Example**: Morrigan Stormweaver - "Studious mage who sees patterns in everything"

### 6. SUPPORT - Utility & Control
**Role**: Buffs, debuffs, crowd control, strategic enhancement

**Stat Growth (per level):**
- HP: +25-35
- ATK: +3-5
- DEF: +3-5
- SPD: +3-5 (balanced)

**Typical Traits**: +Buff strength, +Debuff application, Control effects, Utility

**Example**: Boris Breadwinner - "Experienced supporter who knows good food from bad"

---

## 🍺 The Tavern System (Single Source Acquisition)

### Tavern Page Mechanics

**Your Personal Tavern**: Each player has a Tavern page where heroes are generated and available for 12 hours.

**Hero Pool Generation**:
- **Pool Refresh**: Every 12 hours (fixed timer, starts on first visit)
- **Manual Refresh**: Spend gold to regenerate pool instantly (cost scales with player level)
- **Slot Unlocking**: Start with 3 slots, unlock more through progression (max 10 slots at endgame)
- **Rarity Improvement**: Base rarity odds improve with player level milestones

**Recruitment Cost**: Fixed 100 Gold per hero (all rarities same price)

### Tavern Slot Progression

| Player Level | Tavern Slots | Unlock Condition | Rarity Distribution |
|--------------|--------------|------------------|---------------------|
| **1-9** | 3 slots | Starting state | Common 70%, Uncommon 25%, Rare 5% |
| **10-19** | 4 slots | Reach Level 10 | Common 60%, Uncommon 30%, Rare 9%, Epic 1% |
| **20-29** | 5 slots | Reach Level 20 | Common 50%, Uncommon 30%, Rare 15%, Epic 4%, Legendary 1% |
| **30-39** | 6 slots | Reach Level 30 | Common 40%, Uncommon 30%, Rare 20%, Epic 8%, Legendary 2% |
| **40-49** | 8 slots | Reach Level 40 | Common 30%, Uncommon 30%, Rare 25%, Epic 12%, Legendary 3% |
| **50 (Endgame)** | 10 slots | Reach Level 50 | Common 25%, Uncommon 25%, Rare 30%, Epic 15%, Legendary 5% |

### Manual Refresh Cost

**Formula**: `Base Cost + (Player Level × 2)`

| Player Level | Manual Refresh Cost | Reasoning |
|--------------|---------------------|-----------|
| 1-9 | 50 Gold + (Level × 2) = 52-68 Gold | Early game: cheap rerolls |
| 10-19 | 50 Gold + (Level × 2) = 70-88 Gold | Mid game: moderate cost |
| 20-29 | 50 Gold + (Level × 2) = 90-108 Gold | Late mid game: decision point |
| 30-39 | 50 Gold + (Level × 2) = 110-128 Gold | Late game: expensive rerolls |
| 40-50 | 50 Gold + (Level × 2) = 130-150 Gold | Endgame: gold sink |

**Reroll Behavior**: Completely regenerates hero pool (all slots rerolled)

### Tavern UI Example

```
🍺 THE ADVENTURER'S TAVERN
Next Refresh: 8h 23m | [Reroll Now: 95 Gold]

Slot 1: ✅ Available
┌────────────────────────────────────┐
│ 🛡️ THRAIN "IRONWALL" GREYSTONE   │
│ Tank • Level 1 • Common            │
│ HP: 237 | ATK: 41 | DEF: 62 | SPD: 19 │
│                                     │
│ Traits (3):                        │
│ • Brave ⭐: +18% vs bosses, -12% evasion │
│ • Stone Skin ⭐: -16% physical damage │
│ • Coffee Addict ⭐: +23% SPD, costs 50g/expedition │
│                                     │
│ Tags: TANK, GUARDIAN               │
│ [Recruit: 100 Gold]                │
└────────────────────────────────────┘

Slot 2: ✅ Available
┌────────────────────────────────────┐
│ 🏹 SYLVANA "QUICKSHOT" MOONBOW    │
│ Ranged DPS • Level 1 • Uncommon    │
│ HP: 92 | ATK: 73 | DEF: 31 | SPD: 52 │
│                                     │
│ Traits (4):                        │
│ • Spider Nemesis ⭐⭐: +47% vs spiders, screams │
│ • Critical Eye ⭐⭐: +14% crit chance │
│ • ADHD Chaos ⭐: +32% multitask, -28% focus │
│ • Social Media Star ⭐: +27% fame │
│                                     │
│ Tags: RANGED, MONSTER HUNTER       │
│ [Recruit: 100 Gold]                │
└────────────────────────────────────┘

Slot 3: 🔒 UNLOCKS AT LEVEL 10

```

### Archetype Guarantee

**Balancing Mechanism**: Tavern pool ALWAYS contains at least:
- 1x Tank OR Healer (survivability guarantee)
- 1x DPS (any type)
- Remaining slots: RNG

**Why**: Prevents frustrating all-support or all-tank rolls

---

## 🎭 Trait System (Diablo-Style Affixes with Numerical Ranges)

**Reference**: See [TRAIT_SYSTEM_EXPANDED.md](TRAIT_SYSTEM_EXPANDED.md) for complete 300+ trait catalog with balance calculations

### Core Trait Philosophy

**All traits have NUMERICAL RANGES** (like Diablo affixes):
- No fixed "+25% damage" - instead "+20-30% damage" (rolled per hero)
- **Variety Through RNG**: Same trait can roll better/worse values
- **Positive + Negative**: Every trait has trade-offs (TNP ≈ 0 balance)
- **Gaming Parody First**: Humor + mechanics, not just numbers

### Trait Count by Hero Rarity

**Heroes gain trait slots as they level** (every 5 levels):

| Hero Rarity | Base Traits (Lvl 1) | Milestones | Max Traits (Lvl 50) |
|-------------|---------------------|------------|---------------------|
| **Common** | 3 traits | +1 at Lvl 20, 40 | **5 traits** |
| **Uncommon** | 4 traits | +1 at Lvl 15, 30, 45 | **7 traits** |
| **Rare** | 5 traits | +1 at Lvl 10, 20, 30, 40, 50 | **10 traits** |
| **Epic** | 6 traits | +1 at Lvl 10, 15, 25, 35, 45, 50 | **12 traits** |
| **Legendary** | 7 traits | +1 at Lvl 5, 10, 15, 25, 35, 40, 45, 50 | **15 traits** |

**Relationship Traits** (Dynamic): Don't count toward slot limit, appear/disappear based on team composition

### Trait Rarity Weights (RNG System Integration)

**Per-Trait Rarity Roll** (references [RNG_SYSTEM.md](RNG_SYSTEM.md#hero-recruitment-traits)):

| Trait Rarity | Base Weight | Pity System | Example Numerical Range |
|--------------|-------------|-------------|-------------------------|
| **Common ⭐** | 60% | N/A | +15-25% single stat |
| **Uncommon ⭐⭐** | 25% | N/A | +20-35% stat OR minor effect |
| **Rare ⭐⭐⭐** | 10% | N/A | +30-50% stat with trade-off |
| **Epic ⭐⭐⭐⭐** | 4% | Pity after 5 recruits | +40-70% powerful effect + drawback |
| **Legendary ⭐⭐⭐⭐⭐** | 1% | Pity after 20 recruits | +60-100% game-changing + significant cost |

**Pity System** (from RNG_SYSTEM.md):
- **Epic Pity**: +2% Epic rate per recruitment without Epic (caps +20% after 10 recruits)
- **Legendary Pity**: +0.5% Legendary rate per recruitment (caps +10% after 40 recruits)

### Trait Categories (300+ Total)

**IMPORTANT**: All traits below show NUMERICAL RANGES. Final values rolled on hero generation.

**SIMPLIFIED TRAIT RULE**: Each effect = 1 line of code. No complex behaviors, turn-skipping, or AI decisions.

#### Sample Trait Examples (Simplified, with Numerical Ranges)

**Combat Traits** (80 total - see TRAIT_SYSTEM_EXPANDED.md):
- **Dragon Slayer** (Uncommon ⭐⭐): +35-45% damage vs Dragons, +30-40% Dragon capture rate
- **Spider Bane** (Common ⭐): +23-27% damage vs Spiders
- **Berserker** (Rare ⭐⭐⭐): When HP <50%, +45-55% damage, -23-27% DEF
- **Glass Cannon** (Uncommon ⭐⭐): +55-65% damage, +35-45% crit chance, -38-42% HP
- **Critical Eye** (Common ⭐): +12-18% crit chance
- **Executioner** (Rare ⭐⭐⭐): +40-50% damage vs enemies <25% HP

**Personality Traits** (120 total - gaming/character parody):
- **Coffee Addict** (Common ⭐): +22-28% SPD, costs 50g per expedition
- **Workaholic** (Uncommon ⭐⭐): +18-22% XP gain, +15-20% stress events (cosmetic flavor)
- **Professional Napper** (Common ⭐): +35-45% HP regen when idle, -15-20% SPD
- **Social Butterfly** (Uncommon ⭐⭐): +18-22% stats in 5-hero parties, -12-15% stats solo
- **Lone Wolf** (Uncommon ⭐⭐): +20-25% stats solo/duo missions, -15-18% stats in 5-hero parties
- **Perfectionist** (Rare ⭐⭐⭐): +28-32% stats when all equipment Epic+, -18-22% stats with Common gear

**Elemental Affinity** (40 total):
- **Pyromancer** (Rare ⭐⭐⭐): +45-55% Fire damage, Immune to Burn, -33-37% Ice damage, takes +23-27% from Ice
- **Frostborn** (Rare ⭐⭐⭐): +45-55% Ice damage, Immune to Freeze, -33-37% Fire damage, takes +23-27% from Fire
- **Storm Caller** (Rare ⭐⭐⭐): +45-55% Lightning damage, Immune to Stun, -28-32% Earth damage
- **Nature's Chosen** (Rare ⭐⭐⭐): +45-55% Nature damage, +28-32% healing received, -28-32% Shadow damage

**Career/Background** (60 total - corporate satire):
- **Former HR Rep** (Uncommon ⭐⭐): +30-40% team morale (when in party), -20-30% damage (non-combatant)
- **Ex-Retail Worker** (Common ⭐): +23-27% gold from expeditions, -18-22% damage (retail trauma)
- **Former Accountant** (Rare ⭐⭐⭐): +45-55% gold income, -28-32% combat stats (spreadsheet focused)
- **Ex-Call Center** (Uncommon ⭐⭐): Immune to Taunt/Charm, +20-25% patience (morale), -15-18% damage
- **Burned Out Developer** (Rare ⭐⭐⭐): +35-45% efficiency (automation mindset), -25-30% morale, costs 100g (therapy)

**Meta/Self-Aware** (30 total - breaking fourth wall):
- **Fourth Wall Observer** (Epic ⭐⭐⭐⭐): +35-45% rare loot (exploits RNG knowledge), +28-32% XP (knows optimal routes), -30-40% immersion (meta commentary)
- **Isekai Protagonist** (Legendary ⭐⭐⭐⭐⭐): +30-40% all stats (overpowered protagonist buff), +25-35% XP, -28-32% team morale (spotlight stealer)
- **Min-Maxer** (Epic ⭐⭐⭐⭐): +40-50% stats when equipment optimized (full set bonuses), -35-45% stats with mismatched gear (can't stand inefficiency)
- **Speedrunner** (Rare ⭐⭐⭐): +35-45% expedition speed, -20-25% loot quality (rushing)

**Dungeon/Monster Mastery** (50 total):
- **Monster Whisperer** (Rare ⭐⭐⭐): +55-65% monster capture rate, +45-55% monster loyalty, -28-32% damage to monsters (friends!)
- **Architect's Eye** (Rare ⭐⭐⭐): +33-37% dungeon durability, +28-32% schematic drop rate, -23-27% combat stats
- **Hoarder** (Uncommon ⭐⭐): +30-40% inventory space, +20-25% loot drops, -15-20% movement speed (overencumbered)
- **Dungeon Delver** (Rare ⭐⭐⭐): +35-45% damage in dungeons, +25-30% trap detection, -18-22% damage in open zones

**Relationship Traits** (50 total - dynamic, don't count toward slots):
- **Power Couple** (Dynamic): +28-32% stats when both in party, -15-20% stats when separated
- **Bitter Rival** (Dynamic): +23-27% damage (competitive drive), -15-20% healing received from rival (too proud)
- **Mentor/Protégé** (Dynamic, 15+ level gap): Protégé +28-32% XP, Mentor +15-20% morale, Mentor -15-18% personal XP (teaching time)
- **Best Friends** (Dynamic): +18-22% morale together, share 50% of buffs, -10-15% stats when separated (lonely)

**Trait TNP Balance** (from TRAIT_SYSTEM_EXPANDED.md):
- All traits calculated for Total Numeric Power (TNP) ≈ 0
- Stat value weights: Damage/Healing 1.0x, HP/DEF 1.2x, SPD 0.8x, Gold 0.3x, XP 0.5x
- Rarity power budgets: Common (±10 TNP), Uncommon (±20), Rare (+10 to +30), Epic (+20 to +50), Legendary (+40 to +70)
- Events/flavor = 0 TNP (cosmetic chaos is free)

**Simplified Trait Rules**:
1. **Each effect = 1 line of code**: No complex AI behaviors, turn-skipping, or state machines
2. **Max effects per trait**: Common (1-2), Uncommon (2-3), Rare (2-3), Epic (3-4), Legendary (4-5)
3. **Allowed mechanics**: Stat modifiers, resource costs/gains, simple conditions, immunities
4. **Forbidden mechanics**: Turn-skipping, damage redirection, target priority changes, mid-mission state changes

**Why Numerical Ranges Matter**:
- **Variety**: Same trait ("Coffee Addict") can roll 22% OR 28% SPD (no identical heroes)
- **Min-Maxing**: Players can reroll tavern for better trait rolls (gold sink)
- **Diablo Feel**: Inspecting trait rolls = loot inspection dopamine
- **Balance Flexibility**: Ranges allow tuning without redesigning traits
- **Implementation Simplicity**: Each range = simple `rollRange(min, max)` call

---

## 📊 Stat Formulas & Progression (with ±10% Variance)

### Base Stats by Archetype (Level 1 Balance Points)

**IMPORTANT**: Base stats have ±10% variance per hero (NO IDENTICAL HEROES)

| Archetype | HP Range | ATK Range | DEF Range | SPD Range | Philosophy |
|-----------|----------|-----------|-----------|-----------|------------|
| **Tank** | 225-275 | 36-44 | 54-66 | 18-22 | High survivability, moderate damage |
| **Melee DPS** | 90-110 | 72-88 | 32-38 | 41-49 | Glass cannon, high burst damage |
| **Ranged DPS** | 86-104 | 63-77 | 27-33 | 45-55 | Balanced offense, speed advantage |
| **Caster** | 81-99 | 68-82 | 23-27 | 36-44 | Magic damage, lowest defense |
| **Healer** | 108-132 | 32-38 | 36-44 | 32-38 | Support focus, balanced survivability |
| **Support** | 99-121 | 41-49 | 41-49 | 27-33 | Utility focus, well-rounded stats |

**Why Stat Variance Matters**:
- **No Clones**: Two Tank heroes can have 225 HP vs 275 HP (meaningful difference)
- **Strategic Value**: Higher-rolled stats = better hero (motivation to reroll tavern)
- **Late Game Scaling**: ±10% at Lvl 1 becomes ±50-150 stat points at Lvl 50
- **Diablo Nostalgia**: Item inspection dopamine ("This one rolled high HP!")

**Example Heroes of Same Archetype**:
```
THRAIN "IRONWALL" GREYSTONE (Tank, Common)
HP: 237 | ATK: 41 | DEF: 62 | SPD: 19
→ Mid-tier rolls (237/250 = 94.8% HP, 62/60 = 103% DEF)

GRIMHOLD "MOUNTAIN" STONEFIST (Tank, Common)
HP: 269 | ATK: 38 | DEF: 58 | SPD: 21
→ High HP roll (107.6%), low ATK/DEF rolls

LYSSA "BOULDER" IRONHEART (Tank, Uncommon)
HP: 228 | ATK: 44 | DEF: 66 | SPD: 22
→ Max ATK/DEF rolls, low HP roll
```

**Design Philosophy**: Stats create distinct archetype identities with clear trade-offs. No archetype is strictly superior. ±10% variance ensures strategic roster building (hunt for perfect rolls).

### Level Scaling Formula (Hybrid Breakpoint System with Stat Variance)

**Growth Rates** (applied to base stats per level):
- **Levels 1-20**: +12% per level (rapid early growth)
- **Levels 21-40**: +8% per level (steady mid-game)
- **Levels 41-50**: +5% per level (endgame plateau)

**Formula** (with ±10% variance preserved):
```typescript
function calculateHeroStats(hero: Hero, level: number): Stats {
  // Base stats were rolled at recruitment (with ±10% variance)
  const baseHP = hero.baseHP; // e.g., 237 (rolled 225-275 for Tank)
  const baseATK = hero.baseATK; // e.g., 41 (rolled 36-44)
  const baseDEF = hero.baseDEF; // e.g., 62 (rolled 54-66)
  const baseSPD = hero.baseSPD; // e.g., 19 (rolled 18-22)

  // Level multiplier (same for all heroes)
  let multiplier: number;
  if (level <= 20) {
    multiplier = 1 + (level - 1) * 0.12; // 1.0 at L1 → 3.28 at L20
  } else if (level <= 40) {
    multiplier = 3.28 + (level - 20) * 0.08; // +1.6 more → 4.88 at L40
  } else {
    multiplier = 4.88 + (level - 40) * 0.05; // +0.5 more → 5.38 at L50
  }

  // Final stats (base variance carries through all levels)
  return {
    HP: Math.floor(baseHP * multiplier),
    ATK: Math.floor(baseATK * multiplier),
    DEF: Math.floor(baseDEF * multiplier),
    SPD: Math.floor(baseSPD * multiplier),
  };
}

// Stat variance PERSISTS through leveling
// Low-rolled Tank at Lvl 1 (225 HP) → Lvl 50 (1,211 HP)
// High-rolled Tank at Lvl 1 (275 HP) → Lvl 50 (1,480 HP)
// Difference: 269 HP at endgame (22% power gap!)
```

**Concrete Examples** (showing variance impact):

**Low-Rolled Tank** (Base HP: 225):
- **Level 1**: 225 HP, 36 ATK, 54 DEF, 18 SPD
- **Level 20**: 738 HP, 118 ATK, 177 DEF, 59 SPD
- **Level 40**: 1,098 HP, 176 ATK, 264 DEF, 88 SPD
- **Level 50**: 1,211 HP, 194 ATK, 291 DEF, 97 SPD

**Mid-Rolled Tank** (Base HP: 250):
- **Level 1**: 250 HP, 40 ATK, 60 DEF, 20 SPD
- **Level 20**: 820 HP, 131 ATK, 197 DEF, 66 SPD
- **Level 40**: 1,220 HP, 195 ATK, 293 DEF, 98 SPD
- **Level 50**: 1,345 HP, 215 ATK, 323 DEF, 108 SPD

**High-Rolled Tank** (Base HP: 275):
- **Level 1**: 275 HP, 44 ATK, 66 DEF, 22 SPD
- **Level 20**: 902 HP, 144 ATK, 216 DEF, 72 SPD
- **Level 40**: 1,342 HP, 215 ATK, 322 DEF, 107 SPD
- **Level 50**: 1,480 HP, 237 ATK, 355 DEF, 118 SPD

**Variance Impact**:
- Lvl 1: 50 HP difference (225 vs 275)
- Lvl 50: 269 HP difference (1,211 vs 1,480) = **22% power gap**
- High-rolled heroes scale SIGNIFICANTLY better

### Trait Slot Unlocking (Every 5 Levels)

**NEW TRAIT SLOTS** unlock at level milestones (every 5 levels):

**Common Heroes** (3 base → 5 max):
- Lvl 1: 3 traits
- Lvl 20: +1 trait (4 total)
- Lvl 40: +1 trait (5 total)

**Uncommon Heroes** (4 base → 7 max):
- Lvl 1: 4 traits
- Lvl 15: +1 trait (5 total)
- Lvl 30: +1 trait (6 total)
- Lvl 45: +1 trait (7 total)

**Rare Heroes** (5 base → 10 max):
- Lvl 1: 5 traits
- Lvl 10, 20, 30, 40, 50: +1 trait each (10 total)

**Epic Heroes** (6 base → 12 max):
- Lvl 1: 6 traits
- Lvl 10, 15, 25, 35, 45, 50: +1 trait each (12 total)

**Legendary Heroes** (7 base → 15 max):
- Lvl 1: 7 traits
- Lvl 5, 10, 15, 25, 35, 40, 45, 50: +1 trait each (15 total)

**New Trait Rolling** (when slot unlocks):
- Rarity rolled from tavern rarity table at hero's recruitment time
- Numerical values rolled from trait's range (e.g., Coffee Addict: 22-28% SPD)
- Cannot duplicate existing traits on hero
- Player can reroll once for 50 Gold (same rarity tier)

### Power Rating Calculation

**Component Weights** (determines overall hero strength):

```typescript
function calculatePower(hero: Hero): number {
  const levelMultiplier = calculateLevelMultiplier(hero.level);

  // Base stats with level scaling
  const scaledHP = hero.baseHP * levelMultiplier;
  const scaledATK = hero.baseATK * levelMultiplier;
  const scaledDEF = hero.baseDEF * levelMultiplier;
  const scaledSPD = hero.baseSPD * levelMultiplier;

  // Component weights (attack most valuable, speed least)
  const basePower =
    (scaledHP * 0.15) +   // HP contributes 15% per point
    (scaledATK * 2.0) +   // ATK contributes 200% per point (most valuable)
    (scaledDEF * 1.5) +   // DEF contributes 150% per point
    (scaledSPD * 1.0);    // SPD contributes 100% per point

  // Equipment contribution (30-40% of total power at endgame)
  const equipmentPower = calculateEquipmentPower(hero.equipment);

  return Math.floor(basePower + equipmentPower);
}
```

**Example Power Ratings**:
- **Level 1 Melee DPS**: (100×0.15) + (80×2.0) + (35×1.5) + (45×1.0) = **268 power**
- **Level 50 Melee DPS (no equipment)**: (538×0.15) + (430×2.0) + (188×1.5) + (242×1.0) = **1,504 power**
- **Level 50 Melee DPS (Epic gear)**: 1,504 + 600 equipment power = **2,104 total power**

**Equipment Contribution**:
- Early game (Levels 1-15): ~20% of total power
- Mid game (Levels 15-35): ~30% of total power
- Endgame (Levels 35-50): ~35-40% of total power

See [EQUIPMENT_SYSTEM.md](EQUIPMENT_SYSTEM.md#stat-ranges--power-contribution) for detailed equipment stat ranges.

### Set Bonus Scaling (Multiplicative)

**Phase 2+** - Set bonuses apply multiplicative stat boosts:

- **2-piece bonus**: 1.10× base stat (+10%)
- **4-piece bonus**: 1.25× base stat (+25%) + special effect
- **6-piece bonus**: 1.50× base stat (+50%) + build-defining effect

**Example** (Volcanic Set on Melee DPS):
- Base ATK at Level 50: 430
- With 2pc Volcanic: 430 × 1.10 = **473 ATK**
- With 4pc Volcanic: 430 × 1.25 = **538 ATK** + Fire Damage aura
- With 6pc Volcanic: 430 × 1.50 = **645 ATK** + Fire Damage aura + Lava Shield

**Note**: Set bonuses stack multiplicatively with level scaling, making full sets significantly more powerful than individual pieces.

### Expedition Efficiency Formula

**Performance Calculation** (60-150% variance):

```typescript
function calculateEfficiency(heroPower: number, recommendedPower: number, synergy: number): number {
  // Power ratio (80% weight)
  const powerRatio = heroPower / recommendedPower;
  const powerContribution = powerRatio * 0.80;

  // Synergy bonus from tag/trait matching (15% weight)
  const synergyContribution = synergy * 0.15; // synergy = 0.0 to 1.0

  // RNG variance (5% weight)
  const rngContribution = (Math.random() - 0.5) * 0.10; // ±5%

  // Final efficiency clamped to 60-150% range
  const efficiency = powerContribution + synergyContribution + rngContribution;
  return Math.max(0.60, Math.min(1.50, efficiency));
}
```

**Concrete Examples**:
- **Underpowered** (500 power vs 800 recommended, 0 synergy): 0.625 power ratio × 0.80 + 0 + 0 = **50%** → clamped to **60% efficiency**
- **Balanced** (800 power vs 800 recommended, 0.5 synergy): 1.0 × 0.80 + 0.5 × 0.15 = **87.5% efficiency**
- **Overpowered** (1200 power vs 800 recommended, 1.0 synergy): 1.5 × 0.80 + 1.0 × 0.15 = **135% efficiency**

See [EXPEDITION_SYSTEM.md](EXPEDITION_SYSTEM.md#performance--reward-formulas) for reward scaling details.

---

## 🏷️ Ability Tags (Content Gating)

Separate from traits - used for mission requirements and team composition strategy.

**Each hero has 1-2 tags** that unlock specific content access.

### Combat Tags
- **TANK**: Reduces party damage taken by 15%
- **HEALER**: Provides healing support
- **DPS**: Increases party damage by 10%
- **RANGED**: Required for ranged-specific content, +15% damage at range
- **MELEE**: Required for melee-specific content, +15% damage in melee

### Specialization Tags
- **EXPLORER**: Required for exploration zones, +20% discovery rate
- **DUNGEON EXPERT**: Required for dungeon content, +25% loot quality
- **RAID SPECIALIST**: Required for raid content, +15% party stats in raids
- **TREASURE HUNTER**: Required for treasure missions, +30% gold rewards
- **MONSTER HUNTER**: Required for monster capture missions, +25% capture rate

### Support Tags
- **CRAFTSMAN**: Required for crafting missions, improves equipment quality
- **DIPLOMAT**: Required for negotiation missions, better event outcomes
- **GUARDIAN**: Required for defense missions, reduces damage taken by party
- **SCOUT**: Required for scouting missions, reveals hidden content
- **COMMANDER**: Provides leadership bonuses, +10% to all party members

### Tag Strategy
- **Early Game**: Focus on getting 1x TANK, 1x HEALER, 1x DPS for basic content
- **Mid Game**: Collect specialization tags (DUNGEON EXPERT, MONSTER HUNTER, TREASURE HUNTER)
- **Late Game**: Acquire rare tags (RAID SPECIALIST, COMMANDER) for elite content

**Example Mission Interface:**
```
🗡️ MISSION: Spider Queen's Lair

Requirements:
☑ 1x MONSTER HUNTER (Sylvana - Assigned)
☑ 1x EXPLORER (Scout Hero - Assigned)
☐ 1x HEALER (Need to assign)

Duration: 25 minutes
Base Rewards: 300 Gold, Spider Silk x5
Bonus Rewards: +50% monster capture rate

[ASSIGN HERO] [START MISSION]
```

---

## 📈 Hero Progression

### Levels 1-50 (Standard Progression)
- Standard RPG leveling with experience from expeditions
- Stat growth follows archetype curves (±10% RNG variance)
- Equipment provides 30-40% of total power
- No skill trees or talent points (keeps complexity focused on team composition and traits)

### Power Rating Calculation
**Single number showing overall strength:**

```
Base Power = (HP × 0.15) + (ATK × 2) + (DEF × 1.5) + (SPD × 1)

Trait Multipliers:
- Common trait: ×1.0
- Uncommon trait: ×1.2
- Rare trait: ×1.5
- Epic trait: ×2.0
- Legendary trait: ×3.0

Equipment Bonus = Sum of equipment stats × 0.8

Final Power = Base Power + Trait Bonuses + Equipment Bonus
```

**Example**: Thrain Ironfist (Tank)
- Base Stats: HP 850, ATK 45, DEF 68, SPD 22
- Base Power: (850×0.15)+(45×2)+(68×1.5)+(22×1) = 343
- Traits: Stone Skin (Rare ×1.5 = +30), Unyielding (Epic ×2.0 = +50), Drama Queen (Common ×1.0 = +10) = +90 total
- Equipment: 6 pieces averaging 15 power each = 90×0.8 = 72
- **Final Power: 343 + 90 + 72 = 505**

### Ascension System (Level 50+)

**Requirements:**
- Hero at max level (50)
- Ascension Stone x1 (rare raid drop)
- 10,000 Gold
- All 6 equipment slots filled with Epic+ gear

**Benefits:**
- **+50% stat growth** on next leveling curve (levels 1-50 again)
- **New tag slot** (3rd tag = more content access and flexibility)
- **Exclusive Legendary equipment access**
- **Visual upgrade** (portrait border changes to gold)

**Cost:**
- **Hero resets to Level 1** (but with superior growth curve)
- All equipped gear removed (can be re-equipped)

**Strategic Decision**: Players choose WHEN to ascend (better to ascend with perfect gear setup?)

**❓ [QUESTION]**: Should Ascension allow specialization paths (Offensive Ascension vs Defensive Ascension), or keep it simple with a universal +50% stat boost?

---

## 🗂️ Roster Management

### Large Army System
- Manage 50+ heroes across various activities
- **Guild Heroes**: Core permanent roster (favorite heroes)
- **Available Heroes**: Ready for deployment
- **On Mission**: Currently in expeditions
- **Resting**: Cooldown after extremely difficult content (rare mechanic)

### Hero States
- **Available** (green): Ready for any expedition
- **On Mission** (yellow): Currently deployed, unavailable until completion
- **Resting** (blue): Temporary cooldown after high-difficulty raids (2-4 hours, rare)
- **Injured** (red): Rare state after expedition failure due to massive under-leveling (recovers automatically)

### Team Composition Strategy

**Synergy Bonuses** (automatically calculated):
- Tank + Healer: +5% party survival
- Ranged DPS + Support: +10% damage output
- Diverse Team (all different archetypes): +15% experience gain
- Same Archetype Team (all Tanks, all DPS, etc.): +20% archetype-specific bonuses

**Example Optimal Teams:**

**Balanced Expedition Team (Zone 12):**
- 1x Tank (Thrain - TANK, GUARDIAN tags)
- 1x Healer (Luna - HEALER, SCOUT tags)
- 2x DPS (Sylvana Ranged + Grimnar Melee - RANGED, MELEE tags)
- 1x Support (Boris - HEALER, DIPLOMAT tags)
- **Synergy**: Tank + Healer (+5% survival), Diverse Team (+15% exp)

**Monster Hunting Team (Spider Caves):**
- 1x MONSTER HUNTER (Sylvana - requirement fulfilled)
- 1x EXPLORER (Scout hero - requirement fulfilled)
- 1x HEALER (Luna - requirement fulfilled)
- **Bonus**: +50% monster capture rate from tag matching

**Speed Farming Team (Personal Dungeon):**
- 3x DPS heroes (all same archetype)
- **Synergy**: +20% archetype bonus = faster clears

---

## 🎨 Hero Generation Examples

### Example 1: Thrain Ironfist (Tank)
**Base Stats**: HP 850, ATK 45, DEF 68, SPD 22
**Traits**:
- Stone Skin (Rare): -20% physical damage taken
- Unyielding (Epic): +30% DEF when below 50% HP
- Drama Queen (Common): -15% damage in mixed gender parties

**Ability Tags**: TANK, GUARDIAN
**Power Rating**: 505
**Personality**: "Traditional tank who prefers fighting alongside fellow warriors"

**Gameplay Feel**: Incredibly durable tank who gets STRONGER as he takes damage, but loses effectiveness in mixed parties due to personality clash. Corporate satire: "Prefers all-male business meetings."

### Example 2: Sylvana Shadowbow (Ranged DPS)
**Base Stats**: HP 420, ATK 95, DEF 32, SPD 52
**Traits**:
- Spider Hunter (Uncommon): +25% damage vs spiders
- Cat Herder (Rare): +40% damage vs feline enemies, -10% vs others
- Social Media Star (Common): +25% fame rewards, occasional selfies mid-fight

**Ability Tags**: RANGED, MONSTER HUNTER
**Power Rating**: 487
**Personality**: "Adventurous hunter who documents her exploits"

**Gameplay Feel**: High-damage ranged specialist against specific enemy types, but gets distracted by cats and social media. Corporate satire: "Documents every business trip for Instagram."

### Example 3: Morrigan Stormweaver (Caster)
**Base Stats**: HP 380, ATK 88, DEF 28, SPD 44
**Traits**:
- Lightning Affinity (Epic): +40% lightning damage
- Plant Whisperer (Rare): +25% healing from nature, talks to plants
- Conspiracy Theorist (Uncommon): +35% damage vs "illuminated" enemies

**Ability Tags**: DPS, DUNGEON EXPERT
**Power Rating**: 612
**Personality**: "Studious mage who sees patterns in everything"

**Gameplay Feel**: Powerful magic damage dealer with nature affinity, but sees conspiracies everywhere. Corporate satire: "Believes the board of directors controls everything."

---

## 🎬 Creative Trait Interactions (In-Game Scenarios)

### Scenario 1: "The Dramatic Rescue"
**Mission**: Rescue the Merchant from Goblin Kidnappers

**Party**:
- Thrain Ironfist (Tank, Drama Queen trait)
- Sylvana Shadowbow (Ranged DPS, Social Media Star trait)
- Luna Moonwhisper (Healer, Team Therapist trait)

**Mid-Combat Event**:
```
Sylvana: *snap* "Rescue selfie! #HeroLife"
Thrain: "Woman! This is serious! Focus!"
Luna: *heals Thrain* "Everyone stay calm, we're doing great"
```

**Result**: -15% damage from Drama Queen, but +15% party stats from Team Therapist. Net: Balanced but dramatic combat with social media documentation.

### Scenario 2: "The Conspiracy Investigation"
**Mission**: Investigate Ancient Ruins (Night Mission)

**Party**:
- Morrigan Stormweaver (Caster, Conspiracy Theorist trait)
- Boris Breadwinner (Support, Food Critic trait)

**Mid-Combat Discovery**:
```
Morrigan: "See! Those glowing runes prove the dragon conspiracy!"
Boris: "These rations are terrible! How am I supposed to investigate on an empty stomach?"
*Eats stale bread* → Food Critic activates → +30% damage
```

**Result**: +35% damage vs "illuminated" enemies + 30% damage from Food Critic = devastating combo. Corporate satire at its finest.

### Scenario 3: "The Plant Whispering Incident"
**Mission**: Clear Overgrown Temple

**Party**:
- Morrigan (Plant Whisperer trait)
- Sylvana (Cat Herder trait)

**Environmental Event**:
```
Morrigan: *whispering to vines* "Yes, little ones, grow and help us..."
Sylvana: "There's a cat over there! Must... resist... urge... to pet..."
```

**Result**: Plant growth provides +25% healing, but Sylvana gets distracted by environmental cat (-10% damage vs non-cats). Creative environmental interaction with personality-driven penalties.

---

## ⚙️ Design Principles Applied

### No Gacha/Pay-to-Win
- All heroes recruited with in-game gold (earned through play)
- No premium summons or paid hero rolls
- Story heroes are FREE and guaranteed

### Variety Through RNG (Good RNG)
- Randomized trait generation = every hero feels unique
- Rarity system ensures interesting heroes without predatory mechanics
- Replayability through different trait combinations

### Personality = Strategy
- Traits aren't just "+10% damage" - they have CHARACTER
- Creative traits create memorable moments (Coffee Addict, Plant Whisperer, Social Media Star)
- Corporate satire tone shines through hero personalities

### Tag-Based Content Gating
- Strategic roster building around collecting required tags
- No hero is "useless" - all have content access value
- Inspired by WoD Garrison mission system (proven engagement)

### Progression Without Complexity
- Simple leveling (1-50) without talent trees or skill points
- Complexity comes from TEAM COMPOSITION and TRAIT SYNERGIES
- Ascension provides prestige loop without overwhelming players

---

**The Hero System creates strategic depth through roster management, creative personality through trait variety, and long-term engagement through collection and ascension systems - all without predatory gacha mechanics.**

---

## 🎲 Phase 4: RNG Expansion (Post-Launch Content)

*Note: These features are planned for post-launch content updates to increase replayability and variety. Not part of MVP.*

### Expanded Trait Pool (200+ Traits)

**Current State**: ~60 core traits (Common → Legendary)
**Phase 4 Goal**: 200+ traits with synergies, conflicts, and personality modifiers

#### Trait Synergies
Certain trait combinations create bonus effects:
- **Coffee Addict + Perfectionist** = *Stress Events* (+10% damage, -5% HP, random mood events)
- **Plant Whisperer + Nature Affinity** = *Harmony Bonus* (+15% healing from nature-themed abilities)
- **Competitive + Team Player** = *Motivated Leadership* (+5% party XP gain)

#### Trait Conflicts
Some traits actively work against each other:
- **Drama Queen + Social Media Star** = *Attention Competition* (-10% party cohesion stats)
- **Professional Napper + Caffeine Dependent** = *Circadian Chaos* (random daily stat variance ±10%)
- **Lone Wolf + Social Butterfly** = *Identity Crisis* (-5% all stats until one trait is evolved)

### Procedural Personality Modifiers

**Temperament Types** (rolled at recruitment):
- Optimistic (+5% positive story event chance)
- Pessimistic (+5% conflict story event chance, +10% damage when cornered)
- Pragmatic (Balanced story outcomes, +5% gold efficiency)

**Ambition Levels**:
- Overachiever (+10% XP gain, +stress events)
- Balanced (Normal progression)
- Relaxed (-10% XP gain, -stress events, +mood stability)

**Humor Type** (affects emergent story tone):
- Sarcastic, Wholesome, Dark, Absurdist, Dry

### Procedural Hero Bios & Portraits

**Visual Randomization**:
- 5-10 portrait variations per archetype (hair, accessories, expressions)
- Color palette variations (skin tone, armor color, accent colors)
- Procedural background stories based on trait combinations

**Bio Generation**:
- Origin story template + trait-based details
- Previous occupation reference (e.g., "Former accountant turned Tank")
- Quirky personal detail tied to traits

### Trait Reroll System

**Mechanic**: Players can reroll ONE trait after recruitment using *Trait Reroll Token*
**Token Sources**:
- Story mission rewards (3-5 tokens total in campaign)
- Rare expedition drops (0.5% chance)
- Alliance shop (expensive, 500 Alliance Points)
- Endgame prestige rewards

**Limitations**:
- Only works on Common/Uncommon traits (not Rare/Legendary)
- Cannot reroll archetype-defining traits
- Can only be used once per hero (permanent choice)

### Training Events

**Mechanic**: Random events during expeditions that temporarily modify hero traits
**Duration**: 24-72 hours real-time
**Effects**:
- *Inspired*: +15% XP gain, +1 temporary micro-trait
- *Exhausted*: -10% stats, +rest needed (triggers story events)
- *Enlightened*: Chance to upgrade Common trait → Uncommon

**Trigger Rate**: 5-10% chance per expedition completion

---

## 😊 Personality System (Phase 2+)

**Purpose**: Heroes have distinct personalities that affect interactions, preferences, and story generation

### Personality Dimensions (5 Axes)

Each hero is generated with personality scores on 5 axes (0-10 scale):

#### 1. **Sociability** (Loner ← → Social Butterfly)
- **Low (0-3)**: Prefers solo missions, -5% stats in 5-hero parties, +15% stats in 1-2 hero missions
- **Mid (4-7)**: No bonuses or penalties
- **High (8-10)**: +10% stats in full 5-hero parties, generates more social story events

**Interaction Effects**:
- High sociability heroes complain on solo missions ("Where's everyone?")
- Low sociability heroes sigh when assigned to large parties ("Too crowded...")

#### 2. **Work Ethic** (Relaxed ← → Workaholic)
- **Low (0-3)**: -10% XP gain, -stress events, generates "napping" story events
- **Mid (4-7)**: Normal progression
- **High (8-10)**: +15% XP gain, +stress events, generates "overtime" story events

**Interaction Effects**:
- Workaholics volunteer for back-to-back missions
- Relaxed heroes request rest after 3+ consecutive missions (morale penalty if ignored)

#### 3. **Risk Tolerance** (Cautious ← → Thrill-Seeker)
- **Low (0-3)**: -10% damage in high-risk missions, +10% survival rate
- **Mid (4-7)**: Balanced
- **High (8-10)**: +15% damage in high-risk missions, -5% survival rate

**Interaction Effects**:
- Cautious heroes warn about danger ("Are you SURE this is safe?")
- Thrill-seekers get excited about dangerous missions ("Finally, a challenge!")

#### 4. **Competitiveness** (Team Player ← → Solo Glory)
- **Low (0-3)**: +10% party synergy bonuses, generates supportive story events
- **Mid (4-7)**: Normal team dynamics
- **High (8-10)**: +20% damage when "top damage dealer" in party, -10% when not

**Interaction Effects**:
- Competitive heroes celebrate personal achievements
- Team players celebrate party victories

#### 5. **Seriousness** (Goofy ← → Professional)
- **Low (0-3)**: Generates humorous/absurd story events, +morale to party
- **Mid (4-7)**: Mix of serious and humorous events
- **High (8-10)**: Generates professional/dry story events, +focus bonuses

**Interaction Effects**:
- Goofy heroes make jokes during combat ("This is fine!")
- Professional heroes deliver status reports ("Situation nominal.")

### Personality-Based Story Events

**Example Events** (triggered during expeditions):

**Sociability**:
- *High*: "Made friends with a goblin. It's complicated." (+1 unique story thread)
- *Low*: "Found a quiet cave. Best day ever." (+5% damage next mission)

**Work Ethic**:
- *High*: "Stayed late to organize inventory. Again." (+10% gold efficiency for 24h)
- *Low*: "Took a nap mid-combat. Still won." (+15% HP regen for 24h)

**Risk Tolerance**:
- *High*: "Charged the dragon alone. Regrets minimal." (+monster capture chance)
- *Low*: "Triple-checked the dungeon schematic. Safety first!" (+dungeon rewards)

**Competitiveness**:
- *High*: "Beat everyone's damage record. Mentioned it. Twice." (+XP but -party morale)
- *Low*: "Helped teammate with their combo. Teamwork!" (+party morale)

**Seriousness**:
- *High*: "Filed a detailed incident report. 47 pages." (+story mission rewards)
- *Low*: "Named the boss 'Kevin'. It stuck." (+emergent story humor)

### Personality Conflicts & Synergies

**Positive Synergies**:
- **Workaholic + Workaholic**: "Productivity Partnership" (+20% XP for both)
- **Team Player + Team Player**: "Perfect Sync" (+15% party stats)
- **Goofy + Goofy**: "Comedy Duo" (+morale to entire party)

**Neutral Dynamics**:
- Most personality mismatches have no mechanical effect (flavor only)

**Negative Conflicts**:
- **Solo Glory + Solo Glory**: "Glory Hog Wars" (-15% party stats, dramatic story events)
- **Thrill-Seeker + Cautious**: "Safety Debate" (-10% mission efficiency, argument events)
- **Workaholic + Relaxed**: "Different Paces" (-5% party XP, passive-aggressive dialogue)

---

## 💚 Morale/Happiness System (Phase 2+)

**Purpose**: Heroes have mood states that affect performance, generate story content, and create management gameplay

### Morale Scale (0-100)

Each hero has a morale score that fluctuates based on activities and conditions:

- **85-100**: *Inspired* (+15% all stats, positive story events, volunteers for missions)
- **60-84**: *Content* (Normal performance, balanced story events)
- **35-59**: *Neutral* (No bonuses/penalties, mundane story events)
- **15-34**: *Stressed* (-10% all stats, complaint story events, needs management)
- **0-14**: *Burnout* (-25% all stats, refuses new missions until morale restored)

### Morale Gain Sources (+)

**Positive Activities**:
- **Mission Success**: +10 morale (success = 100%+ efficiency)
- **Level Up**: +15 morale
- **Equipment Upgrade**: +8 morale (Epic+), +5 morale (Rare)
- **Monster Capture**: +12 morale (hero involved in capture)
- **Story Mission Completion**: +20 morale (narrative reward)
- **Alliance Raid Victory**: +25 morale (social achievement)
- **Personal Dungeon Creation**: +18 morale (creative expression)
- **Rest Period**: +5 morale per 6 hours idle (max +30 per day)

**Personality-Based Bonuses**:
- **Workaholic**: +5 morale per mission (loves working)
- **Thrill-Seeker**: +10 morale on high-risk missions
- **Social Butterfly**: +8 morale in 5-hero parties
- **Team Player**: +6 morale when party succeeds together

**Special Events**:
- **Birthday** (random annual event): +30 morale
- **Friendship Milestone** (100 missions with same party): +25 morale
- **Achievement Unlocked** (personal milestones): +15 morale

### Morale Loss Sources (-)

**Negative Activities**:
- **Mission Failure**: -15 morale (performance <80%)
- **Consecutive Missions**: -5 morale per mission after 5th in 24h
- **Ignored Preferences**: -10 morale (e.g., solo hero in 5-man party repeatedly)
- **Equipment Neglect**: -3 morale per day if using Common gear at Level 30+
- **No Activity**: -8 morale per day after 48h idle (heroes want to work)
- **Alliance Raid Loss**: -12 morale
- **Death in Combat**: -20 morale (rare failure state)

**Personality-Based Penalties**:
- **Relaxed**: -8 morale if 5+ missions in 24h (overworked)
- **Solo Glory**: -10 morale if not top damage in party
- **Cautious**: -12 morale on high-risk failures
- **Social Butterfly**: -15 morale on solo missions

**Conflict Effects**:
- **Personality Clash**: -5 morale per conflicting hero in party
- **Unfavorable Team Comp**: -8 morale (e.g., workaholic with 3 relaxed heroes)

### Morale Management Mechanics

**Player Actions to Restore Morale**:

1. **Rest Period** (Free)
   - Remove hero from active roster for 6-12 hours
   - Generates "vacation" story events
   - +30 morale restored

2. **Motivational Speech** (50 Gold)
   - Instant +15 morale
   - Corporate satire: "Mandatory team-building seminar"
   - 24h cooldown per hero

3. **Equipment Gift** (Varies)
   - Equip new item → +5-15 morale based on rarity
   - Heroes comment on upgrades ("Ooh, shiny!")

4. **Preferred Activity** (Smart Assignment)
   - Match hero personality to mission type
   - Social Butterfly → Full party missions (+morale instead of -)
   - Thrill-Seeker → High-risk content (+morale instead of -)

5. **Alliance Social Event** (Alliance Feature)
   - Weekly guild party
   - +10 morale to all participating heroes
   - Generates social story events

6. **Personal Dungeon Assignment** (Creative Expression)
   - Let hero "design" their preferred dungeon schematic
   - +20 morale for creative control
   - Unlocks at Level 25+

### Morale-Based Story Events

**Inspired State (85-100)**:
```
Thrain: "I could fight dragons all day! Bring it on!"
→ Volunteers for next high-risk mission
→ +5% damage for 24h
```

**Content State (60-84)**:
```
Sylvana: "Another day, another dungeon. Life's good."
→ Normal story progression
```

**Stressed State (15-34)**:
```
Morrigan: "I need a vacation. Or a dragon to burn. Preferably both."
→ Requests rest period
→ -10% stats until morale improved
```

**Burnout State (0-14)**:
```
Boris: "I quit. Wake me when it's over."
→ REFUSES new missions
→ Must restore morale to 35+ before assignment
→ Generates "union strike" story event (corporate satire)
```

### UI Indicators

**Hero Roster Display**:
```
[Hero Portrait] Thrain Ironfist - Level 32 Tank
Power: 1,245 | Morale: 78/100 (Content 😊)

Personality:
- Sociability: ⭐⭐ (Loner)
- Work Ethic: ⭐⭐⭐⭐⭐⭐⭐⭐ (Workaholic)
- Risk Tolerance: ⭐⭐⭐⭐⭐⭐ (Brave)
- Competitiveness: ⭐⭐⭐⭐⭐⭐⭐ (Solo Glory)
- Seriousness: ⭐⭐⭐⭐⭐⭐⭐⭐⭐ (Very Professional)

Recent Events:
- "Completed 3 missions today. Efficiency: 100%." (+10 morale)
- "Didn't talk to anyone. Perfect." (+5 morale, loner bonus)
- "Top damage dealer. Again. Obviously." (+8 morale, competitive)
```

**Morale Warning System**:
```
⚠️ WARNING: Sylvana is Stressed (28/100)
Cause: 7 consecutive solo missions (Social Butterfly penalty)
Solution: Assign to 5-hero party OR give rest period
Estimated Recovery: 12 hours rest OR 1 social mission
```

### Integration with Existing Systems

**Trait Interactions**:
- **Coffee Addict** trait: Morale +10 when assigned after 6h rest (caffeinated!)
- **Drama Queen** trait: Morale -5 when in mixed-gender parties (personality quirk)
- **Professional Napper** trait: Rest periods restore +50% more morale

**Equipment Set Bonuses**:
- **Comfort Set** (2pc): +10% morale gain from all sources
- **Prestige Set** (4pc): Morale never drops below 35 (prevents burnout)

**Alliance Bonuses**:
- **Guild Hall Level 3**: +5 passive morale per day for all heroes
- **Alliance Parties**: Weekly events restore +20 morale to participants

**Ascension Benefits**:
- Ascended heroes: Morale decay reduced by 50%
- New trait slot can hold "Veteran" trait (+morale stability)

### Design Philosophy

**Why Morale/Personality Matters**:
1. **Roster Variety**: Not just "optimal stats" - personality creates preference
2. **Story Generation**: Personality + morale = emergent narrative content
3. **Management Gameplay**: Players care about hero happiness, not just power
4. **Respects Player Time**: Prevents mindless grinding (burned out heroes refuse)
5. **Corporate Satire**: "Employee burnout", "mandatory fun", "performance reviews"

**Balance Goals**:
- Morale should INFLUENCE but not DICTATE gameplay
- Players can ignore morale in early game (forgiving thresholds)
- Late game rewards morale management (Inspired heroes = +15% stats)
- Burnout is RARE and easily preventable (safety net at 0-14 range)

---

---

## 📋 System Summary & Implementation Notes

### Tavern-Only Acquisition Flow

**Player Journey**:
1. Visit Tavern page (12h timer starts)
2. See 3-10 hero slots (based on player level)
3. Inspect each hero: stats (±10% variance), traits (numerical ranges), tags
4. Recruit for 100 Gold (same price all rarities)
5. Wait 12h OR manually refresh for gold cost
6. Higher player level = more slots + better rarity odds

**Why This System Works**:
- Single source = clarity (no confusion where heroes come from)
- 12h refresh = respectful engagement cadence (not manipulative 1h timers)
- Manual reroll = gold sink + agency (spend to find perfect rolls)
- Progressive unlocking = built-in progression rewards
- ±10% stat variance + trait ranges = no two heroes identical

### Stat Variety Implementation

**RNG Calls Required Per Hero**:
```typescript
// 1. Base stat generation (4 rolls)
const baseHP = rollRange(archetypeHP_min, archetypeHP_max); // e.g., 225-275 for Tank
const baseATK = rollRange(archetypeATK_min, archetypeATK_max);
const baseDEF = rollRange(archetypeDEF_min, archetypeDEF_max);
const baseSPD = rollRange(archetypeSPD_min, archetypeSPD_max);

// 2. Trait count (1 roll)
const traitCount = rollTraitCount(heroRarity); // 3-7 traits based on rarity

// 3. Per-trait generation (traitCount × 2 rolls each)
for (let i = 0; i < traitCount; i++) {
  const traitRarity = rollWeighted(TRAIT_RARITY_WEIGHTS); // Common 60%, Uncommon 25%, etc.
  const trait = selectRandomTrait(traitRarity, excludeExisting);
  const traitRoll = rollTraitValues(trait); // e.g., Coffee Addict: 22-28% SPD → rolls 25%
}

// 4. Ability tags (deterministic based on archetype + 1-2 RNG)
const tags = assignAbilityTags(archetype);
```

**Total RNG Calls**: 4 (stats) + 1 (trait count) + (3-7 traits × 2 rolls) = **11-19 RNG calls per hero**

### Numerical Trait Ranges (Diablo-Style)

**Implementation Example**:
```typescript
// Trait definition (server-side)
const COFFEE_ADDICT_TRAIT = {
  name: "Coffee Addict",
  rarity: "Common",
  effects: [
    { stat: "SPD", min: 22, max: 28, type: "percentage" }, // +22-28% SPD
    { type: "cost", amount: 50, currency: "gold" }, // costs 50g/expedition
    { type: "event", frequency: 150, category: "coffee_crisis" }, // +150% event freq
  ],
  flavor: "Has not been the same since discovering coffee. Needs intervention.",
};

// Hero generation (rolls specific values)
function rollTraitValues(trait: TraitDefinition): TraitInstance {
  const effects = trait.effects.map(effect => {
    if (effect.type === "percentage" && effect.min && effect.max) {
      return {
        ...effect,
        value: rollRange(effect.min, effect.max), // e.g., rolls 25%
      };
    }
    return effect; // Fixed values (costs, events) don't roll
  });

  return {
    name: trait.name,
    rarity: trait.rarity,
    effects, // Now has specific rolled values
    flavor: trait.flavor,
  };
}

// Display to player
"Coffee Addict ⭐: +25% SPD, costs 50g/expedition"
```

### RNG System Integration

**References to RNG_SYSTEM.md**:
- Trait rarity rolls use `TRAIT_RARITY_WEIGHTS` (lines 148-154)
- Pity system for Epic/Legendary traits (lines 256-277)
- Server-side `secureRandom()` for all rolls (lines 61-66)
- Audit logging for all hero generation (lines 87-97)

**Tavern Refresh RNG**:
```typescript
async function refreshTavern(playerId: string): Promise<Hero[]> {
  const playerLevel = await getPlayerLevel(playerId);
  const slotCount = getTavernSlots(playerLevel); // 3-10 based on level
  const rarityWeights = getTavernRarityWeights(playerLevel); // Progressive improvement

  const heroes: Hero[] = [];

  // Guarantee: 1x Tank/Healer, 1x DPS, rest RNG
  const guaranteedArchetypes = ["Tank OR Healer", "DPS"];

  for (let i = 0; i < slotCount; i++) {
    const heroRarity = weightedRoll(rarityWeights); // Common, Uncommon, Rare, Epic, Legendary
    const archetype = i < guaranteedArchetypes.length
      ? rollGuaranteedArchetype(guaranteedArchetypes[i])
      : rollRandomArchetype();

    const hero = await generateHero(playerId, archetype, heroRarity);
    heroes.push(hero);

    // Log for audit
    await logRNGCall({
      playerId,
      system: "tavern_refresh",
      roll: heroRarity,
      result: hero.id,
    });
  }

  return heroes;
}
```

### Compatibility with TRAIT_SYSTEM_EXPANDED.md

**300+ Traits Available**:
- **Combat Traits**: 80 (enemy-specific, combat style, weapon specialist)
- **Personality Traits**: 120 (gaming culture parody, neurodivergent rep, energy/vibe)
- **Elemental Affinity**: 40 (fire, ice, lightning, nature, shadow, holy)
- **Career/Background**: 60 (corporate satire, former jobs, workplace humor)
- **Meta/Self-Aware**: 30 (fourth wall breaking, isekai, NPC awareness)
- **Dungeon/Monster Mastery**: 50 (monster whisperer, architect, hoarder)
- **Relationship Traits**: 50 (dynamic, don't count toward slot limit)

**TNP Balance System**:
- All traits balanced for Total Numeric Power (TNP) ≈ 0
- Stat value weights: Damage/Healing 1.0x, HP/DEF 1.2x, SPD 0.8x, Gold 0.3x, XP 0.5x
- Rarity power budgets ensure Epic/Legendary traits stronger but balanced
- Events/flavor text = 0 TNP (cosmetic chaos is free)

**Every Trait Has**:
- ✅ Positive effects (valuable bonuses)
- ❌ Negative effects (meaningful trade-offs, NOT punishments)
- 📖 Flavor text (gaming/character parody)
- 🎲 Events (optional, funny but not game-breaking)
- 💕 Relationship impacts (optional, affects team dynamics)

### Phase 1 MVP Implementation Checklist

✅ **Completed in This Document**:
- [x] Tavern-only acquisition design
- [x] 12-hour refresh timer with manual reroll
- [x] Progressive slot unlocking (3 → 10 slots)
- [x] Rarity odds improvement per player level
- [x] ±10% stat variance per archetype
- [x] Stat variance persistence through levels
- [x] Diablo-style numerical trait ranges
- [x] Trait slot unlocking every 5 levels (rarity-dependent)
- [x] RNG system integration documentation
- [x] TRAIT_SYSTEM_EXPANDED.md compatibility

⏳ **Next Steps** (Implementation):
1. Create `TavernSystem.ts` with refresh timer logic
2. Implement `HeroGenerator.ts` with stat/trait RNG
3. Create `TraitLibrary.ts` with 300+ trait definitions + numerical ranges
4. Build Tavern UI (hero preview, inspect, recruit, reroll)
5. Integrate with RNG_SYSTEM.md audit logging
6. Test stat variance impact at all level breakpoints
7. Validate TNP balance for all traits
8. Implement trait slot unlocking on level-up

---

## See Also

**Core Systems**:
- [RNG_SYSTEM.md](RNG_SYSTEM.md) - Server-side RNG, pity systems, audit logging
- [TRAIT_SYSTEM_EXPANDED.md](TRAIT_SYSTEM_EXPANDED.md) - Complete 300+ trait catalog with TNP balance
- [EXPEDITION_SYSTEM.md](EXPEDITION_SYSTEM.md) - Tag-based mission requirements and hero deployment
- [EQUIPMENT_SYSTEM.md](EQUIPMENT_SYSTEM.md) - Power calculation and gear slot mechanics

**Progression & Economy**:
- [ECONOMY_PROGRESSION.md](ECONOMY_PROGRESSION.md) - Gold costs for recruitment and progression paths
- [EMERGENT_STORY_SYSTEM.md](EMERGENT_STORY_SYSTEM.md) - Trait-based narrative generation with personality system

---

**Last Updated**: 2025-11-05
**Status**: Tavern system designed, ready for Phase 1 MVP implementation
