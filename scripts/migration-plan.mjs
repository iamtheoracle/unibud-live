// @ts-check
/**
 * Shared migration bookkeeping for the Postgres deploy migrator and local
 * PGlite preview. Applied files are keyed by basename.
 *
 * Renamed migrations retain aliases for historical _migrations entries, so a
 * deployed database does not replay an already-applied migration under a new
 * filename. Auth schema under migrations/auth is opt-in and not discovered by
 * either non-recursive applier until deliberately copied into the root.
 */
/** @type {Readonly<Record<string, readonly string[]>>} */
const LEGACY_MIGRATION_ALIASES = Object.freeze({
  "0019_quad_groups.sql": ["0013_quad_groups.sql"],
});

/**
 * The _migrations key for a migration path (or bare filename).
 * @param {string} path
 * @returns {string}
 */
export function migrationName(path) {
  return path.split("/").pop() ?? path;
}

/** @param {string} path */
export function isMigrationFile(path) {
  return path.endsWith(".sql");
}

/**
 * Migrations not yet applied, in filename order. Duplicate numeric prefixes
 * fail early because they make ordering ambiguous and easy to mismanage.
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

  /** @type {Map<string, string>} */
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
    return !(LEGACY_MIGRATION_ALIASES[name] ?? []).some((legacy) => done.has(legacy));
  });
}
