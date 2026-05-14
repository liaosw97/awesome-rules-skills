import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseMdc, convertGlobsToPaths, mdcSkillName } from '../mdc-parser.js';

describe('Task 4.1: MDC YAML frontmatter parsing + body extraction', () => {
  it('should parse frontmatter and extract description + globs + body', () => {
    const content = '---\ndescription: "Rules for testing Spring Boot JPA repositories"\nglobs: "*/grpc/**/*.go"\n---\nBody content here';
    const result = parseMdc(content);
    assert.equal(result.description, 'Rules for testing Spring Boot JPA repositories');
    assert.equal(result.globs, '*/grpc/**/*.go');
    assert.equal(result.body, 'Body content here');
  });

  it('should handle missing frontmatter gracefully', () => {
    const result = parseMdc('No frontmatter here');
    assert.equal(result.body, 'No frontmatter here');
    assert.equal(result.description, '');
    assert.equal(result.globs, '');
  });

  it('should trim body whitespace', () => {
    const content = '---\ndescription: "test"\nglobs: "**/*.js"\n---\n  Body content  \n';
    const result = parseMdc(content);
    assert.equal(result.body, 'Body content');
  });

  it('should preserve markdown formatting in body', () => {
    const content = '---\ndescription: "test"\nglobs: "**/*.js"\n---\n## Section\n- Item 1\n- Item 2\n```js\ncode\n```';
    const result = parseMdc(content);
    assert.ok(result.body.includes('## Section'));
    assert.ok(result.body.includes('```js'));
  });
});

describe('Task 4.2: globs → paths conversion', () => {
  it('should wrap glob string into array', () => {
    assert.deepEqual(convertGlobsToPaths('*/grpc/**/*.go'), ['*/grpc/**/*.go']);
  });

  it('should handle **/*.test.js pattern', () => {
    assert.deepEqual(convertGlobsToPaths('**/*.test.js'), ['**/*.test.js']);
  });
});

describe('Task 4.3: MDC sub-skill naming', () => {
  it('should use mdc filename as slug when different from rule', () => {
    assert.equal(mdcSkillName('springboot-jpa', 'springboot-jpa-testing'), 'springboot-jpa-testing');
  });

  it('should use mdc filename directly when it already contains rule prefix', () => {
    assert.equal(mdcSkillName('react', 'react-components'), 'react-components');
  });

  it('should strip .mdc extension', () => {
    assert.equal(mdcSkillName('springboot-jpa', 'springboot-jpa-testing.mdc'), 'springboot-jpa-testing');
  });
});

describe('Task 4.4: MDC sub-skill routing to plugin', () => {
  it('should route to same plugin as parent cursorrules', async () => {
    const { resolvePlugin } = await import('../routing.js');
    // springboot-jpa is under backend/springboot → springboot plugin
    const plugin = resolvePlugin('backend', 'springboot', 'springboot-jpa');
    assert.equal(plugin, 'springboot');
  });
});
