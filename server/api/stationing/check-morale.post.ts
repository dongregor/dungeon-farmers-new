/**
 * POST /api/stationing/check-morale
 * Check morale thresholds and auto-recall heroes that hit the limit
 */
export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const stationed = getStationedHeroes(userId)

  if (stationed.length === 0) {
    return {
      recalled: [],
      rewards: {},
    }
  }

  // TODO: Check actual hero morale from hero data
  // For now, auto-recall heroes stationed for more than 24 hours
  const now = Date.now()
  const maxDuration = 24 * 60 * 60 * 1000 // 24 hours

  const toRecall: string[] = []
  const rewards: Record<string, ReturnType<typeof calculateRewards>> = {}

  const remaining = stationed.filter(h => {
    const stationedAt = new Date(h.stationedAt).getTime()
    const duration = now - stationedAt

    if (duration >= maxDuration) {
      // Hero needs to be recalled
      toRecall.push(h.heroId)
      rewards[h.heroId] = calculateRewards(h)
      return false
    }

    return true
  })

  // Update stationed list
  setStationedHeroes(userId, remaining)

  return {
    recalled: toRecall,
    rewards,
  }
})
