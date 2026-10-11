-- Persistent room catalogue and membership. Room messages remain in the existing
-- room_messages table, but access is now derived from database membership rather
-- than a static in-memory catalogue.
create table if not exists campus_rooms (
  id text primary key,
  kind text not null check (kind in ('group','class','study','community')),
  title text not null,
  subtitle text not null default '',
  created_by text not null,
  community_id text references communities(id) on delete cascade,
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists campus_room_members (
  room_id text not null references campus_rooms(id) on delete cascade,
  user_id text not null,
  role text not null default 'member' check (role in ('owner','moderator','member')),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create index if not exists campus_room_members_user_idx
  on campus_room_members(user_id, joined_at desc);
create index if not exists campus_rooms_updated_idx
  on campus_rooms(updated_at desc);
create index if not exists room_messages_room_created_idx
  on room_messages(room_id, created_at);
