import fs from 'fs';
import path from 'path';
import { alternatives, genderize, openers, persons, responseOptions, scenarios, situations, topics, categories, TOTAL_KALMA } from '@/data/content';
import { bestIds, completedIds, defaultState, goalFor, recordAttempt, sanitize } from '@/services/progress';

describe('content', () => {
  it('has an opener for every situation × person', () => {
    for (const s of situations) for (const p of persons) expect(openers[s.id][p.id].length).toBeGreaterThan(20);
    expect(TOTAL_KALMA).toBe(20);
  });
  it('genderizes first-person words', () => {
    expect(genderize('أنا {محتاج|محتاجة} مساعدة', 'm')).toBe('أنا محتاج مساعدة');
    expect(genderize('أنا {محتاج|محتاجة} مساعدة', 'f')).toBe('أنا محتاجة مساعدة');
    for (const s of situations) for (const p of persons) {
      expect(genderize(openers[s.id][p.id], 'f')).not.toMatch(/[{}|]/);
      expect(genderize(openers[s.id][p.id], 'm')).not.toMatch(/[{}|]/);
    }
    for (const list of Object.values(alternatives)) for (const a of list) expect(genderize(a, 'f')).not.toMatch(/[{}|]/);
  });
  it('every response set has exactly one best answer', () => {
    for (const s of situations) expect(responseOptions(s.id).filter((o) => o.quality === 'best')).toHaveLength(1);
    expect(responseOptions('help').find((o) => o.quality === 'best')?.id).toBe('help');
    expect(responseOptions('conflict').find((o) => o.quality === 'best')?.id).toBe('kind');
  });
  it('every digital scenario is valid, has one best answer and a known topic', () => {
    expect(new Set(scenarios.map((s) => s.id)).size).toBe(scenarios.length);
    for (const sc of scenarios) {
      expect(topics.some((t) => t.id === sc.topic)).toBe(true);
      expect(sc.options.filter((o) => o.quality === 'best')).toHaveLength(1);
      expect(sc.options.length).toBeGreaterThanOrEqual(3);
    }
    for (const t of topics) {
      expect(categories.some((c) => c.id === t.category)).toBe(true);
      expect(scenarios.filter((s) => s.topic === t.id).length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('progress', () => {
  it('counts distinct challenges (repeats do not inflate progress)', () => {
    let s = defaultState();
    const a = { id: 'scam-1', section: 'digital' as const, choice: '1', quality: 'best' as const, at: 'x' };
    s = recordAttempt(recordAttempt(s, a), a);
    s = recordAttempt(s, { ...a, id: 'scam-2', quality: 'avoid' });
    expect(completedIds(s, 'digital').size).toBe(2);
    expect(bestIds(s, 'digital').size).toBe(1);
    expect(completedIds(s, 'kalma').size).toBe(0);
  });
  it('goal grows in steps of 5, capped at the total', () => {
    expect(goalFor(0, 12)).toBe(5);
    expect(goalFor(4, 12)).toBe(5);
    expect(goalFor(5, 12)).toBe(10);
    expect(goalFor(11, 12)).toBe(12);
    expect(goalFor(12, 12)).toBe(12);
  });
  it('sanitizes corrupt storage safely', () => {
    expect(sanitize('garbage')).toEqual(defaultState());
    const s = sanitize({ profile: { name: 5, gender: 'x' }, attempts: [{ id: 'a' }, { id: 'b', section: 'kalma', choice: 'kind', quality: 'best', at: 'now' }] });
    expect(s.profile.name).toBe('');
    expect(s.profile.gender).toBe('m');
    expect(s.attempts).toHaveLength(1);
  });
});

describe('assets', () => {
  it('every required image exists', () => {
    const root = path.resolve(__dirname, '..');
    const files: string[] = [];
    const walk = (d: string) => { for (const f of fs.readdirSync(d)) { if (['node_modules', 'android', 'dist', '.expo'].includes(f)) continue; const full = path.join(d, f); if (fs.statSync(full).isDirectory()) walk(full); else if (/\.tsx?$/.test(f)) files.push(full); } };
    walk(root);
    let n = 0;
    for (const f of files) for (const m of fs.readFileSync(f, 'utf8').matchAll(/require\(['"](\.{1,2}\/[^'"]+\.(png|wav))['"]\)/g)) { n++; expect(fs.existsSync(path.resolve(path.dirname(f), m[1]))).toBe(true); }
    expect(n).toBeGreaterThan(5);
    const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
    for (const p of [app.icon, app.android.adaptiveIcon.foregroundImage, app.android.adaptiveIcon.monochromeImage]) expect(fs.existsSync(path.join(root, p))).toBe(true);
    expect(app.android.package).toBe('com.thinktwice.app');
  });
  it('all icon names exist in the bundled icon font', () => {
    const glyphs = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json');
    const root = path.resolve(__dirname, '..');
    const used = new Set<string>(['arrow-right', 'arrow-left', 'chevron-left', 'chevron-right']);
    const dirs = ['app', 'components', 'data'];
    const walk = (d: string): string[] => fs.readdirSync(d).flatMap((f) => { const full = path.join(d, f); return fs.statSync(full).isDirectory() ? walk(full) : [full]; });
    for (const f of dirs.flatMap((d) => walk(path.join(root, d)))) {
      const src = fs.readFileSync(f, 'utf8');
      for (const re of [/\bicon[=:]\s*["']([a-z0-9-]+)["']/g, /<Icon name="([a-z0-9-]+)"/g, /\['([a-z-]+)', '[؀-ۿ]/g, /\bicon: '([a-z0-9-]+)'/g])
        for (const m of src.matchAll(re)) used.add(m[1]);
    }
    const notIcons = new Set(['kalma', 'digital', 'm', 'f']); // tab and gender ids that share the tuple pattern
    expect([...used].filter((n) => !notIcons.has(n) && !(n in glyphs))).toEqual([]);
    expect(used.size).toBeGreaterThan(25);
  });
});
