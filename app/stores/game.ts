import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gold: 1000,
    // Add other game state properties as needed
  }),
  getters: {
    // Add getters as needed
  },
  actions: {
    // Add actions as needed
  }
})