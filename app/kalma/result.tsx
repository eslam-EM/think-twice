import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Icon, Screen, T } from '@/components/ui';
import { alternatives, genderize, responseOptions, situations, type SituationId } from '@/data/content';
import { useApp } from '@/hooks/useApp';
import { colors, space } from '@/constants/theme';
import { QUALITY_UI } from '@/components/quality';

/** Screen 7 — why this choice (explanation + alternatives + new challenge). */
export default function KalmaResult() {
  const { situation, choice } = useLocalSearchParams<{ situation: SituationId; choice: string }>();
  const { state } = useApp();
  if (!situations.some((s) => s.id === situation)) return <Screen title="النتيجة"><T center>الموقف غير موجود.</T></Screen>;
  const options = responseOptions(situation);
  const opt = options.find((o) => o.id === choice) ?? options[0];
  const best = options.find((o) => o.quality === 'best')!;
  const ui = QUALITY_UI[opt.quality];
  return (
    <Screen title="ليه ده الاختيار الأفضل؟" back={false}
      footer={<>
        <Button label="تحدي جديد" icon="refresh" onPress={() => router.dismissTo('/kalma')} testID="new-challenge" />
        <Button label="تقدّمي" variant="link" onPress={() => router.push('/progress')} testID="see-progress" />
      </>}>
      <Card style={[st.center, { backgroundColor: ui.bg, borderColor: 'transparent' }]}>
        <Icon name={ui.icon} size={64} color={ui.color} />
        <T v="title" center color={ui.color} testID="result-title">{ui.title}</T>
        <T v="bodyStrong" center>اخترت: {opt.label}</T>
        <T center color={colors.textSecondary}>{opt.feedback}</T>
      </Card>
      {opt.quality !== 'best' ? (
        <Card>
          <T v="heading">الاختيار الأفضل هنا: {best.label}</T>
          <T color={colors.textSecondary}>{best.feedback}</T>
        </Card>
      ) : null}
      <Card style={{ backgroundColor: colors.successBg, borderColor: 'transparent' }}>
        <T v="heading" center>بدائل أخرى ممكنة</T>
        {alternatives[situation].map((a) => (
          <View key={a} style={st.alt}><Icon name="check-circle-outline" size={18} color={colors.success} /><T style={st.flex}>{genderize(a, state.profile.gender)}</T></View>
        ))}
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  center: { alignItems: 'center', gap: space.sm, paddingVertical: space.xl },
  alt: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  flex: { flex: 1 },
});
