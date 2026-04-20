import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionContext } from '../_layout';

export default function LoginScreen() {
const context = useContext(SessionContext);
const router = useRouter();
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

if (!context) return null;

const handleLogin = async () => {
if (!username || !password) {
    setError('Please fill in all fields');
    return;}


const success = await context.login(username, password);
    if (!success) {
    setError('Incorrect username or password');
}};


return (
<SafeAreaView style={styles.container}>
    <View style={styles.form}>
    
    <Text style={styles.title}>Daily Rhythm</Text>
    
    <FormField label="Username" value={username} onChangeText={setUsername}/>
        
    <FormField label="Password" value={password} onChangeText={setPassword}/>

    
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <PrimaryButton label="Log in" onPress={handleLogin}/>
    
    <PrimaryButton label="New here? Register" variant="secondary" onPress={() => router.push('/(auth)/register')}/>
    
    </View>
    </SafeAreaView>
);}



const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 24,},
  form: {gap: 8,},
  title: {fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24,},
  error: {color: '#cc0000', fontSize: 13,},});