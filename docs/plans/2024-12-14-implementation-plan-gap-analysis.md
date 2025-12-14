# Implementation Plan Gap Analysis

**Date:** 2024-12-14
**Purpose:** Verify that `2024-12-14-implementation-plan.md` includes everything described in the brainstorm session documents

---

## Summary

The implementation plan covers the **core MVP loop** but is missing several systems that were designed during brainstorming sessions. These should be added to ensure Phase 1 is complete.

---

## ✅ What's Covered

### Foundation (Phase 1.0)
- ✅ Project setup
- ✅ TypeScript types (base, archetypes, threats, traits, hero, recruitment, zones, expedition, equipment)
- ✅ Database schema

### Hero System (Phase 1.1)
- ✅ Name data
- ✅ Gameplay trait data
- ✅ Story trait data
- ✅ Culture data
- ✅ Hero generator
- ✅ Power calculator
- ✅ Hero store
- ✅ Tavern store
- ✅ Hero API routes
- ✅ Hero UI components

### Zone & Expedition (Phase 1.2)
- ✅ Zone data
- ✅ Expedition engine
- ✅ Timer system
- ✅ Expedition UI

### Equipment & Loot (Phase 1.3)
- ✅ Equipment data
- ✅ Loot tables
- ✅ Inventory system
- ✅ Equipment UI

### Progression (Phase 1.4)
- ✅ XP & Leveling
- ✅ Power calculation
- ✅ Efficiency calculation
- ✅ Prestige system

### Polish (Phase 1.5)
- ✅ Expedition logs
- ✅ Offline progress
- ✅ Final integration

---

## ❌ What's Missing from Implementation Plan

### 1. Subzone System (from comprehensive-update.md)

**Missing:**
- Subzone discovery mechanics
- Subzone mastery system
- Subzone-specific rewards and unlocks
- Subzone progress tracking

**Should Add:**
- Task: Create subzone data structure and discovery logic
- Task: Implement subzone mastery progression
- Task: Add subzone UI components

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 1

---

### 2. Collectibles System (from comprehensive-update.md)

**Missing:**
- Collectible definitions
- Collectible drop mechanics
- Collection journal UI

**Should Add:**
- Task: Create collectible data
- Task: Implement collectible drops in expeditions
- Task: Create collection journal component

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 1

---

### 3. Monster System (from comprehensive-update.md)

**Missing:**
- Monster definitions
- Monster spawn mechanics
- Monster variants by difficulty tier
- Monster pack types (trash, elite, miniboss, boss)

**Should Add:**
- Task: Create monster data structures
- Task: Implement monster spawn logic
- Task: Add monster variants for difficulty scaling

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 1

**Note:** Monster capture is Phase 2, but monster definitions and spawns are Phase 1.

---

### 4. Equipment Traits (from comprehensive-update.md)

**Missing:**
- Equipment trait data
- Equipment trait generation
- Equipment trait quality system

**Should Add:**
- Task: Create equipment trait data
- Task: Update equipment generator to include traits
- Task: Display equipment traits in UI

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 2

---

### 5. Equipment Sets (from comprehensive-update.md)

**Missing:**
- Set definitions
- Set bonus calculation
- Set UI display

**Should Add:**
- Task: Create equipment set data
- Task: Implement set bonus logic
- Task: Add set indicators to equipment UI

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 2

---

### 6. Difficulty Tiers (from comprehensive-update.md)

**Missing:**
- 10-tier difficulty system (Novice → Transcendent)
- Tier-based power requirements
- Tier-exclusive content unlocks
- Difficulty selection UI

**Should Add:**
- Task: Create difficulty tier data
- Task: Implement tier scaling for zones
- Task: Add difficulty selector to expedition setup

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 8

---

### 7. Title System (from comprehensive-update.md)

**Missing:**
- Title definitions
- Title unlock conditions
- Title bonuses (rare+ titles)
- Title display system

**Should Add:**
- Task: Create title data
- Task: Implement title unlock checking
- Task: Add title display to hero UI

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 4

---

### 8. Hero Retirement (from comprehensive-update.md)

**Missing:**
- Retirement reward calculation
- Story trait transfer mechanics
- Retirement UI

**Should Add:**
- Task: Implement retirement logic with rewards
- Task: Add story trait transfer UI
- Task: Create retirement confirmation modal

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 5

---

### 9. Party Presets (from comprehensive-update.md)

**Missing:**
- Preset data structure
- Preset save/load logic
- Preset UI

**Should Add:**
- Task: Create party preset store
- Task: Implement preset save/load
- Task: Add preset selector to expedition setup

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 6

---

### 10. Morale System Details (from comprehensive-update.md)

**Missing:**
- Detailed morale thresholds and effects
- Morale change triggers
- Morale recovery mechanics
- Morale UI display

**Should Add:**
- Task: Implement morale service with all triggers
- Task: Add morale display to hero cards
- Task: Create morale recovery logic

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 7

**Note:** Implementation plan mentions morale but doesn't detail the full system.

---

### 11. Expedition Events System (from comprehensive-update.md)

**Missing:**
- Flavor events
- Skill check events
- Choice events (queued for player)
- Rare occurrences
- Story hooks
- Injury system

**Should Add:**
- Task: Create event generator with all event types
- Task: Implement skill check resolution
- Task: Create choice event queue system
- Task: Add rare occurrence triggers
- Task: Implement injury system

**Reference:** `2024-12-14-phase1-comprehensive-update.md` Section 11

**Note:** Implementation plan mentions event generator but doesn't detail all event types.

---

### 12. Log Generation Details (from systems-technical-design.md)

**Missing:**
- Detailed log structure (summary + sections)
- Template system for log generation
- Trait reaction probability system
- Culture-based reactions

**Should Add:**
- Task: Implement full log generator with template system
- Task: Add trait reaction triggers
- Task: Add culture flavor text

**Reference:** `2024-12-14-systems-technical-design.md` Section 1

---

### 13. Timer Logic Details (from systems-technical-design.md)

**Missing:**
- Game clock composable
- Timer display composable
- Completion watcher with throttle
- Offline sync endpoint

**Should Add:**
- Task: Create useGameClock composable
- Task: Create useExpeditionTimer composable
- Task: Implement completion watcher
- Task: Create sync endpoint for offline progress

**Reference:** `2024-12-14-systems-technical-design.md` Section 2

---

### 14. API Routes Specification (from systems-technical-design.md)

**Missing:**
- Many API routes are not specified in implementation plan
- Error code standardization
- Request/response type definitions

**Should Add:**
- Task: Create all API routes per specification
- Task: Standardize error codes
- Task: Add request validation with Zod

**Reference:** `2024-12-14-systems-technical-design.md` Section 3

---

### 15. Guild Master System (from hero-traits-design.md)

**Missing:**
- Guild Master initialization
- Equippable trait system for GM
- GM leader/mentor bonuses
- GM UI

**Should Add:**
- Task: Create Guild Master initialization
- Task: Implement GM trait equipping system
- Task: Add GM bonuses to expeditions
- Task: Create GM UI page

**Reference:** `2024-12-14-hero-traits-design.md` Section "The Guild Master"

---

## 📋 Recommended Additions to Implementation Plan

### New Phase 1.2.5: Subzones & Discovery (Tasks 36.5-40.5)
- Task 36.5: Create subzone data structure
- Task 37.5: Implement subzone discovery logic
- Task 38.5: Create subzone mastery system
- Task 39.5: Add subzone UI components
- Task 40.5: Implement collectible system

### New Phase 1.2.6: Monsters (Tasks 40.6-42.6)
- Task 40.6: Create monster data structures
- Task 41.6: Implement monster spawn logic
- Task 42.6: Add monster variants for difficulty tiers

### Updated Phase 1.3: Equipment & Loot (Add Tasks 44.5-46.5)
- Task 44.5: Create equipment trait data
- Task 45.5: Update equipment generator for traits
- Task 46.5: Create equipment set data and bonuses

### New Phase 1.3.5: Difficulty & Titles (Tasks 47-50)
- Task 47: Create difficulty tier system
- Task 48: Implement tier scaling
- Task 49: Create title system
- Task 50: Add title unlock checking

### Updated Phase 1.4: Progression (Add Tasks 52.5-54.5)
- Task 52.5: Implement full morale system
- Task 53.5: Add hero retirement with trait transfer
- Task 54.5: Create party preset system

### Updated Phase 1.5: Polish (Expand Tasks 53-60)
- Task 53: Create full expedition events system (all types)
- Task 54: Implement detailed log generation
- Task 55: Create timer composables (useGameClock, useExpeditionTimer)
- Task 56: Implement offline sync endpoint
- Task 57: Create Guild Master system
- Task 58: Add all missing API routes
- Task 59: Create notification service
- Task 60: Integration testing

---

## 🎯 Priority Assessment

### Critical for MVP (Must Have)
1. ✅ Hero system - **Covered**
2. ✅ Expedition system - **Covered**
3. ✅ Equipment system - **Covered** (but missing traits/sets)
4. ⚠️ **Subzone system** - **Missing** (zones feel incomplete without subzones)
5. ⚠️ **Expedition events** - **Partially covered** (needs all event types)
6. ⚠️ **Log generation** - **Partially covered** (needs full template system)
7. ⚠️ **Timer system** - **Partially covered** (needs composables)

### Important for MVP (Should Have)
8. ⚠️ **Difficulty tiers** - **Missing** (content scaling is important)
9. ⚠️ **Equipment traits/sets** - **Missing** (gear feels incomplete)
10. ⚠️ **Morale system** - **Partially covered** (needs full implementation)
11. ⚠️ **Party presets** - **Missing** (quality of life)
12. ⚠️ **Hero retirement** - **Missing** (roster management)

### Nice to Have (Can Add Later)
13. ⚠️ **Title system** - **Missing** (cosmetic, can be Phase 1.5)
14. ⚠️ **Collectibles** - **Missing** (collection aspect, can be Phase 1.5)
15. ⚠️ **Monster definitions** - **Missing** (needed for Phase 2, but spawns are Phase 1)
16. ⚠️ **Guild Master** - **Missing** (unique player character, can be Phase 1.5)

---

## 📝 Recommendations

### Immediate Actions

1. **Add subzone system** - Zones without subzones feel incomplete
2. **Complete expedition events** - All event types (flavor, skill checks, choices, rare)
3. **Full log generation** - Template system with trait reactions
4. **Timer composables** - useGameClock and useExpeditionTimer
5. **Equipment traits/sets** - Makes gear more interesting

### Can Defer to Phase 1.5

- Title system (cosmetic)
- Collectibles (collection aspect)
- Guild Master (unique mechanics, can come later)
- Full monster system (capture is Phase 2, but spawns should be Phase 1)

### Documentation Updates Needed

1. Update implementation plan with missing tasks
2. Add detailed specifications for:
   - Subzone discovery and mastery
   - Event generation (all types)
   - Log template system
   - Timer composables
   - Equipment traits/sets
   - Difficulty tiers
   - Morale system details
   - Party presets
   - Hero retirement

---

## ✅ Conclusion

The implementation plan covers the **core loop** well but is missing several systems that were designed during brainstorming. The most critical gaps are:

1. **Subzone system** - Makes zones feel complete
2. **Full event system** - Adds depth to expeditions
3. **Equipment traits/sets** - Makes gear interesting
4. **Difficulty tiers** - Content scaling
5. **Timer/log technical details** - Implementation specifics

These should be added to ensure Phase 1 MVP is complete and matches the design vision.
