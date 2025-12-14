import type { Stats } from './base'

export type ThreatType = 'physical' | 'magic' | 'precision' | 'area'

export interface ThreatDefinition {
  id: ThreatType
  name: string
  description: string
  statPenalty: Partial<Stats>
  counterThreats: ThreatType[]
}

export const THREAT_DEFINITIONS: ThreatDefinition[] = [
  {
    id: 'physical',
    name: 'Physical',
    description: 'Direct physical attacks and melee combat',
    statPenalty: { combat: -10 },
    counterThreats: ['magic']
  },
  {
    id: 'magic',
    name: 'Magic',
    description: 'Spellcasting and magical effects',
    statPenalty: { utility: -10 },
    counterThreats: ['physical']
  },
  {
    id: 'precision',
    name: 'Precision',
    description: 'Accurate ranged attacks and targeted strikes',
    statPenalty: { survival: -10 },
    counterThreats: ['area']
  },
  {
    id: 'area',
    name: 'Area',
    description: 'Wide-area effects and environmental hazards',
    statPenalty: { combat: -5, utility: -5 },
    counterThreats: ['precision']
  }
]

export function getThreatById(id: ThreatType): ThreatDefinition {
  return THREAT_DEFINITIONS.find(t => t.id === id)!
}

export function calculateThreatPenalty(
  heroThreats: string[],
  zoneThreats: string[]
): Partial<Stats> {
  const penalty: Partial<Stats> = { combat: 0, utility: 0, survival: 0 }
  
  zoneThreats.forEach(threatId => {
    const threat = getThreatById(threatId as ThreatType)
    if (threat) {
      // Check if hero has counter threats
      const hasCounter = threat.counterThreats.some(counter => 
        heroThreats.includes(counter)
      )
      
      if (!hasCounter) {
        // Apply penalty if no counter
        if (threat.statPenalty.combat) penalty.combat! += threat.statPenalty.combat
        if (threat.statPenalty.utility) penalty.utility! += threat.statPenalty.utility
        if (threat.statPenalty.survival) penalty.survival! += threat.statPenalty.survival
      }
    }
  })
  
  return penalty
}