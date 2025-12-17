import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { TavernSlot, Hero, TavernHero } from '~~/types'
import { v4 as uuid } from 'uuid'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const body = await readBody<{ slotIndex: number }>(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { slotIndex } = body

  if (slotIndex === undefined || slotIndex < 0) {
    throw createError({ statusCode: 400, message: 'Valid slot index required' })
  }

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, gold')
    .eq('auth_user_id', user.id)
    .single()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get tavern state
  const { data: tavernState } = await client
    .from('tavern_state')
    .select('*')
    .eq('player_id', player.id)
    .single()

  if (!tavernState) {
    throw createError({ statusCode: 404, message: 'Tavern state not found' })
  }

  const slots = (tavernState.slots || []) as TavernSlot[]
  const slot = slots[slotIndex]

  if (!slot || !slot.hero) {
    throw createError({ statusCode: 404, message: 'No hero in this slot' })
  }

  const tavernHero = slot.hero as TavernHero
  const recruitCost = tavernHero.recruitCost

  // Early check for better UX (but still use atomic update for correctness)
  if (player.gold < recruitCost) {
    throw createError({
      statusCode: 400,
      message: `Not enough gold. Need ${recruitCost}, have ${player.gold}`,
    })
  }

  try {
    const now = new Date().toISOString()

    // Convert TavernHero to Hero
    const newHero = {
      id: uuid(),
      player_id: player.id,
      name: tavernHero.name,
      gender: tavernHero.gender,
      culture: tavernHero.culture,
      titles: tavernHero.titles,
      display_title: tavernHero.displayTitle,
      rarity: tavernHero.rarity,
      archetype: tavernHero.archetype,
      archetype_tags: tavernHero.archetypeTags,
      base_stats: tavernHero.baseStats,
      level: tavernHero.level,
      xp: tavernHero.xp,
      xp_to_next_level: tavernHero.xpToNextLevel,
      gameplay_traits: tavernHero.gameplayTraits,
      story_trait_ids: tavernHero.storyTraitIds,
      power: tavernHero.power,
      equipment: tavernHero.equipment,
      prestige_level: tavernHero.prestigeLevel,
      prestige_bonuses: tavernHero.prestigeBonuses,
      current_expedition_id: null,
      is_favorite: false,
      is_on_expedition: false,
      is_stationed: false,
      stationed_zone_id: null,
      morale: 'content',
      morale_value: 50,
      morale_last_update: now,
      created_at: now,
      updated_at: now,
    }

    // Insert hero into database
    const { data: createdHero, error: heroError } = await client
      .from('heroes')
      .insert(newHero)
      .select()
      .single()

    if (heroError) {
      console.error('Error creating hero:', heroError)
      throw createError({ statusCode: 500, message: 'Failed to create hero' })
    }

    // Atomic conditional gold deduction - prevents race conditions and negative balances
    // This will only succeed if player still has enough gold
    const { data: updatedPlayer, error: goldError } = await client
      .from('players')
      .update({ gold: player.gold - recruitCost })
      .eq('id', player.id)
      .gte('gold', recruitCost)  // Conditional: only update if gold >= cost
      .select('gold')
      .single()

    // Check if update succeeded (row was affected)
    if (goldError || !updatedPlayer) {
      console.error('Error deducting gold (insufficient funds or race condition):', goldError)
      // Rollback hero creation
      await client.from('heroes').delete().eq('id', newHero.id)
      throw createError({
        statusCode: 400,
        message: 'Insufficient gold (concurrent purchase may have occurred)',
      })
    }

    // Remove hero from tavern slot (with optimistic concurrency control)
    const updatedSlots = [...slots]
    updatedSlots[slotIndex] = {
      ...slot,
      hero: null,
      isLocked: false,
    }

    // Optimistic update - only succeeds if updated_at hasn't changed
    const { data: tavernUpdateResult, error: tavernError } = await client
      .from('tavern_state')
      .update({
        slots: updatedSlots,
        updated_at: now,
      })
      .eq('player_id', player.id)
      .eq('updated_at', tavernState.updated_at)  // Version check
      .select('updated_at')

    if (tavernError) {
      console.error('Error updating tavern state:', tavernError)
      // Rollback hero creation and gold deduction
      await client.from('heroes').delete().eq('id', newHero.id)
      await client.from('players').update({ gold: player.gold }).eq('id', player.id)
      throw createError({
        statusCode: 500,
        message: 'Failed to update tavern after recruitment'
      })
    }

    // Check if tavern update affected any rows (optimistic lock succeeded)
    if (!tavernUpdateResult || tavernUpdateResult.length === 0) {
      console.error('Tavern state conflict - concurrent modification detected')
      // Rollback hero creation and gold deduction
      await client.from('heroes').delete().eq('id', newHero.id)
      await client.from('players').update({ gold: player.gold }).eq('id', player.id)
      throw createError({
        statusCode: 409,
        message: 'Tavern state was modified by another request. Please try again.',
      })
    }

    return {
      success: true,
      hero: createdHero,
      remainingGold: updatedPlayer.gold,
    }
  } catch (error: any) {
    console.error('Recruit error:', error)
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to recruit hero',
    })
  }
})
