import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { mapSupabaseHeroToHero } from '~~/server/utils/mappers'
import type { Hero } from '~~/types'
import { applyMoraleChange } from '~/utils/moraleService'
import { MORALE_PENALTIES } from '~~/shared/constants/gameRules'

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
  const expeditionId = getRouterParam(event, 'id')

  if (!expeditionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Expedition ID required'
    })
  }

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
    // Fetch expedition
    const { data: expedition, error: expeditionError } = await supabase
      .from('expeditions')
      .select('*')
      .eq('id', expeditionId)
      .eq('player_id', playerId)
      .single()

    if (expeditionError || !expedition) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Expedition not found'
      })
    }

    // Can only cancel in-progress expeditions (not completed)
    if (expedition.is_completed) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Can only cancel in-progress expeditions'
      })
    }

    const now = new Date()

    // Mark expedition as completed (cancelled)
    const { error: updateExpeditionError } = await supabase
      .from('expeditions')
      .update({
        is_completed: true,
        updated_at: now.toISOString()
      })
      .eq('id', expeditionId)

    if (updateExpeditionError) throw updateExpeditionError

    // Free heroes and apply morale penalty
    const { data: heroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', expedition.hero_ids)
      .eq('player_id', playerId)

    if (heroesError) throw heroesError

    const heroList = (heroes || []).map(mapSupabaseHeroToHero)
    const updatedHeroes: Hero[] = []
    for (const hero of heroList) {
      // Calculate new morale (larger penalty for canceling)
      const newMorale = applyMoraleChange(hero.moraleValue, MORALE_PENALTIES.expeditionCancel)

      const { data: updatedHero, error: updateHeroError } = await supabase
        .from('heroes')
        .update({
          is_on_expedition: false,
          current_expedition_id: null,
          morale: newMorale.morale,
          morale_last_update: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', hero.id)
        .select()
        .single()

      if (updateHeroError) throw updateHeroError
      updatedHeroes.push(mapSupabaseHeroToHero(updatedHero))
    }

    return {
      heroesFreed: updatedHeroes,
      penaltyApplied: 'Heroes lost 20 morale for abandoning the expedition'
    }
  } catch (err: unknown) {
    const error = toError(err)
    if (error.statusCode) throw err

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to cancel expedition',
      data: { error: error.message }
    })
  }
})
