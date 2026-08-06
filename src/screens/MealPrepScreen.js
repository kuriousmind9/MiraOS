import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  HOUSEHOLD,
  INITIAL_WEEK,
  WEEK_DAYS,
  nextSwap,
  summarizeDay,
} from '../features/mealPrep/model';

const FALLBACK = {
  background: '#020E18',
  surface: '#0C1B27',
  surfaceAlt: '#101F2B',
  border: '#1B3240',
  text: '#F3F7F8',
  muted: '#91A0AB',
  primary: '#5CE778',
  primarySoft: '#173E2B',
  purple: '#B768FF',
  amber: '#FFB22C',
  danger: '#FF5F64',
};

function colorsFrom(theme) {
  const c = theme?.colors || theme || {};
  return {
    background: c.background || c.bg || FALLBACK.background,
    surface: c.surface || c.panel || c.card || FALLBACK.surface,
    surfaceAlt: c.surfaceAlt || c.panel2 || FALLBACK.surfaceAlt,
    border: c.border || FALLBACK.border,
    text: c.text || FALLBACK.text,
    muted: c.muted || c.textSecondary || FALLBACK.muted,
    primary: c.primary || c.green || FALLBACK.primary,
    primarySoft: c.primarySoft || c.greenDark || FALLBACK.primarySoft,
    purple: c.purple || FALLBACK.purple,
    amber: c.amber || FALLBACK.amber,
    danger: c.danger || c.red || FALLBACK.danger,
  };
}

function Pill({ children, active, onPress, styles }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </TouchableOpacity>
  );
}

function DayStrip({ selected, onSelect, styles }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayStrip}>
      {WEEK_DAYS.map((day) => (
        <TouchableOpacity
          key={day.key}
          onPress={() => onSelect(day.key)}
          style={[styles.dayButton, selected === day.key && styles.dayButtonActive]}
        >
          <Text style={[styles.dayShort, selected === day.key && styles.dayActiveText]}>{day.short}</Text>
          <Text style={[styles.dayDate, selected === day.key && styles.dayActiveText]}>{day.date}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function PortionRows({ portions, styles }) {
  return (
    <View style={styles.portions}>
      {portions.map((portion) => {
        const member = HOUSEHOLD.find((item) => item.id === portion.memberId);
        return (
          <View key={portion.memberId} style={styles.portionRow}>
            <View style={styles.memberAvatar}><Text style={styles.memberInitial}>{member?.name?.[0]}</Text></View>
            <View style={styles.portionCopy}>
              <Text style={styles.memberName}>{member?.name}</Text>
              <Text style={styles.portionAmount}>{portion.amount}</Text>
            </View>
            <Text style={styles.memberTarget}>{member?.target}</Text>
          </View>
        );
      })}
    </View>
  );
}

function MealCard({ meal, onKeep, onSwap, onLock, styles, colors }) {
  const [open, setOpen] = useState(false);
  const kept = meal.decision === 'kept';
  return (
    <View style={[styles.mealCard, meal.locked && styles.mealCardLocked]}>
      <TouchableOpacity style={styles.mealTop} onPress={() => setOpen((value) => !value)} activeOpacity={0.8}>
        <View style={styles.mealIcon}><Ionicons name={meal.type === 'Breakfast' ? 'sunny' : meal.type === 'Lunch' ? 'restaurant' : meal.type === 'Snack' ? 'cafe' : 'moon'} color={colors.primary} size={19} /></View>
        <View style={styles.mealCopy}>
          <View style={styles.mealMetaRow}>
            <Text style={styles.mealType}>{meal.type}</Text>
            <Text style={styles.mealTime}>{meal.time}</Text>
          </View>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealNutrition}>{meal.kcal} kcal · {meal.protein}g protein · one household recipe</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} color={colors.muted} size={19} />
      </TouchableOpacity>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={onKeep} style={[styles.action, kept && styles.actionSelected]}>
          <Ionicons name={kept ? 'checkmark-circle' : 'checkmark-circle-outline'} color={kept ? colors.primary : colors.muted} size={17} />
          <Text style={[styles.actionText, kept && styles.actionTextSelected]}>{kept ? 'Kept' : 'Keep'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwap} style={styles.action}>
          <Ionicons name="swap-horizontal" color={colors.muted} size={18} />
          <Text style={styles.actionText}>Swap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLock} style={[styles.action, meal.locked && styles.actionSelected]}>
          <Ionicons name={meal.locked ? 'lock-closed' : 'lock-open-outline'} color={meal.locked ? colors.primary : colors.muted} size={16} />
          <Text style={[styles.actionText, meal.locked && styles.actionTextSelected]}>{meal.locked ? 'Locked' : 'Lock'}</Text>
        </TouchableOpacity>
      </View>

      {open && <PortionRows portions={meal.portions} styles={styles} />}
    </View>
  );
}

function MonthView({ week, onSelectDay, styles, colors }) {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  return (
    <View style={styles.monthCard}>
      <View style={styles.monthHeader}>
        <Text style={styles.monthTitle}>August 2026</Text>
        <Text style={styles.monthHint}>Tap a planned day to edit</Text>
      </View>
      <View style={styles.monthWeekLabels}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <Text key={`${day}-${index}`} style={styles.monthWeekLabel}>{day}</Text>)}</View>
      <View style={styles.monthGrid}>
        {days.map((date) => {
          const mapped = WEEK_DAYS.find((item) => item.date === date);
          return (
            <TouchableOpacity
              key={date}
              disabled={!mapped}
              onPress={() => onSelectDay(mapped.key)}
              style={[styles.monthDay, mapped && styles.monthDayPlanned]}
            >
              <Text style={[styles.monthDayText, mapped && { color: colors.text }]}>{date}</Text>
              {mapped && <View style={styles.monthDots}><View style={styles.monthDot} /><Text style={styles.monthMealCount}>{week[mapped.key].length}</Text></View>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MealPrepScreen({
  theme,
  onBack,
  onOpenMira,
  onPlanConfirmed,
  initialDay = 'thu',
}) {
  const colors = colorsFrom(theme);
  const styles = useMemo(() => createStyles(colors), [colors.background, colors.text, colors.primary]);
  const [view, setView] = useState('Week');
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [week, setWeek] = useState(INITIAL_WEEK);
  const [contextOpen, setContextOpen] = useState(false);
  const [events, setEvents] = useState(['Friday family dinner']);
  const [leftover, setLeftover] = useState('Rajma · about 2 portions');
  const [eventDraft, setEventDraft] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const selectedMeals = week[selectedDay];
  const totals = summarizeDay(selectedMeals);
  const keptCount = Object.values(week).flat().filter((meal) => meal.decision === 'kept' || meal.locked).length;

  const updateMeal = (mealId, updater) => {
    setWeek((current) => ({
      ...current,
      [selectedDay]: current[selectedDay].map((meal) => meal.id === mealId ? updater(meal) : meal),
    }));
    setConfirmed(false);
  };

  const swapMeal = (meal) => {
    if (meal.locked) return;
    const replacement = nextSwap(meal);
    updateMeal(meal.id, (current) => ({ ...current, ...replacement, id: current.id, decision: 'swapped' }));
  };

  const confirmPlan = () => {
    setConfirmed(true);
    onPlanConfirmed?.({ week, events, leftovers: leftover });
  };

  const addEvent = () => {
    const clean = eventDraft.trim();
    if (!clean) return;
    setEvents((current) => [...current, clean]);
    setEventDraft('');
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {onBack ? <TouchableOpacity onPress={onBack} style={styles.iconButton}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity> : <View style={styles.iconButton}><Ionicons name="calendar-outline" size={22} color={colors.primary} /></View>}
          <View style={styles.headerCopy}><Text style={styles.title}>Meal Prep</Text><Text style={styles.subtitle}>Your AI-prepared nutrition plan</Text></View>
          <TouchableOpacity onPress={() => setContextOpen(true)} style={styles.iconButton}><Ionicons name="options-outline" size={22} color={colors.text} /></TouchableOpacity>
        </View>

        <View style={styles.viewSwitch}>
          {['Day', 'Week', 'Month'].map((item) => <Pill key={item} active={view === item} onPress={() => setView(item)} styles={styles}>{item}</Pill>)}
        </View>

        <View style={styles.intelligenceCard}>
          <View style={styles.sparkle}><Ionicons name="sparkles" color={colors.purple} size={23} /></View>
          <View style={styles.intelligenceCopy}>
            <Text style={styles.intelligenceEyebrow}>MIRA’S DRAFT</Text>
            <Text style={styles.intelligenceTitle}>Next week is ready</Text>
            <Text style={styles.intelligenceText}>Built around both goals, Friday dinner, pantry stock and your leftover rajma.</Text>
          </View>
          <TouchableOpacity onPress={() => setContextOpen(true)}><Text style={styles.reviewLink}>Context</Text></TouchableOpacity>
        </View>

        {view !== 'Month' && <DayStrip selected={selectedDay} onSelect={setSelectedDay} styles={styles} />}

        {view === 'Month' ? (
          <MonthView week={week} onSelectDay={(day) => { setSelectedDay(day); setView('Day'); }} styles={styles} colors={colors} />
        ) : (
          <>
            <View style={styles.summaryRow}>
              <View><Text style={styles.summaryDay}>{WEEK_DAYS.find((item) => item.key === selectedDay)?.short}, Aug {WEEK_DAYS.find((item) => item.key === selectedDay)?.date}</Text><Text style={styles.summarySub}>{selectedMeals.length} shared meals · personalized portions</Text></View>
              <View style={styles.targetBadge}><Text style={styles.targetValue}>{totals.kcal}</Text><Text style={styles.targetUnit}> kcal</Text></View>
            </View>

            {selectedMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                styles={styles}
                colors={colors}
                onKeep={() => updateMeal(meal.id, (current) => ({ ...current, decision: current.decision === 'kept' ? 'draft' : 'kept' }))}
                onSwap={() => swapMeal(meal)}
                onLock={() => updateMeal(meal.id, (current) => ({ ...current, locked: !current.locked, decision: !current.locked ? 'kept' : current.decision }))}
              />
            ))}
          </>
        )}

        <View style={styles.planFooter}>
          <View><Text style={styles.footerTitle}>{keptCount} meals reviewed</Text><Text style={styles.footerSub}>{confirmed ? 'Plan locked. It can still adapt when life changes.' : 'Locked meals only change with your approval.'}</Text></View>
          <TouchableOpacity onPress={confirmPlan} style={[styles.confirmButton, confirmed && styles.confirmedButton]}>
            <Ionicons name={confirmed ? 'checkmark-circle' : 'lock-closed'} color="#031109" size={18} />
            <Text style={styles.confirmText}>{confirmed ? 'Week ready' : 'Lock week'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.miraButton} onPress={onOpenMira}>
          <Ionicons name="sparkles" color={colors.purple} size={23} />
          <View style={styles.miraCopy}><Text style={styles.miraTitle}>Want something different?</Text><Text style={styles.miraSub}>Ask Mira to adapt any meal or the whole week</Text></View>
          <Ionicons name="arrow-forward" color={colors.text} size={18} />
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={contextOpen} transparent animationType="slide" onRequestClose={() => setContextOpen(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.modalBackdrop} onPress={() => setContextOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Before we finalize</Text>
            <Text style={styles.sheetSubtitle}>Mira uses this context before changing the plan.</Text>

            <Text style={styles.fieldLabel}>Planned events</Text>
            {events.map((event, index) => <View key={`${event}-${index}`} style={styles.contextChip}><Ionicons name="calendar-outline" size={16} color={colors.primary} /><Text style={styles.contextChipText}>{event}</Text></View>)}
            <View style={styles.inputRow}>
              <TextInput value={eventDraft} onChangeText={setEventDraft} placeholder="Add travel, guests, eating out…" placeholderTextColor={colors.muted} style={styles.input} onSubmitEditing={addEvent} />
              <TouchableOpacity onPress={addEvent} style={styles.addButton}><Ionicons name="add" size={21} color="#031109" /></TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Leftovers to use first</Text>
            <TextInput value={leftover} onChangeText={setLeftover} placeholder="What is left from this week?" placeholderTextColor={colors.muted} style={styles.fullInput} />

            <TouchableOpacity onPress={() => setContextOpen(false)} style={styles.saveButton}><Text style={styles.saveText}>Update draft</Text></TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    screen: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128, gap: 12 },
    header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    headerCopy: { flex: 1, paddingHorizontal: 12 },
    title: { color: c.text, fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
    subtitle: { color: c.muted, fontSize: 13, marginTop: 2 },
    viewSwitch: { flexDirection: 'row', alignSelf: 'center', padding: 4, backgroundColor: c.surface, borderRadius: 16, borderWidth: 1, borderColor: c.border },
    pill: { minWidth: 78, alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 12 },
    pillActive: { backgroundColor: c.primarySoft },
    pillText: { color: c.muted, fontSize: 13, fontWeight: '700' },
    pillTextActive: { color: c.primary },
    intelligenceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.surface, borderRadius: 20, borderWidth: 1, borderColor: c.border, padding: 16 },
    sparkle: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: `${c.purple}18` },
    intelligenceCopy: { flex: 1 },
    intelligenceEyebrow: { color: c.purple, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
    intelligenceTitle: { color: c.text, fontSize: 17, fontWeight: '800', marginTop: 2 },
    intelligenceText: { color: c.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
    reviewLink: { color: c.primary, fontSize: 12, fontWeight: '800' },
    dayStrip: { gap: 8, paddingVertical: 2 },
    dayButton: { width: 48, height: 59, borderRadius: 15, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    dayButtonActive: { backgroundColor: c.primarySoft, borderColor: c.primary },
    dayShort: { color: c.muted, fontSize: 11 },
    dayDate: { color: c.text, fontSize: 17, fontWeight: '800', marginTop: 3 },
    dayActiveText: { color: c.primary },
    summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5, marginBottom: 2 },
    summaryDay: { color: c.text, fontSize: 20, fontWeight: '800' },
    summarySub: { color: c.muted, fontSize: 12, marginTop: 3 },
    targetBadge: { flexDirection: 'row', alignItems: 'baseline', backgroundColor: c.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
    targetValue: { color: c.text, fontWeight: '800', fontSize: 14 },
    targetUnit: { color: c.muted, fontSize: 11 },
    mealCard: { backgroundColor: c.surface, borderRadius: 18, borderWidth: 1, borderColor: c.border, overflow: 'hidden' },
    mealCardLocked: { borderColor: `${c.primary}88` },
    mealTop: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 11 },
    mealIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center' },
    mealCopy: { flex: 1 },
    mealMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mealType: { color: c.muted, fontSize: 11, fontWeight: '700' },
    mealTime: { color: c.muted, fontSize: 11 },
    mealName: { color: c.text, fontSize: 16, fontWeight: '800', marginTop: 3 },
    mealNutrition: { color: c.muted, fontSize: 11, marginTop: 5 },
    actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: c.border },
    action: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRightWidth: 1, borderRightColor: c.border },
    actionSelected: { backgroundColor: c.primarySoft },
    actionText: { color: c.muted, fontSize: 12, fontWeight: '700' },
    actionTextSelected: { color: c.primary },
    portions: { borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.surfaceAlt, paddingHorizontal: 14, paddingVertical: 7 },
    portionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    memberAvatar: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: c.primarySoft },
    memberInitial: { color: c.primary, fontWeight: '900' },
    portionCopy: { flex: 1, paddingLeft: 9 },
    memberName: { color: c.text, fontSize: 12, fontWeight: '800' },
    portionAmount: { color: c.muted, fontSize: 11, marginTop: 2 },
    memberTarget: { color: c.muted, fontSize: 9, maxWidth: 115, textAlign: 'right' },
    monthCard: { backgroundColor: c.surface, borderRadius: 20, borderWidth: 1, borderColor: c.border, padding: 15 },
    monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 },
    monthTitle: { color: c.text, fontSize: 18, fontWeight: '800' },
    monthHint: { color: c.muted, fontSize: 10 },
    monthWeekLabels: { flexDirection: 'row', marginBottom: 8 },
    monthWeekLabel: { width: '14.285%', color: c.muted, fontSize: 10, fontWeight: '800', textAlign: 'center' },
    monthGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    monthDay: { width: '14.285%', minHeight: 49, alignItems: 'center', justifyContent: 'center', borderRadius: 11, marginVertical: 2 },
    monthDayPlanned: { backgroundColor: c.surfaceAlt, borderWidth: 1, borderColor: c.border },
    monthDayText: { color: c.muted, fontSize: 12, fontWeight: '700' },
    monthDots: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
    monthDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: c.primary },
    monthMealCount: { color: c.primary, fontSize: 8, fontWeight: '800' },
    planFooter: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 19, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 3 },
    footerTitle: { color: c.text, fontWeight: '800', fontSize: 14 },
    footerSub: { color: c.muted, fontSize: 10, lineHeight: 14, marginTop: 3, maxWidth: 190 },
    confirmButton: { marginLeft: 'auto', backgroundColor: c.primary, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 13 },
    confirmedButton: { opacity: 0.86 },
    confirmText: { color: '#031109', fontSize: 12, fontWeight: '900' },
    miraButton: { backgroundColor: `${c.purple}16`, borderWidth: 1, borderColor: `${c.purple}55`, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
    miraCopy: { flex: 1 },
    miraTitle: { color: c.text, fontSize: 14, fontWeight: '800' },
    miraSub: { color: c.muted, fontSize: 11, marginTop: 3 },
    modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000099' },
    sheet: { backgroundColor: c.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: c.border, padding: 22, paddingBottom: 34 },
    sheetHandle: { width: 44, height: 4, borderRadius: 2, backgroundColor: c.border, alignSelf: 'center', marginBottom: 20 },
    sheetTitle: { color: c.text, fontSize: 23, fontWeight: '900' },
    sheetSubtitle: { color: c.muted, fontSize: 12, marginTop: 5, marginBottom: 20 },
    fieldLabel: { color: c.text, fontSize: 13, fontWeight: '800', marginTop: 11, marginBottom: 9 },
    contextChip: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 12, paddingHorizontal: 11, paddingVertical: 9, marginBottom: 7 },
    contextChipText: { color: c.text, fontSize: 12 },
    inputRow: { flexDirection: 'row', gap: 8 },
    input: { flex: 1, minHeight: 46, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 13, paddingHorizontal: 13, color: c.text, fontSize: 13 },
    fullInput: { minHeight: 48, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 13, paddingHorizontal: 13, color: c.text, fontSize: 13 },
    addButton: { width: 46, height: 46, borderRadius: 13, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
    saveButton: { backgroundColor: c.primary, borderRadius: 15, alignItems: 'center', paddingVertical: 14, marginTop: 22 },
    saveText: { color: '#031109', fontSize: 14, fontWeight: '900' },
  });
}
