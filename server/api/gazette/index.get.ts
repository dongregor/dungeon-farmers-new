import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { mapSupabaseHeroToHero, mapSupabaseExpeditionToExpedition } from '~~/server/utils/mappers'
import { ZONES } from '~/data/zones'
import type { GazetteDayData, GazetteHeroSummary, GazetteExpeditionSummary } from '~~/types'

export default defineEventHandler(async (event) => {
  // Auth check
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = user.id || user.sub
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'User ID not found' })
  }

  const supabase = await serverSupabaseClient(event)

  // Get player + guild name
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, guild_name')
    .eq('auth_user_id', userId)
    .single()

  if (playerError || !player) {
    throw createError({ statusCode: 404, statusMessage: 'Player not found' })
  }

  const playerId = player.id
  const guildName = player.guild_name || 'Unnamed Guild'

  try {
    // Get all heroes for this player
    const { data: heroRows, error: heroesError } = await supabase
      .from('heroes')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })

    if (heroesError) throw heroesError
    const heroes = (heroRows || []).map(mapSupabaseHeroToHero)

    // Get completed expeditions from the last 24 hours
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)

    const { data: expeditionRows, error: expError } = await supabase
      .from('expeditions')
      .select('*')
      .eq('player_id', playerId)
      .eq('is_completed', true)
      .gte('updated_at', yesterday.toISOString())
      .order('updated_at', { ascending: false })

    if (expError) throw expError
    const expeditions = (expeditionRows || []).map(mapSupabaseExpeditionToExpedition)

    // Build zone lookup from static data
    const zoneMap = new Map<string, { name: string; type: string; subzones: any[] }>()
    for (const z of ZONES) {
      zoneMap.set(z.id, { name: z.name, type: z.type, subzones: z.subzones || [] })
    }

    // Build hero summaries
    const heroSummaries: GazetteHeroSummary[] = heroes.map(hero => {
      const heroExps = expeditions.filter(e => e.heroIds.includes(hero.id))
      const goldEarned = heroExps.reduce((sum, e) => sum + (e.rewards?.gold ?? 0), 0)

      return {
        id: hero.id,
        name: hero.name,
        archetype: hero.archetype,
        rarity: hero.rarity,
        level: hero.level,
        storyTraitIds: hero.storyTraitIds,
        expeditionCount: heroExps.length,
        goldEarned,
        isOnExpedition: hero.isOnExpedition,
        isStationed: hero.isStationed,
      }
    })

    // Build expedition summaries
    const expeditionSummaries: GazetteExpeditionSummary[] = expeditions.map(exp => {
      const zone = zoneMap.get(exp.zoneId)
      const subzone = zone?.subzones.find((s: any) => s.id === exp.subzoneId)
      const expHeroes = heroes.filter(h => exp.heroIds.includes(h.id))

      // Extract notable log entries (memorable+)
      const notableEntries: string[] = []
      if (exp.log?.sections) {
        for (const section of exp.log.sections) {
          for (const entry of section.entries) {
            if (entry.rarity === 'memorable' || entry.rarity === 'epic' || entry.rarity === 'legendary') {
              notableEntries.push(entry.text)
            }
          }
        }
      }

      // Collect all hero trait IDs for this expedition
      const heroTraitIds: string[] = []
      for (const h of expHeroes) {
        heroTraitIds.push(...h.storyTraitIds)
      }

      return {
        id: exp.id,
        zoneName: zone?.name ?? 'Unknown Zone',
        zoneType: zone?.type ?? 'forest',
        subzoneName: subzone?.name ?? 'Unknown Area',
        leaderName: expHeroes[0]?.name ?? 'Unknown',
        heroNames: expHeroes.map(h => h.name),
        heroTraitIds,
        efficiency: exp.efficiency ?? 100,
        goldEarned: exp.rewards?.gold ?? 0,
        xpEarned: exp.rewards?.xp ?? 0,
        itemsFound: exp.rewards?.equipment.length ?? 0,
        rareItems: exp.rewards?.equipment.slice(0, 3) ?? [],
        durationMinutes: exp.durationMinutes,
        notableLogEntries: notableEntries,
      }
    })

    // Detect level ups, rare drops, prestiges, etc.
    // For MVP, we approximate from current state + expedition data
    const levelUps = heroes
      .filter(h => {
        const heroExps = expeditions.filter(e => e.heroIds.includes(h.id))
        return heroExps.length > 0 && h.level > 1
      })
      .slice(0, 5)
      .map(h => ({ heroId: h.id, heroName: h.name, newLevel: h.level }))

    const rareDrops = expeditions
      .filter(e => e.rewards && e.rewards.equipment.length > 0)
      .slice(0, 3)
      .map(e => {
        const heroName = heroes.find(h => e.heroIds.includes(h.id))?.name ?? 'Unknown'
        return {
          heroId: e.heroIds[0] ?? '',
          heroName,
          itemName: 'Equipment',
          rarity: 'rare',
        }
      })

    const totalGold = expeditions.reduce((sum, e) => sum + (e.rewards?.gold ?? 0), 0)
    const totalMonstersDefeated = expeditions.length * 3 // Estimate

    const dayData: GazetteDayData = {
      guildId: playerId,
      guildName,
      date: new Date().toISOString().split('T')[0],
      heroes: heroSummaries,
      expeditions: expeditionSummaries,
      levelUps,
      rareDrops,
      prestiges: [],
      newRecruits: [],
      retirements: [],
      totalGold,
      totalMonstersDefeated,
    }

    return { dayData }
  } catch (err: unknown) {
    const error = toError(err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate gazette data',
      data: { error: error.message },
    })
  }
})
