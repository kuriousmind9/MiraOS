import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MEAL_ATLAS } from '../../assets/mealAtlas';
import { Surface } from '../components/Surface';
import { ThemeToggle } from '../components/ThemeToggle';

const ATLAS = { uri: MEAL_ATLAS };

function MealPhoto({ index, size = 52 }) {
  const x = index % 2;
  const y = Math.floor(index / 2);
  return <View style={{ width: size, height: size, borderRadius: 12, overflow: 'hidden' }}><Image source={ATLAS} style={{ position: 'absolute', width: size * 2, height: size * 2, left: -x * size, top: -y * size }} /></View>;
}

export default function HomeScreen({ theme, meals, outcomes, onOutcome, onNavigate, onOpenMira, onToggleTheme }) {
  const [expanded, setExpanded] = useState(null);
  const [partialFor, setPartialFor] = useState(null);
  const totals = useMemo(() => meals.reduce((sum, meal) => {
    const ratio = (outcomes[meal.id]?.portion || 0) / 100;
    return { calories: sum.calories + Math.round(meal.kcal * ratio), protein: sum.protein + Math.round(meal.protein * ratio), carbs: sum.carbs + Math.round(meal.carbs * ratio), fat: sum.fat + Math.round(meal.fat * ratio) };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 }), [meals, outcomes]);

  const colors = { color: theme.text };
  return <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    <View style={s.header}><View style={s.avatar}><Text style={s.avatarText}>T</Text></View><View style={{ flex: 1 }}><Text style={[s.title, colors]}>Good Morning, Tina 👋</Text><Text style={[s.muted, { color: theme.textMuted }]}>Let’s make today amazing!</Text></View><ThemeToggle theme={theme} onToggle={onToggleTheme} /></View>

    <Surface theme={theme} style={s.scoreCard}><Text style={[s.cardLabel, colors]}>Today’s Nutrition Score</Text><View style={s.scoreRow}><View style={[s.ring, { borderColor: theme.green }]}><Text style={[s.score, colors]}>92</Text><Text style={{ color: theme.textMuted, fontSize: 10 }}>/100</Text></View><View style={{ flex: 1 }}><Text style={[s.excellent, colors]}>Excellent! 🎉</Text><Text style={[s.body, { color: theme.textMuted }]}>You’re doing great. Keep the momentum.</Text><TouchableOpacity onPress={() => onNavigate('Progress')} style={[s.secondary, { backgroundColor: theme.panelAlt }]}><Text style={[s.secondaryText, colors]}>View breakdown</Text><Ionicons name="arrow-forward" color={theme.text} size={15} /></TouchableOpacity></View></View></Surface>

    <Surface theme={theme} style={s.logged}><Text style={{ fontSize: 27 }}>💪</Text><View style={{ flex: 1 }}><Text style={[s.body, colors]}>Logged: <Text style={{ fontWeight: '800' }}>{totals.protein}g protein</Text></Text><Text style={[s.small, { color: theme.textMuted }]}>{totals.calories} kcal · {totals.carbs}g carbs · {totals.fat}g fat</Text></View></Surface>

    <View style={s.sectionHead}><Text style={[s.sectionTitle, colors]}>Today’s Plan</Text><TouchableOpacity onPress={() => onNavigate('Plan')}><Text style={{ color: theme.blue, fontSize: 13 }}>View Plan</Text></TouchableOpacity></View>
    {meals.map((meal) => {
      const open = expanded === meal.id;
      const outcome = outcomes[meal.id];
      const label = outcome?.type === 'partial' ? `${outcome.portion}% eaten` : outcome?.type === 'skipped' ? 'Skipped' : outcome?.type === 'replaced' ? 'Replaced' : outcome?.type === 'full' ? 'Completed' : meal.status;
      return <Surface key={meal.id} theme={theme} style={[s.meal, open && { borderColor: theme.green }]}>
        <TouchableOpacity style={s.mealTop} onPress={() => setExpanded(open ? null : meal.id)}><MealPhoto index={meal.photo} /><View style={{ flex: 1 }}><Text style={[s.mealType, colors]}>{meal.type}</Text><Text style={[s.small, { color: theme.textMuted }]}>{meal.name}</Text></View><Text style={[s.badge, { color: outcome?.type === 'skipped' ? theme.red : theme.green, backgroundColor: theme.greenSoft }]}>{label}</Text><Ionicons name={open ? 'chevron-up' : 'chevron-down'} color={theme.text} size={19} /></TouchableOpacity>
        {open && <View style={[s.expand, { borderTopColor: theme.border }]}><View style={s.macros}>{[`${meal.kcal} kcal`, `${meal.protein}g protein`, `${meal.carbs ?? 0}g carbs`, `${meal.fat ?? 0}g fat`].map((v) => <Text key={v} style={[s.macro, { color: theme.textMuted }]}>{v}</Text>)}</View><TouchableOpacity onPress={() => onNavigate('RecipeDetail', { meal })} style={[s.recipe, { backgroundColor: theme.greenSoft }]}><Ionicons name="book-outline" color={theme.green} size={17} /><Text style={[s.recipeText, { color: theme.green }]}>View recipe & portions</Text><Ionicons name="arrow-forward" color={theme.green} size={15} /></TouchableOpacity><Text style={[s.prompt, colors]}>What happened?</Text><View style={s.actions}><Outcome icon="checkmark-circle-outline" label="Ate all" color={theme.green} theme={theme} onPress={() => onOutcome(meal.id, 'full', 100)} /><Outcome icon="pie-chart-outline" label="Ate part" color={theme.amber} theme={theme} onPress={() => setPartialFor(partialFor === meal.id ? null : meal.id)} /><Outcome icon="close-circle-outline" label="Skipped" color={theme.red} theme={theme} onPress={() => onOutcome(meal.id, 'skipped', 0)} /><Outcome icon="swap-horizontal" label="Ate other" color={theme.purple} theme={theme} onPress={() => { onOutcome(meal.id, 'replaced', 0); onOpenMira({ context: `Replace ${meal.type}` }); }} /></View>{partialFor === meal.id && <View style={s.portions}>{[25, 50, 75].map((p) => <TouchableOpacity key={p} onPress={() => { onOutcome(meal.id, 'partial', p); setPartialFor(null); }} style={[s.portion, { backgroundColor: theme.greenSoft }]}><Text style={{ color: theme.green, fontWeight: '800' }}>{p}%</Text></TouchableOpacity>)}</View>}</View>}
      </Surface>;
    })}
    <TouchableOpacity style={s.mira} onPress={() => onOpenMira({ context: 'Home' })}><View style={[s.orb, { borderColor: theme.cyan, backgroundColor: theme.purple }]} /><Text style={[s.ask, colors]}>Ask Mira</Text><Text style={[s.muted, { color: theme.textMuted }]}>Your AI Nutrition Coach</Text></TouchableOpacity>
  </ScrollView>;
}

function Outcome({ icon, label, color, theme, onPress }) {
  return <TouchableOpacity onPress={onPress} style={[s.outcome, { borderColor: theme.border, backgroundColor: theme.backgroundRaised }]}><Ionicons name={icon} size={18} color={color} /><Text style={{ color: theme.text, fontSize: 9, fontWeight: '600' }}>{label}</Text></TouchableOpacity>;
}

const s = StyleSheet.create({ page: { padding: 20, paddingBottom: 110 }, header: { height: 82, flexDirection: 'row', alignItems: 'center', gap: 12 }, avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E4C0A2', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#251A13', fontWeight: '900' }, title: { fontSize: 23, fontWeight: '700' }, muted: { fontSize: 13, marginTop: 3 }, scoreCard: { padding: 20 }, cardLabel: { fontSize: 15, fontWeight: '700' }, scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 18 }, ring: { width: 112, height: 112, borderRadius: 56, borderWidth: 10, alignItems: 'center', justifyContent: 'center' }, score: { fontSize: 35, fontWeight: '800' }, excellent: { fontSize: 16, fontWeight: '700' }, body: { fontSize: 13, lineHeight: 19, marginTop: 6 }, small: { fontSize: 11, marginTop: 4 }, secondary: { alignSelf: 'flex-start', minHeight: 38, marginTop: 12, paddingHorizontal: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }, secondaryText: { fontSize: 11, fontWeight: '600' }, logged: { minHeight: 70, padding: 16, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 13 }, sectionHead: { marginTop: 22, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { fontSize: 19, fontWeight: '700' }, meal: { marginBottom: 8, overflow: 'hidden' }, mealTop: { minHeight: 66, padding: 7, flexDirection: 'row', gap: 11, alignItems: 'center' }, mealType: { fontSize: 13, fontWeight: '700' }, badge: { fontSize: 9, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 7, overflow: 'hidden' }, expand: { borderTopWidth: 1, padding: 14 }, macros: { flexDirection: 'row', justifyContent: 'space-between' }, macro: { fontSize: 9 }, recipe: { minHeight: 42, borderRadius: 11, paddingHorizontal: 13, marginTop: 13, flexDirection: 'row', alignItems: 'center', gap: 9 }, recipeText: { flex: 1, fontSize: 12, fontWeight: '700' }, prompt: { fontSize: 12, fontWeight: '700', marginTop: 16, marginBottom: 9 }, actions: { flexDirection: 'row', gap: 7 }, outcome: { flex: 1, minHeight: 54, borderWidth: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center', gap: 5 }, portions: { flexDirection: 'row', gap: 8, marginTop: 10 }, portion: { flex: 1, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }, mira: { height: 170, alignItems: 'center', justifyContent: 'center' }, orb: { width: 75, height: 75, borderRadius: 38, borderWidth: 2 }, ask: { fontSize: 19, fontWeight: '600', marginTop: 8 } });
