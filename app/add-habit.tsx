import Dropdown from '@/components/ui/DropDown';
import FormField from '@/components/ui/form-field';
import { PeriodSelector } from '@/components/ui/PeriodSelector';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { categories, habits as habitsTable, targets as targetsTable } from '@/db/schema';
import icons from '@/misc_utilities/icons';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HabitsContext, SessionContext } from './_layout';

//
export default function AddHabit() {
const router = useRouter();
const context = useContext(HabitsContext);
const [name, setName] = useState('');
const [metricType, setMetricType] = useState('count');
const session = useContext(SessionContext);
const [icon_Id, setIcon_Id] = useState(0); // stores selected Icon 
const [category_Id, setCategory_Id] = useState(0); // stores selected category
const [categoryOptions, setCategoryOptions] = useState<{ value: number; label: string }[]>([]); // stores categories owned by user
const [period, setPeriod] = useState('weekly'); // 
const [amount, setAmount] = useState(''); 
const [error, setError] = useState(false);



useEffect(() => {
const loadCategories = async () => {
if (!session?.currentUser) return;

const Categories = await db.select().from(categories).where(eq(categories.user_id, session.currentUser.id));
    setCategoryOptions(Categories.map((c) => ({ value: c.id, label: c.name })) ); };
        void loadCategories(); 
}, []);



if (!context || !session?.currentUser) return null;
const { setHabits } = context;




const saveHabit = async () => {
if (!session?.currentUser) return null;
if (!name || category_Id === 0 || icon_Id === 0 || amount === null || isNaN(parseInt(amount)) ) {  setError(true);
 return;}
 setError(false);  


await db.insert(habitsTable).values({name, user_id: session?.currentUser?.id, category_id: category_Id, metric_type:metricType, icon_id: icon_Id, created_at: new Date().toISOString() });

const rows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, session.currentUser.id)); // keeps flagging because it thinks that session can come back null
    setHabits(rows);                                                                        // used AI to debug and make definite statement using , instead of =



const newHabits = await db.select().from(habitsTable).where(eq(habitsTable.user_id, session.currentUser.id));
const newHabit = newHabits[newHabits.length - 1]; // cheaty way for me to get at last entry

await db.insert(targetsTable).values({habit_id: newHabit.id, period: period, amount: parseInt(amount),
});
    router.back();
};


return (
<SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Create new habit"  />
            <View style={styles.form}>
          
                <FormField label="Name of your new habit" value={name} onChangeText={setName} />


                <Dropdown data={categoryOptions} placeholder="Select category" onChange={(item) => setCategory_Id(item.value)}/>

                <PeriodSelector value={period} onChange={setPeriod}/>


                <Dropdown data={icons} placeholder="Select icon" onChange={(item) => setIcon_Id(item.value)}/>


                <View style={styles.toggleRow}>
                <Text style={{ color: metricType === 'count' ? '#000000' : '#bababa' }}>Frequency</Text>
                <Switch value={metricType === 'duration'} onValueChange={(value) => setMetricType(value ? 'duration' : 'count')} trackColor={{false: "#00ff00", true: "#00ff00"}} ios_backgroundColor={"#00ff00"}/>
                <Text style={{ color: metricType === 'duration' ? '#000000' : '#C0C0C0' }}>Duration (mins)</Text>

                </View>


                <FormField label="Target Amount" value={amount} onChangeText={setAmount} keyboardType="numeric"/>

            </View>
               
               
                {error ? <Text style={styles.errorText}> Make sure all fields are filled in </Text> : null}
                <PrimaryButton label="Save Habit" onPress={saveHabit} />
        
                <View style={styles.backButton}>
                <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
                </View>

    </ScrollView>
</SafeAreaView>
);}



// need to come back to this once I get actual functionalty working.
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
  backButton: {
    marginTop: 10,
  },
  toggleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 12,
},
 errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 8,
  },
});

