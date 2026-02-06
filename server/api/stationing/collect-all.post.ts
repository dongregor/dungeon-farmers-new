/**
 * POST /api/stationing/collect-all
 * Collect rewards from all stationed heroes that are ready
 */
export default defineEventHandler(async (event) => {
  const userId = getUserId(event)
  const stationed = getStationedHeroes(userId)

  if (stationed.length === 0) {
    return {
      collected: 0,
      totalRewards: {
        materials: [],
        familiarityGain: 0,
      },
      autoRecalled: [],
    }
  }

  const now = Date.now()
  const minDuration = 60 * 60 * 1000 // 1 hour

  // Filter heroes ready to collect
  const readyHeroes = stationed.filter(h => {
    const lastCollected = new Date(h.lastCollectedAt).getTime()
    return now - lastCollected >= minDuration
  })

  if (readyHeroes.length === 0) {
    return {
      collected: 0,
      totalRewards: {
        materials: [],
        familiarityGain: 0,
      },
      autoRecalled: [],
    }
  }

  // Calculate rewards for each hero
  const allRewards = readyHeroes.map(h => calculateRewards(h))
  const totalRewards = mergeRewards(allRewards)

  // Update last collected time for all ready heroes
  const nowIso = new Date().toISOString()
  const updatedStationed = stationed.map(h => {
    if (readyHeroes.some(rh => rh.heroId === h.heroId)) {
      return { ...h, lastCollectedAt: nowIso }
    }
    return h
  })

  setStationedHeroes(userId, updatedStationed)

  // TODO: Check morale and auto-recall if needed
  const autoRecalled: string[] = []

  return {
    collected: readyHeroes.length,
    totalRewards,
    autoRecalled,
  }
})
