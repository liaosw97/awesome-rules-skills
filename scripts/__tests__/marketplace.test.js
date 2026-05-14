import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const PROJECT_ROOT = fileURLToPath(new URL('../..', import.meta.url));

// Category mapping: plugin name → category
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

describe('Task 8.1-8.2: marketplace.json generation', () => {
  const mktPath = join(PROJECT_ROOT, '.claude-plugin', 'marketplace.json');

  it('should have valid marketplace.json', () => {
    assert.ok(existsSync(mktPath), 'marketplace.json should exist');
    const data = JSON.parse(readFileSync(mktPath, 'utf-8'));
    assert.equal(data.name, 'awesome-rules-skills');
    assert.ok(Array.isArray(data.plugins));
    assert.equal(data.plugins.length, 66, `Expected 66 plugins, got ${data.plugins.length}`);
  });

  it('should have complete entry fields for each plugin', () => {
    const data = JSON.parse(readFileSync(mktPath, 'utf-8'));
    for (const p of data.plugins) {
      assert.ok(p.name, `Plugin should have name`);
      assert.ok(p.source, `${p.name} should have source`);
      assert.ok(p.description, `${p.name} should have description`);
      assert.ok(Array.isArray(p.keywords), `${p.name} should have keywords array`);
      assert.ok(p.category, `${p.name} should have category`);
      assert.equal(p.version, '1.0.0', `${p.name} version should be 1.0.0`);
    }
  });

  it('should have correct source paths', () => {
    const data = JSON.parse(readFileSync(mktPath, 'utf-8'));
    for (const p of data.plugins) {
      assert.ok(p.source.startsWith('./plugins/'), `${p.name} source should start with ./plugins/`);
    }
  });
});

describe('Task 8.3: keywords generation', () => {
  it('should include tech name and domain keywords', () => {
    const mktPath = join(PROJECT_ROOT, '.claude-plugin', 'marketplace.json');
    const data = JSON.parse(readFileSync(mktPath, 'utf-8'));
    const react = data.plugins.find(p => p.name === 'react');
    assert.ok(react, 'react plugin should exist');
    assert.ok(react.keywords.some(k => k.toLowerCase().includes('react')), 'react should have react keyword');
    assert.ok(react.keywords.includes('frontend'), 'react should have frontend keyword');
  });
});

describe('Task 8.4: marketplace.json format validation', () => {
  it('should be valid JSON', () => {
    const mktPath = join(PROJECT_ROOT, '.claude-plugin', 'marketplace.json');
    assert.doesNotThrow(() => JSON.parse(readFileSync(mktPath, 'utf-8')));
  });
});
