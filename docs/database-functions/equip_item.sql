-- Supabase RPC function for atomic equipment operations
-- This function wraps equipment equip operations in a database transaction
-- to prevent race conditions and ensure data consistency

CREATE OR REPLACE FUNCTION equip_item(
  p_player_id UUID,
  p_hero_id UUID,
  p_equipment_id UUID,
  p_slot TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_previous_equipment_id UUID;
  v_hero_equipment JSONB;
  v_result JSONB;
BEGIN
  -- Start transaction (implicit in function)

  -- 1. Verify equipment ownership and get current hero equipment
  SELECT equipment INTO v_hero_equipment
  FROM heroes
  WHERE id = p_hero_id AND player_id = p_player_id
  FOR UPDATE; -- Lock the hero row

  IF v_hero_equipment IS NULL THEN
    RAISE EXCEPTION 'Hero not found or not owned by player';
  END IF;

  -- Get currently equipped item in this slot
  v_previous_equipment_id := (v_hero_equipment->>p_slot)::UUID;

  -- 2. Unequip previous item (if exists)
  IF v_previous_equipment_id IS NOT NULL THEN
    UPDATE equipment
    SET is_equipped = false,
        equipped_by = NULL,
        updated_at = NOW()
    WHERE id = v_previous_equipment_id
      AND player_id = p_player_id;
  END IF;

  -- 3. Equip new item
  UPDATE equipment
  SET is_equipped = true,
      equipped_by = p_hero_id,
      updated_at = NOW()
  WHERE id = p_equipment_id
    AND player_id = p_player_id
    AND slot = p_slot;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Equipment not found, wrong slot, or not owned by player';
  END IF;

  -- 4. Update hero's equipment mapping
  UPDATE heroes
  SET equipment = jsonb_set(
        COALESCE(equipment, '{}'::jsonb),
        ARRAY[p_slot],
        to_jsonb(p_equipment_id::TEXT)
      ),
      updated_at = NOW()
  WHERE id = p_hero_id
    AND player_id = p_player_id;

  -- 5. Return updated data
  SELECT jsonb_build_object(
    'success', true,
    'previousEquipmentId', v_previous_equipment_id,
    'newEquipmentId', p_equipment_id
  ) INTO v_result;

  RETURN v_result;

  -- Transaction commits automatically on successful completion
  -- Rolls back automatically on exception
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION equip_item(UUID, UUID, UUID, TEXT) TO authenticated;

-- Example usage:
-- SELECT * FROM equip_item(
--   'player-uuid'::UUID,
--   'hero-uuid'::UUID,
--   'equipment-uuid'::UUID,
--   'weapon'
-- );
