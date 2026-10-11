create table if not exists board_sessions (
  id text primary key,
  course_code text not null,
  lecturer_id text not null,
  title text not null,
  topic text not null default '',
  status text not null default 'scheduled'
    check (status in ('scheduled', 'live', 'ended', 'processing', 'available', 'cancelled')),
  starts_at timestamptz,
  duration_minutes integer not null default 60 check (duration_minutes between 5 and 720),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists board_sessions_course_start_idx
  on board_sessions (course_code, starts_at);
create index if not exists board_sessions_lecturer_idx
  on board_sessions (lecturer_id, starts_at);

alter table attendance_events
  add column if not exists event_key text;
create unique index if not exists attendance_events_idempotency_idx
  on attendance_events (session_id, user_id, event_key)
  where event_key is not null;
