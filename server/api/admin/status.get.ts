import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/**
 * GET /api/admin/status
 * Check if the current user has admin access.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    return { isAdmin: false }
  }

  const authUserId = user.id || (user as any).sub
  if (!authUserId) {
    return { isAdmin: false }
  }

  const supabase = await serverSupabaseClient(event)

  const { data: player } = await supabase
    .from('players')
    .select('is_admin')
    .eq('auth_user_id', authUserId)
    .single()

  return { isAdmin: player?.is_admin === true }
})
