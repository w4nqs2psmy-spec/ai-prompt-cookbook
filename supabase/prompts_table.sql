-- ─────────────────────────────────────────────────────────────────────────────
-- AI Prompt Cookbook — prompts table
-- Run this in your Supabase project's SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS prompts (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  description    TEXT        NOT NULL,
  prompt_text    TEXT        NOT NULL,
  subject        TEXT        NOT NULL DEFAULT 'general',
  level          TEXT        NOT NULL DEFAULT 'primary',
  tool           TEXT        NOT NULL DEFAULT 'any',
  use_case       TEXT        NOT NULL DEFAULT 'lesson_planning',
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  example_output TEXT,
  tips           TEXT,
  is_pro         BOOLEAN     NOT NULL DEFAULT false,
  is_approved    BOOLEAN     NOT NULL DEFAULT false,
  submitted_by   TEXT,        -- optional: display name / profile id
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- All reads and writes go through the service-role client (server-side only),
-- which bypasses RLS entirely. No public API access is needed.
-- The policy below simply prevents accidental direct anon access.

-- Allow reading only approved prompts for authenticated users (optional future use)
CREATE POLICY "Public can read approved prompts"
  ON prompts
  FOR SELECT
  USING (is_approved = true);

-- No INSERT / UPDATE / DELETE policies for anon — all mutations go through
-- server actions using the service_role key which bypasses RLS.
