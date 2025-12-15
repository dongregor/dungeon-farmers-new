import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { calculateOfflineProgress, calculateHoursOffline, formatOfflineDuration } from '~/utils/offlineProgress'
import type { Hero, Expedition } from '~~/types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Get player
  const { data: player } = await client
    .from('players')
    .select('*, last_online_at')
    .eq('auth_user_id', user.id)
    .single()

  if (!player) {
    throw createError({ statusCode: 404, message: 'Player not found' })
  }

  const currentTime = new Date()
  const lastOnlineTime = player.last_online_at
    ? new Date(player.last_online_at)
    : currentTime

  // If player was just online, no sync needed
  const hoursOffline = calculateHoursOffline(lastOnlineTime, currentTime)
  if (hoursOffline < 0.1) { // Less than 6 minutes
    return {
      success: true,
      hoursOffline: 0,
      offlineDuration: 'just now',
      updates: {
        completedExpeditions: 0,
        heroesUpdated: 0,
        newExpeditions: 0,
        pendingLoot: 0,
      },
    }
  }

  try {
    // Get active expeditions
    const { data: activeExpeditions } = await client
      .from('expeditions')
      .select('*')
      .eq('player_id', player.id)
      .eq('status', 'in_progress')

    // Get heroes
    const { data: heroes } = await client
      .from('heroes')
      .select('*')
      .eq('player_id', player.id)

    // Get inventory info (simplified - would need actual inventory slots logic)
    const { data: equipment } = await client
      .from('equipment')
      .select('id')
      .eq('player_id', player.id)

    const inventorySlots = player.is_supporter ? 200 : 100
    const usedInventorySlots = equipment?.length || 0

    // Calculate offline progress
    const offlineResult = calculateOfflineProgress(
      currentTime,
      lastOnlineTime,
      (activeExpeditions as Expedition[]) || [],
      (heroes as Hero[]) || [],
      inventorySlots,
      usedInventorySlots
    )

    // Update completed expeditions in database
    for (const expedition of offlineResult.completedExpeditions) {
      await client
        .from('expeditions')
        .update({
          status: 'completed',
          updated_at: currentTime.toISOString(),
        })
        .eq('id', expedition.id)
    }

    // Update heroes with XP and morale
    for (const [heroId, updates] of offlineResult.heroUpdates.entries()) {
      await client
        .from('heroes')
        .update({
          ...updates,
          updated_at: currentTime.toISOString(),
        })
        .eq('id', heroId)
    }

    // Create new expeditions (auto-repeat)
    for (const newExpedition of offlineResult.newExpeditions) {
      await client
        .from('expeditions')
        .insert({
          id: newExpedition.id,
          player_id: player.id,
          zone_id: newExpedition.zoneId,
          subzone_id: newExpedition.subzoneId,
          hero_ids: newExpedition.heroIds,
          team_power: newExpedition.teamPower,
          status: newExpedition.status,
          started_at: newExpedition.startedAt,
          completes_at: newExpedition.completesAt,
          duration_minutes: newExpedition.durationMinutes,
          auto_repeat: newExpedition.autoRepeat,
          stop_conditions: newExpedition.stopConditions,
          events: newExpedition.events,
          pending_choices: newExpedition.pendingChoices,
          created_at: newExpedition.createdAt,
          updated_at: newExpedition.updatedAt,
        })
    }

    // Store pending loot
    for (const loot of offlineResult.pendingLoot) {
      await client
        .from('pending_loot')
        .insert({
          id: loot.id,
          player_id: player.id,
          expedition_id: loot.expeditionId,
          equipment: loot.equipment,
          materials: loot.materials,
          expires_at: loot.expiresAt,
          created_at: loot.createdAt,
        })
    }

    // Update player's last online time
    await client
      .from('players')
      .update({ last_online_at: currentTime.toISOString() })
      .eq('id', player.id)

    // Return summary
    return {
      success: true,
      hoursOffline,
      offlineDuration: formatOfflineDuration(hoursOffline),
      updates: {
        completedExpeditions: offlineResult.completedExpeditions.length,
        heroesUpdated: offlineResult.heroUpdates.size,
        newExpeditions: offlineResult.newExpeditions.length,
        pendingLoot: offlineResult.pendingLoot.length,
      },
      details: {
        completedExpeditionIds: offlineResult.completedExpeditions.map(e => e.id),
        moraleRecovery: Array.from(offlineResult.moraleRecovery.entries()).map(([heroId, recovery]) => ({
          heroId,
          ...recovery,
        })),
      },
    }
  } catch (error: any) {
    console.error('Offline sync error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to sync offline progress',
    })
  }
})
