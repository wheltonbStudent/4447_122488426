// mostly ripped and repurposed from habits and sample project
import PrimaryButton from '@/components/ui/primary-button';
import { CATEGORY_COLORS } from '@/constants/category_palette';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoriesContext, SessionContext } from '../_layout';




export default function CategoriesScreen() {
const router = useRouter();
const context = useContext(CategoriesContext);
const session = useContext(SessionContext);

if (!context || !session?.currentUser) return null;

const { categories } = context;


// grabs the hex colour for whatever colour_id the category has
const get_colour = (colour_Id: number) => {
const match = CATEGORY_COLORS.find((colour_to_find) => colour_to_find.id === colour_Id);
    return match?.hex;};




return (
<SafeAreaView style={styles.safeArea}>


<PrimaryButton label="Create new" onPress={() => router.push({ pathname: '../add-category' })}/>


<ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {categories.length === 0 ? (
        
        <Text style={styles.emptyText}>No categories yet</Text>
            ) : (categories.map((category) => (
            
        <Pressable key={category.id} style={styles.card}
                onPress={() => router.push({ pathname: '../category/[id]', params: { id: category.id.toString() } })}>
            
            <View style={styles.cardRow}>
                
                <View style={[styles.colourDot, { backgroundColor: get_colour(category.colour_id) }]} />
                
                <Text style={styles.cardName}>{category.name}</Text>
            
            </View>
        </Pressable>
)))
}

</ScrollView>
</SafeAreaView>
);}





const styles = StyleSheet.create({

safeArea: {
backgroundColor: '#F8FAFC',
flex: 1,
paddingHorizontal: 18,
paddingTop: 10,},


listContent: {paddingBottom: 24, paddingTop: 14,},



emptyText: { color: '#475569', fontSize: 16, paddingTop: 8, textAlign: 'center', },
  

card: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, marginBottom: 12, padding: 14, },


cardRow: { flexDirection: 'row', alignItems: 'center', },
  

colourDot: { width: 20, height: 20, borderRadius: 10, marginRight: 10, },



cardName: { fontSize: 16, fontWeight: '600', color: '#111827', },
  

cardButtons: { flexDirection: 'row', gap: 8, marginTop: 10,},
});