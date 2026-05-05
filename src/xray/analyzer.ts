export interface HeadingInfo {
  level: number;
  text: string;
  line: number;
}

export interface AnalysisResult {
  charCount: number;
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  readingTimeMinutes: number;
  headings: HeadingInfo[];
  wordFrequency: Array<{ word: string; count: number }>;
  linkUrls: Array<{ url: string; line: number }>;
  lineCount: number;
}

export function analyzeDocument(text: string): AnalysisResult {
  const lines = text.split('\n');

  // Character count (exclude whitespace for CJK-friendly count)
  const charCount = text.replace(/\s/g, '').length;

  // Word count: CJK characters count individually, latin words by spaces
  const wordCount = countWords(text);

  // Sentence count
  const sentenceCount = countSentences(text);
  const avgSentenceLength = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

  // Reading time: CJK ~500 chars/min, Latin ~200 words/min
  const cjkChars = (text.match(/[\u3000-\u9fff\uac00-\ud7af]/g) || []).length;
  const latinWords = wordCount - cjkChars;
  const readingTimeMinutes = Math.max(1, Math.round((cjkChars / 500 + latinWords / 200) * 10) / 10);

  // Headings
  const headings: HeadingInfo[] = [];
  lines.forEach((line, idx) => {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].replace(/\s*#+\s*$/, '').trim(),
        line: idx,
      });
    }
  });

  // Word frequency (top 10, skip common words and markdown syntax)
  const wordFrequency = getWordFrequency(text);

  // Links
  const linkUrls: Array<{ url: string; line: number }> = [];
  const urlRegex = /https?:\/\/[^\s)>\]]+/g;
  lines.forEach((line, idx) => {
    let match;
    while ((match = urlRegex.exec(line)) !== null) {
      linkUrls.push({ url: match[0], line: idx });
    }
  });

  return {
    charCount,
    wordCount,
    sentenceCount,
    avgSentenceLength,
    readingTimeMinutes,
    headings,
    wordFrequency,
    linkUrls,
    lineCount: lines.length,
  };
}

function countWords(text: string): number {
  // Remove markdown syntax
  const cleaned = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~`>|]/g, '')
    .replace(/---+/g, '');

  // CJK characters count as individual words
  const cjkCount = (cleaned.match(/[\u3000-\u9fff\uac00-\ud7af]/g) || []).length;

  // Latin words
  const latin = cleaned.replace(/[\u3000-\u9fff\uac00-\ud7af]/g, ' ');
  const latinWords = latin.split(/\s+/).filter(w => w.length > 0).length;

  return cjkCount + latinWords;
}

function countSentences(text: string): number {
  // Remove code blocks
  const cleaned = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '');
  // Count sentence-ending punctuation
  const matches = cleaned.match(/[.!?。！？]\s/g);
  // Also count lines that end paragraphs
  const paragraphEnds = cleaned.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  return Math.max(matches ? matches.length : 0, paragraphEnds);
}

function getWordFrequency(text: string): Array<{ word: string; count: number }> {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet',
    'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same',
    'than', 'too', 'very', 'just', 'because', 'if', 'when', 'then',
    'that', 'this', 'these', 'those', 'it', 'its', 'my', 'your', 'his',
    'her', 'our', 'their', 'i', 'me', 'you', 'he', 'she', 'we', 'they',
    // Korean particles
    '은', '는', '이', '가', '을', '를', '의', '에', '에서', '로', '으로',
    '와', '과', '도', '만', '까지', '부터', '며', '고', '지만',
  ]);

  const cleaned = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[#*_~`>|[\]()!]/g, '')
    .replace(/---+/g, '');

  const freq: Record<string, number> = {};
  const words = cleaned.split(/\s+/).map(w => w.toLowerCase().replace(/[.,;:!?。，；：！？]/g, '')).filter(w => w.length > 1);

  for (const word of words) {
    if (stopWords.has(word)) { continue; }
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}
