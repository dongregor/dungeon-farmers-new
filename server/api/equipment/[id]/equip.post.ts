import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Equipment, Hero } from '~~/types'

interface EquipRequest {
  heroId: string
  slot: string
}

interface EquipResponse {
  equipment: Equipment
  hero: Hero
  unequipped?: Equipment
}

export default defineEventHandler(async (event): Promise<EquipResponse> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const equipmentId = getRouterParam(event, 'id')
  const body = await readBody<EquipRequest>(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!equipmentId) {
    throw createError({ statusCode: 400, message: 'Equipment ID required' })
  }

  if (!body.heroId || !body.slot) {
    throw createError({ statusCode: 400, message: 'Hero ID and slot required' })
  }

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Get equipment
  const { data: equipment, error: equipmentError } = await client
    .from('equipment')
    .select('*')
    .eq('id', equipmentId)
    .eq('player_id', player.id)
    .single()

  if (equipmentError || !equipment) {
    throw createError({ statusCode: 404, message: 'Equipment not found' })
  }

  // Validate slot matches equipment type
  if (equipment.slot !== body.slot) {
    throw createError({
      statusCode: 400,
      message: `Slot mismatch: equipment is for ${equipment.slot}, not ${body.slot}`
    })
  }

  // Get hero
  const { data: hero, error: heroError } = await client
    .from('heroes')
    .select('*')
    .eq('id', body.heroId)
    .eq('player_id', player.id)
    .single()

  if (heroError || !hero) {
    throw createError({ statusCode: 404, message: 'Hero not found' })
  }

  // Check if hero has equipment in this slot
  const currentEquipment = hero.equipment as Record<string, string> || {}
  const previousEquipmentId = currentEquipment[body.slot]
  let unequipped: Equipment | undefined

  // Unequip previous item if exists
  if (previousEquipmentId) {
    const { data: prevEquipment, error: prevError } = await client
      .from('equipment')
      .update({
        is_equipped: false,
        equipped_by: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', previousEquipmentId)
      .select()
      .single()

    if (!prevError && prevEquipment) {
      unequipped = prevEquipment
    }
  }

  // Equip new item
  const { data: equippedItem, error: equipError } = await client
    .from('equipment')
    .update({
      is_equipped: true,
      equipped_by: body.heroId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', equipmentId)
    .select()
    .single()

  if (equipError || !equippedItem) {
    console.error('Error equipping item:', equipError)
    throw createError({ statusCode: 500, message: 'Failed to equip item' })
  }

  // Update hero's equipment mapping
  const updatedEquipment = {
    ...currentEquipment,
    [body.slot]: equipmentId,
  }

  const { data: updatedHero, error: updateHeroError } = await client
    .from('heroes')
    .update({
      equipment: updatedEquipment,
      updated_at: new Date().toISOString(),
    })
    .eq('id', body.heroId)
    .select()
    .single()

  if (updateHeroError || !updatedHero) {
    console.error('Error updating hero:', updateHeroError)
    throw createError({ statusCode: 500, message: 'Failed to update hero' })
  }

  const response: EquipResponse = {
    equipment: equippedItem,
    hero: updatedHero,
  }

  if (unequipped) {
    response.unequipped = unequipped
  }

  return response
})
