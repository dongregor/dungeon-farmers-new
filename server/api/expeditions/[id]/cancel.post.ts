import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Hero } from '~~/types'
import { applyMoraleChange } from '~/utils/moraleService'

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

  try {
    // Fetch expedition
    const { data: expedition, error: expeditionError } = await supabase
      .from('expeditions')
      .select('*')
      .eq('id', expeditionId)
      .eq('player_id', user.id)
      .single()

    if (expeditionError || !expedition) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Expedition not found'
      })
    }

    // Can only cancel in-progress expeditions
    if (expedition.status !== 'in_progress') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Can only cancel in-progress expeditions'
      })
    }

    const now = new Date()

    // Mark expedition as failed
    const { error: updateExpeditionError } = await supabase
      .from('expeditions')
      .update({
        status: 'failed',
        completed_at: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('id', expeditionId)

    if (updateExpeditionError) throw updateExpeditionError

    // Free heroes and apply morale penalty
    const { data: heroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', expedition.hero_ids)

    if (heroesError) throw heroesError

    const updatedHeroes: Hero[] = []
    for (const hero of heroes as Hero[]) {
      // Calculate new morale (larger penalty for canceling)
      const newMorale = applyMoraleChange(hero.moraleValue, -20)

      const { data: updatedHero, error: updateHeroError } = await supabase
        .from('heroes')
        .update({
          status: 'idle',
          morale: newMorale.morale,
          morale_value: newMorale.moraleValue,
          morale_last_update: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', hero.id)
        .select()
        .single()

      if (updateHeroError) throw updateHeroError
      updatedHeroes.push(updatedHero as Hero)
    }

    return {
      heroesFreed: updatedHeroes,
      penaltyApplied: 'Heroes lost 20 morale for abandoning the expedition'
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to cancel expedition',
      data: { error: error.message }
    })
  }
})
