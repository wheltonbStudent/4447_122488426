import Dropdown from '@/components/ui/DropDown';
import FormField from '@/components/ui/form-field';
import { PeriodSelector } from '@/components/ui/PeriodSelector';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories, habits as habitsTable, targets as targetsTable } from '@/db/schema';
import icons from '@/misc_utilities/icons';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit, HabitsContext, SessionContext } from '../../_layout';



export default function EditHabit() {
const { id } = useLocalSearchParams<{ id: string }>();
const router = useRouter();
const context = useContext(HabitsContext);
const session = useContext(SessionContext);
const [name, setName] = useState('');
const [metricType, setMetricType] = useState('count');
const [icon_Id, setIcon_Id] = useState(0);
const [category_Id, setCategory_Id] = useState(0);
const [categoryOptions, setCategoryOptions] = useState<{ value: number; label: string }[]>([]);
const [period, setPeriod] = useState('weekly');
const [amount, setAmount] = useState('');
const [error, setError] = useState(false);
const [categoryDefault, setCategoryDefault] = useState('');
const [iconDefault, setIconDefault] = useState('');
const habit = context?.habits.find((h: Habit) => h.id === Number(id));



useEffect(() => {
  const loadCategories = async () => {
    if (!session?.currentUser) return;
    const rows = await db.select().from(categories).where(eq(categories.user_id, session.currentUser.id));
    setCategoryOptions(rows.map((c) => ({ value: c.id, label: c.name })));
  };
  void loadCategories();
}, []);

// pull in all habit details for filling form
useEffect(() => {
if (!habit) return;

setName(habit.name); 
setMetricType(habit.metric_type);
setCategory_Id(habit.category_id);
setIcon_Id(habit.icon_id);



// find & pull in the category name from table to match the existing ID 
const category_match = categoryOptions.find((c) => c.value === habit.category_id);
if (category_match) setCategoryDefault(category_match.label);



// find the right icon from icon table for prefill 
const icon_match = icons.find((i: { value: number; label: string }) => i.value === habit.icon_id);
if (icon_match) setIconDefault(icon_match.label);



// grab in the target that was previously set for the habit
const loadTarget = async () => {
const targetRows = await db.select().from(targetsTable).where(eq(targetsTable.habit_id, Number(id)));
if (targetRows.length > 0) {
    setPeriod(targetRows[0].period);
    setAmount(targetRows[0].amount.toString());
}};
    void loadTarget();
}, [habit, categoryOptions]);


if (!context || !session?.currentUser || !habit) return null;


// before saving checks if the form has any wewird or missing entries so everything doesn't just explode 
const { setHabits } = context;
const saveChanges = async () => {
if (!name || category_Id === 0 || icon_Id === 0 || !amount || isNaN(parseInt(amount))) {
    setError(true);
    return;
}
setError(false);


// apply updated values  
await db.update(habitsTable).set({name, metric_type: metricType, category_id: category_Id, icon_id: icon_Id,}).where(eq(habitsTable.id, Number(id)));
await db.update(targetsTable).set({period: period,amount: parseInt(amount),}).where(eq(targetsTable.habit_id, Number(id)));

const rows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, session.currentUser!.id));
setHabits(rows);
router.back();
};




return (
<SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.form}>

            <FormField label="Name" value={name} onChangeText={setName} />

            <Dropdown data={categoryOptions} placeholder="Select category" defaultValue={categoryDefault} onChange={(item) => setCategory_Id(item.value)}/>

            <PeriodSelector value={period} onChange={setPeriod}/>

            <Dropdown data={icons} placeholder="Select icon" defaultValue={iconDefault} onChange={(item) => setIcon_Id(item.value)}/>


            <View style={styles.toggleRow}>
                <Text style={{ color: metricType === 'count' ? '#000000' : '#C0C0C0' }}>Frequency</Text>
                <Switch value={metricType === 'duration'} onValueChange={(value) => setMetricType(value ? 'duration' : 'count')} trackColor={{false: "#00ff00", true: "#00ff00"}} ios_backgroundColor={"#00ff00"}/>
                <Text style={{ color: metricType === 'duration' ? '#000000' : '#C0C0C0' }}>Duration (mins)</Text>
            </View>



            <FormField label="Target Amount" value={amount} onChangeText={setAmount} keyboardType="numeric"/>

        </View>

            {error ? <Text style={styles.errorText}>please fill in all fields</Text> : null} 
        <PrimaryButton label="Save Changes" onPress={saveChanges} />

        <View style={styles.buttonSpacing}>
            <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        </View>

    </ScrollView>
</SafeAreaView>
);}



const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 8,
  },
});