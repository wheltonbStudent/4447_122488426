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


// manually splitting string into date & time components since there is no javascript -- solution described in debug using copilot: 
const parts = rows[0].logged_at.split('T');
const date_parts = parts[0].split('-');
const time_parts = parts[1].split(':');
const processed_datetime_string = new Date(
    parseInt(date_parts[0]),
    parseInt(date_parts[1]) - 1,
    parseInt(date_parts[2]),
    parseInt(time_parts[0]),
    parseInt(time_parts[1]),
    parseInt(time_parts[2] || '0')
);
setDate(processed_datetime_string);}};
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

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // regular month offset for dealing w [0-11] 
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');
const seconds = String(date.getSeconds()).padStart(2, '0');
const local_Datetime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

await db.update(logsTable).set({value: parseInt(value), logged_at: local_Datetime,}).where(eq(logsTable.id, Number(id)));    router.back();
};







return (
<SafeAreaView style={styles.safeArea}>
<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

    <View style={styles.form}>

        <FormField label="Amount" value={value} onChangeText={setValue} keyboardType="numeric"/>




        <Text style={styles.label}>Date</Text>
        
        <Pressable onPress={() => setShow_date(true)} style={styles.button_selector}>
        <Text>
            {String(date.getDate()).padStart(2, '0')}-{String(date.getMonth() + 1).padStart(2, '0')}-{date.getFullYear()}
        </Text>    
        </Pressable>

        {show_date && (
        <DateTimePicker
            value={date}
            display={'spinner'}
            mode="date"
            is24Hour={true}
            onChange={on_date_change}/>
        )}







        <Text style={styles.label}>Time</Text>

        <Pressable onPress={() => setShow_time(true)} style={styles.button_selector}>
        <Text>
            {String(date.getHours()).padStart(2, '0')}:{String(date.getMinutes()).padStart(2, '0')}
        </Text>
        </Pressable>

        {show_time && (
        <DateTimePicker
                        value={date}
                        mode="time"
                        is24Hour={true}
                        display={'spinner'}
                        onChange={on_time_change}/>)}
    
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