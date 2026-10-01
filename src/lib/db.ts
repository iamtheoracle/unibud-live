import { pendingMigrations } from "../../scripts/migration-plan.mjs";
import { DATABASE_URL_VARS, isServerlessRuntime, resolveDatabaseUrl } from "./database-url";

export type DbSource = "postgres" | "pglite" | "unconfigured";

const databaseUrl = resolveDatabaseUrl();
const serverless = isServerlessRuntime();
const usePglite = typeof process !== "undefined" && process.env.USE_PGLITE === "true";

/**
 * Postgres when a connection string is set (Netlify/production).
 * Embedded PGlite only for local/preview — never on a serverless filesystem.
 */
export const dbSource: DbSource = databaseUrl ? "postgres" : usePglite && !serverless ? "pglite" : "unconfigured";

export interface Sql {
  <T = any>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = any>(text: string, params?: unknown[]): Promise<T[]>;
}

const globalRef = globalThis as typeof globalThis & {
  __pgSqlPromise__?: Promise<Sql>;
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
  __pgliteMigrateChain__?: Promise<void>;
};

const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;
type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

function toSql(run: Run): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

function createPostgresSql(): Promise<Sql> {
  globalRef.__pgSqlPromise__ ??= (async () => {
    const { Pool, types } = await import("pg");
    types.setTypeParser(OID_INT8, Number);
    types.setTypeParser(OID_DATE, identity);
    types.setTypeParser(OID_INTERVAL, identity);
    if (!databaseUrl) {
      throw new Error(`A PostgreSQL connection string (${DATABASE_URL_VARS}) is required.`);
    }
    const pool = new Pool({ connectionString: databaseUrl });
    return toSql(async <T>(text: string, params: unknown[]) => {
      const res = await pool.query(text, params);
      return res.rows as T[];
    });
  })().catch((err) => {
    globalRef.__pgSqlPromise__ = undefined;
    throw err;
  });
  return globalRef.__pgSqlPromise__;
}

async function createPgliteSql(): Promise<Sql> {
  if (serverless) {
    throw new Error(
      `PGlite cannot run on Netlify/Lambda. Set ${DATABASE_URL_VARS} for PostgreSQL.`,
    );
  }
  if (!usePglite) {
    throw new Error("PGlite is disabled by default. Set USE_PGLITE=true for local development.");
  }
  globalRef.__pgliteInstance__ ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite({
      dataDir: "memory://",
      parsers: {
        [OID_INT8]: Number,
        [OID_DATE]: identity,
        [OID_INTERVAL]: identity,
      },
    });
    await pg.waitReady;
    await pg.exec(
      "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
    );
    return pg;
  })().catch((err) => {
    globalRef.__pgliteInstance__ = undefined;
    throw err;
  });
  const pg = await globalRef.__pgliteInstance__;

  const migrate = async (): Promise<void> => {
    const migrations = import.meta.glob("/migrations/*.sql", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const doneRows = await pg.query<{ name: string }>("select name from _migrations");
    const done = doneRows.rows.map((r) => r.name);
    for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) {
      await pg.transaction(async (tx) => {
        await tx.exec(migrations[path]);
        await tx.query("insert into _migrations (name) values ($1)", [name]);
      });
    }
  };
  const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve())
    .catch(() => undefined)
    .then(migrate);
  globalRef.__pgliteMigrateChain__ = pass;
  await pass;

  return toSql(async <T>(text: string, params: unknown[]) => {
    const result = await pg.query<T>(text, params);
    return result.rows;
  });
}

let sqlPromise: Promise<Sql> | null = null;

async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") {
    throw new Error("@/lib/db is server-only.");
  }
  if (databaseUrl) return createPostgresSql();
  if (serverless) {
    throw new Error(
      `PGlite cannot run on Netlify/Lambda. Set ${DATABASE_URL_VARS} for PostgreSQL.`,
    );
  }
  if (usePglite) return createPgliteSql();
  throw new Error(
    `Database is not configured. Set ${DATABASE_URL_VARS} for PostgreSQL or USE_PGLITE=true for local development.`,
  );
}

export function getSql(): Promise<Sql> {
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null;
    throw err;
  });
  return sqlPromise;
}

export async function getPglite(): Promise<import("@electric-sql/pglite").PGlite> {
  if (databaseUrl || serverless || !usePglite) {
    throw new Error("PGlite is only for local preview. Production uses PostgreSQL.");
  }
  await getSql();
  const pg = await globalRef.__pgliteInstance__;
  if (!pg) throw new Error("PGLite instance failed to initialize");
  return pg;
}

export function ensureDbReady(): Promise<void> {
  if (databaseUrl) return Promise.resolve();
  if (serverless) return Promise.resolve();
  if (!usePglite) return Promise.resolve();
  return getSql().then(() => undefined);
}

const globalBoot = globalThis as typeof globalThis & { __pgBootstrapPromise__?: Promise<void> };
if (typeof window === "undefined" && !databaseUrl && !serverless && usePglite) {
  globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
    globalBoot.__pgBootstrapPromise__ = undefined;
    console.error("[db] PGLite bootstrap failed:", err);
    throw err;
  });
}
