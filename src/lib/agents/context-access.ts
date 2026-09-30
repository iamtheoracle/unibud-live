import type { OrganizationAgentId } from './specialists/definitions.ts';

export type ContextScope = 'request' | 'profile' | 'conversation' | 'memory' | 'private-content' | 'external-data' | 'authorization' | 'safety';

export interface ContextAccessRequest { agent: OrganizationAgentId; scope: ContextScope; authorized: boolean; source: 'user' | 'system' | 'atlas' | 'guardian'; }

export interface ContextAccessDecision { allowed: boolean; reason: string; }

const alwaysSafeScopes: ContextScope[] = ['request', 'safety'];

export function canAccessContext(input: ContextAccessRequest): ContextAccessDecision {
  if (alwaysSafeScopes.includes(input.scope)) return { allowed: true, reason: 'Required for safe request processing.' };
  if (!input.authorized) return { allowed: false, reason: 'The context is not authorized for this agent.' };
  if (input.scope === 'authorization' && input.agent !== 'guardian' && input.agent !== 'sentinel') return { allowed: false, reason: 'Authorization context is restricted to security responsibilities.' };
  if (input.scope === 'memory' && input.agent !== 'atlas' && input.agent !== 'spark' && input.agent !== 'bud') return { allowed: false, reason: 'Continuity and memory access is controlled by Atlas and the Bud/Spark boundary.' };
  if (input.scope === 'private-content' && input.agent === 'orbit') return { allowed: false, reason: 'Browsing does not grant access to private user content.' };
  return { allowed: true, reason: 'The requesting agent has an authorized need for this context.' };
}

export function filterContextForAgent(agent: OrganizationAgentId, context: Record<string, unknown>, authorizedScopes: readonly ContextScope[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    const scope = (key as ContextScope);
    if (authorizedScopes.includes(scope) && canAccessContext({ agent, scope, authorized: true, source: 'atlas' }).allowed) result[key] = value;
  }
  return result;
}