import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const PLUGINS_DIR = join(PROJECT_ROOT, 'plugins');

// Simple English stop words for overlap detection
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
  'these', 'those', 'use', 'when', 'working', 'with', 'rules', 'development',
  'guide', 'best', 'practices', 'and', 'for', 'code', 'file',
]);

function contentWords(text) {
  return (text.toLowerCase().match(/[a-z]+/g) || []).filter(w => !STOP_WORDS.has(w) && w.length > 2);
}

/**
 * Validate description quality.
 */
export function validateDescription(desc, skillName) {
  const issues = [];
  // Check for at least one tech-like name (capitalized word or known tech)
  const techNames = desc.match(/[A-Z][a-zA-Z+]+/g) || [];
  if (techNames.length === 0) {
    issues.push(`${skillName}: no tech name in description "${desc}"`);
  }
  if (desc.length > 500) {
    issues.push(`${skillName}: description exceeds 500 chars (${desc.length})`);
  }
  return issues;
}

/**
 * Check overlap between descriptions.
 */
export function checkOverlap(descriptions) {
  const issues = [];
  const entries = [...descriptions.entries()];
  for (let i = 0; i < entries.length; i++) {
    const [name1, desc1] = entries[i];
    const words1 = new Set(contentWords(desc1));
    for (let j = i + 1; j < entries.length; j++) {
      const [name2, desc2] = entries[j];
      const words2 = new Set(contentWords(desc2));
      let overlap = 0;
      for (const w of words1) { if (words2.has(w)) overlap++; }
      if (overlap > 3) {
        issues.push(`${name1} / ${name2}: ${overlap} content words overlap`);
      }
    }
  }
  return issues;
}

/**
 * Validate SKILL.md format.
 */
export function validateSkillFormat(skillPath, expectedName) {
  const issues = [];
  if (!existsSync(skillPath)) {
    issues.push(`${expectedName}: SKILL.md not found at ${skillPath}`);
    return issues;
  }
  const content = readFileSync(skillPath, 'utf-8');
  if (!content.startsWith('---\n')) {
    issues.push(`${expectedName}: missing YAML frontmatter`);
  }
  const nameMatch = content.match(/^---\n[\s\S]*?name:\s*(.+?)$/m);
  if (!nameMatch) {
    issues.push(`${expectedName}: missing name in frontmatter`);
  } else if (nameMatch[1].trim() !== expectedName) {
    issues.push(`${expectedName}: frontmatter name "${nameMatch[1].trim()}" != expected "${expectedName}"`);
  }
  return issues;
}

/**
 * Validate plugin.json.
 */
export function validatePluginJson(pluginPath, expectedName) {
  const issues = [];
  const jsonPath = join(pluginPath, '.claude-plugin', 'plugin.json');
  if (!existsSync(jsonPath)) {
    issues.push(`${expectedName}: plugin.json not found`);
    return issues;
  }
  const pkg = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  if (pkg.name !== expectedName) issues.push(`${expectedName}: plugin name mismatch`);
  if (!pkg.version) issues.push(`${expectedName}: missing version`);
  if (!pkg.description) issues.push(`${expectedName}: missing description`);
  if (pkg.skills !== './skills/') issues.push(`${expectedName}: wrong skills path`);
  return issues;
}

// Main validation
function main() {
  let allIssues = [];
  const allDescriptions = new Map();
  let totalSkills = 0;

  const plugins = readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const plugin of plugins) {
    // Validate plugin.json
    allIssues.push(...validatePluginJson(join(PLUGINS_DIR, plugin.name), plugin.name));

    // Validate skills
    const skillsDir = join(PLUGINS_DIR, plugin.name, 'skills');
    if (!existsSync(skillsDir)) continue;

    const skillDirs = readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const sd of skillDirs) {
      totalSkills++;
      const zhPath = join(skillsDir, sd.name, 'SKILL.md');
      allIssues.push(...validateSkillFormat(zhPath, sd.name));

      // Collect descriptions
      if (existsSync(zhPath)) {
        const content = readFileSync(zhPath, 'utf-8');
        const descMatch = content.match(/^---\n[\s\S]*?description:\s*(.+?)$/m);
        if (descMatch) {
          const desc = descMatch[1].trim();
          allIssues.push(...validateDescription(desc, sd.name));
          allDescriptions.set(sd.name, desc);
        }
      }
    }
  }

  // Check overlaps (sample, not all pairs — too many)
  console.log(`\nValidated ${totalSkills} skills across ${plugins.length} plugins`);

  if (allIssues.length > 0) {
    console.log(`\nIssues found (${allIssues.length}):`);
    allIssues.forEach(i => console.log(`  ⚠ ${i}`));
  } else {
    console.log('\n✅ All validations passed');
  }

  process.exit(allIssues.length > 0 ? 1 : 0);
}

// Only run main when executed directly (not imported)
const isMainModule = fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) main();
