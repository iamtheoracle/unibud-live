export interface TransactionClient {
  query(text: string): Promise<unknown>;
  release(): void;
}

/**
 * Run work on a checked-out PostgreSQL client, preserving the original failure
 * if rollback also fails and always returning the client to the pool.
 */
export async function runInTransaction<T>(
  client: TransactionClient,
  work: () => Promise<T>,
): Promise<T> {
  let began = false;
  try {
    await client.query("begin");
    began = true;
    const result = await work();
    await client.query("commit");
    return result;
  } catch (error) {
    if (began) {
      try {
        await client.query("rollback");
      } catch {
        // Preserve the operation/commit error; the client is still released below.
      }
    }
    throw error;
  } finally {
    client.release();
  }
}
