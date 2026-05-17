-- ============================================================
-- AI Prompt Cookbook – Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────
-- Mirrors auth.users; stores the is_pro flag per account.
-- A trigger automatically inserts a row when a new user signs up.

create table public.profiles (
  id       uuid references auth.users(id) on delete cascade primary key,
  email    text not null,
  is_pro   boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile row only
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Trigger: auto-create profile row on first sign-in / sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── submitted_prompts ────────────────────────────────────────
-- Community-submitted prompts awaiting admin review.

create table public.submitted_prompts (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text not null,
  prompt_text    text not null,
  subject        text not null,
  level          text not null,
  tool           text not null,
  use_case       text not null,
  tags           text[] not null default '{}',
  example_output text,
  tips           text,
  is_pro         boolean not null default false,
  is_approved    boolean not null default false,
  submitted_by   text not null,       -- stores user email
  created_at     timestamptz not null default now()
);

alter table public.submitted_prompts enable row level security;

-- Authenticated users can insert their own prompts
create policy "Authenticated users can insert"
  on public.submitted_prompts for insert
  to authenticated
  with check (submitted_by = auth.jwt()->>'email');

-- Users can read their own (pending) submissions
create policy "Users can read own submissions"
  on public.submitted_prompts for select
  to authenticated
  using (submitted_by = auth.jwt()->>'email');

-- NOTE: Admin read/update/delete operations use the service_role key
-- (server actions in app/actions/adminActions.ts) which bypasses RLS entirely.
-- No additional admin policies are needed.


-- ── To upgrade a user to Pro ─────────────────────────────────
-- Run this in the SQL editor, replacing the email:
--
--   update public.profiles set is_pro = true
--   where email = 'teacher@school.fi';
