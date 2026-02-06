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
        monsters: [
          {
            monsterId: 'forest_wolf',
            spawnType: 'common',
            baseSpawnChance: 0.4,
            requiredMastery: 0,
            baseCaptureChance: 0.15,
            threatContribution: ['physical_burst'],
            power: 15,
          },
          {
            monsterId: 'basic_slime',
            spawnType: 'common',
            baseSpawnChance: 0.5,
            requiredMastery: 0,
            baseCaptureChance: 0.2,
            threatContribution: ['swarms'],
            power: 10,
          },
          {
            monsterId: 'woodland_sprite',
            spawnType: 'uncommon',
            baseSpawnChance: 0.1,
            requiredMastery: 25,
            baseCaptureChance: 0.08,
            threatContribution: ['spell_barrages'],
            power: 25,
          },
        ],
        collectibles: [
          {
            id: 'ancient_acorn',
            name: 'Ancient Acorn',
            description: 'A perfectly preserved acorn from a centenarian oak',
            rarity: 'common',
            type: 'material',
            dropChance: 0.15,
            requiresMastery: 0,
          },
          {
            id: 'dewdrop_vial',
            name: 'Morning Dewdrop Vial',
            description: 'Pristine morning dew with minor restorative properties',
            rarity: 'uncommon',
            type: 'material',
            dropChance: 0.08,
            requiresMastery: 20,
          },
        ],
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
        monsters: [
          {
            monsterId: 'elder_treant',
            spawnType: 'uncommon',
            baseSpawnChance: 0.25,
            requiredMastery: 0,
            baseCaptureChance: 0.08,
            threatContribution: ['physical_burst'],
            power: 40,
          },
          {
            monsterId: 'grove_guardian',
            spawnType: 'rare',
            baseSpawnChance: 0.1,
            requiredMastery: 50,
            baseCaptureChance: 0.05,
            threatContribution: ['spell_barrages'],
            power: 60,
          },
          {
            monsterId: 'forest_wolf',
            spawnType: 'common',
            baseSpawnChance: 0.35,
            requiredMastery: 0,
            baseCaptureChance: 0.12,
            threatContribution: ['physical_burst'],
            power: 20,
          },
        ],
        collectibles: [
          {
            id: 'treant_bark',
            name: 'Treant Bark',
            description: 'Magically infused bark that slowly regenerates',
            rarity: 'uncommon',
            type: 'material',
            dropChance: 0.12,
            requiresMastery: 0,
          },
          {
            id: 'grove_crystal',
            name: 'Grove Heart Crystal',
            description: 'A crystallized essence of ancient forest magic',
            rarity: 'rare',
            type: 'trophy',
            dropChance: 0.03,
            requiresMastery: 66,
          },
        ],
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
        monsters: [
          {
            monsterId: 'shadow_stalker',
            spawnType: 'uncommon',
            baseSpawnChance: 0.3,
            requiredMastery: 0,
            baseCaptureChance: 0.06,
            threatContribution: ['evasive'],
            power: 50,
          },
          {
            monsterId: 'corrupted_dryad',
            spawnType: 'rare',
            baseSpawnChance: 0.15,
            requiredMastery: 33,
            baseCaptureChance: 0.04,
            threatContribution: ['spell_barrages'],
            power: 70,
          },
          {
            monsterId: 'thicket_boss',
            spawnType: 'boss',
            baseSpawnChance: 0.05,
            requiredMastery: 75,
            baseCaptureChance: 0.02,
            threatContribution: ['evasive', 'spell_barrages'],
            power: 100,
          },
        ],
        collectibles: [
          {
            id: 'shadow_essence',
            name: 'Condensed Shadow',
            description: 'Pure darkness given form, cold to the touch',
            rarity: 'rare',
            type: 'material',
            dropChance: 0.06,
            requiresMastery: 33,
          },
          {
            id: 'corrupted_seed',
            name: 'Corrupted Seed',
            description: 'A seed tainted by dark magic, dangerous yet powerful',
            rarity: 'rare',
            type: 'both',
            craftingUse: 'Dark equipment crafting',
            dropChance: 0.04,
            requiresMastery: 66,
          },
        ],
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
        monsters: [
          {
            monsterId: 'goblin_scout',
            spawnType: 'common',
            baseSpawnChance: 0.5,
            requiredMastery: 0,
            baseCaptureChance: 0.12,
            threatContribution: ['swarms'],
            power: 20,
          },
          {
            monsterId: 'goblin_archer',
            spawnType: 'common',
            baseSpawnChance: 0.3,
            requiredMastery: 0,
            baseCaptureChance: 0.10,
            threatContribution: ['physical_burst'],
            power: 25,
          },
          {
            monsterId: 'cave_bat',
            spawnType: 'uncommon',
            baseSpawnChance: 0.2,
            requiredMastery: 20,
            baseCaptureChance: 0.15,
            threatContribution: ['swarms'],
            power: 15,
          },
        ],
        collectibles: [
          {
            id: 'rusty_coin',
            name: 'Rusty Goblin Coin',
            description: 'A corroded coin from the goblin treasury',
            rarity: 'common',
            type: 'trophy',
            dropChance: 0.20,
            requiresMastery: 0,
          },
          {
            id: 'cave_moss',
            name: 'Luminescent Cave Moss',
            description: 'Glowing moss that thrives in darkness',
            rarity: 'uncommon',
            type: 'material',
            dropChance: 0.10,
            requiresMastery: 25,
          },
        ],
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
        monsters: [
          {
            monsterId: 'goblin_berserker',
            spawnType: 'uncommon',
            baseSpawnChance: 0.35,
            requiredMastery: 0,
            baseCaptureChance: 0.07,
            threatContribution: ['physical_burst'],
            power: 45,
          },
          {
            monsterId: 'goblin_shaman',
            spawnType: 'rare',
            baseSpawnChance: 0.15,
            requiredMastery: 40,
            baseCaptureChance: 0.05,
            threatContribution: ['aoe_damage'],
            power: 55,
          },
          {
            monsterId: 'goblin_king',
            spawnType: 'boss',
            baseSpawnChance: 0.05,
            requiredMastery: 80,
            baseCaptureChance: 0.02,
            threatContribution: ['physical_burst', 'aoe_damage'],
            power: 90,
          },
        ],
        collectibles: [
          {
            id: 'goblin_crown',
            name: 'Goblin Crown Fragment',
            description: 'A piece of the legendary goblin crown',
            rarity: 'rare',
            type: 'trophy',
            dropChance: 0.03,
            requiresMastery: 50,
          },
          {
            id: 'shaman_totem',
            name: 'Shaman Totem',
            description: 'A magical focus used by goblin shamans',
            rarity: 'rare',
            type: 'both',
            craftingUse: 'Magic equipment crafting',
            dropChance: 0.05,
            requiresMastery: 66,
          },
        ],
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
        monsters: [
          {
            monsterId: 'swamp_toad',
            spawnType: 'common',
            baseSpawnChance: 0.45,
            requiredMastery: 0,
            baseCaptureChance: 0.12,
            threatContribution: ['poison'],
            power: 25,
          },
          {
            monsterId: 'bog_wisp',
            spawnType: 'uncommon',
            baseSpawnChance: 0.25,
            requiredMastery: 15,
            baseCaptureChance: 0.08,
            threatContribution: ['spell_barrages'],
            power: 35,
          },
          {
            monsterId: 'murk_lurker',
            spawnType: 'uncommon',
            baseSpawnChance: 0.2,
            requiredMastery: 30,
            baseCaptureChance: 0.06,
            threatContribution: ['poison'],
            power: 40,
          },
        ],
        collectibles: [
          {
            id: 'swamp_lily',
            name: 'Swamp Lily',
            description: 'A surprisingly beautiful flower that thrives in muck',
            rarity: 'common',
            type: 'material',
            dropChance: 0.18,
            requiresMastery: 0,
          },
          {
            id: 'wisp_essence',
            name: 'Wisp Essence',
            description: 'Ethereal energy captured from a bog wisp',
            rarity: 'uncommon',
            type: 'material',
            dropChance: 0.08,
            requiresMastery: 25,
          },
        ],
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
        monsters: [
          {
            monsterId: 'plague_bearer',
            spawnType: 'uncommon',
            baseSpawnChance: 0.3,
            requiredMastery: 0,
            baseCaptureChance: 0.05,
            threatContribution: ['disease'],
            power: 60,
          },
          {
            monsterId: 'swamp_hydra',
            spawnType: 'rare',
            baseSpawnChance: 0.15,
            requiredMastery: 40,
            baseCaptureChance: 0.03,
            threatContribution: ['poison', 'spell_barrages'],
            power: 85,
          },
          {
            monsterId: 'ancient_bog_horror',
            spawnType: 'boss',
            baseSpawnChance: 0.03,
            requiredMastery: 90,
            baseCaptureChance: 0.01,
            threatContribution: ['spell_barrages', 'poison', 'disease'],
            power: 120,
          },
        ],
        collectibles: [
          {
            id: 'despair_crystal',
            name: 'Crystal of Despair',
            description: 'A gem formed from concentrated suffering',
            rarity: 'rare',
            type: 'trophy',
            dropChance: 0.04,
            requiresMastery: 50,
          },
          {
            id: 'hydra_scale',
            name: 'Hydra Scale',
            description: 'An iridescent scale from the legendary swamp hydra',
            rarity: 'rare',
            type: 'both',
            craftingUse: 'Legendary armor crafting',
            dropChance: 0.02,
            requiresMastery: 80,
          },
        ],
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
