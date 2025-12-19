import { v4 as uuid } from 'uuid'
import type {
  Hero,
  TavernHero,
  Rarity,
  SlotRarity,
  Stats,
  Archetype,
  Culture,
  Gender,
  GameplayTrait,
  TraitQuality,
  HeroGenerationOptions,
} from '~~/types'
import {
  RARITY_WEIGHTS,
  STAT_POINTS_BY_RARITY,
  ARCHETYPE_STAT_WEIGHTS,
  QUALITY_MULTIPLIERS,
} from '~~/types/base'
import { ARCHETYPE_TAG_POOLS, TAG_COUNT_BY_RARITY } from '~~/types/archetypes'
import { GAMEPLAY_TRAIT_COUNT, STORY_TRAIT_STARTING_COUNT } from '~~/types/traits'
import { RECRUITMENT_COSTS, TAVERN_REFRESH_HOURS } from '~~/types/recruitment'
import { getRandomName } from '~/data/names'
import { getPositiveGameplayTraits, getNegativeGameplayTraits } from '~/data/gameplayTraits'
import { getGenerationStoryTraits } from '~/data/storyTraits'
import { getRandomCulture } from '~/data/cultures'
import { randomInt, randomElement, randomElements, weightedRandom } from '~~/shared/utils/randomization'
import { getXpForLevel } from '~/utils/xpService'

// Generate rarity
function generateRarity(): Rarity {
  return weightedRandom(RARITY_WEIGHTS)
}

// Generate archetype
function generateArchetype(): Archetype {
  const archetypes: Archetype[] = ['tank', 'healer', 'debuffer', 'melee_dps', 'ranged_dps', 'caster']
  return randomElement(archetypes)
}

// Generate gender
function generateGender(): Gender {
  const roll = Math.random()
  if (roll < 0.45) return 'male'
  if (roll < 0.90) return 'female'
  return 'nonbinary'
}

// Generate stats based on rarity and archetype
function generateStats(rarity: Rarity, archetype: Archetype): Stats {
  const totalPoints = STAT_POINTS_BY_RARITY[rarity]
  const weights = ARCHETYPE_STAT_WEIGHTS[archetype]

  // Add some variance (±20%)
  const variance = 0.2
  const combatWeight = weights.combat * (1 + (Math.random() - 0.5) * variance)
  const utilityWeight = weights.utility * (1 + (Math.random() - 0.5) * variance)
  const survivalWeight = weights.survival * (1 + (Math.random() - 0.5) * variance)

  // Normalize weights
  const totalWeight = combatWeight + utilityWeight + survivalWeight

  return {
    combat: Math.round(totalPoints * (combatWeight / totalWeight)),
    utility: Math.round(totalPoints * (utilityWeight / totalWeight)),
    survival: Math.round(totalPoints * (survivalWeight / totalWeight)),
  }
}

// Generate archetype tags
function generateArchetypeTags(archetype: Archetype, rarity: Rarity): string[] {
  const pool = ARCHETYPE_TAG_POOLS[archetype]
  const count = TAG_COUNT_BY_RARITY[rarity]
  return randomElements(pool, count)
}

// Generate quality
function generateQuality(): TraitQuality {
  const roll = Math.random()
  if (roll < 0.6) return 'normal'
  if (roll < 0.9) return 'magic'
  return 'perfect'
}

// Roll trait value based on quality
function rollTraitValue(minValue: number, maxValue: number, quality: TraitQuality): number {
  const multipliers = QUALITY_MULTIPLIERS[quality]
  const range = maxValue - minValue
  const qualityMin = minValue + range * multipliers.min
  const qualityMax = minValue + range * multipliers.max
  return Math.round(qualityMin + Math.random() * (qualityMax - qualityMin))
}

// Generate gameplay traits
function generateGameplayTraits(rarity: Rarity): GameplayTrait[] {
  const config = GAMEPLAY_TRAIT_COUNT[rarity]
  const count = randomInt(config.min, config.max)

  const positiveTraits = getPositiveGameplayTraits()
  const negativeTraits = getNegativeGameplayTraits()

  const result: GameplayTrait[] = []
  const usedIds = new Set<string>()

  // Mostly positive traits
  const positiveCount = Math.max(1, count - (Math.random() < 0.3 ? 1 : 0))

  for (let i = 0; i < positiveCount; i++) {
    const available = positiveTraits.filter(t => !usedIds.has(t.id))
    if (available.length === 0) break

    const trait = randomElement(available)
    const quality = generateQuality()

    result.push({
      traitId: trait.id,
      quality,
      rolledValue: rollTraitValue(trait.minValue, trait.maxValue, quality),
    })
    usedIds.add(trait.id)
  }

  // Maybe one negative trait
  if (count > positiveCount && Math.random() < 0.3) {
    const trait = randomElement(negativeTraits)
    const quality = generateQuality()

    result.push({
      traitId: trait.id,
      quality,
      rolledValue: rollTraitValue(trait.minValue, trait.maxValue, quality),
    })
  }

  return result
}

// Generate story traits
function generateStoryTraits(): string[] {
  const count = randomInt(STORY_TRAIT_STARTING_COUNT.min, STORY_TRAIT_STARTING_COUNT.max)
  const available = getGenerationStoryTraits()
  return randomElements(available, count).map(t => t.id)
}

// Calculate hero power
function calculatePower(stats: Stats, gameplayTraits: GameplayTrait[]): number {
  // Base power from stats
  let power = stats.combat + stats.utility + stats.survival

  // Bonus from positive traits (simplified - use power calculator for full calculation)
  const positiveTraits = getPositiveGameplayTraits()
  power += gameplayTraits.filter(t => {
    // Filter out negative traits
    return positiveTraits.some(gt => gt.id === t.traitId)
  }).length * 5

  return Math.round(power)
}

// Main hero generation function
export function generateHero(options: HeroGenerationOptions = {}): Omit<Hero, 'id' | 'currentExpeditionId' | 'isFavorite' | 'createdAt' | 'updatedAt' | 'isOnExpedition' | 'isStationed' | 'stationedZoneId' | 'morale' | 'moraleValue' | 'moraleLastUpdate'> {
  const rarity = options.forceRarity ?? generateRarity()
  const archetype = options.forceArchetype ?? generateArchetype()
  const gender = options.forceGender ?? generateGender()
  const culture = options.forceCulture ?? getRandomCulture()

  const baseStats = generateStats(rarity, archetype)
  const archetypeTags = generateArchetypeTags(archetype, rarity)
  const gameplayTraits = generateGameplayTraits(rarity)
  const storyTraitIds = generateStoryTraits()

  const name = getRandomName(gender, culture)
  const power = calculatePower(baseStats, gameplayTraits)

  return {
    name,
    gender,
    culture,
    titles: [],
    displayTitle: null,
    rarity,
    archetype,
    archetypeTags,
    baseStats,
    level: 1,
    xp: 0,
    xpToNextLevel: getXpForLevel(1), // Tiered XP system: 100 XP for level 1
    gameplayTraits,
    storyTraitIds,
    power,
    equipment: {},
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },
  }
}

// Generate tavern hero (for recruitment)
export function generateTavernHero(slotRarity: SlotRarity): TavernHero {
  // Epic+ slot can generate epic or legendary
  const rarity: Rarity = slotRarity === 'epic_plus'
    ? (Math.random() < 0.8 ? 'epic' : 'legendary')
    : slotRarity

  const hero = generateHero({ forceRarity: rarity })

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + TAVERN_REFRESH_HOURS)

  return {
    ...hero,
    recruitCost: RECRUITMENT_COSTS[rarity],
    isLocked: false,
    expiresAt: expiresAt.toISOString(),
  }
}
