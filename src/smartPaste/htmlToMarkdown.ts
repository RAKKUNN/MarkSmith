import TurndownService from 'turndown';

function createTurndownService(): TurndownService {
  const service = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  });

  return service;
}

const turndown = createTurndownService();

export function htmlToMarkdown(html: string): string {
  // Quick check: if there are no HTML tags, return as-is
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html;
  }
  try {
    let md = turndown.turndown(html).trim();
    // Clean up excessive blank lines
    md = md.replace(/\n{3,}/g, '\n\n');
    return md;
  } catch {
    return html;
  }
}

export function isHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}
