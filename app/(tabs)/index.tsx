// home screen to display habits current habit performance overview
import Dropdown from '@/components/ui/DropDown';
import { CATEGORY_COLORS } from '@/constants/category_palette';
import { db } from '@/db/client';
import { habit_logs as logsTable, targets as targetsTable } from '@/db/schema';
import ICONS from '@/misc_utilities/icons';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesContext, HabitsContext, Log, SessionContext, Target, } from '../_layout';






export default function HomeScreen() {
const router = useRouter();
const habit_context = useContext(HabitsContext);
const category_context = useContext(CategoriesContext);
const session = useContext(SessionContext);
const [selected_period, set_selected_period] = useState('daily');
const [selected_category_Id, set_selected_category_Id] = useState(0); // 0 means all categories
const [targets, set_targets] = useState<Target[]>([]);
const [logs, set_logs] = useState<Log[]>([]);


// load targets and logs whenever the screen gets opened (same idea as log view where I stop stale records visibility)
useFocusEffect(
useCallback(() => {
const load_data = async () => {
    if (!session?.currentUser) return;
    const target_rows = await db.select().from(targetsTable);
    set_targets(target_rows);
    const log_rows = await db.select().from(logsTable);
    set_logs(log_rows);
};
    void load_data();
}, [])
);


if (!habit_context || !category_context || !session?.currentUser) return null;

const { habits } = habit_context;
const { categories } = category_context;

// creates and populate the dropdown category filter with spreader mixing the default selected value in front of w the category array
const category_options = [
    { value: 0, label: 'All categories' }, ...categories.map((category) => ({ value: category.id, label: category.name })),
];


// works out the start datetime for whichever period tab you want to see
const get_start_of_period = () => {
const now = new Date();


if (selected_period === 'daily'){
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T00:00:00`;
}


if (selected_period === 'weekly'){
// goes back to most recent monday
const day_of_week = now.getDay();
const days_since_monday = day_of_week === 0 ? 6 : day_of_week - 1;
const monday = new Date(now);
    monday.setDate(now.getDate() - days_since_monday);
        return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}T00:00:00`;
}

if (selected_period === 'monthly') {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01T00:00:00`;
}

return '';
};


//adds up all log values for a habit that fall within the current period
const get_progress_by_habitID = (habit_id: number) => {
const period_start = get_start_of_period();
const habit_logs = logs.filter((log) => log.habit_id === habit_id && log.logged_at >= period_start);
let total = 0;
for (let current_entry = 0; current_entry < habit_logs.length; current_entry++) {
    total = total + habit_logs[current_entry].value;
}
return total;
};


// find the target amount for a given habit
const get_target_by_habitID = (habit_id: number) => {
const match = targets.find((t) => t.habit_id === habit_id);
if (!match) return 0; 
return match.amount;
};


// look up the category colour for a habit
const get_category_colour = (category_id: number) => {
const category = categories.find((c) => c.id === category_id);
if (!category) return '#999999'; // This edge case can't actually happen but if I don't address it it just flags as an error in my interpreter
const colour = CATEGORY_COLORS.find((c) => c.id === category.colour_id);
return colour ? colour.hex : '#999999'; // This edge case can't actually happen but if I don't address it it just flags as an error in my interpreter
};


// look up the icon name for a habit
const get_icon_name = (icon_id: number) => {
const match = ICONS.find((icon_to_find) => icon_to_find.value === icon_id);
return match ? match.icon : 'help-outline';
};


// filter by period first, then narrow by category if one is picked
const habits_in_period = habits.filter((habit) => {
const target = targets.find((t) => t.habit_id === habit.id);
if (!target || target.period !== selected_period) return false;
if (selected_category_Id !== 0 && habit.category_id !== selected_category_Id) return false;
return true;
});


const period_options = ['daily', 'weekly', 'monthly'];



return (
<SafeAreaView style={styles.safeArea}>

<Dropdown
    data={category_options}
    placeholder="All categories"
    onChange={(item) => set_selected_category_Id(item.value)}/>


<View style={styles.tabRow}>
        
    {period_options.map((period) => (

    <Pressable key={period}
        onPress={() => set_selected_period(period)}
        style={[styles.tab, selected_period === period ? styles.tabSelected : null]}>
                    
        <Text style={[styles.tabText, selected_period === period ? styles.tabTextSelected : null]}>
              {period}
        </Text>

    </Pressable>
))}
</View>


{habits_in_period.length === 0 ? (

<Text style={styles.emptyText}>you don't have any {selected_period} habits in this category yet</Text>
) : (
    
<FlatList
    data={habits_in_period}
    numColumns={2}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={styles.gridContent}
    renderItem={({ item }) => {
    const progress = get_progress_by_habitID(item.id);
    const target = get_target_by_habitID(item.id);

    return (        
    <View style={styles.card}>
            
    <Ionicons 
        name={get_icon_name(item.icon_id) as any}
        size={32}
        color={get_category_colour(item.category_id)}/>

        <Text style={styles.habitName}>{item.name}</Text>
        <Text style={styles.progressText}>{progress}/{target}</Text>

        <Pressable style={styles.logButton}
                       onPress={() => router.push({ pathname: '/habit/[id]/log', params: { id: item.id.toString() },})}>
            
        <Ionicons name="add-circle-outline" size={24} color="#0F766E" />
            
        </Pressable>
        
    </View>
);
}}/>
)}
</SafeAreaView>
);}




const styles = StyleSheet.create({
safeArea: { backgroundColor: '#F8FAFC', flex: 1, paddingHorizontal: 18, paddingTop: 10, },

tabRow: { flexDirection: 'row', marginBottom: 16, marginTop: 12, gap: 8, },

tab: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, },

tabSelected: { backgroundColor: '#0F766E', borderColor: '#0F766E', },

tabText: { fontSize: 14, fontWeight: '500', color: '#111827', },

tabTextSelected: { color: '#FFFFFF', },

emptyText: { color: '#475569', fontSize: 16, paddingTop: 20, textAlign: 'center', },

gridContent: { paddingBottom: 24, },

card: { flex: 1, backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, margin: 6, padding: 16, alignItems: 'center', },

habitName: { fontSize: 13, fontWeight: '500', color: '#111827', marginTop: 8, textAlign: 'center', },

progressText: { fontSize: 16, fontWeight: '600', color: '#334155', marginTop: 4, },

logButton: { marginTop: 10, },
});