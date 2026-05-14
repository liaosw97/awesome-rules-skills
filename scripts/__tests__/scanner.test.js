import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { discoverFiles } from '../scanner.js';

const RULES_DIR = fileURLToPath(new URL('../../../awesome-cursorrules-zh/rules', import.meta.url));

describe('Task 2.1: source file discovery', () => {
  it('should discover 132 .cursorrules files', () => {
    const { cursorrules } = discoverFiles(RULES_DIR);
    assert.equal(cursorrules.length, 132, `Expected 132 .cursorrules, got ${cursorrules.length}`);
  });

  it('should discover 338 .mdc files', () => {
    const { mdc } = discoverFiles(RULES_DIR);
    assert.equal(mdc.length, 338, `Expected 338 .mdc files, got ${mdc.length}`);
  });

  it('should return arrays of file paths', () => {
    const { cursorrules, mdc } = discoverFiles(RULES_DIR);
    assert.ok(cursorrules.every(p => p.endsWith('.cursorrules')), 'All cursorrules paths should end with .cursorrules');
    assert.ok(mdc.every(p => p.endsWith('.mdc')), 'All mdc paths should end with .mdc');
  });
});
