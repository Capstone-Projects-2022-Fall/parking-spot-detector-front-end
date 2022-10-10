import { Text, View } from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} from "react-native";

export default function RegisterScreen() {
  return (
    <View
      style={styles.container}
      lightColor="#eee"
      darkColor="rgba(255,255,255,0.1)"
    >
      <Text> *Registration Screen*</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
