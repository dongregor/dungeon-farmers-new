import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { prestigeHero } from '~/utils/prestigeService'
import type { Hero } from '~~/types'
import { MAX_HERO_LEVEL } from '~~/shared/constants/gameRules'
import { heroIdSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const heroIdParam = getRouterParam(event, 'id')

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const parseResult = heroIdSchema.safeParse(heroIdParam)
  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: parseResult.error.errors[0]?.message || 'Hero ID required'
    })
  }

  const heroId = parseResult.data

  // Get player
  const { data: player } = await client
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get hero
  const { data: hero, error: heroError } = await client
    .from('heroes')
    .select('*')
    .eq('id', heroId)
    .eq('player_id', player.id)
    .single()

  if (heroError || !hero) {
    throw createError({ statusCode: 404, message: 'Hero not found' })
  }

  // Check if hero can prestige
  if (hero.level < MAX_HERO_LEVEL) {
    throw createError({
      statusCode: 400,
      message: `Hero must be level ${MAX_HERO_LEVEL} to prestige`,
    })
  }

  // Check if hero is on expedition
  if (hero.is_on_expedition) {
    throw createError({
      statusCode: 400,
      message: 'Cannot prestige while on expedition',
    })
  }

  try {
    // Perform prestige using the service
    const result = prestigeHero(hero as Hero)

    // Update hero in database
    const { data: updatedHero, error: updateError } = await client
      .from('heroes')
      .update({
        level: result.hero.level,
        xp: result.hero.xp,
        xp_to_next_level: result.hero.xpToNextLevel,
        prestige_level: result.hero.prestigeLevel,
        prestige_bonuses: result.hero.prestigeBonuses,
        gameplay_traits: result.hero.gameplayTraits,
        equipment: result.hero.equipment,
        morale: result.hero.morale,
        morale_last_update: result.hero.moraleLastUpdate,
        power: result.hero.power,
        updated_at: new Date().toISOString(),
      })
      .eq('id', heroId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating hero after prestige:', updateError)
      throw createError({
        statusCode: 500,
        message: 'Failed to update hero after prestige',
      })
    }

    // Return the prestige result with updated hero
    return {
      success: true,
      hero: updatedHero,
      result: {
        statBonusGained: result.statBonusGained,
        upgradeTraitsCount: result.upgradeTraitsCount,
        gainedTraitSlot: result.gainedTraitSlot,
        newPrestigeLevel: result.newPrestigeLevel,
      },
    }
  } catch (err: unknown) {
    const error = toError(err)
    console.error('Prestige error:', error)
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to prestige hero',
    })
  }
})
