import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';


// modifications to allow keyboardType acceptance done using Copilot in conversation that created PeriodSelector and RadioButton
type Props = {
label: string;
value: string;
onChangeText: (text: string) => void;
placeholder?: string;
keyboardType?: KeyboardTypeOptions;
};



export default function FormField({ label, value, onChangeText, placeholder, keyboardType}: Props) {
return (
<View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
    accessibilityLabel={label}
    placeholder={placeholder ?? label}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}   // ← correct
    style={styles.input}/>
</View>
);}



const styles = StyleSheet.create({wrapper: {
    marginBottom: 12,},
    label: {fontSize: 13, fontWeight: '600', marginBottom: 6,},
    input: {borderWidth: 1, borderRadius: 0, fontSize: 15, paddingHorizontal: 12, paddingVertical: 10,},
});




