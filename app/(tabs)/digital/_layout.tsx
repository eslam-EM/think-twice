import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

/** Pages of this branch stack inside the tab, so the bottom bar stays visible. */
export default function Layout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_left' }} />;
}
