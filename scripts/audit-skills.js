import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

/**
 * Audit all SKILL.md and SKILL.en.md files in the plugins directory.
 * @param {string} pluginsDir - path to plugins/ directory
 * @returns {{ summary: { total: number, issues: number }, by_dimension: object, issues: Array }}
 */
export function auditSkills(pluginsDir) {
  const files = discoverSkillFiles(pluginsDir);
  const issues = [];

  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf-8');
    const filename = basename(filePath);
    issues.push(...checkStructure(content, filename));
    issues.push(...checkSecurity(content, filename));
    issues.push(...checkQuality(content, filename));
    issues.push(...checkLanguage(content, filename));
  }

  const by_dimension = { structure: 0, security: 0, quality: 0, language: 0 };
  for (const issue of issues) {
    by_dimension[issue.dimension] = (by_dimension[issue.dimension] || 0) + 1;
  }

  return {
    summary: { total: files.length, issues: issues.length },
    by_dimension,
    issues,
  };
}

/**
 * Recursively discover all SKILL.md and SKILL.en.md files.
 */
function discoverSkillFiles(dir) {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...discoverSkillFiles(full));
      } else if (entry === 'SKILL.md' || entry === 'SKILL.en.md') {
        results.push(full);
      }
    }
  } catch {
    // directory doesn't exist, skip
  }
  return results;
}

/**
 * Parse frontmatter from content.
 * Returns { frontmatter: object, body: string } or null if no valid frontmatter.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yamlStr = match[1];
  const body = content.slice(match[0].length).trim();
  const frontmatter = {};

  // Simple YAML parser for flat key-value pairs
  for (const line of yamlStr.split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (kv) {
      const value = kv[2].trim();
      // Detect unclosed brackets (invalid YAML)
      if ((value.includes('[') && !value.includes(']')) ||
          (value.includes('{') && !value.includes('}'))) {
        return { frontmatter: {}, body: content, parseError: true };
      }
      frontmatter[kv[1]] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Check structure completeness.
 */
function checkStructure(content, filename) {
  const issues = [];
  const relPath = filename; // simplified for testing

  // Check frontmatter exists
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    issues.push({
      file: relPath,
      dimension: 'structure',
      rule: 'frontmatter_missing',
      detail: 'File has no YAML frontmatter block',
      severity: 'warning',
    });
    return issues;
  }

  const { frontmatter, parseError } = parsed;

  // Check YAML parse validity
  if (parseError) {
    issues.push({
      file: relPath,
      dimension: 'structure',
      rule: 'yaml_parse_error',
      detail: 'YAML frontmatter contains syntax errors',
      severity: 'warning',
    });
    return issues;
  }

  // Check YAML parse validity — if frontmatter exists but has no keys
  if (Object.keys(frontmatter).length === 0) {
    issues.push({
      file: relPath,
      dimension: 'structure',
      rule: 'yaml_parse_error',
      detail: 'Frontmatter parsed but contains no valid key-value pairs',
      severity: 'warning',
    });
    return issues;
  }

  // Check name field
  if (!frontmatter.name || frontmatter.name.trim() === '') {
    issues.push({
      file: relPath,
      dimension: 'structure',
      rule: 'name_missing',
      detail: 'Missing or empty name field in frontmatter',
      severity: 'warning',
    });
  }

  // Check description field
  if (!frontmatter.description || frontmatter.description.trim() === '') {
    issues.push({
      file: relPath,
      dimension: 'structure',
      rule: 'description_missing',
      detail: 'Missing or empty description field in frontmatter',
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Check content security issues.
 */
function checkSecurity(content, filename) {
  const issues = [];

  const patterns = [
    // Prompt injection
    { regex: /ignore\s+(previous|prior|above|all)\s+(instructions?|rules?|prompts?)/i, label: 'prompt_injection', desc: 'Potential prompt injection pattern' },
    { regex: /disregard\s+all/i, label: 'prompt_injection', desc: 'Potential prompt injection pattern' },
    { regex: /you\s+are\s+now/i, label: 'prompt_injection', desc: 'Potential prompt injection pattern' },
    // Sensitive information
    { regex: /\bsk-[a-zA-Z0-9]{10,}\b/, label: 'api_key_leak', desc: 'Potential API key exposure' },
    { regex: /\bapi[_-]?key\s*[:=]\s*['"]?\w{10,}/i, label: 'api_key_leak', desc: 'Potential API key exposure' },
    { regex: /\bpassword\s*[:=]\s*['"]?\w{6,}/i, label: 'credential_leak', desc: 'Potential credential exposure' },
    // Malicious commands
    { regex: /\brm\s+-rf\s+[\/]/i, label: 'malicious_command', desc: 'Destructive command detected' },
    { regex: /\bdelete\s+all\b/i, label: 'malicious_command', desc: 'Destructive command detected' },
    { regex: /\bdrop\s+table\b/i, label: 'malicious_command', desc: 'Destructive SQL command detected' },
  ];

  for (const { regex, label, desc } of patterns) {
    if (regex.test(content)) {
      issues.push({
        file: filename,
        dimension: 'security',
        rule: label,
        detail: desc,
        severity: 'critical',
      });
    }
  }

  return issues;
}

/**
 * Check content quality.
 */
function checkQuality(content, filename) {
  const issues = [];
  const parsed = parseFrontmatter(content);
  const body = parsed ? parsed.body : content;

  // Empty content check
  if (body.length < 100) {
    issues.push({
      file: filename,
      dimension: 'quality',
      rule: 'empty_content',
      detail: `Body content is only ${body.length} characters (minimum 100)`,
      severity: 'warning',
    });
  }

  // Truncation check
  const truncatedEndings = ['|', '//', '-'];
  const trimmedBody = body.trimEnd();
  if (trimmedBody.length > 0 && truncatedEndings.some(ending => trimmedBody.endsWith(ending))) {
    issues.push({
      file: filename,
      dimension: 'quality',
      rule: 'truncated_content',
      detail: `Content ends with incomplete symbol "${trimmedBody[trimmedBody.length - 1]}"`,
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Check language consistency.
 */
function checkLanguage(content, filename) {
  // Only check SKILL.en.md files
  if (!filename.endsWith('SKILL.en.md')) return [];
  const relPath = filename;

  const parsed = parseFrontmatter(content);
  const body = parsed ? parsed.body : content.replace(/^---[\s\S]*?---\s*/, '');

  const chineseRatio = computeChineseRatio(body);
  if (chineseRatio > 0.3) {
    return [{
      file: filename,
      dimension: 'language',
      rule: 'non_english',
      detail: `Chinese character ratio ${(chineseRatio * 100).toFixed(1)}% (> 30%)`,
      severity: 'warning',
    }];
  }

  return [];
}

/**
 * Compute ratio of Chinese characters in text.
 */
function computeChineseRatio(text) {
  if (text.length === 0) return 0;
  let chinese = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if ((code >= 0x4E00 && code <= 0x9FFF) ||   // CJK Unified
        (code >= 0x3400 && code <= 0x4DBF) ||   // CJK Extension A
        (code >= 0x3000 && code <= 0x303F) ||   // CJK Symbols
        (code >= 0xFF00 && code <= 0xFFEF)) {    // Fullwidth forms
      chinese++;
    }
  }
  return chinese / text.length;
}
