import React, { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, ChoiceRow, Screen, T } from '@/components/ui';
import { kalmaId, responseOptions, situations, type PersonId, type SituationId } from '@/data/content';
import { useApp } from '@/hooks/useApp';
import { feedback } from '@/services/feedback';
import { colors } from '@/constants/theme';

/** Screen 6 — choose a response. */
export default function KalmaChoice() {
  const { situation, person } = useLocalSearchParams<{ situation: SituationId; person: PersonId }>();
  const { record } = useApp();
  const [picked, setPicked] = useState<string | null>(null);
  const submitted = useRef(false);
  if (!situations.some((s) => s.id === situation)) return <Screen title="اختر استجابتك"><T center>الموقف غير موجود.</T></Screen>;
  const options = responseOptions(situation);

  const submit = () => {
    const opt = options.find((o) => o.id === picked);
    if (!opt || submitted.current) return; // record once
    submitted.current = true;
    record({ id: kalmaId(situation, person), section: 'kalma', choice: opt.id, quality: opt.quality });
    feedback(opt.quality === 'avoid' ? 'wrong' : 'correct');
    router.replace({ pathname: '/kalma/result', params: { situation, person, choice: opt.id } });
  };

  return (
    <Screen title="اختر استجابتك" subtitle="في الموقف ده، إيه الأفضل؟"
      footer={<Button label="التالي" disabled={!picked} onPress={submit} testID="next" />}>
      {options.map((o) => (
        <ChoiceRow key={o.id} label={o.label} icon={o.icon} selected={picked === o.id} onPress={() => setPicked(o.id)} testID={`choice-${o.id}`} />
      ))}
      <T v="caption" color={colors.muted} center>مفيش إجابة «عيب»، الهدف إنك تفكر في النتيجة قبل ما تتصرف.</T>
    </Screen>
  );
}
