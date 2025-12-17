import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'
import type { Expedition, Hero } from '~~/types'
import { mapSupabaseExpeditionToExpedition, mapSupabaseHeroToHero } from '../../utils/mappers'

const startExpeditionSchema = z.object({
  zoneId: z.string().min(1),
  subzoneId: z.string().min(1),
  heroIds: z.array(z.string().uuid()).min(1).max(4),
  autoRepeat: z.boolean().optional().default(false),
  stopConditions: z.object({
    anyHeroTired: z.boolean().default(false),
    inventoryFull: z.boolean().default(false),
    resourceCap: z.boolean().default(false)
  }).optional().default({
    anyHeroTired: false,
    inventoryFull: false,
    resourceCap: false
  })
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

  const { zoneId, subzoneId, heroIds, autoRepeat, stopConditions } = parsed.data

  try {
    // Check if heroes exist and are available
    const { data: rawHeroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', heroIds)
      .eq('player_id', user.id)

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

    // Get zone and subzone data
    const { ZONES } = await import('~/data/zones')
    const zone = ZONES.find(z => z.id === zoneId)
    const subzone = zone?.subzones.find(sz => sz.id === subzoneId)

    if (!zone || !subzone) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Zone or subzone not found'
      })
    }

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
          .eq('player_id', user.id)
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
          .eq('player_id', user.id)
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
        .eq('player_id', user.id)
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

    // Create expedition
    const { data: expedition, error: expeditionError } = await supabase
      .from('expeditions')
      .insert({
        player_id: user.id,
        zone_id: zoneId,
        subzone_id: subzoneId,
        hero_ids: heroIds,
        team_power: teamPower,
        status: 'in_progress',
        started_at: now.toISOString(),
        end_time: endTime.toISOString(),
        duration,
        auto_repeat: autoRepeat,
        stop_conditions: stopConditions,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
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
      .eq('player_id', user.id)

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
      .eq('player_id', user.id)

    if (updatedHeroesError) throw updatedHeroesError

    return {
      expedition: mapSupabaseExpeditionToExpedition(expedition),
      heroesUpdated: (updatedHeroes || []).map(mapSupabaseHeroToHero)
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to start expedition',
      data: { error: error.message }
    })
  }
})
