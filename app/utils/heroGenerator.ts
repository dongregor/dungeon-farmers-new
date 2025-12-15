import type { 
  Hero, 
  Gender, 
  Culture, 
  Rarity,
  Archetype,
  HeroTrait,
  StoryTrait,
  Stats
} from '~~/types'
import { getRandomName } from '~/data/names'
import { getRandomCulture, getCultureById } from '~/data/cultures'
import { getRandomGameplayTrait, rollTraitValue } from '~/data/gameplayTraits'
import { getRandomStoryTrait } from '~/data/storyTraits'
import { getArchetypeById, ARCHETYPE_DEFINITIONS } from '~~/types/archetypes'
import { RARITY_WEIGHTS, STAT_POINTS_BY_RARITY } from '~~/types/base'
import { v4 as uuidv4 } from 'uuid'

export interface HeroGenerationOptions {
  rarity?: Rarity
  archetype?: Archetype
  culture?: Culture
  gender?: Gender
  level?: number
}

export function generateHero(options: HeroGenerationOptions = {}): Hero {
  // Determine rarity
  const rarity = options.rarity || getRandomRarity()
  
  // Determine archetype
  const archetype = options.archetype || getRandomArchetype()
  const archetypeDef = getArchetypeById(archetype)
  
  // Determine culture
  const culture = options.culture || getRandomCulture().id
  const cultureDef = getCultureById(culture)
  
  // Determine gender
  const gender = options.gender || getRandomGender(culture)
  
  // Generate name
  const name = getRandomName(gender, culture)
  
  // Generate base stats
  const baseStats = generateBaseStats(rarity, archetypeDef.statWeights)
  
  // Generate traits
  const gameplayTraits = generateGameplayTraits(rarity, cultureDef, archetype)
  const storyTraits = generateStoryTraits(cultureDef)
  
  // Create hero object
  const hero: Hero = {
    id: uuidv4(),

    // Identity
    name,
    gender,
    culture,
    titles: [],
    displayTitle: null,

    // Classification
    rarity,
    archetype,
    archetypeTags: archetypeDef.tags || [],

    // Stats
    baseStats,
    level: options.level || 1,
    xp: 0,
    xpToNextLevel: calculateXpToNextLevel(options.level || 1),

    // Traits
    gameplayTraits,
    storyTraitIds: storyTraits.map(t => t.id),

    // Calculated power (will be calculated by powerCalculator)
    power: 0,

    // Equipment
    equipment: {},

    // Prestige
    prestigeLevel: 0,
    prestigeBonuses: { combat: 0, utility: 0, survival: 0 },

    // State
    currentExpeditionId: null,
    isFavorite: false,

    // Morale
    morale: 'content',
    moraleLastUpdate: new Date().toISOString(),

    // Active status
    isOnExpedition: false,
    isStationed: false,
    stationedZoneId: null,

    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  return hero
}

function getRandomRarity(): Rarity {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0)
  let random = Math.random() * totalWeight
  
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    random -= weight
    if (random <= 0) {
      return rarity as Rarity
    }
  }
  
  return 'common'
}

function getRandomArchetype(): Archetype {
  return ARCHETYPE_DEFINITIONS[Math.floor(Math.random() * ARCHETYPE_DEFINITIONS.length)].id
}

function getRandomGender(culture: Culture): Gender {
  // Use culture preferences for gender distribution
  const cultureDef = getCultureById(culture)
  const totalWeight = Object.values(cultureDef.commonTraits).reduce((sum, weight) => sum + weight, 0)
  let random = Math.random() * totalWeight
  
  for (const [gender, weight] of Object.entries(cultureDef.commonTraits)) {
    random -= weight
    if (random <= 0) {
      return gender as Gender
    }
  }
  
  return 'male'
}

function generateBaseStats(rarity: Rarity, statWeights: Stats): Stats {
  const totalPoints = STAT_POINTS_BY_RARITY[rarity]
  const stats: Stats = { combat: 0, utility: 0, survival: 0 }
  
  // Distribute points based on archetype weights
  const totalWeight = statWeights.combat + statWeights.utility + statWeights.survival
  
  stats.combat = Math.round((statWeights.combat / totalWeight) * totalPoints)
  stats.utility = Math.round((statWeights.utility / totalWeight) * totalPoints)
  stats.survival = Math.round((statWeights.survival / totalWeight) * totalPoints)
  
  // Add some randomness
  const remainingPoints = totalPoints - (stats.combat + stats.utility + stats.survival)
  if (remainingPoints > 0) {
    const randomStat = Math.floor(Math.random() * 3)
    if (randomStat === 0) stats.combat += remainingPoints
    else if (randomStat === 1) stats.utility += remainingPoints
    else stats.survival += remainingPoints
  }
  
  return stats
}

function generateGameplayTraits(
  rarity: Rarity,
  cultureDef: any,
  archetype: Archetype
): HeroTrait[] {
  const traits: HeroTrait[] = []
  const numTraits = getTraitCountByRarity(rarity)
  
  // Get archetype-specific traits
  const archetypeDef = getArchetypeById(archetype)
  
  for (let i = 0; i < numTraits; i++) {
    let trait
    
    // 60% chance for archetype-related trait, 40% random
    if (Math.random() < 0.6 && archetypeDef.tags.length > 0) {
      // Get trait that matches archetype tags
      trait = getRandomGameplayTrait()
    } else {
      trait = getRandomGameplayTrait()
    }
    
    // Determine quality based on rarity
    const quality = getTraitQualityByRarity(rarity)
    const value = rollTraitValue(trait, quality)
    
    traits.push({
      traitId: trait.id,
      rolledValue: value,
      quality
    })
  }
  
  return traits
}

function generateStoryTraits(cultureDef: any): StoryTrait[] {
  const traits: StoryTrait[] = []
  const numTraits = 1 + Math.floor(Math.random() * 2) // 1-2 story traits
  
  for (let i = 0; i < numTraits; i++) {
    // 70% chance for culture-common trait, 30% for rare
    const trait = Math.random() < 0.7 
      ? getRandomStoryTrait()
      : getRandomStoryTrait()
    
    traits.push({
      traitId: trait.id
    })
  }
  
  return traits
}

function getTraitCountByRarity(rarity: Rarity): number {
  switch (rarity) {
    case 'common': return 1
    case 'uncommon': return 2
    case 'rare': return 3
    case 'epic': return 4
    case 'legendary': return 5
    default: return 1
  }
}

function getTraitQualityByRarity(rarity: Rarity): 'normal' | 'magic' | 'perfect' {
  switch (rarity) {
    case 'common': return 'normal'
    case 'uncommon': return Math.random() < 0.7 ? 'normal' : 'magic'
    case 'rare': return Math.random() < 0.5 ? 'magic' : 'normal'
    case 'epic': return Math.random() < 0.7 ? 'magic' : 'perfect'
    case 'legendary': return Math.random() < 0.5 ? 'perfect' : 'magic'
    default: return 'normal'
  }
}

function calculateXpToNextLevel(currentLevel: number): number {
  // XP formula: level * 100 (base) + (level^2 * 50) for scaling
  return currentLevel * 100 + (currentLevel * currentLevel * 50)
}