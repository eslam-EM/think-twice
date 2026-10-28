import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, ChoiceRow, Logo, Screen, T } from '@/components/ui';
import { scenarios } from '@/data/content';
import { useApp } from '@/hooks/useApp';
import { feedback } from '@/services/feedback';
import { colors, space } from '@/constants/theme';

/** Screen 10 — thinking exercise: read the situation, think, then choose. */
export default function Exercise() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sc = scenarios.find((s) => s.id === id);
  const { record } = useApp();
  const [started, setStarted] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const submitted = useRef(false);
  if (!sc) return <Screen title="فكر قبل الرد"><T center>التحدي غير موجود.</T></Screen>;

  const submit = () => {
    if (picked === null || submitted.current) return;
    submitted.current = true;
    const o = sc.options[picked];
    record({ id: sc.id, section: 'digital', choice: String(picked), quality: o.quality });
    feedback(o.quality === 'avoid' ? 'wrong' : 'correct');
    router.replace({ pathname: '/digital/result', params: { id: sc.id, choice: String(picked) } });
  };

  return (
    <Screen title="فكر قبل الرد"
      footer={started
        ? <Button label="التالي" disabled={picked === null} onPress={submit} testID="next" />
        : <Button label="ابدأ" onPress={() => setStarted(true)} testID="begin" />}>
      <Card style={st.center}>
        <Logo size={64} />
        <T v="bodyStrong" center color={colors.textSecondary} testID="situation">{sc.situation}</T>
        <T v="title" center testID="question">{sc.question}</T>
      </Card>
      {started ? (
        <View style={st.gap}>
          {sc.options.map((o, i) => (
            <ChoiceRow key={o.label} label={o.label} selected={picked === i} onPress={() => setPicked(i)} testID={`option-${i}`} />
          ))}
        </View>
      ) : <T v="caption" color={colors.muted} center>خد ثانية وفكّر: إيه اللي ممكن يحصل بعد ما تتصرف؟</T>}
    </Screen>
  );
}

const st = StyleSheet.create({
  center: { alignItems: 'center', gap: space.md, paddingVertical: space.xl },
  gap: { gap: space.md },
});
