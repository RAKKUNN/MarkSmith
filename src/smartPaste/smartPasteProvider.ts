import * as vscode from 'vscode';
import { htmlToMarkdown, isHtml } from './htmlToMarkdown';
import { isUrl, fetchUrlTitle, formatAsLink } from './urlFetcher';
import { isTabularData, convertToMarkdownTable } from './tableConverter';

export class SmartPasteProvider {
  async smartPaste(editor: vscode.TextEditor): Promise<void> {
    const config = vscode.workspace.getConfiguration('marksmith');
    const enabled = config.get<boolean>('smartPaste.enabled', true);

    if (!enabled) {
      await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
      return;
    }

    const clipboardText = await vscode.env.clipboard.readText();

    if (!clipboardText || clipboardText.trim().length === 0) {
      // No text content — fall back to default paste (may be image)
      await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
      return;
    }

    const trimmed = clipboardText.trim();

    // 1. URL detection — fetch title and create markdown link
    if (isUrl(trimmed)) {
      await this.handleUrlPaste(editor, trimmed);
      return;
    }

    // 2. HTML detection — convert to markdown
    if (isHtml(trimmed)) {
      await this.handleHtmlPaste(editor, trimmed);
      return;
    }

    // 3. Tabular data (TSV/CSV) — convert to markdown table
    if (isTabularData(trimmed)) {
      await this.handleTablePaste(editor, trimmed);
      return;
    }

    // 4. Plain text with selected text — wrap as link if URL
    const selection = editor.selection;
    if (!selection.isEmpty && isUrl(trimmed)) {
      const selectedText = editor.document.getText(selection);
      await editor.edit(editBuilder => {
        editBuilder.replace(selection, `[${selectedText}](${trimmed})`);
      });
      return;
    }

    // 5. Default paste
    await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
  }

  private async handleUrlPaste(editor: vscode.TextEditor, url: string): Promise<void> {
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    // If there's selected text, wrap it as a link immediately
    if (!selection.isEmpty && selectedText.trim().length > 0) {
      await editor.edit(editBuilder => {
        editBuilder.replace(selection, `[${selectedText}](${url})`);
      });
      return;
    }

    // Insert temporary placeholder while fetching
    const position = editor.selection.active;
    const placeholder = `[Loading...](${url})`;
    await editor.edit(editBuilder => {
      editBuilder.insert(position, placeholder);
    });

    // Fetch title in background
    const title = await fetchUrlTitle(url);
    const linkText = formatAsLink(title, url);

    // Replace placeholder with actual link
    const doc = editor.document;
    const fullText = doc.getText();
    const placeholderIndex = fullText.indexOf(placeholder);
    if (placeholderIndex >= 0) {
      const startPos = doc.positionAt(placeholderIndex);
      const endPos = doc.positionAt(placeholderIndex + placeholder.length);
      const range = new vscode.Range(startPos, endPos);
      await editor.edit(editBuilder => {
        editBuilder.replace(range, linkText);
      });
    }
  }

  private async handleHtmlPaste(editor: vscode.TextEditor, html: string): Promise<void> {
    const markdown = htmlToMarkdown(html);
    const position = editor.selection.isEmpty
      ? editor.selection.active
      : undefined;

    if (position) {
      await editor.edit(editBuilder => {
        editBuilder.insert(position, markdown);
      });
    } else {
      await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, markdown);
      });
    }
  }

  private async handleTablePaste(editor: vscode.TextEditor, text: string): Promise<void> {
    const table = convertToMarkdownTable(text);
    const position = editor.selection.isEmpty
      ? editor.selection.active
      : undefined;

    if (position) {
      await editor.edit(editBuilder => {
        editBuilder.insert(position, table);
      });
    } else {
      await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, table);
      });
    }
  }
}
