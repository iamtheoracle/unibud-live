create table if not exists social_connection_requests (
  requester_id text not null,
  recipient_id text not null,
  status text not null check (status in ('pending', 'accepted', 'declined', 'cancelled', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);

create index if not exists social_connection_requests_recipient_idx
  on social_connection_requests (recipient_id, status, created_at desc);
create index if not exists social_connection_requests_requester_idx
  on social_connection_requests (requester_id, status, created_at desc);

create table if not exists social_follows (
  follower_id text not null,
  followed_id text not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);

create index if not exists social_follows_followed_idx
  on social_follows (followed_id, created_at desc);
