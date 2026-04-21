import ColourPicker from '@/components/ui/color-picker';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesContext, Category, SessionContext } from '../../_layout';




export default function EditCategory() {
const { id } = useLocalSearchParams<{ id: string }>();
const router = useRouter();
const context = useContext(CategoriesContext);
const session = useContext(SessionContext);
const [name, setName] = useState('');
const [colour_Id, setColour_Id] = useState(0);
const [error, setError] = useState(false);
const category = context?.categories.find((cat_to_find: Category) => cat_to_find.id === Number(id));


useEffect(() => { 
if (!category) return;
    setName(category.name);
    setColour_Id(category.colour_id);
}, [category]);



if (!context || !session?.currentUser || !category) return null;

const { setCategories } = context;


const save_changes = async () => {
if (!name || colour_Id === 0) {setError(true);
  return;}

setError(false);




await db.update(categoriesTable).set({name, colour_id: colour_Id,}).where(eq(categoriesTable.id, Number(id)));
const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.user_id, session.currentUser!.id));
    setCategories(rows);
    router.back();};





return (
<SafeAreaView style={styles.safeArea}>
<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    
    <View style={styles.form}>

    <FormField label="Name" value={name} onChangeText={setName} />
    <ColourPicker selectedId={colour_Id} onSelect={setColour_Id} />

    </View>

    {error ? <Text style={styles.errorText}>please fill in all fields</Text> : null}

    <PrimaryButton label="Save Changes" onPress={save_changes} />

    <View style={styles.backButton}>

    <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />

</View>
</ScrollView>
</SafeAreaView>
);}





const styles = StyleSheet.create({
safeArea: {backgroundColor: '#F8FAFC', flex: 1, padding: 20, },
  
content: { paddingBottom: 24, }, form: { marginBottom: 6, },

backButton: { marginTop: 10,},
  
errorText: { color: '#DC2626', fontSize: 13, marginBottom: 8,},
});

// 