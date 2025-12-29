# Dungeon Farmers - Modals, Popups & Overlays

**Last Updated:** 2025-12-29
**Total Modals:** 97
**Status:** Complete modal definitions organized by category

---

## Overview

This document defines all modals, popups, dialogs, and overlays for Dungeon Farmers. Each entry includes:
- Name and purpose
- Trigger condition
- Size classification
- Key content sections
- Available actions
- Related user stories
- Implementation priority

### Size Classifications
- **Small:** Confirmations, toasts, simple dialogs (~35)
- **Medium:** Detail views, forms, comparisons (~40)
- **Large/Fullscreen:** Browsers, builders, comprehensive views (~22)

---

## 1. Onboarding & Account (15 modals)

### 1.1 Welcome Screen Modal
- **Purpose:** First impression, set tone, begin journey
- **Trigger:** First app launch
- **Size:** Large (fullscreen on mobile)
- **Priority:** Phase 1
- **Content:**
  - Game logo with animation
  - Tagline: "Build dungeons. Capture monsters. Farm legendary loot."
  - Lighthearted flavor text
  - Background with parallax animation
- **Actions:**
  - "Play as Guest" (primary)
  - "Create Account" / "Log In"
  - Skip (returning players)
- **Stories:** US-OB-001, US-OB-006

### 1.2 Account Creation Modal
- **Purpose:** Sign up flow
- **Trigger:** Click "Create Account"
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - Email/password fields OR OAuth buttons
  - Password requirements display
  - Terms of Service checkbox
  - Privacy Policy link
- **Actions:**
  - "Create Account"
  - "Back to Login"
  - OAuth buttons (Google, Discord)
- **Stories:** US-OB-002

### 1.3 Login Modal
- **Purpose:** Existing user authentication
- **Trigger:** Click "Log In"
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - Email/password fields
  - "Remember me" checkbox
  - Error messages
  - "Forgot Password" link
- **Actions:**
  - "Log In"
  - "Forgot Password"
  - OAuth buttons
- **Stories:** US-OB-003

### 1.4 Password Recovery Modal
- **Purpose:** Reset forgotten password
- **Trigger:** Click "Forgot Password"
- **Size:** Small
- **Priority:** Phase 4
- **Content:**
  - Email input
  - Instructions
  - Success/error messages
- **Actions:**
  - "Send Reset Email"
  - "Back to Login"
- **Stories:** US-OB-004

### 1.5 Link Guest Account Modal
- **Purpose:** Convert guest to full account
- **Trigger:** Guest clicks "Create Account"
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - Progress transfer confirmation
  - Data being transferred list
  - Warning about guest session invalidation
  - Account creation form
- **Actions:**
  - "Create Account & Transfer"
  - "Cancel"
- **Stories:** US-OB-005

### 1.6 First Hero Reveal Modal
- **Purpose:** Celebrate receiving first hero
- **Trigger:** After welcome screen
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - Hero portrait with entrance animation
  - Hero name, traits, stats
  - Flavor text: "Your first recruit has arrived!"
  - Trait descriptions
- **Actions:**
  - "Continue" (required)
- **Stories:** US-OB-007

### 1.7 Guild Naming Modal
- **Purpose:** Personalize player's guild
- **Trigger:** After UI tour
- **Size:** Small
- **Priority:** Phase 3
- **Content:**
  - Text input (3-24 chars)
  - Character counter
  - Profanity filter message
  - Random name suggestions
- **Actions:**
  - "Confirm Name"
  - "Random Name"
  - "Skip" (uses default)
- **Stories:** US-OB-009

### 1.8 UI Tour Overlay
- **Purpose:** Orient new players
- **Trigger:** After first hero reveal
- **Size:** Fullscreen overlay
- **Priority:** Phase 1
- **Content:**
  - Dimmed background with spotlight
  - Tooltip bubbles per section
  - Progress dots (1/5, 2/5...)
- **Actions:**
  - "Next"
  - "Skip Tour"
- **Stories:** US-OB-008

### 1.9 Tutorial Step Modals (Series)
- **Purpose:** Guide through first actions
- **Trigger:** Progressive during gameplay
- **Size:** Medium with arrows
- **Priority:** Phase 1
- **Content:**
  - Step-by-step instructions
  - Highlighted UI elements
  - Progress indicator
- **Actions:**
  - "Next"
  - "Skip Tutorial"
- **Stories:** US-OB-010 to US-OB-014

### 1.10 First Monster Capture Celebration
- **Purpose:** Introduce dungeon building teaser
- **Trigger:** First monster captured
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - "Monster Captured!" banner
  - Monster portrait/stats
  - Dungeon teaser text
- **Actions:**
  - "View Monster"
  - "Continue"
- **Stories:** US-OB-015

### 1.11 First Dungeon Build Tutorial Overlay
- **Purpose:** Guide first dungeon construction
- **Trigger:** First schematic + monster capture
- **Size:** Fullscreen wizard
- **Priority:** Phase 2
- **Content:**
  - Interactive builder with guided steps
  - Slot and monster explanations
  - Loot preview
- **Actions:**
  - Step navigation
  - "Complete Dungeon"
- **Stories:** US-OB-016, US-DB-016

### 1.12 Milestone Celebration Modal
- **Purpose:** Celebrate achievements
- **Trigger:** Reaching milestones
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Fanfare animation
  - Milestone description
  - Reward granted
- **Actions:**
  - "Awesome!"
  - "Share" (future)
- **Stories:** US-OB-020

### 1.13 Contextual Tooltip Popups
- **Purpose:** Explain features on first encounter
- **Trigger:** First UI element interaction
- **Size:** Small tooltip
- **Priority:** Phase 1
- **Content:**
  - 1-2 sentence explanation
  - Icon/visual
- **Actions:**
  - "Got it"
  - "Don't show again"
- **Stories:** US-OB-018

### 1.14 Suggested Next Actions Panel
- **Purpose:** Prevent "what now?" moments
- **Trigger:** Always visible (collapsible)
- **Size:** Small sidebar
- **Priority:** Phase 2
- **Content:**
  - 1-3 recommended actions
  - Navigation buttons
- **Actions:**
  - Click to navigate
  - Dismiss panel
- **Stories:** US-OB-019

### 1.15 What's New Modal
- **Purpose:** Announce updates
- **Trigger:** First login after update
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - 2-3 major changes
  - Version number
  - Feature links
- **Actions:**
  - "Explore"
  - "Dismiss"
- **Stories:** US-OB-025

---

## 2. Hero Management (12 modals)

### 2.1 Hero Detail Modal
- **Purpose:** View comprehensive hero info
- **Trigger:** Click hero card
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - Portrait, name, level, rarity
  - XP progress bar
  - All traits with descriptions
  - Equipment slots (6)
  - Power score breakdown
  - Current status
- **Actions:**
  - "Equip Gear"
  - "Send on Expedition"
  - "Prestige" (if max)
  - "Release Hero"
- **Stories:** US-HM-004, US-HM-011, US-HM-012

### 2.2 Hero Comparison Modal
- **Purpose:** Compare 2-3 heroes
- **Trigger:** Select + "Compare"
- **Size:** Large
- **Priority:** Phase 3
- **Content:**
  - Side-by-side columns
  - Aligned stat rows
  - Highlight differences
- **Actions:**
  - "Select for Team"
  - "Close"
- **Stories:** US-HM-005

### 2.3 Hero Recruitment Modal
- **Purpose:** Recruit new heroes
- **Trigger:** Open Tavern
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - Daily allowance counter
  - Gold balance
  - 3-5 hero options
  - Pool refresh controls
- **Actions:**
  - "Recruit" per hero
  - "Refresh Pool"
  - "Preview Details"
- **Stories:** US-HM-006 to US-HM-009

### 2.4 Recruit Confirmation Dialog
- **Purpose:** Confirm recruitment
- **Trigger:** Click "Recruit"
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Hero preview
  - Gold cost
- **Actions:**
  - "Confirm"
  - "Cancel"
- **Stories:** US-HM-008

### 2.5 Trait Reroll Modal
- **Purpose:** Reroll traits
- **Trigger:** Click "Reroll Traits"
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Current traits
  - Token count
  - Before/after comparison
- **Actions:**
  - "Reroll" (costs token)
  - "Cancel"
- **Stories:** US-HM-010

### 2.6 Prestige Confirmation Modal
- **Purpose:** Confirm prestige
- **Trigger:** Click "Prestige"
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Prestige explanation
  - What kept/lost
  - Bonus preview
- **Actions:**
  - "Prestige Hero"
  - "Cancel"
- **Stories:** US-HM-024, US-HM-025

### 2.7 Prestige Calculator Modal
- **Purpose:** Plan prestige
- **Trigger:** Click "Plan Prestige"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Current vs post-prestige power
  - Time to return estimate
  - Long-term projection
- **Actions:**
  - "Prestige Now"
  - "Wait"
- **Stories:** US-HM-027

### 2.8 Hero Release Warning Modal
- **Purpose:** Prevent accidental deletion
- **Trigger:** Click "Release Hero"
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Strong warning
  - Hero stats summary
  - Gold refund
  - Type hero name (for Epic+)
- **Actions:**
  - "Release Hero"
  - "Cancel"
- **Stories:** US-HM-028, US-HM-030

### 2.9 Bulk Hero Release Modal
- **Purpose:** Release multiple heroes
- **Trigger:** Select multiple + "Release"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Selected heroes list
  - Total refund
- **Actions:**
  - "Release All"
  - "Cancel"
- **Stories:** US-HM-029

### 2.10 Level Up Celebration Popup
- **Purpose:** Celebrate level ups
- **Trigger:** Hero levels up
- **Size:** Small toast
- **Priority:** Phase 1
- **Content:**
  - Hero name + level
  - Stat increases
  - Trait unlock note
- **Actions:**
  - "View Hero"
  - Auto-dismiss
- **Stories:** US-HM-021

### 2.11 Gear Recommendations Modal
- **Purpose:** Suggest optimal gear
- **Trigger:** Click "Optimize"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Current loadout
  - Recommendations
  - Before/after comparison
- **Actions:**
  - "Equip All"
  - "Cancel"
- **Stories:** US-HM-019, US-EQ-017

### 2.12 Hero Lock Confirmation
- **Purpose:** Lock heroes from release
- **Trigger:** Click lock icon
- **Size:** Small inline
- **Priority:** Phase 2
- **Content:**
  - Lock/unlock toggle
- **Actions:**
  - Toggle
- **Stories:** US-HM-030

---

## 3. Expeditions (14 modals)

### 3.1 Zone Selection Info Overlay
- **Purpose:** Show zone details
- **Trigger:** Hover/click zone
- **Size:** Medium popover
- **Priority:** Phase 1
- **Content:**
  - Zone name, theme, difficulty
  - Duration options
  - Available monsters
  - Unlock requirements
- **Actions:**
  - "Select Zone"
  - Close
- **Stories:** US-EX-001, US-PM-001

### 3.2 Team Formation Modal
- **Purpose:** Assemble team
- **Trigger:** Select zone
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - 2-4 team slots
  - Available heroes
  - Team power calculation
  - Efficiency preview
- **Actions:**
  - Drag-and-drop
  - "Auto-Fill"
  - "Start Expedition"
- **Stories:** US-EX-002, US-EX-004

### 3.3 Expedition Launch Confirmation
- **Purpose:** Confirm start
- **Trigger:** Click "Start"
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Team summary
  - Duration and completion time
  - Efficiency rating
- **Actions:**
  - "Confirm & Launch"
  - "Cancel"
- **Stories:** US-EX-004

### 3.4 Expedition Completion Results Modal
- **Purpose:** Celebrate and collect
- **Trigger:** Expedition completes
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - Efficiency rating
  - All rewards categorized
  - Hero level-ups
  - Log events preview
- **Actions:**
  - "Collect Rewards"
  - "View Log"
  - "Run Again"
- **Stories:** US-EX-022 to US-EX-025

### 3.5 Expedition Log Viewer Modal
- **Purpose:** Read narrative logs
- **Trigger:** Click "View Log"
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - Chronological events
  - Hero dialogue (trait-based)
  - Phase markers
- **Actions:**
  - "Save to Favorites"
  - "Share" (Phase 3)
- **Stories:** US-EX-027, US-EX-028

### 3.6 Recall Expedition Warning
- **Purpose:** Confirm early recall
- **Trigger:** Click "Recall"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Warning about lost progress
  - Partial rewards (50%)
- **Actions:**
  - "Recall"
  - "Cancel"
- **Stories:** US-EX-021

### 3.7 Speed-Up Confirmation
- **Purpose:** Confirm gem use
- **Trigger:** Click "Skip Wait"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Time remaining
  - Gem cost breakdown
- **Actions:**
  - "Skip Wait"
  - "Cancel"
- **Stories:** US-PM-012

### 3.8 Welcome Back Modal
- **Purpose:** Show offline progress
- **Trigger:** Login after absence
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Time away
  - Completed expeditions
  - Passive income
- **Actions:**
  - "Collect All"
  - "View Details"
- **Stories:** US-OB-023, US-EX-031

### 3.9 Story Mission Cutscene Modal
- **Purpose:** Display narrative
- **Trigger:** Before/after story missions
- **Size:** Fullscreen
- **Priority:** Phase 2
- **Content:**
  - Character portraits
  - Dialogue boxes
  - Trait-based variations
- **Actions:**
  - "Next"
  - "Skip"
- **Stories:** US-EX-008

### 3.10 Story Mission Requirements Modal
- **Purpose:** Show role requirements
- **Trigger:** Select story mission
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Required roles
  - Qualifying heroes
  - Efficiency calculation
- **Actions:**
  - "Form Team"
  - "Cancel"
- **Stories:** US-EX-007

### 3.11 Dungeon Run Setup Modal
- **Purpose:** Optimize dungeon team
- **Trigger:** Click "Run Dungeon"
- **Size:** Large
- **Priority:** Phase 2
- **Content:**
  - Slot requirements
  - Efficiency breakdown
  - Loot table
- **Actions:**
  - "Form Team"
  - "Start Run"
- **Stories:** US-EX-010, US-EX-011, US-DB-025

### 3.12 Passive Income Collection Popup
- **Purpose:** Collect passive resources
- **Trigger:** Click "Collect"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Total accumulated
  - Breakdown by zone
  - Rare finds
- **Actions:**
  - "Collect All"
- **Stories:** US-EX-015

### 3.13 Zone Unlock Celebration
- **Purpose:** Celebrate new content
- **Trigger:** Power threshold reached
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - "New Zone Unlocked!"
  - Zone preview
  - Small reward
- **Actions:**
  - "Explore Now"
  - "Later"
- **Stories:** US-PM-002

### 3.14 Expedition Progress Toasts
- **Purpose:** Real-time updates
- **Trigger:** Milestone events
- **Size:** Small toast
- **Priority:** Phase 2
- **Content:**
  - Phase indicator
  - Flavor text
- **Actions:**
  - Auto-dismiss
  - Click for details
- **Stories:** US-EX-019, US-EX-020

---

## 4. Dungeon Building (13 modals)

### 4.1 Monster Collection Browser
- **Purpose:** View all monsters
- **Trigger:** Click "Monsters"
- **Size:** Large fullscreen
- **Priority:** Phase 2
- **Content:**
  - Grid of monsters
  - Filters and sorts
  - Completion percentage
- **Actions:**
  - Click for details
  - "Use in Dungeon"
- **Stories:** US-DB-001

### 4.2 Monster Detail Modal
- **Purpose:** View monster info
- **Trigger:** Click monster card
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Portrait, type, rarity
  - Power and stats
  - Loot table
  - Slot compatibility
  - Synergy info
- **Actions:**
  - "Place in Dungeon"
  - "View Capture Location"
- **Stories:** US-DB-002

### 4.3 Monster Capture Celebration
- **Purpose:** Celebrate captures
- **Trigger:** Monster captured
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - "Monster Captured!" banner
  - Monster card reveal
  - Loot table preview
- **Actions:**
  - "View Monster"
  - "Continue"
  - "Place in Dungeon"
- **Stories:** US-DB-005, US-DB-007

### 4.4 Schematic Collection Browser
- **Purpose:** View schematics
- **Trigger:** Click "Schematics"
- **Size:** Large fullscreen
- **Priority:** Phase 2
- **Content:**
  - Grid with layout previews
  - Buildable indicators
  - Filters and sorts
- **Actions:**
  - Click for details
  - "Build Dungeon"
- **Stories:** US-DB-010, US-DB-012

### 4.5 Schematic Detail Modal
- **Purpose:** View schematic info
- **Trigger:** Click schematic
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Layout preview
  - Slot requirements
  - Base rewards
  - Buildability status
- **Actions:**
  - "Build Dungeon"
  - "View Required Monsters"
- **Stories:** US-DB-011

### 4.6 Dungeon Builder Modal
- **Purpose:** Construct dungeons
- **Trigger:** Click "Build"
- **Size:** Fullscreen
- **Priority:** Phase 2
- **Content:**
  - Schematic layout
  - Monster sidebar
  - Drag-and-drop area
  - Synergy indicators
  - Loot preview
- **Actions:**
  - Drag monsters
  - "Quick-Fill"
  - "Optimize"
  - "Save Draft"
  - "Activate"
- **Stories:** US-DB-014, US-DB-015, US-DB-017

### 4.7 Dungeon Loot Preview Modal
- **Purpose:** Preview loot table
- **Trigger:** Click "Preview Rewards"
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Combined loot table
  - Drop rates
  - Synergy bonuses
- **Actions:**
  - "Back to Builder"
  - "Activate Dungeon"
- **Stories:** US-DB-017, US-DB-026

### 4.8 Synergy Discovery Celebration
- **Purpose:** Celebrate synergy discovery
- **Trigger:** First synergy activation
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - "Synergy Discovered!"
  - Description
  - Monster combinations
  - Bonus effects
- **Actions:**
  - "View in Codex"
  - "Awesome!"
- **Stories:** US-DB-021

### 4.9 Synergy Codex Modal
- **Purpose:** Reference synergies
- **Trigger:** Click "Synergy Codex"
- **Size:** Large
- **Priority:** Phase 3
- **Content:**
  - All synergies (discovered and "???")
  - Filters and search
  - Requirements and bonuses
- **Actions:**
  - Click for details
  - "Link to Monsters"
- **Stories:** US-DB-022

### 4.10 Dungeon Deactivation Confirmation
- **Purpose:** Confirm deactivation
- **Trigger:** Click "Deactivate"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Slot count warning
  - Configuration preserved
- **Actions:**
  - "Deactivate"
  - "Cancel"
- **Stories:** US-DB-030

### 4.11 Dungeon Swap Monster Confirmation
- **Purpose:** Confirm monster swap
- **Trigger:** Edit active dungeon
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Current vs new
  - Loot changes
  - Synergy impact
- **Actions:**
  - "Update Dungeon"
  - "Cancel"
- **Stories:** US-DB-029

### 4.12 Dungeon Statistics Modal
- **Purpose:** Track performance
- **Trigger:** Click "Statistics"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Total runs
  - Avg completion time
  - Drop rates vs expected
- **Actions:**
  - "Run Again"
  - "Edit Dungeon"
- **Stories:** US-DB-033

### 4.13 Supporter Slot Limit Modal
- **Purpose:** Explain slot limits
- **Trigger:** Limit reached
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Limit explanation
  - Free vs Supporter comparison
  - Upgrade link
- **Actions:**
  - "Deactivate a Dungeon"
  - "Upgrade"
  - "Cancel"
- **Stories:** US-DB-031, US-PM-032

---

## 5. Equipment & Inventory (16 modals)

### 5.1 Inventory Grid/List View
- **Purpose:** Manage equipment
- **Trigger:** Click "Inventory"
- **Size:** Large fullscreen
- **Priority:** Phase 1
- **Content:**
  - Grid/list of items
  - Category tabs
  - Sort/filter controls
  - Capacity counter
- **Actions:**
  - Click for details
  - Bulk select
- **Stories:** US-EQ-001, US-EQ-002

### 5.2 Item Detail Modal
- **Purpose:** View item stats
- **Trigger:** Click item
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - Icon, name, rarity
  - Primary stats
  - Gear score
  - Set affiliation
  - Special effects
- **Actions:**
  - "Equip"
  - "Compare"
  - "Lock"
  - "Sell"
  - "Salvage"
- **Stories:** US-EQ-005

### 5.3 Item Comparison Modal
- **Purpose:** Compare items
- **Trigger:** Select + "Compare"
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - Side-by-side columns
  - Stat differences highlighted
  - Gear score comparison
- **Actions:**
  - "Equip Best"
  - "Close"
- **Stories:** US-EQ-008, US-HM-017

### 5.4 Equip Item Confirmation
- **Purpose:** Confirm equip
- **Trigger:** Drag to slot or click "Equip"
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Before/after stats
  - Power change
  - Unequip warning
- **Actions:**
  - "Equip"
  - "Cancel"
- **Stories:** US-EQ-009

### 5.5 Auto-Equip Preview Modal
- **Purpose:** Preview auto-equip
- **Trigger:** Click "Auto-Equip"
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Current loadout
  - Recommended changes
  - Total power change
- **Actions:**
  - "Apply All"
  - "Cancel"
  - "Undo"
- **Stories:** US-EQ-010

### 5.6 Sell Confirmation Dialog
- **Purpose:** Confirm sell
- **Trigger:** Click "Sell"
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Items to sell
  - Gold value
- **Actions:**
  - "Sell"
  - "Cancel"
- **Stories:** US-EQ-022

### 5.7 Salvage Confirmation Dialog
- **Purpose:** Confirm salvage
- **Trigger:** Click "Salvage"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Items to salvage
  - Materials gained
- **Actions:**
  - "Salvage"
  - "Cancel"
- **Stories:** US-EQ-023

### 5.8 Auto-Salvage Settings Modal
- **Purpose:** Configure auto-salvage
- **Trigger:** Click "Auto-Salvage Settings"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Enable toggle
  - Thresholds
  - Whitelist exclusions
- **Actions:**
  - "Save"
  - "Preview"
- **Stories:** US-EQ-024

### 5.9 Item Lock Confirmation
- **Purpose:** Lock/unlock items
- **Trigger:** Click lock icon
- **Size:** Small inline
- **Priority:** Phase 1
- **Content:**
  - Toggle control
- **Actions:**
  - Toggle
- **Stories:** US-EQ-025

### 5.10 Set Bonus Information Modal
- **Purpose:** View set details
- **Trigger:** Click set name
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Set name and pieces
  - Progress (2/6, 4/6)
  - Bonus tiers
  - Farm locations
- **Actions:**
  - "View in Inventory"
  - "Farm Missing"
- **Stories:** US-EQ-006, US-EQ-013, US-EQ-014

### 5.11 Set Planner Modal
- **Purpose:** Plan set builds
- **Trigger:** Click "Set Planner"
- **Size:** Large
- **Priority:** Phase 3
- **Content:**
  - Target set selection
  - Pieces needed
  - Farming locations
  - Time estimate
- **Actions:**
  - "Save Plan"
  - "Start Farming"
- **Stories:** US-EQ-015

### 5.12 Inventory Full Warning
- **Purpose:** Warn about capacity
- **Trigger:** Collect at capacity
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Current capacity
  - Options to free space
- **Actions:**
  - "Sell Items"
  - "Expand Storage"
  - "Cancel"
- **Stories:** US-EQ-003

### 5.13 Upgrade Available Notification
- **Purpose:** Alert to upgrades
- **Trigger:** New better item
- **Size:** Small toast
- **Priority:** Phase 2
- **Content:**
  - "Upgrade Available!"
  - Item preview
- **Actions:**
  - "View & Equip"
  - "Dismiss"
- **Stories:** US-EQ-016

### 5.14 Loot Results Modal
- **Purpose:** Show expedition loot
- **Trigger:** Collect rewards
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - All loot categorized
  - Upgrade indicators
  - Quick-equip buttons
- **Actions:**
  - "Equip" per item
  - "Collect All"
- **Stories:** US-EQ-019, US-EX-026

### 5.15 Equipment Loadout Manager
- **Purpose:** Save/switch loadouts
- **Trigger:** Click "Loadouts"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Current loadout
  - Saved loadouts
  - Preview/comparison
- **Actions:**
  - "Save Current"
  - "Apply"
  - "Edit/Delete"
- **Stories:** US-EQ-011

### 5.16 Drop Rate Information Modal
- **Purpose:** Show drop rates
- **Trigger:** Click "Drop Rates"
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Rarity distribution
  - Efficiency impact
  - Personal history
- **Actions:**
  - "Close"
- **Stories:** US-EQ-021

---

## 6. Progression & Monetization (15 modals)

### 6.1 Daily Login Calendar
- **Purpose:** Daily rewards
- **Trigger:** First login each day
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - 7-day calendar
  - Current day highlighted
  - Streak tracker
- **Actions:**
  - "Claim Reward"
- **Stories:** US-OB-026, US-PM-007

### 6.2 Daily/Weekly Quests Panel
- **Purpose:** Quest tracking
- **Trigger:** Click "Quests"
- **Size:** Medium sidebar
- **Priority:** Phase 2
- **Content:**
  - Daily quests with progress
  - Weekly quests with progress
  - Reset timer
- **Actions:**
  - "Claim" per quest
  - "Claim All"
- **Stories:** US-PM-008

### 6.3 Quest Completion Celebration
- **Purpose:** Celebrate quest completion
- **Trigger:** Quest completes
- **Size:** Small toast
- **Priority:** Phase 2
- **Content:**
  - "Quest Complete!"
  - Rewards
- **Actions:**
  - "Claim"
  - Auto-dismiss
- **Stories:** US-PM-008

### 6.4 Achievement Unlock Celebration
- **Purpose:** Celebrate achievements
- **Trigger:** Achievement unlocked
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - "Achievement Unlocked!"
  - Icon and name
  - Rewards
- **Actions:**
  - "Awesome!"
  - "View All"
- **Stories:** US-PM-024, US-PM-025

### 6.5 Achievement Browser Modal
- **Purpose:** Track achievements
- **Trigger:** Click "Achievements"
- **Size:** Large fullscreen
- **Priority:** Phase 3
- **Content:**
  - Categories
  - Progress bars
  - Locked/unlocked status
- **Actions:**
  - Click for details
  - Filter
- **Stories:** US-PM-024, US-PM-025

### 6.6 Supporter Pack Store Modal
- **Purpose:** Sell supporter pack
- **Trigger:** Click "Supporter Pack"
- **Size:** Large
- **Priority:** Phase 2
- **Content:**
  - Benefits list
  - Comparison table
  - Price
  - FAQs
- **Actions:**
  - "Purchase"
  - "Learn More"
- **Stories:** US-PM-015, US-PM-016, US-PM-035

### 6.7 Purchase Confirmation Modal
- **Purpose:** Confirm purchase
- **Trigger:** Click "Purchase"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Price confirmation
  - Benefits recap
- **Actions:**
  - "Confirm Purchase"
  - "Cancel"
- **Stories:** US-PM-016

### 6.8 Purchase Success Modal
- **Purpose:** Confirm success
- **Trigger:** Payment complete
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - "Welcome, Supporter!"
  - Benefits activated
  - Badge preview
- **Actions:**
  - "Start Enjoying"
- **Stories:** US-PM-016, US-PM-017

### 6.9 Recruitment Pool Refresh Confirmation
- **Purpose:** Confirm gem spend
- **Trigger:** Click "Refresh Pool"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Gem cost
  - Current balance
- **Actions:**
  - "Refresh"
  - "Cancel"
- **Stories:** US-PM-010

### 6.10 Expand Slots Confirmation
- **Purpose:** Confirm slot purchase
- **Trigger:** Click "Expand"
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Current slots
  - Gem cost
  - New total
- **Actions:**
  - "Expand"
  - "Cancel"
- **Stories:** US-PM-013

### 6.11 Settings Modal
- **Purpose:** Account management
- **Trigger:** Click "Settings"
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - Profile, Preferences, Data tabs
  - All settings controls
- **Actions:**
  - Per-setting controls
  - "Save"
- **Stories:** US-PM-020 to US-PM-022

### 6.12 Account Deletion Confirmation
- **Purpose:** Prevent accidental deletion
- **Trigger:** Click "Delete Account"
- **Size:** Small
- **Priority:** Phase 3
- **Content:**
  - Strong warning
  - Type account name
- **Actions:**
  - "Permanently Delete"
  - "Cancel"
- **Stories:** US-PM-022

### 6.13 Zone/Feature Unlock Celebration
- **Purpose:** Celebrate unlocks
- **Trigger:** Milestone reached
- **Size:** Medium
- **Priority:** Phase 1
- **Content:**
  - "Feature Unlocked!"
  - Preview
  - Reward
- **Actions:**
  - "Try It Now"
  - "Later"
- **Stories:** US-PM-002, US-PM-004

### 6.14 Cosmetics Application Modal
- **Purpose:** Apply cosmetics
- **Trigger:** Click "Cosmetics"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Categories (themes, skins, badges)
  - Preview
  - Unlock status
- **Actions:**
  - "Preview"
  - "Apply"
- **Stories:** US-PM-019, US-PM-027 to US-PM-029

### 6.15 Personal Goals Modal
- **Purpose:** Custom milestones
- **Trigger:** Click "Goals"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Goal creation form
  - Pinned goals
  - Progress tracking
- **Actions:**
  - "Create"
  - "Pin"
  - "Mark Complete"
- **Stories:** US-PM-026

---

## 7. System & Utility (12 modals)

### 7.1 Help Menu Modal
- **Purpose:** Help documentation
- **Trigger:** Click "Help"
- **Size:** Large
- **Priority:** Phase 1
- **Content:**
  - Searchable topics
  - Categories
  - FAQ
  - Contact link
- **Actions:**
  - Search
  - Navigate
  - "Contact Support"
- **Stories:** US-OB-021

### 7.2 Error Modal
- **Purpose:** Display errors
- **Trigger:** API errors, failures
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Error icon
  - User-friendly message
  - Technical details (expandable)
- **Actions:**
  - "Retry"
  - "Dismiss"
  - "Report"
- **Stories:** System requirement

### 7.3 Generic Confirmation Dialog
- **Purpose:** Reusable confirmation
- **Trigger:** Various actions
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Title, message
  - Warning level
- **Actions:**
  - "Confirm"
  - "Cancel"
- **Stories:** System requirement

### 7.4 Loading Overlay
- **Purpose:** Loading states
- **Trigger:** Async operations
- **Size:** Small overlay
- **Priority:** Phase 1
- **Content:**
  - Spinner or progress
  - Loading message
- **Actions:**
  - "Cancel" (if applicable)
- **Stories:** System requirement

### 7.5 Notification Toast System
- **Purpose:** Non-blocking notifications
- **Trigger:** Various events
- **Size:** Small toast
- **Priority:** Phase 1
- **Content:**
  - Icon + message
  - Notification type
- **Actions:**
  - Click for details
  - Dismiss
- **Stories:** US-OB-024

### 7.6 Notification History Modal
- **Purpose:** View past notifications
- **Trigger:** Click notification icon
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Chronological list
  - Filter by type
- **Actions:**
  - Click notification
  - "Mark All Read"
  - "Clear All"
- **Stories:** System requirement

### 7.7 Insufficient Currency Modal
- **Purpose:** Not enough gold/gems
- **Trigger:** Action without funds
- **Size:** Small
- **Priority:** Phase 1
- **Content:**
  - Required vs current
  - Ways to earn
- **Actions:**
  - "Earn More"
  - "Cancel"
- **Stories:** System requirement

### 7.8 Hint/Tip Popup
- **Purpose:** Contextual hints
- **Trigger:** Inactivity detection
- **Size:** Small
- **Priority:** Phase 2
- **Content:**
  - Context-specific advice
  - Lighthearted tone
- **Actions:**
  - "Thanks!"
  - "Disable Hints"
- **Stories:** US-OB-022

### 7.9 Feedback/Report Modal
- **Purpose:** Collect feedback
- **Trigger:** Click "Feedback"
- **Size:** Medium
- **Priority:** Phase 3
- **Content:**
  - Type selector
  - Description textarea
  - Screenshot option
- **Actions:**
  - "Submit"
  - "Cancel"
- **Stories:** System requirement

### 7.10 Data Export Confirmation
- **Purpose:** GDPR export
- **Trigger:** Click "Export Data"
- **Size:** Small
- **Priority:** Phase 3
- **Content:**
  - Export explanation
  - Data included
- **Actions:**
  - "Export"
  - "Cancel"
- **Stories:** US-PM-022

### 7.11 Sync Conflict Resolution Modal
- **Purpose:** Resolve save conflicts
- **Trigger:** Conflicting data detected
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Local vs server comparison
  - Timestamps
- **Actions:**
  - "Use Local"
  - "Use Server"
- **Stories:** US-PM-023

### 7.12 Maintenance Notice Modal
- **Purpose:** Announce maintenance
- **Trigger:** Scheduled maintenance
- **Size:** Medium
- **Priority:** Phase 2
- **Content:**
  - Date/time
  - Duration
  - Compensation
- **Actions:**
  - "Understood"
- **Stories:** System requirement

---

## Summary by Priority

### Phase 1 (MVP) - ~35 modals
- Account creation, login, guest flow
- Hero detail, recruitment
- Team formation, expedition results, logs
- Inventory, item detail, equip
- Basic settings, help
- Loading, errors, confirmations

### Phase 2 - ~30 modals
- Welcome back, passive income
- Story cutscenes, dungeon setup
- Monster/schematic collection
- Dungeon builder, synergy indicators
- Auto-equip, set bonuses
- Shop, supporter pack
- Daily login, quests

### Phase 3+ - ~25 modals
- Achievements, goals
- Hero comparison, prestige calculator
- Synergy codex, statistics
- Cosmetics
- Advanced gear optimization
- Loadouts, set planner

### Phase 4 - ~7 modals
- Password recovery
- Bulk hero management
- Auto-salvage
- Advanced feedback
