import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'
import type { Expedition, Hero } from '~~/types'
import { mapSupabaseExpeditionToExpedition, mapSupabaseHeroToHero } from '../../utils/mappers'

const startExpeditionSchema = z.object({
  zoneId: z.string().min(1),
  subzoneId: z.string().min(1),
  heroIds: z.array(z.string().uuid()).min(1).max(4),
})

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

  // Validate request body
  const body = await readBody(event)
  const parsed = startExpeditionSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request',
      data: { errors: parsed.error.issues }
    })
  }

  const { zoneId, subzoneId, heroIds } = parsed.data

  try {
    // Check if heroes exist and are available
    const { data: rawHeroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', heroIds)
      .eq('player_id', playerId)

    if (heroesError) throw heroesError

    if (!rawHeroes || rawHeroes.length !== heroIds.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'One or more heroes not found'
      })
    }

    // Map Supabase data to camelCase types immediately
    const heroes = rawHeroes.map(mapSupabaseHeroToHero)

    // Check if any hero is busy
    const busyHeroes = heroes.filter(h => h.isOnExpedition || h.isStationed)
    if (busyHeroes.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'HERO_BUSY',
        data: { busyHeroes: busyHeroes.map(h => h.name) }
      })
    }

    // Check if any hero is exhausted (morale < 20)
    const exhaustedHeroes = heroes.filter(h => h.moraleValue < 20)
    if (exhaustedHeroes.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'HERO_EXHAUSTED',
        data: { exhaustedHeroes: exhaustedHeroes.map(h => h.name) }
      })
    }

    // Get zone and subzone data with O(1) Map lookup
    const { getZoneAndSubzone } = await import('~/data/zones')
    const zoneData = getZoneAndSubzone(zoneId, subzoneId)

    if (!zoneData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Zone or subzone not found'
      })
    }

    const { zone, subzone } = zoneData

    // Calculate team power (needed for unlock validation)
    const teamPower = heroes.reduce((sum, hero) => sum + (hero.power ?? 0), 0)

    // Check zone unlock requirements
    if (zone.unlockRequirement) {
      const { previousZoneId, minPower, questComplete } = zone.unlockRequirement

      // Check previous zone mastery requirement
      if (previousZoneId) {
        const { data: previousZoneProgress } = await supabase
          .from('zone_progress')
          .select('mastery')
          .eq('player_id', playerId)
          .eq('zone_id', previousZoneId)
          .single()

        if (!previousZoneProgress || previousZoneProgress.mastery < 100) {
          throw createError({
            statusCode: 403,
            statusMessage: 'ZONE_LOCKED',
            data: {
              requirement: 'previous_zone',
              requiredZoneId: previousZoneId,
              message: `Must master ${previousZoneId} first`
            }
          })
        }
      }

      // Check minimum power requirement
      if (minPower && teamPower < minPower) {
        throw createError({
          statusCode: 403,
          statusMessage: 'ZONE_LOCKED',
          data: {
            requirement: 'min_power',
            requiredPower: minPower,
            currentPower: teamPower,
            message: `Team power (${teamPower}) is below required minimum (${minPower})`
          }
        })
      }

      // Check quest completion requirement
      if (questComplete) {
        const { data: quest } = await supabase
          .from('quest_progress')
          .select('completed')
          .eq('player_id', playerId)
          .eq('quest_id', questComplete)
          .single()

        if (!quest || !quest.completed) {
          throw createError({
            statusCode: 403,
            statusMessage: 'ZONE_LOCKED',
            data: {
              requirement: 'quest',
              requiredQuestId: questComplete,
              message: `Must complete quest: ${questComplete}`
            }
          })
        }
      }
    }

    // Check subzone discovery requirement
    if (subzone.requiredZoneFamiliarity) {
      const { data: zoneProgress } = await supabase
        .from('zone_progress')
        .select('familiarity')
        .eq('player_id', playerId)
        .eq('zone_id', zoneId)
        .single()

      const currentFamiliarity = zoneProgress?.familiarity ?? 0
      if (currentFamiliarity < subzone.requiredZoneFamiliarity) {
        throw createError({
          statusCode: 403,
          statusMessage: 'SUBZONE_LOCKED',
          data: {
            requirement: 'zone_familiarity',
            requiredFamiliarity: subzone.requiredZoneFamiliarity,
            currentFamiliarity,
            message: `Requires ${subzone.requiredZoneFamiliarity}% zone familiarity (current: ${currentFamiliarity}%)`
          }
        })
      }
    }

    // Use actual subzone duration or fall back to 30 minutes
    const duration = subzone?.baseDuration && subzone.baseDuration > 0
      ? subzone.baseDuration
      : 30

    // Calculate end time
    const now = new Date()
    const endTime = new Date(now.getTime() + duration * 60 * 1000)

    // Calculate initial efficiency based on power ratio and threat coverage
    const requiredPower = { easy: 20, medium: 40, hard: 80, extreme: 150 }[subzone.difficulty as string] || 40
    const powerRatio = teamPower / requiredPower
    let efficiency = Math.min(120, Math.max(60, 60 + (powerRatio - 0.5) * 80))

    // Bonus for countered threats
    const heroTags = heroes.flatMap(h => h.archetypeTags || [])
    const { THREATS } = await import('~~/types/threats')
    const coveredThreats = (subzone.threats || []).filter((threatId: string) => {
      const threat = THREATS[threatId]
      return threat && heroTags.some(tag => threat.counteredBy.includes(tag as any))
    })
    efficiency += coveredThreats.length * 5

    // Penalty for uncovered threats
    const uncoveredThreats = (subzone.threats || []).filter((threatId: string) => {
      const threat = THREATS[threatId]
      return threat && !heroTags.some(tag => threat.counteredBy.includes(tag as any))
    })
    for (const threatId of uncoveredThreats) {
      const threat = THREATS[threatId as string]
      if (threat) {
        const penalty = threat.severity === 'deadly' ? 15 : threat.severity === 'major' ? 10 : 5
        efficiency -= penalty
      }
    }

    efficiency = Math.round(Math.min(150, Math.max(60, efficiency)))

    // Create expedition
    const { data: expedition, error: expeditionError } = await supabase
      .from('expeditions')
      .insert({
        player_id: playerId,
        type: 'zone',
        zone_id: zoneId,
        subzone_id: subzoneId,
        hero_ids: heroIds,
        difficulty: subzone.difficulty,
        duration_minutes: duration,
        started_at: now.toISOString(),
        completes_at: endTime.toISOString(),
        is_completed: false,
        efficiency,
      })
      .select()
      .single()

    if (expeditionError) throw expeditionError

    // Mark heroes as busy
    const { error: updateError } = await supabase
      .from('heroes')
      .update({
        is_on_expedition: true,
        current_expedition_id: expedition.id,
        updated_at: now.toISOString()
      })
      .in('id', heroIds)
      .eq('player_id', playerId)

    if (updateError) {
      // Compensate: delete the created expedition
      await supabase.from('expeditions').delete().eq('id', expedition.id)
      throw updateError
    }

    // Fetch updated heroes
    const { data: updatedHeroes, error: updatedHeroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', heroIds)
      .eq('player_id', playerId)

    if (updatedHeroesError) throw updatedHeroesError

    return {
      expedition: mapSupabaseExpeditionToExpedition(expedition),
      heroesUpdated: (updatedHeroes || []).map(mapSupabaseHeroToHero)
    }
  } catch (err: unknown) {
    const error = toError(err)
    if (error.statusCode) throw err

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to start expedition',
      data: { error: error.message }
    })
  }
})
