import * as vscode from 'vscode';
import { analyzeDocument, AnalysisResult } from './analyzer';
import { calculateReadability, ReadabilityScore } from './readability';
import { checkLinks, LinkCheckResult } from './linkChecker';

export class XrayViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'marksmith.xrayView';

  private view?: vscode.WebviewView;
  private lastAnalysis?: AnalysisResult;
  private lastReadability?: ReadabilityScore;
  private linkResults: LinkCheckResult[] = [];

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.type === 'jump-to-line') {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const line = message.line;
          const range = new vscode.Range(line, 0, line, 0);
          editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
          editor.selection = new vscode.Selection(line, 0, line, 0);
        }
      }
      if (message.type === 'check-links') {
        this.runLinkCheck();
      }
    });

    this.updateView();
  }

  async updateView(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
      if (this.view) {
        this.view.webview.html = this.getEmptyHtml();
      }
      return;
    }

    const text = editor.document.getText();
    this.lastAnalysis = analyzeDocument(text);
    this.lastReadability = calculateReadability(this.lastAnalysis, text);

    if (this.view) {
      this.view.webview.html = this.getHtml(this.lastAnalysis, this.lastReadability, this.linkResults);
    }
  }

  private async runLinkCheck(): Promise<void> {
    if (!this.lastAnalysis) { return; }

    this.linkResults = await checkLinks(this.lastAnalysis.linkUrls);

    if (this.view && this.lastAnalysis && this.lastReadability) {
      this.view.webview.html = this.getHtml(this.lastAnalysis, this.lastReadability, this.linkResults);
    }
  }

  private getEmptyHtml(): string {
    return `<!DOCTYPE html>
<html><body style="font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 16px;">
<p style="opacity: 0.6;">Open a Markdown file to see analysis.</p>
</body></html>`;
  }

  private getHtml(analysis: AnalysisResult, readability: ReadabilityScore, links: LinkCheckResult[]): string {
    const scoreColor = readability.score >= 70 ? '#22c55e' : readability.score >= 40 ? '#f59e0b' : '#ef4444';
    const scoreEmoji = readability.score >= 70 ? '🟢' : readability.score >= 40 ? '🟡' : '🔴';

    const headingsHtml = analysis.headings.map(h => {
      const indent = (h.level - 1) * 16;
      return `<div style="margin-left: ${indent}px; padding: 2px 0; cursor: pointer;" onclick="jumpTo(${h.line})">
        <span style="opacity: 0.5; font-size: 0.8em;">H${h.level}</span> ${this.escapeHtml(h.text)}
      </div>`;
    }).join('');

    const freqHtml = analysis.wordFrequency.slice(0, 8).map(wf => {
      const barWidth = Math.min(100, (wf.count / Math.max(1, analysis.wordFrequency[0]?.count || 1)) * 100);
      return `<div style="display: flex; align-items: center; gap: 8px; margin: 2px 0;">
        <span style="min-width: 80px; font-size: 0.85em;">${this.escapeHtml(wf.word)}</span>
        <div style="flex: 1; height: 6px; background: var(--vscode-editor-background); border-radius: 3px;">
          <div style="width: ${barWidth}%; height: 100%; background: var(--vscode-textLink-foreground); border-radius: 3px;"></div>
        </div>
        <span style="font-size: 0.75em; opacity: 0.6;">${wf.count}</span>
      </div>`;
    }).join('');

    const linksHtml = links.length > 0
      ? links.map(l => {
          const icon = l.status === 'ok' ? '✅' : l.status === 'timeout' ? '⏱️' : '❌';
          const urlShort = l.url.length > 40 ? l.url.substring(0, 40) + '...' : l.url;
          return `<div style="font-size: 0.8em; padding: 2px 0; cursor: pointer;" onclick="jumpTo(${l.line})" title="${this.escapeHtml(l.url)}">
            ${icon} ${this.escapeHtml(urlShort)}
          </div>`;
        }).join('')
      : `<button onclick="checkLinks()" style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Check Links (${analysis.linkUrls.length})</button>`;

    return `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: var(--vscode-font-family);
    color: var(--vscode-foreground);
    padding: 12px;
    font-size: 13px;
    line-height: 1.4;
  }
  .section {
    margin-bottom: 16px;
  }
  .section-title {
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.7;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .stat-card {
    background: var(--vscode-editor-background);
    padding: 8px;
    border-radius: 6px;
    text-align: center;
  }
  .stat-value {
    font-size: 1.3em;
    font-weight: 700;
  }
  .stat-label {
    font-size: 0.75em;
    opacity: 0.6;
  }
  .score-bar {
    height: 8px;
    background: var(--vscode-editor-background);
    border-radius: 4px;
    margin-top: 6px;
  }
  .score-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
  }
</style>
</head>
<body>
  <div class="section">
    <div class="section-title">📊 Overview</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${analysis.wordCount.toLocaleString()}</div>
        <div class="stat-label">Words</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${analysis.readingTimeMinutes}m</div>
        <div class="stat-label">Read Time</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${analysis.charCount.toLocaleString()}</div>
        <div class="stat-label">Characters</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${analysis.sentenceCount}</div>
        <div class="stat-label">Sentences</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">${scoreEmoji} Readability</div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 600;">${readability.grade}</span>
      <span style="font-size: 1.1em; font-weight: 700; color: ${scoreColor};">${readability.score}/100</span>
    </div>
    <div class="score-bar">
      <div class="score-fill" style="width: ${readability.score}%; background: ${scoreColor};"></div>
    </div>
    <div style="font-size: 0.8em; opacity: 0.7; margin-top: 4px;">${readability.description}</div>
  </div>

  <div class="section">
    <div class="section-title">📑 Structure</div>
    ${headingsHtml || '<div style="opacity: 0.5; font-size: 0.85em;">No headings found</div>'}
  </div>

  <div class="section">
    <div class="section-title">🔤 Top Words</div>
    ${freqHtml || '<div style="opacity: 0.5; font-size: 0.85em;">Not enough content</div>'}
  </div>

  <div class="section">
    <div class="section-title">🔗 Links</div>
    ${linksHtml}
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    function jumpTo(line) {
      vscode.postMessage({ type: 'jump-to-line', line: line });
    }
    function checkLinks() {
      vscode.postMessage({ type: 'check-links' });
    }
  </script>
</body>
</html>`;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
