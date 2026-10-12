-- Visitor-readiness: persistent post topics and explicit post ownership for safe bulk deletion.
alter table posts add column if not exists category text not null default 'general';
alter table posts add column if not exists author_user_id text;

-- Safely associate legacy posts with their registered author when handles still match.
update posts p
set author_user_id = sp.user_id
from student_profiles sp
where p.author_user_id is null
  and p.author_handle = sp.handle;

alter table posts drop constraint if exists posts_category_check;
alter table posts add constraint posts_category_check
  check (category in ('general', 'learning', 'campus', 'opportunity', 'culture', 'question', 'announcement'));

create index if not exists posts_category_created_idx on posts (category, created_at desc);
create index if not exists posts_author_created_idx on posts (author_user_id, created_at desc);

-- First-party event ledger. Never store raw IP addresses, emails, or event payloads.
create table if not exists analytics_events (
  id text primary key,
  event_name text not null check (event_name in ('page_view', 'post_view', 'post_like', 'post_comment', 'post_share', 'category_filter')),
  page_path text not null,
  content_id text,
  session_key text,
  user_id text,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_created_idx on analytics_events (created_at desc);
create index if not exists analytics_events_content_idx on analytics_events (content_id, event_name, created_at desc);
create index if not exists analytics_events_name_idx on analytics_events (event_name, created_at desc);
