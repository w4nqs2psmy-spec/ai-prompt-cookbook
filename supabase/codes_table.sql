-- Codes table for standalone code examples/snippets
CREATE TABLE IF NOT EXISTS codes (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  code_text      TEXT        NOT NULL,              -- The actual code
  code_language  TEXT        NOT NULL,              -- Language: JavaScript, Python, SQL, etc.
  description    TEXT        NOT NULL,              -- What the code does and why
  subject        TEXT        NOT NULL DEFAULT 'general',
  level          TEXT        NOT NULL DEFAULT 'primary',
  tool           TEXT        NOT NULL DEFAULT 'any',
  use_case       TEXT        NOT NULL DEFAULT 'lesson_planning',
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  is_pro         BOOLEAN     NOT NULL DEFAULT false,
  is_approved    BOOLEAN     NOT NULL DEFAULT false,
  submitted_by   TEXT,                              -- Profile ID
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add counters to codes table
ALTER TABLE codes ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS copy_count INTEGER DEFAULT 0;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE codes ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_codes_is_approved ON codes(is_approved);
CREATE INDEX IF NOT EXISTS idx_codes_created_at ON codes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_codes_subject ON codes(subject);

-- RLS: Anyone can read approved codes
DROP POLICY IF EXISTS codes_read_approved ON codes;
CREATE POLICY codes_read_approved ON codes
  FOR SELECT
  USING (is_approved = true);

-- RLS: Authenticated users can insert their own
DROP POLICY IF EXISTS codes_insert_authenticated ON codes;
CREATE POLICY codes_insert_authenticated ON codes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS: Users can update their own, admins can update any
DROP POLICY IF EXISTS codes_update_own_or_admin ON codes;
CREATE POLICY codes_update_own_or_admin ON codes
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    (auth.uid()::text = submitted_by OR auth.uid()::text = current_setting('app.admin_id', true))
  );

-- RLS: Users can delete their own, admins can delete any
DROP POLICY IF EXISTS codes_delete_own_or_admin ON codes;
CREATE POLICY codes_delete_own_or_admin ON codes
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    (auth.uid()::text = submitted_by OR auth.uid()::text = current_setting('app.admin_id', true))
  );

-- Helper function: increment view count
CREATE OR REPLACE FUNCTION increment_code_view_count(code_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE codes SET view_count = GREATEST(view_count + 1, 0) WHERE id = code_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function: increment copy count
CREATE OR REPLACE FUNCTION increment_code_copy_count(code_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE codes SET copy_count = GREATEST(copy_count + 1, 0) WHERE id = code_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function: increment comment count
CREATE OR REPLACE FUNCTION increment_code_comment_count(code_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE codes SET comment_count = GREATEST(comment_count + 1, 0) WHERE id = code_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function: decrement comment count
CREATE OR REPLACE FUNCTION decrement_code_comment_count(code_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE codes SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = code_id;
END;
$$ LANGUAGE plpgsql;
