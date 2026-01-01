import type { TraitPairReaction, LogEntryType } from '~~/types/logs'

/**
 * Pair reactions for trait combinations.
 * These trigger when two heroes with specific trait combos are in the same party.
 * Pair reactions:
 * - Always boost rarity (1 or 2 tiers)
 * - Use {hero1} for first trait holder, {hero2} for second
 * - Create memorable moments from trait chemistry
 */
export const PAIR_REACTIONS: TraitPairReaction[] = [
  // === COMBAT PAIR REACTIONS ===
  {
    traitIds: ['coward', 'overconfident'],
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero2} charged in alone while {hero1} found urgent business behind a rock.',
      '"Cover me!" yelled {hero2}. {hero1} was already covering themselves. In leaves.',
      '{hero1} helpfully pointed out enemies from very far away. {hero2} didn\'t need the help.',
      '"We\'ll flank them!" suggested {hero1}, already flanking toward the exit while {hero2} flanked the enemy.',
      '{hero2} challenged all enemies at once. {hero1} challenged the concept of staying.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2,
  },

  {
    traitIds: ['brawny', 'stealthy'],
    triggers: { entryTypes: ['combat'] },
    reactions: [
      '{hero2} snuck up behind the enemy. {hero1} just walked through the front wall.',
      '"Subtlety," {hero2} whispered. {hero1} was already throwing enemies.',
      '{hero2}\'s careful ambush was slightly undermined by {hero1}\'s war cry.',
      'The pincer attack worked: {hero2} struck from behind while {hero1} struck from... everywhere.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1,
  },

  // === LOOT PAIR REACTIONS ===
  {
    traitIds: ['lootGoblin', 'treasureHunter'],
    triggers: { entryTypes: ['loot'] },
    reactions: [
      '{hero1} and {hero2} spotted the treasure simultaneously. The staredown began.',
      '"I saw it first!" argued {hero1}. "I smelled it first!" countered {hero2}.',
      '{hero2} found a hidden cache. {hero1} was already there somehow.',
      'The party had to intervene before {hero1} and {hero2} came to blows over who got dibs.',
      '{hero1}\'s grabby hands met {hero2}\'s treasure sense. Competition ensued.',
    ],
    triggerChance: 0.6,
    rarityBoost: 2,
  },

  // === PERSONALITY CLASH REACTIONS ===
  {
    traitIds: ['grumpy', 'dramatic'],
    triggers: { entryTypes: ['travel', 'event', 'combat'] },
    reactions: [
      '"This is our DESTINY!" proclaimed {hero2}. "This is a waste of time," replied {hero1}.',
      '{hero2} narrated their journey poetically. {hero1} provided grumpy commentary.',
      '{hero1}\'s complaints somehow made {hero2} MORE dramatic.',
      '"Behold the majesty!" {hero2} gestured. {hero1} beheld. Was not impressed.',
      '{hero2} struck a heroic pose. {hero1} pretended not to know them.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2,
  },

  {
    traitIds: ['nightOwl', 'superstitious'],
    triggers: { entryTypes: ['travel', 'event'] },
    reactions: [
      '{hero1} thrived in the darkness. {hero2} threw salt into it nervously.',
      '"Perfect hunting conditions!" said {hero1}. "Perfect cursing conditions," muttered {hero2}.',
      '{hero2} performed protective rituals while {hero1} navigated the shadows.',
      'The dark didn\'t bother {hero1}. It very much bothered {hero2}.',
      '{hero1} found comfort in the night. {hero2} found omens in it.',
    ],
    triggerChance: 0.5,
    rarityBoost: 1,
  },

  // === CHAOS PAIR REACTIONS ===
  {
    traitIds: ['pyromaniac', 'bookworm'],
    triggers: { entryTypes: ['event'] },
    reactions: [
      '{hero2} found an ancient scroll. {hero1} was already reaching for a torch.',
      '"SAVE THE BOOKS!" screamed {hero2} as {hero1} cackled.',
      '"It\'s very flammable," noted {hero1}. "It\'s very RARE," countered {hero2}.',
      '{hero2} guarded the archives from {hero1}\'s enthusiasm.',
      '{hero1}\'s fire lit {hero2}\'s reading... from a safe distance.',
    ],
    triggerChance: 0.5,
    rarityBoost: 2,
  },

  {
    traitIds: ['glutton', 'healer'],
    triggers: { entryTypes: ['travel', 'event'] },
    reactions: [
      '{hero2} rationed the supplies. {hero1} ate the rations.',
      '"That\'s medicinal!" protested {hero2} as {hero1} sampled the herbs.',
      '{hero1} asked if healing potions were edible. {hero2} said no. {hero1} disagreed.',
      '{hero2} treated {hero1}\'s stomachache. Again.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1,
  },

  // === COMPATIBLE PAIR REACTIONS ===
  {
    traitIds: ['caffeineDependent', 'bookworm'],
    triggers: { entryTypes: ['event', 'travel'] },
    reactions: [
      '{hero1} and {hero2} found a ruined library with a coffee stain. Both were thrilled.',
      '{hero2} read aloud while {hero1} brewed something suspicious.',
      '"Study break?" offered {hero1}. {hero2} agreed enthusiastically.',
      '{hero1} and {hero2} discovered the dungeon\'s true treasure: a coffee-stained spellbook.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1,
  },

  {
    traitIds: ['forestFriend', 'caveExplorer'],
    triggers: { entryTypes: ['travel'], zoneTypes: ['forest', 'cave'] },
    reactions: [
      'Between {hero1}\'s woodland knowledge and {hero2}\'s cave sense, no path was unknown.',
      '{hero1} led through the forest. {hero2} took over when they reached the caves.',
      '"The trees told me there\'s a cave ahead," said {hero1}. "And I know that cave!" replied {hero2}.',
    ],
    triggerChance: 0.4,
    rarityBoost: 1,
  },

  {
    traitIds: ['dragonSurvivor', 'cursed'],
    triggers: { entryTypes: ['combat', 'event'] },
    reactions: [
      '{hero1}\'s survival instincts and {hero2}\'s bad luck made for interesting expeditions.',
      '"I\'ve faced dragons," boasted {hero1}. "With MY luck, we\'ll meet one," sighed {hero2}.',
      '{hero2}\'s curse triggered. {hero1} handled it with dragon-tested composure.',
      'Something went wrong. {hero2} blamed the curse. {hero1} just shrugged and dealt with it.',
    ],
    triggerChance: 0.4,
    rarityBoost: 2,
  },
]

/**
 * Find a pair reaction that matches the given traits and entry type.
 * Checks if any pair's traits are both present in the provided trait array.
 *
 * @param traitIds - Array of trait IDs present in the party
 * @param entryType - The log entry type to match
 * @param zoneType - Optional zone type for filtering reactions with zone restrictions
 * @returns Matching TraitPairReaction or null if no match
 */
export function findPairReaction(
  traitIds: string[],
  entryType: LogEntryType,
  zoneType?: string
): TraitPairReaction | null {
  for (const pair of PAIR_REACTIONS) {
    // Check if both traits in the pair are present in the party
    const [trait1, trait2] = pair.traitIds
    if (!traitIds.includes(trait1) || !traitIds.includes(trait2)) {
      continue
    }

    // Check entry type match
    if (pair.triggers.entryTypes && !pair.triggers.entryTypes.includes(entryType)) {
      continue
    }

    // Check zone type if the pair has zone restrictions
    if (pair.triggers.zoneTypes && pair.triggers.zoneTypes.length > 0) {
      if (!zoneType || !pair.triggers.zoneTypes.includes(zoneType as never)) {
        continue
      }
    }

    return pair
  }

  return null
}

/**
 * Get all unique trait IDs that appear in pair reactions.
 * Useful for identifying which traits have special pair chemistry.
 *
 * @returns Array of unique trait IDs that appear in pairs
 */
export function getTraitIdsInPairs(): string[] {
  const traitSet = new Set<string>()

  for (const pair of PAIR_REACTIONS) {
    traitSet.add(pair.traitIds[0])
    traitSet.add(pair.traitIds[1])
  }

  return Array.from(traitSet)
}

/**
 * Pick a random reaction text from a pair reaction
 *
 * @param pair - The pair reaction to pick from
 * @returns A random reaction text string
 */
export function pickRandomPairReaction(pair: TraitPairReaction): string {
  if (pair.reactions.length === 0) {
    return ''
  }
  const index = Math.floor(Math.random() * pair.reactions.length)
  return pair.reactions[index]!
}
