import PrimaryButton from '@/components/ui/primary-button';
import { useContext } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionContext } from '../_layout';



export default function AccountScreen() {
const context = useContext(SessionContext);
if (!context) return null;


const handleDelete = () => {
Alert.alert('Delete account', 'This action cannot be undone',[
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => context.deleteProfile()},
]);};


return (
<SafeAreaView style={styles.container}>
    <View style={styles.buttons}>
    
    <PrimaryButton label="Log out" onPress={context.logout} />
    <PrimaryButton label="Delete account" variant="danger" onPress={handleDelete} />
    
    </View>
</SafeAreaView>
);}


const styles = StyleSheet.create({
container: {flex: 1, padding: 24, justifyContent: 'center',},
buttons: {padding: 15, gap: 15}});