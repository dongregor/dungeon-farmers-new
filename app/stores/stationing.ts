import { defineStore } from 'pinia'

export type StationingProgressionTier = 'early' | 'mid' | 'late'

export interface StationingLimits {
  globalCap: number
  perZoneCap: number
}

export interface StationedHero {
  heroId: string
  zoneId: string
  stationedAt: string
  lastCollectedAt: string
}

export interface StationingReward {
  materials: Array<{ id: string; name: string; count: number }>
  familiarityGain: number
  subzoneDiscovered?: {
    zoneId: string
    subzoneId: string
    name: string
  }
  questHookGenerated?: {
    id: string
    title: string
  }
}

export interface StationingCapacity {
  tier: StationingProgressionTier
  limits: StationingLimits
  currentStationedCount: number
  availableSlots: number
}

export const STATIONING_LIMITS: Record<StationingProgressionTier, StationingLimits> = {
  early: {
    globalCap: 3,
    perZoneCap: 1,
  },
  mid: {
    globalCap: 6,
    perZoneCap: 2,
  },
  late: {
    globalCap: 10,
    perZoneCap: 2,
  },
}

export const useStationingStore = defineStore('stationing', {
  state: () => ({
    stationed: [] as StationedHero[],
    progressionTier: 'early' as StationingProgressionTier,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get current stationing limits
     */
    limits(): StationingLimits {
      return STATIONING_LIMITS[this.progressionTier]
    },

    /**
     * Get stationing capacity info
     */
    capacity(): StationingCapacity {
      return {
        tier: this.progressionTier,
        limits: this.limits,
        currentStationedCount: this.stationed.length,
        availableSlots: this.limits.globalCap - this.stationed.length,
      }
    },

    /**
     * Get stationed heroes by zone
     */
    byZone: (state) => (zoneId: string) => {
      return state.stationed.filter(s => s.zoneId === zoneId)
    },

    /**
     * Get count of stationed heroes in a zone
     */
    countInZone: (state) => (zoneId: string) => {
      return state.stationed.filter(s => s.zoneId === zoneId).length
    },

    /**
     * Check if a hero is stationed
     */
    isHeroStationed: (state) => (heroId: string) => {
      return state.stationed.some(s => s.heroId === heroId)
    },

    /**
     * Get stationed hero info
     */
    getStationedHero: (state) => (heroId: string) => {
      return state.stationed.find(s => s.heroId === heroId)
    },

    /**
     * Check if can station more heroes globally
     */
    canStationMore(): boolean {
      return this.stationed.length < this.limits.globalCap
    },

    /**
     * Check if can station more heroes in a specific zone
     */
    canStationInZone: (state) => (zoneId: string) => {
      const currentInZone = state.stationed.filter(s => s.zoneId === zoneId).length
      return currentInZone < STATIONING_LIMITS[state.progressionTier].perZoneCap
    },

    /**
     * Get all zones with stationed heroes
     */
    activeZones(): Array<{ zoneId: string; heroCount: number }> {
      const zoneMap = new Map<string, number>()

      this.stationed.forEach(s => {
        zoneMap.set(s.zoneId, (zoneMap.get(s.zoneId) || 0) + 1)
      })

      return Array.from(zoneMap.entries()).map(([zoneId, heroCount]) => ({
        zoneId,
        heroCount,
      }))
    },

    /**
     * Get heroes that have been stationed long enough to collect rewards
     */
    readyToCollect(): StationedHero[] {
      const now = Date.now()
      const minDuration = 60 * 60 * 1000 // 1 hour minimum

      return this.stationed.filter(s => {
        const lastCollected = new Date(s.lastCollectedAt).getTime()
        return now - lastCollected >= minDuration
      })
    },

    /**
     * Get count of heroes ready to collect
     */
    readyToCollectCount(): number {
      return this.readyToCollect.length
    },
  },

  actions: {
    /**
     * Fetch stationed heroes from server
     */
    async fetchStationed() {
      this.loading = true
      this.error = null

      try {
        const data = await $fetch<{
          stationed: StationedHero[]
          progressionTier: StationingProgressionTier
        }>('/api/stationing')

        this.stationed = data.stationed
        this.progressionTier = data.progressionTier
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch stationed heroes'
        console.error('Error fetching stationed heroes:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Station a hero in a zone
     */
    async stationHero(heroId: string, zoneId: string) {
      // Validate capacity
      if (!this.canStationMore) {
        throw new Error(`Cannot station more heroes (limit: ${this.limits.globalCap})`)
      }

      if (!this.canStationInZone(zoneId)) {
        throw new Error(`Cannot station more heroes in this zone (limit: ${this.limits.perZoneCap})`)
      }

      if (this.isHeroStationed(heroId)) {
        throw new Error('Hero is already stationed')
      }

      try {
        const data = await $fetch<StationedHero>('/api/stationing/station', {
          method: 'POST',
          body: { heroId, zoneId },
        })

        this.stationed.push(data)
        return data
      } catch (error: any) {
        console.error('Error stationing hero:', error)
        throw error
      }
    },

    /**
     * Recall a stationed hero
     */
    async recallHero(heroId: string) {
      const stationed = this.getStationedHero(heroId)
      if (!stationed) {
        throw new Error('Hero is not stationed')
      }

      try {
        const data = await $fetch<{
          rewards: StationingReward
          heroMoraleStatus: string
        }>('/api/stationing/recall', {
          method: 'POST',
          body: { heroId },
        })

        // Remove from stationed list
        const index = this.stationed.findIndex(s => s.heroId === heroId)
        if (index !== -1) {
          this.stationed.splice(index, 1)
        }

        return data
      } catch (error: any) {
        console.error('Error recalling hero:', error)
        throw error
      }
    },

    /**
     * Collect rewards from a stationed hero without recalling
     */
    async collectRewards(heroId: string) {
      const stationed = this.getStationedHero(heroId)
      if (!stationed) {
        throw new Error('Hero is not stationed')
      }

      try {
        const data = await $fetch<{
          rewards: StationingReward
          heroMoraleStatus: string
          autoRecalled: boolean
        }>('/api/stationing/collect', {
          method: 'POST',
          body: { heroId },
        })

        // Update last collected time
        stationed.lastCollectedAt = new Date().toISOString()

        // If hero was auto-recalled due to morale, remove from stationed list
        if (data.autoRecalled) {
          const index = this.stationed.findIndex(s => s.heroId === heroId)
          if (index !== -1) {
            this.stationed.splice(index, 1)
          }
        }

        return data
      } catch (error: any) {
        console.error('Error collecting rewards:', error)
        throw error
      }
    },

    /**
     * Collect all available rewards from all stationed heroes
     */
    async collectAllRewards() {
      const ready = this.readyToCollect
      if (ready.length === 0) {
        return { collected: 0, rewards: [] }
      }

      try {
        const data = await $fetch<{
          collected: number
          totalRewards: StationingReward
          autoRecalled: string[]
        }>('/api/stationing/collect-all', {
          method: 'POST',
        })

        // Update last collected times
        const now = new Date().toISOString()
        ready.forEach(s => {
          s.lastCollectedAt = now
        })

        // Remove auto-recalled heroes
        data.autoRecalled.forEach(heroId => {
          const index = this.stationed.findIndex(s => s.heroId === heroId)
          if (index !== -1) {
            this.stationed.splice(index, 1)
          }
        })

        return data
      } catch (error: any) {
        console.error('Error collecting all rewards:', error)
        throw error
      }
    },

    /**
     * Recall all stationed heroes
     */
    async recallAll() {
      if (this.stationed.length === 0) {
        return { recalled: 0, totalRewards: null }
      }

      try {
        const data = await $fetch<{
          recalled: number
          totalRewards: StationingReward
        }>('/api/stationing/recall-all', {
          method: 'POST',
        })

        this.stationed = []
        return data
      } catch (error: any) {
        console.error('Error recalling all heroes:', error)
        throw error
      }
    },

    /**
     * Update progression tier (unlocked through gameplay)
     */
    async updateProgressionTier(tier: StationingProgressionTier) {
      this.progressionTier = tier
    },

    /**
     * Check and auto-recall heroes that hit morale threshold
     */
    async checkMoraleThresholds() {
      try {
        const data = await $fetch<{
          recalled: string[]
          rewards: Record<string, StationingReward>
        }>('/api/stationing/check-morale', {
          method: 'POST',
        })

        // Remove recalled heroes
        data.recalled.forEach(heroId => {
          const index = this.stationed.findIndex(s => s.heroId === heroId)
          if (index !== -1) {
            this.stationed.splice(index, 1)
          }
        })

        return data
      } catch (error: any) {
        console.error('Error checking morale thresholds:', error)
        throw error
      }
    },
  },
})
