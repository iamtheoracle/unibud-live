export type SpillReply = {
  id: string;
  authorHandle: string;
  body: string;
  parentId?: string;
  createdAt: string;
};

export type SpillPost = {
  id: string;
  authorHandle: string;
  body: string;
  createdAt: string;
  communityId?: string;
  quoteId?: string;
  quotedFrom?: { handle: string; body: string };
  video?: string;
  replies: SpillReply[];
};

const ago = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const SEED_SPILLS: SpillPost[] = [];


export function spillById(id: string) {
  return SEED_SPILLS.find((s) => s.id === id);
}
