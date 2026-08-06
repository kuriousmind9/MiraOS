import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const ATLAS = require('./assets/meal-atlas.jpg');

const C = {
  bg: '#020E18',
  bg2: '#061521',
  panel: '#0C1B27',
  panel2: '#101F2B',
  border: '#1B3240',
  text: '#F3F7F8',
  muted: '#91A0AB',
  green: '#5CE778',
  greenDark: '#173E2B',
  cyan: '#19D6DB',
  purple: '#B768FF',
  amber: '#FFB22C',
  red: '#FF5F64',
  blue: '#5794FF',
};

const MEALS = [
  { id: 'breakfast', name: 'Moong Chilla', type: 'Breakfast', time: '7:30 AM', kcal: 320, protein: 22, fat: 6, carbs: 38, photo: 0, status: 'Completed' },
  { id: 'lunch', name: 'Rajma + Salad', type: 'Lunch', time: '1:00 PM', kcal: 420, protein: 18, fat: 10, carbs: 55, photo: 1, status: 'In 2h 15m' },
  { id: 'snack', name: 'Greek Yogurt + Berries', type: 'Snack', time: '4:30 PM', kcal: 180, protein: 12, fat: 4, carbs: 18, photo: 2, status: 'Adaptive' },
  { id: 'dinner', name: 'Palak Paneer + Roti', type: 'Dinner', time: '7:30 PM', kcal: 500, protein: 28, fat: 16, carbs: 45, photo: 3, status: 'Planned' },
];

const PANTRY_LOW = [
  { name: 'Paneer', qty: '200 g left', emoji: '◻️' },
  { name: 'Milk', qty: '500 ml left', emoji: '🥛' },
  { name: 'Curd', qty: '250 g left', emoji: '🥣' },
];

const PANTRY_OK = [
  { name: 'Moong Dal', qty: '2 kg', note: 'Good until Sep 2', emoji: '🟡' },
  { name: 'Oats', qty: '1.2 kg', note: 'Good until Aug 20', emoji: '🌾' },
  { name: 'Basmati Rice', qty: '2 kg', note: 'Good until Sep 10', emoji: '🍚' },
];

function AtlasPhoto({ index, size = 60 }) {
  const x = index % 2;
  const y = Math.floor(index / 2);
  return (
    <View style={[styles.photoCrop, { width: size, height: size, borderRadius: size * 0.22 }]}>
      <Image source={ATLAS} style={{ position: 'absolute', width: size * 2, height: size * 2, left: -x * size, top: -y * size }} />
    </View>
  );
}

function Glass({ children, style }) {
  return <View style={[styles.glass, style]}>{children}</View>;
}

function Orb({ size = 84 }) {
  return (
    <View style={[styles.orbGlow, { width: size + 22, height: size + 22, borderRadius: (size + 22) / 2 }]}>
      <View style={[styles.orb, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.orbPurple, { width: size * 0.72, height: size * 0.72, borderRadius: size }]} />
        <View style={[styles.orbBlue, { width: size * 0.58, height: size * 0.58, borderRadius: size }]} />
        <View style={[styles.orbShine, { width: size * 0.2, height: size * 0.38, borderRadius: size }]} />
      </View>
    </View>
  );
}

function Ring({ value, label, color = C.green, size = 118 }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
        <View style={[styles.ringInner, { width: size - 22, height: size - 22, borderRadius: size }]}>
          <Text style={[styles.ringValue, { fontSize: size * 0.31 }]}>{value}</Text>
          {label && <Text style={styles.ringLabel}>{label}</Text>}
        </View>
      </View>
    </View>
  );
}

function MiniProgress({ label, value, detail }) {
  return (
    <View style={styles.macroRow}>
      <View style={styles.rowBetween}><Text style={styles.smallWhite}>{label}</Text><Text style={styles.smallWhite}>{detail}</Text></View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${value}%` }]} /></View>
    </View>
  );
}

function Header({ title, subtitle, back, action = 'notifications-outline' }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerSide} onPress={back}>{back ? <Ionicons name="chevron-back" size={25} color={C.text} /> : <View style={styles.avatar}><Text style={styles.avatarText}>T</Text></View>}</TouchableOpacity>
      <View style={styles.headerTitleWrap}><Text style={styles.headerTitle}>{title}</Text>{subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}</View>
      <TouchableOpacity style={styles.headerSide}><Ionicons name={action} size={23} color={C.text} /></TouchableOpacity>
    </View>
  );
}

function HomeScreen({ openMira, goPlan }) {
  const [done, setDone] = useState(['breakfast']);
  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <Header title="Good Morning, Tina 👋" subtitle="Let's make today amazing!" />

      <Glass style={styles.scoreCard}>
        <Text style={styles.cardTitle}>Today’s Nutrition Score</Text>
        <View style={styles.scoreBody}>
          <Ring value="92" label="/100" />
          <View style={{ flex: 1 }}>
            <Text style={styles.excellent}>Excellent! 🎉</Text>
            <Text style={styles.bodyText}>You’re doing great.{`\n`}Keep the momentum.</Text>
            <TouchableOpacity style={styles.darkButton}><Text style={styles.darkButtonText}>View Breakdown</Text><Ionicons name="arrow-forward" size={15} color={C.text} /></TouchableOpacity>
          </View>
        </View>
      </Glass>

      <Glass style={styles.proteinCallout}>
        <Text style={styles.flexEmoji}>💪</Text>
        <Text style={styles.calloutText}>You’re <Text style={styles.bold}>18g</Text> away from hitting{`\n`}your protein goal</Text>
        <View style={styles.smallRing}><Ionicons name="nutrition" size={15} color={C.text} /></View>
      </Glass>

      <View style={styles.sectionHeadingRow}><Text style={styles.sectionTitle}>Today’s Plan</Text><TouchableOpacity onPress={goPlan}><Text style={styles.link}>View Plan</Text></TouchableOpacity></View>
      {MEALS.map((meal) => {
        const isDone = done.includes(meal.id);
        return (
          <TouchableOpacity key={meal.id} activeOpacity={0.85} onPress={() => setDone((v) => isDone ? v.filter((x) => x !== meal.id) : [...v, meal.id])}>
            <Glass style={styles.compactMeal}>
              <AtlasPhoto index={meal.photo} size={52} />
              <View style={{ flex: 1 }}><Text style={styles.mealName}>{meal.type}</Text><Text style={styles.mealSub}>{meal.name}</Text></View>
              <View style={[styles.statusBadge, meal.status === 'Adaptive' && styles.purpleBadge, meal.status === 'Planned' && styles.blueBadge]}><Text style={[styles.statusText, meal.status === 'Adaptive' && { color: '#DC8BFF' }, meal.status === 'Planned' && { color: '#75A9FF' }]}>{isDone ? 'Completed' : meal.status}</Text></View>
              <Ionicons name={isDone ? 'checkmark-circle' : meal.status === 'Adaptive' ? 'sparkles' : 'time-outline'} size={23} color={isDone ? C.green : meal.status === 'Adaptive' ? C.purple : C.text} />
            </Glass>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.miraHome} onPress={openMira}><View style={styles.wave} /><Orb size={78} /><Text style={styles.askMira}>Ask Mira</Text><Text style={styles.miraCaption}>Your AI Nutrition Coach</Text></TouchableOpacity>
    </ScrollView>
  );
}

function PlanScreen() {
  const [day, setDay] = useState(3);
  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <Header title="Today  •  Aug 8" back={() => {}} action="calendar-outline" />
      <View style={styles.days}>{['Mon\n5', 'Tue\n6', 'Wed\n7', 'Thu\n8', 'Fri\n9', 'Sat\n10', 'Sun\n11'].map((d, i) => <TouchableOpacity key={d} style={[styles.day, day === i && styles.dayActive]} onPress={() => setDay(i)}><Text style={[styles.dayText, day === i && styles.dayTextActive]}>{d}</Text></TouchableOpacity>)}</View>
      <View style={styles.macros}><MiniProgress label="Calories" value={93} detail="1,680 / 1,800 kcal" /><MiniProgress label="Protein" value={86} detail="112 / 130 g" /><MiniProgress label="Fiber" value={93} detail="28 / 30 g" /></View>
      <Text style={styles.sectionTitle}>Meals</Text>
      {MEALS.map((meal) => <Glass key={meal.id} style={styles.planMeal}><AtlasPhoto index={meal.photo} size={86} /><View style={{ flex: 1, paddingVertical: 2 }}><View style={styles.rowBetween}><Text style={styles.mealType}>{meal.type}</Text><Text style={styles.mealTime}>{meal.time}  ›</Text></View><Text style={styles.planMealName}>{meal.name}</Text><Text style={styles.nutritionLine}>{meal.kcal} kcal · {meal.protein}g P · {meal.fat}g F · {meal.carbs}g C</Text></View></Glass>)}
      <TouchableOpacity style={styles.generate}><Ionicons name="sparkles" size={30} color="#D59BFF" /><View><Text style={styles.generateTitle}>Need to mix it up?</Text><Text style={styles.generateSub}>Generate new plan</Text></View></TouchableOpacity>
    </ScrollView>
  );
}

function GroceryScreen() {
  const [filter, setFilter] = useState('All');
  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <Header title="Pantry" back={() => {}} action="options-outline" />
      <Glass style={styles.pantryHero}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>Smart Insights</Text><Text style={styles.bodyText}>You’re covered until</Text><Text style={styles.covered}>Thursday</Text><TouchableOpacity style={styles.darkButton}><Text style={styles.darkButtonText}>View Low Items (3)</Text><Ionicons name="arrow-forward" size={15} color={C.text} /></TouchableOpacity></View><Text style={styles.groceryBag}>🛍️</Text></Glass>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>{['All', 'Grains', 'Pulses', 'Dairy', 'Veggies', 'Others'].map((f) => <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filter, filter === f && styles.filterActive]}><Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text></TouchableOpacity>)}</ScrollView>
      <Glass style={styles.stockCard}><Text style={styles.stockTitle}>Low in Stock  <Text style={{ color: C.red }}>3</Text></Text>{PANTRY_LOW.map((item) => <View key={item.name} style={styles.stockRow}><View style={styles.stockEmoji}><Text style={{ fontSize: 25 }}>{item.emoji}</Text></View><View style={{ flex: 1 }}><Text style={styles.stockName}>{item.name}</Text><Text style={styles.stockNote}>{item.qty}</Text></View><TouchableOpacity style={styles.buy}><Text style={styles.buyText}>Buy Now</Text></TouchableOpacity></View>)}</Glass>
      <Glass style={styles.stockCard}><Text style={styles.stockTitle}>Well Stocked  <Text style={styles.badgeCount}>8</Text></Text>{PANTRY_OK.map((item) => <View key={item.name} style={styles.stockRow}><View style={styles.stockEmoji}><Text style={{ fontSize: 22 }}>{item.emoji}</Text></View><View style={{ flex: 1 }}><Text style={styles.stockName}>{item.name}</Text><Text style={styles.stockNote}>{item.note}</Text></View><Text style={styles.qty}>{item.qty}</Text></View>)}</Glass>
      <Glass style={styles.orderCard}><Text style={styles.stockNote}>Order instantly from</Text><View style={styles.orderButtons}><TouchableOpacity style={[styles.brandButton, { backgroundColor: '#FFD928' }]}><Text style={styles.brandDark}>▣ Blinkit</Text></TouchableOpacity><TouchableOpacity style={[styles.brandButton, { backgroundColor: '#8F35C7' }]}><Text style={styles.brandLight}>Z  Zepto</Text></TouchableOpacity><TouchableOpacity style={[styles.brandButton, { backgroundColor: '#FF5835' }]}><Text style={styles.brandLight}>◈ BigBasket</Text></TouchableOpacity></View></Glass>
    </ScrollView>
  );
}

function RecipesScreen() {
  const [query, setQuery] = useState('');
  const shown = MEALS.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <Header title="Recipes" back={() => {}} action="heart-outline" />
      <View style={styles.search}><Ionicons name="search" size={20} color={C.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search recipes or ingredients" placeholderTextColor={C.muted} style={styles.searchInput} /></View>
      <TouchableOpacity style={styles.recipeAI}><Ionicons name="sparkles" size={28} color="#DA9BFF" /><View style={{ flex: 1 }}><Text style={styles.generateTitle}>Create with Mira</Text><Text style={styles.generateSub}>Tell her your pantry and remaining macros</Text></View><Ionicons name="arrow-forward" size={19} color={C.text} /></TouchableOpacity>
      <View style={styles.sectionHeadingRow}><Text style={styles.sectionTitle}>For you</Text><Text style={styles.link}>View all</Text></View>
      <View style={styles.recipeGrid}>{shown.map((meal) => <TouchableOpacity key={meal.id} style={styles.recipeCard}><AtlasPhoto index={meal.photo} size={146} /><Text style={styles.recipeName}>{meal.name}</Text><Text style={styles.recipeMeta}>{meal.kcal} kcal · {meal.protein}g protein</Text><View style={styles.recipeBottom}><Text style={styles.match}>96% match</Text><Ionicons name="heart-outline" size={18} color={C.muted} /></View></TouchableOpacity>)}</View>
    </ScrollView>
  );
}

function ProgressScreen() {
  const [range, setRange] = useState('7D');
  const points = [20, 30, 45, 55, 64, 70, 59];
  return (
    <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
      <Header title="Progress" back={() => {}} action="calendar-outline" />
      <View style={styles.rangeRow}>{['7D', '30D', '90D', '1Y', 'All'].map((r) => <TouchableOpacity key={r} onPress={() => setRange(r)} style={[styles.range, range === r && styles.rangeActive]}><Text style={[styles.rangeText, range === r && styles.rangeTextActive]}>{r}</Text></TouchableOpacity>)}</View>
      <Glass style={styles.chartCard}><View style={styles.rowBetween}><View><Text style={styles.cardTitle}>Weight Trend</Text><Text style={styles.stockNote}>vs last 7 days</Text></View><Text style={styles.loss}>−1.6 kg</Text></View><View style={styles.chart}><View style={styles.gridLine} /><View style={[styles.gridLine, { top: '50%' }]} /><View style={[styles.gridLine, { top: '100%' }]} /><View style={styles.areaFill} />{points.map((p, i) => <View key={i} style={[styles.chartPoint, { left: `${5 + i * 15}%`, top: `${p}%` }]} />)}<View style={[styles.chartLine, { transform: [{ rotate: '9deg' }] }]} /></View><View style={styles.chartLabels}><Text style={styles.stockNote}>Aug 2</Text><Text style={styles.stockNote}>Aug 4</Text><Text style={styles.stockNote}>Aug 6</Text><Text style={styles.stockNote}>Aug 8</Text></View></Glass>
      <Glass style={styles.overview}><View style={styles.rowBetween}><Text style={styles.cardTitle}>Nutrition Overview</Text><Text style={styles.stockNote}>This Week ›</Text></View><View style={styles.ringsRow}><View style={styles.miniRingBlock}><Ring value="92%" color={C.green} size={74} /><Text style={styles.ringSub}>On Target</Text></View><View style={styles.miniRingBlock}><Ring value="86%" color={C.amber} size={74} /><Text style={styles.ringSub}>112 / 130g</Text></View><View style={styles.miniRingBlock}><Ring value="93%" color={C.green} size={74} /><Text style={styles.ringSub}>28 / 30g</Text></View></View></Glass>
      <Glass style={styles.habits}><View style={styles.rowBetween}><Text style={styles.cardTitle}>Habits</Text><Text style={styles.stockNote}>This Week ›</Text></View>{[['Hit Protein Goal', 6, C.green, 'nutrition'], ['10k Steps', 5, C.green, 'walk'], ['No Sugar Drinks', 7, C.green, 'water'], ['Early Dinner', 4, C.amber, 'time']].map(([name, count, color, icon]) => <View key={name} style={styles.habitRow}><Ionicons name={icon} size={16} color={color} /><Text style={styles.habitName}>{name}</Text><View style={styles.habitDots}>{[1,2,3,4,5,6,7].map((n) => <View key={n} style={[styles.habitDot, n <= count && { backgroundColor: color }]} />)}</View><Text style={styles.habitCount}>{count}/7 days</Text></View>)}</Glass>
    </ScrollView>
  );
}

function Nav({ active, setActive }) {
  const tabs = [['Home', 'home'], ['Plan', 'calendar'], ['Recipes', 'restaurant'], ['Grocery', 'cart'], ['Progress', 'stats-chart']];
  return <View style={styles.nav}>{tabs.map(([name, icon]) => { const on = active === name; return <TouchableOpacity key={name} style={styles.navItem} onPress={() => setActive(name)}><Ionicons name={on ? icon : `${icon}-outline`} size={22} color={on ? C.green : '#687884'} /><Text style={[styles.navLabel, on && styles.navLabelOn]}>{name}</Text></TouchableOpacity>; })}</View>;
}

export default function App() {
  const [active, setActive] = useState('Home');
  const [mira, setMira] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([{ from: 'mira', text: 'Namaste, Tina. What would you like to adjust today?' }]);
  const screen = active === 'Home' ? <HomeScreen openMira={() => setMira(true)} goPlan={() => setActive('Plan')} /> : active === 'Plan' ? <PlanScreen /> : active === 'Recipes' ? <RecipesScreen /> : active === 'Grocery' ? <GroceryScreen /> : <ProgressScreen />;
  const send = () => { if (!message.trim()) return; setChat((c) => [...c, { from: 'user', text: message }, { from: 'mira', text: 'Got it. I’ll rebalance today while keeping your protein target in focus.' }]); setMessage(''); };
  return (
    <SafeAreaView style={styles.safe}><StatusBar style="light" /><View style={styles.shell}>{screen}<Nav active={active} setActive={setActive} /></View>
      <Modal visible={mira} animationType="slide" onRequestClose={() => setMira(false)}><SafeAreaView style={styles.chatScreen}><View style={styles.chatHeader}><TouchableOpacity onPress={() => setMira(false)}><Ionicons name="chevron-down" size={26} color={C.text} /></TouchableOpacity><View style={styles.chatIdentity}><Orb size={36} /><View><Text style={styles.chatName}>Mira</Text><Text style={styles.chatRole}>Your AI Nutrition Coach</Text></View></View><View style={{ width: 26 }} /></View><ScrollView contentContainerStyle={styles.chatBody}>{chat.map((m, i) => <View key={i} style={[styles.bubble, m.from === 'user' && styles.userBubble]}><Text style={[styles.bubbleText, m.from === 'user' && { color: '#02120B' }]}>{m.text}</Text></View>)}</ScrollView><View style={styles.composer}><TouchableOpacity style={styles.mic}><Ionicons name="mic" size={20} color={C.green} /></TouchableOpacity><TextInput value={message} onChangeText={setMessage} onSubmitEditing={send} placeholder="Tell Mira naturally…" placeholderTextColor={C.muted} style={styles.input} /><TouchableOpacity style={styles.send} onPress={send}><Ionicons name="arrow-up" size={19} color="#02120B" /></TouchableOpacity></View></SafeAreaView></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg }, shell: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', backgroundColor: C.bg }, screen: { padding: 20, paddingTop: Platform.OS === 'android' ? 30 : 10, paddingBottom: 110 },
  header: { minHeight: 82, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, headerSide: { width: 36, alignItems: 'flex-start' }, headerTitleWrap: { flex: 1 }, headerTitle: { color: C.text, fontSize: 24, fontWeight: '700', letterSpacing: -0.5 }, headerSubtitle: { color: C.muted, fontSize: 14, marginTop: 4 }, avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E4C0A2', borderWidth: 2, borderColor: C.text, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#251A13', fontWeight: '900' },
  glass: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 18 }, cardTitle: { color: C.text, fontSize: 15, fontWeight: '700' }, bodyText: { color: '#AAB6BF', fontSize: 13, lineHeight: 20, marginTop: 8 }, scoreCard: { padding: 20, backgroundColor: '#0B1A28', shadowColor: C.green, shadowOpacity: 0.1, shadowRadius: 20 }, scoreBody: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 18 }, ring: { borderWidth: 10, alignItems: 'center', justifyContent: 'center', shadowColor: C.green, shadowOpacity: 0.35, shadowRadius: 12 }, ringInner: { backgroundColor: '#07131E', alignItems: 'center', justifyContent: 'center' }, ringValue: { color: C.text, fontWeight: '800', letterSpacing: -1 }, ringLabel: { color: C.muted, fontSize: 10 }, excellent: { color: C.text, fontSize: 16, fontWeight: '700' }, darkButton: { marginTop: 12, height: 38, borderRadius: 10, paddingHorizontal: 15, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#102430', borderWidth: 1, borderColor: '#254150' }, darkButtonText: { color: C.text, fontSize: 12, fontWeight: '600' },
  proteinCallout: { minHeight: 70, marginTop: 10, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B202A' }, flexEmoji: { fontSize: 30, marginRight: 14 }, calloutText: { flex: 1, color: '#B8C4CC', fontSize: 13, lineHeight: 20 }, bold: { color: C.text, fontWeight: '800' }, smallRing: { width: 31, height: 31, borderRadius: 16, borderWidth: 3, borderColor: C.green, alignItems: 'center', justifyContent: 'center' },
  sectionHeadingRow: { marginTop: 22, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { color: C.text, fontSize: 19, fontWeight: '700' }, link: { color: '#6CA3FF', fontSize: 13 }, compactMeal: { height: 64, marginBottom: 8, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }, photoCrop: { overflow: 'hidden', backgroundColor: '#142430' }, mealName: { color: C.text, fontSize: 13, fontWeight: '700' }, mealSub: { color: '#B2BEC5', fontSize: 12, marginTop: 4 }, statusBadge: { backgroundColor: '#123622', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 7 }, purpleBadge: { backgroundColor: '#2D183C' }, blueBadge: { backgroundColor: '#122746' }, statusText: { color: C.green, fontSize: 10 },
  miraHome: { height: 190, alignItems: 'center', justifyContent: 'center', marginTop: 5, overflow: 'hidden' }, wave: { position: 'absolute', width: '100%', height: 1, top: 78, backgroundColor: C.cyan, shadowColor: C.cyan, shadowOpacity: 0.8, shadowRadius: 8 }, orbGlow: { backgroundColor: '#2AD8F20B', alignItems: 'center', justifyContent: 'center' }, orb: { overflow: 'hidden', backgroundColor: '#21D8E9', borderWidth: 1, borderColor: '#CBFFFF', shadowColor: C.cyan, shadowOpacity: 0.9, shadowRadius: 18 }, orbPurple: { position: 'absolute', right: -5, bottom: -6, backgroundColor: '#BB40F2' }, orbBlue: { position: 'absolute', left: -2, bottom: 4, backgroundColor: '#3AE6F2' }, orbShine: { position: 'absolute', left: '22%', top: '9%', backgroundColor: '#E8FFFF', transform: [{ rotate: '32deg' }] }, askMira: { color: C.text, fontSize: 20, fontWeight: '600', marginTop: 2 }, miraCaption: { color: C.muted, marginTop: 5, fontSize: 13 },
  days: { flexDirection: 'row', gap: 7, marginTop: 2, marginBottom: 22 }, day: { flex: 1, minHeight: 56, borderRadius: 11, backgroundColor: C.panel, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border }, dayActive: { backgroundColor: '#104929', borderColor: C.green, shadowColor: C.green, shadowOpacity: 0.25, shadowRadius: 7 }, dayText: { color: '#B2BDC5', fontSize: 12, textAlign: 'center', lineHeight: 20 }, dayTextActive: { color: C.text, fontWeight: '800' }, macros: { marginBottom: 22 }, macroRow: { marginBottom: 16 }, rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, smallWhite: { color: C.text, fontSize: 12 }, progressTrack: { height: 4, backgroundColor: '#1A2934', borderRadius: 3, overflow: 'hidden', marginTop: 8 }, progressFill: { height: 4, backgroundColor: C.green, borderRadius: 3 }, planMeal: { padding: 8, flexDirection: 'row', gap: 12, marginTop: 10 }, mealType: { color: C.text, fontSize: 11 }, mealTime: { color: C.muted, fontSize: 11 }, planMealName: { color: C.text, fontSize: 16, fontWeight: '600', marginTop: 13 }, nutritionLine: { color: C.muted, fontSize: 11, marginTop: 8 }, generate: { minHeight: 64, marginTop: 18, backgroundColor: '#17182D', borderWidth: 1, borderColor: '#34304E', borderRadius: 28, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 18 }, generateTitle: { color: C.text, fontWeight: '700', fontSize: 14 }, generateSub: { color: C.muted, fontSize: 11, marginTop: 3 },
  pantryHero: { minHeight: 178, marginTop: 8, padding: 20, flexDirection: 'row', backgroundColor: '#0A2721', overflow: 'hidden' }, covered: { color: C.text, fontSize: 27, fontWeight: '700', marginTop: 4 }, groceryBag: { fontSize: 70, alignSelf: 'center', marginRight: 8 }, filters: { marginVertical: 14, flexGrow: 0 }, filter: { paddingHorizontal: 14, height: 31, borderRadius: 16, justifyContent: 'center', backgroundColor: C.panel, marginRight: 7 }, filterActive: { backgroundColor: '#2DB65B' }, filterText: { color: '#C3CCD2', fontSize: 11 }, filterTextActive: { color: C.text, fontWeight: '700' }, stockCard: { padding: 10, marginBottom: 10 }, stockTitle: { color: C.text, fontSize: 14, fontWeight: '600', margin: 3, marginBottom: 8 }, badgeCount: { color: '#C5B3F2' }, stockRow: { minHeight: 62, borderTopWidth: 1, borderTopColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 }, stockEmoji: { width: 54, height: 46, borderRadius: 13, backgroundColor: '#152531', alignItems: 'center', justifyContent: 'center', marginRight: 10 }, stockName: { color: C.text, fontSize: 14, fontWeight: '600' }, stockNote: { color: C.muted, fontSize: 11, marginTop: 3 }, qty: { color: '#C5CED4', fontSize: 12 }, buy: { backgroundColor: '#258B45', borderRadius: 9, paddingHorizontal: 15, paddingVertical: 10 }, buyText: { color: C.text, fontSize: 11, fontWeight: '700' }, orderCard: { padding: 12, marginBottom: 4 }, orderButtons: { flexDirection: 'row', gap: 8, marginTop: 9 }, brandButton: { flex: 1, borderRadius: 7, paddingVertical: 9, alignItems: 'center' }, brandDark: { color: '#173016', fontSize: 11, fontWeight: '900' }, brandLight: { color: C.text, fontSize: 10, fontWeight: '900' },
  search: { height: 48, borderRadius: 15, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10 }, searchInput: { flex: 1, color: C.text, fontSize: 13 }, recipeAI: { minHeight: 76, marginTop: 12, paddingHorizontal: 18, borderRadius: 18, borderWidth: 1, borderColor: '#393052', backgroundColor: '#19162A', flexDirection: 'row', alignItems: 'center', gap: 14 }, recipeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, recipeCard: { width: '48%', backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 18, overflow: 'hidden', marginBottom: 12, paddingBottom: 12 }, recipeName: { color: C.text, fontSize: 13, fontWeight: '700', margin: 11, marginBottom: 0 }, recipeMeta: { color: C.muted, fontSize: 9, marginHorizontal: 11, marginTop: 5 }, recipeBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 11, marginTop: 10 }, match: { color: C.green, fontSize: 9 },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', margin: 5, marginBottom: 20 }, range: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 }, rangeActive: { backgroundColor: '#113B2B' }, rangeText: { color: C.muted, fontSize: 12 }, rangeTextActive: { color: C.green, fontWeight: '700' }, chartCard: { padding: 16, minHeight: 250 }, loss: { color: C.green, fontWeight: '700', fontSize: 15 }, chart: { height: 135, marginTop: 20, marginHorizontal: 8, position: 'relative' }, gridLine: { position: 'absolute', left: 0, right: 0, top: 0, height: 1, backgroundColor: '#19303D' }, areaFill: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '62%', backgroundColor: '#173D2B99' }, chartLine: { position: 'absolute', left: '3%', top: '44%', width: '94%', height: 3, backgroundColor: C.green, borderRadius: 2 }, chartPoint: { position: 'absolute', width: 10, height: 10, marginLeft: -5, borderRadius: 5, backgroundColor: C.green, borderWidth: 2, borderColor: '#D9FFE2', zIndex: 3 }, chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 8 }, overview: { padding: 16, marginTop: 14 }, ringsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 22 }, miniRingBlock: { alignItems: 'center', flex: 1 }, ringSub: { color: '#CBD4D9', fontSize: 11, marginTop: 11 }, habits: { padding: 16, marginTop: 14 }, habitRow: { height: 45, borderTopWidth: 1, borderTopColor: '#152B38', flexDirection: 'row', alignItems: 'center', gap: 8 }, habitName: { color: C.text, fontSize: 12, flex: 1 }, habitDots: { flexDirection: 'row', gap: 5 }, habitDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#33424B' }, habitCount: { color: C.muted, fontSize: 10, width: 50, textAlign: 'right' },
  nav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 78, backgroundColor: '#0A1925F8', borderTopWidth: 1, borderTopColor: '#102735', flexDirection: 'row', paddingTop: 9, paddingBottom: Platform.OS === 'ios' ? 17 : 7 }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5 }, navLabel: { color: '#687884', fontSize: 9 }, navLabelOn: { color: C.green },
  chatScreen: { flex: 1, backgroundColor: C.bg }, chatHeader: { height: 72, paddingHorizontal: 17, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, chatIdentity: { flexDirection: 'row', alignItems: 'center', gap: 8 }, chatName: { color: C.text, fontSize: 16, fontWeight: '700' }, chatRole: { color: C.muted, fontSize: 10, marginTop: 2 }, chatBody: { padding: 18, gap: 10 }, bubble: { alignSelf: 'flex-start', maxWidth: '82%', padding: 13, borderRadius: 17, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border }, userBubble: { alignSelf: 'flex-end', backgroundColor: C.green, borderColor: C.green }, bubbleText: { color: C.text, fontSize: 13, lineHeight: 19 }, composer: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg2 }, mic: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#123326', alignItems: 'center', justifyContent: 'center' }, input: { flex: 1, height: 42, borderRadius: 21, backgroundColor: C.panel, color: C.text, paddingHorizontal: 15 }, send: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
});
