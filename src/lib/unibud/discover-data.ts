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

/** Populated only from approved, real content. */
export const GLOBAL_FACTS = [] as const;

/** Populated only from approved, real content. */
export const CHALLENGES: Challenge[] = [];

/** Populated only from approved, real content. */
export const GLOBAL_CLIPS: GlobalClip[] = [];
