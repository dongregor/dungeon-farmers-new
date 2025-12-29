# User Stories: Progression, Scaling & Monetization

**Category:** Progression & Monetization
**Total Stories:** 35+
**Priority:** Phase 1-3

---

## 1. Zone/Content Unlocking

### US-PM-001: View Zone Unlock Requirements
```
As a new player, I want to see which zones are locked and why, so that I understand how to unlock new content.

Acceptance Criteria:
- Locked zones display required team power or completion requirements
- Visual indicator shows current team power vs required
- Hovering/tapping shows detailed unlock criteria
- Progress bar shows how close to unlocking
- Color-code: green (unlocked), yellow (almost), red (far)

Notes:
- Display in zone selection UI
- Show "Unlock at 1,200 power" or "Complete Story Mission: Chapter 3"
```

### US-PM-002: Receive Zone Unlock Notifications
```
As a progressing player, I want to be notified when I unlock a new zone, so that I'm motivated to explore.

Acceptance Criteria:
- Toast notification when power reaches threshold
- New zone pulses/glows in zone list
- First unlock grants small reward (gold, XP boost)
- Tutorial tooltip explains new zone's features
- Clear "NEW" badge on first visit

Notes:
- Check unlock conditions after expedition completion
- Track which zones player has visited
```

### US-PM-003: View Dungeon Unlock Requirements
```
As a mid-game player, I want to see dungeon requirements before I can build them, so that I know what to target.

Acceptance Criteria:
- Dungeon schematics show required gear score
- Current team gear score displayed prominently
- Tooltip explains gear score calculation
- Can preview dungeon even if locked
- Show "X more gear score needed"

Notes:
- Gear score = average item level across equipped gear
- Show per-hero and team average
```

### US-PM-004: Progress Through Story Gates
```
As an advanced player, I want story missions to gate harder content, so that I have clear milestones.

Acceptance Criteria:
- Story missions unlock in sequence
- Each chapter requires power + previous completion
- Completion unlocks zones/features/dungeon types
- Clear progression tracker in UI
- Celebrate chapter completions

Notes:
- Story missions are "skill checks"
- Gate major feature unlocks (dungeon building, prestige)
```

---

## 2. Daily/Weekly Activities

### US-PM-005: Daily Hero Recruitment Cap (Free)
```
As a free player, I want to recruit up to 5 heroes per day, so that I can grow my roster steadily.

Acceptance Criteria:
- Counter shows "X/5 recruits today"
- Resets at daily rollover (server time)
- Clear indicator when cap reached
- Timer shows "Reset in: Xh Ym"
- Can't bypass cap with premium currency

Notes:
- Store daily count in player profile
- 5/day = 35/week = 150/month (plenty for free)
```

### US-PM-006: Unlimited Recruitment (Supporter)
```
As a supporter, I want unlimited hero recruitment, so that I can optimize my roster freely.

Acceptance Criteria:
- No daily cap counter for supporters
- Badge indicates "Unlimited Recruitment"
- Still requires gold per recruit
- Can recruit repeatedly if gold available
- Pool refresh still costs gems or 24h wait

Notes:
- Gold economy balances unlimited recruitment
- Still costs 500-5000 gold per recruit
```

### US-PM-007: Daily Login Rewards
```
As a returning player, I want daily bonuses, so that I'm incentivized to log in regularly.

Acceptance Criteria:
- Daily login calendar (7-day cycle)
- Rewards scale with streak (day 7 is best)
- First login each day triggers reward modal
- Grace period for missed days (1 day)
- Rewards: gold, gems, trait tokens

Notes:
- Not mandatory for progression
- Nice bonus, not FOMO mechanic
- Consider "catch-up" for lapsed players
```

### US-PM-008: Daily/Weekly Quests
```
As an engaged player, I want daily/weekly quests, so that I have clear short-term goals.

Acceptance Criteria:
- Daily quests (3-5): simple tasks
- Weekly quests (3-5): harder tasks
- Progress tracked in real-time
- Auto-complete when objectives met
- Rewards: gold, XP, gems
- Reset on server time

Notes:
- Guide gameplay naturally
- Claim rewards manually or auto-collect
- Examples: "Complete 2 expeditions", "Recruit 1 hero"
```

### US-PM-009: Earn Premium Currency Through Play (Free)
```
As a free player, I want to earn premium currency daily, so that I can eventually access premium features.

Acceptance Criteria:
- Daily quests grant 10-25 gems
- Weekly quests grant 50-100 gems
- Achievements grant one-time gems (50-500)
- Free players earn ~500-1000 gems/month
- Slow but steady accumulation

Notes:
- Balance so free players can occasionally refresh/reroll
- Supporter gets ~3500/month (100/day + quests)
```

---

## 3. Premium Currency

### US-PM-010: Refresh Recruitment Pool
```
As a player, I want to refresh hero recruitment options, so that I can search for specific traits.

Acceptance Criteria:
- "Refresh Pool" costs 50-100 gems
- Generates 5 new random heroes
- Daily recruit cap still applies (free)
- Confirmation before spending
- Pool refreshes free every 24h

Notes:
- Allows targeted searching
- Track refresh count for analytics
```

### US-PM-011: Trait Reroll Tokens
```
As any player, I want to use trait reroll tokens, so that I can optimize my heroes.

Acceptance Criteria:
- Tokens earned from quests, supporter pack, achievements
- Select hero → "Reroll Traits" → spend 1 token
- New random traits (same count for rarity)
- Confirmation shows current traits
- Cannot reroll mythic heroes

Notes:
- Tokens NOT purchasable with gems
- Only from supporter pack/rewards
- Animations for transformation
```

### US-PM-012: Skip Expedition Wait Times
```
As an impatient player, I want to skip wait times, so that I can play at my own pace.

Acceptance Criteria:
- "Skip Wait" button on active expeditions
- Cost scales with time remaining (10 gems/hour)
- Confirmation shows cost breakdown
- Completes instantly with same rewards
- Expensive for long waits (discourages abuse)

Notes:
- Show efficiency comparison (wait vs pay)
- Track usage for balancing
```

### US-PM-013: Purchase Extra Slots
```
As a growing player, I want to buy extra slots with gems, so that I can expand my collection.

Acceptance Criteria:
- "Expand Slots" in roster and dungeon builder
- Costs scale (first cheap, later expensive)
- Free: 50 heroes, 5 dungeons
- Supporter: starts at 100/10 (can buy more)
- Permanent unlocks
- Cap at reasonable limit (200/20)

Notes:
- Clear value per slot
- One-time purchase, not consumable
```

### US-PM-014: View Premium Currency Balance
```
As any player, I want to see my gem balance clearly, so that I know what I can afford.

Acceptance Criteria:
- Currency in top header (persistent)
- Updates in real-time
- Click for transaction history
- Purchase button links to store
- Show "earned this week" for motivation

Notes:
- History helps understand value
- Track spending patterns
```

---

## 4. Supporter Pack

### US-PM-015: View Supporter Pack Benefits
```
As a potential supporter, I want to see all benefits before purchasing, so that I understand the value.

Acceptance Criteria:
- Store page lists all benefits
- Comparison: one-time vs ongoing bonuses
- Comparison table: Free vs Supporter
- FAQs for common questions
- Emphasize "faster not further"

Notes:
- One-time purchase ($15-20)
- Show lifetime value calculation
- Testimonials if available
```

### US-PM-016: Purchase Supporter Pack
```
As a new player, I want to purchase easily, so that I can support the game.

Acceptance Criteria:
- "Supporter Pack" button prominent
- Secure payment via Stripe
- Immediate activation
- Confirmation email with receipt
- All benefits granted instantly

Notes:
- One-time purchase ($15-20)
- Account-bound (not character-bound)
- Graceful error handling
```

### US-PM-017: Display Supporter Badge
```
As a supporter, I want to see my badge and status, so that I feel recognized.

Acceptance Criteria:
- Badge next to username in UI
- Profile shows supporter status + join date
- Exclusive badge cosmetic
- Appears in chat/leaderboards (future)
- Badge customizable if multiple cosmetics

Notes:
- Subtle but visible
- Not obnoxious
```

### US-PM-018: Claim Daily Gem Income (Supporter)
```
As a supporter, I want daily gems automatically, so that I don't have to log in just for currency.

Acceptance Criteria:
- Gems auto-accumulate (100/day)
- Login shows "Earned X gems while away" (up to 7 days cap)
- No manual claiming required
- Transaction log shows grants
- Cap at 700 stored (encourages weekly logins)

Notes:
- Prevents infinite accumulation
- Weekly check-in cadence
```

### US-PM-019: Access Exclusive Cosmetics
```
As a supporter, I want exclusive cosmetics immediately, so that I can customize.

Acceptance Criteria:
- Cosmetics unlocked in customization menu
- Includes: UI themes, hero skins, badge
- Preview and apply instantly
- Saved to account
- Purely visual (no gameplay impact)

Notes:
- 2-3 UI themes, 3-5 hero skins
- Consider holiday/event cosmetics
```

---

## 5. Account Settings

### US-PM-020: Manage Account Profile
```
As any player, I want to manage my profile, so that I can personalize my identity.

Acceptance Criteria:
- Settings tabs: Profile, Preferences, Data
- Profile: username, avatar, badge
- Change username (once/month cooldown)
- Avatar from unlocked options
- Profile visible to self (and others if social)

Notes:
- Username must be unique
- Default avatar if not selected
```

### US-PM-021: Configure Gameplay Preferences
```
As any player, I want to configure preferences, so that the game suits my playstyle.

Acceptance Criteria:
- Notifications: toggle types
- Sound/Music: volume sliders, mute
- Accessibility: text size, color blind, reduced animations
- Save to server (persist across devices)
- Defaults: notifications ON, sound ON

Notes:
- Accessibility improves inclusivity
- Consider theme preferences
```

### US-PM-022: Manage Game Data
```
As a privacy-conscious player, I want to export or delete my data, so that I have control.

Acceptance Criteria:
- "Data Management" tab
- "Export Data" downloads JSON
- "Delete Account" requires confirmation
- GDPR/CCPA compliance
- Grace period before permanent deletion

Notes:
- Export includes all player data
- Deletion is irreversible (with warning)
```

### US-PM-023: Sync Across Devices
```
As a multi-device player, I want progress to sync, so that I can play anywhere.

Acceptance Criteria:
- Account-based saves (not local)
- Login syncs automatically
- Conflict resolution (last write wins or smart merge)
- Loading indicator during sync
- Offline mode stores local, syncs on reconnect

Notes:
- Supabase handles sync
- Critical for cross-platform play
```

---

## 6. Achievements & Goals

### US-PM-024: Track Long-Term Achievements
```
As an achievement hunter, I want to track goals, so that I have endgame objectives.

Acceptance Criteria:
- Achievements page with categories
- Progress bars for incremental (47/100 heroes)
- Rewards: gems, cosmetics, titles
- Badges for completed
- Filter: in-progress, completed, locked

Notes:
- Examples: "Prestige 10 heroes", "Collect all monsters"
- 50-500 gems per achievement
```

### US-PM-025: Discover Hidden Achievements
```
As a completionist, I want hidden achievements, so that I'm surprised and delighted.

Acceptance Criteria:
- Hidden as "???" until unlocked
- Fanfare notification on unlock
- Rewards cosmetic or flavorful
- Balance hints vs surprise
- Community can share discoveries

Notes:
- Examples: "Hero with 4 contradictory traits"
- Not required for progression
```

### US-PM-026: Set Personal Milestones
```
As a goal-oriented player, I want to set custom milestones, so that I can track personal objectives.

Acceptance Criteria:
- "Goals" tab separate from achievements
- Create custom goals
- Pin up to 3 to main UI
- Check off manually or auto-complete
- More freeform than achievements

Notes:
- Helps focus on specific objectives
- Phase 2+ feature
```

---

## 7. Cosmetics

### US-PM-027: Apply UI Themes
```
As a supporter, I want to apply UI themes, so that the game reflects my style.

Acceptance Criteria:
- Themes change colors, fonts, backgrounds
- Preview before applying
- Switch instantly (no reload)
- Themes: Default, Dark Mode, Supporter Exclusive (2-3)
- Save preference to account

Notes:
- Use Tailwind CSS variables
- Holiday/event themes later
```

### US-PM-028: Unlock Hero Skins
```
As a collector, I want to unlock hero skins, so that I have visual variety.

Acceptance Criteria:
- Skins apply to specific heroes
- Unlocked via achievements, supporter, events
- Apply in hero detail view
- Visible in roster, expeditions, logs
- Visual overrides (same stats)

Notes:
- Rarity tiers (common, rare, legendary skins)
- Phase 2+ feature
```

### US-PM-029: Customize Profile Badge
```
As a supporter, I want to customize my badge, so that I stand out.

Acceptance Criteria:
- Badge selection in settings
- Unlocked via supporter, achievements, events
- Preview before applying
- Visible in profile, leaderboards, chat
- Animated badges for special achievements

Notes:
- Small icons/frames around username
- Phase 2+ feature
```

---

## 8. Free vs Supporter Experience

### US-PM-030: Access All Core Gameplay (Free)
```
As a free player, I want to experience all systems, so that I never feel locked out.

Acceptance Criteria:
- Access all zones, missions, dungeons, features
- Can progress to endgame (slower)
- No content behind paywall
- Clear communication of differences
- Generous base caps (50 heroes is a lot)

Notes:
- Supporter = convenience, not exclusive content
- Free players earn gems slowly
```

### US-PM-031: Daily Free Recruitment
```
As a free player, I want 5 recruits daily, so that I grow steadily.

Acceptance Criteria:
- 5/day cap for free
- Costs gold per recruit
- Pool refreshes every 24h free
- Can spend gems to refresh pool (not bypass cap)
- 5/day = 35/week = 150/month

Notes:
- Gold cost prevents spam
- Plenty for free player
```

### US-PM-032: Supporter Slot Benefits
```
As a supporter, I want more hero/dungeon slots, so that I can collect more freely.

Acceptance Criteria:
- Supporter: 100 hero slots, 10 dungeon slots
- Expandable with gems
- Immediately unlocked on purchase
- Retroactive if upgrading from free

Notes:
- 100 heroes = serious collector
- 10 dungeons = full optimization
```

### US-PM-033: Earn Gems Through Gameplay
```
As any player, I want to earn gems through play, so that I can access premium features.

Acceptance Criteria:
- Free: ~10-25/day from dailies (~750/month)
- Achievements: 50-500 one-time
- Weekly quests: 50-100 gems
- Supporter: 100/day passive + quest rewards (~3500/month)
- Both can save for features

Notes:
- Free players progress slowly but surely
- Supporters have abundance
```

### US-PM-034: Supporter Trait Reroll Tokens
```
As a supporter, I want monthly trait tokens, so that I can optimize heroes.

Acceptance Criteria:
- 5 tokens upfront, 2/month ongoing
- Stored in inventory (no expiration)
- Use on any hero (except mythic)
- Shows remaining tokens in hero view
- NOT purchasable with gems

Notes:
- Prevents pay-to-win
- Can't buy perfect hero instantly
```

### US-PM-035: View Value Breakdown
```
As a potential supporter, I want clear value breakdown, so that I make informed decision.

Acceptance Criteria:
- Store shows monetary value
- Example: "5000 gems ($50 value) + 100/day + cosmetics"
- Comparison table: Free vs Supporter
- Testimonials/FAQ
- Emphasize time savings, not power

Notes:
- Link to monetization philosophy
- Show "break-even" calculation
```

---

## 9. Progression Milestones

### US-PM-036: Follow Tutorial Progression
```
As a new player, I want clear tutorial guiding early progression, so that I understand advancement.

Acceptance Criteria:
- Tutorial covers: recruit, expedition, equip, unlock
- Interactive steps with highlights
- Skip/replay option
- Starter rewards (gold, hero, gems)
- Save progress (resume if interrupted)

Notes:
- Not just text—interactive
- First 30-60 minutes guided
```

### US-PM-037: Track Account Level
```
As a progressing player, I want to see account level increase, so that I feel growth.

Acceptance Criteria:
- Account level separate from heroes
- Gains XP from all activities
- Levels grant rewards (gems, gold, slots, cosmetics)
- Displayed in profile
- Shows "time invested" (prestige-proof)

Notes:
- Gate features behind account level (optional)
- Visual progression indicator
```

### US-PM-038: Prestige for Permanent Bonuses
```
As an endgame player, I want prestige mechanics, so that I have long-term goals.

Acceptance Criteria:
- Available at max hero level (50)
- Resets to level 1, keeps traits/equipment
- Grants permanent bonuses (+5% all stats)
- Multiple prestiges (stacking)
- Per-hero (not account reset)

Notes:
- UI shows prestige level (stars, badges)
- Each prestige marginally harder
- Phase 3 feature
```

---

## 10. Economy & Balancing

### US-PM-039: Sustainable Gold Income (Free)
```
As a free player, I want gold income to support gameplay, so that I progress reasonably.

Acceptance Criteria:
- Expeditions grant gold based on efficiency
- Daily quests grant gold
- Sell gear/heroes for gold
- Gold scales with progression
- ~5000-10000 gold/day actively playing

Notes:
- Balance sinks (recruitment, upgrades) vs income
- Never feel stuck without gold
```

### US-PM-040: Supporter Gold Abundance
```
As a supporter, I want gold to feel abundant, so that I can experiment freely.

Acceptance Criteria:
- Same sources as free
- Unlimited recruitment means gold is limiter
- More dungeon slots = more passive gold
- NO direct gold purchases (no pay-to-win)

Notes:
- Progress faster via unlimited recruitment
- Gold economy balances both experiences
```

---

## Summary

### Coverage Breakdown
- **Zone/Content Unlocking:** 4 stories (US-PM-001 to US-PM-004)
- **Daily/Weekly Activities:** 5 stories (US-PM-005 to US-PM-009)
- **Premium Currency:** 5 stories (US-PM-010 to US-PM-014)
- **Supporter Pack:** 5 stories (US-PM-015 to US-PM-019)
- **Account Settings:** 4 stories (US-PM-020 to US-PM-023)
- **Achievements & Goals:** 3 stories (US-PM-024 to US-PM-026)
- **Cosmetics:** 3 stories (US-PM-027 to US-PM-029)
- **Free vs Supporter:** 6 stories (US-PM-030 to US-PM-035)
- **Progression Milestones:** 3 stories (US-PM-036 to US-PM-038)
- **Economy & Balancing:** 2 stories (US-PM-039 to US-PM-040)

### Implementation Priority

**Phase 1 (MVP):**
- US-PM-001, US-PM-002 (Zone unlocks)
- US-PM-005, US-PM-008 (Daily caps, quests)
- US-PM-020, US-PM-023 (Account, sync)
- US-PM-030, US-PM-031 (Free experience)
- US-PM-036, US-PM-039 (Tutorial, gold)

**Phase 2:**
- US-PM-003, US-PM-004 (Content gates)
- US-PM-006, US-PM-007, US-PM-009 (Supporter recruitment, login, gems)
- US-PM-010 to US-PM-014 (Premium currency uses)
- US-PM-015 to US-PM-019 (Supporter pack)
- US-PM-021, US-PM-022 (Settings)
- US-PM-032 to US-PM-035 (Free vs Supporter)
- US-PM-037 (Account level)

**Phase 3+:**
- US-PM-011 (Trait rerolls)
- US-PM-024 to US-PM-026 (Achievements)
- US-PM-027 to US-PM-029 (Cosmetics)
- US-PM-034 (Monthly tokens)
- US-PM-038 (Prestige)
- US-PM-040 (Economy polish)
