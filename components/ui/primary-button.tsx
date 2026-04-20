import { Pressable, StyleSheet, Text } from 'react-native';



type Props = {label: string; onPress: () => void;
compact?: boolean;
variant?: 'primary' | 'secondary' | 'danger';
};



export default function PrimaryButton({ label, onPress, compact = false, variant = 'primary',}: 
Props) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : null,
        variant === 'danger' ? styles.danger : null,
        compact ? styles.compact : null,
        pressed ? styles.pressed : null, 
        ]}>
      
      
    <Text
      style={[
        styles.label,
        variant === 'secondary' ? styles.secondaryLabel : null,
        variant === 'danger' ? styles.dangerLabel : null,
        compact ? styles.compactLabel : null,
]}>
      {label}
    </Text>
    </Pressable>
);}



const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  secondary: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  danger: {
    backgroundColor: '#fff',
    borderColor: '#cc0000',
    borderWidth: 1,
  },
  compact: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryLabel: {
    color: '#000',
  },
  dangerLabel: {
    color: '#cc0000',
  },
  compactLabel: {
    fontSize: 13,
},
});