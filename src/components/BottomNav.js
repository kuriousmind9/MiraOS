import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = [['Home', 'home'], ['Plan', 'calendar'], ['Recipes', 'restaurant'], ['Grocery', 'cart'], ['Progress', 'stats-chart']];

export function BottomNav({ theme, active, onNavigate }) {
  return <View style={[s.nav, { backgroundColor: theme.nav, borderTopColor: theme.border }]}>{tabs.map(([name, icon]) => { const selected = active === name; return <TouchableOpacity accessibilityRole="tab" accessibilityState={{ selected }} key={name} onPress={() => onNavigate(name)} style={s.item}><Ionicons name={selected ? icon : `${icon}-outline`} color={selected ? theme.green : theme.textMuted} size={22} /><Text style={{ color: selected ? theme.green : theme.textMuted, fontSize: 9 }}>{name}</Text></TouchableOpacity>; })}</View>;
}

const s = StyleSheet.create({ nav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 78, borderTopWidth: 1, flexDirection: 'row', paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 17 : 7 }, item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 } });
