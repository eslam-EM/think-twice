import React from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { Card, Icon, Logo, Screen, T } from '@/components/ui';
import { SectionCard } from '@/components/SectionCard';
import { useApp } from '@/hooks/useApp';
import { completedIds } from '@/services/progress';
import { TOTAL_DIGITAL, TOTAL_KALMA } from '@/data/content';
import { colors, radius, space } from '@/constants/theme';
import { forwardChevron } from '@/constants/layout';

/** Home branch — quick intro + shortcuts to the other branches and the chat. */
export default function Home() {
  const { state } = useApp();
  const { width } = useWindowDimensions();
  const heroW = Math.min(width - 32, 480);
  const name = state.profile.name.trim();
  const done = completedIds(state, 'kalma').size + completedIds(state, 'digital').size;

  return (
    <Screen back={false}
      right={<Pressable onPress={() => router.push('/settings')} accessibilityRole="button" accessibilityLabel="الإعدادات" hitSlop={10} testID="open-settings"><Icon name="cog-outline" color={colors.text} /></Pressable>}>
      <View style={st.brand}>
        <Logo size={72} />
        <View style={st.flex}>
          <T v="title">Think Twice</T>
          <T v="heading" color={colors.primary}>ثانية تفكير</T>
        </View>
      </View>
      <T v="heading" color={colors.textSecondary} testID="greeting">{name ? `أهلًا يا ${name}!` : 'أهلًا بيك!'} فكر قبل أن تتحدث .. أو تنشر .. أو تتخذ قرارًا.</T>
      <Image source={require('../../assets/images/hero.png')} style={[st.hero, { width: heroW, height: (heroW * 520) / 720 }]} resizeMode="contain" accessibilityLabel="شاب يحمل حقيبة ينظر إلى المدينة" />

      <SectionCard title="كلمة بداية" kicker="للمواقف الاجتماعية" lines="تحدث .. اطلب المساعدة .. تواصل بشكل أفضل" icon="account-group"
        tint={colors.lavender} iconBg={colors.primary} onPress={() => router.navigate('/kalma')} testID="home-kalma" />
      <SectionCard title="ثانية تفكير" kicker="للمواقف الرقمية" lines="فكر .. تحقق .. لا تنشر بسرعة" icon="brain"
        tint={colors.sky} iconBg={colors.blue} onPress={() => router.navigate('/digital')} testID="home-digital" />

      <Pressable onPress={() => router.push('/chat')} accessibilityRole="button" accessibilityLabel="افتح الشات" style={st.chat} testID="home-chat">
        <View style={st.chatIcon}><Icon name="keyboard-outline" size={26} color="#fff" /></View>
        <View style={st.flex}>
          <T v="heading" color="#fff">عندك سؤال؟ اكتبه في الشات</T>
          <T v="caption" color="#E9E6FF">ردود سريعة على طول، ولو الرد ما عجبكش دوس «رد آخر».</T>
        </View>
        <Icon name={forwardChevron} color="#fff" />
      </Pressable>

      <Card>
        <View style={st.row}>
          <Icon name="chart-donut" />
          <T v="bodyStrong" style={st.flex}>تقدّمك</T>
          <T v="bodyStrong" color={colors.primary} testID="home-progress">{`${done} / ${TOTAL_KALMA + TOTAL_DIGITAL}`}</T>
        </View>
        <T v="caption" color={colors.textSecondary}>{done ? 'كل خطوة صغيرة هي تقدم كبير ♡' : 'ابدأ أول تحدي من أي فرع تحت.'}</T>
      </Card>
      <View style={st.note}>
        <Icon name="shield-check-outline" color={colors.success} size={18} />
        <T v="caption" color={colors.textSecondary} style={st.flex}>مناسب من 13 إلى 18 سنة، وكل بياناتك بتفضل على موبايلك.</T>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  flex: { flex: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  hero: { borderRadius: 24, alignSelf: 'center' },
  chat: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.primary, borderRadius: radius.lg, padding: space.lg },
  chatIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  note: { flexDirection: 'row', gap: space.sm, alignItems: 'center', paddingHorizontal: space.sm },
});
