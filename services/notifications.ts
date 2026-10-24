import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export type ReminderResult = 'enabled' | 'denied' | 'unsupported' | 'error';

const CHANNEL = 'thinktwice-reminders';

/**
 * Gentle, optional daily reminder (17:00 local time). No streaks, no pressure.
 * Permission is requested only when the student turns the setting on.
 */
export async function enableDailyReminder(): Promise<ReminderResult> {
  if (Platform.OS === 'web') return 'unsupported';
  try {
    const current = await Notifications.getPermissionsAsync();
    let granted = current.granted;
    if (!granted && current.canAskAgain) granted = (await Notifications.requestPermissionsAsync()).granted;
    if (!granted) return 'denied';
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL, { name: 'تذكير ثانية تفكير', importance: Notifications.AndroidImportance.DEFAULT });
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'ثانية تفكير', body: 'عندك دقيقة؟ جرّب تحدّي جديد وفكّر قبل ما ترد.' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 17, minute: 0, channelId: CHANNEL },
    });
    return 'enabled';
  } catch {
    return 'error';
  }
}

export async function disableDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);
}
