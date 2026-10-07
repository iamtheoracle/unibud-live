create table if not exists feedback_submissions (
  id text primary key,
  user_id text,
  email text not null default '',
  category text not null default 'general',
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists feedback_created_idx on feedback_submissions (created_at desc);

alter table student_profiles add column if not exists faculty text not null default '';
alter table student_profiles add column if not exists level_label text not null default '';
alter table student_profiles add column if not exists semester_label text not null default '';
