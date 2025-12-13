# Screen Design Prompts
**Dungeon Farmers - AI Design Prompt Library for UI/UX Screens**

**Last Updated**: 2025-11-23
**Purpose**: Ready-to-use prompts for generating visual designs and mockups for all application screens
**Tools**: Figma, Midjourney (UI mockups), DALL-E, Adobe Firefly, Framer, or design tools

---

## 🎯 Design System Foundation

### Color Palette
- **Background Primary**: Dark gray (`#1a1a1a` / `gray-900`)
- **Background Secondary**: Medium gray (`#262626` / `gray-800`)
- **Background Cards**: Lighter gray (`#404040` / `gray-700`)
- **Primary Accent**: Purple (`#8b5cf6` / `purple-500`)
- **Secondary Accent**: Blue (`#3b82f6` / `blue-500`)
- **Gold/Currency**: Yellow (`#fbbf24` / `yellow-400`)
- **Success**: Green (`#22c55e` / `green-500`)
- **Warning**: Orange (`#f97316` / `orange-500`)
- **Error**: Red (`#ef4444` / `red-500`)
- **Text Primary**: White/Light gray (`#f5f5f5` / `gray-100`)
- **Text Secondary**: Medium gray (`#a3a3a3` / `gray-400`)

### Typography
- **Headings**: Clean sans-serif (Inter, System UI, or similar)
- **Body**: Readable sans-serif (no elaborate fantasy fonts for critical info)
- **Monospace**: For numeric stats (gold, timers, levels)

### Design Philosophy
- **Corporate Aesthetic**: Muted professional colors, "Office Space meets D&D"
- **Business Casual Fantasy**: Heroes in button-up shirts under tactical vests, robes over business attire
- **Clean & Informative**: Information density without clutter
- **Mobile-First**: Touch-friendly (min 44x44px buttons), responsive layouts
- **Gaming Parody Tone**: UI labels mock gacha/MMO tropes ("Employee Roster", "Team-Building Exercise")

---

## 📱 Phase 0: Landing & Onboarding

### 1. Landing Page (`/`)

**Purpose**: Convert guests to players, communicate value proposition

**Prompt**:
```
Design a landing page for "Dungeon Farmers" - a web-based idle RPG game. 

Style: Clean corporate aesthetic with fantasy elements. Dark theme with muted gray 
backgrounds (#1a1a1a), purple (#8b5cf6) and blue (#3b82f6) accent colors. 
Professional business-casual fantasy theme - think "Office Space meets Dungeons & Dragons".

Layout:
- Top navigation: Logo "🏢 Dungeon Farmers" on left, [Login] [Sign Up] buttons on right
- Hero section centered: Large headline "The Idle RPG that Respects Your Time and Wallet"
- Feature list with checkmarks: "✓ No Energy Systems", "✓ Fair Monetization ($9.99 unlock)", 
  "✓ Build Your Own Dungeons"
- Primary CTA button: "[🎮 Play Free Demo]" (purple gradient button, prominent)
- Secondary button: "[Learn More]" (outlined button)
- Screenshot/gameplay carousel below (showing hero roster, expeditions, personal dungeons)
- Feature highlights section: Monster Capture + Personal Dungeon Building (unique hook)
- Footer: Links, copyright

Design principles:
- Minimal friction, clear value proposition
- Mobile-responsive (stack on small screens)
- Touch-friendly buttons (min 44x44px)
- Corporate software aesthetic with gaming parody humor
- Clean, modern, professional
- No clutter, clear visual hierarchy
```

**Key Elements**:
- Hero section with value proposition
- Feature highlights with icons
- Gameplay screenshot carousel
- Clear CTAs (Free Demo, Learn More)
- Trust indicators (No energy systems, fair pricing)

---

### 2. Login Screen (`/auth/login`)

**Purpose**: Authenticate existing players

**Prompt**:
```
Design a login screen for "Dungeon Farmers" web game. 

Style: Dark corporate aesthetic. Centered layout on dark gray background (#1a1a1a). 
Corporate fantasy theme - "Employee Portal" vibes.

Layout:
- Top: Logo/Title "🏢 Dungeon Farmers Corp." with tagline "Employee Portal"
- Centered card (max-width 400px): White/gray card on dark background
- Form fields:
  * Email input (rounded, bordered)
  * Password input (rounded, bordered, show/hide toggle)
  * [Remember me] checkbox
- Primary button: "[Sign In]" (purple gradient, full-width)
- Secondary link: "[Forgot Password?]" (below button, small text)
- Footer link: "Don't have an account? [Sign Up]" (centered)
- Optional: Social login buttons (Google, etc.) - subtle styling

Design principles:
- Clean, minimal form design
- Accessible (keyboard navigation, clear labels)
- Error states: Red border on inputs, error message below
- Loading state: Button shows spinner when submitting
- Mobile-optimized (full-width inputs on small screens)
- Corporate but friendly tone
```

---

### 3. Signup Screen (`/auth/signup`)

**Purpose**: Account creation with first hero selection

**Prompt**:
```
Design a signup screen for "Dungeon Farmers" with hero selection. 

Style: Dark corporate aesthetic. Multi-step form flow. Step 1: Account creation, 
Step 2: Guild name, Step 3: Choose first hero.

Layout (Step 1 - Account):
- Logo/Title "🏢 Dungeon Farmers Corp."
- Progress indicator: "Step 1 of 3" (dots or progress bar)
- Form: Email, Password, Confirm Password
- [Continue] button (purple gradient)

Layout (Step 2 - Guild Name):
- Progress: "Step 2 of 3"
- Input: "Guild Name" (with suggestions like "Shadow Runners", "Iron Company")
- Optional: Color picker for guild emblem (subtle, not prominent)
- [Continue] button

Layout (Step 3 - First Hero):
- Progress: "Step 3 of 3"
- Heading: "Choose Your First Hero"
- Three hero cards side-by-side (or stacked on mobile):
  * Each card: Hero portrait (128x128px), name, archetype icon, brief description
  * Stats preview (HP, ATK, DEF)
  * Traits listed (2-3 traits)
  * [Select] button on each card
- All three equally viable, no "trap choices"
- Corporate framing: "Initial Team Member Selection"

Design principles:
- Fast onboarding (no excessive customization)
- Clear progression through steps
- Hero cards should be visually distinct but equally appealing
- Mobile-friendly (stack hero cards on small screens)
- Prevent analysis paralysis (only 3 choices)
```

---

## 🏠 Phase 1: Core Gameplay Screens

### 4. Dashboard / HQ (`/dashboard`)

**Purpose**: Central hub showing status, active expeditions, quick actions

**Prompt**:
```
Design a dashboard/command center screen for "Dungeon Farmers" idle RPG.

Style: Dark corporate aesthetic with information-dense layout. Grid-based widget system. 
"Command Center" or "Operational Headquarters" framing.

Layout (Desktop - 3-column grid):
Left Column:
- Player Status Widget: Level, XP progress bar, Gold, Alliance Points
- Notifications Widget: List of alerts (completed expeditions, hero level-ups, etc.)
- Phase 2 Preview Widget: "Personal Dungeons" premium unlock CTA (gradient purple/blue card)

Center Column:
- Active Operations Widget: List of ongoing expeditions with timers, progress bars
- Available Expeditions Widget: Quick access to 3-5 zones (cards with difficulty, rewards)

Right Column:
- Quick Stats Widget: Hero count, equipment count, tavern status
- Quick Actions Panel: 2x2 grid of action buttons (Deploy Expedition, Visit Tavern, etc.)

Top Navigation:
- Logo, navigation links, gold display, user menu

Layout (Mobile - Stacked):
- Same widgets but stacked vertically
- Horizontal scroll for expedition cards
- Hamburger menu for navigation

Widget Design:
- Cards with rounded corners, subtle borders
- Purple/blue accent colors for highlights
- Progress bars with gradients
- Real-time timers (countdown format: "12m 34s")
- Empty states: "No active operations" with CTA buttons

Design principles:
- Information density without clutter
- Real-time updates visible (timers, progress)
- Clear visual hierarchy (primary actions prominent)
- Mobile-first responsive design
- Corporate software aesthetic ("Command Center", "Active Operations")
```

---

### 5. Hero Roster (`/heroes`)

**Purpose**: View and manage all heroes in a grid/list layout

**Prompt**:
```
Design a hero roster screen for "Dungeon Farmers" - "Employee Roster" or "Employee Directory" framing.

Style: Dark corporate aesthetic. Grid-based hero card layout. Clean, organized.

Layout:
- Top bar: Title "Employee Roster" with subtitle "Manage your adventuring workforce"
- Filters: Search bar, Archetype dropdown (All/Tank/Healer/etc.), Sort dropdown (Level, Power, Name)
- Summary stats bar: "8 / 15 Heroes", "Average Level: 12", "Total Power: 3,542"
- Hero grid: Responsive grid (4 columns desktop, 2 mobile, 1 on very small)
- Hero cards: Each shows:
  * Portrait (128x128px circular or square)
  * Name, Archetype icon/name, Level
  * Power rating (numeric + visual bar)
  * Trait icons (3 visible, hover for all)
  * Status badge (Available, On Expedition, Max XP)
  * [Details] button
- Pagination or "Load More" button at bottom

Hero Card Design:
- Card background: Dark gray with subtle border
- Archetype color coding (Tank=blue, Healer=green, DPS=red/purple)
- Clear visual hierarchy (portrait prominent)
- Hover state: Slight scale/glow effect
- Active expedition indicator: Small badge/icon

Empty State:
- "No heroes yet. Visit the Tavern to recruit!" with CTA button

Design principles:
- Grid layout scalable for 15+ heroes
- Quick scanning (archetype, level, power visible at a glance)
- Filter/search functionality prominent
- Mobile-responsive (stack cards on small screens)
- Corporate framing with gaming humor
```

---

### 6. Hero Detail Page (`/heroes/[id]`)

**Purpose**: Detailed hero view with stats, equipment, traits, actions

**Prompt**:
```
Design a hero detail/character sheet screen for "Dungeon Farmers".

Style: Dark corporate aesthetic. Information-dense but organized layout. 
"Employee Profile" or "Performance Review" framing.

Layout (Desktop - 2-column):
Left Column (Hero Info):
- Large hero portrait (256x256px or larger)
- Hero name, archetype, level
- XP progress bar (current/next level)
- Power rating (large, prominent)
- Status: Available / On Expedition / Needs Attention
- Personality traits list (if Phase 2+)
- Morale/Happiness meter (if Phase 2+)

Right Column (Stats & Equipment):
- Stats grid: HP, ATK, DEF, SPD, etc. (numeric + visual bars)
- Equipment slots (6 slots in character model layout):
  * Weapon, Armor, Helmet, Boots, Accessory 1, Accessory 2
  * Empty slots show "+" icon
  * Equipped items show thumbnail + rarity border color
  * Click to view/change equipment
- Trait list: All traits with descriptions and rarities
- Action buttons: [Equip], [Send on Expedition], [Level Up] (if available)

Bottom Section:
- Expedition history (recent missions)
- Performance metrics (if Phase 2+)

Layout (Mobile - Stacked):
- Portrait at top
- Stats and equipment stacked below

Design principles:
- All hero information visible at a glance
- Equipment slots clearly visible (character model or grid layout)
- Easy equipment management (click to change)
- Action buttons prominent
- Corporate employee profile aesthetic
```

---

### 7. Tavern / Recruitment (`/tavern`)

**Purpose**: Recruit new heroes using gold

**Prompt**:
```
Design a tavern/recruitment screen for "Dungeon Farmers" - "Recruitment Center" framing.

Style: Dark corporate aesthetic with warm tavern vibes. Tavern-themed but professional.

Layout:
- Header: "The Tavern" or "Recruitment Center" with subtitle "Recruit new team members"
- Refresh timer: "Next refresh in 8m 23s" (prominent countdown)
- Refresh button: [Refresh Now] (if available, premium or cooldown)

Hero Selection Area:
- 3-5 hero cards displayed (available recruits)
- Each card shows:
  * Hero portrait (128x128px)
  * Name, Archetype, Level
  * Brief personality description (1-2 sentences)
  * Trait preview (top 2-3 traits)
  * Stats preview (HP, ATK, DEF)
  * Recruitment cost: "150 Gold" (prominent button)
- [Recruit] button on each card (gold-colored, prominent)

Optional Features:
- Reroll button: "Reroll for 50 Gold" (shows single trait preview)
- Hire all button (if multiple heroes available)

Empty State:
- "No available recruits. Check back after refresh timer!"

Design principles:
- Clear hero information for informed choices
- Recruitment cost visible and prominent
- Timer countdown for refresh clearly visible
- Warm, inviting tavern aesthetic (but still corporate)
- Mobile-friendly (stack hero cards)
```

---

### 8. Expeditions List (`/expeditions`)

**Purpose**: View active expeditions and browse available zones

**Prompt**:
```
Design an expeditions screen for "Dungeon Farmers" - "Field Operations" framing.

Style: Dark corporate aesthetic. Two-section layout: Active Operations + Available Zones.

Layout:
Top Section - Active Expeditions:
- Heading: "Active Operations (2 / 3)" (slots indicator)
- List of active expeditions (cards):
  * Zone name, difficulty indicator (star rating)
  * Hero portraits (small, 3-5 heroes shown)
  * Timer: "12m 34s remaining" (countdown, prominent)
  * Progress bar (visual completion indicator)
  * [View Details] button
  * [Cancel] button (small, red, if allowed)
- Empty slot: "[+ Start New Expedition]" button (outlined, prominent)

Bottom Section - Available Zones:
- Heading: "Available Zones" with filter "[☑ Show Locked]"
- Zone grid (4 columns desktop, 2 mobile):
  * Zone card: Zone icon/illustration, name, difficulty (star rating), cost, duration
  * Rewards preview: "+50-150g, +200 XP" (estimated range)
  * [Deploy] button (purple gradient, prominent)
- Locked zones: Grayed out, "[Locked] Level 20 required" or "🔒 Premium Feature"

Zone Card Design:
- Distinctive zone icon/illustration (forest, mountain, swamp, etc.)
- Color-coded by difficulty (Easy=green, Medium=yellow, Hard=orange, Expert=red)
- Clear reward ranges
- Cost prominently displayed

Design principles:
- Active expeditions highly visible (timers, progress)
- Zone cards scannable (difficulty, rewards, cost clear)
- Mobile-responsive (stack cards)
- Clear distinction between active and available
```

---

### 9. Zone Selection / Expedition Setup (`/expeditions/zones/[zoneId]`)

**Purpose**: Select heroes and launch an expedition to a specific zone

**Prompt**:
```
Design a zone expedition setup screen for "Dungeon Farmers".

Style: Dark corporate aesthetic. Two-panel layout: Zone info + Hero selection.

Layout:
Left Panel - Zone Information:
- Zone illustration/background (thematic: forest, mountain, etc.)
- Zone name, difficulty rating (stars), recommended level
- Zone description (lore/flavor text)
- Rewards preview:
  * Gold range: "50-150 Gold"
  * XP: "+200 XP"
  * Monster capture chance: "10% chance"
  * Drop items list (if any)
- Duration: "15 minutes" (prominent)
- Cost: "Free" or "50 Gold" (prominent)

Right Panel - Team Selection:
- Heading: "Select Team Members"
- Available heroes list (filtered to available only):
  * Hero cards: Portrait, name, level, power, archetype
  * Checkbox or toggle for selection
  * Status indicator (Available/On Expedition)
- Team composition indicator:
  * Selected: "3 / 5 heroes" (with recommended team size)
  * Team power total: "1,245 Power"
  * Archetype balance: "2 Tank, 1 Healer, 2 DPS" (visual indicators)
- Launch button: "[Launch Expedition] 50 Gold" (disabled if invalid team)

Team Validation:
- Error states: "Minimum 1 hero required", "Insufficient Gold", etc.
- Success state: Button enabled, shows total cost

Design principles:
- Zone information clear and engaging
- Hero selection intuitive (checkboxes or drag-and-drop)
- Team composition feedback visible
- Launch button prominent when ready
- Mobile-friendly (stack panels or use tabs)
```

---

### 10. Equipment Inventory (`/equipment`)

**Purpose**: View, manage, and compare equipment

**Prompt**:
```
Design an equipment inventory screen for "Dungeon Farmers" - "Asset Inventory" framing.

Style: Dark corporate aesthetic. Grid-based item display with filtering.

Layout:
Top Bar:
- Title: "Equipment Inventory" or "Asset Inventory"
- Filters: Type dropdown (All/Weapon/Armor/etc.), Rarity dropdown (All/Common/Rare/etc.), 
  Sort dropdown (Name, Rarity, Power)
- View toggle: Grid view / List view icons

Main Area - Equipment Grid:
- Responsive grid (6 columns desktop, 3 tablet, 2 mobile)
- Equipment cards: Each shows:
  * Item icon/thumbnail (64x64px or 128x128px)
  * Rarity border color (Common=gray, Rare=blue, Epic=purple, Legendary=orange, Mythic=gold)
  * Item name
  * Item type/archetype icon
  * Gear score/power number
  * Set indicator (if part of set): "Iron Guard Set (2/6)"
  * Equipped indicator: "✓ Equipped by Morgath" (small badge)
- Click item to view details modal/sidebar

Sidebar (on item click):
- Large item icon
- Item name, rarity, type
- Full stats breakdown
- Set bonus information (if applicable)
- Actions: [Equip to Hero], [Compare], [Dismiss/Sell]

Empty State:
- "No equipment. Complete expeditions to earn gear!" with CTA

Design principles:
- Quick scanning (rarity colors, gear score visible)
- Filtering prominent (find items easily)
- Item details accessible (modal or sidebar)
- Set information visible
- Mobile-responsive grid
```

---

## 🏰 Phase 2: Premium Features

### 11. Personal Dungeons (`/dungeons`)

**Purpose**: Build and manage personal dungeons (premium feature)

**Prompt**:
```
Design a personal dungeons screen for "Dungeon Farmers" - "Personal Resource Development Initiative" framing.

Style: Dark corporate aesthetic with dungeon/fantasy elements. Premium feature unlock.

Layout:
Header:
- Title: "Personal Dungeons" with premium badge/lock icon if not unlocked
- Unlock CTA (if locked): "[Unlock Full Game - $9.99]" (prominent gradient button)

Main Area - Dungeon Library:
- List of built dungeons (cards):
  * Dungeon name, schematic name, rarity border
  * Monster roster (small portraits of assigned monsters)
  * Durability: "15 / 20 runs remaining" (progress bar)
  * Rewards preview: "Gold, XP, Materials"
  * Status: Active / Available / Rebuilding (cooldown)
  * [Run Dungeon] or [Rebuild] button
- Empty slot: "[+ Build New Dungeon]" button

Build New Dungeon Flow:
- Step 1: Select Schematic
  * Grid of available schematics (collected blueprints)
  * Shows: Schematic name, rarity, slot requirements ("3x Melee + 2x Caster")
- Step 2: Assign Monsters
  * Available monsters list (captured from expeditions)
  * Drag-and-drop or click to assign to schematic slots
  * Slot validation: "Melee slot requires Melee or Tank archetype"
- Step 3: Confirm & Build
  * Preview of final dungeon
  * [Build Dungeon] button

Design principles:
- Premium unlock visible but not intrusive
- Durability tracking clear (progress bars)
- Build flow intuitive (step-by-step)
- Monster assignment visual and clear
- Corporate framing with fantasy elements
```

---

## 👥 Phase 3: Social Features

### 12. Alliance Hub (`/alliance`)

**Purpose**: Guild management, raids, social features

**Prompt**:
```
Design an alliance (guild) hub screen for "Dungeon Farmers" - "Regional Division" framing.

Style: Dark corporate aesthetic with social elements. Professional guild management.

Layout:
Header:
- Alliance name, emblem/logo
- Member count: "25 / 30 members"
- Alliance level/rank (if applicable)

Tabs/Navigation:
- Overview (default)
- Members
- Raids
- Shop
- Settings (if leader/officer)

Overview Tab:
- Alliance stats: Total power, average level, alliance points
- Recent activity feed: "Morgath completed a raid", "New member joined", etc.
- Shared bonuses: "+10% Gold, +5% XP" (prominent display)
- Alliance chat (bottom section or side panel)

Members Tab:
- Member list/grid:
  * Member name, avatar, level, last active
  * Role badge (Leader, Officer, Member)
  * Contribution stats
- [Invite Member] button (if permissions)

Raids Tab:
- Active raids list
- [Create Raid] button
- Raid history

Design principles:
- Social but professional (corporate guild management)
- Member information clear
- Chat accessible but not dominant
- Raid coordination prominent
- Mobile-friendly tabs/navigation
```

---

## ⚙️ Settings & Account

### 13. Profile Page (`/profile`)

**Purpose**: Player profile, stats, achievements

**Prompt**:
```
Design a player profile screen for "Dungeon Farmers".

Style: Dark corporate aesthetic. Personal dashboard layout.

Layout:
Profile Header:
- Player avatar/icon (large, customizable if premium)
- Player name/username
- Guild name
- Level, XP progress bar
- Premium status badge (if applicable)

Stats Grid:
- Total playtime
- Heroes recruited: "X / Y"
- Expeditions completed
- Monsters captured
- Personal dungeons built
- Alliance points earned

Achievement Section:
- List of achievements/unlocks
- Progress bars for incomplete achievements

Design principles:
- Personal stats prominently displayed
- Achievement progression visible
- Clean, organized layout
- Corporate employee profile aesthetic
```

---

### 14. Settings Page (`/settings`)

**Purpose**: Game options, accessibility, account management

**Prompt**:
```
Design a settings screen for "Dungeon Farmers".

Style: Dark corporate aesthetic. Organized category sections.

Layout:
Settings Categories (tabs or sections):
- General: Sound on/off, music volume, notifications
- Display: Theme (if multiple), UI scale, animations
- Accessibility: Color-blind mode, screen reader support, keyboard shortcuts
- Account: Email, password change, delete account
- Premium: Upgrade status, manage subscription (if applicable)

Each Setting:
- Clear label and description
- Toggle switches or dropdowns
- Save/Cancel buttons at bottom

Design principles:
- Clear organization by category
- Accessible controls (keyboard navigable)
- Helpful descriptions for each setting
- Save states clear (unsaved changes indicator)
```

---

### 15. Premium Upgrade (`/premium`)

**Purpose**: Convert free players to premium ($9.99 one-time unlock)

**Prompt**:
```
Design a premium upgrade screen for "Dungeon Farmers".

Style: Dark corporate aesthetic with premium/promotional elements. Sales page layout.

Layout:
Hero Section:
- Large headline: "Unlock the Full Dungeon Farmers Experience"
- Subheading: "One-time purchase • All features • No subscriptions"
- Price: "$9.99" (large, prominent)

Feature List:
- ✓ Personal Dungeon Building (core unique feature)
- ✓ All Zones & Content (no level caps)
- ✓ Unlimited Heroes (no roster cap)
- ✓ Access to Alliances & Raids
- ✓ Priority Support
- Visual icons for each feature

Comparison Table:
- Free Demo vs Premium columns
- Feature checkmarks/crosses

Testimonials/Social Proof (optional):
- Player quotes or stats

CTA Button:
- "[Unlock Full Game - $9.99]" (large, gradient purple/blue, prominent)
- Payment security badges below

Design principles:
- Clear value proposition
- Premium features highlighted
- No pressure, ethical framing
- Trust indicators (security, one-time payment)
- Mobile-friendly layout
```

---

## 📐 Design Specifications Summary

### Common UI Components

**Buttons**:
- Primary: Purple gradient (`purple-500` to `blue-500`), rounded corners, min 44x44px
- Secondary: Gray outline, hover fill
- Destructive: Red (`red-500`), for delete/cancel actions

**Cards**:
- Background: `gray-800`, border `gray-700`, rounded corners (8px)
- Hover: Slight scale (1.02) or glow effect
- Padding: 16-24px internal padding

**Progress Bars**:
- Container: `gray-900`, rounded full
- Fill: Gradient (`purple-500` to `blue-500`)
- Height: 8-12px typically

**Typography**:
- Headings: Bold, 24-32px (desktop), 20-24px (mobile)
- Body: 14-16px, regular weight
- Captions: 12-14px, lighter weight
- Monospace: For numbers (gold, timers, stats)

**Spacing**:
- Consistent 8px base unit
- Sections: 24-32px gaps
- Cards: 16px gaps

---

## 🎨 Visual Style Keywords

Use these keywords in AI prompts for consistent style:
- "Dark corporate aesthetic"
- "Business casual fantasy"
- "Office Space meets Dungeons & Dragons"
- "Muted professional colors"
- "Clean modern UI"
- "Information-dense layout"
- "Gaming parody humor"
- "Professional but friendly"
- "Accessible design"
- "Mobile-first responsive"

---

## 📱 Responsive Breakpoints

- **Mobile**: 320-768px (stack layouts, single column)
- **Tablet**: 769-1024px (2-column grids, adjusted spacing)
- **Desktop**: 1025px+ (full 3-4 column grids, side-by-side panels)

---

## ✅ Accessibility Requirements

All designs must include:
- **Color-blind friendly**: Icons + text labels (not color alone)
- **Keyboard navigation**: All interactive elements tabbable
- **Screen reader support**: ARIA labels, semantic HTML
- **Contrast ratios**: WCAG 2.1 AA minimum (4.5:1 for text)
- **Touch targets**: Minimum 44x44px on mobile

---

**Document Owner**: Design Team
**Status**: ✅ Ready for Design Generation
**Next Steps**: Generate mockups for Phase 1 screens (Dashboard, Hero Roster, Expeditions)


