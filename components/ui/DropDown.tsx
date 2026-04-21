// Dropdown Component src: https://github.com/liptonzuma/React-Native-Dropdown/blob/main/components/DropDown.tsx
// Implementation guide src: https://www.youtube.com/watch?v=ZBetEZKFOyY
// pill-switch component src: https://www.youtube.com/watch?v=cgkZJ0kjaPM
// pill-switch guide src: https://github.com/chelseafarley/react-native-switch-demo/blob/master/App.js
// copilot conversation generating and utilising radio button component and metric entry: https://copilot.microsoft.com/shares/d4SXvyMHUNhS3QjfB2WzW

import { AntDesign, } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useRef, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

type OptionItem = {
  value: number;
  label: string;
  icon?: string;
};

interface DropDownProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  placeholder: string;
  defaultValue?: string;

}

export default function Dropdown({
  data,
  onChange,
  placeholder,
  defaultValue,

}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);
  
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  const [value, setValue] = useState(defaultValue || "");

  const buttonRef = useRef<View>(null);

  const [top, setTop] = useState(0);

  const onSelect = useCallback((item: OptionItem) => {
    onChange(item);
    setSelectedIcon(item.icon ?? null);
    setValue(item.label);
    setExpanded(false);
  }, []);




  return (
    <View ref={buttonRef}>
      
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => { 
          buttonRef.current?.measureInWindow((x, y, width, height) => {setTop(y + height);
                          setExpanded(true);});}}>


            <View style={styles.selectedRow}>
                {selectedIcon ? (
                 <Ionicons name={selectedIcon} size={18} style={{ marginRight: 8 }} />
                     ) : null}
             <Text style={styles.text}>{value || placeholder}</Text>
            </View>
      


        <AntDesign name={expanded ? "caret-up" : "caret-down"} />
      </TouchableOpacity>


      {expanded ? (
        <Modal visible={expanded} transparent>
          <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
            <View style={styles.backdrop}>
              <View
                style={[
                  styles.options,
                  {
                    top,
                  },
                ]}
              >
                <FlatList
                  keyExtractor={(item) => item.value.toString()}
                  data={data}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        style={styles.optionItem}
                         onPress={() => onSelect(item)}>

  <View style={styles.optionRow}>
    {item.icon ? (
      <Ionicons name={item.icon} size={18} style={{ marginRight: 8 }} />
    ) : null}
    <Text>{item.label}</Text>
  </View>
</TouchableOpacity>

                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  optionItem: {
    height: 40,
    justifyContent: "center",
  },
  separator: {
    height: 4,
  },
  options: {
    position: "absolute",
    // top: 53,
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderRadius: 6,
    maxHeight: 250,
  },
  text: {
    fontSize: 15,
    opacity: 0.8,
  },
  button: {
    height: 50,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  selectedRow: {
  flexDirection: "row",
  alignItems: "center",
},
optionRow: {
  flexDirection: "row",
  alignItems: "center",
},});
