/**
 * SKILL.md / SKILL.en.md file generator.
 */

/**
 * Generate Chinese SKILL.md content.
 * @param {{ name: string, description: string, roleLine: string|null, sections: Array }} data
 * @returns {string}
 */
export function generateSkillZh(data) {
  const frontmatter = `---\nname: ${data.name}\ndescription: ${data.description}\n---`;
  const parts = [];

  if (data.roleLine) {
    parts.push(data.roleLine);
    parts.push('');
  }

  for (const section of data.sections) {
    parts.push(`## ${section.heading}`);
    if (section.content) {
      parts.push(section.content);
    }
    parts.push('');
  }

  return `${frontmatter}\n\n${parts.join('\n').trim()}\n`;
}

/**
 * Generate English SKILL.en.md content.
 * @param {{ name: string, description: string, roleLine: string|null, sections: Array }} data
 * @returns {string}
 */
export function generateSkillEn(data) {
  const frontmatter = `---\nname: ${data.name}-en\ndescription: ${data.description}\n---`;
  const parts = [];

  if (data.roleLine) {
    // Keep original Chinese content as reference (translation pending)
    parts.push(data.roleLine);
    parts.push('');
  }

  for (const section of data.sections) {
    parts.push(`## ${section.heading}`);
    if (section.content) {
      parts.push(section.content);
    }
    parts.push('');
  }

  return `${frontmatter}\n\n${parts.join('\n').trim()}\n`;
}

/**
 * Generate MDC sub-skill SKILL.md content.
 * @param {{ name: string, description: string, paths: string[], body: string }} data
 * @returns {string}
 */
export function generateMdcSkill(data) {
  const pathsYaml = data.paths.length > 0 ? `\npaths:\n${data.paths.map(p => `  - "${p}"`).join('\n')}` : '';
  const frontmatter = `---\nname: ${data.name}\ndescription: ${data.description}${pathsYaml}\n---`;

  return `${frontmatter}\n\n${data.body}\n`;
}
