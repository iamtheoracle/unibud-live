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
