import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'
import type { Expedition, Hero } from '~~/types'

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
    const { data: heroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', heroIds)
      .eq('player_id', user.id)

    if (heroesError) throw heroesError

    if (!heroes || heroes.length !== heroIds.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'One or more heroes not found'
      })
    }

    // Check if any hero is busy
    const busyHeroes = heroes.filter((h: Hero) => h.status === 'expedition' || h.status === 'stationed')
    if (busyHeroes.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'HERO_BUSY',
        data: { busyHeroes: busyHeroes.map((h: Hero) => h.name) }
      })
    }

    // Check if any hero is exhausted (morale < 20)
    const exhaustedHeroes = heroes.filter((h: Hero) => h.morale < 20)
    if (exhaustedHeroes.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'HERO_EXHAUSTED',
        data: { exhaustedHeroes: exhaustedHeroes.map((h: Hero) => h.name) }
      })
    }

    // TODO: Check if zone/subzone is unlocked for this player
    // For now, we'll assume it's available

    // Calculate team power (sum of hero combat stats)
    const teamPower = heroes.reduce((sum: number, hero: Hero) => sum + hero.power, 0)

    // Get subzone duration from zone data
    // TODO: Fetch actual subzone data
    const duration = 30 // Default 30 minutes for MVP

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
        status: 'expedition',
        updated_at: now.toISOString()
      })
      .in('id', heroIds)

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

    if (updatedHeroesError) throw updatedHeroesError

    return {
      expedition: expedition as Expedition,
      heroesUpdated: updatedHeroes as Hero[]
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
