export const DEFAULT_PROGRESS = {
  weight: [83.0, 82.2, 81.1, 80.2, 79.6, 79.3, 80.0],
  compliance: { nutrition: 92, protein: 86, fiber: 93 },
  habits: [
    { id: 'protein', label: 'Hit protein range', days: 6, icon: 'nutrition' },
    { id: 'steps', label: '10k steps', days: 5, icon: 'walk' },
    { id: 'sugar', label: 'No sugar drinks', days: 7, icon: 'water' },
    { id: 'dinner', label: 'Early dinner', days: 4, icon: 'time' },
  ],
};

export function weeklyMessage(score) {
  if (score >= 90) return 'Strong consistency. Keep the rhythm that is working.';
  if (score >= 75) return 'You adapted well. A few small recoveries can lift next week.';
  return 'Life was busy this week. We’ll make the next plan easier to follow.';
}

export function weightChange(values) {
  if (values.length < 2) return 0;
  return Number((values[values.length - 1] - values[0]).toFixed(1));
}
