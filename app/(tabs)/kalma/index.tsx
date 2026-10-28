import React from 'react';
import { router } from 'expo-router';
import { OptionRow, Screen, T } from '@/components/ui';
import { situations } from '@/data/content';
import { colors } from '@/constants/theme';

/** Screen 3 — كلمة بداية: situation type. */
export default function KalmaSituations() {
  return (
    <Screen title="كلمة بداية" subtitle="ما نوع الموقف اللي بتواجهه؟" back={false}>
      <T color={colors.textSecondary} center>اختار الموقف، وهنساعدك تلاقي أول كلمة تبدأ بيها الكلام.</T>
      {situations.map((s) => (
        <OptionRow key={s.id} label={s.title} icon={s.icon} testID={`situation-${s.id}`}
          onPress={() => router.push({ pathname: '/kalma/person', params: { situation: s.id } })} />
      ))}
    </Screen>
  );
}
