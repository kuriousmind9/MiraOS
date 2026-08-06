export const DEFAULT_INVENTORY = [
  { id: 'paneer', name: 'Paneer', category: 'Dairy', amount: 200, unit: 'g', dailyUse: 120, confidence: 0.58, emoji: '◻️', source: 'Recipe deductions', lastEvidence: '2 days ago' },
  { id: 'milk', name: 'Milk', category: 'Dairy', amount: 500, unit: 'ml', dailyUse: 320, confidence: 0.74, emoji: '🥛', source: 'Local receipt', lastEvidence: 'Yesterday' },
  { id: 'curd', name: 'Curd', category: 'Dairy', amount: 250, unit: 'g', dailyUse: 180, confidence: 0.44, emoji: '🥣', source: 'Estimated usage', lastEvidence: '4 days ago' },
  { id: 'moong', name: 'Moong Dal', category: 'Pulses', amount: 2, unit: 'kg', dailyUse: 0.08, confidence: 0.94, emoji: '🟡', source: 'Blinkit order', lastEvidence: 'Aug 1' },
  { id: 'oats', name: 'Oats', category: 'Grains', amount: 1.2, unit: 'kg', dailyUse: 0.06, confidence: 0.89, emoji: '🌾', source: 'Receipt scan', lastEvidence: 'Aug 3' },
  { id: 'rice', name: 'Basmati Rice', category: 'Grains', amount: 2, unit: 'kg', dailyUse: 0.1, confidence: 0.96, emoji: '🍚', source: 'Zepto order', lastEvidence: 'Aug 2' },
];

export function daysRemaining(item) {
  if (!item.dailyUse) return 99;
  return Math.max(0, Math.floor(item.amount / item.dailyUse));
}

export function inventoryStatus(item) {
  const days = daysRemaining(item);
  if (days <= 2) return 'low';
  if (item.confidence < 0.6) return 'verify';
  return 'stocked';
}

export function overallConfidence(items) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.confidence, 0) / items.length * 100);
}

export function addEvidence(items, evidence) {
  const normalized = evidence.trim();
  if (!normalized) return items;
  return items.map((item) => normalized.toLowerCase().includes(item.name.toLowerCase())
    ? { ...item, confidence: Math.min(0.98, item.confidence + 0.18), source: 'Local shopping note', lastEvidence: 'Just now' }
    : item);
}
