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
