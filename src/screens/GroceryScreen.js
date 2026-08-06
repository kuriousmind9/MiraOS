import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_INVENTORY, addEvidence, daysRemaining, inventoryStatus, overallConfidence } from '../features/inventory/inventoryModel';

const FALLBACK = { background: '#020E18', surface: '#0C1B27', surfaceAlt: '#101F2B', border: '#1B3240', text: '#F3F7F8', muted: '#91A0AB', primary: '#5CE778', success: '#5CE778', warning: '#FFB22C', danger: '#FF5F64', purple: '#B768FF' };
const palette = (theme) => ({ ...FALLBACK, ...(theme?.colors || theme || {}) });

function Card({ children, c, style }) { return <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }, style]}>{children}</View>; }

export default function GroceryScreen({ theme, inventory, onInventoryChange, onOrder, onAddLocalEvidence }) {
  const c = palette(theme);
  const [localItems, setLocalItems] = useState(inventory || DEFAULT_INVENTORY);
  const [filter, setFilter] = useState('All');
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [queued, setQueued] = useState([]);
  const items = inventory || localItems;
  const visible = filter === 'All' ? items : items.filter((item) => item.category === filter);
  const low = visible.filter((item) => inventoryStatus(item) !== 'stocked');
  const stocked = visible.filter((item) => inventoryStatus(item) === 'stocked');
  const confidence = overallConfidence(items);
  const coverage = Math.min(...items.map(daysRemaining));

  const commitItems = (next) => { setLocalItems(next); onInventoryChange?.(next); };
  const toggleQueue = (id) => setQueued((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  const submitEvidence = () => {
    const next = addEvidence(items, evidence);
    commitItems(next);
    onAddLocalEvidence?.({ text: evidence, at: new Date().toISOString() });
    setEvidence(''); setEvidenceOpen(false);
  };

  return <View style={[styles.root, { backgroundColor: c.background }]}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><Text style={[styles.title, { color: c.text }]}>Grocery</Text><Text style={[styles.subtitle, { color: c.muted }]}>Best estimate, updated from household evidence</Text></View><TouchableOpacity style={[styles.iconButton, { borderColor: c.border }]} onPress={() => setEvidenceOpen(true)}><Ionicons name="receipt-outline" size={21} color={c.text} /></TouchableOpacity></View>

      <Card c={c} style={styles.hero}>
        <View style={{ flex: 1 }}><Text style={[styles.eyebrow, { color: c.primary }]}>PANTRY CONFIDENCE · {confidence}%</Text><Text style={[styles.heroTitle, { color: c.text }]}>Covered for about {coverage} days</Text><Text style={[styles.body, { color: c.muted }]}>We’ll verify uncertain items only when it helps your plan.</Text></View>
        <View style={[styles.confidenceRing, { borderColor: confidence > 75 ? c.primary : c.warning }]}><Text style={[styles.confidenceValue, { color: c.text }]}>{confidence}</Text><Text style={[styles.ringLabel, { color: c.muted }]}>confidence</Text></View>
      </Card>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.action, { backgroundColor: c.primary }]} onPress={() => setEvidenceOpen(true)}><Ionicons name="add" size={19} color="#04140A" /><Text style={styles.actionDark}>Add local purchase</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setEvidenceOpen(true)} style={[styles.action, { backgroundColor: c.surfaceAlt, borderColor: c.border, borderWidth: 1 }]}><Ionicons name="camera-outline" size={19} color={c.text} /><Text style={[styles.actionText, { color: c.text }]}>Scan receipt</Text></TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{['All', 'Grains', 'Pulses', 'Dairy', 'Veggies'].map((name) => <TouchableOpacity key={name} onPress={() => setFilter(name)} style={[styles.filter, { backgroundColor: filter === name ? c.primary : c.surfaceAlt, borderColor: c.border }]}><Text style={[styles.filterText, { color: filter === name ? '#04140A' : c.muted }]}>{name}</Text></TouchableOpacity>)}</ScrollView>

      <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: c.text }]}>Needs attention</Text><Text style={[styles.count, { color: c.danger }]}>{low.length}</Text></View>
      <Card c={c} style={styles.listCard}>{low.length ? low.map((item, index) => <InventoryRow key={item.id} item={item} c={c} last={index === low.length - 1} queued={queued.includes(item.id)} onQueue={() => toggleQueue(item.id)} />) : <Text style={[styles.empty, { color: c.muted }]}>Everything in this category looks covered.</Text>}</Card>

      {!!stocked.length && <><View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: c.text }]}>Well stocked</Text><Text style={[styles.count, { color: c.primary }]}>{stocked.length}</Text></View><Card c={c} style={styles.listCard}>{stocked.map((item, index) => <InventoryRow key={item.id} item={item} c={c} last={index === stocked.length - 1} />)}</Card></>}

      <Card c={c} style={styles.orderCard}><View><Text style={[styles.cardTitle, { color: c.text }]}>{queued.length ? `${queued.length} item${queued.length > 1 ? 's' : ''} ready` : 'Quick refill'}</Text><Text style={[styles.body, { color: c.muted }]}>Choose delivery or keep the list for your local shop.</Text></View><View style={styles.brands}>{[['Blinkit','#F7D927','#152000'],['Zepto','#8D39C5','#FFF'],['Local list',c.surfaceAlt,c.text]].map(([name,bg,fg]) => <TouchableOpacity key={name} style={[styles.brand, { backgroundColor: bg, borderColor: c.border }]} onPress={() => onOrder?.({ provider: name, items: items.filter((item) => queued.includes(item.id)) })}><Text style={[styles.brandText, { color: fg }]}>{name}</Text></TouchableOpacity>)}</View></Card>
    </ScrollView>

    <Modal visible={evidenceOpen} transparent animationType="slide" onRequestClose={() => setEvidenceOpen(false)}><View style={styles.scrim}><View style={[styles.sheet, { backgroundColor: c.surface, borderColor: c.border }]}><View style={styles.sheetHandle} /><Text style={[styles.sheetTitle, { color: c.text }]}>What did you buy locally?</Text><Text style={[styles.body, { color: c.muted }]}>Say it naturally — for example, “Bought paneer, milk and vegetables.”</Text><TextInput autoFocus multiline value={evidence} onChangeText={setEvidence} placeholder="Type or dictate your purchase…" placeholderTextColor={c.muted} style={[styles.input, { color: c.text, borderColor: c.border, backgroundColor: c.surfaceAlt }]} /><View style={styles.sheetActions}><TouchableOpacity onPress={() => setEvidenceOpen(false)} style={styles.cancel}><Text style={[styles.actionText, { color: c.muted }]}>Cancel</Text></TouchableOpacity><TouchableOpacity disabled={!evidence.trim()} onPress={submitEvidence} style={[styles.save, { backgroundColor: evidence.trim() ? c.primary : c.border }]}><Text style={styles.actionDark}>Update pantry</Text></TouchableOpacity></View></View></View></Modal>
  </View>;
}

function InventoryRow({ item, c, last, queued, onQueue }) {
  const status = inventoryStatus(item);
  const uncertain = status === 'verify';
  return <View style={[styles.row, !last && { borderBottomColor: c.border, borderBottomWidth: StyleSheet.hairlineWidth }]}><View style={[styles.emoji, { backgroundColor: c.surfaceAlt }]}><Text style={styles.emojiText}>{item.emoji}</Text></View><View style={{ flex: 1 }}><View style={styles.nameLine}><Text style={[styles.itemName, { color: c.text }]}>{item.name}</Text>{uncertain && <View style={[styles.verifyBadge, { backgroundColor: `${c.warning}20` }]}><Text style={[styles.verifyText, { color: c.warning }]}>Verify</Text></View>}</View><Text style={[styles.itemMeta, { color: c.muted }]}>{item.amount} {item.unit} · {Math.round(item.confidence * 100)}% confidence</Text><Text style={[styles.evidence, { color: c.muted }]}>{item.source} · {item.lastEvidence}</Text></View>{onQueue ? <TouchableOpacity onPress={onQueue} style={[styles.queue, { backgroundColor: queued ? c.primary : c.surfaceAlt, borderColor: queued ? c.primary : c.border }]}><Ionicons name={queued ? 'checkmark' : 'add'} size={18} color={queued ? '#04140A' : c.text} /><Text style={[styles.queueText, { color: queued ? '#04140A' : c.text }]}>{queued ? 'Added' : 'Refill'}</Text></TouchableOpacity> : <Text style={[styles.days, { color: c.primary }]}>{daysRemaining(item)}d</Text>}</View>;
}

const styles = StyleSheet.create({
  root:{flex:1}, content:{paddingHorizontal:20,paddingTop:18,paddingBottom:130}, header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18}, title:{fontSize:28,fontWeight:'750'}, subtitle:{fontSize:12,marginTop:4}, iconButton:{width:42,height:42,borderRadius:14,borderWidth:1,alignItems:'center',justifyContent:'center'}, card:{borderWidth:1,borderRadius:22}, hero:{padding:20,flexDirection:'row',alignItems:'center',gap:14}, eyebrow:{fontSize:11,fontWeight:'800',letterSpacing:1.1}, heroTitle:{fontSize:23,fontWeight:'750',marginTop:9}, body:{fontSize:13,lineHeight:19,marginTop:6}, confidenceRing:{width:88,height:88,borderRadius:44,borderWidth:7,alignItems:'center',justifyContent:'center'}, confidenceValue:{fontSize:24,fontWeight:'800'}, ringLabel:{fontSize:9}, actions:{flexDirection:'row',gap:10,marginVertical:14}, action:{flex:1,height:48,borderRadius:15,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:7}, actionDark:{color:'#04140A',fontSize:13,fontWeight:'800'}, actionText:{fontSize:13,fontWeight:'700'}, filters:{gap:8,paddingBottom:18}, filter:{paddingHorizontal:16,paddingVertical:9,borderRadius:18,borderWidth:1}, filterText:{fontSize:12,fontWeight:'700'}, sectionHeader:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:10}, sectionTitle:{fontSize:18,fontWeight:'750'}, count:{fontSize:12,fontWeight:'800'}, listCard:{paddingHorizontal:13,marginBottom:20}, row:{minHeight:78,flexDirection:'row',alignItems:'center',gap:12,paddingVertical:10}, emoji:{width:48,height:48,borderRadius:15,alignItems:'center',justifyContent:'center'}, emojiText:{fontSize:24}, nameLine:{flexDirection:'row',gap:7,alignItems:'center'}, itemName:{fontSize:15,fontWeight:'750'}, itemMeta:{fontSize:12,marginTop:3}, evidence:{fontSize:10,marginTop:3}, verifyBadge:{borderRadius:8,paddingHorizontal:6,paddingVertical:2}, verifyText:{fontSize:9,fontWeight:'800'}, queue:{height:36,minWidth:76,paddingHorizontal:9,borderRadius:11,borderWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3}, queueText:{fontSize:11,fontWeight:'800'}, days:{fontSize:13,fontWeight:'800'}, empty:{paddingVertical:25,textAlign:'center'}, orderCard:{padding:17,gap:14}, cardTitle:{fontSize:16,fontWeight:'750'}, brands:{flexDirection:'row',gap:8}, brand:{flex:1,height:39,borderRadius:11,borderWidth:1,alignItems:'center',justifyContent:'center'}, brandText:{fontSize:12,fontWeight:'850'}, scrim:{flex:1,backgroundColor:'#0008',justifyContent:'flex-end'}, sheet:{padding:22,paddingBottom:34,borderTopLeftRadius:28,borderTopRightRadius:28,borderWidth:1}, sheetHandle:{width:42,height:4,borderRadius:2,backgroundColor:'#6B7780',alignSelf:'center',marginBottom:20}, sheetTitle:{fontSize:22,fontWeight:'800'}, input:{height:110,borderRadius:17,borderWidth:1,padding:14,marginTop:16,textAlignVertical:'top',fontSize:15}, sheetActions:{flexDirection:'row',justifyContent:'flex-end',gap:10,marginTop:15}, cancel:{paddingHorizontal:18,height:44,justifyContent:'center'}, save:{height:44,borderRadius:13,paddingHorizontal:18,justifyContent:'center'},
});
