import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Recursively scan a directory for .cursorrules and .mdc files.
 * @param {string} rootDir - Root directory to scan
 * @returns {{ cursorrules: string[], mdc: string[] }}
 */
export function discoverFiles(rootDir) {
  const rootStat = statSync(rootDir);
  if (!rootStat.isDirectory()) {
    throw new Error(`discoverFiles: "${rootDir}" is not a directory`);
  }

  const cursorrules = [];
  const mdc = [];

  function scan(dir) {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      throw new Error(`discoverFiles: failed to read directory "${dir}": ${err.message}`, { cause: err });
    }
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue; // skip symlinks to avoid infinite recursion
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name === '.cursorrules') {
        cursorrules.push(fullPath);
      } else if (entry.name.endsWith('.mdc')) {
        mdc.push(fullPath);
      }
    }
  }

  scan(rootDir);
  return { cursorrules, mdc };
}
