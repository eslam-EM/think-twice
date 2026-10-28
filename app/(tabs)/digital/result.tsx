import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Icon, Screen, T } from '@/components/ui';
import { QUALITY_UI } from '@/components/quality';
import { scenarios, topics } from '@/data/content';
import { completedIds } from '@/services/progress';
import { useApp } from '@/hooks/useApp';
import { colors, space } from '@/constants/theme';

const TITLES = { best: 'إجابتك كانت ممتازة.', ok: 'إجابة كويسة، وفي أفضل منها.', avoid: 'خلّينا نفكر فيها تاني.' } as const;

/** Screen 11 — evaluation. */
export default function DigitalResult() {
  const { id, choice } = useLocalSearchParams<{ id: string; choice: string }>();
  const { state } = useApp();
  const sc = scenarios.find((s) => s.id === id);
  if (!sc) return <Screen title="التقييم"><T center>التحدي غير موجود.</T></Screen>;
  const o = sc.options[Number(choice)] ?? sc.options[0];
  const best = sc.options.find((x) => x.quality === 'best')!;
  const ui = QUALITY_UI[o.quality];

  const newChallenge = () => {
    const done = completedIds(state, 'digital');
    const cat = topics.find((t) => t.id === sc.topic)?.category;
    const sameCat = scenarios.filter((s) => s.id !== sc.id && topics.find((t) => t.id === s.topic)?.category === cat);
    const next = sameCat.find((s) => !done.has(s.id)) ?? scenarios.find((s) => !done.has(s.id) && s.id !== sc.id) ?? sameCat[0];
    router.replace({ pathname: '/digital/exercise', params: { id: next.id } });
  };

  return (
    <Screen title={TITLES[o.quality]} back={false}
      footer={<>
        <Button label="تحدي جديد" icon="refresh" onPress={newChallenge} testID="new-challenge" />
        <Button label="تحدياتك" variant="link" onPress={() => router.push('/progress')} testID="see-progress" />
      </>}>
      <Card style={[st.center, { backgroundColor: ui.bg, borderColor: 'transparent' }]}>
        <Icon name={ui.icon} size={64} color={ui.color} />
        <T v="heading" center testID="result-title" color={ui.color}>{ui.title}</T>
        <T center>{o.feedback}</T>
      </Card>
      {o.quality !== 'best' ? (
        <Card>
          <T v="heading">الاختيار الأفضل:</T>
          <T v="bodyStrong" color={colors.success}>{best.label}</T>
          <T color={colors.textSecondary}>{best.feedback}</T>
        </Card>
      ) : null}
      <View style={st.tip}>
        <Icon name="lightbulb-on-outline" color={colors.warning} />
        <T style={st.flex} color={colors.textSecondary}>{sc.tip}</T>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  center: { alignItems: 'center', gap: space.sm, paddingVertical: space.xl },
  tip: { flexDirection: 'row', gap: space.sm, backgroundColor: colors.warningBg, borderRadius: 16, padding: space.md, alignItems: 'flex-start' },
  flex: { flex: 1 },
});
