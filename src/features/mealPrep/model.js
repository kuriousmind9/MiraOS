export const WEEK_DAYS = [
  { key: 'mon', short: 'Mon', date: 5 },
  { key: 'tue', short: 'Tue', date: 6 },
  { key: 'wed', short: 'Wed', date: 7 },
  { key: 'thu', short: 'Thu', date: 8 },
  { key: 'fri', short: 'Fri', date: 9 },
  { key: 'sat', short: 'Sat', date: 10 },
  { key: 'sun', short: 'Sun', date: 11 },
];

export const HOUSEHOLD = [
  { id: 'tina', name: 'Tina', target: '1,650 kcal · 95g protein' },
  { id: 'raj', name: 'Raj', target: '2,100 kcal · 150g protein' },
];

const meal = (id, type, name, time, kcal, protein, imageIndex, tina, raj) => ({
  id,
  type,
  name,
  time,
  kcal,
  protein,
  imageIndex,
  locked: false,
  decision: 'draft',
  portions: [
    { memberId: 'tina', amount: tina },
    { memberId: 'raj', amount: raj },
  ],
});

export const INITIAL_WEEK = {
  mon: [
    meal('mon-breakfast', 'Breakfast', 'Moong Chilla', '7:30 AM', 320, 22, 0, '2 chillas · 180g', '3 chillas · 270g'),
    meal('mon-lunch', 'Lunch', 'Rajma + Salad', '1:00 PM', 420, 18, 1, '1 bowl · 280g', '1.5 bowls · 420g'),
    meal('mon-snack', 'Snack', 'Greek Yogurt + Berries', '4:30 PM', 180, 12, 2, '150g', '250g'),
    meal('mon-dinner', 'Dinner', 'Palak Paneer + Roti', '7:30 PM', 500, 28, 3, '220g + 1 roti', '330g + 2 rotis'),
  ],
  tue: [
    meal('tue-breakfast', 'Breakfast', 'Vegetable Poha + Curd', '7:30 AM', 360, 19, 0, '230g + 80g', '340g + 120g'),
    meal('tue-lunch', 'Lunch', 'Leftover Rajma Bowl', '1:00 PM', 390, 20, 1, '250g', '390g'),
    meal('tue-snack', 'Snack', 'Fruit + Hung Curd', '4:30 PM', 170, 13, 2, '160g', '240g'),
    meal('tue-dinner', 'Dinner', 'Egg Palak Curry + Roti', '7:30 PM', 510, 32, 3, '2 eggs + 1 roti', '4 eggs + 2 rotis'),
  ],
  wed: [
    meal('wed-breakfast', 'Breakfast', 'Paneer Besan Chilla', '7:30 AM', 380, 27, 0, '2 chillas', '3 chillas'),
    meal('wed-lunch', 'Lunch', 'Chole Grain Bowl', '1:00 PM', 450, 21, 1, '290g', '430g'),
    meal('wed-snack', 'Snack', 'Spiced Buttermilk Bowl', '4:30 PM', 160, 11, 2, '180g', '280g'),
    meal('wed-dinner', 'Dinner', 'Dal Palak + Rice', '7:30 PM', 480, 25, 3, '260g', '410g'),
  ],
  thu: [
    meal('thu-breakfast', 'Breakfast', 'Moong Chilla', '7:30 AM', 320, 22, 0, '2 chillas · 180g', '3 chillas · 270g'),
    meal('thu-lunch', 'Lunch', 'Rajma + Salad', '1:00 PM', 420, 18, 1, '1 bowl · 280g', '1.5 bowls · 420g'),
    meal('thu-snack', 'Snack', 'Greek Yogurt + Berries', '4:30 PM', 180, 12, 2, '150g', '250g'),
    meal('thu-dinner', 'Dinner', 'Palak Paneer + Roti', '7:30 PM', 500, 28, 3, '220g + 1 roti', '330g + 2 rotis'),
  ],
  fri: [
    meal('fri-breakfast', 'Breakfast', 'Masala Egg Toast', '7:30 AM', 390, 26, 0, '2 eggs + 1 toast', '4 eggs + 2 toast'),
    meal('fri-lunch', 'Lunch', 'Dal Tadka + Rice', '1:00 PM', 430, 22, 1, '280g', '420g'),
    meal('fri-snack', 'Snack', 'Dahi Chaat', '4:30 PM', 190, 12, 2, '170g', '260g'),
    meal('fri-dinner', 'Dinner', 'Family dinner out', '8:00 PM', 620, 30, 3, 'Guided portion', 'Guided portion'),
  ],
  sat: [
    meal('sat-breakfast', 'Breakfast', 'Paneer Paratha + Curd', '8:30 AM', 460, 25, 0, '1 paratha + 100g', '2 parathas + 150g'),
    meal('sat-lunch', 'Lunch', 'Kala Chana Salad', '1:30 PM', 410, 23, 1, '280g', '420g'),
    meal('sat-snack', 'Snack', 'Seasonal Fruit Bowl', '5:00 PM', 160, 8, 2, '180g', '280g'),
    meal('sat-dinner', 'Dinner', 'Kadai Paneer + Roti', '8:00 PM', 570, 31, 3, '230g + 1 roti', '350g + 2 rotis'),
  ],
  sun: [
    meal('sun-breakfast', 'Breakfast', 'Idli Sambar', '8:30 AM', 350, 18, 0, '3 idli + 180g', '5 idli + 250g'),
    meal('sun-lunch', 'Lunch', 'Vegetable Biryani + Raita', '1:30 PM', 510, 21, 1, '260g + 100g', '400g + 150g'),
    meal('sun-snack', 'Snack', 'Lassi', '5:00 PM', 170, 11, 2, '200ml', '300ml'),
    meal('sun-dinner', 'Dinner', 'Moong Khichdi + Curd', '7:30 PM', 430, 24, 3, '270g', '420g'),
  ],
};

export const SWAPS = {
  Breakfast: [
    { name: 'Paneer Besan Chilla', kcal: 360, protein: 27 },
    { name: 'Egg & Vegetable Poha', kcal: 345, protein: 24 },
    { name: 'Idli Sambar + Curd', kcal: 350, protein: 20 },
  ],
  Lunch: [
    { name: 'Chole Grain Bowl', kcal: 440, protein: 23 },
    { name: 'Dal Palak + Rice', kcal: 410, protein: 24 },
    { name: 'Paneer Tikka Bowl', kcal: 450, protein: 31 },
  ],
  Snack: [
    { name: 'Hung Curd Chaat', kcal: 175, protein: 15 },
    { name: 'Egg Chaat', kcal: 190, protein: 17 },
    { name: 'Fruit + Greek Yogurt', kcal: 180, protein: 13 },
  ],
  Dinner: [
    { name: 'Egg Palak Curry + Roti', kcal: 490, protein: 32 },
    { name: 'Paneer Tikka + Dal', kcal: 510, protein: 35 },
    { name: 'High-Protein Khichdi', kcal: 470, protein: 29 },
  ],
};

export function summarizeDay(meals) {
  return meals.reduce(
    (sum, item) => ({ kcal: sum.kcal + item.kcal, protein: sum.protein + item.protein }),
    { kcal: 0, protein: 0 },
  );
}

export function nextSwap(meal) {
  const options = SWAPS[meal.type] || [];
  const currentIndex = options.findIndex((item) => item.name === meal.name);
  return options[(currentIndex + 1) % options.length] || meal;
}
