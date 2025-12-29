# User Stories: Onboarding & First-Time User Experience

**Category:** Onboarding
**Total Stories:** 27
**Priority:** Phase 1 (MVP)

---

## 1. Account Creation & Login

### US-OB-001: Play Immediately as Guest
```
As a new player, I want to start playing immediately without creating an account, so that I can experience the game without friction.

Acceptance Criteria:
- "Play as Guest" button prominently displayed on landing page
- Guest session created with temporary ID stored in localStorage
- Full game access (all features available to free players)
- Progress saved locally until account creation
- Clear indicator showing guest status with "Create Account" prompt
- Guest can play indefinitely but warned about data loss risk
- Works on both desktop and mobile browsers

Notes:
- Guest mode reduces onboarding friction significantly
- Conversion funnel: Guest → Account created → Supporter
- Track guest session duration for analytics
```

### US-OB-002: Create Full Account
```
As a guest player, I want to create a full account, so that my progress is saved to the cloud and accessible anywhere.

Acceptance Criteria:
- Sign up with email/password or OAuth (Google, Discord)
- Email verification required for email signup
- Password requirements: 8+ chars, mixed case/numbers
- Username selection (unique, 3-20 chars, alphanumeric)
- Terms of Service and Privacy Policy acceptance
- Account creation completes within 30 seconds
- Success message with next steps

Notes:
- OAuth preferred for reduced friction
- Consider Discord integration (gaming audience)
- Store: useAuthStore for session management
```

### US-OB-003: Log In to Existing Account
```
As a returning player, I want to log in to my account, so that I can access my saved progress.

Acceptance Criteria:
- Login form with email/password or OAuth options
- "Remember me" checkbox for persistent sessions
- Error messages for invalid credentials (generic for security)
- Rate limiting after 5 failed attempts (5 min cooldown)
- Redirect to game after successful login
- Session persists across browser restarts (if remembered)
- Support for multiple devices (session management)

Notes:
- Use Supabase Auth for implementation
- JWT tokens with refresh mechanism
- Show loading state during authentication
```

### US-OB-004: Recover Forgotten Password
```
As a forgetful player, I want to recover my password, so that I can regain access to my account.

Acceptance Criteria:
- "Forgot Password" link on login page
- Email input for password reset request
- Reset email sent within 1 minute (check spam folder note)
- Reset link expires after 1 hour
- New password must meet requirements
- Confirmation of successful password change
- Automatic login after reset

Notes:
- Use secure token generation for reset links
- Log password reset attempts for security monitoring
- Consider CAPTCHA for abuse prevention
```

### US-OB-005: Link Guest Account to Full Account
```
As a guest player, I want to link my progress to a new account, so that I don't lose my game data.

Acceptance Criteria:
- "Create Account" button in settings and header
- Progress transfer confirmation dialog
- All guest data migrated: heroes, gear, resources, progress
- Original guest session invalidated after linking
- Success message confirming data transfer
- Cannot link to existing account (only new accounts)
- Handles conflict if creating account that already exists

Notes:
- Critical feature for conversion
- Test edge cases: incomplete expeditions, pending rewards
- One-way operation (cannot unlink)
```

---

## 2. First Launch Experience

### US-OB-006: Welcome Screen Introduction
```
As a new player, I want to see a welcoming introduction, so that I understand the game's theme and tone.

Acceptance Criteria:
- Animated welcome screen with game logo
- Brief tagline: "Build dungeons. Capture monsters. Farm legendary loot."
- Tone-appropriate flavor text (lighthearted fantasy parody)
- "Begin Adventure" button to proceed
- Skip option for returning players (localStorage check)
- Loads within 3 seconds on average connection
- Mobile-responsive design

Notes:
- Sets lighthearted tone immediately
- Use parallax or subtle animations
- Don't overwhelm with text (keep it brief)
```

### US-OB-007: Receive First Hero
```
As a new player, I want to receive my first hero automatically, so that I can start playing immediately without decision paralysis.

Acceptance Criteria:
- First hero granted after welcome screen
- Hero is Uncommon rarity (not too weak, not too strong)
- Has 2 interesting traits (showcase the trait system)
- Introduction card shows hero name, traits, stats
- Flavor text: "Your first recruit has arrived!"
- Hero added to roster automatically
- Cannot skip this step

Notes:
- Pre-generated hero to ensure good first impression
- Traits should be easy to understand (flat bonuses preferred)
- Avoid conditional or complex traits for first hero
```

### US-OB-008: UI Orientation Tour
```
As a new player, I want a brief tour of the main interface, so that I know where to find things.

Acceptance Criteria:
- Highlight key UI areas: Heroes, Expeditions, Inventory, Dungeons (locked)
- Tooltip bubbles explain each section (1-2 sentences)
- Progress through tour with "Next" button or click-to-advance
- Skip option available ("I'll explore myself")
- Tour completes in under 60 seconds
- Marks tour as complete in player profile
- Can replay tour from settings

Notes:
- Use overlay with spotlight effect
- Don't explain everything—just navigation basics
- Dungeon section shows "Coming soon!" (Phase 2)
```

### US-OB-009: Choose Guild Name
```
As a new player, I want to name my guild, so that I feel ownership of my adventure.

Acceptance Criteria:
- Prompt appears after UI tour
- Text input with character limit (3-24 chars)
- Profanity filter (basic word list)
- Suggestions available ("Random Name" button)
- Can change later in settings (once/month)
- Guild name displayed in header
- Default name if skipped: "Adventurer's Guild"

Notes:
- Personalization increases engagement
- Random names should be fun/fantasy-themed
- Store in player profile
```

---

## 3. Tutorial Flow

### US-OB-010: First Expedition Walkthrough
```
As a new player, I want to be guided through sending my first hero on an expedition, so that I understand the core gameplay loop.

Acceptance Criteria:
- Tutorial prompt appears after guild naming
- Step-by-step highlights: Expeditions tab → Zone selection → Team assignment
- First hero pre-selected in team slot
- "Start Expedition" button highlighted with pulse effect
- Explains real-time waiting mechanic
- First expedition is short (5 minutes max)
- Tutorial currency granted (10 gems) to demonstrate speed-up option
- Handles browser closure during expedition (resume on return)

Notes:
- This is the core loop—must be crystal clear
- Short expedition ensures quick feedback
- Speed-up is optional, not required
```

### US-OB-011: Understanding Expedition Logs
```
As a new player, I want to understand expedition logs after completion, so that I appreciate the emergent stories.

Acceptance Criteria:
- Tutorial highlights expedition completion notification
- Opens expedition log automatically
- Explains log structure: events, loot, hero reactions
- Points out trait-based reactions ("Notice how [Hero] reacted based on their trait!")
- Highlights rewards section
- "Collect Rewards" button emphasized
- Log saved to history for later viewing

Notes:
- Trait reactions are key differentiator—emphasize them
- First expedition should generate interesting events
- Tutorial text should match lighthearted tone
```

### US-OB-012: Equipping First Gear
```
As a new player, I want to learn how to equip gear to my hero, so that I can improve their power.

Acceptance Criteria:
- First expedition drops guaranteed equipment piece
- Tutorial prompts: "You found gear! Let's equip it."
- Guides to hero detail → equipment slot
- Shows stat comparison (before/after)
- Drag-and-drop or click-to-equip instruction
- Power score increases visibly
- Celebration: "Your hero is stronger now!"

Notes:
- Visual feedback for power increase is crucial
- First gear should be meaningful upgrade
- Consider auto-equip suggestion for simplicity
```

### US-OB-013: Recruiting Second Hero
```
As a new player, I want to recruit a second hero, so that I can form teams.

Acceptance Criteria:
- Tutorial triggers after equipping gear
- Guides to Tavern/Recruitment screen
- Shows available heroes with traits and costs
- First recruit is free (tutorial bonus) or heavily discounted
- Explains gold cost for future recruits
- New hero added to roster
- Explains daily recruitment cap (free players)

Notes:
- Second hero enables team formation
- Make recruit options interesting (variety of traits)
- Don't overwhelm with recruitment mechanics yet
```

### US-OB-014: Forming Multi-Hero Teams
```
As a new player, I want to learn how to form a team with multiple heroes, so that I can tackle harder content.

Acceptance Criteria:
- Tutorial triggers when starting second expedition
- Shows team formation UI with multiple slots
- Drag heroes to slots or click to assign
- Explains team power calculation
- Shows efficiency preview (power vs difficulty)
- Allows starting expedition with full team
- Celebrates: "Your team is ready!"

Notes:
- Team composition is strategic element
- Don't explain synergies yet (too complex)
- Efficiency system introduced but not deep-dived
```

### US-OB-015: First Monster Capture (Phase 2 Teaser)
```
As a new player, I want to capture my first monster during an expedition, so that I understand the dungeon building system teaser.

Acceptance Criteria:
- Tutorial triggers 30-60 minutes into gameplay
- Expedition configured to guarantee capture
- Capture notification: "Monster Captured!"
- Monster added to collection with fanfare
- Brief explanation: "Monsters power your dungeons..."
- Teaser: "Dungeon building unlocks soon!"
- Monster viewable in collection

Notes:
- Phase 2 feature, but introduce concept early
- First capture should feel exciting
- Don't overwhelm with dungeon details yet
```

### US-OB-016: First Schematic and Dungeon Build
```
As a new player, I want to build my first dungeon after getting a schematic, so that I experience the core differentiator.

Acceptance Criteria:
- Triggers after first monster capture + schematic drop
- Guides through dungeon builder step-by-step
- Simple schematic (2 slots, easy requirements)
- Places captured monster in slot
- Shows reward preview
- Activates dungeon with confirmation
- Celebration: "Your first dungeon is ready to farm!"

Notes:
- This is the "aha!" moment—dungeon building is unique
- Tutorial dungeon should be satisfying to complete
- Keep first schematic very simple
```

### US-OB-017: First Dungeon Run Completion
```
As a new player, I want to complete my first dungeon run, so that I understand targeted farming.

Acceptance Criteria:
- Tutorial sends heroes to newly built dungeon
- Dungeon run completes (expedited for tutorial)
- Shows loot from player's dungeon
- Explains: "Monsters determine what loot drops!"
- Highlights loot came from placed monsters
- Points to monster loot tables
- Completes dungeon tutorial arc

Notes:
- Connects the full loop: capture → build → farm
- Player should feel clever for building their dungeon
- Sets up long-term goal: "Build better dungeons for better loot"
```

---

## 4. Early Game Guidance

### US-OB-018: Contextual Tooltips
```
As a new player, I want helpful tooltips when I encounter new features, so that I understand systems as I discover them.

Acceptance Criteria:
- Tooltips appear on first encounter with new UI elements
- Explain feature in 1-2 sentences
- "Got it" button to dismiss
- "Don't show again" option per tooltip type
- Tooltips don't repeat after dismissal
- Can re-enable all tooltips in settings
- Tooltips styled consistently (not intrusive)

Notes:
- Progressive disclosure—learn as you play
- Track shown tooltips in useOnboardingStore
- Mobile: tooltips should be tap-friendly
```

### US-OB-019: Suggested Next Actions
```
As a new player, I want suggestions for what to do next, so that I always have a clear goal.

Acceptance Criteria:
- "Suggested Actions" panel in main UI (collapsible)
- Shows 1-3 recommended actions based on game state
- Examples: "Recruit another hero", "Start an expedition", "Equip your new gear"
- Clicking suggestion navigates to relevant screen
- Suggestions update as actions complete
- Can dismiss panel permanently
- Returns after inactivity (optional)

Notes:
- Prevents "what do I do now?" moments
- Prioritize actions that advance progression
- Phase 2+: More sophisticated recommendations
```

### US-OB-020: Progress Milestone Celebrations
```
As a new player, I want to be celebrated when I hit milestones, so that I feel a sense of achievement.

Acceptance Criteria:
- Milestones: First hero level 5, First rare drop, First zone unlock, etc.
- Celebration modal with fanfare animation
- Shows what was achieved and reward granted
- Rewards: small gold/gem bonuses
- Milestone tracked in achievements (if system exists)
- Can share milestone (future social feature)

Notes:
- Positive reinforcement encourages continued play
- Don't overdo it—reserve for meaningful moments
- Animations should be satisfying but brief
```

### US-OB-021: Integrated Help Menu
```
As any player, I want access to a help menu, so that I can look up information about game systems.

Acceptance Criteria:
- Help icon accessible from main navigation
- Searchable help topics (traits, expeditions, dungeons, etc.)
- Each topic has clear explanation with examples
- Links to relevant game screens where applicable
- FAQ section for common questions
- Contact/feedback option
- Help content matches current game version

Notes:
- Written in lighthearted tone (consistent with game)
- Consider contextual help (help icon on each screen)
- Update help content with each release
```

### US-OB-022: Optional Hint System
```
As a stuck player, I want optional hints, so that I can get unstuck without spoiling everything.

Acceptance Criteria:
- "Need a hint?" prompt after extended inactivity (5+ mins on same screen)
- Hints are context-specific (stuck recruiting? hint about gold)
- Can disable hint prompts in settings
- Hints don't reveal everything (nudge, not solve)
- Hints feel in-character (guild advisor speaking)
- Track hint usage for analytics

Notes:
- Safety net for confused players
- Don't make hints feel like failure
- Consider hint character/persona for flavor
```

---

## 5. Returning Player Experience

### US-OB-023: Welcome Back with Offline Progress
```
As a returning player, I want to see what happened while I was away, so that I can quickly catch up.

Acceptance Criteria:
- "Welcome Back!" modal on login
- Summary: Time away, expeditions completed, resources earned
- Shows offline expedition results
- Shows passive income collected
- Highlights any exceptional rewards
- "Collect All" button for batch collection
- Can dismiss and view details later

Notes:
- Makes returning feel rewarding
- Calculate offline progress server-side (anti-cheat)
- Cap offline progress (24-48 hour max accumulation)
```

### US-OB-024: Expedition Completion Notifications
```
As a returning player, I want to know which expeditions completed while I was away, so that I can collect rewards.

Acceptance Criteria:
- Push notification when expedition completes (if enabled)
- In-game notification badge shows pending completions
- List of completed expeditions with rewards preview
- Can collect individually or batch collect
- Expedition logs preserved for reading
- Clear visual distinction between collected/uncollected

Notes:
- Push notifications require permission request
- Consider browser notifications and mobile PWA
- Don't spam notifications (batch if multiple complete simultaneously)
```

### US-OB-025: New Features Announcement
```
As a returning player after an update, I want to see what's new, so that I can explore new features.

Acceptance Criteria:
- "What's New" modal on first login after update
- Highlights 2-3 major changes/additions
- Links to new features in-game
- "Learn More" button for detailed patch notes
- Can dismiss and access later from settings
- Shows version number

Notes:
- Keep announcements brief and exciting
- Don't show for minor patches (only significant updates)
- Track last-seen version in player profile
```

### US-OB-026: Daily Login Rewards
```
As a regular player, I want daily login rewards, so that I'm incentivized to play regularly.

Acceptance Criteria:
- Login calendar shows 7-day reward cycle
- Day 1-6: Small rewards (gold, gems, materials)
- Day 7: Larger reward (premium currency, rare item, trait token)
- Streak bonus for consecutive days
- Missed day resets streak (or 1-day grace period)
- Rewards scale with account level (optional)
- Claim reward on first login each day

Notes:
- Not mandatory for progression (avoid FOMO)
- Rewards are nice bonuses, not required
- Consider "catch-up" mechanic for missed days
```

### US-OB-027: Data Recovery Guidance
```
As a player who lost local data, I want guidance on recovery, so that I don't permanently lose progress.

Acceptance Criteria:
- Detect if returning player has no local data but cookies exist
- Prompt: "Welcome back! Log in to restore your progress"
- If guest: Warning that local data may be lost
- Link to support if account issues
- Clear messaging about cloud saves
- Encourage account creation for guests

Notes:
- Edge case but critical for trust
- Cloud saves (accounts) are the solution
- Guest data loss should prompt account creation
```

---

## Summary

### Coverage Breakdown
- **Account Creation & Login:** 5 stories
- **First Launch Experience:** 4 stories
- **Tutorial Flow:** 8 stories
- **Early Game Guidance:** 5 stories
- **Returning Player Experience:** 5 stories

### Implementation Priority

**Phase 1 (MVP Critical):**
- US-OB-001 to US-OB-003 (Account basics)
- US-OB-006 to US-OB-008 (First launch)
- US-OB-010 to US-OB-014 (Core tutorial)

**Phase 2 (Dungeon Tutorial):**
- US-OB-015 to US-OB-017 (Monster/dungeon intro)

**Phase 3 (Polish):**
- US-OB-018 to US-OB-022 (Guidance systems)
- US-OB-023 to US-OB-027 (Returning players)

**Phase 4 (Nice-to-Have):**
- US-OB-004, US-OB-005 (Account recovery)
- US-OB-009 (Guild naming)
- US-OB-026 (Daily rewards)
