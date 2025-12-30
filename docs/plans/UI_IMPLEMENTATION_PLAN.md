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

## Gap Analysis

### Pages - Existing vs Required

| # | Required Page | Route | Phase | Status | Notes |
|---|---------------|-------|-------|--------|-------|
| 1 | Dashboard | `/` | 1 | Exists | `index.vue` - needs enhancement |
| 2 | Heroes Roster | `/heroes` | 1 | Exists | `heroes.vue` - needs review |
| 3 | Hero Detail | `/heroes/:heroId` | 1 | **MISSING** | Need dynamic route page |
| 4 | Tavern | `/tavern` | 1 | Exists | `tavern.vue` - needs review |
| 5 | Expeditions Hub | `/expeditions` | 1 | Exists | `expeditions.vue` - needs enhancement |
| 6 | Team Formation | `/expeditions/team` | 1 | **MISSING** | Critical for MVP |
| 7 | Active Expeditions | `/expeditions/active` | 1 | **MISSING** | Critical for MVP |
| 8 | Expedition Results | `/expeditions/results/:expeditionId` | 1 | **MISSING** | Critical for MVP |
| 9 | Inventory | `/inventory` | 1 | Exists | `inventory.vue` - needs review |
| 10 | Monster Collection | `/monsters` | 2 | Partial | `collection.vue` exists |
| 11 | Schematic Collection | `/schematics` | 2 | **MISSING** | Phase 2 |
| 12 | Dungeon Builder | `/dungeons/build/:schematicId` | 2 | **MISSING** | Phase 2 |
| 13 | My Dungeons | `/dungeons` | 2 | **MISSING** | Phase 2 |
| 14 | Shop | `/shop` | 2 | **MISSING** | Phase 2 |
| 15 | Settings | `/settings` | 1 | Exists | `settings.vue` - needs enhancement |
| 16 | Onboarding | `/welcome` | 1 | **MISSING** | Critical for MVP |

### Component Gap Analysis

#### Existing Components (30)
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

#### Required Structure (per 03-components.md)
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
