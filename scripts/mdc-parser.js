/**
 * .mdc file parser.
 * Extracts YAML frontmatter (description + globs) and body content.
 */

/**
 * Parse an .mdc file into structured data.
 * @param {string} content - File content
 * @returns {{ description: string, globs: string, body: string }}
 */
export function parseMdc(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    // Non-standard MDC: no frontmatter, treat entire content as body
    return { description: '', globs: '', body: content.trim() };
  }

  const frontmatter = match[1];
  const body = match[2].trim();

  // Simple YAML parsing for description and globs
  let description = '';
  let globs = '';

  for (const line of frontmatter.split('\n')) {
    const descMatch = line.match(/^description:\s*["']?(.+?)["']?\s*$/);
    if (descMatch) description = descMatch[1];
    const globsMatch = line.match(/^globs:\s*["']?(.+?)["']?\s*$/);
    if (globsMatch) globs = globsMatch[1];
  }

  return { description, globs, body };
}

/**
 * Convert a globs string to a paths array for Claude Code skills.
 * @param {string} globs
 * @returns {string[]}
 */
export function convertGlobsToPaths(globs) {
  if (!globs) return [];
  return [globs];
}

/**
 * Generate a sub-skill name for an .mdc file.
 * @param {string} ruleName - Parent rule name (e.g., 'springboot-jpa')
 * @param {string} mdcFileName - MDC file name (e.g., 'springboot-jpa-testing.mdc')
 * @returns {string} Sub-skill name
 */
export function mdcSkillName(ruleName, mdcFileName) {
  // Strip .mdc extension
  let slug = mdcFileName.replace(/\.mdc$/, '');
  // If slug already starts with ruleName prefix, use it directly
  if (slug.startsWith(ruleName + '-')) return slug;
  // Otherwise compose: ruleName-slug
  return `${ruleName}-${slug}`;
}
