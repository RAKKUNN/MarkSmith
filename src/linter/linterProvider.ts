import * as vscode from 'vscode';
import markdownlint from 'markdownlint';

export class LinterProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext) {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('marksmith');
    context.subscriptions.push(this.diagnosticCollection);
  }

  lintDocument(document: vscode.TextDocument): void {
    const content = document.getText();
    const options: markdownlint.Options = {
      strings: { content },
      config: {
        'default': true,
        'MD013': false,      // Line length - disable by default
        'MD033': false,       // Inline HTML - allow
        'MD041': false,       // First line heading - optional
      },
    };

    markdownlint(options, (err, result) => {
      if (err || !result) {
        return;
      }

      const diagnostics: vscode.Diagnostic[] = [];
      const fileResults = result['content'];

      if (fileResults) {
        for (const issue of fileResults) {
          const line = Math.max(0, issue.lineNumber - 1);
          const range = new vscode.Range(line, 0, line, Number.MAX_SAFE_INTEGER);
          const severity = this.getSeverity(issue.ruleNames);
          const diagnostic = new vscode.Diagnostic(
            range,
            `${issue.ruleNames.join('/')} - ${issue.ruleDescription}`,
            severity
          );
          diagnostic.source = 'Marksmith';
          diagnostic.code = issue.ruleNames[0];
          diagnostics.push(diagnostic);
        }
      }

      this.diagnosticCollection.set(document.uri, diagnostics);
    });
  }

  private getSeverity(ruleNames: string[]): vscode.DiagnosticSeverity {
    const errorRules = ['MD001', 'MD003', 'MD004', 'MD005', 'MD007'];
    if (ruleNames.some(r => errorRules.includes(r))) {
      return vscode.DiagnosticSeverity.Error;
    }
    return vscode.DiagnosticSeverity.Warning;
  }

  dispose(): void {
    this.diagnosticCollection.dispose();
  }
}
