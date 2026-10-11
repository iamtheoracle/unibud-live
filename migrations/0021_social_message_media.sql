alter table social_messages add column if not exists media_id text;
alter table social_messages add column if not exists share_kind text;
alter table social_messages add column if not exists share_json text;
