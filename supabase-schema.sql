-- ============================================================
-- Anniversary Site — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Profiles: extends auth.users
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  nickname text,
  bio text,
  avatar_url text,
  love_language text,
  fav_things text[],
  created_at timestamptz default now()
);

create table photos (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references auth.users not null,
  storage_path text not null,
  caption text,
  taken_at date,
  chocolate_rating int check (chocolate_rating between 1 and 5),
  created_at timestamptz default now()
);

create table letters (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users not null,
  title text not null,
  body text not null,
  is_open_when boolean default false,
  unlock_condition text,
  opened_at timestamptz,
  created_at timestamptz default now()
);

create table memory_jar_notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users not null,
  body text not null,
  chocolate_rating int check (chocolate_rating between 1 and 5),
  created_at timestamptz default now()
);

create table puns (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users not null,
  body text not null,
  rating int check (rating between 1 and 5),
  rated_by uuid references auth.users,
  created_at timestamptz default now()
);

create table map_pins (
  id uuid primary key default gen_random_uuid(),
  added_by uuid references auth.users not null,
  lat double precision not null,
  lng double precision not null,
  title text not null,
  story text,
  pin_type text,
  photo_url text,
  visited_on date,
  created_at timestamptz default now()
);

create table songs (
  id uuid primary key default gen_random_uuid(),
  added_by uuid references auth.users not null,
  spotify_track_id text not null,
  note text,
  is_anthem boolean default false,
  created_at timestamptz default now()
);

create table bucket_items (
  id uuid primary key default gen_random_uuid(),
  added_by uuid references auth.users not null,
  title text not null,
  description text,
  is_done boolean default false,
  done_at timestamptz,
  created_at timestamptz default now()
);

-- ── Enable RLS on every table ────────────────────────────
alter table profiles enable row level security;
alter table photos enable row level security;
alter table letters enable row level security;
alter table memory_jar_notes enable row level security;
alter table puns enable row level security;
alter table map_pins enable row level security;
alter table songs enable row level security;
alter table bucket_items enable row level security;

-- ── Dev policies: any authenticated user ─────────────────
-- (tighten to OWNERS uuids before launch — see build plan)

create policy "authed read profiles"    on profiles    for select using (auth.role() = 'authenticated');
create policy "authed write profiles"   on profiles    for insert with check (auth.uid() = id);
create policy "authed update profiles"  on profiles    for update using (auth.uid() = id);

create policy "authed read photos"      on photos      for select using (auth.role() = 'authenticated');
create policy "authed write photos"     on photos      for insert with check (auth.uid() = uploaded_by);
create policy "authed update photos"    on photos      for update using (auth.uid() = uploaded_by);

create policy "authed read letters"     on letters     for select using (auth.role() = 'authenticated');
create policy "authed write letters"    on letters     for insert with check (auth.uid() = author_id);
create policy "authed update letters"   on letters     for update using (auth.role() = 'authenticated');

create policy "authed read jar"         on memory_jar_notes for select using (auth.role() = 'authenticated');
create policy "authed write jar"        on memory_jar_notes for insert with check (auth.uid() = author_id);

create policy "authed read puns"        on puns        for select using (auth.role() = 'authenticated');
create policy "authed write puns"       on puns        for insert with check (auth.uid() = author_id);
create policy "authed update puns"      on puns        for update using (auth.role() = 'authenticated');

create policy "authed read pins"        on map_pins    for select using (auth.role() = 'authenticated');
create policy "authed write pins"       on map_pins    for insert with check (auth.uid() = added_by);

create policy "authed read songs"       on songs       for select using (auth.role() = 'authenticated');
create policy "authed write songs"      on songs       for insert with check (auth.uid() = added_by);

create policy "authed read bucket"      on bucket_items for select using (auth.role() = 'authenticated');
create policy "authed write bucket"     on bucket_items for insert with check (auth.uid() = added_by);
create policy "authed update bucket"    on bucket_items for update using (auth.role() = 'authenticated');

-- ── Storage buckets (create via Supabase Dashboard → Storage) ──
-- photos   → private
-- avatars  → public
-- map-photos → private

-- ── Tighten before launch ────────────────────────────────
-- Replace 'UUID_CHAR' and 'UUID_RAG' with real UUIDs from Auth → Users
-- Then drop the dev policies above and run:
--
-- create policy "couple only photos" on photos for all
--   using (auth.uid() in ('UUID_CHAR', 'UUID_RAG'))
--   with check (auth.uid() in ('UUID_CHAR', 'UUID_RAG'));
--
-- (repeat for each table)
