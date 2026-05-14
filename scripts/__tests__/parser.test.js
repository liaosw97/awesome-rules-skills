import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { classifyFormat, parseCursorrules, extractRoleLine } from '../parser.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RULES_DIR = fileURLToPath(new URL('../../../awesome-cursorrules-zh/rules', import.meta.url));

describe('Task 3.1: format classifier', () => {
  it('should classify structured markdown (starts with #)', () => {
    assert.equal(classifyFormat('# Go .cursorrules 提示文件\n## 核心原则\n内容'), 'structured');
  });

  it('should classify flat list (starts with 你是, no ##)', () => {
    assert.equal(classifyFormat('你是 Python 方面的专家。\n核心原则\n- 原则1'), 'flat');
  });

  it('should classify mixed format (starts with 你是, has ##)', () => {
    assert.equal(classifyFormat('你是 React 专家。\n## 技术栈\n- React'), 'mixed');
  });

  it('should return structured for # without ##', () => {
    assert.equal(classifyFormat('# 标题\n内容'), 'structured');
  });
});

describe('Task 3.2: classify all 132 files', () => {
  it('should classify every file as structured/flat/mixed', async () => {
    const { discoverFiles } = await import('../scanner.js');
    const { cursorrules } = discoverFiles(RULES_DIR);
    const unknown = [];
    const counts = { structured: 0, flat: 0, mixed: 0 };
    for (const fp of cursorrules) {
      const content = readFileSync(fp, 'utf-8');
      const fmt = classifyFormat(content);
      if (!['structured', 'flat', 'mixed'].includes(fmt)) {
        unknown.push(fp);
      } else {
        counts[fmt]++;
      }
    }
    assert.equal(unknown.length, 0, `Unknown format files: ${unknown.join(', ')}`);
    assert.equal(counts.structured + counts.flat + counts.mixed, 132);
    console.log(`Format distribution: structured=${counts.structured}, flat=${counts.flat}, mixed=${counts.mixed}`);
  });
});

describe('Task 3.3: structured markdown parsing', () => {
  it('should extract title from # heading', () => {
    const result = parseCursorrules('# Go Rules\n## Section\nContent', 'structured');
    assert.equal(result.title, 'Go Rules');
    assert.ok(result.sections.length >= 1);
    assert.equal(result.sections[0].heading, 'Section');
  });

  it('should preserve ##/### heading levels', () => {
    const result = parseCursorrules('# Title\n## H2\n### H3\nContent\n## H2b\nMore', 'structured');
    assert.ok(result.sections.length >= 2);
  });
});

describe('Task 3.4: flat list parsing', () => {
  it('should extract role line', () => {
    const result = parseCursorrules('你是 Python 专家。\n核心原则\n- 原则1\n- 原则2\n最佳实践\n- 实践1', 'flat');
    assert.equal(result.roleLine, '你是 Python 专家。');
  });

  it('should convert text labels to ## headings', () => {
    const result = parseCursorrules('你是专家。\n核心原则\n- 原则1', 'flat');
    const body = result.sections.map(s => `## ${s.heading}\n${s.content}`).join('\n');
    assert.ok(body.includes('## 核心原则'));
  });

  it('should preserve bullet items', () => {
    const result = parseCursorrules('你是专家。\n核心原则\n- 原则1\n- 原则2', 'flat');
    const section = result.sections.find(s => s.heading === '核心原则');
    assert.ok(section.content.includes('- 原则1'));
    assert.ok(section.content.includes('- 原则2'));
  });
});

describe('Task 3.5: mixed format parsing', () => {
  it('should preserve existing ## headings', () => {
    const result = parseCursorrules('你是专家。\n## 技术栈\n- React\n### 子节\n内容', 'mixed');
    const techSection = result.sections.find(s => s.heading.includes('技术栈'));
    assert.ok(techSection, 'Should find 技术栈 section');
  });

  it('should convert bare labels to ## headings', () => {
    const result = parseCursorrules('你是专家。\n## 技术栈\n- React\n注意事项\n- 注意1', 'mixed');
    const noteSection = result.sections.find(s => s.heading === '注意事项');
    assert.ok(noteSection, 'Bare label "注意事项" should become a section');
  });
});

describe('Task 3.6: role definition extraction', () => {
  it('should extract role line from 你是 pattern', () => {
    assert.equal(extractRoleLine('你是 Python、FastAPI 方面的专家。\n后续内容'), '你是 Python、FastAPI 方面的专家。');
  });

  it('should return null for structured format (starts with #)', () => {
    assert.equal(extractRoleLine('# Title\n内容'), null);
  });

  it('should extract role line from mixed format', () => {
    const line = extractRoleLine('你是 React 专家。\n## Section');
    assert.equal(line, '你是 React 专家。');
  });
});
