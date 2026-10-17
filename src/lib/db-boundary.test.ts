import test from 'node:test';
import assert from 'node:assert/strict';

test('database requires PostgreSQL or explicit local PGlite opt-in', async () => {
  const keys = ['DATABASE_URL', 'NETLIFY_DB_URL', 'NETLIFY_DATABASE_URL', 'NETLIFY_DATABASE_URL_UNPOOLED', 'NETLIFY', 'NETLIFY_DEV', 'AWS_LAMBDA_FUNCTION_NAME', 'LAMBDA_TASK_ROOT', 'VERCEL', 'USE_PGLITE'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];
  try {
    const db = await import('./db.ts');
    await assert.rejects(db.getSql(), /Database is not configured|PGlite is disabled by default/i);
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});

test('serverless runtime rejects PGlite even when explicitly requested', async () => {
  const keys = ['DATABASE_URL', 'NETLIFY', 'USE_PGLITE'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  delete process.env.DATABASE_URL;
  process.env.NETLIFY = 'true';
  process.env.USE_PGLITE = 'true';
  try {
    const serverlessPath = './db.ts?serverless-test';
    const db = await import(serverlessPath);
    await assert.rejects(db.getSql(), /PGlite cannot run on Netlify\/Lambda/i);
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
