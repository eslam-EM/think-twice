import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { Card, Icon, OptionRow, Screen, T } from '@/components/ui';
import { useApp } from '@/hooks/useApp';
import { disableDailyReminder, enableDailyReminder } from '@/services/notifications';
import { colors, fonts, radius, space } from '@/constants/theme';

function Toggle({ icon, label, value, onChange, testID }: { icon: string; label: string; value: boolean; onChange: (v: boolean) => void; testID?: string }) {
  return (
    <View style={st.row}>
      <Icon name={icon} />
      <T v="bodyStrong" style={st.flex}>{label}</T>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} testID={testID}
        trackColor={{ true: colors.violet, false: colors.lavenderStrong }} thumbColor={value ? colors.primary : '#fff'} />
    </View>
  );
}

/** Screen 13 — settings. */
export default function Settings() {
  const { state, updateProfile, reset } = useApp();
  const p = state.profile;
  const [name, setName] = useState(p.name);

  const toggleReminder = async (on: boolean) => {
    if (!on) { await disableDailyReminder(); updateProfile({ reminder: false }); return; }
    const r = await enableDailyReminder();
    updateProfile({ reminder: r === 'enabled' });
    if (r !== 'enabled') Alert.alert('الإشعارات', r === 'denied' ? 'لم يتم السماح بالإشعارات. ممكن تفعّلها من إعدادات الموبايل، والتطبيق شغال كويس من غيرها.' : 'الإشعارات غير متاحة على الجهاز ده.');
  };

  return (
    <Screen title="الإعدادات">
      <Card>
        <View style={st.row}><Icon name="account-outline" /><T v="heading" style={st.flex}>الملف الشخصي</T></View>
        <TextInput value={name} onChangeText={setName} onBlur={() => updateProfile({ name: name.trim().slice(0, 30) })} onEndEditing={() => updateProfile({ name: name.trim().slice(0, 30) })}
          placeholder="اسمك (اختياري)" placeholderTextColor={colors.muted} maxLength={30} textAlign="right" accessibilityLabel="الاسم" testID="name-input"
          style={[st.input, { fontFamily: fonts.regular }]} />
        <T v="caption" color={colors.textSecondary}>عشان نكتب الرسائل بالشكل المناسب ليك:</T>
        <View style={st.chips}>
          {([['m', 'أنا ولد'], ['f', 'أنا بنت']] as const).map(([g, label]) => (
            <Pressable key={g} onPress={() => updateProfile({ gender: g })} accessibilityRole="radio" accessibilityState={{ selected: p.gender === g }}
              style={[st.chip, p.gender === g && st.chipOn]} testID={`gender-${g}`}>
              <T v="bodyStrong" color={p.gender === g ? '#fff' : colors.textSecondary}>{label}</T>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <Toggle icon="bell-outline" label="الإشعارات (تذكير يومي لطيف)" value={p.reminder} onChange={toggleReminder} testID="sw-reminder" />
        <Toggle icon="volume-high" label="الأصوات" value={p.sound} onChange={(v) => updateProfile({ sound: v })} />
        <Toggle icon="vibrate" label="الاهتزاز" value={p.haptics} onChange={(v) => updateProfile({ haptics: v })} />
      </Card>
      <OptionRow label="المساعدة" icon="help-circle-outline" onPress={() => router.push('/help')} testID="open-help" />
      <OptionRow label="عن التطبيق" icon="information-outline" onPress={() => router.push('/about')} testID="open-about" />
      <OptionRow label="مسح التقدم" icon="delete-outline" iconColor={colors.error} testID="reset"
        onPress={() => Alert.alert('مسح التقدم؟', 'هيتم مسح كل التحديات اللي أنجزتها من الجهاز ده.', [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'مسح', style: 'destructive', onPress: () => { reset(); } },
        ])} />
      <Card style={{ backgroundColor: colors.lavender, borderColor: 'transparent' }}>
        <T center color={colors.textSecondary}>كل خطوة صغيرة{'\n'}هي تقدم كبير ♡</T>
      </Card>
      <T v="caption" center color={colors.muted}>{`الإصدار ${Constants.expoConfig?.version ?? '1.0.0'}`}</T>
    </Screen>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48 },
  flex: { flex: 1 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, minHeight: 48, paddingHorizontal: space.md, fontSize: 16, color: colors.text },
  chips: { flexDirection: 'row', gap: space.sm },
  chip: { borderRadius: radius.pill, paddingHorizontal: space.lg, minHeight: 44, justifyContent: 'center', backgroundColor: colors.lavender },
  chipOn: { backgroundColor: colors.primary },
});
