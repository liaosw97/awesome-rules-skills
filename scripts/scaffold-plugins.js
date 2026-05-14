import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// 66 plugin names from design.md DEC-7
const PLUGIN_NAMES = [
  // Frontend (14)
  'react', 'nextjs', 'angular', 'vue', 'chakra-ui', 'mobx', 'solidjs',
  'sveltekit-tailwind', 'apollo-graphql', 'chrome-extension-dev', 'micro-frontend',
  'axios', 'vite-tailwind', 'conventions',
  // Backend (15)
  'django', 'fastapi', 'springboot', 'laravel', 'elixir', 'express-mern', 'go',
  'java', 'flask', 'nestjs', 'es-module', 'abp-framework', 'backend-scalability',
  'git-conventional-commits', 'cpp',
  // DevOps (9)
  'docker', 'observability', 'kubernetes', 'ci-cd', 'terraform', 'serverless',
  'devops-service-mesh', 'chaos-engineering', 'github-code-quality',
  // Mobile (5)
  'android', 'flutter', 'ios-uikit', 'react-native-expo', 'swiftui',
  // Cross-domain (8)
  'iot', 'edge-computing', 'automation-robotics', 'quantum-computing',
  'advanced-hardware', 'bio-tech', 'interactive-media', 'infrastructure',
  // Other (15)
  'code-guidelines', 'testing', 'dev-workflow', 'mlops', 'ai-research',
  'zero-trust-security', 'privacy-computing', 'solidity', 'web3',
  'data-engineering', 'data-science', 'database', 'platform', 'drupal', 'dev-tools',
];

const DESCRIPTIONS = {
  react: 'React development rules: components, hooks, TypeScript integration and styling',
  nextjs: 'Next.js development rules: App Router, SSR, SEO and full-stack React',
  angular: 'Angular development rules: components, services, TypeScript and RxJS',
  vue: 'Vue.js development rules: Composition API, Nuxt and Vuex/Pinia',
  'chakra-ui': 'Chakra UI development rules: component library, theming and accessibility',
  mobx: 'MobX state management rules: observables, actions and reactions',
  solidjs: 'SolidJS development rules: reactive primitives and fine-grained reactivity',
  'sveltekit-tailwind': 'SvelteKit + Tailwind CSS development rules',
  'apollo-graphql': 'Apollo GraphQL development rules: queries, mutations and caching',
  'chrome-extension-dev': 'Chrome extension development rules: APIs, Manifest V3 and security',
  'micro-frontend': 'Micro-frontend architecture rules: module federation and composition',
  axios: 'Axios HTTP client rules: interceptors, error handling and best practices',
  'vite-tailwind': 'Vite + Tailwind CSS development rules: build tooling and utility-first CSS',
  conventions: 'Frontend coding conventions: naming, file structure and design patterns',
  django: 'Django development rules: models, views, templates and REST framework',
  fastapi: 'FastAPI development rules: async endpoints, dependency injection and validation',
  springboot: 'Spring Boot development rules: JPA, REST APIs and microservices',
  laravel: 'Laravel development rules: Eloquent, middleware and artisan commands',
  elixir: 'Elixir/Phoenix development rules: functional programming and concurrency',
  'express-mern': 'Express + MongoDB + React (MERN) full-stack development rules',
  go: 'Go development rules: concurrency patterns, error handling and project structure',
  java: 'Java development rules: design patterns, streams and modern Java features',
  flask: 'Flask development rules: routing, blueprints and JSON APIs',
  nestjs: 'NestJS development rules: modules, decorators and dependency injection',
  'es-module': 'ES Module development rules: imports, exports and module patterns',
  'abp-framework': 'ABP Framework development rules: modules, multi-tenancy and DDD',
  'backend-scalability': 'Backend scalability rules: caching, queues and distributed systems',
  'git-conventional-commits': 'Git conventional commit rules: commit format and changelog',
  cpp: 'C/C++ development rules: memory management, templates and modern standards',
  docker: 'Docker containerization rules: Dockerfile best practices and multi-stage builds',
  observability: 'Observability rules: logging, metrics, tracing and Prometheus/Grafana',
  kubernetes: 'Kubernetes rules: deployments, services, configmaps and Helm charts',
  'ci-cd': 'CI/CD pipeline rules: GitHub Actions, Jenkins and deployment strategies',
  terraform: 'Terraform IaC rules: modules, state management and cloud provisioning',
  serverless: 'Serverless development rules: AWS Lambda, functions and event-driven architecture',
  'devops-service-mesh': 'Service mesh rules: Istio, Envoy and traffic management',
  'chaos-engineering': 'Chaos engineering rules: fault injection, resilience testing and SRE',
  'github-code-quality': 'GitHub code quality rules: branch protection, reviews and automation',
  android: 'Android development rules: Jetpack Compose, MVVM and Kotlin coroutines',
  flutter: 'Flutter development rules: widgets, state management and Dart best practices',
  'ios-uikit': 'iOS UIKit development rules: view controllers, Auto Layout and Swift',
  'react-native-expo': 'React Native + Expo development rules: components, navigation and native APIs',
  swiftui: 'SwiftUI development rules: views, state and declarative UI',
  iot: 'IoT development rules: device protocols, edge computing and data pipelines',
  'edge-computing': 'Edge computing rules: deployment, latency optimization and offline patterns',
  'automation-robotics': 'Automation & robotics rules: control systems, ROS and PLC programming',
  'quantum-computing': 'Quantum computing rules: Qiskit, quantum algorithms and NISQ devices',
  'advanced-hardware': 'Advanced hardware rules: FPGA, Verilog and hardware description',
  'bio-tech': 'Biotech & computational science rules: bioinformatics and molecular simulation',
  'interactive-media': 'Interactive media rules: AR/VR, game development and 3D graphics',
  infrastructure: 'Infrastructure rules: cloud services, networking and system administration',
  'code-guidelines': 'General code quality guidelines: clean code, SOLID and review practices',
  testing: 'Testing rules: unit tests, integration tests, TDD and BDD strategies',
  'dev-workflow': 'Development workflow rules: git conventions, PR templates and pair programming',
  mlops: 'MLOps rules: model training, deployment, monitoring and ML pipelines',
  'ai-research': 'AI research rules: computer vision, federated learning and neural architectures',
  'zero-trust-security': 'Zero-trust security rules: authentication, authorization and threat modeling',
  'privacy-computing': 'Privacy computing rules: homomorphic encryption and secure multi-party computation',
  solidity: 'Solidity development rules: smart contracts, security audits and Foundry',
  web3: 'Web3 development rules: DeFi, advanced protocols and blockchain integration',
  'data-engineering': 'Data engineering rules: ETL, data pipelines and warehouse design',
  'data-science': 'Data science rules: analysis, visualization and statistical modeling',
  database: 'Database rules: SQL optimization, indexing and multi-model storage',
  platform: 'Platform engineering rules: internal developer platforms and self-service tooling',
  drupal: 'Drupal development rules: modules, themes and CMS best practices',
  'dev-tools': 'Developer tools rules: debugging, profiling and productivity utilities',
};

function scaffoldPlugins() {
  let created = 0;
  for (const name of PLUGIN_NAMES) {
    const pluginDir = join(PROJECT_ROOT, 'plugins', name);
    const claudeDir = join(pluginDir, '.claude-plugin');
    const skillsDir = join(pluginDir, 'skills');

    mkdirSync(claudeDir, { recursive: true });
    mkdirSync(skillsDir, { recursive: true });

    const pluginJson = {
      name,
      version: '1.0.0',
      description: DESCRIPTIONS[name] || `${name} development rules`,
      skills: './skills/',
    };

    writeFileSync(join(claudeDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2) + '\n');
    created++;
  }
  console.log(`Created ${created} plugin packages`);
}

scaffoldPlugins();
