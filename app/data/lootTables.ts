import type { EquipmentSlot, EquipmentRarity } from '~~/types'

// Loot table entry for equipment generation
export interface LootTableEntry {
  slot: EquipmentSlot
  rarity: EquipmentRarity
  weight: number
  minTier?: number  // Difficulty tier requirement
  maxTier?: number  // Maximum tier for this drop
}

// Loot table for a specific zone/subzone
export interface LootTable {
  id: string
  zoneId: string
  subzoneId?: string
  entries: LootTableEntry[]
}

// Difficulty tier scaling constants
export const DIFFICULTY_TIER_COUNT = 10

// Rarity weights by difficulty tier (higher tier = better loot)
export const RARITY_WEIGHTS_BY_TIER: Record<number, Record<EquipmentRarity, number>> = {
  // Tier 1: Novice (mostly common/uncommon)
  1: { common: 60, uncommon: 30, rare: 8, epic: 2, legendary: 0, mythic: 0 },
  // Tier 2: Adventurer
  2: { common: 50, uncommon: 35, rare: 12, epic: 3, legendary: 0, mythic: 0 },
  // Tier 3: Veteran
  3: { common: 40, uncommon: 40, rare: 15, epic: 5, legendary: 0, mythic: 0 },
  // Tier 4: Elite
  4: { common: 30, uncommon: 40, rare: 20, epic: 9, legendary: 1, mythic: 0 },
  // Tier 5: Champion
  5: { common: 20, uncommon: 35, rare: 30, epic: 13, legendary: 2, mythic: 0 },
  // Tier 6: Heroic
  6: { common: 10, uncommon: 30, rare: 35, epic: 20, legendary: 5, mythic: 0 },
  // Tier 7: Legendary
  7: { common: 5, uncommon: 20, rare: 35, epic: 30, legendary: 9, mythic: 1 },
  // Tier 8: Mythic
  8: { common: 2, uncommon: 10, rare: 30, epic: 35, legendary: 20, mythic: 3 },
  // Tier 9: Ascended
  9: { common: 0, uncommon: 5, rare: 20, epic: 40, legendary: 30, mythic: 5 },
  // Tier 10: Transcendent
  10: { common: 0, uncommon: 0, rare: 10, epic: 35, legendary: 40, mythic: 15 },
}

// Slot weights by zone type (thematic distributions)
export const SLOT_WEIGHTS_BY_ZONE_TYPE: Record<string, Record<EquipmentSlot, number>> = {
  forest: {
    weapon: 20,      // Bows, staves
    head: 10,
    chest: 15,
    hands: 12,
    legs: 12,
    feet: 18,        // Forest gear emphasizes mobility
    accessory: 13,
  },
  cave: {
    weapon: 18,
    head: 15,        // Helmets for cave protection
    chest: 20,       // Heavy armor
    hands: 12,
    legs: 15,
    feet: 10,
    accessory: 10,
  },
  swamp: {
    weapon: 15,
    head: 12,
    chest: 18,
    hands: 10,
    legs: 15,
    feet: 15,        // Swamp boots
    accessory: 15,   // Toxin resistance charms
  },
  mountain: {
    weapon: 20,
    head: 12,
    chest: 18,
    hands: 15,       // Climbing gloves
    legs: 12,
    feet: 15,
    accessory: 8,
  },
  desert: {
    weapon: 18,
    head: 15,        // Sun protection
    chest: 15,
    hands: 10,
    legs: 12,
    feet: 15,
    accessory: 15,   // Heat resistance
  },
  ruins: {
    weapon: 22,      // Ancient weapons
    head: 10,
    chest: 15,
    hands: 10,
    legs: 10,
    feet: 10,
    accessory: 23,   // Ancient artifacts
  },
}

// Generate base loot table for a subzone
export function generateBaseLootTable(
  zoneId: string,
  subzoneId: string,
  zoneType: string,
  baseTier: number = 1
): LootTable {
  const slotWeights = SLOT_WEIGHTS_BY_ZONE_TYPE[zoneType] || SLOT_WEIGHTS_BY_ZONE_TYPE.forest
  const rarityWeights = RARITY_WEIGHTS_BY_TIER[baseTier]

  const entries: LootTableEntry[] = []

  // Generate entries for each slot/rarity combination
  for (const [slot, slotWeight] of Object.entries(slotWeights)) {
    for (const [rarity, rarityWeight] of Object.entries(rarityWeights)) {
      if (rarityWeight > 0) {
        entries.push({
          slot: slot as EquipmentSlot,
          rarity: rarity as EquipmentRarity,
          weight: slotWeight * rarityWeight,
        })
      }
    }
  }

  return {
    id: `${zoneId}_${subzoneId}`,
    zoneId,
    subzoneId,
    entries,
  }
}

// Generate tier-scaled loot table (for difficulty tier system)
export function generateTierScaledLootTable(
  baseLootTable: LootTable,
  tier: number
): LootTableEntry[] {
  const zoneType = baseLootTable.zoneId.includes('woods') ? 'forest'
    : baseLootTable.zoneId.includes('cave') ? 'cave'
    : baseLootTable.zoneId.includes('swamp') ? 'swamp'
    : baseLootTable.zoneId.includes('mountain') ? 'mountain'
    : baseLootTable.zoneId.includes('desert') ? 'desert'
    : 'ruins'

  const slotWeights = SLOT_WEIGHTS_BY_ZONE_TYPE[zoneType]
  const rarityWeights = RARITY_WEIGHTS_BY_TIER[tier] || RARITY_WEIGHTS_BY_TIER[1]

  const entries: LootTableEntry[] = []

  // Regenerate with tier-appropriate rarity distribution
  for (const [slot, slotWeight] of Object.entries(slotWeights)) {
    for (const [rarity, rarityWeight] of Object.entries(rarityWeights)) {
      if (rarityWeight > 0) {
        entries.push({
          slot: slot as EquipmentSlot,
          rarity: rarity as EquipmentRarity,
          weight: slotWeight * rarityWeight,
          minTier: tier,
          maxTier: tier,
        })
      }
    }
  }

  return entries
}

// === ZONE-SPECIFIC LOOT TABLES ===

// VERDANT WOODS
export const VERDANT_WOODS_LOOT_TABLES: Record<string, LootTable> = {
  woods_edge: generateBaseLootTable('verdant_woods', 'woods_edge', 'forest', 1),
  ancient_grove: generateBaseLootTable('verdant_woods', 'ancient_grove', 'forest', 2),
  shadowed_thicket: generateBaseLootTable('verdant_woods', 'shadowed_thicket', 'forest', 3),
}

// GOBLIN CAVES
export const GOBLIN_CAVES_LOOT_TABLES: Record<string, LootTable> = {
  cave_entrance: generateBaseLootTable('goblin_caves', 'cave_entrance', 'cave', 2),
  goblin_warren: generateBaseLootTable('goblin_caves', 'goblin_warren', 'cave', 3),
}

// MISTY SWAMP
export const MISTY_SWAMP_LOOT_TABLES: Record<string, LootTable> = {
  swamp_edge: generateBaseLootTable('misty_swamp', 'swamp_edge', 'swamp', 2),
  bog_of_despair: generateBaseLootTable('misty_swamp', 'bog_of_despair', 'swamp', 4),
}

// ALL LOOT TABLES
export const ALL_LOOT_TABLES: Record<string, LootTable> = {
  ...VERDANT_WOODS_LOOT_TABLES,
  ...GOBLIN_CAVES_LOOT_TABLES,
  ...MISTY_SWAMP_LOOT_TABLES,
}

// === HELPER FUNCTIONS ===

// Get loot table by zone and subzone
export function getLootTable(zoneId: string, subzoneId: string): LootTable | undefined {
  const key = `${zoneId}_${subzoneId}`
  return ALL_LOOT_TABLES[subzoneId] || ALL_LOOT_TABLES[key]
}

// Get loot table entries for specific tier
export function getLootTableForTier(
  zoneId: string,
  subzoneId: string,
  tier: number = 1
): LootTableEntry[] {
  const baseLootTable = getLootTable(zoneId, subzoneId)
  if (!baseLootTable) {
    console.warn(`No loot table found for ${zoneId}/${subzoneId}, using default`)
    return generateBaseLootTable(zoneId, subzoneId, 'forest', tier).entries
  }

  return generateTierScaledLootTable(baseLootTable, tier)
}

// Roll equipment from loot table
export function rollLootDrop(
  lootTable: LootTableEntry[]
): { slot: EquipmentSlot; rarity: EquipmentRarity } | null {
  if (!lootTable || lootTable.length === 0) {
    return null
  }

  const totalWeight = lootTable.reduce((sum, entry) => sum + entry.weight, 0)
  let random = Math.random() * totalWeight

  for (const entry of lootTable) {
    random -= entry.weight
    if (random <= 0) {
      return {
        slot: entry.slot,
        rarity: entry.rarity,
      }
    }
  }

  // Fallback to first entry
  return {
    slot: lootTable[0].slot,
    rarity: lootTable[0].rarity,
  }
}

// Calculate drop chance multiplier based on mastery
export function getMasteryDropBonus(mastery: number): number {
  if (mastery >= 100) return 1.5   // +50% at mastery
  if (mastery >= 66) return 1.3    // +30% at 66
  if (mastery >= 33) return 1.15   // +15% at 33
  return 1.0
}

// Calculate item level from zone difficulty and tier
export function calculateItemLevel(
  zoneDifficulty: 'easy' | 'medium' | 'hard' | 'extreme',
  tier: number
): number {
  const baseItemLevel = {
    easy: 5,
    medium: 10,
    hard: 15,
    extreme: 20,
  }[zoneDifficulty]

  // Each tier adds +3 item levels
  const tierBonus = {
    1: 0,
    2: 3,
    3: 6,
    4: 10,
    5: 15,
    6: 20,
    7: 25,
    8: 30,
    9: 35,
    10: 40,
  }[tier] || 0

  return baseItemLevel + tierBonus
}

// Get weighted random rarity for a tier (for special drops)
export function rollRarityForTier(tier: number): EquipmentRarity {
  const weights = RARITY_WEIGHTS_BY_TIER[tier] || RARITY_WEIGHTS_BY_TIER[1]
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight

  for (const [rarity, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      return rarity as EquipmentRarity
    }
  }

  return 'common'
}
