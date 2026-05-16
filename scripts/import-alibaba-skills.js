import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Clean OCR artifacts from content.
 * @param {string} content
 * @returns {string}
 */
export function cleanOcr(content) {
  // Split into frontmatter and body
  const secondDash = content.indexOf('---', 4);
  let frontmatter = '';
  let body = content;

  if (secondDash !== -1) {
    frontmatter = content.slice(0, secondDash + 3);
    body = content.slice(secondDash + 3);
  }

  // Fix bracket markers: 【强  制】/【强制 】→【强制】, 【推荐 】→【推荐】, 【参考 】→【参考】
  body = body.replace(/【强\s*制\s*】/g, '【强制】');
  body = body.replace(/【推荐\s*】/g, '【推荐】');
  body = body.replace(/【参考\s*】/g, '【参考】');

  // Compress 3+ consecutive spaces to single space
  body = body.replace(/ {3,}/g, ' ');

  return frontmatter + body;
}

/**
 * Generate SKILL.en.md template with translation-status: pending.
 * @param {string} content - Original SKILL.md content
 * @param {string} skillName
 * @returns {string}
 */
export function generateEnTemplate(content, skillName) {
  // Find frontmatter bounds
  const secondDash = content.indexOf('---', 4);
  if (secondDash === -1) {
    return `---\nname: ${skillName}-en\ntranslation-status: pending\n---\n${content}`;
  }

  let frontmatter = content.slice(3, secondDash).trim();
  const body = content.slice(secondDash + 3);

  // Replace name
  frontmatter = frontmatter.replace(/^name:.*$/m, `name: ${skillName}-en`);

  // Add translation-status if not present
  if (!frontmatter.includes('translation-status')) {
    frontmatter += `\ntranslation-status: pending`;
  }

  return `---\n${frontmatter}\n---${body}`;
}

/**
 * Discover skill directories in source directory.
 * Expects structure: <sourceDir>/<plugin>/skills/<skillName>/SKILL.md
 * @param {string} sourceDir
 * @returns {Array<{skillName: string, filePath: string}>}
 */
export function discoverSkills(sourceDir) {
  if (!existsSync(sourceDir)) {
    throw new Error(`Source directory does not exist: ${sourceDir}`);
  }

  const skills = [];

  function scan(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else if (entry.name === 'SKILL.md') {
        // Extract skillName from path: .../skills/<skillName>/SKILL.md
        const parts = full.split(/[/\\]/);
        const skillName = parts[parts.length - 2];
        skills.push({ skillName, filePath: full });
      }
    }
  }

  scan(sourceDir);
  return skills;
}

/**
 * Import skills from source to target plugin directory.
 * @param {string} sourceDir - Source directory containing skill files
 * @param {string} targetDir - Target plugins root directory
 * @param {string} pluginName - Plugin name (e.g., 'alibaba-java-dev')
 * @returns {{ imported: number }}
 */
export function importSkills(sourceDir, targetDir, pluginName) {
  const skills = discoverSkills(sourceDir);
  const pluginDir = join(targetDir, 'plugins', pluginName);

  for (const { skillName, filePath } of skills) {
    const skillDir = join(pluginDir, 'skills', skillName);
    mkdirSync(skillDir, { recursive: true });

    // Read, clean, write SKILL.md
    const rawContent = readFileSync(filePath, 'utf-8');
    const cleaned = cleanOcr(rawContent);
    writeFileSync(join(skillDir, 'SKILL.md'), cleaned);

    // Generate and write SKILL.en.md
    const enContent = generateEnTemplate(cleaned, skillName);
    writeFileSync(join(skillDir, 'SKILL.en.md'), enContent);
  }

  return { imported: skills.length };
}

/**
 * Create plugin directory structure with plugin.json.
 * @param {string} targetDir - Plugin root directory
 * @param {string} pluginName
 * @param {string} description
 * @param {string[]} skillNames
 */
export function setupPlugin(targetDir, pluginName, description, skillNames = []) {
  // Create .claude-plugin/plugin.json
  const pluginDir = join(targetDir, '.claude-plugin');
  mkdirSync(pluginDir, { recursive: true });

  const pluginJson = {
    name: pluginName,
    version: '1.0.0',
    description,
    skills: './skills/',
  };
  writeFileSync(join(pluginDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2) + '\n');

  // Create skill subdirectories
  for (const skillName of skillNames) {
    mkdirSync(join(targetDir, 'skills', skillName), { recursive: true });
  }
}

/**
 * Update routing.js to add new skill mappings.
 * @param {string} routingFilePath - Path to routing.js
 * @param {string[]} skillNames - Skill names to add
 * @param {string} pluginName - Target plugin name
 */
export function updateRouting(routingFilePath, skillNames, pluginName) {
  let content = readFileSync(routingFilePath, 'utf-8');

  for (const skillName of skillNames) {
    const newEntry = `'${skillName}': '${pluginName}'`;
    // Skip if already exists
    if (content.includes(newEntry)) continue;

    // Find the RULE_TO_PLUGIN object and add the entry (use line anchor to avoid matching SUBCAT_RULE_TO_PLUGIN)
    content = content.replace(
      /^(export const )?RULE_TO_PLUGIN\s*=\s*\{/m,
      `RULE_TO_PLUGIN = {\n  ${newEntry},`
    );
  }

  writeFileSync(routingFilePath, content);
}
