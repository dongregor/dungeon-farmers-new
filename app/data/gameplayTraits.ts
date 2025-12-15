import type { GameplayTrait } from '~~/types'

export const GAMEPLAY_TRAITS: Record<string, GameplayTrait> = {
  // === STAT BONUSES ===
  brawny: {
    id: 'brawny',
    name: 'Brawny',
    description: '+{value}% Combat',
    effect: 'stat_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    statBonus: { stat: 'combat', isPercent: true },
    reactions: {
      onCombat: [
        '{hero} flexed menacingly at the enemy.',
        '{hero} cracked their knuckles before the fight.',
      ],
    },
  },
  nimble: {
    id: 'nimble',
    name: 'Nimble',
    description: '+{value}% Utility',
    effect: 'stat_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    statBonus: { stat: 'utility', isPercent: true },
    reactions: {
      onLoot: [
        '{hero} spotted the hidden chest first.',
        '{hero} picked the lock in seconds.',
      ],
    },
  },
  tough: {
    id: 'tough',
    name: 'Tough',
    description: '+{value}% Survival',
    effect: 'stat_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    statBonus: { stat: 'survival', isPercent: true },
    reactions: {
      onCombat: [
        '{hero} barely flinched from the hit.',
        '{hero} shrugged off what should have hurt.',
      ],
    },
  },

  // === CONDITIONAL BONUSES ===
  cave_dweller: {
    id: 'cave_dweller',
    name: 'Cave Dweller',
    description: '+{value}% all stats in underground zones',
    effect: 'conditional_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    conditionalBonus: {
      condition: 'zone_type',
      conditionValue: 'cave',
      allStats: true,
    },
    reactions: {
      onEvent: [
        '{hero} navigated the dark tunnels with ease.',
        '{hero} felt right at home in the depths.',
      ],
    },
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: '+{value}% efficiency on long expeditions',
    effect: 'conditional_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    conditionalBonus: {
      condition: 'expedition_length',
      conditionValue: 'long',
      allStats: true,
    },
  },
  dragon_slayer: {
    id: 'dragon_slayer',
    name: 'Dragon Slayer',
    description: '+{value}% Combat vs dragon enemies',
    effect: 'conditional_bonus',
    isNegative: false,
    minValue: 15,
    maxValue: 40,
    conditionalBonus: {
      condition: 'enemy_type',
      conditionValue: 'dragon',
      stat: 'combat',
    },
  },
  lone_wolf: {
    id: 'lone_wolf',
    name: 'Lone Wolf',
    description: '+{value}% stats solo, -{value2}% in full parties',
    effect: 'trade_off',
    isNegative: false,
    minValue: 20,
    maxValue: 35,
    tradeOff: {
      positiveStat: 'combat',
      negativeStat: 'combat',
      negativeRatio: 0.6,
    },
    conditionalBonus: {
      condition: 'party_size',
      conditionValue: 'solo',
      allStats: true,
    },
  },

  // === LOOT BONUSES ===
  lucky: {
    id: 'lucky',
    name: 'Lucky',
    description: '+{value}% rare drop chance',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    lootBonus: { type: 'rare_drops' },
    reactions: {
      onLoot: [
        '{hero} found something shiny!',
        'Of course {hero} found the good stuff.',
      ],
    },
  },
  greedy: {
    id: 'greedy',
    name: 'Greedy',
    description: '+{value}% gold find',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    lootBonus: { type: 'gold' },
    reactions: {
      onLoot: [
        '{hero} immediately counted the coins.',
        '{hero} was suspiciously thorough searching corpses.',
      ],
    },
  },
  scavenger: {
    id: 'scavenger',
    name: 'Scavenger',
    description: '+{value}% material drops',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 20,
    lootBonus: { type: 'materials' },
  },

  // === EXPEDITION BONUSES ===
  swift: {
    id: 'swift',
    name: 'Swift',
    description: '-{value}% expedition time',
    effect: 'expedition_bonus',
    isNegative: false,
    minValue: 5,
    maxValue: 15,
    expeditionBonus: { type: 'speed' },
  },
  thorough: {
    id: 'thorough',
    name: 'Thorough',
    description: '+{value}% event discovery chance',
    effect: 'expedition_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    expeditionBonus: { type: 'event_chance' },
    reactions: {
      onEvent: [
        '{hero} noticed something others missed.',
        '{hero} insisted on checking one more room.',
      ],
    },
  },
  mentor: {
    id: 'mentor',
    name: 'Mentor',
    description: '+{value}% XP to party members',
    effect: 'loot_bonus',
    isNegative: false,
    minValue: 10,
    maxValue: 25,
    lootBonus: { type: 'xp' },
  },

  // === TRADE-OFFS ===
  glass_cannon: {
    id: 'glass_cannon',
    name: 'Glass Cannon',
    description: '+{value}% Combat, -{value2}% Survival',
    effect: 'trade_off',
    isNegative: false,
    minValue: 15,
    maxValue: 30,
    tradeOff: {
      positiveStat: 'combat',
      negativeStat: 'survival',
      negativeRatio: 0.7,
    },
  },
  hoarder: {
    id: 'hoarder',
    name: 'Hoarder',
    description: '+{value}% loot, -{value2}% expedition speed',
    effect: 'trade_off',
    isNegative: false,
    minValue: 20,
    maxValue: 35,
    tradeOff: {
      positiveStat: 'utility',
      negativeStat: 'utility',
      negativeRatio: 0.5,
    },
    lootBonus: { type: 'materials' },
    expeditionBonus: { type: 'speed' },
  },

  // === NEGATIVE TRAITS ===
  clumsy: {
    id: 'clumsy',
    name: 'Clumsy',
    description: '-{value}% Utility',
    effect: 'stat_bonus',
    isNegative: true,
    minValue: 3,
    maxValue: 10,
    statBonus: { stat: 'utility', isPercent: true },
    reactions: {
      onEvent: [
        '{hero} tripped over nothing.',
        '{hero} knocked something over. Again.',
      ],
    },
  },
  frail: {
    id: 'frail',
    name: 'Frail',
    description: '-{value}% Survival',
    effect: 'stat_bonus',
    isNegative: true,
    minValue: 3,
    maxValue: 10,
    statBonus: { stat: 'survival', isPercent: true },
  },
  weak: {
    id: 'weak',
    name: 'Weak',
    description: '-{value}% Combat',
    effect: 'stat_bonus',
    isNegative: true,
    minValue: 3,
    maxValue: 10,
    statBonus: { stat: 'combat', isPercent: true },
  },
  cowardly: {
    id: 'cowardly',
    name: 'Cowardly',
    description: '-{value}% Combat when facing bosses',
    effect: 'conditional_bonus',
    isNegative: true,
    minValue: 10,
    maxValue: 25,
    conditionalBonus: {
      condition: 'enemy_type',
      conditionValue: 'boss',
      stat: 'combat',
    },
    reactions: {
      onCombat: [
        '{hero} hid behind the nearest party member.',
        '{hero} suggested a tactical retreat.',
      ],
    },
  },
  unlucky: {
    id: 'unlucky',
    name: 'Unlucky',
    description: '-{value}% rare drop chance',
    effect: 'loot_bonus',
    isNegative: true,
    minValue: 5,
    maxValue: 15,
    lootBonus: { type: 'rare_drops' },
    reactions: {
      onLoot: [
        '{hero} found nothing but cobwebs.',
        'The chest was empty. Classic {hero}.',
      ],
    },
  },
}

// Helper functions
export function getGameplayTraitById(id: string): GameplayTrait | undefined {
  return GAMEPLAY_TRAITS[id]
}

export function getPositiveGameplayTraits(): GameplayTrait[] {
  return Object.values(GAMEPLAY_TRAITS).filter(t => !t.isNegative)
}

export function getNegativeGameplayTraits(): GameplayTrait[] {
  return Object.values(GAMEPLAY_TRAITS).filter(t => t.isNegative)
}
