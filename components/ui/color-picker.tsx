
import { CATEGORY_COLORS } from '@/constants/category_palette';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';



type Props = { selectedId: number;
onSelect: (id: number
) => void;
};



export default function ColourPicker({ selectedId, onSelect }: Props) {
return (
<View style={styles.container}>

<Text style={styles.label}>Colour</Text>

  <FlatList
    data={CATEGORY_COLORS}
    numColumns={4}
    keyExtractor={(item) => item.id.toString()}
    scrollEnabled={false}
    renderItem={({ item }) => (
      
      <Pressable
        onPress={() => onSelect(item.id)}
        style={[styles.colourBox, { backgroundColor: item.hex },
                selectedId === item.id ? 
                styles.selected : null,]}/>
)}/>

</View>
);
}



const styles = StyleSheet.create({
container: {marginBottom: 12,},

label: {color: '#334155', fontSize: 13, fontWeight: '600', marginBottom: 6,},

colourBox: { width: 48, height: 48, margin: 6,},

selected: { borderColor: '#000000', borderWidth: 3, },
});




















// genuinely end my suffering