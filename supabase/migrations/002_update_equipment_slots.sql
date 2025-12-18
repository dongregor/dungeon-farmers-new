-- Migration 002: Update equipment slot enum values
-- Safely migrate from old slot names to new canonical names
--
-- Old values: 'armor', 'helmet', 'boots', 'accessory1', 'accessory2'
-- New values: 'head', 'chest', 'hands', 'legs', 'feet', 'accessory'
-- Unchanged: 'weapon'

-- ============================================================================
-- STEP 1: Drop the old check constraint
-- ============================================================================
ALTER TABLE equipment DROP CONSTRAINT IF EXISTS equipment_slot_check;

-- ============================================================================
-- STEP 2: Unequip accessory2 items to prevent orphaned equipment
-- ============================================================================
-- Since we're consolidating accessory1 and accessory2 into a single accessory slot,
-- unequip any accessory2 items before migration to maintain data consistency
UPDATE equipment
SET is_equipped = false, equipped_by = NULL
WHERE slot = 'accessory2' AND is_equipped = true;

-- ============================================================================
-- STEP 3: Migrate existing data to new slot values
-- ============================================================================
UPDATE equipment SET slot = 'head' WHERE slot = 'helmet';
UPDATE equipment SET slot = 'chest' WHERE slot = 'armor';
UPDATE equipment SET slot = 'feet' WHERE slot = 'boots';
UPDATE equipment SET slot = 'accessory' WHERE slot = 'accessory1';
UPDATE equipment SET slot = 'accessory' WHERE slot = 'accessory2';

-- ============================================================================
-- STEP 4: Add new check constraint with updated values
-- ============================================================================
ALTER TABLE equipment ADD CONSTRAINT equipment_slot_check
  CHECK (slot IN ('weapon', 'head', 'chest', 'hands', 'legs', 'feet', 'accessory'));

-- ============================================================================
-- STEP 5: Update hero equipment JSONB to use new slot names
-- ============================================================================
-- This handles the equipment JSONB field in the heroes table
-- Equipment is stored as { weapon?, head?, chest?, hands?, legs?, feet?, accessory? }

DO $$
DECLARE
  hero_record RECORD;
  new_equipment JSONB;
BEGIN
  FOR hero_record IN SELECT id, equipment FROM heroes WHERE equipment IS NOT NULL AND equipment != '{}'::jsonb
  LOOP
    new_equipment := hero_record.equipment;

    -- Rename helmet -> head
    IF new_equipment ? 'helmet' THEN
      new_equipment := new_equipment - 'helmet' || jsonb_build_object('head', new_equipment->'helmet');
    END IF;

    -- Rename armor -> chest
    IF new_equipment ? 'armor' THEN
      new_equipment := new_equipment - 'armor' || jsonb_build_object('chest', new_equipment->'armor');
    END IF;

    -- Rename boots -> feet
    IF new_equipment ? 'boots' THEN
      new_equipment := new_equipment - 'boots' || jsonb_build_object('feet', new_equipment->'boots');
    END IF;

    -- Rename accessory1 -> accessory (keep first accessory only)
    IF new_equipment ? 'accessory1' THEN
      new_equipment := new_equipment - 'accessory1' || jsonb_build_object('accessory', new_equipment->'accessory1');
    END IF;

    -- Remove accessory2 (game now uses single accessory slot)
    IF new_equipment ? 'accessory2' THEN
      new_equipment := new_equipment - 'accessory2';
    END IF;

    -- Update the hero with new equipment structure
    UPDATE heroes SET equipment = new_equipment, updated_at = NOW() WHERE id = hero_record.id;
  END LOOP;
END $$;

-- ============================================================================
-- STEP 6: Do the same for guild_masters table
-- ============================================================================
DO $$
DECLARE
  gm_record RECORD;
  new_equipment JSONB;
BEGIN
  FOR gm_record IN SELECT id, equipment FROM guild_masters WHERE equipment IS NOT NULL AND equipment != '{}'::jsonb
  LOOP
    new_equipment := gm_record.equipment;

    -- Rename helmet -> head
    IF new_equipment ? 'helmet' THEN
      new_equipment := new_equipment - 'helmet' || jsonb_build_object('head', new_equipment->'helmet');
    END IF;

    -- Rename armor -> chest
    IF new_equipment ? 'armor' THEN
      new_equipment := new_equipment - 'armor' || jsonb_build_object('chest', new_equipment->'armor');
    END IF;

    -- Rename boots -> feet
    IF new_equipment ? 'boots' THEN
      new_equipment := new_equipment - 'boots' || jsonb_build_object('feet', new_equipment->'boots');
    END IF;

    -- Rename accessory1 -> accessory
    IF new_equipment ? 'accessory1' THEN
      new_equipment := new_equipment - 'accessory1' || jsonb_build_object('accessory', new_equipment->'accessory1');
    END IF;

    -- Remove accessory2
    IF new_equipment ? 'accessory2' THEN
      new_equipment := new_equipment - 'accessory2';
    END IF;

    -- Update the guild master with new equipment structure
    UPDATE guild_masters SET equipment = new_equipment, updated_at = NOW() WHERE id = gm_record.id;
  END LOOP;
END $$;

-- ============================================================================
-- VERIFICATION: Check for any unmigrated data
-- ============================================================================
-- This query should return 0 rows if migration was successful
-- Uncomment to verify:
-- SELECT id, slot FROM equipment WHERE slot NOT IN ('weapon', 'head', 'chest', 'hands', 'legs', 'feet', 'accessory');
