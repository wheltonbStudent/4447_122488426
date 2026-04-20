// component wholely AI generated as part of conversation at https://copilot.microsoft.com/shares/d4SXvyMHUNhS3QjfB2WzW
import { StyleSheet, Text, View } from 'react-native';
import { RadioButton } from './RadioButton';

type PeriodSelectorProps = {
  value: string;
  onChange: (p: string) => void;
};

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Period</Text>

      <RadioButton
        label="Daily"
        selected={value === 'daily'}
        onPress={() => onChange('daily')}
      />

      <RadioButton
        label="Weekly"
        selected={value === 'weekly'}
        onPress={() => onChange('weekly')}
      />

      <RadioButton
        label="Monthly"
        selected={value === 'monthly'}
        onPress={() => onChange('monthly')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
});
