# Dungeon Farmers - Page Breakdown

**Last Updated:** 2025-12-29
**Total Pages:** 16
**Status:** Complete page definitions based on 187+ user stories

---

## Overview

This document defines all main navigation pages for Dungeon Farmers, organized around the core gameplay loop:

```
Manage Heroes -> Send on Expeditions -> Collect Loot -> Build Dungeons -> Farm Dungeons
```

Each page definition includes:
- Route path
- Primary purpose
- User stories addressed (US-XX-XXX format)
- Key sections/areas
- Navigation relationships
- Implementation priority

---

## 1. Dashboard / Home

**Route:** `/` or `/dashboard`
**Priority:** Phase 1 (MVP)

### Purpose
Central hub providing overview of player status and quick access to all major game areas.

### User Stories Addressed
- US-OB-018, US-OB-019: Contextual tooltips, suggested next actions
- US-OB-023: Welcome back with offline progress
- US-EX-031, US-EX-032: Return to completed expeditions, collect offline passive
- US-PM-007: Daily login rewards
- US-PM-008: Daily/weekly quests

### Key Sections
1. **Welcome Header**
   - Player name and guild name
   - Supporter badge (if applicable)
   - Account level

2. **Quick Stats Panel**
   - Hero count (e.g., "15/50 heroes")
   - Active expeditions count
   - Resource summary (gold, gems)

3. **Pending Actions**
   - Completed expeditions awaiting collection
   - Available upgrades indicator
   - Daily rewards unclaimed

4. **Suggested Actions** (collapsible)
   - 1-3 recommended next steps
   - Context-aware for new players
   - Quick-start buttons

5. **Quest Tracker**
   - Daily quests progress
   - Weekly quests progress
   - Claim buttons

6. **Quick Access Grid**
   - Start Expedition
   - Recruit Hero
   - View Inventory
   - Build Dungeon (Phase 2)

### Navigation
- **Links FROM:** Login/Onboarding, all pages (home button)
- **Links TO:** All major sections (Heroes, Expeditions, Inventory, Dungeons, Shop, Settings)

---

## 2. Heroes Roster

**Route:** `/heroes`
**Priority:** Phase 1 (MVP)

### Purpose
Browse, sort, filter, and select heroes from the player's collection.

### User Stories Addressed
- US-HM-001: View hero roster
- US-HM-002: Sort heroes
- US-HM-003: Filter heroes
- US-HM-005: Compare heroes side-by-side
- US-HM-028, US-HM-029, US-HM-030: Release/dismiss heroes

### Key Sections
1. **Header Bar**
   - Hero count (e.g., "15/50 heroes")
   - View toggle (grid/list)
   - Sort dropdown

2. **Filter Panel** (collapsible sidebar)
   - Rarity filter (Common → Legendary)
   - Status filter (Available, On Expedition, Stationed)
   - Trait tags filter
   - Level range slider

3. **Hero Grid/List**
   - Hero cards showing:
     - Portrait, name, level
     - Rarity indicator
     - Power score
     - Status badge
   - Click to open Hero Detail

4. **Bulk Actions Bar** (when selecting)
   - Compare selected (up to 3)
   - Release selected
   - Clear selection

5. **Quick Filters**
   - "Available Heroes" toggle
   - "Has Upgrades" toggle

### Navigation
- **Links FROM:** Dashboard, Expedition team selection
- **Links TO:** Hero Detail (click hero), Tavern (recruit button), Expeditions

---

## 3. Hero Detail

**Route:** `/heroes/:id`
**Priority:** Phase 1 (MVP)

### Purpose
View and manage individual hero stats, equipment, traits, and progression.

### User Stories Addressed
- US-HM-004: View hero details
- US-HM-011, US-HM-012, US-HM-013, US-HM-014: View stats, traits, impact, track acquisition
- US-HM-015, US-HM-016, US-HM-017, US-HM-018, US-HM-019: Equipment management
- US-HM-020, US-HM-021, US-HM-022, US-HM-023: Leveling and XP
- US-HM-024, US-HM-025, US-HM-026, US-HM-027: Prestige system
- US-EQ-009, US-EQ-010, US-EQ-011: Equip items, auto-equip, loadouts

### Key Sections
1. **Hero Header**
   - Large portrait
   - Name, level, rarity
   - Prestige badge (if any)
   - Power score (prominent)

2. **Status Bar**
   - Current status (Idle/On Expedition/Stationed)
   - XP progress bar to next level
   - Trait slot progress (e.g., "3/5 traits")

3. **Stats Panel**
   - Base stats (ATK, DEF, HP, SPD)
   - Gear bonuses
   - Trait bonuses
   - Total stats
   - Expandable breakdown

4. **Traits Section**
   - All traits with descriptions
   - Type indicators (Flat, Conditional, Tag)
   - Active/inactive state
   - Unlock milestones

5. **Equipment Grid**
   - 6 slots (Weapon, Armor, Helmet, Boots, Accessory x2)
   - Equipped item preview
   - Click slot to equip from inventory
   - Set bonus indicators

6. **Actions Panel**
   - Auto-Equip Best Gear
   - Prestige Hero (if max level)
   - Release Hero
   - Send on Expedition

### Navigation
- **Links FROM:** Heroes Roster, Expedition results
- **Links TO:** Inventory (equip modal), Expeditions (send hero)

---

## 4. Tavern / Recruitment

**Route:** `/tavern` or `/recruit`
**Priority:** Phase 1 (MVP)

### Purpose
Recruit new heroes to grow the player's roster.

### User Stories Addressed
- US-HM-006: Access tavern/recruitment
- US-HM-007: View recruitment options
- US-HM-008: Recruit a hero
- US-HM-009: Refresh recruitment options
- US-HM-010: Reroll hero traits (supporters)
- US-OB-013: Recruiting second hero (tutorial)
- US-PM-005, US-PM-006: Daily recruitment cap
- US-PM-010: Refresh recruitment pool

### Key Sections
1. **Recruitment Status**
   - Daily allowance counter (Free: "3/5 recruits today")
   - "Unlimited" badge for supporters
   - Reset timer

2. **Gold Balance**
   - Current gold
   - Quick access to earn more

3. **Hero Pool** (3-5 heroes)
   - Each hero card shows:
     - Portrait, name, rarity
     - Starting traits (2-4 based on rarity)
     - Gold cost
     - "Recruit" button
   - Click for preview modal

4. **Pool Actions**
   - Refresh countdown timer
   - "Refresh Pool" button (gem cost)
   - Last refresh timestamp

5. **Supporter Upsell** (for free players)
   - Benefits highlight
   - Link to shop

### Navigation
- **Links FROM:** Dashboard, Heroes Roster
- **Links TO:** Heroes Roster (after recruitment), Hero preview modal

---

## 5. Expeditions Hub

**Route:** `/expeditions`
**Priority:** Phase 1 (MVP)

### Purpose
Browse available content and launch new expeditions.

### User Stories Addressed
- US-EX-001: Discover and select zones
- US-EX-006: Access story mission content
- US-EX-010: View dungeon requirements
- US-PM-001, US-PM-002, US-PM-003, US-PM-004: Zone/content unlocking
- US-OB-010: First expedition walkthrough (tutorial)

### Key Sections
1. **Content Tabs**
   - **Zones**: Open-world exploration
   - **Story**: Sequential missions
   - **Dungeons**: Player-built (Phase 2)

2. **Zones Tab Content**
   - Zone grid with cards showing:
     - Zone name, theme, difficulty
     - Duration options (15m, 30m, 1hr, 2hr)
     - Resources available
     - Monster pool preview
   - Locked zones show requirements
   - Familiarity/mastery progress

3. **Story Tab Content**
   - Chapter list (sequential)
   - Mission cards showing:
     - Mission name, requirements
     - Rewards preview
     - Completion status
   - Locked missions with requirements

4. **Dungeons Tab Content** (Phase 2)
   - Player dungeon list
   - Power level, loot preview
   - "Build New" button

5. **Filter/Sort Controls**
   - Filter by: unlocked, difficulty, rewards
   - Sort by: recommended, difficulty, duration

### Navigation
- **Links FROM:** Dashboard
- **Links TO:** Team Formation, Active Expeditions

---

## 6. Expedition Team Formation

**Route:** `/expeditions/team?type=zone&id=xxx`
**Priority:** Phase 1 (MVP)

### Purpose
Assemble team and configure expedition before launching.

### User Stories Addressed
- US-EX-002: Form expedition team
- US-EX-003: Select expedition duration
- US-EX-004: Launch zone exploration
- US-EX-007: Form fixed team for story mission
- US-EX-011: Optimize team for dungeon efficiency
- US-OB-014: Forming multi-hero teams (tutorial)

### Key Sections
1. **Expedition Info Panel**
   - Name, type, difficulty
   - Rewards preview
   - Monster availability (capture chances)

2. **Team Slots**
   - 2-4 hero slots (varies by content)
   - Drag-and-drop or click-to-assign
   - Role requirements (for story/dungeons)
   - Tag indicators

3. **Available Heroes**
   - Filtered list (available only)
   - Quick filters (level, power, traits)
   - Tag highlighting for matches

4. **Efficiency Preview**
   - Total team power
   - Efficiency rating (60-150%)
   - Breakdown: Power + Slots + Tags
   - Visual tier (Bronze/Silver/Gold)

5. **Duration Selector** (zones only)
   - Radio buttons: 15m, 30m, 1hr, 2hr
   - Reward scaling info
   - Estimated completion time

6. **Actions**
   - Auto-Fill Team
   - Save Preset (Phase 2)
   - Start Expedition
   - Cancel

### Navigation
- **Links FROM:** Expeditions Hub
- **Links TO:** Active Expeditions (after launch)

---

## 7. Active Expeditions

**Route:** `/expeditions/active`
**Priority:** Phase 1 (MVP)

### Purpose
Monitor all ongoing expeditions and passive assignments.

### User Stories Addressed
- US-EX-005: Run multiple concurrent expeditions
- US-EX-014, US-EX-015, US-EX-016, US-EX-017: Passive assignments
- US-EX-018, US-EX-019, US-EX-020: Monitor timers, progress, events
- US-EX-021: Cancel/recall expeditions
- US-EX-013: Manage long-duration dungeons

### Key Sections
1. **Active Expeditions List** (2-3 max)
   - Each card shows:
     - Type (Zone/Story/Dungeon)
     - Zone name, team composition
     - Countdown timer (real-time)
     - Progress bar/phase
     - Mini-events as they occur
   - "Recall" button (with penalty warning)

2. **Passive Assignments Section**
   - Stationed heroes by zone
   - Income rate per hour
   - Accumulated resources
   - "Collect All" button

3. **Completion Notifications**
   - Stacked cards for completed
   - "Collect Rewards" button
   - Quick view of rewards

4. **Empty State**
   - "No active expeditions"
   - Quick-start button to Expeditions Hub

### Navigation
- **Links FROM:** Dashboard, Expeditions Hub
- **Links TO:** Expedition Results (on complete), Expeditions Hub

---

## 8. Expedition Results / Log

**Route:** `/expeditions/results/:id`
**Priority:** Phase 1 (MVP)

### Purpose
View completion summary, collect rewards, read narrative logs.

### User Stories Addressed
- US-EX-022, US-EX-023, US-EX-024, US-EX-025, US-EX-026: Completion, efficiency, captures, summary, inventory
- US-EX-027, US-EX-028, US-EX-029, US-EX-030: Logs, reactions, save/share, history
- US-OB-011: Understanding expedition logs (tutorial)
- US-DB-005, US-DB-007: Capture monsters

### Key Sections
1. **Summary Header**
   - Expedition name, type
   - Efficiency rating with visual (chest tiers)
   - Duration completed

2. **Rewards Panel**
   - Gold earned
   - XP per hero (with level-ups highlighted)
   - Equipment drops
   - Monsters captured (with "NEW!" badges)
   - Schematics found
   - Materials/resources

3. **Loot Grid**
   - Item cards with rarity
   - "Equip" quick action
   - "Compare" on hover
   - Upgrade indicators

4. **Expedition Log**
   - Chronological events
   - Hero dialogue with trait reactions
   - Phase markers
   - "Save to Favorites" button
   - "Share" button (Phase 3)

5. **Actions**
   - Collect Rewards
   - Run Again
   - View Inventory
   - Back to Expeditions

### Navigation
- **Links FROM:** Active Expeditions, Dashboard (pending)
- **Links TO:** Inventory, Hero Detail, Monster Collection, Expeditions Hub

---

## 9. Inventory

**Route:** `/inventory`
**Priority:** Phase 1 (MVP)

### Purpose
View, sort, filter, and manage equipment and materials.

### User Stories Addressed
- US-EQ-001, US-EQ-002, US-EQ-003, US-EQ-004: View, sort/filter, capacity, cross-hero
- US-EQ-005, US-EQ-006, US-EQ-007, US-EQ-008: Stats, sets, gear score, comparison
- US-EQ-016: Find upgrades
- US-EQ-022, US-EQ-023, US-EQ-024, US-EQ-025: Sell, salvage, auto-salvage, lock
- US-EQ-026, US-EQ-027: Materials, currency

### Key Sections
1. **Capacity Bar**
   - "127/200 items"
   - Warning color at 80%+
   - Expand button

2. **Category Tabs**
   - All, Weapons, Armor, Helmets, Boots, Accessories, Materials

3. **Filter/Sort Bar**
   - Sort dropdown (Gear Score, Rarity, Level, Name, Recent)
   - Filter button (opens panel)
   - "Upgrades Only" toggle
   - Search box

4. **Item Grid/List**
   - Item cards with:
     - Icon, rarity border
     - Gear score
     - Equipped badge (which hero)
     - Locked indicator
   - Click for detail modal

5. **Bulk Actions Bar**
   - Sell Selected
   - Salvage Selected
   - Lock/Unlock Selected

6. **Materials Section**
   - Resource counts
   - Quick crafting access (future)

### Navigation
- **Links FROM:** Dashboard, Hero Detail, Expedition Results
- **Links TO:** Item detail modal, Hero Detail (equip)

---

## 10. Monster Collection

**Route:** `/monsters`
**Priority:** Phase 2

### Purpose
View captured monsters and track collection progress.

### User Stories Addressed
- US-DB-001: View monster collection
- US-DB-002: View monster details
- US-DB-003: Track collection progress
- US-DB-004: Understand monster rarity tiers
- US-DB-006, US-DB-009: Capture rates, per-zone progress

### Key Sections
1. **Collection Progress**
   - "47/120 monsters captured"
   - Completion percentage
   - Per-type breakdown

2. **Type Tabs**
   - All, Beast, Elemental, Undead, etc.

3. **Monster Grid**
   - Monster cards with:
     - Portrait, name, type
     - Rarity, power level
     - "In Dungeon" badge
   - Silhouettes for undiscovered
   - Click for detail modal

4. **Filter/Sort**
   - By rarity, type, zone, placed status
   - Sort by power, rarity, recent

5. **Zone Completion**
   - Per-zone capture checklist
   - Missing monsters highlighted

### Navigation
- **Links FROM:** Expedition Results, Dashboard
- **Links TO:** Monster detail modal, Dungeon Builder, Expeditions (farm more)

---

## 11. Schematic Collection

**Route:** `/schematics`
**Priority:** Phase 2

### Purpose
View collected dungeon schematics and identify buildable dungeons.

### User Stories Addressed
- US-DB-010: View schematic collection
- US-DB-011: View schematic details
- US-DB-012: Identify buildable schematics
- US-DB-013: Track schematic sources

### Key Sections
1. **Collection Summary**
   - Total schematics
   - Buildable count

2. **Schematic Grid**
   - Cards with:
     - Layout preview
     - Name, rarity
     - Slot count
     - "Buildable" badge
     - "Active" badge
   - Click for detail modal

3. **Filter/Sort**
   - By rarity, buildable status, slot count
   - Sort by recent, rarity

4. **Quick Actions**
   - "Show Buildable Only" toggle

### Navigation
- **Links FROM:** Expedition Results, Dashboard
- **Links TO:** Schematic detail modal, Dungeon Builder

---

## 12. Dungeon Builder

**Route:** `/dungeons/build/:schematicId` (new) or `/dungeons/:dungeonId/edit` (existing)
**Priority:** Phase 2

### Purpose
Build new dungeons or edit existing ones by placing monsters in slots.

### User Stories Addressed
- US-DB-014: Create dungeon from schematic
- US-DB-015: Place monsters with validation
- US-DB-016: Tutorial for first dungeon
- US-DB-017: Preview dungeon rewards
- US-DB-018: Save as drafts
- US-DB-019: Quick-optimize
- US-DB-020 to US-DB-024: Synergy system

### Key Sections
1. **Schematic Layout**
   - Visual slot grid
   - Slot requirements displayed
   - Placed monsters shown

2. **Monster Sidebar**
   - Available monsters (filtered by compatible)
   - Drag source
   - Quick filters

3. **Placement Area**
   - Drag-and-drop zones
   - Green/red validation feedback
   - Synergy connection lines

4. **Synergy Panel**
   - Active synergies
   - Potential synergies
   - Total synergy score

5. **Loot Preview**
   - Combined loot table
   - Drop rates
   - Updates in real-time

6. **Actions**
   - Dungeon name input
   - Save Draft
   - Optimize
   - Activate Dungeon

### Navigation
- **Links FROM:** Schematic Collection, My Dungeons
- **Links TO:** My Dungeons, Monster Collection

---

## 13. My Dungeons

**Route:** `/dungeons`
**Priority:** Phase 2

### Purpose
Manage active and inactive dungeons, start farming runs.

### User Stories Addressed
- US-DB-025: Send heroes to farm
- US-DB-026: View loot results
- US-DB-027: Target specific gear
- US-DB-028: Understand difficulty
- US-DB-029 to US-DB-033: Management, deactivation, limits, organization, statistics

### Key Sections
1. **Active Dungeons List** (5 free, 10 supporter)
   - Cards with:
     - Name, power level
     - Loot preview
     - Run statistics
     - "Farm" button
     - Edit/Deactivate options

2. **Slot Counter**
   - "5/5 active dungeons"
   - Expand option (supporters)

3. **Inactive/Drafts** (collapsible)
   - Inactive dungeons
   - Draft dungeons
   - "Reactivate" buttons

4. **Loot Finder Tool**
   - Search for specific item
   - Shows which dungeons drop it
   - Drop rate comparison

5. **Organization**
   - Sort/filter controls
   - Pin favorites
   - Tags/categories

### Navigation
- **Links FROM:** Dashboard, Expeditions Hub (dungeons tab)
- **Links TO:** Dungeon Builder, Team Formation (farm run)

---

## 14. Shop / Store

**Route:** `/shop`
**Priority:** Phase 2

### Purpose
Purchase supporter pack, cosmetics, and view premium currency options.

### User Stories Addressed
- US-PM-015 to US-PM-019: Supporter pack
- US-PM-027 to US-PM-029: Cosmetics
- US-PM-035: Value breakdown
- US-PM-013: Extra slots

### Key Sections
1. **Supporter Pack Tab**
   - One-time purchase card ($15-20)
   - Benefits list with icons
   - Comparison table (Free vs Supporter)
   - "Purchase Now" button
   - FAQs

2. **Cosmetics Tab**
   - UI themes grid
   - Hero skins (preview)
   - Profile badges
   - Unlock status indicators

3. **Expansions Tab**
   - Hero slot purchases
   - Dungeon slot purchases
   - Gem cost scaling

4. **Currency Display**
   - Gem balance
   - Transaction history link

### Navigation
- **Links FROM:** Dashboard, Settings, upsell prompts
- **Links TO:** Payment gateway, Settings

---

## 15. Account / Settings

**Route:** `/settings`
**Priority:** Phase 1 (basic), Phase 2 (full)

### Purpose
Manage profile, preferences, achievements, and account data.

### User Stories Addressed
- US-PM-020, US-PM-021, US-PM-022, US-PM-023: Profile, preferences, data, sync
- US-PM-024, US-PM-025, US-PM-026: Achievements and goals
- US-OB-009: Guild name
- US-OB-021: Help menu
- US-OB-025: What's new
- US-PM-037: Account level

### Key Sections
1. **Profile Tab**
   - Username (with change option)
   - Avatar selection
   - Guild name
   - Supporter badge
   - Account level and XP

2. **Preferences Tab**
   - Notification toggles
   - Sound/music volume
   - Accessibility options

3. **Achievements Tab** (Phase 3)
   - Category grid
   - Progress tracking
   - Rewards display

4. **Data Tab**
   - Export data
   - Delete account
   - Privacy policy

5. **Help Tab**
   - Searchable topics
   - FAQ
   - Contact/feedback
   - Tutorial replay

### Navigation
- **Links FROM:** Any page (settings icon)
- **Links TO:** Shop, Help articles

---

## 16. Onboarding / Tutorial

**Route:** `/welcome`, `/tutorial`
**Priority:** Phase 1 (MVP)

### Purpose
Guide new players through first-time experience.

### User Stories Addressed
- US-OB-001 to US-OB-005: Account creation, login, guest mode
- US-OB-006 to US-OB-009: Welcome, first hero, UI tour, guild name
- US-OB-010 to US-OB-017: Tutorial steps
- US-OB-020: Milestone celebrations
- US-PM-036: Tutorial progression

### Key Sections
1. **Login/Signup Screen**
   - "Play as Guest" (prominent)
   - Email/password signup
   - OAuth options (Google, Discord)
   - "Forgot Password" link

2. **Welcome Screen**
   - Animated logo
   - Tagline
   - "Begin Adventure" button

3. **First Hero Grant**
   - Hero reveal animation
   - Trait introduction
   - "Continue" button

4. **UI Tour Overlay**
   - Spotlight on key areas
   - Tooltips
   - Progress dots
   - Skip option

5. **Guild Naming**
   - Text input
   - Random generator
   - Skip option

6. **Tutorial Steps** (interactive)
   - Step 1: First expedition
   - Step 2: Collect rewards
   - Step 3: Equip gear
   - Step 4: Recruit second hero
   - Step 5: Form team
   - Completion celebration

### Navigation
- **Links FROM:** Landing page
- **Links TO:** Dashboard

---

## Summary Table

| # | Page | Route | Phase | Primary Stories |
|---|------|-------|-------|-----------------|
| 1 | Dashboard | `/` | 1 | OB-018, OB-019, OB-023, PM-007, PM-008 |
| 2 | Heroes Roster | `/heroes` | 1 | HM-001 to HM-005, HM-028 to HM-030 |
| 3 | Hero Detail | `/heroes/:heroId` | 1 | HM-004, HM-011 to HM-027, EQ-009 to EQ-011 |
| 4 | Tavern | `/tavern` | 1 | HM-006 to HM-010, PM-005, PM-006 |
| 5 | Expeditions Hub | `/expeditions` | 1 | EX-001, EX-006, EX-010, PM-001 to PM-004 |
| 6 | Team Formation | `/expeditions/team` | 1 | EX-002 to EX-004, EX-007, EX-011 |
| 7 | Active Expeditions | `/expeditions/active` | 1 | EX-005, EX-013 to EX-021 |
| 8 | Expedition Results | `/expeditions/results/:expeditionId` | 1 | EX-022 to EX-030, DB-005, DB-007 |
| 9 | Inventory | `/inventory` | 1 | EQ-001 to EQ-008, EQ-016, EQ-022 to EQ-027 |
| 10 | Monster Collection | `/monsters` | 2 | DB-001 to DB-004, DB-006, DB-009 |
| 11 | Schematic Collection | `/schematics` | 2 | DB-010 to DB-013 |
| 12 | Dungeon Builder | `/dungeons/build/:schematicId` | 2 | DB-014 to DB-024 |
| 13 | My Dungeons | `/dungeons` | 2 | DB-025 to DB-033 |
| 14 | Shop | `/shop` | 2 | PM-013, PM-015 to PM-019, PM-027 to PM-029 |
| 15 | Settings | `/settings` | 1-2 | PM-020 to PM-026, PM-037, OB-009, OB-021 |
| 16 | Onboarding | `/welcome` | 1 | OB-001 to OB-017, PM-036 |

> **Note on Route Parameters:** All route parameters use descriptive names (e.g., `:heroId`, `:expeditionId`, `:schematicId`) rather than generic `:id` to improve code clarity and prevent confusion when multiple IDs are present.
