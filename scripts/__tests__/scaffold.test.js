import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

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

describe('Task 1.1: project scaffold', () => {
  it('should have project root directory', () => {
    assert.ok(existsSync(PROJECT_ROOT), 'Project root directory should exist');
  });

  it('should have valid package.json', () => {
    const pkgPath = join(PROJECT_ROOT, 'package.json');
    assert.ok(existsSync(pkgPath), 'package.json should exist');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    assert.equal(pkg.name, 'awesome-rules-skills');
    assert.equal(pkg.type, 'module');
    assert.ok(pkg.engines?.node, 'Should have engines.node field');
    assert.match(pkg.engines.node, />=?\s*18/, 'Should require Node.js >= 18');
  });
});

describe('Task 1.2: marketplace.json skeleton', () => {
  it('should have .claude-plugin/marketplace.json', () => {
    const path = join(PROJECT_ROOT, '.claude-plugin', 'marketplace.json');
    assert.ok(existsSync(path), 'marketplace.json should exist');
  });

  it('should have valid marketplace.json structure', () => {
    const path = join(PROJECT_ROOT, '.claude-plugin', 'marketplace.json');
    const data = JSON.parse(readFileSync(path, 'utf-8'));
    assert.equal(data.name, 'awesome-rules-skills');
    assert.ok(data.owner, 'Should have owner field');
    assert.ok(data.metadata, 'Should have metadata field');
    assert.ok(Array.isArray(data.plugins), 'plugins should be an array');
  });
});

describe('Task 1.3a: 66 plugin packages', () => {
  it('should have exactly 66 plugin directories', () => {
    for (const name of PLUGIN_NAMES) {
      const dir = join(PROJECT_ROOT, 'plugins', name);
      assert.ok(existsSync(dir), `Plugin directory "${name}" should exist`);
    }
    assert.equal(PLUGIN_NAMES.length, 66, 'Should have exactly 66 plugin names');
  });

  it('should have valid plugin.json in each plugin', () => {
    for (const name of PLUGIN_NAMES) {
      const jsonPath = join(PROJECT_ROOT, 'plugins', name, '.claude-plugin', 'plugin.json');
      assert.ok(existsSync(jsonPath), `plugin.json for "${name}" should exist`);
      const pkg = JSON.parse(readFileSync(jsonPath, 'utf-8'));
      assert.equal(pkg.name, name, `plugin.json name should match directory name "${name}"`);
      assert.equal(pkg.version, '1.0.0');
      assert.ok(pkg.description, `"${name}" should have description`);
      assert.equal(pkg.skills, './skills/');
    }
  });

  it('should have skills/ directory in each plugin', () => {
    for (const name of PLUGIN_NAMES) {
      const skillsDir = join(PROJECT_ROOT, 'plugins', name, 'skills');
      assert.ok(existsSync(skillsDir), `skills/ directory for "${name}" should exist`);
      assert.ok(statSync(skillsDir).isDirectory(), `"${name}/skills" should be a directory`);
    }
  });

  it('should have scripts/ directory', () => {
    assert.ok(existsSync(join(PROJECT_ROOT, 'scripts')), 'scripts/ directory should exist');
  });
});

describe('Task 1.4: README.md', () => {
  it('should have README.md', () => {
    assert.ok(existsSync(join(PROJECT_ROOT, 'README.md')), 'README.md should exist');
  });

  it('should contain marketplace install instructions', () => {
    const content = readFileSync(join(PROJECT_ROOT, 'README.md'), 'utf-8').toLowerCase();
    assert.ok(content.includes('marketplace'), 'Should mention marketplace');
    assert.ok(content.includes('plugin') || content.includes('install'), 'Should mention plugin install');
  });

  it('should contain source version placeholder', () => {
    const content = readFileSync(join(PROJECT_ROOT, 'README.md'), 'utf-8');
    assert.ok(
      content.includes('awesome-cursorrules-zh'),
      'Should reference source project'
    );
  });
});
