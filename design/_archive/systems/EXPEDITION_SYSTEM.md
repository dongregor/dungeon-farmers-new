# Expedition System - Dungeon Farmers

**Complete expedition content design: Zones, Missions, Dungeons, and Raids**

---

## 🎯 Core Philosophy

**No Failure States. Efficiency Variance. Always Rewarding.**

Every expedition succeeds - the question is HOW WELL you perform (60-100%+ efficiency). This respects player time by never making expeditions a complete waste.

---

## 📊 Content Type Overview

### ZONES - Exploration Content
**Purpose**: Resource farming, monster capture, repeatable progression

- **Duration**: 10-60 minutes (player chooses expedition length)
- **Team Size**: 1-3 heroes
- **Rewards**: Random loot, materials, **monster captures** (5-15% chance)
- **Replayable**: Unlimited
- **Progression**: Linear unlock sequence (Zone 1 → Zone 2 → ... → Zone 20+)

**Player emotion**: "I'm exploring new areas and might capture a rare monster!"

### MISSIONS - Story Content
**Purpose**: Narrative progression, **guaranteed** specific rewards

- **Duration**: 15-45 minutes
- **Team Size**: 2-4 heroes
- **Rewards**: Guaranteed specific items/monsters/schematics (no RNG)
- **Replayable**: Yes, but story dialogue only plays once
- **Progression**: Unlocks through zone completion

**Player emotion**: "I need that specific monster for my dungeon - this mission guarantees it!"

### DUNGEONS - Instanced Equipment Farming
**Purpose**: Equipment set pieces, progression materials

- **Duration**: 20-40 minutes
- **Team Size**: 3-5 heroes
- **Rewards**: Set equipment pieces, rare crafting materials
- **Replayable**: Daily/weekly limits (prevents burnout)
- **Progression**: Unlock at specific player levels

**Player emotion**: "I need 2 more pieces of this equipment set!"

### RAIDS - Alliance Cooperative Content
**Purpose**: Premium rewards, rare monsters, social engagement

- **Duration**: 30-60 minutes
- **Team Size**: 3-5 players (alliance cooperation)
- **Rewards**: Epic/Legendary equipment, rare monsters, exclusive materials
- **Replayable**: Weekly resets per raid tier
- **Progression**: Alliance level gates access

**Player emotion**: "We're coordinating as a team to take down this dragon together!"

---

## 🗺️ ZONES - Exploration Content

### Zone Progression Structure

**Linear Unlock Path:**
```
Zone 1: Whispering Woods (Tutorial)
  ↓
Zone 2: Rocky Foothills
  ↓
Zone 3: Abandoned Village
  ↓
Zone 4: Dark Forest
  ↓
Zone 5: Swamp of Sorrows → Mission 1: "Goblin Trouble"
  ↓
Zone 6: Mountain Pass
  ↓
Zone 7: Frozen Tundra
  ↓
Zone 8: Volcanic Wastes
  ↓
Zone 9: Shadow Realm
  ↓
Zone 10: Crystal Caverns → Raid 1: "Dragon's Lair" (Alliance)
  ↓
... (Zones 11-20+ for late/endgame)
```

### Difficulty Scaling

**Difficulty Tiers:**
- **★☆☆☆☆ Trivial**: Tutorial zone (Zone 1)
- **★★☆☆☆ Easy**: Early game (Zones 2-4)
- **★★★☆☆ Medium**: Mid game (Zones 5-10)
- **★★★★☆ Hard**: Late game (Zones 11-15)
- **★★★★★ Very Hard**: Endgame (Zones 16-20)
- **★★★★★★ Elite**: Endgame+ (Zones 21+)

**Power Requirements:**
```
Zone 1 (Trivial): 30-50 Power
Zone 5 (Medium): 150-200 Power
Zone 10 (Medium): 400-500 Power
Zone 15 (Hard): 700-900 Power
Zone 20 (Very Hard): 1200-1500 Power
Zone 25+ (Elite): 2000+ Power
```

### Zone Features

#### Duration Options (Player Choice)
Each zone offers multiple duration options for same rewards (scaled):

**Example - Zone 5: Swamp of Sorrows**
- **Quick Expedition** (10 min): Base rewards ×0.5, monster capture 5%
- **Standard Expedition** (30 min): Base rewards ×1.0, monster capture 10%
- **Extended Expedition** (60 min): Base rewards ×2.0, monster capture 15%

**Design Rationale**: Players choose based on available time. Quick check-ins valid, longer sessions rewarded.

#### Monster Capture Chances
- Automatic chance on expedition completion (no separate action)
- Higher difficulty = higher capture rate
- Longer expeditions = higher capture rate
- **MONSTER HUNTER tag**: +25% capture rate bonus

**Capture Rate Table:**
```
★☆☆☆☆ Trivial + 10 min: 5% chance
★★★☆☆ Medium + 30 min: 10% chance
★★★★★ Very Hard + 60 min: 15% chance
With MONSTER HUNTER tag: +25% (e.g., 10% → 12.5%)
```

#### Familiarity System (Zone Mastery)
**Repeated zone completions increase familiarity:**
- 0-5 runs: Unfamiliar (base rewards)
- 6-15 runs: Familiar (+5% rewards)
- 16-30 runs: Comfortable (+10% rewards)
- 31-50 runs: Expert (+15% rewards)
- 51+ runs: Mastered (+20% rewards, -10% duration)

**Player strategy**: "I've mastered Swamp of Sorrows. I farm it faster now with better rewards!"

### Zone Rewards

**Guaranteed:**
- **Gold** (scales with difficulty and duration)
- **Experience** (for heroes used)
- **Base Materials** (zone-specific: Wood, Stone, Ore, etc.)

**Variable (RNG):**
- **Equipment Drops** (quality based on difficulty)
  - Trivial zones: Common equipment
  - Medium zones: Common/Uncommon equipment
  - Hard zones: Uncommon/Rare equipment
  - Very Hard zones: Rare/Epic equipment
- **Monster Captures** (chance-based, see table above)
- **Schematic Drops** (see [MONSTER_DUNGEON_SYSTEM.md](MONSTER_DUNGEON_SYSTEM.md#schematic-rarity-distribution-exact-drop-rates) for complete drop rate table)
- **Bonus Materials** (critical success, 10% chance)

**First Clear Bonus:**
- +100% all rewards (encourages exploration)
- Guaranteed schematic drop (Common/Uncommon)
- Guaranteed monster capture (zone-specific type)

---

## 📖 MISSIONS - Story Content

### Mission Categories

#### Main Story Missions
**Purpose**: Drive narrative, unlock features

**Examples:**
- "Goblin Trouble" (Zone 5 unlock) - Guaranteed Goblin Warrior
- "Dragon's Awakening" (Zone 10 unlock) - Guaranteed Dragon Whelp
- "Alliance Formation" (Alliance system unlock) - Guaranteed Alliance Invitation

**Structure:**
- Linear story progression
- Unlocks new game systems (personal dungeons, alliances, crafting)
- Guaranteed specific rewards (no RNG frustration)

#### Side Missions
**Purpose**: Additional lore, targeted rewards

**Examples:**
- "The Lost Merchant" - Guaranteed Rare equipment set piece
- "Ancient Ruins Investigation" - Guaranteed Rare schematic
- "Monster Migration" - Guaranteed 3x specific monster types

**Structure:**
- Optional but valuable
- Appear after completing specific zones
- One-time guaranteed rewards

### Mission Structure

**Tag Requirements (WoW Garrison-Inspired):**
Missions require specific hero tags for optimal performance:

**Example Mission:**
```
🗡️ MISSION: Spider Queen's Lair
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Story: The Spider Queen threatens nearby villages...

Requirements:
☑ 1x MONSTER HUNTER (Sylvana - Assigned)
☑ 1x EXPLORER (Scout Hero - Assigned)
☐ 1x HEALER (Need to assign)

Duration: 25 minutes
Recommended Power: 250+

Guaranteed Rewards:
✓ Spider Silk x10
✓ Rare Spider Warrior (monster capture)
✓ Arachnid Den (Uncommon schematic)
✓ 500 Gold
✓ 300 Experience

Bonus Rewards (if all tags matched):
✓ +50% monster capture rate
✓ +25% gold reward
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ASSIGN HEROES] [START MISSION]
```

**Design Rationale**: Tag matching encourages roster diversity. Players collect heroes with different tags strategically.

### Mission Progression

**Unlock Pattern:**
```
Zone 1-4 → No missions (learning basics)
Zone 5 → Mission 1: "Goblin Trouble"
Zone 7 → Mission 2: "Dark Forest Mystery"
Zone 10 → Mission 3: "Dragon's Awakening"
Zone 12 → Mission 4: "Undead Rising"
Zone 15 → Mission 5: "Ancient Temple"
Zone 20 → Mission 6: "Final Confrontation"
```

**Story Arcs:**
- Acts 1-3 (Zones 1-10): Goblin threat, introduction to world
- Acts 4-6 (Zones 11-15): Dragon awakening, alliance formation
- Acts 7-9 (Zones 16-20): Ancient evil, endgame narrative

---

## ⚔️ DUNGEONS - Instanced Equipment Farming

### Dungeon Types

#### Equipment Dungeons (Set Piece Farming)
**Purpose**: Target specific equipment sets

**Examples:**
- **Guardian's Oath Dungeon** - Tank set (4-piece)
- **Shadow Stalker Dungeon** - Ranged DPS set (4-piece)
- **Arcane Mastery Dungeon** - Caster set (4-piece)

**Structure:**
- 3-5 heroes required (team composition matters)
- 30-minute duration
- Daily limit: 3 runs per dungeon
- Guaranteed 1 set piece per run (random which piece)

#### Material Dungeons (Crafting Resources)
**Purpose**: Farm rare crafting materials

**Examples:**
- **Crystal Mines** - Crystal farming
- **Ancient Forge** - Metal farming
- **Elemental Sanctum** - Elemental essence farming

**Structure:**
- 3-5 heroes required
- 20-minute duration
- Weekly limit: 10 runs total (across all material dungeons)
- Guaranteed materials per run

### Dungeon Mechanics

#### Boss Mechanics (Simple, Not Complex)
**Design Philosophy**: Idle game, not action RPG. Mechanics are team composition checks, NOT twitch gameplay.

**Mechanic Examples:**
- **Fire Boss**: Requires RANGED heroes (avoid burn damage)
- **Flying Boss**: Requires RANGED heroes (melee can't reach)
- **Armor Boss**: Requires CASTER heroes (bypass physical defense)
- **Speed Boss**: Requires high SPD heroes (catch the boss)

**Player Strategy**: "I need Ranged heroes for this dungeon. Let me adjust my team."

#### Daily/Weekly Limits
**Why Limits?**
- Prevent burnout from endless grinding
- Encourage strategic dungeon selection (which set do I prioritize today?)
- Maintain resource economy balance

**Limits:**
- **Equipment Dungeons**: 3 runs per dungeon per day
- **Material Dungeons**: 10 runs total per week (choose which dungeons wisely)

**Player Strategy**: "I have 3 runs today. Should I farm Guardian's Oath or Shadow Stalker set pieces?"

### Dungeon Rewards

**Guaranteed:**
- 1 equipment set piece (random piece from 6-piece set)
- Crafting materials (dungeon-specific)
- Gold and experience

---

## 📈 Performance & Reward Formulas

### Efficiency Calculation (60-150% Variance)

**Phase 1 MVP** - All expeditions use performance-based rewards:

```typescript
function calculateEfficiency(
  heroPower: number,
  recommendedPower: number,
  synergy: number, // 0.0 to 1.0 from tag/trait matching
): number {
  // Power ratio (80% weight)
  const powerRatio = heroPower / recommendedPower;
  const powerContribution = powerRatio * 0.80;

  // Synergy bonus (15% weight)
  const synergyContribution = synergy * 0.15;

  // RNG variance (5% weight, ±5%)
  const rngContribution = (Math.random() - 0.5) * 0.10;

  // Clamp to 60-150% range
  const efficiency = powerContribution + synergyContribution + rngContribution;
  return Math.max(0.60, Math.min(1.50, efficiency));
}
```

**Concrete Examples**:
- **Underpowered** (500 power vs 800 recommended, 0 synergy):
  - Power ratio: 0.625 × 0.80 = 0.50
  - Synergy: 0 × 0.15 = 0
  - RNG: ±0.05
  - Result: **0.55** → clamped to **60% efficiency**

- **Balanced** (800 power vs 800 recommended, 0.5 synergy):
  - Power ratio: 1.0 × 0.80 = 0.80
  - Synergy: 0.5 × 0.15 = 0.075
  - RNG: ±0.05
  - Result: **82-92% efficiency** (typical: 87%)

- **Overpowered** (1200 power vs 800 recommended, 1.0 synergy):
  - Power ratio: 1.5 × 0.80 = 1.20
  - Synergy: 1.0 × 0.15 = 0.15
  - RNG: ±0.05
  - Result: **1.30-1.40** → clamped to **135-145% efficiency** (typical: 140%)

**Synergy Calculation**:
```typescript
function calculateSynergy(hero: Hero, expedition: Expedition): number {
  let synergyScore = 0.0;

  // Tag matching (+0.5 per matched tag, max 1.0)
  const matchedTags = hero.tags.filter(tag =>
    expedition.recommendedTags.includes(tag)
  );
  synergyScore += Math.min(1.0, matchedTags.length * 0.5);

  // Trait bonuses (+0.25 per relevant trait)
  if (hero.traits.includes("monster_hunter") && expedition.hasMonsters) {
    synergyScore += 0.25;
  }
  if (hero.traits.includes("treasure_hunter") && expedition.hasRareDrops) {
    synergyScore += 0.25;
  }
  if (hero.traits.includes("explorer") && expedition.isDiscovery) {
    synergyScore += 0.25;
  }

  return Math.min(1.0, synergyScore); // Cap at 1.0
}
```

### Reward Scaling by Efficiency

**All rewards scale with efficiency**:

```typescript
function calculateRewards(baseRewards: Rewards, efficiency: number): Rewards {
  return {
    gold: Math.floor(baseRewards.gold * efficiency),
    experience: Math.floor(baseRewards.experience * efficiency),
    materials: baseRewards.materials.map(m => ({
      type: m.type,
      amount: Math.floor(m.amount * efficiency),
    })),
    // Rare drops use efficiency as multiplier for drop chance
    rareDropChance: baseRewards.rareDropChance * efficiency,
  };
}
```

**Reward Examples** (Zone 10 expedition, base: 100 gold, 150 XP, 5 materials):
- **60% efficiency**: 60 gold, 90 XP, 3 materials
- **100% efficiency**: 100 gold, 150 XP, 5 materials
- **150% efficiency**: 150 gold, 225 XP, 7 materials

**Design Philosophy**: No failure states. Even weak heroes make progress (60% minimum), strong heroes accelerate progression (150% maximum).

### Duration Ranges by Content Type

**Phase 1 MVP**:

| Content Type | Duration Range | Scaling Factor |
|--------------|----------------|----------------|
| Zones (repeatable) | 5-60 minutes | Scales with zone level (5min at Zone 1 → 60min at Zone 20) |
| Story Missions | 10-120 minutes | Fixed per mission (based on narrative complexity) |
| Equipment Dungeons | 15-180 minutes | Scales with difficulty tier (15min at Tier 1 → 180min at Tier 5) |
| Material Dungeons | 10-90 minutes | Scales with material rarity (10min Common → 90min Mythic) |

**Phase 3** (Alliance Content):

| Content Type | Duration Range | Scaling Factor |
|--------------|----------------|----------------|
| Alliance Raids | 30-360 minutes | Scales with raid tier (30min at Tier 1 → 360min at Mythic) |

**Duration Formula** (zones):
```typescript
function calculateZoneDuration(zoneLevel: number): number {
  // Linear scaling: 5 minutes base + 2.75 minutes per level
  // Zone 1 = 5min, Zone 10 = 30min, Zone 20 = 60min
  const durationMinutes = 5 + (zoneLevel - 1) * 2.75;
  return Math.floor(durationMinutes * 60); // Convert to seconds
}
```

### Monster Capture Chance Formula

**Phase 2** - Personal Dungeon System:

```typescript
function calculateCaptureChance(
  baseCaptureRate: number, // 5-15% based on zone difficulty
  efficiency: number,       // 0.6-1.5 from expedition performance
  traits: string[],         // Hero traits
): number {
  // Base rate (5-15%)
  let captureChance = baseCaptureRate;

  // Efficiency modifier (+0-5% if efficiency >100%)
  if (efficiency > 1.0) {
    captureChance += (efficiency - 1.0) * 0.10; // +10% per 100% over baseline
  }

  // Trait bonuses
  if (traits.includes("monster_hunter")) {
    captureChance += 0.05; // +5%
  }
  if (traits.includes("beast_whisperer")) {
    captureChance += 0.03; // +3%
  }

  // Cap at 25% (monsters should feel rare)
  return Math.min(0.25, captureChance);
}
```

**Concrete Examples**:
- **Zone 5 (10% base), 100% efficiency, no traits**: **10% capture chance**
- **Zone 10 (12% base), 125% efficiency, Monster Hunter trait**: 12% + 2.5% + 5% = **19.5% capture chance**
- **Zone 15 (15% base), 150% efficiency, both traits**: 15% + 5% + 5% + 3% = 28% → capped at **25% capture chance**

**Design Philosophy**: High-performing heroes with relevant traits significantly improve capture rates (10% → 25%), rewarding strategic roster building.

### Schematic Drop Chance

**Phase 2** - Personal Dungeon System:

See [MONSTER_DUNGEON_SYSTEM.md](MONSTER_DUNGEON_SYSTEM.md#schematic-rarity-distribution-exact-drop-rates) for complete drop rate table.

**Drop Rate Modifiers**:
```typescript
function calculateSchematicDropRate(
  baseRates: SchematicRates, // From MONSTER_DUNGEON_SYSTEM.md
  efficiency: number,
  contentType: "zone" | "mission" | "dungeon" | "raid",
): SchematicRates {
  // Content type modifiers
  const contentModifier = {
    zone: 1.0,      // Standard rates
    mission: 1.5,   // +50% drop rates (story missions)
    dungeon: 2.0,   // +100% drop rates (equipment farming)
    raid: 3.0,      // +200% drop rates (alliance content)
  }[contentType];

  // Efficiency modifier (subtle, +0-25% at 150% efficiency)
  const efficiencyModifier = 1.0 + ((efficiency - 1.0) * 0.50);

  return {
    common: baseRates.common * contentModifier * efficiencyModifier,
    uncommon: baseRates.uncommon * contentModifier * efficiencyModifier,
    rare: baseRates.rare * contentModifier * efficiencyModifier,
    epic: baseRates.epic * contentModifier * efficiencyModifier,
    mythic: baseRates.mythic * contentModifier * efficiencyModifier,
  };
}
```

**Example** (Dungeon run at 120% efficiency):
- Common: 60% × 2.0 × 1.10 = **132%** (guaranteed, excess rolls for duplicates)
- Rare: 10% × 2.0 × 1.10 = **22%**
- Mythic: 1% × 2.0 × 1.10 = **2.2%**

See [HERO_SYSTEM.md](HERO_SYSTEM.md#stat-formulas--progression) for hero power calculation details.

---

**RNG Elements:**
- **Which set piece** drops (1 of 6 possible)
- **Item quality** (Epic vs Rare vs Uncommon)
- **Bonus materials** (10% chance for double materials)

**Example Completion:**
```
DUNGEON COMPLETE! (Guardian's Oath Dungeon)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Duration: 30 minutes
Rank: A (90% efficiency)

Rewards:
✓ Guardian's Oath Helmet (Epic) - (3/6 set pieces owned)
✓ Orichalcum Ore x5
✓ Gold +600
✓ Experience +400

Runs Remaining Today: 2/3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[RUN AGAIN] [CHANGE TEAM] [EXIT]
```

---

## 🐉 RAIDS - Alliance Cooperative Content

### Raid Structure

#### Participant Requirements
- **3-5 players** (NOT entire alliance)
- Each player brings 1-5 heroes (total 15-25 heroes across party)
- Real-time coordination (chat during raid)
- Alliance level gates access (Alliance Level 5+ for Beginner raids)

#### Raid Tiers

**Beginner Raids:**
- Alliance Level 5+ required
- Recommended Power: 150+ per player
- Duration: 30 minutes
- Rewards: Uncommon/Rare equipment, Alliance Points

**Intermediate Raids:**
- Alliance Level 10+ required
- Recommended Power: 400+ per player
- Duration: 45 minutes
- Rewards: Rare/Epic equipment, rare monsters, Alliance Points

**Advanced Raids:**
- Alliance Level 15+ required
- Recommended Power: 800+ per player
- Duration: 60 minutes
- Rewards: Epic/Legendary equipment, rare monsters, exclusive materials, Alliance Points

**Elite Raids:**
- Alliance Level 20+ required
- Recommended Power: 1500+ per player
- Duration: 60 minutes
- Rewards: Legendary equipment, Legendary monsters, Mythic materials, massive Alliance Points

### Raid Mechanics

#### Boss Phases
**Design Philosophy**: Simple phases with clear visual/text cues. Automated combat with strategic preparation.

**Example Raid - "Dragon's Lair" (Beginner):**

**Phase 1: Ground Combat (0-33% boss HP)**
- Boss uses melee attacks
- TANK heroes take reduced damage
- HEALER heroes keep party alive

**Phase 2: Flight Mode (34-66% boss HP)**
- Boss takes flight, melee attacks miss
- RANGED heroes deal full damage
- MELEE heroes deal 50% damage

**Phase 3: Desperate Fury (67-100% boss HP)**
- Boss uses AOE fire attacks
- FIRE-resistant heroes take less damage
- HEALER heroes critical for survival

**Player Strategy**: "We need at least 2 Ranged heroes for Phase 2, and 2 Healers for Phase 3."

#### Live Chat Coordination
**Real-time chat during raid:**
```
[ShadowKnight]: Phase 2 starting, ranged heroes focus!
[ArrowQueen]: On it! Switching to rapid fire mode
[You]: Healing ShadowKnight, he's taking heavy damage
[ThunderFist]: Phase 3 incoming, everyone stay spread out
[SkyMage]: Nice heal timing!
```

**Design Rationale**: Social engagement drives retention. Cooperative victories create memorable moments.

### Raid Rewards

**Guaranteed (Scaled by Performance):**
- Epic/Legendary equipment (1-2 pieces per player)
- Rare crafting materials (Dragon Scales, Titan Cores, etc.)
- Alliance Points (500-2000 based on raid tier)
- Gold and experience

**Bonus Rewards (RNG):**
- **Rare monster captures** (10-20% chance per player)
  - Beginner raids: Uncommon/Rare monsters
  - Advanced raids: Rare/Epic monsters
  - Elite raids: Epic/Legendary monsters
- **Legendary schematics** (1-5% chance)
- **Ascension Stones** (raid-exclusive drop, 5-10% chance in Advanced+ raids)

**Example Raid Completion:**
```
RAID COMPLETE! (Dragon's Lair - Beginner)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Party: 5 players, 22 heroes
Duration: 28 minutes 15 seconds
Grade: A (92% efficiency)

Your Rewards:
✓ Drake's Fang (Epic Dagger)
✓ Dragon Scale x5
✓ Alliance Points +650
✓ Gold +1,200
✓ Experience +800
✓ BONUS: Dragon Whelp captured!

Party Chat:
[ShadowKnight]: Great run everyone!
[ThunderFist]: That was smooth
[You]: Fun! Let's do another sometime
[SkyMage]: Added you all as friends
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CLAIM REWARDS] [PARTY CHAT]
```

### Weekly Raid Resets
**Reset Schedule:**
- All raids reset **weekly** on server reset day (e.g., Monday 00:00 UTC)
- Can run each raid tier **once per week per player**
- Alliance can organize multiple groups (different 3-5 player combinations)

**Design Rationale**: Weekly resets prevent burnout, encourage strategic scheduling, maintain reward value.

---

## ⚖️ Efficiency Variance System (No Failure States)

### Performance Grading

**Rank System:**
- **S Rank** (100%+ efficiency): Perfect performance, bonus rewards
- **A Rank** (90-99% efficiency): Excellent performance, small bonus
- **B Rank** (80-89% efficiency): Good performance, full base rewards
- **C Rank** (70-79% efficiency): Adequate performance, slight penalty
- **D Rank** (60-69% efficiency): Poor performance, moderate penalty
- **NEVER BELOW 60%**: Minimum reward floor (respects player time)

### Factors Affecting Efficiency

**Team Power vs Content Difficulty:**
- **Overpowered** (2× recommended): S rank likely
- **Adequate** (1-1.5× recommended): A/B rank likely
- **Underpowered** (0.5-0.9× recommended): C/D rank likely

**Tag Synergies and Counters:**
- **Perfect tags matched**: +10% efficiency
- **Some tags matched**: +5% efficiency
- **No tags matched**: -5% efficiency

**Equipment Optimization:**
- **Full sets equipped**: +5% efficiency
- **Mixed equipment**: Base efficiency
- **Unequipped slots**: -10% efficiency

**Hero Composition Balance:**
- **Balanced team** (Tank, Healer, DPS mix): +5% efficiency
- **Specialized team** (all DPS for speed farming): Base efficiency
- **Unbalanced team** (all Tanks, no DPS): -10% efficiency

**RNG Variance:**
- ±10% variance on all expeditions (luck factor)

**Example Calculation:**
```
Base Efficiency: 100%
Team Power (1.5× recommended): +10%
Tag Matching (2/3 matched): +5%
Equipment (full sets): +5%
Composition (balanced): +5%
RNG Variance: +7%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL EFFICIENCY: 132% → S RANK
Rewards: Base × 1.32 + bonus loot box
```

### Why No Failure States?

**Design Philosophy:**
- **Respects player time** - Never waste 30-60 minutes with zero rewards
- **Encourages experimentation** - Try different team comps without harsh punishment
- **Reduces frustration** - Always progress, just slower if underprepared
- **Promotes optimization** - Better preparation = better rewards (not "win vs lose")

**Player emotion**: "I got a C rank, but still made progress. Next time I'll bring better heroes!"

---

## 🎯 Content Unlocking & Progression

### Linear Unlock Path
```
Player Level 1: Zone 1 unlocked
Player Level 2: Zone 2 unlocked, Hero Recruitment unlocked
Player Level 3: Zone 3 unlocked
Player Level 5: Zone 5 unlocked, Mission 1 appears
Player Level 7: Dungeon 1 unlocked, Personal Dungeons unlocked
Player Level 10: Zone 10 unlocked, Alliance system unlocked
Player Level 12: Raid 1 available (if in Alliance Level 5+)
Player Level 15: Zone 15 unlocked, Advanced crafting unlocked
Player Level 20: Zone 20 unlocked, Ascension system unlocked
Player Level 25+: Endgame zones, Elite raids, Legendary content
```

**Design Rationale**: Gradual complexity introduction. New systems unlock as players master existing ones.

---

**The Expedition System provides diverse content types (Zones, Missions, Dungeons, Raids) that cater to different playstyles (solo vs cooperative) and goals (exploration vs targeted farming vs social play), all unified by the efficiency variance system that respects player time by never allowing complete failure.**

---

## 🎲 Phase 4: Procedural Expeditions & Dynamic Content

*Note: Post-launch content expansion for increased expedition variety and strategic depth.*

### Dynamic Sub-Biomes

**Mechanic**: Zones generate randomized environmental sub-variants each time they're accessed
**Variation Rate**: 30-40% of expeditions encounter a sub-biome variant

**Example Sub-Biomes**:

**Frozen Tundra**:
- Standard: Normal temperature, balanced spawns
- *Blizzard Variant*: -15% hero SPD, +30% Ice monster power, +Ice Crystal drops
- *Ancient Ice Ruins*: +25% Rare drop rate, +15% difficulty, Ancient monster spawns

**Scorched Desert**:
- Standard: High temperature, Fire monsters common
- *Sandstorm Variant*: -10% accuracy, +15% Evasion for all units, +Sand material drops
- *Oasis Discovery*: +20% healing effectiveness, Water monster spawns, +herb drops

**Dark Forest**:
- Standard: Mixed monster types, medium difficulty
- *Cursed Grove*: +20% Undead spawns, -10% hero morale, +Cursed Essence drops
- *Fairy Circle*: +15% XP gain, Nature monster spawns, +magical material quality

**Gameplay Impact**:
- Sub-biome displayed before expedition launch (player can choose to send or wait)
- Creates dynamic risk/reward decisions
- Encourages expedition timing strategy

### Rogue Events

**Mechanic**: Random events occur during expeditions (10-20% chance)
**Event Types**: Positive, Negative, Neutral (choice-based)

**Positive Events** (40% of rogue events):
- **Discovery**: Find hidden treasure chest (+50% expedition rewards)
- **Shortcut Found**: -20% expedition duration, normal rewards
- **Heroic Moment**: Random hero gains +50% XP for this expedition
- **Monster Ally**: Captured monster assists (+15% efficiency for this run)

**Negative Events** (30% of rogue events):
- **Ambush**: -10% efficiency, +50% combat material drops (high risk/reward)
- **Equipment Malfunction**: -15% hero power for this expedition
- **Lost Path**: +20% duration, normal rewards
- **Curse**: -10% efficiency, chance for Cursed items (rare unique loot)

**Neutral/Choice Events** (30% of rogue events):
- **Merchant Encounter**: Spend 100 Gold to reroll expedition rewards (before seeing results)
- **Fork in the Road**: Choose "Safe Path" (90-110% efficiency) or "Risky Path" (50-170% efficiency)
- **Injured Adventurer**: Help (+Karma, -100 Gold) or Ignore (no effect)
- **Mysterious Shrine**: Sacrifice 50 HP from hero for +30% rare drop chance

**Event Logging**: All rogue events generate emergent story snippets (HR report style)

### Procedural Mission Objectives

**Current**: All missions have "Complete the expedition" objective
**Phase 4**: Missions generate secondary objectives (optional, bonus rewards)

**Objective Types**:

**Escort Mission** (20% of missions):
- Protect NPC during expedition
- Failure: -30% rewards, Success: +50% rewards + bonus XP
- Difficulty: NPC has AI that can trigger traps/attract enemies

**Defense Mission** (15% of missions):
- Defend a location for full expedition duration
- Failure: -20% rewards, Success: +40% rewards + defense materials
- Difficulty: Waves of enemies, requires balanced team

**Collection Mission** (25% of missions):
- Gather specific materials (e.g., "Collect 10 Fire Crystals")
- Failure: Normal rewards, Success: +30% material drops + bonus crystals
- Difficulty: RNG-based material spawns

**Speed Run Mission** (10% of missions):
- Complete expedition in 50% standard duration
- Failure: Normal rewards/duration, Success: +25% all rewards + time bonus
- Difficulty: Requires high SPD team composition

**No Deaths Mission** (10% of missions):
- Complete without any hero going below 25% HP
- Failure: Normal rewards, Success: +40% rewards + perfect clear bonus
- Difficulty: Requires healer/tank composition

**Exploration Mission** (20% of missions):
- Discover 3 hidden areas in zone
- Failure: Normal rewards, Success: +Map Fragment (unlock new zone faster)
- Difficulty: Requires heroes with Exploration tag

### Time-of-Day and Weather Modifiers

**Mechanic**: Expeditions have dynamic time/weather conditions affecting outcomes

**Time of Day** (24-hour cycle, affects all expeditions):
- **Dawn (6-9am)**: +5% hero morale, +5% XP gain
- **Midday (9am-5pm)**: Standard conditions
- **Dusk (5-8pm)**: +10% monster activity, +5% capture rate
- **Night (8pm-6am)**: +15% monster power, +10% rare drop rate, -5% hero accuracy

**Weather Conditions** (random, 40% chance):
- **Clear**: Standard conditions
- **Rain**: -5% Fire monster power, +5% Nature/Water monsters, +herb drops
- **Storm**: +15% Lightning monsters, -10% accuracy all units, +electric materials
- **Fog**: +10% Stealth monster power, -15% hero detection range, +ambush chance
- **Snow**: -10% SPD all units, +15% Ice monster power, +ice materials

**Synergy Effects**: Time + Weather combos create unique conditions
- Night + Fog = "Pitch Black" (+30% Stealth monsters, -25% accuracy, +50% rare drops)
- Dawn + Clear = "Perfect Conditions" (+10% all stats, +15% morale)

### Auto-Expedition Queueing

**Mechanic**: Players can queue multiple expeditions for sequential automation
**Unlock**: Level 20, costs 500 Gold to unlock feature

**Queue Functionality**:
- Queue up to 5 expeditions at once
- Auto-start next expedition when previous completes
- Auto-assign same heroes unless manually changed
- Can set queue to "pause if efficiency < 80%" (safety setting)

**Goal-Based Scheduling**:
- Set target: "Farm 1000 Gold" → System recommends optimal expedition queue
- Set target: "Collect 20 Fire Crystals" → Auto-queues Fire-themed zones
- Set target: "Capture 5 Beast monsters" → Auto-queues Beast-heavy zones

**Queue Management**:
- Reorder queue priority (drag-and-drop in UI)
- Cancel individual expeditions
- "Smart Queue" option: AI optimizes for current player goals

### Risk Modifier Slider

**Mechanic**: Player-controlled risk/reward setting for expeditions
**Unlock**: Level 15 (after basic systems mastery)

**Risk Levels**:

**Safe Mode** (-25% rewards):
- Efficiency range: 90-110% (very consistent)
- Monster power: -15%
- Capture rate: -5%
- Best for: Guaranteed progress, learning new zones

**Balanced Mode** (Standard rewards):
- Efficiency range: 60-150% (default)
- Monster power: Standard
- Capture rate: Standard

**High Risk Mode** (+50% rewards):
- Efficiency range: 40-180% (high variance)
- Monster power: +15%
- Capture rate: +10%
- Rogue event chance: +10% (more positive/negative events)
- Best for: Endgame players, thrill-seekers

**Extreme Risk Mode** (+100% rewards, unlocked at Ascension):
- Efficiency range: 0-250% (extreme variance)
- Monster power: +30%
- Capture rate: +20%
- Rogue event chance: +25%
- Chance for **Mythic Event** (0.5% chance, ultra-rare unique rewards)

**UI Display**: Slider with visual representation of risk/reward curve

---

## See Also

- [HERO_SYSTEM.md](HERO_SYSTEM.md) - Hero tag requirements and team composition
- [MONSTER_DUNGEON_SYSTEM.md](MONSTER_DUNGEON_SYSTEM.md) - Monster capture mechanics and schematic drops
- [EQUIPMENT_SYSTEM.md](EQUIPMENT_SYSTEM.md) - Equipment farming and dungeon rewards
- [ALLIANCE_SYSTEM.md](ALLIANCE_SYSTEM.md) - Alliance raids and cooperative gameplay
- [EMERGENT_STORY_SYSTEM.md](EMERGENT_STORY_SYSTEM.md) - Expedition events and story generation
