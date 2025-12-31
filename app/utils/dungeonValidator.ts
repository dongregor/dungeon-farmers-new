import type {
  Monster,
  SchematicDefinition,
  SlotDefinition,
  PlacedMonster,
  DungeonValidation,
  DungeonValidationError
} from '~~/types'

interface SlotValidationResult {
  valid: boolean
  errors: DungeonValidationError[]
}

export function validateSlotPlacement(
  monster: Monster,
  slot: SlotDefinition
): SlotValidationResult {
  const errors: DungeonValidationError[] = []

  // Check type requirement
  if (slot.allowedTypes !== 'any') {
    if (!slot.allowedTypes.includes(monster.type)) {
      errors.push({
        slotId: slot.id,
        code: 'wrong_type',
        message: `Slot requires ${slot.allowedTypes.join(' or ')}, got ${monster.type}`
      })
    }
  }

  // Check element requirement
  if (slot.requiredElements && slot.requiredElements.length > 0) {
    if (!slot.requiredElements.includes(monster.element)) {
      errors.push({
        slotId: slot.id,
        code: 'wrong_element',
        message: `Slot requires ${slot.requiredElements.join(' or ')} element, got ${monster.element}`
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function validateDungeon(
  schematic: SchematicDefinition,
  placedMonsters: PlacedMonster[]
): DungeonValidation {
  const errors: DungeonValidationError[] = []
  const warnings: string[] = []

  // Check for missing monsters
  for (const slot of schematic.slots) {
    const placed = placedMonsters.find(pm => pm.slotId === slot.id)
    if (!placed) {
      errors.push({
        slotId: slot.id,
        code: 'missing_monster',
        message: `Slot ${slot.position} has no monster assigned`
      })
    }
  }

  // Check for duplicate monsters
  const monsterIds = placedMonsters.map(pm => pm.monsterId)
  const duplicates = monsterIds.filter((id, index) => monsterIds.indexOf(id) !== index)

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)]
    for (const dupId of uniqueDuplicates) {
      const slots = placedMonsters
        .filter(pm => pm.monsterId === dupId)
        .map(pm => pm.slotId)

      errors.push({
        code: 'duplicate_monster',
        message: `Monster ${dupId} is placed in multiple slots: ${slots.join(', ')}`
      })
    }
  }

  // Validate each placement
  for (const placed of placedMonsters) {
    const slot = schematic.slots.find(s => s.id === placed.slotId)
    if (!slot) {
      errors.push({
        slotId: placed.slotId,
        code: 'missing_monster',
        message: `Unknown slot ID: ${placed.slotId}`
      })
      continue
    }

    const slotValidation = validateSlotPlacement(placed.monster, slot)
    errors.push(...slotValidation.errors)
  }

  // Add warnings for suboptimal placements
  for (const placed of placedMonsters) {
    const slot = schematic.slots.find(s => s.id === placed.slotId)
    if (slot?.themed) {
      const matchesTheme =
        (slot.themed.type === 'element' && placed.monster.element === slot.themed.value) ||
        (slot.themed.type === 'monster_type' && placed.monster.type === slot.themed.value) ||
        (slot.themed.type === 'family' && placed.monster.family === slot.themed.value)

      if (!matchesTheme) {
        warnings.push(`Slot ${slot.position} has ${slot.themed.value} theme bonus that won't apply to ${placed.monster.baseName}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
