/**
 * Shared randomization utilities
 * Auto-imported across client and server
 */

/**
 * Generate random integer in range [min, max] (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Select random element from array
 */
export function randomElement<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('randomElement: Cannot select from empty array')
  }
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Select multiple random elements from array (without replacement)
 * Uses Fisher-Yates shuffle
 */
export function randomElements<T>(arr: T[], count: number): T[] {
  const shuffled = fisherYatesShuffle([...arr])
  return shuffled.slice(0, Math.min(count, arr.length))
}

/**
 * Fisher-Yates shuffle for unbiased randomization
 * Returns a new shuffled array without modifying the original
 */
export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Weighted random selection from object with weights
 * Example: weightedRandom({ common: 70, rare: 25, epic: 5 }) => 'common' | 'rare' | 'epic'
 */
export function weightedRandom<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][]
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let random = Math.random() * totalWeight

  for (const [key, weight] of entries) {
    random -= weight
    if (random <= 0) {
      return key
    }
  }

  // Fallback to first entry (should never happen with valid weights)
  return entries[0][0]
}

/**
 * Create seeded random number generator
 * Useful for deterministic randomization (e.g., daily challenges)
 * Uses simple Linear Congruential Generator (LCG)
 */
export function createSeededRandom(seed: number) {
  let state = seed

  return function seededRandom(): number {
    // LCG parameters from Numerical Recipes
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32

    state = (a * state + c) % m
    return state / m
  }
}

/**
 * Seeded Fisher-Yates shuffle
 * Deterministic shuffle based on seed value
 */
export function seededShuffle<T>(arr: T[], randomFn: () => number): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate random number with normal distribution (bell curve)
 * Uses Box-Muller transform
 * Returns value centered around 0 with standard deviation of 1
 */
export function randomNormal(): number {
  const u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

/**
 * Generate random number with normal distribution in specific range
 * @param mean - Center of the distribution
 * @param stdDev - Standard deviation (spread)
 */
export function randomNormalRange(mean: number, stdDev: number): number {
  return mean + randomNormal() * stdDev
}
