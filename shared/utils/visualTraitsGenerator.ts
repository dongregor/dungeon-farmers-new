import type { HeroVisualTraits } from '~~/types/heroVisuals'
import type { Archetype, Gender, Culture } from '~~/types/base'
import {
  SKIN_TONES,
  HAIR_COLORS,
  CLOTHING_PALETTES,
  HAIR_STYLE_COUNT,
  CULTURE_SKIN_WEIGHTS,
} from '~~/types/heroVisuals'

// Seeded random number generator for reproducibility
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507)
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909)
    hash ^= hash >>> 16
    return (hash >>> 0) / 4294967296
  }
}

// Pick index from weighted array
function weightedRandomIndex(weights: number[], rng: () => number): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = rng() * total

  for (let i = 0; i < weights.length; i++) {
    const weight = weights[i] ?? 0
    roll -= weight
    if (roll <= 0) return i
  }

  return weights.length - 1
}

// Generate visual traits for a hero
export function generateVisualTraits(
  heroId: string,
  archetype: Archetype,
  gender: Gender,
  culture: Culture
): HeroVisualTraits {
  const rng = seededRandom(heroId)

  // Skin tone influenced by culture (fallback to even distribution if culture unknown)
  const skinWeights = CULTURE_SKIN_WEIGHTS[culture] ?? [0.2, 0.2, 0.2, 0.2, 0.2]
  const skinTone = weightedRandomIndex(skinWeights, rng)

  // Hair color (purely random)
  const hairColor = Math.floor(rng() * HAIR_COLORS.length)

  // Hair style (gender-specific count)
  const hairStyle = Math.floor(rng() * HAIR_STYLE_COUNT[gender])

  // Clothing colors from archetype palette
  const paletteSize = CLOTHING_PALETTES[archetype].length
  const primaryColor = Math.floor(rng() * paletteSize)
  let secondaryColor = Math.floor(rng() * paletteSize)
  // Ensure secondary differs from primary
  if (secondaryColor === primaryColor) {
    secondaryColor = (secondaryColor + 1) % paletteSize
  }

  // Face shape (simple variation)
  const faceShape = Math.floor(rng() * 4)

  return {
    skinTone,
    hairColor,
    hairStyle,
    primaryColor,
    secondaryColor,
    faceShape,
  }
}
