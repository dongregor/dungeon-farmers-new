import { defineStore } from 'pinia'
import type { Equipment, EquipmentSlot } from '~~/types'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventory: [] as Equipment[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getEquipmentById: (state) => (id: string) =>
      state.inventory.find(e => e.id === id),

    unequippedItems: (state) =>
      state.inventory.filter(e => e.equippedBy === null),

    getEquippedByHero: (state) => (heroId: string) =>
      state.inventory.filter(e => e.equippedBy === heroId),
  },

  actions: {
    async fetchInventory() {
      this.loading = true
      try {
        const data = await $fetch<{ equipment: Equipment[] }>('/api/equipment')
        this.inventory = data.equipment
      } finally {
        this.loading = false
      }
    },

    async equipItem(equipmentId: string, heroId: string) {
      const data = await $fetch<{ equipment: Equipment }>(`/api/equipment/${equipmentId}/equip`, {
        method: 'POST',
        body: { heroId }
      })
      const index = this.inventory.findIndex(e => e.id === equipmentId)
      if (index !== -1) {
        this.inventory[index] = data.equipment
      }
      return data.equipment
    },

    async unequipItem(equipmentId: string) {
      try {
        const data = await $fetch<{ equipment: Equipment }>(`/api/equipment/${equipmentId}/unequip`, {
          method: 'POST',
        })
        const index = this.inventory.findIndex(e => e.id === equipmentId)
        if (index !== -1) {
          this.inventory[index] = data.equipment
        }
        return data.equipment
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to unequip item'
        throw error
      }
    },

    async deleteItem(equipmentId: string) {
      await $fetch(`/api/equipment/${equipmentId}`, {
        method: 'DELETE',
      })
      this.inventory = this.inventory.filter(e => e.id !== equipmentId)
    },
  }
})
