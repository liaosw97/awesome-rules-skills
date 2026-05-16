import { setupPlugin, importSkills, updateRouting } from './import-alibaba-skills.js';

const skillNames = [
  'java-coding-standards', 'java-exception-logging', 'java-unit-testing',
  'java-security-standards', 'java-mysql-database', 'java-project-structure',
  'java-design-standards',
];

// Step 1: Setup plugin structure
setupPlugin('plugins/alibaba-java-dev', 'alibaba-java-dev',
  'Alibaba Java development manual: coding standards, exceptions, testing, security, MySQL, project structure, and design rules',
  skillNames);
console.log('Plugin structure created');

// Step 2: Import skills from source
const sourceDir = '../AlibabaDevelopmentManualSkills/.cursor';
const result = importSkills(sourceDir, '.', 'alibaba-java-dev');
console.log('Imported:', JSON.stringify(result));

// Step 3: Update routing
updateRouting('scripts/routing.js', skillNames, 'alibaba-java-dev');
console.log('Routing updated');
