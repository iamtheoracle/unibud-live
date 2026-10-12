import test from 'node:test';
import assert from 'node:assert/strict';
import { createFallbackProvider, getAIProvider } from './provider.ts';

test('unconfigured Bud provider is unavailable, never a fake successful reply', async () => {
  const previousXai = process.env.XAI_API_KEY;
  const previousOpenai = process.env.OPENAI_API_KEY;
  delete process.env.XAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const result = await getAIProvider().complete([{ role: 'user', content: 'test' }]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /live model isn.t connected|model connection is available/i);
  } finally {
    if (previousXai === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previousXai;
    if (previousOpenai === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousOpenai;
  }
});

test('Bud falls back to OpenAI when xAI returns an error', async () => {
  const previousXai = process.env.XAI_API_KEY;
  const previousOpenai = process.env.OPENAI_API_KEY;
  const previousFetch = globalThis.fetch;
  const calls: string[] = [];
  process.env.XAI_API_KEY = 'test-xai-key';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    calls.push(url);
    if (url.includes('api.x.ai')) {
      return new Response('unavailable', { status: 503 });
    }
    return new Response(JSON.stringify({ choices: [{ message: { content: 'Fallback reply' } }] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
  try {
    const result = await getAIProvider().complete([{ role: 'user', content: 'test' }]);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.text, 'Fallback reply');
    assert.deepEqual(calls, ['https://api.x.ai/v1/chat/completions', 'https://api.openai.com/v1/chat/completions']);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousXai === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previousXai;
    if (previousOpenai === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousOpenai;
  }
});

test('Bud never reports success when both configured providers fail', async () => {
  const previousXai = process.env.XAI_API_KEY;
  const previousOpenai = process.env.OPENAI_API_KEY;
  const previousFetch = globalThis.fetch;
  const calls: string[] = [];
  process.env.XAI_API_KEY = 'test-xai-key';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  globalThis.fetch = (async (input: string | URL | Request) => {
    calls.push(String(input));
    return new Response('unavailable', { status: 503 });
  }) as typeof fetch;
  try {
    const result = await getAIProvider().complete([{ role: 'user', content: 'test' }]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /couldn.t reach the model/i);
    assert.deepEqual(calls, ['https://api.x.ai/v1/chat/completions', 'https://api.openai.com/v1/chat/completions']);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousXai === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previousXai;
    if (previousOpenai === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousOpenai;
  }
});

test('Bud starts the next provider with a fresh signal after the first provider times out', async () => {
  const calls: string[] = [];
  const slow = {
    id: 'slow',
    kind: 'remote' as const,
    capabilities: ['text' as const],
    async complete(_messages: { role: 'system' | 'user' | 'assistant'; content: string }[], opts?: { maxTokens?: number; signal?: AbortSignal }) {
      calls.push('slow');
      return await new Promise<{ ok: false; error: string; providerId: string }>((resolve) => {
        if (opts?.signal?.aborted) {
          resolve({ ok: false, error: 'aborted', providerId: 'slow' });
          return;
        }
        opts?.signal?.addEventListener('abort', () => resolve({ ok: false, error: 'timed out', providerId: 'slow' }), { once: true });
      });
    },
  };
  const healthy = {
    id: 'healthy',
    kind: 'remote' as const,
    capabilities: ['text' as const],
    async complete() {
      calls.push('healthy');
      return { ok: true as const, text: 'Recovered reply', providerId: 'healthy' };
    },
  };
  const result = await createFallbackProvider([slow, healthy], 5).complete([{ role: 'user', content: 'test' }]);
  assert.deepEqual(calls, ['slow', 'healthy']);
  assert.deepEqual(result, { ok: true, text: 'Recovered reply', providerId: 'healthy' });
});

test('Bud continues to the next provider if a provider unexpectedly throws', async () => {
  const broken = {
    id: 'broken',
    kind: 'remote' as const,
    capabilities: ['text' as const],
    async complete() { throw new Error('unexpected provider failure'); },
  };
  const healthy = {
    id: 'healthy',
    kind: 'remote' as const,
    capabilities: ['text' as const],
    async complete() { return { ok: true as const, text: 'Recovered reply', providerId: 'healthy' }; },
  };
  const result = await createFallbackProvider([broken, healthy], 5).complete([{ role: 'user', content: 'test' }]);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.text, 'Recovered reply');
});

