// form page for updating a logs datetiem and entered amount 
// repo and video links for datetime selectors I'm using
// https://www.youtube.com/watch?v=nZwrxeUHtOQ
// https://github.com/chelseafarley/DateTimePickerTutorialReactNative

import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habit_logs as logsTable } from '@/db/schema';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Log } from '../../_layout';


export default function EditLog() {
const { id } = useLocalSearchParams<{ id: string }>();
const router = useRouter();
const [value, setValue] = useState('');
const [date, setDate] = useState(new Date());
const [error, setError] = useState(false);
const [log, setLog] = useState<Log | null>(null);
const [show_date, setShow_date] = useState(false); // controls when date picker is visible
const [show_time, setShow_time] = useState(false); // controls when time picker is visible




// load up the log passed from the habits path
useEffect(() => {
const load_log = async () => {
const rows = await db.select().from(logsTable).where(eq(logsTable.id, Number(id)));
if (rows.length > 0) {
    setLog(rows[0]);
    setValue(rows[0].value.toString());
    setDate(new Date(rows[0].logged_at));
}};
    void load_log(); }, []);


if (!log) return null;


const on_date_change = (e: any, selected_date: any) => {
if (selected_date) setDate(selected_date);
setShow_date(false); // close the picker after selection
};

const on_time_change = (e: any, selected_date: any) => {
if (selected_date) setDate(selected_date);
setShow_time(false); // close the picker after selection
};


const save_changes = async () => {
if (!value || isNaN(parseInt(value))) {
    setError(true);
    return;}

setError(false);
// pass updated fields back with a converter from date
await db.update(logsTable).set({value: parseInt(value), logged_at: date.toISOString(),}).where(eq(logsTable.id, Number(id)));
    router.back();
};







return (
<SafeAreaView style={styles.safeArea}>
<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

    <View style={styles.form}>

        <FormField label="Amount" value={value} onChangeText={setValue} keyboardType="numeric"/>

        <Text style={styles.label}>Date</Text>
        <Pressable onPress={() => setShow_date(true)} style={styles.button_selector}>
            <Text>{date.toISOString().substring(0, 10)}</Text>
        </Pressable>

        {show_date && (
        <DateTimePicker
            value={date}
            display={'spinner'}
            mode="date"
            is24Hour={true}
            onChange={on_date_change}
        />
        )}

        <Text style={styles.label}>Time</Text>
        <Pressable onPress={() => setShow_time(true)} style={styles.button_selector}>
            <Text>{date.toISOString().substring(11, 16)}</Text>
        </Pressable>

        {show_time && (
        <DateTimePicker
            value={date}
            mode="time"
            is24Hour={true}
            display={'spinner'}
            onChange={on_time_change}
        />
        )}

    </View>

        {error ? <Text style={styles.errorText}>enter a valid number</Text> : null}

        <PrimaryButton label="Save Changes" onPress={save_changes} />

        <View style={styles.backButton}>

        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />

    </View>
</ScrollView>
</SafeAreaView>
);}




const styles = StyleSheet.create({
safeArea: { backgroundColor: '#F8FAFC', flex: 1, padding: 20, },

content: { paddingBottom: 24,},

form: { marginBottom: 6,},

label: { color: '#334155', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12,},

button_selector: { backgroundColor: '#dbdada', padding: 12, marginBottom: 4,},

backButton: { marginTop: 10, },

errorText: { color: '#DC2626', fontSize: 13, marginBottom: 8, },
});