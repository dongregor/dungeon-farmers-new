import { defineStore } from 'pinia'
import type { Zone, Subzone } from '~~/types'
import { ZONE_FAMILIARITY_BENEFITS, SUBZONE_MASTERY_BENEFITS } from '~~/types'

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
    zoneProgress: new Map<string, ZoneProgress>(),
    subzoneProgress: new Map<string, SubzoneProgress>(),

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

      const progress = state.zoneProgress.get(id)
      return {
        ...zone,
        familiarity: progress?.familiarity ?? 0,
        isUnlocked: progress?.isUnlocked ?? false,
        isMastered: progress?.isMastered ?? false,
        subzones: zone.subzones.map(sz => {
          const szProgress = state.subzoneProgress.get(sz.id)
          return {
            ...sz,
            isDiscovered: progress?.discoveredSubzones.includes(sz.id) ?? false,
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
        .filter(z => state.zoneProgress.get(z.id)?.isUnlocked ?? false)
        .map(z => {
          const progress = state.zoneProgress.get(z.id)!
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

      const progress = state.zoneProgress.get(zoneId)
      if (!progress) return []

      return zone.subzones.filter(sz =>
        progress.discoveredSubzones.includes(sz.id)
      ).map(sz => {
        const szProgress = state.subzoneProgress.get(sz.id)
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

      const progress = state.zoneProgress.get(zoneId)
      const szProgress = state.subzoneProgress.get(subzoneId)

      return {
        ...subzone,
        isDiscovered: progress?.discoveredSubzones.includes(subzoneId) ?? false,
        mastery: szProgress?.mastery ?? 0,
      }
    },

    /**
     * Check if zone is unlocked
     */
    isZoneUnlocked: (state) => (zoneId: string): boolean => {
      return state.zoneProgress.get(zoneId)?.isUnlocked ?? false
    },

    /**
     * Check if subzone is discovered
     */
    isSubzoneDiscovered: (state) => (zoneId: string, subzoneId: string): boolean => {
      const progress = state.zoneProgress.get(zoneId)
      return progress?.discoveredSubzones.includes(subzoneId) ?? false
    },

    /**
     * Get zone familiarity benefits earned
     */
    getZoneBenefits: (state) => (zoneId: string) => {
      const progress = state.zoneProgress.get(zoneId)
      if (!progress) return []

      const familiarity = progress.familiarity
      const benefits: Array<{ threshold: number; benefit: any }> = []

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
      const progress = state.subzoneProgress.get(subzoneId)
      if (!progress) return []

      const mastery = progress.mastery
      const benefits: Array<{ threshold: number; benefit: any }> = []

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
      for (const [zoneId, progress] of state.zoneProgress.entries()) {
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
        const progress = state.zoneProgress.get(zone.id)
        if (progress?.isUnlocked) return false

        // Check unlock requirements
        const req = zone.unlockRequirement

        if (req.previousZoneId) {
          const prevProgress = state.zoneProgress.get(req.previousZoneId)
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
        this.zoneProgress.clear()
        for (const zp of data.progress.zones) {
          this.zoneProgress.set(zp.zoneId, zp)
        }

        this.subzoneProgress.clear()
        for (const sp of data.progress.subzones) {
          this.subzoneProgress.set(sp.subzoneId, sp)
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to load zones'
        console.error('Error loading zones:', e)
        throw e
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
        const progress = this.zoneProgress.get(zoneId)
        if (progress) {
          progress.isUnlocked = true
        } else {
          this.zoneProgress.set(zoneId, {
            zoneId,
            familiarity: 0,
            isUnlocked: true,
            isMastered: false,
            discoveredSubzones: [],
          })
        }

        // Discover the first subzone automatically
        const zone = this.zones.find(z => z.id === zoneId)
        if (zone && zone.subzones.length > 0) {
          const firstSubzone = zone.subzones.find(sz => sz.requiredZoneFamiliarity === 0)
          if (firstSubzone) {
            await this.discoverSubzone(zoneId, firstSubzone.id)
          }
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to unlock zone'
        console.error('Error unlocking zone:', e)
        throw e
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
        const progress = this.zoneProgress.get(zoneId)
        if (progress && !progress.discoveredSubzones.includes(subzoneId)) {
          progress.discoveredSubzones.push(subzoneId)
        }

        // Initialize subzone progress
        if (!this.subzoneProgress.has(subzoneId)) {
          this.subzoneProgress.set(subzoneId, {
            subzoneId,
            mastery: 0,
            isMastered: false,
          })
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to discover subzone'
        console.error('Error discovering subzone:', e)
        throw e
      }
    },

    /**
     * Add familiarity to a zone (from expedition completion)
     */
    async addFamiliarity(zoneId: string, amount: number) {
      const progress = this.zoneProgress.get(zoneId)
      if (!progress) return

      const oldFamiliarity = progress.familiarity
      const newFamiliarity = Math.min(100, oldFamiliarity + amount)

      try {
        await $fetch(`/api/zones/${zoneId}/familiarity`, {
          method: 'POST',
          body: { amount }
        })

        // Update local state
        progress.familiarity = newFamiliarity

        // Check for mastery
        if (newFamiliarity >= 100 && !progress.isMastered) {
          progress.isMastered = true
        }

        // Check for subzone unlocks
        await this.checkSubzoneUnlocks(zoneId, oldFamiliarity, newFamiliarity)
      } catch (e: any) {
        this.error = e.message || 'Failed to update familiarity'
        console.error('Error updating familiarity:', e)
      }
    },

    /**
     * Add mastery to a subzone (from expedition completion)
     */
    async addMastery(subzoneId: string, amount: number) {
      const progress = this.subzoneProgress.get(subzoneId)
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
      } catch (e: any) {
        this.error = e.message || 'Failed to update mastery'
        console.error('Error updating mastery:', e)
      }
    },

    /**
     * Check if new subzones should be unlocked based on familiarity
     */
    async checkSubzoneUnlocks(zoneId: string, oldFamiliarity: number, newFamiliarity: number) {
      const zone = this.zones.find(z => z.id === zoneId)
      if (!zone) return

      const progress = this.zoneProgress.get(zoneId)
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

      const progress = this.zoneProgress.get(zoneId)
      if (progress?.isUnlocked) {
        return { canUnlock: false, reason: 'Already unlocked' }
      }

      const req = zone.unlockRequirement

      // Check previous zone requirement
      if (req.previousZoneId) {
        const prevProgress = this.zoneProgress.get(req.previousZoneId)
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

      const progress = this.zoneProgress.get(zoneId)
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
