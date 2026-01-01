import type { Hero } from '~~/types'
import type { LogEntryType, HeroReaction } from '~~/types/logs'
import { getReactionsForTrait } from '~/data/logs/reactions/traits'
import { findPairReaction } from '~/data/logs/reactions/pairs'

/**
 * Select reactions for a log entry based on party traits.
 *
 * Selection process:
 * 1. Check for pair reactions first (higher priority)
 * 2. Check individual trait reactions
 * 3. 20% chance of second reaction when first triggers
 * 4. Maximum 2 reactions per entry
 *
 * @param heroes - Party members to check for reactions
 * @param entryType - The log entry type to match reactions against
 * @param zoneType - Optional zone type for filtering zone-specific reactions
 * @returns Array of hero reactions (max 2)
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
 *
 * @param reactions - Array of hero reactions
 * @returns Sum of all rarity boosts
 */
export function getTotalRarityBoost(reactions: HeroReaction[]): number {
  return reactions.reduce((sum, r) => sum + r.rarityBoost, 0)
}
