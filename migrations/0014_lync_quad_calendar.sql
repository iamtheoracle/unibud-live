-- Lync: persist earned milestones across streak resets + longest streak
alter table user_lync add column if not exists earned_milestones text not null default '[]';
alter table user_lync add column if not exists longest_streak integer not null default 0;

-- Quad: privacy + ownership
alter table communities add column if not exists privacy text not null default 'public';
alter table communities add column if not exists created_by text;
alter table community_members add column if not exists role text not null default 'member';

-- Spark calendar events (tutoring, community service, general)
create table if not exists calendar_events (
  id text primary key,
  user_id text not null,
  kind text not null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  participants text not null default '[]',
  source_id text,
  source_type text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists calendar_events_user_idx on calendar_events (user_id, starts_at);

create table if not exists tutoring_bookings (
  id text primary key,
  student_id text not null,
  tutor_handle text not null,
  subject text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  calendar_event_id text,
  created_at timestamptz not null default now()
);
create index if not exists tutoring_bookings_student_idx on tutoring_bookings (student_id, starts_at);

create table if not exists service_commitments (
  id text primary key,
  user_id text not null,
  service_id text,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  calendar_event_id text,
  created_at timestamptz not null default now()
);
create index if not exists service_commitments_user_idx on service_commitments (user_id, starts_at);
