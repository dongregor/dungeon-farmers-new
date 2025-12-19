import { defineStore } from 'pinia'
import { toError } from '~~/shared/utils/errorHandler'
import type { PartyPreset } from '~~/types/hero'

export const usePresetStore = defineStore('presets', {
  state: () => ({
    presets: [] as PartyPreset[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get preset by ID
     */
    getPresetById: (state) => (id: string) => {
      return state.presets.find(p => p.id === id)
    },

    /**
     * Get presets sorted by last used
     */
    sortedByLastUsed: (state) => {
      return [...state.presets].sort((a, b) => {
        const aTime = new Date(a.lastUsedAt || a.createdAt).getTime()
        const bTime = new Date(b.lastUsedAt || b.createdAt).getTime()
        return bTime - aTime
      })
    },

    /**
     * Get presets for a specific zone
     */
    getPresetsForZone: (state) => (zoneId: string) => {
      return state.presets.filter(p => p.preferredZoneId === zoneId)
    },

    /**
     * Check if preset name is available
     */
    isNameAvailable: (state) => (name: string, excludeId?: string) => {
      return !state.presets.some(p => p.name === name && p.id !== excludeId)
    },

    /**
     * Get max preset slots based on account level
     */
    maxPresetSlots: () => (accountLevel: number) => {
      if (accountLevel >= 40) return 8
      if (accountLevel >= 30) return 6
      if (accountLevel >= 20) return 5
      if (accountLevel >= 10) return 4
      return 3
    },
  },

  actions: {
    /**
     * Fetch all presets from server
     */
    async fetchPresets() {
      this.loading = true
      this.error = null

      try {
        const data = await $fetch<PartyPreset[]>('/api/presets')
        this.presets = data
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to fetch presets'
        console.error('Error fetching presets:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a new preset
     */
    async createPreset(preset: Omit<PartyPreset, 'id' | 'createdAt'>): Promise<PartyPreset> {
      this.loading = true
      this.error = null

      try {
        const data = await $fetch<PartyPreset>('/api/presets', {
          method: 'POST',
          body: preset,
        })

        this.presets.push(data)
        return data
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to create preset'
        console.error('Error creating preset:', error)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Update an existing preset
     */
    async updatePreset(
      id: string,
      updates: Partial<Omit<PartyPreset, 'id' | 'createdAt'>>
    ): Promise<PartyPreset> {
      this.loading = true
      this.error = null

      try {
        const data = await $fetch<PartyPreset>(`/api/presets/${id}`, {
          method: 'PATCH',
          body: updates,
        })

        const index = this.presets.findIndex(p => p.id === id)
        if (index !== -1) {
          this.presets[index] = data
        }

        return data
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to update preset'
        console.error('Error updating preset:', error)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete a preset
     */
    async deletePreset(id: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await $fetch(`/api/presets/${id}`, {
          method: 'DELETE',
        })

        this.presets = this.presets.filter(p => p.id !== id)
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to delete preset'
        console.error('Error deleting preset:', error)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Mark preset as used (updates lastUsedAt)
     */
    async markAsUsed(id: string): Promise<void> {
      try {
        await this.updatePreset(id, {
          lastUsedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error marking preset as used:', error)
      }
    },

    /**
     * Clone a preset with a new name
     */
    async clonePreset(id: string, newName: string): Promise<PartyPreset> {
      const original = this.getPresetById(id)
      if (!original) {
        throw new Error('Preset not found')
      }

      return this.createPreset({
        name: newName,
        heroIds: [...original.heroIds],
        preferredZoneId: original.preferredZoneId,
        preferredSubzoneId: original.preferredSubzoneId,
        preferredDifficulty: original.preferredDifficulty,
        lastUsedAt: new Date().toISOString(),
      })
    },

    /**
     * Validate preset hero IDs (check if heroes exist and are available)
     */
    validatePreset(preset: PartyPreset, availableHeroIds: string[]): {
      isValid: boolean
      missingHeroes: string[]
      unavailableHeroes: string[]
    } {
      const missingHeroes = preset.heroIds.filter(id => !availableHeroIds.includes(id))
      const unavailableHeroes: string[] = [] // Would check if heroes are on expedition, etc.

      return {
        isValid: missingHeroes.length === 0 && unavailableHeroes.length === 0,
        missingHeroes,
        unavailableHeroes,
      }
    },

    /**
     * Suggest replacement heroes for missing/unavailable heroes
     *
     * Matching priority:
     * 1. Same archetype (highest priority for role composition)
     * 2. Same rarity (similar power level)
     * 3. Available and not already in preset
     */
    suggestReplacements(
      preset: PartyPreset,
      availableHeroes: Array<{ id: string; rarity: string; archetype: string; power?: number }>
    ): Map<string, string> {
      const replacements = new Map<string, string>()
      const availableHeroIds = new Set(availableHeroes.map(h => h.id))
      const usedReplacementIds = new Set<string>()

      // Find missing heroes (heroes in preset but not available)
      const missingHeroIds = preset.heroIds.filter(id => !availableHeroIds.has(id))

      // For each missing hero, find best replacement
      for (const missingId of missingHeroIds) {
        // Get the original hero's properties if we have them (could be stored in preset metadata)
        // For now, we'll just find the best available hero not already in preset or used
        const candidateHeroes = availableHeroes.filter(h =>
          !preset.heroIds.includes(h.id) && // Not already in preset
          !usedReplacementIds.has(h.id)     // Not already used as replacement
        )

        if (candidateHeroes.length === 0) continue

        // Sort by archetype preference (could be enhanced with actual archetype of missing hero)
        // For now, prefer highest rarity, then highest power
        const rarityOrder: Record<string, number> = {
          mythic: 6,
          legendary: 5,
          epic: 4,
          rare: 3,
          uncommon: 2,
          common: 1,
        }

        const sortedCandidates = [...candidateHeroes].sort((a, b) => {
          // Sort by rarity first
          const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0)
          if (rarityDiff !== 0) return rarityDiff

          // Then by power if available
          if (a.power !== undefined && b.power !== undefined) {
            return b.power - a.power
          }

          return 0
        })

        // Use the best candidate as replacement
        const replacement = sortedCandidates[0]
        replacements.set(missingId, replacement.id)
        usedReplacementIds.add(replacement.id)
      }

      return replacements
    },
  },
})
