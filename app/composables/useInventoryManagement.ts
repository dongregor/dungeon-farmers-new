import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '~/stores/inventory'
import { useGameStore } from '~/stores/game'
import { BASE_INVENTORY_SLOTS, SUPPORTER_INVENTORY_BONUS } from '~/shared/constants/gameRules'
import type { EquipmentSlot, Equipment } from '~~/types'

/**
 * Composable for inventory management functions
 * Provides utilities for checking inventory capacity and filtering equipment
 */
export function useInventoryManagement() {
  const inventoryStore = useInventoryStore()
  const gameStore = useGameStore()

  const { inventory } = storeToRefs(inventoryStore)
  const { isSupporter } = storeToRefs(gameStore)

  /**
   * Calculate total available inventory slots
   * Base slots + supporter bonus if applicable
   */
  const availableSlots = computed(() => {
    return BASE_INVENTORY_SLOTS + (isSupporter.value ? SUPPORTER_INVENTORY_BONUS : 0)
  })

  /**
   * Get current number of items in inventory
   */
  const currentItemCount = computed(() => {
    return inventory.value.length
  })

  /**
   * Get number of remaining slots
   */
  const remainingSlots = computed(() => {
    return Math.max(0, availableSlots.value - currentItemCount.value)
  })

  /**
   * Check if inventory is at capacity
   */
  const isInventoryFull = computed(() => {
    return currentItemCount.value >= availableSlots.value
  })

  /**
   * Get all available inventory slots (including supporter bonus)
   * @returns Total number of inventory slots
   */
  function getAvailableSlots(): number {
    return availableSlots.value
  }

  /**
   * Check if there's room to add N items to inventory
   * @param count - Number of items to add
   * @returns True if there's enough space
   */
  function canAddItems(count: number): boolean {
    if (count <= 0) return true
    return currentItemCount.value + count <= availableSlots.value
  }

  /**
   * Get all equipment for a specific slot
   * @param slot - The equipment slot to filter by
   * @returns Array of equipment matching the slot
   */
  function getEquipmentBySlot(slot: EquipmentSlot): Equipment[] {
    return inventory.value.filter(item => item.slot === slot)
  }

  /**
   * Get all equipment that is not currently equipped
   * @returns Array of unequipped equipment
   */
  function getUnequippedEquipment(): Equipment[] {
    return inventory.value.filter(item => !item.isEquipped)
  }

  return {
    // Computed reactive values
    availableSlots,
    currentItemCount,
    remainingSlots,
    isInventoryFull,

    // Functions
    getAvailableSlots,
    canAddItems,
    getEquipmentBySlot,
    getUnequippedEquipment,
  }
}
