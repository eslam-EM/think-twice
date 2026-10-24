import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { OptionRow, Screen, T } from '@/components/ui';
import { categories, scenarios, topics, type CategoryId } from '@/data/content';
import { completedIds } from '@/services/progress';
import { useApp } from '@/hooks/useApp';
import { colors } from '@/constants/theme';

/** Screen 9 — choose the situation. */
export default function DigitalTopics() {
  const { category } = useLocalSearchParams<{ category: CategoryId }>();
  const { state } = useApp();
  const cat = categories.find((c) => c.id === category);
  if (!cat) return <Screen title="اختر الموقف"><T center>القسم غير موجود.</T></Screen>;
  const done = completedIds(state, 'digital');
  return (
    <Screen title="اختر الموقف" subtitle={cat.title}>
      {topics.filter((t) => t.category === category).map((t) => {
        const list = scenarios.filter((s) => s.topic === t.id);
        const finished = list.filter((s) => done.has(s.id)).length;
        const next = list.find((s) => !done.has(s.id)) ?? list[0];
        return (
          <OptionRow key={t.id} label={t.title} icon={t.icon} iconColor={t.color} testID={`topic-${t.id}`}
            sub={finished ? `أنجزت ${finished} من ${list.length}` : `عدد التحديات: ${list.length}`}
            onPress={() => router.push({ pathname: '/digital/exercise', params: { id: next.id } })} />
        );
      })}
      <T v="caption" color={colors.muted} center>كل موقف فيه أكتر من تحدي. جرّبها كلها!</T>
    </Screen>
  );
}
