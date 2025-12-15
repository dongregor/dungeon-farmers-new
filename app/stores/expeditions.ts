import { defineStore } from 'pinia'
import type { Expedition } from '~~/types'

export const useExpeditionStore = defineStore('expeditions', {
  state: () => ({
    activeExpeditions: [] as Expedition[],
    completedExpeditions: [] as Expedition[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getExpeditionById: (state) => (id: string) =>
      state.activeExpeditions.find(e => e.id === id),

    completedExpeditions: (state) => {
      const now = new Date()
      return state.activeExpeditions.filter(e =>
        e.status === 'in_progress' && new Date(e.completesAt) <= now
      )
    },
  },

  actions: {
    async fetchExpeditions() {
      this.loading = true
      try {
        const data = await $fetch<{ active: Expedition[], completed: Expedition[] }>('/api/expeditions')
        this.activeExpeditions = data.active
        this.completedExpeditions = data.completed
      } finally {
        this.loading = false
      }
    },

    async startExpedition(params: {
      zoneId: string
      subzoneId: string
      heroIds: string[]
      autoRepeat?: boolean
    }) {
      const data = await $fetch<{ expedition: Expedition }>('/api/expeditions/start', {
        method: 'POST',
        body: params
      })
      this.activeExpeditions.push(data.expedition)
      return data.expedition
    },

    async completeExpedition(expeditionId: string) {
      const data = await $fetch<{ expedition: Expedition }>(`/api/expeditions/${expeditionId}/complete`, {
        method: 'POST'
      })
      const index = this.activeExpeditions.findIndex(e => e.id === expeditionId)
      if (index !== -1) {
        this.activeExpeditions[index] = data.expedition
      }
      return data.expedition
    },
  }
})
