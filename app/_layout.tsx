import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, Cairo_900Black } from '@expo-google-fonts/cairo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '@/hooks/useApp';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
}

function Root() {
  const { ready } = useApp();
  const [fonts, err] = useFonts({ Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, Cairo_900Black, ...MaterialCommunityIcons.font });
  const loaded = ready && (fonts || !!err);
  useEffect(() => { if (loaded) SplashScreen.hideAsync().catch(() => undefined); }, [loaded]);
  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_left' }} />;
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppProvider><Root /></AppProvider>
    </SafeAreaProvider>
  );
}
