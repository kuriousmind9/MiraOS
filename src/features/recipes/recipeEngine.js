import { RECIPES } from './recipeData';

export function rankRecipes({ query = '', intent = 'For you', pantryOnly = false } = {}) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return RECIPES
    .filter((recipe) => !pantryOnly || recipe.pantryMatch >= 85)
    .filter((recipe) => !terms.length || terms.every((term) => `${recipe.name} ${recipe.meal} ${recipe.tags.join(' ')} ${recipe.ingredients.map((i) => i.name).join(' ')}`.toLowerCase().includes(term)))
    .map((recipe) => {
      const noveltyBoost = intent === 'Something new' ? Math.min(recipe.lastEatenDays, 30) : 0;
      const proteinBoost = intent === 'High protein' ? recipe.macros.protein * 1.2 : 0;
      const pantryBoost = intent === 'From pantry' ? recipe.pantryMatch * 0.25 : 0;
      return { ...recipe, rank: recipe.match + noveltyBoost + proteinBoost + pantryBoost };
    })
    .sort((a, b) => b.rank - a.rank);
}

export function applyVariant(recipe, variant) {
  if (!variant) return recipe;
  const macros = Object.fromEntries(Object.entries(recipe.macros).map(([key, value]) => [key, Math.max(0, value + (variant.delta[key] || 0))]));
  return { ...recipe, macros, activeVariant: variant };
}

export function scaleIngredient(ingredient, multiplier) {
  const amount = ingredient.amount * multiplier;
  const rounded = amount < 10 ? Math.round(amount * 10) / 10 : Math.round(amount);
  return `${rounded} ${ingredient.unit}`;
}

export function macroFitCopy(recipe, remaining = { calories: 540, protein: 35 }) {
  const proteinGap = Math.max(0, remaining.protein - recipe.macros.protein);
  if (proteinGap <= 4) return 'Closes today’s protein gap';
  if (recipe.macros.protein >= 25) return `${proteinGap} g protein remains after this`;
  return 'Best fit after verified recipes and pantry availability';
}
