import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolvePlugin as defaultResolve } from './routing.js';
import { parseMdc } from './mdc-parser.js';

/**
 * Route a classification entry to the corresponding plugin directory.
 * @param {object} entry - A classification entry with category, subcategory, ruleName
 * @param {string} pluginsDir - Path to plugins/ directory
 * @param {function} resolveFn - resolvePlugin function (for DI/testing)
 * @returns {{ plugin: string, skillDir: string } | null}
 */
export function routeToPlugin(entry, pluginsDir, resolveFn = defaultResolve) {
  const plugin = resolveFn(entry.category, entry.subcategory, entry.ruleName);
  if (!plugin) return null;
  return {
    plugin,
    skillDir: join(pluginsDir, plugin, 'skills', entry.ruleName),
  };
}

/**
 * Parse an English .mdc file content.
 * @param {string} content - Full .mdc file content
 * @returns {{ description: string, globs: string, body: string }}
 */
export function parseEnMdc(content) {
  return parseMdc(content);
}

/**
 * Generate SKILL.en.md content with translation-status: translated.
 * @param {{ skillName: string, description: string, body: string }} params
 * @returns {string}
 */
export function generateEnSkill({ skillName, description, body }) {
  let frontmatter = `---\nname: ${skillName}-en\n`;
  if (description) {
    frontmatter += `description: ${description}\n`;
  }
  frontmatter += `translation-status: translated\n---\n`;
  return frontmatter + body;
}

/**
 * Add translation-status: pending to SKILL.en.md content.
 * @param {string} content - Original SKILL.en.md content
 * @returns {string} Updated content
 */
export function addPendingTag(content) {
  if (content.includes('translation-status: pending')) return content;

  // Insert translation-status: pending after the first --- line
  const firstClose = content.indexOf('---', 4);
  if (firstClose === -1) {
    // No frontmatter — add one
    return `---\ntranslation-status: pending\n---\n${content}`;
  }

  const before = content.slice(0, firstClose);
  const after = content.slice(firstClose);
  // Trim trailing newline before the closing ---
  const trimmedBefore = before.endsWith('\n') ? before.slice(0, -1) : before;
  return `${trimmedBefore}\ntranslation-status: pending\n${after}`;
}

/**
 * Main replacement function.
 * @param {object} classification - classification.json structure
 * @param {string} enRulesDir - Path to English .mdc files directory
 * @param {string} pluginsDir - Path to plugins/ directory
 * @param {object} options - Optional: { resolvePlugin } for DI
 * @returns {{ replaced: number, pending: number, failed_routes: number, parse_errors: Array, skipped: number }}
 */
export function replaceContent(classification, enRulesDir, pluginsDir, options = {}) {
  const resolveFn = options.resolvePlugin || defaultResolve;
  const result = {
    replaced: 0,
    pending: 0,
    failed_routes: [],
    parse_errors: [],
    skipped: 0,
  };

  const replacedDirs = new Set();

  // Phase 1: Process classified entries
  for (const entry of classification.classifications) {
    const route = routeToPlugin(entry, pluginsDir, resolveFn);

    if (!route) {
      result.failed_routes.push({
        en_file: entry.en_file,
        category: entry.category,
        subcategory: entry.subcategory,
        ruleName: entry.ruleName,
      });
      continue;
    }

    const skillEnPath = join(route.skillDir, 'SKILL.en.md');
    if (!existsSync(skillEnPath)) {
      result.skipped++;
      continue;
    }

    const mdcPath = join(enRulesDir, entry.en_file);
    let mdcContent;
    try {
      mdcContent = readFileSync(mdcPath, 'utf-8');
    } catch {
      result.parse_errors.push({ en_file: entry.en_file, error: 'File not found' });
      continue;
    }

    let parsed;
    try {
      parsed = parseEnMdc(mdcContent);
    } catch (e) {
      result.parse_errors.push({ en_file: entry.en_file, error: e.message });
      continue;
    }

    const newContent = generateEnSkill({
      skillName: entry.ruleName,
      description: parsed.description,
      body: parsed.body,
    });

    writeFileSync(skillEnPath, newContent);
    result.replaced++;
    replacedDirs.add(route.skillDir);
  }

  // Phase 2: Scan all SKILL.en.md and add pending tag to unreplaced ones
  function scanSkillEnFiles(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        files = files.concat(scanSkillEnFiles(full));
      } else if (e.name === 'SKILL.en.md') {
        files.push(full);
      }
    }
    return files;
  }

  const allEnFiles = scanSkillEnFiles(pluginsDir);
  for (const f of allEnFiles) {
    const dir = join(f, '..');
    if (!replacedDirs.has(dir)) {
      const content = readFileSync(f, 'utf-8');
      writeFileSync(f, addPendingTag(content));
      result.pending++;
    }
  }

  return result;
}
