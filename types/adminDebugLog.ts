/**
 * Detailed debug log for expedition calculations.
 * Stored alongside expedition data for admin inspection.
 * Records every calculation step, roll, and decision.
 */

export interface DebugLogEntry {
  step: string
  detail: string
  value?: string | number
  formula?: string
}

export interface ExpeditionDebugLog {
  /** Timestamp of when this log was generated */
  generatedAt: string

  /** Phase: expedition start calculations */
  start: {
    /** Hero power breakdown per hero */
    heroPowerBreakdowns: Array<{
      heroId: string
      heroName: string
      statPower: number
      levelPower: number
      prestigePower: number
      gearPower: number
      traitPower: number
      totalPower: number
    }>
    /** Total team power */
    teamPower: number
    /** Required power for the subzone */
    requiredPower: number
    /** Power ratio */
    powerRatio: number
    /** Base efficiency from power ratio */
    baseEfficiency: number
    /** Threat analysis */
    threats: Array<{
      threatId: string
      threatName: string
      severity: string
      countered: boolean
      counteredBy?: string
      counteringHeroName?: string
      efficiencyChange: number
    }>
    /** Final clamped efficiency */
    finalEfficiency: number
    /** Duration info */
    duration: {
      baseDuration: number
      zoneId: string
      subzoneId: string
      difficulty: string
    }
    /** Ordered log of each step */
    steps: DebugLogEntry[]
  }

  /** Phase: expedition completion calculations */
  completion: {
    /** Efficiency used (currently random, should use stored) */
    efficiencyUsed: number
    efficiencySource: string
    /** Reward calculations */
    rewards: {
      heroCount: number
      baseGold: number
      baseXp: number
      goldAfterEfficiency: number
      xpAfterEfficiency: number
      familiarityGain: number
      masteryGain: number
    }
    /** Per-hero updates */
    heroUpdates: Array<{
      heroId: string
      heroName: string
      previousXp: number
      xpGained: number
      newXp: number
      previousLevel: number
      newLevel: number
      leveledUp: boolean
      previousMorale: number
      moraleChange: number
      newMorale: number
      newMoraleState: string
    }>
    /** Gold update */
    goldUpdate: {
      amount: number
      playerId: string
    }
    /** Ordered log of each step */
    steps: DebugLogEntry[]
  }
}
