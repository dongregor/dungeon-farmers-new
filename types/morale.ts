import type { MoraleState } from './base'

export interface MoraleSystem {
  currentState: MoraleState
  lastUpdate: string
  
  // Modifiers
  expeditionFatigue: number
  successBonus: number
  failurePenalty: number
  
  // Recovery
  recoveryRate: number
  
  // Thresholds
  stateThresholds: Record<MoraleState, { min: number, max: number }>
}

export interface MoraleEvent {
  id: string
  heroId: string
  oldState: MoraleState
  newState: MoraleState
  reason: string
  timestamp: string
}