// @ts-check
/**
 * Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
 * (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
 *
 * Applied files are keyed by BASENAME. When a migration is renamed to repair
 * its sequence number, legacy names are treated as aliases so existing databases
 * do not re-run an already-applied migration under its new name.
 *
 * Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
 * out of scope for both until it is copied up.
 */

/** Legacy migration names that are equivalent to a current migration name. */
const LEGACY_MIGRATION_ALIASES = Object.freeze({
  "0019_quad_groups.sql": ["0013_quad_groups.sql"],
});

/**
 * The `_migrations` key for a migration path (or bare filename).
 * @param {string} path
 * @returns {string}
 */
export function migrationName(path) {
  return path.split("/").pop() ?? path;
}

/**
 * @param {string} path
 * @returns {boolean}
 */
export function isMigrationFile(path) {
  return path.endsWith(".sql");
}

/**
 * Migrations in `paths` that are not yet in `applied`, in apply order.
 * Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
 * Duplicate numeric prefixes are rejected to avoid ambiguous migration ordering.
 * @param {Iterable<string>} paths
 * @param {Iterable<string>} applied
 * @returns {Array<{ name: string, path: string }>}
 */
export function pendingMigrations(paths, applied) {
  const done = new Set(applied);
  const files = [...paths]
    .filter(isMigrationFile)
    .map((path) => ({ name: migrationName(path), path }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const prefixes = new Map();
  for (const { name } of files) {
    const prefix = /^(\d+)_/.exec(name)?.[1];
    if (!prefix) continue;
    const previous = prefixes.get(prefix);
    if (previous) {
      throw new Error(
        `Duplicate migration prefix ${prefix}: ${previous} and ${name}. Give each migration a unique numeric prefix.`,
      );
    }
    prefixes.set(prefix, name);
  }

  return files.filter(({ name }) => {
    if (done.has(name)) return false;
    const legacyNames = LEGACY_MIGRATION_ALIASES[name] ?? [];
    return !legacyNames.some((legacyName) => done.has(legacyName));
  });
}
