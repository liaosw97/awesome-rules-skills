import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { runAudit, runClassify, runReplace, runAll } from '../replace-en-skills.js';

function createPluginFixture(root, pluginName, skillName, enContent) {
  const skillDir = join(root, 'plugins', pluginName, 'skills', skillName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), `---\nname: ${skillName}\n---\nChinese content`);
  writeFileSync(join(skillDir, 'SKILL.en.md'), enContent || `---\nname: ${skillName}-en\n---\nChinese content`);
  return skillDir;
}

function createEnRulesFixture(root, filename, content) {
  const dir = join(root, 'en-rules');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, filename), content);
  return dir;
}

function createZhRulesFixture(root, category, subcategory, ruleName) {
  const dir = join(root, 'zh-rules', category, subcategory, ruleName);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, '.cursorrules'), `rule content for ${ruleName}`);
  return join(root, 'zh-rules');
}

describe('Task 4.1: runAudit — 子命令 audit', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'cli-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should run audit and write audit-report.json', () => {
    createPluginFixture(fixtureDir, 'p1', 's1');

    const pluginsDir = join(fixtureDir, 'plugins');
    const outputFile = join(fixtureDir, 'audit-report.json');

    const result = runAudit(pluginsDir, { outputFile });

    assert.ok(result.summary.total > 0);
    assert.ok(existsSync(outputFile));
    const report = JSON.parse(readFileSync(outputFile, 'utf-8'));
    assert.ok(report.summary);
    assert.ok(Array.isArray(report.issues));
  });
});

describe('Task 4.1: runClassify — 子命令 classify', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'cli-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should run classify and write classification.json', () => {
    const enRulesDir = createEnRulesFixture(fixtureDir, 'react-cursorrules-prompt-file.mdc',
      '---\ndescription: React guide\n---\nReact content');
    const zhRulesDir = createZhRulesFixture(fixtureDir, 'frontend', 'react', 'react');

    const outputFile = join(fixtureDir, 'classification.json');
    const result = runClassify(enRulesDir, zhRulesDir, { outputFile });

    assert.ok(result.stats);
    assert.ok(existsSync(outputFile));
    const report = JSON.parse(readFileSync(outputFile, 'utf-8'));
    assert.ok(report.stats);
    assert.ok(Array.isArray(report.classifications));
  });
});

describe('Task 4.1: runReplace — 子命令 replace', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'cli-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should read classification.json and run replace', () => {
    createPluginFixture(fixtureDir, 'p1', 'react', '---\nname: react-en\n---\nChinese');
    const enRulesDir = createEnRulesFixture(fixtureDir, 'react-cursorrules-prompt-file.mdc',
      '---\ndescription: React guide\n---\nEnglish React content');

    const classification = {
      stats: { total_en_files: 1, classified: 1, unmatched: 0 },
      classifications: [{
        en_file: 'react-cursorrules-prompt-file.mdc',
        category: 'frontend',
        subcategory: 'react',
        ruleName: 'react',
        confidence: 'high',
        needs_review: false,
      }],
      unmatched: [],
    };
    const classFile = join(fixtureDir, 'classification.json');
    writeFileSync(classFile, JSON.stringify(classification));

    const result = runReplace(classFile, enRulesDir, join(fixtureDir, 'plugins'), {
      resolvePlugin: () => 'p1',
    });

    assert.equal(result.replaced, 1);
  });

  it('should throw if classification.json does not exist', () => {
    const missingFile = join(fixtureDir, 'nonexistent.json');
    assert.throws(() => runReplace(missingFile, '/tmp', '/tmp'), /classification\.json/);
  });
});

describe('Task 4.1: runAll — 子命令 all', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'cli-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should run all three phases in sequence', () => {
    // Setup plugins
    createPluginFixture(fixtureDir, 'react-plugin', 'react', '---\nname: react-en\n---\n中文内容');

    // Setup en-rules
    const enRulesDir = createEnRulesFixture(fixtureDir, 'react-cursorrules-prompt-file.mdc',
      '---\ndescription: React guide\n---\nEnglish React content');

    // Setup zh-rules
    const zhRulesDir = createZhRulesFixture(fixtureDir, 'frontend', 'react', 'react');

    const result = runAll(
      join(fixtureDir, 'plugins'),
      enRulesDir,
      zhRulesDir,
      { outputDir: fixtureDir, resolvePlugin: () => 'react-plugin' },
    );

    assert.ok(result.audit.summary.total > 0, 'audit should have results');
    assert.ok(result.classification.stats, 'classification should have stats');
    assert.ok(typeof result.replace.replaced === 'number', 'replace should have count');

    // Verify output files
    assert.ok(existsSync(join(fixtureDir, 'audit-report.json')));
    assert.ok(existsSync(join(fixtureDir, 'classification.json')));
  });
});

describe('Task 4.2: 集成测试 — 端到端验证', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'e2e-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should run full end-to-end pipeline with 3 skills', () => {
    // Setup 3 plugins with SKILL.md + SKILL.en.md
    createPluginFixture(fixtureDir, 'react-plugin', 'react', '---\nname: react-en\n---\nReact 中文内容');
    createPluginFixture(fixtureDir, 'python-plugin', 'fastapi', '---\nname: fastapi-en\n---\nFastAPI 中文内容');
    createPluginFixture(fixtureDir, 'extra-plugin', 'unknown-skill', '---\nname: unknown-skill-en\n---\n未知技能中文内容');

    // Setup 2 English .mdc files (one matches react, one matches fastapi)
    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });
    writeFileSync(join(enRulesDir, 'react-cursorrules-prompt-file.mdc'),
      '---\ndescription: React development guide\n---\nYou are an expert React developer.');
    writeFileSync(join(enRulesDir, 'fastapi-cursorrules-prompt-file.mdc'),
      '---\ndescription: FastAPI best practices\n---\nYou are a FastAPI expert.');

    // Setup zh-rules directory structure
    const zhRulesDir = join(fixtureDir, 'zh-rules');
    mkdirSync(join(zhRulesDir, 'frontend', 'react', 'react', '.cursorrules').replace(/\\.cursorrules$/, ''), { recursive: true });
    writeFileSync(join(zhRulesDir, 'frontend', 'react', 'react', '.cursorrules'), 'react rule');
    mkdirSync(join(zhRulesDir, 'backend', 'python', 'fastapi', '.cursorrules').replace(/\\.cursorrules$/, ''), { recursive: true });
    writeFileSync(join(zhRulesDir, 'backend', 'python', 'fastapi', '.cursorrules'), 'fastapi rule');

    const pluginsDir = join(fixtureDir, 'plugins');

    // Mock routing: map skill names to plugin names
    const routingMap = {
      'react': 'react-plugin',
      'fastapi': 'python-plugin',
    };

    // Phase 1: Audit
    const auditResult = runAudit(pluginsDir, {
      outputFile: join(fixtureDir, 'audit-report.json'),
    });
    assert.equal(auditResult.summary.total, 6, '3 skills × 2 files = 6');

    // Phase 2: Classify
    const classifyResult = runClassify(enRulesDir, zhRulesDir, {
      outputFile: join(fixtureDir, 'classification.json'),
    });
    assert.equal(classifyResult.stats.total_en_files, 2);
    assert.equal(classifyResult.stats.classified + classifyResult.stats.unmatched, 2);

    // Phase 3: Replace
    const replaceResult = runReplace(
      join(fixtureDir, 'classification.json'),
      enRulesDir,
      pluginsDir,
      { resolvePlugin: (cat, subcat, rule) => routingMap[rule] || null },
    );

    // Verify: classified skills should be replaced
    assert.ok(replaceResult.replaced >= 2, `replaced at least 2, got ${replaceResult.replaced}`);

    // Verify: unknown-skill should get pending tag
    assert.ok(replaceResult.pending >= 1, `at least 1 pending, got ${replaceResult.pending}`);

    // Verify: replaced files have English content and translation-status
    const reactEn = readFileSync(join(pluginsDir, 'react-plugin', 'skills', 'react', 'SKILL.en.md'), 'utf-8');
    assert.ok(reactEn.includes('translation-status: translated'), 'react should be translated');
    assert.ok(reactEn.includes('expert React'), 'react should have English content');

    // Verify: unmatched skill has pending tag
    const unknownEn = readFileSync(join(pluginsDir, 'extra-plugin', 'skills', 'unknown-skill', 'SKILL.en.md'), 'utf-8');
    assert.ok(unknownEn.includes('translation-status: pending'), 'unknown should be pending');

    // Verify conservation
    const total = replaceResult.replaced + replaceResult.pending + replaceResult.failed_routes.length + replaceResult.parse_errors.length + replaceResult.skipped;
    assert.equal(total, 3, 'replaced + pending + failed + errors + skipped = 3 skills');
  });

  it('should handle all skills unmatched (no en-rules)', () => {
    createPluginFixture(fixtureDir, 'p1', 's1');

    const enRulesDir = join(fixtureDir, 'en-rules');
    mkdirSync(enRulesDir, { recursive: true });
    // No .mdc files

    const zhRulesDir = join(fixtureDir, 'zh-rules');
    mkdirSync(zhRulesDir, { recursive: true });

    const result = runAll(
      join(fixtureDir, 'plugins'),
      enRulesDir,
      zhRulesDir,
      { outputDir: fixtureDir, resolvePlugin: () => null },
    );

    assert.equal(result.replace.replaced, 0);
    assert.equal(result.replace.pending, 1);
    assert.equal(result.classification.stats.classified, 0);
    assert.equal(result.classification.stats.unmatched, 0);
  });
});
