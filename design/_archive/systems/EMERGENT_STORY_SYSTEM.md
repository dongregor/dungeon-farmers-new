# Emergent Story System - Dungeon Farmers

**Gaming parody + character drama (with optional corporate-formatted summaries)**

---

## 🎯 Core Philosophy

**Problem**: Traditional idle RPGs have fixed, linear stories that players consume once and forget.

**Solution**: Dwarf Fortress/Rimworld-inspired emergent narrative where hero traits, expedition outcomes, and random events create unique, memorable stories for each player.

**Key Principle**: Stories aren't written — they're **generated from system interactions** (traits + personality + outcomes + RNG) and presented in a **player-facing story feed**.

**Corporate flavor is seasoning**: you *may* render the same story feed as “incident reports” / “HR summaries” as an optional UI style, but the default narrative voice is gaming parody + character.

---

## 🧩 System Architecture

### The Three Pillars of Emergent Narrative

**1. Hero Personality System** - Traits + personality dimensions + morale create behavioral patterns
**2. Event Generator** - Random encounters during expeditions
**3. Story Logger** - Transforms mechanical outcomes into shareable narratives (default: gaming parody/character; optional: corporate memo format)

These three systems interact to create unique, player-specific stories that feel personal and memorable.

**Integration Note**: This system integrates with the **[Personality System](HERO_SYSTEM.md#-personality-system-phase-2)** (5 personality dimensions) and **[Morale/Happiness System](HERO_SYSTEM.md#-moralehappiness-system-phase-2)** from HERO_SYSTEM.md to generate events based on personality scores (0-10) and morale states (0-100).

---

## 👤 Hero Personality System

### Personality Foundation (Phase 2+)

Heroes are built on **three interconnected layers** that drive emergent narratives:

**Layer 1: Personality Dimensions** (0-10 scale on 5 axes)
- **Sociability** (Loner ↔ Social Butterfly) - Affects social events and party size preferences
- **Work Ethic** (Relaxed ↔ Workaholic) - Affects mission frequency tolerance and productivity events
- **Risk Tolerance** (Cautious ↔ Thrill-Seeker) - Affects high-risk mission events and danger responses
- **Competitiveness** (Team Player ↔ Solo Glory) - Affects rivalry events and team dynamics
- **Seriousness** (Goofy ↔ Professional) - Affects story event tone (humor vs formal)

**Layer 2: Morale State** (0-100 scale)
- **Inspired (85-100)**: +15% stats, volunteers for missions, generates enthusiastic events
- **Content (60-84)**: Normal performance, balanced story events
- **Neutral (35-59)**: No bonuses/penalties, mundane events
- **Stressed (15-34)**: -10% stats, generates complaint/warning events
- **Burnout (0-14)**: -25% stats, refuses missions, generates crisis events

**Layer 3: Traits** (from HERO_SYSTEM.md)
- Quirky personality modifiers that create memorable interactions
- Work synergistically with personality dimensions and morale
- Drive specific event triggers and outcomes

These layers combine to determine event probabilities and story outcomes. Presentation can vary (default: character + gaming parody; optional: corporate UI wrapper).

### Trait-Driven Behaviors

Heroes have **traits** that influence expedition outcomes and event interactions:

**Social Traits**:
- **Team Player** - Bonuses when with 3+ heroes, chance of "helped teammate" events
- **Lone Wolf** - Bonuses when solo, chance of "refused assistance" events
- **Natural Leader** - Increases team morale, chance of "rallied the team" events
- **Social Media Star** - Documents expeditions, creates "viral moment" events

**Work Ethic Traits**:
- **Workaholic** - Faster expeditions, chance of "burnout" events
- **Procrastinator** - Slower start, chance of "last minute heroics" events
- **Coffee Addict** - Morning expeditions faster, evening expeditions slower
- **Perfectionist** - Higher quality rewards, chance of "delayed by details" events

**Personality Traits**:
- **Coward** - Flees from tough fights, survives dangerous situations
- **Brave** - Fights harder against bosses, chance of "heroic stand" events
- **Greedy** - Finds more gold, chance of "treasure dispute" events
- **Generous** - Shares loot, creates "team morale boost" events

**Quirks**:
- **Plant Whisperer** - Bonuses in forest zones, creates "befriended enemy" events
- **Dragon Enthusiast** - Excited for dragon fights, creates "fan moment" events
- **Complainer** - Random negative events, but team adapts and grows stronger
- **Optimist** - Reduces negative event severity

### Behavioral Patterns

**Example: "Team Player" + "Coffee Addict" + "Optimist"**

**Morning Expedition (8am start):**
> "Sarah (Ranger) arrived early with coffee for the team. Morale increased by 15%. Expedition efficiency: +10%."

**Afternoon Expedition (2pm start):**
> "Sarah (Ranger) energetically coordinated team positioning during goblin encounter. Team avoided 3 injuries. Gold bonus: +25%."

**Late Night Expedition (11pm start):**
> "Sarah (Ranger) struggled to maintain focus but kept team spirits high despite fatigue. Expedition time: +15% (slower), Team morale: Maintained."

---

## 🎲 Event Generator System

### Event Categories

**1. EXPEDITION EVENTS** - Occur during missions
**2. RELATIONSHIP EVENTS** - Hero interactions
**3. WORLD EVENTS** - Affect entire guild
**4. PERSONAL EVENTS** - Individual hero stories

### Event Structure

Each event has:
- **Trigger Conditions** - When it can happen
- **Trait Modifiers** - How hero traits affect it
- **Outcomes** - Mechanical + narrative results
- **Presentation Style** - Default: short, funny, character-forward log line; Optional: “incident report” formatting for system screens

---

### Expedition Event Examples

#### EVENT: "Shortcut Discovery"

**Trigger**: Any expedition, 15% chance in familiar zones
**Trait Modifiers**:
- **Explorer** trait: +10% chance, better shortcuts
- **Cautious** trait: -5% chance (avoids risks)
- **Procrastinator** trait: +20% chance (looking for time savers)

**Outcomes**:
- **Success**: Expedition time -20%, Small gold bonus
- **Failure**: Expedition time +10% (got lost)

**Default Voice**:
✅ Success:
> "#2847: Marcus (Tank) found a shortcut. -20% duration. +200% smugness."

❌ Failure:
> "#2848: Marcus tried to 'optimize' the route and got everyone lost. +10% duration. The map is now a sensitive topic."

---

#### EVENT: "Monster Negotiation"

**Trigger**: Any combat encounter, 5% base chance
**Trait Modifiers**:
- **Charismatic** trait: +10% chance, better deals
- **Intimidating** trait: +5% chance, different outcome
- **Plant Whisperer** trait: +20% chance in forest zones
- **Coward** trait: +15% chance (tries talking first)

**Outcomes**:
- **Peaceful Resolution**: No combat, less loot, but faster + morale boost
- **Better Deal**: Monsters join as allies (bonus monster capture)
- **Negotiation Failed**: Combat as normal, morale penalty

**Default Voice**:
✅ Peaceful Resolution:
> "#3012: Lyra (Healer) talked it out with the goblins. No fight, less loot, more peace. Time saved."

✅ Better Deal:
> "#3013: Thrain (Tank) came back with a goblin ally. Nobody trusts it. Everyone wants it for their dungeon."

❌ Failed:
> "#3014: Grimnar tried diplomacy and turned it into an argument about 'compensation.' Negotiations detonated into combat."

---

#### EVENT: "Equipment Malfunction"

**Trigger**: Any expedition, 8% chance
**Trait Modifiers**:
- **Perfectionist** trait: -5% chance (maintains gear better)
- **Reckless** trait: +5% chance (rough on equipment)
- **Prepared** trait: Negates negative effects (brought spares)

**Outcomes**:
- **Minor Issue**: -5% efficiency, easy fix
- **Major Problem**: -15% efficiency, equipment damaged
- **Critical Failure**: Expedition delayed, needs replacement

**Default Voice**:
✅ Minor (Perfectionist):
> "#4421: Sarah noticed her bowstring was fraying and fixed it before it snapped. Zero downtime. Maximum smugness."

❌ Major (Reckless):
> "#4422: Boris used his shield like a chair/weapon/door (unclear). Repair bill: 50 Gold. Boris refuses to elaborate."

✅ Critical + Prepared:
> "#4423: Morrigan's staff exploded (again). She packed a backup because she’s learned. Expedition continues with only mild screaming."

---

### Relationship Event Examples

#### EVENT: "Lunchroom Argument"

**Trigger**: Two heroes in guild hall, 5% daily chance
**Trait Modifiers**:
- **Complainer** + **Workaholic**: +20% chance
- **Team Player** + **Generous**: -10% chance (mediates)
- **Social Media Star**: Creates "viral drama" variant

**Outcomes**:
- **Resolved**: Small temporary morale hit, then bonus (team bonding)
- **Escalated**: Heroes refuse to work together for 24 hours
- **Viral Drama**: Alliance chat gets involved, creates alliance-wide event

**Default Voice**:
✅ Resolved:
> "#5129: Thrain and Grimnar argued about dragon-slaying like it was a forum thread. Luna forced them into a joint run. They came back less mad. Wild."

❌ Escalated:
> "#5130: Sarah and Marcus fought over boss-kill credit. They refuse to party together for 24 hours. Petty, but effective."

⚡ Viral Drama:
> "#5131: Sylvana live-streamed Boris and Morrigan arguing about buff rotations. It went viral. Alliance chat is now a disaster zone."

---

#### EVENT: "Workplace Romance"

**Trigger**: Two heroes on multiple expeditions together, 3% chance per shared mission
**Trait Modifiers**:
- **Charismatic** trait: +5% chance
- **Lone Wolf** trait: -10% chance
- **Social Media Star**: Creates "relationship announcement" variant

**Outcomes**:
- **Dating**: Heroes request same shifts, slight efficiency bonus when together
- **Breakup**: (rare follow-up event) Heroes avoid each other, temporary morale penalty
- **Guild Power Couple**: Long-term relationship, permanent team bonus

**Default Voice**:
✅ Dating:
> "#6241: Luna and Marcus are dating. +small synergy when together. -everyone’s tolerance for PDA."

❌ Breakup (Follow-up):
> "#6242: Luna and Marcus broke up. They refuse to run together for a while. Morale: -10. Drama: +999."

⚡ Power Couple:
> "#6243: Sarah and Thrain are disgustingly in sync. Efficiency: +15% together. The rest of the guild is impressed and nauseous."

---

### World Event Examples

#### EVENT: "Dragon Migration"

**Trigger**: Monthly random event, affects all dragon-related content
**Duration**: 3-7 days

**Outcomes**:
- **Dragon zones**: +50% dragon spawns, +25% dragon loot
- **Non-dragon zones**: Peaceful period, faster expeditions

**Default Voice**:
> "Dragons are migrating. Dragon zones: +50% spawns, +25% loot. Non-dragon zones: suspiciously peaceful. Enjoy it while it lasts."

---

#### EVENT: "Guild Inspection"

**Trigger**: Every 2 weeks, player above Level 15
**Outcome**: Based on guild performance (hero levels, equipment quality, dungeon count)

**Default Voice**:
✅ Good Performance:
> "Your guild is thriving. The gear is solid, the farms are humming, and nobody has threatened to unionize this week. Bonus: +500 Gold."

⚠️ Average Performance:
> "You’re doing… fine. The guild hall is messy, the gear is mid, and morale is wobbly. Consider: training, upgrades, and fewer goblin zones for a day."

❌ Poor Performance:
> "Everything is on fire. Heroes are undergeared, morale is tanking, and your dungeons are basically haunted closets. Time for a recovery week: rest + upgrades + safer expeditions."

---

### Personal Event Examples

#### EVENT: "Hero Birthday"

**Trigger**: Random, 1-2% chance per hero per week
**Trait Modifiers**:
- **Social Media Star**: Creates guild-wide celebration event
- **Lone Wolf**: Prefers quiet acknowledgment

**Outcomes**:
- Small morale bonus for entire guild
- Hero gets temporary stat bonus (feeling appreciated)

**Default Voice**:
✅ Standard:
> "It’s Thrain’s guild anniversary. Someone produced cake. Thrain pretended not to care. He cared. +10% efficiency for 24h."

⚡ Social Media Star:
> "Sylvana turned her anniversary into a live-stream. It was cringe. It was beautiful. Guild morale: +20%. The alliance now knows your whole business."

---

#### EVENT: "Skill Breakthrough"

**Trigger**: After using same hero 50+ times in specific role
**Outcome**: Hero unlocks new ability or significant stat bonus

**Default Voice**:
> "Morrigan had a breakthrough. New skill unlocked: Chain Lightning. She insists it was 'planned.' It wasn’t. Expedition rewards: +15% (because she’s feeling herself)."

---

### Morale-Driven Event Examples (Phase 2+)

These events trigger based on hero morale states, creating dynamic narratives around employee wellbeing.

#### EVENT: "Inspired Performance"

**Trigger**: Hero in Inspired state (85-100 morale), 20% chance per expedition
**Personality Modifiers**:
- **High Work Ethic (8-10)**: +15% chance (loves exceeding expectations)
- **High Competitiveness (8-10)**: +10% chance (wants to prove superiority)
- **High Seriousness (8-10)**: Professional framing, efficiency focus

**Outcomes**:
- **Exceptional Results**: +20% expedition rewards, chance of skill breakthrough
- **Inspires Team**: +10 morale to entire party
- **Volunteer for Harder Content**: Hero requests challenging assignments

**Default Voice**:
✅ Exceptional Performance:
> "Thrain went absolutely feral today. Efficiency: 142%. He asked for *more* dragons. Someone hide the quest board."

⚡ Team Inspiration (High Sociability):
> "Sarah’s hype was contagious. Party morale: +10. She’s one pep talk away from becoming the accidental leader."

---

#### EVENT: "Stress Warning Signs"

**Trigger**: Hero in Stressed state (15-34 morale), 25% chance per expedition
**Personality Modifiers**:
- **Low Work Ethic (0-3)**: +20% chance (less stress tolerance)
- **High Competitiveness (8-10)**: Creates "failure frustration" variant
- **High Seriousness (8-10)**: Professional complaint, data-driven

**Outcomes**:
- **Performance Decline**: -15% expedition efficiency
- **Complaint Event**: Hero vents frustration (personality determines tone)
- **Rest Request**: Hero asks for break (if ignored, morale drops faster)

**Default Voice**:
⚠️ Professional Complaint (High Seriousness):
> "Morrigan filed a formal complaint about being overworked. It’s a scroll. It’s 47 pages. Efficiency: -15% until you let her rest."

⚠️ Frustrated Outburst (Low Seriousness):
> "Boris snapped: 'If I see another goblin, I’m joining them.' Morale is low. Rotate zones or give him a snack."

⚠️ Competitive Frustration:
> "Grimnar isn’t top damage anymore and is taking it personally. Morale: -10. Give him better gear or give him a rival to bully."

---

#### EVENT: "Burnout Crisis"

**Trigger**: Hero reaches Burnout state (0-14 morale), GUARANTEED event
**Personality Modifiers**:
- **High Work Ethic**: Creates "workaholic collapse" narrative
- **High Sociability**: Seeks team support
- **Low Sociability**: Silent withdrawal

**Outcomes**:
- **Mission Refusal**: Hero CANNOT be assigned until morale >35
- **Guild Impact**: -5% morale to other heroes who worked closely with them
- **Recovery Protocol**: Player MUST take action (rest, motivational speech, equipment gift)

**Default Voice**:
🚨 Workaholic Collapse:
> "Marcus hit burnout after being spammed into 18 missions. He refuses to move. Pull him off the roster and let him rest."

🚨 Social Withdrawal (Low Sociability):
> "Sylvana shut down and won’t take missions. Last words: 'Leave me alone.' Give her space and a solo run later."

🚨 Team Support Request (High Sociability):
> "Luna burned out and asked for help. The party actually showed up for her. Recovery is faster when friends do friend things."

---

#### EVENT: "Morale Milestone"

**Trigger**: Hero reaches specific morale thresholds (25→50, 50→75, 75→90)
**Personality Modifiers**: Determines celebration style

**Outcomes**:
- **Recovery Celebration**: Guild acknowledges improvement
- **Temporary Stat Bonus**: +5-10% stats for 24h (feeling validated)
- **Story Event**: Personality-appropriate celebration

**Default Voice (Gaming Parody / Character)**:
✅ Professional Milestone (High Seriousness):
> "Marcus (Tank) is back to normal. He wrote a 47‑page recovery plan and taped it to the guild wall. Morale: 28 → 65. Nobody read it. Everyone is proud anyway."

✅ Goofy Celebration (Low Seriousness):
> "Boris (Support) recovered and immediately yelled: 'WHO WANTS GOBLINS?!' He is a danger to himself and a gift to the guild. Morale contagion: Positive."

---

## 📖 Story Logger - Story Feed (Corporate Format Optional)

### How Stories Are Presented

All emergent narrative is shown in a **story feed** with character-forward, gaming-parody language. Some screens can optionally render the same entries in a dry “corporate memo” format (system UI seasoning).

**1. Live Story Feed** - Events during expeditions
**2. Daily Summary** - End-of-day wrap-up (optionally export as “HR summary”)
**3. Weekly Highlights** - Memorable moments + stats (optionally “performance review” skin)
**4. Guild History Log** - Player’s story archive

---

### Daily Summary Example (Default Voice)

**End of Day Summary (Day 15)**

> **DAILY SUMMARY - Day 15**
>
> **NOTABLE INCIDENTS:**
>
> **#2891** - Sarah (Ranger) found a shortcut through Whispering Woods. +20% efficiency. She will mention this forever.
>
> **#2892** - Thrain (Tank) and Grimnar (Melee DPS) argued about dragon-slaying “best practices.” They got over it mid-fight. Loot: +500 Gold.
>
> **#2893** - Luna (Healer) talked a goblin down and somehow recruited it. Nobody understands how. Morale: +10.
>
> **NOTES:**
> - Guild morale: High (+15%)
> - Team cohesion: Improving
> - Productivity: Above targets
>
> **RECOMMENDED ACTIONS:**
> - Schedule mandatory team building (Alliance Raid recommended)
> - Review Sarah's route optimization suggestions
> - Prepare birthday celebration for Marcus (Tank) - tomorrow
>
> _End of Daily Summary. (Optional: view this in “HR Mode” if you enjoy spreadsheets.)_

---

### Weekly Performance Review Example

**Weekly Performance Review (Week 3)**

> **WEEKLY GUILD PERFORMANCE REVIEW**
>
> **Period**: Days 15-21
>
> **HIGHLIGHTS:**
>
> **🎯 Top Performer**: Sarah (Ranger)
> - Expeditions completed: 12
> - Efficiency rating: A+ (95% average)
> - Notable achievement: Discovered 2 new routes, saving guild 2.5 hours operational time
> - Commendation: Process Innovation Award
>
> **🤝 Team Spirit Award**: Luna (Healer) + Marcus (Tank)
> - Partnership synergy: +18% team efficiency
> - Zero injuries on joint expeditions
> - Morale contribution: Excellent
>
> **⚠️ Areas for Development**: Boris (Support)
> - Complaint frequency: Above average (12 incidents)
> - However: Team adapted well, morale impact minimal
> - Note: Boris's critical feedback identified 3 process improvements
>
> **📊 GUILD METRICS:**
> - Total expeditions: 47
> - Average efficiency: 78% (target: 70%)
> - Gold earned: 12,450 (target: 10,000)
> - Monster captures: 8 new species
> - Facilities constructed: 3 personal dungeons
>
> **🎉 MEMORABLE MOMENTS:**
>
> 1. **"The Dragon Negotiation"** (Day 17)
>    > Thrain (Tank) attempted to negotiate with Elder Dragon regarding territorial disputes. Negotiation failed spectacularly but created excellent training opportunity. Team learned valuable lessons about dragon diplomacy (i.e., don't).
>
> 2. **"Viral Goblin Video"** (Day 19)
>    > Sylvana (Ranger) documented a goblin middle-management meeting and posted it to the alliance feed. It hit 15K views. The goblins are furious. The guild is proud.
>
> 3. **"The Birthday Surprise"** (Day 20)
>    > Guild celebrated Marcus's (Tank) hire anniversary. Entire team wore party hats during dragon raid. Dragon reportedly confused. Mission success: 100%. Morale: Maximum.
>
> **NEXT WEEK PRIORITIES:**
> - Capitalize on team momentum with challenging content
> - Investigate Sarah's route optimization proposals
> - Monitor Boris's feedback for continued process improvements
> - Prepare for quarterly corporate inspection (Day 30)
>
> _End of Weekly Review. Excellent work, management._

---

## 🎭 Emergent Story Examples

### Example Story 1: "The Reluctant Hero"

**Setup**: Player recruits **Marcus (Tank)** with traits: **Coward**, **Procrastinator**, **Team Player**

**Event Chain**:

**Day 1 - First Expedition:**
> "Incident #101: New hire Marcus (Tank) hesitated before engaging goblin threats, citing 'inadequate hazard assessment.' Team morale: Concerned. Performance: Below expectations."

**Day 5 - Team Support Event:**
> "Incident #156: Marcus (Tank) protected teammate Sarah (Ranger) from dragon fire despite visible fear. Medical report: Minor burns, maximum courage. Team morale: Significantly improved."

**Day 12 - Breakthrough Moment:**
> "Incident #298: Marcus (Tank) voluntarily led team charge against boss encounter, citing 'can't let team down.' Performance: Exceptional. Status update: Marcus has overcome initial performance concerns. Promotion recommended."

**Player Experience**: Witnessed character growth arc from "scared new hire" to "reliable team member." Story felt personal and emergent, not scripted.

---

### Example Story 2: "The Guild Rivalry"

**Setup**: Player has **Grimnar (Melee DPS)** with **Competitive**, **Greedy**, **Lone Wolf** traits AND **Thrain (Tank)** with **Team Player**, **Generous**, **Natural Leader** traits

**Event Chain**:

**Day 3 - First Conflict:**
> "#201: Grimnar and Thrain fought over loot distribution. Grimnar wants 'performance-based rewards.' Thrain wants 'share it.' Everyone else wants them to shut up."

**Day 8 - Escalation:**
> "#267: They both volunteered for the same expedition to prove a point. Result: guild record boss kill time (2:15). Loot dispute: somehow worse."

**Day 15 - Resolution:**
> "#412: They got forced into an alliance raid together and accidentally had perfect synergy. Rivalry upgraded into competitive collaboration. (Still annoying. But effective.)"

**Player Experience**: Watched two conflicting personalities clash, compete, then ultimately work together. Created memorable guild "lore."

---

### Example Story 3: "The Social Media Disaster"

**Setup**: Player recruits **Sylvana (Ranger)** with **Social Media Star**, **Reckless**, **Optimist** traits

**Event Chain**:

**Day 2 - Viral Success:**
> "Social Media Report #88: Sylvana's dragon encounter video reached 5K views. Guild brand awareness: +25%. Alliance recruitment inquiries: +12. Marketing approves continued content creation."

**Day 6 - Controversial Post:**
> "#134: Sylvana posted an 'honest review' of an ally’s raid performance. Alliance relations: strained. Comment section: radioactive."

**Day 10 - Crisis Management:**
> "#201: Sylvana apologized and donated raid earnings to smooth things over. It worked. Barely."

**Day 20 - Redemption:**
> "#312: Sylvana’s 'Behind the Scenes: Life as an Adventurer' series hit 50K views across 20 guilds. The alliance now has rules named after her. She is insufferable about it."

**Player Experience**: Watched social media presence create both problems and opportunities. Felt like managing a real employee's online presence.

---

## 🔧 System Integration

### How Emergent Stories Affect Gameplay

**1. Morale System Integration (Phase 2+)**

**Bidirectional Feedback Loop**:
- **Events → Morale**: Story events modify hero morale based on outcomes
  - Success events: +10-25 morale (mission success, level up, equipment upgrade)
  - Social events: +5-15 morale (birthday, friendship milestone, team bonding)
  - Negative events: -10-20 morale (mission failure, equipment malfunction, personality conflict)

- **Morale → Events**: Morale states trigger specific event types
  - **Inspired (85-100)**: 20% chance for "Inspired Performance" events (+rewards, volunteers)
  - **Content (60-84)**: Normal event distribution, balanced outcomes
  - **Neutral (35-59)**: Mundane events, no special triggers
  - **Stressed (15-34)**: 25% chance for "Stress Warning" events (complaints, rest requests)
  - **Burnout (0-14)**: GUARANTEED "Burnout Crisis" event (mission refusal, recovery protocol)

**Personality-Morale Interactions**:
- **High Sociability** heroes: Morale events affect entire party (contagious)
- **High Work Ethic** heroes: Slower morale decay, faster morale gain from work
- **High Competitiveness** heroes: Morale tied to performance (top damage = +morale)
- **Low Seriousness** heroes: Humor events restore more morale (+50% effectiveness)

**Management Gameplay**:
- Players monitor hero morale through UI indicators and warning events
- Smart assignment (matching personality to content) prevents morale loss
- Rest periods, motivational speeches, equipment gifts restore morale
- Ignoring stressed heroes leads to burnout crisis (gameplay consequence)

**2. Reputation System**
- Guild's emergent stories create "reputation tags" (e.g., "Peaceful Negotiators," "Dragon Experts," "Drama-Prone")
- Reputation affects alliance recruitment, special event access

**3. Hero Development**
- Stories create "history" that unlocks new trait evolutions
- Example: "Coward" trait can evolve to "Cautious Veteran" after 20 successful expeditions

**4. Player Attachment**
- Stories create emotional connection to heroes
- Players remember "that time Marcus saved Sarah" or "the goblin video incident"

---

## 📊 Technical Implementation Notes

**Event Probability System** (Updated for Phase 2+):
```
Base Chance × Trait Modifiers × Personality Modifiers × Morale Modifiers × Zone Modifiers × Player Level Scaling = Final Probability

Example 1: "Shortcut Discovery" Event
Base: 15%
Trait: +10% (Explorer trait)
Personality: +8% (High Risk Tolerance: 8/10 = +8%)
Morale: +5% (Inspired state: 90/100)
Zone: +5% (Familiar zone, visited 10+ times)
Level: +2% (Player level 20+)
= 45% chance per expedition

Example 2: "Stress Warning" Event
Base: 25% (when in Stressed state)
Trait: +0% (no relevant traits)
Personality: +20% (Low Work Ethic: 2/10 = +20% stress chance)
Morale: GUARANTEED (Stressed state 15-34)
Zone: +0% (not zone-dependent)
Level: +0% (not level-dependent)
= 45% chance per expedition while stressed

Example 3: "Social Event" (Birthday)
Base: 2% per week
Trait: +0% (Social Media Star changes OUTCOME not chance)
Personality: +15% (High Sociability: 9/10 = +15% social event chance)
Morale: +5% (Content state: bonus for positive events)
Zone: +0%
Level: +0%
= 22% chance per week
```

**Personality Modifier Formula**:
- Each personality dimension (0-10 scale) adds/subtracts percentage based on relevance
- **Sociability**: ±(score-5)×2% for social events (range: -10% to +10%)
- **Work Ethic**: ±(score-5)×2% for productivity/stress events
- **Risk Tolerance**: ±(score-5)×1.5% for danger/discovery events
- **Competitiveness**: ±(score-5)×2% for rivalry/performance events
- **Seriousness**: Determines event TONE (0-3=goofy, 4-7=balanced, 8-10=professional)

**Morale Modifier Formula**:
- **Inspired (85-100)**: +5-10% chance for positive events, special "Inspired Performance" events unlock
- **Content (60-84)**: +0% (baseline)
- **Neutral (35-59)**: -5% for positive events (mundane period)
- **Stressed (15-34)**: +25% chance for complaint/warning events, -15% for positive events
- **Burnout (0-14)**: BLOCKS all normal events, GUARANTEES "Burnout Crisis" event

**Story Persistence**:
- All events stored in database with timestamp
- Daily/Weekly summaries auto-generated from event log
- Player can access "Guild History" to review memorable moments
- Events can be shared to alliance chat or exported

**Event Weighting**:
- Positive events: 60% of pool (keeps tone upbeat)
- Neutral events: 30% of pool (creates variety)
- Negative events: 10% of pool (creates stakes without frustration)

---

## 🎯 Design Goals

### Player Experience Goals

**1. Personal Connection**
> "I remember when Marcus was terrified of dragons, now he's our best tank."

**2. Unique Stories**
> "No two players will have the same guild history."

**3. Water Cooler Moments**
> "You won't believe what happened on my expedition today..."

**4. Replayability**
> "I want to recruit new heroes to see what stories they create."

### Narrative Goals

**1. Systemic Not Scripted**
> Stories emerge from trait + event interactions, not writer-defined arcs.

**2. Tone Consistency**
> Stories are written in gaming parody + character voice by default. Corporate formatting exists only as an optional UI skin.

**3. Meaningful Not Random**
> Events have gameplay consequences (morale, efficiency, relationships).

**4. Memorable Not Forgettable**
> Players remember stories because they affected their guild's development.

---

## ⚠️ Open Questions & Design Clarifications

❓ **[QUESTION 1]**: Should negative events (like "Equipment Malfunction") be **preventable with player skill** (proper loadout management) or **pure RNG**?
- Option A: Pure RNG (true Dwarf Fortress style, chaos is unavoidable)
- Option B: Mitigatable (player preparation reduces negative event chance)
- Option C: Hybrid (some events pure RNG, some preventable)

❓ **[QUESTION 2]**: How **persistent** should relationship events be?
- Option A: Permanent (dating heroes always get bonuses together)
- Option B: Temporary (relationships can end, creating new stories)
- Option C: Player choice (player decides if relationships are "locked in")

❓ **[QUESTION 3]**: Should emergent stories create **branching paths** for heroes (permanent trait evolution) or just **temporary states**?
- Example: "Coward" Marcus becomes "Brave" after heroic moment - permanent or temporary buff?

❓ **[QUESTION 4]**: How should **Social Media Star** trait interact with alliance systems?
- Option A: Creates cross-guild events (other players see and react)
- Option B: Guild-only (stories stay within player's guild)
- Option C: Opt-in sharing (player chooses what to share)

❓ **[QUESTION 5]**: Should particularly memorable emergent stories be **canonized** as "guild legends" with gameplay bonuses?
- Example: "The Time Marcus Saved Sarah" becomes permanent guild buff (+5% Tank+Ranger synergy)

---

## 🎉 Success Metrics

**Emergent Story System succeeds if:**

1. **Players remember hero names** (not just "my level 30 tank")
2. **Players share guild stories** in alliance chat or forums
3. **Players feel attachment** to heroes beyond stats
4. **Stories create gameplay variety** (not just flavor text)
5. **Optional corporate formatting** stays optional (system UI seasoning), while the default voice stays gaming parody + character

---

**The Emergent Story System transforms Dungeon Farmers from "yet another idle RPG" into a game where players create and remember unique guild narratives, driven by trait-based personalities and random events (default voice: character + gaming parody; optional: corporate-format summaries).**

---

## See Also

- [HERO_SYSTEM.md](HERO_SYSTEM.md) - Trait, personality, and morale systems that drive story triggers and narrative generation
  - [Personality System](HERO_SYSTEM.md#-personality-system-phase-2) - 5 personality dimensions (0-10 scale)
  - [Morale/Happiness System](HERO_SYSTEM.md#-moralehappiness-system-phase-2) - Morale states (0-100 scale) and management mechanics
- [EXPEDITION_SYSTEM.md](EXPEDITION_SYSTEM.md) - Expedition events and story contexts
