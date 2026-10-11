import test from 'node:test';
import assert from 'node:assert/strict';
import { getAIProvider } from './provider.ts';

test('unconfigured Bud provider is unavailable, never a fake successful reply', async () => {
  const previousXai = process.env.XAI_API_KEY;
  const previousOpenai = process.env.OPENAI_API_KEY;
  delete process.env.XAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const result = await getAIProvider().complete([{ role: 'user', content: 'test' }]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /model connection is not available/i);
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
