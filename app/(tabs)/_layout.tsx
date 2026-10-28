import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui';
import { colors, fonts, shadow } from '@/constants/theme';

const TABS = [
  { name: 'index', title: 'الرئيسية', icon: 'home-outline', active: 'home' },
  { name: 'kalma', title: 'كلمة بداية', icon: 'account-group-outline', active: 'account-group' },
  { name: 'chat-button', title: 'الشات', icon: 'keyboard-outline', active: 'keyboard' },
  { name: 'digital', title: 'ثانية تفكير', icon: 'cellphone-message', active: 'cellphone-message' },
  { name: 'progress', title: 'تقدّمي', icon: 'chart-donut', active: 'chart-donut' },
] as const;

/** The keyboard button in the middle of the bar opens the chat. */
function ChatTabButton() {
  return (
    <View style={st.centerWrap} pointerEvents="box-none">
      <Pressable onPress={() => router.push('/chat')} accessibilityRole="button" accessibilityLabel="افتح الشات" testID="tab-chat"
        style={({ pressed }) => [st.centerBtn, pressed && { transform: [{ scale: 0.95 }] }]}>
        <Icon name="keyboard-outline" size={30} color="#fff" />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 68 + insets.bottom, paddingTop: 6, paddingBottom: insets.bottom + 8 },
      tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 16 },
      sceneStyle: { backgroundColor: colors.bg },
    }}>
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{
          title: t.title,
          tabBarButtonTestID: `tab-${t.name}`,
          tabBarAccessibilityLabel: t.title,
          tabBarIcon: ({ color, focused }) => <Icon name={focused ? t.active : t.icon} size={24} color={color} />,
          ...(t.name === 'chat-button' ? { tabBarButton: () => <ChatTabButton /> } : {}),
        }} />
      ))}
    </Tabs>
  );
}

const st = StyleSheet.create({
  centerWrap: { flex: 1, alignItems: 'center' },
  centerBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: -22, borderWidth: 4, borderColor: colors.bg, ...shadow },
});
