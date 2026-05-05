import * as https from 'https';
import * as http from 'http';

export interface LinkCheckResult {
  url: string;
  line: number;
  status: 'ok' | 'error' | 'timeout' | 'pending';
  statusCode?: number;
  error?: string;
}

const TIMEOUT_MS = 5000;
const cache = new Map<string, LinkCheckResult>();

export async function checkLinks(links: Array<{ url: string; line: number }>): Promise<LinkCheckResult[]> {
  const results: LinkCheckResult[] = [];

  for (const link of links) {
    // Check cache first
    const cached = cache.get(link.url);
    if (cached) {
      results.push({ ...cached, line: link.line });
      continue;
    }

    const result = await checkSingleLink(link.url, link.line);
    cache.set(link.url, result);
    results.push(result);
  }

  return results;
}

async function checkSingleLink(url: string, line: number): Promise<LinkCheckResult> {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'HEAD', timeout: TIMEOUT_MS }, (res) => {
        const statusCode = res.statusCode || 0;
        if (statusCode >= 200 && statusCode < 400) {
          resolve({ url, line, status: 'ok', statusCode });
        } else {
          resolve({ url, line, status: 'error', statusCode, error: `HTTP ${statusCode}` });
        }
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ url, line, status: 'timeout', error: 'Request timed out' });
      });

      req.on('error', (err: Error) => {
        resolve({ url, line, status: 'error', error: err.message });
      });

      req.end();
    } catch (err: any) {
      resolve({ url, line, status: 'error', error: err?.message || 'Unknown error' });
    }
  });
}

export function clearLinkCache(): void {
  cache.clear();
}
