import type { StoryTrait, ZoneType } from '~~/types'

export const STORY_TRAITS: Record<string, StoryTrait> = {
  // === PERSONALITY QUIRKS ===
  cheese_obsessed: {
    id: 'cheese_obsessed',
    name: 'Cheese Obsessed',
    description: 'Has an inexplicable fixation on cheese',
    source: 'generation',
    reactions: {
      onLoot: [
        '{hero} checked every container for cheese.',
        '{hero} was disappointed by the lack of cheese.',
      ],
      onEvent: [
        '{hero} asked if there was cheese involved.',
        '{hero} suggested cheese as a solution.',
      ],
    },
    grantsTitle: 'the Cheese-Seeker',
  },
  chronic_napper: {
    id: 'chronic_napper',
    name: 'Chronic Napper',
    description: 'Falls asleep at the worst times',
    source: 'generation',
    reactions: {
      onCombat: [
        '{hero} yawned mid-battle.',
        '{hero} almost dozed off between swings.',
      ],
      onEvent: [
        '{hero} napped while others kept watch.',
        '{hero} had to be woken up. Again.',
      ],
    },
  },
  overly_dramatic: {
    id: 'overly_dramatic',
    name: 'Overly Dramatic',
    description: 'Treats everything like a grand performance',
    source: 'generation',
    reactions: {
      onCombat: [
        '{hero} announced their attack with a flourish.',
        '{hero} narrated the battle in third person.',
      ],
      onEvent: [
        '{hero} declared this was surely the end.',
        '{hero} monologued about their destiny.',
      ],
    },
    grantsTitle: 'the Theatrical',
  },
  compulsive_counter: {
    id: 'compulsive_counter',
    name: 'Compulsive Counter',
    description: 'Counts everything obsessively',
    source: 'generation',
    reactions: {
      onLoot: [
        '{hero} counted exactly how many coins dropped.',
        '{hero} organized the loot by quantity.',
      ],
      onEvent: [
        '{hero} counted the enemies. Twice.',
        '{hero} noted there were 47 steps in the corridor.',
      ],
    },
  },
  terrible_singer: {
    id: 'terrible_singer',
    name: 'Terrible Singer',
    description: 'Sings badly at inappropriate moments',
    source: 'generation',
    reactions: {
      onEvent: [
        '{hero} hummed loudly, alerting enemies.',
        '{hero}\'s singing echoed through the dungeon.',
      ],
    },
  },
  superstitious: {
    id: 'superstitious',
    name: 'Superstitious',
    description: 'Follows bizarre rituals for "luck"',
    source: 'generation',
    reactions: {
      onEvent: [
        '{hero} refused to step on cracks.',
        '{hero} performed a luck ritual before entering.',
      ],
      onLoot: [
        '{hero} credited their lucky charm.',
        '{hero} needed to find a four-leaf clover first.',
      ],
    },
  },

  // === FEARS & PHOBIAS ===
  afraid_of_heights: {
    id: 'afraid_of_heights',
    name: 'Afraid of Heights',
    description: 'Terrified of high places',
    source: 'generation',
    reactions: {
      onZoneType: {
        mountain: [
          '{hero} crawled along cliff edges.',
          '{hero} refused to look down.',
        ],
      },
      onEvent: [
        '{hero} clung to the wall on the bridge.',
        '{hero} took the stairs instead of climbing.',
      ],
    },
  },
  bug_phobia: {
    id: 'bug_phobia',
    name: 'Bug Phobia',
    description: 'Screams at insects',
    source: 'generation',
    reactions: {
      onZoneType: {
        cave: [
          '{hero} screamed at a spider.',
          '{hero} demanded someone else handle the bugs.',
        ],
        swamp: [
          '{hero} was covered in mosquitos.',
          '{hero} jumped at every buzzing sound.',
        ],
      },
    },
  },
  claustrophobic: {
    id: 'claustrophobic',
    name: 'Claustrophobic',
    description: 'Panics in tight spaces',
    source: 'generation',
    reactions: {
      onZoneType: {
        cave: [
          '{hero} hyperventilated in the narrow tunnel.',
          '{hero} needed fresh air breaks.',
        ],
      },
    },
  },

  // === OBSESSIONS & HOBBIES ===
  amateur_botanist: {
    id: 'amateur_botanist',
    name: 'Amateur Botanist',
    description: 'Obsessed with cataloging plants',
    source: 'generation',
    reactions: {
      onZoneType: {
        forest: [
          '{hero} stopped to identify every plant.',
          '{hero} collected leaf samples.',
        ],
        swamp: [
          '{hero} was excited about rare fungi.',
          '{hero} warned about poisonous plants.',
        ],
      },
      onEvent: [
        '{hero} found a new species. Probably.',
        '{hero} made notes about the local flora.',
      ],
    },
    grantsTitle: 'the Botanist',
  },
  rock_collector: {
    id: 'rock_collector',
    name: 'Rock Collector',
    description: 'Picks up interesting rocks everywhere',
    source: 'generation',
    reactions: {
      onZoneType: {
        cave: [
          '{hero}\'s pockets were suspiciously heavy.',
          '{hero} found "the perfect specimen".',
        ],
        mountain: [
          '{hero} evaluated every boulder.',
          '{hero} insisted this rock was special.',
        ],
      },
    },
  },
  conspiracy_theorist: {
    id: 'conspiracy_theorist',
    name: 'Conspiracy Theorist',
    description: 'Sees connections everywhere',
    source: 'generation',
    reactions: {
      onEvent: [
        '{hero} explained how this was all connected.',
        '{hero} mentioned Big Potion was behind it.',
      ],
      onLoot: [
        '{hero} claimed the treasure was planted.',
        '{hero} looked for hidden messages in the loot.',
      ],
    },
  },
  wannabe_chef: {
    id: 'wannabe_chef',
    name: 'Wannabe Chef',
    description: 'Tries to cook with anything',
    source: 'generation',
    reactions: {
      onLoot: [
        '{hero} wondered if this was edible.',
        '{hero} planned tonight\'s dinner.',
      ],
      onEvent: [
        '{hero} suggested a cooking break.',
        '{hero} seasoned the rations. Unwisely.',
      ],
    },
    grantsTitle: 'the Cook',
  },

  // === ACQUIRED TRAITS (from events) ===
  dragon_survivor: {
    id: 'dragon_survivor',
    name: 'Dragon Survivor',
    description: 'Lived through a dragon encounter',
    source: 'event',
    reactions: {
      onCombat: [
        '{hero} recalled facing worse.',
        '{hero} mentioned that one time with the dragon.',
      ],
    },
    grantsTitle: 'the Dragon Survivor',
  },
  cursed: {
    id: 'cursed',
    name: 'Cursed',
    description: 'Something dark follows them',
    source: 'curse',
    reactions: {
      onEvent: [
        'Something unlucky happened near {hero}.',
        '{hero}\'s curse acted up again.',
      ],
    },
    grantsTitle: 'the Cursed',
  },
}

// Helper functions
export function getStoryTraitById(id: string): StoryTrait | undefined {
  return STORY_TRAITS[id]
}

export function getGenerationStoryTraits(): StoryTrait[] {
  return Object.values(STORY_TRAITS).filter(t => t.source === 'generation')
}

export function getEventStoryTraits(): StoryTrait[] {
  return Object.values(STORY_TRAITS).filter(t => t.source === 'event')
}
