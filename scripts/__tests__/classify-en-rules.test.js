import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  extractKeywords,
  scanZhRules,
  normalizeKeyword,
  matchExact,
  matchContains,
  matchKeywordOverlap,
  deduplicate,
  classifyRules,
} from '../classify-en-rules.js';

// ── Task 2.1: extractKeywords ──

describe('Task 2.1: extractKeywords — 英文文件名关键词提取', () => {
  it('should extract keywords from long hyphenated filename', () => {
    const result = extractKeywords('aspnet-abp-cursorrules-prompt-file.mdc');
    assert.ok(result.includes('aspnet'), `Expected 'aspnet' in ${JSON.stringify(result)}`);
    assert.ok(result.includes('abp'), `Expected 'abp' in ${JSON.stringify(result)}`);
  });

  it('should extract keyword from simple filename', () => {
    const result = extractKeywords('react.mdc');
    assert.ok(result.includes('react'), `Expected 'react' in ${JSON.stringify(result)}`);
  });

  it('should extract keywords from complex multi-tech filename', () => {
    const result = extractKeywords('nextjs15-react19-vercelai-tailwind-cursorrules-prompt-file.mdc');
    assert.ok(result.includes('nextjs15'), `Expected 'nextjs15' in ${JSON.stringify(result)}`);
    assert.ok(result.includes('react19'), `Expected 'react19' in ${JSON.stringify(result)}`);
    assert.ok(result.includes('vercelai'), `Expected 'vercelai' in ${JSON.stringify(result)}`);
    assert.ok(result.includes('tailwind'), `Expected 'tailwind' in ${JSON.stringify(result)}`);
  });

  it('should remove -cursorrules-prompt-file-pro suffix', () => {
    const result = extractKeywords('vue-cursorrules-prompt-file-pro.mdc');
    assert.ok(result.includes('vue'), `Expected 'vue' in ${JSON.stringify(result)}`);
    assert.ok(!result.includes('cursorrules'), `Should not contain 'cursorrules'`);
    assert.ok(!result.includes('prompt'), `Should not contain 'prompt'`);
  });

  it('should remove -cursorrules suffix', () => {
    const result = extractKeywords('svelte-cursorrules.mdc');
    assert.deepEqual(result, ['svelte']);
  });
});

// ── Task 2.2: scanZhRules ──

describe('Task 2.2: scanZhRules — 中文版目录结构扫描', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'classify-zh-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should extract (category, subcategory, ruleName) triples', () => {
    // rules/backend/dotnet/abp-framework/.cursorrules
    const ruleDir = join(fixtureDir, 'backend', 'dotnet', 'abp-framework');
    mkdirSync(ruleDir, { recursive: true });
    writeFileSync(join(ruleDir, '.cursorrules'), 'some rule content');

    const triples = scanZhRules(fixtureDir);
    const abp = triples.find(t => t.ruleName === 'abp-framework');
    assert.ok(abp, 'Should find abp-framework');
    assert.equal(abp.category, 'backend');
    assert.equal(abp.subcategory, 'dotnet');
  });

  it('should default subcategory to category when no intermediate dir', () => {
    // rules/ai/computer-vision/.cursorrules (no subcategory)
    const ruleDir = join(fixtureDir, 'ai', 'computer-vision');
    mkdirSync(ruleDir, { recursive: true });
    writeFileSync(join(ruleDir, '.cursorrules'), 'some rule content');

    const triples = scanZhRules(fixtureDir);
    const cv = triples.find(t => t.ruleName === 'computer-vision');
    assert.ok(cv, 'Should find computer-vision');
    // When there are only 2 levels (category/ruleName), subcategory defaults to category
    assert.equal(cv.category, 'ai');
    assert.equal(cv.subcategory, 'ai');
  });
});

// ── Task 2.3: matchExact ──

describe('Task 2.3: matchExact — 精确匹配', () => {
  it('should match normalized "FastAPI" to "fastapi"', () => {
    const result = matchExact(normalizeKeyword('FastAPI'), normalizeKeyword('fastapi'));
    assert.deepEqual(result, { matched: true, confidence: 'high', matchType: 'exact', needs_review: false });
  });

  it('should not match different keywords', () => {
    const result = matchExact(normalizeKeyword('react'), normalizeKeyword('vue'));
    assert.equal(result.matched, false);
  });
});

// ── Task 2.4: matchContains ──

describe('Task 2.4: matchContains — 包含匹配', () => {
  it('should match when en key contains zh key with sufficient ratio', () => {
    // "reacthooks" contains "react" → ratio 5/10 = 0.5 > 0.4
    const result = matchContains('reacthooks', 'react');
    assert.equal(result.matched, true);
    assert.equal(result.confidence, 'high');
  });

  it('should NOT match short keyword inside unrelated long word (java vs javascript)', () => {
    const result = matchContains('java', 'javascript');
    // "java" is length 4, "javascript" is length 10, ratio = 0.4 — at boundary
    // We want to prevent "java" matching "javascript"
    assert.equal(result.matched, false, 'java should not match javascript');
  });

  it('should match when longer contains shorter with sufficient ratio', () => {
    const result = matchContains('reactnative', 'react');
    assert.equal(result.matched, true);
  });
});

// ── Task 2.5: matchKeywordOverlap ──

describe('Task 2.5: matchKeywordOverlap — 子串交集匹配', () => {
  it('should match with keyword overlap', () => {
    const enKeywords = ['react', 'native', 'expo'];
    const zhKeywords = ['react', 'native', 'expo', 'router'];
    const result = matchKeywordOverlap(enKeywords, zhKeywords);
    assert.equal(result.matched, true);
    assert.equal(result.confidence, 'low');
    assert.equal(result.needs_review, true);
  });

  it('should not match with no overlap', () => {
    const enKeywords = ['angular', 'rxjs'];
    const zhKeywords = ['react', 'hooks'];
    const result = matchKeywordOverlap(enKeywords, zhKeywords);
    assert.equal(result.matched, false);
  });
});

// ── Task 2.6: no match handling ──

describe('Task 2.6: classifyRules — 无匹配处理', () => {
  let enDir, zhDir, fixtureRoot;

  beforeEach(() => {
    fixtureRoot = mkdtempSync(join(tmpdir(), 'classify-nomatch-'));
    enDir = join(fixtureRoot, 'en-rules');
    zhDir = join(fixtureRoot, 'zh-rules');
    mkdirSync(enDir, { recursive: true });
    mkdirSync(zhDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(fixtureRoot, { recursive: true, force: true });
  });

  it('should put unmatchable files into unmatched array', () => {
    writeFileSync(join(enDir, 'xyzunknown-cursorrules-prompt-file.mdc'), 'content');
    // No matching zh rule
    const ruleDir = join(zhDir, 'frontend', 'react', 'react-hooks');
    mkdirSync(ruleDir, { recursive: true });
    writeFileSync(join(ruleDir, '.cursorrules'), 'rule');

    const result = classifyRules(enDir, zhDir);
    assert.equal(result.unmatched.length, 1, 'Should have 1 unmatched');
    assert.equal(result.unmatched[0].en_file, 'xyzunknown-cursorrules-prompt-file.mdc');
    assert.ok(result.unmatched[0].keywords, 'Unmatched should record keywords');
  });
});

// ── Task 2.7: deduplicate ──

describe('Task 2.7: deduplicate — 去重处理', () => {
  it('should keep best match and move loser to unmatched', () => {
    const classifications = [
      { en_file: 'abp-framework-cursorrules.mdc', ruleName: 'abp-framework', category: 'backend', subcategory: 'dotnet', confidence: 'high', matchType: 'exact' },
      { en_file: 'aspnet-abp-cursorrules-prompt-file.mdc', ruleName: 'abp-framework', category: 'backend', subcategory: 'dotnet', confidence: 'high', matchType: 'contains' },
    ];
    const { kept, removed } = deduplicate(classifications);
    assert.equal(kept.length, 1, 'Should keep 1');
    assert.equal(removed.length, 1, 'Should remove 1');
    // The one with "abp-framework" in the name is a better match
    assert.equal(kept[0].en_file, 'abp-framework-cursorrules.mdc');
    assert.equal(removed[0].reason, 'duplicate_resolution');
  });
});

// ── Task 2.8: classifyRules full output ──

describe('Task 2.8: classifyRules — 完整输出', () => {
  let enDir, zhDir, fixtureRoot;

  beforeEach(() => {
    fixtureRoot = mkdtempSync(join(tmpdir(), 'classify-full-'));
    enDir = join(fixtureRoot, 'en-rules');
    zhDir = join(fixtureRoot, 'zh-rules');
    mkdirSync(enDir, { recursive: true });
    mkdirSync(zhDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(fixtureRoot, { recursive: true, force: true });
  });

  it('should produce complete classification result', () => {
    // 3 English .mdc files
    writeFileSync(join(enDir, 'react-cursorrules-prompt-file.mdc'), 'content');
    writeFileSync(join(enDir, 'fastapi-cursorrules-prompt-file.mdc'), 'content');
    writeFileSync(join(enDir, 'unknown-xyz-cursorrules-prompt-file.mdc'), 'content');

    // Matching Chinese rules
    const reactDir = join(zhDir, 'frontend', 'react', 'react');
    mkdirSync(reactDir, { recursive: true });
    writeFileSync(join(reactDir, '.cursorrules'), 'rule');

    const fastapiDir = join(zhDir, 'backend', 'python', 'fastapi');
    mkdirSync(fastapiDir, { recursive: true });
    writeFileSync(join(fastapiDir, '.cursorrules'), 'rule');

    const result = classifyRules(enDir, zhDir);

    // Check structure
    assert.ok(result.stats, 'Should have stats');
    assert.ok(Array.isArray(result.classifications), 'Should have classifications array');
    assert.ok(Array.isArray(result.unmatched), 'Should have unmatched array');

    // Check conservation: classified + unmatched = total
    assert.equal(result.stats.total_en_files, 3);
    assert.equal(result.stats.classified + result.stats.unmatched, result.stats.total_en_files,
      'classified + unmatched must equal total_en_files');
  });
});
