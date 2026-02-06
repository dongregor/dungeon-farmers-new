# The Daily Grind - Guild Gazette Design

**Status:** Proposal
**Phase:** 2 or 3 (post-MVP, leverages expedition log infrastructure)
**Dependencies:** Expedition logs, hero traits, guild system (all Phase 1 - complete)

---

## Concept

**"The Daily Grind"** is a personal daily gazette generated for each guild. It recaps the previous day's events as a lighthearted fantasy newspaper - expedition highlights written like war correspondence, hero drama reported as celebrity gossip, and guild stats presented as deadpan business analytics.

The feature turns raw game data (expedition completions, level-ups, loot drops, trait interactions) into entertaining, shareable narrative content. Every issue is unique to the player's guild because it draws from *their* heroes, *their* expeditions, and *their* progression.

### Why "The Daily Grind"

The name is a triple reference:
- **MMO grinding** - the core gameplay loop the game parodies
- **Daily newspaper** - "the daily grind" of publishing
- **Coffee culture** - fits the game's Caffeinated Caverns energy

Alternative names if this doesn't land: "The Guild Gazette," "The Adventurer's Post," "Ye Olde Feed"

### Why This Feature Matters

1. **Retention hook** - Gives players a reason to check in daily even during low-activity periods
2. **Emergent storytelling** - The game's third pillar; the gazette is a natural home for it
3. **Shareability** - Funny gazette articles are exactly the "screenshot and send to friends" content the tone guide targets
4. **Hero attachment** - Seeing heroes *in the news* makes them feel more alive than stat blocks

---

## Sections

### 1. Headlines (Always Present)

The most notable event from the previous day gets front-page treatment.

**Sources (priority order):**
- Story mission completions
- Boss first kills
- Legendary/epic loot drops
- Hero prestige events
- New rare+ hero recruitment
- Zone unlock / new zone entered for the first time
- Guild level-up

**Tone:** Dramatic overstatement, treating routine game events as breaking news.

**Example templates:**
```
BREAKING: {heroName} Returns From {zoneName} With {itemName} -
Guild Treasure Vault "Running Out of Display Cases"

EXCLUSIVE: {heroName} Reaches Prestige {prestigeLevel} -
"I'm Basically a God Now," Claims Hero Who Died Twice Yesterday

LOCAL HERO {heroName} DEFEATS {bossName} -
Witnesses Report "A Lot of Screaming, Unclear From Which Side"
```

**Fallback (quiet day):**
```
SLOW NEWS DAY: Guild Mostly Stared at Walls, Sources Confirm
Nothing Happened Yesterday and Honestly That's Fine
Editor Forced to Write About Weather (See Page 3)
```

### 2. Expedition Dispatches (When Expeditions Completed)

Brief recaps of completed expeditions, written like field correspondence.

**Source:** Completed expedition logs from previous day. Pull entries rated `memorable` or higher, or summarize if none are that notable.

**Format:** 1-3 short dispatches depending on expedition count.

**Tone:** War correspondent meets travel blog. Deadpan reporting of absurd events.

**Example templates:**
```
FROM THE FIELD: {zoneName}
Our correspondent embedded with {leaderName}'s party reports the
expedition achieved {efficiencyPercent}% efficiency. {highlightEntry}
{traitReaction}

EXPEDITION BRIEF: {zoneName} ({duration})
Party of {partySize} led by {leaderName}. Notable: {lootSummary}.
{heroName} described the experience as "{traitBasedQuote}."
```

**Trait integration:** Heroes with relevant story traits generate quotes.
- Overly Dramatic: "It was the hardest thing I've ever done" (it was a tutorial zone)
- Chronic Napper: "{heroName} reportedly slept through the boss encounter"
- Conspiracy Theorist: "{heroName} insists the treasure was 'planted by the government'"

### 3. Hero Spotlight (Daily Feature)

A short profile of one hero, selected based on the previous day's activity.

**Selection criteria (priority):**
- Hero with the most interesting day (rare loot, level-up, trait synergy moment)
- Hero with the most expeditions completed
- Random hero who hasn't been featured recently (fallback)

**Tone:** Celebrity interview / puff piece. The hero's traits shape the entire tone of the article.

**Example:**
```
HERO OF THE DAY: Thrain "Disaster" Ironfist

After a solid day of tanking (3 expeditions, 2 level-ups, only 1
near-death experience), Thrain sat down with the Grind for an
exclusive interview. When asked about his success, he replied:
"Wait, what was the question? Sorry, shiny rock."

Thrain's teammates describe working with him as "chaotic but
somehow effective." His ADHD Chaos trait triggered 4 times
yesterday, including once during a boss fight where he got
distracted by a butterfly and accidentally discovered a hidden
treasure room.

Stats: 847 gold earned, 3 monsters defeated, 1 cool rock found.
```

### 4. Gossip Column - "Whispers & Rumors"

Procedurally generated rumors, gossip, and foreshadowing. This is the most creative section - content doesn't need to be strictly tied to real events.

**Content types:**

**A. Hero Drama (trait-driven)**
Generate relationship dynamics and drama from trait combinations in the roster.

```
Sources say {hero1} ({trait1}) and {hero2} ({trait2}) got into
an argument over {traitConflictTopic}. Neither will comment.
The rest of the guild is taking sides.

{heroName} ({disasterBisexual}) was spotted at the tavern buying
drinks for "literally everyone." Tab currently at 340 gold.

{heroName} ({conspiracyTheorist}) has been distributing pamphlets
claiming {zoneName} "doesn't actually exist." Guild management
has asked them to stop.
```

**B. Zone Rumors (foreshadowing / flavor)**
Hints about zones, upcoming content, or just atmospheric flavor.

```
Strange lights reported above {zoneName}. Locals blame "the usual."

Merchants from {zoneName} report unusually aggressive {monsterType}
activity. Expedition teams advised to bring extra potions.

A mysterious figure was seen near the {zoneName} entrance.
Description matches no known hero or monster. Probably fine.
```

**C. Meta-Gaming Gossip (breaking the fourth wall lightly)**
Occasional self-aware humor about game mechanics.

```
Anonymous hero complains: "Why do we keep doing the same zones?
Is someone making us repeat content?" Existential crisis ongoing.

Local economist baffled by loot drop rates. "The math doesn't
add up," says no one who understands RNG.

Hero support group for "people whose builds got nerfed" meets
Tuesdays at the tavern.
```

**Generation rules:**
- 2-3 gossip items per issue
- At least 1 must reference actual guild heroes by name
- Gossip about hero pairs should respect which heroes have actually been on expeditions together
- Rotate topics - don't repeat the same gossip format two days in a row

### 5. Classifieds & Ads (Flavor / Comic Relief)

Short humorous fake ads. Pure flavor content that doesn't reference real game state.

**Pick 1-2 per issue from a rotating pool.**

```
FOR SALE: Slightly used healing potion. Tastes like feet but it
works. 50 gold OBO. Serious inquiries only.

WANTED: Party healer. Must be okay with "creative tanking
strategies." Previous healer quit. (Unrelated.)

LOST: One (1) enchanted sword. Last seen flying out of my hands
during boss fight. If found, DO NOT touch the glowy bit.

HELP WANTED: Dungeon architect seeks monsters willing to stand in
rooms and look threatening. Flexible hours. Benefits include free
loot table listing.

PERSONAL: Tall, dark, handsome warrior seeks someone who won't
judge my Cheese Obsessed trait. I just really like cheese, okay?

NOTICE: The guild suggestion box has been removed after someone
submitted "more cheese" 47 times. You know who you are.
```

**Dynamic classifieds** (reference actual game state):
```
WANTED: Heroes for {zoneName} expedition. Minimum level {level}.
{traitType} preferred. Apply at the guild hall.

FOR SALE: {equipmentName} ({rarity}). Previous owner {retiredHeroName}
no longer needs it (retired to cheese farm).
```

### 6. Guild Stats Corner - "By The Numbers"

Previous day's metrics presented as dry business analytics (this is where the 10% corporate flavor shines).

**Always present, data-driven.**

```
YESTERDAY IN NUMBERS:
- Expeditions completed: {count}
- Total gold earned: {gold}
- Heroes leveled up: {levelUps}
- Items found: {itemCount} ({rareCount} rare or above)
- Monsters defeated: {monsterCount}
- Times {mostTiredHero} needed a nap: {napCount}

MVP: {heroName} ({reason})
LVP: {heroName} ({reason}) [Least Valuable - optional, only if funny]
```

**Tone:** Corporate quarterly report voice. Treat everything as serious business metrics.

```
Q: How did the guild perform?
A: Within acceptable parameters. {heroName} exceeded expectations.
{otherHero} is "under review." Management is cautiously optimistic.
```

### 7. Letters to the Editor (Occasional)

Heroes "write in" with complaints, opinions, or requests. Only appears when there's relevant trigger data.

**Triggers:**
- Hero assigned to zone matching a negative trait reaction (bug phobia → swamp)
- Hero on 3+ expeditions in a row (overworked complaint)
- Hero who hasn't been sent on any expedition (bored complaint)
- Two heroes with conflicting traits sent together repeatedly

**Example:**
```
LETTER TO THE EDITOR:
Dear Daily Grind,
I have been assigned to the Whispering Swamps for the THIRD time
this week. As someone with documented Bug Phobia, I find this
deeply concerning. I have filed a formal complaint with guild
management. It was ignored. Again.
Regards,
{heroName}, Professional Adventurer (and Bug-Free Zone Advocate)
```

```
Dear Daily Grind,
I haven't been sent on an expedition in 4 days. Am I fired?
Is this a performance issue? I've been stress-eating in the
tavern. Please advise.
Sincerely,
{heroName}
```

### 8. Tomorrow's Forecast (Optional Footer)

Light teaser for what's available/upcoming. Not predictive, just atmospheric.

```
FORECAST: Clear skies over {zoneName}. Excellent expedition weather.
{otherZone} reports fog - proceed with caution (or don't, we're
not your guild master).
```

---

## Architecture

### Data Model

```typescript
interface GazetteIssue {
  id: string
  guildId: string
  issueNumber: number
  publishedAt: string         // ISO date
  coveringDate: string        // The day being reported on
  headline: GazetteArticle
  dispatches: GazetteArticle[]
  heroSpotlight: GazetteArticle | null
  gossip: GazetteArticle[]
  classifieds: GazetteClassified[]
  stats: GazetteStats
  letters: GazetteArticle[]   // 0-2 per issue
  forecast: string | null
}

interface GazetteArticle {
  id: string
  type: 'headline' | 'dispatch' | 'spotlight' | 'gossip' | 'letter'
  title: string
  body: string
  heroIds?: string[]          // Heroes mentioned
  expeditionId?: string       // Related expedition
  rarity?: 'common' | 'noteworthy' | 'memorable' | 'epic'
  // Rarity determines visual treatment and shareability
}

interface GazetteClassified {
  id: string
  text: string
  isDynamic: boolean          // References real game state?
}

interface GazetteStats {
  expeditionsCompleted: number
  goldEarned: number
  heroesLeveledUp: number
  itemsFound: number
  rareItemsFound: number
  monstersDefeated: number
  mvp: { heroId: string; heroName: string; reason: string }
  funStat: string             // Rotating silly stat
}
```

### Generation Pipeline

```
Daily Activity Data (expeditions, level-ups, loot, trait triggers)
  ↓
Event Ranker (scores events by noteworthiness)
  ↓
Section Generators (one per section, template-based)
  ↓
Trait Personality Injector (adds hero voice based on story traits)
  ↓
Deduplication & Assembly (no repeated heroes/events across sections)
  ↓
GazetteIssue stored in DB
```

**Generation timing:**
- **Option A (recommended):** Generate on-demand when player opens the gazette, using cached daily activity data. Avoids generating for inactive players.
- **Option B:** Server-side cron job at a fixed daily reset time. Simpler but generates for all players.

### Template System

Reuse and extend the existing `LogTemplate` pattern from the expedition log system. Each section has:
- Multiple template variants per content type
- Conditional templates based on traits, zones, event types
- Variable substitution (`{heroName}`, `{zoneName}`, etc.)
- Weight-based random selection to avoid repetition

### AI Enhancement (Phase 4)

Same approach as expedition logs: most content is template-based, but rare/legendary events can trigger AI-generated gazette articles for truly unique moments. Uses the existing `AILogRequest` pattern.

Triggers for AI gazette content:
- Legendary loot discoveries
- First boss kill in a new zone
- Story mission completions
- Multiple story traits synergizing in a single expedition

---

## UI Design

### Page: `/gazette`

Accessible from main navigation (new nav item with "NEW" badge when unread).

**Layout:** Newspaper-style with:
- Masthead: "THE DAILY GRIND" with issue number and date
- Guild name as subtitle ("Official Publication of [Guild Name]")
- Two-column layout for dispatches and gossip
- Full-width headline at top
- Sidebar for stats and classifieds
- Footer with forecast

**Visual treatment by article rarity:**
- Common: Normal text
- Noteworthy: Subtle highlight/border
- Memorable: Styled callout box
- Epic: Gold border, special background, share button prominent

### Archive

Previous issues browsable by date. Simple paginated list.
Oldest issues can be pruned after 30 days to keep storage manageable.

### Share

Individual articles (especially headlines and hero spotlights) should have a "share" action that formats them nicely for screenshots or clipboard copy. This is the "would players screenshot this" feature.

### Notification

When a new issue is available:
```
New notification: "Today's Daily Grind is out! Headline: {headline}"
Type: gazette_new_issue
Action: Navigate to /gazette
```

---

## Content Budget Per Issue

| Section | Articles | Required? | Min Data Needed |
|---------|----------|-----------|-----------------|
| Headline | 1 | Yes | Any activity, or fallback |
| Dispatches | 1-3 | If expeditions completed | >= 1 expedition |
| Hero Spotlight | 1 | Yes | >= 1 hero in guild |
| Gossip | 2-3 | Yes | >= 2 heroes (template fallback) |
| Classifieds | 1-2 | Yes | Static pool + optional dynamic |
| Stats | 1 | Yes | Any activity, or zeros |
| Letters | 0-2 | No | Specific triggers |
| Forecast | 1 | Optional | Zone data |

**Minimum viable issue:** Headline + Hero Spotlight + 2 Gossip + 1 Classified + Stats. This works even on a player's first day with zero expeditions ("GUILD FOUNDED" headline, spotlight on guild master, gossip about the new guild in town).

---

## Edge Cases

**New guild (day 1):**
Special "Inaugural Issue" with founding story, guild master profile, zone previews as gossip.

**Inactive day (no expeditions):**
Slow news day templates. Gossip and classifieds carry the issue. Letters from bored heroes.

**Massive activity day (10+ expeditions):**
Rank events, pick top 3 for dispatches. Headline is the single best event. Stats section covers the rest.

**Hero retired:**
Retirement gets headline treatment ("LEGENDARY CAREER ENDS") with retrospective stats.

**Single hero guild:**
All spotlight/gossip focuses on guild master. Classifieds about recruitment. Gossip about zone NPCs instead of hero drama.

---

## Implementation Phases

### Phase A: MVP Gazette
- Headline generation (template-based, top event or fallback)
- Stats section (pure data, formatted)
- 1 static classified per issue
- Basic `/gazette` page with simple layout
- "New issue" notification

### Phase B: Character Content
- Expedition dispatches with trait-flavored quotes
- Hero spotlight with trait personality injection
- Gossip column (hero drama + zone rumors)
- Letters to the editor (triggered)

### Phase C: Polish
- Newspaper-style layout (columns, masthead, typography)
- Article rarity / visual treatment
- Archive and back-issue browsing
- Share functionality for individual articles
- Dynamic classifieds referencing game state

### Phase D: AI Enhancement
- AI-generated articles for legendary events
- More nuanced hero voice in spotlights
- Cross-referencing multi-day story arcs in gossip

---

## Tone Distribution

Following the tone guide, the gazette should feel like:

| Section | Gaming Parody | Character Voice | Corporate Flavor |
|---------|---------------|-----------------|------------------|
| Headlines | 70% | 20% | 10% |
| Dispatches | 50% | 40% | 10% |
| Hero Spotlight | 30% | 60% | 10% |
| Gossip | 60% | 40% | 0% |
| Classifieds | 70% | 20% | 10% |
| Stats | 10% | 10% | 80% |
| Letters | 20% | 80% | 0% |
| Forecast | 50% | 10% | 40% |

The stats section is where corporate humor lives. The letters section is pure character voice. Everything else leans gaming parody.

---

## Screenshot Test

Applying the tone guide's litmus test - "would a player screenshot this and send it to friends?"

**Likely screenshots:**
- A hero spotlight where trait combos create hilarious profile ("Cheese Obsessed Conspiracy Theorist who thinks the moon is made of cheese and is COLLECTING EVIDENCE")
- Gossip about two heroes with conflicting traits getting into absurd arguments
- Slow news day headlines ("NOTHING HAPPENED AND THAT'S FINE")
- Letters from heroes complaining about being sent to zones they hate
- Stats showing one hero carried the entire guild while another did literally nothing

If these don't make people laugh, the templates need work.

---

## Open Questions

1. **Daily reset time:** Fixed UTC time? Relative to player timezone? Or generate on first login of the day?
2. **Retroactive issues:** If a player misses 3 days, do they get 3 back-issues or just today's?
3. **Gazette as notification replacement?** Should the daily digest notification (`notifyDailyDigest`) be absorbed into the gazette, or coexist?
4. **Hero reactions to their own articles?** Could heroes have in-gazette reactions to being featured ("Thrain is reportedly 'thrilled' about his spotlight. He has not stopped talking about it.")
5. **Player interaction:** Should players be able to "pin" favorite articles? Rate them? This might be over-engineering for MVP.
6. **Template count:** How many templates per section for enough variety? Rough estimate: 15-20 headline templates, 10-15 dispatch templates, 8-10 spotlight templates, 20+ gossip templates, 30+ classifieds. This is a significant content authoring effort.
