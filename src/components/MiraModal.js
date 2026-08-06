import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function MiraModal({ visible, theme, context, onClose }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  useEffect(() => { if (visible) {
    const activeContext = context?.context;
    const text = activeContext?.startsWith('Replace')
      ? `Tell me what you ate instead of ${activeContext.replace('Replace ', '')}. You can type it naturally or use a photo later.`
      : activeContext?.startsWith('Recipe:')
        ? `I’m looking at ${activeContext.replace('Recipe:', '').trim()} with you. What would you like to adjust?`
        : activeContext === 'Create a pantry-aware recipe'
          ? 'Tell me what you have in your pantry and what you feel like eating. I’ll check verified recipes first.'
          : 'Namaste, Tina. What would you like to adjust today?';
    setChat([{ from: 'mira', text }]);
  } }, [visible, context]);
  const send = () => { if (!message.trim()) return; const text = message.trim(); setChat((items) => [...items, { from: 'user', text }, { from: 'mira', text: 'Got it. I’ll use that meal’s estimated nutrition and rebalance the rest of today without changing anything you locked.' }]); setMessage(''); };
  return <Modal visible={visible} animationType="slide" onRequestClose={onClose}><SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}><View style={[s.header, { borderBottomColor: theme.border }]}><TouchableOpacity onPress={onClose}><Ionicons name="chevron-down" size={26} color={theme.text} /></TouchableOpacity><View><Text style={[s.name, { color: theme.text }]}>Mira</Text><Text style={{ color: theme.textMuted, fontSize: 10 }}>Your AI Nutrition Coach</Text></View><View style={{ width: 26 }} /></View><ScrollView contentContainerStyle={s.body}>{chat.map((item, index) => <View key={index} style={[s.bubble, { backgroundColor: item.from === 'user' ? theme.green : theme.panel, borderColor: item.from === 'user' ? theme.green : theme.border, alignSelf: item.from === 'user' ? 'flex-end' : 'flex-start' }]}><Text style={{ color: item.from === 'user' ? '#07140B' : theme.text, fontSize: 13, lineHeight: 19 }}>{item.text}</Text></View>)}</ScrollView><View style={[s.composer, { borderTopColor: theme.border, backgroundColor: theme.backgroundRaised }]}><TouchableOpacity style={[s.round, { backgroundColor: theme.greenSoft }]}><Ionicons name="mic" color={theme.green} size={20} /></TouchableOpacity><TextInput value={message} onChangeText={setMessage} onSubmitEditing={send} placeholder="Tell Mira naturally…" placeholderTextColor={theme.textMuted} style={[s.input, { backgroundColor: theme.panel, color: theme.text }]} /><TouchableOpacity onPress={send} style={[s.round, { backgroundColor: theme.green }]}><Ionicons name="arrow-up" color="#07140B" size={19} /></TouchableOpacity></View></SafeAreaView></Modal>;
}

const s = StyleSheet.create({ header: { height: 72, paddingHorizontal: 17, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, name: { fontSize: 17, fontWeight: '800', textAlign: 'center' }, body: { padding: 18, gap: 10 }, bubble: { maxWidth: '82%', padding: 13, borderRadius: 17, borderWidth: 1 }, composer: { padding: 12, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }, round: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' }, input: { flex: 1, height: 42, borderRadius: 21, paddingHorizontal: 15 } });
