-- Dungeon Farmers Database Schema
-- Migration 001: Initial schema for all core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PLAYERS TABLE
-- ============================================================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_supporter BOOLEAN DEFAULT FALSE,
  supporter_expires_at TIMESTAMPTZ,
  gold INTEGER DEFAULT 1000,
  gems INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HEROES TABLE
-- ============================================================================
CREATE TABLE heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'nonbinary')),
  culture TEXT NOT NULL,
  titles TEXT[] DEFAULT '{}',
  display_title TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  archetype TEXT NOT NULL CHECK (archetype IN ('tank', 'healer', 'debuffer', 'dps_melee', 'dps_ranged', 'caster')),
  archetype_tags TEXT[] DEFAULT '{}',
  base_stats JSONB NOT NULL, -- { combat, utility, survival }
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL,
  gameplay_traits JSONB DEFAULT '[]', -- Array of GameplayTrait objects
  story_trait_ids TEXT[] DEFAULT '{}',
  power INTEGER DEFAULT 0,
  equipment JSONB DEFAULT '{}', -- { head?, chest?, hands?, legs?, feet?, weapon?, accessory1?, accessory2? }
  prestige_level INTEGER DEFAULT 0,
  prestige_bonuses JSONB DEFAULT '{"combat": 0, "utility": 0, "survival": 0}',
  current_expedition_id UUID,
  is_favorite BOOLEAN DEFAULT FALSE,
  morale TEXT DEFAULT 'content' CHECK (morale IN ('miserable', 'unhappy', 'content', 'happy', 'jubilant')),
  morale_last_update TIMESTAMPTZ DEFAULT NOW(),
  is_on_expedition BOOLEAN DEFAULT FALSE,
  is_stationed BOOLEAN DEFAULT FALSE,
  stationed_zone_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_heroes_player_id ON heroes(player_id);
CREATE INDEX idx_heroes_is_on_expedition ON heroes(is_on_expedition);
CREATE INDEX idx_heroes_is_stationed ON heroes(is_stationed);

-- ============================================================================
-- GUILD MASTERS TABLE
-- ============================================================================
CREATE TABLE guild_masters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID UNIQUE NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'nonbinary')),
  culture TEXT NOT NULL,
  titles TEXT[] DEFAULT '{}',
  display_title TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  archetype TEXT NOT NULL CHECK (archetype IN ('tank', 'healer', 'debuffer', 'dps_melee', 'dps_ranged', 'caster')),
  archetype_tags TEXT[] DEFAULT '{}',
  base_stats JSONB NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL,
  gameplay_traits JSONB DEFAULT '[]',
  story_trait_ids TEXT[] DEFAULT '{}',
  power INTEGER DEFAULT 0,
  equipment JSONB DEFAULT '{}',
  prestige_level INTEGER DEFAULT 0,
  prestige_bonuses JSONB DEFAULT '{"combat": 0, "utility": 0, "survival": 0}',
  is_favorite BOOLEAN DEFAULT FALSE,
  morale TEXT DEFAULT 'content' CHECK (morale IN ('miserable', 'unhappy', 'content', 'happy', 'jubilant')),
  morale_last_update TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guild_masters_player_id ON guild_masters(player_id);

-- ============================================================================
-- TAVERN HEROES TABLE
-- ============================================================================
CREATE TABLE tavern_heroes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'nonbinary')),
  culture TEXT NOT NULL,
  titles TEXT[] DEFAULT '{}',
  display_title TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  archetype TEXT NOT NULL CHECK (archetype IN ('tank', 'healer', 'debuffer', 'dps_melee', 'dps_ranged', 'caster')),
  archetype_tags TEXT[] DEFAULT '{}',
  base_stats JSONB NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL,
  gameplay_traits JSONB DEFAULT '[]',
  story_trait_ids TEXT[] DEFAULT '{}',
  power INTEGER DEFAULT 0,
  equipment JSONB DEFAULT '{}',
  prestige_level INTEGER DEFAULT 0,
  prestige_bonuses JSONB DEFAULT '{"combat": 0, "utility": 0, "survival": 0}',
  current_expedition_id UUID,
  is_favorite BOOLEAN DEFAULT FALSE,
  morale TEXT DEFAULT 'content' CHECK (morale IN ('miserable', 'unhappy', 'content', 'happy', 'jubilant')),
  morale_last_update TIMESTAMPTZ DEFAULT NOW(),
  hire_cost_gold INTEGER NOT NULL,
  hire_cost_gems INTEGER DEFAULT 0,
  refresh_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tavern_heroes_player_id ON tavern_heroes(player_id);
CREATE INDEX idx_tavern_heroes_refresh_time ON tavern_heroes(refresh_time);

-- ============================================================================
-- PARTY PRESETS TABLE
-- ============================================================================
CREATE TABLE party_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hero_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_party_presets_player_id ON party_presets(player_id);

-- ============================================================================
-- EQUIPMENT TABLE
-- ============================================================================
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  slot TEXT NOT NULL CHECK (slot IN ('head', 'chest', 'hands', 'legs', 'feet', 'weapon', 'accessory')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  base_stats JSONB NOT NULL, -- { combat, utility, survival }
  item_level INTEGER NOT NULL,
  gear_score INTEGER NOT NULL,
  traits JSONB DEFAULT '[]', -- Array of EquipmentTrait objects
  max_traits INTEGER NOT NULL,
  set_id TEXT,
  set_name TEXT,
  is_equipped BOOLEAN DEFAULT FALSE,
  equipped_by UUID REFERENCES heroes(id) ON DELETE SET NULL,
  source_zone_id TEXT,
  source_subzone_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equipment_player_id ON equipment(player_id);
CREATE INDEX idx_equipment_equipped_by ON equipment(equipped_by);
CREATE INDEX idx_equipment_slot ON equipment(slot);
CREATE INDEX idx_equipment_rarity ON equipment(rarity);

-- ============================================================================
-- EXPEDITIONS TABLE
-- ============================================================================
CREATE TABLE expeditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('zone', 'story', 'dungeon')),
  hero_ids UUID[] NOT NULL,
  zone_id TEXT NOT NULL,
  subzone_id TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'extreme')),
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completes_at TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  efficiency INTEGER,
  rewards JSONB, -- { gold, xp, equipment: string[], familiarityGain, masteryGain }
  events JSONB DEFAULT '[]', -- Array of expedition events
  log JSONB, -- ExpeditionLog object
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expeditions_player_id ON expeditions(player_id);
CREATE INDEX idx_expeditions_is_completed ON expeditions(is_completed);
CREATE INDEX idx_expeditions_completes_at ON expeditions(completes_at);

-- ============================================================================
-- ZONE PROGRESS TABLE
-- ============================================================================
CREATE TABLE zone_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  is_unlocked BOOLEAN DEFAULT FALSE,
  familiarity INTEGER DEFAULT 0,
  is_mastered BOOLEAN DEFAULT FALSE,
  unlocked_subzones TEXT[] DEFAULT '{}',
  stationed_hero_id UUID REFERENCES heroes(id) ON DELETE SET NULL,
  stationed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, zone_id)
);

CREATE INDEX idx_zone_progress_player_id ON zone_progress(player_id);
CREATE INDEX idx_zone_progress_stationed_hero_id ON zone_progress(stationed_hero_id);

-- ============================================================================
-- SUBZONE PROGRESS TABLE
-- ============================================================================
CREATE TABLE subzone_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  zone_id TEXT NOT NULL,
  subzone_id TEXT NOT NULL,
  is_discovered BOOLEAN DEFAULT FALSE,
  mastery INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  best_efficiency INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, zone_id, subzone_id)
);

CREATE INDEX idx_subzone_progress_player_id ON subzone_progress(player_id);
CREATE INDEX idx_subzone_progress_zone_id ON subzone_progress(zone_id);

-- ============================================================================
-- EARNED TITLES TABLE
-- ============================================================================
CREATE TABLE earned_titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  hero_id UUID NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
  title_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hero_id, title_id)
);

CREATE INDEX idx_earned_titles_player_id ON earned_titles(player_id);
CREATE INDEX idx_earned_titles_hero_id ON earned_titles(hero_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavern_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subzone_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE earned_titles ENABLE ROW LEVEL SECURITY;

-- Players policies
CREATE POLICY "Users can view their own player data"
  ON players FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own player data"
  ON players FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Heroes policies
CREATE POLICY "Users can view their own heroes"
  ON heroes FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own heroes"
  ON heroes FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own heroes"
  ON heroes FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own heroes"
  ON heroes FOR DELETE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Guild Masters policies
CREATE POLICY "Users can view their own guild master"
  ON guild_masters FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own guild master"
  ON guild_masters FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own guild master"
  ON guild_masters FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Tavern Heroes policies
CREATE POLICY "Users can view their own tavern heroes"
  ON tavern_heroes FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own tavern heroes"
  ON tavern_heroes FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own tavern heroes"
  ON tavern_heroes FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own tavern heroes"
  ON tavern_heroes FOR DELETE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Party Presets policies
CREATE POLICY "Users can view their own party presets"
  ON party_presets FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own party presets"
  ON party_presets FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own party presets"
  ON party_presets FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own party presets"
  ON party_presets FOR DELETE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Equipment policies
CREATE POLICY "Users can view their own equipment"
  ON equipment FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own equipment"
  ON equipment FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own equipment"
  ON equipment FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own equipment"
  ON equipment FOR DELETE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Expeditions policies
CREATE POLICY "Users can view their own expeditions"
  ON expeditions FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own expeditions"
  ON expeditions FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own expeditions"
  ON expeditions FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own expeditions"
  ON expeditions FOR DELETE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Zone Progress policies
CREATE POLICY "Users can view their own zone progress"
  ON zone_progress FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own zone progress"
  ON zone_progress FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own zone progress"
  ON zone_progress FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Subzone Progress policies
CREATE POLICY "Users can view their own subzone progress"
  ON subzone_progress FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own subzone progress"
  ON subzone_progress FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own subzone progress"
  ON subzone_progress FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- Earned Titles policies
CREATE POLICY "Users can view their own earned titles"
  ON earned_titles FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own earned titles"
  ON earned_titles FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own earned titles"
  ON earned_titles FOR DELETE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_heroes_updated_at BEFORE UPDATE ON heroes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guild_masters_updated_at BEFORE UPDATE ON guild_masters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tavern_heroes_updated_at BEFORE UPDATE ON tavern_heroes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_party_presets_updated_at BEFORE UPDATE ON party_presets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expeditions_updated_at BEFORE UPDATE ON expeditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zone_progress_updated_at BEFORE UPDATE ON zone_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subzone_progress_updated_at BEFORE UPDATE ON subzone_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
