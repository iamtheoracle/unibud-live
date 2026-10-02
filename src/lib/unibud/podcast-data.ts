export type EduPodcast = {
  id: string;
  title: string;
  lecturer: string;
  lecturerHandle: string;
  course: string;
  subject: string;
  topic: string;
  episode: number;
  duration: string;
  publishedAt: string;
  programme: string;
  classId?: string;
};

export const EDU_PODCASTS: EduPodcast[] = [];
