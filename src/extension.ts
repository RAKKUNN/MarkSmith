import * as vscode from 'vscode';
import { PreviewManager } from './preview/previewManager';
import { LinterProvider } from './linter/linterProvider';
import { FormatterProvider } from './formatter/formatterProvider';
import { ExportManager } from './export/exportManager';
import { SmartPasteProvider } from './smartPaste/smartPasteProvider';
import { XrayViewProvider } from './xray/xrayViewProvider';
import { analyzeDocument } from './xray/analyzer';

let previewManager: PreviewManager;
let linterProvider: LinterProvider;

export function activate(context: vscode.ExtensionContext) {
  previewManager = new PreviewManager(context);
  linterProvider = new LinterProvider(context);
  const formatterProvider = new FormatterProvider();
  const exportManager = new ExportManager();
  const smartPasteProvider = new SmartPasteProvider();
  const xrayProvider = new XrayViewProvider(context);

  // Register X-Ray sidebar
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(XrayViewProvider.viewType, xrayProvider)
  );

  // Status bar: word count & reading time
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'marksmith.xrayView.focus';
  context.subscriptions.push(statusBarItem);

  function updateStatusBar() {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'markdown') {
      const analysis = analyzeDocument(editor.document.getText());
      statusBarItem.text = `$(book) ${analysis.wordCount} words · ${analysis.readingTimeMinutes}m read`;
      statusBarItem.tooltip = 'Marksmith Document X-Ray';
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  }
  updateStatusBar();

  // Preview command
  context.subscriptions.push(
    vscode.commands.registerCommand('marksmith.openPreview', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'markdown') {
        previewManager.showPreview(editor.document);
      }
    })
  );

  // Export commands
  context.subscriptions.push(
    vscode.commands.registerCommand('marksmith.exportHtml', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'markdown') {
        exportManager.exportToHtml(editor.document);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('marksmith.exportPdf', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'markdown') {
        exportManager.exportToPdf(editor.document);
      }
    })
  );

  // Format command
  context.subscriptions.push(
    vscode.commands.registerCommand('marksmith.formatDocument', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'markdown') {
        formatterProvider.formatDocument(editor.document);
      }
    })
  );

  // Lint command
  context.subscriptions.push(
    vscode.commands.registerCommand('marksmith.lintDocument', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'markdown') {
        linterProvider.lintDocument(editor.document);
      }
    })
  );

  // Smart Paste command
  context.subscriptions.push(
    vscode.commands.registerCommand('marksmith.smartPaste', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === 'markdown') {
        smartPasteProvider.smartPaste(editor);
      }
    })
  );

  // Register document formatter
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('markdown', formatterProvider)
  );

  // Auto-lint on save
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (document.languageId !== 'markdown') { return; }

      const config = vscode.workspace.getConfiguration('marksmith');

      if (config.get<boolean>('linter.enabled', true)) {
        linterProvider.lintDocument(document);
      }

      if (config.get<boolean>('formatter.onSave', false)) {
        formatterProvider.formatDocument(document);
      }
    })
  );

  // Update preview on text change
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === 'markdown') {
        previewManager.updatePreview(event.document);
      }
    })
  );

  // Update X-Ray and status bar on editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      updateStatusBar();
      xrayProvider.updateView();
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document === vscode.window.activeTextEditor?.document && event.document.languageId === 'markdown') {
        updateStatusBar();
        xrayProvider.updateView();
      }
    })
  );

  // Scroll sync: editor → preview
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorVisibleRanges((event) => {
      if (event.textEditor.document.languageId === 'markdown' && event.visibleRanges.length > 0) {
        const line = event.visibleRanges[0].start.line;
        previewManager.scrollToLine(event.textEditor.document, line);
      }
    })
  );

  vscode.window.showInformationMessage('Marksmith activated!');
}

export function deactivate() {
  if (previewManager) {
    previewManager.dispose();
  }
  if (linterProvider) {
    linterProvider.dispose();
  }
}
