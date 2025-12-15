import type { Culture } from '~~/types'

export interface CultureInfo {
  id: Culture
  name: string
  description: string
  preferredStoryTraits: string[] // More likely to roll these
  flavorTexts: {
    homesick: string[]
    comfortable: string[]
  }
}

export const CULTURES: Record<Culture, CultureInfo> = {
  northfolk: {
    id: 'northfolk',
    name: 'Northfolk',
    description: 'Hardy mountain and tundra dwellers, known for their resilience and blunt honesty.',
    preferredStoryTraits: ['chronic_napper', 'rock_collector', 'superstitious'],
    flavorTexts: {
      homesick: [
        '{hero} missed the cold mountain air.',
        '{hero} complained about the heat.',
        '{hero} longed for proper ale.',
      ],
      comfortable: [
        '{hero} felt at home in the cold.',
        '{hero} recognized the mountain paths.',
      ],
    },
  },
  coastborn: {
    id: 'coastborn',
    name: 'Coastborn',
    description: 'Seafaring island traders, superstitious and shrewd negotiators.',
    preferredStoryTraits: ['superstitious', 'compulsive_counter', 'terrible_singer'],
    flavorTexts: {
      homesick: [
        '{hero} missed the sound of waves.',
        '{hero} kept looking for the horizon.',
        '{hero} complained the air was too dry.',
      ],
      comfortable: [
        '{hero} recognized the tide patterns.',
        '{hero} felt the sea breeze and smiled.',
      ],
    },
  },
  woodwalkers: {
    id: 'woodwalkers',
    name: 'Woodwalkers',
    description: 'Forest-dwelling naturalists who commune with nature and distrust cities.',
    preferredStoryTraits: ['amateur_botanist', 'bug_phobia', 'cheese_obsessed'],
    flavorTexts: {
      homesick: [
        '{hero} missed the forest canopy.',
        '{hero} felt exposed without trees.',
        '{hero} talked to a plant out of habit.',
      ],
      comfortable: [
        '{hero} recognized these woods.',
        '{hero} moved silently through the trees.',
      ],
    },
  },
  crownlanders: {
    id: 'crownlanders',
    name: 'Crownlanders',
    description: 'Urban city-state citizens, well-educated but sometimes snobbish about the "wilds".',
    preferredStoryTraits: ['overly_dramatic', 'compulsive_counter', 'wannabe_chef'],
    flavorTexts: {
      homesick: [
        '{hero} missed proper civilization.',
        '{hero} complained about the lack of roads.',
        '{hero} longed for a proper bed.',
      ],
      comfortable: [
        '{hero} recognized the architecture.',
        '{hero} knew the local customs.',
      ],
    },
  },
}

// Get culture info
export function getCultureInfo(culture: Culture): CultureInfo {
  return CULTURES[culture]
}

// Random culture selection
export function getRandomCulture(): Culture {
  const cultures = Object.keys(CULTURES) as Culture[]
  return cultures[Math.floor(Math.random() * cultures.length)]
}
