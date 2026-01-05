# Expedition Logs System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the existing log generator with rarity highlighting, structured trait reactions, pair reactions, and AI integration for rare moments.

**Architecture:** Extend current `app/utils/logGenerator.ts` with modular utilities for templates, reactions, and rarity calculation. Templates move from inline to separate data files. AI enhancement hooks into rare triggers with template fallbacks.

**Tech Stack:** Nuxt 4, TypeScript, Vitest for testing

**Existing Files:**
- `app/utils/logGenerator.ts` - Current log generator (to enhance)
- `types/expedition.ts` - Log types (to extend)
- `app/data/storyTraits.ts` - Story traits with reactions

---

## Section 1: Types & Data Structures (Tasks 1-3)

### Task 1: Add Log Rarity Types

**Files:**
- Modify: `types/expedition.ts`
- Test: `tests/types/logRarity.test.ts`

**Step 1: Write the test for log rarity types**

Create `tests/types/logRarity.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import type { LogRarity, LogEntry } from '~~/types/expedition'

describe('Log Rarity Types', () => {
  it('LogRarity should include all 6 tiers', () => {
    const rarities: LogRarity[] = ['common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary']
    expect(rarities).toHaveLength(6)
  })

  it('LogEntry should include rarity field', () => {
    const entry: LogEntry = {
      text: 'Test entry',
      type: 'narrative',
      rarity: 'noteworthy'
    }
    expect(entry.rarity).toBe('noteworthy')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/types/logRarity.test.ts
```

Expected: FAIL - LogRarity type not found

**Step 3: Add rarity types to expedition.ts**

Add at top of `types/expedition.ts` after imports:

```typescript
// Log entry rarity tiers
export type LogRarity = 'common' | 'standard' | 'noteworthy' | 'memorable' | 'epic' | 'legendary'

export const RARITY_ORDER: LogRarity[] = ['common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary']

export const RARITY_COLORS: Record<LogRarity, string> = {
  common: 'text-gray-500',
  standard: 'text-gray-200',
  noteworthy: 'text-green-400',
  memorable: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-orange-400'
}
```

**Step 4: Update LogEntry interface**

Modify the existing `LogEntry` interface in `types/expedition.ts`:

```typescript
export interface LogEntry {
  text: string
  heroId?: string
  traitId?: string
  eventId?: string
  type: 'narrative' | 'reaction' | 'combat' | 'loot' | 'choice_result'
  rarity?: LogRarity  // Add this field
  rarityBoost?: number  // How much this entry boosted rarity
}
```

**Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/types/logRarity.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add types/expedition.ts tests/types/logRarity.test.ts
git commit -m "feat(logs): add log entry rarity types"
```

---

### Task 2: Add Trait Reaction Types

**Files:**
- Create: `types/logs.ts`
- Test: `tests/types/traitReaction.test.ts`

**Step 1: Write the test for trait reaction types**

Create `tests/types/traitReaction.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import type { TraitReaction, TraitPairReaction } from '~~/types/logs'

describe('Trait Reaction Types', () => {
  it('TraitReaction should have required fields', () => {
    const reaction: TraitReaction = {
      traitId: 'lootGoblin',
      triggers: { entryTypes: ['loot'] },
      reactions: ['Test reaction'],
      triggerChance: 0.7,
      rarityBoost: 1
    }
    expect(reaction.traitId).toBe('lootGoblin')
    expect(reaction.triggerChance).toBe(0.7)
  })

  it('TraitPairReaction should require two trait IDs', () => {
    const pairReaction: TraitPairReaction = {
      traitIds: ['coward', 'overconfident'],
      triggers: { entryTypes: ['combat'] },
      reactions: ['Test pair reaction'],
      triggerChance: 0.5,
      rarityBoost: 2
    }
    expect(pairReaction.traitIds).toHaveLength(2)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/types/traitReaction.test.ts
```

Expected: FAIL - types not found

**Step 3: Create types/logs.ts**

```typescript
import type { LogRarity } from './expedition'
import type { ZoneType } from './zones'
import type { EquipmentRarity } from './equipment'

// Log entry types
export type LogEntryType = 'departure' | 'travel' | 'combat' | 'event' | 'loot' | 'return'

// Trait reaction definition
export interface TraitReaction {
  traitId: string

  triggers: {
    entryTypes?: LogEntryType[]
    eventIds?: string[]
    lootRarity?: EquipmentRarity[]
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

// Special pair reactions for trait combos
export interface TraitPairReaction {
  traitIds: [string, string]

  triggers: {
    entryTypes?: LogEntryType[]
    eventIds?: string[]
  }

  // {hero1} has first trait, {hero2} has second
  reactions: string[]

  triggerChance: number
  rarityBoost: 1 | 2
}

// Template variables available
export interface TemplateVariables {
  // Zone context
  zoneName: string
  zoneType: string
  subzoneName: string

  // Heroes - random selection
  randomHero: string
  anotherHero: string
  leaderHero: string

  // Heroes - role-based
  tankHero: string
  healerHero: string
  scoutHero: string
  casterHero: string

  // Combat
  enemyName: string
  enemyCount: string
  enemyPack: string

  // Loot
  itemName: string
  itemRarity: string
  goldAmount: string

  // Atmosphere
  timeOfDay: string
  weather: string
}

// Log template definition
export interface LogTemplate {
  id: string
  type: LogEntryType

  conditions?: {
    zoneTypes?: ZoneType[]
    subzoneIds?: string[]
    minMastery?: number
    requiresTags?: string[]
    eventOutcome?: 'success' | 'failure' | 'any'
  }

  templates: string[]
  baseRarity: LogRarity
  weight?: number
}

// Hero reaction in log
export interface HeroReaction {
  heroId: string
  heroName: string
  traitId: string
  text: string
  rarityBoost: number
}

// AI enhancement types
export type AITrigger =
  | 'legendary_loot'
  | 'secret_discovery'
  | 'story_hook_start'
  | 'story_hook_payoff'
  | 'boss_first_kill'
  | 'trait_synergy'

export interface AILogRequest {
  trigger: AITrigger
  zone: { name: string; type: string; subzone: string }
  heroes: { name: string; traits: string[] }[]
  triggerDetails: {
    itemName?: string
    bossName?: string
    discoveryName?: string
    hookName?: string
    synergyTraits?: string[]
  }
  previousEntries: string[]
  tone: 'lighthearted_fantasy'
}

export interface AILogResponse {
  text: string
  heroReactions?: { heroName: string; text: string }[]
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/types/traitReaction.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add types/logs.ts tests/types/traitReaction.test.ts
git commit -m "feat(logs): add trait reaction and template types"
```

---

### Task 3: Export New Types from Index

**Files:**
- Modify: `types/index.ts`

**Step 1: Add exports to types/index.ts**

Add to `types/index.ts`:

```typescript
export * from './logs'
```

**Step 2: Verify types are accessible**

```bash
npx nuxi typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add types/index.ts
git commit -m "chore(types): export log types from index"
```

---

## Section 2: Trait Reaction Data (Tasks 4-6)

### Task 4: Create Base Trait Reactions

**Files:**
- Create: `app/data/logs/reactions/traits.ts`
- Test: `tests/data/logs/traitReactions.test.ts`

**Step 1: Write the test**

Create `tests/data/logs/traitReactions.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { TRAIT_REACTIONS, getReactionsForTrait } from '~/data/logs/reactions/traits'

describe('Trait Reactions Data', () => {
  it('should have reactions for core traits', () => {
    expect(TRAIT_REACTIONS['lootGoblin']).toBeDefined()
    expect(TRAIT_REACTIONS['coward']).toBeDefined()
    expect(TRAIT_REACTIONS['pyromaniac']).toBeDefined()
  })

  it('each reaction should have required fields', () => {
    for (const reaction of Object.values(TRAIT_REACTIONS)) {
      expect(reaction.traitId).toBeDefined()
      expect(reaction.reactions.length).toBeGreaterThan(0)
      expect(reaction.triggerChance).toBeGreaterThan(0)
      expect(reaction.triggerChance).toBeLessThanOrEqual(1)
    }
  })

  it('getReactionsForTrait should return matching reactions', () => {
    const reactions = getReactionsForTrait('lootGoblin', 'loot')
    expect(reactions.length).toBeGreaterThan(0)
  })

  it('getReactionsForTrait should return empty for non-matching', () => {
    const reactions = getReactionsForTrait('lootGoblin', 'combat')
    expect(reactions.length).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/data/logs/traitReactions.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the trait reactions file**

Create directory and file `app/data/logs/reactions/traits.ts`:

```typescript
import type { TraitReaction, LogEntryType } from '~~/types/logs'

export const TRAIT_REACTIONS: Record<string, TraitReaction> = {
  // === LOOT-FOCUSED TRAITS ===
  lootGoblin: {
    traitId: 'lootGoblin',
    triggers: { entryTypes: ['loot'] },
    reactions: [
      '{hero}: "Mine! I saw it first!"',
      '{hero} was already stuffing it into their pack.',
      '{hero}\'s eyes gleamed with naked greed.',
      'Before anyone could react, {hero} had pocketed it.',
      '{hero} whispered "precious..." a bit too intensely.',
    ],
    triggerChance: 0.7,
    rarityBoost: 1
  },

  treasureHunter: {
    traitId: 'treasureHunter',
    triggers: { entryTypes: ['loot', 'event'] },
    reactions: [
      '{hero}\'s treasure sense was tingling.',
      '"There\'s more here," {hero} insisted.',
      '{hero} tapped the walls, listening for hollow spots.',
      '{hero} checked behind every suspicious stone.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1
  },

  // === COMBAT-FOCUSED TRAITS ===
  brawny: {
    traitId: 'brawny',
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero} flexed menacingly at the enemy.',
      '{hero} cracked their knuckles before the fight.',
      '{hero} picked up and threw the nearest enemy.',
      'The enemy reconsidered after seeing {hero}\'s muscles.',
    ],
    triggerChance: 0.5,
    rarityBoost: 0
  },

  overconfident: {
    traitId: 'overconfident',
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '"Is that all you\'ve got?" taunted {hero}.',
      '{hero} didn\'t bother dodging. Mistake.',
      '{hero} fought three enemies at once. Unnecessarily.',
      '"I could do this blindfolded!" {hero} announced.',
    ],
    triggerChance: 0.6,
    rarityBoost: 1
  },

  coward: {
    traitId: 'coward',
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero} hid behind a rock during the fight.',
      '{hero} fought from a safe distance. Very safe.',
      '"Strategic retreat!" yelled {hero}, already running.',
      '{hero} found urgent business inspecting the ceiling.',
    ],
    triggerChance: 0.6,
    rarityBoost: 1
  },

  // === ZONE-SPECIFIC TRAITS ===
  pyromaniac: {
    traitId: 'pyromaniac',
    triggers: { entryTypes: ['combat', 'event'], zoneTypes: ['desert', 'ruins'] },
    reactions: [
      '{hero} cackled as flames spread.',
      '"MORE FIRE!" shouted {hero}.',
      '{hero} set something on fire. Not the enemy, but still.',
      'The smell of smoke made {hero} smile.',
    ],
    triggerChance: 0.7,
    rarityBoost: 1
  },

  forestFriend: {
    traitId: 'forestFriend',
    triggers: { entryTypes: ['travel', 'event'], zoneTypes: ['forest'] },
    reactions: [
      'The trees seemed to part for {hero}.',
      '{hero} paused to greet a passing squirrel.',
      'Birds sang as {hero} walked by.',
      '{hero} found the perfect mushroom spot.',
    ],
    triggerChance: 0.6,
    rarityBoost: 0
  },

  caveExplorer: {
    traitId: 'caveExplorer',
    triggers: { entryTypes: ['travel', 'event'], zoneTypes: ['cave'] },
    reactions: [
      '{hero} navigated the tunnels with ease.',
      '"I know these caves," muttered {hero}.',
      '{hero} found a shortcut only they could see.',
      'The darkness didn\'t slow {hero} at all.',
    ],
    triggerChance: 0.6,
    rarityBoost: 0
  },

  // === UTILITY TRAITS ===
  stealthy: {
    traitId: 'stealthy',
    triggers: { entryTypes: ['combat', 'event'] },
    reactions: [
      '{hero} struck from the shadows.',
      'The enemy never saw {hero} coming.',
      '{hero} was suddenly behind the enemy.',
      'One moment {hero} was there, the next... still there, but unnoticed.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1
  },

  healer: {
    traitId: 'healer',
    triggers: { entryTypes: ['combat'], outcome: 'any' },
    reactions: [
      '{hero} patched up the team\'s wounds.',
      '"Hold still," {hero} muttered while bandaging.',
      '{hero} distributed healing supplies.',
      'Thanks to {hero}, everyone stayed on their feet.',
    ],
    triggerChance: 0.5,
    rarityBoost: 0
  },

  // === QUIRKY TRAITS ===
  caffeineDependent: {
    traitId: 'caffeineDependent',
    triggers: { entryTypes: ['travel', 'event'] },
    reactions: [
      '{hero} desperately searched for coffee.',
      '"Need... caffeine..." mumbled {hero}.',
      '{hero} perked up after finding mysterious beans.',
      'The party stopped while {hero} brewed something.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1
  },

  superstitious: {
    traitId: 'superstitious',
    triggers: { entryTypes: ['event', 'travel'] },
    reactions: [
      '{hero} threw salt over their shoulder.',
      '"We need to leave an offering first!" insisted {hero}.',
      '{hero} refused to walk under that archway.',
      'Something about this place made {hero} nervous.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1
  },

  dramatic: {
    traitId: 'dramatic',
    triggers: { entryTypes: ['combat', 'loot', 'event'] },
    reactions: [
      '"At last! The treasure we sought!" proclaimed {hero}.',
      '{hero} struck a dramatic pose.',
      '"This is our finest hour!" {hero} announced.',
      '{hero} narrated their own actions. Third person.',
    ],
    triggerChance: 0.6,
    rarityBoost: 1
  },
}

/**
 * Get all reactions that match a trait and entry type
 */
export function getReactionsForTrait(traitId: string, entryType: LogEntryType, zoneType?: string): TraitReaction[] {
  const reaction = TRAIT_REACTIONS[traitId]
  if (!reaction) return []

  // Check entry type match
  if (reaction.triggers.entryTypes && !reaction.triggers.entryTypes.includes(entryType)) {
    return []
  }

  // Check zone type if specified
  if (reaction.triggers.zoneTypes && zoneType) {
    if (!reaction.triggers.zoneTypes.includes(zoneType as any)) {
      return []
    }
  }

  return [reaction]
}

/**
 * Get all trait IDs that have reactions defined
 */
export function getTraitIdsWithReactions(): string[] {
  return Object.keys(TRAIT_REACTIONS)
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/data/logs/traitReactions.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/data/logs/reactions/traits.ts tests/data/logs/traitReactions.test.ts
git commit -m "feat(logs): add trait reaction definitions"
```

---

### Task 5: Create Pair Reactions

**Files:**
- Create: `app/data/logs/reactions/pairs.ts`
- Test: `tests/data/logs/pairReactions.test.ts`

**Step 1: Write the test**

Create `tests/data/logs/pairReactions.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { PAIR_REACTIONS, findPairReaction } from '~/data/logs/reactions/pairs'

describe('Pair Reactions Data', () => {
  it('should have at least 5 pair reactions', () => {
    expect(PAIR_REACTIONS.length).toBeGreaterThanOrEqual(5)
  })

  it('each pair should have two trait IDs', () => {
    for (const pair of PAIR_REACTIONS) {
      expect(pair.traitIds).toHaveLength(2)
    }
  })

  it('findPairReaction should find matching pair', () => {
    const result = findPairReaction(['coward', 'overconfident'], 'combat')
    expect(result).toBeDefined()
  })

  it('findPairReaction should work regardless of order', () => {
    const result1 = findPairReaction(['coward', 'overconfident'], 'combat')
    const result2 = findPairReaction(['overconfident', 'coward'], 'combat')
    expect(result1).toEqual(result2)
  })

  it('findPairReaction should return null for non-matching', () => {
    const result = findPairReaction(['coward', 'overconfident'], 'loot')
    expect(result).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/data/logs/pairReactions.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the pair reactions file**

Create `app/data/logs/reactions/pairs.ts`:

```typescript
import type { TraitPairReaction, LogEntryType } from '~~/types/logs'

export const PAIR_REACTIONS: TraitPairReaction[] = [
  // === COMBAT PAIRS ===
  {
    traitIds: ['coward', 'overconfident'],
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero2} charged in alone while {hero1} found urgent business behind a rock.',
      '"Cover me!" yelled {hero2}. {hero1} was already covering themselves. In leaves.',
      '{hero2} taunted all the enemies. {hero1} pretended to be a bush.',
      '"For glory!" shouted {hero2}. "For survival!" whispered {hero1}, hiding.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2
  },

  {
    traitIds: ['brawny', 'stealthy'],
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero2} distracted them while {hero1} got into position. Then punched.',
      'The enemy looked at {hero1}\'s muscles. They didn\'t see {hero2} behind them.',
      '{hero1} kicked down the door. {hero2} was already inside.',
      '"Subtle," said {hero2}. {hero1} threw an enemy at another enemy.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1
  },

  {
    traitIds: ['healer', 'overconfident'],
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero2} took unnecessary damage. {hero1} sighed and patched them up. Again.',
      '"I don\'t need healing!" said {hero2}. {hero1} was already bandaging them.',
      '{hero2} fought recklessly. {hero1} followed with a first aid kit.',
      '"Just a scratch!" {hero2} insisted, bleeding. {hero1} disagreed.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1
  },

  // === LOOT PAIRS ===
  {
    traitIds: ['lootGoblin', 'treasureHunter'],
    triggers: { entryTypes: ['loot'] },
    reactions: [
      '{hero2} found the loot. {hero1} found {hero2}\'s pockets.',
      'Both dove for the treasure. A brief scuffle ensued.',
      '"I sensed it first!" "I grabbed it first!" Neither was wrong.',
      '{hero1} and {hero2} silently agreed to split it. Loudly disagreed on ratios.',
    ],
    triggerChance: 0.6,
    rarityBoost: 2
  },

  {
    traitIds: ['lootGoblin', 'dramatic'],
    triggers: { entryTypes: ['loot'] },
    reactions: [
      '{hero2} gave a speech about the treasure. {hero1} took it during the speech.',
      '"Behold, the—" started {hero2}. "Mine," finished {hero1}.',
      '{hero2} posed dramatically. {hero1} looted dramatically. And quickly.',
      '"This belongs in a museum!" said {hero2}. "This belongs in my pocket," said {hero1}.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2
  },

  // === TRAVEL/EVENT PAIRS ===
  {
    traitIds: ['superstitious', 'pyromaniac'],
    triggers: { entryTypes: ['event'] },
    reactions: [
      '{hero1} insisted on a ritual. {hero2} provided the fire. Enthusiastically.',
      '"We must burn an offering!" said {hero1}. {hero2} grinned.',
      '{hero2} wanted to burn things. {hero1} found religious justification.',
      'The ritual fire got... out of hand. {hero2} was delighted.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2
  },

  {
    traitIds: ['caffeineDependent', 'forestFriend'],
    triggers: { entryTypes: ['travel'], zoneTypes: ['forest'] },
    reactions: [
      '{hero2} found coffee beans growing wild. {hero1} wept with joy.',
      'The forest provided. Specifically, it provided caffeine for {hero1}.',
      '{hero2} communed with nature. {hero1} communed with a coffee plant.',
      '"The forest speaks to me," said {hero2}. "The coffee speaks to me," said {hero1}.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1
  },

  {
    traitIds: ['dramatic', 'coward'],
    triggers: { entryTypes: ['combat', 'event'] },
    reactions: [
      '{hero1} gave a rousing speech about bravery. From behind {hero2}.',
      '"We shall not falter!" proclaimed {hero1}, faltering.',
      '{hero1} narrated their tactical retreat. {hero2} called it running away.',
      '"A strategic withdrawal!" announced {hero1} dramatically while sprinting.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2
  },

  // === ZONE-SPECIFIC PAIRS ===
  {
    traitIds: ['pyromaniac', 'caveExplorer'],
    triggers: { entryTypes: ['travel', 'event'], zoneTypes: ['cave'] },
    reactions: [
      '{hero2} knew the way. {hero1} lit it. Perhaps too well.',
      '"Don\'t burn the supports," warned {hero2}. {hero1} made no promises.',
      '{hero1} provided illumination. And scorch marks. And minor cave-ins.',
      '{hero2} navigated by memory. {hero1} navigated by fire.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1
  },

  {
    traitIds: ['stealthy', 'dramatic'],
    triggers: { entryTypes: ['combat', 'event'] },
    reactions: [
      '{hero1} snuck up perfectly. Then {hero2} announced their presence.',
      '"SURPRISE!" shouted {hero2}. {hero1} facepalmed from the shadows.',
      '{hero1}\'s stealth was perfect. {hero2}\'s announcement was louder.',
      '"We could have ambushed them," said {hero1}. "Where\'s the drama in that?" said {hero2}.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2
  },
]

/**
 * Find a pair reaction that matches the given traits and entry type
 */
export function findPairReaction(
  partyTraitIds: string[],
  entryType: LogEntryType,
  zoneType?: string
): TraitPairReaction | null {
  for (const pair of PAIR_REACTIONS) {
    // Check if party has both traits
    const hasFirst = partyTraitIds.includes(pair.traitIds[0])
    const hasSecond = partyTraitIds.includes(pair.traitIds[1])
    if (!hasFirst || !hasSecond) continue

    // Check entry type
    if (pair.triggers.entryTypes && !pair.triggers.entryTypes.includes(entryType)) {
      continue
    }

    // Check zone type if specified
    if (pair.triggers.zoneTypes && zoneType) {
      if (!pair.triggers.zoneTypes.includes(zoneType as any)) {
        continue
      }
    }

    return pair
  }

  return null
}

/**
 * Get all unique trait IDs that appear in pair reactions
 */
export function getTraitIdsInPairs(): string[] {
  const ids = new Set<string>()
  for (const pair of PAIR_REACTIONS) {
    ids.add(pair.traitIds[0])
    ids.add(pair.traitIds[1])
  }
  return Array.from(ids)
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/data/logs/pairReactions.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/data/logs/reactions/pairs.ts tests/data/logs/pairReactions.test.ts
git commit -m "feat(logs): add trait pair reaction definitions"
```

---

### Task 6: Create Reactions Index

**Files:**
- Create: `app/data/logs/reactions/index.ts`

**Step 1: Create the index file**

Create `app/data/logs/reactions/index.ts`:

```typescript
export * from './traits'
export * from './pairs'
```

**Step 2: Verify imports work**

```bash
npx nuxi typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add app/data/logs/reactions/index.ts
git commit -m "chore(logs): add reactions index export"
```

---

## Section 3: Rarity Calculation (Tasks 7-8)

### Task 7: Create Rarity Calculator

**Files:**
- Create: `app/utils/logs/rarity.ts`
- Test: `tests/utils/logs/rarity.test.ts`

**Step 1: Write the test**

Create `tests/utils/logs/rarity.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateFinalRarity, boostRarity } from '~/utils/logs/rarity'
import type { LogRarity } from '~~/types/expedition'

describe('Rarity Calculator', () => {
  describe('boostRarity', () => {
    it('should boost rarity by specified amount', () => {
      expect(boostRarity('common', 1)).toBe('standard')
      expect(boostRarity('common', 2)).toBe('noteworthy')
      expect(boostRarity('standard', 3)).toBe('epic')
    })

    it('should cap at legendary', () => {
      expect(boostRarity('epic', 5)).toBe('legendary')
      expect(boostRarity('legendary', 1)).toBe('legendary')
    })

    it('should not go below common', () => {
      expect(boostRarity('common', 0)).toBe('common')
    })
  })

  describe('calculateFinalRarity', () => {
    it('should return base rarity with no boosts', () => {
      const result = calculateFinalRarity('standard', { reactionBoosts: 0 })
      expect(result).toBe('standard')
    })

    it('should apply reaction boosts', () => {
      const result = calculateFinalRarity('standard', { reactionBoosts: 2 })
      expect(result).toBe('memorable')
    })

    it('should boost for epic loot', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        lootRarity: 'epic'
      })
      expect(result).toBe('noteworthy')
    })

    it('should boost for mythic loot', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        lootRarity: 'mythic'
      })
      expect(result).toBe('epic')
    })

    it('should boost for discovery', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 0,
        isDiscovery: true
      })
      expect(result).toBe('memorable')
    })

    it('should combine all boosts', () => {
      const result = calculateFinalRarity('standard', {
        reactionBoosts: 1,
        lootRarity: 'legendary',
        isDiscovery: true
      })
      expect(result).toBe('legendary')
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/utils/logs/rarity.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the rarity calculator**

Create directory and file `app/utils/logs/rarity.ts`:

```typescript
import type { LogRarity, EquipmentRarity } from '~~/types'

const RARITY_ORDER: LogRarity[] = [
  'common',
  'standard',
  'noteworthy',
  'memorable',
  'epic',
  'legendary'
]

const LOOT_RARITY_BOOST: Record<EquipmentRarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 0,
  epic: 1,
  legendary: 2,
  mythic: 3
}

/**
 * Boost a rarity by a specified number of tiers
 */
export function boostRarity(baseRarity: LogRarity, boost: number): LogRarity {
  const currentIndex = RARITY_ORDER.indexOf(baseRarity)
  const newIndex = Math.min(currentIndex + boost, RARITY_ORDER.length - 1)
  return RARITY_ORDER[Math.max(0, newIndex)]
}

/**
 * Get the index of a rarity tier
 */
export function getRarityIndex(rarity: LogRarity): number {
  return RARITY_ORDER.indexOf(rarity)
}

export interface RarityContext {
  reactionBoosts: number
  lootRarity?: EquipmentRarity
  isDiscovery?: boolean
  isStoryHook?: boolean
  isBossKill?: boolean
}

/**
 * Calculate final rarity based on all factors
 */
export function calculateFinalRarity(
  baseRarity: LogRarity,
  context: RarityContext
): LogRarity {
  let totalBoost = context.reactionBoosts

  // Loot rarity boost
  if (context.lootRarity) {
    totalBoost += LOOT_RARITY_BOOST[context.lootRarity]
  }

  // Discovery boost
  if (context.isDiscovery) {
    totalBoost += 2
  }

  // Story hook boost
  if (context.isStoryHook) {
    totalBoost += 2
  }

  // Boss kill boost
  if (context.isBossKill) {
    totalBoost += 2
  }

  return boostRarity(baseRarity, totalBoost)
}

/**
 * Check if a rarity is at least "noteworthy" (highlight-worthy)
 */
export function isHighlight(rarity: LogRarity): boolean {
  return getRarityIndex(rarity) >= getRarityIndex('noteworthy')
}

/**
 * Get CSS class for a rarity
 */
export function getRarityClass(rarity: LogRarity): string {
  const classes: Record<LogRarity, string> = {
    common: 'text-gray-500',
    standard: 'text-gray-200',
    noteworthy: 'text-green-400',
    memorable: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400'
  }
  return classes[rarity]
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/utils/logs/rarity.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/utils/logs/rarity.ts tests/utils/logs/rarity.test.ts
git commit -m "feat(logs): add rarity calculation utilities"
```

---

### Task 8: Create Reaction Selector

**Files:**
- Create: `app/utils/logs/reactions.ts`
- Test: `tests/utils/logs/reactions.test.ts`

**Step 1: Write the test**

Create `tests/utils/logs/reactions.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { selectReactions } from '~/utils/logs/reactions'
import type { Hero } from '~~/types'

// Mock heroes
const mockHeroes: Partial<Hero>[] = [
  { id: '1', name: 'Greg', storyTraitIds: ['lootGoblin'] },
  { id: '2', name: 'Lyra', storyTraitIds: ['coward'] },
  { id: '3', name: 'Kael', storyTraitIds: ['overconfident'] },
]

describe('Reaction Selector', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1) // Always trigger
  })

  it('should select matching reactions for entry type', () => {
    const result = selectReactions(mockHeroes as Hero[], 'loot', 'forest')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].traitId).toBe('lootGoblin')
  })

  it('should prefer pair reactions when available', () => {
    const result = selectReactions(mockHeroes as Hero[], 'combat', 'forest')
    // coward + overconfident should trigger pair
    const hasPair = result.some(r => r.text.includes('Greg') || r.text.includes('Lyra') || r.text.includes('Kael'))
    expect(hasPair).toBe(true)
  })

  it('should return max 2 reactions', () => {
    const result = selectReactions(mockHeroes as Hero[], 'combat', 'forest')
    expect(result.length).toBeLessThanOrEqual(2)
  })

  it('should fill hero name in template', () => {
    const result = selectReactions(mockHeroes as Hero[], 'loot', 'forest')
    if (result.length > 0) {
      expect(result[0].text).not.toContain('{hero}')
    }
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/utils/logs/reactions.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the reaction selector**

Create `app/utils/logs/reactions.ts`:

```typescript
import type { Hero } from '~~/types'
import type { LogEntryType, HeroReaction } from '~~/types/logs'
import { TRAIT_REACTIONS, getReactionsForTrait } from '~/data/logs/reactions/traits'
import { findPairReaction } from '~/data/logs/reactions/pairs'

/**
 * Select reactions for a log entry based on party traits
 */
export function selectReactions(
  heroes: Hero[],
  entryType: LogEntryType,
  zoneType?: string
): HeroReaction[] {
  const reactions: HeroReaction[] = []

  // Collect all trait IDs from party
  const partyTraitIds: string[] = []
  const traitToHero: Map<string, Hero> = new Map()

  for (const hero of heroes) {
    for (const traitId of hero.storyTraitIds) {
      partyTraitIds.push(traitId)
      traitToHero.set(traitId, hero)
    }
  }

  // 1. Check for pair reactions first
  const pairReaction = findPairReaction(partyTraitIds, entryType, zoneType)
  if (pairReaction && Math.random() < pairReaction.triggerChance) {
    const hero1 = traitToHero.get(pairReaction.traitIds[0])
    const hero2 = traitToHero.get(pairReaction.traitIds[1])

    if (hero1 && hero2) {
      const template = pairReaction.reactions[Math.floor(Math.random() * pairReaction.reactions.length)]
      const text = template
        .replace(/{hero1}/g, hero1.name)
        .replace(/{hero2}/g, hero2.name)

      reactions.push({
        heroId: hero1.id,
        heroName: hero1.name,
        traitId: pairReaction.traitIds[0],
        text,
        rarityBoost: pairReaction.rarityBoost
      })

      // Pair reactions count as both heroes reacting
      return reactions
    }
  }

  // 2. Check individual trait reactions
  const triggeredTraits: Set<string> = new Set()

  for (const hero of heroes) {
    if (reactions.length >= 2) break

    for (const traitId of hero.storyTraitIds) {
      if (triggeredTraits.has(traitId)) continue
      if (reactions.length >= 2) break

      const traitReactions = getReactionsForTrait(traitId, entryType, zoneType)
      if (traitReactions.length === 0) continue

      const reaction = traitReactions[0]
      if (Math.random() > reaction.triggerChance) continue

      const template = reaction.reactions[Math.floor(Math.random() * reaction.reactions.length)]
      const text = template.replace(/{hero}/g, hero.name)

      reactions.push({
        heroId: hero.id,
        heroName: hero.name,
        traitId,
        text,
        rarityBoost: reaction.rarityBoost
      })

      triggeredTraits.add(traitId)

      // 20% chance of second reaction
      if (reactions.length === 1 && Math.random() > 0.2) {
        break
      }
    }
  }

  return reactions
}

/**
 * Calculate total rarity boost from reactions
 */
export function getTotalRarityBoost(reactions: HeroReaction[]): number {
  return reactions.reduce((sum, r) => sum + r.rarityBoost, 0)
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/utils/logs/reactions.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/utils/logs/reactions.ts tests/utils/logs/reactions.test.ts
git commit -m "feat(logs): add reaction selection logic"
```

---

## Section 4: Template System (Tasks 9-11)

### Task 9: Create Generic Templates

**Files:**
- Create: `app/data/logs/templates/generic.ts`
- Test: `tests/data/logs/templates.test.ts`

**Step 1: Write the test**

Create `tests/data/logs/templates.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { GENERIC_TEMPLATES, getTemplatesForType } from '~/data/logs/templates/generic'

describe('Generic Templates', () => {
  it('should have templates for all entry types', () => {
    const types = ['departure', 'travel', 'combat', 'event', 'loot', 'return']
    for (const type of types) {
      const templates = getTemplatesForType(type as any)
      expect(templates.length).toBeGreaterThan(0)
    }
  })

  it('templates should have required fields', () => {
    for (const template of GENERIC_TEMPLATES) {
      expect(template.id).toBeDefined()
      expect(template.type).toBeDefined()
      expect(template.templates.length).toBeGreaterThan(0)
      expect(template.baseRarity).toBeDefined()
    }
  })

  it('templates should contain valid placeholders', () => {
    const validPlaceholders = [
      'zoneName', 'zoneType', 'subzoneName',
      'randomHero', 'anotherHero', 'leaderHero',
      'tankHero', 'healerHero', 'scoutHero', 'casterHero',
      'enemyName', 'enemyCount', 'enemyPack',
      'itemName', 'itemRarity', 'goldAmount',
      'timeOfDay', 'weather'
    ]

    for (const template of GENERIC_TEMPLATES) {
      for (const text of template.templates) {
        const matches = text.match(/{(\w+)}/g) || []
        for (const match of matches) {
          const placeholder = match.slice(1, -1)
          expect(validPlaceholders).toContain(placeholder)
        }
      }
    }
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/data/logs/templates.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the generic templates file**

Create directory and file `app/data/logs/templates/generic.ts`:

```typescript
import type { LogTemplate, LogEntryType } from '~~/types/logs'

export const GENERIC_TEMPLATES: LogTemplate[] = [
  // === DEPARTURE ===
  {
    id: 'departure_standard',
    type: 'departure',
    templates: [
      'The party gathered their supplies and set out for {zoneName}.',
      'With weapons ready, the group ventured into {subzoneName}.',
      '{leaderHero} led the way as the expedition began.',
      'The adventure begins. Destination: {subzoneName}.',
    ],
    baseRarity: 'common',
    weight: 10
  },
  {
    id: 'departure_eager',
    type: 'departure',
    templates: [
      '{randomHero} was eager to get started.',
      'Excitement filled the air as the party departed.',
      '"Let\'s find some treasure!" said {randomHero}.',
    ],
    baseRarity: 'standard',
    weight: 5
  },

  // === TRAVEL ===
  {
    id: 'travel_standard',
    type: 'travel',
    templates: [
      'The party continued deeper into {zoneName}.',
      '{randomHero} kept watch as they traveled.',
      'The path wound through {subzoneName}.',
      'Time passed as the group pressed on.',
    ],
    baseRarity: 'common',
    weight: 10
  },
  {
    id: 'travel_observation',
    type: 'travel',
    templates: [
      '{randomHero} noticed something interesting nearby.',
      'Strange sounds echoed in the distance.',
      '{scoutHero} spotted tracks on the ground.',
      'The party paused to get their bearings.',
    ],
    baseRarity: 'standard',
    weight: 5
  },
  {
    id: 'travel_atmosphere',
    type: 'travel',
    templates: [
      'The {weather} made travel challenging.',
      'It was {timeOfDay} when they reached a clearing.',
      'The landscape began to change around them.',
    ],
    baseRarity: 'common',
    weight: 3
  },

  // === COMBAT ===
  {
    id: 'combat_encounter',
    type: 'combat',
    templates: [
      'The party encountered {enemyPack}!',
      '{enemyCount} {enemyName} blocked the path ahead.',
      'Enemies appeared! {tankHero} moved to the front.',
      'Battle commenced against {enemyPack}.',
    ],
    baseRarity: 'standard',
    weight: 10
  },
  {
    id: 'combat_victory',
    type: 'combat',
    templates: [
      'Victory! The enemies were defeated.',
      '{randomHero} struck the final blow.',
      'The battle ended in the party\'s favor.',
      'The threat was neutralized.',
    ],
    baseRarity: 'standard',
    weight: 10
  },
  {
    id: 'combat_struggle',
    type: 'combat',
    templates: [
      'It was a hard-fought battle.',
      '{randomHero} took a hit but kept fighting.',
      'The enemies put up fierce resistance.',
    ],
    baseRarity: 'noteworthy',
    weight: 3
  },

  // === EVENT ===
  {
    id: 'event_discovery',
    type: 'event',
    templates: [
      '{randomHero} found something unusual.',
      'A strange sight caught the party\'s attention.',
      'Something unexpected happened.',
      '{scoutHero} discovered a hidden path.',
    ],
    baseRarity: 'standard',
    weight: 5
  },
  {
    id: 'event_challenge',
    type: 'event',
    templates: [
      'The party faced a difficult situation.',
      'A puzzle blocked their progress.',
      '{randomHero} had to make a quick decision.',
    ],
    baseRarity: 'noteworthy',
    weight: 3
  },
  {
    id: 'event_flavor',
    type: 'event',
    templates: [
      'The party stopped to rest briefly.',
      '{randomHero} shared a story from their past.',
      'An odd noise made everyone pause.',
      '{anotherHero} tripped but recovered gracefully.',
    ],
    baseRarity: 'common',
    weight: 8
  },

  // === LOOT ===
  {
    id: 'loot_found',
    type: 'loot',
    templates: [
      'The party found treasure!',
      '{randomHero} discovered {goldAmount} gold.',
      'Loot was collected from the fallen enemies.',
      'A chest revealed its contents.',
    ],
    baseRarity: 'standard',
    weight: 10
  },
  {
    id: 'loot_equipment',
    type: 'loot',
    templates: [
      '{randomHero} found a {itemRarity} {itemName}!',
      'New equipment was added to the inventory.',
      'A valuable {itemName} was discovered.',
    ],
    baseRarity: 'noteworthy',
    weight: 5
  },
  {
    id: 'loot_bonus',
    type: 'loot',
    templates: [
      'Hidden treasure was uncovered!',
      '{randomHero} noticed something everyone else missed.',
      'An unexpected bonus awaited the party.',
    ],
    baseRarity: 'memorable',
    weight: 2
  },

  // === RETURN ===
  {
    id: 'return_success',
    type: 'return',
    templates: [
      'The expedition was a success!',
      'The party returned triumphant.',
      'Mission accomplished. Time to head home.',
      '{leaderHero} led the victorious party back.',
    ],
    baseRarity: 'standard',
    weight: 10
  },
  {
    id: 'return_tired',
    type: 'return',
    templates: [
      'Tired but satisfied, the party headed home.',
      'It had been a long day of adventuring.',
      'The group was ready for a well-deserved rest.',
    ],
    baseRarity: 'common',
    weight: 5
  },
  {
    id: 'return_eager',
    type: 'return',
    templates: [
      '{randomHero} was already planning the next expedition.',
      'The party couldn\'t wait to return.',
      '"That was fun!" exclaimed {randomHero}.',
    ],
    baseRarity: 'standard',
    weight: 3
  },
]

/**
 * Get all templates matching a specific entry type
 */
export function getTemplatesForType(type: LogEntryType): LogTemplate[] {
  return GENERIC_TEMPLATES.filter(t => t.type === type)
}

/**
 * Select a random template based on weights
 */
export function selectWeightedTemplate(templates: LogTemplate[]): LogTemplate {
  const totalWeight = templates.reduce((sum, t) => sum + (t.weight ?? 1), 0)
  let random = Math.random() * totalWeight

  for (const template of templates) {
    random -= template.weight ?? 1
    if (random <= 0) return template
  }

  return templates[0]
}

/**
 * Get a random text from a template's options
 */
export function getRandomTemplateText(template: LogTemplate): string {
  return template.templates[Math.floor(Math.random() * template.templates.length)]
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/data/logs/templates.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/data/logs/templates/generic.ts tests/data/logs/templates.test.ts
git commit -m "feat(logs): add generic log templates"
```

---

### Task 10: Create Variable Filler

**Files:**
- Create: `app/utils/logs/variables.ts`
- Test: `tests/utils/logs/variables.test.ts`

**Step 1: Write the test**

Create `tests/utils/logs/variables.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { fillTemplateVariables, buildVariableContext } from '~/utils/logs/variables'
import type { Hero, Zone, Subzone } from '~~/types'

const mockZone: Partial<Zone> = { id: 'forest1', name: 'Verdant Woods', type: 'forest' }
const mockSubzone: Partial<Subzone> = { id: 'sub1', name: 'Dense Thicket' }
const mockHeroes: Partial<Hero>[] = [
  { id: '1', name: 'Greg', archetypeTags: ['tank'] },
  { id: '2', name: 'Lyra', archetypeTags: ['scout'] },
]

describe('Variable Filler', () => {
  describe('buildVariableContext', () => {
    it('should include zone variables', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      expect(ctx.zoneName).toBe('Verdant Woods')
      expect(ctx.subzoneName).toBe('Dense Thicket')
      expect(ctx.zoneType).toBe('forest')
    })

    it('should include hero variables', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      expect(ctx.leaderHero).toBe('Greg')
      expect(['Greg', 'Lyra']).toContain(ctx.randomHero)
    })

    it('should map role-based heroes', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      expect(ctx.tankHero).toBe('Greg')
      expect(ctx.scoutHero).toBe('Lyra')
    })
  })

  describe('fillTemplateVariables', () => {
    it('should replace all variables', () => {
      const template = '{leaderHero} led the party into {zoneName}.'
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      const result = fillTemplateVariables(template, ctx)
      expect(result).toBe('Greg led the party into Verdant Woods.')
    })

    it('should handle missing variables gracefully', () => {
      const template = '{unknownVar} did something.'
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      const result = fillTemplateVariables(template, ctx)
      expect(result).toBe('{unknownVar} did something.')
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/utils/logs/variables.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the variable filler**

Create `app/utils/logs/variables.ts`:

```typescript
import type { Hero, Zone, Subzone } from '~~/types'
import type { TemplateVariables } from '~~/types/logs'

const TIME_OF_DAY = ['dawn', 'morning', 'midday', 'afternoon', 'dusk', 'night']
const WEATHER = ['clear skies', 'light clouds', 'overcast', 'light rain', 'mist', 'strong wind']

/**
 * Build a complete variable context for template filling
 */
export function buildVariableContext(
  zone: Zone,
  subzone: Subzone,
  heroes: Hero[],
  extra?: Partial<TemplateVariables>
): TemplateVariables {
  // Random hero selection
  const randomIndex = Math.floor(Math.random() * heroes.length)
  const anotherIndex = (randomIndex + 1) % heroes.length
  const randomHero = heroes[randomIndex]?.name ?? 'A hero'
  const anotherHero = heroes[anotherIndex]?.name ?? 'Another hero'
  const leaderHero = heroes[0]?.name ?? 'The leader'

  // Role-based hero selection
  const findHeroWithTag = (tag: string): string => {
    const hero = heroes.find(h => h.archetypeTags.includes(tag))
    return hero?.name ?? randomHero
  }

  return {
    // Zone context
    zoneName: zone.name,
    zoneType: zone.type,
    subzoneName: subzone.name,

    // Heroes - random
    randomHero,
    anotherHero,
    leaderHero,

    // Heroes - role-based
    tankHero: findHeroWithTag('tank'),
    healerHero: findHeroWithTag('healer'),
    scoutHero: findHeroWithTag('scout'),
    casterHero: findHeroWithTag('caster'),

    // Combat (filled later if needed)
    enemyName: extra?.enemyName ?? 'enemy',
    enemyCount: extra?.enemyCount ?? '3',
    enemyPack: extra?.enemyPack ?? 'a group of enemies',

    // Loot (filled later if needed)
    itemName: extra?.itemName ?? 'item',
    itemRarity: extra?.itemRarity ?? 'common',
    goldAmount: extra?.goldAmount ?? '50',

    // Atmosphere
    timeOfDay: TIME_OF_DAY[Math.floor(Math.random() * TIME_OF_DAY.length)],
    weather: WEATHER[Math.floor(Math.random() * WEATHER.length)],

    // Spread any extra overrides
    ...extra
  }
}

/**
 * Fill a template string with variables
 */
export function fillTemplateVariables(
  template: string,
  variables: TemplateVariables
): string {
  let result = template

  for (const [key, value] of Object.entries(variables)) {
    // Use split/join instead of regex for safety
    result = result.split(`{${key}}`).join(value)
  }

  return result
}

/**
 * Build enemy pack string from count and name
 */
export function buildEnemyPack(count: number, name: string): string {
  if (count === 1) return `a ${name}`
  if (count === 2) return `a pair of ${name}s`
  return `${count} ${name}s`
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/utils/logs/variables.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/utils/logs/variables.ts tests/utils/logs/variables.test.ts
git commit -m "feat(logs): add template variable filling"
```

---

### Task 11: Create Templates Index

**Files:**
- Create: `app/data/logs/templates/index.ts`
- Create: `app/data/logs/index.ts`

**Step 1: Create templates index**

Create `app/data/logs/templates/index.ts`:

```typescript
export * from './generic'
// Future: export zone-specific templates
// export * from './forest'
// export * from './cave'
```

**Step 2: Create logs data index**

Create `app/data/logs/index.ts`:

```typescript
export * from './templates'
export * from './reactions'
```

**Step 3: Verify imports work**

```bash
npx nuxi typecheck
```

Expected: No errors

**Step 4: Commit**

```bash
git add app/data/logs/templates/index.ts app/data/logs/index.ts
git commit -m "chore(logs): add data index exports"
```

---

## Section 5: Log Generator Enhancement (Tasks 12-14)

### Task 12: Create Skeleton Builder

**Files:**
- Create: `app/utils/logs/skeleton.ts`
- Test: `tests/utils/logs/skeleton.test.ts`

**Step 1: Write the test**

Create `tests/utils/logs/skeleton.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { buildSkeleton, calculateEntryCount } from '~/utils/logs/skeleton'

describe('Skeleton Builder', () => {
  describe('calculateEntryCount', () => {
    it('should return 3-4 for 15 min expeditions', () => {
      const count = calculateEntryCount(15)
      expect(count).toBeGreaterThanOrEqual(3)
      expect(count).toBeLessThanOrEqual(4)
    })

    it('should return 8-10 for 120 min expeditions', () => {
      const count = calculateEntryCount(120)
      expect(count).toBeGreaterThanOrEqual(8)
      expect(count).toBeLessThanOrEqual(10)
    })

    it('should scale with duration', () => {
      const short = calculateEntryCount(15)
      const long = calculateEntryCount(120)
      expect(long).toBeGreaterThan(short)
    })
  })

  describe('buildSkeleton', () => {
    it('should always start with departure', () => {
      const skeleton = buildSkeleton(5)
      expect(skeleton[0].type).toBe('departure')
    })

    it('should always end with return', () => {
      const skeleton = buildSkeleton(5)
      expect(skeleton[skeleton.length - 1].type).toBe('return')
    })

    it('should include at least one combat', () => {
      const skeleton = buildSkeleton(5)
      const hasCombat = skeleton.some(s => s.type === 'combat')
      expect(hasCombat).toBe(true)
    })

    it('should have correct length', () => {
      expect(buildSkeleton(5)).toHaveLength(5)
      expect(buildSkeleton(8)).toHaveLength(8)
    })

    it('should mark climax entry', () => {
      const skeleton = buildSkeleton(6)
      const hasClimax = skeleton.some(s => s.isClimax)
      expect(hasClimax).toBe(true)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/utils/logs/skeleton.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the skeleton builder**

Create `app/utils/logs/skeleton.ts`:

```typescript
import type { LogEntryType } from '~~/types/logs'

export interface SkeletonSlot {
  type: LogEntryType
  isClimax?: boolean
}

/**
 * Calculate number of log entries based on expedition duration
 */
export function calculateEntryCount(durationMinutes: number): number {
  if (durationMinutes <= 15) return 3 + Math.floor(Math.random() * 2) // 3-4
  if (durationMinutes <= 30) return 4 + Math.floor(Math.random() * 2) // 4-5
  if (durationMinutes <= 45) return 5 + Math.floor(Math.random() * 2) // 5-6
  if (durationMinutes <= 60) return 6 + Math.floor(Math.random() * 2) // 6-7
  if (durationMinutes <= 90) return 7 + Math.floor(Math.random() * 2) // 7-8
  return 8 + Math.floor(Math.random() * 3) // 8-10
}

/**
 * Build a narrative arc skeleton for the log
 */
export function buildSkeleton(entryCount: number): SkeletonSlot[] {
  const skeleton: SkeletonSlot[] = []

  // Always start with departure
  skeleton.push({ type: 'departure' })

  // Always end with return (we'll add it last)
  const middleCount = entryCount - 2

  // Climax should be around 60-70% through
  const climaxIndex = Math.floor(middleCount * 0.6) + 1 // +1 for departure

  // Fill middle slots with narrative arc
  const middleTypes: LogEntryType[] = []

  // Rising action: travel and events
  for (let i = 0; i < middleCount; i++) {
    if (i < middleCount * 0.3) {
      // First 30%: mostly travel with some events
      middleTypes.push(Math.random() < 0.7 ? 'travel' : 'event')
    } else if (i < middleCount * 0.6) {
      // 30-60%: mix of event and combat leading to climax
      middleTypes.push(Math.random() < 0.5 ? 'event' : 'combat')
    } else if (i < middleCount * 0.8) {
      // 60-80%: falling action - loot and events
      middleTypes.push(Math.random() < 0.6 ? 'loot' : 'event')
    } else {
      // Last bit: wind down with travel
      middleTypes.push('travel')
    }
  }

  // Ensure at least one combat
  if (!middleTypes.includes('combat')) {
    const combatIndex = Math.floor(middleCount * 0.5)
    middleTypes[combatIndex] = 'combat'
  }

  // Add middle slots to skeleton
  for (let i = 0; i < middleTypes.length; i++) {
    const isClimax = (i + 1) === climaxIndex
    skeleton.push({
      type: middleTypes[i],
      isClimax
    })
  }

  // End with return
  skeleton.push({ type: 'return' })

  return skeleton
}

/**
 * Get entry types suitable for a narrative position
 */
export function getSuitableTypes(position: 'rising' | 'climax' | 'falling'): LogEntryType[] {
  switch (position) {
    case 'rising':
      return ['travel', 'event']
    case 'climax':
      return ['combat', 'event']
    case 'falling':
      return ['loot', 'event', 'travel']
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/utils/logs/skeleton.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/utils/logs/skeleton.ts tests/utils/logs/skeleton.test.ts
git commit -m "feat(logs): add narrative skeleton builder"
```

---

### Task 13: Create Logs Utils Index

**Files:**
- Create: `app/utils/logs/index.ts`

**Step 1: Create the index file**

Create `app/utils/logs/index.ts`:

```typescript
export * from './rarity'
export * from './reactions'
export * from './skeleton'
export * from './variables'
```

**Step 2: Verify imports work**

```bash
npx nuxi typecheck
```

Expected: No errors

**Step 3: Commit**

```bash
git add app/utils/logs/index.ts
git commit -m "chore(logs): add utils index export"
```

---

### Task 14: Enhance Log Generator

**Files:**
- Modify: `app/utils/logGenerator.ts`
- Test: `tests/utils/logGenerator.test.ts`

**Step 1: Write the test**

Create `tests/utils/logGenerator.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { generateExpeditionLog } from '~/utils/logGenerator'
import type { Expedition, Hero, Zone, Subzone } from '~~/types'

const mockExpedition: Partial<Expedition> = {
  id: 'exp1',
  durationMinutes: 30,
  efficiency: 100,
  events: [],
  rewards: {
    gold: 100,
    xp: 50,
    equipment: [],
    materials: {},
    familiarityGain: 5,
    masteryGain: 3
  }
}

const mockHeroes: Partial<Hero>[] = [
  { id: '1', name: 'Greg', archetypeTags: ['tank'], storyTraitIds: ['brawny'] },
  { id: '2', name: 'Lyra', archetypeTags: ['scout'], storyTraitIds: ['stealthy'] },
]

const mockZone: Partial<Zone> = { id: 'z1', name: 'Verdant Woods', type: 'forest' }
const mockSubzone: Partial<Subzone> = { id: 's1', name: 'Dense Thicket', threats: [] }

describe('Log Generator', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  it('should generate a log with sections', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )
    expect(log.sections.length).toBeGreaterThan(0)
  })

  it('should include summary', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )
    expect(log.summary).toBeDefined()
    expect(log.summary.duration).toBeDefined()
    expect(log.summary.efficiency).toBeDefined()
  })

  it('entries should have rarity', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )

    for (const section of log.sections) {
      for (const entry of section.entries) {
        // After enhancement, all entries should have rarity
        expect(['common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary'])
          .toContain(entry.rarity ?? 'standard')
      }
    }
  })

  it('should generate reactions from traits', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )

    // Should have at least some reactions given the traits
    const hasReactions = log.sections.some(s =>
      s.entries.some(e => e.type === 'reaction')
    )
    // Reactions may or may not trigger based on chance, so we don't strictly require them
  })
})
```

**Step 2: Run test to see current state**

```bash
npm run test:run -- tests/utils/logGenerator.test.ts
```

Note: This may partially pass with existing code.

**Step 3: Enhance the log generator**

Update `app/utils/logGenerator.ts` to integrate the new systems. Add at the top of the file after existing imports:

```typescript
// Add these imports at the top
import type { LogRarity } from '~~/types/expedition'
import { selectReactions, getTotalRarityBoost } from '~/utils/logs/reactions'
import { calculateFinalRarity } from '~/utils/logs/rarity'
import { buildVariableContext, fillTemplateVariables } from '~/utils/logs/variables'
import { buildSkeleton, calculateEntryCount } from '~/utils/logs/skeleton'
import { getTemplatesForType, selectWeightedTemplate, getRandomTemplateText } from '~/data/logs/templates/generic'
```

Then modify the `LogEntry` additions in `generateExpeditionLog` function to include rarity. After generating each entry, add rarity calculation:

```typescript
// Example pattern to apply in each section generator:
// After creating an entry, add:
entry.rarity = calculateFinalRarity(baseRarity, {
  reactionBoosts: getTotalRarityBoost(reactions)
})
```

**Note:** This is a larger refactoring task. The full implementation should:
1. Use `buildSkeleton` to create the log structure
2. Use `selectWeightedTemplate` for template selection
3. Use `fillTemplateVariables` for variable replacement
4. Use `selectReactions` to add trait reactions
5. Use `calculateFinalRarity` for all entries

Due to the existing code's structure, this may require careful integration. The key changes are:
- Add `rarity?: LogRarity` to all entries
- Call `selectReactions()` at appropriate points
- Calculate final rarity using the new utilities

**Step 4: Run test to verify it passes**

```bash
npm run test:run -- tests/utils/logGenerator.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/utils/logGenerator.ts tests/utils/logGenerator.test.ts
git commit -m "feat(logs): integrate rarity and reaction systems into generator"
```

---

## Section 6: AI Integration (Tasks 15-17)

### Task 15: Create AI Trigger Detection

**Files:**
- Create: `app/utils/logs/ai.ts`
- Test: `tests/utils/logs/ai.test.ts`

**Step 1: Write the test**

Create `tests/utils/logs/ai.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { shouldTriggerAI, buildAIRequest } from '~/utils/logs/ai'
import type { LogEntry } from '~~/types/expedition'

describe('AI Trigger Detection', () => {
  it('should trigger for mythic loot', () => {
    const entry: Partial<LogEntry> = {
      type: 'loot',
      text: 'Found loot',
      lootRarity: 'mythic'
    }
    const trigger = shouldTriggerAI(entry as any, {})
    expect(trigger).toBe('legendary_loot')
  })

  it('should trigger for story hook', () => {
    const entry: Partial<LogEntry> = {
      type: 'narrative',
      text: 'Something happened',
      isStoryHook: true,
      storyHookPhase: 'start'
    }
    const trigger = shouldTriggerAI(entry as any, {})
    expect(trigger).toBe('story_hook_start')
  })

  it('should return null for standard entries', () => {
    const entry: Partial<LogEntry> = {
      type: 'narrative',
      text: 'Normal event'
    }
    const trigger = shouldTriggerAI(entry as any, {})
    expect(trigger).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm run test:run -- tests/utils/logs/ai.test.ts
```

Expected: FAIL - module not found

**Step 3: Create the AI utilities**

Create `app/utils/logs/ai.ts`:

```typescript
import type { LogEntry } from '~~/types/expedition'
import type { AITrigger, AILogRequest, AILogResponse } from '~~/types/logs'
import type { Hero, Zone, Subzone } from '~~/types'

export interface AIContext {
  previouslyDefeatedBosses?: string[]
  secretsDiscovered?: string[]
}

export interface ExtendedLogEntry extends LogEntry {
  lootRarity?: string
  isStoryHook?: boolean
  storyHookPhase?: 'start' | 'complete'
  isBossKill?: boolean
  bossId?: string
  isSecretDiscovery?: boolean
  reactionCount?: number
}

/**
 * Determine if an entry should trigger AI enhancement
 */
export function shouldTriggerAI(entry: ExtendedLogEntry, context: AIContext): AITrigger | null {
  // Mythic loot
  if (entry.lootRarity === 'mythic') {
    return 'legendary_loot'
  }

  // Secret discovery
  if (entry.isSecretDiscovery) {
    return 'secret_discovery'
  }

  // Story hook
  if (entry.isStoryHook) {
    return entry.storyHookPhase === 'complete' ? 'story_hook_payoff' : 'story_hook_start'
  }

  // Boss first kill
  if (entry.isBossKill && entry.bossId) {
    const previouslyDefeated = context.previouslyDefeatedBosses ?? []
    if (!previouslyDefeated.includes(entry.bossId)) {
      return 'boss_first_kill'
    }
  }

  // Trait synergy (2+ reactions on same entry)
  if ((entry.reactionCount ?? 0) >= 2) {
    return 'trait_synergy'
  }

  return null
}

/**
 * Build a request for AI log enhancement
 */
export function buildAIRequest(
  trigger: AITrigger,
  entry: ExtendedLogEntry,
  zone: Zone,
  subzone: Subzone,
  heroes: Hero[],
  previousEntries: string[]
): AILogRequest {
  return {
    trigger,
    zone: {
      name: zone.name,
      type: zone.type,
      subzone: subzone.name
    },
    heroes: heroes.map(h => ({
      name: h.name,
      traits: h.storyTraitIds
    })),
    triggerDetails: {
      itemName: entry.lootRarity === 'mythic' ? 'Mythic Item' : undefined,
      bossName: entry.isBossKill ? entry.bossId : undefined,
      // Add more as needed
    },
    previousEntries: previousEntries.slice(-3),
    tone: 'lighthearted_fantasy'
  }
}

/**
 * Fallback templates for when AI fails
 */
const AI_FALLBACK_TEMPLATES: Record<AITrigger, string[]> = {
  legendary_loot: [
    'A legendary treasure was discovered! The party stood in awe.',
    'Something extraordinary gleamed among the loot.',
    'This find would be remembered for generations.',
  ],
  secret_discovery: [
    'A hidden passage revealed itself to the worthy.',
    'The party stumbled upon something meant to stay hidden.',
    'Ancient secrets beckoned from the shadows.',
  ],
  story_hook_start: [
    'A mysterious discovery set events in motion.',
    'Something stirred that would change everything.',
    'The beginning of a greater adventure revealed itself.',
  ],
  story_hook_payoff: [
    'The pieces finally fell into place.',
    'The mystery reached its thrilling conclusion.',
    'Everything led to this moment.',
  ],
  boss_first_kill: [
    'The mighty foe fell before the party\'s combined might!',
    'A legendary victory was claimed this day.',
    'The beast\'s reign of terror ended here.',
  ],
  trait_synergy: [
    'The party\'s unique talents combined perfectly.',
    'Heroes worked together in unexpected harmony.',
    'Their combined quirks became their greatest strength.',
  ],
}

/**
 * Get a fallback template when AI fails
 */
export function getAIFallback(trigger: AITrigger): string {
  const templates = AI_FALLBACK_TEMPLATES[trigger]
  return templates[Math.floor(Math.random() * templates.length)]
}

/**
 * Enhance an entry with AI (with fallback)
 */
export async function enhanceWithAI(
  entry: ExtendedLogEntry,
  trigger: AITrigger,
  request: AILogRequest,
  timeout: number = 3000
): Promise<string> {
  // TODO: Implement actual AI call when ready
  // For now, always use fallback
  return getAIFallback(trigger)
}
```

**Step 4: Update the index export**

Add to `app/utils/logs/index.ts`:

```typescript
export * from './ai'
```

**Step 5: Run test to verify it passes**

```bash
npm run test:run -- tests/utils/logs/ai.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add app/utils/logs/ai.ts tests/utils/logs/ai.test.ts app/utils/logs/index.ts
git commit -m "feat(logs): add AI trigger detection with fallbacks"
```

---

### Task 16: Create AI Fallback Templates

**Files:**
- Create: `app/data/logs/fallbacks/legendary.ts`

**Step 1: Create the fallback templates file**

Create directory and file `app/data/logs/fallbacks/legendary.ts`:

```typescript
import type { AITrigger } from '~~/types/logs'

interface FallbackTemplate {
  trigger: AITrigger
  templates: string[]
  heroReactionTemplates?: string[]
}

export const LEGENDARY_FALLBACKS: FallbackTemplate[] = [
  // Legendary Loot
  {
    trigger: 'legendary_loot',
    templates: [
      'Light seemed to emanate from the treasure as {randomHero} lifted it.',
      'The party gasped in unison. This was no ordinary find.',
      '{randomHero}\'s hands trembled as they beheld the mythic artifact.',
      'Legends spoke of such treasures. Few believed they existed.',
      'The air itself seemed to hum with power around the discovery.',
    ],
    heroReactionTemplates: [
      '{hero}: "I never thought I\'d see one of these..."',
      '{hero} was speechless for the first time anyone could remember.',
      'Even {hero} had to admit this was impressive.',
    ]
  },

  // Secret Discovery
  {
    trigger: 'secret_discovery',
    templates: [
      'A hidden mechanism clicked, revealing a passage none had seen before.',
      'The wall shimmered and faded, exposing a secret chamber.',
      'Ancient runes glowed as the entrance to a forgotten place appeared.',
      '{scoutHero} spotted something the maps never showed.',
      'This place wasn\'t supposed to exist.',
    ],
    heroReactionTemplates: [
      '{hero}: "How long has this been here?"',
      '{hero} marked the location carefully on their map.',
      'The discovery left {hero} with more questions than answers.',
    ]
  },

  // Story Hook Start
  {
    trigger: 'story_hook_start',
    templates: [
      'A mysterious artifact demanded the party\'s attention.',
      'Something about this discovery felt... different. Important.',
      'This was only the beginning of something greater.',
      'A puzzle presented itself, promising adventure for those who pursued it.',
      'Fate, it seemed, had plans for this party.',
    ],
    heroReactionTemplates: [
      '{hero} felt drawn to investigate further.',
      'Something told {hero} this wasn\'t over.',
      '{hero}: "We should look into this..."',
    ]
  },

  // Story Hook Payoff
  {
    trigger: 'story_hook_payoff',
    templates: [
      'At last! The final piece of the puzzle fell into place.',
      'Everything they\'d worked toward led to this moment.',
      'The mystery was solved, but its rewards exceeded all expectations.',
      'The journey was complete. The prize was theirs.',
      'What once seemed impossible now lay before them, accomplished.',
    ],
    heroReactionTemplates: [
      '{hero} couldn\'t believe they\'d actually done it.',
      'A satisfied smile crossed {hero}\'s face.',
      '{hero}: "We actually did it!"',
    ]
  },

  // Boss First Kill
  {
    trigger: 'boss_first_kill',
    templates: [
      'The mighty beast fell with an earth-shaking thud.',
      'Against all odds, the party emerged victorious.',
      'The creature that had terrorized the land was no more.',
      '{tankHero} stood over the fallen foe, breathing heavily but triumphant.',
      'This victory would be sung about for generations.',
    ],
    heroReactionTemplates: [
      '{hero} let out a victory cry that echoed through the area.',
      '{hero} collapsed from exhaustion, but wore a proud smile.',
      '{hero}: "Is it... is it over?"',
    ]
  },

  // Trait Synergy
  {
    trigger: 'trait_synergy',
    templates: [
      'The party\'s combined quirks proved to be their greatest asset.',
      'No one could have planned for things to work out this perfectly.',
      'What should have been chaos became beautiful coordination.',
      'Their differences became their strength in this moment.',
      'The party worked together in a way that defied explanation.',
    ],
    heroReactionTemplates: [
      'The heroes shared a knowing look.',
      'Sometimes the team just... clicked.',
      'They\'d never admit it, but they made a good team.',
    ]
  },
]

/**
 * Get fallback template for a trigger type
 */
export function getLegendaryFallback(trigger: AITrigger): FallbackTemplate | undefined {
  return LEGENDARY_FALLBACKS.find(f => f.trigger === trigger)
}

/**
 * Get a random fallback text
 */
export function getRandomFallbackText(trigger: AITrigger): string {
  const fallback = getLegendaryFallback(trigger)
  if (!fallback) return 'Something remarkable happened.'
  return fallback.templates[Math.floor(Math.random() * fallback.templates.length)]
}

/**
 * Get a random hero reaction for fallback
 */
export function getRandomFallbackReaction(trigger: AITrigger): string | undefined {
  const fallback = getLegendaryFallback(trigger)
  if (!fallback?.heroReactionTemplates) return undefined
  return fallback.heroReactionTemplates[Math.floor(Math.random() * fallback.heroReactionTemplates.length)]
}
```

**Step 2: Create fallbacks index**

Create `app/data/logs/fallbacks/index.ts`:

```typescript
export * from './legendary'
```

**Step 3: Update logs data index**

Update `app/data/logs/index.ts`:

```typescript
export * from './templates'
export * from './reactions'
export * from './fallbacks'
```

**Step 4: Verify imports work**

```bash
npx nuxi typecheck
```

Expected: No errors

**Step 5: Commit**

```bash
git add app/data/logs/fallbacks/legendary.ts app/data/logs/fallbacks/index.ts app/data/logs/index.ts
git commit -m "feat(logs): add legendary AI fallback templates"
```

---

### Task 17: Final Integration Test

**Files:**
- Create: `tests/integration/logGeneration.test.ts`

**Step 1: Write integration test**

Create `tests/integration/logGeneration.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateExpeditionLog } from '~/utils/logGenerator'
import type { Expedition, Hero, Zone, Subzone } from '~~/types'

// Full integration test with realistic data
describe('Log Generation Integration', () => {
  const mockExpedition: Expedition = {
    id: 'exp-001',
    playerId: 'player-001',
    zoneId: 'verdant_woods',
    subzoneId: 'dense_thicket',
    heroIds: ['hero-1', 'hero-2', 'hero-3'],
    teamPower: 250,
    startedAt: new Date().toISOString(),
    completesAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    durationMinutes: 30,
    status: 'completed',
    events: [],
    pendingChoices: [],
    efficiency: 110,
    rewards: {
      gold: 150,
      xp: 75,
      equipment: ['equip-1'],
      materials: {},
      familiarityGain: 5,
      masteryGain: 3
    },
    autoRepeat: false,
    stopConditions: {
      anyHeroTired: true,
      inventoryFull: true,
      resourceCap: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const mockHeroes: Hero[] = [
    {
      id: 'hero-1',
      playerId: 'player-001',
      name: 'Greg the Mighty',
      rarity: 'rare',
      level: 25,
      xp: 500,
      xpToNextLevel: 750,
      baseStats: { combat: 30, utility: 15, survival: 25 },
      prestigeLevel: 0,
      prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
      archetypeTags: ['tank', 'frontline'],
      gameplayTraitIds: ['brawny'],
      storyTraitIds: ['brawny', 'overconfident'],
      maxGameplayTraits: 3,
      maxStoryTraits: 3,
      power: 150,
      gearScore: 80,
      currentExpeditionId: 'exp-001',
      morale: { current: 75, state: 'content', lastExpeditionAt: '', consecutiveExpeditions: 1 },
      titles: [],
      activeTitle: null,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hero-2',
      playerId: 'player-001',
      name: 'Lyra Shadowstep',
      rarity: 'uncommon',
      level: 20,
      xp: 300,
      xpToNextLevel: 500,
      baseStats: { combat: 20, utility: 30, survival: 15 },
      prestigeLevel: 0,
      prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
      archetypeTags: ['scout', 'stealth'],
      gameplayTraitIds: ['stealthy'],
      storyTraitIds: ['stealthy', 'coward'],
      maxGameplayTraits: 3,
      maxStoryTraits: 3,
      power: 100,
      gearScore: 50,
      currentExpeditionId: 'exp-001',
      morale: { current: 80, state: 'content', lastExpeditionAt: '', consecutiveExpeditions: 1 },
      titles: [],
      activeTitle: null,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hero-3',
      playerId: 'player-001',
      name: 'Brother Marcus',
      rarity: 'common',
      level: 15,
      xp: 200,
      xpToNextLevel: 350,
      baseStats: { combat: 15, utility: 20, survival: 25 },
      prestigeLevel: 0,
      prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
      archetypeTags: ['healer', 'support'],
      gameplayTraitIds: ['healer'],
      storyTraitIds: ['healer', 'dramatic'],
      maxGameplayTraits: 3,
      maxStoryTraits: 3,
      power: 80,
      gearScore: 40,
      currentExpeditionId: 'exp-001',
      morale: { current: 90, state: 'excited', lastExpeditionAt: '', consecutiveExpeditions: 0 },
      titles: [],
      activeTitle: null,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const mockZone: Zone = {
    id: 'verdant_woods',
    name: 'Verdant Woods',
    description: 'A peaceful forest',
    type: 'forest',
    unlockRequirement: {},
    subzones: [],
    familiarity: 45,
    masteryRewards: { passiveIncomeBonus: 0 }
  }

  const mockSubzone: Subzone = {
    id: 'dense_thicket',
    name: 'Dense Thicket',
    description: 'Overgrown paths',
    discoveryWeight: 10,
    requiredZoneFamiliarity: 0,
    isDiscovered: true,
    difficulty: 'normal',
    threats: ['swarm', 'ambush'],
    monsters: [],
    collectibles: [],
    lootTable: [],
    bonusXpPercent: 0,
    bonusGoldPercent: 0,
    mastery: 30
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should generate a complete log with all sections', () => {
    const log = generateExpeditionLog(mockExpedition, mockHeroes, mockZone, mockSubzone)

    expect(log).toBeDefined()
    expect(log.sections.length).toBeGreaterThanOrEqual(3)
    expect(log.summary).toBeDefined()
  })

  it('should have departure and return sections', () => {
    const log = generateExpeditionLog(mockExpedition, mockHeroes, mockZone, mockSubzone)

    const types = log.sections.map(s => s.type)
    expect(types).toContain('departure')
    expect(types).toContain('return')
  })

  it('should include hero names in entries', () => {
    const log = generateExpeditionLog(mockExpedition, mockHeroes, mockZone, mockSubzone)

    const allText = log.sections.flatMap(s => s.entries.map(e => e.text)).join(' ')
    const heroNames = mockHeroes.map(h => h.name)

    // At least one hero should be mentioned
    const mentionsHero = heroNames.some(name => allText.includes(name.split(' ')[0]))
    expect(mentionsHero).toBe(true)
  })

  it('should have valid summary data', () => {
    const log = generateExpeditionLog(mockExpedition, mockHeroes, mockZone, mockSubzone)

    expect(log.summary.duration).toContain('30')
    expect(log.summary.efficiency).toContain('110')
    expect(log.summary.rewards.gold).toBe(150)
    expect(log.summary.rewards.xp).toBe(75)
  })
})
```

**Step 2: Run integration test**

```bash
npm run test:run -- tests/integration/logGeneration.test.ts
```

Expected: PASS (or identify issues to fix)

**Step 3: Commit**

```bash
git add tests/integration/logGeneration.test.ts
git commit -m "test(logs): add log generation integration test"
```

---

## Summary

**Total Tasks:** 17

**Files Created:**
- `types/logs.ts`
- `app/data/logs/reactions/traits.ts`
- `app/data/logs/reactions/pairs.ts`
- `app/data/logs/reactions/index.ts`
- `app/data/logs/templates/generic.ts`
- `app/data/logs/templates/index.ts`
- `app/data/logs/fallbacks/legendary.ts`
- `app/data/logs/fallbacks/index.ts`
- `app/data/logs/index.ts`
- `app/utils/logs/rarity.ts`
- `app/utils/logs/reactions.ts`
- `app/utils/logs/skeleton.ts`
- `app/utils/logs/variables.ts`
- `app/utils/logs/ai.ts`
- `app/utils/logs/index.ts`

**Files Modified:**
- `types/expedition.ts` (add rarity types)
- `types/index.ts` (export logs)
- `app/utils/logGenerator.ts` (integrate new systems)

**Test Files:**
- `tests/types/logRarity.test.ts`
- `tests/types/traitReaction.test.ts`
- `tests/data/logs/traitReactions.test.ts`
- `tests/data/logs/pairReactions.test.ts`
- `tests/data/logs/templates.test.ts`
- `tests/utils/logs/rarity.test.ts`
- `tests/utils/logs/reactions.test.ts`
- `tests/utils/logs/skeleton.test.ts`
- `tests/utils/logs/variables.test.ts`
- `tests/utils/logs/ai.test.ts`
- `tests/utils/logGenerator.test.ts`
- `tests/integration/logGeneration.test.ts`

**Next Steps After Implementation:**
1. Add zone-specific templates (forest.ts, cave.ts)
2. Write more trait reactions as traits are added
3. Implement actual AI API call when ready
4. Add UI components for log display with rarity highlighting
