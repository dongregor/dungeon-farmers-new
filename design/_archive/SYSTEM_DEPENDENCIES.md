# System Dependencies Matrix - Dungeon Farmers

**Last Updated**: 2025-11-04
**Purpose**: Map all system interdependencies for implementation planning and integration validation

---

## 📊 Overview

This document maps dependencies between all major game systems to:
- **Guide implementation order** (Phase 1 MVP → Phase 2+ features)
- **Identify integration points** for development
- **Validate design completeness** (no orphaned systems)
- **Support technical planning** (database schema, API design)

---

## 🔗 Dependency Types

**Hard Dependency** (🔴): System A CANNOT function without System B
**Soft Dependency** (🟡): System A enhanced by System B, but functional alone
**Data Exchange** (🔵): Systems share data but operate independently
**Phase Dependency** (⏳): System B required for Phase 2+ features of System A

---

## 📋 System Dependency Matrix

### Hero System

**Depends On:**
- 🔴 **Equipment System** - Heroes need equipment slots and stat calculations
- 🔴 **Economy System** - Recruitment costs gold, leveling requires resources
- 🟡 **Expedition System** - Source of XP and progression (heroes can exist without expeditions)
- ⏳ **Alliance System** (Phase 2+) - Alliance raids provide ascension materials
- ⏳ **Emergent Story System** (Phase 2+) - Personality/morale drive narrative events

**Provides To:**
- 🔴 **Expedition System** - Heroes are required to run expeditions
- 🔴 **Monster/Dungeon System** - Heroes capture monsters and run personal dungeons
- 🔴 **Alliance System** - Heroes participate in alliance raids
- 🔵 **Equipment System** - Heroes wear equipment and gain set bonuses
- 🔵 **Emergent Story System** - Hero traits, personality, morale generate events

**Key Integration Points:**
- Hero stats + Equipment stats = Final power calculation
- Hero traits + Morale state → Event probability modifiers
- Hero tags → Expedition requirements
- Hero level + Ascension → Content access gates

---

### Monster Capture & Personal Dungeon System

**Depends On:**
- 🔴 **Hero System** - Heroes capture monsters during expeditions
- 🔴 **Expedition System** - Monsters captured from zones/missions/dungeons
- 🔴 **Economy System** - Personal dungeons generate resources (gold, materials)
- 🟡 **Equipment System** - Dungeon rewards include equipment
- ⏳ **Alliance System** (Phase 3+) - Shared dungeon library feature

**Provides To:**
- 🔴 **Economy System** - Major source of resource generation
- 🔵 **Hero System** - Dungeon rewards include XP and equipment
- 🔵 **Equipment System** - Dungeons drop gear and crafting materials
- 🟡 **Alliance System** - Shared dungeon library (future feature)

**Key Integration Points:**
- Monster capture chance = Base rate × Hero trait modifiers × Equipment bonuses
- Schematic slot requirements → Monster archetype/family matching
- Dungeon durability tracking → Rebuild triggers
- Dungeon rewards → Economy resource pools

---

### Expedition System

**Depends On:**
- 🔴 **Hero System** - Heroes required to run expeditions
- 🔴 **Economy System** - Expeditions cost resources (potions), provide rewards
- 🟡 **Monster/Dungeon System** - Expeditions provide monster captures and schematics
- 🟡 **Equipment System** - Expeditions drop equipment
- ⏳ **Alliance System** (Phase 3+) - Alliance raids are expedition subcategory

**Provides To:**
- 🔴 **Hero System** - Primary source of XP and progression
- 🔴 **Monster/Dungeon System** - Source of monster captures and schematics
- 🔴 **Economy System** - Gold, materials, resources
- 🔴 **Equipment System** - Equipment drops
- 🔵 **Emergent Story System** - Expedition events trigger narratives

**Key Integration Points:**
- Hero power vs Recommended power → Efficiency calculation (60-150%)
- Hero tags → Mission requirements validation
- Expedition outcomes → Morale changes
- Familiarity bonuses → Zone-specific hero performance

---

### Equipment System

**Depends On:**
- 🔴 **Hero System** - Heroes wear equipment
- 🔴 **Economy System** - Crafting costs resources, equipment has gold value
- 🟡 **Expedition System** - Equipment drops from expeditions
- 🟡 **Monster/Dungeon System** - Personal dungeons drop equipment

**Provides To:**
- 🔴 **Hero System** - 30-40% of total hero power contribution
- 🔵 **Expedition System** - Better equipment → better expedition performance
- 🔵 **Monster/Dungeon System** - Equipment affects capture rates
- ⏳ **Morale System** (Phase 2+) - Equipment upgrades boost hero morale

**Key Integration Points:**
- Equipment stats + Hero base stats → Final hero power
- Set bonuses (2/4/6-piece) → Multiplicative stat boosts
- Gear score calculation → Power rating contribution
- Equipment rarity → Morale gain on equip

---

### Alliance System

**Depends On:**
- 🔴 **Hero System** - Heroes participate in alliance raids
- 🔴 **Expedition System** - Alliance raids are expedition subcategory
- 🔴 **Economy System** - Alliance Points currency, shared bonuses
- 🟡 **Monster/Dungeon System** - Raids drop rare monsters/schematics
- 🟡 **Equipment System** - Raids drop premium equipment

**Provides To:**
- 🔵 **Hero System** - Ascension materials, rare recruitment
- 🔵 **Economy System** - Alliance Points, shared gold/XP bonuses
- 🔵 **Expedition System** - Alliance raids content
- 🟡 **Monster/Dungeon System** - Shared dungeon library (future)
- ⏳ **Morale System** (Phase 2+) - Social events boost morale

**Key Integration Points:**
- Alliance raids require 3-5 heroes coordination
- Alliance bonuses (+5-15% gold, +3-10% XP) apply to all members
- Alliance chat integration for social features
- Alliance raid scaling (3p=100%, 4p=120%, 5p=150%)

---

### Economy & Progression System

**Depends On:**
- 🔵 **All Systems** - Economy is central hub for resources

**Provides To:**
- 🔴 **Hero System** - Recruitment costs, leveling costs
- 🔴 **Monster/Dungeon System** - Dungeon rebuild costs (future)
- 🔴 **Equipment System** - Crafting costs, upgrade costs
- 🔴 **Alliance System** - Alliance Points currency
- 🔴 **Expedition System** - Consumable costs (potions)

**Key Integration Points:**
- Gold sinks vs gold generation balance
- Resource accumulation rates → progression pacing
- Premium currency (Gems) → Cosmetics only (ethical monetization)
- Player level → Content unlock gates

---

### Emergent Story System (Phase 2+)

**Depends On:**
- 🔴 **Hero System** - Traits, personality, morale drive events
- 🔴 **Expedition System** - Events trigger during expeditions
- 🟡 **Alliance System** - Social events involve alliance interactions
- 🟡 **Monster/Dungeon System** - Dungeon creation generates events

**Provides To:**
- 🔵 **Hero System** - Events modify morale, trigger trait evolution
- 🔵 **Morale System** - Story events are primary morale modifier
- 🔵 **Alliance System** - Guild reputation tags from emergent stories
- 🟡 **Economy System** - Some events provide resource bonuses

**Key Integration Points:**
- Event probability = Base × Trait × Personality × Morale × Zone × Level
- Personality dimensions (0-10) → Event tone and outcomes
- Morale states (Burnout/Stressed/Content/Inspired) → Event triggers
- Presentation layer: default story feed is gaming parody + character; corporate “incident report/HR” formatting is optional UI seasoning

---

### Personality System (Phase 2+)

**Depends On:**
- 🔴 **Hero System** - Personalities assigned to heroes
- 🔵 **Expedition System** - Activities affect personality expression

**Provides To:**
- 🔴 **Emergent Story System** - Personality modifies event probabilities
- 🔴 **Morale System** - Personality determines morale gain/loss rates
- 🔵 **Hero System** - Personality conflicts/synergies affect team stats

**Key Integration Points:**
- 5 dimensions (Sociability, Work Ethic, Risk Tolerance, Competitiveness, Seriousness)
- 0-10 scale per dimension
- Personality conflicts (-15% party stats) vs synergies (+15-20% bonuses)
- Personality → Event tone (Goofy vs Professional framing)

---

### Morale/Happiness System (Phase 2+)

**Depends On:**
- 🔴 **Hero System** - Heroes have morale scores
- 🔴 **Personality System** - Personality modifies morale changes
- 🔵 **Expedition System** - Mission outcomes affect morale
- 🔵 **Equipment System** - Upgrades boost morale
- 🔵 **Alliance System** - Social events affect morale

**Provides To:**
- 🔴 **Hero System** - Morale affects stats (-25% to +15%)
- 🔴 **Emergent Story System** - Morale states trigger events
- 🔵 **Expedition System** - Low morale heroes refuse missions (Burnout)

**Key Integration Points:**
- 0-100 scale: Burnout (0-14), Stressed (15-34), Neutral (35-59), Content (60-84), Inspired (85-100)
- Morale gain sources: Mission success (+10), Level up (+15), Equipment upgrade (+5-15)
- Morale loss sources: Mission failure (-15), Consecutive missions (-5/mission after 5th), Ignored preferences (-10)
- Management actions: Rest period (free, +30), Motivational speech (50g, +15), Equipment gift (varies)

---

## 🎯 Phase-Based Implementation Order

### Phase 1 - MVP Foundation (Months 1-2)

**Required Systems** (Hard dependencies only):
1. **Economy System** (Core foundation)
   - Gold currency
   - Resource tracking
   - Basic progression

2. **Hero System** (Core gameplay)
   - 6 archetypes
   - Trait system
   - Level 1-50 progression
   - Recruitment (gold-based)

3. **Equipment System** (Power scaling)
   - 6 equipment slots
   - Rarity tiers (Common → Epic)
   - Set bonuses (2/4/6-piece)
   - Stat calculations

4. **Expedition System** (Content delivery)
   - Zones (exploration)
   - Timer-based completion
   - Reward distribution
   - XP and gold generation

**Dependency Order**: Economy → Hero → Equipment → Expedition

---

### Phase 2 - Unique Features (Months 3-4)

**Required Systems** (Build on Phase 1):
5. **Monster Capture System**
   - 5-15% capture chance
   - Monster storage
   - Monster power scaling (80-120% team average)

6. **Schematic Collection System**
   - Schematic drops (Common 60% → Mythic 1%)
   - Slot requirements definition
   - Schematic storage

7. **Personal Dungeon Building**
   - Monster assignment to schematics
   - Durability tracking (10-20 runs)
   - Reward generation
   - Rebuild mechanics

8. **Personality System** (Phase 2+)
   - 5 personality dimensions (0-10 scale)
   - Personality conflicts/synergies
   - Event probability modifiers

9. **Morale/Happiness System** (Phase 2+)
   - Morale tracking (0-100 scale)
   - Morale gain/loss mechanics
   - Management actions (rest, motivational speech)
   - Stat modifiers based on morale state

10. **Emergent Story System** (Phase 2+)
    - Event generation engine
    - Trait + Personality + Morale integration
    - Corporate framing for all events
    - Story persistence and logging

**Dependency Order**: Monster Capture → Schematics → Personal Dungeons → Personality → Morale → Emergent Stories

---

### Phase 3 - Social Features (Months 5-6)

**Required Systems** (Social layer):
11. **Alliance System**
    - Alliance creation/management (max 30 members)
    - Alliance raids (3-5 player cooperative)
    - Alliance chat (text, future: voice)
    - Shared bonuses (+5-15% gold, +3-10% XP)
    - Alliance Points currency

12. **Alliance Raids** (Expedition subcategory)
    - 3-5 player coordination
    - Scaling difficulty/rewards
    - Ascension material drops

13. **Shared Dungeon Library** (Future)
    - Rent schematics from allies
    - Alliance-wide resource sharing

**Dependency Order**: Alliance → Alliance Raids → Shared Library

---

### Phase 4 - Polish & Endgame (Month 7+)

**Required Systems** (Endgame loop):
14. **Ascension System**
    - Level 50 → Level 1 prestige
    - +50% stat growth
    - New tag slot
    - Legendary equipment access
    - Specialization paths (Offensive/Defensive/Balanced)

15. **Legendary Equipment**
    - Mythic rarity tier
    - Affixes (prefix/suffix modifiers)
    - Enchant slots
    - Build-defining effects

16. **Endgame Content**
    - Elite zones/raids
    - Collection goals (100 heroes, 150 monsters, 50 schematics)
    - Leaderboards (optional)
    - Seasonal events

**Dependency Order**: Ascension → Legendary Equipment → Endgame Content

---

## 🔍 Critical Integration Points

### Power Calculation Flow
```
Hero Base Stats (Level × Multiplier)
  ↓
+ Equipment Stats (30-40% contribution)
  ↓
+ Set Bonuses (2/4/6-piece multipliers)
  ↓
+ Trait Modifiers (rarity-based)
  ↓
+ Morale Modifiers (-25% to +15%)
  ↓
= Final Hero Power
```

### Event Generation Flow
```
Expedition Trigger
  ↓
Check Hero Traits → Event probability modifier
  ↓
Check Personality Dimensions → Event tone and chance
  ↓
Check Morale State → Event type trigger
  ↓
Zone Modifiers → Context-specific events
  ↓
Player Level Scaling → Event complexity
  ↓
= Final Event Probability → Roll → Event Outcome
```

### Morale Change Flow
```
Activity/Outcome
  ↓
Base Morale Change (+10 success, -15 failure)
  ↓
Personality Modifier (Work Ethic affects work morale)
  ↓
Conflict/Synergy Check (party composition)
  ↓
Equipment State Check (neglect penalty)
  ↓
= Final Morale Change → Update Hero Morale → Check State Thresholds
```

### Expedition Efficiency Flow
```
Hero Power vs Recommended Power (80% weight)
  ↓
+ Synergy from Tag/Trait Matching (15% weight)
  ↓
+ RNG Variance (5% weight, ±5%)
  ↓
= Efficiency (60-150% clamped)
  ↓
× Base Rewards
  ↓
= Final Rewards (Gold, XP, Equipment, Monsters, Schematics)
```

---

## ⚠️ Dependency Risks & Mitigation

### Risk 1: Circular Dependencies
**Potential Issue**: Hero System ↔ Equipment System ↔ Expedition System
**Mitigation**:
- Use dependency injection for runtime
- Define clear data contracts at boundaries
- Equipment stats are passive modifiers (no reverse dependency)

### Risk 2: Phase 2+ Feature Creep in Phase 1
**Potential Issue**: Personality/Morale systems accidentally coupled in Phase 1 Hero System
**Mitigation**:
- Use feature flags to disable Phase 2+ systems
- Design Hero System with extension points (personality/morale as optional modules)
- Database schema includes Phase 2+ columns but nullable/default values

### Risk 3: Alliance System Isolation
**Potential Issue**: Alliance features feel tacked-on vs integrated
**Mitigation**:
- Alliance raids use same expedition infrastructure
- Alliance bonuses apply to all existing systems (gold, XP, drops)
- Alliance Points integrate with economy system

### Risk 4: Emergent Story System Standalone
**Potential Issue**: Story events don't feel connected to core gameplay
**Mitigation**:
- Events MUST have mechanical outcomes (morale changes, bonuses, penalties)
- Event triggers tied to existing systems (expeditions, equipment, leveling)
- Corporate framing consistent across all UI/systems

---

## 📐 Database Schema Dependencies

### Core Tables (Phase 1)
```
users
  ↓
heroes (user_id FK)
  ↓
hero_equipment (hero_id FK, equipment_id FK)
  ↓
equipment (standalone)
  ↓
expeditions (user_id FK)
  ↓
expedition_heroes (expedition_id FK, hero_id FK)
```

### Phase 2+ Tables
```
heroes
  ↓
hero_personality (hero_id FK) - 5 dimension scores
  ↓
hero_morale (hero_id FK) - current morale, history
  ↓
story_events (hero_id FK, expedition_id FK nullable)
  ↓
monsters (standalone)
  ↓
captured_monsters (user_id FK, monster_id FK)
  ↓
schematics (standalone)
  ↓
player_schematics (user_id FK, schematic_id FK)
  ↓
personal_dungeons (user_id FK, schematic_id FK)
  ↓
dungeon_monsters (dungeon_id FK, captured_monster_id FK)
```

### Phase 3+ Tables
```
alliances (standalone)
  ↓
alliance_members (alliance_id FK, user_id FK)
  ↓
alliance_raids (alliance_id FK)
  ↓
alliance_raid_participants (raid_id FK, hero_id FK)
```

---

## 🎯 Validation Checklist

**System Completeness**:
- ✅ All systems have defined dependencies
- ✅ All systems provide value to other systems (no orphans)
- ✅ Critical paths identified (Hero → Expedition → Progression)
- ✅ Phase boundaries clear (MVP vs Phase 2+ vs Phase 3+)

**Integration Validation**:
- ✅ Power calculations defined and consistent
- ✅ Event generation logic complete
- ✅ Morale system integrated with all relevant systems
- ✅ Economy flows balanced (sinks vs sources)

**Implementation Readiness**:
- ✅ Phase 1 dependencies resolved (can implement immediately)
- ✅ Phase 2+ dependencies documented (extension points designed)
- ✅ Database schema supports phased rollout
- ✅ No circular dependencies blocking implementation

---

## 📚 Related Documents

- [HERO_SYSTEM.md](systems/HERO_SYSTEM.md) - Complete hero mechanics including personality and morale
- [MONSTER_DUNGEON_SYSTEM.md](systems/MONSTER_DUNGEON_SYSTEM.md) - Monster capture and personal dungeon building
- [EXPEDITION_SYSTEM.md](systems/EXPEDITION_SYSTEM.md) - All expedition types and reward mechanics
- [EQUIPMENT_SYSTEM.md](systems/EQUIPMENT_SYSTEM.md) - Equipment slots, sets, and power contribution
- [ALLIANCE_SYSTEM.md](systems/ALLIANCE_SYSTEM.md) - Alliance features and cooperative gameplay
- [ECONOMY_PROGRESSION.md](systems/ECONOMY_PROGRESSION.md) - Resources, currencies, and balance
- [EMERGENT_STORY_SYSTEM.md](systems/EMERGENT_STORY_SYSTEM.md) - Trait + Personality + Morale driven narratives

---

**This dependency matrix ensures all systems integrate coherently and guides phased implementation from MVP to full feature set.**
