import { ZONES } from '~/data/zones'

/**
 * GET /api/zones
 * Returns all zones with player progress
 */
export default defineEventHandler(async (event) => {
  // TODO: Get actual player progress from database
  // For now, return zones with mock progress
  const mockProgress = {
    zones: [
      {
        zoneId: 'verdant_woods',
        familiarity: 35,
        isUnlocked: true,
        isMastered: false,
        discoveredSubzones: ['woods_edge'],
      },
      {
        zoneId: 'goblin_caves',
        familiarity: 0,
        isUnlocked: false,
        isMastered: false,
        discoveredSubzones: [],
      },
      {
        zoneId: 'misty_swamp',
        familiarity: 0,
        isUnlocked: false,
        isMastered: false,
        discoveredSubzones: [],
      },
    ],
    subzones: [
      {
        subzoneId: 'woods_edge',
        mastery: 20,
        isMastered: false,
      },
    ],
  }

  return {
    zones: ZONES,
    progress: mockProgress,
  }
})
