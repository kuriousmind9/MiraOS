import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecipePhoto from '../features/recipes/RecipePhoto';
import { rankRecipes, macroFitCopy } from '../features/recipes/recipeEngine';

const FALLBACK = { bg: '#020E18', panel: '#0C1B27', panelAlt: '#111F2B', border: '#1B3240', text: '#F3F7F8', muted: '#91A0AB', green: '#5CE778', greenSoft: '#173E2B', purple: '#C477FF', purpleSoft: '#21182F', amber: '#FFB22C' };
const LIGHT = { bg: '#F4F7F5', panel: '#FFFFFF', panelAlt: '#F0F5F2', border: '#DDE8E1', text: '#14221A', muted: '#66736B', green: '#1FA650', greenSoft: '#DDF4E5', purple: '#8555C6', purpleSoft: '#F0E8FA', amber: '#D98B16' };

function colors(theme) {
  const isLight = theme?.mode === 'light' || theme?.dark === false;
  const direct = theme || {};
  return {
    ...(isLight ? LIGHT : FALLBACK),
    ...direct,
    ...(theme?.colors || {}),
    bg: direct.background || direct.bg || (isLight ? LIGHT.bg : FALLBACK.bg),
    panel: direct.panel || direct.surface || (isLight ? LIGHT.panel : FALLBACK.panel),
    panelAlt: direct.panelAlt || direct.surfaceAlt || (isLight ? LIGHT.panelAlt : FALLBACK.panelAlt),
    muted: direct.textMuted || direct.muted || (isLight ? LIGHT.muted : FALLBACK.muted),
    green: direct.green || direct.primary || (isLight ? LIGHT.green : FALLBACK.green),
    greenSoft: direct.greenSoft || direct.primarySoft || (isLight ? LIGHT.greenSoft : FALLBACK.greenSoft),
  };
}

export default function RecipesScreen({ theme, onSelectRecipe, onAskMira, remainingMacros }) {
  const c = colors(theme);
  const s = useMemo(() => createStyles(c), [c.bg, c.text]);
  const [query, setQuery] = useState('');
  const [intent, setIntent] = useState('For you');
  const [favorites, setFavorites] = useState(new Set());
  const [showCreator, setShowCreator] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState(null);
  const recipes = useMemo(() => rankRecipes({ query, intent, pantryOnly: intent === 'From pantry' }), [query, intent]);

  const toggleFavorite = (id) => setFavorites((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const createSuggestion = () => {
    const highProtein = /protein/i.test(prompt);
    setGenerated({
      name: highProtein ? 'High-Protein Palak Paneer Bowl' : 'Mira’s Pantry Dinner Bowl',
      note: 'Built from your pantry after checking verified recipes first.',
      macros: highProtein ? '480 kcal · 41 g protein' : '430 kcal · 30 g protein',
    });
  };

  return (
    <ScrollView contentContainerStyle={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View><Text style={s.title}>Recipes</Text><Text style={s.subtitle}>Verified first. Adapted for you.</Text></View>
        <TouchableOpacity style={s.iconButton}><Ionicons name="heart-outline" size={22} color={c.text} /></TouchableOpacity>
      </View>

      <View style={s.search}>
        <Ionicons name="search" size={20} color={c.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search dishes or ingredients" placeholderTextColor={c.muted} style={s.searchInput} />
        {!!query && <TouchableOpacity onPress={() => setQuery('')}><Ionicons name="close-circle" size={19} color={c.muted} /></TouchableOpacity>}
      </View>

      <TouchableOpacity style={s.miraCard} onPress={() => setShowCreator((v) => !v)}>
        <View style={s.spark}><Ionicons name="sparkles" size={24} color={c.purple} /></View>
        <View style={{ flex: 1 }}><Text style={s.miraTitle}>Create with Mira</Text><Text style={s.miraSub}>Pantry-aware recipe for your remaining macros</Text></View>
        <Ionicons name={showCreator ? 'chevron-up' : 'arrow-forward'} size={19} color={c.text} />
      </TouchableOpacity>

      {showCreator && <View style={s.creator}>
        <Text style={s.creatorHint}>Try: “Extremely high protein with paneer, spinach and curd.”</Text>
        <View style={s.promptRow}><TextInput value={prompt} onChangeText={setPrompt} placeholder="What do you feel like eating?" placeholderTextColor={c.muted} style={s.promptInput} /><TouchableOpacity style={s.send} onPress={createSuggestion}><Ionicons name="arrow-up" size={18} color="#07140B" /></TouchableOpacity></View>
        {generated && <TouchableOpacity style={s.generated} onPress={onAskMira}>
          <View style={s.verified}><Ionicons name="sparkles" size={12} color={c.purple} /><Text style={[s.verifiedText, { color: c.purple }]}>AI FALLBACK</Text></View>
          <Text style={s.generatedName}>{generated.name}</Text><Text style={s.generatedNote}>{generated.note}</Text><Text style={s.generatedMacros}>{generated.macros}</Text>
        </TouchableOpacity>}
      </View>}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {['For you', 'High protein', 'From pantry', 'Something new'].map((item) => <TouchableOpacity key={item} style={[s.chip, intent === item && s.chipOn]} onPress={() => setIntent(item)}><Text style={[s.chipText, intent === item && s.chipTextOn]}>{item}</Text></TouchableOpacity>)}
      </ScrollView>

      <View style={s.sectionRow}><View><Text style={s.sectionTitle}>{intent}</Text><Text style={s.sectionSub}>{intent === 'Something new' ? 'Not eaten in the last 30 days' : `${recipes.length} best matches`}</Text></View><TouchableOpacity><Text style={s.link}>View all</Text></TouchableOpacity></View>

      {!recipes.length && <View style={s.empty}><Ionicons name="restaurant-outline" size={32} color={c.muted} /><Text style={s.emptyTitle}>No verified recipe found</Text><Text style={s.emptyCopy}>Mira can create a pantry-aware option without compromising your dietary rules.</Text><TouchableOpacity style={s.emptyAction} onPress={() => setShowCreator(true)}><Text style={s.emptyActionText}>Create with Mira</Text></TouchableOpacity></View>}

      <View style={s.grid}>{recipes.map((recipe) => (
        <TouchableOpacity key={recipe.id} style={s.card} activeOpacity={0.86} onPress={() => onSelectRecipe?.(recipe)}>
          <View style={s.imageWrap}><RecipePhoto index={recipe.image} size={160} radius={0} style={{ width: '100%' }} /><View style={s.verified}><Ionicons name="shield-checkmark" size={12} color={c.green} /><Text style={s.verifiedText}>VERIFIED</Text></View><TouchableOpacity style={s.heart} onPress={() => toggleFavorite(recipe.id)}><Ionicons name={favorites.has(recipe.id) ? 'heart' : 'heart-outline'} size={19} color={favorites.has(recipe.id) ? '#FF6674' : '#FFFFFF'} /></TouchableOpacity></View>
          <View style={s.cardBody}><Text style={s.recipeName} numberOfLines={2}>{recipe.name}</Text><Text style={s.meta}>{recipe.macros.calories} kcal · {recipe.macros.protein}g protein</Text><View style={s.fitRow}><Text style={s.match}>{recipe.match}% fit</Text><Text style={s.pantry}>{recipe.pantryMatch}% pantry</Text></View><Text style={s.fitCopy} numberOfLines={2}>{macroFitCopy(recipe, remainingMacros)}</Text></View>
        </TouchableOpacity>
      ))}</View>
    </ScrollView>
  );
}

const createStyles = (c) => StyleSheet.create({
  screen: { backgroundColor: c.bg, padding: 20, paddingBottom: 116, minHeight: '100%' }, header: { minHeight: 76, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { color: c.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.7 }, subtitle: { color: c.muted, fontSize: 12, marginTop: 4 }, iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.panel, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  search: { height: 50, borderRadius: 16, borderWidth: 1, borderColor: c.border, backgroundColor: c.panel, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10 }, searchInput: { flex: 1, color: c.text, fontSize: 14 },
  miraCard: { minHeight: 82, marginTop: 13, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: c.purple, backgroundColor: c.purpleSoft, flexDirection: 'row', alignItems: 'center', gap: 13 }, spark: { width: 44, height: 44, borderRadius: 15, backgroundColor: c.panel, alignItems: 'center', justifyContent: 'center' }, miraTitle: { color: c.text, fontSize: 15, fontWeight: '800' }, miraSub: { color: c.muted, fontSize: 11, marginTop: 4 },
  creator: { marginTop: 8, padding: 14, backgroundColor: c.panel, borderWidth: 1, borderColor: c.border, borderRadius: 17 }, creatorHint: { color: c.muted, fontSize: 11, lineHeight: 17 }, promptRow: { flexDirection: 'row', gap: 8, marginTop: 11 }, promptInput: { flex: 1, height: 43, borderRadius: 13, backgroundColor: c.panelAlt, color: c.text, paddingHorizontal: 13 }, send: { width: 43, height: 43, borderRadius: 14, backgroundColor: c.green, alignItems: 'center', justifyContent: 'center' }, generated: { marginTop: 12, padding: 13, borderRadius: 14, backgroundColor: c.panelAlt, borderWidth: 1, borderColor: c.border }, generatedName: { color: c.text, fontSize: 14, fontWeight: '800', marginTop: 8 }, generatedNote: { color: c.muted, fontSize: 11, lineHeight: 16, marginTop: 4 }, generatedMacros: { color: c.green, fontSize: 11, fontWeight: '700', marginTop: 8 },
  chips: { gap: 8, paddingVertical: 15 }, chip: { height: 34, paddingHorizontal: 14, borderRadius: 17, backgroundColor: c.panel, borderWidth: 1, borderColor: c.border, justifyContent: 'center' }, chipOn: { backgroundColor: c.greenSoft, borderColor: c.green }, chipText: { color: c.muted, fontSize: 11, fontWeight: '600' }, chipTextOn: { color: c.green },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }, sectionTitle: { color: c.text, fontSize: 19, fontWeight: '800' }, sectionSub: { color: c.muted, fontSize: 10, marginTop: 4 }, link: { color: c.green, fontSize: 11, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, card: { width: '48.4%', backgroundColor: c.panel, borderWidth: 1, borderColor: c.border, borderRadius: 20, overflow: 'hidden', marginBottom: 13 }, imageWrap: { height: 146, overflow: 'hidden' }, verified: { position: 'absolute', left: 8, top: 8, backgroundColor: c.panel, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 4 }, verifiedText: { color: c.green, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 }, heart: { position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: '#07131EBB', alignItems: 'center', justifyContent: 'center' }, cardBody: { padding: 12 }, recipeName: { minHeight: 34, color: c.text, fontSize: 14, lineHeight: 17, fontWeight: '800' }, meta: { color: c.muted, fontSize: 9, marginTop: 6 }, fitRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }, match: { color: c.green, fontSize: 9, fontWeight: '800' }, pantry: { color: c.muted, fontSize: 9 }, fitCopy: { color: c.muted, fontSize: 9, lineHeight: 13, marginTop: 7 },
  empty: { padding: 28, backgroundColor: c.panel, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: c.border }, emptyTitle: { color: c.text, fontSize: 15, fontWeight: '800', marginTop: 10 }, emptyCopy: { color: c.muted, textAlign: 'center', fontSize: 11, lineHeight: 17, marginTop: 6 }, emptyAction: { marginTop: 14, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 11, backgroundColor: c.green }, emptyActionText: { color: '#07140B', fontSize: 11, fontWeight: '900' },
});
