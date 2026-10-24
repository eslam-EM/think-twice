import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Card, Icon, Screen, T } from '@/components/ui';
import { colors, space } from '@/constants/theme';
import { genderize } from '@/data/content';
import { useApp } from '@/hooks/useApp';

const FAQ: [string, string][] = [
  ['التطبيق ده بيعمل إيه؟', 'بيساعدك تفكر ثانية قبل ما تتكلم أو ترد أو تنشر، من خلال مواقف حقيقية واختيارات وشرح لكل اختيار.'],
  ['إيه الفرق بين القسمين؟', '«كلمة بداية» للمواقف مع الناس حواليك، و«ثانية تفكير» للمواقف على الموبايل والنت.'],
  ['هل في إجابات غلط؟', 'في اختيارات أحسن من غيرها. الهدف إنك تفهم النتيجة، مش إنك تتعاقب على اختيار.'],
  ['هل بياناتي بتتبعت لحد؟', 'لا. كل حاجة بتتحفظ على موبايلك بس، والتطبيق شغال من غير إنترنت ومن غير حساب.'],
];

export default function Help() {
  const { state } = useApp();
  return (
    <Screen title="المساعدة">
      {FAQ.map(([q, a]) => (
        <Card key={q}><T v="heading">{q}</T><T color={colors.textSecondary}>{a}</T></Card>
      ))}
      <Card style={{ backgroundColor: colors.errorBg, borderColor: 'transparent' }}>
        <View style={st.row}><Icon name="phone-in-talk-outline" color={colors.error} /><T v="heading" style={st.flex}>{genderize('لو {حاسس|حاسة} بخطر أو {محتاج|محتاجة} مساعدة فورًا', state.profile.gender)}</T></View>
        <T color={colors.textSecondary}>كلّم شخص كبير بتثق فيه حالًا. وفي مصر تقدر تكلم خط نجدة الطفل مجانًا على 16000.</T>
        <T v="bodyStrong" color={colors.error} onPress={() => Linking.openURL('tel:16000').catch(() => undefined)} accessibilityRole="link">اتصل بـ 16000</T>
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space.sm }, flex: { flex: 1 } });
