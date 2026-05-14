/**
 * .cursorrules file parser.
 * Classifies files into three formats and extracts structured content.
 */

/**
 * Classify the format of a .cursorrules file.
 * @param {string} content - File content
 * @returns {'structured'|'flat'|'mixed'}
 */
export function classifyFormat(content) {
  const firstLine = content.split('\n')[0].trim();
  if (firstLine.startsWith('# ')) return 'structured';
  if (firstLine.startsWith('你是')) {
    return content.includes('##') ? 'mixed' : 'flat';
  }
  // Default: treat as structured if has ## headers, else flat
  return content.includes('##') ? 'structured' : 'flat';
}

/**
 * Extract the role definition line (你是...专家 pattern).
 * @param {string} content - File content
 * @returns {string|null}
 */
export function extractRoleLine(content) {
  const firstLine = content.split('\n')[0].trim();
  if (firstLine.startsWith('你是')) return firstLine;
  return null;
}

/**
 * Parse a .cursorrules file into structured sections.
 * @param {string} content - File content
 * @param {'structured'|'flat'|'mixed'} format
 * @returns {{ title: string|null, roleLine: string|null, sections: Array<{heading: string, content: string}>, raw: string }}
 */
export function parseCursorrules(content, format) {
  const roleLine = extractRoleLine(content);
  const lines = content.split('\n');

  if (format === 'structured') {
    return parseStructured(lines, content);
  } else if (format === 'flat') {
    return parseFlat(lines, roleLine, content);
  } else {
    return parseMixed(lines, roleLine, content);
  }
}

function parseStructured(lines, raw) {
  const title = lines[0].trim().replace(/^#\s+/, '');
  const sections = [];
  let currentHeading = null;
  let currentContent = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+/.test(line)) {
      if (currentHeading !== null) {
        sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
      }
      currentHeading = line.replace(/^##\s+/, '').trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentHeading !== null) {
    sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
  }

  return { title, roleLine: null, sections, raw };
}

function parseFlat(lines, roleLine, raw) {
  const sections = [];
  let currentHeading = null;
  let currentContent = [];
  const startIdx = roleLine ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect a bare label: non-empty, not a list item, not indented, not starting with #
    if (trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('#') && !line.startsWith(' ') && !line.startsWith('\t')) {
      // Check if next line is a list item or another label
      const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
      if (nextLine.startsWith('-') || currentHeading !== null) {
        // This is a new section label
        if (currentHeading !== null) {
          sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
        }
        currentHeading = trimmed;
        currentContent = [];
        continue;
      }
    }
    if (currentHeading !== null) {
      currentContent.push(line);
    }
  }
  if (currentHeading !== null) {
    sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
  }

  return { title: null, roleLine, sections, raw };
}

function parseMixed(lines, roleLine, raw) {
  const sections = [];
  let currentHeading = null;
  let currentContent = [];
  const startIdx = roleLine ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^##/.test(trimmed)) {
      // Existing heading - preserve it
      if (currentHeading !== null) {
        sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
      }
      currentHeading = trimmed.replace(/^#+\s*/, '').trim();
      currentContent = [];
    } else if (
      trimmed &&
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('#') &&
      !line.startsWith(' ') &&
      !line.startsWith('\t') &&
      // Check if next line is indented or a list item (suggests this is a label)
      (() => {
        const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
        return nextLine.startsWith('-') || nextLine === '' && i + 2 < lines.length && lines[i + 2].trim().startsWith('-');
      })()
    ) {
      // Bare label in mixed format → convert to heading
      if (currentHeading !== null) {
        sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
      }
      currentHeading = trimmed;
      currentContent = [];
    } else if (currentHeading !== null) {
      currentContent.push(line);
    }
  }
  if (currentHeading !== null) {
    sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() });
  }

  return { title: null, roleLine, sections, raw };
}
