import { defineStore } from 'pinia'
import type { Zone, Subzone } from '~~/types'
import { ZONE_FAMILIARITY_BENEFITS, SUBZONE_MASTERY_BENEFITS } from '~~/types'
import { toError } from '~~/shared/utils/errorHandler'

/**
 * Zone progress tracking (persisted per player)
 */
interface ZoneProgress {
  zoneId: string
  familiarity: number
  isUnlocked: boolean
  isMastered: boolean
  discoveredSubzones: string[] // Subzone IDs
}

/**
 * Subzone progress tracking (persisted per player)
 */
interface SubzoneProgress {
  subzoneId: string
  mastery: number
  isMastered: boolean
}

export const useZoneStore = defineStore('zones', {
  state: () => ({
    // All available zones (from game data)
    zones: [] as Zone[],

    // Player progress (from database)
    zoneProgress: {} as Record<string, ZoneProgress>,
    subzoneProgress: {} as Record<string, SubzoneProgress>,

    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get zone by ID with merged progress data
     */
    getZoneById: (state) => (id: string): Zone | undefined => {
      const zone = state.zones.find(z => z.id === id)
      if (!zone) return undefined

      const progress = state.zoneProgress[id]
      return {
        ...zone,
        familiarity: progress?.familiarity ?? 0,
        isUnlocked: progress?.isUnlocked ?? false,
        isMastered: progress?.isMastered ?? false,
        subzones: zone.subzones.map(sz => {
          const szProgress = state.subzoneProgress[sz.id]
          return {
            ...sz,
            isDiscovered: progress?.discoveredSubzones?.includes(sz.id) ?? false,
            mastery: szProgress?.mastery ?? 0,
          }
        }),
      }
    },

    /**
     * Get all unlocked zones
     */
    unlockedZones: (state) => {
      return state.zones
        .filter(z => state.zoneProgress[z.id]?.isUnlocked ?? false)
        .map(z => {
          const progress = state.zoneProgress[z.id]!
          return {
            ...z,
            familiarity: progress.familiarity,
            isUnlocked: progress.isUnlocked,
            isMastered: progress.isMastered,
          }
        })
    },

    /**
     * Get discovered subzones for a zone
     */
    getDiscoveredSubzones: (state) => (zoneId: string): Subzone[] => {
      const zone = state.zones.find(z => z.id === zoneId)
      if (!zone) return []

      const progress = state.zoneProgress[zoneId]
      if (!progress) return []

      return zone.subzones.filter(sz =>
        progress.discoveredSubzones.includes(sz.id)
      ).map(sz => {
        const szProgress = state.subzoneProgress[sz.id]
        return {
          ...sz,
          isDiscovered: true,
          mastery: szProgress?.mastery ?? 0,
        }
      })
    },

    /**
     * Get subzone by ID with progress
     */
    getSubzoneById: (state) => (zoneId: string, subzoneId: string): Subzone | undefined => {
      const zone = state.zones.find(z => z.id === zoneId)
      if (!zone) return undefined

      const subzone = zone.subzones.find(sz => sz.id === subzoneId)
      if (!subzone) return undefined

      const progress = state.zoneProgress[zoneId]
      const szProgress = state.subzoneProgress[subzoneId]

      return {
        ...subzone,
        isDiscovered: progress?.discoveredSubzones?.includes(subzoneId) ?? false,
        mastery: szProgress?.mastery ?? 0,
      }
    },

    /**
     * Check if zone is unlocked
     */
    isZoneUnlocked: (state) => (zoneId: string): boolean => {
      return state.zoneProgress[zoneId]?.isUnlocked ?? false
    },

    /**
     * Check if subzone is discovered
     */
    isSubzoneDiscovered: (state) => (zoneId: string, subzoneId: string): boolean => {
      const progress = state.zoneProgress[zoneId]
      return progress?.discoveredSubzones?.includes(subzoneId) ?? false
    },

    /**
     * Get zone familiarity benefits earned
     */
    getZoneBenefits: (state) => (zoneId: string) => {
      const progress = state.zoneProgress[zoneId]
      if (!progress) return []

      const familiarity = progress.familiarity
      type ZoneBenefit = typeof ZONE_FAMILIARITY_BENEFITS[keyof typeof ZONE_FAMILIARITY_BENEFITS]
      const benefits: Array<{ threshold: number; benefit: ZoneBenefit }> = []

      // Check each threshold
      for (const [threshold, benefit] of Object.entries(ZONE_FAMILIARITY_BENEFITS)) {
        const thresholdNum = parseInt(threshold)
        if (familiarity >= thresholdNum) {
          benefits.push({ threshold: thresholdNum, benefit })
        }
      }

      return benefits
    },

    /**
     * Get subzone mastery benefits earned
     */
    getSubzoneBenefits: (state) => (subzoneId: string) => {
      const progress = state.subzoneProgress[subzoneId]
      if (!progress) return []

      const mastery = progress.mastery
      type SubzoneBenefit = typeof SUBZONE_MASTERY_BENEFITS[keyof typeof SUBZONE_MASTERY_BENEFITS]
      const benefits: Array<{ threshold: number; benefit: SubzoneBenefit }> = []

      // Check each threshold
      for (const [threshold, benefit] of Object.entries(SUBZONE_MASTERY_BENEFITS)) {
        const thresholdNum = parseInt(threshold)
        if (mastery >= thresholdNum) {
          benefits.push({ threshold: thresholdNum, benefit })
        }
      }

      return benefits
    },

    /**
     * Get total passive income bonus from all zones
     */
    totalPassiveIncomeBonus: (state) => {
      let total = 0
      for (const [zoneId, progress] of Object.entries(state.zoneProgress)) {
        const benefits = ZONE_FAMILIARITY_BENEFITS
        for (const [threshold, benefit] of Object.entries(benefits)) {
          if (progress.familiarity >= parseInt(threshold)) {
            total += benefit.passiveIncome
          }
        }
      }
      return total
    },

    /**
     * Get zones available to unlock (requirements met)
     */
    availableToUnlock: (state) => {
      return state.zones.filter(zone => {
        const progress = state.zoneProgress[zone.id]
        if (progress?.isUnlocked) return false

        // Check unlock requirements
        const req = zone.unlockRequirement

        if (req.previousZoneId) {
          const prevProgress = state.zoneProgress[req.previousZoneId]
          if (!prevProgress?.isUnlocked) return false
        }

        // minPower and questComplete checks would be done by the caller
        // since they depend on hero data
        return true
      })
    },
  },

  actions: {
    /**
     * Initialize zones and fetch player progress
     */
    async initialize() {
      this.loading = true
      this.error = null
      try {
        // Fetch zone data and player progress
        const data = await $fetch<{
          zones: Zone[]
          progress: {
            zones: Array<{
              zoneId: string
              familiarity: number
              isUnlocked: boolean
              isMastered: boolean
              discoveredSubzones: string[]
            }>
            subzones: Array<{
              subzoneId: string
              mastery: number
              isMastered: boolean
            }>
          }
        }>('/api/zones')

        // Store zone data
        this.zones = data.zones

        // Store player progress
        this.zoneProgress = {}
        for (const zp of data.progress.zones) {
          this.zoneProgress[zp.zoneId] = zp
        }

        this.subzoneProgress = {}
        for (const sp of data.progress.subzones) {
          this.subzoneProgress[sp.subzoneId] = sp
        }
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to load zones'
        console.error('Error loading zones:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Unlock a zone
     */
    async unlockZone(zoneId: string) {
      this.error = null
      try {
        await $fetch(`/api/zones/${zoneId}/unlock`, {
          method: 'POST'
        })

        // Update local state
        const progress = this.zoneProgress[zoneId]
        if (progress) {
          progress.isUnlocked = true
        } else {
          this.zoneProgress[zoneId] = {
            zoneId,
            familiarity: 0,
            isUnlocked: true,
            isMastered: false,
            discoveredSubzones: [],
          }
        }

        // Discover the first subzone automatically
        const zone = this.zones.find(z => z.id === zoneId)
        if (zone && zone.subzones.length > 0) {
          const firstSubzone = zone.subzones.find(sz => sz.requiredZoneFamiliarity === 0)
          if (firstSubzone) {
            await this.discoverSubzone(zoneId, firstSubzone.id)
          }
        }
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to unlock zone'
        console.error('Error unlocking zone:', error)
        throw error
      }
    },

    /**
     * Discover a subzone
     */
    async discoverSubzone(zoneId: string, subzoneId: string) {
      this.error = null
      try {
        await $fetch(`/api/zones/${zoneId}/subzones/${subzoneId}/discover`, {
          method: 'POST'
        })

        // Update local state
        const progress = this.zoneProgress[zoneId]
        if (progress && !progress.discoveredSubzones.includes(subzoneId)) {
          progress.discoveredSubzones.push(subzoneId)
        }

        // Initialize subzone progress
        if (!(subzoneId in this.subzoneProgress)) {
          this.subzoneProgress[subzoneId] = {
            subzoneId,
            mastery: 0,
            isMastered: false,
          }
        }
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to discover subzone'
        console.error('Error discovering subzone:', error)
        throw error
      }
    },

    /**
     * Add familiarity to a zone (from expedition completion)
     */
    async addFamiliarity(zoneId: string, amount: number) {
      const progress = this.zoneProgress[zoneId]
      if (!progress) return

      const oldFamiliarity = progress.familiarity
      const newFamiliarity = Math.min(100, oldFamiliarity + amount)

      try {
        await $fetch(`/api/zones/${zoneId}/familiarity`, {
          method: 'POST',
          body: { amount }
        })

        // Check for subzone unlocks before updating state
        await this.checkSubzoneUnlocks(zoneId, oldFamiliarity, newFamiliarity)

        // Update local state only after all async operations succeed
        progress.familiarity = newFamiliarity

        // Check for mastery
        if (newFamiliarity >= 100 && !progress.isMastered) {
          progress.isMastered = true
        }
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to update familiarity'
        console.error('Error updating familiarity:', error)
        throw error
      }
    },

    /**
     * Add mastery to a subzone (from expedition completion)
     */
    async addMastery(subzoneId: string, amount: number) {
      const progress = this.subzoneProgress[subzoneId]
      if (!progress) return

      const newMastery = Math.min(100, progress.mastery + amount)

      try {
        await $fetch(`/api/zones/subzones/${subzoneId}/mastery`, {
          method: 'POST',
          body: { amount }
        })

        // Update local state
        progress.mastery = newMastery

        // Check for mastery completion
        if (newMastery >= 100 && !progress.isMastered) {
          progress.isMastered = true
        }
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to update mastery'
        console.error('Error updating mastery:', error)
        throw error
      }
    },

    /**
     * Check if new subzones should be unlocked based on familiarity
     */
    async checkSubzoneUnlocks(zoneId: string, oldFamiliarity: number, newFamiliarity: number) {
      const zone = this.zones.find(z => z.id === zoneId)
      if (!zone) return

      const progress = this.zoneProgress[zoneId]
      if (!progress) return

      // Check each familiarity threshold
      for (const [threshold, benefit] of Object.entries(ZONE_FAMILIARITY_BENEFITS)) {
        const thresholdNum = parseInt(threshold)

        // If we just crossed this threshold
        if (oldFamiliarity < thresholdNum && newFamiliarity >= thresholdNum) {
          if (benefit.unlockSubzone !== undefined) {
            // Find subzones that should be unlocked at this threshold
            const subzonesToUnlock = zone.subzones.filter(sz =>
              sz.requiredZoneFamiliarity === thresholdNum &&
              !progress.discoveredSubzones.includes(sz.id)
            )

            // Discover them
            for (const subzone of subzonesToUnlock) {
              await this.discoverSubzone(zoneId, subzone.id)
            }
          }
        }
      }
    },

    /**
     * Check if player can unlock a zone
     */
    canUnlockZone(zoneId: string, playerPower: number): { canUnlock: boolean; reason?: string } {
      const zone = this.zones.find(z => z.id === zoneId)
      if (!zone) {
        return { canUnlock: false, reason: 'Zone not found' }
      }

      const progress = this.zoneProgress[zoneId]
      if (progress?.isUnlocked) {
        return { canUnlock: false, reason: 'Already unlocked' }
      }

      const req = zone.unlockRequirement

      // Check previous zone requirement
      if (req.previousZoneId) {
        const prevProgress = this.zoneProgress[req.previousZoneId]
        if (!prevProgress?.isUnlocked) {
          return { canUnlock: false, reason: 'Previous zone not unlocked' }
        }
      }

      // Check power requirement
      if (req.minPower && playerPower < req.minPower) {
        return { canUnlock: false, reason: `Requires ${req.minPower} power` }
      }

      // Quest requirement would be checked by caller

      return { canUnlock: true }
    },

    /**
     * Get next subzone to discover in a zone
     */
    getNextSubzoneToDiscover(zoneId: string): Subzone | null {
      const zone = this.getZoneById(zoneId)
      if (!zone) return null

      const progress = this.zoneProgress[zoneId]
      if (!progress) return null

      // Find undiscovered subzones that meet familiarity requirement
      const undiscovered = zone.subzones.filter(sz =>
        !progress.discoveredSubzones.includes(sz.id) &&
        progress.familiarity >= sz.requiredZoneFamiliarity
      )

      if (undiscovered.length === 0) return null

      // Return the one with lowest familiarity requirement
      return undiscovered.reduce((lowest, current) =>
        current.requiredZoneFamiliarity < lowest.requiredZoneFamiliarity ? current : lowest
      )
    },

    /**
     * Refresh zone data (after server updates)
     */
    async refresh() {
      await this.initialize()
    },
  }
})
