import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'

/**
 * Verify that the current request is from an admin user.
 * Returns the player record if admin, throws 403 otherwise.
 */
export async function requireAdmin(event: H3Event) {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const authUserId = user.id || (user as any).sub
  if (!authUserId) {
    throw createError({ statusCode: 401, statusMessage: 'User ID not found' })
  }

  const supabase = await serverSupabaseClient(event)

  const { data: player, error } = await supabase
    .from('players')
    .select('id, is_admin')
    .eq('auth_user_id', authUserId)
    .single()

  if (error || !player) {
    throw createError({ statusCode: 404, statusMessage: 'Player not found' })
  }

  if (!player.is_admin) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  return { player, supabase, authUserId }
}
