import { Habit, HabitsContext } from '@/app/_layout';
import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function HabitsScreen() {
const router = useRouter();
const context = useContext(HabitsContext);
if (!context) return null;

const { habits } = context;





return (
<SafeAreaView style={styles.safeArea}>
    
    <PrimaryButton label="Create a new habit to track" onPress={() => router.push({ pathname: '/add-habit' })}/>
    
    <ScrollView contentContainerStyle={styles.listContent}>
        {habits.length === 0 ? ( 
            <Text style={styles.emptyText}>No habits yet </Text>) : (habits.map(
                (habit: Habit) => ( <HabitCard key={habit.id} habit={habit} />) ))
        }
    </ScrollView>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});
