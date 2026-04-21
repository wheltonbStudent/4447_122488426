// thank god for ease of repeaet use 
import PrimaryButton from '@/components/ui/primary-button';
import { CATEGORY_COLORS } from '@/constants/category_palette';
import { db } from '@/db/client';
import { categories as categoriesTable, habits as habitsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesContext, Category, SessionContext } from '../_layout';


export default function CategoryDetail() {
const { id } = useLocalSearchParams<{ id: string }>();
const router = useRouter();
const context = useContext(CategoriesContext);
const session = useContext(SessionContext);
const [notification, setNotification] = useState('');

if (!context || !session?.currentUser) return null;

const { categories, setCategories } = context;
const category = categories.find((cat_to_find: Category) => cat_to_find.id === Number(id));

if (!category) return null;

// grabs the hex values for the current categories color
const colour_match = CATEGORY_COLORS.find((cat_to_find) => cat_to_find.id === category.colour_id);

// checks first and stops you from accidentally nuking all your habits if they are  still in this category
const delete_category = async () => {
const linked_habits = await db.select().from(habitsTable).where(eq(habitsTable.category_id, Number(id)));
if (linked_habits.length > 0) { 
  setNotification(`Can't delete "${category.name}" while there are still habits using it`); // nice luh popup so you know why it wont delete
    setTimeout(() => setNotification(''), 3000); // give the thing a lifespan so its not just sitting there for eternity
  return;}



// deleete function
await db.delete(categoriesTable).where(eq(categoriesTable.id, Number(id)));
const rows = await db.select().from(categoriesTable).where(eq(categoriesTable.user_id, session.currentUser!.id));
    setCategories(rows);
    router.back();
};








return (
<SafeAreaView style={styles.safeArea}>

{notification ? (
    <View style={styles.notificationBar}>
        
        <Text style={styles.notificationText}>{notification}</Text>
    
    </View>
) : null}


<View style={styles.headerRow}>
    <View style={[styles.colourDot, { backgroundColor: colour_match?.hex || '#999999' }]}/>
    <Text style={styles.name}>{category.name}</Text>
</View>


<PrimaryButton label="Edit" onPress={() => router.push({ pathname: '/category/[id]/edit', params: { id },})}/>

    <View style={styles.backButton}>
    <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
    </View>

    <View style={styles.buttonSpacing}>
    <PrimaryButton label="Delete" variant="danger" onPress={delete_category} />
    </View>

</SafeAreaView>
);}




const styles = StyleSheet.create({
safeArea: {flex: 1, padding: 20, },

headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 150,},

colourDot: { width: 20, height: 20, borderRadius: 10, marginRight: 10, },

name: { fontSize: 22, fontWeight: '600',},
  


notificationBar: { backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5', 
    borderWidth: 1, 
    padding: 10,
    marginBottom: 10,},


    notificationText: { color: '#7F1D1D', fontSize: 13,},


  buttonSpacing: { marginTop: 10,},
  
  backButton: { marginTop: 10,},
});