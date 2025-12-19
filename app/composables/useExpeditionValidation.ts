import { useHeroStore } from '~/stores/heroes'
import { useZoneStore } from '~/stores/zones'
import { MIN_MORALE_FOR_EXPEDITION } from '~~/shared/constants/gameRules'
import type { Hero, Zone } from '~~/types'

/**
 * Re-export MIN_MORALE_FOR_EXPEDITION for use in tests and other modules
 */
export { MIN_MORALE_FOR_EXPEDITION }

/**
 * Validation result with success flag and optional error message
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Composable for expedition validation logic
 * Provides validation functions for party composition, morale, and zone requirements
 */
export function useExpeditionValidation() {
  const heroStore = useHeroStore()
  const zoneStore = useZoneStore()

  /**
   * Maximum and minimum party size
   */
  const MIN_PARTY_SIZE = 1
  const MAX_PARTY_SIZE = 4

  /**
   * Validate party composition
   * Checks: size (1-4), all heroes exist, all available, all have good morale
   */
  function validateParty(heroIds: string[]): ValidationResult {
    // Check party size
    if (heroIds.length < MIN_PARTY_SIZE) {
      return {
        valid: false,
        error: 'Party must have at least 1 hero'
      }
    }

    if (heroIds.length > MAX_PARTY_SIZE) {
      return {
        valid: false,
        error: `Party cannot exceed ${MAX_PARTY_SIZE} heroes`
      }
    }

    // Check for duplicate hero IDs
    const uniqueHeroIds = new Set(heroIds)
    if (uniqueHeroIds.size !== heroIds.length) {
      return {
        valid: false,
        error: 'Cannot select the same hero multiple times'
      }
    }

    // Get all heroes and verify they exist
    const heroes: Hero[] = []
    for (const heroId of heroIds) {
      const hero = heroStore.getHeroById(heroId)
      if (!hero) {
        return {
          valid: false,
          error: `Hero ${heroId} not found`
        }
      }
      heroes.push(hero)
    }

    // Check if all heroes are available
    for (const hero of heroes) {
      if (hero.isOnExpedition) {
        return {
          valid: false,
          error: `${hero.name} is already on an expedition`
        }
      }

      if (hero.isStationed) {
        return {
          valid: false,
          error: `${hero.name} is currently stationed`
        }
      }
    }

    // Check morale requirements
    const moraleCheck = checkMoraleRequirements(heroes)
    if (!moraleCheck.valid) {
      return moraleCheck
    }

    return { valid: true }
  }

  /**
   * Check if all heroes have sufficient morale for expedition
   * Heroes need at least 20 morale (above exhausted state)
   */
  function checkMoraleRequirements(heroes: Hero[]): ValidationResult {
    for (const hero of heroes) {
      if (hero.moraleValue < MIN_MORALE_FOR_EXPEDITION) {
        return {
          valid: false,
          error: `${hero.name} has insufficient morale (${hero.moraleValue}). Heroes need at least ${MIN_MORALE_FOR_EXPEDITION} morale to go on expeditions.`
        }
      }
    }

    return { valid: true }
  }

  /**
   * Verify party meets zone unlock and power requirements
   */
  function verifyZoneRequirements(zone: Zone, heroes: Hero[]): ValidationResult {
    // Check if zone is unlocked
    if (!zone.isUnlocked) {
      return {
        valid: false,
        error: `${zone.name} has not been unlocked yet`
      }
    }

    // Check minimum power requirement
    if (zone.unlockRequirement.minPower) {
      const totalPartyPower = heroes.reduce((sum, hero) => sum + hero.power, 0)
      if (totalPartyPower < zone.unlockRequirement.minPower) {
        return {
          valid: false,
          error: `Party power (${totalPartyPower}) is below the required ${zone.unlockRequirement.minPower} for ${zone.name}`
        }
      }
    }

    // Check previous zone requirement
    if (zone.unlockRequirement.previousZoneId) {
      const previousZone = zoneStore.getZoneById(zone.unlockRequirement.previousZoneId)
      if (previousZone && !previousZone.isUnlocked) {
        return {
          valid: false,
          error: `Must unlock ${previousZone.name} before accessing ${zone.name}`
        }
      }
    }

    return { valid: true }
  }

  /**
   * Comprehensive validation before starting an expedition
   * Validates party, zone, and subzone requirements
   */
  function canStartExpedition(
    zoneId: string,
    subzoneId: string,
    heroIds: string[]
  ): ValidationResult {
    // Validate party composition first
    const partyValidation = validateParty(heroIds)
    if (!partyValidation.valid) {
      return partyValidation
    }

    // Get zone
    const zone = zoneStore.getZoneById(zoneId)
    if (!zone) {
      return {
        valid: false,
        error: `Zone ${zoneId} not found`
      }
    }

    // Get heroes (we know they exist from validateParty)
    const heroes = heroIds.map(id => heroStore.getHeroById(id)!)

    // Verify zone requirements
    const zoneValidation = verifyZoneRequirements(zone, heroes)
    if (!zoneValidation.valid) {
      return zoneValidation
    }

    // Get subzone
    const subzone = zoneStore.getSubzoneById(zoneId, subzoneId)
    if (!subzone) {
      return {
        valid: false,
        error: `Subzone ${subzoneId} not found in ${zone.name}`
      }
    }

    // Check if subzone is discovered
    if (!subzone.isDiscovered) {
      return {
        valid: false,
        error: `${subzone.name} has not been discovered yet`
      }
    }

    return { valid: true }
  }

  return {
    validateParty,
    checkMoraleRequirements,
    verifyZoneRequirements,
    canStartExpedition,
    MIN_MORALE_FOR_EXPEDITION,
    MIN_PARTY_SIZE,
    MAX_PARTY_SIZE,
  }
}
