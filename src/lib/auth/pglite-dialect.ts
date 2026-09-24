import { Pool } from "pg";
import {
  CompiledQuery,
  type DatabaseConnection,
  type DatabaseIntrospector,
  type Dialect,
  type Driver,
  type Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  type QueryCompiler,
  type QueryResult,
  type TransactionSettings,
} from "kysely";
import { DATABASE_URL_VARS, isServerlessRuntime, resolveDatabaseUrl } from "../database-url";

type PGliteClient = {
  query: <T>(sql: string, params?: unknown[]) => Promise<{ rows: T[]; affectedRows?: number }>;
  exec: (sql: string) => Promise<unknown>;
};

/** Better Auth dialect: Postgres when configured, local PGlite otherwise. Never PGlite on Netlify. */
export function pgliteDialect(getClient: () => Promise<unknown> | unknown): Dialect {
  return {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () =>
      resolveDatabaseUrl() || isServerlessRuntime()
        ? new PostgresDriver()
        : new LazyPGliteDriver(getClient as () => Promise<PGliteClient>),
    createQueryCompiler: (): QueryCompiler => new PostgresQueryCompiler(),
    createIntrospector: (db: Kysely<unknown>): DatabaseIntrospector => new PostgresIntrospector(db),
  };
}

class PostgresDriver implements Driver {
  private pool?: Pool;
  private connection?: PgConnection;

  async init(): Promise<void> {
    const url = resolveDatabaseUrl();
    if (!url) throw new Error(`A Postgres connection string (${DATABASE_URL_VARS}) is required.`);
    this.pool = new Pool({ connectionString: url });
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    if (!this.pool) await this.init();
    if (this.connection) throw new Error("Concurrent Better Auth connection acquisition is not supported.");
    this.connection = new PgConnection(await this.pool!.connect());
    return this.connection;
  }

  async releaseConnection(connection: DatabaseConnection): Promise<void> {
    if (connection !== this.connection) throw new Error("Invalid connection");
    this.connection.release();
    this.connection = undefined;
  }

  async beginTransaction(conn: DatabaseConnection, settings: TransactionSettings): Promise<void> {
    const sql = settings.isolationLevel
      ? `start transaction isolation level ${settings.isolationLevel}`
      : "begin";
    await (conn as PgConnection).query(sql, []);
  }

  async commitTransaction(conn: DatabaseConnection): Promise<void> {
    await (conn as PgConnection).query("commit", []);
  }

  async rollbackTransaction(conn: DatabaseConnection): Promise<void> {
    await (conn as PgConnection).query("rollback", []);
  }

  async destroy(): Promise<void> {
    this.connection = undefined;
    if (this.pool) await this.pool.end();
    this.pool = undefined;
  }
}

class PgConnection implements DatabaseConnection {
  constructor(private readonly client: import("pg").PoolClient) {}

  async query(text: string, params: unknown[]): Promise<void> {
    await this.client.query(text, params);
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const result = await this.client.query(compiledQuery.sql, [...compiledQuery.parameters]);
    return {
      numAffectedRows: result.rowCount === null ? undefined : BigInt(result.rowCount),
      rows: result.rows as O[],
    };
  }

  async *streamQuery<O>(compiledQuery: CompiledQuery, chunkSize: number): AsyncIterableIterator<QueryResult<O>> {
    if (!Number.isInteger(chunkSize) || chunkSize <= 0) throw new Error("chunkSize must be a positive integer");
    const result = await this.client.query(compiledQuery.sql, [...compiledQuery.parameters]);
    for (let i = 0; i < result.rows.length; i += chunkSize) {
      yield { rows: result.rows.slice(i, i + chunkSize) as O[] };
    }
  }

  release(): void {
    this.client.release();
  }
}

class LazyPGliteDriver implements Driver {
  private connection: PGliteConnection | undefined;
  private queue: Array<(con: PGliteConnection) => void> = [];
  constructor(private readonly getClient: () => Promise<PGliteClient>) {}

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    if (this.connection) {
      return await new Promise((resolve) => this.queue.push(resolve));
    }
    const client = await this.getClient();
    this.connection = new PGliteConnection(client);
    return this.connection;
  }

  async beginTransaction(conn: DatabaseConnection): Promise<void> {
    await (conn as PGliteConnection).executeQuery(CompiledQuery.raw("begin"));
  }
  async commitTransaction(conn: DatabaseConnection): Promise<void> {
    await (conn as PGliteConnection).executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(conn: DatabaseConnection): Promise<void> {
    await (conn as PGliteConnection).executeQuery(CompiledQuery.raw("rollback"));
  }
  async releaseConnection(): Promise<void> {
    const next = this.queue.shift();
    if (next && this.connection) next(this.connection);
    else this.connection = undefined;
  }
  async destroy(): Promise<void> {
    this.connection = undefined;
  }
}

class PGliteConnection implements DatabaseConnection {
  constructor(private readonly client: PGliteClient) {}
  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const result = await this.client.query<O>(compiledQuery.sql, [...compiledQuery.parameters]);
    return {
      rows: result.rows,
      numAffectedRows: result.affectedRows !== undefined ? BigInt(result.affectedRows) : undefined,
    };
  }
  async *streamQuery(): AsyncIterableIterator<QueryResult<never>> {
    throw new Error("PGlite streaming is not used");
  }
}
