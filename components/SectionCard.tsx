import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, T } from '@/components/ui';
import { colors, radius, shadow, space } from '@/constants/theme';
import { forwardChevron } from '@/constants/layout';

/** Big tinted section card used on screens 2 and 8. */
export function SectionCard({ title, kicker, lines, icon, tint, iconBg, onPress, testID }: {
  title: string; kicker: string; lines: string; icon: string; tint: string; iconBg: string; onPress: () => void; testID?: string;
}) {
  return (
    <Pressable onPress={onPress} testID={testID} accessibilityRole="button" accessibilityLabel={`${title}، ${kicker}`}
      style={({ pressed }) => [st.card, { backgroundColor: tint }, pressed && { opacity: 0.9 }]}>
      <View style={[st.icon, { backgroundColor: iconBg }]}><Icon name={icon} size={30} color="#fff" /></View>
      <View style={st.flex}>
        <T v="title">{title}</T>
        <T v="bodyStrong" color={colors.textSecondary}>{kicker}</T>
        <T v="caption" color={colors.muted}>{lines}</T>
      </View>
      <Icon name={forwardChevron} color={colors.textSecondary} />
    </Pressable>
  );
}

const st = StyleSheet.create({
  flex: { flex: 1 },
  card: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderRadius: radius.lg, padding: space.lg, minHeight: 150, ...shadow },
  icon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
