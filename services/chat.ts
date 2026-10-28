import { FALLBACK, topics, type ChatTopic } from '@/data/chat';

/** Arabic-friendly normalization: diacritics, alef/ya/ta-marbuta forms, elongations, punctuation. */
export function normalizeAr(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/(.)\1{2,}/g, '$1') // "ازيييك" → "ازيك"
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const words = (s: string) => s.split(' ').flatMap((w) => (w.startsWith('ال') && w.length > 3 ? [w, w.slice(2)] : [w]));

/** Score = sum of matched keyword lengths; short keywords (≤3 letters) must match a whole word. */
export function scoreTopic(text: string, topic: ChatTopic): number {
  const t = normalizeAr(text);
  const ws = new Set(words(t));
  let score = 0;
  for (const raw of topic.keywords) {
    const k = normalizeAr(raw);
    if (!k) continue;
    const hit = k.length <= 3 && !k.includes(' ') ? ws.has(k) : t.includes(k);
    if (hit) score += k.length;
  }
  return score;
}

export const FALLBACK_ID = 'fallback';

/** Picks the topic for a message. Safety topics (priority) win whenever they match at all. */
export function detectTopic(text: string): string {
  let best: { id: string; score: number; priority: number } | null = null;
  for (const topic of topics) {
    const score = scoreTopic(text, topic);
    if (score <= 0) continue;
    const priority = topic.priority ?? 0;
    if (!best || priority > best.priority || (priority === best.priority && score > best.score)) best = { id: topic.id, score, priority };
  }
  return best?.id ?? FALLBACK_ID;
}

export function repliesFor(topicId: string): string[] {
  return topicId === FALLBACK_ID ? FALLBACK : (topics.find((t) => t.id === topicId)?.replies ?? FALLBACK);
}

export function suggestionsFor(topicId: string): string[] {
  return topics.find((t) => t.id === topicId)?.suggestions ?? [];
}

/**
 * Next reply index for a topic: never repeats until every reply was shown,
 * and never shows the same reply twice in a row.
 */
export function nextReplyIndex(total: number, used: number[], rng: () => number = Math.random): number {
  const last = used[used.length - 1];
  let pool = Array.from({ length: total }, (_, i) => i).filter((i) => !used.includes(i));
  if (pool.length === 0) pool = Array.from({ length: total }, (_, i) => i).filter((i) => i !== last);
  if (pool.length === 0) return 0;
  return pool[Math.floor(rng() * pool.length)];
}
