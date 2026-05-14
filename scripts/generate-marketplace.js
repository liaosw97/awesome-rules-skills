import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const PLUGINS_DIR = join(PROJECT_ROOT, 'plugins');

// Category mapping
const PLUGIN_CATEGORIES = {
  react: 'frontend', nextjs: 'frontend', angular: 'frontend', vue: 'frontend',
  'chakra-ui': 'frontend', mobx: 'frontend', solidjs: 'frontend',
  'sveltekit-tailwind': 'frontend', 'apollo-graphql': 'frontend',
  'chrome-extension-dev': 'frontend', 'micro-frontend': 'frontend',
  axios: 'frontend', 'vite-tailwind': 'frontend', conventions: 'frontend',
  django: 'backend', fastapi: 'backend', springboot: 'backend', laravel: 'backend',
  elixir: 'backend', 'express-mern': 'backend', go: 'backend', java: 'backend',
  flask: 'backend', nestjs: 'backend', 'es-module': 'backend',
  'abp-framework': 'backend', 'backend-scalability': 'backend',
  'git-conventional-commits': 'backend', cpp: 'backend',
  docker: 'devops', observability: 'devops', kubernetes: 'devops',
  'ci-cd': 'devops', terraform: 'devops', serverless: 'devops',
  'devops-service-mesh': 'devops', 'chaos-engineering': 'devops',
  'github-code-quality': 'devops',
  android: 'mobile', flutter: 'mobile', 'ios-uikit': 'mobile',
  'react-native-expo': 'mobile', swiftui: 'mobile',
  iot: 'cross-domain', 'edge-computing': 'cross-domain',
  'automation-robotics': 'cross-domain', 'quantum-computing': 'cross-domain',
  'advanced-hardware': 'cross-domain', 'bio-tech': 'cross-domain',
  'interactive-media': 'cross-domain', infrastructure: 'cross-domain',
  'code-guidelines': 'general', testing: 'general', 'dev-workflow': 'general',
  mlops: 'ai', 'ai-research': 'ai',
  'zero-trust-security': 'security', 'privacy-computing': 'security',
  solidity: 'blockchain', web3: 'blockchain',
  'data-engineering': 'data', 'data-science': 'data', database: 'data',
  platform: 'platform', drupal: 'cms', 'dev-tools': 'tools',
};

// Common aliases for keywords
const ALIASES = {
  react: ['reactjs', 'react-hooks'],
  vue: ['vuejs', 'vue3'],
  angular: ['angularjs'],
  nextjs: ['next.js'],
  django: ['django-rest'],
  fastapi: ['fast-api'],
  springboot: ['spring-boot'],
  kubernetes: ['k8s'],
  docker: ['dockerfile', 'containerization'],
  terraform: ['iac'],
  iot: ['internet-of-things'],
  web3: ['web3.js'],
  solidity: ['smart-contracts'],
};

// Noise words to exclude from keywords
const KEYWORD_STOP = new Set([
  'Use', 'When', 'Working', 'With', 'And', 'For', 'The', 'From', 'Into',
  'TODO', 'DNA', 'CPU', 'GPU', 'Buffer', 'Boot',
]);

/**
 * Generate keywords for a plugin from its skills and metadata.
 */
function generateKeywords(pluginName, skills, category) {
  const keywords = new Set();
  keywords.add(pluginName);
  if (ALIASES[pluginName]) {
    for (const a of ALIASES[pluginName]) keywords.add(a);
  }
  keywords.add(category);
  // Extract tech names from skill descriptions
  for (const skill of skills) {
    // Strip the template prefix before extracting
    const desc = (skill.description || '').replace(/^Use when working with\s*/i, '');
    const techWords = desc.match(/[A-Z][a-zA-Z+]+/g) || [];
    for (const w of techWords) {
      if (!KEYWORD_STOP.has(w)) keywords.add(w);
    }
  }
  return [...keywords];
}

function generateMarketplace() {
  const entries = readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  const plugins = [];

  for (const name of entries) {
    const pluginJsonPath = join(PLUGINS_DIR, name, '.claude-plugin', 'plugin.json');
    if (!existsSync(pluginJsonPath)) continue;

    const pluginJson = JSON.parse(readFileSync(pluginJsonPath, 'utf-8'));
    const category = PLUGIN_CATEGORIES[name] || 'general';

    // Scan skills
    const skillsDir = join(PLUGINS_DIR, name, 'skills');
    const skills = [];
    if (existsSync(skillsDir)) {
      const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
        .filter(d => d.isDirectory());
      for (const sd of skillDirs) {
        const skillPath = join(skillsDir, sd.name, 'SKILL.md');
        if (existsSync(skillPath)) {
          const content = readFileSync(skillPath, 'utf-8');
          const descMatch = content.match(/^---\n[\s\S]*?description:\s*(.+?)$/m);
          skills.push({ name: sd.name, description: descMatch ? descMatch[1].trim() : '' });
        }
      }
    }

    const keywords = generateKeywords(name, skills, category);

    plugins.push({
      name,
      source: `./plugins/${name}`,
      description: pluginJson.description || `${name} development rules`,
      keywords,
      category,
      version: '1.0.0',
    });

    // Update plugin.json with generated description
    pluginJson.description = pluginJson.description || `${name} development rules`;
    writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + '\n');
  }

  const marketplace = {
    name: 'awesome-rules-skills',
    owner: { name: 'awesome-cursorrules-zh' },
    metadata: {
      description: '132+ curated coding rules for Claude Code — 66 plugins covering frontend, backend, devops, AI, and 30+ domains',
    },
    plugins,
  };

  const outPath = join(PROJECT_ROOT, '.claude-plugin', 'marketplace.json');
  writeFileSync(outPath, JSON.stringify(marketplace, null, 2) + '\n');
  console.log(`Generated marketplace.json with ${plugins.length} plugins`);
}

generateMarketplace();
