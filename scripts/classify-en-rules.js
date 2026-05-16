import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

/**
 * Extract keywords from an English .mdc filename.
 * Removes common suffixes and splits on hyphens.
 * @param {string} filename - e.g. "aspnet-abp-cursorrules-prompt-file.mdc"
 * @returns {string[]} keywords
 */
export function extractKeywords(filename) {
  let stem = filename.replace(/\.mdc$/, '');

  // Remove known generic suffixes (order matters: longest first)
  const suffixes = [
    '-cursorrules-prompt-file-pro',
    '-cursorrules-prompt-file',
    '-cursorrules',
  ];
  for (const suffix of suffixes) {
    if (stem.endsWith(suffix)) {
      stem = stem.slice(0, -suffix.length);
      break;
    }
  }

  // Split on hyphens, filter empty, lowercase
  return stem.split('-').filter(Boolean);
}

/**
 * Scan Chinese rules directory and extract (category, subcategory, ruleName) triples.
 * @param {string} zhRulesDir - path to rules/ directory
 * @returns {Array<{category: string, subcategory: string, ruleName: string}>}
 */
export function scanZhRules(zhRulesDir) {
  const triples = [];

  function walk(dir, parts) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }

    // Check if this dir contains .cursorrules → it's a leaf rule directory
    if (entries.includes('.cursorrules')) {
      const ruleName = basename(dir);
      // parts includes the ruleName dir itself
      // parts.length === 2: category/ruleName → no subcategory
      // parts.length >= 3: category/subcategory/.../ruleName
      if (parts.length <= 2) {
        triples.push({ category: parts[0], subcategory: parts[0], ruleName });
      } else {
        triples.push({ category: parts[0], subcategory: parts[1], ruleName });
      }
      return;
    }

    // Recurse into subdirectories
    for (const entry of entries) {
      const full = join(dir, entry);
      try {
        const st = statSync(full);
        if (st.isDirectory()) {
          walk(full, [...parts, entry]);
        }
      } catch {
        // skip
      }
    }
  }

  // Walk top-level category directories
  let topEntries;
  try {
    topEntries = readdirSync(zhRulesDir);
  } catch {
    return triples;
  }

  for (const entry of topEntries) {
    const full = join(zhRulesDir, entry);
    try {
      if (statSync(full).isDirectory()) {
        walk(full, [entry]);
      }
    } catch {
      // skip
    }
  }

  return triples;
}

/**
 * Normalize a keyword: lowercase, remove hyphens and underscores.
 * @param {string} keyword
 * @returns {string}
 */
export function normalizeKeyword(keyword) {
  return keyword.toLowerCase().replace(/[-_]/g, '');
}

/**
 * Try exact match between normalized keywords.
 * @returns {{ matched: boolean, confidence?: string, matchType?: string, needs_review?: boolean }}
 */
export function matchExact(enNorm, zhNorm) {
  if (enNorm === zhNorm) {
    return { matched: true, confidence: 'high', matchType: 'exact', needs_review: false };
  }
  return { matched: false };
}

/**
 * Try contains match with length ratio validation.
 * @param {string} enKey - normalized English keyword
 * @param {string} zhKey - normalized Chinese ruleName
 * @returns {{ matched: boolean, confidence?: string, matchType?: string, needs_review?: boolean }}
 */
export function matchContains(enKey, zhKey) {
  const shorter = enKey.length <= zhKey.length ? enKey : zhKey;
  const longer = enKey.length > zhKey.length ? enKey : zhKey;

  if (longer.includes(shorter)) {
    const ratio = shorter.length / longer.length;
    if (ratio > 0.4) {
      return { matched: true, confidence: 'high', matchType: 'contains', needs_review: false };
    }
  }

  return { matched: false };
}

/**
 * Match based on keyword set overlap.
 * @param {string[]} enKeywords
 * @param {string[]} zhKeywords
 * @returns {{ matched: boolean, confidence?: string, matchType?: string, needs_review?: boolean }}
 */
export function matchKeywordOverlap(enKeywords, zhKeywords, zhRuleName = '') {
  // Also try contains on the full normalized name parts
  if (zhRuleName) {
    const zhParts = zhRuleName.split(/[-_]/).filter(Boolean);
    const enSet = new Set(enKeywords.map(k => k.toLowerCase()));
    for (const part of zhParts) {
      const norm = part.toLowerCase();
      if (enSet.has(norm)) {
        // Found an exact part match — this is stronger than pure keyword overlap
        // But still low confidence since it's partial
        const overlap = enKeywords.filter(k => zhParts.some(p => p.toLowerCase() === k.toLowerCase()));
        if (overlap.length > 0) {
          return { matched: true, confidence: 'low', matchType: 'keyword_overlap', needs_review: true };
        }
      }
    }
  }

  const enSet = new Set(enKeywords.map(k => k.toLowerCase()));
  const zhSet = new Set(zhKeywords.map(k => k.toLowerCase()));
  const overlap = [...enSet].filter(k => zhSet.has(k));

  if (overlap.length > 0) {
    return { matched: true, confidence: 'low', matchType: 'keyword_overlap', needs_review: true };
  }

  return { matched: false };
}

/**
 * Deduplicate classifications: when multiple en_files match the same ruleName,
 * keep the best one and move others to unmatched.
 * @param {Array} classifications
 * @returns {{ kept: Array, removed: Array }}
 */
export function deduplicate(classifications) {
  const groups = new Map();
  for (const c of classifications) {
    const key = c.ruleName;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  }

  const kept = [];
  const removed = [];

  for (const [, items] of groups) {
    if (items.length === 1) {
      kept.push(items[0]);
      continue;
    }

    // Score each item by LCS with ruleName
    const scored = items.map(item => {
      const normEn = item.en_file.replace(/\.mdc$/, '').replace(/-cursorrules-prompt-file(-pro)?$/, '').replace(/-cursorrules$/, '');
      const normRule = item.ruleName;
      const lcsLen = lcs(normEn.replace(/-/g, ''), normRule.replace(/-/g, ''));
      return { item, score: lcsLen };
    });

    scored.sort((a, b) => b.score - a.score);
    kept.push(scored[0].item);

    for (let i = 1; i < scored.length; i++) {
      removed.push({
        ...scored[i].item,
        reason: 'duplicate_resolution',
        lost_to: scored[0].item.en_file,
      });
    }
  }

  return { kept, removed };
}

/**
 * Compute length of longest common subsequence.
 */
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Main entry: classify English .mdc files against Chinese rules directory.
 * @param {string} enRulesDir - path to directory containing English .mdc files
 * @param {string} zhRulesDir - path to Chinese rules/ directory
 * @returns {{ stats: object, classifications: Array, unmatched: Array }}
 */
export function classifyRules(enRulesDir, zhRulesDir) {
  // 1. Scan Chinese rules
  const zhTriples = scanZhRules(zhRulesDir);

  // 2. Scan English .mdc files
  let enFiles;
  try {
    enFiles = readdirSync(enRulesDir).filter(f => f.endsWith('.mdc'));
  } catch {
    enFiles = [];
  }

  // 3. For each English file, try matching
  const classifications = [];
  const unmatched = [];

  for (const enFile of enFiles) {
    const enKeywords = extractKeywords(enFile);
    let bestMatch = null;

    for (const triple of zhTriples) {
      const zhRuleName = triple.ruleName;

      // Try each keyword against ruleName
      for (const kw of enKeywords) {
        const enNorm = normalizeKeyword(kw);
        const zhNorm = normalizeKeyword(zhRuleName);

        // Level 1: Exact match
        const exact = matchExact(enNorm, zhNorm);
        if (exact.matched) {
          if (!bestMatch || confidenceRank(exact.confidence) > confidenceRank(bestMatch.confidence)) {
            bestMatch = { ...exact, ...triple, en_file: enFile, keywords: enKeywords };
          }
        }

        // Level 2: Contains match
        if (!bestMatch || confidenceRank('high') > confidenceRank(bestMatch.confidence)) {
          const contains = matchContains(enNorm, zhNorm);
          if (contains.matched) {
            if (!bestMatch || confidenceRank(contains.confidence) > confidenceRank(bestMatch.confidence)) {
              bestMatch = { ...contains, ...triple, en_file: enFile, keywords: enKeywords };
            }
          }
        }
      }

      // Level 3: Keyword overlap (only if no better match)
      if (!bestMatch || confidenceRank('low') > confidenceRank(bestMatch.confidence)) {
        // Extract zh keywords from ruleName parts
        const zhKeywords = zhRuleName.split(/[-_]/).filter(Boolean);
        const overlap = matchKeywordOverlap(enKeywords, zhKeywords, zhRuleName);
        if (overlap.matched) {
          bestMatch = { ...overlap, ...triple, en_file: enFile, keywords: enKeywords };
        }
      }
    }

    if (bestMatch) {
      classifications.push(bestMatch);
    } else {
      unmatched.push({
        en_file: enFile,
        keywords: enKeywords,
      });
    }
  }

  // 4. Deduplicate
  const { kept, removed } = deduplicate(classifications);
  unmatched.push(...removed);

  return {
    stats: {
      total_en_files: enFiles.length,
      classified: kept.length,
      unmatched: unmatched.length,
    },
    classifications: kept,
    unmatched,
  };
}

function confidenceRank(c) {
  if (c === 'high') return 3;
  if (c === 'medium') return 2;
  if (c === 'low') return 1;
  return 0;
}
