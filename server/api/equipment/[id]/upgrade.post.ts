import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'
import type { Equipment, TraitQuality, EquipmentRarity } from '~~/types'

const upgradeSchema = z.object({
  traitIndex: z.number().int('Trait index must be an integer').min(0, 'Trait index must be non-negative')
})

type UpgradeRequest = z.infer<typeof upgradeSchema>

interface UpgradeResponse {
  equipment: Equipment
  goldSpent: number
}

const QUALITY_PROGRESSION: Record<TraitQuality, TraitQuality | null> = {
  normal: 'magic',
  magic: 'perfect',
  perfect: null, // Already max quality
}

// Base upgrade costs by quality level
const BASE_UPGRADE_COSTS: Record<TraitQuality, number> = {
  normal: 100,   // normal -> magic
  magic: 500,    // magic -> perfect
  perfect: 0,    // Cannot upgrade (already max)
}

// Rarity multipliers for upgrade costs
const RARITY_COST_MULTIPLIERS: Record<EquipmentRarity, number> = {
  common: 1.0,
  uncommon: 1.5,
  rare: 2.0,
  epic: 3.0,
  legendary: 4.0,
  mythic: 5.0,
}

/**
 * Calculate the gold cost to upgrade a trait on equipment
 * Cost scales with:
 * - Quality upgrade tier (normal->magic is cheaper than magic->perfect)
 * - Equipment rarity (mythic costs more than common)
 * - Item level (higher level = higher cost)
 */
function calculateUpgradeCost(
  currentQuality: TraitQuality,
  equipmentRarity: EquipmentRarity,
  itemLevel: number
): number {
  const baseCost = BASE_UPGRADE_COSTS[currentQuality]
  const rarityMultiplier = RARITY_COST_MULTIPLIERS[equipmentRarity]
  const levelMultiplier = 1 + (itemLevel / 100) // +1% per level

  return Math.floor(baseCost * rarityMultiplier * levelMultiplier)
}

export default defineEventHandler(async (event): Promise<UpgradeResponse> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const equipmentId = getRouterParam(event, 'id')

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!equipmentId) {
    throw createError({ statusCode: 400, message: 'Equipment ID required' })
  }

  // Validate request body with Zod
  const bodyData = await readBody(event)
  const parsed = upgradeSchema.safeParse(bodyData)

  if (!parsed.success) {
    // Sanitize validation errors for production
    const errorMessages = parsed.error.issues.map(issue => issue.message)
    throw createError({
      statusCode: 400,
      message: errorMessages.join(', ')
    })
  }

  const body = parsed.data

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id, gold')
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

  // Calculate upgrade cost server-side (NEVER trust client input for pricing)
  const upgradeCost = calculateUpgradeCost(
    currentQuality,
    equipment.rarity as EquipmentRarity,
    equipment.item_level
  )

  // Deduct gold FIRST using atomic conditional update
  // This prevents the player from upgrading if they don't have enough gold
  // and avoids the data inconsistency issue if equipment update succeeds but gold deduction fails
  const { data: updatedPlayer, error: goldError } = await client
    .from('players')
    .update({
      gold: player.gold - upgradeCost,
      updated_at: new Date().toISOString(),
    })
    .eq('id', player.id)
    .gte('gold', upgradeCost)  // Atomic check: only update if player has enough gold
    .select('gold')
    .single()

  if (goldError || !updatedPlayer) {
    throw createError({
      statusCode: 400,
      message: 'Insufficient gold',
      data: { required: upgradeCost, available: player.gold }
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
    // Rollback: refund the gold since equipment upgrade failed
    const { error: rollbackError } = await client
      .from('players')
      .update({ gold: player.gold })
      .eq('id', player.id)

    if (rollbackError) {
      console.error('CRITICAL: Failed to rollback gold after equipment upgrade failure', {
        playerId: player.id,
        goldToRefund: upgradeCost,
        rollbackError
      })
    }
    throw createError({ statusCode: 500, message: 'Failed to upgrade equipment' })
  }

  return {
    equipment: updatedEquipment,
    goldSpent: upgradeCost,
  }
})
