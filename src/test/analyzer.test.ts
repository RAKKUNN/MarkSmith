import { analyzeDocument } from '../xray/analyzer';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function runTests(): void {
  console.log('Running analyzer tests...');

  // Test: basic word count
  {
    const result = analyzeDocument('Hello world. This is a test.');
    assert(result.wordCount > 0, `wordCount should be > 0, got ${result.wordCount}`);
    assert(result.sentenceCount > 0, `sentenceCount should be > 0, got ${result.sentenceCount}`);
    assert(result.lineCount === 1, `lineCount should be 1, got ${result.lineCount}`);
    console.log('  ✓ basic word count');
  }

  // Test: heading extraction
  {
    const md = '# Title\n\n## Section A\n\nSome text.\n\n### Subsection\n\nMore text.';
    const result = analyzeDocument(md);
    assert(result.headings.length === 3, `headings should be 3, got ${result.headings.length}`);
    assert(result.headings[0].level === 1, `first heading level should be 1`);
    assert(result.headings[0].text === 'Title', `first heading text should be "Title"`);
    assert(result.headings[1].level === 2, `second heading level should be 2`);
    assert(result.headings[2].level === 3, `third heading level should be 3`);
    console.log('  ✓ heading extraction');
  }

  // Test: link extraction
  {
    const md = 'Visit https://example.com and https://test.org for more.';
    const result = analyzeDocument(md);
    assert(result.linkUrls.length === 2, `linkUrls should be 2, got ${result.linkUrls.length}`);
    assert(result.linkUrls[0].url === 'https://example.com', `first link url`);
    console.log('  ✓ link extraction');
  }

  // Test: CJK word count
  {
    const md = '한국어 테스트 문서입니다.';
    const result = analyzeDocument(md);
    assert(result.wordCount > 0, `CJK wordCount should be > 0, got ${result.wordCount}`);
    assert(result.charCount > 0, `CJK charCount should be > 0, got ${result.charCount}`);
    assert(result.readingTimeMinutes >= 1, `readingTime should be >= 1`);
    console.log('  ✓ CJK word count');
  }

  // Test: empty document
  {
    const result = analyzeDocument('');
    assert(result.wordCount === 0, `empty doc wordCount should be 0`);
    assert(result.headings.length === 0, `empty doc headings should be 0`);
    console.log('  ✓ empty document');
  }

  // Test: word frequency
  {
    const md = 'apple banana apple cherry apple banana apple';
    const result = analyzeDocument(md);
    assert(result.wordFrequency.length > 0, `should have word frequency`);
    assert(result.wordFrequency[0].word === 'apple', `top word should be "apple", got "${result.wordFrequency[0].word}"`);
    console.log('  ✓ word frequency');
  }

  console.log('All analyzer tests passed!');
}

runTests();
