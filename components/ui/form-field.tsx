import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
label: string;
value: string;
onChangeText: (text: string) => void;
placeholder?: string;
};

export default function FormField({ label, value, onChangeText, placeholder }: Props) {
return (
<View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
    accessibilityLabel={label}
    placeholder={placeholder ?? label}
    value={value}
    onChangeText={onChangeText}
    style={styles.input}/>
</View>
);}



const styles = StyleSheet.create({wrapper: {
    marginBottom: 12,},
    label: {fontSize: 13, fontWeight: '600', marginBottom: 6,},
    input: {borderWidth: 1, borderRadius: 0, fontSize: 15, paddingHorizontal: 12, paddingVertical: 10,},
});