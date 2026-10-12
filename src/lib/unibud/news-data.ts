export type NewsItem = {
  id: string;
  category: "exams" | "scholarship" | "admission" | "deadline" | "campus" | "opportunity";
  source: string;
  institution: string;
  title: string;
  body: string;
  date: string;
  importance: "normal" | "high";
  audience: string;
};

/** Only verified, published notices belong here. No synthetic headlines. */
export const EDUCATIONAL_NEWS: NewsItem[] = [];
