-- Add visual_traits column to heroes table
ALTER TABLE heroes
ADD COLUMN IF NOT EXISTS visual_traits JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN heroes.visual_traits IS 'Stored visual appearance traits: skinTone, hairColor, hairStyle, primaryColor, secondaryColor, faceShape';

-- Backfill existing heroes with deterministic visual traits based on their ID
-- This will be done via application code on first access, not SQL
-- (Keeping migration simple - visual traits will be generated on-demand for existing heroes)
