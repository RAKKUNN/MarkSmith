const githubTheme = `
  :root {
    --bg-color: #ffffff;
    --text-color: #24292f;
    --code-bg: #f6f8fa;
    --border-color: #d0d7de;
    --th-bg: #f6f8fa;
    --accent-color: #0969da;
    --link-color: #0969da;
    --blockquote-color: #656d76;
    --blockquote-bg: transparent;
  }
  body {
    background: var(--bg-color);
    color: var(--text-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
  h1 { border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
  h2 { border-bottom: 1px solid var(--border-color); padding-bottom: 6px; }
`;

const darkTheme = `
  :root {
    --bg-color: #0d1117;
    --text-color: #c9d1d9;
    --code-bg: #161b22;
    --border-color: #30363d;
    --th-bg: #161b22;
    --accent-color: #58a6ff;
    --link-color: #58a6ff;
    --blockquote-color: #8b949e;
    --blockquote-bg: rgba(88,166,255,0.05);
  }
  body {
    background: var(--bg-color);
    color: var(--text-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
  h1 { border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
  h2 { border-bottom: 1px solid var(--border-color); padding-bottom: 6px; }
`;

const minimalTheme = `
  :root {
    --bg-color: #fafafa;
    --text-color: #333333;
    --code-bg: #f0f0f0;
    --border-color: #e0e0e0;
    --th-bg: #f5f5f5;
    --accent-color: #6366f1;
    --link-color: #6366f1;
    --blockquote-color: #666666;
    --blockquote-bg: #f8f8f8;
  }
  body {
    background: var(--bg-color);
    color: var(--text-color);
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1.8;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
`;

const themes: Record<string, string> = {
  github: githubTheme,
  dark: darkTheme,
  minimal: minimalTheme,
};

export function getThemeCss(theme: string): string {
  return themes[theme] || themes['github'];
}
