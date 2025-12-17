import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Expedition, ExpeditionRewards, ExpeditionLog, Hero, Equipment } from '~~/types'
import { generateExpeditionLog } from '~/utils/logGenerator'

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

    // Check if expedition is ready to complete
    const now = new Date()
    const endTime = new Date(expedition.end_time)
    if (now < endTime) {
      throw createError({
        statusCode: 400,
        statusMessage: 'EXPEDITION_NOT_READY',
        data: { timeRemaining: endTime.getTime() - now.getTime() }
      })
    }

    // Fetch heroes
    const { data: heroes, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .in('id', expedition.hero_ids)

    if (heroesError) throw heroesError

    // Fetch zone and subzone data
    // TODO: Implement proper zone/subzone fetching
    // For MVP, using placeholder data
    const zone = { id: expedition.zone_id, name: 'Test Zone', type: 'forest' as const }
    const subzone = { id: expedition.subzone_id, name: 'Test Subzone', baseDuration: 30, threats: [] }

    // Calculate expedition results
    const efficiency = Math.min(150, Math.max(60, 100 + Math.random() * 30)) // Random efficiency 100-130%

    // Calculate rewards based on efficiency
    const baseGold = 50 * heroes.length
    const baseXp = 25 * heroes.length
    const gold = Math.floor(baseGold * (efficiency / 100))
    const xp = Math.floor(baseXp * (efficiency / 100))

    const rewards: ExpeditionRewards = {
      gold,
      xp,
      equipment: [], // No equipment drops for MVP
      materials: {},
      familiarityGain: 10,
      masteryGain: 5
    }

    // Generate expedition log
    const log = generateExpeditionLog(
      expedition as Expedition,
      heroes as Hero[],
      zone,
      subzone
    )

    // Update expedition
    const { error: updateExpeditionError } = await supabase
      .from('expeditions')
      .update({
        status: 'completed',
        completed_at: now.toISOString(),
        efficiency,
        rewards,
        log,
        updated_at: now.toISOString()
      })
      .eq('id', expeditionId)

    if (updateExpeditionError) throw updateExpeditionError

    // Update heroes (add XP, restore to idle)
    const updatedHeroes: Hero[] = []
    for (const hero of heroes as Hero[]) {
      const newXp = hero.xp + xp
      const newLevel = Math.floor(newXp / 100) + 1 // Simple leveling formula
      const leveledUp = newLevel > hero.level

      const { data: updatedHero, error: updateHeroError } = await supabase
        .from('heroes')
        .update({
          xp: newXp,
          level: Math.min(newLevel, 50), // Cap at level 50
          status: 'idle',
          morale: Math.max(0, hero.morale - 10), // Lose morale
          updated_at: now.toISOString()
        })
        .eq('id', hero.id)
        .select()
        .single()

      if (updateHeroError) throw updateHeroError
      updatedHeroes.push(updatedHero as Hero)
    }

    // Update player gold
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('gold')
      .eq('id', user.id)
      .single()

    if (!playerError && player) {
      await supabase
        .from('players')
        .update({
          gold: player.gold + gold
        })
        .eq('id', user.id)
    }

    // TODO: Update zone progress (familiarity/mastery)

    // Fetch updated expedition
    const { data: completedExpedition, error: fetchError } = await supabase
      .from('expeditions')
      .select('*')
      .eq('id', expeditionId)
      .single()

    if (fetchError) throw fetchError

    return {
      expedition: completedExpedition as Expedition,
      log,
      rewards,
      heroesUpdated: updatedHeroes,
      equipmentDropped: [] as Equipment[],
      zoneProgress: {
        familiarity: rewards.familiarityGain,
        mastery: rewards.masteryGain
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to complete expedition',
      data: { error: error.message }
    })
  }
})
