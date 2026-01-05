import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'
import type { Hero } from '~~/types'

// Schema for hero PATCH requests (database field names)
const heroPatchSchema = z.object({
  display_title: z.string().nullable().optional(),
  equipment: z.record(z.string(), z.string()).nullable().optional(),
  is_favorite: z.boolean().optional(),
  stationed_zone_id: z.string().nullable().optional(),
}).strict() // Reject unknown fields

type HeroPatchRequest = z.infer<typeof heroPatchSchema>

export default defineEventHandler(async (event): Promise<Hero> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const heroId = getRouterParam(event, 'id')

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  if (!heroId) {
    throw createError({ statusCode: 400, message: 'Hero ID required' })
  }

  // Validate request body
  const body = await readBody(event)
  const parseResult = heroPatchSchema.safeParse(body)

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: parseResult.error.errors[0]?.message || 'Invalid request data'
    })
  }

  const validatedBody = parseResult.data

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id')
    .eq('auth_user_id', userId)
    .single()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  // Verify hero belongs to player
  const { data: hero } = await client
    .from('heroes')
    .select('id')
    .eq('id', heroId)
    .eq('player_id', player.id)
    .single()

  if (!hero) {
    throw createError({ statusCode: 404, message: 'Hero not found' })
  }

  // Check if any fields were provided
  if (Object.keys(validatedBody).length === 0) {
    throw createError({ statusCode: 400, message: 'No fields to update' })
  }

  // Prepare updates from validated body
  const updates: Record<string, unknown> = { ...validatedBody }

  // Add updated_at timestamp
  updates.updated_at = new Date().toISOString()

  // Update hero
  const { data: updatedHero, error: updateError } = await client
    .from('heroes')
    .update(updates)
    .eq('id', heroId)
    .select()
    .single()

  if (updateError) {
    console.error('Error updating hero:', updateError)
    throw createError({ statusCode: 500, message: 'Failed to update hero' })
  }

  return updatedHero
})
