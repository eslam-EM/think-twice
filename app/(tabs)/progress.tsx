import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card, Icon, Screen, T } from '@/components/ui';
import { TOTAL_DIGITAL, TOTAL_KALMA } from '@/data/content';
import { bestIds, completedIds, goalFor } from '@/services/progress';
import { useApp } from '@/hooks/useApp';
import { colors, radius, space } from '@/constants/theme';

function Ring({ value, max, size = 170 }: { value: number; max: number; size?: number }) {
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const pct = max ? Math.min(1, value / max) : 0;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessibilityRole="progressbar" accessibilityValue={{ min: 0, max, now: value }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.lavender} strokeWidth={14} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.blue} strokeWidth={14} fill="none" strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      <T v="hero" testID="ring-value">{`${value}/${max}`}</T>
    </View>
  );
}

/** Screen 12 — challenges & progress. Counts distinct challenges, so repeating one doesn't inflate progress. */
export default function Progress() {
  const { state } = useApp();
  const [tab, setTab] = useState<'kalma' | 'digital'>('digital');
  const done = completedIds(state, tab).size;
  const best = bestIds(state, tab).size;
  const total = tab === 'kalma' ? TOTAL_KALMA : TOTAL_DIGITAL;
  const goal = goalFor(done, total);
  const shown = Math.min(done, goal);
  const lit = Math.round((shown / goal) * 5);
  return (
    <Screen title="تحدياتك" back={false}>
      <View style={st.tabs}>
        {([['kalma', 'كلمة بداية'], ['digital', 'ثانية تفكير']] as const).map(([id, label]) => (
          <Pressable key={id} onPress={() => setTab(id)} style={[st.tab, tab === id && st.tabOn]} accessibilityRole="tab" accessibilityState={{ selected: tab === id }} testID={`ptab-${id}`}>
            <T v="bodyStrong" center color={tab === id ? '#fff' : colors.textSecondary}>{label}</T>
          </Pressable>
        ))}
      </View>
      <Card style={st.center}>
        <Ring value={shown} max={goal} />
        <T v="bodyStrong" center testID="progress-text">{`لقد أكملت ${shown} من ${goal} تحديات`}</T>
        <View style={st.flames} accessibilityLabel={`${lit} من 5`}>
          {Array.from({ length: 5 }, (_, i) => <Icon key={i} name="fire" size={30} color={i < lit ? colors.flame : colors.lavenderStrong} />)}
        </View>
      </Card>
      <View style={st.stats}>
        <Card style={st.stat}><T v="title" center color={colors.success}>{best}</T><T v="caption" center>اختيارات ممتازة</T></Card>
        <Card style={st.stat}><T v="title" center color={colors.primary}>{`${done}/${total}`}</T><T v="caption" center>كل التحديات</T></Card>
      </View>
      <Card style={{ backgroundColor: colors.lavender, borderColor: 'transparent' }}>
        <T center color={colors.textSecondary}>{done === 0 ? 'ابدأ أول تحدي وشوف تقدّمك هنا!' : 'كل خطوة صغيرة هي تقدم كبير ♡'}</T>
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  tabs: { flexDirection: 'row', backgroundColor: colors.lavender, borderRadius: radius.pill, padding: 4 },
  tab: { flex: 1, borderRadius: radius.pill, paddingVertical: space.sm, minHeight: 44, justifyContent: 'center' },
  tabOn: { backgroundColor: colors.primary },
  center: { alignItems: 'center', gap: space.md, paddingVertical: space.xl },
  flames: { flexDirection: 'row', gap: space.sm },
  stats: { flexDirection: 'row', gap: space.md },
  stat: { flex: 1, alignItems: 'center' },
});
