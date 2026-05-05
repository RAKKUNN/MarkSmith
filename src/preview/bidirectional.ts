import * as vscode from 'vscode';

export interface PreviewMessage {
  type: string;
  line?: number;
  checked?: boolean;
  text?: string;
}

/**
 * Handles messages from the preview webview and applies changes to the editor.
 */
export class BidirectionalSync {
  handleMessage(message: PreviewMessage, document: vscode.TextDocument): void {
    switch (message.type) {
      case 'click-line':
        this.revealLine(message.line ?? 0, document);
        break;
      case 'toggle-checkbox':
        this.toggleCheckbox(message.line ?? 0, document);
        break;
      case 'edit-text':
        if (message.line !== undefined && message.text !== undefined) {
          this.editLine(message.line, message.text, document);
        }
        break;
    }
  }

  private revealLine(line: number, document: vscode.TextDocument): void {
    const editor = vscode.window.visibleTextEditors.find(
      e => e.document.uri.toString() === document.uri.toString()
    );
    if (editor) {
      const range = new vscode.Range(line, 0, line, 0);
      editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
      editor.selection = new vscode.Selection(line, 0, line, 0);
    }
  }

  private toggleCheckbox(line: number, document: vscode.TextDocument): void {
    const editor = vscode.window.visibleTextEditors.find(
      e => e.document.uri.toString() === document.uri.toString()
    );
    if (!editor) { return; }

    const textLine = document.lineAt(line);
    const text = textLine.text;

    let newText: string;
    if (text.includes('[ ]')) {
      newText = text.replace('[ ]', '[x]');
    } else if (text.includes('[x]') || text.includes('[X]')) {
      newText = text.replace(/\[x\]/i, '[ ]');
    } else {
      return;
    }

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, textLine.range, newText);
    vscode.workspace.applyEdit(edit);
  }

  private editLine(line: number, newText: string, document: vscode.TextDocument): void {
    const editor = vscode.window.visibleTextEditors.find(
      e => e.document.uri.toString() === document.uri.toString()
    );
    if (!editor) { return; }

    const textLine = document.lineAt(line);
    const currentText = textLine.text;

    // Preserve markdown prefix (headings, list markers, etc.)
    const prefixMatch = currentText.match(/^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+)*)/);
    const prefix = prefixMatch ? prefixMatch[1] : '';

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, textLine.range, prefix + newText);
    vscode.workspace.applyEdit(edit);
  }

  /**
   * Sends the current editor cursor line to the webview for scroll sync.
   */
  static getScrollSyncLine(editor: vscode.TextEditor): number {
    return editor.visibleRanges[0]?.start.line ?? 0;
  }
}
