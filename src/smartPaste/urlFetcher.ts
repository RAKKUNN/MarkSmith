import * as https from 'https';
import * as http from 'http';

const URL_PATTERN = /^https?:\/\/[^\s]+$/;
const TIMEOUT_MS = 3000;

export function isUrl(text: string): boolean {
  return URL_PATTERN.test(text.trim());
}

export async function fetchUrlTitle(url: string): Promise<string | null> {
  try {
    const html = await fetchPage(url);
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null;
  } catch {
    return null;
  }
}

function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: TIMEOUT_MS, headers: { 'User-Agent': 'Marksmith/1.0' } }, (res) => {
      // Follow redirects (up to 3)
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchPage(res.headers.location).then(resolve).catch(reject);
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk: string) => {
        data += chunk;
        // Only read enough to find <title>
        if (data.length > 50000 || /<\/title>/i.test(data)) {
          res.destroy();
          resolve(data);
        }
      });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.on('error', reject);
  });
}

export function formatAsLink(title: string | null, url: string): string {
  if (title) {
    // Escape markdown special chars in title
    const safeTitle = title.replace(/[[\]]/g, '\\$&');
    return `[${safeTitle}](${url})`;
  }
  return `<${url}>`;
}
