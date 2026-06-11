create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  steam_id text unique,
  display_name text not null,
  avatar_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  appid integer not null unique,
  name text not null,
  image text,
  genres jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  store_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  appid integer not null,
  name text not null,
  image text,
  playtime_minutes integer not null default 0,
  playtime_hours numeric(10, 1) not null default 0,
  last_played_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, appid)
);

create index if not exists user_games_user_id_idx
  on public.user_games(user_id);

create index if not exists user_games_appid_idx
  on public.user_games(appid);
