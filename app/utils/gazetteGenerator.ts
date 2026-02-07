import type {
  GazetteIssue,
  GazetteArticle,
  GazetteClassified,
  GazetteStats,
  GazetteDayData,
  GazetteHeroSummary,
  GazetteExpeditionSummary,
  GazetteArticleRarity,
} from '~~/types'
import { getStoryTraitById } from '~/data/storyTraits'
import {
  HEADLINE_TEMPLATES,
  DISPATCH_TEMPLATES,
  DISPATCH_NOTABLE_FALLBACKS,
  SPOTLIGHT_INTROS,
  SPOTLIGHT_TRAIT_COMMENTARY,
  SPOTLIGHT_GENERIC_COMMENTARY,
  SPOTLIGHT_STATS_LINE,
  GOSSIP_HERO_DRAMA,
  GOSSIP_DRAMA_TOPICS,
  GOSSIP_ZONE_RUMORS,
  GOSSIP_META,
  CLASSIFIEDS_STATIC,
  CLASSIFIEDS_DYNAMIC,
  LETTERS_HATED_ZONE,
  LETTERS_OVERWORKED,
  LETTERS_BENCHED,
  STATS_MVP_REASONS,
  STATS_FUN_STATS,
  FORECAST_TEMPLATES,
} from '~/data/gazetteTemplates'

// ========================================
// HELPERS
// ========================================

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{${key}}`).join(String(value))
  }
  return result
}

function makeId(): string {
  return `gazette-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function makeArticle(
  type: GazetteArticle['type'],
  title: string,
  body: string,
  heroIds: string[] = [],
  rarity: GazetteArticleRarity = 'common',
  expeditionId?: string,
): GazetteArticle {
  return { id: makeId(), type, title, body, heroIds, rarity, expeditionId }
}

// Get trait-flavored quote for a hero
function getTraitQuote(hero: GazetteHeroSummary): string {
  for (const traitId of hero.storyTraitIds) {
    const trait = getStoryTraitById(traitId)
    if (trait?.reactions?.onEvent && trait.reactions.onEvent.length > 0) {
      return randomElement(trait.reactions.onEvent).split('{hero}').join(hero.name)
    }
  }
  return `${hero.name} described the experience as "fine."`
}

// Find a trait-based drama topic for a hero
function getDramaTopic(hero: GazetteHeroSummary): string | null {
  for (const traitId of hero.storyTraitIds) {
    const topics = GOSSIP_DRAMA_TOPICS[traitId]
    if (topics && topics.length > 0) {
      return randomElement(topics)
    }
  }
  return null
}

// ========================================
// SECTION GENERATORS
// ========================================

function generateHeadline(data: GazetteDayData): GazetteArticle {
  const vars: Record<string, string | number> = {
    guildName: data.guildName,
  }

  // Priority: prestige > legendary loot > epic loot > retirement > rare recruit > big gold day > multi expedition > level up > fallback

  if (data.prestiges.length > 0) {
    const p = data.prestiges[0]
    vars.heroName = p.heroName
    vars.prestigeLevel = p.prestigeLevel
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.prestige), vars)
    return makeArticle('headline', 'PRESTIGE ACHIEVEMENT', body, [p.heroId], 'epic')
  }

  const legendaryDrops = data.rareDrops.filter(d => d.rarity === 'legendary')
  if (legendaryDrops.length > 0) {
    const d = legendaryDrops[0]
    vars.heroName = d.heroName
    vars.itemName = d.itemName
    vars.zoneName = data.expeditions[0]?.zoneName ?? 'parts unknown'
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.legendary_loot), vars)
    return makeArticle('headline', 'LEGENDARY DROP', body, [d.heroId], 'epic')
  }

  const epicDrops = data.rareDrops.filter(d => d.rarity === 'epic')
  if (epicDrops.length > 0) {
    const d = epicDrops[0]
    vars.heroName = d.heroName
    vars.itemName = d.itemName
    vars.zoneName = data.expeditions[0]?.zoneName ?? 'parts unknown'
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.epic_loot), vars)
    return makeArticle('headline', 'EPIC LOOT', body, [d.heroId], 'memorable')
  }

  if (data.retirements.length > 0) {
    const r = data.retirements[0]
    vars.heroName = r.heroName
    vars.level = r.level
    vars.expeditionCount = r.expeditionCount
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.retirement), vars)
    return makeArticle('headline', 'RETIREMENT', body, [r.heroId], 'memorable')
  }

  const rareRecruits = data.newRecruits.filter(r => r.rarity === 'legendary' || r.rarity === 'epic' || r.rarity === 'rare')
  if (rareRecruits.length > 0) {
    const r = rareRecruits[0]
    vars.heroName = r.heroName
    vars.rarity = r.rarity
    vars.archetype = r.archetype
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.new_recruit_rare), vars)
    return makeArticle('headline', 'NEW RECRUIT', body, [r.heroId], 'noteworthy')
  }

  if (data.totalGold >= 1000 && data.expeditions.length >= 3) {
    vars.goldAmount = data.totalGold.toLocaleString()
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.big_gold_day), vars)
    return makeArticle('headline', 'GOLD RUSH', body, [], 'noteworthy')
  }

  if (data.expeditions.length >= 5) {
    vars.expeditionCount = data.expeditions.length
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.multi_expedition), vars)
    return makeArticle('headline', 'BUSY DAY', body, [], 'noteworthy')
  }

  if (data.levelUps.length > 0) {
    const lu = data.levelUps[0]
    vars.heroName = lu.heroName
    vars.level = lu.newLevel
    const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.level_up), vars)
    return makeArticle('headline', 'LEVEL UP', body, [lu.heroId], 'common')
  }

  // Fallback: slow news day
  const body = fillTemplate(randomElement(HEADLINE_TEMPLATES.fallback), vars)
  return makeArticle('headline', 'SLOW NEWS DAY', body, [], 'common')
}

function generateDispatches(data: GazetteDayData): GazetteArticle[] {
  if (data.expeditions.length === 0) return []

  // Take up to 3 most interesting expeditions (by rare items, then efficiency)
  const sorted = [...data.expeditions].sort((a, b) => {
    if (b.rareItems.length !== a.rareItems.length) return b.rareItems.length - a.rareItems.length
    return b.efficiency - a.efficiency
  })

  const top = sorted.slice(0, 3)

  return top.map(exp => {
    const notableEntry = exp.notableLogEntries.length > 0
      ? randomElement(exp.notableLogEntries)
      : randomElement(DISPATCH_NOTABLE_FALLBACKS)

    // Find the leader hero for trait quote
    const leaderHero = data.heroes.find(h => h.name === exp.leaderName)
    const traitQuote = leaderHero ? getTraitQuote(leaderHero) : ''

    const template = randomElement(DISPATCH_TEMPLATES)
    const body = fillTemplate(template, {
      leaderName: exp.leaderName,
      zoneName: exp.zoneName,
      subzoneName: exp.subzoneName,
      efficiency: Math.round(exp.efficiency),
      heroNames: exp.heroNames.join(', '),
      partySize: exp.heroNames.length,
      goldEarned: exp.goldEarned.toLocaleString(),
      xpEarned: exp.xpEarned.toLocaleString(),
      duration: `${exp.durationMinutes}min`,
      itemCount: exp.itemsFound,
      notableEntry,
      traitQuote,
    })

    const rarity: GazetteArticleRarity = exp.rareItems.length > 0 ? 'noteworthy' : 'common'
    return makeArticle('dispatch', `DISPATCH: ${exp.zoneName}`, body, [], rarity, exp.id)
  })
}

function generateHeroSpotlight(data: GazetteDayData): GazetteArticle | null {
  if (data.heroes.length === 0) return null

  // Pick a hero: prefer one who had activity, has interesting traits
  const activeHeroes = data.heroes.filter(h => h.expeditionCount > 0)
  const pool = activeHeroes.length > 0 ? activeHeroes : data.heroes

  // Score heroes by interestingness
  const scored = pool.map(hero => {
    let score = hero.expeditionCount * 2 + hero.storyTraitIds.length * 3
    // Bonus for heroes with spotlight-specific commentary
    for (const traitId of hero.storyTraitIds) {
      if (SPOTLIGHT_TRAIT_COMMENTARY[traitId]) score += 5
    }
    return { hero, score }
  })

  scored.sort((a, b) => b.score - a.score)
  // Pick from top 3 randomly for variety
  const topHeroes = scored.slice(0, 3)
  const { hero } = randomElement(topHeroes)

  // Build intro
  const introVars: Record<string, string | number> = {
    heroName: hero.name,
    archetype: hero.archetype,
    rarity: hero.rarity,
    level: hero.level,
    expeditionCount: hero.expeditionCount,
    goldEarned: hero.goldEarned.toLocaleString(),
    traitQuote: getTraitQuote(hero).toLowerCase(),
  }
  const intro = fillTemplate(randomElement(SPOTLIGHT_INTROS), introVars)

  // Build trait commentary
  let commentary = ''
  for (const traitId of hero.storyTraitIds) {
    const templates = SPOTLIGHT_TRAIT_COMMENTARY[traitId]
    if (templates) {
      commentary = fillTemplate(randomElement(templates), { heroName: hero.name })
      break
    }
  }
  if (!commentary) {
    commentary = fillTemplate(randomElement(SPOTLIGHT_GENERIC_COMMENTARY), { heroName: hero.name })
  }

  // Stats line
  const statsLine = fillTemplate(SPOTLIGHT_STATS_LINE, {
    goldEarned: hero.goldEarned.toLocaleString(),
    expeditionCount: hero.expeditionCount,
  })

  const body = `${intro}\n\n${commentary}\n\n${statsLine}`
  const rarity: GazetteArticleRarity = hero.storyTraitIds.length >= 3 ? 'memorable' : 'noteworthy'

  return makeArticle('spotlight', `HERO OF THE DAY: ${hero.name}`, body, [hero.id], rarity)
}

function generateGossip(data: GazetteDayData): GazetteArticle[] {
  const articles: GazetteArticle[] = []
  const usedHeroIds = new Set<string>()

  // 1. Try hero drama (if 2+ heroes)
  if (data.heroes.length >= 2) {
    const heroesWithTraits = data.heroes.filter(h => h.storyTraitIds.length > 0)
    if (heroesWithTraits.length >= 2) {
      const shuffled = [...heroesWithTraits].sort(() => Math.random() - 0.5)
      const hero1 = shuffled[0]
      const hero2 = shuffled[1]
      const topic = getDramaTopic(hero1) ?? getDramaTopic(hero2) ?? 'guild bathroom scheduling'

      const body = fillTemplate(randomElement(GOSSIP_HERO_DRAMA), {
        hero1: hero1.name,
        hero2: hero2.name,
        topic,
      })

      articles.push(makeArticle('gossip', 'GUILD DRAMA', body, [hero1.id, hero2.id], 'noteworthy'))
      usedHeroIds.add(hero1.id)
      usedHeroIds.add(hero2.id)
    }
  }

  // 2. Zone rumor (if expeditions happened)
  if (data.expeditions.length > 0) {
    const exp = randomElement(data.expeditions)
    const body = fillTemplate(randomElement(GOSSIP_ZONE_RUMORS), {
      zoneName: exp.zoneName,
      monsterType: 'creature',
    })
    articles.push(makeArticle('gossip', 'ZONE REPORT', body, [], 'common'))
  }

  // 3. Meta-gaming gossip (always available)
  if (articles.length < 3) {
    const body = randomElement(GOSSIP_META)
    articles.push(makeArticle('gossip', 'OVERHEARD', body, [], 'common'))
  }

  return articles.slice(0, 3)
}

function generateClassifieds(data: GazetteDayData): GazetteClassified[] {
  const classifieds: GazetteClassified[] = []

  // 1 static classified
  let staticText = randomElement(CLASSIFIEDS_STATIC)
  if (staticText.includes('{heroName}') && data.heroes.length > 0) {
    staticText = fillTemplate(staticText, { heroName: randomElement(data.heroes).name })
  }
  classifieds.push({ id: makeId(), text: staticText })

  // 1 dynamic classified if possible
  if (data.heroes.length > 0) {
    const hero = randomElement(data.heroes)
    const zone = data.expeditions.length > 0 ? randomElement(data.expeditions) : null
    const template = randomElement(CLASSIFIEDS_DYNAMIC)
    const text = fillTemplate(template, {
      heroName: hero.name,
      zoneName: zone?.zoneName ?? 'the nearest dungeon',
      level: hero.level,
      archetype: hero.archetype,
      itemName: 'mysterious artifact',
    })
    classifieds.push({ id: makeId(), text })
  }

  return classifieds
}

function generateStats(data: GazetteDayData): GazetteStats {
  // Determine MVP
  let mvp: GazetteStats['mvp'] = null
  if (data.heroes.length > 0) {
    const activeHeroes = data.heroes.filter(h => h.expeditionCount > 0)
    if (activeHeroes.length > 0) {
      const sorted = [...activeHeroes].sort((a, b) => b.goldEarned - a.goldEarned)
      const topHero = sorted[0]
      mvp = {
        heroId: topHero.id,
        heroName: topHero.name,
        reason: randomElement(STATS_MVP_REASONS),
      }
    }
  }

  // Generate fun stat
  let funStat = randomElement(STATS_FUN_STATS)
  const funHero = data.heroes.length > 0 ? randomElement(data.heroes) : null
  funStat = fillTemplate(funStat, {
    heroName: funHero?.name ?? 'someone',
    count: Math.floor(Math.random() * 20) + 3,
    edibleCount: Math.floor(Math.random() * 3) + 1,
  })

  return {
    expeditionsCompleted: data.expeditions.length,
    goldEarned: data.totalGold,
    heroesLeveledUp: data.levelUps.length,
    itemsFound: data.expeditions.reduce((sum, e) => sum + e.itemsFound, 0),
    rareItemsFound: data.rareDrops.length,
    monstersDefeated: data.totalMonstersDefeated,
    mvp,
    funStat,
  }
}

function generateLetters(data: GazetteDayData): GazetteArticle[] {
  const letters: GazetteArticle[] = []

  // Check for overworked heroes (3+ expeditions)
  const overworked = data.heroes.filter(h => h.expeditionCount >= 3)
  if (overworked.length > 0) {
    const hero = randomElement(overworked)
    const body = fillTemplate(randomElement(LETTERS_OVERWORKED), {
      heroName: hero.name,
      expeditionCount: hero.expeditionCount,
    })
    letters.push(makeArticle('letter', 'LETTER TO THE EDITOR', body, [hero.id], 'noteworthy'))
  }

  // Check for heroes with zone-hated traits sent to those zones
  for (const exp of data.expeditions) {
    if (letters.length >= 2) break
    for (const hero of data.heroes) {
      if (letters.length >= 2) break
      if (!exp.heroNames.includes(hero.name)) continue

      for (const traitId of hero.storyTraitIds) {
        const traitLetters = LETTERS_HATED_ZONE[traitId]
        if (!traitLetters) continue

        // Check if zone type matches the phobia
        const isHatedZone =
          (traitId === 'bug_phobia' && (exp.zoneType === 'cave' || exp.zoneType === 'swamp')) ||
          (traitId === 'afraid_of_heights' && exp.zoneType === 'mountain') ||
          (traitId === 'claustrophobic' && exp.zoneType === 'cave')

        if (isHatedZone) {
          const body = fillTemplate(randomElement(traitLetters), {
            heroName: hero.name,
            zoneName: exp.zoneName,
            zoneType: exp.zoneType,
          })
          letters.push(makeArticle('letter', 'LETTER TO THE EDITOR', body, [hero.id], 'memorable'))
          break
        }
      }
    }
  }

  // Check for benched heroes (0 expeditions, not stationed)
  if (letters.length < 2) {
    const benched = data.heroes.filter(h => h.expeditionCount === 0 && !h.isOnExpedition && !h.isStationed)
    if (benched.length > 0) {
      const hero = randomElement(benched)
      const body = fillTemplate(randomElement(LETTERS_BENCHED), {
        heroName: hero.name,
        dayCount: Math.floor(Math.random() * 5) + 2,
      })
      letters.push(makeArticle('letter', 'LETTER TO THE EDITOR', body, [hero.id], 'noteworthy'))
    }
  }

  return letters.slice(0, 2)
}

function generateForecast(data: GazetteDayData): string | null {
  if (data.expeditions.length === 0) return null

  const zones = [...new Set(data.expeditions.map(e => e.zoneName))]
  if (zones.length === 0) return null

  const vars: Record<string, string> = {
    zoneName: zones[0],
    otherZone: zones.length > 1 ? zones[1] : 'neighboring zones',
  }

  return fillTemplate(randomElement(FORECAST_TEMPLATES), vars)
}

// ========================================
// MAIN GENERATOR
// ========================================

let issueCounter = 0

export function generateGazetteIssue(data: GazetteDayData): GazetteIssue {
  issueCounter++

  const headline = generateHeadline(data)
  const dispatches = generateDispatches(data)
  const heroSpotlight = generateHeroSpotlight(data)
  const gossip = generateGossip(data)
  const classifieds = generateClassifieds(data)
  const stats = generateStats(data)
  const letters = generateLetters(data)
  const forecast = generateForecast(data)

  return {
    id: makeId(),
    guildId: data.guildId,
    guildName: data.guildName,
    issueNumber: issueCounter,
    publishedAt: new Date().toISOString(),
    coveringDate: data.date,
    headline,
    dispatches,
    heroSpotlight,
    gossip,
    classifieds,
    stats,
    letters,
    forecast,
  }
}

// Generate a special inaugural issue for new guilds
export function generateInauguralIssue(guildId: string, guildName: string, heroes: GazetteHeroSummary[]): GazetteIssue {
  issueCounter++

  const headline = makeArticle(
    'headline',
    'INAUGURAL ISSUE',
    fillTemplate(randomElement(HEADLINE_TEMPLATES.inaugural), { guildName }),
    [],
    'memorable',
  )

  const heroSpotlight = heroes.length > 0
    ? makeArticle(
        'spotlight',
        `MEET THE GUILD: ${heroes[0].name}`,
        `${guildName} opens its doors with a fresh roster of adventurers. Leading the charge is ${heroes[0].name}, a level ${heroes[0].level} ${heroes[0].rarity} ${heroes[0].archetype}. The road ahead is long, but every legendary guild started somewhere. Usually here, at level 1, with no gold and questionable life choices.`,
        [heroes[0].id],
        'noteworthy',
      )
    : null

  const gossip = [
    makeArticle('gossip', 'NEW GUILD IN TOWN', `Word on the street: ${guildName} has officially registered as an adventuring guild. Rival guilds described as "not worried." We'll see about that.`, [], 'common'),
    makeArticle('gossip', 'OVERHEARD', 'Local merchants excited about new guild: "Fresh adventurers means fresh gold. They always overpay for potions in the first week."', [], 'common'),
  ]

  const classifieds: GazetteClassified[] = [
    { id: makeId(), text: `WANTED: Brave heroes to join ${guildName}. No experience required. Dental not included. Apply at the tavern.` },
    { id: makeId(), text: 'FOR SALE: "Guild Management for Dummies." Slightly used. Previous owner\'s guild dissolved. Unrelated.' },
  ]

  const stats: GazetteStats = {
    expeditionsCompleted: 0,
    goldEarned: 0,
    heroesLeveledUp: 0,
    itemsFound: 0,
    rareItemsFound: 0,
    monstersDefeated: 0,
    mvp: null,
    funStat: 'Days since guild founding: 0. Days since last incident: also 0. Promising start.',
  }

  return {
    id: makeId(),
    guildId,
    guildName,
    issueNumber: issueCounter,
    publishedAt: new Date().toISOString(),
    coveringDate: new Date().toISOString().split('T')[0],
    headline,
    dispatches: [],
    heroSpotlight,
    gossip,
    classifieds,
    stats,
    letters: [],
    forecast: 'Clear skies and opportunity ahead. The perfect day to start an adventuring career. Or a terrible one. Only time will tell.',
  }
}
