-- Add counter for paid refreshes since last free refresh
-- This enables incremental refresh costs that reset on free/auto refresh
ALTER TABLE tavern_state
ADD COLUMN IF NOT EXISTS paid_refreshes_since_free INTEGER DEFAULT 0;

COMMENT ON COLUMN tavern_state.paid_refreshes_since_free IS 'Number of paid refreshes since last free refresh. Resets to 0 on free/auto refresh. Used to calculate incremental refresh cost.';
