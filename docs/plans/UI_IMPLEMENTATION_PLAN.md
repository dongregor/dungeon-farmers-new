# Dungeon Farmers - UI Implementation Plan

**Created:** 2025-12-30
**Based On:** User Stories, UI Design Docs, UI Breakdown
**Status:** Planning Complete - Ready for Implementation

---

## Executive Summary

This plan outlines the implementation strategy for Dungeon Farmers UI based on the comprehensive design documentation (187+ user stories, 16 pages, 97 modals, 50+ components).

### Current State vs Target State

| Category | Specified | Existing | Gap |
|----------|-----------|----------|-----|
| Pages | 16 | 11 | 5 missing |
| Components | 50+ | 30 | 20+ missing |
| Modals | 97 | ~8 | 89 missing |
| Stores | 15+ | 13 | ~2 missing |

---

## Detailed Gap Analysis (Existing vs Spec)

### Pages: What Exists vs What's Needed

| Page | Route | Exists? | Spec Compliance | Missing Features |
|------|-------|---------|-----------------|------------------|
| **Dashboard** | `/` | Yes (`index.vue`) | 60% | Missing: Welcome header with account level, Pending Actions panel, Suggested Actions, Quest Tracker, Quick Access Grid |
| **Heroes Roster** | `/heroes` | Yes | 70% | Missing: View toggle (grid/list), Bulk Actions Bar, "Has Upgrades" toggle, hero count display in header |
| **Hero Detail** | `/heroes/:heroId` | **NO** | 0% | Entire page missing - critical for MVP |
| **Tavern** | `/tavern` | Yes | 75% | Missing: Daily allowance counter, Pool preview modals, Supporter upsell panel |
| **Expeditions Hub** | `/expeditions` | Yes | 65% | Missing: Content tabs (Zones/Story/Dungeons), Familiarity/mastery progress, Filter/Sort Controls |
| **Team Formation** | `/expeditions/team` | **NO** (inline) | 40% | `Setup.vue` exists but not as separate page; missing: Duration selector, Preset saving, drag-drop |
| **Active Expeditions** | `/expeditions/active` | **NO** | 0% | Not a separate page; missing: Passive Assignments section, real-time timers |
| **Expedition Results** | `/expeditions/results/:id` | **NO** | 0% | Entire page missing - critical for MVP |
| **Inventory** | `/inventory` | Yes | 80% | Good coverage; missing: Capacity Bar warning colors, Bulk Actions Bar complete, Materials section |
| **Monster Collection** | `/monsters` | Partial (`collection.vue`) | 30% | Needs restructure: Zone Completion view, silhouettes for undiscovered |
| **Settings** | `/settings` | Yes | 70% | Missing: Profile tab (avatar, guild name), Achievements tab, Help tab, Data export |
| **Onboarding** | `/welcome` | **NO** | 0% | Entire flow missing - critical for MVP |

### Components: What Exists vs Spec Requirements

#### Card Components

| Spec Component | Existing Equivalent | Match Level | Issues |
|---------------|---------------------|-------------|--------|
| `HeroCard.vue` | `hero/Card.vue` | 50% | Missing: `variant` prop (compact/default/detailed/selectable), status badges, selected state, disabled state |
| `ItemCard.vue` | `equipment/Card.vue` | 60% | Missing: `variant` prop, comparison mode, set info display, upgrade/downgrade arrows |
| `MonsterCard.vue` | `collection/Monster.vue` | 30% | Missing: placement status, compatibility indicators, draggable support |
| `SchematicCard.vue` | **None** | 0% | Entire component missing (Phase 2) |

#### Display Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `PowerScore.vue` | **NO** | Heroes show power inline, need dedicated component with breakdown |
| `RarityBadge.vue` | **NO** | Rarity shown inline, need standardized badge component |
| `TraitDisplay.vue` | **NO** | Traits shown inline, need component with active/inactive states |
| `StatBar.vue` | **NO** | Stats shown as numbers, need visual bars |
| `EfficiencyIndicator.vue` | **NO** | Efficiency shown as %, need visual tier indicator |
| `XPProgressBar.vue` | **NO** | Need specialized XP bar with milestones |

#### Progress Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `ExpeditionTimer.vue` | **NO** | Timers calculated in pages, need reusable countdown |
| `ProgressBar.vue` | Yes (`ui/ProgressBar.vue`) | 80% match - has variants, colors, sizes. Missing: milestones prop |
| `PhaseIndicator.vue` | **NO** | Need expedition phase visualization |
| `CountdownTimer.vue` | **NO** | Need generic countdown for daily reset, refresh timers |

#### Input Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `TeamSlot.vue` | **NO** | Setup.vue has inline hero selection, need drag-drop slot component |
| `DungeonSlotGrid.vue` | **NO** | Phase 2 |
| `FilterPanel.vue` | **NO** | Filters inline in pages, need reusable collapsible panel |
| `SortDropdown.vue` | **NO** | Sort inline in pages, need reusable dropdown |
| `SearchBar.vue` | **NO** | Need with autocomplete |
| `ViewToggle.vue` | **NO** | Need grid/list toggle button |

#### Economy Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `CurrencyDisplay.vue` | **NO** | Currency shown inline, need formatted display with animations |
| `ResourceCapacity.vue` | **NO** | Capacity shown as text, need visual with warnings |
| `IncomeTracker.vue` | **NO** | Phase 2 - passive income display |

#### Modal Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `BaseModal.vue` | **NO** | Modals use inline div overlays, need proper modal wrapper |
| `RewardModal.vue` | **NO** | Need animated reward reveal |
| `ComparisonModal.vue` | **NO** | Need side-by-side comparison |
| `ConfirmationDialog.vue` | **NO** | Using browser confirm(), need styled dialog |
| `TutorialOverlay.vue` | Partial (`tutorial/Intro.vue`) | 40% - has intro, missing spotlight/tooltip system |

#### Navigation Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `TabNavigation.vue` | **NO** | Tabs inline in settings, need reusable |
| `NotificationBadge.vue` | **NO** | Need badge with count |
| `BreadcrumbNav.vue` | **NO** | Need breadcrumb component |
| `PageHeader.vue` | **NO** | Headers inline in pages |

#### Specialized Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `ExpeditionLog.vue` | Yes (`expedition/Log.vue`) | 60% - exists but needs trait-reaction highlighting |
| `LootTable.vue` | **NO** | Need loot display with drop rates |
| `SynergyIndicator.vue` | **NO** | Phase 2 |
| `SetBonusTracker.vue` | Yes (`equipment/SetBonusDisplay.vue`) | 50% - needs progress tracking |
| `PrestigeBadge.vue` | **NO** | Need visual prestige indicator |
| `SupporterBadge.vue` | **NO** | Need supporter status display |

#### Utility Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `LoadingSpinner.vue` | **NO** | Using inline "Loading..." text |
| `EmptyState.vue` | **NO** | Using inline empty messages |
| `Tooltip.vue` | **NO** | Need hover tooltips |
| `Toast.vue` | Partial (`ui/NotificationCenter.vue`) | 40% - has notifications but not toast pattern |
| `SkeletonLoader.vue` | **NO** | Need loading placeholders |
| `ErrorBoundary.vue` | **NO** | Need error catching wrapper |

#### Form Components

| Spec Component | Existing? | Notes |
|---------------|-----------|-------|
| `BaseInput.vue` | **NO** | Using raw inputs |
| `BaseButton.vue` | **NO** | Using raw buttons with inconsistent styles |
| `BaseSelect.vue` | **NO** | Using raw selects |
| `BaseCheckbox.vue` | **NO** | Using raw checkboxes |
| `BaseToggle.vue` | **NO** | Need toggle switch |

---

## Gap Summary

### Critical Missing Items for MVP

1. **Pages (5 missing)**
   - `/heroes/[heroId].vue` - Hero Detail
   - `/expeditions/team.vue` - Team Formation (separate page)
   - `/expeditions/active.vue` - Active Expeditions
   - `/expeditions/results/[expeditionId].vue` - Expedition Results
   - `/welcome.vue` - Onboarding

2. **Foundation Components (10 missing)**
   - BaseModal, BaseButton, BaseInput, BaseSelect
   - ConfirmationDialog, LoadingSpinner, EmptyState, Toast
   - TabNavigation, PageHeader

3. **Core Feature Components (15 missing)**
   - HeroCard (refactor), PowerScore, RarityBadge, StatBar
   - ExpeditionTimer, CountdownTimer, TeamSlot
   - FilterPanel, SortDropdown, SearchBar, ViewToggle
   - CurrencyDisplay, ResourceCapacity
   - TutorialOverlay (enhance), NotificationBadge

---

## Existing Component Structure

```
app/components/
├── tutorial/           # Intro.vue, MentorQuestPanel.vue, MentorQuestCard.vue
├── zone/               # StationingPanel.vue
├── ui/                 # ProgressBar.vue, NotificationCenter.vue
├── challenges/         # Board.vue
├── tavern/             # Slot.vue
├── equipment/          # Card.vue, Slot.vue, InventoryGrid.vue, SetBonusDisplay.vue
├── collection/         # Set.vue, Monster.vue, Collectible.vue
├── hero/               # Detail.vue, RetirementModal.vue, Card.vue, PrestigeModal.vue, LevelUpModal.vue
├── achievements/       # Card.vue
├── expedition/         # ZoneCard.vue, Active.vue, Log.vue, PartyPresetSelector.vue, SubzoneCard.vue, Setup.vue, EventChoice.vue
├── AppNav.vue
└── AppHeader.vue
```

## Target Component Structure (per 03-components.md)
```
app/components/
├── cards/              # HeroCard, MonsterCard, ItemCard, SchematicCard
├── display/            # PowerScore, RarityBadge, TraitDisplay, StatBar, EfficiencyIndicator, XPProgressBar
├── progress/           # ExpeditionTimer, ProgressBar, PhaseIndicator, CountdownTimer
├── input/              # TeamSlot, DungeonSlotGrid, FilterPanel, SortDropdown, SearchBar, ViewToggle
├── economy/            # CurrencyDisplay, ResourceCapacity, IncomeTracker
├── modals/             # BaseModal, RewardModal, ComparisonModal, ConfirmationDialog, TutorialOverlay
├── navigation/         # TabNavigation, NotificationBadge, BreadcrumbNav, PageHeader
├── specialized/        # ExpeditionLog, LootTable, SynergyIndicator, SetBonusTracker, PrestigeBadge, SupporterBadge
├── utility/            # LoadingSpinner, EmptyState, Tooltip, Toast, SkeletonLoader, ErrorBoundary
└── form/               # BaseInput, BaseButton, BaseSelect, BaseCheckbox, BaseToggle
```

---

## Implementation Phases

### Phase 1: MVP Core Loop (Highest Priority)

**Goal:** Functional gameplay loop - recruit heroes, send expeditions, collect loot, equip gear

#### 1.1 Foundation Components (Week 1)

**Priority: Critical - Block all other work**

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| BaseModal.vue | modals/ | Foundation for all modals | M |
| BaseButton.vue | form/ | Consistent button styling | S |
| BaseInput.vue | form/ | Consistent form inputs | S |
| ConfirmationDialog.vue | modals/ | Reusable confirmations | S |
| LoadingSpinner.vue | utility/ | Loading states | S |
| Toast.vue | utility/ | Notifications | M |
| EmptyState.vue | utility/ | Empty collection states | S |

#### 1.2 Card Components (Week 1-2)

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| HeroCard.vue | cards/ | Unified hero display | M |
| ItemCard.vue | cards/ | Unified item display | M |
| RarityBadge.vue | display/ | Consistent rarity colors | S |
| PowerScore.vue | display/ | Power value display | S |
| StatBar.vue | display/ | Stat visualization | S |

**Note:** Existing `hero/Card.vue` and `equipment/Card.vue` should be migrated/refactored to match spec.

#### 1.3 Progress Components (Week 2)

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| ExpeditionTimer.vue | progress/ | Countdown timers | M |
| ProgressBar.vue | progress/ | XP, capacity bars | S (exists, enhance) |
| XPProgressBar.vue | display/ | Hero XP with milestones | M |
| CountdownTimer.vue | progress/ | Generic countdowns | S |

#### 1.4 Input/Filter Components (Week 2)

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| TeamSlot.vue | input/ | Drag-drop hero slots | L |
| FilterPanel.vue | input/ | Reusable filter UI | M |
| SortDropdown.vue | input/ | Consistent sorting | S |
| ViewToggle.vue | input/ | Grid/list toggle | S |
| SearchBar.vue | input/ | Search with autocomplete | M |

#### 1.5 Navigation Components (Week 2)

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| TabNavigation.vue | navigation/ | Multi-section tabs | M |
| NotificationBadge.vue | navigation/ | Action indicators | S |
| PageHeader.vue | navigation/ | Consistent page headers | S |
| BreadcrumbNav.vue | navigation/ | Nested navigation | S |

#### 1.6 Economy Components (Week 2)

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| CurrencyDisplay.vue | economy/ | Gold/gems display | S |
| ResourceCapacity.vue | economy/ | Inventory capacity | S |

#### 1.7 Missing Pages (Week 3-4)

| Page | Route | Priority | Effort | Dependencies |
|------|-------|----------|--------|--------------|
| Hero Detail | `/heroes/[heroId].vue` | Critical | L | HeroCard, StatBar, TraitDisplay |
| Team Formation | `/expeditions/team.vue` | Critical | L | TeamSlot, HeroCard, EfficiencyIndicator |
| Active Expeditions | `/expeditions/active.vue` | Critical | M | ExpeditionTimer, HeroCard |
| Expedition Results | `/expeditions/results/[expeditionId].vue` | Critical | L | ItemCard, RewardModal, ExpeditionLog |
| Onboarding/Welcome | `/welcome.vue` | High | L | TutorialOverlay, HeroCard |

#### 1.8 Phase 1 Modals (~35 modals)

**Critical MVP Modals:**
- Welcome Screen Modal
- Account Creation Modal
- Login Modal
- Link Guest Account Modal
- First Hero Reveal Modal
- UI Tour Overlay
- Tutorial Step Modals
- Hero Detail Modal
- Recruit Confirmation Dialog
- Hero Release Warning Modal
- Level Up Celebration Popup
- Zone Selection Info Overlay
- Team Formation Modal
- Expedition Launch Confirmation
- Expedition Completion Results Modal
- Expedition Log Viewer Modal
- Inventory Grid/List View
- Item Detail Modal
- Item Comparison Modal
- Equip Item Confirmation
- Sell Confirmation Dialog
- Inventory Full Warning
- Loot Results Modal
- Settings Modal
- Help Menu Modal
- Error Modal
- Generic Confirmation Dialog
- Loading Overlay
- Notification Toast System
- Insufficient Currency Modal
- Zone Unlock Celebration
- Contextual Tooltip Popups

---

### Phase 2: Dungeon Building System

**Goal:** Complete dungeon building loop - capture monsters, collect schematics, build dungeons

#### 2.1 Phase 2 Components

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| MonsterCard.vue | cards/ | Monster display | M |
| SchematicCard.vue | cards/ | Schematic display | M |
| DungeonSlotGrid.vue | input/ | Monster placement | L |
| TraitDisplay.vue | display/ | Hero trait display | M |
| EfficiencyIndicator.vue | display/ | Expedition efficiency | M |
| PhaseIndicator.vue | progress/ | Expedition phases | S |
| RewardModal.vue | modals/ | Loot celebration | M |
| TutorialOverlay.vue | modals/ | Guided tutorials | L |
| ExpeditionLog.vue | specialized/ | Narrative logs | M |
| LootTable.vue | specialized/ | Drop rate display | M |
| IncomeTracker.vue | economy/ | Passive income | M |

#### 2.2 Phase 2 Pages

| Page | Route | Priority | Effort |
|------|-------|----------|--------|
| Monster Collection | `/monsters.vue` | High | M |
| Schematic Collection | `/schematics.vue` | High | M |
| Dungeon Builder | `/dungeons/build/[schematicId].vue` | High | L |
| My Dungeons | `/dungeons/index.vue` | High | M |
| Shop | `/shop.vue` | Medium | M |

#### 2.3 Phase 2 Modals (~30 modals)

- Monster Collection Browser
- Monster Detail Modal
- Monster Capture Celebration
- Schematic Collection Browser
- Schematic Detail Modal
- Dungeon Builder Modal
- Dungeon Loot Preview Modal
- Dungeon Deactivation Confirmation
- Dungeon Swap Monster Confirmation
- Supporter Slot Limit Modal
- Auto-Equip Preview Modal
- Salvage Confirmation Dialog
- Set Bonus Information Modal
- Daily Login Calendar
- Daily/Weekly Quests Panel
- Quest Completion Celebration
- Supporter Pack Store Modal
- Purchase Confirmation Modal
- Purchase Success Modal
- Recruitment Pool Refresh Confirmation
- Expand Slots Confirmation
- Welcome Back Modal
- Recall Expedition Warning
- Speed-Up Confirmation
- Story Mission Cutscene Modal
- Story Mission Requirements Modal
- Dungeon Run Setup Modal
- Passive Income Collection Popup
- Expedition Progress Toasts
- First Monster Capture Celebration
- First Dungeon Build Tutorial Overlay
- Suggested Next Actions Panel
- Notification History Modal
- Hint/Tip Popup
- Sync Conflict Resolution Modal
- Maintenance Notice Modal

---

### Phase 3: Depth & Polish

#### 3.1 Phase 3 Components

| Component | Location | Purpose | Effort |
|-----------|----------|---------|--------|
| SynergyIndicator.vue | specialized/ | Dungeon synergies | M |
| SetBonusTracker.vue | specialized/ | Equipment sets | M |
| PrestigeBadge.vue | specialized/ | Hero prestige | S |
| SupporterBadge.vue | specialized/ | Supporter status | S |
| ComparisonModal.vue | modals/ | Side-by-side compare | M |
| Tooltip.vue | utility/ | Contextual help | M |
| SkeletonLoader.vue | utility/ | Content loading | S |
| ErrorBoundary.vue | utility/ | Error handling | M |

#### 3.2 Phase 3+ Modals (~25 modals)

- Hero Comparison Modal
- Prestige Confirmation Modal
- Prestige Calculator Modal
- Bulk Hero Release Modal
- Gear Recommendations Modal
- Hero Lock Confirmation
- Trait Reroll Modal
- Synergy Discovery Celebration
- Synergy Codex Modal
- Dungeon Statistics Modal
- Auto-Salvage Settings Modal
- Set Planner Modal
- Upgrade Available Notification
- Equipment Loadout Manager
- Drop Rate Information Modal
- Achievement Unlock Celebration
- Achievement Browser Modal
- Guild Naming Modal
- Milestone Celebration Modal
- What's New Modal
- Account Deletion Confirmation
- Cosmetics Application Modal
- Personal Goals Modal
- Feedback/Report Modal
- Data Export Confirmation

---

## Store Requirements

### Existing Stores (13)
- guildMaster.ts
- achievements.ts
- notifications.ts
- heroes.ts
- presets.ts
- game.ts
- tavern.ts
- stationing.ts
- challenges.ts
- zones.ts
- expeditions.ts
- tutorial.ts
- inventory.ts

### Potential Missing Stores
| Store | Purpose | Phase |
|-------|---------|-------|
| useAuthStore | Authentication state | 1 |
| useOnboardingStore | Tutorial progress | 1 |
| useMonstersStore | Monster collection | 2 |
| useSchematicsStore | Schematic collection | 2 |
| useDungeonsStore | Player dungeons | 2 |
| useShopStore | Shop/purchases | 2 |
| useQuestsStore | Daily/weekly quests | 2 |

---

## Implementation Order Summary

### Sprint 1: Foundation
1. Form components (BaseButton, BaseInput, BaseSelect, BaseCheckbox, BaseToggle)
2. Utility components (LoadingSpinner, EmptyState, Toast, SkeletonLoader)
3. Modal foundation (BaseModal, ConfirmationDialog)

### Sprint 2: Card & Display System
1. Card components (HeroCard, ItemCard)
2. Display components (RarityBadge, PowerScore, StatBar)
3. Refactor existing hero/Card.vue and equipment/Card.vue

### Sprint 3: Navigation & Input
1. Navigation (TabNavigation, PageHeader, BreadcrumbNav, NotificationBadge)
2. Input (FilterPanel, SortDropdown, ViewToggle, SearchBar)
3. Economy (CurrencyDisplay, ResourceCapacity)

### Sprint 4: Progress & Timers
1. Progress components (ExpeditionTimer, ProgressBar, XPProgressBar, CountdownTimer)
2. TeamSlot component (drag-and-drop)

### Sprint 5: Missing MVP Pages
1. Hero Detail page (`/heroes/[heroId].vue`)
2. Onboarding/Welcome page (`/welcome.vue`)

### Sprint 6: Expedition Pages
1. Team Formation page (`/expeditions/team.vue`)
2. Active Expeditions page (`/expeditions/active.vue`)
3. Expedition Results page (`/expeditions/results/[expeditionId].vue`)

### Sprint 7: MVP Modals
1. Onboarding modals (Welcome, Account Creation, Login, Guest Link)
2. Hero modals (Detail, Release Warning, Level Up)
3. Expedition modals (Zone Info, Launch Confirm, Results)

### Sprint 8: Inventory & Settings Modals
1. Inventory modals (Item Detail, Comparison, Equip Confirm, Sell)
2. System modals (Error, Confirmation, Loading, Toast, Help)

---

## Technical Notes

### Component Architecture
- All components should follow TypeScript interfaces defined in 03-components.md
- Use variant props for different contexts (compact, detailed, selectable)
- Implement loading and empty states for all data-driven components
- Support both grid and list views where applicable

### State Management
- Use Pinia stores for all shared state
- Actions should use `$fetch` (not `useFetch`) per Nuxt 4 best practices
- Use `storeToRefs()` for reactive state destructuring

### Accessibility
- All interactive components need ARIA labels
- Focus trap for modals
- Keyboard navigation support
- Screen reader friendly

### Mobile-First
- Design for mobile breakpoints first
- Touch-friendly drag-and-drop
- Collapsible/scrollable tabs on mobile

---

## Success Criteria

### Phase 1 MVP Complete When:
- [ ] Player can create account or play as guest
- [ ] Player can view and manage hero roster
- [ ] Player can recruit heroes from tavern
- [ ] Player can equip gear to heroes
- [ ] Player can launch expeditions and form teams
- [ ] Player can view active expeditions with timers
- [ ] Player can collect expedition rewards
- [ ] Player can read expedition logs
- [ ] Player can manage inventory
- [ ] Tutorial guides new players

### Phase 2 Complete When:
- [ ] Player can capture monsters during expeditions
- [ ] Player can view monster collection
- [ ] Player can find and view schematics
- [ ] Player can build dungeons from schematics
- [ ] Player can run dungeon expeditions
- [ ] Player can purchase supporter pack
- [ ] Daily login and quests functional

---

## Risk Mitigation

1. **Scope Creep:** Strictly follow phase priorities; defer non-MVP features
2. **Component Reuse:** Build foundation components first; avoid duplication
3. **Performance:** Implement virtual scrolling for large lists early
4. **Testing:** Write component tests alongside development
5. **Mobile:** Test on mobile devices throughout development

---

*This plan should be updated as implementation progresses.*
