import { detectTopic, nextReplyIndex, normalizeAr, repliesFor, FALLBACK_ID } from '@/services/chat';
import { QUICK_QUESTIONS, topics } from '@/data/chat';
import { genderize } from '@/data/content';

describe('chat topic detection', () => {
  const cases: [string, string][] = [
    ['السلام عليكم', 'greeting'],
    ['ازيييك', 'greeting'],
    ['اتخانقت مع ماما ومش عارف أكلمها', 'parents'],
    ['صاحبي زعلان مني', 'friends'],
    ['حد بيتريق عليا في الجروب', 'bullying'],
    ['شخص غريب بيكلمني وعايز صوري', 'stranger'],
    ['شفت خبر ومش متأكد منه', 'news'],
    ['حد بعتلي يقول كسبت جايزة وعايز الكود', 'scam'],
    ['شفت فيديو فيه تحدي خطير', 'harmful'],
    ['أنا متضايق ومتعصب', 'feelings'],
    ['عندي مشكلة في المدرسة', 'school'],
    ['اقترح عليا جملة أبدأ بيها', 'start-talk'],
    ['شكرًا', 'thanks'],
    ['انت مين؟', 'about'],
    ['قطة سودا طايرة', FALLBACK_ID],
  ];
  it.each(cases)('"%s" → %s', (text, topic) => expect(detectTopic(text)).toBe(topic));

  it('safety always wins, even mixed with other topics', () => {
    expect(detectTopic('حد في المدرسة بيهددني')).toBe('crisis');
    expect(detectTopic('أنا متضايق ونفسي أموت')).toBe('crisis');
    expect(detectTopic('حد غريب بيبتزني بصوري')).toBe('crisis');
  });

  it('short keywords do not match inside other words', () => {
    expect(detectTopic('خدمة عملاء')).toBe(FALLBACK_ID); // "دم" must not match inside "خدمه"
  });

  it('every quick question gets a real (non-fallback) topic', () => {
    for (const q of QUICK_QUESTIONS) expect(detectTopic(q)).not.toBe(FALLBACK_ID);
    for (const t of topics) for (const s of t.suggestions ?? []) expect(detectTopic(s)).not.toBe(FALLBACK_ID);
  });

  it('normalizes Arabic spelling variants', () => {
    expect(normalizeAr('إزّاي أبدأ؟')).toBe(normalizeAr('ازاي ابدا'));
  });
});

describe('reply bank', () => {
  it('main topics have about 10 replies, crisis replies all point to 16000', () => {
    for (const t of topics) expect(t.replies.length).toBeGreaterThanOrEqual(t.id === 'crisis' || t.id === 'about' ? 8 : 10);
    expect(topics.find((t) => t.id === 'crisis')!.replies.every((r) => r.includes('16000'))).toBe(true);
  });
  it('gender tokens resolve cleanly', () => {
    for (const t of topics) for (const r of t.replies) for (const g of ['m', 'f'] as const) expect(genderize(r, g)).not.toMatch(/[{}|]/);
  });
  it('"رد آخر" never repeats until all replies were shown, and never twice in a row', () => {
    const total = repliesFor('news').length;
    const used: number[] = [];
    for (let i = 0; i < total; i++) used.push(nextReplyIndex(total, used));
    expect(new Set(used).size).toBe(total);
    const after = nextReplyIndex(total, used);
    expect(after).not.toBe(used[used.length - 1]);
  });
});
