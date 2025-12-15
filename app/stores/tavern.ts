import { defineStore } from 'pinia'
import type { TavernHero, TavernState } from '~~/types'

export const useTavernStore = defineStore('tavern', {
  state: () => ({
    slots: [] as TavernHero[],
    lockSlots: 1,
    usedLockSlots: 0,
    lastRefresh: '',
    nextRefresh: '',
    loading: false,
  }),

  getters: {
    canLockMore: (state) => state.usedLockSlots < state.lockSlots,
    timeUntilRefresh: (state) => {
      const next = new Date(state.nextRefresh)
      return Math.max(0, next.getTime() - Date.now())
    }
  },

  actions: {
    async fetchTavern() {
      this.loading = true
      try {
        const data = await $fetch<TavernState>('/api/tavern')
        this.slots = data.slots
        this.lockSlots = data.lockSlots
        this.usedLockSlots = data.usedLockSlots
        this.lastRefresh = data.lastRefreshAt
        this.nextRefresh = data.nextFreeRefresh
      } finally {
        this.loading = false
      }
    },

    async refreshTavern() {
      const data = await $fetch<{ slots: TavernHero[], nextFreeRefresh: string }>('/api/tavern/refresh', { method: 'POST' })
      this.slots = data.slots
      this.nextRefresh = data.nextFreeRefresh
    },

    async lockHero(slotIndex: number) {
      await $fetch(`/api/tavern/lock/${slotIndex}`, { method: 'POST' })
      this.slots[slotIndex].isLocked = true
      this.usedLockSlots++
    },

    async unlockHero(slotIndex: number) {
      await $fetch(`/api/tavern/unlock/${slotIndex}`, { method: 'POST' })
      this.slots[slotIndex].isLocked = false
      this.usedLockSlots--
    }
  }
})