/**
 * POST /api/stationing/collect
 * Collect rewards from a stationed hero without recalling
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ heroId: string }>(event)
  const { heroId } = body

  if (!heroId) {
    throw createError({
      statusCode: 400,
      message: 'heroId is required',
    })
  }

  const userId = getUserId(event)

  // Find the stationed hero
  const stationed = findStationedHero(userId, heroId)
  if (!stationed) {
    throw createError({
      statusCode: 404,
      message: 'Hero is not stationed',
    })
  }

  // Check if enough time has passed (1 hour minimum)
  const now = Date.now()
  const lastCollected = new Date(stationed.lastCollectedAt).getTime()
  const minDuration = 60 * 60 * 1000 // 1 hour

  if (now - lastCollected < minDuration) {
    throw createError({
      statusCode: 400,
      message: 'Not enough time has passed since last collection (minimum: 1 hour)',
    })
  }

  // Calculate rewards
  const rewards = calculateRewards(stationed)

  // Update last collected time
  updateStationedHero(userId, heroId, {
    lastCollectedAt: new Date().toISOString(),
  })

  // TODO: Check morale and auto-recall if needed
  const autoRecalled = false

  return {
    rewards,
    heroMoraleStatus: 'content', // TODO: Calculate actual morale
    autoRecalled,
  }
})
