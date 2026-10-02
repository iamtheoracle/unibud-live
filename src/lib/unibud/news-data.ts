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

export const EDUCATIONAL_NEWS: NewsItem[] = [];
