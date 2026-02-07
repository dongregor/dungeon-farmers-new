import { defineStore } from 'pinia'
import type { GazetteIssue, GazetteDayData } from '~~/types'
import { generateGazetteIssue, generateInauguralIssue } from '~/utils/gazetteGenerator'
import { toError } from '~~/shared/utils/errorHandler'

export const useGazetteStore = defineStore('gazette', {
  state: () => ({
    currentIssue: null as GazetteIssue | null,
    archive: [] as GazetteIssue[],
    loading: false,
    error: null as string | null,
    lastGeneratedDate: null as string | null,
    hasUnread: false,
  }),

  getters: {
    issueCount: (state) => state.archive.length + (state.currentIssue ? 1 : 0),
  },

  actions: {
    async fetchAndGenerate() {
      // Check if we already generated for today
      const today = new Date().toISOString().split('T')[0]
      if (this.currentIssue && this.lastGeneratedDate === today) {
        return this.currentIssue
      }

      this.loading = true
      this.error = null

      try {
        const data = await $fetch<{ dayData: GazetteDayData }>('/api/gazette')

        // Archive the previous issue if it exists
        if (this.currentIssue) {
          this.archive.unshift(this.currentIssue)
          // Keep only last 30 issues
          if (this.archive.length > 30) {
            this.archive = this.archive.slice(0, 30)
          }
        }

        // Generate new issue
        const issue = generateGazetteIssue(data.dayData)
        this.currentIssue = issue
        this.lastGeneratedDate = today
        this.hasUnread = true

        return issue
      } catch (err: unknown) {
        const error = toError(err)
        this.error = error.message || 'Failed to generate gazette'

        // If no current issue, generate inaugural issue as fallback
        if (!this.currentIssue) {
          this.currentIssue = generateInauguralIssue('unknown', 'Your Guild', [])
          this.lastGeneratedDate = today
        }

        throw error
      } finally {
        this.loading = false
      }
    },

    markAsRead() {
      this.hasUnread = false
    },

    regenerate() {
      // Force regeneration by clearing date
      this.lastGeneratedDate = null
      return this.fetchAndGenerate()
    },

    getArchivedIssue(issueId: string): GazetteIssue | undefined {
      if (this.currentIssue?.id === issueId) return this.currentIssue
      return this.archive.find(i => i.id === issueId)
    },
  },
})
