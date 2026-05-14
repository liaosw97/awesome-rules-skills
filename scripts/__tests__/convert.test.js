import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PROJECT_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const RULES_DIR = fileURLToPath(new URL('../../../awesome-cursorrules-zh/rules', import.meta.url));

// Import all modules
const { discoverFiles } = await import('../scanner.js');
const { classifyFormat, parseCursorrules } = await import('../parser.js');
const { parseMdc, convertGlobsToPaths, mdcSkillName } = await import('../mdc-parser.js');
const { resolvePlugin } = await import('../routing.js');
const { detectConflicts, resolveAllConflicts } = await import('../conflicts.js');
const { generateDescription, generateMdcDescription } = await import('../description.js');
const { generateSkillZh, generateSkillEn, generateMdcSkill } = await import('../generator.js');

function parsePath(fp) {
  const parts = fp.replace(/\\/g, '/').split('/');
  const idx = parts.indexOf('rules');
  if (idx < 0) return null;
  const category = parts[idx + 1];
  const hasSub = parts.length >= idx + 5;
  const ruleDir = parts[parts.length - 2];
  return { category, subcategory: hasSub ? parts[idx + 2] : category, ruleName: ruleDir };
}

function runConvert(force = false) {
  const { cursorrules, mdc } = discoverFiles(RULES_DIR);
  const files = [...cursorrules, ...mdc];
  const written = [];

  // Build file list with metadata
  const fileEntries = files.map(fp => {
    const parsed = parsePath(fp);
    if (!parsed) return null;
    const isCursorrules = fp.endsWith('.cursorrules');
    return { ...parsed, filePath: fp, isCursorrules };
  }).filter(Boolean);

  // Detect and resolve conflicts (cursorrules only)
  const cursorrulesEntries = fileEntries.filter(f => f.isCursorrules);
  const conflicts = detectConflicts(cursorrulesEntries);
  const conflictNames = new Set(conflicts.map(c => c.name));
  const resolved = resolveAllConflicts(cursorrulesEntries);
  const nameMap = new Map(resolved.map(r => [`${r.category}/${r.subcategory}/${r.ruleName}`, r.skillName]));

  for (const entry of fileEntries) {
    const plugin = resolvePlugin(entry.category, entry.subcategory, entry.ruleName);
    if (!plugin) continue;

    if (entry.isCursorrules) {
      const skillName = nameMap.get(`${entry.category}/${entry.subcategory}/${entry.ruleName}`) || entry.ruleName;
      const content = readFileSync(entry.filePath, 'utf-8');
      const format = classifyFormat(content);
      const parsed = parseCursorrules(content, format);
      const description = generateDescription(parsed, format);

      const outDir = join(PROJECT_ROOT, 'plugins', plugin, 'skills', skillName);

      // Incremental check
      const zhPath = join(outDir, 'SKILL.md');
      if (!force && existsSync(zhPath)) continue;

      mkdirSync(outDir, { recursive: true });

      writeFileSync(zhPath, generateSkillZh({
        name: skillName,
        description,
        roleLine: parsed.roleLine,
        sections: parsed.sections,
      }));

      writeFileSync(join(outDir, 'SKILL.en.md'), generateSkillEn({
        name: skillName,
        description,
        roleLine: parsed.roleLine,
        sections: parsed.sections,
      }));

      written.push(zhPath);
    } else {
      // MDC file
      const content = readFileSync(entry.filePath, 'utf-8');
      const parsed = parseMdc(content);
      const mdcFile = entry.filePath.split('/').pop().replace(/\\/g, '/').split('/').pop();
      const subSkillName = mdcSkillName(entry.ruleName, mdcFile);
      const description = generateMdcDescription(parsed.description);
      const paths = convertGlobsToPaths(parsed.globs);

      const outDir = join(PROJECT_ROOT, 'plugins', plugin, 'skills', subSkillName);

      const zhPath = join(outDir, 'SKILL.md');
      if (!force && existsSync(zhPath)) continue;

      mkdirSync(outDir, { recursive: true });

      writeFileSync(zhPath, generateMdcSkill({
        name: subSkillName,
        description,
        paths,
        body: parsed.body,
      }));

      // English version for MDC
      writeFileSync(join(outDir, 'SKILL.en.md'), generateMdcSkill({
        name: `${subSkillName}-en`,
        description,
        paths,
        body: parsed.body, // MDC body is often already in English
      }));

      written.push(zhPath);
    }
  }
  return written;
}

describe('Task 7.4: batch conversion', () => {
  it('should convert sample files and generate SKILL.md', async () => {
    const written = await runConvert(true);
    assert.ok(written.length > 0, 'Should write at least one file');
    console.log(`Converted ${written.length} files`);
  });

  it('should generate files in correct plugin directory structure', async () => {
    // Check a few known files
    const reactTsPath = join(PROJECT_ROOT, 'plugins', 'react', 'skills', 'react-typescript', 'SKILL.md');
    assert.ok(existsSync(reactTsPath), 'react-typescript SKILL.md should exist');

    const reactTsEnPath = join(PROJECT_ROOT, 'plugins', 'react', 'skills', 'react-typescript', 'SKILL.en.md');
    assert.ok(existsSync(reactTsEnPath), 'react-typescript SKILL.en.md should exist');
  });

  it('should handle conflict-resolved names', async () => {
    // devops-service-mesh should exist under its own plugin
    const devopsSm = join(PROJECT_ROOT, 'plugins', 'devops-service-mesh', 'skills', 'devops-service-mesh', 'SKILL.md');
    assert.ok(existsSync(devopsSm), 'devops-service-mesh should exist');
  });
});
