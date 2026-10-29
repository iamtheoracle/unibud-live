-- Quad hierarchy: Quad (communities) can contain Groups.
create table if not exists quad_groups (
  id text primary key,
  community_id text not null references communities(id) on delete cascade,
  name text not null,
  description text not null default '',
  kind text not null default 'general',
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists quad_groups_community_idx on quad_groups (community_id);

create table if not exists quad_group_members (
  group_id text not null references quad_groups(id) on delete cascade,
  user_id text not null,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
