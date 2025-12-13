# Dungeon Farmers - Game Design Documentation

**Last Updated**: 2025-11-04
**Status**: Consolidated from legacy documentation
**Purpose**: Complete game design reference (non-technical)

---

## 📚 Documentation Structure

This directory contains **game design only** - no technical implementation details, no code, no database schemas. For technical documentation, see `/docs`.

### Core Documents

**Getting Started**:
1. **[00-GAME_OVERVIEW.md](00-GAME_OVERVIEW.md)** - Vision, pillars, unique hook
2. **[01-PLAYER_EXPERIENCE.md](01-PLAYER_EXPERIENCE.md)** - Complete player journey from first login to endgame

**Game Systems** (`/systems`):
3. **[HERO_SYSTEM.md](systems/HERO_SYSTEM.md)** - Heroes, archetypes, progression
4. **[TRAIT_SYSTEM_EXPANDED.md](systems/TRAIT_SYSTEM_EXPANDED.md)** - Complete trait catalog and mechanics
5. **[MONSTER_DUNGEON_SYSTEM.md](systems/MONSTER_DUNGEON_SYSTEM.md)** - Monster capture, schematics, personal dungeons
6. **[EXPEDITION_SYSTEM.md](systems/EXPEDITION_SYSTEM.md)** - Zones, missions, dungeons, raids
7. **[EQUIPMENT_SYSTEM.md](systems/EQUIPMENT_SYSTEM.md)** - Gear, sets, rarity, progression
8. **[ALLIANCE_SYSTEM.md](systems/ALLIANCE_SYSTEM.md)** - Guilds, cooperation, raids
9. **[ECONOMY_PROGRESSION.md](systems/ECONOMY_PROGRESSION.md)** - Resources, currencies, rewards
10. **[EMERGENT_STORY_SYSTEM.md](systems/EMERGENT_STORY_SYSTEM.md)** - 🆕 Rimworld/Dwarf Fortress-inspired narrative generation

**Content Catalogs** (`/content`):
11. **[ZONES_CONTENT.md](content/ZONES_CONTENT.md)** - Complete zone definitions (Parody Themes)
12. **[STORY_MISSIONS.md](content/STORY_MISSIONS.md)** - Narrative content structure
13. **[STORY_MISSIONS_CATALOG.md](content/STORY_MISSIONS_CATALOG.md)** - Full mission list
14. **[ENDGAME_CONTENT.md](content/ENDGAME_CONTENT.md)** - Long-term progression, prestige systems
15. **[MONSTER_BESTIARY.md](content/MONSTER_BESTIARY.md)** - Complete monster list
16. **[HERO_ARCHETYPES_CATALOG.md](content/HERO_ARCHETYPES_CATALOG.md)** - Detailed class definitions
17. **[HERO_TRAITS_CATALOG.md](content/HERO_TRAITS_CATALOG.md)** - Trait list
18. **[EQUIPMENT_CATALOG.md](content/EQUIPMENT_CATALOG.md)** - Item list
19. **[DUNGEON_SCHEMATICS_CATALOG.md](content/DUNGEON_SCHEMATICS_CATALOG.md)** - Schematic list
20. **[ACHIEVEMENTS_CATALOG.md](content/ACHIEVEMENTS_CATALOG.md)** - Achievement list
21. **[LOADING_TIPS_COLLECTION.md](content/LOADING_TIPS_COLLECTION.md)** - Parody loading tips

**Business & Design Philosophy**:
22. **[MONETIZATION.md](MONETIZATION.md)** - Business model, pricing, ethical guidelines
23. **[DESIGN_DECISIONS.md](DESIGN_DECISIONS.md)** - Key choices and rationale
24. **[TONE_AND_WRITING.md](TONE_AND_WRITING.md)** - Corporate satire, humor guidelines
25. **[DESIGN_MONETIZATION_ANALYSIS.md](DESIGN_MONETIZATION_ANALYSIS.md)** - 📊 Comprehensive analysis of design-monetization compatibility
26. **[FOCUS_PRIORITIES.md](FOCUS_PRIORITIES.md)** - 🎯 Strategic development priorities and decision roadmap
27. **[TECH_STACK.md](TECH_STACK.md)** - 🛠️ Recommended technology stack and architecture

---

## 🎯 Quick Navigation

### By Role

**Game Designers**:
- Start: [00-GAME_OVERVIEW.md](00-GAME_OVERVIEW.md)
- Systems: `/systems` directory
- Content: `/content` directory

**Product/Business**:
- Start: [MONETIZATION.md](MONETIZATION.md)
- Analysis: [DESIGN_MONETIZATION_ANALYSIS.md](DESIGN_MONETIZATION_ANALYSIS.md)
- **Focus**: [FOCUS_PRIORITIES.md](FOCUS_PRIORITIES.md)
- Player Journey: [01-PLAYER_EXPERIENCE.md](01-PLAYER_EXPERIENCE.md)

**Writers/Narrative**:
- Start: [TONE_AND_WRITING.md](TONE_AND_WRITING.md)
- Story: [content/STORY_MISSIONS.md](content/STORY_MISSIONS.md)
- 🆕 Emergent Narrative: [systems/EMERGENT_STORY_SYSTEM.md](systems/EMERGENT_STORY_SYSTEM.md)

### By System

| System | Document | Status |
|--------|----------|--------|
| Heroes | [systems/HERO_SYSTEM.md](systems/HERO_SYSTEM.md) | ✅ Complete |
| Monsters & Dungeons | [systems/MONSTER_DUNGEON_SYSTEM.md](systems/MONSTER_DUNGEON_SYSTEM.md) | ✅ Complete |
| Expeditions | [systems/EXPEDITION_SYSTEM.md](systems/EXPEDITION_SYSTEM.md) | ✅ Complete |
| Equipment | [systems/EQUIPMENT_SYSTEM.md](systems/EQUIPMENT_SYSTEM.md) | ✅ Complete |
| Alliances | [systems/ALLIANCE_SYSTEM.md](systems/ALLIANCE_SYSTEM.md) | ✅ Complete |
| Economy | [systems/ECONOMY_PROGRESSION.md](systems/ECONOMY_PROGRESSION.md) | ✅ Complete |
| 🆕 Emergent Stories | [systems/EMERGENT_STORY_SYSTEM.md](systems/EMERGENT_STORY_SYSTEM.md) | ✅ Complete |

---

## 🔑 Core Design Pillars

**1. Respect Player Time**
- No mandatory daily grinds
- Meaningful offline progress
- Quick sessions (5-15min) OR deep sessions (30min+) both valid

**2. Fair Monetization**
- Free demo → $9.99 one-time unlock
- Cosmetics only for premium
- No energy, VIP, or pay-to-win

**3. Player Agency & Creativity**
- **Personal dungeon creation** (unique differentiator)
- Multiple viable team builds
- Strategic choices matter
- Player-generated content loops

---

## 🎮 What Makes This Game Unique?

**The Hook**: **Monster Capture + Personal Dungeon Building**

Players don't just farm dungeons - they **capture monsters** during expeditions, collect **dungeon schematics** (blueprints), and **build their own personal dungeons** by assigning captured monsters to schematic slots.

**Self-Sustaining Content Loop**:
1. Run expeditions → Capture monsters
2. Collect schematic blueprints
3. Build personal dungeons with captured monsters
4. Farm personal dungeons for optimized resources
5. Use resources for hero progression
6. Tackle harder expeditions to capture rarer monsters
7. Repeat with better dungeons

This solves the **content starvation problem** common in idle games while giving players **creative agency** and **strategic optimization** gameplay.

---

## 📊 Documentation Consolidation Notes

This documentation was **consolidated from 50+ legacy documents** across `/docs` and `/claudedocs`.

**What Changed**:
- ✅ Removed all technical implementation details
- ✅ Consolidated 10 tutorial docs → integrated into player journey
- ✅ Merged duplicate system descriptions
- ✅ Focused purely on game design and player experience
- ✅ Marked unclear areas with ❓ **[QUESTION]** tags

**Legacy Documentation**:
- Technical docs remain in `/docs`
- Claude working docs remain in `/claudedocs`
- This is **design-only reference**

---

## ⚠️ Questions & Clarifications Needed

Areas marked with ❓ **[QUESTION]** tags indicate design decisions that need clarification or are not yet finalized. **Total: 18 open questions → 15 remaining questions** (3 resolved in recent analysis).

**By Document**:
- **00-GAME_OVERVIEW.md**: 2 questions (raid scaling, prestige system) - ✅ RESOLVED: schematic rarity, monster reuse, content cadence
- **01-PLAYER_EXPERIENCE.md**: 3 questions (guild customization, dungeon preview, ascension paths)
- **systems/HERO_SYSTEM.md**: 2 questions (recruitment reroll, ascension specialization)
- **systems/MONSTER_DUNGEON_SYSTEM.md**: 0 questions - ✅ RESOLVED: monster release rewards, reuse mechanics, schematic drop rates
- **systems/EMERGENT_STORY_SYSTEM.md**: 🆕 5 questions (event prevention, relationship persistence, trait evolution, social media scope, guild legends)
- **content/ENDGAME_CONTENT.md**: 1 question (multiple ascensions vs specialization)

**Recent Resolutions (2025-11-02)**:
- ✅ Monster reuse mechanics: Cooldown-based (24-hour) reassignment selected
- ✅ Schematic drop rates: Difficulty-based distribution with content type modifiers defined
- ✅ Content update cadence: Major updates every 3 months, minor monthly, 4 seasonal events/year

---

## 📈 Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| 00-GAME_OVERVIEW.md | ✅ Complete | 2025-11-02 |
| 01-PLAYER_EXPERIENCE.md | ✅ Complete | 2025-11-02 |
| systems/HERO_SYSTEM.md | ✅ Complete | 2025-11-02 |
| systems/MONSTER_DUNGEON_SYSTEM.md | ✅ Complete | 2025-11-02 |
| systems/EXPEDITION_SYSTEM.md | ✅ Complete | 2025-11-02 |
| systems/EQUIPMENT_SYSTEM.md | ✅ Complete | 2025-11-02 |
| systems/ALLIANCE_SYSTEM.md | ✅ Complete | 2025-11-02 |
| systems/ECONOMY_PROGRESSION.md | ✅ Complete | 2025-11-02 |
| systems/EMERGENT_STORY_SYSTEM.md | ✅ Complete | 2025-11-02 |
| content/ZONES_CONTENT.md | ✅ Complete | 2025-11-02 |
| content/STORY_MISSIONS.md | ✅ Complete | 2025-11-02 |
| content/ENDGAME_CONTENT.md | ✅ Complete | 2025-11-02 |
| MONETIZATION.md | ✅ Complete | 2025-11-02 |
| DESIGN_DECISIONS.md | ✅ Complete | 2025-11-02 |
| TONE_AND_WRITING.md | ✅ Complete | 2025-11-02 |

---

## 🔄 Maintenance

**Update Frequency**: As features are designed or design decisions change

**Ownership**: Game design team

**Related Documentation**:
- Technical implementation: `/docs`
- Claude working docs: `/claudedocs`
- Project overview: `/CLAUDE.md` (root)

---

**Ready to dive in?** Start with [00-GAME_OVERVIEW.md](00-GAME_OVERVIEW.md) for the big picture.
