/**
 * GET /api/stationing
 * Returns all stationed heroes and progression tier for the user
 */
export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const stationed = getStationedHeroes(userId)

  // TODO: Get actual progression tier from user data
  const progressionTier = 'early' as const

  return {
    stationed,
    progressionTier,
  }
})
