import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultState, sanitize, type AppState } from './progress';

export const KEY = 'thinktwice:state';

export async function load(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultState();
    try { return sanitize(JSON.parse(raw)); } catch { return defaultState(); }
  } catch {
    return defaultState();
  }
}

export async function save(s: AppState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => undefined);
}

export async function clear(): Promise<void> {
  await AsyncStorage.removeItem(KEY).catch(() => undefined);
}
