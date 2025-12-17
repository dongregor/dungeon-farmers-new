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

  try {
    // Fetch heroes
    const { data: heroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', heroIds)
      .eq('player_id', user.id)

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
      threats: ['heavy_damage', 'swarms'] as string[],
      difficulty: 1
    }

    // Get threat data
    const threats = subzone.threats.map(threatId => THREATS[threatId]).filter(Boolean)

    // Calculate team power
    const teamPower = (heroes as Hero[]).reduce((sum, hero) => sum + hero.stats.combat, 0)

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
  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to preview expedition',
      data: { error: error.message }
    })
  }
})
