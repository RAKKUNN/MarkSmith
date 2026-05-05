# Changelog

All notable changes to **Marksmith** will be documented in this file.

## [0.2.0] - 2025-05-05

### Added

- **Smart Paste** — Auto-convert clipboard content to optimal Markdown
  - HTML → Markdown conversion (via turndown)
  - URL paste with auto title fetch → `[title](url)` link
  - TSV/CSV → Markdown table conversion
  - Selected text + URL paste → automatic link wrapping
- **Bi-directional Preview**
  - Click preview element → jump to source line
  - Editor ↔ preview scroll synchronization
  - Checkbox toggle from preview (syncs to source)
  - Double-click inline editing in preview
  - Incremental DOM update (no full re-render)
  - `data-line` source mapping on all block elements
- **Document X-Ray** sidebar
  - Word count, character count, sentence count
  - Reading time estimate (CJK/Latin aware)
  - Readability score (0–100)
  - Heading structure tree with click-to-jump
  - Word frequency chart (top 8)
  - Link health checker (HTTP HEAD validation)
  - Status bar item showing word count & reading time

### Changed

- **Rebranded** to "Marksmith"
  - All command prefixes and configuration keys unified under `marksmith.*`
  - Extension display name and descriptions updated
- Added ESLint configuration (`.eslintrc.json`)

## [0.1.0] - Initial

- Real-time Markdown preview with KaTeX, Mermaid, task lists
- 3 themes: GitHub, Dark, Minimal
- markdownlint integration (auto-lint on save)
- Markdown formatter (normalize blanks, trailing spaces, bullets)
- Export to HTML and PDF (puppeteer-core)
