/**
 * Name conflict detection and resolution for skill names.
 * Based on design.md DEC-5.
 */

/**
 * Detect rule-name conflicts (same ruleName across different paths).
 * @param {Array<{category: string, subcategory: string, ruleName: string}>} files
 * @returns {Array<{name: string, files: Array}>}
 */
export function detectConflicts(files) {
  const byName = new Map();
  for (const f of files) {
    const list = byName.get(f.ruleName) || [];
    list.push(f);
    byName.set(f.ruleName, list);
  }

  const conflicts = [];
  for (const [name, group] of byName) {
    if (group.length > 1) {
      conflicts.push({ name, files: group });
    }
  }
  return conflicts;
}

/**
 * Resolve a single conflict by adding subcategory prefix.
 * If still ambiguous, cascade to category-subcategory-name.
 * @param {string} ruleName
 * @param {string} subcategory
 * @param {string} [category] - Used for cascade resolution
 * @returns {string} Resolved skill name
 */
export function resolveConflict(ruleName, subcategory, category) {
  if (subcategory !== ruleName) {
    return `${subcategory}-${ruleName}`;
  }
  // subcategory same as ruleName → use category prefix
  if (category) {
    return `${category}-${ruleName}`;
  }
  return `${subcategory}-${ruleName}`;
}

/**
 * Resolve all conflicts in a file list, returning unique skill names.
 * @param {Array<{category: string, subcategory: string, ruleName: string}>} files
 * @returns {Array<{category: string, subcategory: string, ruleName: string, skillName: string}>}
 */
export function resolveAllConflicts(files) {
  const conflicts = detectConflicts(files);
  const conflictNames = new Set(conflicts.map(c => c.name));

  const result = files.map(f => ({
    ...f,
    skillName: conflictNames.has(f.ruleName)
      ? resolveConflict(f.ruleName, f.subcategory, f.category)
      : f.ruleName,
  }));

  // Verify uniqueness — if still duplicates, cascade to full prefix
  const nameCount = new Map();
  for (const r of result) {
    nameCount.set(r.skillName, (nameCount.get(r.skillName) || 0) + 1);
  }
  for (const r of result) {
    if (nameCount.get(r.skillName) > 1) {
      r.skillName = `${r.category}-${r.subcategory}-${r.ruleName}`;
    }
  }

  return result;
}
