-- Evidence-backed publication gates for the global academic registry.
-- Existing records are preserved, but unproven rows remain unpublished until reviewed.
-- NOT VALID constraints protect new/updated rows without making this additive migration
-- fail on legacy rows that must be audited and remediated separately.

alter table academic_institution_types
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_institutions
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_campuses
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_institution_aliases
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  add column if not exists verified_at timestamptz;

alter table academic_qualification_levels
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_programmes
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_curriculum_versions
  add column if not exists source_id text references academic_sources(id);

alter table academic_courses
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_syllabus_topics
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending_review','verified','rejected','stale')),
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_accreditations
  add column if not exists source_id text references academic_sources(id);

alter table academic_standards
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

-- A verified/public row must carry both a source identity and a review timestamp.
-- These are NOT VALID so old rows can be audited without blocking safe deployment.
alter table academic_institution_types
  add constraint academic_institution_types_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_institutions
  add constraint academic_institutions_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_campuses
  add constraint academic_campuses_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_institution_aliases
  add constraint academic_institution_aliases_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_qualification_levels
  add constraint academic_qualification_levels_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_programmes
  add constraint academic_programmes_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_curriculum_versions
  add constraint academic_curriculum_versions_evidence_gate
  check (status <> 'published' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_courses
  add constraint academic_courses_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_syllabus_topics
  add constraint academic_syllabus_topics_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_accreditations
  add constraint academic_accreditations_evidence_gate
  check (verified_at is null or source_id is not null) not valid;

alter table academic_standards
  add constraint academic_standards_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

create index if not exists academic_institution_types_publication_idx
  on academic_institution_types (verification_status, source_id);
create index if not exists academic_institutions_evidence_idx
  on academic_institutions (verification_status, source_id, verified_at);
create index if not exists academic_campuses_evidence_idx
  on academic_campuses (institution_id, verification_status, source_id);
create index if not exists academic_aliases_evidence_idx
  on academic_institution_aliases (institution_id, verification_status, source_id);
create index if not exists academic_levels_evidence_idx
  on academic_qualification_levels (framework_id, verification_status, source_id);
create index if not exists academic_programmes_evidence_idx
  on academic_programmes (institution_id, verification_status, source_id);
create index if not exists academic_courses_evidence_idx
  on academic_courses (institution_id, verification_status, source_id);
create index if not exists academic_syllabus_evidence_idx
  on academic_syllabus_topics (course_id, verification_status, source_id);
create index if not exists academic_accreditations_evidence_idx
  on academic_accreditations (institution_id, source_id, verified_at);
create index if not exists academic_standards_evidence_idx
  on academic_standards (verification_status, source_id, verified_at);

alter table academic_qualification_frameworks
  add column if not exists verified_at timestamptz,
  add column if not exists source_id text references academic_sources(id);

alter table academic_qualification_frameworks
  add constraint academic_qualification_frameworks_evidence_gate
  check (verification_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_standard_mappings
  add constraint academic_standard_mappings_evidence_gate
  check (review_status <> 'accepted' or (source_id is not null and reviewer_id is not null and assessed_at is not null)) not valid;

create index if not exists academic_frameworks_evidence_idx
  on academic_qualification_frameworks (verification_status, source_id, verified_at);
create index if not exists academic_standard_mappings_evidence_idx
  on academic_standard_mappings (review_status, source_id, assessed_at);

alter table academic_institution_aliases
  add constraint academic_institution_aliases_source_fk
  foreign key (source_id) references academic_sources(id) not valid;

alter table academic_countries
  add column if not exists source_id text references academic_sources(id),
  add column if not exists verified_at timestamptz;

alter table academic_authorities
  add column if not exists source_id text references academic_sources(id),
  add column if not exists verified_at timestamptz;

alter table academic_countries
  add constraint academic_countries_evidence_gate
  check (source_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

alter table academic_authorities
  add constraint academic_authorities_evidence_gate
  check (source_status <> 'verified' or (source_id is not null and verified_at is not null)) not valid;

create index if not exists academic_countries_evidence_idx
  on academic_countries (source_id, verified_at);
create index if not exists academic_authorities_evidence_idx
  on academic_authorities (country_code, source_id, verified_at);
