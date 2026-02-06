/**
 * POST /api/stationing/recall
 * Recall a stationed hero and collect final rewards
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

  // Calculate rewards before recalling
  const rewards = calculateRewards(stationed)

  // Remove from stationed list
  removeStationedHero(userId, heroId)

  return {
    rewards,
    heroMoraleStatus: 'rested', // TODO: Calculate actual morale
  }
})
