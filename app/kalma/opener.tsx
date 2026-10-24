import React, { useMemo, useState } from 'react';
import { Share, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Icon, Screen, T } from '@/components/ui';
import { genderize, openers, persons, situations, type PersonId, type SituationId } from '@/data/content';
import { useApp } from '@/hooks/useApp';
import { colors, fonts, radius, space } from '@/constants/theme';

/** Screen 5 — suggested conversation opener (editable, shareable). */
export default function KalmaOpener() {
  const { situation, person } = useLocalSearchParams<{ situation: SituationId; person: PersonId }>();
  const { state } = useApp();
  const p = persons.find((x) => x.id === person);
  const valid = !!p && situations.some((s) => s.id === situation);
  const suggested = useMemo(() => (valid ? genderize(openers[situation][person], state.profile.gender) : ''), [valid, situation, person, state.profile.gender]);
  const [text, setText] = useState(suggested);
  const [editing, setEditing] = useState(false);

  if (!valid) return <Screen title="بداية مقترحة"><T center>الموقف غير موجود. ارجع واختار من جديد.</T></Screen>;

  const next = () => router.push({ pathname: '/kalma/choice', params: { situation, person } });
  const use = async () => {
    try { await Share.share({ message: text.trim() }); } catch { /* sharing is optional */ }
    next();
  };

  return (
    <Screen title="بداية مقترحة" subtitle={`للتحدث ${p.withLabel}`}
      footer={<>
        <Button label="استخدمها" icon="send-outline" onPress={use} disabled={!text.trim()} testID="use-opener" />
        <Button label={editing ? 'تم التعديل' : 'تعديل الرسالة'} variant="link" onPress={() => setEditing(!editing)} testID="edit-opener" />
        <Button label="تخطّي للخطوة التالية" variant="link" onPress={next} testID="skip-opener" />
      </>}>
      <Card style={st.bubble}>
        {editing ? (
          <TextInput value={text} onChangeText={setText} multiline autoFocus textAlign="right" textAlignVertical="top" accessibilityLabel="نص الرسالة"
            style={[st.input, { fontFamily: fonts.semibold }]} testID="opener-input" />
        ) : <T v="heading" testID="opener-text" style={st.msg}>{text}</T>}
      </Card>
      <View style={st.tip}>
        <Icon name="lightbulb-on-outline" color={colors.warning} />
        <T v="caption" color={colors.textSecondary} style={st.flex}>اختار وقت هادي، وابدأ بمشاعرك بدل ما تبدأ باللوم. ممكن تعدّل الرسالة بكلامك إنت.</T>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  bubble: { minHeight: 170, justifyContent: 'center', borderTopStartRadius: 6 },
  msg: { lineHeight: 32 },
  input: { minHeight: 150, fontSize: 17, lineHeight: 30, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md },
  tip: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', backgroundColor: colors.warningBg, borderRadius: radius.md, padding: space.md },
  flex: { flex: 1 },
});
