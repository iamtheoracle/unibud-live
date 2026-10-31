-- Durable source identity, idempotent run keys, and per-record ingestion audit.
-- Cross-source identity matching remains a reviewed decision; matching never merges automatically.

alter table academic_import_runs
  add column if not exists idempotency_key text,
  add column if not exists adapter_version text,
  add column if not exists source_snapshot_hash text,
  add column if not exists heartbeat_at timestamptz,
  add column if not exists lease_expires_at timestamptz,
  add column if not exists requested_by text;

create unique index if not exists academic_import_runs_source_idempotency_uq
  on academic_import_runs (source_id, idempotency_key)
  where source_id is not null and idempotency_key is not null;

create table if not exists academic_external_identifiers (
  id text primary key,
  source_id text not null references academic_sources(id),
  country_code char(2) not null references academic_countries(code),
  entity_type text not null
    check (entity_type in ('authority','institution_type','institution','campus','accreditation','framework','level','programme','curriculum','course','syllabus_topic','standard')),
  entity_id text not null,
  external_id text not null,
  source_record_url text not null,
  source_content_hash text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_import_run_id text references academic_import_runs(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, entity_type, external_id),
  check (length(trim(external_id)) > 0),
  check (last_seen_at >= first_seen_at)
);

create index if not exists academic_external_identifiers_entity_idx
  on academic_external_identifiers (country_code, entity_type, entity_id);
create index if not exists academic_external_identifiers_run_idx
  on academic_external_identifiers (last_import_run_id);

create table if not exists academic_import_record_results (
  id text primary key,
  import_run_id text not null references academic_import_runs(id) on delete cascade,
  source_id text not null references academic_sources(id),
  entity_type text not null
    check (entity_type in ('authority','institution_type','institution','campus','accreditation','framework','level','programme','curriculum','course','syllabus_topic','standard')),
  external_id text not null,
  entity_id text,
  outcome text not null
    check (outcome in ('created','updated','unchanged','rejected','skipped','failed')),
  source_record_url text,
  source_content_hash text,
  error_code text,
  error_message text,
  processed_at timestamptz not null default now(),
  unique (import_run_id, entity_type, external_id),
  check ((outcome in ('rejected','failed') and error_message is not null) or outcome not in ('rejected','failed'))
);

create index if not exists academic_import_record_results_run_idx
  on academic_import_record_results (import_run_id, outcome);

-- Potential duplicates from different sources are proposals, not automatic merges.
create table if not exists academic_entity_match_reviews (
  id text primary key,
  country_code char(2) not null references academic_countries(code),
  entity_type text not null
    check (entity_type in ('institution','campus','programme','course')),
  left_entity_id text not null,
  right_entity_id text not null,
  match_method text not null
    check (match_method in ('official_identifier','exact_name','normalized_name','manual','other')),
  confidence numeric(5,4) check (confidence is null or confidence between 0 and 1),
  evidence_source_id text references academic_sources(id),
  evidence_note text,
  review_status text not null default 'pending_review'
    check (review_status in ('pending_review','accepted','rejected','superseded')),
  reviewer_id text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (left_entity_id < right_entity_id),
  unique (country_code, entity_type, left_entity_id, right_entity_id),
  check (review_status <> 'accepted' or
    (reviewer_id is not null and reviewed_at is not null and evidence_source_id is not null))
);

create index if not exists academic_entity_match_reviews_queue_idx
  on academic_entity_match_reviews (country_code, review_status, entity_type);

-- Keep the source identity on a record result/identifier aligned with the run
-- that produced it. Composite foreign keys prevent cross-source audit confusion.
alter table academic_import_runs
  add constraint academic_import_runs_id_source_unique unique (id, source_id);

alter table academic_external_identifiers
  add constraint academic_external_identifiers_run_source_fk
  foreign key (last_import_run_id, source_id)
  references academic_import_runs(id, source_id) not valid;

alter table academic_import_record_results
  add constraint academic_import_record_results_run_source_fk
  foreign key (import_run_id, source_id)
  references academic_import_runs(id, source_id) not valid;
