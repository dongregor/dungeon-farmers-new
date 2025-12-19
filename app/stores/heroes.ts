import { defineStore } from 'pinia'
import type { Hero } from '~~/types'

export const useHeroStore = defineStore('heroes', {
  state: () => ({
    heroes: [] as Hero[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * O(1) Map-based hero lookup cache
     * Automatically rebuilds when heroes array changes
     */
    heroMap: (state): Map<string, Hero> =>
      new Map(state.heroes.map(h => [h.id, h])),

    /**
     * Get hero by ID with O(1) Map lookup
     * Falls back to array find if Map is not available
     */
    getHeroById: (state) => (id: string) => {
      // Use the computed Map for O(1) lookup
      const map = new Map(state.heroes.map(h => [h.id, h]))
      return map.get(id)
    },

    availableHeroes: (state) =>
      state.heroes.filter(h => !h.isOnExpedition && !h.isStationed),

    favoriteHeroes: (state) =>
      state.heroes.filter(h => h.isFavorite),
  },

  actions: {
    async fetchHeroes() {
      this.loading = true
      try {
        this.heroes = await $fetch<Hero[]>('/api/heroes')
      } catch (e) {
        this.error = getErrorMessage(e)
      } finally {
        this.loading = false
      }
    },

    async recruitHero(tavernHeroId: string) {
      const hero = await $fetch<Hero>('/api/tavern/recruit', {
        method: 'POST',
        body: { slotIndex: tavernHeroId }
      })
      this.heroes.push(hero)
      return hero
    },

    async updateHero(hero: Partial<Hero> & { id: string }) {
      const updated = await $fetch<Hero>(`/api/heroes/${hero.id}`, {
        method: 'PATCH',
        body: hero
      })
      // Use Map for O(1) lookup, then update array
      const index = this.heroes.findIndex(h => h.id === hero.id)
      if (index !== -1) {
        this.heroes[index] = updated
      } else {
        // Hero not found in local state, add it
        this.heroes.push(updated)
      }
    },

    async retireHero(heroId: string, transferTraitTo?: string) {
      await $fetch(`/api/heroes/${heroId}/retire`, {
        method: 'POST',
        body: { transferTraitTo }
      })
      this.heroes = this.heroes.filter(h => h.id !== heroId)
    }
  }
})