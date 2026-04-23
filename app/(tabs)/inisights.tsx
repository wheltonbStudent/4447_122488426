// insights screen - pie charts showing category breakdown by period
import { CATEGORY_COLORS } from '@/constants/category_palette';
import { db } from '@/db/client';
import { habit_logs as logsTable, targets as targetsTable } from '@/db/schema';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesContext, HabitsContext, Log, SessionContext, Target } from '../_layout';



export default function InsightsScreen() {
const habit_context = useContext(HabitsContext);
const category_context = useContext(CategoriesContext);
const session = useContext(SessionContext);
const [targets, set_targets] = useState<Target[]>([]);
const [logs, set_logs] = useState<Log[]>([]);







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
}, []));

if (!habit_context || !category_context || !session?.currentUser) return null;



const { habits } = habit_context;
const { categories } = category_context;
const screen_width = Dimensions.get('window').width;




const get_start_of_period = (period: string) => {
const now = new Date();

if (period === 'daily') {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T00:00:00`;
}

if (period === 'weekly') {
    const day_of_week = now.getDay();
    const days_since_monday = day_of_week === 0 ? 6 : day_of_week - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - days_since_monday);
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}T00:00:00`;
}



if (period === 'monthly') {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01T00:00:00`;
}

return '';
};




// get the category colour hex for each category
const get_category_colour = (colour_Id: number) => {
const match = CATEGORY_COLORS.find((c) => c.id === colour_Id);
return match ? match.hex : '#999999'; // this keeps flagging as 'could be unassigned' without edge case assignment
};


// gets the second light shade version of category colours so I cna make a portion of the chart 'unachieved'
const get_light_colour = (colour_Id: number) => {
const match = CATEGORY_COLORS.find((c) => c.id === colour_Id);
return match ? match.light : '#CCCCCC';
};




// builds the pie chart data for a given period
// groups habits by category and adds up all log values per category within the period
const build_chart_data = (period: string) => {
const period_start = get_start_of_period(period);




// only grab out habits that have a result matching from this period
const period_habits = habits.filter((habit) => {
const target = targets.find((targets_in_period) => targets_in_period.habit_id === habit.id);
    return target && target.period === period;
});




// go through each category and add up progress from all its habits
const chart_data: { name: string; population: number; color: string; legendFontColor: string; legendFontSize: number; }[] = []; // I don't actually the legend anymore since it goes off-screen, 
                                                                                                    // just manually created my own in the jsx section and I cant be bothered cleaning this up since it work
                                                                                                    // and I have to focus on my report
categories.forEach((category) => {

// find all habits in this category that match the period
const category_habits = period_habits.filter((habits_in_period) => habits_in_period.category_id === category.id);
if (category_habits.length === 0) return; // skip categories with no habits in this period




    
    let category_progress = 0; // needed for comparative between goals met / actual 
    let category_target = 0; 


category_habits.forEach((habit) => {
const habit_logs = logs.filter((log) => log.habit_id === habit.id && log.logged_at >= period_start);
      habit_logs.forEach((log) => {category_progress = category_progress + log.value;
});


const habit_target = targets.find((t) => t.habit_id === habit.id);
    if (habit_target) category_target = category_target + habit_target.amount;
});


const remaining = category_target > category_progress ? category_target - category_progress : 0;




chart_data.push({ name: category.name + ' goals achieved',
                  population: category_progress,
                  color: get_category_colour(category.colour_id),
                  legendFontColor: '#111827',
                  legendFontSize: 12,});

                if (remaining > 0) 
                    
                { chart_data.push({ name: category.name + ' goals unachieved',
                                                       population: remaining,
                                                       color: get_light_colour(category.colour_id),
                                                       legendFontColor: '#475569',
                                                       legendFontSize: 12,
});
}
});

return chart_data;
};




const daily_data = build_chart_data('daily');
const weekly_data = build_chart_data('weekly');
const monthly_data = build_chart_data('monthly');




const chart_config = {
color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

return (
<SafeAreaView style={styles.safeArea}>
<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    
    
    <Text style={styles.sectionHeader}>Daily</Text>
    
    {daily_data.length === 0 ? (
        <Text style={styles.emptyText}>no daily habit data yet</Text>
) : (
        <View>
            <PieChart
                data={daily_data}
                width={screen_width - 36}
                height={200}
                chartConfig={chart_config}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
                absolute/>
            {daily_data.map((entry, index) => (
                
                
                <View key={index} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: entry.color }]} />
                    <Text style={styles.legendText}>{entry.name}: {entry.population}</Text>
                </View>
            ))}
        </View>
)}


    <Text style={styles.sectionHeader}>Weekly</Text>
    
    {weekly_data.length === 0 ? (
    
    <Text style={styles.emptyText}>no weekly habit data yet</Text>
) : (
        <View>
            <PieChart
                data={weekly_data}
                width={screen_width - 36}
                height={200}
                chartConfig={chart_config}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
                absolute/>
            {weekly_data.map((entry, index) => (
                <View key={index} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: entry.color }]} />
                    <Text style={styles.legendText}>{entry.name}: {entry.population}</Text>
                </View>
            ))}
        </View>
)}


    <Text style={styles.sectionHeader}>Monthly</Text>
    
    {monthly_data.length === 0 ? (
        
        <Text style={styles.emptyText}>no monthly habit data yet</Text>
) : (
        <View>
            <PieChart
                data={monthly_data}
                width={screen_width - 36}
                height={200}
                chartConfig={chart_config}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
                absolute/>
            {monthly_data.map((entry, index) => (
                <View key={index} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: entry.color }]} />
                    <Text style={styles.legendText}>{entry.name}: {entry.population}</Text>
                </View>
            ))}
        </View>
)}

</ScrollView>
</SafeAreaView>
);}




const styles = StyleSheet.create({
safeArea: { backgroundColor: '#F8FAFC', flex: 1, paddingHorizontal: 18, paddingTop: 10, },

content: { paddingBottom: 24, },

sectionHeader: { fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 20, marginBottom: 8, },

emptyText: { color: '#475569', fontSize: 14, textAlign: 'center', marginBottom: 16, },

legendRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginBottom: 4, },

legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8, },

legendText: { fontSize: 13, color: '#111827', },
});