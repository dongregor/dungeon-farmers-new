import type { EquipmentSlot, EquipmentRarity } from '~~/types'

// Base equipment templates for generation
export interface EquipmentTemplate {
  id: string
  name: string
  slot: EquipmentSlot
  baseRarity: EquipmentRarity
  minItemLevel: number
  sourceZones: string[]
  setId?: string
}

// Starting equipment (given to new heroes)
export const STARTING_EQUIPMENT: EquipmentTemplate[] = [
  {
    id: 'rusty_sword',
    name: 'Rusty Sword',
    slot: 'weapon',
    baseRarity: 'common',
    minItemLevel: 1,
    sourceZones: []
  },
  {
    id: 'leather_vest',
    name: 'Leather Vest',
    slot: 'chest',
    baseRarity: 'common',
    minItemLevel: 1,
    sourceZones: []
  }
]

// Equipment templates by zone
export const EQUIPMENT_TEMPLATES: EquipmentTemplate[] = [
  // Verdant Woods equipment
  {
    id: 'woodland_bow',
    name: 'Woodland Bow',
    slot: 'weapon',
    baseRarity: 'uncommon',
    minItemLevel: 5,
    sourceZones: ['verdant_woods']
  },
  {
    id: 'bark_shield',
    name: 'Bark Shield',
    slot: 'chest',
    baseRarity: 'uncommon',
    minItemLevel: 5,
    sourceZones: ['verdant_woods'],
    setId: 'woodland_ranger'
  },
  {
    id: 'leaf_cloak',
    name: 'Leaf Cloak',
    slot: 'chest',
    baseRarity: 'rare',
    minItemLevel: 10,
    sourceZones: ['verdant_woods'],
    setId: 'woodland_ranger'
  },
  {
    id: 'root_treads',
    name: 'Root Treads',
    slot: 'feet',
    baseRarity: 'uncommon',
    minItemLevel: 5,
    sourceZones: ['verdant_woods'],
    setId: 'woodland_ranger'
  },

  // Goblin Caves equipment
  {
    id: 'goblin_shank',
    name: 'Goblin Shank',
    slot: 'weapon',
    baseRarity: 'uncommon',
    minItemLevel: 8,
    sourceZones: ['goblin_caves']
  },
  {
    id: 'scavenged_mail',
    name: 'Scavenged Mail',
    slot: 'chest',
    baseRarity: 'uncommon',
    minItemLevel: 8,
    sourceZones: ['goblin_caves']
  },
  {
    id: 'tunnel_diggers',
    name: 'Tunnel Diggers',
    slot: 'feet',
    baseRarity: 'rare',
    minItemLevel: 12,
    sourceZones: ['goblin_caves']
  },

  // Misty Swamp equipment
  {
    id: 'bog_staff',
    name: 'Bog Staff',
    slot: 'weapon',
    baseRarity: 'rare',
    minItemLevel: 15,
    sourceZones: ['misty_swamp']
  },
  {
    id: 'swamp_hide_armor',
    name: 'Swamp Hide Armor',
    slot: 'chest',
    baseRarity: 'rare',
    minItemLevel: 15,
    sourceZones: ['misty_swamp'],
    setId: 'swamp_walker'
  },
  {
    id: 'toxic_treads',
    name: 'Toxic Treads',
    slot: 'feet',
    baseRarity: 'epic',
    minItemLevel: 20,
    sourceZones: ['misty_swamp'],
    setId: 'swamp_walker'
  },
  {
    id: 'miasma_charm',
    name: 'Miasma Charm',
    slot: 'accessory',
    baseRarity: 'epic',
    minItemLevel: 18,
    sourceZones: ['misty_swamp']
  }
]

export function getEquipmentTemplateById(id: string): EquipmentTemplate | undefined {
  return [...STARTING_EQUIPMENT, ...EQUIPMENT_TEMPLATES].find(t => t.id === id)
}

export function getEquipmentTemplatesByZone(zoneId: string): EquipmentTemplate[] {
  return EQUIPMENT_TEMPLATES.filter(t => t.sourceZones.includes(zoneId))
}

export function getEquipmentTemplatesBySlot(slot: EquipmentSlot): EquipmentTemplate[] {
  return EQUIPMENT_TEMPLATES.filter(t => t.slot === slot)
}

export function getEquipmentTemplatesBySet(setId: string): EquipmentTemplate[] {
  return EQUIPMENT_TEMPLATES.filter(t => t.setId === setId)
}
