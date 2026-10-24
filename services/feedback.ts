import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

/** Sound + haptic feedback honouring the student's preferences. */
const prefs = { sound: true, haptics: true };
export function setFeedbackPrefs(p: { sound: boolean; haptics: boolean }) { prefs.sound = p.sound; prefs.haptics = p.haptics; }

type SoundKind = 'correct' | 'wrong' | 'celebrate' | 'tap';
const SOURCES: Record<SoundKind, number> = {
  correct: require('../assets/sounds/correct.wav'),
  wrong: require('../assets/sounds/wrong.wav'),
  celebrate: require('../assets/sounds/celebrate.wav'),
  tap: require('../assets/sounds/tap.wav'),
};
const players: Partial<Record<SoundKind, AudioPlayer>> = {};

export function playSound(kind: SoundKind) {
  if (!prefs.sound) return;
  try {
    let p = players[kind];
    if (!p) { p = createAudioPlayer(SOURCES[kind]); p.volume = 0.6; players[kind] = p; }
    p.seekTo(0).catch(() => undefined);
    p.play();
  } catch {
    // Audio is optional — never let it break the experience.
  }
}

export function haptic(kind: 'light' | 'success' | 'error' = 'light') {
  if (!prefs.haptics || Platform.OS === 'web') return;
  try {
    if (kind === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    else Haptics.notificationAsync(kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => undefined);
  } catch {
    /* ignore */
  }
}

export function feedback(kind: 'correct' | 'wrong' | 'celebrate') {
  playSound(kind);
  haptic(kind === 'wrong' ? 'error' : 'success');
}
