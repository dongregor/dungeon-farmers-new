/**
 * Content Validation Script
 *
 * Validates all JSON content files in the content/ directory.
 * Run with: npx tsx scripts/validate-content.ts
 *
 * Features:
 * - Schema validation using Zod
 * - Cross-reference validation (e.g., monster references in zones)
 * - Duplicate ID detection
 * - Missing file detection
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { z } from 'zod'

// =============================================================================
// Schemas
// =============================================================================

const RaritySchema = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary'])
const BiomeSchema = z.enum(['forest', 'caves', 'grassland', 'ruins', 'desert', 'mountains'])

// Zone Schema
const ZoneIndexSchema = z.object({
  version: z.string(),
  lastUpdated: z.string(),
  zones: z.array(z.object({
    id: z.string().regex(/^zone_[a-z_]+$/),
    file: z.string(),
    biome: z.string(),
    difficulty: z.number().min(1),
    order: z.number().min(1)
  })),
  biomes: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
  })),
  difficulties: z.array(z.object({
    tier: z.number(),
    name: z.string(),
    powerMultiplier: z.number()
  }))
})

const ZoneSchema = z.object({
  id: z.string().regex(/^zone_[a-z_]+$/),
  name: z.string().min(1).max(50),
  description: z.string(),
  lore: z.string().optional(),
  biome: z.string(),
  difficulty: z.object({
    tier: z.number().min(1).max(4),
    name: z.string(),
    level: z.number().min(1),
    recommendedPower: z.number().min(100)
  }),
  duration: z.object({
    minMinutes: z.number().min(1),
    maxMinutes: z.number(),
    baseModifier: z.number()
  }),
  lootTable: z.object({
    gold: z.object({ base: z.number(), variance: z.number() }),
    experience: z.object({ base: z.number(), variance: z.number() }),
    items: z.array(z.object({
      templateId: z.string(),
      weight: z.number()
    })),
    materials: z.array(z.object({
      id: z.string(),
      name: z.string(),
      amountMin: z.number(),
      amountMax: z.number(),
      weight: z.number()
    }))
  }),
  monsters: z.array(z.object({
    templateId: z.string(),
    spawnWeight: z.number(),
    captureChance: z.number().min(0).max(1)
  })),
  events: z.array(z.object({
    templateId: z.string(),
    chance: z.number().min(0).max(1)
  })),
  passiveIncome: z.object({
    slots: z.number().min(0),
    goldPerHour: z.number(),
    experiencePerHour: z.number()
  }),
  unlockRequirements: z.object({
    type: z.string(),
    zoneId: z.string().optional(),
    times: z.number().optional()
  }).optional()
}).passthrough()

// Monster Schema
const MonsterIndexSchema = z.object({
  version: z.string(),
  monsters: z.array(z.object({
    id: z.string(),
    file: z.string(),
    biome: z.string(),
    category: z.string()
  })),
  rarityDistribution: z.record(z.number()),
  rarityScaling: z.record(z.object({
    statMultiplier: z.number(),
    traitSlots: z.number()
  })),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string()
  }))
})

const MonsterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  biome: z.string(),
  category: z.string(),
  baseStats: z.object({
    power: z.number(),
    health: z.number(),
    attack: z.number(),
    defense: z.number(),
    speed: z.number()
  }),
  traits: z.object({
    guaranteed: z.array(z.string()),
    possible: z.array(z.object({
      id: z.string(),
      chance: z.number()
    }))
  }),
  lootTable: z.object({
    gold: z.object({ base: z.number(), variance: z.number() }),
    items: z.array(z.any()),
    materials: z.array(z.any())
  }),
  captureInfo: z.object({
    baseChance: z.number().min(0).max(1),
    bonusTraits: z.array(z.string()),
    bonusPerTrait: z.number()
  })
}).passthrough()

// Item Schema
const ItemIndexSchema = z.object({
  version: z.string(),
  slots: z.array(z.string()),
  rarities: z.array(z.string()),
  categories: z.record(z.array(z.string())),
  templates: z.array(z.object({
    id: z.string(),
    file: z.string(),
    slot: z.string()
  })),
  sets: z.array(z.object({
    id: z.string(),
    file: z.string()
  })),
  rarityMultipliers: z.record(z.object({
    stat: z.number(),
    sellValue: z.number(),
    maxBonusStats: z.number()
  }))
})

// Trait Schema
const TraitIndexSchema = z.object({
  version: z.string(),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string()
  })),
  rarities: z.record(z.object({
    weight: z.number(),
    color: z.string()
  })),
  traits: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    rarity: z.string(),
    description: z.string(),
    effects: z.array(z.any())
  }))
})

// Achievement Schema
const AchievementIndexSchema = z.object({
  version: z.string(),
  categories: z.array(z.object({
    id: z.string(),
    name: z.string()
  })),
  achievements: z.array(z.object({
    id: z.string().regex(/^ach_[a-z_]+$/),
    category: z.string(),
    name: z.string(),
    description: z.string(),
    secret: z.boolean(),
    tiers: z.array(z.object({
      tier: z.number(),
      name: z.string(),
      requirement: z.any(),
      rewards: z.array(z.any()),
      points: z.number()
    }))
  }))
})

// =============================================================================
// Validation Logic
// =============================================================================

interface ValidationResult {
  file: string
  valid: boolean
  errors: string[]
  warnings: string[]
}

const results: ValidationResult[] = []
const allIds = new Map<string, string>() // id -> file

function loadJson(filePath: string): any {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error: any) {
    throw new Error(`Failed to parse ${filePath}: ${error.message}`)
  }
}

function validateFile(
  filePath: string,
  schema: z.ZodSchema,
  extraValidation?: (data: any) => string[]
): ValidationResult {
  const result: ValidationResult = {
    file: filePath,
    valid: true,
    errors: [],
    warnings: []
  }

  try {
    const data = loadJson(filePath)

    // Schema validation
    const parseResult = schema.safeParse(data)
    if (!parseResult.success) {
      result.valid = false
      result.errors.push(...parseResult.error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      ))
    }

    // Extra validation
    if (extraValidation && parseResult.success) {
      const extraErrors = extraValidation(parseResult.data)
      if (extraErrors.length > 0) {
        result.valid = false
        result.errors.push(...extraErrors)
      }
    }

    // Check for duplicate IDs
    if (data.id) {
      if (allIds.has(data.id)) {
        result.valid = false
        result.errors.push(`Duplicate ID "${data.id}" (also in ${allIds.get(data.id)})`)
      } else {
        allIds.set(data.id, filePath)
      }
    }
  } catch (error: any) {
    result.valid = false
    result.errors.push(error.message)
  }

  return result
}

function validateDirectory(
  dirPath: string,
  pattern: RegExp,
  schema: z.ZodSchema,
  extraValidation?: (data: any) => string[]
): ValidationResult[] {
  const results: ValidationResult[] = []

  if (!existsSync(dirPath)) {
    return [{
      file: dirPath,
      valid: false,
      errors: [`Directory does not exist: ${dirPath}`],
      warnings: []
    }]
  }

  const files = readdirSync(dirPath, { recursive: true })
    .filter((f): f is string => typeof f === 'string' && pattern.test(f))

  for (const file of files) {
    const fullPath = join(dirPath, file)
    results.push(validateFile(fullPath, schema, extraValidation))
  }

  return results
}

// =============================================================================
// Cross-Reference Validation
// =============================================================================

function validateCrossReferences(contentDir: string): string[] {
  const errors: string[] = []

  // Load all indexes
  const zoneIndex = loadJson(join(contentDir, 'zones/index.json'))
  const monsterIndex = loadJson(join(contentDir, 'monsters/index.json'))
  const traitIndex = loadJson(join(contentDir, 'traits/index.json'))
  const eventIndex = loadJson(join(contentDir, 'events/index.json'))

  // Build ID sets
  const monsterIds = new Set(monsterIndex.monsters.map((m: any) => m.id))
  const traitIds = new Set(traitIndex.traits.map((t: any) => t.id))
  const eventIds = new Set(eventIndex.events.map((e: any) => e.id))
  const zoneIds = new Set(zoneIndex.zones.map((z: any) => z.id))

  // Validate zone monster references
  for (const zoneRef of zoneIndex.zones) {
    const zonePath = join(contentDir, 'zones', zoneRef.file)
    if (existsSync(zonePath)) {
      const zone = loadJson(zonePath)

      // Check monster references
      for (const monster of zone.monsters || []) {
        if (!monsterIds.has(monster.templateId)) {
          errors.push(`Zone ${zone.id}: Unknown monster "${monster.templateId}"`)
        }
      }

      // Check event references
      for (const event of zone.events || []) {
        if (!eventIds.has(event.templateId)) {
          errors.push(`Zone ${zone.id}: Unknown event "${event.templateId}"`)
        }
      }

      // Check unlock zone reference
      if (zone.unlockRequirements?.zoneId && !zoneIds.has(zone.unlockRequirements.zoneId)) {
        errors.push(`Zone ${zone.id}: Unknown unlock zone "${zone.unlockRequirements.zoneId}"`)
      }
    }
  }

  // Validate monster trait references
  for (const monsterRef of monsterIndex.monsters) {
    const monsterPath = join(contentDir, 'monsters', monsterRef.file)
    if (existsSync(monsterPath)) {
      const monster = loadJson(monsterPath)

      for (const traitId of monster.traits?.guaranteed || []) {
        if (!traitIds.has(traitId)) {
          errors.push(`Monster ${monster.id}: Unknown trait "${traitId}"`)
        }
      }

      for (const trait of monster.traits?.possible || []) {
        if (!traitIds.has(trait.id)) {
          errors.push(`Monster ${monster.id}: Unknown trait "${trait.id}"`)
        }
      }
    }
  }

  return errors
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const contentDir = join(process.cwd(), 'content')

  console.log('🔍 Validating content files...\n')

  // Validate zone index
  results.push(validateFile(
    join(contentDir, 'zones/index.json'),
    ZoneIndexSchema
  ))

  // Validate individual zones
  const zoneIndex = loadJson(join(contentDir, 'zones/index.json'))
  for (const zone of zoneIndex.zones) {
    const zonePath = join(contentDir, 'zones', zone.file)
    if (existsSync(zonePath)) {
      results.push(validateFile(zonePath, ZoneSchema))
    } else {
      results.push({
        file: zonePath,
        valid: false,
        errors: [`File not found: ${zonePath}`],
        warnings: []
      })
    }
  }

  // Validate monster index
  results.push(validateFile(
    join(contentDir, 'monsters/index.json'),
    MonsterIndexSchema
  ))

  // Validate individual monsters
  const monsterIndex = loadJson(join(contentDir, 'monsters/index.json'))
  for (const monster of monsterIndex.monsters) {
    const monsterPath = join(contentDir, 'monsters', monster.file)
    if (existsSync(monsterPath)) {
      results.push(validateFile(monsterPath, MonsterSchema))
    } else {
      results.push({
        file: monsterPath,
        valid: false,
        errors: [`File not found: ${monsterPath}`],
        warnings: []
      })
    }
  }

  // Validate item index
  results.push(validateFile(
    join(contentDir, 'items/index.json'),
    ItemIndexSchema
  ))

  // Validate trait index
  results.push(validateFile(
    join(contentDir, 'traits/index.json'),
    TraitIndexSchema
  ))

  // Validate achievement index
  results.push(validateFile(
    join(contentDir, 'achievements/index.json'),
    AchievementIndexSchema
  ))

  // Cross-reference validation
  console.log('🔗 Validating cross-references...\n')
  const crossRefErrors = validateCrossReferences(contentDir)
  if (crossRefErrors.length > 0) {
    results.push({
      file: 'cross-references',
      valid: false,
      errors: crossRefErrors,
      warnings: []
    })
  }

  // Print results
  let hasErrors = false
  for (const result of results) {
    if (!result.valid) {
      hasErrors = true
      console.log(`❌ ${result.file}`)
      for (const error of result.errors) {
        console.log(`   - ${error}`)
      }
    } else {
      console.log(`✅ ${result.file}`)
    }

    for (const warning of result.warnings) {
      console.log(`   ⚠️  ${warning}`)
    }
  }

  console.log('\n' + '='.repeat(60))

  if (hasErrors) {
    const errorCount = results.filter(r => !r.valid).length
    console.log(`\n❌ Validation failed: ${errorCount} file(s) with errors`)
    process.exit(1)
  } else {
    console.log(`\n✅ All ${results.length} content files validated successfully!`)
    process.exit(0)
  }
}

main().catch(error => {
  console.error('Validation script failed:', error)
  process.exit(1)
})
