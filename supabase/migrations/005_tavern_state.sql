-- ============================================================================
-- MIGRATION 005: Add tavern_state table
-- ============================================================================
-- The tavern system stores available heroes as a JSON array of slots
-- rather than individual rows per hero. This allows for flexible slot
-- configurations based on account level progression.
-- ============================================================================

-- ============================================================================
-- TAVERN STATE TABLE
-- ============================================================================
CREATE TABLE tavern_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  slots JSONB DEFAULT '[]',
  last_refresh_at TIMESTAMPTZ DEFAULT NOW(),
  next_refresh_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id)
);

CREATE INDEX idx_tavern_state_player_id ON tavern_state(player_id);
CREATE INDEX idx_tavern_state_next_refresh ON tavern_state(next_refresh_at);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE tavern_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tavern state"
  ON tavern_state FOR SELECT
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own tavern state"
  ON tavern_state FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update their own tavern state"
  ON tavern_state FOR UPDATE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own tavern state"
  ON tavern_state FOR DELETE
  USING (player_id IN (SELECT id FROM players WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_tavern_state_updated_at BEFORE UPDATE ON tavern_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
