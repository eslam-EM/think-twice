import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Icon, Logo, T } from '@/components/ui';
import { QUICK_QUESTIONS, WELCOME } from '@/data/chat';
import { genderize } from '@/data/content';
import { detectTopic, FALLBACK_ID, nextReplyIndex, repliesFor, suggestionsFor } from '@/services/chat';
import { useApp } from '@/hooks/useApp';
import { playSound } from '@/services/feedback';
import { colors, fonts, radius, space } from '@/constants/theme';
import { backIcon } from '@/constants/layout';

interface Msg { id: number; from: 'user' | 'bot'; text: string; topic?: string }

/** Offline quick-reply chat (no AI, nothing leaves the phone). */
export default function Chat() {
  const { state } = useApp();
  const g = state.profile.gender;
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: 'bot', text: WELCOME }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const used = useRef<Record<string, number[]>>({});
  const nextId = useRef(1);
  const scroll = useRef<ScrollView>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const botReply = useCallback((topic: string) => {
    const list = repliesFor(topic);
    const u = used.current[topic] ?? [];
    const idx = nextReplyIndex(list.length, u);
    used.current[topic] = [...u, idx];
    setTyping(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: nextId.current++, from: 'bot', text: genderize(list[idx], g), topic }]);
      playSound('tap');
    }, 650);
  }, [g]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMsgs((m) => [...m, { id: nextId.current++, from: 'user', text: clean }]);
    setInput('');
    botReply(detectTopic(clean));
  };

  const last = msgs[msgs.length - 1];
  const lastBot = last.from === 'bot' ? last : null;
  const chips = !lastBot || typing ? [] : !lastBot.topic || lastBot.topic === FALLBACK_ID ? QUICK_QUESTIONS : suggestionsFor(lastBot.topic);

  return (
    <View style={st.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={st.root} edges={['top', 'bottom']}>
        <View style={st.header}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} hitSlop={10} accessibilityRole="button" accessibilityLabel="رجوع" style={st.headerBtn} testID="back">
            <Icon name={backIcon} color={colors.text} />
          </Pressable>
          <Logo size={40} />
          <View style={st.flex}>
            <T v="heading">شات ثانية تفكير</T>
            <T v="caption" color={colors.success}>{typing ? 'بيكتب…' : 'ردود سريعة • بدون إنترنت'}</T>
          </View>
        </View>

        <KeyboardAvoidingView style={st.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView ref={scroll} contentContainerStyle={st.list} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} keyboardShouldPersistTaps="handled" testID="chat-list">
            {msgs.map((m) => (
              <View key={m.id} style={[st.bubble, m.from === 'user' ? st.user : st.bot]} testID={m.from === 'bot' ? 'bot-msg' : 'user-msg'}>
                <T color={m.from === 'user' ? '#fff' : colors.text}>{m.text}</T>
              </View>
            ))}
            {typing ? <View style={[st.bubble, st.bot]}><T color={colors.muted}>…</T></View> : null}
            {lastBot && lastBot.topic && !typing ? (
              <Pressable onPress={() => botReply(lastBot.topic!)} accessibilityRole="button" accessibilityLabel="رد آخر" style={st.another} testID="another-reply">
                <Icon name="refresh" size={18} color={colors.primary} />
                <T v="bodyStrong" color={colors.primary}>رد آخر</T>
              </Pressable>
            ) : null}
            {chips.length ? (
              <View style={st.chips}>
                {chips.map((c) => (
                  <Pressable key={c} onPress={() => send(c)} style={st.chip} accessibilityRole="button" accessibilityLabel={c} testID={`quick-${c}`}>
                    <T v="caption" color={colors.primaryDark}>{c}</T>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </ScrollView>
          <View style={st.inputBar}>
            <TextInput value={input} onChangeText={setInput} placeholder="اكتب رسالتك…" placeholderTextColor={colors.muted} multiline maxLength={300}
              onSubmitEditing={() => send(input)} blurOnSubmit textAlign="right" accessibilityLabel="اكتب رسالتك" testID="chat-input"
              style={[st.input, { fontFamily: fonts.regular }]} />
            <Pressable onPress={() => send(input)} disabled={!input.trim() || typing} accessibilityRole="button" accessibilityLabel="إرسال" testID="chat-send"
              style={[st.sendBtn, (!input.trim() || typing) && { opacity: 0.4 }]}>
              <Icon name="send" size={22} color="#fff" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, paddingVertical: space.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  list: { padding: space.lg, gap: space.sm },
  bubble: { maxWidth: '82%', paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.lg },
  bot: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderTopStartRadius: 6, borderWidth: 1, borderColor: colors.border },
  user: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderTopEndRadius: 6 },
  another: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: space.md, minHeight: 40, borderRadius: radius.pill, backgroundColor: colors.lavender },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.sm },
  chip: { borderWidth: 1, borderColor: colors.violet, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 6, minHeight: 36, justifyContent: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, padding: space.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, minHeight: 46, maxHeight: 120, borderRadius: radius.lg, backgroundColor: colors.bg, paddingHorizontal: space.md, paddingVertical: 10, fontSize: 15, color: colors.text },
  sendBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
