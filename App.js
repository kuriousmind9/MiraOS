import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  bg: '#F6F4EF',
  card: '#FFFFFF',
  text: '#1D2A24',
  muted: '#6C7A72',
  green: '#267A55',
  greenSoft: '#E8F3EC',
  yellow: '#F4B740',
  yellowSoft: '#FFF4D8',
  red: '#B85A4B',
  blue: '#4E7D8C',
  border: '#E7E2D9',
};

const INITIAL_MEALS = [
  {
    id: 'breakfast',
    label: 'Breakfast',
    time: '8:00 AM',
    title: 'Moong Dal Chilla',
    subtitle: 'with mint curd',
    calories: 410,
    protein: 29,
    carbs: 48,
    fat: 12,
    status: 'planned',
    accent: '#F8D7A4',
    icon: 'food-variant',
    details: '2 chillas + 120 g mint curd. High-protein, light and easy to digest.',
  },
  {
    id: 'lunch',
    label: 'Lunch',
    time: '1:00 PM',
    title: 'Palak Paneer',
    subtitle: 'with brown rice + salad',
    calories: 620,
    protein: 39,
    carbs: 65,
    fat: 22,
    status: 'planned',
    accent: '#CFE9D7',
    icon: 'bowl-mix',
    details: 'Palak paneer, 1 cup brown rice and cucumber salad. Household recipe, personalized portions.',
  },
  {
    id: 'snack',
    label: 'Snack',
    time: '4:30 PM',
    title: 'Greek Yogurt Bowl',
    subtitle: 'with fruit + seeds',
    calories: 280,
    protein: 24,
    carbs: 31,
    fat: 7,
    status: 'planned',
    accent: '#E4DDF6',
    icon: 'cup',
    details: 'Greek yogurt, berries, chia and a small fruit portion.',
  },
  {
    id: 'dinner',
    label: 'Dinner',
    time: '8:00 PM',
    title: 'Egg Bhurji Bowl',
    subtitle: 'with sautéed vegetables',
    calories: 510,
    protein: 42,
    carbs: 38,
    fat: 21,
    status: 'planned',
    accent: '#F8E4A9',
    icon: 'egg-fried',
    details: 'Egg bhurji, mixed vegetables and one phulka. Designed to close the remaining protein gap.',
  },
];

const SWAPS = {
  breakfast: ['High-Protein Poha', 'Paneer Besan Chilla', 'Egg & Veg Wrap'],
  lunch: ['Rajma Rice Bowl', 'Paneer Tikka Thali', 'Chole Quinoa Bowl'],
  snack: ['Chaas + Roasted Chana', 'Fruit Curd Bowl', 'Egg Chaat'],
  dinner: ['Paneer Spinach Bowl', 'Masala Omelette Plate', 'Dal + Egg Protein Bowl'],
};

function MacroBar({ label, value, target, color }) {
  const pct = Math.min(value / target, 1);
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroLabelRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{value}/{target}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function MealCard({ meal, expanded, onPress, onMark, onSwap }) {
  const done = meal.status === 'eaten';
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, done && styles.timelineDotDone]}>
          <Ionicons name={done ? 'checkmark' : 'ellipse'} size={done ? 13 : 7} color={done ? '#fff' : COLORS.green} />
        </View>
        {meal.id !== 'dinner' && <View style={styles.timelineLine} />}
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.mealCard}>
        <View style={[styles.mealIconWrap, { backgroundColor: meal.accent }]}>
          <MaterialCommunityIcons name={meal.icon} size={28} color={COLORS.text} />
        </View>
        <View style={styles.mealMain}>
          <View style={styles.mealTopRow}>
            <View>
              <Text style={styles.mealLabel}>{meal.label} · {meal.time}</Text>
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <Text style={styles.mealSubtitle}>{meal.subtitle}</Text>
            </View>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.muted} />
          </View>
          <View style={styles.mealStatsRow}>
            <Text style={styles.mealStat}>{meal.calories} kcal</Text>
            <Text style={styles.dotSep}>•</Text>
            <Text style={styles.mealStat}>{meal.protein} g protein</Text>
          </View>

          {expanded && (
            <View style={styles.expandedArea}>
              <Text style={styles.detailsText}>{meal.details}</Text>
              <View style={styles.expandedActions}>
                <TouchableOpacity style={[styles.actionButton, styles.actionPrimary]} onPress={onMark}>
                  <Ionicons name={done ? 'refresh' : 'checkmark-circle'} size={18} color="#fff" />
                  <Text style={styles.actionPrimaryText}>{done ? 'Undo' : 'Mark eaten'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onSwap}>
                  <Ionicons name="swap-horizontal" size={18} color={COLORS.green} />
                  <Text style={styles.actionText}>Swap</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [expandedMeal, setExpandedMeal] = useState('breakfast');
  const [miraOpen, setMiraOpen] = useState(false);
  const [swapMeal, setSwapMeal] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { role: 'mira', text: 'Namaste, Raj. I am here whenever you need help adjusting today.' },
  ]);

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.status === 'eaten' ? meal.calories : 0),
        protein: acc.protein + (meal.status === 'eaten' ? meal.protein : 0),
        carbs: acc.carbs + (meal.status === 'eaten' ? meal.carbs : 0),
        fat: acc.fat + (meal.status === 'eaten' ? meal.fat : 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const markMeal = (id) => {
    setMeals((current) => current.map((meal) => meal.id === id ? { ...meal, status: meal.status === 'eaten' ? 'planned' : 'eaten' } : meal));
  };

  const applySwap = (title) => {
    setMeals((current) => current.map((meal) => meal.id === swapMeal.id ? { ...meal, title, subtitle: 'Mira-adjusted option', calories: meal.calories + 20, protein: meal.protein + 3 } : meal));
    setSwapMeal(null);
  };

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setChat((current) => [...current, { role: 'user', text: trimmed }, { role: 'mira', text: 'Got it. I will use that context when adjusting your meals.' }]);
    setMessage('');
  };

  if (activeTab !== 'Home') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>{activeTab}</Text>
          <Text style={styles.placeholderText}>This section is queued for the next sprint.</Text>
        </View>
        <BottomNav active={activeTab} onChange={setActiveTab} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>TUESDAY · 5 AUGUST</Text>
            <Text style={styles.greeting}>Good morning, Raj</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={20} color={COLORS.green} />
          </TouchableOpacity>
        </View>

        <View style={styles.nutritionCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.sectionEyebrow}>TODAY'S NUTRITION</Text>
              <Text style={styles.cardTitle}>On track for a strong day</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNumber}>94%</Text>
              <Text style={styles.scoreLabel}>planned</Text>
            </View>
          </View>
          <MacroBar label="Calories" value={totals.calories} target={1820} color={COLORS.yellow} />
          <MacroBar label="Protein" value={totals.protein} target={134} color={COLORS.green} />
          <MacroBar label="Carbs" value={totals.carbs} target={182} color={COLORS.blue} />
          <MacroBar label="Fat" value={totals.fat} target={62} color={COLORS.red} />
          <Text style={styles.helperText}>Progress updates as you mark meals eaten.</Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's menu</Text>
          <Text style={styles.sectionMeta}>{meals.filter((m) => m.status === 'eaten').length}/4 complete</Text>
        </View>

        <View>
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              expanded={expandedMeal === meal.id}
              onPress={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
              onMark={() => markMeal(meal.id)}
              onSwap={() => setSwapMeal(meal)}
            />
          ))}
        </View>

        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickCard}>
            <View style={[styles.quickIcon, { backgroundColor: COLORS.greenSoft }]}>
              <Ionicons name="share-social-outline" size={22} color={COLORS.green} />
            </View>
            <Text style={styles.quickTitle}>Today cooking menu</Text>
            <Text style={styles.quickSubtitle}>Share on WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard}>
            <View style={[styles.quickIcon, { backgroundColor: COLORS.yellowSoft }]}>
              <Ionicons name="cart-outline" size={22} color="#9A6A00" />
            </View>
            <Text style={styles.quickTitle}>Shopping</Text>
            <Text style={styles.quickSubtitle}>2 items may be low</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.smartCard}>
          <View style={styles.smartIcon}>
            <Ionicons name="sparkles" size={20} color={COLORS.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.smartTitle}>Smart suggestion</Text>
            <Text style={styles.smartText}>You may still have palak from yesterday. Confirm before lunch and I can reduce today's shopping.</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.miraFab} onPress={() => setMiraOpen(true)}>
        <View style={styles.miraDot} />
        <Text style={styles.miraText}>Mira</Text>
      </TouchableOpacity>

      <BottomNav active={activeTab} onChange={setActiveTab} />

      <Modal visible={!!swapMeal} transparent animationType="slide" onRequestClose={() => setSwapMeal(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Swap {swapMeal?.label}</Text>
            <Text style={styles.sheetSubtitle}>Mira will rebalance the rest of the day automatically.</Text>
            {(swapMeal ? SWAPS[swapMeal.id] : []).map((option) => (
              <TouchableOpacity key={option} style={styles.swapOption} onPress={() => applySwap(option)}>
                <Text style={styles.swapOptionText}>{option}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setSwapMeal(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={miraOpen} animationType="slide" onRequestClose={() => setMiraOpen(false)}>
        <SafeAreaView style={styles.miraScreen}>
          <View style={styles.miraHeader}>
            <TouchableOpacity onPress={() => setMiraOpen(false)}>
              <Ionicons name="close" size={26} color={COLORS.text} />
            </TouchableOpacity>
            <View>
              <Text style={styles.miraHeaderTitle}>Mira</Text>
              <Text style={styles.miraHeaderSubtitle}>Your nutrition coach</Text>
            </View>
            <View style={{ width: 26 }} />
          </View>
          <ScrollView contentContainerStyle={styles.chatArea}>
            {chat.map((item, index) => (
              <View key={`${item.role}-${index}`} style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.miraBubble]}>
                <Text style={[styles.bubbleText, item.role === 'user' && styles.userBubbleText]}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic" size={20} color={COLORS.green} />
            </TouchableOpacity>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Talk to Mira naturally..."
              placeholderTextColor="#8B968F"
              style={styles.input}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="arrow-up" size={19} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    ['Home', 'home-outline'],
    ['Meal Prep', 'calendar-outline'],
    ['Recipes', 'restaurant-outline'],
    ['Progress', 'stats-chart-outline'],
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map(([label, icon]) => {
        const selected = active === label;
        return (
          <TouchableOpacity key={label} style={styles.navItem} onPress={() => onChange(label)}>
            <Ionicons name={selected ? icon.replace('-outline', '') : icon} size={22} color={selected ? COLORS.green : '#89938D'} />
            <Text style={[styles.navLabel, selected && styles.navLabelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 18, paddingTop: Platform.OS === 'android' ? 18 : 10, paddingBottom: 150 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  date: { fontSize: 11, letterSpacing: 1.3, color: COLORS.muted, fontWeight: '700' },
  greeting: { marginTop: 5, fontSize: 27, lineHeight: 32, fontWeight: '800', color: COLORS.text },
  profileButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  nutritionCard: { backgroundColor: COLORS.card, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionEyebrow: { color: COLORS.green, fontWeight: '800', fontSize: 11, letterSpacing: 1.1 },
  cardTitle: { color: COLORS.text, fontSize: 19, fontWeight: '800', marginTop: 4 },
  scoreBadge: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.greenSoft, alignItems: 'center', justifyContent: 'center' },
  scoreNumber: { color: COLORS.green, fontSize: 18, fontWeight: '900' },
  scoreLabel: { color: COLORS.green, fontSize: 9, marginTop: -1 },
  macroRow: { marginTop: 11 },
  macroLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroLabel: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  macroValue: { color: COLORS.muted, fontSize: 12, fontWeight: '600' },
  track: { height: 8, borderRadius: 999, backgroundColor: '#EFECE6', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 999 },
  helperText: { color: COLORS.muted, fontSize: 11, marginTop: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  sectionMeta: { color: COLORS.muted, fontWeight: '700', fontSize: 12 },
  timelineRow: { flexDirection: 'row', alignItems: 'stretch' },
  timelineRail: { width: 28, alignItems: 'center' },
  timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.greenSoft, borderWidth: 2, borderColor: COLORS.green, alignItems: 'center', justifyContent: 'center', marginTop: 20, zIndex: 2 },
  timelineDotDone: { backgroundColor: COLORS.green },
  timelineLine: { width: 2, backgroundColor: '#D7DDD8', flex: 1, marginTop: -1 },
  mealCard: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 20, padding: 14, marginBottom: 13, borderWidth: 1, borderColor: COLORS.border },
  mealIconWrap: { width: 56, height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  mealMain: { flex: 1 },
  mealTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mealLabel: { color: COLORS.green, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  mealTitle: { color: COLORS.text, fontSize: 17, fontWeight: '900', marginTop: 3 },
  mealSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  mealStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  mealStat: { color: COLORS.text, fontWeight: '700', fontSize: 12 },
  dotSep: { marginHorizontal: 6, color: '#AAB1AD' },
  expandedArea: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 13, paddingTop: 12 },
  detailsText: { color: COLORS.muted, lineHeight: 19, fontSize: 13 },
  expandedActions: { flexDirection: 'row', marginTop: 12, gap: 9 },
  actionButton: { flex: 1, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, backgroundColor: COLORS.greenSoft },
  actionPrimary: { backgroundColor: COLORS.green },
  actionText: { color: COLORS.green, fontWeight: '800', fontSize: 12 },
  actionPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  quickRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  quickCard: { flex: 1, backgroundColor: COLORS.card, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  quickIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  quickTitle: { color: COLORS.text, fontWeight: '900', fontSize: 14 },
  quickSubtitle: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  smartCard: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.greenSoft, borderRadius: 20, padding: 16, marginTop: 14 },
  smartIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  smartTitle: { color: COLORS.text, fontWeight: '900', fontSize: 14 },
  smartText: { color: COLORS.muted, marginTop: 4, lineHeight: 18, fontSize: 12 },
  miraFab: { position: 'absolute', right: 20, bottom: 92, backgroundColor: COLORS.text, borderRadius: 28, height: 52, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 9, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  miraDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#A7E2BD' },
  miraText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 78, backgroundColor: '#FFFFFFF7', borderTopWidth: 1, borderTopColor: COLORS.border, flexDirection: 'row', paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 20 : 8 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  navLabel: { fontSize: 10, color: '#89938D', fontWeight: '700' },
  navLabelActive: { color: COLORS.green },
  modalBackdrop: { flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36 },
  sheetHandle: { width: 48, height: 5, borderRadius: 3, backgroundColor: '#CBC6BD', alignSelf: 'center', marginBottom: 18 },
  sheetTitle: { fontSize: 23, fontWeight: '900', color: COLORS.text },
  sheetSubtitle: { color: COLORS.muted, marginTop: 6, marginBottom: 16, lineHeight: 19 },
  swapOption: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.border },
  swapOptionText: { color: COLORS.text, fontSize: 15, fontWeight: '800' },
  cancelButton: { alignItems: 'center', padding: 12, marginTop: 4 },
  cancelText: { color: COLORS.red, fontWeight: '800' },
  miraScreen: { flex: 1, backgroundColor: COLORS.bg },
  miraHeader: { height: 68, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, backgroundColor: COLORS.card },
  miraHeaderTitle: { color: COLORS.text, fontWeight: '900', fontSize: 18, textAlign: 'center' },
  miraHeaderSubtitle: { color: COLORS.muted, fontSize: 11, textAlign: 'center' },
  chatArea: { padding: 18, gap: 10 },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 11 },
  miraBubble: { backgroundColor: COLORS.card, alignSelf: 'flex-start', borderWidth: 1, borderColor: COLORS.border },
  userBubble: { backgroundColor: COLORS.green, alignSelf: 'flex-end' },
  bubbleText: { color: COLORS.text, lineHeight: 19 },
  userBubbleText: { color: '#fff' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.card },
  micButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.greenSoft, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, minHeight: 42, backgroundColor: COLORS.bg, borderRadius: 18, paddingHorizontal: 15, color: COLORS.text },
  sendButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  placeholderTitle: { fontSize: 30, fontWeight: '900', color: COLORS.text },
  placeholderText: { color: COLORS.muted, textAlign: 'center', marginTop: 10 },
});
