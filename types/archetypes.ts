import type { Archetype, Stats } from './base'

export interface ArchetypeDefinition {
  id: Archetype
  name: string
  description: string
  statWeights: Stats
  tags: string[]
  threatContributions: string[]
  threatResistances: string[]
}

export const ARCHETYPE_DEFINITIONS: ArchetypeDefinition[] = [
  {
    id: 'tank',
    name: 'Tank',
    description: 'Absorbs damage and protects allies',
    statWeights: { combat: 40, utility: 30, survival: 30 },
    tags: ['defensive', 'frontline'],
    threatContributions: ['physical', 'area'],
    threatResistances: ['magic', 'precision']
  },
  {
    id: 'healer',
    name: 'Healer',
    description: 'Restores health and provides support',
    statWeights: { combat: 20, utility: 40, survival: 40 },
    tags: ['support', 'rear'],
    threatContributions: ['magic'],
    threatResistances: ['physical', 'area']
  },
  {
    id: 'debuffer',
    name: 'Debuffer',
    description: 'Weakens enemies and controls the battlefield',
    statWeights: { combat: 30, utility: 40, survival: 30 },
    tags: ['control', 'midline'],
    threatContributions: ['magic', 'precision'],
    threatResistances: ['physical', 'area']
  },
  {
    id: 'melee_dps',
    name: 'Melee DPS',
    description: 'Deals high physical damage up close',
    statWeights: { combat: 50, utility: 20, survival: 30 },
    tags: ['offensive', 'frontline'],
    threatContributions: ['physical', 'precision'],
    threatResistances: ['magic', 'area']
  },
  {
    id: 'ranged_dps',
    name: 'Ranged DPS',
    description: 'Deals damage from a distance',
    statWeights: { combat: 50, utility: 25, survival: 25 },
    tags: ['offensive', 'rear'],
    threatContributions: ['physical', 'precision'],
    threatResistances: ['magic', 'area']
  },
  {
    id: 'caster',
    name: 'Caster',
    description: 'Deals high magical damage with spells',
    statWeights: { combat: 45, utility: 30, survival: 25 },
    tags: ['offensive', 'midline'],
    threatContributions: ['magic', 'area'],
    threatResistances: ['physical', 'precision']
  }
]

export function getArchetypeById(id: Archetype): ArchetypeDefinition {
  return ARCHETYPE_DEFINITIONS.find(a => a.id === id)!
}