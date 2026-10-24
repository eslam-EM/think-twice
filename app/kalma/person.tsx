import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, ChoiceRow, Screen, T } from '@/components/ui';
import { persons, situations, type PersonId, type SituationId } from '@/data/content';
import { colors } from '@/constants/theme';

/** Screen 4 — choose the person to talk to. */
export default function KalmaPerson() {
  const { situation } = useLocalSearchParams<{ situation: SituationId }>();
  const [picked, setPicked] = useState<PersonId | null>(null);
  const valid = situations.some((s) => s.id === situation);
  return (
    <Screen title="مع مين عايز تتكلم؟" subtitle="اختر الشخص اللي تحس إنه آمن ويفهمك"
      footer={<Button label="التالي" disabled={!picked || !valid} testID="next"
        onPress={() => picked && router.push({ pathname: '/kalma/opener', params: { situation, person: picked } })} />}>
      {persons.map((p) => (
        <ChoiceRow key={p.id} label={p.title} avatar={p.avatar} icon={p.icon} selected={picked === p.id}
          onPress={() => setPicked(p.id)} testID={`person-${p.id}`} />
      ))}
      <T v="caption" color={colors.muted} center>اختار حد بتثق فيه ويقدر يسمعك ويساعدك.</T>
    </Screen>
  );
}
