import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Logo, Screen, T } from '@/components/ui';
import { SectionCard } from '@/components/SectionCard';
import { categories } from '@/data/content';
import { colors, space } from '@/constants/theme';

/** Screen 8 — ثانية تفكير home. */
export default function DigitalHome() {
  return (
    <Screen title="ثانية تفكير" subtitle="مواقف رقمية .. قرارات أذكى" back={false}>
      <View style={st.logo}><Logo size={84} /></View>
      {categories.map((c) => (
        <SectionCard key={c.id} title={c.title} kicker={c.subtitle} lines="" icon={c.icon}
          tint={c.tint === 'sky' ? colors.sky : colors.lavender} iconBg={c.tint === 'sky' ? colors.blue : colors.primary}
          onPress={() => router.push({ pathname: '/digital/[category]', params: { category: c.id } })} testID={`category-${c.id}`} />
      ))}
      <T v="caption" color={colors.muted} center>ثانية تفكير قبل ما تضغط «إرسال» أو «مشاركة» ممكن تفرق كتير.</T>
    </Screen>
  );
}

const st = StyleSheet.create({ logo: { alignItems: 'center', marginBottom: space.sm } });
