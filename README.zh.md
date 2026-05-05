# Marksmith

适用于 VS Code / Windsurf 的智能 Markdown 工具包。

> Smart Paste · Bi-directional Preview · Document X-Ray — Markdown 所需的一切。

**[English](./README.md)** | **[한국어](./README.ko.md)** | **[日本語](./README.ja.md)**

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?logo=github)](https://github.com/sponsors/RAKKUNN)

## 功能亮点

### Smart Paste

自动将剪贴板内容转换为最优的 Markdown 格式。

- **HTML → Markdown** — 将从网页/Word 复制的 HTML 转换为简洁的 Markdown
- **URL → Link** — 粘贴 URL 时自动获取页面标题，生成 `[标题](url)`
- **表格数据 → Table** — 将从 Excel/Google Sheets 复制的 TSV/CSV 转换为 Markdown 表格
- **选中文本 + URL** — 选中文本后粘贴 URL，自动包装为链接

### Bi-directional Preview

预览与编辑器双向同步联动。

- **点击 → 源码跳转** — 点击预览元素，跳转到编辑器对应行
- **滚动同步** — 编辑器滚动 ↔ 预览滚动实时联动
- **复选框切换** — 在预览中点击复选框，自动修改源码
- **内联编辑** — 在预览中双击文本直接编辑
- **增量更新** — 仅修补变更的 DOM 元素，无需完全重新渲染

### Document X-Ray

在侧边栏实时分析文档。

- **字数 / 阅读时间** — 支持中英混合文档，始终显示在状态栏
- **可读性评分** — 基于句子长度、标题结构和词汇复杂度的 0–100 分
- **标题结构树** — 点击跳转到对应位置
- **词频图表** — 一目了然地发现过度使用的词汇
- **链接健康检查** — 验证文档中所有 URL 的有效性

### 增强预览

- **实时预览** — 编辑时在 Webview 面板中同步渲染
- **KaTeX 数学公式** — 渲染 `$...$`（行内）和 `$$...$$`（块级）数学表达式
- **Mermaid 图表** — 自动渲染 ` ```mermaid ` 代码块
- **3 种主题** — GitHub、Dark、Minimal 主题
- **任务列表** — 复选框支持

### 检查器 / 格式化器

- **markdownlint 集成** — 保存时自动检查，结果显示在问题面板中
- **自动格式化** — 规范化空行、删除行尾空格、统一项目符号

### 导出

- **HTML 导出** — 保存为带主题的完整 HTML 文件
- **PDF 导出** — 基于 Chromium 的高质量 PDF 生成

## 设置

| 设置 | 默认值 | 说明 |
|------|--------|------|
| `marksmith.preview.theme` | `github` | 预览主题 (github / dark / minimal) |
| `marksmith.preview.fontSize` | `16` | 预览字体大小 (px) |
| `marksmith.linter.enabled` | `true` | 保存时启用自动检查 |
| `marksmith.formatter.onSave` | `false` | 保存时启用自动格式化 |
| `marksmith.export.pdfMargin` | `20mm` | PDF 页边距 |
| `marksmith.smartPaste.enabled` | `true` | 启用 Smart Paste |
| `marksmith.smartPaste.imageFolder` | `assets` | 图片保存文件夹 |
| `marksmith.xray.enabled` | `true` | 启用 Document X-Ray |
| `marksmith.xray.checkLinks` | `false` | 自动检查链接有效性 |

## 命令

| 命令 | 快捷键 | 说明 |
|------|--------|------|
| Marksmith: Open Enhanced Preview | `Cmd+Shift+V` | 打开预览 |
| Marksmith: Smart Paste | — | 智能粘贴 |
| Marksmith: Format Document | `Cmd+Shift+F` | 格式化文档 |
| Marksmith: Lint Document | — | 检查文档 |
| Marksmith: Export to HTML | — | 导出为 HTML |
| Marksmith: Export to PDF | — | 导出为 PDF |

## 赞助

如果您觉得 Marksmith 有用，请考虑[赞助](https://github.com/sponsors/RAKKUNN)本项目。

[![Sponsor RAKKUNN](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github)](https://github.com/sponsors/RAKKUNN)

## 许可证

MIT
