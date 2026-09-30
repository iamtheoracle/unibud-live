import type { AgentHook, AgentRequest, AgentResponse } from './contracts';

export interface AgentHookContext {
  hook: AgentHook;
  request: AgentRequest;
}

export type AgentHookHandler = (
  context: AgentHookContext,
) => Promise<AgentResponse>;

export interface AgentHookSet {
  [hook: string]: AgentHookHandler | undefined;
}

/**
 * Hooks are deliberately runtime-neutral. An implementation can be backed by
 * server code, edge functions, a worker, a local process, or another runtime.
 */
export function createHookSet(
  handlers: Partial<Record<AgentHook, AgentHookHandler>>,
): AgentHookSet {
  return handlers;
}
