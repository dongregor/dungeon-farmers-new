# Dungeon Farmers - Comprehensive Test Coverage Plan

**Created:** 2025-12-31
**Based On:** User Stories (187+), UI Design Docs, UI Implementation Plan
**Status:** Planning Complete

---

## Executive Summary

This plan provides comprehensive test coverage for Dungeon Farmers based on the documented user stories, UI components, and implementation requirements. The testing strategy follows a pyramid approach: many unit tests, fewer integration tests, and minimal but critical E2E tests.

### Testing Stack
- **Unit/Integration Tests:** Vitest
- **Component Tests:** Vitest + Vue Test Utils + @nuxt/test-utils
- **E2E Tests:** Playwright
- **Coverage:** vitest coverage (c8/istanbul)

### Coverage Targets
| Test Type | Target Coverage | Priority |
|-----------|----------------|----------|
| Utility Functions | 90%+ | Critical |
| Pinia Stores | 85%+ | Critical |
| Vue Components | 80%+ | High |
| API Routes | 85%+ | Critical |
| Integration Tests | Key flows covered | High |
| E2E Tests | Critical paths | High |

---

## Table of Contents

1. [Unit Tests](#1-unit-tests)
2. [Store Tests](#2-store-tests)
3. [Component Tests](#3-component-tests)
4. [API Route Tests](#4-api-route-tests)
5. [Integration Tests](#5-integration-tests)
6. [E2E Tests](#6-e2e-tests)
7. [Test Data & Fixtures](#7-test-data--fixtures)
8. [Implementation Priority](#8-implementation-priority)

---

## 1. Unit Tests

### 1.1 Hero System Utilities

**File:** `tests/unit/utils/heroGenerator.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `generateHero()` | Generate hero with correct structure | US-HM-001 |
| | Enforce rarity trait counts (Common: 1-2, Legendary: 3-4) | US-HM-012 |
| | Generate correct archetype base stats | US-HM-011 |
| | Generate valid names from culture pools | US-OB-007 |
| | Apply forceRarity/forceArchetype options | - |
| `generateHeroName()` | Generate culturally appropriate names | - |
| | Generate gender-appropriate names | - |

**File:** `tests/unit/utils/powerCalculator.test.ts` ✅ (Exists - Enhance)

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `calculateHeroPower()` | Calculate base power from stats | US-HM-011 |
| | Include level scaling | US-HM-020 |
| | Include prestige bonuses | US-HM-026 |
| | Include gear score contribution | US-HM-015 |
| | Include trait bonuses | US-HM-012 |
| `calculateTeamPower()` | Sum individual hero powers | US-EX-002 |
| | Handle empty team | - |
| | Handle single hero team | - |

**File:** `tests/unit/utils/traitService.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `getActiveTraits()` | Return flat bonus traits (always active) | US-HM-012 |
| | Evaluate conditional traits by context | US-HM-013 |
| | Match tag traits to content requirements | US-EX-011 |
| `applyTraitBonuses()` | Apply flat stat bonuses | US-HM-012 |
| | Apply percentage multipliers | - |
| `getTraitReactions()` | Generate trait-based dialogue | US-EX-028 |

### 1.2 Expedition System Utilities

**File:** `tests/unit/utils/efficiencyCalculator.test.ts` ✅ (Exists - Enhance)

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `calculateEfficiency()` | Return 60-150% range | US-EX-023 |
| | Base power contribution (60-100%) | US-EX-011 |
| | Slot match bonus (+20%) | US-EX-011 |
| | Tag bonus (+30%) | US-EX-011 |
| | Apply trait conditional multipliers | US-HM-013 |
| `calculateRewardMultiplier()` | Scale rewards by efficiency | US-EX-023 |

**File:** `tests/unit/utils/expeditionEngine.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `startExpedition()` | Create expedition with correct structure | US-EX-004 |
| | Calculate end time from duration | US-EX-003 |
| | Mark heroes as on expedition | US-EX-004 |
| | Validate team meets requirements | US-EX-002 |
| `completeExpedition()` | Generate rewards at completion | US-EX-022 |
| | Apply efficiency to rewards | US-EX-023 |
| | Award XP to heroes | US-HM-020 |
| | Free heroes from expedition | US-EX-022 |
| `generateExpeditionEvents()` | Create phase-based events | US-EX-019 |
| | Generate trait-triggered events | US-EX-028 |

**File:** `tests/unit/utils/logGenerator.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `generateExpeditionLog()` | Create chronological event list | US-EX-027 |
| | Include combat encounters | US-EX-027 |
| | Include hero trait reactions | US-EX-028 |
| | Include loot discoveries | US-EX-025 |
| `generateHeroReaction()` | Match reaction to hero traits | US-EX-028 |
| | Vary reactions for same event | US-EX-028 |

### 1.3 Loot & Equipment Utilities

**File:** `tests/unit/utils/lootGenerator.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `generateExpeditionLoot()` | Generate correct drop count | US-EQ-019 |
| | Scale item level by zone difficulty | US-EQ-019 |
| | Apply mastery bonus to drops | - |
| | Apply efficiency multiplier | US-EX-023 |
| `generateFirstClearReward()` | Guarantee upgraded rarity | - |
| `generateDungeonLoot()` | Use monster loot tables | US-DB-026 |
| | Apply synergy bonuses | US-DB-020 |

**File:** `tests/unit/utils/equipmentService.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `calculateGearScore()` | Sum stats with rarity multiplier | US-EQ-007 |
| | Include item level contribution | US-EQ-007 |
| `getSetBonuses()` | Calculate active set bonuses | US-EQ-013 |
| | Return 2pc, 4pc, 6pc bonuses | US-EQ-006 |
| `isUpgrade()` | Compare gear score | US-EQ-016 |
| | Consider set bonus impact | US-EQ-017 |

### 1.4 Dungeon Building Utilities

**File:** `tests/unit/utils/dungeonBuilder.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `validatePlacement()` | Check slot type compatibility | US-DB-015 |
| | Validate monster meets requirements | US-DB-015 |
| | Return detailed error messages | US-DB-015 |
| `calculateDungeonPower()` | Sum monster powers | US-DB-028 |
| | Include synergy bonuses | US-DB-020 |
| `getSynergies()` | Detect basic synergies | US-DB-020 |
| | Detect hidden synergies | US-DB-021 |
| `calculateDungeonLoot()` | Combine monster loot tables | US-DB-017 |

### 1.5 Monster & Capture Utilities

**File:** `tests/unit/utils/monsterService.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `calculateCaptureRate()` | Base rate by monster rarity | US-DB-006 |
| | Apply efficiency modifier | US-DB-005 |
| | Apply trait bonuses | US-DB-005 |
| `attemptCapture()` | Return success/failure with roll | US-DB-008 |
| | Log near-misses | US-DB-008 |
| `getMonstersByZone()` | Filter monsters by zone | US-DB-009 |

### 1.6 Progression Utilities

**File:** `tests/unit/utils/progressionService.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `calculateXpGain()` | Scale by expedition duration | US-HM-020 |
| | Scale by efficiency | US-HM-020 |
| `levelUp()` | Increase stats | US-HM-021 |
| | Unlock trait slots at milestones | US-HM-014 |
| `canPrestige()` | Check max level requirement | US-HM-024 |
| `applyPrestige()` | Reset level, keep bonuses | US-HM-025 |
| | Calculate permanent stat bonuses | US-HM-026 |

**File:** `tests/unit/utils/offlineProgress.test.ts` ✅ (Exists - Enhance)

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `calculateOfflineProgress()` | Calculate completed expeditions | US-EX-031 |
| | Calculate passive income | US-EX-032 |
| | Cap at max offline time | US-OB-023 |
| `processOfflineReturns()` | Return heroes from completed | US-EX-031 |
| | Queue rewards for collection | US-OB-023 |

### 1.7 Economy Utilities

**File:** `tests/unit/utils/economyService.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| `calculateRecruitCost()` | Scale by rarity | US-HM-007 |
| `calculateSellValue()` | Return partial refund | US-EQ-022 |
| `calculateSalvageValue()` | Return materials by rarity | US-EQ-023 |
| `canAfford()` | Check currency balance | - |
| `formatCurrency()` | Abbreviate large numbers | - |

---

## 2. Store Tests

### 2.1 Hero Store

**File:** `tests/stores/heroes.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Initialize with empty roster | - |
| | Load heroes from API | US-HM-001 |
| Actions: `fetchHeroes()` | Call API and populate state | US-HM-001 |
| | Handle loading/error states | - |
| Actions: `equipItem()` | Update hero equipment | US-HM-016 |
| | Unequip previous item | US-HM-016 |
| | Recalculate hero power | US-HM-011 |
| Actions: `levelUp()` | Increment level | US-HM-021 |
| | Award new traits at milestones | US-HM-014 |
| Actions: `prestige()` | Reset hero with bonuses | US-HM-025 |
| Actions: `releaseHero()` | Remove from roster | US-HM-028 |
| | Return refund | US-HM-028 |
| Getters: `availableHeroes` | Filter out busy heroes | US-EX-002 |
| Getters: `sortedHeroes` | Sort by current criteria | US-HM-002 |
| Getters: `filteredHeroes` | Apply active filters | US-HM-003 |

### 2.2 Expedition Store

**File:** `tests/stores/expeditions.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Initialize with empty expeditions | - |
| Actions: `startExpedition()` | Create new expedition | US-EX-004 |
| | Mark heroes as busy | US-EX-004 |
| | Validate concurrent limit | US-EX-005 |
| Actions: `completeExpedition()` | Process rewards | US-EX-022 |
| | Free heroes | US-EX-022 |
| | Generate log | US-EX-027 |
| Actions: `recallExpedition()` | Award partial rewards | US-EX-021 |
| | Free heroes early | US-EX-021 |
| Getters: `activeExpeditions` | Return in-progress only | US-EX-018 |
| Getters: `completedExpeditions` | Return awaiting collection | US-EX-022 |

### 2.3 Tavern Store

**File:** `tests/stores/tavern.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Track daily recruitment count | US-PM-005 |
| | Track pool refresh time | US-PM-010 |
| Actions: `fetchRecruitmentPool()` | Generate hero options | US-HM-007 |
| Actions: `recruitHero()` | Add hero to roster | US-HM-008 |
| | Deduct gold | US-HM-008 |
| | Increment daily count | US-PM-005 |
| | Enforce daily cap (free) | US-PM-005 |
| Actions: `refreshPool()` | Spend gems | US-PM-010 |
| | Generate new options | US-PM-010 |
| Getters: `canRecruit` | Check gold and cap | US-HM-008 |

### 2.4 Inventory Store

**File:** `tests/stores/inventory.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Track items and capacity | US-EQ-001 |
| Actions: `addItems()` | Add to inventory | US-EQ-019 |
| | Check capacity | US-EQ-003 |
| Actions: `equipToHero()` | Move item to hero | US-EQ-009 |
| Actions: `sellItems()` | Remove and add gold | US-EQ-022 |
| Actions: `salvageItems()` | Remove and add materials | US-EQ-023 |
| Actions: `lockItem()` | Prevent accidental disposal | US-EQ-025 |
| Getters: `sortedItems` | Sort by criteria | US-EQ-002 |
| Getters: `upgrades` | Filter upgrades for hero | US-EQ-016 |

### 2.5 Monster Store

**File:** `tests/stores/monsters.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Track captured monsters | US-DB-001 |
| Actions: `captureMonster()` | Add to collection | US-DB-005 |
| | Track first-time captures | US-DB-007 |
| Getters: `monstersByType` | Group by type | US-DB-001 |
| Getters: `collectionProgress` | Calculate completion % | US-DB-003 |

### 2.6 Dungeon Store

**File:** `tests/stores/dungeons.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Track active dungeons and drafts | US-DB-014 |
| Actions: `createDungeon()` | Validate and create | US-DB-014 |
| | Enforce slot limits | US-DB-030 |
| Actions: `updateDungeon()` | Swap monsters | US-DB-029 |
| Actions: `deactivateDungeon()` | Free slot | US-DB-030 |
| Actions: `startDungeonRun()` | Create farming expedition | US-DB-025 |
| Getters: `buildableSchematics` | Filter by owned monsters | US-DB-012 |

### 2.7 Game Store

**File:** `tests/stores/game.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Track currencies and player state | US-EQ-027 |
| Actions: `spendGold()` | Deduct with validation | - |
| Actions: `earnGold()` | Add gold | US-PM-039 |
| Actions: `spendGems()` | Deduct premium currency | US-PM-010 |
| Getters: `isSupporter` | Check supporter status | US-PM-017 |

### 2.8 Tutorial/Onboarding Store

**File:** `tests/stores/tutorial.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Track tutorial progress | US-OB-010 |
| Actions: `completeStep()` | Mark step done | US-OB-010 |
| Actions: `skipTutorial()` | Mark all complete | US-OB-008 |
| Getters: `currentStep` | Return next uncompleted | - |
| Getters: `isComplete` | Check all steps done | - |

### 2.9 Auth Store

**File:** `tests/stores/auth.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| State | Track user session | US-OB-003 |
| Actions: `login()` | Authenticate user | US-OB-003 |
| Actions: `logout()` | Clear session | - |
| Actions: `createAccount()` | Register new user | US-OB-002 |
| Actions: `linkGuestAccount()` | Migrate guest data | US-OB-005 |
| Getters: `isGuest` | Check guest status | US-OB-001 |
| Getters: `isAuthenticated` | Check logged in | - |

---

## 3. Component Tests

### 3.1 Card Components

**File:** `tests/components/cards/HeroCard.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display hero name, level, rarity | US-HM-001 |
| | Show power score | US-HM-011 |
| | Show status badge (idle/busy) | US-HM-001 |
| | Render all variants (compact/detailed) | - |
| Props | Apply selected state styling | - |
| | Apply disabled state | US-EX-002 |
| | Show prestige badge | US-HM-026 |
| Events | Emit click event | - |
| | Emit select event | - |

**File:** `tests/components/cards/ItemCard.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display item name, rarity, stats | US-EQ-001 |
| | Show gear score | US-EQ-007 |
| | Show set badge | US-EQ-006 |
| | Show equipped indicator | US-EQ-015 |
| Props | Highlight upgrades (green arrow) | US-EQ-016 |
| | Show locked icon | US-EQ-025 |
| | Show comparison mode | US-EQ-008 |

**File:** `tests/components/cards/MonsterCard.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display monster info | US-DB-001 |
| | Show rarity indicator | US-DB-004 |
| | Show placement status | US-DB-015 |
| Props | Apply draggable behavior | US-DB-015 |
| | Show compatibility indicator | US-DB-015 |

**File:** `tests/components/cards/SchematicCard.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display schematic info | US-DB-010 |
| | Show slot requirements | US-DB-011 |
| | Show buildable indicator | US-DB-012 |

### 3.2 Display Components

**File:** `tests/components/display/RarityBadge.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Apply correct color per rarity | - |
| | Render all size variants | - |
| | Render text/badge/border variants | - |

**File:** `tests/components/display/PowerScore.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display formatted number | US-HM-011 |
| | Show comparison difference | US-HM-005 |
| | Toggle breakdown display | US-HM-011 |

**File:** `tests/components/display/StatBar.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display stat name and value | US-HM-011 |
| | Fill bar proportionally | - |
| | Show comparison highlighting | US-EQ-009 |

**File:** `tests/components/display/TraitDisplay.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show trait name and description | US-HM-012 |
| | Indicate active/inactive state | US-HM-013 |
| | Style by trait type | US-HM-012 |

**File:** `tests/components/display/EfficiencyIndicator.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display percentage | US-EX-023 |
| | Apply tier color (bronze/silver/gold) | US-EX-011 |
| | Show breakdown on expand | US-EX-011 |

### 3.3 Progress Components

**File:** `tests/components/progress/ExpeditionTimer.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display countdown format | US-EX-018 |
| | Update in real-time | US-EX-018 |
| | Show "Completing..." state | US-EX-018 |
| | Show "Ready!" when complete | US-EX-022 |
| Props | Show progress bar optionally | US-EX-019 |
| Events | Emit complete event | - |

**File:** `tests/components/progress/ProgressBar.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Calculate fill percentage | - |
| | Show label text | - |
| | Display milestone markers | - |
| | Apply color variants | - |

**File:** `tests/components/progress/XPProgressBar.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show XP and percentage | US-HM-022 |
| | Highlight next milestone | US-HM-023 |

### 3.4 Input Components

**File:** `tests/components/input/TeamSlot.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show empty state with requirement | US-EX-002 |
| | Display assigned hero | US-EX-002 |
| Interaction | Accept valid drops | US-EX-002 |
| | Reject invalid drops | US-EX-007 |
| Events | Emit hero-assigned event | - |

**File:** `tests/components/input/FilterPanel.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display filter options | US-HM-003 |
| | Show active filter count | US-HM-003 |
| Interaction | Toggle filter values | - |
| | Clear all filters | US-HM-003 |
| Events | Emit filter-change event | - |

**File:** `tests/components/input/SortDropdown.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display current sort option | US-HM-002 |
| | Show sort direction indicator | - |
| Interaction | Select sort option | US-HM-002 |
| | Toggle direction | - |

**File:** `tests/components/input/ViewToggle.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show grid/list icons | - |
| | Highlight current view | - |
| Interaction | Toggle between views | US-HM-001 |

### 3.5 Economy Components

**File:** `tests/components/economy/CurrencyDisplay.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Format currency value | US-EQ-027 |
| | Abbreviate large numbers | - |
| | Show currency icon | - |
| Animations | Animate on value change | US-EQ-027 |

**File:** `tests/components/economy/ResourceCapacity.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show current/max | US-EQ-003 |
| | Apply warning color at 80% | US-EQ-003 |
| | Apply full color at 100% | US-EQ-003 |

### 3.6 Modal Components

**File:** `tests/components/modals/BaseModal.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show/hide based on isOpen | - |
| | Display title | - |
| | Apply size variant | - |
| Interaction | Close on escape key | - |
| | Close on overlay click | - |
| | Trap focus within modal | - |
| Accessibility | Apply ARIA attributes | - |

**File:** `tests/components/modals/ConfirmationDialog.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display message and buttons | US-HM-028 |
| | Apply variant styling | US-HM-030 |
| Interaction | Emit confirm event | - |
| | Emit cancel event | - |

**File:** `tests/components/modals/RewardModal.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display rewards list | US-EX-022 |
| | Highlight rare items | US-EX-025 |
| Animation | Animate reveal | - |

### 3.7 Navigation Components

**File:** `tests/components/navigation/TabNavigation.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display tab labels | - |
| | Show active tab | - |
| | Display badges | - |
| Interaction | Switch tabs on click | - |
| Events | Emit tab-change event | - |

**File:** `tests/components/navigation/NotificationBadge.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show count | US-EX-022 |
| | Show "99+" for large counts | - |
| | Position correctly | - |
| | Apply pulse animation | - |

**File:** `tests/components/navigation/PageHeader.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display title and subtitle | - |
| | Show action buttons | - |
| | Show back link | - |

### 3.8 Utility Components

**File:** `tests/components/utility/LoadingSpinner.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Show spinner animation | - |
| | Display loading text | - |
| | Apply size variant | - |

**File:** `tests/components/utility/EmptyState.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display message | - |
| | Show icon | - |
| | Display action button | - |
| Events | Emit action click | - |

**File:** `tests/components/utility/Toast.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display message | - |
| | Apply variant styling | - |
| | Show action button | - |
| Behavior | Auto-dismiss after duration | - |
| | Dismiss on click | - |

### 3.9 Form Components

**File:** `tests/components/form/BaseButton.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Apply variant styling | - |
| | Show loading state | - |
| | Apply disabled state | - |
| | Display icon | - |
| Events | Emit click event | - |
| | Prevent click when disabled | - |

**File:** `tests/components/form/BaseInput.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Rendering | Display label | - |
| | Show placeholder | - |
| | Display error message | - |
| Interaction | Update v-model | - |
| Validation | Apply error styling | - |

---

## 4. API Route Tests

### 4.1 Hero API Routes

**File:** `tests/server/api/heroes.test.ts` ✅ (Exists - Enhance)

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `GET /api/heroes` | Return player's heroes | US-HM-001 |
| | Apply pagination | - |
| | Handle unauthenticated | - |
| `GET /api/heroes/[id]` | Return hero details | US-HM-004 |
| | Return 404 for missing | - |
| `PATCH /api/heroes/[id]` | Update hero data | - |
| | Validate ownership | - |
| `PATCH /api/heroes/[id]/equip` | Equip item to hero | US-HM-016 |
| | Validate item ownership | - |
| | Return updated hero | - |
| `POST /api/heroes/[id]/prestige` | Process prestige | US-HM-025 |
| | Validate max level | US-HM-024 |
| `DELETE /api/heroes/[id]` | Release hero | US-HM-028 |
| | Return refund amount | US-HM-028 |

### 4.2 Tavern API Routes

**File:** `tests/server/api/tavern.test.ts` ✅ (Exists - Enhance)

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `GET /api/tavern/pool` | Return recruitment options | US-HM-007 |
| | Generate pool if expired | - |
| `POST /api/tavern/recruit` | Create new hero | US-HM-008 |
| | Deduct gold | US-HM-008 |
| | Enforce daily cap | US-PM-005 |
| | Check roster capacity | US-HM-001 |
| `POST /api/tavern/refresh` | Refresh pool | US-PM-010 |
| | Deduct gems | US-PM-010 |

### 4.3 Expedition API Routes

**File:** `tests/server/api/expeditions.test.ts` ✅ (Exists - Enhance)

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `GET /api/expeditions` | Return player's expeditions | - |
| | Filter by status | - |
| `GET /api/expeditions/active` | Return in-progress only | US-EX-018 |
| `POST /api/expeditions` | Start new expedition | US-EX-004 |
| | Validate team composition | US-EX-002 |
| | Enforce concurrent limit | US-EX-005 |
| | Mark heroes as busy | US-EX-004 |
| `POST /api/expeditions/[id]/complete` | Process completion | US-EX-022 |
| | Generate rewards | US-EX-023 |
| | Generate log | US-EX-027 |
| | Award XP | US-HM-020 |
| `POST /api/expeditions/[id]/recall` | Early termination | US-EX-021 |
| | Award partial rewards | US-EX-021 |

### 4.4 Equipment API Routes

**File:** `tests/server/api/equipment.test.ts` ✅ (Exists - Enhance)

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `GET /api/inventory` | Return player's items | US-EQ-001 |
| | Apply filters | US-EQ-002 |
| `GET /api/inventory/[id]` | Return item details | US-EQ-005 |
| `POST /api/inventory/sell` | Sell items | US-EQ-022 |
| | Validate ownership | - |
| | Return gold gained | US-EQ-022 |
| `POST /api/inventory/salvage` | Salvage items | US-EQ-023 |
| | Return materials gained | US-EQ-023 |
| `PATCH /api/inventory/[id]/lock` | Toggle lock status | US-EQ-025 |

### 4.5 Zone API Routes

**File:** `tests/server/api/zones.test.ts`

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `GET /api/zones` | Return all zones | US-EX-001 |
| | Include unlock status | US-PM-001 |
| | Include familiarity | US-EX-001 |
| `GET /api/zones/[id]` | Return zone details | US-EX-001 |
| | Include subzones | US-EX-001 |

### 4.6 Dungeon API Routes

**File:** `tests/server/api/dungeons.test.ts`

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `GET /api/dungeons` | Return player's dungeons | US-DB-029 |
| | Include schematics | US-DB-010 |
| `POST /api/dungeons` | Create dungeon | US-DB-014 |
| | Validate placements | US-DB-015 |
| | Enforce slot limit | US-DB-030 |
| `PATCH /api/dungeons/[id]` | Update dungeon | US-DB-029 |
| | Swap monsters | US-DB-029 |
| `DELETE /api/dungeons/[id]` | Deactivate dungeon | US-DB-030 |
| `POST /api/dungeons/[id]/start` | Start dungeon run | US-DB-025 |

### 4.7 Monster API Routes

**File:** `tests/server/api/monsters.test.ts`

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `GET /api/monsters` | Return collection | US-DB-001 |
| | Include placement status | US-DB-015 |
| `GET /api/monsters/[id]` | Return monster details | US-DB-002 |
| | Include loot table | US-DB-002 |

### 4.8 Auth API Routes

**File:** `tests/server/api/auth.test.ts`

| Endpoint | Test Cases | User Stories |
|----------|------------|--------------|
| `POST /api/auth/guest` | Create guest session | US-OB-001 |
| `POST /api/auth/register` | Create account | US-OB-002 |
| | Validate email format | - |
| | Validate password strength | US-OB-002 |
| `POST /api/auth/login` | Authenticate user | US-OB-003 |
| | Rate limit attempts | US-OB-003 |
| `POST /api/auth/link` | Link guest to account | US-OB-005 |
| | Migrate all data | US-OB-005 |

---

## 5. Integration Tests

### 5.1 Core Game Loop

**File:** `tests/integration/game-loop.test.ts` ✅ (Exists - Enhance)

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Full Loop | Recruit → Expedition → Loot → Level Up | US-OB-010 |
| | Multiple expeditions with progression | - |
| | Team composition affects efficiency | US-EX-011 |

### 5.2 Hero Management Flow

**File:** `tests/integration/hero-management.test.ts` ✅ (Exists - Enhance)

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Recruitment | Full tavern to roster flow | US-HM-008 |
| | Enforce daily cap for free | US-PM-005 |
| Equipment | Equip → stats update → power recalc | US-HM-016 |
| | Gear comparison and upgrade | US-EQ-016 |
| Progression | XP gain → level up → trait unlock | US-HM-020 |
| Prestige | Max level → prestige → bonus applied | US-HM-025 |

### 5.3 Expedition Flow

**File:** `tests/integration/expedition-flow.test.ts` ✅ (Exists - Enhance)

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Zone Expedition | Team formation → launch → complete | US-EX-004 |
| | Timer accuracy | US-EX-018 |
| | Reward generation | US-EX-022 |
| | Log generation with traits | US-EX-028 |
| Story Mission | Fixed team requirements | US-EX-007 |
| | Unlock progression | US-EX-009 |
| Passive Assignment | Station → collect income | US-EX-014 |

### 5.4 Dungeon Building Flow

**File:** `tests/integration/dungeon-building.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Full Loop | Capture → Schematic → Build → Farm | US-DB-005 |
| | Monster placement validation | US-DB-015 |
| | Synergy detection | US-DB-020 |
| | Loot from dungeon run | US-DB-026 |
| Optimization | Swap monsters and compare | US-DB-029 |
| | Synergy discovery | US-DB-021 |

### 5.5 Inventory Management Flow

**File:** `tests/integration/inventory-flow.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Loot Collection | Expedition → inventory → equip | US-EQ-019 |
| | Set bonus tracking | US-EQ-013 |
| Disposal | Sell items → gold gained | US-EQ-022 |
| | Salvage items → materials | US-EQ-023 |
| | Lock prevents disposal | US-EQ-025 |

### 5.6 Onboarding Flow

**File:** `tests/integration/onboarding-flow.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Guest Flow | Start as guest → play → create account | US-OB-001 |
| Tutorial | Welcome → First hero → First expedition | US-OB-010 |
| | Equipment tutorial | US-OB-012 |
| | Second hero recruitment | US-OB-013 |

### 5.7 Offline Progress Flow

**File:** `tests/integration/offline-progress.test.ts`

| Test Suite | Test Cases | User Stories |
|------------|------------|--------------|
| Expeditions | Complete while away | US-EX-031 |
| | Collect offline rewards | US-OB-023 |
| Passive | Accumulate passive income | US-EX-032 |
| | Respect caps | US-EX-032 |

---

## 6. E2E Tests

### 6.1 Critical User Journeys

**File:** `tests/e2e/new-player-journey.spec.ts`

| Test Case | Steps | User Stories |
|-----------|-------|--------------|
| New Player Flow | Land → Guest → Tutorial → First Expedition | US-OB-001 to US-OB-014 |
| | First hero received | US-OB-007 |
| | Complete first expedition | US-OB-010, US-OB-011 |
| | Equip first gear | US-OB-012 |
| | Recruit second hero | US-OB-013 |

**File:** `tests/e2e/returning-player.spec.ts`

| Test Case | Steps | User Stories |
|-----------|-------|--------------|
| Return After Expeditions | Login → See offline progress → Collect | US-OB-023 |
| | View completed expeditions | US-EX-031 |
| | Read expedition logs | US-EX-027 |

**File:** `tests/e2e/expedition-cycle.spec.ts`

| Test Case | Steps | User Stories |
|-----------|-------|--------------|
| Complete Expedition Cycle | Select zone → Form team → Launch | US-EX-001 to US-EX-004 |
| | Monitor timer | US-EX-018 |
| | Complete and collect | US-EX-022 |
| | Equip loot | US-EQ-009 |
| Multiple Expeditions | Run concurrent expeditions | US-EX-005 |

**File:** `tests/e2e/hero-management.spec.ts`

| Test Case | Steps | User Stories |
|-----------|-------|--------------|
| Hero Lifecycle | View roster → View details | US-HM-001, US-HM-004 |
| | Equip gear → See power change | US-HM-016 |
| | Level up after expedition | US-HM-021 |
| Recruitment | Access tavern → View options → Recruit | US-HM-006 to US-HM-008 |

**File:** `tests/e2e/dungeon-building.spec.ts`

| Test Case | Steps | User Stories |
|-----------|-------|--------------|
| Build First Dungeon | View schematics → Select → Place monsters | US-DB-010 to US-DB-015 |
| | See synergy indicators | US-DB-020 |
| | Activate dungeon | US-DB-014 |
| Farm Dungeon | Select dungeon → Assign heroes → Run | US-DB-025 |
| | View results with loot | US-DB-026 |

**File:** `tests/e2e/account-management.spec.ts`

| Test Case | Steps | User Stories |
|-----------|-------|--------------|
| Account Creation | Guest → Create account → Verify | US-OB-001 to US-OB-002 |
| Link Guest | Play as guest → Link account → Data preserved | US-OB-005 |
| Login/Logout | Login → Play → Logout → Login again | US-OB-003 |

### 6.2 Edge Cases & Error Handling

**File:** `tests/e2e/error-handling.spec.ts`

| Test Case | Steps |
|-----------|-------|
| Network Error | Simulate offline → Show error → Retry |
| Invalid Action | Try equipping wrong slot → Show error |
| Session Expired | Token expired → Redirect to login |
| Concurrent Limit | Try exceeding expedition limit → Show error |

### 6.3 Responsive Testing

**File:** `tests/e2e/mobile-experience.spec.ts`

| Test Case | Device |
|-----------|--------|
| Mobile Navigation | iPhone viewport |
| Touch Interactions | Tablet viewport |
| Modal Display | Mobile fullscreen modals |

---

## 7. Test Data & Fixtures

### 7.1 Test Factories

**File:** `tests/factories/heroFactory.ts`
```typescript
export function createTestHero(overrides?: Partial<Hero>): Hero
export function createTestHeroList(count: number): Hero[]
```

**File:** `tests/factories/equipmentFactory.ts`
```typescript
export function createTestEquipment(overrides?: Partial<Equipment>): Equipment
export function createTestLoot(count: number): Equipment[]
```

**File:** `tests/factories/expeditionFactory.ts`
```typescript
export function createTestExpedition(overrides?: Partial<Expedition>): Expedition
export function createActiveExpedition(): Expedition
export function createCompletedExpedition(): Expedition
```

**File:** `tests/factories/monsterFactory.ts`
```typescript
export function createTestMonster(overrides?: Partial<Monster>): Monster
export function createTestSchematic(overrides?: Partial<Schematic>): Schematic
```

**File:** `tests/factories/dungeonFactory.ts`
```typescript
export function createTestDungeon(overrides?: Partial<Dungeon>): Dungeon
```

### 7.2 Mock Data

**File:** `tests/mocks/zones.ts`
- Test zones with varying difficulty
- Subzones with different threats

**File:** `tests/mocks/traits.ts`
- Sample gameplay traits
- Sample story traits

**File:** `tests/mocks/user.ts`
- Guest user fixture
- Authenticated user fixture
- Supporter user fixture

### 7.3 API Mocks

**File:** `tests/mocks/api/heroes.ts`
- Mock hero API responses
- Error responses

**File:** `tests/mocks/api/expeditions.ts`
- Mock expedition responses
- Completion responses

---

## 8. Implementation Priority

### Phase 1: Foundation (MVP)

**Priority: Critical**

| Category | Tests | Est. Time |
|----------|-------|-----------|
| Unit: Hero Generator | 10 tests | 2h |
| Unit: Power Calculator | 15 tests | 2h |
| Unit: Efficiency Calculator | 10 tests | 2h |
| Unit: Loot Generator | 12 tests | 2h |
| Store: Heroes | 15 tests | 3h |
| Store: Expeditions | 12 tests | 3h |
| Store: Inventory | 10 tests | 2h |
| Store: Game | 8 tests | 1h |
| API: Heroes | 10 tests | 2h |
| API: Expeditions | 12 tests | 3h |
| API: Tavern | 8 tests | 2h |
| Integration: Game Loop | 5 tests | 2h |
| **Total** | **~120 tests** | **~26h** |

### Phase 2: Components

**Priority: High**

| Category | Tests | Est. Time |
|----------|-------|-----------|
| Cards: HeroCard | 8 tests | 2h |
| Cards: ItemCard | 8 tests | 2h |
| Display: RarityBadge | 5 tests | 1h |
| Display: PowerScore | 6 tests | 1h |
| Display: StatBar | 5 tests | 1h |
| Progress: ExpeditionTimer | 8 tests | 2h |
| Progress: ProgressBar | 6 tests | 1h |
| Input: TeamSlot | 8 tests | 2h |
| Input: FilterPanel | 6 tests | 1.5h |
| Modals: BaseModal | 8 tests | 2h |
| Modals: ConfirmationDialog | 5 tests | 1h |
| Form: BaseButton | 5 tests | 1h |
| Form: BaseInput | 5 tests | 1h |
| Utility: Toast | 5 tests | 1h |
| **Total** | **~88 tests** | **~20h** |

### Phase 3: E2E & Integration

**Priority: High**

| Category | Tests | Est. Time |
|----------|-------|-----------|
| E2E: New Player Journey | 5 tests | 4h |
| E2E: Expedition Cycle | 4 tests | 3h |
| E2E: Hero Management | 4 tests | 3h |
| Integration: Hero Management | 6 tests | 2h |
| Integration: Expedition Flow | 6 tests | 2h |
| Integration: Inventory Flow | 5 tests | 2h |
| **Total** | **~30 tests** | **~16h** |

### Phase 4: Dungeon Building

**Priority: Medium (Phase 2 feature)**

| Category | Tests | Est. Time |
|----------|-------|-----------|
| Unit: Dungeon Builder | 12 tests | 3h |
| Unit: Monster Service | 8 tests | 2h |
| Store: Monsters | 8 tests | 2h |
| Store: Dungeons | 10 tests | 2h |
| API: Dungeons | 10 tests | 3h |
| API: Monsters | 6 tests | 2h |
| Cards: MonsterCard | 6 tests | 2h |
| Cards: SchematicCard | 5 tests | 1.5h |
| Integration: Dungeon Building | 5 tests | 3h |
| E2E: Dungeon Building | 4 tests | 3h |
| **Total** | **~74 tests** | **~23h** |

### Phase 5: Advanced Features

**Priority: Medium**

| Category | Tests | Est. Time |
|----------|-------|-----------|
| Store: Tutorial | 6 tests | 1.5h |
| Store: Auth | 8 tests | 2h |
| API: Auth | 8 tests | 2h |
| Integration: Onboarding | 5 tests | 2h |
| Integration: Offline Progress | 4 tests | 2h |
| Unit: Progression Service | 10 tests | 2h |
| Display: TraitDisplay | 6 tests | 1.5h |
| Display: EfficiencyIndicator | 5 tests | 1h |
| Specialized: ExpeditionLog | 6 tests | 2h |
| **Total** | **~58 tests** | **~16h** |

---

## Summary

### Total Estimated Tests

| Category | Test Count |
|----------|------------|
| Unit Tests | ~180 |
| Store Tests | ~100 |
| Component Tests | ~150 |
| API Tests | ~75 |
| Integration Tests | ~35 |
| E2E Tests | ~25 |
| **Total** | **~565 tests** |

### Estimated Total Time

| Phase | Time |
|-------|------|
| Phase 1: Foundation | ~26h |
| Phase 2: Components | ~20h |
| Phase 3: E2E & Integration | ~16h |
| Phase 4: Dungeon Building | ~23h |
| Phase 5: Advanced | ~16h |
| **Total** | **~101h** |

### Coverage Goals

- **Utilities:** 90%+ line coverage
- **Stores:** 85%+ line coverage
- **Components:** 80%+ line coverage
- **API Routes:** 85%+ line coverage
- **Critical Paths:** 100% E2E coverage

---

*This plan provides comprehensive test coverage for the Dungeon Farmers game, ensuring quality across all systems while prioritizing the most critical gameplay features first.*
