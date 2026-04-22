import { Log } from '@/app/_layout';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { habit_logs as logsTable } from '@/db/schema';
import { useFocusEffect } from '@react-navigation/native';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function HabitLogs() {
const { id } = useLocalSearchParams<{ id: string }>();
const router = useRouter();
const [logs, setLogs] = useState<Log[]>([]);



// new log loader that refreshes logs on every view 
useFocusEffect(
useCallback(() => {
const load_logs = async () => {
const rows = await db.select().from(logsTable).where(eq(logsTable.habit_id, Number(id)));
    setLogs(rows);
};
    void load_logs();
}, [])
);



const get_date_label = (date_string: string) => {

const current = new Date(); // month is being offset by +1 here becasue indexing starts at [0]-[11] instead of [1]-[12] -_-

const today = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;



const yesterday_date = new Date();
yesterday_date.setDate(yesterday_date.getDate() - 1);
//same lil workaround for lining up the month array with the regular 1-12 calendar format
const yesterday = `${yesterday_date.getFullYear()}-${String(yesterday_date.getMonth() + 1).padStart(2, '0')}-${String(yesterday_date.getDate()).padStart(2, '0')}`;


const log_date = date_string.substring(0, 10); // just gets the date part of a given logs full date-time string


if (log_date === today) return 'Today'; 
if (log_date === yesterday) return 'Yesterday';
return log_date;
};



// pulls just the time out of the ISO string (e.g. 14:30)
const get_time = (date_string: string) => {
return date_string.substring(11, 16);
};



const delete_log = async (log_Id: number) => {
await db.delete(logsTable).where(eq(logsTable.id, log_Id));



// re-select logs once the delete goes throuhg 
const rows = await db.select().from(logsTable).where(eq(logsTable.habit_id, Number(id)));
    setLogs(rows);
};


// sort a copy of the array so newest first so today shows at top without messing up the array
const sorted_logs = [...logs].sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()); 



return (
<SafeAreaView style={styles.safeArea}>

    <PrimaryButton label="Add new entry" onPress={() => router.push({ pathname: '/habit/[id]/log', params: { id },})}/>

        <View style={styles.backButton}>
        <PrimaryButton label="Back to habit" onPress={() => router.push({ pathname: '/habit/[id]', params: { id },})}/>
        </View>

    <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

        {sorted_logs.length === 0 ? (
        <Text style={styles.emptyText}>No entries for this habit yet</Text>
        ) : (
        sorted_logs.map((log, index) => {
            const date_label = get_date_label(log.logged_at);
            const prev_label = index > 0 ? get_date_label(sorted_logs[index - 1].logged_at) : '';
            const show_header = date_label !== prev_label;

            return (
            <View key={log.id}>
                {show_header ? <Text style={styles.dateHeader}>{date_label}</Text> : null}

                <View style={styles.logRow}>

                    <View>
                        <Text style={styles.logValue}>amount logged: {log.value}</Text>
                        <Text style={styles.logTime}>completed at: {get_time(log.logged_at)}</Text>
                    </View>

                    <View style={styles.rowButtons}>
                        <PrimaryButton label="Edit" compact
                            onPress={() => router.push({ pathname: '/log/[id]/edit', params: { id: log.id.toString() },})}/>

                        <PrimaryButton label="Delete" compact variant="danger"
                            onPress={() => delete_log(log.id)}/>
                    </View>

                </View>
            </View>
            );
        })
        )}

    </ScrollView>

</SafeAreaView>
);}




const styles = StyleSheet.create({
safeArea: { backgroundColor: '#F8FAFC', flex: 1, paddingHorizontal: 18, paddingTop: 10, },

listContent: { paddingBottom: 24, paddingTop: 14, },

emptyText: { color: '#475569', fontSize: 16, paddingTop: 8, textAlign: 'center', },

dateHeader: { fontSize: 16, color: '#000000', marginTop: 16, marginBottom: 6, },

logRow: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
backButton: { marginTop: 10, },

logValue: { fontSize: 16, fontWeight: '600', color: '#111827', },

logTime: { fontSize: 14, color: '#000000', marginTop: 2, },

rowButtons: { flexDirection: 'row', gap: 8, },
});