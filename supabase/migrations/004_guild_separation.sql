-- Migration 004: Separate Guild data from GuildMaster
-- Guild = organization-level data (name, tabard)
-- GuildMaster = character-level data (stats, traits)

-- Add guild columns to players table (1:1 relationship)
ALTER TABLE players ADD COLUMN IF NOT EXISTS guild_name TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS guild_tabard JSONB;
ALTER TABLE players ADD COLUMN IF NOT EXISTS guild_level INTEGER DEFAULT 1;

-- Note: guild_masters already has player_id from initial schema (001)
-- No need to add it again

-- Migrate existing data: copy name from guild_masters to players
-- guild_masters doesn't have tabard column, so use default
-- Join through player_id since that's the FK relationship
UPDATE players p
SET
  guild_name = gm.name,
  guild_tabard = '{"primaryColor": "#6366f1", "secondaryColor": "#fbbf24", "pattern": "solid", "emblem": "sword"}'::jsonb,
  guild_level = 1
FROM guild_masters gm
WHERE gm.player_id = p.id
AND p.guild_name IS NULL;
