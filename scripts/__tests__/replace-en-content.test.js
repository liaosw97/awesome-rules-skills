import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { routeToPlugin, parseEnMdc, generateEnSkill, addPendingTag, replaceContent } from '../replace-en-content.js';

describe('Task 3.1: routeToPlugin — 读取 classification 并路由', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'replace-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should route a classified entry to the correct plugin directory', () => {
    const skillDir = join(fixtureDir, 'abp-framework', 'skills', 'abp-framework');
    mkdirSync(skillDir, { recursive: true });

    const entry = {
      en_file: 'aspnet-abp-cursorrules-prompt-file.mdc',
      category: 'backend',
      subcategory: 'dotnet',
      ruleName: 'abp-framework',
      confidence: 'high',
      needs_review: false,
    };

    const mockResolve = () => 'abp-framework';
    const result = routeToPlugin(entry, fixtureDir, mockResolve);

    assert.deepEqual(result, {
      plugin: 'abp-framework',
      skillDir: join(fixtureDir, 'abp-framework', 'skills', 'abp-framework'),
    });
  });
});

describe('Task 3.2: parseEnMdc — 解析英文 .mdc 文件', () => {
  it('should extract description and body from a valid .mdc file', () => {
    const content = '---\ndescription: ABP Framework best practices\nglobs: **/*.cs\n---\nYou are an expert in ABP Framework development.';
    const result = parseEnMdc(content);
    assert.equal(result.description, 'ABP Framework best practices');
    assert.ok(result.body.includes('ABP Framework'));
  });

  it('should handle .mdc without frontmatter', () => {
    const content = 'Just plain text content without frontmatter.';
    const result = parseEnMdc(content);
    assert.equal(result.description, '');
    assert.equal(result.body, content);
  });
});

describe('Task 3.3: generateEnSkill — 生成并写入 SKILL.en.md', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'replace-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should generate SKILL.en.md with translation-status translated', () => {
    const skillDir = join(fixtureDir, 'plugin-a', 'skills', 'rule-a');
    mkdirSync(skillDir, { recursive: true });

    const result = generateEnSkill({
      skillName: 'rule-a',
      description: 'Rule A description',
      body: 'English content for rule A.',
    });

    assert.ok(result.includes('name: rule-a-en'));
    assert.ok(result.includes('translation-status: translated'));
    assert.ok(result.includes('English content for rule A.'));
    assert.ok(result.includes('description: Rule A description'));
  });

  it('should have English character ratio > 70%', () => {
    const content = generateEnSkill({
      skillName: 'react-hooks',
      description: 'React Hooks guide',
      body: 'This is a comprehensive guide about React Hooks patterns and best practices for modern development.',
    });

    const bodyStart = content.indexOf('---', 4) + 3;
    const body = content.slice(bodyStart).trim();
    const asciiCount = body.replace(/[\x00-\x7F]/g, '').length;
    const ratio = (body.length - asciiCount) / body.length;
    assert.ok(ratio > 0.7, `English ratio ${ratio} should be > 0.7`);
  });
});

describe('Task 3.4: routing 失败处理', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'replace-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should record routing failure and not modify any file', () => {
    const classification = {
      stats: { total_en_files: 1, classified: 1, unmatched: 0 },
      classifications: [{
        en_file: 'unknown.mdc',
        category: 'unknown',
        subcategory: 'unknown',
        ruleName: 'unknown-rule',
        confidence: 'low',
        needs_review: true,
      }],
      unmatched: [],
    };

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });

    const result = replaceContent(classification, enRulesDir, fixtureDir, {
      resolvePlugin: () => null,
    });

    assert.equal(result.failed_routes.length, 1);
    assert.equal(result.failed_routes[0].en_file, 'unknown.mdc');
    assert.equal(result.replaced, 0);
  });
});

describe('Task 3.5: 未匹配技能 pending 标记', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'replace-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should add translation-status: pending to unmatched SKILL.en.md', () => {
    const skillDir = join(fixtureDir, 'plugin-x', 'skills', 'rule-x');
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, 'SKILL.en.md'), '---\nname: rule-x-en\n---\n中文内容');

    const classification = {
      stats: { total_en_files: 0, classified: 0, unmatched: 0 },
      classifications: [],
      unmatched: [],
    };

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });

    const result = replaceContent(classification, enRulesDir, fixtureDir, {
      resolvePlugin: () => null,
    });

    assert.equal(result.pending, 1);
    const updated = readFileSync(join(skillDir, 'SKILL.en.md'), 'utf-8');
    assert.ok(updated.includes('translation-status: pending'));
  });

  it('should not duplicate pending tag if already present', () => {
    const skillDir = join(fixtureDir, 'plugin-y', 'skills', 'rule-y');
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, 'SKILL.en.md'), '---\nname: rule-y-en\ntranslation-status: pending\n---\n中文内容');

    const classification = {
      stats: { total_en_files: 0, classified: 0, unmatched: 0 },
      classifications: [],
      unmatched: [],
    };

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });

    replaceContent(classification, enRulesDir, fixtureDir, {
      resolvePlugin: () => null,
    });

    const updated = readFileSync(join(skillDir, 'SKILL.en.md'), 'utf-8');
    const matchCount = (updated.match(/translation-status: pending/g) || []).length;
    assert.equal(matchCount, 1);
  });
});

describe('Task 3.6: SKILL.en.md 不存在时跳过', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'replace-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should skip skills without SKILL.en.md and record in skipped list', () => {
    const skillDir = join(fixtureDir, 'plugin-z', 'skills', 'rule-z');
    mkdirSync(skillDir, { recursive: true });
    // Only SKILL.md, no SKILL.en.md
    writeFileSync(join(skillDir, 'SKILL.md'), '---\nname: rule-z\n---\nContent');

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });
    writeFileSync(join(enRulesDir, 'rule-z.mdc'), '---\ndescription: Z\n---\nEnglish Z');

    const classification = {
      stats: { total_en_files: 1, classified: 1, unmatched: 0 },
      classifications: [{
        en_file: 'rule-z.mdc',
        category: 'test',
        subcategory: 'test',
        ruleName: 'rule-z',
        confidence: 'high',
        needs_review: false,
      }],
      unmatched: [],
    };

    const result = replaceContent(classification, enRulesDir, fixtureDir, {
      resolvePlugin: () => 'plugin-z',
    });

    assert.equal(result.skipped, 1);
    assert.ok(!existsSync(join(skillDir, 'SKILL.en.md')));
  });
});

describe('Task 3.7: .mdc 解析失败处理', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'replace-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should skip files with missing .mdc and record in parse_errors', () => {
    const skillDir = join(fixtureDir, 'plugin-b', 'skills', 'rule-b');
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, 'SKILL.en.md'), '---\nname: rule-b-en\n---\nOriginal');

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });
    // Don't create broken.mdc — file not found triggers parse error

    const classification = {
      stats: { total_en_files: 1, classified: 1, unmatched: 0 },
      classifications: [{
        en_file: 'missing.mdc',
        category: 'test',
        subcategory: 'test',
        ruleName: 'rule-b',
        confidence: 'high',
        needs_review: false,
      }],
      unmatched: [],
    };

    const result = replaceContent(classification, enRulesDir, fixtureDir, {
      resolvePlugin: () => 'plugin-b',
    });

    assert.equal(result.parse_errors.length, 1);
    assert.equal(result.parse_errors[0].en_file, 'missing.mdc');
    assert.equal(result.replaced, 0);
  });
});

describe('Task 3.8: 输出替换摘要', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'replace-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should return summary with all counts', () => {
    // Setup: 2 plugins, 1 classified (success), 1 unmatched
    const skillA = join(fixtureDir, 'plugin-a', 'skills', 'rule-a');
    mkdirSync(skillA, { recursive: true });
    writeFileSync(join(skillA, 'SKILL.en.md'), '---\nname: rule-a-en\n---\nOld Chinese');

    const skillB = join(fixtureDir, 'plugin-b', 'skills', 'rule-b');
    mkdirSync(skillB, { recursive: true });
    writeFileSync(join(skillB, 'SKILL.en.md'), '---\nname: rule-b-en\n---\nChinese content');

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });
    writeFileSync(join(enRulesDir, 'rule-a.mdc'), '---\ndescription: Rule A guide\n---\nEnglish content for rule A.');

    const classification = {
      stats: { total_en_files: 1, classified: 1, unmatched: 0 },
      classifications: [{
        en_file: 'rule-a.mdc',
        category: 'test',
        subcategory: 'test',
        ruleName: 'rule-a',
        confidence: 'high',
        needs_review: false,
      }],
      unmatched: [],
    };

    const result = replaceContent(classification, enRulesDir, fixtureDir, {
      resolvePlugin: (cat, subcat, rule) => rule === 'rule-a' ? 'plugin-a' : null,
    });

    assert.equal(result.replaced, 1);
    assert.equal(result.pending, 1);
    assert.equal(result.failed_routes.length, 0);
    assert.equal(result.parse_errors.length, 0);
    assert.equal(result.skipped, 0);

    // Verify rule-a was replaced with English content
    const updated = readFileSync(join(skillA, 'SKILL.en.md'), 'utf-8');
    assert.ok(updated.includes('translation-status: translated'));
    assert.ok(updated.includes('English content'));

    // Verify rule-b got pending tag
    const pending = readFileSync(join(skillB, 'SKILL.en.md'), 'utf-8');
    assert.ok(pending.includes('translation-status: pending'));
  });

  it('should satisfy conservation: replaced + pending + failed + parse_errors + skipped = total SKILL.en.md', () => {
    const skillA = join(fixtureDir, 'plugin-a', 'skills', 'rule-a');
    mkdirSync(skillA, { recursive: true });
    writeFileSync(join(skillA, 'SKILL.en.md'), '---\nname: rule-a-en\n---\nOld');

    const skillB = join(fixtureDir, 'plugin-b', 'skills', 'rule-b');
    mkdirSync(skillB, { recursive: true });
    writeFileSync(join(skillB, 'SKILL.en.md'), '---\nname: rule-b-en\n---\nOld');

    const skillC = join(fixtureDir, 'plugin-c', 'skills', 'rule-c');
    mkdirSync(skillC, { recursive: true });
    writeFileSync(join(skillC, 'SKILL.en.md'), '---\nname: rule-c-en\n---\nOld');

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });
    writeFileSync(join(enRulesDir, 'rule-a.mdc'), '---\ndescription: A\n---\nEnglish A');
    writeFileSync(join(enRulesDir, 'bad.mdc'), '---\n[[\n---\nBad');

    const classification = {
      stats: { total_en_files: 2, classified: 2, unmatched: 0 },
      classifications: [
        { en_file: 'rule-a.mdc', category: 't', subcategory: 't', ruleName: 'rule-a', confidence: 'high', needs_review: false },
        { en_file: 'bad.mdc', category: 't', subcategory: 't', ruleName: 'rule-c', confidence: 'high', needs_review: false },
      ],
      unmatched: [],
    };

    const result = replaceContent(classification, enRulesDir, fixtureDir, {
      resolvePlugin: (cat, subcat, rule) => {
        if (rule === 'rule-a') return 'plugin-a';
        if (rule === 'rule-b') return null;
        if (rule === 'rule-c') return 'plugin-c';
        return null;
      },
    });

    const total = result.replaced + result.pending + result.failed_routes.length + result.parse_errors.length + result.skipped;
    // 3 SKILL.en.md files total
    assert.equal(total, 3);
  });
});
