import test from 'node:test';
import assert from 'node:assert/strict';
import { getAIProvider } from './provider.ts';

test('unconfigured Bud provider is unavailable, never a fake successful reply', async () => {
  const previous = process.env.XAI_API_KEY;
  delete process.env.XAI_API_KEY;
  try {
    const result = await getAIProvider().complete([{ role: 'user', content: 'test' }]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /model connection is not available/i);
  } finally {
    if (previous === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previous;
  }
});
