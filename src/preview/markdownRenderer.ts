import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';

const md: MarkdownIt = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: (str: string, lang: string): string => {
    return `<pre class="code-block"><code class="language-${lang}">${escapeHtml(str)}</code></pre>`;
  },
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// KaTeX math support
md.use(texmath, {
  engine: katex,
  delimiters: 'dollars',
  katexOptions: {
    throwOnError: false,
    displayMode: false,
  },
});

// Inject data-line attributes for source mapping
function injectLineAttr(tokens: any[], idx: number, options: any, env: any, self: any): string {
  const token = tokens[idx];
  if (token.map && token.map.length >= 2) {
    token.attrSet('data-line', String(token.map[0]));
  }
  return self.renderToken(tokens, idx, options);
}

const blockTags = [
  'heading_open', 'paragraph_open', 'blockquote_open',
  'ordered_list_open', 'bullet_list_open', 'table_open', 'hr',
];
for (const tag of blockTags) {
  md.renderer.rules[tag] = injectLineAttr;
}

// Mermaid diagram support: fenced code blocks with language "mermaid"
const defaultFence = md.renderer.rules.fence;
md.renderer.rules.fence = (tokens: any[], idx: number, options: any, env: any, self: any): string => {
  const token = tokens[idx];
  const lineAttr = token.map ? ` data-line="${token.map[0]}"` : '';
  if (token.info.trim() === 'mermaid') {
    return `<div class="mermaid"${lineAttr}>${escapeHtml(token.content)}</div>`;
  }
  if (defaultFence) {
    // Inject data-line into default fence output
    const html = defaultFence(tokens, idx, options, env, self);
    if (lineAttr) {
      return html.replace(/^<pre/, `<pre${lineAttr}`);
    }
    return html;
  }
  return self.renderToken(tokens, idx, options);
};

// Checkbox support for task lists — with data-line for bidirectional toggling
md.renderer.rules.list_item_open = (tokens: any[], idx: number, options: any, env: any, self: any): string => {
  const token = tokens[idx];
  const lineAttr = token.map ? ` data-line="${token.map[0]}"` : '';
  const nextToken = tokens[idx + 1];
  if (nextToken && nextToken.content) {
    if (nextToken.content.startsWith('[ ] ')) {
      nextToken.content = nextToken.content.slice(4);
      return `<li class="task-list-item"${lineAttr}><input type="checkbox" data-checkbox${lineAttr}> `;
    }
    if (nextToken.content.startsWith('[x] ') || nextToken.content.startsWith('[X] ')) {
      nextToken.content = nextToken.content.slice(4);
      return `<li class="task-list-item"${lineAttr}><input type="checkbox" checked data-checkbox${lineAttr}> `;
    }
  }
  if (lineAttr) {
    token.attrSet('data-line', String(token.map[0]));
  }
  return self.renderToken(tokens, idx, options);
};

export function renderMarkdown(source: string): string {
  return md.render(source);
}

export function renderMarkdownInline(source: string): string {
  return md.renderInline(source);
}
