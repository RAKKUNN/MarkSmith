import * as vscode from 'vscode';
import { renderMarkdown } from './markdownRenderer';
import { getPreviewHtml } from './previewTemplate';
import { BidirectionalSync } from './bidirectional';

export class PreviewManager {
  private panels: Map<string, vscode.WebviewPanel> = new Map();
  private documents: Map<string, vscode.TextDocument> = new Map();
  private context: vscode.ExtensionContext;
  private bidirectional = new BidirectionalSync();
  private initialized: Set<string> = new Set();

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  showPreview(document: vscode.TextDocument): void {
    const key = document.uri.toString();
    const existing = this.panels.get(key);

    if (existing) {
      existing.reveal(vscode.ViewColumn.Beside);
      this.doUpdate(existing, document);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'marksmithPreview',
      `Preview: ${this.getTitle(document)}`,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.context.extensionUri, 'media'),
        ],
      }
    );

    this.panels.set(key, panel);
    this.documents.set(key, document);
    this.doUpdate(panel, document);

    // Handle messages from webview (bidirectional)
    panel.webview.onDidReceiveMessage((message) => {
      const doc = this.documents.get(key);
      if (doc) {
        this.bidirectional.handleMessage(message, doc);
      }
    });

    panel.onDidDispose(() => {
      this.panels.delete(key);
      this.documents.delete(key);
      this.initialized.delete(key);
    });
  }

  updatePreview(document: vscode.TextDocument): void {
    const key = document.uri.toString();
    const panel = this.panels.get(key);
    if (panel) {
      this.doUpdate(panel, document);
    }
  }

  scrollToLine(document: vscode.TextDocument, line: number): void {
    const key = document.uri.toString();
    const panel = this.panels.get(key);
    if (panel) {
      panel.webview.postMessage({ type: 'scroll-to-line', line });
    }
  }

  private doUpdate(panel: vscode.WebviewPanel, document: vscode.TextDocument): void {
    const config = vscode.workspace.getConfiguration('marksmith');
    const theme = config.get<string>('preview.theme', 'github');
    const fontSize = config.get<number>('preview.fontSize', 16);

    const markdownContent = document.getText();
    const htmlBody = renderMarkdown(markdownContent);
    const key = document.uri.toString();

    // First render: full HTML; subsequent: incremental content update
    if (!this.initialized.has(key)) {
      panel.webview.html = getPreviewHtml(htmlBody, theme, fontSize);
      this.initialized.add(key);
    } else {
      panel.webview.postMessage({ type: 'update-content', html: htmlBody });
    }
  }

  private getTitle(document: vscode.TextDocument): string {
    const path = document.uri.path;
    return path.split('/').pop() || 'Markdown';
  }

  dispose(): void {
    for (const panel of this.panels.values()) {
      panel.dispose();
    }
    this.panels.clear();
    this.documents.clear();
    this.initialized.clear();
  }
}
