# User Stories: Equipment & Inventory System

**Category:** Equipment & Inventory
**Total Stories:** 27
**Priority:** Phase 1-2

---

## 1. Inventory Management

### US-EQ-001: View Inventory
```
As a player, I want to view all my items in an organized inventory, so that I can see what equipment I have available.

Acceptance Criteria:
- Display all items in grid/list view
- Categorize by slot type (Weapon, Armor, etc.)
- Show item icon, name, rarity, and gear score
- Display inventory count vs capacity (e.g., "127/200 items")
- Indicate equipped items with badge
- Loading time under 500ms for 200+ items
- Pagination or virtual scrolling for large inventories

Notes:
- Component: InventoryGrid.vue
- Store: useInventoryStore
- Consider tabs per slot type
```

### US-EQ-002: Sort and Filter Inventory
```
As a player, I want to sort and filter my inventory, so that I can find specific items quickly.

Acceptance Criteria:
- Sort by: Gear Score, Rarity, Item Level, Name, Recently Acquired
- Filter by: Slot type, Rarity, Set affiliation, Equipped status
- Filter by: "Upgrades Only" (better than currently equipped)
- Multiple filters combine with AND logic
- Show result count
- Clear all filters button
- Persist sort preference across sessions

Notes:
- "Upgrades Only" is powerful QoL feature
- Consider saved filter presets
- Search by item name
```

### US-EQ-003: Manage Storage Capacity
```
As a player, I want to understand my storage limits, so that I can manage my inventory effectively.

Acceptance Criteria:
- Display current/max capacity prominently
- Warning at 80% capacity
- Prevent acquisition at 100% (with warning)
- Show expand options (premium currency)
- Track storage usage by category
- Free: 200 slots, Supporter: 400 slots
- Expandable in increments

Notes:
- Encourage inventory management
- Don't punish hoarding excessively
- Consider "overflow" temporary storage
```

### US-EQ-004: Cross-Hero Inventory Access
```
As a player, I want to access inventory from any hero's equipment screen, so that I can equip items without navigating away.

Acceptance Criteria:
- Inventory accessible from hero equipment view
- Filter automatically by compatible slot
- Show items currently equipped on other heroes
- Warning before unequipping from another hero
- Quick navigation between heroes from inventory
- Side-by-side hero and inventory panels

Notes:
- Reduces navigation friction
- "This item is equipped on [Hero]" indicator
- One-click swap between heroes
```

---

## 2. Equipment Details

### US-EQ-005: View Item Stats
```
As a player, I want to see detailed item statistics, so that I understand an item's value.

Acceptance Criteria:
- Display primary stats (ATK, DEF, HP, etc.)
- Show base stats vs bonus stats
- Display gear score calculation
- Show item level and rarity
- Indicate quality percentile (e.g., "Top 20% roll")
- Display any special effects/procs
- Show acquisition source (where it dropped)

Notes:
- Tooltip or modal for details
- Color-code stats (higher = greener)
- Compare to average for item type
```

### US-EQ-006: View Set Bonus Information
```
As a player, I want to see set bonus information on items, so that I can plan set builds.

Acceptance Criteria:
- Display set name and icon on set items
- Show set progress (2/6, 4/6, etc.)
- List all set bonuses (2pc, 4pc, 6pc effects)
- Highlight active bonuses
- Show other owned pieces from same set
- Link to full set information in codex
- Indicate which heroes have partial sets

Notes:
- Set bonuses are major power spike
- Visual grouping of set pieces
- "Set Finder" tool in Phase 2
```

### US-EQ-007: View Gear Score Breakdown
```
As a player, I want to understand how gear score is calculated, so that I can optimize my builds.

Acceptance Criteria:
- Display total gear score per hero
- Break down by slot contribution
- Show item level contribution
- Display rarity multiplier effect
- Compare to content requirements
- Show average team gear score
- Indicate gear score milestones for content

Notes:
- Gear score gates some dungeons
- Transparency helps optimization
- Tutorial explains gear score
```

### US-EQ-008: Compare Items Side-by-Side
```
As a player, I want to compare items side-by-side, so that I can make informed choices.

Acceptance Criteria:
- Select 2-3 items for comparison
- Display stats in aligned columns
- Highlight differences (green higher, red lower)
- Show gear score difference
- Display set bonus impact
- Compare against currently equipped
- "Lock comparison" to browse while comparing

Notes:
- Essential for gear decisions
- Include in equip flow
- Consider "best for this hero" recommendation
```

---

## 3. Equipping Items

### US-EQ-009: Equip Items to Heroes
```
As a player, I want to equip items to my heroes, so that I can improve their power.

Acceptance Criteria:
- Click/drag item to equipment slot
- Validate slot compatibility
- Show stat change preview before confirming
- Update hero power immediately
- Previous item returned to inventory
- Animation/feedback on equip
- Cannot equip item already on another hero (unequips first)

Notes:
- Core interaction - must be smooth
- Consider "Quick Equip" from loot screen
- Mobile: tap-to-equip or drag
```

### US-EQ-010: Auto-Equip Best Gear
```
As a player, I want to auto-equip the best available gear, so that I can quickly optimize without manual work.

Acceptance Criteria:
- "Auto-Equip" button on hero equipment screen
- Algorithm considers: gear score, set bonuses, hero role
- Preview changes before applying
- Option to "Auto-Equip All Heroes"
- Exclude locked items from auto-equip
- Show what changed after auto-equip
- Revert option (undo last auto-equip)

Notes:
- Great for new players
- Advanced players may prefer manual
- Consider "optimize for" options (power vs set completion)
```

### US-EQ-011: Create Equipment Loadouts
```
As a player, I want to save equipment loadouts, so that I can quickly switch between builds.

Acceptance Criteria:
- Save current equipment as named loadout
- Support multiple loadouts per hero (3-5)
- One-click apply loadout
- Handle missing items gracefully
- Show loadout comparison to current
- Edit/delete saved loadouts
- Indicate items used in multiple loadouts

Notes:
- Phase 2+ feature
- Important for set swapping
- Consider cross-hero loadouts
```

### US-EQ-012: Transfer Items Between Heroes
```
As a player, I want to move items between heroes easily, so that I can share gear.

Acceptance Criteria:
- Unequip from one hero to equip on another
- Quick transfer button in item comparison
- Bulk transfer option (swap loadouts)
- Warning if transfer weakens donor hero significantly
- Track item history (who equipped it)
- Items are account-bound, not hero-bound

Notes:
- Single shared inventory
- No equipment soulbinding
- Consider "borrow" system (temporary transfer)
```

---

## 4. Set Bonus Tracking

### US-EQ-013: View Active Set Bonuses
```
As a player, I want to see my active set bonuses, so that I understand my hero's power.

Acceptance Criteria:
- Display all active set bonuses on hero screen
- Show bonus values for each tier (2/4/6 piece)
- Highlight which bonuses are active
- Show pieces contributing to each set
- Display total set bonus power contribution
- Compare sets across heroes

Notes:
- Major strategic element
- Visual distinction for active bonuses
- Consider set-focused view mode
```

### US-EQ-014: Track Set Collection Progress
```
As a player, I want to track set collection progress, so that I can complete sets.

Acceptance Criteria:
- Show all sets with owned pieces
- Display X/6 pieces owned per set
- Indicate which slots I'm missing
- Show where to farm missing pieces
- Highlight newly acquired set pieces
- Filter by: complete, partial, missing
- Sort by: completion %, power, type

Notes:
- Drives targeted farming
- Link to dungeon loot tables
- Achievement for set completion
```

### US-EQ-015: Plan Set Builds
```
As a player, I want to plan set builds before farming, so that I can optimize my time.

Acceptance Criteria:
- "Set Planner" tool
- Select target sets for hero
- Show which pieces needed
- Display farming locations
- Calculate farming time estimate
- Compare planned build to current
- Save build plans

Notes:
- Phase 2+ feature
- Helps goal setting
- Integration with dungeon recommendations
```

---

## 5. Gear Optimization

### US-EQ-016: Find Upgrades for Heroes
```
As a player, I want to see which inventory items are upgrades, so that I don't miss improvements.

Acceptance Criteria:
- "Show Upgrades" filter in inventory
- Highlight items better than equipped
- Sort by upgrade magnitude
- Consider set bonus impact in calculation
- Account for hero traits and role
- One-click equip upgrade
- "Upgrade Available" indicator on hero roster

Notes:
- Reduces missed opportunities
- Context-aware (per-hero filtering)
- Notification when new upgrades available
```

### US-EQ-017: Get Gear Recommendations
```
As a player, I want gear recommendations based on my hero, so that I can optimize without deep analysis.

Acceptance Criteria:
- "Recommended" section in equipment view
- Suggest items from inventory
- Consider: stats, sets, traits, role
- Explain why items recommended
- Show improvement potential
- Link to farming locations for better gear
- Compare recommendations to current

Notes:
- AI-assisted or rule-based recommendations
- Help new players make good choices
- Phase 2+ feature
```

### US-EQ-018: Compare Hero Power Across Builds
```
As a player, I want to compare hero power with different gear, so that I can find optimal combinations.

Acceptance Criteria:
- "Simulate" gear changes without applying
- Show power before/after
- Test different set combinations
- Compare vs content requirements
- Save simulation as loadout
- A/B comparison mode
- Include trait synergies in calculation

Notes:
- Advanced optimization tool
- Phase 3+ feature
- Theorycrafter's dream
```

---

## 6. Item Acquisition

### US-EQ-019: Receive Loot from Expeditions
```
As a player, I want to collect loot from completed expeditions, so that I can acquire better gear.

Acceptance Criteria:
- Display loot in expedition results
- Show item stats and comparison to equipped
- Quick-equip option for upgrades
- Auto-add to inventory
- Handle inventory full gracefully
- Highlight rare/exceptional drops
- Track drop statistics

Notes:
- Primary acquisition method
- Make loot exciting
- Consider "loot history" log
```

### US-EQ-020: Farm Dungeons for Targeted Loot
```
As a player, I want to farm my dungeons for specific items, so that I can complete builds.

Acceptance Criteria:
- View dungeon loot tables before farming
- See drop rates per item
- Track items received from dungeon
- Compare drop rates across dungeons
- "Need" indicator for items I'm missing
- Farming efficiency statistics
- Pity system for guaranteed drops (optional)

Notes:
- Core of dungeon building loop
- Transparency is key
- Balance RNG with determinism
```

### US-EQ-021: Understand Drop Rates
```
As a player, I want to see drop rates for items, so that I can plan my farming efficiently.

Acceptance Criteria:
- Display drop rates on loot tables
- Show rarity distribution (Common: 60%, Rare: 30%, etc.)
- Indicate efficiency impact on rates
- Track personal drop history
- Compare expected vs actual drops
- "Time to drop" estimates
- Bad luck protection explanation

Notes:
- Transparency builds trust
- Consider hiding exact rates (show relative)
- Avoid frustrating players with low rates
```

---

## 7. Item Disposal

### US-EQ-022: Sell Items for Gold
```
As a player, I want to sell unwanted items, so that I can earn gold and free inventory space.

Acceptance Criteria:
- Sell option on item detail
- Display gold value before selling
- Confirm sale for high-value items
- Bulk sell option (select multiple)
- Cannot sell equipped items
- Gold added immediately
- Sale history log

Notes:
- Quick gold income source
- Value scales with rarity/level
- Consider sell-all-below-rarity option
```

### US-EQ-023: Salvage Items for Materials
```
As a player, I want to salvage items for crafting materials, so that I can get resources.

Acceptance Criteria:
- Salvage option alternative to selling
- Display materials gained before salvaging
- Material type based on item rarity
- Bulk salvage option
- Cannot salvage equipped items
- Materials added to resources
- Salvage history log

Notes:
- Materials used for upgrades/crafting
- Trade-off: gold vs materials
- Consider salvage-all-below-rarity
```

### US-EQ-024: Auto-Salvage Rules
```
As a player, I want auto-salvage rules, so that I don't accumulate junk automatically.

Acceptance Criteria:
- Enable/disable auto-salvage toggle
- Rule: Auto-salvage below X rarity
- Rule: Auto-salvage below X item level
- Rule: Keep at least X items per rarity
- Preview items that would auto-salvage
- Notification: "Auto-salvaged 5 items, gained 125 materials"
- Whitelist to exclude specific items

Notes:
- Prevents inventory overflow
- Conservative defaults (Common only)
- Phase 2+ feature
```

### US-EQ-025: Lock Important Items
```
As a player, I want to lock important items, so that I don't accidentally sell/salvage them.

Acceptance Criteria:
- Lock/unlock toggle on item details
- Padlock icon on locked items
- Locked items excluded from sell/salvage
- Auto-lock options (Legendary+, Set items)
- Warning when trying to dispose locked
- "Review Locked Items" screen
- Quick lock/unlock (single click)

Notes:
- Prevents catastrophic mistakes
- Consider auto-locking best-in-slot
- Phase 1 priority
```

---

## 8. Materials & Resources

### US-EQ-026: Track Materials and Usage
```
As a player, I want to track crafting materials, so that I can manage resources effectively.

Acceptance Criteria:
- Display all material types and quantities
- Show material sources (what salvages into what)
- Display material uses
- Click material to see acquisition/spending options
- Warning when materials low
- Track income over time
- Show storage limits (if any)

Notes:
- Material types: Common Shards, Rare Crystals, etc.
- Persist through prestige
- Consider material tracker widget
```

### US-EQ-027: View Currency Overview
```
As a player, I want to see all currencies at a glance, so that I can track wealth and spending.

Acceptance Criteria:
- Display Gold prominently
- Show Premium Currency (if applicable)
- Display income rates (Gold/hour from passive)
- Show recent spending (last 10 transactions)
- Budget warnings
- Currency sources breakdown
- Historical tracking

Notes:
- Gold is main currency
- Premium only from supporter pack
- Make resource management transparent
```

---

## Summary

### Coverage Breakdown
- **Inventory Management:** 4 stories (US-EQ-001 to US-EQ-004)
- **Equipment Details:** 4 stories (US-EQ-005 to US-EQ-008)
- **Equipping Items:** 4 stories (US-EQ-009 to US-EQ-012)
- **Set Bonus Tracking:** 3 stories (US-EQ-013 to US-EQ-015)
- **Gear Optimization:** 3 stories (US-EQ-016 to US-EQ-018)
- **Item Acquisition:** 3 stories (US-EQ-019 to US-EQ-021)
- **Item Disposal:** 4 stories (US-EQ-022 to US-EQ-025)
- **Materials & Resources:** 2 stories (US-EQ-026 to US-EQ-027)

### Implementation Priority

**Phase 1 (MVP):**
- US-EQ-001, US-EQ-002 (Inventory basics)
- US-EQ-005, US-EQ-009 (Item stats, equipping)
- US-EQ-019, US-EQ-022 (Loot, selling)
- US-EQ-025, US-EQ-026 (Locking, materials)

**Phase 2:**
- US-EQ-003, US-EQ-004 (Storage, cross-hero)
- US-EQ-006, US-EQ-007, US-EQ-008 (Sets, gear score, comparison)
- US-EQ-010, US-EQ-013, US-EQ-014 (Auto-equip, set tracking)
- US-EQ-016, US-EQ-020, US-EQ-023 (Upgrades, farming, salvage)
- US-EQ-027 (Currency)

**Phase 3+:**
- US-EQ-011, US-EQ-012 (Loadouts, transfer)
- US-EQ-015, US-EQ-017, US-EQ-018 (Set planning, recommendations, simulation)
- US-EQ-021, US-EQ-024 (Drop rates, auto-salvage)
