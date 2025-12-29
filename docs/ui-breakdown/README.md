# Dungeon Farmers - UI Breakdown

**Last Updated:** 2025-12-29
**Status:** Comprehensive UI/UX documentation based on user stories
**Total User Stories Covered:** 187+

---

## Overview

This directory contains a complete breakdown of all pages, modals, popups, and components required to implement the Dungeon Farmers game based on the user stories in `docs/user-stories/`.

The design follows the game's core loop: **Manage Heroes -> Send on Expeditions -> Collect Loot -> Build Dungeons -> Farm Dungeons**

---

## Documentation Structure

| File | Description | Contents |
|------|-------------|----------|
| [01-pages.md](./01-pages.md) | Main Pages | 16 primary navigation pages with routes, purposes, and user story mappings |
| [02-modals-popups.md](./02-modals-popups.md) | Modals & Popups | 97 modals, dialogs, and overlays organized by category |
| [03-components.md](./03-components.md) | Shared Components | 50+ reusable Vue components with props, states, and usage |
| [04-auth-onboarding.md](./04-auth-onboarding.md) | Auth & Onboarding | Complete authentication and tutorial flow design |

---

## Quick Statistics

### Pages
- **Phase 1 (MVP):** 10 pages (core gameplay)
- **Phase 2:** 4 pages (dungeon building)
- **Phase 3+:** 2 pages (social, cosmetics)

### Modals & Popups
- **Small (confirmations, toasts):** ~35
- **Medium (detail views, forms):** ~40
- **Large/Fullscreen (browsers, builders):** ~22
- **Total:** 97

### Components
- **Card Components:** 4 (Hero, Monster, Item, Schematic)
- **Stat/Display Components:** 15+
- **Input/Selection Components:** 10+
- **Layout/Navigation Components:** 8+
- **Specialized Components:** 10+
- **Utility Components:** 8+

---

## Navigation Structure

```
Landing/Login
    |
[Tutorial Flow] --> Dashboard (Home)
    |                   |
    +---------+---------+----------+-----------+
    |         |         |          |           |
  Heroes  Expeditions Inventory Monsters  Schematics
  Roster     Hub                 (Ph.2)     (Ph.2)
    |         |                              |
  Hero     Team                         Dungeon
  Detail  Formation                      Builder
    |         |                              |
  Tavern  Active                        My Dungeons
          Expeditions                        |
              |                         (Farm runs)
          Results/Log --> [cycles back]

Settings/Account <--> Shop/Store (accessible from anywhere)
```

---

## Implementation Priority

### Phase 1 - MVP Core Loop
**Goal:** Playable hero management and expedition system

**Pages:**
- Dashboard, Heroes Roster, Hero Detail, Tavern
- Expeditions Hub, Team Formation, Active Expeditions, Results/Log
- Inventory, Settings (basic)

**Modals:**
- Account creation/login, Hero detail, Team formation
- Expedition results, Equipment, Confirmations
- Tutorial overlay, Loading/error states

### Phase 2 - The Differentiator (Dungeon Building)
**Goal:** Monster capture, schematic collection, dungeon building

**Pages:**
- Monster Collection, Schematic Collection
- Dungeon Builder, My Dungeons
- Shop/Store

**Modals:**
- Monster detail, Schematic detail
- Dungeon builder interface, Synergy indicators
- Supporter pack, Daily login rewards

### Phase 3 - Depth & Polish
**Goal:** Optimization, achievements, cosmetics

**Features:**
- Achievement system
- Set planning and gear optimization
- Cosmetics and themes
- Advanced comparison tools
- Statistics and analytics

### Phase 4+ - Social & Content
**Goal:** Community features, AI content

**Features:**
- Leaderboards, alliances
- Sharing expedition logs
- AI-generated events
- Advanced progression

---

## Design Principles

### 1. Modal vs Page Decision
- **Page:** Primary navigation destinations with unique URLs
- **Modal:** Detail views, confirmations, temporary overlays
- **Drawer/Panel:** Side panels for filters, secondary info

### 2. Persistent UI Elements
- Header: Player name, resources (gold, gems), active expedition count
- Navigation: Main menu tabs
- Notifications: Badge indicators for pending actions

### 3. Mobile-First Design
- All pages responsive and touch-friendly
- Modals become fullscreen on mobile
- Bottom navigation on small screens
- Swipe gestures for common actions

### 4. Progressive Disclosure
- Complex features hidden until relevant
- Tooltips explain on first encounter
- Tutorial guides critical paths
- Advanced options in secondary menus

### 5. Consistent Patterns
- Same card components across contexts
- Unified filter/sort controls
- Standard confirmation dialogs
- Consistent animation language

---

## User Story Coverage Map

| Category | Stories | Primary Pages | Primary Modals |
|----------|---------|---------------|----------------|
| Onboarding | 27 | Landing, Dashboard | Tutorial overlay, Welcome modals |
| Hero Management | 30 | Heroes, Hero Detail, Tavern | Recruitment, Prestige, Release |
| Expeditions | 35 | Expeditions Hub, Team, Active, Results | Formation, Results, Log viewer |
| Dungeon Building | 33 | Monsters, Schematics, Builder, Dungeons | Monster detail, Builder, Synergy |
| Equipment | 27 | Inventory, Hero Detail | Item detail, Comparison, Equip |
| Progression | 40 | Settings, Shop, Dashboard | Achievements, Quests, Rewards |

---

## Related Documentation

- [User Stories](../user-stories/) - Complete user story definitions
- [Game Design v2](../../design/GAME_DESIGN_V2.md) - Game design document
- [Tech Stack](../tech-stack-recommendation.md) - Technical architecture
- [Implementation Plans](../plans/) - Development roadmaps

---

## Component Library Recommendation

Based on the analysis, recommend using a structured component directory:

```
/app/components/
├── cards/           # HeroCard, MonsterCard, ItemCard, SchematicCard
├── display/         # PowerScore, RarityBadge, TraitDisplay, StatBar
├── progress/        # ExpeditionTimer, ProgressBar, PhaseIndicator
├── input/           # TeamSlot, DungeonSlotGrid, FilterPanel, SortDropdown
├── economy/         # CurrencyDisplay, ResourceCapacity, IncomeTracker
├── modals/          # RewardModal, ComparisonModal, ConfirmationDialog
├── navigation/      # TabNavigation, NotificationBadge, BreadcrumbNav
├── specialized/     # ExpeditionLog, LootTable, SynergyIndicator
└── utility/         # LoadingSpinner, EmptyState, Tooltip, Toast
```

---

## Next Steps

1. Review all documentation files in this directory
2. Create wireframes/mockups based on page definitions
3. Build component library starting with most reused components
4. Implement Phase 1 pages with associated modals
5. Test against user story acceptance criteria
