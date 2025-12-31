import type {
  Monster,
  SynergyRequirement,
  SynergyCalculationResult,
  AppliedSynergy
} from '~~/types'
import { SYNERGIES } from '~/data/synergies'

export const SYNERGY_SOFT_CAP = 60

interface RequirementCheckResult {
  matches: boolean
  contributingMonsterIds: string[]
}

export function checkSynergyRequirement(
  monsters: Monster[],
  requirement: SynergyRequirement
): RequirementCheckResult {
  const { pattern } = requirement

  switch (pattern) {
    case 'type_threshold': {
      const matchingMonsters = monsters.filter(m =>
        requirement.monsterTypes?.includes(m.type)
      )
      const minCount = requirement.minCount ?? 3
      return {
        matches: matchingMonsters.length >= minCount,
        contributingMonsterIds: matchingMonsters.map(m => m.id)
      }
    }

    case 'element_matching': {
      const minCount = requirement.minCount ?? 3
      // Group by element and find the largest group
      const elementCounts = new Map<string, Monster[]>()
      for (const monster of monsters) {
        const existing = elementCounts.get(monster.element) ?? []
        existing.push(monster)
        elementCounts.set(monster.element, existing)
      }

      for (const [, elementMonsters] of elementCounts) {
        if (elementMonsters.length >= minCount) {
          return {
            matches: true,
            contributingMonsterIds: elementMonsters.map(m => m.id)
          }
        }
      }
      return { matches: false, contributingMonsterIds: [] }
    }

    case 'biome_harmony': {
      const minCount = requirement.minCount ?? monsters.length
      const biomes = requirement.biomes

      if (biomes && biomes.length > 0) {
        const matchingMonsters = monsters.filter(m => biomes.includes(m.biome))
        return {
          matches: matchingMonsters.length >= minCount && matchingMonsters.length === monsters.length,
          contributingMonsterIds: matchingMonsters.map(m => m.id)
        }
      }

      // All same biome
      const firstBiome = monsters[0]?.biome
      if (!firstBiome) return { matches: false, contributingMonsterIds: [] }

      const allSameBiome = monsters.every(m => m.biome === firstBiome)
      return {
        matches: allSameBiome && monsters.length >= minCount,
        contributingMonsterIds: allSameBiome ? monsters.map(m => m.id) : []
      }
    }

    case 'family_threshold': {
      const minCount = requirement.minCount ?? 3
      const families = requirement.families ?? []

      const matchingMonsters = monsters.filter(m => families.includes(m.family))
      return {
        matches: matchingMonsters.length >= minCount,
        contributingMonsterIds: matchingMonsters.map(m => m.id)
      }
    }

    case 'all_same_type': {
      const minCount = requirement.minCount ?? 1
      const requiredTypes = requirement.monsterTypes

      if (!requiredTypes || requiredTypes.length === 0) {
        return { matches: false, contributingMonsterIds: [] }
      }

      const allMatch = monsters.every(m => requiredTypes.includes(m.type))
      return {
        matches: allMatch && monsters.length >= minCount,
        contributingMonsterIds: allMatch ? monsters.map(m => m.id) : []
      }
    }

    case 'element_combo': {
      const requiredElements = requirement.requiredElements ?? []
      const contributing: string[] = []

      for (const element of requiredElements) {
        const monster = monsters.find(m => m.element === element)
        if (!monster) {
          return { matches: false, contributingMonsterIds: [] }
        }
        contributing.push(monster.id)
      }

      return {
        matches: true,
        contributingMonsterIds: contributing
      }
    }

    case 'type_element': {
      const requiredTypes = requirement.monsterTypes ?? []
      const requiredElements = requirement.elements ?? []
      const minCount = requirement.minCount ?? 1

      const matchingMonsters = monsters.filter(m =>
        requiredTypes.includes(m.type) && requiredElements.includes(m.element)
      )

      return {
        matches: matchingMonsters.length >= minCount,
        contributingMonsterIds: matchingMonsters.map(m => m.id)
      }
    }

    case 'opposites': {
      const requiredElements = requirement.requiredElements ?? []
      if (requiredElements.length < 2) {
        return { matches: false, contributingMonsterIds: [] }
      }

      const contributing: string[] = []
      for (const element of requiredElements) {
        const monster = monsters.find(m => m.element === element)
        if (!monster) {
          return { matches: false, contributingMonsterIds: [] }
        }
        contributing.push(monster.id)
      }

      return {
        matches: true,
        contributingMonsterIds: contributing
      }
    }

    case 'full_diversity': {
      if (!requirement.allDifferentTypes) {
        return { matches: false, contributingMonsterIds: [] }
      }

      const types = new Set(monsters.map(m => m.type))
      const allDifferent = types.size === monsters.length

      return {
        matches: allDifferent && monsters.length >= 3,
        contributingMonsterIds: allDifferent ? monsters.map(m => m.id) : []
      }
    }

    default:
      return { matches: false, contributingMonsterIds: [] }
  }
}

export function calculateSynergies(
  monsters: Monster[],
  _discoveredSynergyIds: string[] = []
): SynergyCalculationResult {
  if (monsters.length === 0) {
    return {
      activeSynergies: [],
      totalLootBonus: 0,
      totalPowerBonus: 0,
      totalDropRateBonus: 0,
      cappedAt: SYNERGY_SOFT_CAP,
      wasCapped: false
    }
  }

  const activeSynergies: AppliedSynergy[] = []

  for (const synergy of SYNERGIES) {
    const result = checkSynergyRequirement(monsters, synergy.requirement)

    if (result.matches) {
      const totalBonus = synergy.effects.reduce((sum, effect) => sum + effect.value, 0)

      activeSynergies.push({
        synergyId: synergy.id,
        synergy,
        contributingMonsterIds: result.contributingMonsterIds,
        totalBonus
      })
    }
  }

  // Calculate totals by effect type
  let totalLootBonus = 0
  let totalPowerBonus = 0
  let totalDropRateBonus = 0

  for (const applied of activeSynergies) {
    for (const effect of applied.synergy.effects) {
      switch (effect.type) {
        case 'loot_quality':
          totalLootBonus += effect.value
          break
        case 'power':
          totalPowerBonus += effect.value
          break
        case 'drop_rate':
          totalDropRateBonus += effect.value
          break
      }
    }
  }

  // Apply soft cap
  const wasCapped = totalLootBonus > SYNERGY_SOFT_CAP ||
                    totalPowerBonus > SYNERGY_SOFT_CAP ||
                    totalDropRateBonus > SYNERGY_SOFT_CAP

  totalLootBonus = Math.min(totalLootBonus, SYNERGY_SOFT_CAP)
  totalPowerBonus = Math.min(totalPowerBonus, SYNERGY_SOFT_CAP)
  totalDropRateBonus = Math.min(totalDropRateBonus, SYNERGY_SOFT_CAP)

  return {
    activeSynergies,
    totalLootBonus,
    totalPowerBonus,
    totalDropRateBonus,
    cappedAt: SYNERGY_SOFT_CAP,
    wasCapped
  }
}
