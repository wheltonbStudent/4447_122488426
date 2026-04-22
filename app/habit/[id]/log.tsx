// stripped down version of add-category, just need a value input for logging
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habit_logs as logsTable } from '@/db/schema';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function AddLog() {
const { id } = useLocalSearchParams<{ id: string }>();
const router = useRouter();
const [value, setValue] = useState('');
const [error, setError] = useState(false);



const save_log = async () => {
if (!value || isNaN(parseInt(value))) {
    setError(true);
    return;}

setError(false);
await db.insert(logsTable).values({habit_id: Number(id), logged_at: new Date().toISOString(), value: parseInt(value),});
router.replace('/(tabs)');
};




return (
<SafeAreaView style={styles.safeArea}>

<View style={styles.form}>

<FormField label="Enter the amount you want to log" value={value} onChangeText={setValue} keyboardType="numeric"/>

</View>
    {error ? <Text style={styles.errorText}>enter a valid number</Text> : null}

    <PrimaryButton label="Save Log" onPress={save_log}/>

    <View style={styles.backButton}>

        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />

    </View>

</SafeAreaView>
);}




const styles = StyleSheet.create({
safeArea: { backgroundColor: '#F8FAFC', flex: 1, padding: 20, },

form: { marginBottom: 6, },

backButton: { marginTop: 10, },

errorText: { color: '#DC2626', fontSize: 13, marginBottom: 8, },
});