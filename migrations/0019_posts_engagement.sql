-- Posts ownership, soft delete, and engagement indexes for Square.
alter table posts add column if not exists owner_user_id text;
alter table posts add column if not exists deleted_at timestamptz;

create index if not exists posts_created_desc_idx on posts (created_at desc);
create index if not exists posts_owner_user_idx on posts (owner_user_id);
create index if not exists posts_not_deleted_idx on posts (created_at desc) where deleted_at is null;

-- Default Square surface community (structure only — no fake members or posts).
insert into communities (id, name, kind, university_id, description, members)
values (
  'square',
  'Square',
  'campus',
  null,
  'The main student social surface on UNIBUD.',
  0
)
on conflict (id) do nothing;
