import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { auditSkills } from './audit-skills.js';
import { classifyRules } from './classify-en-rules.js';
import { replaceContent } from './replace-en-content.js';

/**
 * Run audit phase.
 * @param {string} pluginsDir - Path to plugins/ directory
 * @param {{ outputFile?: string }} options
 * @returns {object} audit report
 */
export function runAudit(pluginsDir, options = {}) {
  const report = auditSkills(pluginsDir);

  const outputFile = options.outputFile || 'audit-report.json';
  writeFileSync(outputFile, JSON.stringify(report, null, 2));

  console.log(`Audit complete: ${report.summary.total} files, ${report.summary.issues} issues`);
  return report;
}

/**
 * Run classify phase.
 * @param {string} enRulesDir - Path to English .mdc files
 * @param {string} zhRulesDir - Path to Chinese rules directory
 * @param {{ outputFile?: string }} options
 * @returns {object} classification result
 */
export function runClassify(enRulesDir, zhRulesDir, options = {}) {
  const classification = classifyRules(enRulesDir, zhRulesDir);

  const outputFile = options.outputFile || 'classification.json';
  writeFileSync(outputFile, JSON.stringify(classification, null, 2));

  console.log(`Classify complete: ${classification.stats.classified} classified, ${classification.stats.unmatched} unmatched`);
  return classification;
}

/**
 * Run replace phase.
 * @param {string} classificationFile - Path to classification.json
 * @param {string} enRulesDir - Path to English .mdc files
 * @param {string} pluginsDir - Path to plugins/ directory
 * @param {{ resolvePlugin?: function }} options - Optional overrides
 * @returns {object} replace result
 */
export function runReplace(classificationFile, enRulesDir, pluginsDir, options = {}) {
  if (!existsSync(classificationFile)) {
    throw new Error(`classification.json not found: ${classificationFile}. Run classify first.`);
  }

  const classification = JSON.parse(readFileSync(classificationFile, 'utf-8'));
  const result = replaceContent(classification, enRulesDir, pluginsDir, options);

  console.log(`Replace complete: ${result.replaced} replaced, ${result.pending} pending, ${result.failed_routes.length} failed routes, ${result.parse_errors.length} parse errors, ${result.skipped} skipped`);
  return result;
}

/**
 * Run all three phases in sequence.
 * @param {string} pluginsDir - Path to plugins/
 * @param {string} enRulesDir - Path to English .mdc files
 * @param {string} zhRulesDir - Path to Chinese rules directory
 * @param {{ outputDir?: string }} options
 * @returns {{ audit: object, classification: object, replace: object }}
 */
export function runAll(pluginsDir, enRulesDir, zhRulesDir, options = {}) {
  const outputDir = options.outputDir || '.';

  console.log('=== Phase 1: Audit ===');
  const audit = runAudit(pluginsDir, {
    outputFile: join(outputDir, 'audit-report.json'),
  });

  console.log('\n=== Phase 2: Classify ===');
  const classification = runClassify(enRulesDir, zhRulesDir, {
    outputFile: join(outputDir, 'classification.json'),
  });

  console.log('\n=== Phase 3: Replace ===');
  const replace = runReplace(
    join(outputDir, 'classification.json'),
    enRulesDir,
    pluginsDir,
    options,
  );

  console.log('\n=== All phases complete ===');
  return { audit, classification, replace };
}

// CLI entry point
const command = process.argv[2];
const args = process.argv.slice(3);

if (command) {
  const pluginsDir = args[0] || 'plugins';
  const enRulesDir = args[0] || '../awesome-cursorrules/rules';
  const zhRulesDir = args[1] || '../awesome-cursorrules-zh/rules';

  switch (command) {
    case 'audit':
      runAudit(pluginsDir);
      break;
    case 'classify':
      runClassify(args[0] || '../awesome-cursorrules/rules', args[1] || '../awesome-cursorrules-zh/rules');
      break;
    case 'replace':
      runReplace('classification.json', args[0] || '../awesome-cursorrules/rules', args[1] || 'plugins');
      break;
    case 'all':
      runAll(
        args[0] || 'plugins',
        args[1] || '../awesome-cursorrules/rules',
        args[2] || '../awesome-cursorrules-zh/rules',
      );
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Usage:');
      console.error('  node replace-en-skills.js audit [pluginsDir]');
      console.error('  node replace-en-skills.js classify [enRulesDir] [zhRulesDir]');
      console.error('  node replace-en-skills.js replace [enRulesDir] [pluginsDir]');
      console.error('  node replace-en-skills.js all [pluginsDir] [enRulesDir] [zhRulesDir]');
      process.exit(1);
  }
}
