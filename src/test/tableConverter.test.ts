import { isTabularData, convertToMarkdownTable } from '../smartPaste/tableConverter';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function runTests(): void {
  console.log('Running tableConverter tests...');

  // Test: TSV detection
  {
    const tsv = 'Name\tAge\tCity\nAlice\t30\tSeoul\nBob\t25\tBusan';
    assert(isTabularData(tsv), 'TSV should be detected as tabular data');
    console.log('  ✓ TSV detection');
  }

  // Test: CSV detection
  {
    const csv = 'Name,Age,City\nAlice,30,Seoul\nBob,25,Busan';
    assert(isTabularData(csv), 'CSV should be detected as tabular data');
    console.log('  ✓ CSV detection');
  }

  // Test: plain text NOT tabular
  {
    const text = 'Hello world\nThis is a normal paragraph.';
    assert(!isTabularData(text), 'Plain text should NOT be tabular data');
    console.log('  ✓ plain text rejection');
  }

  // Test: single line NOT tabular
  {
    assert(!isTabularData('just one line'), 'Single line should NOT be tabular');
    console.log('  ✓ single line rejection');
  }

  // Test: TSV → Markdown table
  {
    const tsv = 'Name\tAge\nAlice\t30\nBob\t25';
    const table = convertToMarkdownTable(tsv);
    assert(table.includes('| Name | Age |'), `Header row expected, got: ${table}`);
    assert(table.includes('| --- | --- |'), `Separator row expected`);
    assert(table.includes('| Alice | 30 |'), `Data row expected`);
    console.log('  ✓ TSV to Markdown table');
  }

  // Test: CSV → Markdown table
  {
    const csv = 'A,B,C\n1,2,3';
    const table = convertToMarkdownTable(csv);
    assert(table.includes('| A | B | C |'), `CSV header expected`);
    assert(table.includes('| 1 | 2 | 3 |'), `CSV data expected`);
    console.log('  ✓ CSV to Markdown table');
  }

  // Test: CSV with quoted fields
  {
    const csv = '"Name","Description"\n"Alice","She said, ""hello"""\n"Bob","OK"';
    const table = convertToMarkdownTable(csv);
    assert(table.includes('Name'), 'Quoted CSV should parse name');
    console.log('  ✓ CSV with quotes');
  }

  console.log('All tableConverter tests passed!');
}

runTests();
