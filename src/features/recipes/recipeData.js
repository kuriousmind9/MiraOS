export const RECIPES = [
  {
    id: 'moong-chilla', name: 'Moong Dal Chilla', meal: 'Breakfast', image: 0,
    verified: true, lastEatenDays: 12, match: 98, prepMinutes: 25,
    tags: ['High protein', 'Pantry ready', 'Vegetarian'],
    macros: { calories: 320, protein: 22, carbs: 38, fat: 6, fiber: 8 },
    pantryMatch: 100,
    ingredients: [
      { name: 'Soaked moong dal', amount: 90, unit: 'g' },
      { name: 'Paneer', amount: 60, unit: 'g' },
      { name: 'Onion', amount: 40, unit: 'g' },
      { name: 'Spinach', amount: 35, unit: 'g' },
      { name: 'Coriander & spices', amount: 1, unit: 'portion' },
    ],
    steps: ['Blend the soaked dal with ginger and spices.', 'Fold in onion and spinach.', 'Cook two chillas on a lightly greased tawa.', 'Fill with crumbled paneer and serve warm.'],
  },
  {
    id: 'rajma-salad', name: 'Rajma + Crunchy Salad', meal: 'Lunch', image: 1,
    verified: true, lastEatenDays: 19, match: 94, prepMinutes: 35,
    tags: ['Fiber rich', 'Meal prep', 'Vegan'],
    macros: { calories: 420, protein: 18, carbs: 55, fat: 10, fiber: 14 },
    pantryMatch: 86,
    ingredients: [
      { name: 'Cooked rajma', amount: 220, unit: 'g' },
      { name: 'Tomato', amount: 70, unit: 'g' },
      { name: 'Cucumber', amount: 100, unit: 'g' },
      { name: 'Onion', amount: 40, unit: 'g' },
      { name: 'Lemon & spices', amount: 1, unit: 'portion' },
    ],
    steps: ['Warm the cooked rajma with its masala.', 'Chop the vegetables and season with lemon.', 'Serve the rajma and salad as separate portions.'],
  },
  {
    id: 'yogurt-berries', name: 'Greek Yogurt Berry Bowl', meal: 'Snack', image: 2,
    verified: true, lastEatenDays: 3, match: 89, prepMinutes: 5,
    tags: ['No cook', 'Quick', 'High protein'],
    macros: { calories: 180, protein: 12, carbs: 18, fat: 4, fiber: 5 },
    pantryMatch: 72,
    ingredients: [
      { name: 'Greek yogurt', amount: 180, unit: 'g' },
      { name: 'Mixed berries', amount: 80, unit: 'g' },
      { name: 'Chia seeds', amount: 8, unit: 'g' },
    ],
    steps: ['Spoon yogurt into a bowl.', 'Top with berries and chia seeds.'],
  },
  {
    id: 'palak-paneer', name: 'Palak Paneer + Roti', meal: 'Dinner', image: 3,
    verified: true, lastEatenDays: 27, match: 96, prepMinutes: 40,
    tags: ['Household favorite', 'Iron rich', 'High protein'],
    macros: { calories: 500, protein: 28, carbs: 45, fat: 16, fiber: 9 },
    pantryMatch: 91,
    ingredients: [
      { name: 'Paneer', amount: 160, unit: 'g' },
      { name: 'Spinach', amount: 250, unit: 'g' },
      { name: 'Tomato', amount: 70, unit: 'g' },
      { name: 'Whole-wheat atta', amount: 60, unit: 'g' },
      { name: 'Spices', amount: 1, unit: 'portion' },
    ],
    steps: ['Blanch and blend spinach.', 'Cook tomato and spices until aromatic.', 'Fold in spinach and paneer; simmer gently.', 'Make rotis and portion separately for each person.'],
  },
];

export const RECIPE_VARIANTS = {
  'palak-paneer': [
    { id: 'balanced', label: 'Balanced', delta: { calories: 0, protein: 0, carbs: 0, fat: 0 }, note: 'The verified household recipe.' },
    { id: 'high-protein', label: 'High protein', delta: { calories: 70, protein: 17, carbs: 1, fat: 3 }, note: 'More paneer plus a hung-curd finish.' },
    { id: 'lower-fat', label: 'Lower fat', delta: { calories: -80, protein: -2, carbs: 0, fat: -8 }, note: 'Reduced paneer, no cream, more spinach.' },
    { id: 'pantry', label: 'Pantry fit', delta: { calories: -25, protein: -3, carbs: 5, fat: -3 }, note: 'Uses the 200 g paneer currently available.' },
  ],
};

export const DEFAULT_HOUSEHOLD = [
  { id: 'tina', name: 'Tina', portion: 1, target: 'Fat loss' },
  { id: 'partner', name: 'Partner', portion: 1.35, target: 'Muscle gain' },
];
