import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, MapPin, GraduationCap, ExternalLink, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getAcademicInstitutionDetails,
  searchAcademicInstitutions,
} from "@/lib/academic-registry/server";

export const Route = createFileRoute("/_app/academics")({ component: AcademicRegistry });

function AcademicRegistry() {
  const [countryCode, setCountryCode] = useState("NG");
  const [searchText, setSearchText] = useState("");
  const [ownershipType, setOwnershipType] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const registry = useQuery({
    queryKey: ["academic-registry", countryCode, searchText, ownershipType],
    queryFn: () => searchAcademicInstitutions({
      data: {
        countryCode,
        query: searchText.trim() || undefined,
        ownershipType: ownershipType === "all" ? undefined : ownershipType,
      },
    }),
    enabled: /^[a-z]{2}$/i.test(countryCode.trim()),
  });

  const details = useQuery({
    queryKey: ["academic-registry-details", selectedId],
    queryFn: () => getAcademicInstitutionDetails({ data: { institutionId: selectedId! } }),
    enabled: Boolean(selectedId),
  });

  return (
    <main className="safe-bottom px-5 pt-6 pb-10">
      <p className="kicker">Global education directory</p>
      <h1 className="mt-1 font-display text-4xl">Institution Registry</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Explore verified institutions, programmes, qualifications, curriculum versions,
        courses, syllabi, and standards by country. Each published record must have source evidence.
      </p>

      <section className="mt-6 rounded-3xl bg-card p-4 ring-1 ring-border">
        <label className="block text-xs font-medium text-muted-foreground" htmlFor="registry-country">
          Country code (ISO alpha-2)
        </label>
        <div className="mt-1 grid grid-cols-[5rem_1fr] gap-2">
          <Input
            id="registry-country"
            value={countryCode}
            onChange={(event) => {
              setCountryCode(event.target.value.toUpperCase().slice(0, 2));
              setSelectedId(null);
            }}
            maxLength={2}
            placeholder="NG"
            aria-label="Country code"
          />
          <div className="flex items-center rounded-xl bg-secondary px-3 text-xs text-muted-foreground">
            Examples: NG Nigeria · US United States · GB United Kingdom
          </div>
        </div>

        <label className="mt-4 block text-xs font-medium text-muted-foreground" htmlFor="registry-search">
          Institution, former name, or abbreviation
        </label>
        <div className="mt-1 flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="registry-search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search the official directory"
              className="pl-9"
            />
          </div>
          <select
            value={ownershipType}
            onChange={(event) => setOwnershipType(event.target.value)}
            className="h-10 max-w-32 rounded-xl border border-input bg-background px-2 text-xs"
            aria-label="Ownership"
          >
            <option value="all">All owners</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="faith_based">Faith-based</option>
            <option value="international">International</option>
            <option value="community">Community</option>
          </select>
        </div>
      </section>

      {registry.isPending ? (
        <div className="mt-6 space-y-3" aria-label="Loading institutions">
          <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
        </div>
      ) : registry.isError ? (
        <section className="mt-6 rounded-2xl border border-border p-4">
          <h2 className="font-medium">Registry data is unavailable</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The catalogue database or query service is not ready. No sample institutions are shown as real data.
          </p>
          <Button className="mt-3" variant="outline" onClick={() => void registry.refetch()}>
            Try again
          </Button>
        </section>
      ) : registry.data?.length ? (
        <section className="mt-6 space-y-3" aria-label="Verified institutions">
          <p className="text-xs text-muted-foreground">
            {registry.data.length} result{registry.data.length === 1 ? "" : "s"} on this page · verified records only
          </p>
          {registry.data.map((institution) => (
            <article key={institution.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary">
                  <GraduationCap className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {institution.institutionTypeLabel} · {institution.ownershipType.replaceAll("_", " ")}
                  </p>
                  <h2 className="mt-1 font-medium">{institution.name}</h2>
                  {institution.legalName && institution.legalName !== institution.name ? (
                    <p className="mt-1 text-xs text-muted-foreground">{institution.legalName}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {institution.campusesCount} campuses · {institution.programmesCount} verified programmes
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedId(institution.id)}>
                      View academic details
                    </Button>
                    {institution.officialWebsite ? (
                      <a
                        className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs underline"
                        href={institution.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Official website <ExternalLink className="size-3" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-dashed border-border p-5">
          <div className="grid size-10 place-items-center rounded-xl bg-secondary">
            <ShieldCheck className="size-5" />
          </div>
          <h2 className="mt-3 font-medium">No verified institutions found yet</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            This does not mean the country has no institutions. The source-backed registry is not populated for this search,
            or no record meets the verification rules. The next step is to connect official regulator and government datasets.
          </p>
        </section>
      )}

      {selectedId ? (
        <section className="mt-6 rounded-3xl bg-card p-5 ring-1 ring-border" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="kicker">Verified academic profile</p>
              <h2 className="mt-1 font-display text-2xl">
                {String(details.data?.institution?.name ?? "Institution details")}
              </h2>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setSelectedId(null)}>Close</Button>
          </div>
          {details.isPending ? (
            <div className="mt-4 h-24 animate-pulse rounded-xl bg-secondary" />
          ) : details.isError ? (
            <p className="mt-3 text-sm text-muted-foreground">Could not load details. Please try again.</p>
          ) : details.data ? (
            <div className="mt-4 space-y-5">
              <div>
                <h3 className="font-medium">Campuses</h3>
                {details.data.campuses.length ? (
                  <ul className="mt-2 space-y-2 text-sm">
                    {details.data.campuses.map((campus) => (
                      <li key={String(campus.id)} className="flex gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span>{String(campus.name)}{campus.administrativeRegion ? " · " + String(campus.administrativeRegion) : ""}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-1 text-sm text-muted-foreground">No verified campus records yet.</p>}
              </div>
              <div>
                <h3 className="font-medium">Programmes and qualification levels</h3>
                {details.data.programmes.length ? (
                  <ul className="mt-2 space-y-2 text-sm">
                    {details.data.programmes.map((programme) => (
                      <li key={String(programme.id)} className="rounded-xl bg-secondary p-3">
                        <p className="font-medium">{String(programme.name)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {String(programme.qualificationLevel ?? "Level not recorded")}
                          {programme.awardTitle ? " · " + String(programme.awardTitle) : ""}
                        </p>
                        {programme.officialSourceUrl ? (
                          <a className="mt-1 inline-block text-xs underline" href={String(programme.officialSourceUrl)} target="_blank" rel="noopener noreferrer">Programme source</a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-1 text-sm text-muted-foreground">No verified programmes recorded yet.</p>}
              </div>
              <div>
                <h3 className="font-medium">Courses and stages</h3>
                {details.data.courses.length ? (
                  <ul className="mt-2 space-y-2 text-sm">
                    {details.data.courses.map((course) => (
                      <li key={String(course.id)} className="rounded-xl bg-secondary p-3">
                        <p className="font-medium">{course.code ? String(course.code) + " · " : ""}{String(course.title)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[course.stageLabel, course.yearOrLevel ? "Year/level " + String(course.yearOrLevel) : null, course.termLabel, course.creditValue ? String(course.creditValue) + " credits" : null].filter(Boolean).map(String).join(" · ") || "Stage not recorded"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-1 text-sm text-muted-foreground">No verified course records yet.</p>}
              </div>
              <div>
                <h3 className="font-medium">Syllabus and learning outcomes</h3>
                {details.data.syllabusTopics.length ? (
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
                    {details.data.syllabusTopics.map((topic) => (
                      <li key={String(topic.id)}>
                        <span className="font-medium">{String(topic.title)}</span>
                        {topic.description ? <p className="mt-1 text-muted-foreground">{String(topic.description)}</p> : null}
                        {topic.sourceUrl ? <a className="mt-1 inline-block text-xs underline" href={String(topic.sourceUrl)} target="_blank" rel="noopener noreferrer">Syllabus source</a> : null}
                      </li>
                    ))}
                  </ol>
                ) : <p className="mt-1 text-sm text-muted-foreground">No verified syllabus topics recorded yet.</p>}
              </div>
              <div>
                <h3 className="font-medium">Accreditation and standards</h3>
                {details.data.accreditations.length || details.data.standards.length ? (
                  <ul className="mt-2 space-y-2 text-sm">
                    {details.data.accreditations.map((item) => (
                      <li key={String(item.id)} className="rounded-xl bg-secondary p-3">
                        <p className="font-medium">{String(item.accreditationType)} · {String(item.status)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.referenceNumber ? "Ref " + String(item.referenceNumber) + " · " : ""}
                          {item.validFrom ? String(item.validFrom) : "Start date unknown"} – {item.validUntil ? String(item.validUntil) : "No end date recorded"}
                        </p>
                        {item.officialSourceUrl ? <a className="mt-1 inline-block text-xs underline" href={String(item.officialSourceUrl)} target="_blank" rel="noopener noreferrer">Accreditation source</a> : null}
                      </li>
                    ))}
                    {details.data.standards.map((item) => (
                      <li key={String(item.id) + String(item.entityId)} className="rounded-xl bg-secondary p-3">
                        <p className="font-medium">{String(item.title)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Assessment: {String(item.complianceStatus).replaceAll("_", " ")}</p>
                        {item.officialSourceUrl ? <a className="mt-1 inline-block text-xs underline" href={String(item.officialSourceUrl)} target="_blank" rel="noopener noreferrer">Standard source</a> : null}
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-1 text-sm text-muted-foreground">No verified accreditation or standards mapping recorded yet.</p>}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">This institution is not currently published as verified.</p>
          )}
        </section>
      ) : null}
    </main>
  );
}
