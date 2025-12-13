# Navigation & Dashboard Design
**Dungeon Farmers UI Architecture**

**Last Updated**: 2025-11-22
**Status**: Design Specification
**Phase**: Phase 1 (MVP Foundation)

---

## 🎯 Design Goals

**Primary Objectives:**
1. **Unified Navigation** - Seamless movement between all game systems
2. **Information at a Glance** - Dashboard shows player status and actionable items
3. **Mobile-First Responsive** - Works perfectly on phones, tablets, and desktop
4. **Corporate Aesthetic** - Professional, clean, with subtle gaming humor
5. **Progressive Disclosure** - Show Phase 1 features now, expand for Phase 2+

**User Experience Principles:**
- **No Dead Ends** - Always provide navigation escape routes
- **Context Awareness** - Show relevant actions based on player state
- **Action-Oriented** - Surface urgent/available actions prominently
- **Respect Player Time** - Quick access to all systems (≤2 clicks)

---

## 🗺️ Information Architecture

### Primary Navigation Structure

```
┌─────────────────────────────────────────────────┐
│  [Logo] Dungeon Farmers Corp.                  │
│                                                 │
│  🏠 HQ  👥 Heroes  🍺 Tavern  🗺️ Expeditions   │
│  ⚔️ Equipment  👤 Profile                      │
│                                    [Gold] [User]│
└─────────────────────────────────────────────────┘
```

**Navigation Hierarchy:**

**Tier 1 - Always Visible (Top Nav)**
1. **🏠 HQ (Dashboard)** - Central hub, home base
2. **👥 Heroes** - Hero roster management
3. **🍺 Tavern** - Hero recruitment (notification badge when refresh available)
4. **🗺️ Expeditions** - Active expeditions and available zones
5. **⚔️ Equipment** - Inventory management (badge with item count)
6. **👤 Profile** - Player stats and settings

**Tier 2 - Contextual (Within Sections)**
- Hero Detail (from Heroes)
- Zone Selection (from Expeditions)
- Expedition Results (from Expeditions)
- Equipment Detail Modal (from Equipment or Hero Detail)

**Tier 3 - Phase 2+ (Future)**
- **🏰 Dungeons** - Personal dungeon builder (LOCKED in demo, shown but grayed)
- **🤝 Alliance** - Guild management and raids (Phase 3)
- **📊 Metrics** - Analytics dashboard (Phase 3+, optional)

### Corporate Naming Convention

**System → UI Label Mapping:**

| Game System | Primary Label | Alternative/Tooltip |
|-------------|---------------|---------------------|
| Dashboard | **HQ** or **Command Center** | "Your operational headquarters" |
| Heroes | **Employee Roster** or **Heroes** | "Manage your workforce" |
| Tavern | **Recruitment Office** or **Tavern** | "Hire new talent" |
| Expeditions | **Field Operations** or **Expeditions** | "Deploy teams to zones" |
| Equipment | **Asset Inventory** or **Equipment** | "Manage company assets" |
| Profile | **Personnel File** or **Profile** | "Your employee profile" |
| Personal Dungeons | **R&D Labs** or **Dungeons** (Phase 2) | "Build test environments" |
| Alliance | **Corporate Alliance** or **Alliance** (Phase 3) | "Inter-company collaboration" |

**Recommendation**: Use PRIMARY labels in navigation (Heroes, Tavern, etc.) for clarity, use CORPORATE flavor in section headers and tooltips for tone.

**Rationale**: Based on CLAUDE.md guidance - Gaming/RPG parody is PRIMARY (70%), corporate flavor is OPTIONAL for UI only (10%). Don't sacrifice usability for theme.

---

## 🏠 Dashboard Design (HQ)

### Layout Structure

**Three-Column Responsive Grid:**

```
┌───────────────────────────────────────────────────────────┐
│  DUNGEON FARMERS - COMMAND CENTER                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│  │ PLAYER STATUS   │ │ ACTIVE OPS      │ │ QUICK STATS │ │
│  │                 │ │                 │ │             │ │
│  │ Level: 12       │ │ 🗺️ Expedition   │ │ 👥 Heroes   │ │
│  │ XP: ████░ 75%   │ │ Darkwood        │ │ 8 / 15      │ │
│  │                 │ │ ⏰ 12m 34s      │ │             │ │
│  │ 💰 Gold: 1,234  │ │ [View Details]  │ │ ⚔️ Equipment│ │
│  │ 🔷 AP: 45       │ │                 │ │ 42 items    │ │
│  │                 │ │ 🗺️ Expedition   │ │             │ │
│  │ [View Profile]  │ │ Frostpeak       │ │ 🍺 Tavern   │ │
│  └─────────────────┘ │ ⏰ 1h 05m       │ │ Refresh in  │ │
│                      │ [View Details]  │ │ 8 minutes   │ │
│  ┌─────────────────┐ │                 │ └─────────────┘ │
│  │ NOTIFICATIONS   │ │ [No Active Ops] │                 │
│  │                 │ └─────────────────┘ ┌─────────────┐ │
│  │ ⚠️ Hero at max  │                     │ ACTIONS     │ │
│  │ XP (Morgath)    │ ┌─────────────────┐ │             │ │
│  │ [Level Up]      │ │ AVAILABLE       │ │ 🗺️ Deploy   │ │
│  │                 │ │ EXPEDITIONS     │ │ Expedition  │ │
│  │ ✅ Quest done   │ │                 │ │             │ │
│  │ "First Steps"   │ │ 📍 Darkwood     │ │ 🍺 Visit    │ │
│  │ [Claim 100g]    │ │ Free / 15m      │ │ Tavern      │ │
│  │                 │ │                 │ │             │ │
│  │ [View All]      │ │ 📍 Ironforge    │ │ 👥 Manage   │ │
│  └─────────────────┘ │ 50g / 30m       │ │ Heroes      │ │
│                      │                 │ │             │ │
│  ┌─────────────────┐ │ 📍 Shadowfen    │ │ ⚔️ Sort     │ │
│  │ PHASE 2 PREVIEW │ │ 100g / 1h       │ │ Equipment   │ │
│  │ (LOCKED 🔒)     │ │                 │ └─────────────┘ │
│  │                 │ │ [See All Zones] │                 │
│  │ 🏰 Personal     │ └─────────────────┘                 │
│  │ Dungeons        │                                     │
│  │                 │                                     │
│  │ Build custom    │                                     │
│  │ dungeons with   │                                     │
│  │ captured        │                                     │
│  │ monsters!       │                                     │
│  │                 │                                     │
│  │ [Unlock: $9.99] │                                     │
│  └─────────────────┘                                     │
└───────────────────────────────────────────────────────────┘
```

### Dashboard Widgets (Detailed)

#### 1. Player Status Widget
**Purpose**: At-a-glance player progression and resources

**Content:**
- Player Level + XP progress bar (visual, percentage)
- Gold count with coin icon (clickable → Profile)
- Alliance Points (if > 0, Phase 3)
- Other resources (materials, Phase 2+)
- "View Full Profile" CTA button

**Design:**
- Card with gradient border (purple accent)
- Large, readable numbers (mobile-friendly)
- Animated progress bar
- Hover effects on clickable elements

**States:**
- Demo cap warning (Level 14/15 - "Approaching demo limit!")
- Low resources warning (Gold < 100 - "Running low on gold")

#### 2. Active Operations Widget
**Purpose**: Show in-progress expeditions with timers

**Content:**
- List of active expeditions (max 3 in demo, show capacity)
- Each expedition shows:
  - Zone name with icon/emoji
  - Hero count (e.g., "3 heroes deployed")
  - Countdown timer (live WebSocket updates)
  - Progress bar (visual time remaining)
  - "View Details" button → Expedition detail modal
- Empty state: "No active operations. Deploy your team!"
- CTA: "Start New Expedition" → Expeditions page

**Design:**
- Scrollable list if > 3 active (Phase 2+)
- Color-coded by time remaining:
  - Green: > 30 minutes
  - Yellow: 10-30 minutes
  - Red: < 10 minutes
  - Pulsing: Complete, ready to claim
- Completion notification sound + toast (opt-in)

**Interactions:**
- Click expedition → Detail modal with hero roster, zone info
- "Claim Rewards" button when complete (inline or modal)
- Real-time timer updates (WebSocket or SSE)

#### 3. Notifications Widget
**Purpose**: Actionable alerts and completed tasks

**Content:**
- Max 5 most recent notifications (scrollable or "View All")
- Types:
  - **Urgent** (red): Hero at max XP, expedition ready to claim
  - **Info** (blue): Quest completed, new feature unlocked
  - **Tip** (green): Tutorial hints, gameplay tips
  - **Unlock** (purple): Premium feature tease
- Each notification:
  - Icon/emoji
  - Short message (1-2 lines)
  - Timestamp (relative: "5m ago")
  - CTA button (e.g., "Level Up", "Claim Rewards")
- "Dismiss" or "Mark All Read" option

**Examples:**
- "⚠️ Morgath reached Level 15 (demo cap). [Unlock Premium]"
- "✅ Expedition to Darkwood complete! [Claim Rewards]"
- "🍺 Tavern heroes refreshed. [View New Recruits]"
- "🎉 Quest 'First Blood' completed. [Claim 100g]"

**Design:**
- Priority-based sorting (urgent → info)
- Color-coded left border by type
- Dismiss "X" button (hover)
- Auto-dismiss after action taken

#### 4. Available Expeditions Widget
**Purpose**: Quick access to start new expeditions

**Content:**
- Top 3-5 available zones (sorted by recommended level)
- Each zone shows:
  - Zone name + difficulty indicator (★☆☆)
  - Cost (gold, free for first zone)
  - Duration (15m, 30m, 1h, etc.)
  - Reward preview ("+50-150 Gold, +200 XP")
- "See All Zones" CTA → Full Expeditions page

**Design:**
- Compact list/card view
- Zone background image/color
- Locked zones grayed out with lock icon
- Hover preview: Quick zone details tooltip

**Interactions:**
- Click zone → Hero selection modal (inline deployment)
- OR → Navigate to Expeditions page for full experience

#### 5. Quick Stats Widget
**Purpose**: High-level summaries with navigation shortcuts

**Content:**
- **Heroes**: Count (8 / 15 cap) + [Manage] button
- **Equipment**: Total items (42 items) + [Inventory] button
- **Tavern**: Refresh timer or "Ready!" + [Recruit] button
- **Dungeons** (Phase 2): Dungeon count (0 / 3 slots, locked in demo)
- **Alliance** (Phase 3): Alliance name or "Not in alliance" + [Join] button

**Design:**
- Minimal, stat-focused cards
- Icon + number + label
- Action button on hover
- Demo caps clearly shown (e.g., "8 / 15 (Demo Limit)")

#### 6. Quick Actions Panel
**Purpose**: Fast access to common tasks

**Content:**
- **Large CTA buttons:**
  - 🗺️ "Deploy Expedition" (if capacity available)
  - 🍺 "Visit Tavern" (if refresh ready or near hero cap)
  - 👥 "Manage Heroes" (if hero at max XP)
  - ⚔️ "Sort Equipment" (if inventory > 80% full)
- **Contextual** - Only show relevant actions

**Design:**
- 2-column grid on desktop, stacked on mobile
- Large touch-friendly buttons (min 44x44px)
- Icon + label
- Disabled state when not applicable (grayed out)

#### 7. Phase 2 Preview Widget (LOCKED in Demo)
**Purpose**: Tease premium feature (Personal Dungeons)

**Content:**
- **Headline**: "🏰 Personal Dungeons (Premium Feature)"
- **Description**: Short pitch (2-3 lines) - "Build custom dungeons with captured monsters! Farm optimized resources. Your dungeon, your rules."
- **Visual**: Concept art or icon (locked/grayed)
- **CTA**: "Unlock Full Game - $9.99" → Upgrade modal

**Design:**
- Prominent placement (sidebar or bottom of dashboard)
- Purple accent color (premium tier)
- Lock icon overlay
- Pulsing CTA button (subtle)

**Variations:**
- Rotate preview content (Personal Dungeons, Alliance Raids, Monster Capture)
- A/B test placement (sidebar vs bottom banner)

---

## 🧭 Navigation Implementation

### Layout System Architecture

**Create Nuxt Layouts:**

**1. Default Layout** (`layouts/default.vue`)
- Top navigation bar (persistent)
- Main content area
- Toast notifications (global)
- Footer (optional, minimal)

**2. Auth Layout** (`layouts/auth.vue`)
- No navigation (login/signup pages)
- Centered content
- Minimal branding

**3. Full-Width Layout** (`layouts/fullwidth.vue`)
- For pages needing full viewport (future: dungeon builder)

### Top Navigation Component

**Structure:**
```vue
<template>
  <nav class="sticky top-0 z-50 bg-gray-900 border-b border-gray-700">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo + Primary Nav -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/dashboard" class="logo">
            🏢 Dungeon Farmers Corp.
          </NuxtLink>

          <!-- Desktop Nav -->
          <div class="hidden md:flex gap-4">
            <NavLink to="/dashboard" icon="🏠">HQ</NavLink>
            <NavLink to="/heroes" icon="👥">Heroes</NavLink>
            <NavLink to="/tavern" icon="🍺" :badge="tavernBadge">Tavern</NavLink>
            <NavLink to="/expeditions" icon="🗺️" :badge="activeExpeditions">Expeditions</NavLink>
            <NavLink to="/equipment" icon="⚔️" :badge="equipmentCount">Equipment</NavLink>
            <NavLink to="/dungeons" icon="🏰" :locked="!isPremium">Dungeons</NavLink>
          </div>
        </div>

        <!-- Right: User Menu -->
        <div class="flex items-center gap-4">
          <!-- Gold Display -->
          <div class="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded">
            <span class="text-yellow-400">💰</span>
            <span class="font-semibold">{{ playerGold }}</span>
          </div>

          <!-- User Dropdown -->
          <UserMenu />

          <!-- Mobile Menu Toggle -->
          <button @click="toggleMobileMenu" class="md:hidden">
            ☰
          </button>
        </div>
      </div>

      <!-- Mobile Nav Drawer -->
      <MobileNavDrawer v-if="mobileMenuOpen" @close="closeMobileMenu" />
    </div>
  </nav>
</template>
```

**Features:**
- **Sticky positioning** - Always accessible
- **Active route highlighting** - Visual feedback
- **Notification badges** - Counts on Tavern, Equipment, Expeditions
- **Locked state** - Phase 2 features grayed with lock icon (clickable → Upgrade modal)
- **Responsive** - Hamburger menu on mobile
- **Dark mode ready** - Follows system preference or user setting

### Navigation States & Feedback

**Active Route Indicator:**
- Underline accent (purple)
- Brighter text color
- Icon color shift

**Badge System:**
- **Tavern**: "!" when heroes ready to refresh
- **Expeditions**: Count of active expeditions
- **Equipment**: Total items (or "!" when inventory > 80% full)
- **Dungeons** (Phase 2): Count of active dungeons

**Locked Features (Demo):**
- Grayed out text
- Lock icon (🔒)
- Hover tooltip: "Premium Feature - Unlock for $9.99"
- Click → Upgrade modal

**Loading States:**
- Skeleton loaders for initial page load
- Route transition animations (fade, slide)

---

## 📱 Mobile Responsive Design

### Breakpoints

**Tailwind CSS Breakpoints:**
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md - lg)
- **Desktop**: > 1024px (xl+)

### Mobile Navigation Patterns

**Pattern 1: Hamburger Drawer** (RECOMMENDED)

**Pros:**
- Familiar pattern (85%+ recognition)
- Saves vertical space
- Full navigation hierarchy visible

**Cons:**
- One extra tap to access navigation

**Implementation:**
```
┌─────────────────────────┐
│ ☰  DF Corp.   💰 1,234  │ ← Header (always visible)
├─────────────────────────┤
│                         │
│   Dashboard Content     │
│   (Stacked Widgets)     │
│                         │
│   [Player Status]       │
│   [Active Expeditions]  │
│   [Notifications]       │
│   [Quick Actions]       │
│   [Available Zones]     │
│                         │
└─────────────────────────┘

Tap ☰:
┌─────────────────────────┐
│ [×] Navigation          │
├─────────────────────────┤
│ 🏠 HQ                   │
│ 👥 Heroes               │
│ 🍺 Tavern           NEW │
│ 🗺️ Expeditions       2 │
│ ⚔️ Equipment        42 │
│ 🏰 Dungeons     🔒 LOCK │
│ ─────────────────────── │
│ 👤 Profile              │
│ ⚙️ Settings             │
│ 🚪 Sign Out             │
└─────────────────────────┘
```

**Pattern 2: Bottom Tab Bar** (Alternative)

**Pros:**
- Always visible (no extra tap)
- Fast thumb access on phones

**Cons:**
- Uses vertical space (80-100px)
- Limited to 5 items (sacrifices secondary nav)

**Implementation:**
```
┌─────────────────────────┐
│  Dashboard Content      │
│                         │
│  (Scrollable)           │
│                         │
│                         │
├─────────────────────────┤
│ HQ  Heroes  Tavern  ... │ ← Bottom tabs (fixed)
│ 🏠    👥     🍺      ⋯  │
└─────────────────────────┘
```

**Recommendation**: **Hamburger Drawer** for Dungeon Farmers
- More navigation items (6+ with Phase 2)
- Retains vertical space for content-heavy dashboard
- Better for progressive disclosure (Phase 1 vs Phase 2+ features)

### Mobile Dashboard Layout

**Stacked Single Column:**
- All widgets stack vertically
- Full-width cards
- Prioritized order:
  1. Player Status (always visible, sticky header option)
  2. Active Operations (most urgent)
  3. Notifications (actionable)
  4. Quick Actions (fast access)
  5. Available Expeditions (next steps)
  6. Quick Stats (supplementary)
  7. Phase 2 Preview (conversion)

**Touch Targets:**
- Minimum 44x44px tap areas (WCAG 2.5.5)
- Generous padding (16-24px)
- Clear hover/active states

**Gestures:**
- Pull to refresh (dashboard data)
- Swipe to dismiss (notifications)
- Horizontal scroll (expedition list, if needed)

---

## 🎨 Visual Design Specifications

### Color Palette (Corporate Theme)

**Base Colors:**
```css
/* Backgrounds */
--bg-primary: #0f1419;      /* Dark gray-black */
--bg-secondary: #1a202c;    /* Lighter gray */
--bg-tertiary: #2d3748;     /* Card backgrounds */

/* Text */
--text-primary: #f7fafc;    /* Near white */
--text-secondary: #cbd5e0;  /* Light gray */
--text-muted: #718096;      /* Muted gray */

/* Accents */
--accent-primary: #805ad5;  /* Purple (brand) */
--accent-secondary: #3182ce; /* Blue (info) */
--accent-success: #38a169;  /* Green (success) */
--accent-warning: #d69e2e;  /* Gold/Yellow (warning) */
--accent-danger: #e53e3e;   /* Red (urgent) */

/* Borders */
--border-default: #4a5568;  /* Mid gray */
--border-accent: #805ad5;   /* Purple (focus) */
```

**Rarity Colors** (Equipment, Heroes, Schematics):
```css
--rarity-common: #9ca3af;    /* Gray */
--rarity-uncommon: #10b981;  /* Green */
--rarity-rare: #3b82f6;      /* Blue */
--rarity-epic: #a855f7;      /* Purple */
--rarity-legendary: #f59e0b; /* Orange */
--rarity-mythic: #ef4444;    /* Red */
```

### Typography

**Font Stack:**
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Inter', sans-serif; /* Same for consistency */
--font-mono: 'JetBrains Mono', 'Courier New', monospace; /* For stats, numbers */
```

**Scale:**
```css
--text-xs: 0.75rem;    /* 12px - Tooltips, captions */
--text-sm: 0.875rem;   /* 14px - Body text, labels */
--text-base: 1rem;     /* 16px - Default */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Section titles */
--text-2xl: 1.5rem;    /* 24px - Page headings */
--text-3xl: 1.875rem;  /* 30px - Hero headings */
```

**Weights:**
- Normal: 400
- Medium: 500 (labels, UI elements)
- Semibold: 600 (headings)
- Bold: 700 (emphasis)

### Component Styling

**Cards:**
```css
.card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--border-accent);
  box-shadow: 0 4px 12px rgba(128, 90, 213, 0.15);
}

.card-header {
  border-bottom: 1px solid var(--border-default);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
}
```

**Buttons:**
```css
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #6b46c1; /* Darker purple */
  box-shadow: 0 2px 8px rgba(128, 90, 213, 0.3);
}

.btn-primary:disabled {
  background: var(--bg-secondary);
  color: var(--text-muted);
  cursor: not-allowed;
}
```

**Progress Bars:**
```css
.progress-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  transition: width 0.3s ease;
}
```

**Badges:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--accent-danger);
  color: white;
  border-radius: 10px;
  font-size: var(--text-xs);
  font-weight: 600;
}
```

### Icons & Emojis

**Consistent Icon System:**
- 🏠 HQ/Dashboard
- 👥 Heroes/Roster
- 🍺 Tavern/Recruitment
- 🗺️ Expeditions/Zones
- ⚔️ Equipment/Weapons
- 🏰 Dungeons (Phase 2)
- 🤝 Alliance (Phase 3)
- 👤 Profile/Account
- ⚙️ Settings
- 💰 Gold/Currency
- 🔷 Alliance Points
- 📦 Materials/Resources
- ⏰ Timers/Duration
- 🔒 Locked/Premium
- ⚠️ Warnings/Alerts
- ✅ Success/Complete
- 📊 Stats/Metrics

**Alternative**: Replace emojis with icon library (Heroicons, Lucide) for more professional look. Test with users.

---

## 🚀 Phased Rollout Plan

### Phase 1 - MVP (Current) - Implement Immediately

**Features:**
- ✅ Top navigation with all Phase 1 links (HQ, Heroes, Tavern, Expeditions, Equipment, Profile)
- ✅ Default layout system (apply to all authenticated pages)
- ✅ Dashboard/HQ page with core widgets:
  - Player Status
  - Active Operations
  - Notifications
  - Quick Actions
  - Available Expeditions
  - Quick Stats
  - Phase 2 Preview (locked, upsell)
- ✅ Mobile hamburger drawer navigation
- ✅ Notification badges (Tavern refresh, active expeditions, equipment count)
- ✅ Locked state for Dungeons (grayed, lock icon, click → upgrade modal)

**Implementation Steps:**
1. Create `layouts/default.vue` with Navigation component
2. Create `layouts/auth.vue` for login/signup
3. Update existing Navigation component (already built, just needs integration)
4. Create `/pages/dashboard.vue` (new page, replace current index.vue as post-auth home)
5. Update routing: `/` → Landing (unauthenticated) or `/dashboard` (authenticated redirect)
6. Build dashboard widgets as components (`/components/dashboard/`)
7. Test mobile responsiveness
8. Add notification system (toast integration already exists)

**Migration:**
- Move current `index.vue` content to `landing.vue` or keep as unauthenticated homepage
- Set up auth middleware to redirect authenticated users: `/` → `/dashboard`

### Phase 2 - Unique Features (Months 3-4)

**Features:**
- 🏰 Dungeons navigation (unlock from grayed state)
- Dashboard widgets update:
  - Monster Capture notifications
  - Dungeon status widget (active dungeons, durability)
  - Schematic collection tracker
- Quick Actions: "Build Dungeon" CTA

### Phase 3 - Social (Months 5-6)

**Features:**
- 🤝 Alliance navigation item
- Dashboard widgets:
  - Alliance activity feed
  - Raid invitations
  - Alliance leaderboard widget
- Alliance Points display in header (next to Gold)

### Phase 4 - Polish (Month 7)

**Features:**
- Advanced dashboard customization (widget reordering, hide/show)
- Dashboard themes/skins (cosmetic DLC)
- Accessibility audit and improvements
- Performance optimization (lazy loading, caching)

---

## ♿ Accessibility Guidelines

**WCAG 2.1 AA Compliance:**

**Keyboard Navigation:**
- All interactive elements focusable via Tab
- Focus indicators visible (outline, background change)
- Skip to main content link
- Escape key closes modals/dropdowns

**Screen Readers:**
- Semantic HTML (`<nav>`, `<main>`, `<aside>`)
- ARIA labels for icon-only buttons
- ARIA live regions for timer updates, notifications
- Alt text for decorative images (or `aria-hidden="true"`)

**Color & Contrast:**
- Text contrast ratio ≥ 4.5:1 (normal text)
- Large text ≥ 3:1
- Interactive elements ≥ 3:1 against background
- Don't rely solely on color (use icons + text)

**Touch Targets:**
- Minimum 44x44px (WCAG 2.5.5 Level AAA)
- 8px spacing between targets

**Responsive Text:**
- Support 200% zoom without horizontal scroll
- Use relative units (rem, em) over px

**Reduced Motion:**
- Respect `prefers-reduced-motion` media query
- Disable animations for users with motion sensitivity

---

## 📊 Success Metrics

**Navigation Effectiveness:**
- **Average clicks to key actions** ≤ 2 (measured via analytics)
- **Navigation bounce rate** < 5% (users leaving immediately after navigating)
- **Mobile nav usage** > 60% on mobile devices

**Dashboard Engagement:**
- **Dashboard visit frequency** - Avg 3+ visits per session
- **Widget interaction rate** - 80%+ users click at least one widget per visit
- **Quick Action CTA click rate** - 40%+ (strong call-to-action effectiveness)

**User Satisfaction:**
- **Navigation ease rating** (survey) - 4.5+ / 5
- **Dashboard usefulness rating** - 4+ / 5
- **Mobile experience rating** - 4+ / 5

**Technical Performance:**
- **First Contentful Paint (FCP)** < 1.5s
- **Time to Interactive (TTI)** < 3s
- **Cumulative Layout Shift (CLS)** < 0.1

---

## 🛠️ Implementation Checklist

### Immediate (This Sprint)

**Layout System:**
- [ ] Create `/layouts/default.vue` with persistent navigation
- [ ] Create `/layouts/auth.vue` for login/signup
- [ ] Update `app.vue` to use layouts system
- [ ] Test layout switching between auth/default

**Navigation:**
- [ ] Integrate existing Navigation.vue into default layout
- [ ] Add notification badge logic (Tavern, Expeditions, Equipment)
- [ ] Implement locked state for Dungeons (grayed, lock icon)
- [ ] Create MobileNavDrawer component
- [ ] Test navigation on mobile (hamburger menu)
- [ ] Add active route highlighting

**Dashboard Page:**
- [ ] Create `/pages/dashboard.vue` (new HQ page)
- [ ] Update auth redirect: `/` → `/dashboard` for logged-in users
- [ ] Build dashboard layout structure (3-column grid → stacked mobile)

**Dashboard Widgets (Components):**
- [ ] `/components/dashboard/PlayerStatusWidget.vue`
- [ ] `/components/dashboard/ActiveOperationsWidget.vue`
- [ ] `/components/dashboard/NotificationsWidget.vue`
- [ ] `/components/dashboard/QuickActionsPanel.vue`
- [ ] `/components/dashboard/AvailableExpeditionsWidget.vue`
- [ ] `/components/dashboard/QuickStatsWidget.vue`
- [ ] `/components/dashboard/Phase2PreviewWidget.vue`

**State Management:**
- [ ] Update player store (if needed for dashboard data)
- [ ] Create notification system (or integrate with existing toast)
- [ ] Add dashboard data composable (aggregate data from all stores)

**Styling:**
- [ ] Apply corporate color palette (CSS variables)
- [ ] Ensure mobile responsive styles (Tailwind breakpoints)
- [ ] Add hover/focus states to all interactive elements
- [ ] Test dark mode compatibility

### Near-Term (Next Sprint)

**Polish:**
- [ ] Add loading skeletons for dashboard widgets
- [ ] Implement real-time timer updates (WebSocket/SSE)
- [ ] Add notification sound (opt-in) for expedition completion
- [ ] Create onboarding tutorial (first-time dashboard visit)
- [ ] Add dashboard empty states (no active expeditions, etc.)

**Testing:**
- [ ] Unit tests for dashboard widgets
- [ ] E2E tests for navigation flows
- [ ] Mobile responsiveness testing (multiple devices)
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Performance testing (Lighthouse score > 90)

**Documentation:**
- [ ] Update user guide with navigation instructions
- [ ] Create dashboard widget documentation for developers
- [ ] Screenshot/video tour of navigation system

### Future (Phase 2+)

- [ ] Unlock Dungeons navigation (when feature implemented)
- [ ] Add Alliance navigation (Phase 3)
- [ ] Dashboard widget customization (reorder, hide/show)
- [ ] Dashboard themes/skins (cosmetic DLC)
- [ ] Advanced notification filters and preferences

---

## 📝 Open Questions & Decisions Needed

### Critical Decisions

**1. Dashboard Default Route**
- **Question**: Should `/` redirect to `/dashboard` for authenticated users, or should `/` always be the landing page?
- **Options**:
  - A) `/` → Landing (unauth) or `/dashboard` (auth) redirect
  - B) `/` always landing, explicit "Go to Dashboard" button after login
- **Recommendation**: **Option A** - Seamless experience, less friction
- **Decision**: ⏳ PENDING

**2. Mobile Navigation Pattern**
- **Question**: Hamburger drawer or bottom tab bar?
- **Recommendation**: **Hamburger drawer** (supports more nav items, saves vertical space)
- **Decision**: ⏳ PENDING

**3. Corporate Naming Convention**
- **Question**: How heavily to lean into corporate theme in navigation labels?
- **Options**:
  - A) Full corporate: "HQ", "Employee Roster", "Recruitment Office", etc.
  - B) Hybrid: Primary labels gaming (Heroes, Tavern), corporate in tooltips/section headers
  - C) Pure gaming: "Heroes", "Tavern", "Expeditions" (no corporate)
- **Recommendation**: **Option B (Hybrid)** - Based on CLAUDE.md (gaming/RPG PRIMARY 70%, corporate OPTIONAL 10%)
- **Decision**: ⏳ PENDING

**4. Notification System Architecture**
- **Question**: Use existing toast system or build separate notification widget system?
- **Options**:
  - A) Extend toast system (toasts + persistent notification log)
  - B) Separate notification system (in-app inbox + toasts for urgent)
- **Recommendation**: **Option B** - More robust, better UX for persistent notifications
- **Decision**: ⏳ PENDING

**5. Dashboard Widget Priority**
- **Question**: What's the minimum viable dashboard for Phase 1 launch?
- **Must-Have**: Player Status, Active Operations, Quick Actions
- **Nice-to-Have**: Notifications, Available Expeditions, Quick Stats
- **Can Defer**: Phase 2 Preview (or make it a small banner)
- **Recommendation**: Implement all except full notification system (use toasts for now)
- **Decision**: ⏳ PENDING

### Lower Priority Questions

6. **Icon Library**: Stick with emojis or migrate to SVG icon library (Heroicons)?
7. **Dashboard Customization**: Phase 2 feature or post-launch?
8. **Bottom Navigation** (Mobile): Add bottom CTA bar in addition to top nav?
9. **Breadcrumbs**: Needed for deep navigation (e.g., Hero Detail)?
10. **Search**: Global search bar in navigation (Phase 3)?

---

## 🎯 Summary & Next Steps

### What This Design Delivers

**Unified Experience:**
- Persistent navigation across all authenticated pages
- Central dashboard (HQ) as the player's home base
- Mobile-first responsive design
- Clear information hierarchy

**Player Value:**
- At-a-glance game state (resources, active ops, notifications)
- Fast access to all systems (≤2 clicks)
- Actionable quick actions (no hunting for next steps)
- Progress transparency (XP, timers, capacities)

**Business Value:**
- Premium feature visibility (Phase 2 preview, locked Dungeons)
- Strategic upsell placement ($9.99 unlock prompts)
- Engagement hooks (notifications, timers, CTAs)
- Analytics-ready (track navigation patterns, CTA clicks)

### Immediate Next Steps

1. **Review & Approve** this design document
2. **Make Critical Decisions** (5 questions above)
3. **Implementation Sprint**:
   - Week 1: Layout system + navigation integration
   - Week 2: Dashboard page + core widgets
   - Week 3: Polish + mobile testing
   - Week 4: QA + accessibility audit
4. **User Testing** with 5-10 beta users
5. **Iterate** based on feedback
6. **Ship** Phase 1 MVP dashboard

**Timeline Estimate**: 3-4 weeks for full Phase 1 implementation

---

**Document Owner**: Design Team
**Last Updated**: 2025-11-22
**Status**: ✅ Design Complete → Awaiting Approval → Ready for Implementation
**Next Review**: After critical decisions made
