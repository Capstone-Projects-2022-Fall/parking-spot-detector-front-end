import { Text, View} from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";

import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";
 
export default function LoginScreen() {
  const navigation = useNavigation(); 
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Parking Spot Detector</Text>

      <Image style={styles.image} source={require("../../assets/images/parking_logo.png")} />
      <Text> *Click login to go to the home page*</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          placeholderTextColor="#003f5c"
        />
      </View>
 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
        />
      </View>
      <TouchableHighlight style={styles.loginBtn} onPress={() => navigation.navigate("Root")}>
        <Text>Click to login</Text>
      </TouchableHighlight>
 
      <TouchableOpacity style={styles.forgot_button}>
        <Text >Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.register_button}>New User? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  title: { 
    fontSize: 30,
  },
 
  image: {
    width:"50%",
    resizeMode: "contain",
    // marginBottom: 40,
  },
 
  inputView: {
    backgroundColor: "#C19FDE",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 10,
    marginTop: 5,
 
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
     flex: 1,
    padding: 10,
    marginLeft: 20,
  },
 
  forgot_button: {
    height: 20,
    marginBottom: 10,
  },

  register_button: { 
    height: 30, 
    marginBottom: 10, 
    marginTop: 10, 
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: "#7059A3",
  },
});
