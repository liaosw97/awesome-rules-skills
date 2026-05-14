import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateSkillZh, generateSkillEn, generateMdcSkill } from '../generator.js';

describe('Task 7.1: Chinese SKILL.md output', () => {
  it('should generate YAML frontmatter with name and description', () => {
    const result = generateSkillZh({
      name: 'fastapi',
      description: 'Use when working with FastAPI — scalable API development',
      roleLine: '你是 FastAPI 方面的专家。',
      sections: [{ heading: '核心原则', content: '- 原则1\n- 原则2' }],
    });
    assert.ok(result.startsWith('---\n'));
    assert.ok(result.includes('name: fastapi'));
    assert.ok(result.includes('description:'));
    assert.ok(result.includes('---\n\n'));
  });

  it('should include role line as opening paragraph', () => {
    const result = generateSkillZh({
      name: 'fastapi',
      description: 'desc',
      roleLine: '你是 FastAPI 方面的专家。',
      sections: [],
    });
    assert.ok(result.includes('你是 FastAPI 方面的专家'));
  });

  it('should preserve Chinese content', () => {
    const result = generateSkillZh({
      name: 'test',
      description: 'desc',
      roleLine: null,
      sections: [{ heading: '核心原则', content: '使用 FastAPI 框架开发 API' }],
    });
    assert.ok(result.includes('核心原则'));
    assert.ok(result.includes('使用 FastAPI 框架开发 API'));
  });
});

describe('Task 7.2: English SKILL.en.md output', () => {
  it('should use -en suffix in name', () => {
    const result = generateSkillEn({
      name: 'fastapi',
      description: 'Use when working with FastAPI',
      roleLine: '你是 FastAPI 方面的专家。',
      sections: [{ heading: '核心原则', content: '- 原则1' }],
    });
    assert.ok(result.includes('name: fastapi-en'));
  });

  it('should share same description as Chinese version', () => {
    const desc = 'Use when working with FastAPI — API development';
    const result = generateSkillEn({
      name: 'fastapi',
      description: desc,
      roleLine: null,
      sections: [],
    });
    assert.ok(result.includes(desc));
  });
});

describe('Task 7.3: MDC sub-skill output', () => {
  it('should include paths field in frontmatter', () => {
    const result = generateMdcSkill({
      name: 'springboot-jpa-testing',
      description: 'Rules for testing JPA',
      paths: ['*/grpc/**/*.go'],
      body: 'Testing guidelines here',
    });
    assert.ok(result.includes('paths:'));
    assert.ok(result.includes('*/grpc/**/*.go'));
  });

  it('should use sub-skill name in frontmatter', () => {
    const result = generateMdcSkill({
      name: 'springboot-jpa-testing',
      description: 'Rules for testing',
      paths: [],
      body: 'Content',
    });
    assert.ok(result.includes('name: springboot-jpa-testing'));
  });

  it('should include body content', () => {
    const result = generateMdcSkill({
      name: 'test',
      description: 'desc',
      paths: [],
      body: '## Section\n- Item 1',
    });
    assert.ok(result.includes('## Section'));
  });
});
