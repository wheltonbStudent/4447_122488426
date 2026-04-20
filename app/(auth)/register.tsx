import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionContext } from '../_layout';



export default function RegisterScreen() {
const context = useContext(SessionContext);
const router = useRouter();
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

if (!context) return null;

const handleRegister = async () => {
if (!username || !password) {
    setError('Please fill in all fields');
    return;}

if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return;}

const success = await context.register(username, password);
if (!success) {
    setError('That username is taken');}
};



return (
<SafeAreaView style={styles.container}>
    <View style={styles.form}>
    <Text style={styles.title}>Create account</Text>
    
    <FormField label="Username" value={username} onChangeText={setUsername}/>

    <FormField label="Password" value={password} onChangeText={setPassword}/>

    {error ? <Text style={styles.error}>{error}</Text> : null}
    <PrimaryButton label="Register" onPress={handleRegister}/>
    
    <PrimaryButton label="Already registered? Log in" variant="secondary" onPress={() => router.replace('/(auth)/login')}/>
    </View>
    </SafeAreaView>
);}



const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24,},
  form: {gap: 8,},
  title: {fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24,},
  error: {color: '#7F1D1D', fontSize: 13,},
});

