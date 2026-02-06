/**
 * POST /api/stationing/station
 * Station a hero in a zone
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ heroId: string; zoneId: string }>(event)
  const { heroId, zoneId } = body

  if (!heroId || !zoneId) {
    throw createError({
      statusCode: 400,
      message: 'heroId and zoneId are required',
    })
  }

  const userId = getUserId(event)

  // Check if hero is already stationed
  if (findStationedHero(userId, heroId)) {
    throw createError({
      statusCode: 400,
      message: 'Hero is already stationed',
    })
  }

  // Check global capacity
  const stationed = getStationedHeroes(userId)
  const globalCap = 3 // Early tier cap
  if (stationed.length >= globalCap) {
    throw createError({
      statusCode: 400,
      message: `Cannot station more heroes (limit: ${globalCap})`,
    })
  }

  // Check zone capacity
  const perZoneCap = 1 // Early tier cap
  const inZone = stationed.filter(h => h.zoneId === zoneId).length
  if (inZone >= perZoneCap) {
    throw createError({
      statusCode: 400,
      message: `Cannot station more heroes in this zone (limit: ${perZoneCap})`,
    })
  }

  // Create stationed hero record
  const now = new Date().toISOString()
  const stationedHero = {
    heroId,
    zoneId,
    stationedAt: now,
    lastCollectedAt: now,
  }

  addStationedHero(userId, stationedHero)

  return stationedHero
})
