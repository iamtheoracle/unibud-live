-- Fixer: get-it-done requests, options, providers (no fabricated fulfillment)

create table if not exists fixer_requests (
  id text primary key,
  user_id text not null,
  raw_text text not null default '',
  kind text not null default 'other',
  status text not null default 'received',
  truth_label text not null default 'requires_action',
  chosen_option_id text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists fixer_requests_user_idx on fixer_requests (user_id, created_at desc);

create table if not exists fixer_options (
  id text primary key,
  request_id text not null references fixer_requests(id) on delete cascade,
  title text not null,
  summary text not null default '',
  provider_hint text not null default '',
  price_kobo integer,
  price_label text not null default '',
  truth_label text not null default 'estimated',
  action_kind text not null default 'redirect',
  href text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists fixer_options_request_idx on fixer_options (request_id, sort_order);

create table if not exists fixer_providers (
  id text primary key,
  name text not null,
  kind text not null default 'service',
  description text not null default '',
  owner_user_id text,
  available boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
