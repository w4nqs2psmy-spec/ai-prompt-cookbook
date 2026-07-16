-- Tips table for standalone teaching tips/general advice
CREATE TABLE IF NOT EXISTS tips (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  tip_text       TEXT        NOT NULL,                -- The actual tip/advice
  description    TEXT        NOT NULL,                -- Why this tip matters
  subject        TEXT        NOT NULL DEFAULT 'general',
  level          TEXT        NOT NULL DEFAULT 'primary',
  tool           TEXT        NOT NULL DEFAULT 'any',
  use_case       TEXT        NOT NULL DEFAULT 'lesson_planning',
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  is_pro         BOOLEAN     NOT NULL DEFAULT false,
  is_approved    BOOLEAN     NOT NULL DEFAULT false,
  submitted_by   TEXT,                                -- Profile ID
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add counters to tips table
ALTER TABLE tips ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE tips ADD COLUMN IF NOT EXISTS copy_count INTEGER DEFAULT 0;
ALTER TABLE tips ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE tips ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_tips_is_approved ON tips(is_approved);
CREATE INDEX IF NOT EXISTS idx_tips_created_at ON tips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tips_subject ON tips(subject);

-- Enable RLS
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can read approved tips
DROP POLICY IF EXISTS tips_read_approved ON tips;
CREATE POLICY tips_read_approved ON tips
  FOR SELECT
  USING (is_approved = true);

-- RLS: Authenticated users can insert their own
DROP POLICY IF EXISTS tips_insert_authenticated ON tips;
CREATE POLICY tips_insert_authenticated ON tips
  FOR INSERT
  WITH CHECK (true);

-- RLS: Users can update their own, admins can update any
DROP POLICY IF EXISTS tips_update_own_or_admin ON tips;
CREATE POLICY tips_update_own_or_admin ON tips
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    (auth.uid()::text = submitted_by OR auth.uid()::text = current_setting('app.admin_id', true))
  );

-- RLS: Users can delete their own, admins can delete any
DROP POLICY IF EXISTS tips_delete_own_or_admin ON tips;
CREATE POLICY tips_delete_own_or_admin ON tips
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    (auth.uid()::text = submitted_by OR auth.uid()::text = current_setting('app.admin_id', true))
  );

-- Helper function: increment view count
CREATE OR REPLACE FUNCTION increment_tip_view_count(tip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tips SET view_count = GREATEST(view_count + 1, 0) WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function: increment copy count
CREATE OR REPLACE FUNCTION increment_tip_copy_count(tip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tips SET copy_count = GREATEST(copy_count + 1, 0) WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function: increment comment count
CREATE OR REPLACE FUNCTION increment_tip_comment_count(tip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tips SET comment_count = GREATEST(comment_count + 1, 0) WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function: decrement comment count
CREATE OR REPLACE FUNCTION decrement_tip_comment_count(tip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tips SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;
