# Dungeon Farmers - Game Design v2

**Date:** 2025-12-13
**Status:** Revised from ground-up brainstorm
**Previous:** Replaces fragmented legacy documentation

---

## Vision & Hook

**Dungeon Farmers** is a browser-based idle RPG where players manage a guild of quirky, randomly-generated heroes. Send them on expeditions, capture monsters, and build your own farmable dungeons.

**The Hook:**
You don't just grind dungeons someone else made. You capture monsters during expeditions, collect dungeon schematics, and build personal dungeons stocked with your captured monsters. Each monster has a loot table - build the dungeon you need to farm the gear you want.

**Three Core Pillars:**
1. **Quirky Heroes** - Randomly generated adventurers with traits that affect gameplay and flavor stories
2. **Player-Built Dungeons** - Capture monsters, collect schematics, build optimized farming content
3. **Emergent Stories** - Expedition logs with trait-flavored reactions make the world feel alive

**Tone:**
Lighthearted fantasy parody. Loving mockery of RPG/MMO/gacha tropes, grounded in a world that takes itself seriously while silly things happen naturally. Heroes have personality through their traits. No fourth-wall breaking, no corporate satire.

**Target Audience:**
Players who enjoy idle games but want more depth. Completionists. People tired of predatory gacha who want fair progression.

**Platform:** Web-first (browser-based), expandable to PWA/mobile later.

---

## Heroes

### Generation
Heroes are randomly generated with names, appearances (Phase 2+), and traits. Every hero is unique. No gacha - recruit with gold currency.

### Rarity Tiers
Common, Uncommon, Rare, Epic, Legendary. Rarity affects starting traits and max trait potential.

### Traits
Heroes have 1-4 starting traits based on rarity. Gain more through leveling milestones and prestige.

| Rarity | Starting Traits | Max Traits |
|--------|-----------------|------------|
| Common | 1-2 | 3 |
| Uncommon | 2 | 4 |
| Rare | 2-3 | 5 |
| Epic | 3 | 6 |
| Legendary | 3-4 | 7 |

### Trait Types
- **Flat bonuses** - Always active ("Brawny: +10% ATK")
- **Conditional** - Context-dependent ("Pyromaniac: +25% in fire zones")
- **Tags** - Match content requirements, enable bonuses ("Stealth", "Fire Magic")

Traits drive both gameplay (success calculations) and stories (flavor reactions in expedition logs).

### Progression
- Level up through XP from expeditions
- Equip gear (6 slots, set bonuses)
- Prestige at max level - reset to level 1 with permanent stat bonuses

### Recruitment
- Costs gold (earned through play)
- Daily cap for free players, unlimited for supporters
- Premium currency can refresh recruitment options or reroll traits

---

## Expeditions & Content

### Active Expeditions
Timed missions where heroes are busy until complete. Three types:

| Type | Duration | Team Size | Purpose |
|------|----------|-----------|---------|
| **Zone Exploration** | 15 min - 2 hrs | Flexible (2-4) | Grind resources, capture monsters, random events |
| **Story Missions** | 30 min - 1 hr | Fixed | Narrative progression, guaranteed rewards, unlock content |
| **Dungeons** | 2-6 hrs | Specific slots + tags | Targeted gear farming, set pieces |

### Passive Assignments
Heroes can be stationed in unlocked zones for idle income:
- Zone-specific resources (forest = wood, mines = ore)
- Slow trickle of gold, XP, materials
- Small chance at rare finds
- Returns scale with zone familiarity

Heroes can be pulled from passive duty for active expeditions (pauses passive income).

### Procedural Events
Expeditions generate events that make each run feel different:
- **Flavor events** (common) - Small choices, texture
- **Dynamic objectives** (occasional) - Bonus goals with rewards
- **Mini-stories** (rare) - Multi-step encounters

Common events use pre-written templates. Rare/special moments use AI generation for unique text.

### Success Calculation
- No failure states - expeditions always complete
- Efficiency ranges 60-150% based on team power vs content difficulty
- Better efficiency = better rewards

---

## Dungeon Building

### The Loop
1. Capture monsters during expeditions (chance-based)
2. Collect dungeon schematics (drops from content)
3. Build personal dungeons by placing monsters in schematic slots
4. Farm your dungeons for targeted loot (monsters have loot tables)

### Unlock
Gradual introduction:
- Tutorial (30-60 min): First capture, first schematic, first tiny dungeon
- Early game: Simple schematics, learning the system
- Mid/late game: Complex schematics, synergy optimization

### Schematics
Blueprints that define:
- Monster slot requirements (e.g., "2 beasts + 1 elemental")
- Dungeon layout/theme
- Base reward types

Schematics have rarity tiers - rarer = more slots, better rewards, complex synergies.

### Optimization Layers
1. **Basic matching** - Fill required slots (tutorial teaches this)
2. **Monster power** - Stronger monsters = better loot output
3. **Synergies** - Certain combinations give bonuses (same family, complementary types)

### Synergy Discovery
- Basic synergies shown in UI before placing
- Rare/powerful synergies discoverable through experimentation

### Monster Loot Tables
Each monster type drops specific loot. Build dungeons with monsters that drop what you need. "I need fire resist gear, so I'll stock my dungeon with fire elementals."

---

## Equipment

### Slots
6 equipment slots per hero: Weapon, Armor, Helmet, Boots, Accessory 1, Accessory 2

### Rarity Tiers
Common, Uncommon, Rare, Epic, Legendary, Mythic

Higher rarity = better base stats, more potential.

### Set Bonuses
Wearing multiple pieces from the same set grants bonuses:
- 2-piece: Minor stat bonus
- 4-piece: Larger bonus + special effect
- 6-piece: Build-defining power

### Gear Score
Single number representing equipment power. Part of total hero power calculation.

### How Gear Affects Success
1. **Contributes to power** - Gear score added to hero's total power
2. **Set bonuses affect rewards** - Certain sets give % bonuses to specific reward types
3. **Content gating** - Some dungeons require minimum gear score to attempt

### Acquisition
- Drops from expeditions and dungeons
- Targeted farming via player-built dungeons (monster loot tables)
- No equipment gacha - farm what you need

### Infinite Scaling
Gear has item levels that scale infinitely. Harder content drops higher item level gear. Same base types, higher numbers.

---

## Scaling & Progression

### Three Scaling Systems

**1. Power Scaling**
- Hero levels increase stats
- Gear improves with item level
- Monster power scales with content difficulty
- Numbers always have room to grow

**2. Rarity Tiers**
- Same base types exist at higher rarities
- Common Slime, Rare Slime, Epic Slime, Legendary Slime
- Higher rarity = better stats, better loot tables
- Harder content drops rarer versions

**3. Prestige (Per-Hero)**
- Heroes prestige individually at max level
- Reset to level 1 with permanent stat bonuses
- Keep: All monsters (separate collection), schematics, premium currency
- Lose: That hero's level, equipped gear returns to inventory

### Monster Collection
Monsters are account-wide, not hero-specific. Captured once, owned forever. Used in dungeon building regardless of which hero caught them.

### Success Formula

```
Hero Power = Base Stats + Level + Gear Score + Flat Trait Bonuses
Effective Power = Hero Power x Conditional Trait Multipliers
Team Power = Combined Effective Powers
Tag Bonus = Multiplier if team has required tags

Efficiency (60-150%) = Team Power vs Content Requirement
Final Rewards = Base Rewards x Efficiency x Set Bonuses x Tag Bonus
```

### Content Progression
- Zones unlock as team power grows
- Story missions gate behind power/completion
- Dungeons require gear score thresholds
- Always something harder to chase

---

## Emergent Stories

### Purpose
Make the world feel alive. Heroes aren't silent workers - they react, comment, and create memorable moments.

### Core Components

**1. Expedition Logs**
Every expedition generates a narrative log of what happened:
- What enemies were fought
- What loot was found
- What events occurred
- How long the journey took

**2. Trait-Flavored Reactions**
Heroes comment on events based on their traits:
- "Loot Goblin was thrilled by the gold drop"
- "Pyromaniac complained about the lack of fire in this cave"
- "Coward hid during the boss fight but found a secret chest"

Traits aren't just numbers - they're personality hooks for story generation.

**3. Procedural Events**
Generated content during expeditions:
- **Flavor events** (common) - Template-based, variable-filled
- **Dynamic objectives** (occasional) - Bonus goals
- **Mini-stories** (rare) - AI-generated unique encounters

### Implementation
- Common events: Pre-written templates with variables
- Rare/special moments: AI-generated for unique flavor
- Hybrid approach balances control with variety

### Phase 2+ Expansion
- Hero relationships (rivalries, friendships)
- Personality dimensions beyond traits
- More complex multi-expedition story arcs

---

## Monetization

### Model
Free-to-Play + Supporter Pack

### Philosophy
Supporters progress faster, not further. Free players get the complete game.

### Free Experience
- Full game access - all content, all systems
- Unlimited progression (prestige, scaling, endgame)
- Daily hero recruitment cap (e.g., 5/day)
- Generous hero slots (50?)
- Enough dungeon slots to engage with system (5?)
- Slow premium currency earning through play

### Supporter Pack ($15-20)
- Bulk premium currency + ongoing daily income
- Unlimited hero recruitment (still costs gold)
- More hero slots (100+)
- More active dungeon slots (10)
- Exclusive cosmetics (skins, UI themes, badge)
- Trait reroll tokens

### Premium Currency Uses
- Refresh hero recruitment options
- Trait reroll tokens
- Expedition speed-ups (skip waiting)
- Extra slots (heroes, dungeons)
- Cosmetics

### NOT For Sale
- Direct power (stats, gear)
- Loot boosters
- Exclusive heroes or content
- Anything that gates progression

### Ethical Guidelines
- No energy systems
- No FOMO mechanics
- No pay-to-win
- Supporters get convenience, not advantage

---

## Social Features (Phase 2+)

Deferred to post-MVP. Single-player experience must be complete first.

### Planned Features

**Cooperative:**
- Raids (6-12 hour group expeditions)
- Shared dungeon runs
- Alliance resource pools

**Competitive:**
- Leaderboards (power, collection, dungeon efficiency)
- Rankings (seasonal?)
- PvP arenas (asynchronous)

**Community:**
- Alliances/guilds
- Chat (text-based)
- Build sharing (dungeon setups, team comps)
- Story sharing (memorable expedition logs)

### Why Deferred
- Core loop must be fun solo first
- Social adds complexity and server costs
- Can validate game before investing in multiplayer
- Solo players should never feel punished

---

## Development Phases

### Phase 1: MVP Core Loop
- Hero generation (traits, rarity, recruitment)
- Basic expeditions (zones only)
- Equipment system (drops, slots, gear score)
- Simple progression (leveling, basic scaling)
- Expedition logs with trait reactions
- Core UI (hero roster, expedition select, inventory)

### Phase 2: The Differentiator
- Monster capture system
- Schematic collection
- Dungeon building (slots, placement, basic synergies)
- Dungeon farming loop
- Passive zone assignments
- Story missions

### Phase 3: Depth & Polish
- Synergy system (discoverable bonuses)
- Prestige system (per-hero)
- Procedural events (template-based)
- Set bonuses (2/4/6 piece)
- Rarity tier scaling (monsters, gear)
- Premium currency + supporter pack

### Phase 4: Content & AI
- AI-generated rare events
- More zones, dungeons, schematics
- More monster types
- Expanded trait catalog
- Balance tuning

### Phase 5: Social (Post-Launch)
- Alliances
- Raids
- Leaderboards
- Chat
- Build sharing

### Guiding Principle
Each phase should result in a playable, fun game. Phase 1 is a simple idle RPG. Each phase adds the next layer without breaking what works.

---

## What's Cut (From Legacy Docs)

The following systems from previous documentation are **removed or deferred indefinitely**:

- **Corporate satire tone** - Replaced with fantasy parody
- **Personality dimensions (5-axis system)** - Traits are enough for MVP
- **Morale/happiness system** - Overcomplicated; cut entirely
- **Complex alliance raids (30 members)** - Simplified to small group co-op
- **Detailed content catalogs** - Will be created as content is built, not upfront
- **Energy systems** - Never
- **VIP tiers** - Never
- **Gacha mechanics** - Never

---

## Open Questions (To Resolve During Implementation)

1. Exact trait balance (percentages, conditions)
2. Zone familiarity scaling formula
3. Monster capture rate by content/rarity
4. Schematic drop rates
5. Prestige bonus amounts
6. Premium currency earning rate (free vs supporter)
7. Supporter pack pricing tiers
8. AI generation scope and costs

---

## Success Metrics

**Player-Centric (Primary):**
- Retention (Day 7, Day 30)
- Session length and frequency
- Progression through content
- Player satisfaction (reviews, feedback)

**Business (Secondary):**
- Supporter conversion rate
- Revenue per user
- Cost per acquisition

**NOT Chasing:**
- Whale spending
- Addictive engagement metrics
- Viral growth at expense of quality
