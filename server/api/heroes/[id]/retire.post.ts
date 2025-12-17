import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const heroId = getRouterParam(event, 'id')

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  if (!heroId) {
    throw createError({ statusCode: 400, message: 'Hero ID required' })
  }

  // Get player
  const { data: player, error: playerError } = await client
    .from('players')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (playerError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch player' })
  }

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

  // Check if hero is on expedition
  if (hero.is_on_expedition) {
    throw createError({
      statusCode: 400,
      message: 'Cannot retire hero while on expedition',
    })
  }

  // Check if hero is stationed
  if (hero.is_stationed) {
    throw createError({
      statusCode: 400,
      message: 'Cannot retire hero while stationed. Unassign them first.',
    })
  }

  // Delete hero from database
  const { error: deleteError } = await client
    .from('heroes')
    .delete()
    .eq('id', heroId)

  if (deleteError) {
    console.error('Error retiring hero:', deleteError)
    throw createError({
      statusCode: 500,
      message: 'Failed to retire hero',
    })
  }
  return {
    success: true,
    message: `${hero.name} has been retired`,
  }
})
