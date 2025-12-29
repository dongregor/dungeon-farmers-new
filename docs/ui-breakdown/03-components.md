# Dungeon Farmers - Shared Components

**Last Updated:** 2025-12-29
**Total Components:** 50+
**Status:** Complete component library specification

---

## Overview

This document defines all reusable Vue components for Dungeon Farmers, organized by category. Each component includes:
- Purpose and usage contexts
- Props/variants
- Visual states
- Related user stories

### Design Principles
1. **Variant props** for different contexts (compact vs detailed)
2. **Consistent color coding** (rarity, efficiency, stat changes)
3. **Loading states** for async operations
4. **Empty states** for collections
5. **Comparison modes** for decision support
6. **Accessibility** (ARIA labels, keyboard nav)
7. **Mobile-first** responsive design

---

## 1. Card Components

### HeroCard.vue
**Purpose:** Display hero information in roster, team formation, expedition results, and prestige screens.

**Props:**
```typescript
interface HeroCardProps {
  hero: Hero
  variant: 'compact' | 'default' | 'detailed' | 'selectable'
  showStatus?: boolean  // Display "On Expedition", "Stationed", "Idle"
  showPower?: boolean
  showPrestige?: boolean
  selectable?: boolean
  selected?: boolean
  disabled?: boolean
}
```

**Visual States:**
- Default: Idle hero display
- Selected: Highlighted border, checkmark
- Disabled: Greyed out (hero busy)
- On Expedition: Overlay badge with timer
- Stationed: Overlay badge with location
- Loading: Skeleton loader
- Empty: Placeholder for empty slot

**Usage Contexts:**
- Heroes Roster page (grid/list)
- Team Formation modal
- Expedition Results
- Prestige screen
- Passive Assignments

**Related Stories:** US-HM-001, US-HM-004, US-EX-002, US-EX-007, US-EX-014

---

### MonsterCard.vue
**Purpose:** Display monsters in collection, dungeon builder, capture results, and loot tables.

**Props:**
```typescript
interface MonsterCardProps {
  monster: Monster
  variant: 'grid' | 'list' | 'placement' | 'preview'
  showLootTable?: boolean
  showCompatibility?: boolean  // For dungeon slots
  showPlacementStatus?: boolean
  draggable?: boolean
  selected?: boolean
}
```

**Visual States:**
- Default: Standard display
- Selected: Highlight border
- Placed: Dimmed with "In Use" badge
- New Capture: Sparkle/glow effect
- Compatible: Green border (valid for slot)
- Incompatible: Red border with tooltip
- Undiscovered: Silhouette

**Usage Contexts:**
- Monster Collection page
- Dungeon Builder sidebar
- Expedition Results (captures)
- Loot Table displays

**Related Stories:** US-DB-001, US-DB-002, US-DB-005, US-DB-015, US-DB-026

---

### ItemCard.vue
**Purpose:** Display equipment in inventory, loot results, comparison views, and equipment slots.

**Props:**
```typescript
interface ItemCardProps {
  item: Item
  variant: 'grid' | 'list' | 'comparison' | 'equipped'
  showComparison?: boolean  // vs currently equipped
  showSetInfo?: boolean
  showLocked?: boolean
  highlightUpgrade?: boolean
  selected?: boolean
}
```

**Visual States:**
- Default: Standard display with rarity border
- Equipped: Character icon badge
- Locked: Padlock overlay
- Upgrade: Green arrow indicator
- Downgrade: Red arrow indicator
- Set Item: Set icon/border
- Selected: Highlight border
- New: "NEW" badge pulse

**Usage Contexts:**
- Inventory page (grid/list)
- Hero Detail equipment slots
- Loot Results modal
- Item Comparison view

**Related Stories:** US-EQ-001, US-EQ-005, US-EQ-008, US-EQ-009, US-EQ-016, US-EQ-019

---

### SchematicCard.vue
**Purpose:** Display dungeon schematics in collection and builder interface.

**Props:**
```typescript
interface SchematicCardProps {
  schematic: Schematic
  variant: 'preview' | 'detailed' | 'selectable'
  showRequirements?: boolean
  showBuildable?: boolean
  showActive?: boolean
  selected?: boolean
}
```

**Visual States:**
- Default: Standard display
- Buildable: Green "Ready to Build" badge
- Partially Buildable: Yellow "3/4 slots" indicator
- Active: "In Use" badge
- Selected: Highlight border
- Locked: Requirements not met overlay

**Usage Contexts:**
- Schematic Collection page
- Dungeon Builder selection

**Related Stories:** US-DB-010, US-DB-011, US-DB-012, US-DB-014

---

## 2. Stat & Info Displays

### PowerScore.vue
**Purpose:** Display power values for heroes, teams, monsters, and dungeons.

**Props:**
```typescript
interface PowerScoreProps {
  value: number
  variant: 'hero' | 'team' | 'monster' | 'dungeon'
  showBreakdown?: boolean
  size: 'sm' | 'md' | 'lg'
  compareValue?: number
}
```

**Visual States:**
- Default: Standard number display
- Comparison: Show +/- difference with color
- Breakdown Expanded: Show calculation details
- Insufficient: Red (below requirement)
- Optimal: Green (meets/exceeds)

**Related Stories:** US-HM-004, US-HM-011, US-EX-002, US-EX-023, US-DB-028

---

### RarityBadge.vue
**Purpose:** Display rarity tiers with consistent styling across all entities.

**Props:**
```typescript
interface RarityBadgeProps {
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'
  variant: 'text' | 'badge' | 'border' | 'glow'
  size: 'xs' | 'sm' | 'md' | 'lg'
}
```

**Color Scheme:**
- Common: Grey (#6B7280)
- Uncommon: Green (#22C55E)
- Rare: Blue (#3B82F6)
- Epic: Purple (#A855F7)
- Legendary: Gold (#F59E0B)
- Mythic: Red gradient with glow

**Related Stories:** US-HM-001, US-DB-001, US-EQ-001, US-DB-004

---

### TraitDisplay.vue
**Purpose:** Show hero traits with icons, descriptions, and active states.

**Props:**
```typescript
interface TraitDisplayProps {
  trait: Trait
  variant: 'compact' | 'full' | 'tooltip'
  showActive?: boolean  // Highlight if conditions met
  showDescription?: boolean
}
```

**Visual States:**
- Active: Bright colors, pulsing effect
- Inactive: Muted/greyed
- Conditional: Icon indicates context requirement
- Tag: Chip/badge style
- Flat Bonus: Direct stat display
- Hover: Expanded tooltip

**Related Stories:** US-HM-012, US-HM-013, US-EX-028, US-OB-011

---

### StatBar.vue
**Purpose:** Visual stat representation (HP, ATK, DEF, etc.) with bars or numbers.

**Props:**
```typescript
interface StatBarProps {
  stat: { name: string; value: number; max?: number }
  variant: 'bar' | 'numeric' | 'combined'
  showComparison?: boolean
  compareValue?: number
  color?: string
}
```

**Visual States:**
- Default: Solid fill bar
- Animated: Fill animates on change
- Comparison: Overlay previous value
- Increase: Green highlight
- Decrease: Red highlight

**Related Stories:** US-HM-011, US-EQ-005, US-EQ-007, US-EQ-009

---

### EfficiencyIndicator.vue
**Purpose:** Show expedition/dungeon efficiency (60-150%) with visual feedback.

**Props:**
```typescript
interface EfficiencyIndicatorProps {
  efficiency: number  // 60-150
  variant: 'compact' | 'detailed' | 'breakdown'
  showBreakdown?: boolean
}
```

**Tier Colors:**
- 60-80%: Red/Bronze
- 80-100%: Yellow/Silver
- 100-130%: Green/Gold
- 130-150%: Blue/Platinum

**Breakdown Shows:**
- Base Power contribution
- Slot Match bonus (+20% max)
- Tag bonus (+30% max)

**Related Stories:** US-EX-003, US-EX-011, US-EX-023, US-DB-028

---

### XPProgressBar.vue
**Purpose:** Show hero XP progress with level milestones.

**Props:**
```typescript
interface XPProgressBarProps {
  currentXP: number
  requiredXP: number
  level: number
  nextMilestone?: number  // Trait unlock level
  showPercentage?: boolean
}
```

**Visual States:**
- Default: Progress bar fill
- Near Level Up: Glowing effect
- At Milestone: Special indicator
- Animated: Smooth transitions

**Related Stories:** US-HM-020, US-HM-021, US-HM-022, US-HM-023

---

## 3. Timer & Progress Components

### ExpeditionTimer.vue
**Purpose:** Countdown timer for active expeditions and dungeons.

**Props:**
```typescript
interface ExpeditionTimerProps {
  endTime: Date | number
  variant: 'compact' | 'detailed' | 'card'
  showProgress?: boolean
  showPhases?: boolean
}
```

**Visual States:**
- Active: Countdown running
- Completing: Final seconds (<60s) pulse
- Complete: "Ready!" state
- Can Recall: Show recall button
- Offline Complete: "Completed while away"

**Format:** Human-readable (2h 34m 12s)

**Related Stories:** US-EX-018, US-EX-019, US-EX-022, US-DB-013

---

### ProgressBar.vue
**Purpose:** Generic progress bar for XP, collection, capacity, etc.

**Props:**
```typescript
interface ProgressBarProps {
  current: number
  max: number
  variant: 'default' | 'striped' | 'animated'
  label?: string
  showPercentage?: boolean
  color?: string
  milestones?: number[]
}
```

**Visual States:**
- Default: Solid fill
- Animated: Shimmer effect
- Near Full (>80%): Warning color
- Complete: Success color
- With Milestones: Markers on bar

**Related Stories:** US-HM-022, US-DB-003, US-EQ-003, US-PM-001, US-PM-024

---

### PhaseIndicator.vue
**Purpose:** Show expedition phases (Setup → Travel → Encounter → Return).

**Props:**
```typescript
interface PhaseIndicatorProps {
  phases: Phase[]
  currentPhase: number
  variant: 'steps' | 'dots' | 'timeline'
}
```

**Visual States:**
- Completed Phases: Checkmark
- Current Phase: Pulsing/highlighted
- Upcoming Phases: Muted

**Related Stories:** US-EX-019, US-EX-020

---

### CountdownTimer.vue
**Purpose:** Generic countdown for daily reset, pool refresh, etc.

**Props:**
```typescript
interface CountdownTimerProps {
  endTime: Date | number
  format: 'full' | 'short' | 'relative'
  onComplete?: () => void
}
```

**Formats:**
- Full: "5h 34m 12s"
- Short: "5h 34m"
- Relative: "in 5 hours"

**Related Stories:** US-PM-005, US-PM-007

---

## 4. Input & Selection Components

### TeamSlot.vue
**Purpose:** Draggable hero slot for team formation in expeditions and dungeons.

**Props:**
```typescript
interface TeamSlotProps {
  slot: Slot
  variant: 'flexible' | 'fixed' | 'tagged'
  requirement?: string  // Role, tag, etc.
  hero?: Hero  // Assigned hero
  droppable?: boolean
}
```

**Visual States:**
- Empty: Dashed border, show requirement
- Filled: Show hero card
- Valid Drop Target: Green highlight
- Invalid Drop Target: Red with tooltip
- Required: Red asterisk
- Optional: Grey indicator

**Related Stories:** US-EX-002, US-EX-007, US-EX-011, US-DB-015

---

### DungeonSlotGrid.vue
**Purpose:** Grid layout for placing monsters in dungeon schematics.

**Props:**
```typescript
interface DungeonSlotGridProps {
  schematic: Schematic
  placedMonsters: PlacedMonster[]
  editable?: boolean
}
```

**Visual States:**
- Empty Slots: Show type requirement
- Filled Slots: Show monster card
- Dragging Over: Highlight valid slots
- Invalid Placement: Shake animation
- Synergy Active: Connecting lines/glow
- Complete: All slots filled checkmark

**Related Stories:** US-DB-014, US-DB-015, US-DB-020

---

### FilterPanel.vue
**Purpose:** Reusable filter UI for heroes, monsters, items, expeditions.

**Props:**
```typescript
interface FilterPanelProps {
  filters: FilterConfig[]
  activeFilters: Record<string, any>
  variant: 'sidebar' | 'dropdown' | 'chips'
  showCount?: boolean
}

interface FilterConfig {
  key: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options?: FilterOption[]
}
```

**Visual States:**
- Default: Collapsed/hidden filters
- Expanded: Show all options
- Active Filter: Highlighted chip
- Clear Button: Visible when filters applied
- Result Count: Updates live

**Related Stories:** US-HM-003, US-EQ-002, US-DB-001, US-EX-001

---

### SortDropdown.vue
**Purpose:** Consistent sorting controls across all list views.

**Props:**
```typescript
interface SortDropdownProps {
  options: SortOption[]
  currentSort: string
  direction: 'asc' | 'desc'
}
```

**Visual States:**
- Default: Shows current sort
- Open: Dropdown menu visible
- Sort Direction: Arrow icon
- Persisted: Checkmark on saved preference

**Related Stories:** US-HM-002, US-EQ-002, US-DB-001

---

### SearchBar.vue
**Purpose:** Search input with autocomplete for names, traits, items.

**Props:**
```typescript
interface SearchBarProps {
  placeholder: string
  variant: 'simple' | 'autocomplete' | 'advanced'
  suggestions?: string[]
  debounce?: number
}
```

**Visual States:**
- Empty: Placeholder visible
- Typing: Show clear button
- Suggestions: Dropdown list
- No Results: Helpful message

**Related Stories:** US-HM-003, US-OB-021, US-DB-022

---

### ViewToggle.vue
**Purpose:** Switch between list and grid views for collections.

**Props:**
```typescript
interface ViewToggleProps {
  currentView: 'grid' | 'list'
}
```

**Emits:** `update:view`

**Related Stories:** US-HM-001, US-DB-001, US-EQ-001

---

## 5. Currency & Resource Displays

### CurrencyDisplay.vue
**Purpose:** Show gold, gems, materials with consistent formatting.

**Props:**
```typescript
interface CurrencyDisplayProps {
  currency: 'gold' | 'gems' | 'material'
  amount: number
  variant: 'inline' | 'card' | 'header'
  showChange?: boolean  // Animate +/- changes
  clickable?: boolean
}
```

**Visual States:**
- Default: Icon + formatted number
- Increase: Green pulse animation
- Decrease: Red flash
- Insufficient: Red color
- Clickable: Cursor pointer, hover state

**Number Formatting:**
- Under 1K: Full number (999)
- 1K-999K: Abbreviated (12.5K)
- 1M+: Abbreviated (1.2M)

**Related Stories:** US-EQ-027, US-PM-014, US-PM-039, US-PM-040

---

### ResourceCapacity.vue
**Purpose:** Display inventory/slot capacity with warning states.

**Props:**
```typescript
interface ResourceCapacityProps {
  current: number
  max: number
  resourceType: string
  variant: 'compact' | 'detailed'
  showExpand?: boolean
}
```

**Visual States:**
- Normal (<80%): Default color
- Warning (80-99%): Yellow
- Full (100%): Red with alert
- Expandable: Show expand button

**Related Stories:** US-EQ-003, US-HM-001, US-DB-030, US-PM-013

---

### IncomeTracker.vue
**Purpose:** Show passive income rates and accumulated resources.

**Props:**
```typescript
interface IncomeTrackerProps {
  resource: Resource
  rate: number  // Per hour
  accumulated: number
  variant: 'compact' | 'detailed'
  maxAccumulation?: number
}
```

**Visual States:**
- Accumulating: Animated ticker
- Ready to Collect: Pulse effect
- Collected: Success animation
- Capped: Warning indicator

**Related Stories:** US-EX-014, US-EX-015, US-EX-031, US-EX-032

---

## 6. Modal & Overlay Components

### BaseModal.vue
**Purpose:** Base modal wrapper with consistent styling.

**Props:**
```typescript
interface BaseModalProps {
  isOpen: boolean
  title?: string
  size: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  closeable?: boolean
  closeOnOverlay?: boolean
}
```

**Features:**
- Escape key to close
- Click outside to close (optional)
- Focus trap
- Scroll lock on body
- Transition animations

---

### RewardModal.vue
**Purpose:** Display expedition results, loot, level-ups, achievements.

**Props:**
```typescript
interface RewardModalProps {
  rewards: Reward[]
  variant: 'expedition' | 'loot' | 'milestone' | 'achievement'
  showLog?: boolean
}
```

**Visual States:**
- Enter: Animated reveal
- Rare Items: Sparkle/glow effect
- Multiple Rewards: Staggered animation
- Collectible: "Collect" button
- Collected: Success state

**Related Stories:** US-EX-022, US-EX-025, US-EQ-019, US-OB-020, US-DB-007

---

### ComparisonModal.vue
**Purpose:** Side-by-side comparison for heroes, items, builds.

**Props:**
```typescript
interface ComparisonModalProps {
  items: (Hero | Item | Build)[]  // 2-3 items
  type: 'heroes' | 'items' | 'builds'
  variant: 'simple' | 'detailed'
}
```

**Visual States:**
- Side-by-side columns
- Highlight differences (green higher, red lower)
- Stat rows aligned
- Quick actions: equip, swap

**Related Stories:** US-HM-005, US-EQ-008, US-EQ-018, US-DB-023

---

### ConfirmationDialog.vue
**Purpose:** Reusable confirmation for actions.

**Props:**
```typescript
interface ConfirmationDialogProps {
  title: string
  message: string
  variant: 'warning' | 'danger' | 'info'
  confirmText?: string
  cancelText?: string
  requireTyping?: string  // Type to confirm
}
```

**Visual States:**
- Warning: Yellow theme
- Danger: Red theme (destructive actions)
- Info: Blue theme
- Loading: Spinner on confirm

**Related Stories:** US-HM-028, US-HM-030, US-EX-021, US-DB-030

---

### TutorialOverlay.vue
**Purpose:** Guided tutorial with spotlight and tooltips.

**Props:**
```typescript
interface TutorialOverlayProps {
  steps: TutorialStep[]
  currentStep: number
  dismissible?: boolean
}

interface TutorialStep {
  target: string  // CSS selector
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right'
}
```

**Visual States:**
- Spotlight: Darkened overlay with cutout
- Tooltip: Positioned arrow bubble
- Progress: Dots indicator
- Skip: Prominent skip button

**Related Stories:** US-OB-008, US-OB-010, US-OB-016, US-DB-016, US-EX-034

---

## 7. Layout & Navigation Components

### TabNavigation.vue
**Purpose:** Tab controls for multi-section views.

**Props:**
```typescript
interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  variant: 'underline' | 'pills' | 'segmented'
  showBadges?: boolean
}

interface Tab {
  key: string
  label: string
  badge?: number
  disabled?: boolean
}
```

**Visual States:**
- Active: Highlighted
- Inactive: Muted
- Badge: Notification count
- Disabled: Greyed out
- Mobile: Scrollable tabs

**Related Stories:** All major feature sections

---

### NotificationBadge.vue
**Purpose:** Notification indicators for pending actions.

**Props:**
```typescript
interface NotificationBadgeProps {
  count?: number
  variant: 'dot' | 'number' | 'pulse'
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  color?: string
}
```

**Visual States:**
- Default: Red badge with count
- Dot: Small indicator (no number)
- Pulse: Animated for urgent
- Max Count: "99+"

**Related Stories:** US-EX-022, US-EX-024, US-OB-018, US-PM-002

---

### BreadcrumbNav.vue
**Purpose:** Show navigation path in nested views.

**Props:**
```typescript
interface BreadcrumbNavProps {
  path: Breadcrumb[]
  variant: 'simple' | 'clickable'
}

interface Breadcrumb {
  label: string
  to?: string  // Route path
}
```

**Visual States:**
- Current Page: Bold, no link
- Previous Pages: Links
- Separator: Chevron/slash
- Mobile: Collapse middle items

---

### PageHeader.vue
**Purpose:** Consistent page header with title and actions.

**Props:**
```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: Action[]
  backLink?: string
}
```

**Sections:**
- Title area
- Subtitle/description
- Action buttons
- Back navigation (optional)

---

## 8. Specialized Components

### ExpeditionLog.vue
**Purpose:** Display narrative expedition logs with trait reactions.

**Props:**
```typescript
interface ExpeditionLogProps {
  log: ExpeditionLog
  variant: 'compact' | 'full' | 'summary'
  showReactions?: boolean
}
```

**Visual States:**
- Chronological events list
- Hero dialogue styled differently
- Trait-triggered reactions highlighted
- Expandable/collapsible sections
- Shareable: export/copy button

**Related Stories:** US-OB-011, US-EX-027, US-EX-028, US-EX-029

---

### LootTable.vue
**Purpose:** Display monster/dungeon loot tables with drop rates.

**Props:**
```typescript
interface LootTableProps {
  lootTable: LootEntry[]
  variant: 'preview' | 'detailed'
  showRates?: boolean
  showOwned?: boolean
}

interface LootEntry {
  item: Item
  dropRate: number
  owned?: boolean
  needed?: boolean
}
```

**Visual States:**
- Items grouped by rarity
- Drop rates: percentage or relative
- Needed Items: Highlight
- Owned Items: Checkmark
- Expandable: Show all vs top items

**Related Stories:** US-DB-002, US-DB-017, US-DB-026, US-EQ-020, US-EQ-021

---

### SynergyIndicator.vue
**Purpose:** Show synergy bonuses between placed monsters.

**Props:**
```typescript
interface SynergyIndicatorProps {
  synergies: Synergy[]
  variant: 'icon' | 'detailed' | 'connections'
  showDiscovery?: boolean
}
```

**Visual States:**
- Active Synergies: Glowing connections
- Potential Synergies: Dotted preview
- Discovered: Unlocked icon
- Undiscovered: "???" mystery
- Tooltip: Synergy description

**Related Stories:** US-DB-020, US-DB-021, US-DB-022

---

### SetBonusTracker.vue
**Purpose:** Track equipment set progress and active bonuses.

**Props:**
```typescript
interface SetBonusTrackerProps {
  sets: EquipmentSet[]
  variant: 'compact' | 'full'
  showInactive?: boolean
}
```

**Visual States:**
- Active Bonuses: Highlighted
- Progress: X/6 pieces indicator
- Missing Pieces: Greyed slots
- Complete Set: Celebration animation
- Set Pieces: Visual grouping

**Related Stories:** US-EQ-006, US-EQ-013, US-EQ-014, US-EQ-015

---

### PrestigeBadge.vue
**Purpose:** Display hero prestige level with visual flair.

**Props:**
```typescript
interface PrestigeBadgeProps {
  prestigeLevel: number
  variant: 'icon' | 'full' | 'tooltip'
  size: 'sm' | 'md' | 'lg'
}
```

**Visual States:**
- Level 0: No badge
- Level 1-3: Bronze/silver/gold stars
- Level 4+: Animated effects
- Tooltip: Shows permanent bonuses

**Related Stories:** US-HM-024, US-HM-025, US-HM-026

---

### SupporterBadge.vue
**Purpose:** Display supporter status.

**Props:**
```typescript
interface SupporterBadgeProps {
  isSupporter: boolean
  joinDate?: Date
  variant: 'icon' | 'full'
}
```

**Related Stories:** US-PM-017, US-PM-032

---

## 9. Utility Components

### LoadingSpinner.vue
**Purpose:** Consistent loading states across the app.

**Props:**
```typescript
interface LoadingSpinnerProps {
  size: 'sm' | 'md' | 'lg'
  variant: 'spinner' | 'skeleton' | 'dots'
  text?: string
}
```

**Visual States:**
- Spinner: Rotating circle
- Skeleton: Content placeholder
- Dots: Animated bounce

---

### EmptyState.vue
**Purpose:** Placeholder for empty lists/collections.

**Props:**
```typescript
interface EmptyStateProps {
  message: string
  icon?: string
  actionText?: string
  actionLink?: string
}
```

**Visual States:**
- Icon: Themed illustration
- Message: Friendly text
- Action: CTA button
- Help Text: Additional guidance

---

### Tooltip.vue
**Purpose:** Contextual help and info throughout the app.

**Props:**
```typescript
interface TooltipProps {
  content: string | Component
  position: 'top' | 'bottom' | 'left' | 'right'
  variant: 'info' | 'help' | 'warning'
  trigger: 'hover' | 'click' | 'focus'
}
```

**Visual States:**
- Hidden: Default
- Visible: Fade in
- Arrow: Points to target
- Mobile: Tap to dismiss

**Related Stories:** US-OB-018, US-OB-022, US-HM-012, US-HM-013

---

### Toast.vue
**Purpose:** Temporary notifications for actions and events.

**Props:**
```typescript
interface ToastProps {
  message: string
  variant: 'success' | 'error' | 'warning' | 'info'
  duration?: number  // ms
  action?: { label: string; onClick: () => void }
}
```

**Visual States:**
- Slide in from top/bottom
- Auto-dismiss timer
- Dismissible: X button
- Action: Clickable text/button
- Stackable: Multiple toasts

**Related Stories:** US-EX-020, US-OB-020, US-DB-007, US-PM-002

---

### SkeletonLoader.vue
**Purpose:** Content loading placeholder.

**Props:**
```typescript
interface SkeletonLoaderProps {
  type: 'text' | 'card' | 'avatar' | 'custom'
  lines?: number
  width?: string
  height?: string
}
```

---

### ErrorBoundary.vue
**Purpose:** Catch and display component errors gracefully.

**Props:**
```typescript
interface ErrorBoundaryProps {
  fallback?: Component
  onError?: (error: Error) => void
}
```

---

## 10. Form Components

### BaseInput.vue
**Purpose:** Styled text input with validation.

**Props:**
```typescript
interface BaseInputProps {
  modelValue: string
  type: 'text' | 'email' | 'password' | 'number'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}
```

---

### BaseButton.vue
**Purpose:** Styled button with variants.

**Props:**
```typescript
interface BaseButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
}
```

---

### BaseSelect.vue
**Purpose:** Styled select dropdown.

**Props:**
```typescript
interface BaseSelectProps {
  modelValue: string
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
}
```

---

### BaseCheckbox.vue
**Purpose:** Styled checkbox.

**Props:**
```typescript
interface BaseCheckboxProps {
  modelValue: boolean
  label?: string
  disabled?: boolean
}
```

---

### BaseToggle.vue
**Purpose:** Styled toggle switch.

**Props:**
```typescript
interface BaseToggleProps {
  modelValue: boolean
  label?: string
  disabled?: boolean
}
```

---

## Component Directory Structure

```
/app/components/
├── cards/
│   ├── HeroCard.vue
│   ├── MonsterCard.vue
│   ├── ItemCard.vue
│   └── SchematicCard.vue
├── display/
│   ├── PowerScore.vue
│   ├── RarityBadge.vue
│   ├── TraitDisplay.vue
│   ├── StatBar.vue
│   ├── EfficiencyIndicator.vue
│   └── XPProgressBar.vue
├── progress/
│   ├── ExpeditionTimer.vue
│   ├── ProgressBar.vue
│   ├── PhaseIndicator.vue
│   └── CountdownTimer.vue
├── input/
│   ├── TeamSlot.vue
│   ├── DungeonSlotGrid.vue
│   ├── FilterPanel.vue
│   ├── SortDropdown.vue
│   ├── SearchBar.vue
│   └── ViewToggle.vue
├── economy/
│   ├── CurrencyDisplay.vue
│   ├── ResourceCapacity.vue
│   └── IncomeTracker.vue
├── modals/
│   ├── BaseModal.vue
│   ├── RewardModal.vue
│   ├── ComparisonModal.vue
│   ├── ConfirmationDialog.vue
│   └── TutorialOverlay.vue
├── navigation/
│   ├── TabNavigation.vue
│   ├── NotificationBadge.vue
│   ├── BreadcrumbNav.vue
│   └── PageHeader.vue
├── specialized/
│   ├── ExpeditionLog.vue
│   ├── LootTable.vue
│   ├── SynergyIndicator.vue
│   ├── SetBonusTracker.vue
│   ├── PrestigeBadge.vue
│   └── SupporterBadge.vue
├── utility/
│   ├── LoadingSpinner.vue
│   ├── EmptyState.vue
│   ├── Tooltip.vue
│   ├── Toast.vue
│   ├── SkeletonLoader.vue
│   └── ErrorBoundary.vue
└── form/
    ├── BaseInput.vue
    ├── BaseButton.vue
    ├── BaseSelect.vue
    ├── BaseCheckbox.vue
    └── BaseToggle.vue
```

---

## Implementation Priority

### Phase 1 (MVP)
- All card components (Hero, Item)
- Basic display (PowerScore, RarityBadge, StatBar)
- Progress (ExpeditionTimer, ProgressBar)
- Input (TeamSlot, FilterPanel, SortDropdown)
- Economy (CurrencyDisplay, ResourceCapacity)
- Modals (BaseModal, ConfirmationDialog)
- Navigation (TabNavigation, NotificationBadge)
- Utility (LoadingSpinner, EmptyState, Toast)
- Form (all base inputs)

### Phase 2
- MonsterCard, SchematicCard
- TraitDisplay, EfficiencyIndicator
- DungeonSlotGrid
- RewardModal, ComparisonModal
- TutorialOverlay
- ExpeditionLog, LootTable
- SynergyIndicator

### Phase 3+
- SetBonusTracker
- PrestigeBadge, SupporterBadge
- Advanced variants
- Full accessibility features
