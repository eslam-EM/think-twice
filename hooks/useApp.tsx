import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState as RNAppState } from 'react-native';
import { defaultState, recordAttempt, type AppState, type Attempt, type Profile } from '@/services/progress';
import { clear, load, save } from '@/services/storage';
import { setFeedbackPrefs } from '@/services/feedback';

interface Ctx {
  ready: boolean;
  state: AppState;
  record: (a: Omit<Attempt, 'at'>) => void;
  updateProfile: (p: Partial<Profile>) => void;
  reset: () => Promise<void>;
}
const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const ref = useRef(state);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    load().then((s) => { if (alive) { ref.current = s; setState(s); setReady(true); } });
    const sub = RNAppState.addEventListener('change', (st) => { if (st !== 'active') save(ref.current); });
    return () => { alive = false; sub.remove(); if (timer.current) clearTimeout(timer.current); };
  }, []);

  useEffect(() => setFeedbackPrefs({ sound: state.profile.sound, haptics: state.profile.haptics }), [state.profile.sound, state.profile.haptics]);

  const commit = useCallback((next: AppState) => {
    ref.current = next;
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save(ref.current), 200);
  }, []);

  const record = useCallback((a: Omit<Attempt, 'at'>) => commit(recordAttempt(ref.current, { ...a, at: new Date().toISOString() })), [commit]);
  const updateProfile = useCallback((p: Partial<Profile>) => commit({ ...ref.current, profile: { ...ref.current.profile, ...p } }), [commit]);
  const reset = useCallback(async () => {
    await clear();
    commit({ ...defaultState(), profile: ref.current.profile });
  }, [commit]);

  const value = useMemo(() => ({ ready, state, record, updateProfile, reset }), [ready, state, record, updateProfile, reset]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp outside provider');
  return c;
}
