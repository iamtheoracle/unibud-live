-- SouLync: relationship discovery (NOT Lync, NOT Wayward, NOT Quad)
-- Private preferences and matching stay server-side; never public on Square.

create table if not exists soulync_profiles (
  user_id text primary key,
  enabled boolean not null default false,
  display_name text not null default '',
  bio text not null default '',
  intentions text not null default '',
  interests text not null default '[]',
  campus_visible boolean not null default true,
  discovery_paused boolean not null default false,
  visibility text not null default 'discoverable',
  min_age integer,
  max_age integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists soulync_interests (
  from_user_id text not null,
  to_user_id text not null,
  created_at timestamptz not null default now(),
  primary key (from_user_id, to_user_id),
  check (from_user_id <> to_user_id)
);
create index if not exists soulync_interests_to_idx on soulync_interests (to_user_id, created_at desc);

create table if not exists soulync_matches (
  id text primary key,
  user_a text not null,
  user_b text not null,
  conversation_id text,
  created_at timestamptz not null default now(),
  unmatched_at timestamptz,
  unique (user_a, user_b)
);
create index if not exists soulync_matches_a_idx on soulync_matches (user_a) where unmatched_at is null;
create index if not exists soulync_matches_b_idx on soulync_matches (user_b) where unmatched_at is null;

create table if not exists soulync_blocks (
  blocker_id text not null,
  blocked_id text not null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists soulync_reports (
  id text primary key,
  reporter_id text not null,
  reported_id text not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists soulync_reports_reporter_idx on soulync_reports (reporter_id, created_at desc);

-- Wayward: discovery / exploration (NOT Square, NOT SouLync, NOT Quad)
create table if not exists wayward_items (
  id text primary key,
  kind text not null,
  title text not null,
  summary text not null default '',
  category text not null default 'general',
  location text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  href text,
  image text,
  source text not null default 'unibud',
  age_gate integer not null default 0,
  campus_id text,
  tags text not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists wayward_items_category_idx on wayward_items (category, created_at desc);
create index if not exists wayward_items_kind_idx on wayward_items (kind, created_at desc);

create table if not exists wayward_saves (
  user_id text not null,
  item_id text not null references wayward_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists wayward_interactions (
  id text primary key,
  user_id text not null,
  item_id text not null,
  action text not null,
  created_at timestamptz not null default now()
);
create index if not exists wayward_interactions_user_idx on wayward_interactions (user_id, created_at desc);
