# Expedition Logs & Emergent Stories Design

> **Date:** 2025-01-01
> **Status:** Design complete, ready for implementation
> **Related:** `design/GAME_DESIGN_V2.md`, `docs/plans/2024-12-14-phase1-comprehensive-update.md`

---

## Overview & Goals

### Purpose

Make heroes feel alive through personality-driven expedition narratives with a loose story structure.

### Core Principles

- **Heroes are the stars** - Every log showcases personality through trait reactions
- **Narrative arc** - Gives structure without rigidity
- **Rarity highlighting** - Lets players scan for memorable moments
- **AI for rare moments only** - Templates handle 95% of content

### Log Structure

- Length scales with expedition duration (15min → 3-4 entries, 2hr → 8-10)
- Follows narrative arc: Departure → Rising Action → Climax → Falling Action → Return
- Each entry can trigger hero reactions based on traits
- Entry rarity (Gray→Orange) determined by outcome + reaction quality

### Entry Types

| Type | Role in Narrative |
|------|-------------------|
| Departure | Opening, sets the scene |
| Travel | Rising action, passage of time |
| Combat | Action beats, can be climax |
| Event | Challenges, discoveries, skill checks |
| Loot | Rewards, treasure moments |
| Return | Closing, heading home |
| *Reaction* | Attached to above, personality flavor |

### Content Strategy (MVP)

- ~150 templates covering 2 zones fully + generic fallbacks
- ~75-120 trait reaction templates
- Expand with content drops post-launch

---

## Template Data Structures

### Log Entry Template

```typescript
// types/logs.ts

type LogEntryType = 'departure' | 'travel' | 'combat' | 'event' | 'loot' | 'return'
type LogRarity = 'common' | 'standard' | 'noteworthy' | 'memorable' | 'epic' | 'legendary'

interface LogTemplate {
  id: string
  type: LogEntryType

  // Conditions for when this template can be used
  conditions?: {
    zoneTypes?: ZoneType[]
    subzoneIds?: string[]
    minMastery?: number
    requiresTags?: string[]        // Party needs these hero tags
    eventOutcome?: 'success' | 'failure' | 'any'
  }

  // Multiple text variations (random pick)
  templates: string[]

  // Base rarity before reaction boosts
  baseRarity: LogRarity

  // Weight for random selection (higher = more common)
  weight?: number
}
```

### Variables Available in Templates

```typescript
interface TemplateVariables {
  // Zone context
  zoneName: string
  zoneType: string
  subzoneName: string

  // Heroes - random selection
  randomHero: string
  anotherHero: string
  leaderHero: string

  // Heroes - role-based (returns name or fallback to random)
  tankHero: string
  healerHero: string
  scoutHero: string
  casterHero: string

  // Combat
  enemyName: string
  enemyCount: string
  enemyPack: string              // "a pack of Wolves", "3 Goblins"

  // Loot
  itemName: string
  itemRarity: string
  goldAmount: string

  // Atmosphere
  timeOfDay: string              // dawn, midday, dusk, night
  weather: string                // clear skies, light rain, etc.
}
```

---

## Trait Reaction System

### Reaction Definition

```typescript
// types/logs.ts

interface TraitReaction {
  traitId: string

  // What triggers this reaction
  triggers: {
    entryTypes?: LogEntryType[]
    eventIds?: string[]                // Specific events
    lootRarity?: EquipmentRarity[]     // React to certain loot tiers
    zoneTypes?: ZoneType[]
    outcome?: 'success' | 'failure' | 'any'
  }

  // Reaction text variations - {hero} replaced with hero name
  reactions: string[]

  // Probability this trait reacts when triggered (0.0 - 1.0)
  triggerChance: number

  // How much to boost entry rarity (0, 1, or 2 tiers)
  rarityBoost: 0 | 1 | 2
}
```

### Special Pair Reactions

```typescript
interface TraitPairReaction {
  traitIds: [string, string]           // Both traits must be present

  triggers: {
    entryTypes?: LogEntryType[]
    eventIds?: string[]
  }

  // Joint reaction - {hero1} has first trait, {hero2} has second
  reactions: string[]

  triggerChance: number
  rarityBoost: 1 | 2                   // Pairs always boost
}
```

### Example Reactions

```typescript
// Loot Goblin + Loot
{
  traitId: 'lootGoblin',
  triggers: { entryTypes: ['loot'] },
  reactions: [
    '{hero}: "Mine! I saw it first!"',
    '{hero} was already stuffing it into their pack.',
    '{hero}\'s eyes gleamed with naked greed.',
  ],
  triggerChance: 0.7,
  rarityBoost: 1
}

// Coward + Overconfident pair (combat)
{
  traitIds: ['coward', 'overconfident'],
  triggers: { entryTypes: ['combat'] },
  reactions: [
    '{hero2} charged in alone while {hero1} found urgent business behind a rock.',
    '"Cover me!" yelled {hero2}. {hero1} was already covering themselves. In leaves.',
  ],
  triggerChance: 0.5,
  rarityBoost: 2
}
```

### Reaction Selection Rules

1. Check for **pair reactions first** - if party has matching trait combo
2. Roll `triggerChance` for each matching single-trait reaction
3. If multiple succeed: pick the one with highest `rarityBoost`
4. **20% chance** of a second hero also reacting (different trait)
5. Maximum 2 reactions per entry

---

## Log Generation Logic

### Generated Log Structure

```typescript
// utils/logGenerator.ts

interface GeneratedLog {
  expeditionId: string
  entries: LogEntry[]
  highlights: string[]           // Entry IDs that are noteworthy+
}

interface LogEntry {
  id: string
  type: LogEntryType
  text: string
  rarity: LogRarity
  reactions: HeroReaction[]
  timestamp: number              // Simulated time during expedition
}

interface HeroReaction {
  heroId: string
  heroName: string
  traitId: string
  text: string
}
```

### Step-by-Step Generation

```typescript
function generateExpeditionLog(expedition: Expedition, party: Hero[]): GeneratedLog {
  // 1. DETERMINE LENGTH
  const entryCount = calculateEntryCount(expedition.durationMinutes)
  // 15min → 3-4, 30min → 4-5, 60min → 6-7, 120min → 8-10

  // 2. BUILD SKELETON (narrative arc)
  const skeleton = buildSkeleton(entryCount)
  // Always: [departure, ...middle, return]
  // Middle follows: travel → event/combat → climax → event/loot

  // 3. SELECT TEMPLATES
  const entries = skeleton.map(slot =>
    selectTemplate(slot.type, expedition.zone, party)
  )

  // 4. FILL VARIABLES
  const filledEntries = entries.map(entry =>
    fillVariables(entry, expedition, party)
  )

  // 5. ADD REACTIONS
  const withReactions = filledEntries.map(entry =>
    addReactions(entry, party)
  )

  // 6. CALCULATE FINAL RARITIES
  const finalEntries = withReactions.map(entry =>
    calculateFinalRarity(entry)
  )

  // 7. AI ENHANCEMENT (async, with fallback)
  const enhanced = await enhanceWithAI(finalEntries, expedition)

  return { expeditionId: expedition.id, entries: enhanced }
}
```

### Entry Count by Duration

| Duration | Entry Count |
|----------|-------------|
| 15 min | 3-4 |
| 30 min | 4-5 |
| 45 min | 5-6 |
| 60 min | 6-7 |
| 90 min | 7-8 |
| 120 min | 8-10 |

### Skeleton Building (Narrative Arc)

```typescript
function buildSkeleton(entryCount: number): SkeletonSlot[] {
  // Fixed: departure at start, return at end
  // Climax: main combat/discovery at ~60-70% through

  // Example for 6 entries:
  // [departure, travel, event, COMBAT (climax), loot, return]

  // Example for 9 entries:
  // [departure, travel, event, combat, travel, EVENT (climax), loot, travel, return]
}
```

---

## AI Integration

### When AI Triggers

```typescript
type AITrigger =
  | 'legendary_loot'      // Mythic item dropped
  | 'secret_discovery'    // Hidden subzone found
  | 'story_hook_start'    // Rare occurrence begins a hook
  | 'story_hook_payoff'   // Multi-step hook completes
  | 'boss_first_kill'     // First encounter with a boss
  | 'trait_synergy'       // 2+ traits combine perfectly

function shouldTriggerAI(entry: LogEntry, context: ExpeditionContext): AITrigger | null {
  if (entry.loot?.rarity === 'mythic') return 'legendary_loot'
  if (entry.discoveredSubzone?.isSecret) return 'secret_discovery'
  if (entry.storyHook?.phase === 'start') return 'story_hook_start'
  if (entry.storyHook?.phase === 'complete') return 'story_hook_payoff'
  if (entry.combat?.isBoss && !context.previouslyDefeated) return 'boss_first_kill'
  if (entry.reactions.length >= 2 && hasTraitSynergy(entry.reactions)) return 'trait_synergy'
  return null
}
```

### AI Request/Response

```typescript
interface AILogRequest {
  trigger: AITrigger
  zone: { name: string, type: string, subzone: string }
  heroes: { name: string, traits: string[] }[]
  triggerDetails: {
    itemName?: string
    bossName?: string
    discoveryName?: string
    hookName?: string
    synergyTraits?: string[]
  }
  previousEntries: string[]      // Last 2-3 for continuity
  tone: 'lighthearted_fantasy'   // Always this for Dungeon Farmers
}

interface AILogResponse {
  text: string
  heroReactions?: { heroName: string, text: string }[]
}
```

### Fallback Strategy

```typescript
async function enhanceWithAI(entry: LogEntry, context: ExpeditionContext): Promise<LogEntry> {
  const trigger = shouldTriggerAI(entry, context)
  if (!trigger) return entry

  try {
    const response = await generateAILog(entry, context, { timeout: 3000 })
    return { ...entry, text: response.text, reactions: response.heroReactions }
  } catch (error) {
    // Immediate fallback - use pre-written "legendary" template
    console.warn('AI generation failed, using fallback template')
    return selectFallbackTemplate(entry, trigger)
  }
}
```

Every AI trigger has a matching high-quality fallback template so players never see a broken experience.

---

## Rarity System & Display

### Rarity Tiers

| Rarity | Color | Tailwind Class | When |
|--------|-------|----------------|------|
| Common | Gray | `text-gray-500` | Routine travel, filler |
| Standard | White | `text-gray-200` | Normal events, basic loot |
| Noteworthy | Green | `text-green-400` | Good loot, successful checks |
| Memorable | Blue | `text-blue-400` | Rare drops, great trait moments |
| Epic | Purple | `text-purple-400` | Epic loot, new subzone found |
| Legendary | Orange | `text-orange-400` | Mythic drops, story hooks, secrets |

### Rarity Calculation

```typescript
const RARITY_ORDER: LogRarity[] = [
  'common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary'
]

function calculateFinalRarity(entry: LogEntry): LogRarity {
  let rarityIndex = RARITY_ORDER.indexOf(entry.baseRarity)

  // Boost from reactions
  const totalBoost = entry.reactions.reduce((sum, r) => sum + r.rarityBoost, 0)
  rarityIndex += totalBoost

  // Boost from outcome (legendary loot, discovery, etc.)
  if (entry.loot?.rarity === 'mythic') rarityIndex += 3
  else if (entry.loot?.rarity === 'legendary') rarityIndex += 2
  else if (entry.loot?.rarity === 'epic') rarityIndex += 1

  if (entry.discoveredSubzone) rarityIndex += 2
  if (entry.storyHook) rarityIndex += 2

  // Cap at legendary
  return RARITY_ORDER[Math.min(rarityIndex, RARITY_ORDER.length - 1)]
}
```

### Log Display Structure

```typescript
interface LogDisplayEntry {
  id: string
  rarity: LogRarity
  color: string

  // Main text
  text: string

  // Reactions shown inline or below
  reactions: {
    heroName: string
    text: string
    traitName: string            // For tooltip: "Loot Goblin"
  }[]

  // Optional metadata
  timestamp?: string             // "12 minutes in"
  icon?: string                  // Combat sword, loot chest, etc.
}
```

### UI Behavior

| Feature | Behavior |
|---------|----------|
| Highlighting | Noteworthy+ entries have colored text |
| Scanning | "Highlights" button filters to noteworthy+ only |
| Reactions | Shown as indented quotes below main text |
| Trait tooltip | Hover reaction to see which trait caused it |
| Expand/collapse | Long logs default collapsed, player can expand |

---

## Content Organization & File Structure

### Directory Structure

```
app/
├── data/
│   └── logs/
│       ├── templates/
│       │   ├── generic.ts        # Works in any zone
│       │   ├── forest.ts         # Verdant Woods specific
│       │   ├── cave.ts           # Goblin Caves specific
│       │   └── index.ts          # Exports all templates
│       ├── reactions/
│       │   ├── traits.ts         # Per-trait reactions
│       │   ├── pairs.ts          # Special pair reactions
│       │   └── index.ts
│       └── fallbacks/
│           └── legendary.ts      # AI fallback templates
├── utils/
│   └── logs/
│       ├── generator.ts          # Main generation logic
│       ├── skeleton.ts           # Narrative arc builder
│       ├── variables.ts          # Variable filling
│       ├── reactions.ts          # Reaction selection
│       ├── rarity.ts             # Rarity calculation
│       └── ai.ts                 # AI enhancement
└── components/
    └── expedition/
        ├── LogViewer.vue         # Full log display
        ├── LogEntry.vue          # Single entry with reactions
        ├── LogHighlights.vue     # Filtered view
        └── LogReaction.vue       # Hero quote display

types/
└── logs.ts                       # All log-related types
```

### MVP Content Targets

| Content Type | Count | Notes |
|--------------|-------|-------|
| Generic templates | ~40 | Work anywhere |
| Forest templates | ~35 | Verdant Woods |
| Cave templates | ~35 | Goblin Caves |
| Trait reactions | ~80 | 5-6 per trait × 15 traits |
| Pair reactions | ~15 | Best trait combos |
| AI fallbacks | ~12 | 2 per AI trigger type |
| **Total** | **~220** | |

---

## Future Expansion (Post-MVP)

### AI-Enhanced Templates (Option 3)

When ready to expand AI usage:

1. Add `aiEnhanceable: boolean` flag to templates
2. For marked templates, AI rephrases/adds flavor before display
3. Cache AI-enhanced versions to reduce API calls
4. A/B test player preference for AI vs template text

### Additional Content

- New zone template packs (~35 per zone)
- More trait reactions as traits are added
- Seasonal/event-specific templates
- Player-submitted templates (curated)

---

## Implementation Notes

### Dependencies

- Expedition system (provides context for generation)
- Hero trait system (for reaction matching)
- Zone/subzone data (for template filtering)
- Equipment rarity (for loot-based triggers)

### Testing Strategy

- Unit tests for each generation step
- Snapshot tests for template variable filling
- Integration test: full log generation with mock expedition
- Manual review of generated logs for quality

### Performance Considerations

- Generate logs server-side when expedition completes
- Store generated logs in database (don't regenerate)
- AI calls are async with 3s timeout
- Template selection is O(n) on template count - acceptable for ~200 templates
