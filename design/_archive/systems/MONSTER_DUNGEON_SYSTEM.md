# Monster Capture & Personal Dungeon System

**The Unique Differentiator - Self-Sustaining Content Loop**

---

## 🎯 Core Philosophy

**What makes Dungeon Farmers different from every other idle RPG?**

Most idle games suffer from **content starvation** - developers must constantly create new zones, missions, and events or players run out of things to do.

**Dungeon Farmers solves this with the Personal Dungeon System:**

Players capture monsters → collect dungeon schematics → build personal dungeons → farm optimized resources → upgrade heroes → tackle harder content → capture rarer monsters → build better dungeons.

**This creates a self-sustaining content loop where players BUILD their own farming dungeons.**

---

## 👾 Monster Capture System

### Capture Mechanics

#### Automatic Capture (5-15% Chance)
**How it works:**
- During ANY expedition (zones, missions, dungeons), there's a chance to capture monsters
- **No separate capture action** - happens automatically on completion
- Feels like a **lucky bonus** rather than a chore
- Higher difficulty content = higher capture chance

**Capture Rate Table:**
- ★☆☆☆☆ Trivial content: 5% chance
- ★★☆☆☆ Easy content: 7% chance
- ★★★☆☆ Medium content: 10% chance
- ★★★★☆ Hard content: 12% chance
- ★★★★★ Very Hard content: 15% chance

**Player emotion**: "Oh wow, I captured a Stone Goblin! That's a nice bonus!"

#### Guaranteed Mission Rewards
**How it works:**
- Specific story missions **guarantee** specific monsters
- Provides deterministic acquisition path
- No RNG frustration for required monsters
- Encourages story content participation

**Example**:
- Mission: "Goblin Trouble" → Guaranteed Goblin Warrior
- Mission: "Dragon's Awakening" → Guaranteed Dragon Whelp

### Monster Properties

#### Power Level
- Determines combat strength when assigned to personal dungeons
- Scales with monster rarity and player level
- Higher power = more challenging dungeon = better loot quality

**Power Scaling**:
- Common monsters: 10-30 power
- Uncommon monsters: 30-60 power
- Rare monsters: 60-100 power
- Epic monsters: 100-150 power
- Legendary monsters: 150+ power

#### Loot Table (Unique per Monster)
Each monster drops specific resources when farmed in personal dungeons:

**Common Monsters:**
- Stone Goblin → Stone, Stone Shard, Gold
- Forest Wolf → Wood, Wolf Pelt, Gold
- Skeleton Warrior → Bone, Basic Materials

**Uncommon Monsters:**
- Goblin Warrior → Stone Chunk, Iron Ore, Gold (higher quantity)
- Fire Bat → Fire Crystal Shard, Ash, Gold

**Rare Monsters:**
- Ice Golem → Ice Crystal, Frozen Ore, Premium Materials
- Shadow Wraith → Shadow Essence, Dark Crystal, Rare Gold

**Epic Monsters:**
- Dragon Whelp → Dragon Scale, Fire Crystal, Epic Materials, Large Gold
- Ancient Guardian → Ancient Stone, Legendary Shards

**Legendary Monsters:**
- Elder Dragon → Dragon Heart, Mythic Crystals, Massive Gold
- Titan → Titan Core, Ultimate Materials

**Strategic Decision**: Which monsters to assign to dungeons depends on what resources you need.

#### Type Categories (For Schematic Slot Requirements)

**Melee Fighter**: Goblins, Warriors, Knights, Ogres
**Ranged Attacker**: Archers, Mages, Sorcerers
**Flying**: Dragons, Bats, Birds, Wyverns
**Undead**: Skeletons, Zombies, Wraiths, Liches
**Elemental**: Fire/Ice/Lightning/Nature spirits
**Beast**: Wolves, Bears, Trolls, Chimeras
**Boss**: Elite versions of any type (higher power, better loot)

**Example Schematic Requirement**: "2x Melee Fighter, 1x Flying, 1x Boss (optional)"

### Monster Progression

#### Automatic Scaling
- Captured monsters become more powerful over time
- **Automatic progression tied to player level** (no manual leveling needed)
- Recaptured monsters at higher player levels = better power

**Example**:
- Stone Goblin captured at Player Level 5: 15 power
- Stone Goblin captured at Player Level 20: 45 power

**Player strategy**: "I should recapture common monsters later for better dungeon power."

#### Improved Loot Quality
- Higher level monsters assigned to dungeons = better drop rates
- Quality scales with monster power
- Incentive to recapture same types for optimization

### Monster Collection & Storage

#### Monster Compendium
- Track all 150 monster species encountered
- Completion rewards at milestones:
  - **25 species (16%)**: Uncommon Schematic Box
  - **50 species (33%)**: Rare Schematic Box
  - **75 species (50%)**: Epic Schematic Box
  - **100 species (66%)**: Monster Master title
  - **150 species (100%)**: Legendary Schematic + exclusive cosmetics

**Player emotion**: "I'm 78/150 species collected. Getting closer to that Epic Schematic Box!"

#### Storage System
- **Unlimited monster storage** (no inventory pressure)
- Can have **multiple of same type** (e.g., 10 Stone Goblins)
- Use best ones for dungeons, keep duplicates as backups
- **Release extras for resources** (small gold/material refund)

**✅ DECISION: Power-Scaled Release Rewards**

**Final Implementation:**
- Released monsters provide resources scaled to their power level
- Base release reward: 10% of monster's power converted to gold, plus small material refund
- Higher power monsters = better release rewards (incentivizes keeping high-level duplicates)
- **Example**: Power 50 monster releases for 50 gold + materials; Power 100 monster releases for 100 gold + better materials

**Rationale:**
- **Incentivizes progression**: Players rewarded for capturing stronger monsters
- **Strategic choice**: Weigh keeping monster vs releasing for resources
- **Scales with investment**: Higher-level monster captures feel more valuable

---

## 📜 Schematic System

### Schematic Rarity & Complexity

**Common Schematics (60% drop rate):**
- 2-3 rooms, basic layouts
- Simple monster requirements (e.g., "2x Melee Fighter")
- 10 runs durability
- Construction cost: 50 Wood, 30 Stone, 100 Gold

**Uncommon Schematics (25% drop rate):**
- 3-4 rooms, moderate layouts
- Specific type requirements (e.g., "1x Goblin Type, 1x Undead Type")
- 12 runs durability
- Construction cost: 100 Wood, 75 Stone, 250 Gold

**Rare Schematics (10% drop rate):**
- 4-5 rooms, complex layouts
- Boss slot available (optional, better loot)
- Themed layouts (Fire Temple, Ice Cavern, Shadow Sanctum)
- 15 runs durability
- Construction cost: 200 Wood, 150 Stone, 500 Gold

**Epic Schematics (4% drop rate):**
- 6+ rooms, intricate designs
- Multiple boss slots, themed requirements
- Significant loot improvements
- 18 runs durability
- Construction cost: 400 Wood, 300 Stone, 1,000 Gold

**Legendary Schematics (1% drop rate):**
- 8+ rooms, massive layouts
- Elite encounters, multiple bosses
- Endgame farming focus
- 20 runs durability
- Construction cost: 800 Wood, 600 Stone, 2,500 Gold

### Schematic Drop Sources

**Zone Completions:**
- First clear of each zone: Common/Uncommon schematic
- Rare clears (S-rank): Chance for Rare schematic

**Mission Rewards:**
- Story missions: **Guaranteed specific schematics** (themed to mission)
- Example: "Dragon's Lair" mission → Dragon's Hoard schematic

**Alliance Raids:**
- Beginner raids: Uncommon/Rare schematics
- Advanced raids: Rare/Epic schematics
- Elite raids: Epic/Legendary schematics

**Seasonal Events:**
- Event-exclusive schematics (return annually)
- Example: "Autumn Grove" (Epic) - Harvest Event exclusive

**Crafting (Advanced):**
- Combine schematic fragments (rare drops)
- Guaranteed Rare+ schematics with resource investment

### Schematic Slot System (Monster Requirements)

**Flexible Slots:**
- "Any Medium" = Any non-boss monster
- "Any Strong" = Epic/Legendary monsters only
- "Any Type" = No restrictions

**Type-Specific Slots:**
- "2x Goblin Type" = Requires exactly 2 goblin monsters
- "1x Flying Boss" = Requires flying-type boss monster
- "3x Elemental" = Requires 3 elemental-type monsters

**Optional Boss Slots:**
- Can leave empty (lower difficulty, lower rewards)
- Assigning boss monster = higher difficulty + better loot
- Strategic choice based on team power

**Example Schematic - "Goblin Warren" (Uncommon):**
```
Slot 1: Goblin Type (required)
Slot 2: Goblin Type (required)
Slot 3: Boss (optional)

Assigned Monsters:
- Slot 1: Stone Goblin (Power 20)
- Slot 2: Goblin Warrior (Power 35)
- Slot 3: [Empty]

Total Dungeon Power: 55
Combined Loot Table: Stone, Stone Chunk, Iron Ore, Gold
Durability: 12/12 runs
```

---

## 🏰 Personal Dungeon Creation & Mechanics

### Creation Process

#### Step 1: Select Schematic
- Browse collected schematics
- Preview monster slot requirements
- See construction costs and expected rewards
- Choose based on resource farming needs

**UI Preview**:
```
GOBLIN WARREN (Uncommon Schematic)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Complexity: Simple (3 rooms)
Monster Slots: 2x Goblin Type, 1x Boss (optional)
Construction Cost: 100 Wood, 75 Stone, 250 Gold
Durability: 12 runs
Estimated Farm Value: Medium
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[SELECT SCHEMATIC]
```

#### Step 2: Monster Assignment
- Assign captured monsters to each slot
- Higher power monsters = better loot quality
- Optional slots can be left empty (lower difficulty)
- Visual preview of dungeon layout with assigned monsters

**UI Preview**:
```
ASSIGN MONSTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Room 1: Goblin Type
  ☑ Stone Goblin (Power 20) [ASSIGNED]

Room 2: Goblin Type
  ☑ Goblin Warrior (Power 35) [ASSIGNED]

Room 3: Boss (Optional)
  ☐ [Empty] - Can assign later for better rewards

Total Dungeon Power: 55
Combined Loot Table:
  - Stone +12-18
  - Stone Chunk +3-5
  - Iron Ore +2-4
  - Gold +30-50
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CONFIRM BUILD]
```

#### Step 3: Resource Investment & Construction
- **Immediate construction** (no wait time - respects player time)
- Deduct construction costs (Wood, Stone, Gold)
- One-time payment per build
- Dungeon becomes active immediately

#### Step 4: Deployment & Farming
- Dungeon available for farming immediately
- Can run multiple personal dungeons simultaneously (up to 5 active)
- Durability countdown begins with first run

### Personal Dungeon Farming Mechanics

#### Durability System (NOT Time-Limited)
**Core Design Decision**: Dungeons use **durability** (number of runs), NOT time limits.

**Why this matters:**
- Player controls farming pace (respects time principle)
- No "use it or lose it" FOMO pressure
- Can save dungeons for when resources are needed
- Farm 3 times today, 7 times next week - player choice

**Durability Display**:
```
GOBLIN WARREN #3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Durability: 9/12 runs remaining
Power: 55
Duration: 3 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[RUN DUNGEON] [INFO] [DESTROY]
```

**After durability reaches 0/12:**
- Dungeon expires and is removed
- Must rebuild (same schematic) to farm again
- Keeps resource economy balanced

#### Farming Efficiency

**Faster than Zones:**
- Personal dungeons: 3-5 minutes
- Zone expeditions: 10-60 minutes
- **Trade-off**: Dungeons cost resources to build, zones are free

**Targeted Loot (Predictable):**
- Know exactly what resources you'll get
- No RNG frustration for specific material farming
- Example: "I need Stone Chunks for crafting → run Goblin Warren 5 times"

**Optimizable:**
- Better monsters = better drop rates and quantities
- Strategic schematic selection based on needs
- Monster power scaling increases efficiency

**Example Farming Run**:
```
EXPEDITION COMPLETE! (Goblin Warren #3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Duration: 3 minutes 15 seconds
Rank: A (90% efficiency)

Rewards:
  ✓ Stone +15
  ✓ Stone Chunk +4
  ✓ Iron Ore +3
  ✓ Gold +42
  ✓ Experience +60

Durability: 8/12 runs remaining
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[RUN AGAIN] [RETURN TO HALL]
```

#### Multiple Active Dungeons
**Strategic Management:**
- Can have up to **5 active personal dungeons** simultaneously
- Different schematics for different resources
- Rotate based on current crafting needs
- Example setup:
  1. Goblin Warren #3 (8/12) - Stone farming
  2. Dragon's Hoard #1 (15/15) - Dragon Scale farming
  3. Shadow Sanctum #2 (5/15) - Shadow Essence farming
  4. Ice Cavern #1 (18/18) - Ice Crystal farming
  5. [Empty slot]

### Schematic Progression & Unlocking

**Early Game (Player Level 1-10):**
- Common schematics from zone first clears
- Simple monster requirements (any Melee, any Ranged)
- Focus: Learn the system

**Mid Game (Player Level 10-25):**
- Uncommon/Rare schematics from missions and raids
- Specific type requirements (Goblin-type, Undead-type)
- Focus: Targeted resource farming

**Late Game (Player Level 25-40):**
- Rare/Epic schematics from alliance raids and events
- Complex requirements (multiple bosses, rare types)
- Focus: Efficient endgame material farming

**Endgame (Player Level 40+):**
- Epic/Legendary schematics from elite content
- Requires multiple rare/epic monsters
- Focus: Legendary material acquisition for crafting

---

## 🔄 Self-Sustaining Content Loop

**The Magic Formula:**

```
EXPLORATION (Zones/Missions)
        ↓
   MONSTER CAPTURE (5-15% chance)
        ↓
  SCHEMATIC COLLECTION (drops from content)
        ↓
PERSONAL DUNGEON CREATION ← ★ UNIQUE DIFFERENTIATOR
        ↓
  TARGETED FARMING (fast 3-5 min loops)
        ↓
  RESOURCE ACQUISITION (predictable loot)
        ↓
   HERO UPGRADES (equipment, levels, ascension)
        ↓
HARDER CONTENT ACCESS (zones, missions, raids)
        ↓
  ALLIANCE RAIDS (cooperative 3-5 players)
        ↓
RARE MONSTERS & SCHEMATICS (Dragon Whelp, Epic blueprints)
        ↓
   (Loop continues at higher tier with better dungeons)
```

### Why This Solves Content Starvation

**Traditional Idle RPG Problem:**
- Developer creates 20 zones
- Players complete all 20 zones in 2 weeks
- Players have "nothing to do" until next update
- Developer scrambles to create more zones (expensive, time-consuming)

**Dungeon Farmers Solution:**
- Developer creates 20 zones + 50 dungeon schematics
- Players complete zones AND capture 150 monster types
- Players BUILD their own farming dungeons (player-generated content)
- Thousands of possible dungeon combinations (schematic × monsters)
- Players create their OWN optimization challenges
- Developer can focus on quality updates, not quantity treadmill

**Player Engagement:**
- Early game: "I'm capturing monsters and unlocking schematics!"
- Mid game: "I need to build a better dungeon to farm Dragon Scales efficiently."
- Late game: "I'm optimizing my dungeon portfolio with perfect monster assignments."
- Endgame: "I'm completing my monster compendium and schematic library for 100% completion."

---

## 🎨 Design Principles Applied

### Player Agency & Creativity
- Players **BUILD** their own content (personal dungeons)
- Strategic choices matter (which monsters to assign, which schematics to prioritize)
- Creative optimization gameplay (maximize loot per durability)

### No FOMO or Time Pressure
- **Durability-based**, NOT time-limited
- Farm at your own pace
- Dungeons don't expire after 24 hours
- No "use it or lose it" mechanics

### Fair Monetization Compatible
- All schematics obtainable through gameplay
- Monster captures are free (no premium summons)
- Cosmetic-only dungeon themes possible (future)

### Respect Player Time
- Fast farming loops (3-5 minutes vs 10-60 minute zones)
- Predictable targeted loot (no endless RNG grinding)
- Strategic resource management (build dungeons when needed)

### Long-Term Engagement
- 150 monster species to collect (compendium completion)
- 50 dungeon schematics to discover (schematic library)
- Endless optimization possibilities (perfect monster assignments)
- Seasonal exclusive schematics (return annually - no permanent FOMO)

---

## ❓ Open Design Questions

### Monster Reuse Mechanics
**✅ DECISION: Reassignment with Cooldown (24-hour)**

**Final Implementation:**
- Monsters can be assigned to ONE dungeon at a time
- **Reassignment allowed** with 24-hour cooldown after removal
- Cooldown prevents instant min-maxing while maintaining flexibility
- Players can "fire" monsters from dungeons and reassign later (with cooldown)

**Rationale:**
- **Balances engagement**: Still incentivizes monster capture (need variety for multiple dungeons)
- **Respects player agency**: Allows optimization without permanent lock-in
- **Strategic depth**: Cooldown creates meaningful decision (when to reassign vs build new)
- **Reduces frustration**: Flexibility prevents feeling trapped in suboptimal dungeon assignments

**Implementation Details:**
- Removing monster from dungeon starts 24-hour cooldown timer
- During cooldown, monster cannot be reassigned (shown with visual indicator)
- After cooldown expires, monster available for reassignment
- Cooldown is per-monster (not global), allowing staggered reassignment
- Visual UI shows cooldown time remaining on each monster

**Previous Options Considered:**
1. ~~**Permanent Assignment**~~ - Too punishing, reduces player agency
2. ✅ **Reassignment with Cooldown** - Best balance (SELECTED)
3. ~~**Unlimited Reassignment**~~ - May reduce monster capture engagement

### Schematic Rarity Distribution (Exact Drop Rates)
**✅ DECISION: Difficulty-Based Drop Rates with Content Type Modifiers**

**Final Distribution by Content Type:**

**Zone Expeditions:**
- **First Clear**: Common (50%), Uncommon (30%), Rare (15%), Epic (4%), Legendary (1%)
- **Repeat Clears**: Common (70%), Uncommon (25%), Rare (4%), Epic (1%), Legendary (0%)
- **Difficulty Modifier**: Hard/Very Hard zones shift distribution +5% toward higher rarities
  - Example: Very Hard first clear = Common (45%), Uncommon (30%), Rare (18%), Epic (5%), Legendary (2%)

**Story Missions:**
- **Guaranteed Schematic**: Specific schematic themed to mission (varies by mission)
- **Bonus Chance**: Common (50%), Uncommon (30%), Rare (15%), Epic (4%), Legendary (1%)
- All missions guarantee at least one schematic (their themed one)

**Dungeon Farming:**
- **Base Distribution**: Common (60%), Uncommon (25%), Rare (10%), Epic (4%), Legendary (1%)
- **Set Bonus Modifier**: Completing equipment sets increases rare+ drop chance (+5% per set piece)

**Alliance Raids:**
- **Beginner Raids**: Uncommon (40%), Rare (40%), Epic (18%), Legendary (2%)
- **Intermediate Raids**: Rare (35%), Epic (40%), Legendary (23%), Mythic (2%)
- **Advanced Raids**: Epic (30%), Legendary (45%), Mythic (25%)
- **Elite Raids**: Legendary (50%), Mythic (50%)

**Seasonal Events:**
- **Event Zones**: Event-specific schematic (100% drop on first clear)
- **Bonus Drop**: Rare (50%), Epic (35%), Legendary (12%), Mythic (3%)

**Rationale:**
- **First-time clears reward exploration**: Better drops encourage trying new content
- **Difficulty scaling**: Harder content = better rewards (maintains progression incentive)
- **Raid exclusivity**: Raids provide best schematic drops (encourages social play)
- **Mission guarantee**: Story content provides deterministic rewards (no RNG frustration)

---

**The Monster Capture & Personal Dungeon System transforms Dungeon Farmers from "another idle RPG" into a unique experience where players BUILD their own farming dungeons, solving content starvation while giving creative strategic depth.**

---

## 🎲 Phase 4: Procedural Monster & Dungeon Content

*Note: Post-launch content expansion for increased variety and replayability.*

### Procedural Monster Generation

#### Subtype System
Each captured monster has a chance to roll a **subtype variant** with unique properties:

**Prefix Modifiers** (20% chance on capture):
- **Volcanic**: Fire resistance +30%, drops Fire Crystals, red glow effect
- **Caffeinated**: +15% SPD, jittery animation, drops Energy Potions
- **Ancient**: +20% HP/DEF, slower, drops Rare materials (+10% quality)
- **Shadow**: +20% Evasion, dark aura, bonus night expedition performance
- **Crystalline**: +25% DEF, -10% SPD, chance to drop Enchanting Stones

**Element Variants** (15% chance):
- Frost, Flame, Storm, Nature, Arcane
- Modifies resistances (+30% to element, -15% to opposite)
- Visual particle effects (ice crystals, flames, lightning, vines, runes)

**Example**: "Volcanic Goblin Shaman" = Goblin Shaman + Volcanic prefix
- Fire resistance +30%, drops Fire Crystals, glowing red skin

#### Mythic Variants

**Spawn Rate**: 1-5% chance during monster capture (scales with expedition difficulty)
**Visual Indicators**: Unique glow, particle effects, name color (gold)
**Power Scaling**: +50% base stats compared to normal variant
**Drop Quality**: +100% (guaranteed Rare+ materials)

**Collectible System**:
- Mythic monsters tracked separately in Compendium
- Achievements for collecting all Mythic variants of a species
- Prestige bonus: +1% global capture rate per 10 Mythic monsters collected

**Examples**:
- **Mythic Volcanic Goblin**: Lava dripping animation, fire trail, guaranteed Epic Fire Crystal drop
- **Mythic Shadow Drake**: Smoky transparency effect, shadow clone animation, Legendary Shadow Essence drop

### Dungeon Layout Variations

**Current**: Each schematic has fixed slot configuration
**Phase 4**: Schematics generate **layout variations** each time they're built

**Variation Types**:
- **Monster Slot Flexibility**: "3x Melee + 2x Caster" could become "4x Melee + 1x Caster" (same power budget)
- **Room Effects**: Random environmental hazards/buffs
  - Lava Pools: -10% hero HP, +15% Fire monster power
  - Ancient Runes: +10% XP gain, +magic material drops
  - Fungal Overgrowth: -5% SPD, +Nature monster power, +herb drops

**Dungeon Condition Reroll**:
- Cost: 50-200 Gold (scales with schematic rarity)
- Effect: Regenerate layout variation (monster slots + room effects)
- Limitation: Can only reroll BEFORE assigning monsters

### Monster Evolution System

**Mechanic**: Monsters gain power through repeated assignments to dungeons
**Trigger**: Every 10 successful dungeon runs with same monster
**Effect**: +5% power scaling (max +25% at 50 runs)
**Visual**: Monster model becomes slightly larger, more detailed, glowing eyes

**Evolution Milestones**:
- **10 runs**: Veteran (+5% power, bronze star badge)
- **25 runs**: Elite (+15% power, silver star badge, +10% drop quality)
- **50 runs**: Legendary (+25% power, gold star badge, +25% drop quality, unique title)

**Trade-off**: Evolved monsters have +50% construction cost for future dungeons

### Dungeon Synergy Bonuses

**Monster Family Matching**:
- **All Same Family** (e.g., all Beasts): +15% dungeon power, +10% specific material drops
- **Elemental Harmony** (all same element): +20% elemental resistance, themed visual effects
- **Chaos Mix** (5+ different families): +10% RNG variance (50-170% efficiency instead of 60-150%)

**Example Families**:
- Beast (Wolves, Bears, Griffons)
- Undead (Skeletons, Zombies, Ghosts)
- Elemental (Fire Sprite, Water Elemental, Earth Golem)
- Humanoid (Goblins, Orcs, Bandits)
- Dragon (Drakes, Wyrms, True Dragons)

### Environmental Modifiers

**Dynamic Dungeon Conditions** (rolled when dungeon is built):
- **Temperature**: Frozen (-10% Fire monster power, +10% Ice), Scorching (reverse)
- **Weather**: Stormy (+15% Lightning monsters, -5% hero accuracy), Foggy (+10% Stealth monsters)
- **Lighting**: Dim (+10% Shadow monsters, -5% hero awareness), Radiant (reverse)
- **Morale**: High (+10% all monster power, themed story events), Low (-10% power, faster durability loss)

**Reroll Cost**: 100-300 Gold depending on schematic rarity

---

## See Also

- [EXPEDITION_SYSTEM.md](EXPEDITION_SYSTEM.md) - Monster capture during expeditions and schematic drop sources
- [ECONOMY_PROGRESSION.md](ECONOMY_PROGRESSION.md) - Construction costs, materials, and resource management
- [ALLIANCE_SYSTEM.md](ALLIANCE_SYSTEM.md) - Alliance shop schematics and shared dungeon library concept
