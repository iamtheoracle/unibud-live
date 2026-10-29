import test from 'node:test';
import assert from 'node:assert/strict';
import { getAIProvider } from './provider.ts';

const names = ['ORACLE_ARC_URL', 'ORACLE_ARC_API_KEY', 'ORACLE_ARC_OWNER_ID', 'XAI_API_KEY', 'OPENAI_API_KEY'];

function withEnv(values, fn) {
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  for (const name of names) delete process.env[name];
  Object.assign(process.env, values);
  return Promise.resolve().then(fn).finally(() => {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  });
}

test('unconfigured Bud provider is unavailable, never a fake successful reply', async () => {
  await withEnv({}, async () => {
    const result = await getAIProvider().complete([{ role: 'user', content: 'test' }]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /model connection is not available/i);
  });
});

test('Oracle Arc is selected for the configured owner and uses the private API', async () => {
  await withEnv({
    ORACLE_ARC_URL: 'http://oracle-arc-core:8090/',
    ORACLE_ARC_API_KEY: 'test-secret',
    ORACLE_ARC_OWNER_ID: 'owner-123',
    XAI_API_KEY: 'must-not-be-used',
  }, async () => {
    const originalFetch = globalThis.fetch;
    let captured;
    globalThis.fetch = async (url, options) => {
      captured = { url, options };
      return new Response(JSON.stringify({ choices: [{ message: { content: 'Local model response' } }] }), {
        status: 200, headers: { 'content-type': 'application/json' },
      });
    };
    try {
      const provider = getAIProvider('owner-123');
      assert.equal(provider.id, 'oracle-arc');
      assert.equal(provider.kind, 'local');
      const result = await provider.complete([{ role: 'user', content: 'Hello' }]);
      assert.deepEqual(result, { ok: true, text: 'Local model response', providerId: 'oracle-arc' });
      assert.equal(captured.url, 'http://oracle-arc-core:8090/v1/chat/completions');
      assert.equal(captured.options.headers.Authorization, 'Bearer test-secret');
      assert.equal(JSON.parse(captured.options.body).user, 'owner-123');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

test('Oracle Arc fails closed for other users instead of falling back to a cloud provider', async () => {
  await withEnv({
    ORACLE_ARC_URL: 'http://oracle-arc-core:8090',
    ORACLE_ARC_API_KEY: 'test-secret',
    ORACLE_ARC_OWNER_ID: 'owner-123',
    OPENAI_API_KEY: 'must-not-be-used',
  }, async () => {
    const provider = getAIProvider('another-user');
    assert.equal(provider.id, 'oracle-arc');
    const result = await provider.complete([{ role: 'user', content: 'private memory?' }]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /private to its configured owner/i);
  });
});

test('partial Oracle Arc configuration fails closed', async () => {
  await withEnv({ ORACLE_ARC_URL: 'http://oracle-arc-core:8090', OPENAI_API_KEY: 'must-not-be-used' }, async () => {
    const result = await getAIProvider('owner-123').complete([{ role: 'user', content: 'test' }]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /not fully configured/i);
  });
});
