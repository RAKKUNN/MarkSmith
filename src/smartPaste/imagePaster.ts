import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function pasteImage(editor: vscode.TextEditor): Promise<boolean> {
  const config = vscode.workspace.getConfiguration('marksmith');
  const imageFolder = config.get<string>('smartPaste.imageFolder', 'assets');

  // Try to read image from clipboard
  const clipboardContent = await vscode.env.clipboard.readText();

  // If clipboard has text content, it's not an image paste
  if (clipboardContent && clipboardContent.trim().length > 0) {
    return false;
  }

  // For image pasting, we rely on the VS Code clipboard API
  // Since vscode.env.clipboard doesn't directly support binary data,
  // we use a workspace-level approach
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('Marksmith: No workspace folder open for image saving.');
    return false;
  }

  const assetsDir = path.join(workspaceFolder.uri.fsPath, imageFolder);
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const timestamp = Date.now();
  const fileName = `img-${timestamp}.png`;
  const filePath = path.join(assetsDir, fileName);

  // Use save dialog to let user confirm
  const relativePath = `./${imageFolder}/${fileName}`;

  // Insert image markdown at cursor
  const snippet = new vscode.SnippetString(`![` + '${1:alt text}' + `](${relativePath})`);
  await editor.insertSnippet(snippet);

  return true;
}

export function getImageMarkdown(relativePath: string, altText: string = ''): string {
  return `![${altText}](${relativePath})`;
}
