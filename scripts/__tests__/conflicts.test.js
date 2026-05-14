import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { detectConflicts, resolveConflict, resolveAllConflicts } from '../conflicts.js';

describe('Task 5.1: name conflict detection', () => {
  it('should detect same rule-name in different subcategories', () => {
    const files = [
      { category: 'devops', subcategory: 'service-mesh', ruleName: 'service-mesh' },
      { category: 'security', subcategory: 'service-mesh', ruleName: 'service-mesh' },
    ];
    const conflicts = detectConflicts(files);
    assert.equal(conflicts.length, 1);
    assert.equal(conflicts[0].name, 'service-mesh');
    assert.equal(conflicts[0].files.length, 2);
  });

  it('should return empty array when no conflicts', () => {
    const files = [
      { category: 'frontend', subcategory: 'react', ruleName: 'react-typescript' },
      { category: 'backend', subcategory: 'go', ruleName: 'go' },
    ];
    assert.deepEqual(detectConflicts(files), []);
  });
});

describe('Task 5.2: conflict resolution', () => {
  it('should resolve with category prefix when subcategory equals ruleName', () => {
    // devops/service-mesh/service-mesh → devops-service-mesh
    assert.equal(resolveConflict('service-mesh', 'service-mesh', 'devops'), 'devops-service-mesh');
  });

  it('should resolve with subcategory prefix when different', () => {
    // security/security/service-mesh → security-service-mesh
    assert.equal(resolveConflict('service-mesh', 'security'), 'security-service-mesh');
  });

  it('should resolve guidelines conflicts', () => {
    assert.equal(resolveConflict('guidelines', 'elixir'), 'elixir-guidelines');
    assert.equal(resolveConflict('guidelines', 'cpp'), 'cpp-guidelines');
  });

  it('should cascade to category-subcategory-name in resolveAllConflicts', () => {
    // Simulate files with same subcategory AND ruleName
    const files = [
      { category: 'cat1', subcategory: 'sub', ruleName: 'name' },
      { category: 'cat2', subcategory: 'sub', ruleName: 'name' },
    ];
    const resolved = resolveAllConflicts(files);
    const names = resolved.map(f => f.skillName);
    assert.equal(new Set(names).size, 2, `Names should be unique: ${names}`);
  });
});

describe('Task 5.3: verify 4 known conflicts', () => {
  it('should resolve all 4 known conflicts with unique names', () => {
    const files = [
      { category: 'devops', subcategory: 'service-mesh', ruleName: 'service-mesh' },
      { category: 'security', subcategory: 'security', ruleName: 'service-mesh' },
      { category: 'backend', subcategory: 'elixir', ruleName: 'guidelines' },
      { category: 'systems', subcategory: 'cpp', ruleName: 'guidelines' },
      { category: 'iot', subcategory: 'iot', ruleName: 'digital-twin' },
      { category: 'simulation', subcategory: 'simulation', ruleName: 'digital-twin' },
      { category: 'cms', subcategory: 'drupal', ruleName: 'drupal-11' },
    ];
    const resolved = resolveAllConflicts(files);
    const names = resolved.map(f => f.skillName);

    // All names should be unique
    assert.equal(new Set(names).size, names.length, `Duplicate skill names: ${names}`);

    // Verify specific resolutions
    const sm = resolved.filter(f => f.ruleName === 'service-mesh');
    assert.ok(sm.some(f => f.skillName.includes('devops') || f.skillName.includes('security')));
  });
});
