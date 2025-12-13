# Design Decisions - Dungeon Farmers

**Rationale behind core design choices**

---

## 🎯 Foundational Decisions

### Decision 1: Web-First (Not Mobile-First)

**Choice:** Build for web browsers first, with PWA support. Mobile/Steam later.

**Rationale:**
- **Faster iteration** - Web deployment is instant, no app store approvals
- **Lower barrier** - Players access via URL, no download required
- **Cross-platform** - Works on desktop/tablet/mobile browsers
- **Developer velocity** - Vue/Nuxt ecosystem for rapid development

**Trade-off:** Mobile-first games get more downloads, but web-first allows faster MVP validation.

---

### Decision 2: Pay-Once ($9.99) Not Free-to-Play

**Choice:** Free demo → $9.99 premium unlock, cosmetics optional

**Rationale:**
- **Player research** - Exhausted gacha players want fair monetization
- **Differentiation** - Stand out in saturated F2P market
- **Sustainable** - Predictable revenue, not chasing whales
- **Community** - No F2P vs whale divide

**Trade-off:** Lower download numbers, but higher player satisfaction and retention.

---

### Decision 3: No Failure States (Efficiency Variance)

**Choice:** All expeditions succeed, performance affects rewards (60-100%+)

**Rationale:**
- **Respect time** - Never waste 30-60 minutes with zero rewards
- **Reduce frustration** - Always progress, just slower if underprepared
- **Encourage experimentation** - Try team comps without harsh punishment

**Trade-off:** Less "risk/reward" tension, but dramatically better time respect.

---

### Decision 4: Personal Dungeons (Unique Differentiator)

**Choice:** Players capture monsters and build personal farming dungeons

**Rationale:**
- **Content loop** - Solves "content starvation" problem
- **Player agency** - Creative expression through dungeon building
- **Strategic depth** - Monster assignment optimization
- **Unique** - No other idle RPG has this exact mechanic

**Trade-off:** More complex system to implement, but creates lasting engagement.

---

### Decision 5: Automated Combat (Not Manual)

**Choice:** Combat is automated, strategy is team composition and preparation

**Rationale:**
- **Idle game genre** - Players want hands-off gameplay
- **Respect time** - No need to actively play during expeditions
- **Offline progress** - Expeditions continue while logged out
- **Strategic focus** - Depth comes from preparation, not twitch reflexes

**Trade-off:** Less "action" gameplay, but better fits idle RPG audience.

---

## 🎭 Tone & Setting Decisions

### Decision 6: Corporate Satire Tone

**Choice:** "Office Space meets D&D" - serious gameplay, dry self-aware humor

**Rationale:**
- **Differentiation** - Most idle RPGs are serious or cutesy
- **Adult audience** - Appeals to working professionals
- **Memorable** - Unique voice in crowded market
- **Replayability** - Humor adds personality to repetitive tasks

**Examples:**
- Heroes are "employees" on "business trips"
- Expeditions are "assignments" with "expense reports"
- Guild management = corporate middle management

---

### Decision 7: No Gacha/Summoning

**Choice:** Hero recruitment with in-game gold, randomized traits for variety

**Rationale:**
- **Player research** - Gacha fatigue is REAL
- **Fair progression** - No duplicate requirement trap
- **Variety** - Randomized traits = every hero unique
- **Ethical** - No gambling mechanics

**Trade-off:** Lower monetization ceiling, but ethical and sustainable.

---

## ⚖️ Balance Decisions

### Decision 8: Equipment = 30-40% of Power

**Choice:** Equipment provides significant but not overwhelming power contribution

**Rationale:**
- **Progression visible** - Equipment upgrades feel meaningful
- **Hero stats matter** - Can't overcome bad heroes with just gear
- **Long-term goals** - Equipment sets provide endgame chase

**Trade-off:** Equipment farming is important but not THE ONLY thing that matters.

---

### Decision 9: No Energy Systems

**Choice:** Players can play as much or as little as they want

**Rationale:**
- **Player research** - Energy systems are HATED
- **Respect time** - Play on YOUR schedule
- **Reduce FOMO** - No "must log in every 4 hours"

**Trade-off:** Can't monetize "energy refills", but creates goodwill.

---

### Decision 10: Alliance Raids 3-5 Players (Not Full Alliance)

**Choice:** Raids require small groups, not entire 30-member alliance

**Rationale:**
- **Scheduling** - Easier to coordinate 3-5 people than 30
- **Inclusivity** - Multiple groups can raid simultaneously
- **Social bonds** - Smaller groups build stronger friendships

**Trade-off:** Less "epic scale" feeling, but dramatically better UX.

---

## 🔄 Progression Decisions

### Decision 11: Linear Zone Unlocking

**Choice:** Zones unlock in sequence (1→2→3...) not all at once

**Rationale:**
- **Onboarding** - Gradual complexity introduction
- **Progression feeling** - Constant unlocks = always something new
- **Balance** - Can't skip to endgame zones immediately

**Trade-off:** Less "open world" freedom, but clearer progression path.

---

### Decision 12: Durability (Not Time-Limited) Personal Dungeons

**Choice:** Dungeons use durability (number of runs), not time expiration

**Rationale:**
- **Player control** - Farm at YOUR pace
- **No FOMO** - Dungeons don't expire after 24 hours
- **Respect time** - Can save dungeons for when you need resources

**Trade-off:** Slightly less urgency, but dramatically better time respect.

---

### Decision 13: Hero Ascension Resets Level to 1

**Choice:** Ascension provides +50% stat growth but resets hero to Level 1

**Rationale:**
- **Prestige loop** - Long-term progression goal
- **Risk/reward** - Temporary power loss for long-term gain
- **Strategic timing** - Choose WHEN to ascend

**Trade-off:** Can feel punishing short-term, but creates engaging long-term decision.

---

## 🎨 UI/UX Decisions

### Decision 14: Power Rating (Single Number)

**Choice:** Heroes have single "Power" number instead of complex stat display

**Rationale:**
- **Simplicity** - Easy comparison at a glance
- **Clarity** - "Need 500 Power for this zone" is clear
- **Onboarding** - New players understand immediately

**Trade-off:** Less stat granularity visible, but better UX.

---

### Decision 15: Tag System (WoW Garrison-Inspired)

**Choice:** Heroes have 1-2 tags for mission requirements

**Rationale:**
- **Proven mechanic** - WoW Garrison missions worked well
- **Strategic roster** - Encourages diverse hero collection
- **Content gating** - Requires specific tags for specific content

**Trade-off:** Adds complexity, but creates meaningful strategic depth.

---

## 🌍 Platform Decisions

### Decision 16: Web → PWA → Steam → Mobile

**Choice:** Launch on web, then expand to other platforms

**Rationale:**
- **Validation** - Prove concept on web before expensive platform ports
- **Iteration speed** - Web allows instant updates
- **Market research** - Learn what players want before mobile launch

**Trade-off:** Smaller initial audience, but better validation and iteration.

---

## 🎯 Success Metrics Decision

### Decision 17: Player-Centric Metrics (Not Revenue-Centric)

**Choice:** Measure success by satisfaction (4.5+ stars), retention (40%+ D30), community health

**Rationale:**
- **Sustainable** - Happy players recommend game
- **Ethical** - Not chasing revenue extraction
- **Long-term** - Build reputation, not quick cash

**Trade-off:** Won't top revenue charts, but creates lasting business.

---

## 🔮 Future-Proofing Decisions

### Decision 18: Modular Content System

**Choice:** Zones, monsters, schematics designed as data-driven content

**Rationale:**
- **Expansion** - Easy to add new zones/monsters/schematics
- **Events** - Seasonal content can reuse systems
- **Community** - Potential for user-generated content later

**Trade-off:** More upfront system design, but easier long-term expansion.

---

## 📋 Design Principles Summary

**Every decision filtered through:**
1. **Does this respect player time?**
2. **Is this fair to all players?**
3. **Does this add strategic depth?**
4. **Would we want to play this ourselves?**

**Red Lines (Never Compromise):**
- ❌ Energy systems
- ❌ VIP tiers
- ❌ Pay-to-win
- ❌ Required duplicates
- ❌ Time-limited exclusive power
- ❌ Complete failure states

**The Vision:** Build the idle RPG that exhausted gacha players are begging for - fair, strategic, creative, and respectful of time and money.

---

## ⭐ North Star Checklist (Manifest-aligned)

**Purpose**: A quick, consistent “should this exist?” filter for *every* feature, economy tweak, UI screen, and content addition.

### 1) Motif Przewodni (Theme) — the master filter

**Our motif**: **“The idle RPG that respects your time and wallet.”**

- **Keep it** if it strengthens the motif.
- **Cut or redesign it** if it introduces pressure, confusion, regret, or wallet/time extraction.

**Pass/fail questions**
- **Time**: Does this reduce wasted time (or at least avoid adding it)?
- **Wallet**: Does this avoid power being sold or “convenience” being monetized?
- **Trust**: Would a burned gacha player see this and think “this is fair”?

### 2) Experience-first (not feature-first)

**Define the intended player feeling** before implementation.

For Dungeon Farmers, the default target feelings are:
- **Respected** (no “gotcha” outcomes, no punishment for stepping away)
- **In control** (clear choices, reversible decisions where reasonable)
- **Clever** (optimization is rewarded, not mandatory)
- **Amused** (parody supports clarity/trust, doesn’t undermine it)
- **Satisfied** (visible progress every session, no dead ends)

**Pass/fail questions**
- What is the primary emotion this feature is supposed to create?
- If the player only uses this for 5–10 minutes/day, does it still feel good?
- If the player plays 60+ minutes, does it deepen mastery instead of just adding chores?

### 3) Elemental Tetrad alignment (Mechanics / Fabuła / Estetyka / Technologia)

All four pillars must reinforce each other (no “cool system” that fights the UI, tone, or tech reality).

**Pass/fail questions**
- **Mechanics**: Does it create meaningful choices (not busywork)?
- **Fabuła/Tone**: Does the humor/tone reinforce fairness + agency (not cynicism)?
- **Estetyka/UI**: Does it simplify decisions and reduce cognitive load?
- **Technologia**: Can it be fast, reliable, and legible (offline progress, clear math, no jank)?

### 4) Design the essence, not realism

We simulate the *feeling* of running a smart guild operation—not a realistic world.

**Pass/fail questions**
- Does this add “management satisfaction” (tight loops, clear deltas, clean dashboards)?
- Can we convey the same feeling with fewer steps, fewer screens, or clearer feedback?

### 5) Invisible hand guidance (Indirect Control)

We guide players with constraints, goals, interface clarity, and “good defaults”—not with FOMO or punishment.

**Pass/fail questions**
- Are we guiding through **schematic requirements / goals / UI signposting** rather than scarcity timers?
- Does the player always know “what should I do next?” without a tutorial wall?

### 6) Iteration is discovery (Zasada Pętli)

Assume we’ll be wrong on first pass for: capture rate, durability, efficiency variance, costs, drops, and pacing.

**Pass/fail questions**
- Can we test this quickly as a “toy” (minimal version) before expanding it?
- Do we have the knobs to tune it without reworking the whole system?

### 7) Ethics: experiences change players

We do not build systems that train compulsive checking/spending or exploit sunk cost.

**Hard fails**
- Adds FOMO pressure (“log in or lose it”)
- Sells power or sells relief from friction we created
- Uses gambling-like reinforcement loops for monetization
- Creates “failure = zero progress” outcomes for long timers

**Design Decisions document provides the "why" behind every major choice, creating a north star for development and ensuring all future decisions align with core principles.**
