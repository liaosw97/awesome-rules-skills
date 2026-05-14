import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolvePlugin,
  LARGE_CATEGORIES,
  CATEGORY_TO_PLUGIN,
  RULE_TO_PLUGIN,
} from '../routing.js';

describe('Task 2.2: two-level grouping map', () => {
  it('should map large category rules to specific plugins', () => {
    // Frontend → react
    assert.equal(resolvePlugin('frontend', 'react', 'react-typescript'), 'react');
    assert.equal(resolvePlugin('frontend', 'react', 'react-components'), 'react');
    assert.equal(resolvePlugin('frontend', 'react', 'react-query'), 'react');
  });

  it('should map nextjs rules to nextjs plugin', () => {
    assert.equal(resolvePlugin('frontend', 'nextjs', 'nextjs-basic'), 'nextjs');
    assert.equal(resolvePlugin('frontend', 'nextjs', 'nextjs-ui'), 'nextjs');
    assert.equal(resolvePlugin('frontend', 'nextjs', 'nextjs-14-seo'), 'nextjs');
  });

  it('should map small categories to single plugin', () => {
    assert.equal(resolvePlugin('iot', 'iot', 'some-rule'), 'iot');
    assert.equal(resolvePlugin('simulation', 'simulation', 'some-rule'), 'iot');
  });

  it('should map cross-domain categories', () => {
    assert.equal(resolvePlugin('bio', 'bio', 'some-rule'), 'bio-tech');
    assert.equal(resolvePlugin('science', 'science', 'some-rule'), 'bio-tech');
    assert.equal(resolvePlugin('ar-vr', 'ar-vr', 'some-rule'), 'interactive-media');
    assert.equal(resolvePlugin('gaming', 'gaming', 'some-rule'), 'interactive-media');
  });

  it('should have correct LARGE_CATEGORIES', () => {
    assert.deepEqual(LARGE_CATEGORIES, ['frontend', 'backend', 'devops']);
  });
});

describe('Task 2.3: routing logic integration', () => {
  it('should route general category rules', () => {
    assert.equal(resolvePlugin('general', 'general', 'code-guidelines'), 'code-guidelines');
    assert.equal(resolvePlugin('general', 'general', 'code-guidelines-comprehensive'), 'code-guidelines');
    assert.equal(resolvePlugin('general', 'general', 'code-style'), 'code-guidelines');
    assert.equal(resolvePlugin('general', 'general', 'gherkin-testing'), 'testing');
    assert.equal(resolvePlugin('general', 'general', 'xray-testing'), 'testing');
    assert.equal(resolvePlugin('general', 'general', 'git-conventions'), 'dev-workflow');
  });

  it('should route ai category rules', () => {
    assert.equal(resolvePlugin('ai', 'ai', 'mlops'), 'mlops');
    assert.equal(resolvePlugin('ai', 'ai', 'computer-vision'), 'ai-research');
    assert.equal(resolvePlugin('ai', 'ai', 'edge-ai'), 'ai-research');
  });

  it('should route security category rules', () => {
    assert.equal(resolvePlugin('security', 'security', 'zero-trust'), 'zero-trust-security');
    assert.equal(resolvePlugin('security', 'security', 'homomorphic-encryption'), 'zero-trust-security');
    assert.equal(resolvePlugin('security', 'security', 'privacy-computing'), 'privacy-computing');
  });

  it('should route blockchain category rules', () => {
    assert.equal(resolvePlugin('blockchain', 'blockchain', 'foundry'), 'solidity');
    assert.equal(resolvePlugin('blockchain', 'blockchain', 'smart-contract-security'), 'solidity');
    assert.equal(resolvePlugin('blockchain', 'blockchain', 'web3'), 'web3');
  });

  it('should route devops rules correctly', () => {
    assert.equal(resolvePlugin('devops', 'docker', 'docker-containerization'), 'docker');
    assert.equal(resolvePlugin('devops', 'kubernetes', 'kubernetes-mkdocs-documentation'), 'kubernetes');
    assert.equal(resolvePlugin('devops', 'service-mesh', 'service-mesh'), 'devops-service-mesh');
  });

  it('should route backend rules correctly', () => {
    assert.equal(resolvePlugin('backend', 'go', 'go'), 'go');
    assert.equal(resolvePlugin('backend', 'fastapi', 'fastapi'), 'fastapi');
    assert.equal(resolvePlugin('backend', 'fastapi', 'fastapi-best-practices'), 'fastapi');
    assert.equal(resolvePlugin('backend', 'springboot', 'springboot-jpa'), 'springboot');
    assert.equal(resolvePlugin('backend', 'elixir', 'guidelines'), 'elixir');
    assert.equal(resolvePlugin('backend', 'systems', 'guidelines'), 'cpp');
  });
});
