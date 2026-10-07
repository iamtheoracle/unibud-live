-- Fixer operations network: provider types, jobs, pricing ledger, assignment
-- Server-authoritative state machine. Never invent providers or prices.

alter table fixer_providers add column if not exists provider_type text not null default 'external_provider';
alter table fixer_providers add column if not exists service_area text not null default '';
alter table fixer_providers add column if not exists base_price_kobo integer;
alter table fixer_providers add column if not exists authorization_status text not null default 'pending';
-- authorization_status: pending | approved | suspended | revoked

create table if not exists fixer_jobs (
  id text primary key,
  request_id text not null references fixer_requests(id) on delete cascade,
  customer_id text not null,
  provider_id text references fixer_providers(id),
  category text not null default 'other',
  description text not null default '',
  status text not null default 'requested',
  customer_price_kobo integer,
  provider_cost_kobo integer,
  unibud_cost_kobo integer,
  unibud_margin_kobo integer,
  provider_payout_kobo integer,
  price_is_estimate boolean not null default true,
  pricing_json text not null default '{}',
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  location_note text not null default '',
  calendar_event_id text,
  conversation_id text,
  payment_status text not null default 'none',
  provider_acceptance text not null default 'pending',
  escalation text not null default 'automated',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists fixer_jobs_customer_idx on fixer_jobs (customer_id, created_at desc);
create index if not exists fixer_jobs_provider_idx on fixer_jobs (provider_id, status) where provider_id is not null;
create index if not exists fixer_jobs_request_idx on fixer_jobs (request_id);

create table if not exists fixer_job_events (
  id text primary key,
  job_id text not null references fixer_jobs(id) on delete cascade,
  actor_id text,
  from_status text,
  to_status text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists fixer_job_events_job_idx on fixer_job_events (job_id, created_at);
