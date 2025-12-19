import { defineStore } from 'pinia'
import type { Expedition, ExpeditionSettings } from '~~/types'
import { toError } from '~~/shared/utils/errorHandler'

export const useExpeditionStore = defineStore('expeditions', {
  state: () => ({
    activeExpeditions: [] as Expedition[],
    completedExpeditions: [] as Expedition[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get expedition by ID
     */
    getExpeditionById: (state) => (id: string) =>
      state.activeExpeditions.find(e => e.id === id) ||
      state.completedExpeditions.find(e => e.id === id),

    /**
     * Get all active expeditions
     */
    active: (state) =>
      state.activeExpeditions.filter(e => e.status === 'in_progress'),

    /**
     * Get expeditions that are ready to be completed (time elapsed)
     */
    readyToComplete: (state) => {
      const now = new Date()
      return state.activeExpeditions.filter(e =>
        e.status === 'in_progress' && new Date(e.completesAt) <= now
      )
    },

    /**
     * Get expeditions waiting for player choices
     */
    needingChoices: (state) =>
      state.activeExpeditions.filter(e =>
        e.pendingChoices && e.pendingChoices.length > 0
      ),

    /**
     * Get total active expedition count
     */
    activeCount: (state) =>
      state.activeExpeditions.filter(e => e.status === 'in_progress').length,

    /**
     * Get expeditions by hero ID
     */
    getByHeroId: (state) => (heroId: string) =>
      state.activeExpeditions.filter(e =>
        e.heroIds.includes(heroId)
      ),

    /**
     * Check if any expedition has this hero
     */
    hasHeroOnExpedition: (state) => (heroId: string) =>
      state.activeExpeditions.some(e =>
        e.status === 'in_progress' && e.heroIds.includes(heroId)
      ),
  },

  actions: {
    /**
     * Fetch all expeditions from the server
     */
    async fetchExpeditions() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<{ active: Expedition[], completed: Expedition[] }>('/api/expeditions')
        this.activeExpeditions = data.active
        this.completedExpeditions = data.completed
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to fetch expeditions'
        console.error('Error fetching expeditions:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Sync offline progress - resolves all completed expeditions
     * Should be called on app load
     */
    async syncOfflineProgress() {
      try {
        const data = await $fetch<{ completed: Expedition[], active: Expedition[] }>('/api/expeditions/sync', {
          method: 'POST'
        })

        // Update state with synced expeditions (replace to avoid duplicates)
        this.activeExpeditions = data.active
        this.completedExpeditions = data.completed

        return data.completed
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to sync offline progress'
        console.error('Error syncing offline progress:', error)
        throw error
      }
    },

    /**
     * Start a new expedition
     */
    async startExpedition(params: {
      zoneId: string
      subzoneId: string
      heroIds: string[]
      settings?: Partial<ExpeditionSettings>
    }) {
      this.error = null
      try {
        const data = await $fetch<{ expedition: Expedition }>('/api/expeditions/start', {
          method: 'POST',
          body: {
            zoneId: params.zoneId,
            subzoneId: params.subzoneId,
            heroIds: params.heroIds,
            autoRepeat: params.settings?.autoRepeat ?? false,
            autoRepeatLimit: params.settings?.autoRepeatLimit,
            stopConditions: params.settings?.stopConditions ?? {
              anyHeroTired: false,
              inventoryFull: false,
              resourceCap: false,
            },
          }
        })

        this.activeExpeditions.push(data.expedition)
        return data.expedition
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to start expedition'
        console.error('Error starting expedition:', error)
        throw error
      }
    },

    /**
     * Complete an expedition (when timer finishes)
     */
    async completeExpedition(expeditionId: string) {
      this.error = null
      try {
        const data = await $fetch<{ expedition: Expedition }>(`/api/expeditions/${expeditionId}/complete`, {
          method: 'POST'
        })

        const index = this.activeExpeditions.findIndex(e => e.id === expeditionId)
        if (index !== -1) {
          // Check if expedition has pending choices
          if (data.expedition.pendingChoices && data.expedition.pendingChoices.length > 0) {
            // Keep in active expeditions but mark as needing choices
            this.activeExpeditions[index] = data.expedition
          } else if (data.expedition.autoRepeat && data.expedition.status === 'in_progress') {
            // Auto-repeat - expedition is already restarted
            this.activeExpeditions[index] = data.expedition
          } else {
            // Move to completed
            this.activeExpeditions.splice(index, 1)
            this.completedExpeditions.unshift(data.expedition)
          }
        }

        return data.expedition
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to complete expedition'
        console.error('Error completing expedition:', error)
        throw error
      }
    },

    /**
     * Resolve a choice event
     */
    async resolveChoice(expeditionId: string, eventId: string, choiceId: number) {
      this.error = null
      try {
        const data = await $fetch<{ expedition: Expedition }>(`/api/expeditions/${expeditionId}/choice`, {
          method: 'POST',
          body: { eventId, choiceId }
        })

        const index = this.activeExpeditions.findIndex(e => e.id === expeditionId)
        if (index !== -1) {
          this.activeExpeditions[index] = data.expedition

          // If no more pending choices and status is completed, move to completed
          if (data.expedition.status === 'completed' &&
              (!data.expedition.pendingChoices || data.expedition.pendingChoices.length === 0)) {
            this.activeExpeditions.splice(index, 1)
            this.completedExpeditions.unshift(data.expedition)
          }
        }

        return data.expedition
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to resolve choice'
        console.error('Error resolving choice:', error)
        throw error
      }
    },

    /**
     * Preview expedition rewards (before starting)
     */
    async previewExpedition(params: {
      zoneId: string
      subzoneId: string
      heroIds: string[]
    }) {
      this.error = null
      try {
        const data = await $fetch<{
          estimatedRewards: {
            goldMin: number
            goldMax: number
            xpMin: number
            xpMax: number
            duration: number
            efficiency: number
            threatsCountered: number
            threatsTotal: number
          }
        }>('/api/expeditions/preview', {
          method: 'POST',
          body: params
        })

        return data.estimatedRewards
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to preview expedition'
        console.error('Error previewing expedition:', error)
        throw error
      }
    },

    /**
     * Cancel an active expedition
     */
    async cancelExpedition(expeditionId: string) {
      this.error = null
      try {
        await $fetch(`/api/expeditions/${expeditionId}/cancel`, {
          method: 'POST'
        })

        const index = this.activeExpeditions.findIndex(e => e.id === expeditionId)
        if (index !== -1) {
          this.activeExpeditions.splice(index, 1)
        }
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to cancel expedition'
        console.error('Error canceling expedition:', error)
        throw error
      }
    },

    /**
     * Update expedition settings (auto-repeat, stop conditions)
     */
    async updateSettings(expeditionId: string, settings: Partial<ExpeditionSettings>) {
      this.error = null
      try {
        const data = await $fetch<{ expedition: Expedition }>(`/api/expeditions/${expeditionId}/settings`, {
          method: 'PATCH',
          body: settings
        })

        const index = this.activeExpeditions.findIndex(e => e.id === expeditionId)
        if (index !== -1) {
          this.activeExpeditions[index] = data.expedition
        }

        return data.expedition
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to update expedition settings'
        console.error('Error updating expedition settings:', error)
        throw error
      }
    },

    /**
     * Toggle auto-repeat for an expedition
     */
    async toggleAutoRepeat(expeditionId: string) {
      const expedition = this.getExpeditionById(expeditionId)
      if (!expedition) {
        throw new Error('Expedition not found')
      }

      return this.updateSettings(expeditionId, {
        autoRepeat: !expedition.autoRepeat
      })
    },

    /**
     * Claim completed expedition rewards
     */
    async claimRewards(expeditionId: string) {
      this.error = null
      try {
        await $fetch(`/api/expeditions/${expeditionId}/claim`, {
          method: 'POST'
        })

        // Remove from completed expeditions
        const index = this.completedExpeditions.findIndex(e => e.id === expeditionId)
        if (index !== -1) {
          this.completedExpeditions.splice(index, 1)
        }
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to claim rewards'
        console.error('Error claiming rewards:', error)
        throw error
      }
    },

    /**
     * Dismiss a completed expedition (if already claimed)
     */
    dismissCompleted(expeditionId: string) {
      const index = this.completedExpeditions.findIndex(e => e.id === expeditionId)
      if (index !== -1) {
        this.completedExpeditions.splice(index, 1)
      }
    },

    /**
     * Clear all completed expeditions
     */
    clearCompleted() {
      this.completedExpeditions = []
    },

    /**
     * Handle expedition completion from timer
     * This is called by the UI when a timer completes
     */
    async handleTimerComplete(expeditionId: string) {
      const expedition = this.getExpeditionById(expeditionId)
      if (!expedition) return

      try {
        await this.completeExpedition(expeditionId)
      } catch (e) {
        console.error('Failed to complete expedition from timer:', e)
        // Don't throw - let the UI handle this gracefully
      }
    },

    /**
     * Check for and process any auto-repeat expeditions
     */
    async processAutoRepeats() {
      const ready = this.readyToComplete

      // Process sequentially to avoid race conditions on shared state
      for (const expedition of ready) {
        if (expedition.autoRepeat) {
          await this.handleTimerComplete(expedition.id)
        }
      }
    },
  }
})
