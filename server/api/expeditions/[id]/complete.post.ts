import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { mapSupabaseHeroToHero, mapSupabaseExpeditionToExpedition } from '~~/server/utils/mappers'
import type { Expedition, ExpeditionRewards, ExpeditionLog, Hero, Equipment, ExpeditionDebugLog, DebugLogEntry } from '~~/types'
import { generateExpeditionLog } from '~/utils/logGenerator'
import { applyMoraleChange } from '~/utils/moraleService'
import { MORALE_PENALTIES } from '~~/shared/constants/gameRules'
import { ZONES } from '~/data/zones'

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

    // Check if expedition is ready to complete
    const now = new Date()
    const endTime = new Date(expedition.completes_at)
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

    // Map to camelCase
    const heroList = (heroes || []).map(mapSupabaseHeroToHero)

    // Get zone and subzone data from static data
    const zone = ZONES.find(z => z.id === expedition.zone_id)
    const subzone = zone?.subzones.find(s => s.id === expedition.subzone_id)

    // Fallback if zone not found
    if (!zone || !subzone) {
      console.warn(`Zone or subzone not found: ${expedition.zone_id}/${expedition.subzone_id}`)
    }

    const zoneData = zone || { id: expedition.zone_id, name: 'Unknown Zone', type: 'forest' as const, subzones: [] }
    const subzoneData = subzone || { id: expedition.subzone_id, name: 'Unknown Subzone', baseDuration: 30, threats: [] as string[], difficulty: 'easy' as const }

    // === Debug log: completion phase ===
    const completionSteps: DebugLogEntry[] = []

    // Use stored efficiency from start phase, fall back to random if not available
    const storedEfficiency = expedition.efficiency
    let efficiency: number
    let efficiencySource: string

    if (storedEfficiency && storedEfficiency > 0) {
      efficiency = storedEfficiency
      efficiencySource = 'stored_from_start'
      completionSteps.push({
        step: 'efficiency_source',
        detail: `Using stored efficiency from expedition start: ${efficiency}%`,
        value: efficiency,
      })
    } else {
      const roll = Math.random() * 30
      efficiency = Math.round(Math.min(150, Math.max(60, 100 + roll)))
      efficiencySource = 'random_fallback'
      completionSteps.push({
        step: 'efficiency_source',
        detail: `No stored efficiency, using random fallback: 100 + ${Math.round(roll)} = ${efficiency}%`,
        value: efficiency,
        formula: `clamp(60, 150, 100 + random(0, 30))`,
      })
    }

    // Calculate rewards based on efficiency
    const baseGold = 50 * heroList.length
    const baseXp = 25 * heroList.length
    const gold = Math.floor(baseGold * (efficiency / 100))
    const xp = Math.floor(baseXp * (efficiency / 100))

    completionSteps.push({
      step: 'base_gold',
      detail: `50 * ${heroList.length} heroes = ${baseGold}`,
      value: baseGold,
      formula: `50 * heroCount`,
    })
    completionSteps.push({
      step: 'base_xp',
      detail: `25 * ${heroList.length} heroes = ${baseXp}`,
      value: baseXp,
      formula: `25 * heroCount`,
    })
    completionSteps.push({
      step: 'gold_after_efficiency',
      detail: `floor(${baseGold} * ${efficiency}/100) = ${gold}`,
      value: gold,
      formula: `floor(baseGold * efficiency / 100)`,
    })
    completionSteps.push({
      step: 'xp_after_efficiency',
      detail: `floor(${baseXp} * ${efficiency}/100) = ${xp}`,
      value: xp,
      formula: `floor(baseXp * efficiency / 100)`,
    })

    const rewards: ExpeditionRewards = {
      gold,
      xp,
      equipment: [], // No equipment drops for MVP
      materials: {},
      familiarityGain: 10,
      masteryGain: 5
    }

    completionSteps.push({
      step: 'familiarity_gain',
      detail: `Fixed familiarity gain: 10`,
      value: 10,
    })
    completionSteps.push({
      step: 'mastery_gain',
      detail: `Fixed mastery gain: 5`,
      value: 5,
    })

    // Generate expedition log
    const log = generateExpeditionLog(
      mapSupabaseExpeditionToExpedition(expedition),
      heroList,
      zoneData as any,
      subzoneData as any
    )

    // Build hero updates debug info
    const heroUpdatesDebug: ExpeditionDebugLog['completion']['heroUpdates'] = []

    // Update heroes (add XP, restore to idle)
    const updatedHeroes: Hero[] = []
    for (const hero of heroList) {
      const newXp = hero.xp + xp
      const newLevel = Math.floor(newXp / 100) + 1 // Simple leveling formula
      const leveledUp = newLevel > hero.level

      // Calculate new morale
      const newMorale = applyMoraleChange(hero.moraleValue, MORALE_PENALTIES.expeditionComplete)

      heroUpdatesDebug.push({
        heroId: hero.id,
        heroName: hero.name,
        previousXp: hero.xp,
        xpGained: xp,
        newXp,
        previousLevel: hero.level,
        newLevel: Math.min(newLevel, 50),
        leveledUp,
        previousMorale: hero.moraleValue,
        moraleChange: MORALE_PENALTIES.expeditionComplete,
        newMorale: newMorale.moraleValue,
        newMoraleState: newMorale.morale,
      })

      completionSteps.push({
        step: 'hero_update',
        detail: `${hero.name}: XP ${hero.xp} + ${xp} = ${newXp}, level ${hero.level} → ${Math.min(newLevel, 50)}${leveledUp ? ' (LEVEL UP!)' : ''}, morale ${hero.moraleValue} + (${MORALE_PENALTIES.expeditionComplete}) = ${newMorale.moraleValue} (${newMorale.morale})`,
        value: hero.id,
      })

      const { data: updatedHero, error: updateHeroError } = await supabase
        .from('heroes')
        .update({
          xp: newXp,
          level: Math.min(newLevel, 50), // Cap at level 50
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

    // Build the completion debug log
    const existingDebugLog = (expedition as any).debug_log as ExpeditionDebugLog | null
    const completionDebugLog: ExpeditionDebugLog['completion'] = {
      efficiencyUsed: efficiency,
      efficiencySource,
      rewards: {
        heroCount: heroList.length,
        baseGold,
        baseXp,
        goldAfterEfficiency: gold,
        xpAfterEfficiency: xp,
        familiarityGain: 10,
        masteryGain: 5,
      },
      heroUpdates: heroUpdatesDebug,
      goldUpdate: {
        amount: gold,
        playerId,
      },
      steps: completionSteps,
    }

    // Merge with existing debug log from start phase
    const fullDebugLog: ExpeditionDebugLog = {
      generatedAt: existingDebugLog?.generatedAt ?? now.toISOString(),
      start: existingDebugLog?.start ?? {
        heroPowerBreakdowns: [],
        teamPower: 0,
        requiredPower: 0,
        powerRatio: 0,
        baseEfficiency: 0,
        threats: [],
        finalEfficiency: 0,
        duration: { baseDuration: 0, zoneId: '', subzoneId: '', difficulty: '' },
        steps: [{ step: 'missing', detail: 'Start debug log was not captured (expedition started before logging was added)' }],
      },
      completion: completionDebugLog,
    }

    // Update expedition
    const { error: updateExpeditionError } = await supabase
      .from('expeditions')
      .update({
        is_completed: true,
        efficiency,
        rewards,
        log,
        debug_log: fullDebugLog,
        updated_at: now.toISOString()
      })
      .eq('id', expeditionId)

    if (updateExpeditionError) throw updateExpeditionError

    // Update player gold (atomic increment to avoid race conditions)
    const { error: goldUpdateError } = await supabase.rpc('increment_player_gold', {
      player_id: playerId,
      amount: gold
    })

    if (goldUpdateError) {
      console.error('Failed to update player gold:', goldUpdateError)
      // Don't fail the expedition completion, just log the error
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
      expedition: mapSupabaseExpeditionToExpedition(completedExpedition),
      log,
      rewards,
      heroesUpdated: updatedHeroes,
      equipmentDropped: [] as Equipment[],
      zoneProgress: {
        familiarity: rewards.familiarityGain,
        mastery: rewards.masteryGain
      }
    }
  } catch (err: unknown) {
    const error = toError(err)
    if (error.statusCode) throw err

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to complete expedition',
      data: { error: error.message }
    })
  }
})
