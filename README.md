# Marksmith

The smart Markdown toolkit for VS Code / Windsurf.

> Smart Paste · Bi-directional Preview · Document X-Ray — and everything you need for Markdown.

**[한국어](./README.ko.md)** | **[中文](./README.zh.md)** | **[日本語](./README.ja.md)**

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?logo=github)](https://github.com/sponsors/RAKKUNN)

## Highlights

### Smart Paste

Automatically converts clipboard content into optimal Markdown.

- **HTML → Markdown** — Converts HTML copied from web pages/Word into clean Markdown
- **URL → Link** — Auto-fetches page title when pasting a URL to create `[title](url)`
- **Table Data → Table** — Converts TSV/CSV copied from Excel/Google Sheets into Markdown tables
- **Selected Text + URL** — Automatically wraps selected text as a link when pasting a URL

### Bi-directional Preview

The preview and editor are synchronized bidirectionally.

- **Click → Source Jump** — Click a preview element to jump to the corresponding line in the editor
- **Scroll Sync** — Real-time synchronization between editor scroll and preview scroll
- **Checkbox Toggle** — Click checkboxes in the preview to automatically update the source
- **Inline Edit** — Double-click text in the preview to edit directly
- **Incremental Update** — Patches only changed DOM elements instead of full re-render

### Document X-Ray

Real-time document analysis in the sidebar.

- **Word Count / Reading Time** — Supports mixed CJK/Latin documents, always shown in status bar
- **Readability Score** — 0–100 score based on sentence length, heading structure, and word complexity
- **Heading Structure Tree** — Click to jump to the corresponding position
- **Word Frequency Chart** — Identify overused words at a glance
- **Link Health Check** — Validates all URLs in the document

### Enhanced Preview

- **Live Preview** — Renders in a Webview panel simultaneously with editing
- **KaTeX Math** — Renders `$...$` (inline) and `$$...$$` (block) math expressions
- **Mermaid Diagrams** — Automatically renders ` ```mermaid ` code blocks
- **3 Themes** — GitHub, Dark, and Minimal themes
- **Task Lists** — Checkbox support

### Linter / Formatter

- **markdownlint Integration** — Auto-lints on save, results shown in Problems panel
- **Auto Formatter** — Normalizes blank lines, removes trailing whitespace, unifies bullets

### Export

- **HTML Export** — Saves as a complete HTML file with theme applied
- **PDF Export** — High-quality PDF generation via Chromium

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `marksmith.preview.theme` | `github` | Preview theme (github / dark / minimal) |
| `marksmith.preview.fontSize` | `16` | Preview font size (px) |
| `marksmith.linter.enabled` | `true` | Enable auto-linting on save |
| `marksmith.formatter.onSave` | `false` | Enable auto-format on save |
| `marksmith.export.pdfMargin` | `20mm` | PDF margin |
| `marksmith.smartPaste.enabled` | `true` | Enable Smart Paste |
| `marksmith.smartPaste.imageFolder` | `assets` | Image save folder |
| `marksmith.xray.enabled` | `true` | Enable Document X-Ray |
| `marksmith.xray.checkLinks` | `false` | Auto-check link validity |

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| Marksmith: Open Enhanced Preview | `Cmd+Shift+V` | Open preview |
| Marksmith: Smart Paste | — | Smart paste |
| Marksmith: Format Document | `Cmd+Shift+F` | Format document |
| Marksmith: Lint Document | — | Lint document |
| Marksmith: Export to HTML | — | Export to HTML |
| Marksmith: Export to PDF | — | Export to PDF |

## Support

If you find Marksmith useful, please consider [sponsoring](https://github.com/sponsors/RAKKUNN) the project.

[![Sponsor RAKKUNN](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github)](https://github.com/sponsors/RAKKUNN)

## License

MIT
