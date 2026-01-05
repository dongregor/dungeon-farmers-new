import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

interface GuildStatus {
  hasGuild: boolean
  guildName: string | null
}

export default defineEventHandler(async (event): Promise<GuildStatus> => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // User ID is in 'sub' field from JWT, or 'id' from user object
  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Get the player record with guild data
  const { data: player, error } = await client
    .from('players')
    .select('id, guild_name')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to check guild status' })
  }

  // No player or no guild_name means no guild
  if (!player || !player.guild_name) {
    return {
      hasGuild: false,
      guildName: null,
    }
  }

  return {
    hasGuild: true,
    guildName: player.guild_name,
  }
})
