import { describe, it, expect } from 'vitest'
import { buildSkeleton, calculateEntryCount } from '~/utils/logs/skeleton'

describe('Skeleton Builder', () => {
  describe('calculateEntryCount', () => {
    it('should return 3-4 for 15 min expeditions', () => {
      const count = calculateEntryCount(15)
      expect(count).toBeGreaterThanOrEqual(3)
      expect(count).toBeLessThanOrEqual(4)
    })

    it('should return 8-10 for 120 min expeditions', () => {
      const count = calculateEntryCount(120)
      expect(count).toBeGreaterThanOrEqual(8)
      expect(count).toBeLessThanOrEqual(10)
    })

    it('should scale with duration', () => {
      const short = calculateEntryCount(15)
      const long = calculateEntryCount(120)
      expect(long).toBeGreaterThan(short)
    })
  })

  describe('buildSkeleton', () => {
    it('should always start with departure', () => {
      const skeleton = buildSkeleton(5)
      expect(skeleton[0].type).toBe('departure')
    })

    it('should always end with return', () => {
      const skeleton = buildSkeleton(5)
      expect(skeleton[skeleton.length - 1].type).toBe('return')
    })

    it('should include at least one combat', () => {
      const skeleton = buildSkeleton(5)
      const hasCombat = skeleton.some(s => s.type === 'combat')
      expect(hasCombat).toBe(true)
    })

    it('should have correct length', () => {
      expect(buildSkeleton(5)).toHaveLength(5)
      expect(buildSkeleton(8)).toHaveLength(8)
    })

    it('should mark climax entry', () => {
      const skeleton = buildSkeleton(6)
      const hasClimax = skeleton.some(s => s.isClimax)
      expect(hasClimax).toBe(true)
    })
  })
})
