alter table social_conversations
  add column if not exists community_id text references communities(id) on delete cascade;

create unique index if not exists social_conversations_community_unique
  on social_conversations(community_id)
  where kind = 'community' and community_id is not null;
