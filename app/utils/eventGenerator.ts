import type { Hero, Subzone, ExpeditionEvent } from '~~/types'
import { getGameplayTraitById } from '~/data/gameplayTraits'
import { getStoryTraitById } from '~/data/storyTraits'

// Event count by expedition duration
const EVENTS_BY_DURATION = {
  short: { min: 2, max: 4 },    // < 30 min
  medium: { min: 3, max: 6 },   // 30-60 min
  long: { min: 5, max: 8 },     // 1-2 hr
  extended: { min: 6, max: 10 } // 2+ hr
}

// Event type distribution
const EVENT_TYPE_WEIGHTS = {
  flavor: 0.50,
  skill_check: 0.25,
  choice: 0.20,
  rare: 0.05,
}

// Skill check severity consequences
const SEVERITY_CONSEQUENCES = {
  minor: {
    successGold: 20,
    successXp: 10,
    failureEfficiency: 0,
    failureMorale: 0,
  },
  moderate: {
    successGold: 50,
    successXp: 30,
    failureEfficiency: -3,
    failureMorale: -5,
  },
  major: {
    successGold: 100,
    successXp: 60,
    failureEfficiency: -8,
    failureMorale: -10,
  },
}

// Helper: Get duration category
function getDurationCategory(durationMinutes: number): keyof typeof EVENTS_BY_DURATION {
  if (durationMinutes < 30) return 'short'
  if (durationMinutes < 60) return 'medium'
  if (durationMinutes < 120) return 'long'
  return 'extended'
}

// Helper: Random int in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (min + max)) + min
}

// Helper: Random element from array
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Helper: Weighted random selection
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

// Main event generator
export function generateExpeditionEvents(
  subzone: Subzone,
  heroes: Hero[],
  efficiency: number
): ExpeditionEvent[] {
  const events: ExpeditionEvent[] = []

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
      events.push(event)
    }
  }

  return events
}

// Generate flavor event
function generateFlavorEvent(subzone: Subzone, heroes: Hero[]): ExpeditionEvent {
  const flavorTexts = [
    'The party noticed strange markings on the walls.',
    'A distant sound echoed through the area.',
    'The air grew noticeably colder.',
    'Something rustled in the shadows.',
    'An eerie silence fell over the group.',
  ]

  return {
    id: crypto.randomUUID(),
    type: 'flavor',
    data: {
      text: randomElement(flavorTexts),
    },
  }
}

// Generate skill check event
function generateSkillCheckEvent(subzone: Subzone, heroes: Hero[]): ExpeditionEvent {
  const checkTypes = ['combat', 'utility', 'survival'] as const
  const severities = ['minor', 'moderate', 'major'] as const

  const checkType = randomElement(checkTypes)
  const severity = randomElement(severities)

  // Select hero with highest relevant stat
  const selectedHero = heroes.reduce((best, hero) => {
    return hero.baseStats[checkType] > best.baseStats[checkType] ? hero : best
  }, heroes[0])

  // Roll check (simplified)
  const dc = 50 + (severity === 'major' ? 20 : severity === 'moderate' ? 10 : 0)
  const roll = Math.random() * 100
  const statBonus = selectedHero.baseStats[checkType]
  const passed = (roll + statBonus) >= dc

  const consequences = SEVERITY_CONSEQUENCES[severity]

  return {
    id: crypto.randomUUID(),
    type: 'skill_check',
    data: {
      heroId: selectedHero.id,
      stat: checkType,
      severity,
      passed,
      reward: passed ? {
        gold: consequences.successGold,
        xp: consequences.successXp,
      } : undefined,
    },
  }
}

// Generate choice event
function generateChoiceEvent(subzone: Subzone, heroes: Hero[]): ExpeditionEvent {
  const choices = [
    {
      id: 'investigate',
      text: 'Investigate the suspicious noise',
      outcomes: [
        { success: true, probability: 0.6, rewards: { gold: 30, xp: 20 } },
        { success: false, probability: 0.4, penalty: { efficiency: -2 } },
      ],
    },
    {
      id: 'ignore',
      text: 'Keep moving',
      outcomes: [
        { success: true, probability: 1.0, rewards: { gold: 0, xp: 0 } },
      ],
    },
  ]

  return {
    id: crypto.randomUUID(),
    type: 'choice',
    data: {
      text: 'The party hears a suspicious noise ahead.',
      choices,
      defaultChoice: 'ignore',
    },
    selectedChoice: null,
  }
}

// Generate rare event
function generateRareEvent(subzone: Subzone, heroes: Hero[], efficiency: number): ExpeditionEvent | null {
  // Only trigger rare events on high efficiency
  if (efficiency < 1.1) return null

  const rareTypes = ['hero_moment', 'discovery', 'windfall'] as const
  const rareType = randomElement(rareTypes)

  switch (rareType) {
    case 'hero_moment':
      const hero = randomElement(heroes)
      return {
        id: crypto.randomUUID(),
        type: 'rare',
        data: {
          rareType: 'hero_moment',
          heroId: hero.id,
          text: `${hero.name} had a moment of brilliance!`,
          reward: { gold: 100, xp: 50 },
        },
      }

    case 'discovery':
      return {
        id: crypto.randomUUID(),
        type: 'rare',
        data: {
          rareType: 'discovery',
          text: 'The party discovered a hidden cache!',
          reward: { gold: 150, xp: 75 },
        },
      }

    case 'windfall':
      return {
        id: crypto.randomUUID(),
        type: 'rare',
        data: {
          rareType: 'windfall',
          text: 'A stroke of incredible luck!',
          reward: { gold: 200, xp: 100 },
        },
      }
  }

  return null
}

// Add trait reactions to events
export function addTraitReactions(
  events: ExpeditionEvent[],
  heroes: Hero[]
): ExpeditionEvent[] {
  return events.map(event => {
    // 30% chance per hero to react to relevant events
    const reactions: Array<{ heroId: string; traitId: string; text: string }> = []

    for (const hero of heroes) {
      if (Math.random() > 0.3) continue // 30% chance
      if (reactions.length >= 3) break // Max 3 reactions per event

      // Check for relevant story traits
      for (const traitId of hero.storyTraitIds) {
        const trait = getStoryTraitById(traitId)
        if (!trait?.reactions) continue

        // Check if trait has reactions for this event type
        let possibleReactions: string[] = []

        if (event.type === 'flavor' && trait.reactions.onEvent) {
          possibleReactions = trait.reactions.onEvent
        } else if (event.type === 'choice' && trait.reactions.onEvent) {
          possibleReactions = trait.reactions.onEvent
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
