/**
 * Two-level routing: category/subcategory/rule-name → plugin name.
 * Based on design.md DEC-7.
 */

// Large categories need per-rule lookup
export const LARGE_CATEGORIES = ['frontend', 'backend', 'devops'];

// Small categories: entire category maps to a single plugin (or null = needs per-rule lookup)
export const CATEGORY_TO_PLUGIN = {
  general: null,
  ai: null,
  security: null,
  mobile: null,
  blockchain: null,
  'emerging-tech': null,
  data: 'data-engineering',
  'data-science': 'data-science',
  database: 'database',
  storage: 'database',
  iot: 'iot',
  simulation: 'iot',
  edge: 'edge-computing',
  automation: 'automation-robotics',
  industrial: 'automation-robotics',
  robotics: 'automation-robotics',
  quantum: 'quantum-computing',
  hardware: 'advanced-hardware',
  bio: 'bio-tech',
  science: 'bio-tech',
  'ar-vr': 'interactive-media',
  gaming: 'interactive-media',
  cloud: 'infrastructure',
  compute: 'infrastructure',
  network: 'infrastructure',
  systems: 'cpp',
  platform: 'platform',
  cms: 'drupal',
  tools: 'dev-tools',
};

// Subcategory+rule composite keys for disambiguation (same rule name in different subcategories)
const SUBCAT_RULE_TO_PLUGIN = {
  'elixir/guidelines': 'elixir',
  'systems/guidelines': 'cpp',
};

// Per-rule mapping for large categories and null-mapped small categories
export const RULE_TO_PLUGIN = {
  // Frontend (26 rules → 14 plugins)
  'angular-ts-guide': 'angular',
  'angular-typescript': 'angular',
  'angular-typescript-guide': 'angular',
  'chrome-extension-dev-js-typescript': 'chrome-extension-dev',
  'micro-frontend': 'micro-frontend',
  'apollo-graphql': 'apollo-graphql',
  'chakra-ui': 'chakra-ui',
  mobx: 'mobx',
  'nextjs-14-seo': 'nextjs',
  'nextjs-basic': 'nextjs',
  'nextjs-react-ts': 'nextjs',
  'nextjs-supabase': 'nextjs',
  'nextjs-tailwind': 'nextjs',
  'nextjs-typescript': 'nextjs',
  'nextjs-ui': 'nextjs',
  'react-components': 'react',
  'react-query': 'react',
  'react-typescript': 'react',
  'styled-components': 'react',
  'solidjs-basic-guide': 'solidjs',
  'sveltekit-tailwind-typescript-guide': 'sveltekit-tailwind',
  axios: 'axios',
  conventions: 'conventions',
  'vite-tailwind': 'vite-tailwind',
  'composition-api': 'vue',
  nuxt3: 'vue',

  // Backend (21 rules → 15 plugins)
  go: 'go',
  java: 'java',
  django: 'django',
  'django-best-practices': 'django',
  fastapi: 'fastapi',
  'fastapi-api-example': 'fastapi',
  'fastapi-best-practices': 'fastapi',
  'flask-json-guide': 'flask',
  'nestjs-typescript': 'nestjs',
  'express-mongodb': 'express-mern',
  'fullstack-mern-guide': 'express-mern',
  'es-module-guide': 'es-module',
  'springboot-jpa': 'springboot',
  'springboot-best-practices': 'springboot',
  'laravel-package-guide': 'laravel',
  'laravel-php-83': 'laravel',
  'abp-framework': 'abp-framework',
  'phoenix-docker-setup': 'elixir',
  'backend-scalability': 'backend-scalability',
  'git-conventional-commit-messages': 'git-conventional-commits',

  // DevOps (12 rules → 9 plugins)
  'docker-containerization': 'docker',
  'python-containerization': 'docker',
  'kubernetes-mkdocs-documentation': 'kubernetes',
  'ci-cd-pipelines': 'ci-cd',
  'terraform-iac': 'terraform',
  observability: 'observability',
  'prometheus-grafana-monitoring': 'observability',
  serverless: 'serverless',
  'chaos-engineering': 'chaos-engineering',
  'conventional-commits': 'git-conventional-commits',
  'github-code-quality': 'github-code-quality',

  // General (8 rules → 3 plugins)
  'code-guidelines': 'code-guidelines',
  'code-guidelines-comprehensive': 'code-guidelines',
  'code-style': 'code-guidelines',
  'gherkin-testing': 'testing',
  'xray-testing': 'testing',
  'git-conventions': 'dev-workflow',
  'ticket-template': 'dev-workflow',
  'pair-interviews': 'dev-workflow',

  // AI (6 rules → 2 plugins)
  mlops: 'mlops',
  'computer-vision': 'ai-research',
  'edge-ai': 'ai-research',
  'federated-learning': 'ai-research',
  'knowledge-graph': 'ai-research',
  'photonic-neural-network': 'ai-research',

  // Security (5 rules → 2 plugins)
  'zero-trust': 'zero-trust-security',
  'homomorphic-encryption': 'zero-trust-security',
  'privacy-computing': 'privacy-computing',
  'secure-multiparty': 'privacy-computing',

  // Blockchain (4 rules → 2 plugins)
  foundry: 'solidity',
  'smart-contract-security': 'solidity',
  web3: 'web3',
  'advanced-protocols': 'web3',

  // Mobile (5 rules → 5 plugins)
  'android-jetpack-compose': 'android',
  'flutter-app-expert': 'flutter',
  'ios-uikit': 'ios-uikit',
  'react-native-expo': 'react-native-expo',
  'swiftui-guidelines': 'swiftui',

  // Emerging-tech (3 rules)
  'biological-computing': 'bio-tech',
  'quantum-communication': 'quantum-computing',
  'quantum-computing': 'quantum-computing',

  // DevOps service-mesh (devops branch)
  'service-mesh': 'devops-service-mesh',

  // Backend guidelines (elixir and systems both have guidelines)
  guidelines: 'elixir',  // resolved by subcategory context in conflict handler
};

/**
 * Resolve a rule to its target plugin name.
 * @param {string} category
 * @param {string} subcategory
 * @param {string} ruleName
 * @returns {string|null} plugin name or null if no mapping found
 */
export function resolvePlugin(category, subcategory, ruleName) {
  // Step 1: Large categories → per-rule lookup (with subcategory disambiguation)
  if (LARGE_CATEGORIES.includes(category)) {
    const subcatKey = `${subcategory}/${ruleName}`;
    return SUBCAT_RULE_TO_PLUGIN[subcatKey] || RULE_TO_PLUGIN[ruleName] || null;
  }

  // Step 2: Category has a direct mapping (non-null)
  const categoryPlugin = CATEGORY_TO_PLUGIN[category];
  if (categoryPlugin !== undefined && categoryPlugin !== null) {
    return categoryPlugin;
  }

  // Step 3: Category is null-mapped → per-rule lookup
  return RULE_TO_PLUGIN[ruleName] || null;
}
