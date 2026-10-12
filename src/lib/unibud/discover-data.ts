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

export type GlobalFact = { id: string; topic: string; kicker: string; title: string; summary: string };

// Empty until sourced, reviewed facts are added. Never seed invented discovery content.
export const GLOBAL_FACTS: GlobalFact[] = [];

export const CHALLENGES: Challenge[] = [];

export const GLOBAL_CLIPS: GlobalClip[] = [];
