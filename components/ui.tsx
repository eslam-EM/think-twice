import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type TextProps, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, minTouch, radius, shadow, space, type, type TypeVariant } from '@/constants/theme';
import { backIcon, forwardChevron } from '@/constants/layout';
import { haptic } from '@/services/feedback';

export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
export const Icon = ({ name, size = 22, color = colors.primary }: { name: string; size?: number; color?: string }) =>
  <MaterialCommunityIcons name={name as IconName} size={size} color={color} />;

export function T({ v = 'body', color = colors.text, center, style, ...rest }: TextProps & { v?: TypeVariant; color?: string; center?: boolean }) {
  return <Text maxFontSizeMultiplier={1.4} {...rest} style={[type[v], { color }, center ? { textAlign: 'center' } : { writingDirection: 'rtl' }, style]} />;
}

const LOGO = require('../assets/images/logo.png');
export const Logo = ({ size = 64 }: { size?: number }) => <Image source={LOGO} style={{ width: size, height: size }} resizeMode="contain" accessibilityLabel="شعار ثانية تفكير" />;

export function Screen({ title, subtitle, children, back = true, right, scroll = true, footer, edges = ['top', 'bottom'] }: {
  title?: string; subtitle?: string; children: React.ReactNode; back?: boolean; right?: React.ReactNode; scroll?: boolean; footer?: React.ReactNode; edges?: Edge[];
}) {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={s.root}>
      <StatusBar style="dark" />
      <LinearGradient colors={['#FFFFFF', colors.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={s.root} edges={edges}>
        {title || back || right ? (
          <View style={s.header}>
            {back ? (
              <Pressable onPress={goBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="رجوع" style={s.headerBtn} testID="back">
                <Icon name={backIcon} color={colors.text} />
              </Pressable>
            ) : <View style={s.headerBtn} />}
            <View style={s.headerTitle}>
              {title ? <T v="title" center accessibilityRole="header" numberOfLines={1}>{title}</T> : null}
              {subtitle ? <T v="caption" color={colors.textSecondary} center>{subtitle}</T> : null}
            </View>
            <View style={s.headerBtn}>{right}</View>
          </View>
        ) : null}
        {scroll ? <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{children}</ScrollView>
          : <View style={[s.content, s.root]}>{children}</View>}
        {footer ? <View style={s.footer}>{footer}</View> : null}
      </SafeAreaView>
    </View>
  );
}

export function Button({ label, onPress, variant = 'primary', icon, disabled, testID, style }: {
  label: string; onPress: () => void; variant?: 'primary' | 'link' | 'soft'; icon?: string; disabled?: boolean; testID?: string; style?: StyleProp<ViewStyle>;
}) {
  if (variant === 'link') {
    return (
      <Pressable onPress={onPress} testID={testID} accessibilityRole="button" accessibilityLabel={label} hitSlop={8} style={[s.link, style]}>
        <T v="bodyStrong" color={colors.primary} center style={s.underline}>{label}</T>
      </Pressable>
    );
  }
  const primary = variant === 'primary';
  return (
    <Pressable testID={testID} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }}
      onPress={() => { haptic('light'); onPress(); }}
      style={({ pressed }) => [s.btn, primary ? s.btnPrimary : s.btnSoft, disabled && { opacity: 0.45 }, pressed && { opacity: 0.85 }, style]}>
      {icon ? <Icon name={icon} size={20} color={primary ? '#fff' : colors.primary} /> : null}
      <T v="heading" color={primary ? '#fff' : colors.primary} center>{label}</T>
    </Pressable>
  );
}

export function Card({ children, style, tint }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tint?: string }) {
  return <View style={[s.card, tint ? { backgroundColor: tint, borderColor: 'transparent' } : null, style]}>{children}</View>;
}

/** List row: icon bubble (start) · label · chevron (end). */
export function OptionRow({ label, sub, icon, iconColor = colors.primary, avatar, onPress, testID }: {
  label: string; sub?: string; icon?: string; iconColor?: string; avatar?: number; onPress: () => void; testID?: string;
}) {
  return (
    <Pressable onPress={onPress} testID={testID} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => [s.row, pressed && { backgroundColor: colors.lavender }]}>
      {avatar ? <Image source={avatar} style={s.avatar} /> : (
        <View style={[s.bubble, { backgroundColor: `${iconColor}1A` }]}><Icon name={icon ?? 'circle-outline'} color={iconColor} /></View>
      )}
      <View style={s.flex}>
        <T v="bodyStrong">{label}</T>
        {sub ? <T v="caption" color={colors.textSecondary}>{sub}</T> : null}
      </View>
      <Icon name={forwardChevron} color={colors.muted} />
    </Pressable>
  );
}

/** Selectable answer row with a radio (end). */
export function ChoiceRow({ label, icon, avatar, selected, state, onPress, testID }: {
  label: string; icon?: string; avatar?: number; selected: boolean; state?: 'best' | 'ok' | 'avoid'; onPress: () => void; testID?: string;
}) {
  const tone = state === 'best' ? colors.success : state === 'avoid' ? colors.error : state === 'ok' ? colors.warning : colors.primary;
  return (
    <Pressable onPress={onPress} testID={testID} disabled={!!state} accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={label}
      style={[s.row, selected && { borderColor: tone, backgroundColor: state ? `${tone}12` : colors.lavender }, state === 'best' && !selected && { borderColor: colors.success }]}>
      {avatar ? <Image source={avatar} style={s.avatar} /> : icon ? <View style={[s.bubble, { backgroundColor: colors.lavender }]}><Icon name={icon} /></View> : null}
      <T v="bodyStrong" style={s.flex}>{label}</T>
      <View style={[s.radio, { borderColor: selected ? tone : colors.border, backgroundColor: selected ? tone : 'transparent' }]}>
        {selected ? <Icon name={state === 'avoid' ? 'close' : 'check'} size={16} color="#fff" /> : null}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, paddingTop: space.sm, minHeight: 56 },
  headerBtn: { width: minTouch, height: minTouch, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1 },
  content: { padding: space.lg, gap: space.md, paddingBottom: space.xxl },
  footer: { paddingHorizontal: space.lg, paddingBottom: space.lg, paddingTop: space.sm, gap: space.sm },
  btn: { minHeight: 52, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingHorizontal: space.xl },
  btnPrimary: { backgroundColor: colors.primary, ...shadow },
  btnSoft: { backgroundColor: colors.lavender },
  link: { minHeight: 44, justifyContent: 'center', alignSelf: 'center' },
  underline: { textDecorationLine: 'underline' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: space.lg, gap: space.sm, borderWidth: 1, borderColor: colors.border, ...shadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: space.md, minHeight: 64 },
  bubble: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
