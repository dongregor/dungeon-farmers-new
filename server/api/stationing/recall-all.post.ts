/**
 * POST /api/stationing/recall-all
 * Recall all stationed heroes and collect final rewards
 */
export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const stationed = getStationedHeroes(userId)

  if (stationed.length === 0) {
    return {
      recalled: 0,
      totalRewards: {
        materials: [],
        familiarityGain: 0,
      },
    }
  }

  // Calculate rewards for all heroes
  const allRewards = stationed.map(h => calculateRewards(h))
  const totalRewards = mergeRewards(allRewards)

  // Clear all stationed heroes
  setStationedHeroes(userId, [])

  return {
    recalled: stationed.length,
    totalRewards,
  }
})
