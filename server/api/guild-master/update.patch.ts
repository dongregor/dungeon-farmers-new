import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Guild, Tabard } from '~~/types'
import { z } from 'zod'

const tabardSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  pattern: z.enum(['solid', 'divided', 'quartered', 'striped', 'diagonal', 'bordered']),
  emblem: z.string(),
})

const updateSchema = z.object({
  name: z.string().min(2).max(30).optional(), // Guild name
  tabard: tabardSchema.optional(),
})

const defaultTabard: Tabard = {
  primaryColor: '#6366f1',
  secondaryColor: '#fbbf24',
  pattern: 'solid',
  emblem: 'sword',
}

export default defineEventHandler(async (event): Promise<Guild> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'User ID not found' })
  }

  // Parse and validate body
  const body = await readBody(event)
  const parseResult = updateSchema.safeParse(body)

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
      data: parseResult.error.flatten(),
    })
  }

  const { name, tabard } = parseResult.data

  // Build update object for players table (guild data)
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (name !== undefined) {
    updateData.guild_name = name
  }
  if (tabard !== undefined) {
    updateData.guild_tabard = tabard
  }

  if (Object.keys(updateData).length === 1) { // Only updated_at
    throw createError({ statusCode: 400, message: 'No update fields provided' })
  }

  // Update guild data on players table
  const { data: player, error: playerError } = await client
    .from('players')
    .update(updateData)
    .eq('auth_user_id', userId)
    .select('id, guild_name, guild_tabard, guild_level, created_at, updated_at')
    .single()

  if (playerError) {
    console.error('Failed to update guild:', playerError)
    throw createError({ statusCode: 500, message: 'Failed to update guild' })
  }

  if (!player || !player.guild_name) {
    throw createError({ statusCode: 404, message: 'Guild not found' })
  }

  // Transform to Guild type
  return {
    id: player.id,
    name: player.guild_name,
    tabard: player.guild_tabard || defaultTabard,
    level: player.guild_level || 1,
    createdAt: player.created_at,
    updatedAt: player.updated_at,
  }
})
