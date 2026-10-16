-- Riff's first durable social data model. User identity always comes from the verified server session.
create table if not exists riff_posts (
  id text primary key,
  author_user_id text not null references "user" ("id") on delete restrict,
  body text not null check (length(btrim(body)) between 1 and 10000),
  community_id text,
  quote_post_id text references riff_posts(id) on delete set null,
  media_id text references media_assets(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists riff_posts_feed_idx on riff_posts (created_at desc, id desc) where deleted_at is null;
create index if not exists riff_posts_author_idx on riff_posts (author_user_id, created_at desc, id desc) where deleted_at is null;
create index if not exists riff_posts_community_idx on riff_posts (community_id, created_at desc, id desc) where deleted_at is null;

create table if not exists riff_replies (
  id text primary key,
  post_id text not null references riff_posts(id) on delete cascade,
  parent_reply_id text references riff_replies(id) on delete set null,
  author_user_id text not null references "user" ("id") on delete restrict,
  body text not null check (length(btrim(body)) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists riff_replies_thread_idx on riff_replies (post_id, created_at desc, id desc) where deleted_at is null;
create index if not exists riff_replies_author_idx on riff_replies (author_user_id, created_at desc, id desc) where deleted_at is null;

create table if not exists riff_reactions (
  post_id text not null references riff_posts(id) on delete cascade,
  user_id text not null references "user" ("id") on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists riff_reactions_user_idx on riff_reactions (user_id, created_at desc);

create table if not exists riff_follows (
  post_id text not null references riff_posts(id) on delete cascade,
  user_id text not null references "user" ("id") on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists riff_follows_user_idx on riff_follows (user_id, created_at desc);

create table if not exists riff_reports (
  id text primary key,
  reporter_user_id text not null references "user" ("id") on delete restrict,
  post_id text references riff_posts(id) on delete restrict,
  reply_id text references riff_replies(id) on delete restrict,
  reason text not null check (reason in ('spam', 'harassment', 'hate', 'violence', 'sexual_content', 'self_harm', 'other')),
  details text not null default '' check (length(details) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  check ((post_id is not null)::int + (reply_id is not null)::int = 1)
);
create index if not exists riff_reports_status_idx on riff_reports (status, created_at asc);
create index if not exists riff_reports_post_idx on riff_reports (post_id, created_at desc) where post_id is not null;
create index if not exists riff_reports_reply_idx on riff_reports (reply_id, created_at desc) where reply_id is not null;
