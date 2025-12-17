import { defineStore } from 'pinia'
import type { Hero } from '~~/types'

export const useHeroStore = defineStore('heroes', {
  state: () => ({
    heroes: [] as Hero[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getHeroById: (state) => (id: string) =>
      state.heroes.find(h => h.id === id),

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
      } catch (e: any) {
        this.error = e.message
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
      const index = this.heroes.findIndex(h => h.id === hero.id)
      if (index !== -1) {
        this.heroes[index] = updated
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