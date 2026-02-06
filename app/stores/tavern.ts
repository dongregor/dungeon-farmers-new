import { defineStore } from 'pinia'
import type { TavernHero, TavernSlot, TavernState } from '~~/types'

export const useTavernStore = defineStore('tavern', {
  state: () => ({
    slots: [] as TavernSlot[],
    lockSlots: 1,
    usedLockSlots: 0,
    lastRefresh: '',
    nextRefresh: '',
    nextRefreshCost: 75,
    paidRefreshesSinceFree: 0,
    loading: false,
  }),

  getters: {
    canLockMore: (state) => state.usedLockSlots < state.lockSlots,
    timeUntilRefresh: (state) => {
      const next = new Date(state.nextRefresh)
      return Math.max(0, next.getTime() - Date.now())
    },
    // Alias for page compatibility
    nextRefreshAt: (state) => state.nextRefresh,
    // Extract heroes from slots for the page
    tavernHeroes: (state) => state.slots
      .filter(slot => slot.hero !== null)
      .map(slot => ({
        ...slot.hero!,
        isLocked: slot.isLocked,
        slotIndex: slot.index,
      })),
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
        this.nextRefreshCost = data.nextRefreshCost
        this.paidRefreshesSinceFree = data.paidRefreshesSinceFree
      } finally {
        this.loading = false
      }
    },

    async refreshTavern() {
      const data = await $fetch<{
        slots: TavernSlot[]
        nextRefresh: string
        paidRefreshesSinceFree: number
        nextRefreshCost: number
      }>('/api/tavern/refresh', { method: 'POST' })
      this.slots = data.slots.map((slot, index) => ({
        index,
        hero: slot.hero,
        rarity: slot.rarity,
        isLocked: slot.isLocked,
      }))
      this.nextRefresh = data.nextRefresh
      this.paidRefreshesSinceFree = data.paidRefreshesSinceFree
      this.nextRefreshCost = data.nextRefreshCost
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
    },

    async recruitHero(slotIndex: number) {
      if (slotIndex < 0 || slotIndex >= this.slots.length) {
        throw new Error('Invalid slot index')
      }
      try {
        const wasLocked = this.slots[slotIndex]?.isLocked
        await $fetch('/api/tavern/recruit', {
          method: 'POST',
          body: { slotIndex }
        })
        // Clear the slot after recruiting and unlock it
        this.slots[slotIndex]!.hero = null
        this.slots[slotIndex]!.isLocked = false
        // Decrement used lock slots if it was locked
        if (wasLocked) {
          this.usedLockSlots = Math.max(0, this.usedLockSlots - 1)
        }
      } catch (error) {
        throw error
      }
    }
  }
})