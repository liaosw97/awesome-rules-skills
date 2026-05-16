import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { cleanOcr, generateEnTemplate, discoverSkills, importSkills, setupPlugin, updateRouting } from '../import-alibaba-skills.js';

// ─── Task 1.1: cleanOcr ───

describe('Task 1.1: cleanOcr — OCR 清理', () => {
  it('should fix 【强  制】 (multi-space inside brackets)', () => {
    assert.equal(cleanOcr('【强  制】xxx'), '【强制】xxx');
  });

  it('should fix 【推荐 】 and 【参考 】 (trailing space)', () => {
    assert.equal(cleanOcr('【推荐 】yyy'), '【推荐】yyy');
    assert.equal(cleanOcr('【参考 】zzz'), '【参考】zzz');
  });

  it('should fix 【强制 】 (space before closing bracket)', () => {
    assert.equal(cleanOcr('【强制 】xxx'), '【强制】xxx');
  });

  it('should compress 3+ consecutive spaces to single space', () => {
    assert.equal(cleanOcr('a   b   c'), 'a b c');
  });

  it('should not modify frontmatter', () => {
    const input = '---\nname: test\n---\n【强  制】xxx';
    const result = cleanOcr(input);
    assert.ok(result.includes('name: test'));
    assert.ok(result.includes('【强制】'));
  });

  it('should handle mixed OCR issues', () => {
    const input = '【强  制】do   something【推荐 】also   do';
    const result = cleanOcr(input);
    assert.equal(result, '【强制】do something【推荐】also do');
  });
});

// ─── Task 1.2: generateEnTemplate ───

describe('Task 1.2: generateEnTemplate — 生成英文模板', () => {
  it('should add -en suffix to name and add translation-status: pending', () => {
    const content = '---\nname: java-coding-standards\ndescription: test\n---\nbody content';
    const result = generateEnTemplate(content, 'java-coding-standards');

    assert.ok(result.includes('name: java-coding-standards-en'));
    assert.ok(result.includes('translation-status: pending'));
    assert.ok(result.includes('body content'));
  });

  it('should preserve description from original', () => {
    const content = '---\nname: test\ndescription: Some desc\n---\ntext';
    const result = generateEnTemplate(content, 'test');
    assert.ok(result.includes('description: Some desc'));
  });
});

// ─── Task 1.3: discoverSkills ───

describe('Task 1.3: discoverSkills — 扫描源目录', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'import-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should discover all skill directories with SKILL.md', () => {
    mkdirSync(join(fixtureDir, 'java-coding', 'skills', 'java-coding'), { recursive: true });
    writeFileSync(join(fixtureDir, 'java-coding', 'skills', 'java-coding', 'SKILL.md'), '---\nname: java-coding\n---\ncontent');
    mkdirSync(join(fixtureDir, 'java-testing', 'skills', 'java-testing'), { recursive: true });
    writeFileSync(join(fixtureDir, 'java-testing', 'skills', 'java-testing', 'SKILL.md'), '---\nname: java-testing\n---\ncontent');
    mkdirSync(join(fixtureDir, 'java-db', 'skills', 'java-db'), { recursive: true });
    writeFileSync(join(fixtureDir, 'java-db', 'skills', 'java-db', 'SKILL.md'), '---\nname: java-db\n---\ncontent');

    const skills = discoverSkills(fixtureDir);
    assert.equal(skills.length, 3);
    assert.ok(skills.some(s => s.skillName === 'java-coding'));
  });

  it('should throw when source directory does not exist', () => {
    assert.throws(() => discoverSkills('/nonexistent/path'), /does not exist/);
  });
});

// ─── Task 1.4: importSkills ───

describe('Task 1.4: importSkills — 完整导入流程', () => {
  let sourceDir;
  let targetDir;

  beforeEach(() => {
    sourceDir = mkdtempSync(join(tmpdir(), 'import-src-'));
    targetDir = mkdtempSync(join(tmpdir(), 'import-target-'));

    // Create source skills with OCR artifacts
    const skill1 = join(sourceDir, 'java-coding', 'skills', 'java-coding');
    mkdirSync(skill1, { recursive: true });
    writeFileSync(join(skill1, 'SKILL.md'), '---\nname: java-coding\ndescription: test\n---\n【强  制】do   this');

    const skill2 = join(sourceDir, 'java-testing', 'skills', 'java-testing');
    mkdirSync(skill2, { recursive: true });
    writeFileSync(join(skill2, 'SKILL.md'), '---\nname: java-testing\ndescription: test2\n---\n【推荐 】normal text');
  });

  afterEach(() => {
    rmSync(sourceDir, { recursive: true, force: true });
    rmSync(targetDir, { recursive: true, force: true });
  });

  it('should import and clean skills into target plugin directory', () => {
    const result = importSkills(sourceDir, targetDir, 'alibaba-java-dev');

    assert.equal(result.imported, 2);

    // Check SKILL.md cleaned
    const skillMd = readFileSync(join(targetDir, 'plugins', 'alibaba-java-dev', 'skills', 'java-coding', 'SKILL.md'), 'utf-8');
    assert.ok(skillMd.includes('【强制】'));
    assert.ok(!skillMd.includes('【强  制】'));

    // Check SKILL.en.md generated with pending
    const enMd = readFileSync(join(targetDir, 'plugins', 'alibaba-java-dev', 'skills', 'java-coding', 'SKILL.en.md'), 'utf-8');
    assert.ok(enMd.includes('name: java-coding-en'));
    assert.ok(enMd.includes('translation-status: pending'));
  });
});

// ─── Task 2.1 & 2.2: setupPlugin ───

describe('Task 2.1-2.2: setupPlugin — 插件结构', () => {
  let fixtureDir;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'plugin-test-'));
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should generate plugin.json with correct fields', () => {
    const skillNames = ['java-coding', 'java-testing'];
    setupPlugin(fixtureDir, 'alibaba-java-dev', 'Alibaba Java development manual', skillNames);

    const pluginJson = JSON.parse(readFileSync(join(fixtureDir, '.claude-plugin', 'plugin.json'), 'utf-8'));
    assert.equal(pluginJson.name, 'alibaba-java-dev');
    assert.equal(pluginJson.version, '1.0.0');
    assert.equal(pluginJson.description, 'Alibaba Java development manual');
    assert.equal(pluginJson.skills, './skills/');
  });

  it('should create skill subdirectories', () => {
    const skillNames = ['java-coding', 'java-testing', 'java-db'];
    setupPlugin(fixtureDir, 'alibaba-java-dev', 'desc', skillNames);

    assert.ok(existsSync(join(fixtureDir, 'skills', 'java-coding')));
    assert.ok(existsSync(join(fixtureDir, 'skills', 'java-testing')));
    assert.ok(existsSync(join(fixtureDir, 'skills', 'java-db')));
  });
});

// ─── Task 2.3: updateRouting ───

describe('Task 2.3: updateRouting — 更新路由映射', () => {
  let fixtureDir;
  let routingFile;

  beforeEach(() => {
    fixtureDir = mkdtempSync(join(tmpdir(), 'routing-test-'));
    routingFile = join(fixtureDir, 'routing.js');
    // Minimal routing.js content with SUBCAT_RULE_TO_PLUGIN to test regex precision
    writeFileSync(routingFile, `const SUBCAT_RULE_TO_PLUGIN = {
  'existing-subcat/rule': 'existing-plugin',
};

export const RULE_TO_PLUGIN = {
  'existing-rule': 'existing-plugin',
};

const CATEGORY_TO_PLUGIN = {};

export { RULE_TO_PLUGIN, CATEGORY_TO_PLUGIN };
`);
  });

  afterEach(() => {
    rmSync(fixtureDir, { recursive: true, force: true });
  });

  it('should add 7 java skill mappings without breaking existing ones', () => {
    const skillNames = [
      'java-coding-standards', 'java-exception-logging', 'java-unit-testing',
      'java-security-standards', 'java-mysql-database', 'java-project-structure',
      'java-design-standards',
    ];

    updateRouting(routingFile, skillNames, 'alibaba-java-dev');

    // Read back and verify
    const content = readFileSync(routingFile, 'utf-8');
    assert.ok(content.includes("'java-coding-standards': 'alibaba-java-dev'"));
    assert.ok(content.includes("'java-design-standards': 'alibaba-java-dev'"));
    // Existing mapping preserved
    assert.ok(content.includes("'existing-rule': 'existing-plugin'"));
  });

  it('should not duplicate already-existing mappings', () => {
    const skillNames = ['java-coding-standards'];

    updateRouting(routingFile, skillNames, 'alibaba-java-dev');
    updateRouting(routingFile, skillNames, 'alibaba-java-dev');

    const content = readFileSync(routingFile, 'utf-8');
    const matchCount = (content.match(/java-coding-standards.*alibaba-java-dev/g) || []).length;
    assert.equal(matchCount, 1);
  });
});
