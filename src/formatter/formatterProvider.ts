import * as vscode from 'vscode';

export class FormatterProvider implements vscode.DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    _options: vscode.FormattingOptions,
    _token: vscode.CancellationToken
  ): vscode.TextEdit[] {
    const edits: vscode.TextEdit[] = [];
    const text = document.getText();
    const formatted = this.format(text);

    if (formatted !== text) {
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      edits.push(vscode.TextEdit.replace(fullRange, formatted));
    }

    return edits;
  }

  formatDocument(document: vscode.TextDocument): void {
    const text = document.getText();
    const formatted = this.format(text);

    if (formatted === text) {
      vscode.window.showInformationMessage('Document is already well-formatted.');
      return;
    }

    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );
    edit.replace(document.uri, fullRange, formatted);
    vscode.workspace.applyEdit(edit).then((success) => {
      if (success) {
        vscode.window.showInformationMessage('Markdown formatted successfully.');
      }
    });
  }

  private format(text: string): string {
    let result = text;

    // Normalize line endings
    result = result.replace(/\r\n/g, '\n');

    // Ensure single blank line before headings (except at start of file)
    result = result.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');

    // Remove multiple consecutive blank lines (max 2 newlines = 1 blank line)
    result = result.replace(/\n{3,}/g, '\n\n');

    // Ensure blank line after headings
    result = result.replace(/(^#{1,6}\s.*$)\n(?!\n)/gm, '$1\n\n');

    // Fix list item spacing: ensure consistent indentation
    result = result.replace(/^(\s*[-*+])\s{2,}/gm, '$1 ');

    // Trim trailing whitespace (except for intentional line breaks "  \n")
    result = result.replace(/([^ \n])\s+$/gm, '$1');

    // Ensure file ends with a single newline
    result = result.replace(/\n*$/, '\n');

    // Fix spacing around horizontal rules
    result = result.replace(/\n(---|\*\*\*|___)\n(?!\n)/g, '\n$1\n\n');

    // Normalize bullet markers to `-`
    result = result.replace(/^(\s*)[*+]\s/gm, '$1- ');

    return result;
  }
}
