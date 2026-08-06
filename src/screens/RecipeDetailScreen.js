import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecipePhoto from '../features/recipes/RecipePhoto';
import { DEFAULT_HOUSEHOLD, RECIPES, RECIPE_VARIANTS } from '../features/recipes/recipeData';
import { applyVariant, scaleIngredient } from '../features/recipes/recipeEngine';

const DARK = { bg: '#020E18', panel: '#0C1B27', panelAlt: '#111F2B', border: '#1B3240', text: '#F3F7F8', muted: '#91A0AB', green: '#5CE778', greenSoft: '#173E2B', purple: '#C477FF', amber: '#FFB22C' };
const LIGHT = { bg: '#F4F7F5', panel: '#FFFFFF', panelAlt: '#F0F5F2', border: '#DDE8E1', text: '#14221A', muted: '#66736B', green: '#1FA650', greenSoft: '#DDF4E5', purple: '#8555C6', amber: '#D98B16' };
const getColors = (theme) => {
  const isLight = theme?.mode === 'light' || theme?.dark === false;
  const direct = theme || {};
  return {
    ...(isLight ? LIGHT : DARK),
    ...direct,
    ...(theme?.colors || {}),
    bg: direct.background || direct.bg || (isLight ? LIGHT.bg : DARK.bg),
    panel: direct.panel || direct.surface || (isLight ? LIGHT.panel : DARK.panel),
    panelAlt: direct.panelAlt || direct.surfaceAlt || (isLight ? LIGHT.panelAlt : DARK.panelAlt),
    muted: direct.textMuted || direct.muted || (isLight ? LIGHT.muted : DARK.muted),
    green: direct.green || direct.primary || (isLight ? LIGHT.green : DARK.green),
    greenSoft: direct.greenSoft || direct.primarySoft || (isLight ? LIGHT.greenSoft : DARK.greenSoft),
  };
};

export default function RecipeDetailScreen({ recipe: inputRecipe, theme, household = DEFAULT_HOUSEHOLD, onBack, onAddToPlan, onAskMira }) {
  const base = inputRecipe || RECIPES[3];
  const c = getColors(theme);
  const s = useMemo(() => styles(c), [c.bg, c.text]);
  const variants = RECIPE_VARIANTS[base.id] || [{ id: 'balanced', label: 'Balanced', delta: {}, note: 'Verified recipe as tested.' }];
  const [variantId, setVariantId] = useState(variants[0].id);
  const [servings, setServings] = useState(household.length || 1);
  const [tab, setTab] = useState('Ingredients');
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);
  const variant = variants.find((v) => v.id === variantId);
  const recipe = applyVariant(base, variant);
  const multiplier = servings / Math.max(1, household.length || 1);

  const add = () => {
    setAdded(true);
    onAddToPlan?.({ recipe, servings, household });
  };

  return (
    <View style={s.page}>
      <ScrollView contentContainerStyle={s.screen} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <RecipePhoto index={recipe.image} size={390} radius={0} style={s.heroImage} />
          <View style={s.heroShade} />
          <View style={s.topbar}><TouchableOpacity style={s.circle} onPress={onBack}><Ionicons name="chevron-back" size={23} color="#FFF" /></TouchableOpacity><TouchableOpacity style={s.circle} onPress={() => setFavorite((v) => !v)}><Ionicons name={favorite ? 'heart' : 'heart-outline'} size={21} color={favorite ? '#FF6674' : '#FFF'} /></TouchableOpacity></View>
          <View style={s.heroText}><View style={s.verified}><Ionicons name="shield-checkmark" size={12} color={c.green} /><Text style={s.verifiedText}>NUTRITION VERIFIED</Text></View><Text style={s.title}>{recipe.name}</Text><Text style={s.heroMeta}>{recipe.meal} · {recipe.prepMinutes} min · {recipe.pantryMatch}% pantry match</Text></View>
        </View>

        <View style={s.body}>
          <Text style={s.eyebrow}>TODAY’S MACRO FIT</Text>
          <View style={s.macros}>{[['Calories', recipe.macros.calories, 'kcal'], ['Protein', recipe.macros.protein, 'g'], ['Carbs', recipe.macros.carbs, 'g'], ['Fat', recipe.macros.fat, 'g']].map(([name, value, unit]) => <View key={name} style={s.macro}><Text style={s.macroValue}>{value}<Text style={s.macroUnit}> {unit}</Text></Text><Text style={s.macroName}>{name}</Text></View>)}</View>
          <View style={s.fitNote}><Ionicons name="sparkles" size={18} color={c.green} /><Text style={s.fitNoteText}>This recipe keeps dinner within target and brings you within 4 g of today’s protein goal.</Text></View>

          <View style={s.sectionHead}><Text style={s.sectionTitle}>Choose a variant</Text><TouchableOpacity onPress={onAskMira}><Text style={s.miraLink}>Ask Mira</Text></TouchableOpacity></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.variantRow}>{variants.map((item) => <TouchableOpacity key={item.id} style={[s.variant, variantId === item.id && s.variantOn]} onPress={() => setVariantId(item.id)}><Text style={[s.variantLabel, variantId === item.id && s.variantLabelOn]}>{item.label}</Text></TouchableOpacity>)}</ScrollView>
          <Text style={s.variantNote}>{variant.note}</Text>

          <View style={s.servingCard}><View><Text style={s.sectionTitle}>Cooking for household</Text><Text style={s.sub}>One recipe, personalized portions</Text></View><View style={s.stepper}><TouchableOpacity style={s.stepButton} onPress={() => setServings(Math.max(1, servings - 1))}><Ionicons name="remove" size={17} color={c.text} /></TouchableOpacity><Text style={s.servingCount}>{servings}</Text><TouchableOpacity style={s.stepButton} onPress={() => setServings(servings + 1)}><Ionicons name="add" size={17} color={c.text} /></TouchableOpacity></View></View>

          <View style={s.portions}>{household.map((member) => <View key={member.id} style={s.person}><View style={s.personAvatar}><Text style={s.avatarText}>{member.name[0]}</Text></View><View style={{ flex: 1 }}><Text style={s.personName}>{member.name}</Text><Text style={s.personGoal}>{member.target}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={s.personPortion}>{member.portion.toFixed(2)}× portion</Text><Text style={s.personProtein}>{Math.round(recipe.macros.protein * member.portion)}g protein</Text></View></View>)}</View>

          <View style={s.tabs}>{['Ingredients', 'Method'].map((name) => <TouchableOpacity key={name} style={[s.tab, tab === name && s.tabOn]} onPress={() => setTab(name)}><Text style={[s.tabText, tab === name && s.tabTextOn]}>{name}</Text></TouchableOpacity>)}</View>
          {tab === 'Ingredients' ? <View>{recipe.ingredients.map((item, index) => <View key={`${item.name}-${index}`} style={s.ingredient}><View style={s.ingredientCheck}><Ionicons name="checkmark" size={13} color={c.green} /></View><Text style={s.ingredientName}>{item.name}</Text><Text style={s.ingredientAmount}>{scaleIngredient(item, multiplier)}</Text></View>)}</View> : <View>{recipe.steps.map((step, index) => <View key={step} style={s.method}><View style={s.stepNumber}><Text style={s.stepNumberText}>{index + 1}</Text></View><Text style={s.stepText}>{step}</Text></View>)}</View>}
        </View>
      </ScrollView>
      <View style={s.footer}><TouchableOpacity style={[s.primary, added && s.primaryDone]} onPress={add}><Ionicons name={added ? 'checkmark-circle' : 'calendar-outline'} size={19} color="#07140B" /><Text style={s.primaryText}>{added ? 'Added to today’s plan' : 'Add to today’s plan'}</Text></TouchableOpacity></View>
    </View>
  );
}

const styles = (c) => StyleSheet.create({
  page: { flex: 1, backgroundColor: c.bg }, screen: { paddingBottom: 110 }, hero: { height: 360, backgroundColor: c.panel, overflow: 'hidden' }, heroImage: { width: '100%', height: 360 }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: '#020A10', opacity: 0.38 }, topbar: { position: 'absolute', top: 20, left: 18, right: 18, flexDirection: 'row', justifyContent: 'space-between' }, circle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#07131ECC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFFFFF33' }, heroText: { position: 'absolute', left: 20, right: 20, bottom: 22 }, verified: { alignSelf: 'flex-start', backgroundColor: '#07131EDD', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 }, verifiedText: { color: c.green, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 }, title: { color: '#FFF', fontSize: 29, lineHeight: 34, fontWeight: '900', letterSpacing: -0.8, marginTop: 10 }, heroMeta: { color: '#E0E7EA', fontSize: 12, marginTop: 8 },
  body: { padding: 20 }, eyebrow: { color: c.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 }, macros: { marginTop: 9, backgroundColor: c.panel, borderRadius: 18, borderWidth: 1, borderColor: c.border, flexDirection: 'row', paddingVertical: 17 }, macro: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: c.border }, macroValue: { color: c.text, fontSize: 16, fontWeight: '900' }, macroUnit: { color: c.muted, fontSize: 8, fontWeight: '600' }, macroName: { color: c.muted, fontSize: 9, marginTop: 5 }, fitNote: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13, borderRadius: 14, backgroundColor: c.greenSoft, marginTop: 9 }, fitNoteText: { flex: 1, color: c.text, fontSize: 10, lineHeight: 15 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }, sectionTitle: { color: c.text, fontSize: 16, fontWeight: '800' }, miraLink: { color: c.purple, fontSize: 11, fontWeight: '800' }, variantRow: { gap: 8, paddingVertical: 11 }, variant: { height: 34, borderRadius: 17, borderWidth: 1, borderColor: c.border, backgroundColor: c.panel, justifyContent: 'center', paddingHorizontal: 13 }, variantOn: { borderColor: c.green, backgroundColor: c.greenSoft }, variantLabel: { color: c.muted, fontSize: 10, fontWeight: '700' }, variantLabelOn: { color: c.green }, variantNote: { color: c.muted, fontSize: 10, lineHeight: 15 },
  servingCard: { marginTop: 22, padding: 15, backgroundColor: c.panel, borderWidth: 1, borderColor: c.border, borderRadius: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sub: { color: c.muted, fontSize: 10, marginTop: 4 }, stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 }, stepButton: { width: 31, height: 31, borderRadius: 10, backgroundColor: c.panelAlt, alignItems: 'center', justifyContent: 'center' }, servingCount: { color: c.text, fontSize: 16, fontWeight: '900' }, portions: { backgroundColor: c.panel, borderWidth: 1, borderColor: c.border, borderRadius: 17, marginTop: 8, overflow: 'hidden' }, person: { minHeight: 66, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, borderBottomWidth: 1, borderBottomColor: c.border }, personAvatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: c.greenSoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 }, avatarText: { color: c.green, fontWeight: '900' }, personName: { color: c.text, fontSize: 12, fontWeight: '800' }, personGoal: { color: c.muted, fontSize: 9, marginTop: 3 }, personPortion: { color: c.text, fontSize: 10, fontWeight: '800' }, personProtein: { color: c.green, fontSize: 9, marginTop: 3 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: c.border, marginTop: 25 }, tab: { flex: 1, paddingVertical: 12, alignItems: 'center' }, tabOn: { borderBottomWidth: 2, borderBottomColor: c.green }, tabText: { color: c.muted, fontSize: 12, fontWeight: '700' }, tabTextOn: { color: c.text }, ingredient: { minHeight: 54, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: c.border }, ingredientCheck: { width: 25, height: 25, borderRadius: 8, backgroundColor: c.greenSoft, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, ingredientName: { color: c.text, fontSize: 12, flex: 1 }, ingredientAmount: { color: c.muted, fontSize: 11 }, method: { flexDirection: 'row', gap: 12, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: c.border }, stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: c.greenSoft, alignItems: 'center', justifyContent: 'center' }, stepNumberText: { color: c.green, fontSize: 11, fontWeight: '900' }, stepText: { flex: 1, color: c.text, fontSize: 12, lineHeight: 19 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: c.bg, borderTopWidth: 1, borderTopColor: c.border, padding: 13, paddingBottom: 18 }, primary: { height: 51, borderRadius: 16, backgroundColor: c.green, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center' }, primaryDone: { opacity: 0.82 }, primaryText: { color: '#07140B', fontSize: 13, fontWeight: '900' },
});
