import { describe, it, expect } from 'vitest'
import {
  randomInt,
  randomElement,
  randomElements,
  fisherYatesShuffle,
  weightedRandom,
  createSeededRandom,
  seededShuffle,
  randomNormal,
  randomNormalRange,
} from '~~/shared/utils/randomization'

describe('Randomization Utilities', () => {
  describe('randomInt', () => {
    it('should generate integers within specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should work with negative numbers', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(-10, -1)
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-1)
      }
    })

    it('should work with range of 1', () => {
      const result = randomInt(5, 5)
      expect(result).toBe(5)
    })

    it('should generate all values in range over many iterations', () => {
      const results = new Set<number>()
      for (let i = 0; i < 1000; i++) {
        results.add(randomInt(1, 5))
      }
      expect(results.size).toBe(5)
      expect(results.has(1)).toBe(true)
      expect(results.has(5)).toBe(true)
    })
  })

  describe('randomElement', () => {
    it('should select element from array', () => {
      const arr = ['a', 'b', 'c', 'd', 'e']
      const result = randomElement(arr)
      expect(arr).toContain(result)
    })

    it('should throw on empty array', () => {
      expect(() => randomElement([])).toThrow('Cannot select from empty array')
    })

    it('should select all elements over many iterations', () => {
      const arr = [1, 2, 3, 4, 5]
      const results = new Set<number>()
      for (let i = 0; i < 1000; i++) {
        results.add(randomElement(arr))
      }
      expect(results.size).toBe(5)
    })

    it('should handle single-element array', () => {
      const result = randomElement(['only'])
      expect(result).toBe('only')
    })
  })

  describe('randomElements', () => {
    it('should select specified number of elements', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const result = randomElements(arr, 3)
      expect(result).toHaveLength(3)
    })

    it('should not select duplicate elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = randomElements(arr, 3)
      const uniqueResults = new Set(result)
      expect(uniqueResults.size).toBe(3)
    })

    it('should handle count greater than array length', () => {
      const arr = [1, 2, 3]
      const result = randomElements(arr, 10)
      expect(result).toHaveLength(3)
    })

    it('should handle count of 0', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = randomElements(arr, 0)
      expect(result).toHaveLength(0)
    })

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]
      randomElements(arr, 3)
      expect(arr).toEqual(original)
    })
  })

  describe('fisherYatesShuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const shuffled = fisherYatesShuffle(arr)

      // Should contain all original elements
      expect(shuffled.sort((a, b) => a - b)).toEqual(arr)
    })

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]
      fisherYatesShuffle(arr)
      expect(arr).toEqual(original)
    })

    it('should handle empty array', () => {
      const result = fisherYatesShuffle([])
      expect(result).toEqual([])
    })

    it('should handle single element', () => {
      const result = fisherYatesShuffle([1])
      expect(result).toEqual([1])
    })

    it('should produce uniform distribution', () => {
      // Test uniformity by checking if each position gets each value roughly equally
      const arr = [1, 2, 3]
      const positionCounts: Record<number, Record<number, number>> = {
        0: { 1: 0, 2: 0, 3: 0 },
        1: { 1: 0, 2: 0, 3: 0 },
        2: { 1: 0, 2: 0, 3: 0 },
      }

      const iterations = 6000
      for (let i = 0; i < iterations; i++) {
        const shuffled = fisherYatesShuffle(arr)
        shuffled.forEach((value, position) => {
          positionCounts[position][value]++
        })
      }

      // Each value should appear in each position roughly 1/3 of the time
      // Allow 15% variance (expected ~2000, allow 1700-2300)
      const expectedCount = iterations / 3
      const tolerance = expectedCount * 0.15

      Object.values(positionCounts).forEach((counts) => {
        Object.values(counts).forEach((count) => {
          expect(count).toBeGreaterThan(expectedCount - tolerance)
          expect(count).toBeLessThan(expectedCount + tolerance)
        })
      })
    })
  })

  describe('weightedRandom', () => {
    it('should return valid key from weights', () => {
      const weights = { common: 70, rare: 25, epic: 5 }
      const result = weightedRandom(weights)
      expect(['common', 'rare', 'epic']).toContain(result)
    })

    it('should respect weight distribution', () => {
      const weights = { common: 70, rare: 25, epic: 5 }
      const results: Record<string, number> = { common: 0, rare: 0, epic: 0 }

      const iterations = 10000
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandom(weights)
        results[result]++
      }

      // Check distribution (allow 10% variance)
      const totalWeight = 100
      expect(results.common / iterations).toBeCloseTo(0.7, 1)
      expect(results.rare / iterations).toBeCloseTo(0.25, 1)
      expect(results.epic / iterations).toBeCloseTo(0.05, 1)
    })

    it('should handle equal weights', () => {
      const weights = { a: 25, b: 25, c: 25, d: 25 }
      const results: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 }

      const iterations = 4000
      for (let i = 0; i < iterations; i++) {
        const result = weightedRandom(weights)
        results[result]++
      }

      // Each should be roughly 25% (allow 15% variance)
      Object.values(results).forEach((count) => {
        expect(count / iterations).toBeCloseTo(0.25, 1)
      })
    })

    it('should handle single weight', () => {
      const weights = { only: 100 }
      const result = weightedRandom(weights)
      expect(result).toBe('only')
    })

    it('should handle very small weights', () => {
      const weights = { rare1: 0.1, rare2: 0.1, common: 99.8 }
      const result = weightedRandom(weights)
      expect(['rare1', 'rare2', 'common']).toContain(result)
    })
  })

  describe('createSeededRandom', () => {
    it('should generate deterministic sequence', () => {
      const random1 = createSeededRandom(12345)
      const sequence1 = [random1(), random1(), random1(), random1(), random1()]

      const random2 = createSeededRandom(12345)
      const sequence2 = [random2(), random2(), random2(), random2(), random2()]

      expect(sequence1).toEqual(sequence2)
    })

    it('should generate different sequences for different seeds', () => {
      const random1 = createSeededRandom(12345)
      const sequence1 = [random1(), random1(), random1()]

      const random2 = createSeededRandom(54321)
      const sequence2 = [random2(), random2(), random2()]

      expect(sequence1).not.toEqual(sequence2)
    })

    it('should generate numbers in range [0, 1)', () => {
      const random = createSeededRandom(12345)
      for (let i = 0; i < 100; i++) {
        const value = random()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    })

    it('should generate different values in sequence', () => {
      const random = createSeededRandom(12345)
      const values = new Set<number>()
      for (let i = 0; i < 10; i++) {
        values.add(random())
      }
      expect(values.size).toBeGreaterThan(1)
    })
  })

  describe('seededShuffle', () => {
    it('should produce deterministic shuffle', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      const random1 = createSeededRandom(12345)
      const shuffled1 = seededShuffle(arr, random1)

      const random2 = createSeededRandom(12345)
      const shuffled2 = seededShuffle(arr, random2)

      expect(shuffled1).toEqual(shuffled2)
    })

    it('should produce different shuffles for different seeds', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      const random1 = createSeededRandom(12345)
      const shuffled1 = seededShuffle(arr, random1)

      const random2 = createSeededRandom(54321)
      const shuffled2 = seededShuffle(arr, random2)

      expect(shuffled1).not.toEqual(shuffled2)
    })

    it('should contain all original elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const random = createSeededRandom(12345)
      const shuffled = seededShuffle(arr, random)

      expect(shuffled.sort((a, b) => a - b)).toEqual(arr)
    })

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]
      const random = createSeededRandom(12345)
      seededShuffle(arr, random)
      expect(arr).toEqual(original)
    })
  })

  describe('randomNormal', () => {
    it('should generate numbers centered around 0', () => {
      const values: number[] = []
      for (let i = 0; i < 1000; i++) {
        values.push(randomNormal())
      }

      const mean = values.reduce((sum, v) => sum + v, 0) / values.length
      expect(mean).toBeCloseTo(0, 0) // Should be close to 0
    })

    it('should generate values with standard deviation around 1', () => {
      const values: number[] = []
      for (let i = 0; i < 1000; i++) {
        values.push(randomNormal())
      }

      const mean = values.reduce((sum, v) => sum + v, 0) / values.length
      const variance =
        values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
      const stdDev = Math.sqrt(variance)

      expect(stdDev).toBeCloseTo(1, 0) // Should be close to 1
    })

    it('should generate values in typical range', () => {
      // 99.7% of values should be within 3 standard deviations
      const values: number[] = []
      for (let i = 0; i < 1000; i++) {
        values.push(randomNormal())
      }

      const withinRange = values.filter((v) => v >= -3 && v <= 3).length
      expect(withinRange / values.length).toBeGreaterThan(0.95)
    })
  })

  describe('randomNormalRange', () => {
    it('should generate numbers centered around specified mean', () => {
      const mean = 100
      const stdDev = 10

      const values: number[] = []
      for (let i = 0; i < 1000; i++) {
        values.push(randomNormalRange(mean, stdDev))
      }

      const actualMean = values.reduce((sum, v) => sum + v, 0) / values.length
      expect(actualMean).toBeCloseTo(mean, -1) // Within 10
    })

    it('should respect standard deviation', () => {
      const mean = 50
      const stdDev = 15

      const values: number[] = []
      for (let i = 0; i < 1000; i++) {
        values.push(randomNormalRange(mean, stdDev))
      }

      const actualMean = values.reduce((sum, v) => sum + v, 0) / values.length
      const variance =
        values.reduce((sum, v) => sum + (v - actualMean) ** 2, 0) /
        values.length
      const actualStdDev = Math.sqrt(variance)

      expect(actualStdDev).toBeCloseTo(stdDev, 0)
    })

    it('should work with negative mean', () => {
      const mean = -25
      const stdDev = 5

      const values: number[] = []
      for (let i = 0; i < 500; i++) {
        values.push(randomNormalRange(mean, stdDev))
      }

      const actualMean = values.reduce((sum, v) => sum + v, 0) / values.length
      expect(actualMean).toBeCloseTo(mean, 0)
    })

    it('should handle small standard deviation', () => {
      const mean = 100
      const stdDev = 1

      const values: number[] = []
      for (let i = 0; i < 500; i++) {
        values.push(randomNormalRange(mean, stdDev))
      }

      // Most values should be very close to mean
      const withinOneSigma = values.filter(
        (v) => v >= mean - stdDev && v <= mean + stdDev
      ).length
      expect(withinOneSigma / values.length).toBeGreaterThan(0.6) // ~68% expected
    })
  })
})
