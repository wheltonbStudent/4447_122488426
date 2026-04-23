import { Habit, HabitsContext } from '@/app/_layout';
import HabitCard from '@/components/HabitCard';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitsScreen() {
const router = useRouter();
const context = useContext(HabitsContext);
if (!context) return null;

const { habits } = context;


const [Query, setQuery] = useState('');
const processed_Query = Query.trim().toLowerCase();

const filtered_habits = habits.filter((habit: Habit) => {
    return processed_Query.length === 0 || habit.name.toLowerCase().includes(processed_Query);
});




return (
<SafeAreaView style={styles.safeArea}>
    
<PrimaryButton label="Create a new habit to track" onPress={() => router.push({ pathname: '/add-habit' })}/>

<TextInput
  value={Query}
  onChangeText={setQuery}
  placeholder="Search habits"
  style={styles.searchbox}/>

<ScrollView contentContainerStyle={styles.listContent}>
    {filtered_habits.length === 0 ? ( 
        <Text style={styles.emptyText}>no habits matching '{Query}'</Text>) : (filtered_habits.map(
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
  searchbox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
},

});


