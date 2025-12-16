import { defineStore } from 'pinia'
import type { TavernHero, TavernSlot, TavernState } from '~~/types'

export const useTavernStore = defineStore('tavern', {
  state: () => ({
    slots: [] as TavernSlot[],
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
        this.nextRefresh = data.nextRefreshAt
      } finally {
        this.loading = false
      }
    },

    async refreshTavern() {
      const data = await $fetch<{ slots: TavernSlot[], nextRefresh: string }>('/api/tavern/refresh', { method: 'POST' })
      this.slots = data.slots.map((slot, index) => ({
        index,
        hero: slot.hero,
        rarity: slot.rarity,
        isLocked: slot.isLocked,
      }))
      this.nextRefresh = data.nextRefresh
    },

    async lockHero(slotIndex: number) {
      if (slotIndex < 0 || slotIndex >= this.slots.length) {
        throw new Error('Invalid slot index')
      }
      try {
        await $fetch(`/api/tavern/lock/${slotIndex}`, { method: 'POST' })
        this.slots[slotIndex]!.isLocked = true
        this.usedLockSlots++
      } catch (error) {
        throw error
      }
    },

    async unlockHero(slotIndex: number) {
      if (slotIndex < 0 || slotIndex >= this.slots.length) {
        throw new Error('Invalid slot index')
      }
      try {
        await $fetch(`/api/tavern/unlock/${slotIndex}`, { method: 'POST' })
        this.slots[slotIndex]!.isLocked = false
        this.usedLockSlots--
      } catch (error) {
        throw error
      }
    }
  }
})