/** Bud academic media. Not social audio. Not licensed commercial music. */

export type BudMediaKind = "lecture" | "podcast" | "tutorial" | "course" | "study";

export type BudMedia = {
  id: string;
  kind: BudMediaKind;
  title: string;
  course?: string;
  durationMin: number;
  origin: "bud";
  createdAt: string;
  src?: string;
};

export const BUD_MEDIA: BudMedia[] = [];

export function budMediaById(id: string) {
  return BUD_MEDIA.find((m) => m.id === id);
}
