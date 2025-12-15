import type { Equipment, EquipmentSlot, EquipmentRarity, Stats, EquipmentTrait, TraitQuality } from '~~/types'
import { EQUIPMENT_TRAITS, getEquipmentTraitById } from '~/data/equipmentTraits'
import { QUALITY_MULTIPLIERS } from '~~/types/base'
import { calculateGearScore } from '~~/types/equipment'

// Slot stat tendencies
const SLOT_STAT_WEIGHTS: Record<EquipmentSlot, { primary: keyof Stats; secondary: keyof Stats; rare: keyof Stats }> = {
  weapon: { primary: 'combat', secondary: 'utility', rare: 'survival' },
  head: { primary: 'survival', secondary: 'utility', rare: 'combat' },
  chest: { primary: 'survival', secondary: 'combat', rare: 'utility' },
  hands: { primary: 'utility', secondary: 'combat', rare: 'survival' },
  legs: { primary: 'survival', secondary: 'combat', rare: 'utility' },
  feet: { primary: 'utility', secondary: 'survival', rare: 'combat' },
  accessory: { primary: 'combat', secondary: 'utility', rare: 'survival' }, // Equal weights handled separately
}

// Trait slots by rarity
const TRAIT_SLOTS_BY_RARITY: Record<EquipmentRarity, { min: number; max: number }> = {
  common: { min: 0, max: 0 },
  uncommon: { min: 0, max: 1 },
  rare: { min: 1, max: 1 },
  epic: { min: 1, max: 2 },
  legendary: { min: 2, max: 2 },
  mythic: { min: 2, max: 3 },
}

// Quality weights by rarity
const QUALITY_WEIGHTS_BY_RARITY: Record<EquipmentRarity, Record<TraitQuality, number>> = {
  common: { normal: 1.0, magic: 0.0, perfect: 0.0 },
  uncommon: { normal: 1.0, magic: 0.0, perfect: 0.0 },
  rare: { normal: 0.7, magic: 0.3, perfect: 0.0 },
  epic: { normal: 0.4, magic: 0.5, perfect: 0.1 },
  legendary: { normal: 0.1, magic: 0.6, perfect: 0.3 },
  mythic: { normal: 0.0, magic: 0.4, perfect: 0.6 },
}

// Helper: Random int in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper: Weighted random selection
function weightedRandom<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][]
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let random = Math.random() * total

  for (const [key, weight] of entries) {
    random -= weight
    if (random <= 0) return key
  }

  return entries[0][0]
}

// Helper: Random element
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Generate equipment stats based on slot and item level
function generateStats(slot: EquipmentSlot, itemLevel: number, rarity: EquipmentRarity): Stats {
  const weights = SLOT_STAT_WEIGHTS[slot]
  const baseStatBudget = itemLevel * (1 + Object.keys(TRAIT_SLOTS_BY_RARITY[rarity]).length * 0.1)

  // For accessories, use equal distribution
  if (slot === 'accessory') {
    const perStat = Math.round(baseStatBudget / 3)
    return {
      combat: perStat,
      utility: perStat,
      survival: perStat,
    }
  }

  // Distribute stats based on weights: 60% primary, 25% secondary, 15% rare
  return {
    [weights.primary]: Math.round(baseStatBudget * 0.6),
    [weights.secondary]: Math.round(baseStatBudget * 0.25),
    [weights.rare]: Math.round(baseStatBudget * 0.15),
  } as Stats
}

// Generate trait quality based on rarity
function generateTraitQuality(rarity: EquipmentRarity): TraitQuality {
  const weights = QUALITY_WEIGHTS_BY_RARITY[rarity]
  return weightedRandom(weights)
}

// Roll trait value based on quality
function rollTraitValue(minValue: number, maxValue: number, quality: TraitQuality): number {
  const multipliers = QUALITY_MULTIPLIERS[quality]
  const range = maxValue - minValue
  const qualityMin = minValue + range * multipliers.min
  const qualityMax = minValue + range * multipliers.max
  return Math.round(qualityMin + Math.random() * (qualityMax - qualityMin))
}

// Generate equipment traits
function generateTraits(rarity: EquipmentRarity, slot: EquipmentSlot): EquipmentTrait[] {
  const config = TRAIT_SLOTS_BY_RARITY[rarity]
  const traitCount = randomInt(config.min, config.max)

  if (traitCount === 0) return []

  const traits: EquipmentTrait[] = []
  const availableTraits = Object.values(EQUIPMENT_TRAITS)
  const usedTraitIds = new Set<string>()

  for (let i = 0; i < traitCount; i++) {
    // Filter out already used traits
    const available = availableTraits.filter(t => !usedTraitIds.has(t.id))
    if (available.length === 0) break

    const traitDef = randomElement(available)
    const quality = generateTraitQuality(rarity)
    const rolledValue = rollTraitValue(traitDef.minValue, traitDef.maxValue, quality)

    traits.push({
      traitId: traitDef.id,
      quality,
      rolledValue,
    })

    usedTraitIds.add(traitDef.id)
  }

  return traits
}

// Equipment name generators
const EQUIPMENT_PREFIXES = {
  common: ['Worn', 'Simple', 'Basic', 'Old'],
  uncommon: ['Sturdy', 'Quality', 'Fine', 'Reinforced'],
  rare: ['Superior', 'Masterwork', 'Excellent', 'Exceptional'],
  epic: ['Legendary', 'Magnificent', 'Glorious', 'Heroic'],
  legendary: ['Ancient', 'Divine', 'Celestial', 'Mythical'],
  mythic: ['Eternal', 'Primordial', 'Transcendent', 'Ultimate'],
}

const EQUIPMENT_BASES = {
  weapon: ['Sword', 'Axe', 'Mace', 'Dagger', 'Bow', 'Staff'],
  head: ['Helmet', 'Cap', 'Crown', 'Hood'],
  chest: ['Armor', 'Robe', 'Vest', 'Plate'],
  hands: ['Gloves', 'Gauntlets', 'Bracers'],
  legs: ['Leggings', 'Greaves', 'Pants'],
  feet: ['Boots', 'Shoes', 'Treads'],
  accessory: ['Ring', 'Amulet', 'Charm', 'Talisman'],
}

function generateEquipmentName(slot: EquipmentSlot, rarity: EquipmentRarity): string {
  const prefix = randomElement(EQUIPMENT_PREFIXES[rarity])
  const base = randomElement(EQUIPMENT_BASES[slot])
  return `${prefix} ${base}`
}

function generateEquipmentDescription(name: string, slot: EquipmentSlot, traits: EquipmentTrait[]): string {
  const descriptions = [
    `A ${slot} piece forged with care.`,
    `This ${slot} has seen many battles.`,
    `An unremarkable ${slot}, but serviceable.`,
  ]

  if (traits.length > 0) {
    return `${randomElement(descriptions)} It seems to have special properties.`
  }

  return randomElement(descriptions)
}

// Main equipment generator
export function generateEquipment(options: {
  playerId: string
  slot: EquipmentSlot
  rarity: EquipmentRarity
  itemLevel: number
  sourceZoneId?: string
  sourceSubzoneId?: string
  setId?: string
  setName?: string
}): Equipment {
  const { playerId, slot, rarity, itemLevel, sourceZoneId, sourceSubzoneId, setId, setName } = options

  const name = generateEquipmentName(slot, rarity)
  const baseStats = generateStats(slot, itemLevel, rarity)
  const traits = generateTraits(rarity, slot)
  const maxTraits = TRAIT_SLOTS_BY_RARITY[rarity].max

  const equipment: Equipment = {
    id: crypto.randomUUID(),
    playerId,
    name,
    description: generateEquipmentDescription(name, slot, traits),
    slot,
    rarity,
    baseStats,
    itemLevel,
    gearScore: 0, // Calculated below
    traits,
    maxTraits,
    setId,
    setName,
    isEquipped: false,
    equippedBy: null,
    sourceZoneId,
    sourceSubzoneId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Calculate gear score
  equipment.gearScore = calculateGearScore(equipment)

  return equipment
}

// Generate loot from loot table
export function generateLootFromTable(
  playerId: string,
  lootTable: Array<{ slot: EquipmentSlot; rarity: EquipmentRarity; weight: number }>,
  itemLevel: number,
  sourceZoneId?: string,
  sourceSubzoneId?: string
): Equipment | null {
  // Roll for loot drop (simplified - always drop for now)
  const totalWeight = lootTable.reduce((sum, entry) => sum + entry.weight, 0)
  let random = Math.random() * totalWeight

  for (const entry of lootTable) {
    random -= entry.weight
    if (random <= 0) {
      return generateEquipment({
        playerId,
        slot: entry.slot,
        rarity: entry.rarity,
        itemLevel,
        sourceZoneId,
        sourceSubzoneId,
      })
    }
  }

  return null
}
