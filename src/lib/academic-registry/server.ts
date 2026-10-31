import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { normalizeCountryCode } from "./types.ts";

export interface AcademicInstitutionSearchInput {
  countryCode: string;
  query?: string;
  institutionTypeId?: string;
  ownershipType?: string;
  administrativeRegion?: string;
  programmeLevelId?: string;
  subjectAreaCode?: string;
  limit?: number;
  offset?: number;
}

export interface AcademicInstitutionSearchResult {
  id: string;
  countryCode: string;
  institutionTypeId: string;
  institutionTypeLabel: string;
  name: string;
  legalName: string | null;
  slug: string;
  ownershipType: string;
  fundingOrGovernanceLabel: string | null;
  officialWebsite: string | null;
  operationalStatus: string;
  verificationStatus: string;
  campusesCount: number;
  programmesCount: number;
}

function parseSearchInput(input: AcademicInstitutionSearchInput) {
  const countryCode = normalizeCountryCode(input.countryCode);
  const query = input.query?.trim().slice(0, 160) || undefined;
  const limit = Number.isInteger(input.limit) ? Math.min(50, Math.max(1, input.limit!)) : 20;
  const offset = Number.isInteger(input.offset) ? Math.max(0, input.offset!) : 0;
  const ownershipType = input.ownershipType?.trim();
  const allowedOwnership = new Set([
    "public", "private", "faith_based", "community", "international", "mixed", "unknown",
  ]);
  if (ownershipType && !allowedOwnership.has(ownershipType)) {
    throw new Error("Unsupported institution ownership filter.");
  }
  return {
    countryCode,
    query,
    institutionTypeId: input.institutionTypeId?.trim() || undefined,
    ownershipType,
    administrativeRegion: input.administrativeRegion?.trim().slice(0, 120) || undefined,
    programmeLevelId: input.programmeLevelId?.trim() || undefined,
    subjectAreaCode: input.subjectAreaCode?.trim() || undefined,
    limit,
    offset,
  };
}

/** Public read-only search of verified catalogue records. Values are bound parameters. */
export const searchAcademicInstitutions = createServerFn({ method: "GET" })
  .validator((input: AcademicInstitutionSearchInput) => parseSearchInput(input))
  .handler(async ({ data }): Promise<AcademicInstitutionSearchResult[]> => {
    const sql = await getSql();
    const clauses = [
      "i.country_code = $1",
      "i.verification_status = 'verified'",
      "i.source_id is not null",
      "i.verified_at is not null",
      "i.operational_status <> 'closed'",
    ];
    const params: unknown[] = [data.countryCode];

    const addFilter = (sqlClause: string, value: unknown) => {
      params.push(value);
      clauses.push(sqlClause.replace("?", "$" + params.length));
    };

    if (data.query) {
      const pattern = "%" + data.query + "%";
      params.push(pattern, pattern, pattern, pattern, pattern, pattern, pattern);
      const first = params.length - 6;
      clauses.push(
        `(i.name ilike $${first}
          or coalesce(i.legal_name, '') ilike $${first+1}
          or coalesce(i.funding_or_governance_label, '') ilike $${first+2}
          or exists (select 1 from academic_institution_aliases ia where ia.institution_id = i.id
            and ia.verification_status = 'verified' and ia.source_id is not null and ia.verified_at is not null
            and ia.alias ilike $${first+3})
          or exists (select 1 from academic_programmes p where p.institution_id = i.id
            and p.verification_status = 'verified' and p.verified_at is not null and p.source_id is not null
            and p.name ilike $${first+4})
          or exists (select 1 from academic_courses c where c.institution_id = i.id
            and c.verification_status = 'verified' and c.verified_at is not null and c.source_id is not null
            and c.title ilike $${first+5})
          or exists (select 1 from academic_programmes p
            join academic_qualification_levels ql on ql.id = p.qualification_level_id
            join academic_qualification_frameworks qf on qf.id = ql.framework_id
            where p.institution_id = i.id and p.verification_status = 'verified'
              and p.verified_at is not null and p.source_id is not null
              and ql.verification_status = 'verified' and ql.verified_at is not null and ql.source_id is not null
              and qf.verification_status = 'verified' and qf.verified_at is not null and qf.source_id is not null
              and ql.level_label ilike $${first+6}))`,
      );
    }
    if (data.institutionTypeId) addFilter("i.institution_type_id = ?", data.institutionTypeId);
    if (data.ownershipType) addFilter("i.ownership_type = ?", data.ownershipType);
    if (data.administrativeRegion) {
      addFilter(
        `exists (select 1 from academic_campuses c where c.institution_id = i.id and c.verification_status = 'verified' and c.source_id is not null and c.verified_at is not null and c.administrative_region ilike ?)`,
        "%" + data.administrativeRegion + "%",
      );
    }
    if (data.programmeLevelId) {
      addFilter(
        `exists (select 1 from academic_programmes p where p.institution_id = i.id and p.verification_status = 'verified' and p.verified_at is not null and p.source_id is not null and p.qualification_level_id = ? and exists (select 1 from academic_qualification_levels ql join academic_qualification_frameworks qf on qf.id = ql.framework_id where ql.id = p.qualification_level_id and ql.verification_status = 'verified' and ql.verified_at is not null and ql.source_id is not null and qf.verification_status = 'verified' and qf.verified_at is not null and qf.source_id is not null))`,
        data.programmeLevelId,
      );
    }
    if (data.subjectAreaCode) {
      addFilter(
        `exists (select 1 from academic_programmes p where p.institution_id = i.id and p.verification_status = 'verified' and p.verified_at is not null and p.source_id is not null and p.subject_area_code = ?)`,
        data.subjectAreaCode,
      );
    }

    params.push(data.limit, data.offset);
    const limitParam = params.length - 1;
    const offsetParam = params.length;
    return sql.query<AcademicInstitutionSearchResult>(
      `select
        i.id,
        i.country_code as "countryCode",
        i.institution_type_id as "institutionTypeId",
        it.label as "institutionTypeLabel",
        i.name,
        i.legal_name as "legalName",
        i.slug,
        i.ownership_type as "ownershipType",
        i.funding_or_governance_label as "fundingOrGovernanceLabel",
        i.official_website as "officialWebsite",
        i.operational_status as "operationalStatus",
        i.verification_status as "verificationStatus",
        (select count(*)::int from academic_campuses c where c.institution_id = i.id and c.verification_status = 'verified' and c.source_id is not null and c.verified_at is not null) as "campusesCount",
        (select count(*)::int from academic_programmes p where p.institution_id = i.id and p.verification_status = 'verified' and p.source_id is not null and p.verified_at is not null) as "programmesCount"
      from academic_institutions i
      join academic_institution_types it on it.id = i.institution_type_id and it.verification_status = 'verified' and it.source_id is not null and it.verified_at is not null
      where ${clauses.join(" and ")}
      order by lower(i.name), i.id
      limit $${limitParam} offset $${offsetParam}`,
      params,
    );
  });

export type SerializableAcademicValue =
  | string
  | number
  | boolean
  | null
  | SerializableAcademicValue[]
  | { [key: string]: SerializableAcademicValue };

type SerializableAcademicRecord = Record<string, SerializableAcademicValue>;

export interface AcademicInstitutionDetails {
  institution: SerializableAcademicRecord;
  aliases: SerializableAcademicRecord[];
  campuses: SerializableAcademicRecord[];
  accreditations: SerializableAcademicRecord[];
  programmes: SerializableAcademicRecord[];
  courses: SerializableAcademicRecord[];
  syllabusTopics: SerializableAcademicRecord[];
  standards: SerializableAcademicRecord[];
  evidenceSources: SerializableAcademicRecord[];
}

/** Public details expose verified catalogue data and reviewed standards only. */
export const getAcademicInstitutionDetails = createServerFn({ method: "GET" })
  .validator((input: { institutionId: string }) => {
    const institutionId = input.institutionId.trim();
    if (!institutionId || institutionId.length > 200) {
      throw new Error("A valid institution ID is required.");
    }
    return { institutionId };
  })
  .handler(async ({ data }): Promise<AcademicInstitutionDetails | null> => {
    const sql = await getSql();
    const institutionRows = await sql.query<SerializableAcademicRecord>(
      `select i.id, i.country_code as "countryCode", i.name, i.legal_name as "legalName",
        i.slug, i.ownership_type as "ownershipType", i.funding_or_governance_label as "fundingOrGovernanceLabel",
        i.official_website as "officialWebsite", i.established_year as "establishedYear",
        i.operational_status as "operationalStatus", i.verification_status as "verificationStatus",
        i.description, it.label as "institutionTypeLabel", i.metadata
       from academic_institutions i
       join academic_institution_types it on it.id = i.institution_type_id
       where i.id = $1 and i.verification_status = 'verified' and i.source_id is not null and i.verified_at is not null and it.verification_status = 'verified' and it.source_id is not null and it.verified_at is not null`,
      [data.institutionId],
    );
    const institution = institutionRows[0];
    if (!institution) return null;

    const [aliases, campuses, accreditations, programmes, courses, syllabusTopics, standards, evidenceSources] = await Promise.all([
      sql.query<SerializableAcademicRecord>(
        `select alias, alias_type as "aliasType" from academic_institution_aliases where institution_id = $1 and verification_status = 'verified' and source_id is not null and verified_at is not null order by alias`,
        [data.institutionId],
      ),
      sql.query<SerializableAcademicRecord>(
        `select id, name, campus_type as "campusType", address, locality,
          administrative_region as "administrativeRegion", official_website as "officialWebsite"
         from academic_campuses where institution_id = $1 and operational_status <> 'closed' and verification_status = 'verified' and source_id is not null and verified_at is not null order by name`,
        [data.institutionId],
      ),
      sql.query<SerializableAcademicRecord>(
        `select id, accreditation_type as "accreditationType", status, reference_number as "referenceNumber",
          valid_from as "validFrom", valid_until as "validUntil", official_source_url as "officialSourceUrl",
          verified_at as "verifiedAt"
         from academic_accreditations where institution_id = $1 and verified_at is not null and source_id is not null and official_source_url is not null
         order by valid_until desc nulls last`,
        [data.institutionId],
      ),
      sql.query<SerializableAcademicRecord>(
        `select p.id, p.code, p.name, p.award_title as "awardTitle", p.subject_area_code as "subjectAreaCode",
          p.study_mode as "studyMode", p.attendance_mode as "attendanceMode",
          p.duration_value as "durationValue", p.duration_unit as "durationUnit",
          p.credit_system as "creditSystem", p.total_credits as "totalCredits",
          p.delivery_language as "deliveryLanguage", p.official_source_url as "officialSourceUrl",
          ql.level_label as "qualificationLevel", qf.name as "qualificationFramework",
          cv.id as "curriculumVersionId", cv.version_label as "curriculumVersion",
          cv.academic_session as "academicSession", cv.official_source_url as "curriculumSourceUrl"
         from academic_programmes p
         left join academic_qualification_levels ql on ql.id = p.qualification_level_id and ql.verification_status = 'verified' and ql.verified_at is not null and ql.source_id is not null
         left join academic_qualification_frameworks qf on qf.id = ql.framework_id and qf.verification_status = 'verified' and qf.verified_at is not null and qf.source_id is not null
         left join lateral (
           select id, version_label, academic_session, official_source_url
           from academic_curriculum_versions
           where programme_id = p.id and status = 'published' and verified_at is not null and source_id is not null
           order by effective_from desc nulls last
           limit 1
         ) cv on true
         where p.institution_id = $1 and p.verification_status = 'verified' and p.verified_at is not null and p.source_id is not null
           and p.operational_status <> 'closed'
         order by p.name`,
        [data.institutionId],
      ),
      sql.query<SerializableAcademicRecord>(
        `select c.id, c.programme_id as "programmeId", c.curriculum_version_id as "curriculumVersionId",
          c.code, c.title, c.description, c.stage_label as "stageLabel", c.year_or_level as "yearOrLevel",
          c.term_label as "termLabel", c.credit_value as "creditValue", c.contact_hours as "contactHours",
          c.prerequisites, c.learning_outcomes as "learningOutcomes", c.official_source_url as "officialSourceUrl",
          cv.version_label as "curriculumVersion", cv.academic_session as "academicSession"
         from academic_courses c
         left join academic_curriculum_versions cv on cv.id = c.curriculum_version_id
         where c.institution_id = $1 and c.verification_status = 'verified' and c.verified_at is not null and c.source_id is not null
           and (c.programme_id is null or exists (select 1 from academic_programmes p where p.id = c.programme_id and p.verification_status = 'verified' and p.verified_at is not null and p.source_id is not null))
           and (c.curriculum_version_id is null or exists (select 1 from academic_curriculum_versions cv2 where cv2.id = c.curriculum_version_id and cv2.status = 'published' and cv2.verified_at is not null and cv2.source_id is not null))
         order by c.programme_id, c.year_or_level nulls last, c.term_label, c.code, c.title`,
        [data.institutionId],
      ),
      sql.query<SerializableAcademicRecord>(
        `select st.id, st.course_id as "courseId", st.parent_topic_id as "parentTopicId",
          st.sequence_number as "sequenceNumber", st.title, st.description,
          st.expected_hours as "expectedHours", st.learning_outcomes as "learningOutcomes",
          st.assessment_methods as "assessmentMethods", st.source_url as "sourceUrl"
         from academic_syllabus_topics st
         join academic_courses c on c.id = st.course_id
         where c.institution_id = $1 and c.verification_status = 'verified' and c.verified_at is not null and c.source_id is not null
           and st.verification_status = 'verified' and st.verified_at is not null and st.source_id is not null
         order by st.course_id, st.sequence_number nulls last, st.title`,
        [data.institutionId],
      ),
      sql.query<SerializableAcademicRecord>(
        `select s.id, s.code, s.title, s.standard_type as "standardType", s.version_label as "versionLabel",
          m.entity_type as "entityType", m.entity_id as "entityId", m.compliance_status as "complianceStatus",
          m.evidence_note as "evidenceNote", s.official_source_url as "officialSourceUrl"
         from academic_standard_mappings m
         join academic_standards s on s.id = m.standard_id
         where m.review_status = 'accepted' and m.source_id is not null
           and m.reviewer_id is not null and m.assessed_at is not null
           and s.verification_status = 'verified' and s.verified_at is not null and s.source_id is not null
           and (
             (m.entity_type = 'institution' and m.entity_id = $1)
             or (m.entity_type = 'campus' and m.entity_id in
               (select id from academic_campuses where institution_id = $1 and verification_status = 'verified' and source_id is not null and verified_at is not null))
             or (m.entity_type = 'accreditation' and m.entity_id in
               (select id from academic_accreditations where institution_id = $1 and source_id is not null and verified_at is not null))
             or (m.entity_type = 'framework' and m.entity_id in
               (select id from academic_qualification_frameworks where country_code =
                 (select country_code from academic_institutions where id = $1)
                 and verification_status = 'verified' and source_id is not null and verified_at is not null))
             or (m.entity_type = 'level' and m.entity_id in
               (select ql.id from academic_qualification_levels ql
                 join academic_qualification_frameworks qf on qf.id = ql.framework_id
                 where qf.country_code = (select country_code from academic_institutions where id = $1)
                   and ql.verification_status = 'verified' and ql.source_id is not null and ql.verified_at is not null
                   and qf.verification_status = 'verified' and qf.source_id is not null and qf.verified_at is not null))
             or (m.entity_type = 'programme' and m.entity_id in
               (select id from academic_programmes where institution_id = $1 and verification_status = 'verified' and source_id is not null and verified_at is not null))
             or (m.entity_type = 'curriculum' and m.entity_id in
               (select cv.id from academic_curriculum_versions cv
                 join academic_programmes p on p.id = cv.programme_id
                 where p.institution_id = $1 and cv.status = 'published' and cv.source_id is not null and cv.verified_at is not null))
             or (m.entity_type = 'course' and m.entity_id in
               (select id from academic_courses where institution_id = $1 and verification_status = 'verified' and source_id is not null and verified_at is not null))
             or (m.entity_type = 'syllabus_topic' and m.entity_id in
               (select st.id from academic_syllabus_topics st
                 join academic_courses c on c.id = st.course_id
                 where c.institution_id = $1 and st.verification_status = 'verified'
                   and st.source_id is not null and st.verified_at is not null))
           )
         order by s.title`,
        [data.institutionId],
      ),
      sql.query<SerializableAcademicRecord>(
        `select distinct source.id, source.publisher_name as "publisherName",
          source.source_type as "sourceType", source.title, source.source_url as "sourceUrl",
          source.retrieved_at as "retrievedAt", source.content_hash as "contentHash"
         from academic_sources source
         where source.id in (
           select source_id from academic_institutions where id = $1
           union select source_id from academic_institution_types
             where id = (select institution_type_id from academic_institutions where id = $1)
           union select source_id from academic_campuses where institution_id = $1
           union select source_id from academic_institution_aliases where institution_id = $1
           union select source_id from academic_accreditations where institution_id = $1
           union select source_id from academic_programmes where institution_id = $1
           union select ql.source_id from academic_qualification_levels ql
             join academic_qualification_frameworks qf on qf.id = ql.framework_id
             where qf.country_code = (select country_code from academic_institutions where id = $1)
           union select source_id from academic_qualification_frameworks
             where country_code = (select country_code from academic_institutions where id = $1)
           union select cv.source_id from academic_curriculum_versions cv
             join academic_programmes p on p.id = cv.programme_id where p.institution_id = $1
           union select source_id from academic_courses where institution_id = $1
           union select st.source_id from academic_syllabus_topics st
             join academic_courses course on course.id = st.course_id where course.institution_id = $1
           union select mapping.source_id from academic_standard_mappings mapping
             where mapping.review_status = 'accepted' and mapping.entity_id in (
               select id from academic_institutions where id = $1
               union select id from academic_campuses where institution_id = $1
               union select id from academic_accreditations where institution_id = $1
               union select id from academic_programmes where institution_id = $1
               union select id from academic_courses where institution_id = $1
               union select st.id from academic_syllabus_topics st
                 join academic_courses course on course.id = st.course_id where course.institution_id = $1
             )
         )
         order by source.publisher_name, source.source_url`,
        [data.institutionId],
      ),
    ]);

    return { institution, aliases, campuses, accreditations, programmes, courses, syllabusTopics, standards, evidenceSources };
  });
