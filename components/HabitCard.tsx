// initial jerry-rigging of StudentCard to adapt it to purpose, further revision to come
import { Habit } from '@/app/_layout';
import InfoTag from '@/components/info-tag';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  habit: Habit;
};

export default function HabitCard({ habit }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/habit/[id]', params: { id: habit.id.toString() } });
  const habitSummary = `${habit.name}, Metric ${habit.metric_type}`; 


  
  return (
    <Pressable
      accessibilityLabel={`${habitSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View>
        <Text style={styles.name}>{habit.name}</Text>
      </View>

      <View style={styles.tags}>
        <InfoTag label="Metric Type" value={habit.metric_type} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  name: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
});
