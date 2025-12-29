# User Stories: Dungeon Building System

**Category:** Dungeon Building (Core Differentiator)
**Total Stories:** 33
**Priority:** Phase 2

---

## 1. Monster Collection

### US-DB-001: View Monster Collection
```
As a player, I want to view all captured monsters, so that I can see what's available for dungeon building.

Acceptance Criteria:
- Display all captured monsters in grid/list view
- Show monster name, type, rarity, and power level
- Group by type (Beast, Elemental, Undead, etc.)
- Filter by: rarity, type, captured zone, loot table
- Sort by: power, rarity, recently captured, alphabetical
- Show total collection count and completion percentage
- Indicate which monsters are placed in dungeons

Notes:
- Monsters are account-wide (not per-hero)
- Component: MonsterCollection.vue
- Store: useMonsterStore
```

### US-DB-002: View Monster Details
```
As a player, I want to see detailed information about each monster, so that I can make informed dungeon building decisions.

Acceptance Criteria:
- Display monster portrait/icon, name, type, rarity
- Show monster power level and stats
- Display loot table (what this monster drops)
- Show capture location (which zone/mission)
- Indicate dungeon slot compatibility
- Display synergy information (works well with...)
- Show if currently placed in a dungeon

Notes:
- Loot tables are key to targeted farming
- Modal or detail panel view
- Link to where monster can be captured
```

### US-DB-003: Track Collection Progress
```
As a completionist, I want to track my collection progress, so that I can see what monsters I'm missing.

Acceptance Criteria:
- Show X/Y monsters captured per type
- Display per-zone completion percentages
- Indicate undiscovered monsters as silhouettes
- Show rarity distribution in collection
- Track first capture dates
- Display "most recent capture" highlight
- Achievement integration for collection milestones

Notes:
- Drives exploration of all content
- "Pokemon-style" catch 'em all appeal
- Consider collection rewards at thresholds
```

### US-DB-004: Understand Monster Rarity Tiers
```
As a player, I want to understand monster rarity progression, so that I know what to farm for stronger dungeons.

Acceptance Criteria:
- Display rarity tiers: Common → Uncommon → Rare → Epic → Legendary
- Show power difference between rarity tiers
- Indicate where higher rarity versions drop
- Display loot table improvements per rarity
- Show capture rate differences
- Compare owned rarities of same monster type

Notes:
- Same monster type exists at multiple rarities
- Higher rarity = better stats + loot tables
- Harder content drops rarer versions
```

---

## 2. Monster Capture

### US-DB-005: Capture Monsters During Expeditions
```
As a player, I want to capture monsters during expeditions, so that I can build and improve my dungeons.

Acceptance Criteria:
- Monster capture chance calculated during expeditions
- Display capture notification when successful
- Show captured monster details immediately
- Add to collection automatically
- Log capture in expedition log
- Capture rate based on efficiency + monster rarity
- Multiple captures possible per expedition

Notes:
- Capture is chance-based, not guaranteed
- Higher efficiency = better capture rates
- Hero traits may affect capture rate
```

### US-DB-006: See Capture Rates and Availability
```
As a player, I want to see which monsters are available in each expedition, so that I can target specific captures.

Acceptance Criteria:
- Display monster availability before starting
- Show capture rate ranges (Common: 30%, Rare: 5%)
- Indicate if expedition has monsters I don't own
- Filter expeditions by monster availability
- "New monster possible" indicator
- Display capture rate modifiers

Notes:
- Expedition detail panel shows monster list
- Visual indicator for uncaptured monsters
- Hero traits may boost capture rates
```

### US-DB-007: Celebrate First-Time Captures
```
As a player, I want special celebration for first-time captures, so that collection milestones feel rewarding.

Acceptance Criteria:
- Distinct animation/sound for new captures
- "New Monster Discovered!" notification
- Display monster card automatically
- Update collection completion percentage
- Log special event for new captures
- Track discovery date

Notes:
- More prominent than duplicate capture
- Confetti or special effect
- Unique sound effect
```

### US-DB-008: Understand Capture Outcomes
```
As a player, I want to understand capture success/failure, so that I can improve strategies.

Acceptance Criteria:
- Show capture roll results in log
- Explain modifiers affecting rate
- Display "Close call!" for near-misses
- Suggest ways to improve chances
- Show trait effects on capture
- Log: "Nearly caught a [Monster]!" for failures

Notes:
- Transparent RNG feedback
- Educational for new players
- Don't show raw numbers unless requested
```

### US-DB-009: Track Capture Progress Per Zone
```
As a player, I want to see missing monsters per zone, so that I can complete my collection efficiently.

Acceptance Criteria:
- Per-zone capture checklist
- "X/Y monsters captured" display
- Highlight missing monsters in zone details
- Filter "show only needed monsters"
- Track capture attempts vs successes
- Estimate attempts needed based on rates

Notes:
- Helps optimize farming routes
- Part of expedition info panel
- "Collection mode" filter for expeditions
```

---

## 3. Schematic Collection

### US-DB-010: View Schematic Collection
```
As a player, I want to view all collected schematics, so that I can choose which dungeons to build.

Acceptance Criteria:
- Display all schematics in grid/list view
- Show name, rarity, theme/layout preview
- Indicate which are currently in use
- Filter by: rarity, slot count, reward type, buildable
- Sort by: recently acquired, rarity, slot count
- "Buildable now" indicator
- Display total schematics collected

Notes:
- Component: SchematicCollection.vue
- Store: useSchematicStore
- Visual previews of dungeon layouts
```

### US-DB-011: View Schematic Details
```
As a player, I want to view schematic requirements and rewards, so that I can plan monster captures and prioritize builds.

Acceptance Criteria:
- Display slot requirements (e.g., "2 Beasts, 1 Elemental, 1 Any")
- Show base reward types and quality ranges
- Display dungeon theme and layout
- List potential synergies
- Show if I have monsters for all slots
- Indicate missing monster types
- Display estimated completion time

Notes:
- Color-code: green (can fill), red (missing)
- Link to monster collection filtered by requirements
- Show example loot drops
```

### US-DB-012: Identify Buildable Schematics
```
As a player, I want to quickly see buildable schematics, so that I don't waste time on impossible builds.

Acceptance Criteria:
- "Buildable" filter for completable schematics
- Visual badge on buildable items
- Sort by "buildable first"
- Partial completion status (3/4 slots fillable)
- Quick-build button for buildable
- Notify when schematics become buildable

Notes:
- Real-time updates as collection grows
- "Almost buildable" category (1 monster away)
- Tutorial highlights buildable schematics
```

### US-DB-013: Track Schematic Sources
```
As a player, I want to know where to find specific schematics, so that I can target ones I want.

Acceptance Criteria:
- Display drop source for each schematic
- Show drop rates for uncollected
- Filter expeditions by schematic drops
- Indicate content with schematics I don't have
- Track drop attempts vs successes
- "Where to find" link in details

Notes:
- Similar to monster source tracking
- Help plan farming routes
- Consider drop rate boosters
```

---

## 4. Dungeon Building

### US-DB-014: Create Dungeon from Schematic
```
As a player, I want to create a dungeon from a schematic, so that I can farm specific loot.

Acceptance Criteria:
- Select schematic from collection
- Open dungeon builder interface
- See empty slots matching requirements
- Name the dungeon (optional)
- Preview base rewards before building
- Save as draft or activate immediately
- Validate all slots filled before activation

Notes:
- Component: DungeonBuilder.vue
- Drag-and-drop for monster placement
- Validate client-side and server-side
- POST /api/dungeons to create
```

### US-DB-015: Place Monsters with Validation
```
As a player, I want to place monsters with clear validation, so that I understand placement rules.

Acceptance Criteria:
- Drag monster from collection to slot
- Green highlight for valid placements
- Red highlight with tooltip for invalid
- Show slot requirements in empty slots
- Filter available monsters by slot type
- Show monster power when placed
- Allow removing/swapping placed monsters

Notes:
- Real-time validation feedback
- Tooltip explains invalid placements
- Quick-fill button for auto-placement
```

### US-DB-016: Tutorial for First Dungeon Build
```
As a new player, I want guided tutorial for first dungeon, so that I understand the system.

Acceptance Criteria:
- Trigger after first captures + schematic
- Step-by-step guide through builder
- Explain slot types and requirements
- Demonstrate monster placement
- Show reward preview
- Explain activation vs draft
- Reward with guaranteed capture/schematic

Notes:
- Track tutorial progress
- Simple starter schematic guaranteed
- Block other actions during tutorial
```

### US-DB-017: Preview Dungeon Rewards
```
As a player, I want to preview loot before activation, so that I can optimize my build.

Acceptance Criteria:
- Show combined loot table from placed monsters
- Display drop rates per item
- Show synergy bonuses affecting loot
- Compare configurations
- Indicate needed vs owned items
- Show estimated farming efficiency
- Real-time updates on swap

Notes:
- Complex calculation: base + monster loot + synergies
- Client preview, server validates on activation
- "Optimize for" filter option
```

### US-DB-018: Save Incomplete Dungeons as Drafts
```
As a player, I want to save partially-built dungeons, so that I can finish when I capture needed monsters.

Acceptance Criteria:
- "Save Draft" button in builder
- Store draft with filled/empty slots
- List drafts in management view
- Resume building from drafts
- Notify when draft completable
- Auto-save progress
- Limit draft count (10 max)

Notes:
- Store in useDungeonDraftStore
- Persist to database
- Mark "ready" when all monsters captured
```

### US-DB-019: Quick-Optimize Dungeon
```
As a player, I want optimization suggestions, so that I maximize rewards without deep analysis.

Acceptance Criteria:
- "Optimize" button suggests better placements
- Show potential improvements with comparisons
- Suggest monsters to swap for power
- Highlight missed synergies
- Explain why each suggestion helps
- Accept/reject individually
- Before/after loot comparison

Notes:
- Algorithm: maximize power + synergies
- Don't auto-apply, let player choose
- Educational: teaches optimization
```

---

## 5. Synergy System

### US-DB-020: See Basic Synergies During Placement
```
As a player, I want to see synergy bonuses while placing, so that I can make informed decisions.

Acceptance Criteria:
- Synergy indicators when hovering monsters
- Display bonus amounts (+10% loot quality)
- Highlight contributing monsters
- Show total synergy score
- Explain conditions in tooltip
- Color-code strength (weak/moderate/strong)
- Real-time updates on placement

Notes:
- Component: SynergyIndicator.vue
- Pre-load synergy rules
- Visual connections between synergistic monsters
```

### US-DB-021: Discover Hidden Synergies
```
As a player, I want to discover rare synergies through experimentation, so that I have mastery goals.

Acceptance Criteria:
- Powerful synergies hidden until first activation
- "New Synergy Discovered!" notification
- Add discovered synergy to codex
- Display description and requirements
- Track discovery count
- Hint at undiscovered ("???")
- Reward discovery with bonus loot/currency

Notes:
- Discovery tracked per account
- Balance: basic visible, rare hidden
- Community can share discoveries
```

### US-DB-022: Track Discovered Synergies
```
As a player, I want a synergy codex, so that I can reference them when building.

Acceptance Criteria:
- Dedicated "Synergy Codex" view
- List all synergies (discovered and undiscovered)
- Show requirements and bonuses
- Filter by monster type, family, rarity
- Search by monster name or effect
- Link to required monsters
- Show which dungeons use each synergy

Notes:
- Component: SynergyCodex.vue
- Similar to monster collection UI
- Educational resource
```

### US-DB-023: Compare Synergy Options
```
As a player, I want to compare synergy potential between builds, so that I choose the best configuration.

Acceptance Criteria:
- "Compare Builds" mode in builder
- Side-by-side comparison
- Highlight synergy differences
- Compare total bonuses and loot tables
- Save comparison presets
- Quick-swap between builds
- Show trade-offs clearly

Notes:
- Advanced feature for optimization
- Client-side calculation
- Snapshot saved builds for comparison
```

### US-DB-024: Experiment with Combinations
```
As a player, I want to experiment without committing, so that I discover optimal synergies safely.

Acceptance Criteria:
- "Sandbox Mode" for testing builds
- Swap monsters freely without resources
- Calculate theoretical synergies/rewards
- Test multiple configurations quickly
- Save promising builds as drafts
- Compare sandbox vs active
- Exit without changes

Notes:
- Client-side only, no server changes
- Fast iteration for experimentation
- "Lab" theme for sandbox UI
```

---

## 6. Dungeon Farming

### US-DB-025: Send Heroes to Farm Dungeons
```
As a player, I want to send heroes to my dungeons, so that I get targeted loot.

Acceptance Criteria:
- View list of active dungeons
- See power level and completion time
- Select dungeon to farm
- Assign hero(es) to run
- Show power vs difficulty
- Display estimated success rate and loot quality
- Start with confirmation
- Track multiple simultaneous runs

Notes:
- Similar to expedition system
- Dungeon runs are active (not passive)
- API: POST /api/dungeons/[id]/start
```

### US-DB-026: View Dungeon Loot Results
```
As a player, I want to see detailed loot results, so that I understand what I'm farming for.

Acceptance Criteria:
- Show loot gained at completion
- Display which monster dropped each item
- Indicate synergy bonuses applied
- Compare drops vs expected loot table
- Show lucky/unlucky rolls
- Track statistics over runs
- Celebrate rare drops
- Log trait reactions to loot

Notes:
- Results modal with item details
- Click items to view/equip
- Link back for repeat runs
```

### US-DB-027: Target Specific Gear Through Dungeon Choice
```
As a player, I want to find which dungeon drops specific gear, so that I farm efficiently.

Acceptance Criteria:
- Search item by name or type
- Show which dungeons drop that item
- Display drop rates per dungeon
- Sort by drop rate for target
- Indicate if I have dungeons that drop it
- Suggest monsters for optimal farm dungeon
- Track efficiency per item

Notes:
- "Loot Finder" tool
- Reverse lookup: item → dungeons
- Answer "where do I farm X?"
```

### US-DB-028: Understand Dungeon Difficulty
```
As a player, I want to understand difficulty relative to heroes, so that I choose appropriate content.

Acceptance Criteria:
- Display dungeon power level
- Show hero power vs difficulty
- Indicate efficiency rating (60-150%)
- Explain efficiency effect on loot
- Suggest best-suited heroes
- Show expected completion time
- Warn if too hard (low efficiency)

Notes:
- Similar to expedition efficiency
- Visual: green/yellow/red indicators
- No failure, just lower efficiency
```

---

## 7. Dungeon Management

### US-DB-029: Swap Monsters in Active Dungeons
```
As a player, I want to swap monsters in active dungeons, so that I optimize without rebuilding.

Acceptance Criteria:
- Edit mode for active dungeons
- Remove and replace individual monsters
- Maintain slot type validation
- Preview loot changes before confirming
- "Update Dungeon" button
- Can't swap during active run
- Track modification history

Notes:
- PATCH /api/dungeons/[id]
- Re-validate synergies after swap
- Consider swap cooldown
```

### US-DB-030: Deactivate Dungeons to Free Slots
```
As a player, I want to deactivate dungeons, so that I free slots for new builds.

Acceptance Criteria:
- "Deactivate" button on active dungeons
- Show active count vs limit (5/5)
- Confirm deactivation with warning
- Move to "inactive" list
- Can reactivate later (if slots available)
- Preserve configuration
- Show slot availability clearly

Notes:
- Free: 5 active, Supporter: 10
- Unlimited inactive/archived
- Quick reactivate button
```

### US-DB-031: Manage Free vs Supporter Slot Limits
```
As a player, I want to understand slot limits and benefits, so that I can decide about upgrading.

Acceptance Criteria:
- Display active slot count (3/5)
- Show "Supporter: 10 slots" upsell for free
- Prevent activation beyond limit
- Suggest deactivating when limit reached
- Compare free vs supporter benefits
- Instant expansion on upgrade
- Supporter badge in management

Notes:
- Part of monetization (no pay-to-win)
- More slots = variety, not power
- Link to upgrade flow
```

### US-DB-032: Organize and Label Dungeons
```
As a player, I want to rename and organize dungeons, so that I find the right farm quickly.

Acceptance Criteria:
- Custom dungeon names
- Tags or categories
- Sort by: name, rewards, power, recently used
- Filter by: reward type, status, tags
- Pin favorites to top
- Color-code (optional)
- Search by name or tag

Notes:
- QoL for active players
- Important for supporters with 10 slots
- Persist preferences
```

### US-DB-033: View Dungeon Statistics
```
As a player, I want to see statistics per dungeon, so that I track performance and optimize.

Acceptance Criteria:
- Track total runs per dungeon
- Show average completion time
- Display total loot gained
- Calculate actual drop rates
- Compare expected vs actual
- Show most/least efficient dungeons
- Track rare drop occurrences
- Display total farming time

Notes:
- Statistics dashboard per dungeon
- Aggregate across all dungeons
- Identify best farms
- Consider data retention policy
```

---

## Summary

### Coverage Breakdown
- **Monster Collection:** 4 stories (US-DB-001 to US-DB-004)
- **Monster Capture:** 5 stories (US-DB-005 to US-DB-009)
- **Schematic Collection:** 4 stories (US-DB-010 to US-DB-013)
- **Dungeon Building:** 6 stories (US-DB-014 to US-DB-019)
- **Synergy System:** 5 stories (US-DB-020 to US-DB-024)
- **Dungeon Farming:** 4 stories (US-DB-025 to US-DB-028)
- **Dungeon Management:** 5 stories (US-DB-029 to US-DB-033)

### Implementation Priority

**Phase 2a (Core Loop):**
- US-DB-005, US-DB-001 (Capture, collection)
- US-DB-010, US-DB-014, US-DB-015 (Schematics, building)
- US-DB-025, US-DB-026 (Farming, results)
- US-DB-030 (Slot management)

**Phase 2b (Optimization):**
- US-DB-020, US-DB-017 (Synergies, previews)
- US-DB-029, US-DB-027, US-DB-028 (Swapping, targeting, difficulty)

**Phase 3 (Depth):**
- US-DB-021, US-DB-022, US-DB-019, US-DB-024 (Discovery, codex, optimization, sandbox)
- US-DB-033 (Statistics)

**Phase 4 (Polish):**
- US-DB-002, US-DB-003, US-DB-004, US-DB-007 (Details, progress, rarities, celebrations)
- US-DB-032 (Organization)
