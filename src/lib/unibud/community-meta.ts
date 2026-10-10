export type CommunityAnnouncement = {
  id: string;
  title: string;
  body: string;
  by: string;
  createdAt: string;
};

/** No fixture community meta — real communities load from the database. */
export const COMMUNITY_META: Record<
  string,
  {
    chatId?: string;
    moderatorHandles?: string[];
    governorHandle?: string;
    announcements?: CommunityAnnouncement[];
  }
> = {};

const KIND_LABELS: Record<string, string> = {
  all: "All",
  class: "Class",
  club: "Club",
  interest: "Interest",
  faculty: "Faculty",
  campus: "Campus",
  study: "Study",
  society: "Society",
  department: "Department",
};

const KIND_COPY: Record<string, string> = {
  class: "Course cohort and class updates.",
  club: "Student club or society space.",
  interest: "People gathered around a shared interest.",
  faculty: "Faculty-level community.",
  campus: "Campus-wide community.",
  study: "Study group and peer learning.",
  society: "Student society.",
  department: "Department community.",
};

export function communityKindLabel(kind: string): string {
  const key = kind.trim().toLowerCase();
  if (KIND_LABELS[key]) return KIND_LABELS[key];
  if (!kind.trim()) return "Community";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function communityKindCopy(kind: string): string {
  const key = kind.trim().toLowerCase();
  return KIND_COPY[key] ?? "Community space on UNIBUD.";
}
