import type { Gender, Quality } from '@/data/content';

/** Persisted state (versioned) and pure helpers. UI never touches storage directly. */
export const SCHEMA_VERSION = 1;

export interface Attempt { id: string; section: 'kalma' | 'digital'; choice: string; quality: Quality; at: string }
export interface Profile { name: string; gender: Gender; sound: boolean; haptics: boolean; reminder: boolean }
export interface AppState { schemaVersion: number; profile: Profile; attempts: Attempt[] }

export const defaultState = (): AppState => ({
  schemaVersion: SCHEMA_VERSION,
  profile: { name: '', gender: 'm', sound: true, haptics: true, reminder: false },
  attempts: [],
});

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Coerces any stored value (possibly corrupt or from an older version) into a valid state. */
export function sanitize(raw: unknown): AppState {
  const d = defaultState();
  if (!isObj(raw)) return d;
  const p = isObj(raw.profile) ? raw.profile : {};
  const attempts = Array.isArray(raw.attempts) ? raw.attempts : [];
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: {
      name: typeof p.name === 'string' ? p.name.slice(0, 30) : '',
      gender: p.gender === 'f' ? 'f' : 'm',
      sound: typeof p.sound === 'boolean' ? p.sound : true,
      haptics: typeof p.haptics === 'boolean' ? p.haptics : true,
      reminder: typeof p.reminder === 'boolean' ? p.reminder : false,
    },
    attempts: attempts.filter((a): a is Attempt => isObj(a) && typeof a.id === 'string' && (a.section === 'kalma' || a.section === 'digital')
      && typeof a.choice === 'string' && (a.quality === 'best' || a.quality === 'ok' || a.quality === 'avoid') && typeof a.at === 'string').slice(-500),
  };
}

export function recordAttempt(s: AppState, a: Attempt): AppState {
  return { ...s, attempts: [...s.attempts, a].slice(-500) };
}

/** Distinct challenges completed in a section (repeating one doesn't inflate progress). */
export function completedIds(s: AppState, section: Attempt['section']): Set<string> {
  return new Set(s.attempts.filter((a) => a.section === section).map((a) => a.id));
}

/** Distinct challenges where the best choice was picked at least once. */
export function bestIds(s: AppState, section: Attempt['section']): Set<string> {
  return new Set(s.attempts.filter((a) => a.section === section && a.quality === 'best').map((a) => a.id));
}

/** Goals grow in steps of 5 up to the total number of challenges. */
export function goalFor(done: number, total: number): number {
  return Math.min(total, Math.max(5, Math.ceil((done + 1) / 5) * 5));
}
