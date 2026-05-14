import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractTechNames, formatDescription, generateDescription, generateMdcDescription } from '../description.js';

describe('Task 6.1: extract from structured markdown', () => {
  it('should extract tech name from # heading', () => {
    const names = extractTechNames('# Go .cursorrules 提示文件', 'structured');
    assert.ok(names.includes('Go'));
  });

  it('should extract React from heading', () => {
    const names = extractTechNames('# React TypeScript Component Guide', 'structured');
    assert.ok(names.some(n => n === 'React' || n === 'TypeScript'));
  });
});

describe('Task 6.2: extract from flat list', () => {
  it('should extract tech names from role definition', () => {
    const names = extractTechNames('你是 Python、FastAPI 和可扩展 API 开发方面的专家。', 'flat');
    assert.ok(names.includes('Python') || names.includes('FastAPI'));
  });
});

describe('Task 6.3: extract from mixed format', () => {
  it('should prefer ## headings', () => {
    const names = extractTechNames('你是专家。\n## 技术栈\n- React\n- TypeScript', 'mixed');
    assert.ok(names.length > 0);
  });

  it('should fall back to role definition when no tech in headings', () => {
    const names = extractTechNames('你是 Docker 方面的专家。\n## 总则\n内容', 'mixed');
    assert.ok(names.some(n => n === 'Docker'));
  });
});

describe('Task 6.4: MDC description extraction', () => {
  it('should use mdc description directly', () => {
    assert.equal(generateMdcDescription('Rules for testing Spring Boot JPA repositories'), 'Rules for testing Spring Boot JPA repositories');
  });

  it('should truncate over 500 chars', () => {
    const long = 'A'.repeat(600);
    const result = generateMdcDescription(long);
    assert.ok(result.length <= 500);
  });
});

describe('Task 6.5: description formatting', () => {
  it('should format with template', () => {
    const desc = formatDescription(['FastAPI'], 'scalable API development');
    assert.equal(desc, 'Use when working with FastAPI — scalable API development');
  });

  it('should stay under 500 chars', () => {
    const desc = formatDescription(['React'], 'a'.repeat(600));
    assert.ok(desc.length <= 500);
  });

  it('should include at least one tech name', () => {
    const desc = formatDescription(['React'], 'component development');
    assert.ok(desc.includes('React'));
  });
});

describe('Task 6: generateDescription integration', () => {
  it('should generate description from parsed content', () => {
    const desc = generateDescription({
      title: 'Go .cursorrules 提示文件',
      roleLine: '你是 Go 语言、后端开发和分布式系统方面的专家。',
      sections: [{ heading: '核心原则', content: '- 内容' }],
    }, 'structured');
    assert.ok(desc.includes('Go'));
    assert.ok(desc.length <= 500);
  });
});
