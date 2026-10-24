import React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Logo, Screen, T } from '@/components/ui';
import { colors, space } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';

/** Screen 1 — Home / quick introduction. */
export default function Home() {
  const { state } = useApp();
  const { width } = useWindowDimensions();
  const heroW = Math.min(width - 32, 480);
  const name = state.profile.name.trim();
  return (
    <Screen back={false} scroll footer={<Button label="ابدأ" onPress={() => router.push('/sections')} testID="start" />}>
      <View style={st.top}>
        <Logo size={120} />
        <T v="hero" center color={colors.text} style={st.en}>Think Twice</T>
        <T v="hero" center color={colors.primary}>ثانية تفكير</T>
        <T v="heading" center color={colors.textSecondary}>{name ? `أهلًا يا ${name}!` : 'فكر قبل أن تتحدث ..'}</T>
        <T center color={colors.textSecondary}>{name ? 'فكر قبل أن تتحدث .. أو تنشر .. أو تتخذ قرارًا.' : 'أو تنشر .. أو تتخذ قرارًا.'}</T>
      </View>
      <Image source={require('../assets/images/hero.png')} style={[st.hero, { width: heroW, height: (heroW * 520) / 720 }]} resizeMode="contain" accessibilityLabel="شاب يحمل حقيبة ينظر إلى المدينة" />
    </Screen>
  );
}

const st = StyleSheet.create({
  top: { alignItems: 'center', gap: space.xs, marginTop: space.lg },
  en: { fontSize: 32, lineHeight: 44 },
  hero: { borderRadius: 24, marginTop: space.md, alignSelf: 'center' },
});
