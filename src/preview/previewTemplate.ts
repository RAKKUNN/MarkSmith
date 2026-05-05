import { getThemeCss } from './themes';

export function getPreviewHtml(body: string, theme: string, fontSize: number): string {
  const themeCss = getThemeCss(theme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline' https://cdn.jsdelivr.net; img-src * data:; font-src https://cdn.jsdelivr.net;">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    ${themeCss}
    body {
      font-size: ${fontSize}px;
      padding: 20px 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    .code-block {
      background: var(--code-bg);
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      font-size: 0.9em;
    }
    code {
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
    }
    .mermaid {
      text-align: center;
      padding: 16px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid var(--border-color);
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: var(--th-bg);
      font-weight: 600;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    blockquote {
      border-left: 4px solid var(--accent-color);
      margin: 16px 0;
      padding: 8px 16px;
      color: var(--blockquote-color);
      background: var(--blockquote-bg);
      border-radius: 0 4px 4px 0;
    }
    .task-list-item {
      list-style: none;
      margin-left: -24px;
    }
    .task-list-item input[type="checkbox"] {
      margin-right: 8px;
    }
    hr {
      border: none;
      border-top: 2px solid var(--border-color);
      margin: 24px 0;
    }
    a {
      color: var(--link-color);
    }
    /* Bidirectional editing styles */
    [data-line]:hover {
      outline: 1px dashed var(--accent-color, #0969da);
      outline-offset: 2px;
      cursor: pointer;
    }
    [contenteditable="true"] {
      outline: 2px solid var(--accent-color, #0969da) !important;
      outline-offset: 2px;
      background: var(--blockquote-bg, rgba(0,0,0,0.03));
      border-radius: 4px;
      padding: 2px 4px;
    }
    .task-list-item input[type="checkbox"] {
      cursor: pointer;
      pointer-events: auto;
    }
  </style>
</head>
<body>
  <div id="content">${body}</div>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({ startOnLoad: true, theme: '${theme === 'dark' ? 'dark' : 'default'}' });

    const vscode = acquireVsCodeApi();

    // Click to jump to source line
    document.addEventListener('click', (e) => {
      const target = e.target;
      // Checkbox toggle
      if (target.matches && target.matches('input[data-checkbox]')) {
        e.preventDefault();
        const line = parseInt(target.getAttribute('data-line'), 10);
        if (!isNaN(line)) {
          vscode.postMessage({ type: 'toggle-checkbox', line: line });
        }
        return;
      }
      // Click on element with data-line
      const el = target.closest ? target.closest('[data-line]') : null;
      if (el) {
        const line = parseInt(el.getAttribute('data-line'), 10);
        if (!isNaN(line)) {
          vscode.postMessage({ type: 'click-line', line: line });
        }
      }
    });

    // Double-click to inline-edit
    document.addEventListener('dblclick', (e) => {
      const el = e.target.closest ? e.target.closest('p[data-line], li[data-line], h1[data-line], h2[data-line], h3[data-line], h4[data-line], h5[data-line], h6[data-line]') : null;
      if (!el || el.querySelector('input[data-checkbox]')) return;
      el.setAttribute('contenteditable', 'true');
      el.focus();

      const finishEdit = () => {
        el.removeAttribute('contenteditable');
        const line = parseInt(el.getAttribute('data-line'), 10);
        if (!isNaN(line)) {
          vscode.postMessage({ type: 'edit-text', line: line, text: el.textContent || '' });
        }
        el.removeEventListener('blur', finishEdit);
        el.removeEventListener('keydown', onKey);
      };

      const onKey = (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); finishEdit(); }
        if (ev.key === 'Escape') { el.removeAttribute('contenteditable'); el.removeEventListener('blur', finishEdit); el.removeEventListener('keydown', onKey); }
      };

      el.addEventListener('blur', finishEdit);
      el.addEventListener('keydown', onKey);
    });

    // Scroll sync: receive scroll command from extension
    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.type === 'scroll-to-line') {
        const target = document.querySelector('[data-line="' + msg.line + '"]');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Find nearest element with data-line <= msg.line
          const all = document.querySelectorAll('[data-line]');
          let best = null;
          for (const el of all) {
            const l = parseInt(el.getAttribute('data-line'), 10);
            if (l <= msg.line) best = el;
          }
          if (best) best.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      if (msg.type === 'update-content') {
        document.getElementById('content').innerHTML = msg.html;
        // Re-init mermaid
        if (typeof mermaid !== 'undefined') {
          mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        }
      }
    });
  </script>
</body>
</html>`;
}
