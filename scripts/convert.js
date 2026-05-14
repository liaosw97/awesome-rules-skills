import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverFiles } from './scanner.js';
import { classifyFormat, parseCursorrules } from './parser.js';
import { parseMdc, convertGlobsToPaths, mdcSkillName } from './mdc-parser.js';
import { resolvePlugin } from './routing.js';
import { detectConflicts, resolveAllConflicts } from './conflicts.js';
import { generateDescription, generateMdcDescription } from './description.js';
import { generateSkillZh, generateSkillEn, generateMdcSkill } from './generator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const RULES_DIR = join(__dirname, '../../awesome-cursorrules-zh/rules');

const force = process.argv.includes('--force');

function parsePath(fp) {
  const parts = fp.replace(/\\/g, '/').split('/');
  const idx = parts.indexOf('rules');
  if (idx < 0) return null;
  const category = parts[idx + 1];
  const hasSub = parts.length >= idx + 5;
  const ruleDir = parts[parts.length - 2];
  return { category, subcategory: hasSub ? parts[idx + 2] : category, ruleName: ruleDir };
}

console.log(`Converting rules (force=${force})...`);

const { cursorrules, mdc } = discoverFiles(RULES_DIR);
console.log(`Found ${cursorrules.length} .cursorrules + ${mdc.length} .mdc files`);

// Build file list
const files = [...cursorrules, ...mdc].map(fp => {
  const parsed = parsePath(fp);
  if (!parsed) return null;
  return { ...parsed, filePath: fp, isCursorrules: fp.endsWith('.cursorrules') };
}).filter(Boolean);

// Resolve conflicts for cursorrules
const cursorrulesFiles = files.filter(f => f.isCursorrules);
const resolved = resolveAllConflicts(cursorrulesFiles);
const nameMap = new Map(resolved.map(r => [`${r.category}/${r.subcategory}/${r.ruleName}`, r.skillName]));

let written = 0;
let skipped = 0;

for (const entry of files) {
  const plugin = resolvePlugin(entry.category, entry.subcategory, entry.ruleName);
  if (!plugin) {
    console.warn(`  ⚠ No plugin for ${entry.category}/${entry.ruleName}`);
    continue;
  }

  if (entry.isCursorrules) {
    const skillName = nameMap.get(`${entry.category}/${entry.subcategory}/${entry.ruleName}`) || entry.ruleName;
    const content = readFileSync(entry.filePath, 'utf-8');
    const format = classifyFormat(content);
    const parsed = parseCursorrules(content, format);
    const description = generateDescription(parsed, format);

    const outDir = join(PROJECT_ROOT, 'plugins', plugin, 'skills', skillName);
    const zhPath = join(outDir, 'SKILL.md');

    if (!force && existsSync(zhPath)) { skipped++; continue; }

    mkdirSync(outDir, { recursive: true });
    writeFileSync(zhPath, generateSkillZh({ name: skillName, description, roleLine: parsed.roleLine, sections: parsed.sections }));
    writeFileSync(join(outDir, 'SKILL.en.md'), generateSkillEn({ name: skillName, description, roleLine: parsed.roleLine, sections: parsed.sections }));
    written++;
  } else {
    const content = readFileSync(entry.filePath, 'utf-8');
    const parsed = parseMdc(content);
    const mdcFile = entry.filePath.replace(/\\/g, '/').split('/').pop();
    const subSkillName = mdcSkillName(entry.ruleName, mdcFile);
    const description = parsed.description || generateMdcDescription(`${subSkillName} rules`);
    const paths = convertGlobsToPaths(parsed.globs);

    const outDir = join(PROJECT_ROOT, 'plugins', plugin, 'skills', subSkillName);
    const zhPath = join(outDir, 'SKILL.md');

    if (!force && existsSync(zhPath)) { skipped++; continue; }

    mkdirSync(outDir, { recursive: true });
    writeFileSync(zhPath, generateMdcSkill({ name: subSkillName, description, paths, body: parsed.body }));
    writeFileSync(join(outDir, 'SKILL.en.md'), generateMdcSkill({ name: `${subSkillName}-en`, description, paths, body: parsed.body }));
    written++;
  }
}

console.log(`Done: ${written} written, ${skipped} skipped (unchanged)`);
