import { AnalysisResult } from './analyzer';

export interface ReadabilityScore {
  score: number;       // 0-100
  grade: string;       // "Easy", "Medium", "Hard"
  description: string;
}

/**
 * Calculate a simplified readability score based on:
 * - Average sentence length (shorter = easier)
 * - Word complexity (longer words = harder)
 * - Heading structure (well-structured = easier to read)
 */
export function calculateReadability(analysis: AnalysisResult, text: string): ReadabilityScore {
  let score = 100;

  // Penalty for long sentences (ideal: 10-20 words)
  if (analysis.avgSentenceLength > 25) {
    score -= Math.min(30, (analysis.avgSentenceLength - 25) * 2);
  } else if (analysis.avgSentenceLength > 20) {
    score -= (analysis.avgSentenceLength - 20) * 1;
  }

  // Penalty for lack of headings (expect ~1 heading per 300 words)
  const expectedHeadings = Math.floor(analysis.wordCount / 300);
  if (analysis.headings.length < expectedHeadings && expectedHeadings > 0) {
    score -= Math.min(20, (expectedHeadings - analysis.headings.length) * 5);
  }

  // Penalty for long words
  const longWordRatio = countLongWords(text) / Math.max(1, analysis.wordCount);
  if (longWordRatio > 0.3) {
    score -= Math.min(20, (longWordRatio - 0.3) * 100);
  }

  // Bonus for using lists, code blocks, tables (visual variety)
  const hasList = /^[-*+]\s|^\d+\.\s/m.test(text);
  const hasCode = /```/.test(text);
  const hasTable = /\|.*\|/.test(text);
  const variety = [hasList, hasCode, hasTable].filter(Boolean).length;
  score += variety * 3;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let grade: string;
  let description: string;

  if (score >= 70) {
    grade = 'Easy';
    description = '읽기 쉬운 문서입니다.';
  } else if (score >= 40) {
    grade = 'Medium';
    description = '보통 수준의 가독성입니다.';
  } else {
    grade = 'Hard';
    description = '문장을 짧게 나누거나 헤딩을 추가해 보세요.';
  }

  return { score, grade, description };
}

function countLongWords(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/https?:\/\/[^\s]+/g, '');

  const words = cleaned.split(/\s+/).filter(w => /^[a-zA-Z]+$/.test(w));
  return words.filter(w => w.length > 10).length;
}
