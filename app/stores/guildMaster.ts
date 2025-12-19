import { defineStore } from 'pinia'
import type { GuildMaster, Stats, Gender, Archetype, ArchetypeTag } from '~/types'

export interface TraitSlot {
  equipped: string | null
  slotNumber: number
}

export interface GuildMasterTraitSelection {
  traitId: string
  name: string
  description: string
  tags: string[]
  effectDescription: string
}

export const useGuildMasterStore = defineStore('guildMaster', {
  state: () => ({
    guildMaster: null as GuildMaster | null,
    availableTraits: [] as GuildMasterTraitSelection[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Check if guild master is initialized
     */
    isInitialized(): boolean {
      return this.guildMaster !== null
    },

    /**
     * Get equipped traits
     */
    equippedTraits(): GuildMasterTraitSelection[] {
      if (!this.guildMaster) return []

      return this.guildMaster.equippedTraitIds
        .map(id => this.availableTraits.find(t => t.traitId === id))
        .filter((t): t is GuildMasterTraitSelection => t !== undefined)
    },

    /**
     * Get unlocked but not equipped traits
     */
    unequippedTraits(): GuildMasterTraitSelection[] {
      if (!this.guildMaster) return []

      return this.guildMaster.unlockedTraitIds
        .filter(id => !this.guildMaster!.equippedTraitIds.includes(id))
        .map(id => this.availableTraits.find(t => t.traitId === id))
        .filter((t): t is GuildMasterTraitSelection => t !== undefined)
    },

    /**
     * Get trait slots with equipped status
     */
    traitSlots(): TraitSlot[] {
      if (!this.guildMaster) return []

      const slots: TraitSlot[] = []
      for (let i = 0; i < this.guildMaster.maxEquippedTraits; i++) {
        slots.push({
          equipped: this.guildMaster.equippedTraitIds[i] || null,
          slotNumber: i + 1,
        })
      }
      return slots
    },

    /**
     * Get available trait slots
     */
    availableSlots(): number {
      if (!this.guildMaster) return 0
      return this.guildMaster.maxEquippedTraits - this.guildMaster.equippedTraitIds.length
    },

    /**
     * Get total power
     */
    power(): number {
      if (!this.guildMaster) return 0

      // Calculate power from base stats
      const stats = this.guildMaster.baseStats
      return Math.floor(
        stats.combat * 1.5 +
        stats.utility * 1.2 +
        stats.survival * 1.3
      ) * this.guildMaster.level
    },

    /**
     * Check if archetype is selected
     */
    hasArchetype(): boolean {
      return this.guildMaster?.archetype !== null
    },

    /**
     * Get display stats including bonuses
     */
    displayStats(): Stats | null {
      if (!this.guildMaster) return null

      // Base stats plus any trait bonuses would be calculated here
      return { ...this.guildMaster.baseStats }
    },
  },

  actions: {
    /**
     * Fetch guild master from server
     */
    async fetchGuildMaster() {
      this.loading = true
      this.error = null

      try {
        const data = await $fetch<{
          guildMaster: GuildMaster | null
          availableTraits: GuildMasterTraitSelection[]
        }>('/api/guild-master')

        this.guildMaster = data.guildMaster
        this.availableTraits = data.availableTraits
      } catch (err: unknown) {
    const error = toError(err)
        this.error = error.message || 'Failed to fetch guild master'
        console.error('Error fetching guild master:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Initialize guild master (first-time setup)
     */
    async initializeGuildMaster(name: string, gender: Gender) {
      try {
        const data = await $fetch<GuildMaster>('/api/guild-master/initialize', {
          method: 'POST',
          body: { name, gender },
        })

        this.guildMaster = data
        return data
      } catch (err: unknown) {
    const error = toError(err)
        console.error('Error initializing guild master:', error)
        throw err
      }
    },

    /**
     * Update guild master name
     */
    async updateName(name: string) {
      if (!this.guildMaster) return

      try {
        await $fetch('/api/guild-master/name', {
          method: 'PATCH',
          body: { name },
        })

        this.guildMaster.name = name
      } catch (err: unknown) {
    const error = toError(err)
        console.error('Error updating guild master name:', error)
        throw err
      }
    },

    /**
     * Select archetype (one-time choice or at milestone)
     */
    async selectArchetype(archetype: Archetype, archetypeTags: ArchetypeTag[]) {
      if (!this.guildMaster) return

      try {
        const data = await $fetch<{
          archetype: Archetype
          archetypeTags: ArchetypeTag[]
          statsAdjusted: Stats
        }>('/api/guild-master/archetype', {
          method: 'PATCH',
          body: { archetype, archetypeTags },
        })

        this.guildMaster.archetype = data.archetype
        this.guildMaster.archetypeTags = data.archetypeTags
        this.guildMaster.baseStats = data.statsAdjusted
      } catch (err: unknown) {
    const error = toError(err)
        console.error('Error selecting archetype:', error)
        throw err
      }
    },

    /**
     * Equip a trait
     */
    async equipTrait(traitId: string, slotIndex?: number) {
      if (!this.guildMaster) return

      // Check if trait is unlocked
      if (!this.guildMaster.unlockedTraitIds.includes(traitId)) {
        throw new Error('Trait is not unlocked')
      }

      // Check if already equipped
      if (this.guildMaster.equippedTraitIds.includes(traitId)) {
        throw new Error('Trait is already equipped')
      }

      // Check if there's space
      if (this.guildMaster.equippedTraitIds.length >= this.guildMaster.maxEquippedTraits && slotIndex === undefined) {
        throw new Error('No available trait slots')
      }

      try {
        const data = await $fetch<{
          equippedTraitIds: string[]
        }>('/api/guild-master/equip-trait', {
          method: 'POST',
          body: { traitId, slotIndex },
        })

        this.guildMaster.equippedTraitIds = data.equippedTraitIds
      } catch (err: unknown) {
    const error = toError(err)
        console.error('Error equipping trait:', error)
        throw err
      }
    },

    /**
     * Unequip a trait
     */
    async unequipTrait(traitId: string) {
      if (!this.guildMaster) return

      if (!this.guildMaster.equippedTraitIds.includes(traitId)) {
        throw new Error('Trait is not equipped')
      }

      try {
        const data = await $fetch<{
          equippedTraitIds: string[]
        }>('/api/guild-master/unequip-trait', {
          method: 'POST',
          body: { traitId },
        })

        this.guildMaster.equippedTraitIds = data.equippedTraitIds
      } catch (err: unknown) {
    const error = toError(err)
        console.error('Error unequipping trait:', error)
        throw err
      }
    },

    /**
     * Unlock a new trait (earned through gameplay)
     */
    async unlockTrait(traitId: string) {
      if (!this.guildMaster) return

      if (this.guildMaster.unlockedTraitIds.includes(traitId)) {
        return // Already unlocked
      }

      try {
        const data = await $fetch<{
          unlockedTraitIds: string[]
        }>('/api/guild-master/unlock-trait', {
          method: 'POST',
          body: { traitId },
        })

        this.guildMaster.unlockedTraitIds = data.unlockedTraitIds
      } catch (err: unknown) {
    const error = toError(err)
        console.error('Error unlocking trait:', error)
        throw err
      }
    },

    /**
     * Level up guild master
     */
    async levelUp() {
      if (!this.guildMaster) return

      try {
        const data = await $fetch<{
          level: number
          baseStats: Stats
          maxEquippedTraits: number
        }>('/api/guild-master/level-up', {
          method: 'POST',
        })

        this.guildMaster.level = data.level
        this.guildMaster.baseStats = data.baseStats
        this.guildMaster.maxEquippedTraits = data.maxEquippedTraits
      } catch (err: unknown) {
    const error = toError(err)
        console.error('Error leveling up guild master:', error)
        throw err
      }
    },

    /**
     * Update leader bonus
     */
    updateLeaderBonus(bonus: number) {
      if (this.guildMaster) {
        this.guildMaster.leaderBonus = bonus
      }
    },

    /**
     * Update mentor bonus
     */
    updateMentorBonus(bonus: number) {
      if (this.guildMaster) {
        this.guildMaster.mentorBonus = bonus
      }
    },
  },
})
