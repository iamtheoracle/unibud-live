import { createServerFn } from "@tanstack/react-start";

export type Conversation = {
  id: string;
  peerHandle: string;
  updatedAt: string;
  lastBody: string;
};

export type ChatMessage = {
  id: string;
  sender: "me" | "them";
  body: string;
  shareKind?: string;
  shareJson?: string;
  mediaId?: string;
};

export type ConversationDetail = {
  conversation: { peerHandle: string };
  messages: ChatMessage[];
};

export type CreatedPost = { id: string; body: string; handle: string };

export const myCommunities = createServerFn({ method: "GET" }).handler(
  async (): Promise<string[]> => [],
);

export const joinCommunity = createServerFn({ method: "POST" })
  .validator((input: string) => input)
  .handler(async (): Promise<void> => {});

export const createPost = createServerFn({ method: "POST" })
  .validator((input: { communityId: string; body: string; image?: string; video?: string; kind?: string }) => input)
  .handler(async (): Promise<CreatedPost> => ({
    id: `post-${Date.now()}`,
    body: "",
    handle: "",
  }));

export const listConversations = createServerFn({ method: "GET" }).handler(
  async (): Promise<Conversation[]> => [],
);

export const openConversation = createServerFn({ method: "POST" })
  .validator((input: { handle: string; listingId?: string; seed?: string }) => input)
  .handler(async (): Promise<{ id: string }> => ({ id: "" }));

export const getConversation = createServerFn({ method: "GET" })
  .validator((input: string) => input)
  .handler(async (): Promise<ConversationDetail> => ({
    conversation: { peerHandle: "" },
    messages: [],
  }));

export const sendMessage = createServerFn({ method: "POST" })
  .validator((input: { conversationId: string; body: string; mediaId?: string; shareKind?: string; shareJson?: string }) => input)
  .handler(async (): Promise<void> => {});
