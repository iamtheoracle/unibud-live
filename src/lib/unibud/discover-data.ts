/** Mix cards for Square. Location is a signal, not the product. */

export type Challenge = {
  id: string;
  title: string;
  body: string;
  topic: string;
  joins: number;
};

export type GlobalClip = {
  id: string;
  title: string;
  interest: string;
  src: string;
  authorHandle: string;
};

export const GLOBAL_FACTS = [] as const;

export const CHALLENGES: Challenge[] = [];

export const GLOBAL_CLIPS: GlobalClip[] = [];
