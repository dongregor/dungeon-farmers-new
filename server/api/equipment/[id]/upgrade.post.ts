import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Equipment, TraitQuality } from '~~/types'

interface UpgradeRequest {
  traitIndex: number
  goldCost: number
}

interface UpgradeResponse {
  equipment: Equipment
  goldSpent: number
}

const QUALITY_PROGRESSION: Record<TraitQuality, TraitQuality | null> = {
  normal: 'magic',
  magic: 'perfect',
  perfect: null, // Already max quality
}

export default defineEventHandler(async (event): Promise<UpgradeResponse> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const equipmentId = getRouterParam(event, 'id')
  const body = await readBody<UpgradeRequest>(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!equipmentId) {
    throw createError({ statusCode: 400, message: 'Equipment ID required' })
  }

  if (body.traitIndex === undefined || body.goldCost === undefined) {
    throw createError({ statusCode: 400, message: 'Trait index and gold cost required' })
  }

  if (body.goldCost <= 0) {
    throw createError({ statusCode: 400, message: 'Invalid gold cost' })
  }

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, gold')
    .eq('auth_user_id', user.id)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Check if player has enough gold
  if (player.gold < body.goldCost) {
    throw createError({
      statusCode: 400,
      message: 'Insufficient gold',
      data: { required: body.goldCost, available: player.gold }
    })
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

  // Validate trait index
  const traits = equipment.traits as Array<{ traitId: string; quality: TraitQuality; rolledValue: number }>
  if (body.traitIndex < 0 || body.traitIndex >= traits.length) {
    throw createError({
      statusCode: 400,
      message: `Invalid trait index: ${body.traitIndex}. Equipment has ${traits.length} traits.`
    })
  }

  const trait = traits[body.traitIndex]
  const currentQuality = trait.quality
  const nextQuality = QUALITY_PROGRESSION[currentQuality]

  // Check if trait is already max quality
  if (!nextQuality) {
    throw createError({
      statusCode: 400,
      message: `Trait is already at maximum quality (${currentQuality})`
    })
  }

  // Upgrade the trait
  const updatedTraits = [...traits]
  updatedTraits[body.traitIndex] = {
    ...trait,
    quality: nextQuality,
  }

  // Update equipment in database
  const { data: updatedEquipment, error: updateError } = await client
    .from('equipment')
    .update({
      traits: updatedTraits,
      updated_at: new Date().toISOString(),
    })
    .eq('id', equipmentId)
    .select()
    .single()

  if (updateError || !updatedEquipment) {
    console.error('Error updating equipment:', updateError)
    throw createError({ statusCode: 500, message: 'Failed to upgrade equipment' })
  }

  // Deduct gold from player
  const { error: goldError } = await client
    .from('players')
    .update({
      gold: player.gold - body.goldCost,
      updated_at: new Date().toISOString(),
    })
    .eq('id', player.id)

  if (goldError) {
    console.error('Error deducting gold:', goldError)
    // Note: Equipment was already upgraded. In production, this should use a transaction.
    throw createError({ statusCode: 500, message: 'Failed to deduct gold' })
  }

  return {
    equipment: updatedEquipment,
    goldSpent: body.goldCost,
  }
})
