/**
 * In-memory stationing state for MVP
 * TODO: Replace with database persistence
 */

export interface StationedHeroData {
  heroId: string
  zoneId: string
  stationedAt: string
  lastCollectedAt: string
}

export interface StationingReward {
  materials: Array<{ id: string; name: string; count: number }>
  familiarityGain: number
  subzoneDiscovered?: {
    zoneId: string
    subzoneId: string
    name: string
  }
  questHookGenerated?: {
    id: string
    title: string
  }
}

// In-memory storage (keyed by
// For MVP, we use a simple Map. In production, this would be database calls.
const stationedHeroesMap = new Map<string, StationedHeroData[]>()

// Get user ID from request (placeholder - would use auth in real app)
export function getUserId(event: any): string {
  // TODO: Get actual user ID from auth
  return 'mock-user-id'
}

// Get stationed heroes for a user
export function getStationedHeroes(userId: string): StationedHeroData[] {
  return stationedHeroesMap.get(userId) || []
}

// Set stationed heroes for a user
export function setStationedHeroes(userId: string, heroes: StationedHeroData[]): void {
  stationedHeroesMap.set(userId, heroes)
}

// Add a stationed hero
export function addStationedHero(userId: string, hero: StationedHeroData): void {
  const heroes = getStationedHeroes(userId)
  heroes.push(hero)
  stationedHeroesMap.set(userId, heroes)
}

// Remove a stationed hero
export function removeStationedHero(userId: string, heroId: string): StationedHeroData | null {
  const heroes = getStationedHeroes(userId)
  const index = heroes.findIndex(h => h.heroId === heroId)
  if (index === -1) return null

  const [removed] = heroes.splice(index, 1)
  stationedHeroesMap.set(userId, heroes)
  return removed
}

// Find a stationed hero
export function findStationedHero(userId: string, heroId: string): StationedHeroData | undefined {
  const heroes = getStationedHeroes(userId)
  return heroes.find(h => h.heroId === heroId)
}

// Update a stationed hero
export function updateStationedHero(userId: string, heroId: string, updates: Partial<StationedHeroData>): void {
  const heroes = getStationedHeroes(userId)
  const hero = heroes.find(h => h.heroId === heroId)
  if (hero) {
    Object.assign(hero, updates)
    stationedHeroesMap.set(userId, heroes)
  }
}

// Calculate rewards based on time stationed
export function calculateRewards(hero: StationedHeroData): StationingReward {
  const now = Date.now()
  const lastCollected = new Date(hero.lastCollectedAt).getTime()
  const hoursStationed = Math.floor((now - lastCollected) / (1000 * 60 * 60))

  // Generate materials based on hours stationed
  const materials: StationingReward['materials'] = []
  if (hoursStationed >= 1) {
    materials.push({
      id: 'wood',
      name: 'Wood',
      count: hoursStationed * 2,
    })
    materials.push({
      id: 'leather',
      name: 'Leather',
      count: hoursStationed,
    })
  }

  // Familiarity gain: 1-3 per hour
  const familiarityGain = hoursStationed * (1 + Math.floor(Math.random() * 3))

  // Small chance for subzone discovery (5% per hour)
  let subzoneDiscovered: StationingReward['subzoneDiscovered'] | undefined
  if (Math.random() < 0.05 * hoursStationed) {
    subzoneDiscovered = {
      zoneId: hero.zoneId,
      subzoneId: `discovered_${Date.now()}`,
      name: 'Hidden Path',
    }
  }

  // Very small chance for quest hook (2% per hour)
  let questHookGenerated: StationingReward['questHookGenerated'] | undefined
  if (Math.random() < 0.02 * hoursStationed) {
    questHookGenerated = {
      id: `quest_${Date.now()}`,
      title: 'A Mysterious Discovery',
    }
  }

  return {
    materials,
    familiarityGain,
    subzoneDiscovered,
    questHookGenerated,
  }
}

// Merge multiple rewards into one
export function mergeRewards(rewards: StationingReward[]): StationingReward {
  const merged: StationingReward = {
    materials: [],
    familiarityGain: 0,
  }

  const materialMap = new Map<string, { id: string; name: string; count: number }>()

  for (const reward of rewards) {
    // Merge materials
    for (const mat of reward.materials) {
      const existing = materialMap.get(mat.id)
      if (existing) {
        existing.count += mat.count
      } else {
        materialMap.set(mat.id, { ...mat })
      }
    }

    // Sum familiarity
    merged.familiarityGain += reward.familiarityGain

    // Keep first subzone discovered
    if (!merged.subzoneDiscovered && reward.subzoneDiscovered) {
      merged.subzoneDiscovered = reward.subzoneDiscovered
    }

    // Keep first quest hook
    if (!merged.questHookGenerated && reward.questHookGenerated) {
      merged.questHookGenerated = reward.questHookGenerated
    }
  }

  merged.materials = Array.from(materialMap.values())
  return merged
}
