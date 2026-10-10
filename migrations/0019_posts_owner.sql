-- Ownership column for Square posts (session user id). Nullable for legacy rows.
alter table posts add column if not exists owner_user_id text;
create index if not exists posts_owner_user_idx on posts (owner_user_id);
