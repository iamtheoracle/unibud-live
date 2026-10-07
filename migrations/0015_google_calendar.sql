-- Google Calendar sync metadata (tokens never leave the server).
alter table calendar_events add column if not exists google_event_id text;
alter table calendar_events add column if not exists google_sync_status text not null default 'none';
alter table calendar_events add column if not exists google_sync_error text not null default '';

create table if not exists user_google_calendar (
  user_id text primary key,
  -- Refresh token stored server-side only. Never select this into client responses.
  refresh_token text,
  access_token text,
  access_token_expires_at timestamptz,
  calendar_id text not null default 'primary',
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked boolean not null default false
);

create index if not exists calendar_events_google_idx on calendar_events (google_event_id) where google_event_id is not null;
