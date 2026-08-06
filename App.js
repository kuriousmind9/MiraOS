import React, { useMemo, useState } from 'react';
import {
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

const C = {
  ink: '#17251F',
  muted: '#6D7872',
  canvas: '#F4F5F1',
  white: '#FFFFFF',
  moss: '#326B50',
  mossDark: '#234D3A',
  mint: '#DDECE3',
  lime: '#D9ED97',
  apricot: '#F3D3AF',
  lilac: '#DDD6F0',
  blue: '#CFE3EA',
  line: '#E3E7E1',
  red: '#C46C58',
};

const MEAL_SEED = [
  { id: 'breakfast', label: 'Breakfast', time: '8:00 AM', title: 'Moong dal chilla', note: 'Mint curd · 2 chillas', kcal: 410, protein: 29, carbs: 48, fat: 12, color: C.apricot, icon: 'sunny-outline', status: 'eaten' },
  { id: 'lunch', label: 'Lunch', time: '1:00 PM', title: 'Palak paneer bowl', note: 'Brown rice · cucumber salad', kcal: 620, protein: 39, carbs: 65, fat: 22, color: C.mint, icon: 'leaf-outline', status: 'next' },
  { id: 'snack', label: 'Snack', time: '4:30 PM', title: 'Greek yogurt bowl', note: 'Berries · chia · almonds', kcal: 280, protein: 24, carbs: 31, fat: 7, color: C.lilac, icon: 'cafe-outline', status: 'planned' },
  { id: 'dinner', label: 'Dinner', time: '8:00 PM', title: 'Egg bhurji plate', note: 'Vegetables · one phulka', kcal: 510, protein: 42, carbs: 38, fat: 21, color: C.blue, icon: 'moon-outline', status: 'planned' },
];

const SWAPS = {
  breakfast: ['High-protein poha', 'Paneer besan chilla', 'Egg & vegetable wrap'],
  lunch: ['Rajma rice bowl', 'Paneer tikka thali', 'Chole quinoa bowl'],
  snack: ['Chaas & roasted chana', 'Fruit curd bowl', 'Masala egg chaat'],
  dinner: ['Paneer spinach bowl', 'Masala omelette plate', 'Dal & egg protein bowl'],
};

function ProgressBar({ value, color }) {
  return <View style={styles.track}><View style={[styles.fill, { width: `${Math.min(value, 100)}%`, backgroundColor: color }]} /></View>;
}

function Macro({ label, value, unit, progress, color }) {
  return (
    <View style={styles.macroItem}>
      <View style={styles.macroTop}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroNumber}>{value}<Text style={styles.macroUnit}> {unit}</Text></Text>
      </View>
      <ProgressBar value={progress} color={color} />
    </View>
  );
}

function MealCard({ meal, open, onToggle, onOutcome, onSwap }) {
  const completed = meal.status === 'eaten';
  return (
    <View style={styles.timelineItem}>
      <View style={styles.rail}>
        <View style={[styles.dot, completed && styles.dotDone]}>
          <Ionicons name={completed ? 'checkmark' : meal.status === 'next' ? 'ellipse' : 'ellipse-outline'} size={completed ? 13 : 8} color={completed ? C.white : C.moss} />
        </View>
        {meal.id !== 'dinner' && <View style={styles.railLine} />}
      </View>

      <TouchableOpacity activeOpacity={0.92} onPress={onToggle} style={[styles.mealCard, open && styles.mealCardOpen]}>
        <View style={[styles.foodTile, { backgroundColor: meal.color }]}>
          <Ionicons name={meal.icon} size={23} color={C.ink} />
        </View>
        <View style={styles.mealContent}>
          <View style={styles.mealHeading}>
            <View style={{ flex: 1 }}>
              <View style={styles.mealMetaRow}>
                <Text style={styles.mealLabel}>{meal.label}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
                {meal.status === 'next' && <View style={styles.nextPill}><Text style={styles.nextText}>NEXT</Text></View>}
              </View>
              <Text style={styles.mealTitle}>{meal.title}</Text>
              <Text style={styles.mealNote}>{meal.note}</Text>
            </View>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={C.muted} />
          </View>
          <View style={styles.mealNutrition}>
            <Text style={styles.mealNutritionText}>{meal.kcal} kcal</Text>
            <View style={styles.tinyDot} />
            <Text style={styles.mealNutritionText}>{meal.protein}g protein</Text>
          </View>

          {open && (
            <View style={styles.expanded}>
              <View style={styles.portionRow}>
                <Text style={styles.portionTitle}>Your portion</Text>
                <Text style={styles.portionText}>1 serving</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.primaryAction} onPress={onOutcome}>
                  <Ionicons name={completed ? 'arrow-undo-outline' : 'checkmark'} size={17} color={C.white} />
                  <Text style={styles.primaryActionText}>{completed ? 'Undo' : 'Log meal'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryAction} onPress={onSwap}>
                  <Ionicons name="swap-horizontal" size={17} color={C.moss} />
                  <Text style={styles.secondaryActionText}>Swap</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconAction}>
                  <Ionicons name="book-outline" size={18} color={C.ink} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function BottomNav({ active, setActive }) {
  const tabs = [['Home', 'home'], ['Meal Prep', 'calendar'], ['Recipes', 'restaurant'], ['Progress', 'stats-chart']];
  return (
    <View style={styles.nav}>
      {tabs.map(([label, icon]) => {
        const selected = active === label;
        return (
          <TouchableOpacity key={label} style={styles.navItem} onPress={() => setActive(label)}>
            <View style={[styles.navIcon, selected && styles.navIconActive]}><Ionicons name={selected ? icon : `${icon}-outline`} size={20} color={selected ? C.mossDark : '#8A948E'} /></View>
            <Text style={[styles.navText, selected && styles.navTextActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [meals, setMeals] = useState(MEAL_SEED);
  const [expanded, setExpanded] = useState('lunch');
  const [swapMeal, setSwapMeal] = useState(null);
  const [outcomeMeal, setOutcomeMeal] = useState(null);
  const [miraOpen, setMiraOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([{ role: 'mira', text: 'Namaste, Raj. What changed today?' }]);

  const eaten = useMemo(() => meals.filter((m) => m.status === 'eaten'), [meals]);
  const consumed = useMemo(() => eaten.reduce((a, m) => ({ kcal: a.kcal + m.kcal, protein: a.protein + m.protein, carbs: a.carbs + m.carbs, fat: a.fat + m.fat }), { kcal: 0, protein: 0, carbs: 0, fat: 0 }), [eaten]);

  const logOutcome = (percentage) => {
    setMeals((list) => list.map((m) => m.id === outcomeMeal.id ? { ...m, status: percentage === 0 ? 'skipped' : 'eaten', portion: percentage } : m));
    setOutcomeMeal(null);
  };

  const applySwap = (title) => {
    setMeals((list) => list.map((m) => m.id === swapMeal.id ? { ...m, title, note: 'Mira-adjusted · macros rebalanced' } : m));
    setSwapMeal(null);
  };

  const send = () => {
    if (!message.trim()) return;
    setChat((items) => [...items, { role: 'user', text: message.trim() }, { role: 'mira', text: 'Got it. I’ll adjust the remaining meals and keep today as close to target as possible.' }]);
    setMessage('');
  };

  if (activeTab !== 'Home') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.placeholder}>
          <View style={styles.placeholderIcon}><Ionicons name={activeTab === 'Recipes' ? 'restaurant-outline' : activeTab === 'Progress' ? 'stats-chart-outline' : 'calendar-outline'} size={30} color={C.moss} /></View>
          <Text style={styles.placeholderTitle}>{activeTab}</Text>
          <Text style={styles.placeholderBody}>This experience is next. Home is fully interactive now.</Text>
        </View>
        <BottomNav active={activeTab} setActive={setActiveTab} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
          <View style={styles.topbar}>
            <View>
              <Text style={styles.kicker}>THURSDAY, 6 AUGUST</Text>
              <Text style={styles.hello}>Good morning, Raj.</Text>
            </View>
            <TouchableOpacity style={styles.avatar}><Text style={styles.avatarText}>RD</Text></TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroGlowOne} />
            <View style={styles.heroGlowTwo} />
            <View style={styles.heroCopy}>
              <View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusText}>TODAY IS ON TRACK</Text></View>
              <Text style={styles.heroTitle}>Your meals are set.{`\n`}Just follow the plan.</Text>
              <Text style={styles.heroBody}>You’re planned to finish within 8g of protein and 64 calories of today’s targets.</Text>
            </View>
            <View style={styles.scoreWrap}>
              <View style={styles.scoreOuter}><View style={styles.scoreInner}><Text style={styles.score}>94</Text><Text style={styles.scoreOf}>/ 100</Text></View></View>
              <Text style={styles.scoreCaption}>PLANNED SCORE</Text>
            </View>
          </View>

          <View style={styles.macrosCard}>
            <View style={styles.cardTitleRow}>
              <View><Text style={styles.eyebrow}>TODAY’S NUTRITION</Text><Text style={styles.cardHeading}>Daily targets</Text></View>
              <Text style={styles.consumedText}>{consumed.kcal} kcal consumed</Text>
            </View>
            <View style={styles.macroGrid}>
              <Macro label="Protein" value={`${consumed.protein}/134`} unit="g" progress={(consumed.protein / 134) * 100} color={C.moss} />
              <Macro label="Calories" value={`${consumed.kcal}/1820`} unit="" progress={(consumed.kcal / 1820) * 100} color="#D89B55" />
              <Macro label="Carbs" value={`${consumed.carbs}/182`} unit="g" progress={(consumed.carbs / 182) * 100} color="#6F9EAD" />
              <Macro label="Fat" value={`${consumed.fat}/62`} unit="g" progress={(consumed.fat / 62) * 100} color="#9C85B8" />
            </View>
          </View>

          <View style={styles.sectionTop}>
            <View><Text style={styles.eyebrow}>YOUR DAY</Text><Text style={styles.sectionHeading}>Today’s menu</Text></View>
            <Text style={styles.completeText}>{eaten.length} of 4 logged</Text>
          </View>

          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} open={expanded === meal.id} onToggle={() => setExpanded(expanded === meal.id ? null : meal.id)} onOutcome={() => meal.status === 'eaten' ? setMeals((list) => list.map((m) => m.id === meal.id ? { ...m, status: 'planned' } : m)) : setOutcomeMeal(meal)} onSwap={() => setSwapMeal(meal)} />
          ))}

          <View style={styles.toolsRow}>
            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: C.mint }]}><Ionicons name="share-social-outline" size={21} color={C.moss} /></View>
              <Text style={styles.toolTitle}>Today cooking menu</Text>
              <Text style={styles.toolBody}>Ready to share in Hindi</Text>
              <Ionicons name="arrow-forward" size={18} color={C.moss} style={styles.toolArrow} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIcon, { backgroundColor: '#F7E8D7' }]}><Ionicons name="bag-handle-outline" size={21} color="#9A653D" /></View>
              <Text style={styles.toolTitle}>Shopping</Text>
              <Text style={styles.toolBody}>2 items running low</Text>
              <Ionicons name="arrow-forward" size={18} color={C.moss} style={styles.toolArrow} />
            </TouchableOpacity>
          </View>

          <View style={styles.insight}>
            <View style={styles.insightIcon}><Ionicons name="sparkles" size={19} color={C.moss} /></View>
            <View style={{ flex: 1 }}><Text style={styles.insightLabel}>MIRA NOTICED</Text><Text style={styles.insightTitle}>Palak may still be in your fridge.</Text><Text style={styles.insightBody}>Confirm it before lunch and I’ll remove spinach from today’s shopping.</Text></View>
            <TouchableOpacity style={styles.confirm}><Text style={styles.confirmText}>Confirm</Text></TouchableOpacity>
          </View>
        </ScrollView>

        <TouchableOpacity activeOpacity={0.9} style={styles.miraFab} onPress={() => setMiraOpen(true)}>
          <View style={styles.miraOrb}><View style={styles.miraOrbCore} /></View><Text style={styles.miraFabText}>Ask Mira</Text>
        </TouchableOpacity>
        <BottomNav active={activeTab} setActive={setActiveTab} />
      </View>

      <Modal visible={!!swapMeal} transparent animationType="slide" onRequestClose={() => setSwapMeal(null)}>
        <View style={styles.overlay}><View style={styles.sheet}><View style={styles.handle} /><Text style={styles.sheetEyebrow}>SMART SWAP</Text><Text style={styles.sheetTitle}>What sounds better?</Text><Text style={styles.sheetBody}>Each choice keeps today close to your macro targets.</Text>{(swapMeal ? SWAPS[swapMeal.id] : []).map((item, i) => <TouchableOpacity key={item} style={styles.swapChoice} onPress={() => applySwap(item)}><View style={styles.swapNumber}><Text style={styles.swapNumberText}>{i + 1}</Text></View><Text style={styles.swapText}>{item}</Text><Ionicons name="arrow-forward" size={18} color={C.moss} /></TouchableOpacity>)}<TouchableOpacity style={styles.closeSheet} onPress={() => setSwapMeal(null)}><Text style={styles.closeSheetText}>Keep current meal</Text></TouchableOpacity></View></View>
      </Modal>

      <Modal visible={!!outcomeMeal} transparent animationType="slide" onRequestClose={() => setOutcomeMeal(null)}>
        <View style={styles.overlay}><View style={styles.sheet}><View style={styles.handle} /><Text style={styles.sheetEyebrow}>LOG {outcomeMeal?.label?.toUpperCase()}</Text><Text style={styles.sheetTitle}>How much did you eat?</Text><Text style={styles.sheetBody}>Mira will adapt the remaining meals automatically.</Text>{[['Entire portion', 100, 'checkmark-circle-outline'], ['About half', 50, 'contrast-outline'], ['Didn’t eat', 0, 'close-circle-outline']].map(([label, pct, icon]) => <TouchableOpacity key={label} style={styles.swapChoice} onPress={() => logOutcome(pct)}><View style={styles.swapNumber}><Ionicons name={icon} size={19} color={C.moss} /></View><Text style={styles.swapText}>{label}</Text><Text style={styles.percentText}>{pct}%</Text></TouchableOpacity>)}<TouchableOpacity style={styles.closeSheet} onPress={() => setOutcomeMeal(null)}><Text style={styles.closeSheetText}>Cancel</Text></TouchableOpacity></View></View>
      </Modal>

      <Modal visible={miraOpen} animationType="slide" onRequestClose={() => setMiraOpen(false)}>
        <SafeAreaView style={styles.chatScreen}>
          <View style={styles.chatHeader}><TouchableOpacity onPress={() => setMiraOpen(false)} style={styles.chatClose}><Ionicons name="chevron-down" size={24} color={C.ink} /></TouchableOpacity><View style={styles.chatIdentity}><View style={styles.miraOrbSmall}><View style={styles.miraOrbCore} /></View><View><Text style={styles.chatName}>Mira</Text><Text style={styles.chatRole}>Your nutrition coach</Text></View></View><View style={{ width: 42 }} /></View>
          <ScrollView contentContainerStyle={styles.chatBody}>{chat.map((item, i) => <View key={i} style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.miraBubble]}><Text style={[styles.bubbleText, item.role === 'user' && styles.userBubbleText]}>{item.text}</Text></View>)}</ScrollView>
          <View style={styles.composer}><TouchableOpacity style={styles.voiceButton}><Ionicons name="mic" size={20} color={C.moss} /></TouchableOpacity><TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="Tell Mira naturally…" placeholderTextColor="#8B958F" onSubmitEditing={send} /><TouchableOpacity style={styles.send} onPress={send}><Ionicons name="arrow-up" size={18} color={C.white} /></TouchableOpacity></View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.canvas }, appShell: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', backgroundColor: C.canvas }, page: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 26 : 12, paddingBottom: 160 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, kicker: { fontSize: 10, letterSpacing: 1.5, fontWeight: '800', color: C.muted }, hello: { fontSize: 29, lineHeight: 36, marginTop: 5, fontWeight: '800', color: C.ink, letterSpacing: -0.7 }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: C.white, fontSize: 12, fontWeight: '800' },
  hero: { minHeight: 228, borderRadius: 30, backgroundColor: C.mossDark, overflow: 'hidden', padding: 22, flexDirection: 'row', alignItems: 'center', marginBottom: 14 }, heroGlowOne: { position: 'absolute', width: 230, height: 230, borderRadius: 115, backgroundColor: '#3C785B', right: -70, top: -95 }, heroGlowTwo: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#294F3D', left: -70, bottom: -75 }, heroCopy: { flex: 1, paddingRight: 10, zIndex: 2 }, statusPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 14 }, statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.lime, marginRight: 7 }, statusText: { color: C.lime, fontSize: 9, fontWeight: '900', letterSpacing: 1 }, heroTitle: { color: C.white, fontSize: 27, lineHeight: 32, fontWeight: '800', letterSpacing: -0.7 }, heroBody: { color: '#D4DED8', marginTop: 10, fontSize: 12, lineHeight: 18, maxWidth: 330 }, scoreWrap: { width: 104, alignItems: 'center', zIndex: 2 }, scoreOuter: { width: 96, height: 96, borderRadius: 48, borderWidth: 8, borderColor: C.lime, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF0E' }, scoreInner: { alignItems: 'center' }, score: { color: C.white, fontSize: 29, fontWeight: '900', letterSpacing: -1 }, scoreOf: { color: '#BCD0C5', fontSize: 10, marginTop: -2 }, scoreCaption: { color: '#BFD0C6', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginTop: 9 },
  macrosCard: { backgroundColor: C.white, borderRadius: 25, padding: 19, borderWidth: 1, borderColor: C.line, marginBottom: 27 }, cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }, eyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 1.35, color: C.moss }, cardHeading: { fontSize: 20, fontWeight: '800', color: C.ink, marginTop: 4, letterSpacing: -0.35 }, consumedText: { color: C.muted, fontSize: 10, fontWeight: '600' }, macroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, macroItem: { width: '47%', flexGrow: 1, backgroundColor: '#F7F8F5', borderRadius: 16, padding: 12 }, macroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }, macroLabel: { color: C.muted, fontSize: 10, fontWeight: '700' }, macroNumber: { color: C.ink, fontSize: 12, fontWeight: '800' }, macroUnit: { color: C.muted, fontSize: 9, fontWeight: '600' }, track: { height: 5, borderRadius: 4, backgroundColor: '#E4E8E3', overflow: 'hidden' }, fill: { height: 5, borderRadius: 4 },
  sectionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 13 }, sectionHeading: { color: C.ink, fontSize: 24, fontWeight: '800', marginTop: 3, letterSpacing: -0.5 }, completeText: { color: C.muted, fontSize: 11, fontWeight: '700' }, timelineItem: { flexDirection: 'row' }, rail: { width: 29, alignItems: 'center' }, dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.white, borderWidth: 2, borderColor: C.moss, alignItems: 'center', justifyContent: 'center', marginTop: 20, zIndex: 2 }, dotDone: { backgroundColor: C.moss }, railLine: { width: 1, backgroundColor: '#CED6D0', flex: 1, marginTop: -1 }, mealCard: { flex: 1, minHeight: 112, backgroundColor: C.white, borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 14, marginBottom: 12, flexDirection: 'row' }, mealCardOpen: { borderColor: '#C4D5CA', shadowColor: '#22352B', shadowOpacity: 0.07, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 2 }, foodTile: { width: 51, height: 51, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, mealContent: { flex: 1 }, mealHeading: { flexDirection: 'row', alignItems: 'flex-start' }, mealMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, mealLabel: { fontSize: 10, fontWeight: '900', color: C.moss, textTransform: 'uppercase', letterSpacing: 0.8 }, mealTime: { fontSize: 10, color: C.muted, fontWeight: '600' }, nextPill: { paddingHorizontal: 6, paddingVertical: 3, backgroundColor: C.lime, borderRadius: 6 }, nextText: { fontSize: 7, fontWeight: '900', color: C.mossDark, letterSpacing: 0.6 }, mealTitle: { fontSize: 17, color: C.ink, fontWeight: '800', marginTop: 5, letterSpacing: -0.25 }, mealNote: { fontSize: 11, color: C.muted, marginTop: 3 }, mealNutrition: { flexDirection: 'row', alignItems: 'center', marginTop: 10 }, mealNutritionText: { fontSize: 10, color: C.ink, fontWeight: '700' }, tinyDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#AAB2AD', marginHorizontal: 7 }, expanded: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }, portionRow: { flexDirection: 'row', justifyContent: 'space-between' }, portionTitle: { fontSize: 10, color: C.muted, fontWeight: '600' }, portionText: { fontSize: 10, color: C.ink, fontWeight: '800' }, actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 }, primaryAction: { height: 40, flex: 1.25, backgroundColor: C.moss, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, primaryActionText: { color: C.white, fontSize: 11, fontWeight: '800' }, secondaryAction: { height: 40, flex: 1, backgroundColor: C.mint, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, secondaryActionText: { color: C.moss, fontSize: 11, fontWeight: '800' }, iconAction: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F1', alignItems: 'center', justifyContent: 'center' },
  toolsRow: { flexDirection: 'row', gap: 12, marginTop: 15 }, toolCard: { flex: 1, minHeight: 150, backgroundColor: C.white, borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 15 }, toolIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, toolTitle: { color: C.ink, fontSize: 14, lineHeight: 18, fontWeight: '800', paddingRight: 8 }, toolBody: { color: C.muted, fontSize: 10, marginTop: 4 }, toolArrow: { position: 'absolute', right: 14, bottom: 14 }, insight: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.mint, borderRadius: 23, padding: 16, marginTop: 13, gap: 12 }, insightIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }, insightLabel: { color: C.moss, fontSize: 8, fontWeight: '900', letterSpacing: 1.1 }, insightTitle: { color: C.ink, fontSize: 13, fontWeight: '800', marginTop: 4 }, insightBody: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 3, paddingRight: 2 }, confirm: { alignSelf: 'center', borderRadius: 10, backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: 8 }, confirmText: { color: C.moss, fontSize: 9, fontWeight: '800' },
  miraFab: { position: 'absolute', right: 20, bottom: 87, height: 52, paddingHorizontal: 14, borderRadius: 26, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', gap: 9, shadowColor: '#17251F', shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 6 }, miraOrb: { width: 27, height: 27, borderRadius: 14, backgroundColor: '#8ED3AC', alignItems: 'center', justifyContent: 'center' }, miraOrbCore: { width: 9, height: 9, borderRadius: 5, backgroundColor: C.white }, miraFabText: { color: C.white, fontSize: 12, fontWeight: '800' },
  nav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 77, backgroundColor: '#FFFFFFFA', borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row', paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 18 : 7 }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navIcon: { width: 35, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, navIconActive: { backgroundColor: C.mint }, navText: { fontSize: 9, fontWeight: '700', color: '#8A948E', marginTop: 3 }, navTextActive: { color: C.mossDark },
  overlay: { flex: 1, backgroundColor: '#0E1712AA', justifyContent: 'flex-end' }, sheet: { backgroundColor: C.canvas, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 34 }, handle: { width: 42, height: 5, borderRadius: 4, backgroundColor: '#C5CBC6', alignSelf: 'center', marginBottom: 20 }, sheetEyebrow: { color: C.moss, fontSize: 9, letterSpacing: 1.4, fontWeight: '900' }, sheetTitle: { color: C.ink, fontSize: 26, fontWeight: '800', marginTop: 5, letterSpacing: -0.5 }, sheetBody: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 18 }, swapChoice: { backgroundColor: C.white, borderRadius: 17, borderWidth: 1, borderColor: C.line, minHeight: 58, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 9 }, swapNumber: { width: 34, height: 34, borderRadius: 11, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, swapNumberText: { color: C.moss, fontWeight: '900' }, swapText: { flex: 1, color: C.ink, fontSize: 13, fontWeight: '800' }, percentText: { color: C.muted, fontSize: 11, fontWeight: '700' }, closeSheet: { alignItems: 'center', padding: 13 }, closeSheetText: { color: C.muted, fontWeight: '800', fontSize: 12 },
  chatScreen: { flex: 1, backgroundColor: C.canvas }, chatHeader: { height: 70, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.line, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, chatClose: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F2F4F1', alignItems: 'center', justifyContent: 'center' }, chatIdentity: { flexDirection: 'row', alignItems: 'center', gap: 9 }, miraOrbSmall: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#8ED3AC', alignItems: 'center', justifyContent: 'center' }, chatName: { color: C.ink, fontSize: 16, fontWeight: '900' }, chatRole: { color: C.muted, fontSize: 9 }, chatBody: { padding: 18, gap: 10 }, bubble: { maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 18 }, miraBubble: { backgroundColor: C.white, alignSelf: 'flex-start', borderWidth: 1, borderColor: C.line }, userBubble: { backgroundColor: C.moss, alignSelf: 'flex-end' }, bubbleText: { color: C.ink, fontSize: 13, lineHeight: 19 }, userBubbleText: { color: C.white }, composer: { backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.line, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }, voiceButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }, input: { flex: 1, height: 42, borderRadius: 21, backgroundColor: C.canvas, paddingHorizontal: 15, color: C.ink }, send: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.moss, alignItems: 'center', justifyContent: 'center' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 35 }, placeholderIcon: { width: 68, height: 68, borderRadius: 23, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }, placeholderTitle: { color: C.ink, fontSize: 28, fontWeight: '900' }, placeholderBody: { color: C.muted, textAlign: 'center', marginTop: 8, maxWidth: 260, lineHeight: 20 },
});
