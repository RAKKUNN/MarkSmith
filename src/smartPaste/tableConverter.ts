/**
 * Detects if text looks like tabular data (TSV or CSV).
 */
export function isTabularData(text: string): boolean {
  const lines = text.trim().split('\n');
  if (lines.length < 2) {
    return false;
  }

  // Check if lines have consistent tab or comma separators
  const tabCounts = lines.map(line => (line.match(/\t/g) || []).length);
  const commaCounts = lines.map(line => (line.match(/,/g) || []).length);

  const consistentTabs = tabCounts[0] > 0 && tabCounts.every(c => c === tabCounts[0]);
  const consistentCommas = commaCounts[0] > 0 && commaCounts.every(c => c === commaCounts[0]);

  return consistentTabs || consistentCommas;
}

/**
 * Converts TSV/CSV text to a Markdown table.
 */
export function convertToMarkdownTable(text: string): string {
  const lines = text.trim().split('\n');
  if (lines.length < 1) {
    return text;
  }

  // Determine delimiter
  const firstLine = lines[0];
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const delimiter = tabCount >= commaCount ? '\t' : ',';

  const rows = lines.map(line => parseLine(line, delimiter));

  if (rows.length === 0) {
    return text;
  }

  // Build markdown table
  const colCount = Math.max(...rows.map(r => r.length));
  const result: string[] = [];

  // Header row
  const header = padRow(rows[0], colCount);
  result.push(`| ${header.join(' | ')} |`);

  // Separator
  result.push(`| ${header.map(() => '---').join(' | ')} |`);

  // Data rows
  for (let i = 1; i < rows.length; i++) {
    const row = padRow(rows[i], colCount);
    result.push(`| ${row.join(' | ')} |`);
  }

  return result.join('\n');
}

function parseLine(line: string, delimiter: string): string[] {
  if (delimiter === ',') {
    return parseCSVLine(line);
  }
  return line.split(delimiter).map(cell => cell.trim());
}

function parseCSVLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

function padRow(row: string[], colCount: number): string[] {
  const result = [...row];
  while (result.length < colCount) {
    result.push('');
  }
  return result;
}
