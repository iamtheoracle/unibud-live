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

export type GlobalFact = { id: string; kicker: string; title: string; summary: string; topic: string; image?: string };
/** Populated only from approved, real content. */
export const GLOBAL_FACTS: GlobalFact[] = [];

/** Populated only from approved, real content. */
export const CHALLENGES: Challenge[] = [];

/** Populated only from approved, real content. */
export const GLOBAL_CLIPS: GlobalClip[] = [];
