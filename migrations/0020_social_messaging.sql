create table if not exists social_conversations (
  id text primary key,
  kind text not null default 'direct' check (kind in ('direct','group','class','study','community')),
  title text not null default '',
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists social_conversation_members (
  conversation_id text not null references social_conversations(id) on delete cascade,
  user_id text not null,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);
create index if not exists social_members_user_idx on social_conversation_members(user_id, joined_at desc);
create table if not exists social_messages (
  id text primary key,
  conversation_id text not null references social_conversations(id) on delete cascade,
  sender_id text not null,
  body text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  check (length(body) between 1 and 10000)
);
create index if not exists social_messages_conversation_idx on social_messages(conversation_id, created_at desc);
