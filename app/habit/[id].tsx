// // direct rip and adaptation from sample student project
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit, HabitsContext, SessionContext } from '../_layout';



export default function HabitDetail() {
const { id } = useLocalSearchParams<{ id: string }>();
const router = useRouter();
const context = useContext(HabitsContext);
const session = useContext(SessionContext);



if (!context || !session?.currentUser) return null;


const { habits, setHabits } = context;
const habit = habits.find((h: Habit) => h.id === Number(id));


if (!habit) return null;

const deleteHabit = async () => { await db.delete(habitsTable).where(eq(habitsTable.id, Number(id)));
const rows = await db.select().from(habitsTable).where(eq(habitsTable.user_id, session.currentUser!.id));
    setHabits(rows);
    router.back();
};





return (
<SafeAreaView style={styles.safeArea}>
    <Text style={styles.name}> what do you want to do to your {habit.name} goal?</Text>
    

    <PrimaryButton label="Edit" onPress={() => router.push({ pathname: '/habit/[id]/edit', params: { id },})}/>


    <View style={styles.backButton}>
    <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
    </View>


    <View style={styles.buttonSpacing}>
    <PrimaryButton label="Delete" variant="danger" onPress={deleteHabit} />
    </View>


</SafeAreaView>
);}




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 150,
    alignContent: 'center'
  },
  detail: {
    fontSize: 16,
    marginBottom: 18,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  backButton: {
    marginTop: 10,
  },
});