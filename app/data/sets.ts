import type { EquipmentSet, ZoneType } from '~~/types'

// Equipment sets
export const EQUIPMENT_SETS: Record<string, EquipmentSet> = {
  woodland_ranger: {
    id: 'woodland_ranger',
    name: 'Woodland Ranger',
    description: 'Armor crafted from the ancient trees of the Verdant Woods',
    pieces: ['bark_shield', 'leaf_cloak', 'root_treads'],
    bonuses: [
      {
        requiredPieces: 2,
        grantedTraits: [
          {
            traitId: 'forest_affinity',
            quality: 'magic',
            fixedValue: 15
          }
        ]
      },
      {
        requiredPieces: 3,
        grantedTraits: [
          {
            traitId: 'forest_affinity',
            quality: 'perfect',
            fixedValue: 25
          },
          {
            traitId: 'cunning',
            quality: 'magic',
            fixedValue: 5
          }
        ]
      }
    ],
    biome: 'forest',
    sourceZone: 'verdant_woods'
  },

  swamp_walker: {
    id: 'swamp_walker',
    name: 'Swamp Walker',
    description: 'Equipment imbued with the toxic essence of the Misty Swamp',
    pieces: ['swamp_hide_armor', 'toxic_treads'],
    bonuses: [
      {
        requiredPieces: 2,
        grantedTraits: [
          {
            traitId: 'swamp_walker',
            quality: 'perfect',
            fixedValue: 20
          },
          {
            traitId: 'vitality',
            quality: 'magic',
            fixedValue: 7
          }
        ]
      }
    ],
    biome: 'swamp',
    sourceZone: 'misty_swamp'
  }
}

// Get set by ID
export function getEquipmentSetById(id: string): EquipmentSet | undefined {
  return EQUIPMENT_SETS[id]
}

// Get all sets for a zone
export function getEquipmentSetsByZone(zoneId: string): EquipmentSet[] {
  return Object.values(EQUIPMENT_SETS).filter(s => s.sourceZone === zoneId)
}

// Get all sets for a biome
export function getEquipmentSetsByBiome(biome: ZoneType): EquipmentSet[] {
  return Object.values(EQUIPMENT_SETS).filter(s => s.biome === biome)
}

// Calculate how many set pieces a hero has equipped
export function calculateEquippedSetPieces(
  equippedItemIds: string[],
  setId: string
): number {
  const set = EQUIPMENT_SETS[setId]
  if (!set) return 0

  return equippedItemIds.filter(itemId => set.pieces.includes(itemId)).length
}

// Get active set bonuses for equipped pieces
export function getActiveSetBonuses(equippedItemIds: string[], setId: string) {
  const set = EQUIPMENT_SETS[setId]
  if (!set) return []

  const equippedPieces = calculateEquippedSetPieces(equippedItemIds, setId)

  return set.bonuses.filter(bonus => equippedPieces >= bonus.requiredPieces)
}
