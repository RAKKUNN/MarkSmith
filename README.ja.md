# Marksmith

VS Code / Windsurf 向けのスマート Markdown ツールキット。

> Smart Paste · Bi-directional Preview · Document X-Ray — Markdown に必要なすべてを。

**[English](./README.md)** | **[한국어](./README.ko.md)** | **[中文](./README.zh.md)**

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?logo=github)](https://github.com/sponsors/RAKKUNN)

## ハイライト

### Smart Paste

クリップボードの内容を自動的に最適な Markdown に変換します。

- **HTML → Markdown** — Web ページ/Word からコピーした HTML をクリーンな Markdown に変換
- **URL → Link** — URL 貼り付け時にページタイトルを自動取得し `[タイトル](url)` を生成
- **テーブルデータ → Table** — Excel/Google Sheets からコピーした TSV/CSV を Markdown テーブルに変換
- **選択テキスト + URL** — テキスト選択後に URL を貼り付けると自動リンクラッピング

### Bi-directional Preview

プレビューとエディタが双方向に連動します。

- **クリック → ソースジャンプ** — プレビュー要素をクリックするとエディタの該当行にジャンプ
- **スクロール同期** — エディタスクロール ↔ プレビュースクロールのリアルタイム連動
- **チェックボックス切替** — プレビューでチェックボックスをクリックするとソースを自動修正
- **インライン編集** — プレビューでテキストをダブルクリックして直接編集
- **増分更新** — フルリレンダーの代わりに変更分のみ DOM パッチ

### Document X-Ray

サイドバーでドキュメントをリアルタイム分析します。

- **単語数 / 読了時間** — 日本語/英語混合文書対応、ステータスバーに常時表示
- **可読性スコア** — 文の長さ、見出し構造、単語の複雑さに基づく 0–100 点
- **見出し構造ツリー** — クリックで該当位置にジャンプ
- **単語頻度チャート** — 過剰使用の単語を一目で把握
- **リンクヘルスチェック** — ドキュメント内のすべての URL の有効性を検証

### プレビュー強化

- **ライブプレビュー** — 編集と同時に Webview パネルでレンダリング
- **KaTeX 数式対応** — `$...$`（インライン）および `$$...$$`（ブロック）数式レンダリング
- **Mermaid ダイアグラム** — ` ```mermaid ` コードブロックを自動レンダリング
- **3 つのテーマ** — GitHub、Dark、Minimal テーマ
- **タスクリスト** — チェックボックス対応

### リンター / フォーマッター

- **markdownlint 統合** — 保存時に自動リント、Problems パネルに結果表示
- **自動フォーマッター** — 空行の正規化、末尾スペース除去、箇条書き統一

### エクスポート

- **HTML エクスポート** — テーマ適用済みの完全な HTML ファイルとして保存
- **PDF エクスポート** — Chromium ベースの高品質 PDF 生成

## 設定

| 設定 | デフォルト | 説明 |
|------|-----------|------|
| `marksmith.preview.theme` | `github` | プレビューテーマ (github / dark / minimal) |
| `marksmith.preview.fontSize` | `16` | プレビューフォントサイズ (px) |
| `marksmith.linter.enabled` | `true` | 保存時の自動リントを有効化 |
| `marksmith.formatter.onSave` | `false` | 保存時の自動フォーマットを有効化 |
| `marksmith.export.pdfMargin` | `20mm` | PDF マージン |
| `marksmith.smartPaste.enabled` | `true` | Smart Paste を有効化 |
| `marksmith.smartPaste.imageFolder` | `assets` | 画像保存フォルダ |
| `marksmith.xray.enabled` | `true` | Document X-Ray を有効化 |
| `marksmith.xray.checkLinks` | `false` | リンクの自動検証 |

## コマンド

| コマンド | ショートカット | 説明 |
|----------|--------------|------|
| Marksmith: Open Enhanced Preview | `Cmd+Shift+V` | プレビューを開く |
| Marksmith: Smart Paste | — | スマートペースト |
| Marksmith: Format Document | `Cmd+Shift+F` | ドキュメントをフォーマット |
| Marksmith: Lint Document | — | ドキュメントをリント |
| Marksmith: Export to HTML | — | HTML にエクスポート |
| Marksmith: Export to PDF | — | PDF にエクスポート |

## サポート

Marksmith が役に立ったら、プロジェクトの[スポンサー](https://github.com/sponsors/RAKKUNN)をご検討ください。

[![Sponsor RAKKUNN](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github)](https://github.com/sponsors/RAKKUNN)

## ライセンス

MIT
