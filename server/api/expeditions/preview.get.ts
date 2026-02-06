import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Hero, ArchetypeTag } from '~~/types'
import { THREATS } from '~~/types/threats'

export default defineEventHandler(async (event) => {
  // Auth check
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const supabase = await serverSupabaseClient(event)

  // Parse query params
  const query = getQuery(event)
  const zoneId = query.zoneId as string
  const subzoneId = query.subzoneId as string
  const heroIdsParam = query.heroIds as string

  if (!zoneId || !subzoneId || !heroIdsParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters: zoneId, subzoneId, heroIds'
    })
  }

  const heroIds = heroIdsParam.split(',')

  // Get auth user ID
  const authUserId = user.id || (user as any).sub
  if (!authUserId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User ID not found'
    })
  }

  // Get player by auth user ID
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id')
    .eq('auth_user_id', authUserId)
    .single()

  if (playerError || !player) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Player not found'
    })
  }

  const playerId = player.id

  try {
    // Fetch heroes
    const { data: heroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', heroIds)
      .eq('player_id', playerId)

    if (heroesError) throw heroesError

    if (!heroes || heroes.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No heroes found'
      })
    }

    // TODO: Fetch actual subzone data with threats
    // For MVP, using placeholder data
    const subzone = {
      id: subzoneId,
      name: 'Test Subzone',
      baseDuration: 30,
      threats: ['physical_burst', 'swarms'] as string[],
      difficulty: 1
    }

    // Get threat data
    const threats = subzone.threats.map(threatId => THREATS[threatId]).filter(Boolean)

    // Calculate team power (guard against missing power values)
    const teamPower = (heroes as Hero[]).reduce((sum, hero) => sum + (hero.power ?? 0), 0)

    // Calculate estimated difficulty (simplified)
    const estimatedDifficulty = subzone.difficulty * 100
    const efficiency = Math.min(150, Math.max(60, (teamPower / estimatedDifficulty) * 100))

    // Check which threats are countered
    const counters = threats.map(threat => {
      const hasCounter = (heroes as Hero[]).some(hero =>
        hero.archetypeTags.some(tag => threat.counteredBy.includes(tag as ArchetypeTag))
      )

      return {
        threatId: threat.id,
        hasCounter,
        counterTags: threat.counteredBy
      }
    })

    // Calculate estimated rewards
    const baseGold = 50 * heroes.length
    const baseXp = 25 * heroes.length
    const estimatedGold = Math.floor(baseGold * (efficiency / 100))
    const estimatedXp = Math.floor(baseXp * (efficiency / 100))

    return {
      estimatedEfficiency: Math.round(efficiency),
      threats,
      counters,
      estimatedRewards: {
        gold: estimatedGold,
        xp: estimatedXp,
        duration: subzone.baseDuration
      }
    }
  } catch (err: unknown) {
    const error = toError(err)
    if (error.statusCode) throw err

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to preview expedition',
      data: { error: error.message }
    })
  }
})
