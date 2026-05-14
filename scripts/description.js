/**
 * Description generation from parsed .cursorrules content.
 * Extracts tech names and formats English descriptions.
 */

// Common tech names for recognition
const KNOWN_TECH = new Set([
  'React', 'Vue', 'Angular', 'Svelte', 'SolidJS', 'Next.js', 'Nuxt', 'Nuxt3',
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'Rust', 'C++', 'C#',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Elixir', 'Scala', 'R',
  'Django', 'Flask', 'FastAPI', 'Spring', 'SpringBoot', 'Laravel', 'NestJS',
  'Express', 'Koa', 'Fiber', 'Gin', 'Echo', 'Phoenix',
  'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Nginx',
  'GraphQL', 'REST', 'gRPC', 'WebSocket',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Elasticsearch',
  'React Native', 'Flutter', 'SwiftUI', 'UIKit', 'Android', 'iOS',
  'Tailwind', 'Bootstrap', 'Material', 'Chakra',
  'Redux', 'MobX', 'Vuex', 'Pinia', 'Zustand',
  'Jest', 'Vitest', 'Cypress', 'Playwright', 'Selenium',
  'Webpack', 'Vite', 'Rollup', 'ESBuild',
  'Git', 'GitHub', 'GitLab',
  'AWS', 'Azure', 'GCP', 'Firebase', 'Supabase',
  'Solidity', 'Web3', 'Ethereum', 'Foundry',
  'Apollo', 'Axios', 'Prisma', 'TypeORM',
  'Drupal', 'WordPress', 'ABP',
  'MLOps', 'PyTorch', 'TensorFlow',
  'IoT', 'MQTT', 'Edge',
  'Fastify', 'SvelteKit', 'Remix', 'Astro',
  'Node.js', '.NET', 'OAuth', 'gRPC',
]);

/**
 * Extract tech names from parsed content based on format.
 * @param {string} firstLine - First line of file or heading
 * @param {'structured'|'flat'|'mixed'} format
 * @returns {string[]}
 */
export function extractTechNames(firstLine, format) {
  const text = firstLine || '';

  // Try to find known tech names in the text
  const found = [];
  for (const tech of KNOWN_TECH) {
    if (text.includes(tech)) {
      found.push(tech);
    }
  }

  // Also extract capitalized English words not in KNOWN_TECH (potential tech names)
  const englishWords = text.match(/[A-Z][a-zA-Z]*(?:\.[A-Z][a-zA-Z]*)*/g) || [];
  for (const word of englishWords) {
    if (word.length >= 2 && !found.includes(word) && !isCommonWord(word)) {
      found.push(word);
    }
  }

  return [...new Set(found)];
}

function isCommonWord(word) {
  const common = new Set([
    'The', 'This', 'That', 'These', 'Those', 'And', 'But', 'Or', 'Not',
    'Use', 'Using', 'Used', 'When', 'Where', 'How', 'What', 'Why',
    'For', 'From', 'With', 'About', 'Into', 'Over', 'After', 'Before',
    'All', 'Are', 'Was', 'Were', 'Been', 'Being', 'Have', 'Has', 'Had',
    'Will', 'Would', 'Could', 'Should', 'May', 'Might', 'Must', 'Can',
    'You', 'Your', 'Are', 'Expert', 'Development', 'Best', 'Practices',
    'Guide', 'Rules', 'Guidelines', 'Code', 'File', 'Files', 'Based',
    'Core', 'Key', 'Principles', 'Note', 'Notes', 'Section', 'Also',
    'Always', 'Never', 'Make', 'Keep', 'Ensure', 'Follow', 'Write',
    'Focus', 'Avoid', 'Structure', 'Standard', 'Standards', 'Quality',
    'Module', 'Component', 'Service', 'Application', 'System', 'Systems',
  ]);
  return common.has(word);
}

/**
 * Format a description using the standard template.
 * @param {string[]} techNames
 * @param {string} qualifier
 * @returns {string}
 */
export function formatDescription(techNames, qualifier) {
  const primary = techNames[0] || 'coding';
  const desc = `Use when working with ${primary} — ${qualifier}`;
  return desc.length > 500 ? desc.slice(0, 497) + '...' : desc;
}

/**
 * Generate a description for an MDC sub-skill (uses mdc's own description).
 * @param {string} mdcDescription
 * @returns {string}
 */
export function generateMdcDescription(mdcDescription) {
  if (!mdcDescription) return 'Use when working with code rules';
  return mdcDescription.length > 500 ? mdcDescription.slice(0, 497) + '...' : mdcDescription;
}

/**
 * Generate description from parsed cursorrules content.
 * @param {{ title: string|null, roleLine: string|null, sections: Array }} parsed
 * @param {'structured'|'flat'|'mixed'} format
 * @returns {string}
 */
export function generateDescription(parsed, format) {
  const source = parsed.title || parsed.roleLine || '';
  const techNames = extractTechNames(source, format);

  // Derive qualifier from role line or first section
  let qualifier = 'development rules';
  if (parsed.roleLine) {
    // Extract the role description after the tech names
    const roleMatch = parsed.roleLine.match(/方面的(.+)/);
    if (roleMatch) {
      qualifier = roleMatch[1].replace(/^(专家| Specialist|Expert)[。，.]/, '').trim() || qualifier;
    }
  }

  return formatDescription(techNames, qualifier);
}
