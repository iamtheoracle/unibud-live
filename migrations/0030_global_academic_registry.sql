-- Global, country-aware academic registry.
-- This is a shared reference catalogue, not user-owned study data.
-- Only publish records after source evidence and review; never seed invented institutions.
-- Keep country-specific categories and level mappings as data, not global enums.

create table if not exists academic_countries (
  code char(2) primary key,
  iso3_code char(3) unique,
  name text not null,
  official_name text,
  education_notes text,
  source_status text not null default 'unverified'
    check (source_status in ('unverified','partially_verified','verified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists academic_authorities (
  id text primary key,
  country_code char(2) not null references academic_countries(code),
  name text not null,
  authority_type text not null,
  jurisdiction text,
  official_website text,
  source_status text not null default 'unverified'
    check (source_status in ('unverified','partially_verified','verified')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, name, authority_type)
);

-- Taxonomy is deliberately extensible: one country may call a provider a
-- university, polytechnic, college of education, technical school, institute,
-- federal/state institution, or use a different statutory category.
create table if not exists academic_institution_types (
  id text primary key,
  country_code char(2) references academic_countries(code),
  code text not null,
  label text not null,
  description text,
  parent_type_id text references academic_institution_types(id),
  is_tertiary boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (country_code, code)
);

create table if not exists academic_institutions (
  id text primary key,
  country_code char(2) not null references academic_countries(code),
  institution_type_id text not null references academic_institution_types(id),
  name text not null,
  legal_name text,
  slug text not null,
  ownership_type text not null default 'unknown'
    check (ownership_type in ('public','private','faith_based','community','international','mixed','unknown')),
  funding_or_governance_label text,
  parent_institution_id text references academic_institutions(id),
  official_website text,
  established_year integer check (established_year is null or established_year between 1000 and 2200),
  operational_status text not null default 'unknown'
    check (operational_status in ('active','inactive','merged','closed','unknown')),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, slug)
);

create table if not exists academic_institution_aliases (
  id text primary key,
  institution_id text not null references academic_institutions(id) on delete cascade,
  alias text not null,
  alias_type text not null default 'other'
    check (alias_type in ('former_name','abbreviation','local_name','alternate_spelling','other')),
  source_id text,
  created_at timestamptz not null default now(),
  unique (institution_id, alias, alias_type)
);

create table if not exists academic_campuses (
  id text primary key,
  institution_id text not null references academic_institutions(id) on delete cascade,
  name text not null,
  campus_type text not null default 'campus',
  address text,
  locality text,
  administrative_region text,
  postal_code text,
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  official_website text,
  operational_status text not null default 'unknown'
    check (operational_status in ('active','inactive','closed','unknown')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id, name)
);

create table if not exists academic_accreditations (
  id text primary key,
  institution_id text not null references academic_institutions(id) on delete cascade,
  authority_id text references academic_authorities(id),
  programme_id text,
  accreditation_type text not null,
  status text not null
    check (status in ('accredited','provisional','suspended','withdrawn','expired','not_accredited','unknown')),
  reference_number text,
  valid_from date,
  valid_until date,
  official_source_url text,
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_until is null or valid_from is null or valid_until >= valid_from)
);

-- Qualification frameworks and their levels are country/framework-specific.
-- Store local wording and equivalency claims with evidence, never assume that
-- similarly named levels are automatically equivalent between countries.
create table if not exists academic_qualification_frameworks (
  id text primary key,
  country_code char(2) not null references academic_countries(code),
  authority_id text references academic_authorities(id),
  name text not null,
  short_name text,
  version_label text,
  official_source_url text,
  effective_from date,
  effective_until date,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','stale')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (country_code, name, version_label)
);

create table if not exists academic_qualification_levels (
  id text primary key,
  framework_id text not null references academic_qualification_frameworks(id) on delete cascade,
  level_code text not null,
  level_label text not null,
  sequence_number integer,
  description text,
  entry_requirements jsonb not null default '{}'::jsonb,
  learning_outcomes jsonb not null default '[]'::jsonb,
  official_source_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (framework_id, level_code)
);

create table if not exists academic_programmes (
  id text primary key,
  institution_id text not null references academic_institutions(id) on delete cascade,
  campus_id text references academic_campuses(id),
  authority_id text references academic_authorities(id),
  qualification_level_id text references academic_qualification_levels(id),
  code text,
  name text not null,
  award_title text,
  subject_area_code text,
  study_mode text,
  attendance_mode text,
  duration_value numeric(6,2) check (duration_value is null or duration_value > 0),
  duration_unit text check (duration_unit is null or duration_unit in ('weeks','months','years','semesters','terms')),
  credit_system text,
  total_credits numeric(8,2) check (total_credits is null or total_credits >= 0),
  delivery_language text,
  admission_requirements jsonb not null default '{}'::jsonb,
  operational_status text not null default 'unknown'
    check (operational_status in ('active','inactive','suspended','closed','unknown')),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  official_source_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id, code)
);

-- A programme can change its curriculum. Keep versions and effective dates
-- rather than overwriting historical syllabi or pretending one syllabus is universal.
create table if not exists academic_curriculum_versions (
  id text primary key,
  programme_id text not null references academic_programmes(id) on delete cascade,
  version_label text not null,
  academic_session text,
  effective_from date,
  effective_until date,
  status text not null default 'draft'
    check (status in ('draft','pending_review','published','superseded','withdrawn')),
  official_source_url text,
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (programme_id, version_label),
  check (effective_until is null or effective_from is null or effective_until >= effective_from)
);

-- Courses/modules are distinct from the complete award programme.
create table if not exists academic_courses (
  id text primary key,
  institution_id text not null references academic_institutions(id) on delete cascade,
  programme_id text references academic_programmes(id) on delete cascade,
  curriculum_version_id text references academic_curriculum_versions(id) on delete cascade,
  code text,
  title text not null,
  description text,
  stage_label text,
  year_or_level integer,
  term_label text,
  credit_value numeric(8,2) check (credit_value is null or credit_value >= 0),
  contact_hours numeric(8,2) check (contact_hours is null or contact_hours >= 0),
  prerequisites jsonb not null default '[]'::jsonb,
  learning_outcomes jsonb not null default '[]'::jsonb,
  official_source_url text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists academic_syllabus_topics (
  id text primary key,
  course_id text not null references academic_courses(id) on delete cascade,
  parent_topic_id text references academic_syllabus_topics(id) on delete cascade,
  sequence_number integer,
  title text not null,
  description text,
  expected_hours numeric(8,2) check (expected_hours is null or expected_hours >= 0),
  learning_outcomes jsonb not null default '[]'::jsonb,
  assessment_methods jsonb not null default '[]'::jsonb,
  source_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Source provenance is first-class: each record can be traced to an official
-- regulator, institution publication, government dataset, or reviewed source.
create table if not exists academic_sources (
  id text primary key,
  country_code char(2) references academic_countries(code),
  publisher_name text not null,
  source_type text not null
    check (source_type in ('regulator','government_dataset','institution_website','official_document','international_body','research','other')),
  title text,
  source_url text not null,
  published_at timestamptz,
  retrieved_at timestamptz not null default now(),
  content_hash text,
  licence_or_terms text,
  reliability_status text not null default 'unreviewed'
    check (reliability_status in ('unreviewed','official','reviewed','rejected','stale')),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists academic_source_assertions (
  id text primary key,
  source_id text not null references academic_sources(id) on delete cascade,
  entity_type text not null
    check (entity_type in ('country','authority','institution','campus','accreditation','framework','level','programme','curriculum','course','syllabus_topic')),
  entity_id text not null,
  field_name text not null,
  asserted_value jsonb not null,
  review_status text not null default 'pending_review'
    check (review_status in ('pending_review','accepted','rejected','superseded')),
  reviewed_at timestamptz,
  reviewer_id text,
  created_at timestamptz not null default now()
);

create table if not exists academic_import_runs (
  id text primary key,
  country_code char(2) references academic_countries(code),
  source_id text references academic_sources(id),
  importer_name text not null,
  source_version text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'queued'
    check (status in ('queued','running','succeeded','partial','failed','cancelled')),
  records_seen integer not null default 0 check (records_seen >= 0),
  records_created integer not null default 0 check (records_created >= 0),
  records_updated integer not null default 0 check (records_updated >= 0),
  records_rejected integer not null default 0 check (records_rejected >= 0),
  error_summary text,
  metadata jsonb not null default '{}'::jsonb
);

-- Country-specific quality/accreditation standards and evidence-backed mappings.
-- A standard's local identifier and wording are preserved; cross-country equivalence
-- must be represented by a separate reviewed claim, never inferred from its label.
create table if not exists academic_standards (
  id text primary key,
  country_code char(2) references academic_countries(code),
  authority_id text references academic_authorities(id),
  code text,
  title text not null,
  standard_type text not null,
  version_label text,
  description text,
  effective_from date,
  effective_until date,
  official_source_url text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','stale')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (effective_until is null or effective_from is null or effective_until >= effective_from)
);

create table if not exists academic_standard_mappings (
  id text primary key,
  standard_id text not null references academic_standards(id) on delete cascade,
  entity_type text not null
    check (entity_type in ('institution','campus','accreditation','framework','level','programme','curriculum','course','syllabus_topic')),
  entity_id text not null,
  compliance_status text not null default 'unknown'
    check (compliance_status in ('meets','partially_meets','does_not_meet','not_assessed','unknown')),
  source_id text references academic_sources(id),
  evidence_note text,
  assessed_at timestamptz,
  reviewer_id text,
  review_status text not null default 'pending_review'
    check (review_status in ('pending_review','accepted','rejected','superseded')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Programme-specific accreditation is linked after the programme table exists.
alter table academic_accreditations
  add constraint academic_accreditations_programme_fk
  foreign key (programme_id) references academic_programmes(id) on delete cascade;

create index if not exists academic_institutions_country_type_idx
  on academic_institutions (country_code, institution_type_id, verification_status);
create index if not exists academic_institutions_name_idx
  on academic_institutions (lower(name));
create index if not exists academic_campuses_institution_idx
  on academic_campuses (institution_id);
create index if not exists academic_programmes_institution_idx
  on academic_programmes (institution_id, operational_status);
create index if not exists academic_programmes_level_idx
  on academic_programmes (qualification_level_id);
create index if not exists academic_courses_programme_idx
  on academic_courses (programme_id, curriculum_version_id);
create index if not exists academic_syllabus_topics_course_idx
  on academic_syllabus_topics (course_id, sequence_number);
create index if not exists academic_sources_country_idx
  on academic_sources (country_code, reliability_status);
create index if not exists academic_source_assertions_review_idx
  on academic_source_assertions (review_status, entity_type);
create index if not exists academic_import_runs_country_idx
  on academic_import_runs (country_code, status);
