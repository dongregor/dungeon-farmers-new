import type { Zone, Subzone } from '~~/types'

export const ZONES: Zone[] = [
  {
    id: 'verdant_woods',
    name: 'Verdant Woods',
    description: 'A lush forest filled with ancient trees and hidden dangers',
    type: 'forest',
    unlockRequirement: {},
    familiarity: 0,
    isUnlocked: true,
    isMastered: false,
    masteryRewards: {
      title: 'Woodwalker',
      passiveIncomeBonus: 20
    },
    subzones: [
      {
        id: 'woods_edge',
        name: 'Woods Edge',
        description: 'The safer outskirts of the Verdant Woods',
        discoveryWeight: 100,
        requiredZoneFamiliarity: 0,
        isDiscovered: true,
        difficulty: 'easy',
        threats: ['physical_burst', 'swarms'],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 0,
        bonusGoldPercent: 0,
        baseDuration: 30,
        baseGold: 100,
        baseXp: 50,
        mastery: 0
      },
      {
        id: 'ancient_grove',
        name: 'Ancient Grove',
        description: 'A sacred place where the oldest trees stand',
        discoveryWeight: 70,
        requiredZoneFamiliarity: 20,
        isDiscovered: false,
        difficulty: 'medium',
        threats: ['physical_burst', 'spell_barrages'],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 10,
        bonusGoldPercent: 10,
        baseDuration: 45,
        baseGold: 150,
        baseXp: 75,
        mastery: 0
      },
      {
        id: 'shadowed_thicket',
        name: 'Shadowed Thicket',
        description: 'A dark and tangled area where sunlight barely reaches',
        discoveryWeight: 50,
        requiredZoneFamiliarity: 40,
        isDiscovered: false,
        difficulty: 'hard',
        threats: ['evasive', 'spell_barrages'],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 20,
        bonusGoldPercent: 15,
        baseDuration: 60,
        baseGold: 200,
        baseXp: 100,
        mastery: 0
      }
    ]
  },
  {
    id: 'goblin_caves',
    name: 'Goblin Caves',
    description: 'A network of tunnels infested with goblin tribes',
    type: 'cave',
    unlockRequirement: { minPower: 50 },
    familiarity: 0,
    isUnlocked: false,
    isMastered: false,
    masteryRewards: {
      title: 'Cave Delver',
      passiveIncomeBonus: 20
    },
    subzones: [
      {
        id: 'cave_entrance',
        name: 'Cave Entrance',
        description: 'The main entrance guarded by goblin scouts',
        discoveryWeight: 100,
        requiredZoneFamiliarity: 0,
        isDiscovered: false,
        difficulty: 'medium',
        threats: ['physical_burst', 'swarms'],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 5,
        bonusGoldPercent: 5,
        baseDuration: 40,
        baseGold: 120,
        baseXp: 60,
        mastery: 0
      },
      {
        id: 'goblin_warren',
        name: 'Goblin Warren',
        description: 'A maze of tunnels where goblins live and breed',
        discoveryWeight: 60,
        requiredZoneFamiliarity: 30,
        isDiscovered: false,
        difficulty: 'hard',
        threats: ['physical_burst', 'aoe_damage'],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 15,
        bonusGoldPercent: 10,
        baseDuration: 55,
        baseGold: 180,
        baseXp: 90,
        mastery: 0
      }
    ]
  },
  {
    id: 'misty_swamp',
    name: 'Misty Swamp',
    description: 'A foggy wetland filled with dangerous creatures',
    type: 'swamp',
    unlockRequirement: { minPower: 100 },
    familiarity: 0,
    isUnlocked: false,
    isMastered: false,
    masteryRewards: {
      title: 'Swamp Walker',
      passiveIncomeBonus: 20
    },
    subzones: [
      {
        id: 'swamp_edge',
        name: 'Swamp Edge',
        description: 'The safer, drier areas around the swamp',
        discoveryWeight: 100,
        requiredZoneFamiliarity: 0,
        isDiscovered: false,
        difficulty: 'medium',
        threats: ['spell_barrages', 'poison'],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 10,
        bonusGoldPercent: 10,
        baseDuration: 45,
        baseGold: 130,
        baseXp: 65,
        mastery: 0
      },
      {
        id: 'bog_of_despair',
        name: 'Bog of Despair',
        description: 'A treacherous area where many adventurers meet their end',
        discoveryWeight: 40,
        requiredZoneFamiliarity: 50,
        isDiscovered: false,
        difficulty: 'extreme',
        threats: ['spell_barrages', 'poison', 'disease'],
        monsters: [],
        collectibles: [],
        lootTable: [],
        bonusXpPercent: 25,
        bonusGoldPercent: 20,
        baseDuration: 75,
        baseGold: 250,
        baseXp: 125,
        mastery: 0
      }
    ]
  }
]

/**
 * O(1) lookup cache for zones by ID
 * Auto-imported across client and server
 */
export const ZONE_BY_ID = new Map<string, Zone>(
  ZONES.map(zone => [zone.id, zone])
)

/**
 * O(1) lookup cache for subzones by composite key "zoneId:subzoneId"
 * Auto-imported across client and server
 */
export const SUBZONE_BY_ID = new Map<string, { zone: Zone; subzone: Subzone }>(
  ZONES.flatMap(zone =>
    zone.subzones.map(subzone => [
      `${zone.id}:${subzone.id}`,
      { zone, subzone }
    ])
  )
)

/**
 * Get zone by ID with O(1) Map lookup
 */
export function getZoneById(id: string): Zone | undefined {
  return ZONE_BY_ID.get(id)
}

/**
 * Get subzone by IDs with O(1) Map lookup
 */
export function getSubzoneById(zoneId: string, subzoneId: string): Subzone | undefined {
  return SUBZONE_BY_ID.get(`${zoneId}:${subzoneId}`)?.subzone
}

/**
 * Get both zone and subzone together with O(1) Map lookup
 */
export function getZoneAndSubzone(zoneId: string, subzoneId: string): { zone: Zone; subzone: Subzone } | undefined {
  return SUBZONE_BY_ID.get(`${zoneId}:${subzoneId}`)
}

export function getAvailableZones(playerPower: number): Zone[] {
  return ZONES.filter(zone => {
    if (zone.isUnlocked) return true

    if (zone.unlockRequirement.minPower && playerPower >= zone.unlockRequirement.minPower) {
      return true
    }

    if (zone.unlockRequirement.previousZoneId) {
      const previousZone = getZoneById(zone.unlockRequirement.previousZoneId)
      return previousZone?.isMastered || false
    }

    return false
  })
}

export function getDiscoverableSubzones(zoneId: string, zoneFamiliarity: number): Subzone[] {
  const zone = getZoneById(zoneId)
  if (!zone) return []

  return zone.subzones.filter(subzone =>
    !subzone.isDiscovered &&
    zoneFamiliarity >= subzone.requiredZoneFamiliarity
  )
}
