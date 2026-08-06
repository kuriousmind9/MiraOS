import React, { useMemo, useState } from 'react';
import { Linking, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import MealPrepScreen from './src/screens/MealPrepScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import GroceryScreen from './src/screens/GroceryScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import { BottomNav } from './src/components/BottomNav';
import { MiraModal } from './src/components/MiraModal';
import { useThemeMode } from './src/theme/useThemeMode';
import { initialMeals, nutritionTargets } from './src/state/sampleData';
import { RECIPES } from './src/features/recipes/recipeData';

export default function App() {
  const { theme, toggleTheme } = useThemeMode();
  const [active, setActive] = useState('Home');
  const [detail, setDetail] = useState(null);
  const [meals, setMeals] = useState(initialMeals);
  const [outcomes, setOutcomes] = useState({ breakfast: { type: 'full', portion: 100 } });
  const [mira, setMira] = useState(null);
  const [inventory, setInventory] = useState(null);

  const remainingMacros = useMemo(() => {
    const consumed = meals.reduce((sum, meal) => {
      const ratio = (outcomes[meal.id]?.portion || 0) / 100;
      return { calories: sum.calories + meal.kcal * ratio, protein: sum.protein + meal.protein * ratio, carbs: sum.carbs + meal.carbs * ratio, fat: sum.fat + meal.fat * ratio };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    return Object.fromEntries(Object.entries(consumed).map(([key, value]) => [key, Math.max(0, Math.round(nutritionTargets[key] - value))]));
  }, [meals, outcomes]);

  const navigate = (screen, params) => {
    if (screen === 'RecipeDetail') {
      const requested = params?.meal || params;
      setDetail(RECIPES.find((recipe) => recipe.meal === requested?.type || recipe.id === requested?.id) || RECIPES[0]);
      return;
    }
    setDetail(null);
    setActive(screen);
  };

  const openMira = (context = {}) => setMira(context || {});
  const recordOutcome = (mealId, type, portion) => setOutcomes((current) => ({ ...current, [mealId]: { type, portion } }));

  let content;
  if (detail) content = <RecipeDetailScreen recipe={detail} theme={theme} onBack={() => setDetail(null)} onAddToPlan={({ recipe }) => setMeals((current) => current.map((meal) => meal.type === recipe.meal ? { ...meal, name: recipe.name, kcal: recipe.macros.calories, protein: recipe.macros.protein, carbs: recipe.macros.carbs, fat: recipe.macros.fat } : meal))} onAskMira={() => openMira({ context: `Recipe: ${detail.name}` })} />;
  else if (active === 'Home') content = <HomeScreen theme={theme} meals={meals} outcomes={outcomes} onOutcome={recordOutcome} onNavigate={navigate} onOpenMira={openMira} onToggleTheme={toggleTheme} />;
  else if (active === 'Plan') content = <MealPrepScreen theme={theme} onOpenMira={openMira} onPlanConfirmed={({ week }) => {
    const today = week?.thu;
    if (today?.length) setMeals((current) => today.map((planned, index) => {
      const existing = current.find((meal) => meal.type === planned.type) || current[index] || {};
      return {
        ...existing,
        id: existing.id || planned.id,
        type: planned.type,
        name: planned.name,
        kcal: planned.kcal,
        protein: planned.protein,
        photo: planned.imageIndex ?? existing.photo ?? index,
      };
    }));
  }} />;
  else if (active === 'Recipes') content = <RecipesScreen theme={theme} remainingMacros={remainingMacros} onSelectRecipe={setDetail} onAskMira={() => openMira({ context: 'Create a pantry-aware recipe' })} />;
  else if (active === 'Grocery') content = <GroceryScreen theme={theme} inventory={inventory} onInventoryChange={setInventory} onAddLocalEvidence={() => {}} onOrder={({ provider }) => provider !== 'Local list' && Linking.openURL(provider === 'Blinkit' ? 'https://blinkit.com' : 'https://www.zeptonow.com')} />;
  else content = <ProgressScreen theme={theme} />;

  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}><StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} /><View style={[styles.shell, { backgroundColor: theme.background }]}>{content}{!detail && <BottomNav theme={theme} active={active} onNavigate={navigate} />}</View><MiraModal visible={!!mira} context={mira} theme={theme} onClose={() => setMira(null)} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, shell: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center' } });
