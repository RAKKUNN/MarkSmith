import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { renderMarkdown } from '../preview/markdownRenderer';
import { getPreviewHtml } from '../preview/previewTemplate';

export class ExportManager {
  async exportToHtml(document: vscode.TextDocument): Promise<void> {
    const config = vscode.workspace.getConfiguration('marksmith');
    const theme = config.get<string>('preview.theme', 'github');
    const fontSize = config.get<number>('preview.fontSize', 16);

    const content = document.getText();
    const htmlBody = renderMarkdown(content);
    const fullHtml = getPreviewHtml(htmlBody, theme, fontSize);

    const defaultUri = this.getDefaultSavePath(document, 'html');
    const uri = await vscode.window.showSaveDialog({
      defaultUri,
      filters: { 'HTML Files': ['html'] },
    });

    if (uri) {
      fs.writeFileSync(uri.fsPath, fullHtml, 'utf-8');
      vscode.window.showInformationMessage(`Exported to ${uri.fsPath}`);

      const openAction = await vscode.window.showInformationMessage(
        'Open exported HTML file?',
        'Open in Browser',
        'Open in Editor'
      );
      if (openAction === 'Open in Browser') {
        vscode.env.openExternal(uri);
      } else if (openAction === 'Open in Editor') {
        vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
      }
    }
  }

  async exportToPdf(document: vscode.TextDocument): Promise<void> {
    const config = vscode.workspace.getConfiguration('marksmith');
    const theme = config.get<string>('preview.theme', 'github');
    const fontSize = config.get<number>('preview.fontSize', 16);
    const margin = config.get<string>('export.pdfMargin', '20mm');

    const content = document.getText();
    const htmlBody = renderMarkdown(content);
    const fullHtml = getPreviewHtml(htmlBody, theme, fontSize);

    const defaultUri = this.getDefaultSavePath(document, 'pdf');
    const uri = await vscode.window.showSaveDialog({
      defaultUri,
      filters: { 'PDF Files': ['pdf'] },
    });

    if (!uri) { return; }

    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Exporting to PDF...',
          cancellable: false,
        },
        async () => {
          await this.generatePdf(fullHtml, uri.fsPath, margin);
        }
      );

      vscode.window.showInformationMessage(`Exported to ${uri.fsPath}`);
    } catch (error: any) {
      const message = error?.message || 'Unknown error';
      if (message.includes('puppeteer') || message.includes('Cannot find module')) {
        vscode.window.showErrorMessage(
          'PDF export requires a Chromium browser. Install puppeteer-core and ensure Chrome/Chromium is available.'
        );
      } else {
        vscode.window.showErrorMessage(`PDF export failed: ${message}`);
      }
    }
  }

  private async generatePdf(html: string, outputPath: string, margin: string): Promise<void> {
    let puppeteer;
    try {
      puppeteer = require('puppeteer-core');
    } catch {
      throw new Error('puppeteer-core is not installed. Run: npm install puppeteer-core');
    }

    const executablePath = this.findChromium();
    if (!executablePath) {
      throw new Error(
        'Could not find Chrome/Chromium. Please install Chrome or set the path manually.'
      );
    }

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: { top: margin, right: margin, bottom: margin, left: margin },
        printBackground: true,
      });
    } finally {
      await browser.close();
    }
  }

  private findChromium(): string | null {
    const candidates: string[] = [];

    if (process.platform === 'darwin') {
      candidates.push(
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      );
    } else if (process.platform === 'linux') {
      candidates.push(
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium',
      );
    } else if (process.platform === 'win32') {
      candidates.push(
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      );
    }

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return null;
  }

  private getDefaultSavePath(document: vscode.TextDocument, ext: string): vscode.Uri {
    const docPath = document.uri.fsPath;
    const dir = path.dirname(docPath);
    const baseName = path.basename(docPath, path.extname(docPath));
    return vscode.Uri.file(path.join(dir, `${baseName}.${ext}`));
  }
}
