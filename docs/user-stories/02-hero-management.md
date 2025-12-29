# User Stories: Hero Management System

**Category:** Hero Management
**Total Stories:** 30
**Priority:** Phase 1-2

---

## 1. Hero Roster

### US-HM-001: View Hero Roster
```
As a player, I want to view all my recruited heroes in a roster, so that I can see my entire collection at a glance.

Acceptance Criteria:
- Display all heroes in a grid or list view
- Show hero name, level, rarity, and power score for each
- Show current status (idle, on expedition, stationed)
- Display hero count vs. capacity (e.g., "15/50 heroes")
- Load within 500ms for rosters up to 100 heroes

Notes:
- Default view should show active/idle heroes first
- Consider card-based UI with hero portrait
- Free players: 50 slots, Supporters: 100+ slots
```

### US-HM-002: Sort Heroes
```
As a player, I want to sort my hero roster by different criteria, so that I can find heroes that meet specific needs.

Acceptance Criteria:
- Sort by: Level (high/low), Power (high/low), Rarity, Name (A-Z), Recently Recruited, Currently Available
- Sorting persists across sessions
- Visual indicator shows current sort method
- Sort applies in under 100ms

Notes:
- "Currently Available" = idle heroes only (not on expeditions)
- Consider multi-sort (e.g., rarity then level)
```

### US-HM-003: Filter Heroes
```
As a player, I want to filter heroes by rarity, traits, equipment, and availability, so that I can quickly find heroes for specific expeditions.

Acceptance Criteria:
- Filter by rarity (Common, Uncommon, Rare, Epic, Legendary)
- Filter by trait tags (Stealth, Fire Magic, etc.)
- Filter by status (Available, On Expedition, Stationed)
- Filter by level range
- Multiple filters combine with AND logic
- Show count of filtered results
- Clear all filters button

Notes:
- Trait tag filters should be autocomplete or dropdown
- Consider saved filter presets in Phase 2+
```

### US-HM-004: View Hero Details
```
As a player, I want to view detailed information about a hero, so that I can understand their strengths and current status.

Acceptance Criteria:
- Display full hero card with name, level, rarity, XP progress
- Show all traits with descriptions and bonuses
- Display equipped gear in all 6 slots
- Show total power score and breakdown (base stats + gear + traits)
- Display current status and time remaining (if on expedition)
- Show XP to next level and next trait unlock milestone
- Show prestige count (if any)

Notes:
- Hero detail should be modal or slide-out panel
- Include visual representation of stats (bars/numbers)
- Highlight conditional traits and when they apply
```

### US-HM-005: Compare Heroes Side-by-Side
```
As a player, I want to compare two or more heroes side-by-side, so that I can make informed decisions about team composition.

Acceptance Criteria:
- Select up to 3 heroes for comparison
- Display side-by-side view of stats, traits, gear, and power
- Highlight differences (higher values in green, lower in red)
- Show which hero is better suited for specific content types
- Allow comparison from roster view without entering details

Notes:
- Phase 2+ feature
- Consider showing tag coverage across compared heroes
```

---

## 2. Hero Recruitment

### US-HM-006: Access Tavern/Recruitment
```
As a player, I want to access the hero recruitment interface, so that I can recruit new heroes to my guild.

Acceptance Criteria:
- Dedicated "Tavern" or "Recruitment" menu option
- Display daily recruitment allowance (free players: 5/day, supporters: unlimited)
- Show current gold balance
- Display time until recruitment allowance resets
- Clear messaging about supporter benefits

Notes:
- Tavern should feel inviting (lighthearted fantasy theme)
- Tutorial should introduce this within first 5 minutes
```

### US-HM-007: View Recruitment Options
```
As a player, I want to see available heroes for recruitment, so that I can choose which heroes to add to my guild.

Acceptance Criteria:
- Display 3-5 randomly generated hero options
- Show hero name, rarity, starting traits, and recruitment cost
- Highlight rarity with visual indicators (colors, borders, effects)
- Display gold cost per hero (scales with rarity)
- Options refresh daily or via premium currency
- Can preview full hero details before recruiting

Notes:
- Rarer heroes cost more gold
- Common: ~100g, Uncommon: ~250g, Rare: ~500g, Epic: ~1000g, Legendary: ~2500g
```

### US-HM-008: Recruit a Hero
```
As a player, I want to recruit a hero from available options, so that I can add them to my roster.

Acceptance Criteria:
- Click/tap to recruit hero
- Confirm recruitment with gold cost
- Deduct gold from player account
- Add hero to roster immediately
- Decrement daily recruitment count (free players)
- Show success animation/feedback
- Prevent recruitment if: insufficient gold, roster full, daily cap reached

Notes:
- No gacha mechanics - what you see is what you get
- Confirmation should prevent accidental clicks
```

### US-HM-009: Refresh Recruitment Options
```
As a player, I want to refresh the available recruitment options using premium currency, so that I can find specific heroes without waiting for daily reset.

Acceptance Criteria:
- Premium currency cost displayed clearly (e.g., 50 gems)
- Confirm refresh with cost warning
- Generate new random hero options
- Preserve unrecruited heroes from previous batch (optional)
- Show cooldown if refresh has limits

Notes:
- Supporter pack grants bulk premium currency
- Free players earn small amounts through play
```

### US-HM-010: Reroll Hero Traits
```
As a supporter, I want to reroll a hero's traits using trait reroll tokens, so that I can optimize heroes for specific roles.

Acceptance Criteria:
- Reroll tokens available via supporter pack or achievements
- Select hero from roster to reroll
- Preview current traits before reroll
- Confirm reroll (costs 1 token)
- Generate new random traits based on hero's rarity
- Traits reroll immediately
- Show before/after comparison

Notes:
- Cannot reroll below minimum trait count for rarity
- Rerolled traits are entirely random (no selective reroll)
- Premium feature, not essential for progression
```

---

## 3. Hero Stats & Traits

### US-HM-011: View Hero Stats
```
As a player, I want to see a hero's base stats clearly, so that I understand their combat effectiveness.

Acceptance Criteria:
- Display primary stats: ATK, DEF, HP, SPD (or similar)
- Show base stats (from level + rarity)
- Show bonus stats (from gear)
- Show total stats (base + gear + traits)
- Breakdown should be expandable/collapsible
- Stats update in real-time when gear changes

Notes:
- Consider visual bars or numerical display
- Color-code stat increases (green) and decreases (red)
```

### US-HM-012: View Hero Traits
```
As a player, I want to view all of a hero's traits with clear descriptions, so that I understand how they affect gameplay.

Acceptance Criteria:
- Display all traits with names and full descriptions
- Categorize by type: Flat bonus, Conditional, Tag
- Show when conditional traits are active/inactive
- Highlight tag traits that match content requirements
- Include flavor text for trait personality

Notes:
- Traits are key to hero identity
- Descriptions should include exact percentages/bonuses
- Phase 2+: Show trait synergies between heroes
```

### US-HM-013: Understand Trait Impact
```
As a player, I want to see how traits affect my hero's performance in specific contexts, so that I can make strategic team-building decisions.

Acceptance Criteria:
- Show effective power with all active traits
- Display conditional trait activation scenarios (e.g., "Active in Fire zones")
- Highlight relevant tags when selecting expedition content
- Show trait-based bonuses in expedition results
- Include tooltip explanations for complex traits

Notes:
- Context-sensitive help crucial for new players
- Could show "recommended content" based on traits
```

### US-HM-014: Track Trait Acquisition
```
As a player, I want to know when my hero will gain new traits, so that I can plan their progression.

Acceptance Criteria:
- Display trait slots: filled vs. maximum (e.g., "3/5 traits")
- Show next trait unlock milestone (level requirement)
- Progress bar toward next trait unlock
- Notification when new trait is gained
- Newly acquired traits highlighted

Notes:
- Trait milestones tied to leveling
- Max traits vary by rarity (Common: 3, Legendary: 7)
- New traits are random within appropriate power budget
```

---

## 4. Hero Equipment

### US-HM-015: View Hero Equipment
```
As a player, I want to see what equipment my hero has equipped, so that I understand their current loadout.

Acceptance Criteria:
- Display all 6 equipment slots: Weapon, Armor, Helmet, Boots, Accessory 1, Accessory 2
- Show equipped item icon, name, and rarity
- Display empty slots clearly
- Show total gear score
- Indicate set bonuses (if any pieces equipped)
- Access from hero detail view

Notes:
- Visual representation of equipment slots (paper doll or slot list)
- Set items should be visually grouped/highlighted
```

### US-HM-016: Equip Items to Hero
```
As a player, I want to equip items to my hero's equipment slots, so that I can improve their combat power.

Acceptance Criteria:
- Select equipment slot to open inventory filter
- Show only items compatible with selected slot
- Display item stats and comparison to currently equipped
- Show stat changes (green/red arrows)
- Show impact on set bonuses
- Equip with single click/tap
- Auto-unequip previous item to inventory
- Update hero power immediately

Notes:
- Items can only be equipped to one hero at a time
- Unequipping returns item to shared inventory
```

### US-HM-017: Compare Gear Before Equipping
```
As a player, I want to compare items before equipping, so that I can make informed gear choices.

Acceptance Criteria:
- Hover/tap item to see comparison vs. equipped item
- Show stat differences numerically (+5 ATK, -2 DEF)
- Display gear score change
- Show set bonus impact (gain/lose)
- Highlight better choice based on total power
- Include special effects/bonuses in comparison

Notes:
- Comparison should account for set bonuses
- Consider "smart" recommendations based on hero traits
```

### US-HM-018: Manage Equipment Sets
```
As a player, I want to see and track equipment sets, so that I can build toward powerful set bonuses.

Acceptance Criteria:
- Display set bonuses on hero detail page
- Show sets: 0/2, 2/4, 4/6 piece progress
- List inactive set bonuses with requirements
- Highlight items in inventory that complete sets
- Show all available sets in codex/reference
- Display set bonus effects clearly (2pc, 4pc, 6pc)

Notes:
- Set bonuses: 2pc minor, 4pc medium + effect, 6pc build-defining
- Phase 1: Basic sets, Phase 3: Full set system
```

### US-HM-019: Get Gear Recommendations
```
As a player, I want to receive gear recommendations based on my hero's traits, so that I can optimize their build efficiently.

Acceptance Criteria:
- "Optimize" button suggests best available gear from inventory
- Recommendations consider: total power, trait synergies, set bonuses
- Show before/after comparison
- One-click equip all recommendations
- Explain why items were recommended

Notes:
- Phase 2+ feature
- Could show "farmable upgrades" from player's dungeons
```

---

## 5. Hero Leveling

### US-HM-020: Gain XP from Expeditions
```
As a player, I want my heroes to gain XP from expeditions, so that they level up and become stronger.

Acceptance Criteria:
- Heroes gain XP upon expedition completion
- XP amount based on expedition duration and difficulty
- XP scales with efficiency (60-150% based on power)
- Show XP gained in expedition results
- Update hero XP bar in real-time
- Heroes on longer expeditions gain more XP

Notes:
- XP is primary progression mechanism
- Stationed heroes gain slow XP trickle
```

### US-HM-021: Level Up Heroes
```
As a player, I want to see when my hero levels up, so that I feel progression and can celebrate milestones.

Acceptance Criteria:
- Level-up notification with visual fanfare
- Display stat increases from level-up
- Show new total power
- Indicate if trait slot unlocked at milestone level
- Level-up persists if player is offline
- Level-up summary accessible from hero details

Notes:
- Level-ups should feel rewarding
- Consider animation/sound effects
- Max level determined by game balance (e.g., 50, 100)
```

### US-HM-022: Track Leveling Progress
```
As a player, I want to see my hero's progress toward next level, so that I can plan their expedition assignments.

Acceptance Criteria:
- XP progress bar on hero card and detail view
- Numerical XP display (current/required)
- Percentage toward next level
- Estimate time to level based on current activities
- Show XP needed to next trait milestone

Notes:
- Progress should be visible at a glance
- Consider showing "levels gained" when checking offline progress
```

### US-HM-023: Understand Level Milestones
```
As a player, I want to know what rewards I'll receive at level milestones, so that I can set leveling goals.

Acceptance Criteria:
- Display milestone levels (e.g., 10, 20, 30, 40, 50)
- Show rewards at each milestone (trait slots, special bonuses)
- Indicate reached vs. unreached milestones
- Highlight next milestone
- Notification when milestone reached

Notes:
- Milestones vary by hero rarity
- Major milestones unlock new trait slots
- Could include cosmetic unlocks (Phase 2+)
```

---

## 6. Hero Prestige

### US-HM-024: Understand Prestige System
```
As a player, I want to understand the prestige system before using it, so that I can make informed decisions.

Acceptance Criteria:
- Clear explanation of prestige mechanics
- Show what is kept: monsters (account-wide), schematics, premium currency
- Show what is lost: hero level, equipped gear (returned to inventory)
- Display permanent bonuses gained from prestiging
- Show prestige requirements (max level reached)
- Tutorial/guide accessible from prestige interface
- Warning before first prestige

Notes:
- Prestige is per-hero, not account-wide
- Prestige is optional but beneficial for long-term progression
```

### US-HM-025: Prestige a Hero
```
As a player, I want to prestige my max-level hero, so that I can gain permanent stat bonuses and continue progressing.

Acceptance Criteria:
- Prestige option available only at max level
- Display prestige bonus preview (permanent stat increases)
- Confirm prestige with clear warning of resets
- Reset hero to level 1 with prestige bonuses applied
- Unequip all gear to inventory
- Increment prestige counter on hero
- Update hero power to reflect prestige bonuses
- Show prestige success notification

Notes:
- Prestige bonuses should be meaningful (~10-20% stat boost per prestige)
- No limit on prestige count
- Each prestige takes longer due to level reset
```

### US-HM-026: View Prestige Bonuses
```
As a player, I want to see a hero's prestige bonuses, so that I understand their enhanced power.

Acceptance Criteria:
- Display prestige count prominently on hero card
- Show total permanent bonuses from all prestiges
- Break down bonuses by stat (ATK, DEF, HP, etc.)
- Indicate prestige level via badge/icon
- Compare prestige bonuses to base stats

Notes:
- Prestiged heroes should feel special
- Visual distinction from non-prestiged heroes
```

### US-HM-027: Plan Prestige Strategy
```
As a player, I want to see projected prestige gains before committing, so that I can optimize when to prestige.

Acceptance Criteria:
- Prestige calculator showing bonus preview
- Comparison of current power vs. post-prestige power at level 1
- Estimate time to return to current power level
- Show long-term benefit projection
- Recommend optimal prestige timing

Notes:
- Phase 2+ feature
- Help players avoid "prestige trap" (feeling weaker immediately after)
```

---

## 7. Hero Retirement

### US-HM-028: Release/Dismiss Hero
```
As a player, I want to release heroes I no longer need, so that I can free roster space for new recruits.

Acceptance Criteria:
- "Release" or "Dismiss" option on hero detail page
- Show refund amount (partial gold return, e.g., 25-50% of recruitment cost)
- Unequip all gear before release (returned to inventory)
- Confirm release with warning (irreversible)
- Remove hero from roster immediately
- Grant gold refund
- Cannot release heroes currently on expeditions/stationed

Notes:
- Prevents hoarding common heroes
- Prestiged heroes may have higher refund value
- Consider cooldown or limit to prevent exploitation
```

### US-HM-029: Bulk Manage Heroes
```
As a player, I want to release multiple heroes at once, so that I can efficiently manage my roster when it's full.

Acceptance Criteria:
- Select multiple heroes for release
- Show total gold refund for selection
- Bulk release confirmation
- Cannot select heroes on expeditions
- All gear returned to inventory
- Release all at once

Notes:
- Phase 2+ feature
- Useful for players at roster cap
- Consider filters (e.g., "release all Common heroes under level 5")
```

### US-HM-030: Prevent Accidental Release
```
As a player, I want safeguards against accidentally releasing valuable heroes, so that I don't lose important characters.

Acceptance Criteria:
- Extra confirmation for Epic/Legendary heroes
- Extra confirmation for prestiged heroes
- Option to "favorite" or "lock" heroes to prevent release
- Locked heroes cannot be released without unlock
- Warning shows hero level, prestige count, equipped gear value

Notes:
- Mistakes should be preventable
- Consider "soft delete" with 24hr recovery window (Phase 2+)
```

---

## Summary

### Coverage Breakdown
- **Hero Roster:** 5 stories (US-HM-001 to US-HM-005)
- **Hero Recruitment:** 5 stories (US-HM-006 to US-HM-010)
- **Hero Stats & Traits:** 4 stories (US-HM-011 to US-HM-014)
- **Hero Equipment:** 5 stories (US-HM-015 to US-HM-019)
- **Hero Leveling:** 4 stories (US-HM-020 to US-HM-023)
- **Hero Prestige:** 4 stories (US-HM-024 to US-HM-027)
- **Hero Retirement:** 3 stories (US-HM-028 to US-HM-030)

### Implementation Priority

**Phase 1 (MVP):**
- US-HM-001, 002, 003, 004 (Roster basics)
- US-HM-006, 007, 008 (Recruitment)
- US-HM-011, 012, 015, 016 (Stats, traits, equipment)
- US-HM-020, 021, 022 (Leveling)
- US-HM-028 (Basic retirement)

**Phase 2:**
- US-HM-009, 010 (Refresh, reroll)
- US-HM-013, 014, 017, 018 (Advanced trait/gear management)
- US-HM-023, 024, 025, 026 (Milestones, prestige)
- US-HM-030 (Safeguards)

**Phase 3+:**
- US-HM-005 (Hero comparison)
- US-HM-019 (Gear recommendations)
- US-HM-027 (Prestige planning)
- US-HM-029 (Bulk management)
