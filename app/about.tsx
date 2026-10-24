import React from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { Card, Icon, Logo, Screen, T } from '@/components/ui';
import { colors, space } from '@/constants/theme';

const POINTS: [string, string][] = [
  ['heart-outline', 'محتوى مناسب لعمرك (13 إلى 18 سنة)'],
  ['cellphone', 'متاح على الموبايل ويعمل بدون إنترنت'],
  ['shield-check-outline', 'آمن وسهل الاستخدام، بدون حسابات أو إعلانات'],
];

export default function About() {
  return (
    <Screen title="عن التطبيق">
      <View style={st.center}>
        <Logo size={110} />
        <T v="hero" center>Think Twice</T>
        <T v="title" center color={colors.primary}>ثانية تفكير</T>
        <T center color={colors.textSecondary}>فكر .. اختر .. اتخذ قرار أفضل</T>
      </View>
      <Card>
        <T>تطبيق واحد .. قسمين: مواقفك الاجتماعية .. ومواقفك الرقمية. هدفه إنك تاخد ثانية تفكير قبل ما تتكلم أو تنشر أو تتخذ قرار.</T>
      </Card>
      {POINTS.map(([icon, text]) => (
        <View key={text} style={st.row}><Icon name={icon} color={colors.primary} /><T style={st.flex}>{text}</T></View>
      ))}
      <T v="caption" center color={colors.muted}>{`الإصدار ${Constants.expoConfig?.version ?? '1.0.0'} • الخط: Cairo (SIL OFL) • الرسومات أصلية`}</T>
      <T v="heading" center color={colors.primary}>لأنك تستحق أن تختار ♡</T>
    </Screen>
  );
}

const st = StyleSheet.create({
  center: { alignItems: 'center', gap: space.xs },
  row: { flexDirection: 'row', gap: space.md, alignItems: 'center', paddingHorizontal: space.sm },
  flex: { flex: 1 },
});
