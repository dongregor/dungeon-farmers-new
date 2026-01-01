import type { TraitReaction, LogEntryType } from '~~/types/logs'

/**
 * Trait reactions for expedition log entries.
 * These define how heroes with specific traits react to different log events.
 * Each reaction includes:
 * - traitId: The trait that triggers the reaction
 * - triggers: What entry types (and optionally zone types) activate this reaction
 * - reactions: Array of reaction text variations with {hero} placeholder
 * - triggerChance: Probability of triggering (0.0-1.0)
 * - rarityBoost: How much to boost log entry rarity (0, 1, or 2 tiers)
 */
export const TRAIT_REACTIONS: Record<string, TraitReaction> = {
  // === LOOT-FOCUSED TRAITS ===
  lootGoblin: {
    traitId: 'lootGoblin',
    triggers: { entryTypes: ['loot'] },
    reactions: [
      '{hero}: "Mine! I saw it first!"',
      '{hero} was already stuffing it into their pack.',
      "{hero}'s eyes gleamed with naked greed.",
      'Before anyone could react, {hero} had pocketed it.',
      '{hero} whispered "precious..." a bit too intensely.',
    ],
    triggerChance: 0.7,
    rarityBoost: 1,
  },

  treasureHunter: {
    traitId: 'treasureHunter',
    triggers: { entryTypes: ['loot', 'event'] },
    reactions: [
      "{hero}'s treasure sense was tingling.",
      '"There\'s more here," {hero} insisted.',
      '{hero} tapped the walls, listening for hollow spots.',
      '{hero} checked behind every suspicious stone.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1,
  },

  // === COMBAT-FOCUSED TRAITS ===
  brawny: {
    traitId: 'brawny',
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero} flexed menacingly at the enemy.',
      '{hero} cracked their knuckles before the fight.',
      '{hero} picked up and threw the nearest enemy.',
      "The enemy reconsidered after seeing {hero}'s muscles.",
    ],
    triggerChance: 0.5,
    rarityBoost: 0,
  },

  overconfident: {
    traitId: 'overconfident',
    triggers: { entryTypes: ['combat'] },
    reactions: [
      "\"Is that all you've got?\" taunted {hero}.",
      "{hero} didn't bother dodging. Mistake.",
      '{hero} fought three enemies at once. Unnecessarily.',
      '"I could do this blindfolded!" {hero} announced.',
      '{hero} yawned mid-battle to show dominance.',
    ],
    triggerChance: 0.6,
    rarityBoost: 1,
  },

  coward: {
    traitId: 'coward',
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero} hid behind a rock during the fight.',
      '{hero} fought from a safe distance. Very safe.',
      '"Strategic retreat!" yelled {hero}, already running.',
      '{hero} found urgent business inspecting the ceiling.',
      '{hero} volunteered to guard the rear. Way back.',
    ],
    triggerChance: 0.6,
    rarityBoost: 1,
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
      '{hero} evaluated everything for flammability.',
    ],
    triggerChance: 0.7,
    rarityBoost: 1,
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
    rarityBoost: 0,
  },

  caveExplorer: {
    traitId: 'caveExplorer',
    triggers: { entryTypes: ['travel', 'event'], zoneTypes: ['cave'] },
    reactions: [
      '{hero} navigated the tunnels with ease.',
      '"I know these caves," muttered {hero}.',
      '{hero} found a shortcut only they could see.',
      "The darkness didn't slow {hero} at all.",
    ],
    triggerChance: 0.6,
    rarityBoost: 0,
  },

  // === QUIRKY TRAITS ===
  grumpy: {
    traitId: 'grumpy',
    triggers: { entryTypes: ['travel', 'event', 'combat'] },
    reactions: [
      '{hero} complained about the weather. Again.',
      '"This is a waste of time," muttered {hero}.',
      '{hero} grumbled about everything. Standard.',
      '{hero} crossed their arms and huffed.',
      "Nothing satisfied {hero}. As usual.",
    ],
    triggerChance: 0.5,
    rarityBoost: 0,
  },

  superstitious: {
    traitId: 'superstitious',
    triggers: { entryTypes: ['event', 'travel'] },
    reactions: [
      '{hero} threw salt over their shoulder.',
      '"We need to leave an offering first!" insisted {hero}.',
      '{hero} refused to walk under that archway.',
      'Something about this place made {hero} nervous.',
      '{hero} performed a luck ritual before entering.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1,
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
    rarityBoost: 1,
  },

  bookworm: {
    traitId: 'bookworm',
    triggers: { entryTypes: ['event', 'loot'] },
    reactions: [
      '{hero} stopped to read every inscription.',
      '"Wait, I read about this!" exclaimed {hero}.',
      '{hero} took notes for later study.',
      '{hero} found a dusty tome and got distracted.',
      '"According to my research..." began {hero}.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1,
  },

  glutton: {
    traitId: 'glutton',
    triggers: { entryTypes: ['event', 'travel'] },
    reactions: [
      "{hero}'s stomach growled ominously.",
      '{hero} wondered if the monsters were edible.',
      '"Is it lunch yet?" asked {hero}.',
      '{hero} found snacks hidden in unexpected places.',
      '{hero} suggested a food break. The third one.',
    ],
    triggerChance: 0.5,
    rarityBoost: 0,
  },

  nightOwl: {
    traitId: 'nightOwl',
    triggers: { entryTypes: ['travel', 'combat'] },
    reactions: [
      '{hero} perked up as darkness fell.',
      '{hero} navigated the shadows effortlessly.',
      '"Finally, my time to shine," whispered {hero}.',
      '{hero} seemed more alert in the dark.',
      'The darkness was {hero}\'s ally.',
    ],
    triggerChance: 0.5,
    rarityBoost: 0,
  },

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
    rarityBoost: 1,
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
    rarityBoost: 1,
  },

  healer: {
    traitId: 'healer',
    triggers: { entryTypes: ['combat'], outcome: 'any' },
    reactions: [
      "{hero} patched up the team's wounds.",
      '"Hold still," {hero} muttered while bandaging.',
      '{hero} distributed healing supplies.',
      'Thanks to {hero}, everyone stayed on their feet.',
    ],
    triggerChance: 0.5,
    rarityBoost: 0,
  },

  // === ACQUIRED TRAITS ===
  dragonSurvivor: {
    traitId: 'dragonSurvivor',
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero} recalled facing worse.',
      '{hero} mentioned that one time with the dragon.',
      '"You call this scary?" scoffed {hero}.',
      '{hero} had seen bigger threats. Literally.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1,
  },

  cursed: {
    traitId: 'cursed',
    triggers: { entryTypes: ['event', 'loot'] },
    reactions: [
      'Something unlucky happened near {hero}.',
      "{hero}'s curse acted up again.",
      'The shadows around {hero} seemed darker.',
      '{hero} had a bad feeling about this.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1,
  },
}

/**
 * Get all reactions that match a trait and entry type.
 * Optionally filter by zone type if the reaction has zone restrictions.
 *
 * @param traitId - The trait ID to look up
 * @param entryType - The log entry type to match
 * @param zoneType - Optional zone type for filtering reactions with zone restrictions
 * @returns Array of matching TraitReaction objects (empty if no match)
 */
export function getReactionsForTrait(
  traitId: string,
  entryType: LogEntryType,
  zoneType?: string
): TraitReaction[] {
  const reaction = TRAIT_REACTIONS[traitId]
  if (!reaction) return []

  // Check entry type match
  if (reaction.triggers.entryTypes && !reaction.triggers.entryTypes.includes(entryType)) {
    return []
  }

  // Check zone type if the reaction has zone restrictions
  if (reaction.triggers.zoneTypes && reaction.triggers.zoneTypes.length > 0) {
    // If reaction requires specific zones, check if provided zone matches
    if (zoneType && !reaction.triggers.zoneTypes.includes(zoneType as never)) {
      return []
    }
    // If no zone provided but reaction requires zones, still match
    // (caller can choose to filter further)
    if (!zoneType) {
      return [reaction]
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

/**
 * Pick a random reaction text from a TraitReaction
 *
 * @param reaction - The trait reaction to pick from
 * @returns A random reaction text string
 */
export function pickRandomReaction(reaction: TraitReaction): string {
  const index = Math.floor(Math.random() * reaction.reactions.length)
  return reaction.reactions[index]
}
