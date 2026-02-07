// Guild Gazette types - "The Daily Grind"

export type GazetteArticleType = 'headline' | 'dispatch' | 'spotlight' | 'gossip' | 'letter'

export type GazetteArticleRarity = 'common' | 'noteworthy' | 'memorable' | 'epic'

export interface GazetteArticle {
  id: string
  type: GazetteArticleType
  title: string
  body: string
  heroIds: string[]
  expeditionId?: string
  rarity: GazetteArticleRarity
}

export interface GazetteClassified {
  id: string
  text: string
}

export interface GazetteStats {
  expeditionsCompleted: number
  goldEarned: number
  heroesLeveledUp: number
  itemsFound: number
  rareItemsFound: number
  monstersDefeated: number
  mvp: { heroId: string; heroName: string; reason: string } | null
  funStat: string
}

export interface GazetteIssue {
  id: string
  guildId: string
  guildName: string
  issueNumber: number
  publishedAt: string
  coveringDate: string
  headline: GazetteArticle
  dispatches: GazetteArticle[]
  heroSpotlight: GazetteArticle | null
  gossip: GazetteArticle[]
  classifieds: GazetteClassified[]
  stats: GazetteStats
  letters: GazetteArticle[]
  forecast: string | null
}

// Input data used to generate an issue
export interface GazetteDayData {
  guildId: string
  guildName: string
  date: string
  heroes: GazetteHeroSummary[]
  expeditions: GazetteExpeditionSummary[]
  levelUps: { heroId: string; heroName: string; newLevel: number }[]
  rareDrops: { heroId: string; heroName: string; itemName: string; rarity: string }[]
  prestiges: { heroId: string; heroName: string; prestigeLevel: number }[]
  newRecruits: { heroId: string; heroName: string; rarity: string; archetype: string }[]
  retirements: { heroId: string; heroName: string; level: number; expeditionCount: number }[]
  totalGold: number
  totalMonstersDefeated: number
}

export interface GazetteHeroSummary {
  id: string
  name: string
  archetype: string
  rarity: string
  level: number
  storyTraitIds: string[]
  expeditionCount: number
  goldEarned: number
  isOnExpedition: boolean
  isStationed: boolean
}

export interface GazetteExpeditionSummary {
  id: string
  zoneName: string
  zoneType: string
  subzoneName: string
  leaderName: string
  heroNames: string[]
  heroTraitIds: string[]
  efficiency: number
  goldEarned: number
  xpEarned: number
  itemsFound: number
  rareItems: string[]
  durationMinutes: number
  notableLogEntries: string[]
}
