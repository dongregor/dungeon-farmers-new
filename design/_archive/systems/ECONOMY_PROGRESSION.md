# Economy & Progression System - Dungeon Farmers

**Balanced resource economy with multiple progression paths**

---

## 🎯 Core Philosophy

**Multiple Currencies. Fair Acquisition. Strategic Spending.**

No premium currency. All resources earned through gameplay. Multiple progression paths prevent single bottlenecks.

---

## 💰 Currency System

### Gold (Primary Currency)
**Earned From:**
- Expedition completions (10-500+ Gold per run)
- Personal dungeon farming (30-200 Gold per run)
- Daily/weekly quests (100-1,000 Gold)
- Alliance bonuses (+5-15% to all Gold earned)

**Spent On:**
- Hero recruitment (100 / 500 / 1,000 Gold)
- Personal dungeon construction (100-2,500 Gold)
- Equipment crafting (500-10,000 Gold)
- Hero ascension (10,000 Gold)

**Economy Balance:**
- Early game: 50-200 Gold per hour
- Mid game: 500-2,000 Gold per hour
- Late game: 5,000-20,000 Gold per hour

### Alliance Points (Social Currency)
**Earned From:**
- Alliance raid participation (500-2,000 per raid)
- Alliance quest contributions (100-500)
- Weekly alliance challenges (1,000-5,000)

**Spent On:**
- Alliance shop equipment (5,000-20,000 points)
- Rare schematics (10,000-50,000 points)
- Cosmetic items (1,000-10,000 points)

**Not Tradeable:** Alliance Points are personal, not shared.

---

## 💰 Income & Cost Tables

### Gold Income by Content Type

**Phase 1 MVP** - Primary gold sources:

| Content Type | Gold per Run | Frequency | Gold per Hour (Casual Play) |
|--------------|--------------|-----------|----------------------------|
| Zone 1-5 (Easy) | 20-50 | 5-15 min | 80-200 gold/hr |
| Zone 6-10 (Normal) | 50-100 | 15-30 min | 100-300 gold/hr |
| Zone 11-15 (Hard) | 80-150 | 30-60 min | 100-250 gold/hr |
| Zone 16-20 (Very Hard) | 120-200 | 45-90 min | 120-250 gold/hr |
| Story Missions | 100-500 | One-time | Variable (one-time rewards) |
| Equipment Dungeons | 50-200 | 15-180 min | 150-400 gold/hr (daily cap: 3 runs) |
| Material Dungeons | 30-150 | 10-90 min | 100-300 gold/hr (weekly cap: 10 runs) |

**Phase 2** (Personal Dungeons):

| Content Type | Gold per Run | Frequency | Gold per Hour |
|--------------|--------------|-----------|---------------|
| Personal Dungeons (Common) | 40-80 | 10-20 durability | 150-300 gold/hr (durability-limited) |
| Personal Dungeons (Rare) | 100-180 | 10-20 durability | 300-500 gold/hr |
| Personal Dungeons (Mythic) | 250-400 | 10-20 durability | 600-1000 gold/hr |

**Phase 3** (Alliance Content):

| Content Type | Gold per Run | Frequency | Gold per Hour |
|--------------|--------------|-----------|---------------|
| Alliance Raids (Normal) | 200-500 | 30-180 min | 300-600 gold/hr |
| Alliance Raids (Heroic) | 500-1000 | 120-360 min | 400-800 gold/hr |

**Daily/Weekly Income Summary** (casual player, 1-2 hours/day):
- **Daily Gold Estimate**: 200-500 gold/hour × 1-2 hours = **200-1,000 gold/day**
- **Weekly Gold Estimate**: 200-1,000 gold/day × 5-7 days = **1,000-7,000 gold/week**

### Gold Cost Tables

**Phase 1 MVP** - Primary gold sinks:

| Purchase Type | Gold Cost | Frequency | Notes |
|---------------|-----------|-----------|-------|
| Hero Recruitment (Common traits) | 80-120 | As needed | Base hero with 3-4 common traits |
| Hero Recruitment (Rare traits) | 150-200 | As needed | Hero with 1-2 rare traits |
| Trait Reroll (Single Trait) | 50 | Optional | Reroll ONE specific trait (not all) |
| Equipment Upgrades (Common → Uncommon) | 500 | Per item | See EQUIPMENT_SYSTEM.md for full table |
| Equipment Upgrades (Uncommon → Rare) | 2,000 | Per item | Phase 1 MVP |
| Equipment Upgrades (Rare → Epic) | 8,000 | Per item | Phase 1 MVP |
| Personal Dungeon Slot Unlock | 5,000-20,000 | One-time | Phase 2, scales with slot count |

**Phase 2+** (Advanced Content):

| Purchase Type | Gold Cost | Frequency | Notes |
|---------------|-----------|-----------|-------|
| Equipment Upgrades (Epic → Legendary) | 25,000 | Per item | Phase 2+ |
| Equipment Upgrades (Legendary → Mythic) | 75,000 | Per item | Phase 2+ |
| Alliance Creation | 10,000 | One-time | Phase 3 |
| Cosmetic Skins | 2,000-5,000 | Optional | Phase 4+ (cosmetic DLC) |

**Gold Sink Balance Philosophy**:
- **Hero recruitment**: ~2-3 hours of play per hero at recommended pace (160-600 gold)
- **Equipment progression**: ~5-10 hours per rarity tier (Common → Epic)
- **No artificial time gates**: Play more = progress faster
- **Prevent gold hoarding**: Meaningful gold sinks at all progression stages

### Experience (XP) Curves

**Phase 1 MVP** - Hero leveling system:

#### XP Required per Level

| Level Range | XP Formula | Example (Level 10 → 11) | Total XP to Max |
|-------------|------------|-------------------------|-----------------|
| 1-10 | 100 × level | 100 × 10 = 1,000 XP | 5,500 XP |
| 11-25 | 100 × 1.15^(level-10) | 100 × 1.15^1 = 115 XP | ~15,000 XP (cumulative from Level 1) |
| 26-40 | Formula × 1.10^(level-25) | Slowed exponential growth | ~50,000 XP (cumulative) |
| 41-50 | Formula × 1.08^(level-40) | Endgame plateau | ~120,000 XP (cumulative to Level 50) |

**Concrete Level Requirements**:

| Level | XP Required | Cumulative XP | Zones Required (avg 150 XP/run) |
|-------|-------------|---------------|--------------------------------|
| 1 → 5 | 100 each | 500 | ~3 zones |
| 5 → 10 | 500-1,000 | 3,500 | ~23 zones |
| 10 → 15 | 1,150-1,850 | 11,000 | ~73 zones |
| 15 → 20 | 1,850-3,000 | 23,000 | ~153 zones |
| 20 → 30 | 3,000-7,000 | 60,000 | ~400 zones |
| 30 → 40 | 7,000-15,000 | 110,000 | ~733 zones |
| 40 → 50 | 15,000-25,000 | 200,000 | ~1,333 zones |

**Design Philosophy**:
- **Linear early game** (Levels 1-10): Fast progression to hook players
- **Exponential mid-game** (Levels 10-25): Meaningful progression pace
- **Slowed late game** (Levels 25-40): Sustained engagement
- **Endgame plateau** (Levels 40-50): Achievement-focused, not grind-focused

#### XP Income by Content Type

| Content Type | XP per Run | Duration | XP per Hour |
|--------------|------------|----------|-------------|
| Zone 1-5 | 50-100 | 5-15 min | 200-600 XP/hr |
| Zone 6-10 | 100-200 | 15-30 min | 300-800 XP/hr |
| Zone 11-15 | 150-300 | 30-60 min | 300-600 XP/hr |
| Zone 16-20 | 250-500 | 45-90 min | 400-800 XP/hr |
| Story Missions | 300-1,000 | 10-120 min | Variable (one-time rewards) |
| Dungeons | 200-500 | 15-180 min | 400-1,000 XP/hr (daily cap) |

**Example Progression Pace** (casual player, 1-2 hours/day):
- **Week 1**: Level 1 → 10 (~5,500 XP, ~37 zone runs, ~7-10 hours)
- **Week 2-3**: Level 10 → 20 (~17,500 XP, ~117 zone runs, ~20-30 hours)
- **Week 4-8**: Level 20 → 30 (~37,000 XP, ~247 zone runs, ~40-60 hours)
- **Week 9-16**: Level 30 → 40 (~50,000 XP, ~333 zone runs, ~60-100 hours)
- **Week 17-30**: Level 40 → 50 (~90,000 XP, ~600 zone runs, ~100-180 hours)

**Total Time to Max Level**: ~200-300 hours (3-6 months at 1-2 hours/day)

### Material Income & Cost Balance

**Phase 1 MVP** - Crafting material system:

#### Material Drop Rates by Content Type

| Material Rarity | Zone Drops | Dungeon Drops | Mission Rewards | Personal Dungeon Drops |
|-----------------|------------|---------------|-----------------|------------------------|
| Common (80% rate) | 3-8 per run | 10-20 per run | 15-30 per mission | 5-15 per run |
| Uncommon (50% rate) | 1-3 per run | 5-10 per run | 8-15 per mission | 3-8 per run |
| Rare (30% rate) | 0-2 per run | 3-6 per run | 5-10 per mission | 2-5 per run |
| Epic (10% rate) | 0-1 per run | 1-3 per run | 2-5 per mission | 1-3 per run |
| Mythic (2% rate) | 0 per run | 0-1 per run | 1-2 per mission | 0-1 per run |

**Efficiency Scaling**: All material drops scale with expedition efficiency (60-150% variance).

**Example** (Zone 10 at 120% efficiency):
- Common: 5 base × 1.20 = **6 materials**
- Rare: 1 base × 1.20 = **1.2** → ~1-2 materials (RNG)

#### Material Cost for Equipment Upgrades

See [EQUIPMENT_SYSTEM.md](EQUIPMENT_SYSTEM.md#level-requirements--upgrade-paths) for complete upgrade cost table.

**Summary**:
- **Common → Uncommon**: 20 Common materials + 500 gold
- **Uncommon → Rare**: 50 Common + 10 Rare + 2,000 gold
- **Rare → Epic**: 100 Common + 30 Rare + 5 Epic + 8,000 gold
- **Epic → Legendary**: 200 Common + 75 Rare + 20 Epic + 3 Mythic + 25,000 gold (Phase 2+)
- **Legendary → Mythic**: 400 Common + 150 Rare + 50 Epic + 10 Mythic + 75,000 gold (Phase 2+)

#### Material Farming Efficiency

**Time Required per Equipment Upgrade** (casual player):

| Upgrade Path | Material Grind Time | Gold Grind Time | Total Time |
|--------------|---------------------|-----------------|------------|
| Common → Uncommon | ~1 hour (20 Common) | ~1 hour (500 gold) | **~2 hours** |
| Uncommon → Rare | ~3 hours (50C + 10R) | ~4 hours (2,000 gold) | **~7 hours** |
| Rare → Epic | ~8 hours (100C + 30R + 5E) | ~16 hours (8,000 gold) | **~24 hours** |
| Epic → Legendary | ~25 hours (200C + 75R + 20E + 3M) | ~50 hours (25,000 gold) | **~75 hours** |
| Legendary → Mythic | ~80 hours (400C + 150R + 50E + 10M) | ~150 hours (75,000 gold) | **~230 hours** |

**Design Philosophy**:
- **Early upgrades (Common → Rare)**: Fast progression (~2-7 hours per item)
- **Mid upgrades (Rare → Epic)**: Meaningful investment (~24 hours per item)
- **Late upgrades (Epic+)**: Long-term goals (~75-230 hours per item, Phase 2+)
- **No pay-to-win**: All materials farmable, no premium shortcuts

### Balance Curves Summary

**Phase 1 MVP** - Economic balance targets:

| Player Activity Level | Gold per Hour | XP per Hour | Daily Progression |
|----------------------|---------------|-------------|------------------|
| Casual (1 hour/day) | 200-500 | 300-600 | 1 hero recruitment every 2-3 days |
| Regular (2 hours/day) | 300-600 | 400-800 | 1 equipment upgrade (Common → Uncommon) every 2 days |
| Dedicated (4+ hours/day) | 400-800 | 600-1,200 | 1 equipment upgrade (Uncommon → Rare) every week |

**Long-Term Progression Milestones**:
- **Week 1**: Level 10, 3-5 heroes, mostly Common equipment
- **Week 2-3**: Level 20, 5-8 heroes, Uncommon → Rare equipment transitions
- **Month 2-3**: Level 30-40, 8-12 heroes, Rare → Epic equipment sets
- **Month 4-6**: Level 40-50, full roster, Epic equipment sets complete
- **Month 6+**: Endgame (Ascension, Legendary gear, Alliance raids, personal dungeon optimization)

**No Artificial Gates**: Players who engage more progress faster proportionally (linear scaling, not exponential burnout).

See [HERO_SYSTEM.md](HERO_SYSTEM.md#stat-formulas--progression) for stat scaling, [EXPEDITION_SYSTEM.md](EXPEDITION_SYSTEM.md#performance--reward-formulas) for reward formulas.

---

## 🪨 Crafting Materials

### Basic Materials (Common)
**Wood, Stone, Iron Ore, Leather**

**Sources:**
- Zone expeditions (guaranteed drops)
- Personal dungeons (targeted farming)
- Daily quests

**Uses:**
- Personal dungeon construction
- Basic equipment crafting
- Building upgrades

### Advanced Materials (Uncommon/Rare)
**Crystals, Shards, Essences, Scales**

**Sources:**
- Hard/Very Hard zones
- Dungeon farming
- Mission rewards

**Uses:**
- Epic equipment crafting
- Personal dungeon upgrades
- Hero ascension

### Legendary Materials (Epic/Legendary)
**Dragon Hearts, Titan Cores, Mythic Crystals**

**Sources:**
- Elite raids (primary source)
- Legendary monster drops
- Weekly alliance challenges

**Uses:**
- Legendary equipment crafting
- Mythic schematic unlocking
- Ultimate upgrades

---

## 📈 Progression Systems

### Player Level (1-50+)
**Experience Sources:**
- Expedition completions
- Hero level-ups
- Quest completions
- Alliance activities

**Level Benefits:**
- Unlock new zones (every 1-2 levels)
- Unlock new features (every 5 levels)
- Increased expedition capacity (every 10 levels)
- Better recruitment pools

### Hero Level (1-50)
**Experience Sources:**
- Participating in expeditions
- Experience items (quest rewards)
- Mentor bonuses from high-level heroes

**Level Benefits:**
- Stat increases (archetype-specific curves)
- Power rating growth
- Equipment slot unlocking (all slots by Level 10)
- Ascension eligibility at Level 50

### Alliance Level (1-25)
**Experience Sources:**
- Member gold contributions (5% of gold earned)
- Alliance raid completions
- Weekly alliance quests

**Level Benefits:**
- Higher passive bonuses (+5-15% Gold, +3-10% XP)
- Access to higher-tier raids
- Better alliance shop inventory
- Increased member capacity (if needed)

---

## 🎯 Progression Pacing

> **For the unified progression timeline with time ranges, player levels, and key unlocks, see the [Progression Timeline](../00-GAME_OVERVIEW.md#-progression-timeline) in 00-GAME_OVERVIEW.md**

### Early Game (Player Level 1-10) - **15 min to 5 hours**
**Focus:** Learning systems, building roster, basic equipment

**Typical Progress:**
- 5-8 heroes recruited
- 3-5 zones completed
- 2-3 personal dungeons built
- 1-2 equipment sets started (2/4 pieces)
- Player Level 7-10

### Mid Game (Player Level 10-25) - **5 to 20 hours**
**Focus:** Equipment sets, alliance participation, monster collection

**Typical Progress:**
- 15-20 heroes recruited
- 10-15 zones completed
- 5-10 schematics collected
- 3-5 equipment sets (4/4 complete)
- Alliance joined, 2-5 raids completed
- Player Level 20-25

### Late Game (Player Level 25-40) - **20 to 50 hours**
**Focus:** Optimization, rare monsters, Epic equipment

**Typical Progress:**
- 25-35 heroes recruited
- All zones unlocked
- 15-25 schematics collected
- 8-12 equipment sets complete
- Active alliance raider
- First hero ascension completed
- Player Level 35-40

### Endgame (Player Level 40-50+) - **50+ hours**
**Focus:** Collection completion, leaderboards, seasonal content

**Ongoing Goals:**
- 100 unique heroes (completionist)
- 150 monster species compendium
- 50 schematic library completion
- Legendary/Mythic equipment optimization
- Leaderboard ranking

---

## 💎 Monetization Integration (Pay-Once Model)

### Free Demo Limitations
- Level cap: 15
- Hero roster cap: 5 heroes
- Zone access: First 3 zones only
- Personal dungeons: **LOCKED** (can view schematics and captured monsters, but cannot build dungeons - see [MONETIZATION.md](../MONETIZATION.md) for details)
- Alliance: Read-only (can't participate in raids)

**Demo Duration:** 10-15 hours of gameplay

**Demo Tutorial Feature**: Players receive enhanced tutorial explaining personal dungeon system after first monster capture (visual preview with upgrade CTA) - see [01-PLAYER_EXPERIENCE.md](../01-PLAYER_EXPERIENCE.md) Phase 1 for details.

### Premium Unlock ($9.99)
**Removes ALL restrictions:**
- ✓ Unlimited leveling (1-50+)
- ✓ Unlimited hero roster
- ✓ All zones unlocked
- ✓ Personal dungeon building enabled
- ✓ Full alliance participation
- ✓ Crafting system unlocked

**No additional purchases required for progression.**

### Optional Cosmetic DLC ($2.99-$4.99)
- Hero skins (visual only)
- Personal dungeon themes (visual only)
- Guild hall decorations (visual only)
- Chat emotes and titles (social only)

**Never affects power or progression.**

---

## ⚖️ Economy Balance Principles

### No Bottlenecks
- Multiple paths to same resources (zones, dungeons, crafting)
- Never force single activity for progression
- Alternative currencies for flexibility (Gold, Alliance Points, materials)

### Respect Player Time
- Offline progress (expeditions continue while logged out)
- No daily login requirements (encouraged but not mandatory)
- No energy systems (play as much as you want)

### Fair Acquisition
- All progression resources obtainable free
- No premium currency (cosmetics use Gold)
- No pay-for-convenience (auto-complete, speed-ups, etc.)

### Strategic Choices
- Spend Gold on recruitment OR dungeon construction
- Farm materials OR buy from alliance shop
- Prioritize equipment sets OR hero roster expansion
- Meaningful decisions, not forced grinding

---

## 📊 Resource Sinks (Prevent Inflation)

### Gold Sinks
- Hero recruitment (recurring)
- Personal dungeon construction (recurring with durability)
- Equipment crafting (endgame)
- Hero ascension (prestige loop)

### Material Sinks
- Personal dungeon construction (recurring)
- Equipment crafting (endgame)
- Alliance contributions (social engagement)

### Alliance Point Sinks
- Alliance shop purchases (weekly reset)
- Rare schematic unlocking (long-term goals)

**Design Rationale:** Multiple sinks prevent resource hoarding, maintain economic balance, create ongoing goals.

---

## 🎁 Daily/Weekly Systems

### Daily Quests (3-5 per day)
**Examples:**
- Complete 3 expeditions (Reward: 200 Gold, 50 Wood)
- Recruit 1 hero (Reward: 100 Gold, Experience Potion)
- Run 2 personal dungeons (Reward: 300 Gold, Alliance Points)

**Design:** Quick 10-15 minute tasks, not hours of grinding.

### Weekly Quests (5-10 per week)
**Examples:**
- Complete 20 expeditions (Reward: 2,000 Gold, Rare Schematic Box)
- Participate in 2 alliance raids (Reward: 1,500 Alliance Points)
- Capture 5 monsters (Reward: 1,000 Gold, Epic Material Box)

**Design:** Longer-term goals, encourage varied gameplay.

### Weekly Alliance Challenges
**Examples:**
- Alliance-wide: Contribute 100,000 Gold collectively (Reward: +2% Gold bonus for 7 days)
- Raid Challenge: Complete 3 different raids (Reward: 5,000 Alliance Points per member)

**Design:** Cooperative goals, strengthen alliance bonds.

---

## 🏆 Milestone Rewards

### Player Level Milestones
- **Level 10:** Alliance system unlocked, 500 Gold, Rare Hero Ticket
- **Level 20:** Advanced crafting unlocked, 2,000 Gold, Epic Schematic Box
- **Level 30:** Elite zones unlocked, 5,000 Gold, Legendary Material Box
- **Level 40:** Ascension system unlocked, 10,000 Gold, Ascension Stone
- **Level 50:** Max level reached, 20,000 Gold, Mythic Equipment Box

### Collection Milestones
**Hero Roster:**
- 25 heroes: Uncommon Hero Ticket
- 50 heroes: Rare Hero Ticket + 5,000 Gold
- 75 heroes: Epic Hero Ticket + 10,000 Gold
- 100 heroes: Legendary Hero Ticket + "Ultimate Recruiter" title

**Monster Compendium:**
- 25 species: Uncommon Schematic Box
- 50 species: Rare Schematic Box + 5,000 Gold
- 75 species: Epic Schematic Box + "Monster Master" title
- 150 species: Legendary Schematic + exclusive cosmetics

**Schematic Library:**
- 10 schematics: 2,000 Gold
- 25 schematics: Rare Material Box + 5,000 Gold
- 50 schematics: Epic Schematic Box + "Master Builder" title

---

**The Economy & Progression System creates balanced resource acquisition with multiple paths, strategic spending decisions, and long-term collection goals - all without premium currency or pay-to-win mechanics.**

---

## See Also

- [HERO_SYSTEM.md](HERO_SYSTEM.md) - Recruitment costs and hero progression
- [EQUIPMENT_SYSTEM.md](EQUIPMENT_SYSTEM.md) - Crafting costs and equipment progression
- [MONSTER_DUNGEON_SYSTEM.md](MONSTER_DUNGEON_SYSTEM.md) - Dungeon construction costs and material drops
- [ALLIANCE_SYSTEM.md](ALLIANCE_SYSTEM.md) - Alliance Points currency and social rewards
