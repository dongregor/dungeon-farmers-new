import { computed, type Ref, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useHeroStore } from '~/stores/heroes'
import { calculateHeroPower, calculateTeamPower, type PowerBreakdown } from '~/utils/powerCalculator'
import type { Hero, Equipment } from '~~/types'

/**
 * Composable for reactive power calculations
 * Provides computed power values that automatically update when hero/equipment changes
 */
export function usePowerCalculation() {
  const heroStore = useHeroStore()
  const { heroes } = storeToRefs(heroStore)

  /**
   * Get reactive power for a single hero
   * @param heroId - Reactive reference to hero ID
   * @param equipment - Optional reactive reference to equipment array
   * @returns Computed total power value
   */
  function useHeroPower(
    heroId: Ref<string>,
    equipment?: Ref<Equipment[]>
  ): ComputedRef<number> {
    return computed(() => {
      const hero = heroStore.getHeroById(heroId.value)
      if (!hero) return 0

      const heroEquipment = equipment?.value || []
      return calculateHeroPower(hero, heroEquipment).total
    })
  }

  /**
   * Get reactive power breakdown for a single hero
   * @param heroId - Reactive reference to hero ID
   * @param equipment - Optional reactive reference to equipment array
   * @returns Computed power breakdown with all components
   */
  function useHeroPowerBreakdown(
    heroId: Ref<string>,
    equipment?: Ref<Equipment[]>
  ): ComputedRef<PowerBreakdown> {
    return computed(() => {
      const hero = heroStore.getHeroById(heroId.value)
      if (!hero) {
        return {
          statPower: 0,
          levelPower: 0,
          prestigePower: 0,
          gearPower: 0,
          traitPower: 0,
          total: 0
        }
      }

      const heroEquipment = equipment?.value || []
      return calculateHeroPower(hero, heroEquipment)
    })
  }

  /**
   * Get reactive total power for a party of heroes
   * @param heroIds - Reactive reference to array of hero IDs
   * @param equipmentMap - Optional reactive reference to equipment map (heroId -> Equipment[])
   * @returns Computed total party power
   */
  function usePartyPower(
    heroIds: Ref<string[]>,
    equipmentMap?: Ref<Record<string, Equipment[]>>
  ): ComputedRef<number> {
    return computed(() => {
      const partyHeroes = heroIds.value
        .map(id => heroStore.getHeroById(id))
        .filter((hero): hero is Hero => hero !== undefined)

      if (partyHeroes.length === 0) return 0

      const eqMap = equipmentMap?.value || {}
      return calculateTeamPower(partyHeroes, eqMap)
    })
  }

  /**
   * Calculate power with equipment (non-reactive utility)
   * Useful for one-off calculations or when you already have the hero object
   * @param hero - Hero object
   * @param equipment - Array of equipment items
   * @returns Total power value
   */
  function calculatePowerWithEquipment(hero: Hero, equipment: Equipment[] = []): number {
    return calculateHeroPower(hero, equipment).total
  }

  /**
   * Get detailed power breakdown (non-reactive utility)
   * Returns all components of power calculation
   * @param hero - Hero object
   * @param equipment - Optional array of equipment items
   * @returns Detailed breakdown of power sources
   */
  function getPowerBreakdown(hero: Hero, equipment: Equipment[] = []): PowerBreakdown {
    return calculateHeroPower(hero, equipment)
  }

  /**
   * Get power breakdown for multiple heroes (non-reactive utility)
   * @param heroes - Array of hero objects
   * @param equipmentMap - Optional equipment map (heroId -> Equipment[])
   * @returns Array of power breakdowns matching hero order
   */
  function getPartyPowerBreakdowns(
    heroes: Hero[],
    equipmentMap: Record<string, Equipment[]> = {}
  ): PowerBreakdown[] {
    return heroes.map(hero => {
      const heroEquipment = equipmentMap[hero.id] || []
      return calculateHeroPower(hero, heroEquipment)
    })
  }

  /**
   * Compare two heroes' power (non-reactive utility)
   * @param heroA - First hero
   * @param heroB - Second hero
   * @param equipmentA - Equipment for first hero
   * @param equipmentB - Equipment for second hero
   * @returns Positive if heroA is stronger, negative if heroB is stronger, 0 if equal
   */
  function comparePower(
    heroA: Hero,
    heroB: Hero,
    equipmentA: Equipment[] = [],
    equipmentB: Equipment[] = []
  ): number {
    const powerA = calculateHeroPower(heroA, equipmentA).total
    const powerB = calculateHeroPower(heroB, equipmentB).total
    return powerA - powerB
  }

  return {
    // Reactive computed functions
    useHeroPower,
    useHeroPowerBreakdown,
    usePartyPower,

    // Non-reactive utility functions
    calculatePowerWithEquipment,
    getPowerBreakdown,
    getPartyPowerBreakdowns,
    comparePower
  }
}
