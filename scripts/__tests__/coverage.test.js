import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { discoverFiles } from '../scanner.js';
import { resolvePlugin } from '../routing.js';
import { basename, dirname, join } from 'node:path';

const RULES_DIR = fileURLToPath(new URL('../../../awesome-cursorrules-zh/rules', import.meta.url));

/**
 * Extract category/subcategory/ruleName from file paths.
 * Handles two patterns:
 *   rules/{category}/{ruleName}/.cursorrules (3 levels)
 *   rules/{category}/{subcategory}/{ruleName}/.cursorrules (4 levels)
 */
function parsePath(filePath) {
  const parts = filePath.replace(/\\/g, '/').split('/');
  const idx = parts.indexOf('rules');
  if (idx < 0) return null;

  const category = parts[idx + 1];
  // ruleName is always the directory containing the file
  const fileName = parts[parts.length - 1]; // .cursorrules or *.mdc
  const ruleDir = parts[parts.length - 2]; // the directory containing the file

  // Check if there's a subcategory level
  // 4 levels: rules/{cat}/{subcat}/{ruleName}/file → parts.length = idx + 5
  // 3 levels: rules/{cat}/{ruleName}/file → parts.length = idx + 4
  const hasSubcategory = parts.length >= idx + 5;

  if (hasSubcategory) {
    return { category, subcategory: parts[idx + 2], ruleName: ruleDir };
  } else {
    return { category, subcategory: category, ruleName: ruleDir };
  }
}

describe('Task 2.4: full coverage - all files route to a plugin', () => {
  it('should route all 132 .cursorrules files successfully', () => {
    const { cursorrules } = discoverFiles(RULES_DIR);
    const failures = [];
    for (const fp of cursorrules) {
      const parsed = parsePath(fp);
      if (!parsed) { failures.push({ file: fp, reason: 'cannot parse path' }); continue; }
      const plugin = resolvePlugin(parsed.category, parsed.subcategory, parsed.ruleName);
      if (!plugin) {
        failures.push({ file: fp, category: parsed.category, subcategory: parsed.subcategory, ruleName: parsed.ruleName });
      }
    }
    assert.equal(failures.length, 0, `Unrouted files:\n${failures.map(f => `  ${f.file} (${f.category}/${f.subcategory}/${f.ruleName})`).join('\n')}`);
  });

  it('should route all 338 .mdc files successfully', () => {
    const { mdc } = discoverFiles(RULES_DIR);
    const failures = [];
    for (const fp of mdc) {
      const parsed = parsePath(fp);
      if (!parsed) { failures.push({ file: fp, reason: 'cannot parse path' }); continue; }
      const plugin = resolvePlugin(parsed.category, parsed.subcategory, parsed.ruleName);
      if (!plugin) {
        failures.push({ file: fp, category: parsed.category, subcategory: parsed.subcategory, ruleName: parsed.ruleName });
      }
    }
    assert.equal(failures.length, 0, `Unrouted files:\n${failures.map(f => `  ${f.file}`).join('\n')}`);
  });

  it('should route to at most 66 different plugins', () => {
    const { cursorrules, mdc } = discoverFiles(RULES_DIR);
    const plugins = new Set();
    for (const fp of [...cursorrules, ...mdc]) {
      const parsed = parsePath(fp);
      if (!parsed) continue;
      const plugin = resolvePlugin(parsed.category, parsed.subcategory, parsed.ruleName);
      if (plugin) plugins.add(plugin);
    }
    assert.ok(plugins.size <= 66, `Expected ≤ 66 plugins, got ${plugins.size}`);
  });
});
