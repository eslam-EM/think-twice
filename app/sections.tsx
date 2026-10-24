import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, Screen, T } from '@/components/ui';
import { SectionCard } from '@/components/SectionCard';
import { colors, radius, space } from '@/constants/theme';
import { forwardChevron } from '@/constants/layout';

/** Screen 2 — choose a section. */
export default function Sections() {
  return (
    <Screen title="اختر القسم المناسب لك"
      right={<Pressable onPress={() => router.push('/settings')} accessibilityRole="button" accessibilityLabel="الإعدادات" hitSlop={10} testID="open-settings"><Icon name="cog-outline" color={colors.text} /></Pressable>}>
      <SectionCard title="كلمة بداية" kicker="للمواقف الاجتماعية" lines="تحدث .. اطلب المساعدة .. تواصل بشكل أفضل" icon="account-group"
        tint={colors.lavender} iconBg={colors.primary} onPress={() => router.push('/kalma')} testID="section-kalma" />
      <SectionCard title="ثانية تفكير" kicker="للمواقف الرقمية" lines="فكر .. تحقق .. لا تنشر بسرعة" icon="brain"
        tint={colors.sky} iconBg={colors.blue} onPress={() => router.push('/digital')} testID="section-digital" />
      <Pressable onPress={() => router.push('/progress')} accessibilityRole="button" accessibilityLabel="تحدياتك وتقدمك" style={st.progress} testID="open-progress">
        <Icon name="chart-donut" color={colors.primary} />
        <T v="bodyStrong" style={st.flex}>تحدياتك وتقدمك</T>
        <Icon name={forwardChevron} color={colors.muted} />
      </Pressable>
      <View style={st.note}>
        <Icon name="shield-check-outline" color={colors.success} size={18} />
        <T v="caption" color={colors.textSecondary} style={st.flex}>محتوى مناسب من 13 إلى 18 سنة، وكل بياناتك بتفضل على موبايلك.</T>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  flex: { flex: 1 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, borderRadius: radius.md, padding: space.lg, borderWidth: 1, borderColor: colors.border },
  note: { flexDirection: 'row', gap: space.sm, alignItems: 'center', paddingHorizontal: space.sm },
});
