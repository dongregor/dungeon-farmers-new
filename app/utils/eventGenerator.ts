import type { Hero, Subzone, ExpeditionEvent, StoryHook, HeroInjury, ArchetypeTag } from '~~/types'
import { getGameplayTraitById } from '~/data/gameplayTraits'
import { getStoryTraitById } from '~/data/storyTraits'
import { THREATS } from '~~/types/threats'

// Event count by expedition duration
const EVENTS_BY_DURATION = {
  short: { min: 2, max: 4 },    // < 30 min
  medium: { min: 3, max: 6 },   // 30-60 min
  long: { min: 5, max: 8 },     // 1-2 hr
  extended: { min: 6, max: 10 } // 2+ hr
}

// Event type distribution (50% flavor, 25% skill check, 20% choice, 5% rare)
const EVENT_TYPE_WEIGHTS = {
  flavor: 0.50,
  skill_check: 0.25,
  choice: 0.20,
  rare: 0.05,
}

// Skill check types
type SkillCheckType = 'stat' | 'tag' | 'trait'
type SkillCheckSeverity = 'minor' | 'moderate' | 'major'

// Skill check severity consequences
const SEVERITY_CONSEQUENCES = {
  minor: {
    successGold: 20,
    successXp: 10,
    failureEfficiency: 0,
    failureMorale: 0,
    injuryChance: 0,
  },
  moderate: {
    successGold: 50,
    successXp: 30,
    failureEfficiency: -3,
    failureMorale: -5,
    injuryChance: 0.1, // 10% chance
  },
  major: {
    successGold: 100,
    successXp: 60,
    failureEfficiency: -8,
    failureMorale: -10,
    injuryChance: 0.3, // 30% chance
  },
}

// Rare occurrence types
type RareOccurrenceType = 'hero_moment' | 'discovery' | 'story_hook' | 'windfall'

// Injury types and their effects
const INJURY_TYPES = {
  sprain: {
    name: 'Sprain',
    statPenalty: { combat: -3 },
    expiresAfterExpeditions: 2,
    cureCost: { gold: 50 },
  },
  poison: {
    name: 'Poison',
    statPenalty: { survival: -3 },
    expiresAfterExpeditions: 3,
    cureCost: { gold: 75, healerTag: true },
  },
  curse: {
    name: 'Curse',
    statPenalty: { combat: -2, utility: -2, survival: -2 },
    expiresAfterExpeditions: 5,
    cureCost: { gold: 150, healerTag: true },
  },
  exhaustion: {
    name: 'Exhaustion',
    statPenalty: { utility: -5 },
    expiresAfterExpeditions: 1,
    cureCost: {}, // Rest only
  },
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getDurationCategory(durationMinutes: number): keyof typeof EVENTS_BY_DURATION {
  if (durationMinutes < 30) return 'short'
  if (durationMinutes < 60) return 'medium'
  if (durationMinutes < 120) return 'long'
  return 'extended'
}

// ✅ FIXED: Correct random int implementation
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function weightedRandom(weights: Record<string, number>): string {
  const entries = Object.entries(weights)
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let random = Math.random() * total

  for (const [key, weight] of entries) {
    random -= weight
    if (random <= 0) return key
  }

  return entries[0][0]
}

// Generate timestamp for event (relative to expedition start)
function generateEventTimestamp(expeditionStartedAt: Date, index: number, totalEvents: number, durationMinutes: number): string {
  // Distribute events throughout the expedition duration
  const progress = totalEvents > 1 ? index / (totalEvents - 1) : 0.5
  const offset = Math.floor(progress * durationMinutes * 60 * 1000) // Spread events across actual duration
  const eventTime = new Date(expeditionStartedAt.getTime() + offset)
  return eventTime.toISOString()
}

// ========================================
// MAIN EVENT GENERATOR
// ========================================

export function generateExpeditionEvents(
  subzone: Subzone,
  heroes: Hero[],
  efficiency: number,
  expeditionStartedAt?: Date
): ExpeditionEvent[] {
  const events: ExpeditionEvent[] = []
  const startTime = expeditionStartedAt || new Date()

  // Calculate event count
  const category = getDurationCategory(subzone.baseDuration)
  const config = EVENTS_BY_DURATION[category]
  const eventCount = randomInt(config.min, config.max)

  // Generate events
  for (let i = 0; i < eventCount; i++) {
    const eventType = weightedRandom(EVENT_TYPE_WEIGHTS)

    let event: ExpeditionEvent | null = null

    switch (eventType) {
      case 'flavor':
        event = generateFlavorEvent(subzone, heroes)
        break
      case 'skill_check':
        event = generateSkillCheckEvent(subzone, heroes)
        break
      case 'choice':
        event = generateChoiceEvent(subzone, heroes)
        break
      case 'rare':
        event = generateRareEvent(subzone, heroes, efficiency)
        break
    }

    if (event) {
      // ✅ FIXED: Add timestamp to all events
      event.timestamp = generateEventTimestamp(startTime, i, eventCount, subzone.baseDuration)
      events.push(event)
    }
  }

  return events
}

// ========================================
// FLAVOR EVENTS
// ========================================

function generateFlavorEvent(subzone: Subzone, heroes: Hero[]): ExpeditionEvent {
  const flavorTexts = [
    'The party noticed strange markings on the walls.',
    'A distant sound echoed through the area.',
    'The air grew noticeably colder.',
    'Something rustled in the shadows.',
    'An eerie silence fell over the group.',
    'The party spotted tracks leading deeper into the area.',
    'A faint glow emanated from the distance.',
    'The ground trembled slightly beneath their feet.',
    'Strange whispers seemed to drift on the wind.',
    'The party found remnants of a recent camp.',
  ]

  return {
    id: crypto.randomUUID(),
    type: 'flavor',
    timestamp: '', // Will be set by main generator
    data: {
      text: randomElement(flavorTexts),
    },
  }
}

// ========================================
// SKILL CHECK EVENTS
// ========================================

function generateSkillCheckEvent(subzone: Subzone, heroes: Hero[]): ExpeditionEvent {
  const severities: SkillCheckSeverity[] = ['minor', 'moderate', 'major']
  const severity = randomElement(severities)

  // Determine check type (70% stat, 20% tag, 10% trait)
  const checkTypeRoll = Math.random()
  let checkType: SkillCheckType
  if (checkTypeRoll < 0.7) {
    checkType = 'stat'
  } else if (checkTypeRoll < 0.9) {
    checkType = 'tag'
  } else {
    checkType = 'trait'
  }

  let event: ExpeditionEvent

  switch (checkType) {
    case 'stat':
      event = generateStatCheck(heroes, severity)
      break
    case 'tag':
      event = generateTagCheck(subzone, heroes, severity)
      break
    case 'trait':
      event = generateTraitCheck(heroes, severity)
      break
  }

  return event
}

// Stat-based skill check
function generateStatCheck(heroes: Hero[], severity: SkillCheckSeverity): ExpeditionEvent {
  const stats = ['combat', 'utility', 'survival'] as const
  const stat = randomElement(stats)

  // Select hero with highest relevant stat
  const selectedHero = heroes.reduce((best, hero) => {
    return hero.baseStats[stat] > best.baseStats[stat] ? hero : best
  }, heroes[0])

  // Calculate DC based on severity
  const baseDC = 50
  const severityBonus = severity === 'major' ? 20 : severity === 'moderate' ? 10 : 0
  const dc = baseDC + severityBonus

  // Roll check
  const roll = Math.random() * 100
  const statBonus = selectedHero.baseStats[stat]
  const passed = (roll + statBonus) >= dc

  const consequences = SEVERITY_CONSEQUENCES[severity]

  // Check for injury on failure
  let injury: HeroInjury | undefined
  if (!passed && Math.random() < consequences.injuryChance) {
    injury = generateInjury(selectedHero.id)
  }

  return {
    id: crypto.randomUUID(),
    type: 'skill_check',
    timestamp: '', // Will be set by main generator
    data: {
      heroId: selectedHero.id,
      stat,
      difficulty: dc,
      passed,
      severity,
      reward: passed ? {
        gold: consequences.successGold,
        xp: consequences.successXp,
      } : undefined,
      injury,
    },
  }
}

// Tag-based skill check (requires specific archetype tag)
function generateTagCheck(subzone: Subzone, heroes: Hero[], severity: SkillCheckSeverity): ExpeditionEvent {
  // Pick a random threat from the subzone
  const threat = subzone.threats.length > 0 ? THREATS[randomElement(subzone.threats)] : null

  if (!threat) {
    // Fallback to stat check if no threats
    return generateStatCheck(heroes, severity)
  }

  // Find hero with counter tag
  const requiredTags = threat.counteredBy
  const selectedHero = heroes.find(hero =>
    hero.archetypeTags.some(tag => requiredTags.includes(tag))
  )

  const passed = selectedHero !== undefined
  const consequences = SEVERITY_CONSEQUENCES[severity]

  // If no one has the tag, pick random hero for failure
  const failedHero = selectedHero || randomElement(heroes)

  // Check for injury on failure
  let injury: HeroInjury | undefined
  if (!passed && Math.random() < consequences.injuryChance) {
    injury = generateInjury(failedHero.id)
  }

  return {
    id: crypto.randomUUID(),
    type: 'skill_check',
    timestamp: '', // Will be set by main generator
    data: {
      heroId: selectedHero?.id || failedHero.id,
      stat: 'combat', // Default for tag checks
      difficulty: 0, // Tag check is binary
      passed,
      severity,
      requiredTag: requiredTags[0],
      reward: passed ? {
        gold: consequences.successGold,
        xp: consequences.successXp,
      } : undefined,
      injury,
    },
  }
}

// Trait-based skill check (requires specific gameplay trait)
function generateTraitCheck(heroes: Hero[], severity: SkillCheckSeverity): ExpeditionEvent {
  // Example trait checks (simplified - could be expanded with specific trait requirements)
  const traitChecks = [
    { id: 'lucky', name: 'Luck' },
    { id: 'brawny', name: 'Strength' },
    { id: 'nimble', name: 'Agility' },
  ]

  const requiredTrait = randomElement(traitChecks)

  // Find hero with this trait
  const selectedHero = heroes.find(hero =>
    hero.gameplayTraits.some(t => t.traitId === requiredTrait.id)
  )

  const passed = selectedHero !== undefined
  const consequences = SEVERITY_CONSEQUENCES[severity]

  // If no one has the trait, pick random hero for failure
  const failedHero = selectedHero || randomElement(heroes)

  // Check for injury on failure
  let injury: HeroInjury | undefined
  if (!passed && Math.random() < consequences.injuryChance) {
    injury = generateInjury(failedHero.id)
  }

  return {
    id: crypto.randomUUID(),
    type: 'skill_check',
    timestamp: '', // Will be set by main generator
    data: {
      heroId: selectedHero?.id || failedHero.id,
      stat: 'utility', // Default for trait checks
      difficulty: 0, // Trait check is binary
      passed,
      severity,
      requiredTrait: requiredTrait.id,
      reward: passed ? {
        gold: consequences.successGold,
        xp: consequences.successXp,
      } : undefined,
      injury,
    },
  }
}

// Generate injury from skill check failure
function generateInjury(heroId: string): HeroInjury {
  const injuryTypes = Object.keys(INJURY_TYPES) as Array<keyof typeof INJURY_TYPES>
  const injuryType = randomElement(injuryTypes)
  const injury = INJURY_TYPES[injuryType]

  return {
    heroId,
    type: injuryType,
    statPenalty: injury.statPenalty,
    expiresAfterExpeditions: injury.expiresAfterExpeditions,
    cureCost: injury.cureCost,
  }
}

// ========================================
// CHOICE EVENTS
// ========================================

function generateChoiceEvent(subzone: Subzone, heroes: Hero[]): ExpeditionEvent {
  // Choice event templates
  const choiceTemplates = [
    {
      prompt: 'The party hears a suspicious noise ahead. What should they do?',
      options: [
        {
          id: 1,
          text: 'Investigate the noise',
          outcome: 'The party carefully approaches and discovers a hidden stash!',
          successChance: 0.6,
          rewards: { gold: 50, xp: 30 },
          penalty: { efficiency: -3 },
        },
        {
          id: 2,
          text: 'Ignore it and keep moving',
          outcome: 'The party continues on their path without incident.',
          successChance: 1.0,
          rewards: { gold: 0, xp: 0 },
        },
        {
          id: 3,
          text: 'Set up an ambush',
          outcome: 'The party gains the upper hand!',
          successChance: 0.5,
          rewards: { gold: 80, xp: 50 },
          penalty: { efficiency: -5 },
          requiresTag: 'scout' as ArchetypeTag,
        },
      ],
      defaultOptionId: 2,
    },
    {
      prompt: 'The party discovers a locked chest. How should they proceed?',
      options: [
        {
          id: 1,
          text: 'Pick the lock',
          outcome: 'The lock clicks open smoothly.',
          successChance: 0.7,
          rewards: { gold: 60, xp: 20 },
          penalty: { efficiency: -2 },
          requiresStat: { stat: 'utility', minimum: 15 },
        },
        {
          id: 2,
          text: 'Smash it open',
          outcome: 'The chest breaks apart, scattering its contents.',
          successChance: 0.9,
          rewards: { gold: 40, xp: 10 },
        },
        {
          id: 3,
          text: 'Leave it alone',
          outcome: 'The party decides discretion is the better part of valor.',
          successChance: 1.0,
          rewards: { gold: 0, xp: 0 },
        },
      ],
      defaultOptionId: 3,
    },
    {
      prompt: 'A wounded creature blocks the path. What should the party do?',
      options: [
        {
          id: 1,
          text: 'Heal the creature',
          outcome: 'The creature is grateful and reveals a secret path.',
          successChance: 0.8,
          rewards: { gold: 30, xp: 50 },
          requiresTag: 'regen' as ArchetypeTag,
        },
        {
          id: 2,
          text: 'Finish it off',
          outcome: 'The party dispatches the creature swiftly.',
          successChance: 0.9,
          rewards: { gold: 20, xp: 15 },
        },
        {
          id: 3,
          text: 'Go around it',
          outcome: 'The party finds another way forward.',
          successChance: 1.0,
          rewards: { gold: 0, xp: 5 },
        },
      ],
      defaultOptionId: 3,
    },
  ]

  const template = randomElement(choiceTemplates)

  return {
    id: crypto.randomUUID(),
    type: 'choice',
    timestamp: '', // Will be set by main generator
    data: {
      prompt: template.prompt,
      options: template.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        outcome: opt.outcome,
      })),
      selectedOption: undefined, // Will be set when player makes choice
      defaultOptionId: template.defaultOptionId,
    },
  }
}

// ========================================
// RARE OCCURRENCE EVENTS
// ========================================

function generateRareEvent(subzone: Subzone, heroes: Hero[], efficiency: number): ExpeditionEvent | null {
  // Higher efficiency increases rare event chance (efficiency is a percentage: 100 = 100%)
  const efficiencyBonus = Math.max(0, (efficiency / 100) - 1.0) // 0.1 for 110% efficiency, etc.
  const baseChance = 0.05
  const totalChance = baseChance + efficiencyBonus

  if (Math.random() > totalChance) return null

  const rareTypes: RareOccurrenceType[] = ['hero_moment', 'discovery', 'story_hook', 'windfall']
  const rareType = randomElement(rareTypes)

  switch (rareType) {
    case 'hero_moment':
      return generateHeroMoment(heroes)
    case 'discovery':
      return generateDiscovery(subzone)
    case 'story_hook':
      return generateStoryHook(subzone, heroes)
    case 'windfall':
      return generateWindfall()
  }

  return null
}

// Hero moment - a hero has a breakthrough
function generateHeroMoment(heroes: Hero[]): ExpeditionEvent {
  const hero = randomElement(heroes)

  const moments = [
    `${hero.name} had a moment of brilliance!`,
    `${hero.name} discovered a clever technique!`,
    `${hero.name} found their rhythm and pushed the party forward!`,
    `${hero.name} recalled a crucial detail that saved the day!`,
  ]

  return {
    id: crypto.randomUUID(),
    type: 'rare',
    timestamp: '', // Will be set by main generator
    data: {
      rareType: 'hero_moment',
      heroId: hero.id,
      text: randomElement(moments),
      reward: { gold: 100, xp: 50 },
      grantStoryTrait: Math.random() < 0.2 ? 'heroic' : undefined, // 20% chance to grant story trait
    },
  }
}

// Discovery - found something valuable
function generateDiscovery(subzone: Subzone): ExpeditionEvent {
  const discoveries = [
    'The party discovered a hidden cache of supplies!',
    'Ancient treasure was found buried in the area!',
    'A secret chamber revealed valuable artifacts!',
    'The party uncovered a forgotten stash!',
  ]

  return {
    id: crypto.randomUUID(),
    type: 'rare',
    timestamp: '', // Will be set by main generator
    data: {
      rareType: 'discovery',
      text: randomElement(discoveries),
      reward: { gold: 150, xp: 75 },
      discoversSubzone: Math.random() < 0.3, // 30% chance to discover new subzone
    },
  }
}

// Story hook - triggers multi-step story
function generateStoryHook(subzone: Subzone, heroes: Hero[]): ExpeditionEvent {
  const hero = randomElement(heroes)

  const hookTypes = ['immediate', 'collection', 'delayed', 'conditional'] as const
  const hookType = randomElement(hookTypes)

  const hooks = {
    immediate: {
      text: `${hero.name} found a mysterious message that needs immediate attention!`,
      progress: { type: 'immediate' as const, ready: true },
    },
    collection: {
      text: `${hero.name} discovered the first piece of an ancient artifact!`,
      progress: { type: 'collection' as const, current: 1, required: 5, itemName: 'Artifact Piece' },
    },
    delayed: {
      text: `${hero.name} uncovered a clue that will reveal itself over time...`,
      progress: { type: 'delayed' as const, expeditionsRemaining: 3 },
    },
    conditional: {
      text: `${hero.name} sensed something powerful nearby...`,
      progress: { type: 'conditional' as const, condition: 'Return to this zone with a healer', met: false },
    },
  }

  const hook = hooks[hookType]

  return {
    id: crypto.randomUUID(),
    type: 'story_hook',
    timestamp: '', // Will be set by main generator
    data: {
      heroId: hero.id,
      text: hook.text,
      hookId: `hook_${crypto.randomUUID().slice(0, 8)}`,
      hookProgress: hook.progress,
    },
  }
}

// Windfall - lucky find
function generateWindfall(): ExpeditionEvent {
  const windfalls = [
    'A stroke of incredible luck!',
    'Fortune smiles upon the party!',
    'An unexpected windfall brightens the day!',
    'The gods of chance favor the party!',
  ]

  return {
    id: crypto.randomUUID(),
    type: 'rare',
    timestamp: '', // Will be set by main generator
    data: {
      rareType: 'windfall',
      text: randomElement(windfalls),
      reward: { gold: 200, xp: 100 },
    },
  }
}

// ========================================
// TRAIT REACTIONS
// ========================================

export function addTraitReactions(
  events: ExpeditionEvent[],
  heroes: Hero[]
): ExpeditionEvent[] {
  return events.map(event => {
    // 30% chance per hero to react to relevant events, max 2-3 reactions per event
    const reactions: Array<{ heroId: string; traitId: string; text: string }> = []
    const maxReactions = randomInt(2, 3)

    for (const hero of heroes) {
      if (reactions.length >= maxReactions) break
      if (Math.random() > 0.3) continue // 30% chance per hero

      // Check for relevant story traits
      for (const traitId of hero.storyTraitIds) {
        const trait = getStoryTraitById(traitId)
        if (!trait?.reactions) continue

        // Check if trait has reactions for this event type
        let possibleReactions: string[] = []

        switch (event.type) {
          case 'flavor':
            if (trait.reactions.onEvent) {
              possibleReactions = trait.reactions.onEvent
            }
            break
          case 'skill_check':
            if (event.data.passed && trait.reactions.onCombat) {
              possibleReactions = trait.reactions.onCombat
            }
            break
          case 'choice':
            if (trait.reactions.onEvent) {
              possibleReactions = trait.reactions.onEvent
            }
            break
          case 'rare':
            if (trait.reactions.onLoot) {
              possibleReactions = trait.reactions.onLoot
            }
            break
        }

        if (possibleReactions.length > 0) {
          const reactionText = randomElement(possibleReactions).replace('{hero}', hero.name)
          reactions.push({ heroId: hero.id, traitId, text: reactionText })
          break // One reaction per hero per event
        }
      }
    }

    return {
      ...event,
      data: {
        ...event.data,
        reactions,
      },
    }
  })
}
