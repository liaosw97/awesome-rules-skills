import { discoverFiles } from './scanner.js';
import { resolvePlugin } from './routing.js';
import { fileURLToPath } from 'node:url';

const RULES_DIR = fileURLToPath(new URL('../../awesome-cursorrules-zh/rules', import.meta.url));

function parsePath(fp) {
  const parts = fp.replace(/\\/g, '/').split('/');
  const idx = parts.indexOf('rules');
  if (idx < 0) return null;
  const category = parts[idx + 1];
  const hasSub = parts.length >= idx + 5;
  const ruleDir = parts[parts.length - 2];
  return { category, subcategory: hasSub ? parts[idx + 2] : category, ruleName: ruleDir };
}

const { cursorrules, mdc } = discoverFiles(RULES_DIR);
const all = [...cursorrules, ...mdc];
const missing = new Map();

for (const fp of all) {
  const p = parsePath(fp);
  if (!p) continue;
  const plugin = resolvePlugin(p.category, p.subcategory, p.ruleName);
  if (!plugin) {
    const key = `${p.category}/${p.subcategory}/${p.ruleName}`;
    missing.set(key, (missing.get(key) || 0) + 1);
  }
}

console.log(`Missing mappings: ${missing.size} unique rules`);
for (const [key, count] of missing) {
  console.log(`  ${key} (×${count})`);
}

if (missing.size > 0) process.exit(1);
