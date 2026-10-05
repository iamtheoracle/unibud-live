-- Lync: persistent consistent-sharing state (not a login streak).
create table if not exists user_lync (
  user_id text primary key,
  count integer not null default 0,
  status text not null default 'inactive',
  last_share_day text,
  last_share_at timestamptz,
  started_at timestamptz,
  days_to_next_bonus integer,
  last_bonus_at_count integer,
  updated_at timestamptz not null default now()
);

create table if not exists lync_events (
  id text primary key,
  user_id text not null,
  type text not null,
  count integer not null default 0,
  milestone integer,
  created_at timestamptz not null default now()
);
create index if not exists lync_events_user_idx on lync_events (user_id, created_at desc);
