import { htmlToMarkdown, isHtml } from '../smartPaste/htmlToMarkdown';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

function runTests(): void {
  console.log('Running htmlToMarkdown tests...');

  // Test: isHtml detection
  {
    assert(isHtml('<p>Hello</p>'), 'Should detect HTML paragraph');
    assert(isHtml('<div><strong>Bold</strong></div>'), 'Should detect HTML div');
    assert(!isHtml('Just plain text'), 'Plain text is not HTML');
    assert(!isHtml('**bold** and *italic*'), 'Markdown is not HTML');
    console.log('  ✓ isHtml detection');
  }

  // Test: basic conversion
  {
    const md = htmlToMarkdown('<p>Hello <strong>world</strong></p>');
    assert(md.includes('**world**'), `Should convert strong to **, got: ${md}`);
    console.log('  ✓ basic strong conversion');
  }

  // Test: heading conversion
  {
    const md = htmlToMarkdown('<h2>My Heading</h2>');
    assert(md.includes('## My Heading'), `Should convert h2, got: ${md}`);
    console.log('  ✓ heading conversion');
  }

  // Test: link conversion
  {
    const md = htmlToMarkdown('<a href="https://example.com">Example</a>');
    assert(md.includes('[Example](https://example.com)'), `Should convert link, got: ${md}`);
    console.log('  ✓ link conversion');
  }

  // Test: list conversion
  {
    const md = htmlToMarkdown('<ul><li>Item 1</li><li>Item 2</li></ul>');
    assert(md.includes('Item 1'), 'Should contain list items');
    assert(md.includes('Item 2'), 'Should contain list items');
    console.log('  ✓ list conversion');
  }

  // Test: plain text passthrough
  {
    const text = 'No HTML here, just text.';
    const result = htmlToMarkdown(text);
    assert(result === text, `Plain text should pass through unchanged, got: ${result}`);
    console.log('  ✓ plain text passthrough');
  }

  console.log('All htmlToMarkdown tests passed!');
}

runTests();
