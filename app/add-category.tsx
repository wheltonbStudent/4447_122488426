// skeletal remains of add-habits coming in clutch for speeding dev time Ho-Lee 
import ColourPicker from '@/components/ui/color-picker';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesContext, SessionContext } from './_layout';





export default function AddCategory() {
const router = useRouter();
const context = useContext(CategoriesContext);
const session = useContext(SessionContext);
const [name, setName] = useState('');
const [colour_Id, setColour_Id] = useState(0); // 0 = nothings picked yet
const [error, setError] = useState(false);


if (!context || !session?.currentUser) return null;
const { setCategories } = context;

const save_category = async () => {
if (!name || colour_Id === 0) {
    setError(true); // won't let you save without a name and colour picked
        return;}

setError(false);




await db.insert(categoriesTable).values({name, user_id: session.currentUser!.id, colour_id: colour_Id,});
const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.user_id, session.currentUser!.id));
    setCategories(rows);
    router.back();
};








return (
<SafeAreaView style={styles.safeArea}>

<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

<View style={styles.form}>


    <FormField label="Name" value={name} onChangeText={setName} />

        
    <ColourPicker selectedId={colour_Id} onSelect={setColour_Id} />


    </View>
            {error ? <Text style={styles.errorText}>please fill in all fields</Text> : null} 

            <PrimaryButton label="Save Category" onPress={save_category} />

            <View style={styles.backButton}>

            <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />

    </View>
</ScrollView>
</SafeAreaView>
);}





const styles = StyleSheet.create({

safeArea: { backgroundColor: '#F8FAFC', flex: 1, padding: 20,},
content:{paddingBottom: 24,},
form:{marginBottom: 6,},
backButton: { marginTop: 10,},
  
errorText:{ color: '#DC2626', fontSize: 13, marginBottom: 8,
},});