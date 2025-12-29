# User Stories: Expeditions & Content System

**Category:** Expeditions
**Total Stories:** 35
**Priority:** Phase 1-2

---

## 1. Zone Exploration

### US-EX-001: Discover and Select Zones
```
As a player, I want to browse available exploration zones, so that I can choose content appropriate for my team.

Acceptance Criteria:
- Display all zones (unlocked and locked) in zone selection screen
- Show zone name, theme, difficulty rating, and duration options
- Indicate locked zones with unlock requirements (power level)
- Show zone-specific resources (forest=wood, mines=ore)
- Display available monster types for capture
- Show zone familiarity/mastery progress
- Filter zones by unlocked status, difficulty, resource type

Notes:
- Zones unlock progressively with team power
- Familiarity increases with repeated runs
- Consider zone preview images/themes
```

### US-EX-002: Form Expedition Team
```
As a player, I want to assemble a team of heroes for exploration, so that I can optimize for the zone's challenges.

Acceptance Criteria:
- Team size: 2-4 heroes (flexible based on zone)
- Drag-and-drop or click-to-assign heroes to slots
- Show hero availability (not on expedition, not stationed)
- Display team power calculation in real-time
- Show trait tag coverage (helpful for zone bonuses)
- Highlight heroes with conditional traits matching zone
- "Auto-fill" button suggests optimal team

Notes:
- Team composition is strategic decision
- Show which heroes have relevant traits for zone
- Consider team preset saves (Phase 2+)
```

### US-EX-003: Select Expedition Duration
```
As a player, I want to choose expedition duration, so that I can balance time investment vs rewards.

Acceptance Criteria:
- Duration options: 15 min, 30 min, 1 hr, 2 hr
- Show reward scaling per duration (longer = more)
- Display estimated completion timestamp
- Show XP gain per duration
- Longer expeditions have better loot quality chances
- Cannot change duration after starting

Notes:
- Duration affects all reward calculations
- Mobile players may prefer shorter durations
- Longer durations lock heroes for extended periods
```

### US-EX-004: Launch Zone Exploration
```
As a player, I want to start a zone exploration expedition, so that my heroes begin their adventure.

Acceptance Criteria:
- "Start Expedition" button with confirmation
- Validate team meets minimum requirements
- Heroes marked as "On Expedition" immediately
- Timer starts counting down
- Expedition appears in active expedition list
- Cannot start if heroes already busy
- Show departure animation/notification

Notes:
- Server-side timestamp for anti-cheat
- Optimistic UI update with server confirmation
- Handle network errors gracefully
```

### US-EX-005: Run Multiple Concurrent Expeditions
```
As an active player, I want to run multiple expeditions simultaneously, so that I can maximize my progress.

Acceptance Criteria:
- Allow up to 3 concurrent active expeditions (free: 2, supporter: 3)
- Each expedition uses different heroes (no overlap)
- Display all active expeditions in unified view
- Show individual timers for each
- Collect rewards independently
- Cannot exceed concurrent expedition limit

Notes:
- Concurrent limit encourages active play
- Supporters get slight advantage (3 vs 2)
- Consider queue system for starting next expedition
```

---

## 2. Story Missions

### US-EX-006: Access Story Mission Content
```
As a player, I want to play through story missions, so that I can experience the narrative and unlock new content.

Acceptance Criteria:
- Story missions in separate tab from zone exploration
- Display chapter/mission progression
- Show mission requirements (team power, previous completion)
- Preview mission rewards and unlocks
- Indicate narrative content with story icon
- Missions unlock sequentially (no skipping)

Notes:
- Story missions are gatekeeping mechanism
- Unlock dungeons, zones, features at milestones
- Fixed team composition requirements
```

### US-EX-007: Form Fixed Team for Story Mission
```
As a player, I want to assign heroes to story mission roles, so that I meet the mission's specific requirements.

Acceptance Criteria:
- Display required role slots (e.g., 1 Tank, 2 DPS, 1 Support)
- Show which heroes qualify for each role
- Highlight heroes with missing requirements
- Team must meet all role requirements to start
- Show team efficiency calculation
- Cannot proceed with incomplete team

Notes:
- Story missions have stricter requirements than zones
- Encourages roster diversity
- Tutorial mission has relaxed requirements
```

### US-EX-008: Experience Story Narrative
```
As a player, I want to see story cutscenes and dialogue, so that I'm immersed in the world.

Acceptance Criteria:
- Story dialogue displays before/after missions
- Visual novel style presentation (character portraits, text boxes)
- Dialogue reflects hero traits (flavor variations)
- Skip option for repeat players
- Story log saves viewed dialogue
- Keep cutscenes brief (under 2 minutes)

Notes:
- Lighthearted fantasy parody tone
- Heroes can have trait-based dialogue variations
- Voice acting placeholders for future enhancement
```

### US-EX-009: Complete Story Missions for Unlocks
```
As a player, I want to earn guaranteed rewards and unlock new content from story missions, so that progression feels meaningful.

Acceptance Criteria:
- Award guaranteed rewards (no RNG for story missions)
- Unlock next story mission in sequence
- Unlock new zones/features at milestones
- Display completion celebration
- Award unique cosmetics/titles for completion
- Show what was unlocked post-completion

Notes:
- Story missions gate major feature unlocks
- First-time completion bonus higher than repeats
- Track story completion % for profile
```

---

## 3. Dungeon Runs

### US-EX-010: View Dungeon Requirements
```
As a player, I want to see slot and tag requirements before starting a dungeon, so that I can prepare the right team.

Acceptance Criteria:
- Display required slot types (Tank, DPS, Support, etc.)
- Show required/beneficial tags (Fire-resistant, Undead-hunter)
- Indicate which heroes meet each requirement
- Show dungeon difficulty and recommended power
- Display targeted loot table (gear drops)
- Show dungeon duration (2-6hr based on difficulty)

Notes:
- Slot requirements are strict
- Tag requirements give bonus efficiency
- Color-code: green=perfect, yellow=partial, red=poor
```

### US-EX-011: Optimize Team for Dungeon Efficiency
```
As a player, I want to see how my team affects dungeon efficiency, so that I can maximize targeted farming.

Acceptance Criteria:
- Calculate efficiency (60-150%) based on power + slots + tags
- Show breakdown: Base Power (60-100%), Slot Match (+20%), Tag Bonus (+30%)
- Highlight met/unmet requirements
- Show predicted loot quantity at efficiency
- Suggest hero swaps to improve
- Display efficiency tiers (Bronze/Silver/Gold)

Notes:
- Efficiency transparency builds mastery
- 150% efficiency = 2.5x base rewards
- Base power alone caps at 100%
```

### US-EX-012: Start Targeted Farming Run
```
As a player, I want to run dungeons repeatedly for specific gear, so that I can optimize hero builds.

Acceptance Criteria:
- Show specific gear that can drop
- Display drop rates/rarity chances
- One-click start after team selection
- Track dungeon run count
- Show needed gear from loot table
- "Run Again" quick-repeat button after completion

Notes:
- Dungeons are primary targeted farming
- Longer dungeons = better time efficiency
- Consider pity system for guaranteed drops
```

### US-EX-013: Manage Long-Duration Dungeon Runs
```
As a player, I want to monitor multi-hour dungeon runs, so that I can plan around long expeditions.

Acceptance Criteria:
- Clear countdown timer for 2-6hr dungeons
- Show progress percentage or phase indicators
- Check status without interrupting
- Push notifications when complete
- Show estimated completion time
- Cannot cancel dungeons once started (commitment)

Notes:
- Long dungeons lock heroes for extended periods
- Milestone rewards at 25%, 50%, 75% progress
- Offline progress continues
```

---

## 4. Passive Assignments

### US-EX-014: Station Heroes in Zones
```
As a player, I want to station heroes in unlocked zones for idle income, so that I progress during downtime.

Acceptance Criteria:
- Drag/click hero portrait onto zone to station
- Show passive income rate per hour
- Display zone resources generated
- Indicate hero is on passive assignment
- Allow multiple heroes in different zones
- Show total passive income across all
- Prevent stationing heroes on active expeditions

Notes:
- Passive income lower than active expeditions
- No efficiency calculation (flat rate)
- Can station indefinitely
```

### US-EX-015: Collect Passive Income
```
As a player, I want to collect accumulated resources from passive assignments, so that I benefit from idle time.

Acceptance Criteria:
- Show accumulated resources per hero
- Display total time stationed and earnings
- "Collect All" button for all passive heroes
- Update resource counts immediately
- Notification badge when income ready
- Small chance at rare finds (bonus drops)
- Reset timer after collection

Notes:
- Consider income cap to prevent infinite accumulation
- Visual feedback on collection
- Auto-collect when starting active expedition
```

### US-EX-016: Pull Heroes from Passive for Active
```
As a player, I want to recall heroes from passive for active expeditions, so that I can flexibly manage roster.

Acceptance Criteria:
- Stationed heroes shown as available but "on passive"
- Display accumulated income for auto-collection
- Auto-collect passive income on recall
- Pause passive generation when hero leaves
- Confirmation if forfeiting potential bonuses
- Update zone income rate after recall

Notes:
- No penalty for recalling
- Zone slot remains unlocked
- Consider "queue" system for auto-recall
```

### US-EX-017: Optimize Passive Income Strategy
```
As a player, I want to see which heroes are most effective for passive, so that I maximize idle efficiency.

Acceptance Criteria:
- Display income rate per hero + zone
- Show zone resource types
- Highlight traits that boost passive income
- Suggest optimal hero-zone assignments
- Display expected income over time periods
- Show resource bottlenecks to prioritize

Notes:
- Some traits might boost passive specifically
- Balance: keep best heroes for active content
- Tutorial guides early passive strategy
```

---

## 5. Expedition Progress

### US-EX-018: Monitor Active Expedition Timers
```
As a player, I want to see countdown timers for all active expeditions, so that I know when to return.

Acceptance Criteria:
- Real-time countdown for each expedition
- Human-readable format (2h 34m 12s)
- Update every second without refresh
- "Completing..." state in final seconds
- Estimated completion timestamp
- Sort by time remaining (soonest first)
- Timer in browser tab title when active

Notes:
- Server time prevents cheating
- Persist across page refreshes
- Mobile: lock screen notification
```

### US-EX-019: View Expedition Progress Updates
```
As a player, I want to see progress updates during expeditions, so that I stay engaged with content.

Acceptance Criteria:
- Progress bar or percentage for active
- Phase indicators (Setup → Travel → Encounter → Return)
- Flavor text at milestones (25%, 50%, 75%)
- Mini-events shown as they occur
- Indicate monster captures/loot found
- Update log in real-time
- Show hero status during long expeditions

Notes:
- Use SSE for real-time updates
- Updates add engagement without interaction
- 2-4 updates per expedition max
```

### US-EX-020: Receive Real-Time Event Notifications
```
As a player, I want to be notified of significant events during expeditions, so that I enjoy emergent stories as they unfold.

Acceptance Criteria:
- Toast notification for dynamic objectives
- Alert for rare monster encounters
- Notify for trait-triggered special events
- Show mini-story events (rare, AI-generated)
- Loot notifications for exceptional finds
- Dismiss without interrupting
- Persist in expedition log

Notes:
- Balance notification frequency
- Critical events only for notifications
- Preferences: all, important only, none
```

### US-EX-021: Cancel/Recall Active Expeditions
```
As a player, I want to recall expeditions early if needed, so that I can adapt to priorities.

Acceptance Criteria:
- "Recall Expedition" button for active
- Warning about lost progress/reduced rewards
- Confirm decision with modal
- Return heroes immediately on confirm
- Award partial rewards (50% of progress)
- Mark as "Recalled" in history
- Dungeons cannot be recalled (commitment)

Notes:
- Recall penalty discourages abuse
- No refund of costs (if any)
- Story missions cannot be recalled
```

---

## 6. Expedition Completion

### US-EX-022: Receive Completion Notification
```
As a player, I want immediate notification when expeditions complete, so that I can collect rewards and continue.

Acceptance Criteria:
- Prominent notification on completion
- Show expedition name and type
- Indicate reward quality preview
- "Collect Rewards" button in notification
- Badge for pending completions
- Push notification if not viewing game
- Satisfying completion sound/animation

Notes:
- Notification persists until collected
- Batch multiple completions
- Mobile: rich notifications
```

### US-EX-023: View Efficiency-Based Rewards
```
As a player, I want to see how efficiency affected rewards, so that I can improve team composition.

Acceptance Criteria:
- Display final efficiency (60-150%)
- Show reward multiplier
- Break down efficiency sources
- Display base vs actual rewards
- Highlight improvements for next run
- Compare to previous runs
- Visual reward scaling (more items at higher %)

Notes:
- Transparency builds mastery
- 60% = minimum, 150% = 2.5x base
- Bronze/Silver/Gold chest visuals
```

### US-EX-024: View Monster Capture Results
```
As a player, I want to see which monsters I captured, so that I can build better dungeons.

Acceptance Criteria:
- Display captured monsters with rarity/level
- Show capture chance breakdown
- Indicate new vs duplicate captures
- Preview monster loot table
- Show relevant schematics
- Award bonus for first-time captures
- Update collection progress

Notes:
- Capture chance increases with efficiency
- Higher difficulty = rarer monsters
- Zone-specific monster pools
```

### US-EX-025: View Expedition Summary
```
As a player, I want a comprehensive results summary, so that I appreciate everything earned.

Acceptance Criteria:
- Display all rewards by category
- Show XP gained per hero
- Display duration and efficiency
- Show notable log events
- Highlight rare drops with animation
- "Share Results" option (future)
- Show hero level-ups

Notes:
- Make reward screen celebratory
- Visual hierarchy for best rewards
- Skip option for repeat farmers
```

### US-EX-026: Manage Inventory After Completion
```
As a player, I want to quickly manage new items after completion, so that I don't get overwhelmed.

Acceptance Criteria:
- Auto-stack resources to inventory
- Highlight gear upgrades vs equipped
- "Equip" button for immediate upgrades
- Mass-salvage duplicate/unwanted gear
- Inventory capacity warnings
- Auto-sort new items
- Quick access to monster collection

Notes:
- Reduce inventory friction
- Auto-equip option for clear upgrades
- Mobile: swipe gestures for management
```

---

## 7. Expedition Logs

### US-EX-027: Read Generated Narrative Logs
```
As a player, I want to read expedition logs, so that I enjoy emergent stories.

Acceptance Criteria:
- Chronological event list
- Narrative descriptions of encounters
- Procedural flavor text based on zone
- Hero dialogue/reactions
- Different entries for phases
- Format for easy reading
- Save logs for re-reading

Notes:
- Pre-written templates + procedural generation
- Event density scales with duration
- AI-generated rare events
```

### US-EX-028: View Trait-Based Hero Reactions
```
As a player, I want heroes to react based on traits, so that personalities shine through.

Acceptance Criteria:
- Hero-specific dialogue during events
- Match reactions to traits
- Multiple heroes react differently to same event
- Highlight trait triggers in log
- Trait-based bonus outcomes
- Unique reactions even for similar events

Notes:
- Trait reactions are core personality system
- Each trait has multiple templates
- Reactions should feel natural
```

### US-EX-029: Save and Share Memorable Logs
```
As a player, I want to save favorite logs and share them, so that I celebrate great moments.

Acceptance Criteria:
- "Save to Favorites" button
- Favorites library organized by date/tag
- Show involved heroes
- Generate shareable image/text
- Copy to clipboard
- Custom notes (e.g., "First legendary!")
- Search saved logs

Notes:
- Social sharing drives engagement
- Social media integration (Twitter, Discord)
- Privacy options for sharing
```

### US-EX-030: Explore Log History
```
As a player, I want to browse expedition history, so that I track progress and relive adventures.

Acceptance Criteria:
- Chronological list of all completed
- Filter by type (zone, story, dungeon)
- Search by hero/keyword/event
- Statistics (total runs, efficiency, rare events)
- Timeline visualization
- Highlight milestone expeditions
- Export logs as text

Notes:
- Log history as player journal
- Consider data retention limits
- Mobile: optimized scrolling
```

---

## 8. Offline Progress

### US-EX-031: Return to Completed Expeditions
```
As a returning player, I want to see completed expeditions while away, so that I can collect rewards without confusion.

Acceptance Criteria:
- "Welcome Back" summary with completions
- Show all rewards earned offline
- List available heroes (returned)
- Display accumulated passive income
- Highlight exceptional rewards
- "Collect All" button
- Show offline duration

Notes:
- Server-side calculation (anti-cheat)
- Cap offline time (24-48 hours)
- Preserve expedition logs
```

### US-EX-032: Collect Offline Passive Income
```
As a player, I want to collect passive resources from offline time, so that idle time feels rewarding.

Acceptance Criteria:
- Display total passive earned offline
- Breakdown by zone and hero
- Indicate if cap reached
- Display rare finds
- Auto-collect or manual option
- Visual "accumulation" animation
- Update resource counts

Notes:
- Income cap prevents infinite accumulation
- Clear feedback about cap
- Passive is nice bonus, not primary
```

### US-EX-033: Resume Gameplay After Offline
```
As a player, I want to quickly resume after being offline, so that I don't face friction.

Acceptance Criteria:
- Display hero availability
- Show recommended next actions
- Highlight new unlocks
- Display daily/weekly availability
- Quick-start options for common expeditions
- Update UI to current state

Notes:
- Minimize re-onboarding friction
- Celebrate offline progress
- Clear path forward
```

---

## 9. Cross-Cutting Concerns

### US-EX-034: Tutorial and Onboarding
```
As a new player, I want guided introduction to expeditions, so that I understand mechanics without overwhelm.

Acceptance Criteria:
- Tutorial guides first zone exploration
- Explain team formation and efficiency
- Introduce passive after first active
- Unlock story/dungeons progressively
- Tooltips for all UI elements
- "Tips" section for advanced strategies
- Skip option for experienced players

Notes:
- Progressive disclosure over 30-60 mins
- First expedition quick (5-10 min)
- Reward tutorial completion
```

### US-EX-035: Accessibility Features
```
As a player with accessibility needs, I want expeditions to be fully accessible, so that I can enjoy all content.

Acceptance Criteria:
- Screen reader support for all UI
- Keyboard navigation for team selection
- High contrast mode for timers
- Text alternatives for visual info
- Adjustable text size for logs
- Color-blind friendly indicators
- Configurable notifications

Notes:
- WCAG 2.1 AA compliance minimum
- Test with assistive technology
- Animations can be reduced/disabled
```

---

## Summary

### Coverage Breakdown
- **Zone Exploration:** 5 stories (US-EX-001 to US-EX-005)
- **Story Missions:** 4 stories (US-EX-006 to US-EX-009)
- **Dungeon Runs:** 4 stories (US-EX-010 to US-EX-013)
- **Passive Assignments:** 4 stories (US-EX-014 to US-EX-017)
- **Expedition Progress:** 4 stories (US-EX-018 to US-EX-021)
- **Expedition Completion:** 5 stories (US-EX-022 to US-EX-026)
- **Expedition Logs:** 4 stories (US-EX-027 to US-EX-030)
- **Offline Progress:** 3 stories (US-EX-031 to US-EX-033)
- **Cross-Cutting:** 2 stories (US-EX-034 to US-EX-035)

### Implementation Priority

**Phase 1 (MVP):**
- US-EX-001 to US-EX-005 (Zone exploration)
- US-EX-018, US-EX-022, US-EX-023, US-EX-025 (Timers, completion)
- US-EX-027, US-EX-028 (Expedition logs)
- US-EX-034 (Tutorial)

**Phase 2:**
- US-EX-006 to US-EX-009 (Story missions)
- US-EX-010 to US-EX-013 (Dungeon runs)
- US-EX-014 to US-EX-017 (Passive assignments)
- US-EX-019, US-EX-020, US-EX-021 (Progress, notifications, recall)
- US-EX-024, US-EX-026 (Monster captures, inventory)

**Phase 3+:**
- US-EX-029, US-EX-030 (Log sharing, history)
- US-EX-031 to US-EX-033 (Offline progress)
- US-EX-035 (Accessibility)
